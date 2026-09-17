import { useState, useEffect } from "react";
import { secondaryAuth, db } from "../../../firebase/config";
import { createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { ROLES, ROLE_LABELS, USER_STATUS } from "../../../constants/roles";
import { logActivity, AUDIT_ACTIONS } from "../../../firebase/audit";
import { useNotification, formatFirebaseError } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { invalidateCache } from "../../../firebase/db";

const UserModal = ({ isOpen, onClose, onUserSaved, editingUser = null }) => {
  const { user: currentAdmin } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.CONTENT_MANAGER,
    departmentId: "",
    departmentName: "",
    sendResetEmail: true,
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const isEditing = !!editingUser;

  // Fetch departments for HOD selection
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        const snap = await getDocs(collection(db, "departments"));
        const list = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name || d.id,
        }));
        setDepartments(list);
      } catch (err) {
        console.warn("Failed to fetch departments list:", err);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  // Initialize form data
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        email: editingUser.email || "",
        password: "",
        role: editingUser.role || ROLES.CONTENT_MANAGER,
        departmentId: editingUser.departmentId || "",
        departmentName: editingUser.departmentName || "",
        sendResetEmail: false,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: ROLES.CONTENT_MANAGER,
        departmentId: "",
        departmentName: "",
        sendResetEmail: true,
      });
    }
    setFormError("");
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      departmentId: newRole === ROLES.HOD ? prev.departmentId : "",
      departmentName: newRole === ROLES.HOD ? prev.departmentName : "",
    }));
  };

  const handleDepartmentChange = (deptId) => {
    const selectedDept = departments.find((d) => d.id === deptId);
    setFormData((prev) => ({
      ...prev,
      departmentId: deptId,
      departmentName: selectedDept ? selectedDept.name : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Full name is required.");
      return;
    }

    if (formData.role === ROLES.HOD && !formData.departmentId) {
      setFormError("Please assign a department for the HOD role.");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        // Update existing user profile
        const userRef = doc(db, "users", editingUser.id || editingUser.uid);
        const updateData = {
          name: formData.name.trim(),
          role: formData.role,
          departmentId: formData.role === ROLES.HOD ? formData.departmentId : null,
          departmentName: formData.role === ROLES.HOD ? formData.departmentName : null,
          updatedAt: serverTimestamp(),
        };

        await updateDoc(userRef, updateData);
        invalidateCache("users", editingUser.id || editingUser.uid);

        await logActivity({
          action: AUDIT_ACTIONS.USER_UPDATED,
          resourceType: "users",
          resourceId: editingUser.id || editingUser.uid,
          details: `Updated user profile for ${formData.name} (${formData.role})`,
          user: currentAdmin,
        });

        showSuccess(`User "${formData.name}" updated successfully.`);
        onUserSaved();
        onClose();
      } else {
        // Create new user using secondaryAuth to avoid logging out the current admin
        if (!formData.email.trim()) {
          setFormError("Email address is required.");
          setLoading(false);
          return;
        }

        if (!formData.password || formData.password.length < 6) {
          setFormError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        // Create auth account on secondaryApp
        const userCred = await createUserWithEmailAndPassword(
          secondaryAuth,
          formData.email.trim(),
          formData.password
        );
        const newUid = userCred.user.uid;

        // Immediately sign out the secondary auth session
        await signOut(secondaryAuth);

        // Create user document in Firestore
        const newProfile = {
          uid: newUid,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          departmentId: formData.role === ROLES.HOD ? formData.departmentId : null,
          departmentName: formData.role === ROLES.HOD ? formData.departmentName : null,
          status: USER_STATUS.ACTIVE,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: null,
        };

        await setDoc(doc(db, "users", newUid), newProfile);
        invalidateCache("users", newUid);

        // Optionally send password reset email so the user can set their own credentials
        if (formData.sendResetEmail) {
          try {
            await sendPasswordResetEmail(secondaryAuth, formData.email.trim());
          } catch (resetErr) {
            console.warn("Could not send initial reset email:", resetErr);
          }
        }

        await logActivity({
          action: AUDIT_ACTIONS.USER_CREATED,
          resourceType: "users",
          resourceId: newUid,
          details: `Created new user ${formData.name} with role ${formData.role}`,
          user: currentAdmin,
        });

        showSuccess(`User "${formData.name}" created successfully.`);
        onUserSaved();
        onClose();
      }
    } catch (err) {
      console.error("User save error:", err);
      setFormError(formatFirebaseError(err));
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1055,
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "520px" }}>
        <div
          className="modal-content shadow-lg border-0"
          style={{
            borderRadius: "16px",
            backgroundColor: "var(--card-bg, #ffffff)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="modal-header border-bottom px-4 py-3"
            style={{
              borderColor: "var(--color-border, #E5E5E5)",
              backgroundColor: "rgba(165, 28, 48, 0.03)",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(165, 28, 48, 0.1)",
                  color: "#A51C30",
                }}
              >
                <i className={`bi ${isEditing ? "bi-person-gear" : "bi-person-plus"} fs-6`}></i>
              </div>
              <h5
                className="modal-title fw-bold mb-0"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.2rem",
                  color: "var(--color-text, #333333)",
                }}
              >
                {isEditing ? "Edit User Account" : "Create New User"}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {formError && (
                <div
                  className="alert alert-danger d-flex align-items-center small mb-3"
                  style={{ borderRadius: "10px", borderLeft: "4px solid #A51C30" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                  <div>{formError}</div>
                </div>
              )}

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text border" style={{ background: "var(--color-bg-alt, #f8f9fa)" }}>
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Prof. Tariq Mahmood"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                    style={{ borderRadius: "0 8px 8px 0" }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Email Address <span className="text-danger">*</span>
                  {isEditing && <span className="text-muted ms-1">(Cannot be changed)</span>}
                </label>
                <div className="input-group">
                  <span className="input-group-text border" style={{ background: "var(--color-bg-alt, #f8f9fa)" }}>
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. user@gdcgulabad.edu.pk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading || isEditing}
                    style={{ borderRadius: "0 8px 8px 0" }}
                  />
                </div>
              </div>

              {/* Password (Only for new user) */}
              {!isEditing && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    Temporary Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text border" style={{ background: "var(--color-bg-alt, #f8f9fa)" }}>
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                      style={{ borderRadius: "0 8px 8px 0" }}
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    The user can change this anytime or use password recovery.
                  </small>
                </div>
              )}

              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Assigned Role <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={loading}
                  style={{ borderRadius: "8px", padding: "0.6rem 0.9rem" }}
                >
                  <option value={ROLES.CONTENT_MANAGER}>{ROLE_LABELS[ROLES.CONTENT_MANAGER]}</option>
                  <option value={ROLES.STUDENT_AFFAIRS_MANAGER}>{ROLE_LABELS[ROLES.STUDENT_AFFAIRS_MANAGER]}</option>
                  <option value={ROLES.PRINCIPAL}>{ROLE_LABELS[ROLES.PRINCIPAL]}</option>
                  <option value={ROLES.HOD}>{ROLE_LABELS[ROLES.HOD]}</option>
                  <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
                </select>
              </div>

              {/* Department Selection (If HOD) */}
              {formData.role === ROLES.HOD && (
                <div className="mb-3 p-3 rounded" style={{ background: "rgba(253, 126, 20, 0.08)", border: "1px solid rgba(253, 126, 20, 0.2)" }}>
                  <label className="form-label small fw-semibold mb-1" style={{ color: "#fd7e14" }}>
                    <i className="bi bi-building me-1"></i> Department Assignment <span className="text-danger">*</span>
                  </label>
                  {departmentsLoading ? (
                    <div className="text-muted small">Loading departments...</div>
                  ) : (
                    <select
                      className="form-select"
                      value={formData.departmentId}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      required
                      disabled={loading}
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="">-- Select Assigned Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <small className="text-muted mt-1 d-block" style={{ fontSize: "0.75rem" }}>
                    The HOD will be strictly restricted to managing this specific department only.
                  </small>
                </div>
              )}

              {/* Option to send password reset email on creation */}
              {!isEditing && (
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="sendResetEmailCheck"
                    checked={formData.sendResetEmail}
                    onChange={(e) => setFormData({ ...formData, sendResetEmail: e.target.checked })}
                    disabled={loading}
                  />
                  <label className="form-check-label small text-muted" htmlFor="sendResetEmailCheck">
                    Send password reset email to user immediately
                  </label>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="modal-footer border-top px-4 py-3 d-flex justify-content-end gap-2"
              style={{ borderColor: "var(--color-border, #E5E5E5)" }}
            >
              <button
                type="button"
                className="btn px-4"
                onClick={onClose}
                disabled={loading}
                style={{
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  borderColor: "var(--color-border, #E5E5E5)",
                  background: "transparent",
                  color: "var(--color-text, #333333)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn px-4 text-white d-inline-flex align-items-center"
                disabled={loading}
                style={{
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  backgroundColor: "#A51C30",
                  borderColor: "#A51C30",
                  boxShadow: "0 4px 12px rgba(165, 28, 48, 0.3)",
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {isEditing ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditing ? "bi-check2" : "bi-person-plus"} me-2`}></i>
                    {isEditing ? "Save Changes" : "Create Account"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
