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

            setUserProfile({ id: snap.id, ...data });
            setRole(data.role || null);
            setDepartmentId(data.departmentId || null);
            setLoading(false);
          } else {
            // Profile document does not exist yet.
            // Check if this is the primary/seed administrator
            const isSeedAdmin =
              firebaseUser.email?.toLowerCase() === "admin@gmail.com";

            if (isSeedAdmin) {
              const adminProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || "Administrator",
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
                  details: "Initial Administrator profile seeded automatically",
                  user: firebaseUser,
                });
              } catch (err) {
                console.error("Failed to seed admin user profile:", err);
                // Fallback to local admin role
                setRole(ROLES.ADMIN);
              }
            } else {
              // Default fallback for any user without a role doc
              setUserProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
                role: null,
                status: USER_STATUS.ACTIVE,
              });
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
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
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
