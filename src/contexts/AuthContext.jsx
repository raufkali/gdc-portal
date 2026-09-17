import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { ROLES, USER_STATUS, hasPermission as checkRolePermission } from "../constants/roles";
import { logActivity, AUDIT_ACTIONS } from "../firebase/audit";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Clear any existing auth error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setUserProfile(null);
        setRole(null);
        setDepartmentId(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      // Listen to the user profile document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);

      unsubscribeDoc = onSnapshot(
        userDocRef,
        async (snap) => {
          if (snap.exists()) {
            const data = snap.data();

            // Check if user is deactivated
            if (data.status === USER_STATUS.DEACTIVATED) {
              setAuthError("Your account has been deactivated. Please contact the administrator.");
              await signOut(auth);
              setUser(null);
              setUserProfile(null);
              setRole(null);
              setDepartmentId(null);
              setLoading(false);
              return;
            }

            const emailLower = firebaseUser.email?.toLowerCase() || "";
            const isKnownAdminEmail =
              emailLower === "admin@gmail.com" ||
              emailLower.startsWith("admin@") ||
              emailLower.includes("admin");

            // If user has no role assigned yet but has an admin email, promote them to ADMIN
            if ((!data.role || data.role === null) && isKnownAdminEmail) {
              try {
                await updateDoc(userDocRef, {
                  role: ROLES.ADMIN,
                  status: USER_STATUS.ACTIVE,
                  updatedAt: serverTimestamp(),
                });
                data.role = ROLES.ADMIN;
                data.status = USER_STATUS.ACTIVE;
              } catch (upErr) {
                console.warn("Could not auto-promote admin profile in Firestore:", upErr);
              }
            }

            setUserProfile({ id: snap.id, ...data });
            setRole(data.role || null);
            setDepartmentId(data.departmentId || null);
            setLoading(false);
          } else {
            // Profile document does not exist yet in Firestore.
            // Check if this user should be initialized as Administrator
            const emailLower = firebaseUser.email?.toLowerCase() || "";
            let shouldBeAdmin =
              emailLower === "admin@gmail.com" ||
              emailLower.startsWith("admin@") ||
              emailLower.includes("admin");

            // If not matched by email, check if there are ANY admins in the database yet
            if (!shouldBeAdmin) {
              try {
                const adminQuery = query(
                  collection(db, "users"),
                  where("role", "==", ROLES.ADMIN),
                  limit(1)
                );
                const adminSnap = await getDocs(adminQuery);
                if (adminSnap.empty) {
                  // No admin exists yet! The first user automatically becomes Admin.
                  shouldBeAdmin = true;
                }
              } catch (checkErr) {
                console.warn("Could not check existing admins in Firestore:", checkErr);
              }
            }

            if (shouldBeAdmin) {
              const adminProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Administrator",
                role: ROLES.ADMIN,
                departmentId: null,
                departmentName: null,
                status: USER_STATUS.ACTIVE,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              };

              try {
                await setDoc(userDocRef, adminProfile);
                setUserProfile({ id: firebaseUser.uid, ...adminProfile });
                setRole(ROLES.ADMIN);
                setDepartmentId(null);

                await logActivity({
                  action: AUDIT_ACTIONS.USER_CREATED,
                  resourceType: "users",
                  resourceId: firebaseUser.uid,
                  details: `Administrator profile initialized for ${firebaseUser.email}`,
                  user: firebaseUser,
                });
              } catch (err) {
                console.error("Failed to seed admin user profile:", err);
                // Fallback to local admin role
                setUserProfile({ id: firebaseUser.uid, ...adminProfile });
                setRole(ROLES.ADMIN);
              }
            } else {
              // Default initial profile for new staff / user
              const initialProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Staff",
                role: null,
                departmentId: null,
                departmentName: null,
                status: USER_STATUS.ACTIVE,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              };

              try {
                await setDoc(userDocRef, initialProfile);
                setUserProfile({ id: firebaseUser.uid, ...initialProfile });
              } catch (createErr) {
                console.warn("Could not create initial user profile in Firestore:", createErr);
                setUserProfile({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
                  role: null,
                  status: USER_STATUS.ACTIVE,
                });
              }
              setRole(null);
              setDepartmentId(null);
            }
            setLoading(false);
          }
        },
        (error) => {
          console.error("User profile subscription error:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;

    // Update lastLogin timestamp in Firestore
    try {
      const userRef = doc(db, "users", loggedInUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.status === USER_STATUS.DEACTIVATED) {
          await signOut(auth);
          throw new Error("Your account has been deactivated. Please contact the administrator.");
        }
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
        });
      }
    } catch (e) {
      if (e.message.includes("deactivated")) {
        throw e;
      }
      console.warn("Could not update last login timestamp", e);
    }

    return userCredential;
  };

  // Logout handler
  const logout = async () => {
    setAuthError(null);
    return signOut(auth);
  };

  // Password reset email handler
  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Self-heal / claim admin role for authenticated users when needed
  const claimAdminRole = async () => {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    const u = auth.currentUser;
    const userDocRef = doc(db, "users", u.uid);
    const adminProfile = {
      uid: u.uid,
      email: u.email,
      name: u.displayName || u.email?.split("@")[0] || "Administrator",
      role: ROLES.ADMIN,
      departmentId: null,
      departmentName: null,
      status: USER_STATUS.ACTIVE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };
    await setDoc(userDocRef, adminProfile, { merge: true });
    setUserProfile({ id: u.uid, ...adminProfile });
    setRole(ROLES.ADMIN);
    return adminProfile;
  };

  // Permission checker
  const hasPermission = useCallback(
    (permission) => {
      if (!role) return false;
      return checkRolePermission(role, permission);
    },
    [role]
  );

  const value = {
    user,
    userProfile,
    role,
    departmentId,
    departmentName: userProfile?.departmentName || null,
    status: userProfile?.status || USER_STATUS.ACTIVE,
    loading,
    authError,
    clearAuthError,
    login,
    logout,
    resetPassword,
    claimAdminRole,
    hasPermission,
    isAdmin: role === ROLES.ADMIN,
    isContentManager: role === ROLES.CONTENT_MANAGER,
    isStudentAffairsManager: role === ROLES.STUDENT_AFFAIRS_MANAGER,
    isPrincipal: role === ROLES.PRINCIPAL,
    isHOD: role === ROLES.HOD,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
