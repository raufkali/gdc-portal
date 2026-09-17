import { useState, useEffect, useMemo } from "react";
import { db, auth } from "../../../firebase/config";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  ROLES,
  ROLE_LABELS,
  ROLE_BADGE_COLORS,
  USER_STATUS,
} from "../../../constants/roles";
import { logActivity, AUDIT_ACTIONS } from "../../../firebase/audit";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { invalidateCache } from "../../../firebase/db";
import UserModal from "./UserModal";

const UserManagement = () => {
  const { user: currentAdmin } = useAuth();
  const { showSuccess, showError, showConfirm } = useNotification();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Real-time users listener
  useEffect(() => {
    setLoading(true);
    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(
      usersRef,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        showError("Failed to fetch users list.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [showError]);

  // Fetch departments for department filter
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const snap = await getDocs(collection(db, "departments"));
        const list = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name || d.id,
        }));
        setDepartments(list);
      } catch (err) {
        console.warn("Error fetching departments for filter:", err);
      }
    };
    fetchDepts();
  }, []);

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Toggle user active / deactivated status
  const handleToggleStatus = (targetUser) => {
    const isCurrentlyActive = targetUser.status === USER_STATUS.ACTIVE;
    const actionWord = isCurrentlyActive ? "Deactivate" : "Reactivate";
    const nextStatus = isCurrentlyActive ? USER_STATUS.DEACTIVATED : USER_STATUS.ACTIVE;

    // Prevent self-deactivation
    if (targetUser.uid === currentAdmin?.uid || targetUser.id === currentAdmin?.uid) {
      showError("You cannot deactivate your own administrative account.");
      return;
    }

    showConfirm({
      title: `${actionWord} User Account?`,
      message: isCurrentlyActive
        ? `Are you sure you want to deactivate "${targetUser.name}"? They will be immediately blocked from signing in or modifying portal data.`
        : `Are you sure you want to reactivate "${targetUser.name}"? They will regain access according to their role.`,
      confirmText: actionWord,
      variant: isCurrentlyActive ? "danger" : "primary",
      onConfirm: async () => {
        const userRef = doc(db, "users", targetUser.id || targetUser.uid);
        await updateDoc(userRef, {
          status: nextStatus,
          updatedAt: serverTimestamp(),
        });
        invalidateCache("users", targetUser.id || targetUser.uid);

        await logActivity({
          action: isCurrentlyActive ? AUDIT_ACTIONS.USER_DEACTIVATED : AUDIT_ACTIONS.USER_ACTIVATED,
          resourceType: "users",
          resourceId: targetUser.id || targetUser.uid,
          details: `${actionWord}d account for ${targetUser.name} (${targetUser.email})`,
          user: currentAdmin,
        });

        showSuccess(`User "${targetUser.name}" has been ${actionWord.toLowerCase()}d.`);
      },
    });
  };

  // Send password reset email
  const handleSendPasswordReset = (targetUser) => {
    showConfirm({
      title: "Send Password Recovery Email?",
      message: `Send an official password reset link to "${targetUser.email}"?`,
      confirmText: "Send Reset Link",
      variant: "primary",
      onConfirm: async () => {
        await sendPasswordResetEmail(auth, targetUser.email);
        await logActivity({
          action: AUDIT_ACTIONS.PASSWORD_RESET_SENT,
          resourceType: "users",
          resourceId: targetUser.id || targetUser.uid,
          details: `Sent password reset email to ${targetUser.email}`,
          user: currentAdmin,
        });
        showSuccess(`Password recovery email sent to ${targetUser.email}.`);
      },
    });
  };

  // Permanent user deletion
  const handleDeleteUser = (targetUser) => {
    if (targetUser.uid === currentAdmin?.uid || targetUser.id === currentAdmin?.uid) {
      showError("You cannot delete your own administrative account.");
      return;
    }

    showConfirm({
      title: "Permanently Delete User Record?",
      message: `Warning: This permanently removes the profile for "${targetUser.name}". We recommend deactivating the account instead so historical audit records remain intact. Do you wish to continue?`,
      confirmText: "Delete Permanently",
      variant: "danger",
      onConfirm: async () => {
        const userRef = doc(db, "users", targetUser.id || targetUser.uid);
        await deleteDoc(userRef);
        invalidateCache("users", targetUser.id || targetUser.uid);

        await logActivity({
          action: AUDIT_ACTIONS.USER_DELETED,
          resourceType: "users",
          resourceId: targetUser.id || targetUser.uid,
          details: `Deleted user record for ${targetUser.name} (${targetUser.email})`,
          user: currentAdmin,
        });

        showSuccess(`User profile for "${targetUser.name}" deleted.`);
      },
    });
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !search ||
        u.name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.departmentName?.toLowerCase().includes(search);

      // Role filter
      const matchRole = roleFilter === "all" || u.role === roleFilter;

      // Department filter
      const matchDepartment =
        departmentFilter === "all" || u.departmentId === departmentFilter;

      // Status filter
      const matchStatus =
        statusFilter === "all" || (u.status || USER_STATUS.ACTIVE) === statusFilter;

      return matchSearch && matchRole && matchDepartment && matchStatus;
    });
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter]);

  // Summary counts
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => (u.status || USER_STATUS.ACTIVE) === USER_STATUS.ACTIVE).length;
    const deactivated = users.filter((u) => u.status === USER_STATUS.DEACTIVATED).length;
    const hods = users.filter((u) => u.role === ROLES.HOD).length;
    return { total, active, deactivated, hods };
  }, [users]);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "var(--color-text, #333333)" }}>
            <i className="bi bi-people-fill me-2" style={{ color: "#A51C30" }}></i>
            User Management
          </h4>
          <p className="text-muted small mb-0">
            Create, assign roles, and manage system accounts and department scopes
          </p>
        </div>
        <button
          className="btn text-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
          style={{
            backgroundColor: "#A51C30",
            borderRadius: "50px",
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px rgba(165, 28, 48, 0.3)",
            border: "none",
          }}
        >
          <i className="bi bi-person-plus-fill"></i>
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Total Accounts
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>
                    {stats.total}
                  </h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "rgba(165, 28, 48, 0.08)", color: "#A51C30" }}
                >
                  <i className="bi bi-people fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Active Users
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "#28a745" }}>
                    {stats.active}
                  </h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "rgba(40, 167, 69, 0.1)", color: "#28a745" }}
                >
                  <i className="bi bi-check-circle fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Deactivated
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "#6c757d" }}>
                    {stats.deactivated}
                  </h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "rgba(108, 117, 125, 0.1)", color: "#6c757d" }}
                >
                  <i className="bi bi-person-slash fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Department HODs
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "#fd7e14" }}>
                    {stats.hods}
                  </h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "rgba(253, 126, 20, 0.1)", color: "#fd7e14" }}
                >
                  <i className="bi bi-building fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)" }}
      >
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text border-0" style={{ background: "var(--color-bg-alt, #f8f9fa)", color: "#A51C30" }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search by name, email, or dept..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: "var(--color-bg-alt, #f8f9fa)", fontSize: "0.85rem" }}
                />
                {searchTerm && (
                  <button
                    className="btn border-0"
                    style={{ background: "var(--color-bg-alt, #f8f9fa)" }}
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x text-muted"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Role Filter */}
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <option value="all">All Roles</option>
                <option value={ROLES.ADMIN}>Administrator</option>
                <option value={ROLES.CONTENT_MANAGER}>Content Manager</option>
                <option value={ROLES.STUDENT_AFFAIRS_MANAGER}>Student Affairs Manager</option>
                <option value={ROLES.PRINCIPAL}>Principal</option>
                <option value={ROLES.HOD}>HOD</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{ fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-12 col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <option value="all">All Statuses</option>
                <option value={USER_STATUS.ACTIVE}>Active Only</option>
                <option value={USER_STATUS.DEACTIVATED}>Deactivated Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)", overflow: "hidden" }}
      >
        <div className="card-body p-0">
          {loading ? (
            <div className="p-5 text-center">
              <div className="spinner-border" style={{ color: "#A51C30" }} role="status">
                <span className="visually-hidden">Loading users...</span>
              </div>
              <p className="text-muted small mt-2">Loading user accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-people display-4 d-block mb-3" style={{ opacity: 0.3 }}></i>
              <h6 className="fw-semibold">No Users Found</h6>
              <p className="small mb-3">No user records matched your filter criteria.</p>
              {(searchTerm || roleFilter !== "all" || departmentFilter !== "all" || statusFilter !== "all") && (
                <button
                  className="btn btn-sm btn-outline-secondary rounded-pill"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setDepartmentFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                <thead style={{ backgroundColor: "var(--color-bg-alt, #f8f9fa)" }}>
                  <tr>
                    <th className="ps-4 py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>User</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Role</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Department</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Status</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold d-none d-lg-table-cell" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Created</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold d-none d-xl-table-cell" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Last Login</th>
                    <th className="pe-4 py-3 text-end text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item) => {
                    const roleBadge = ROLE_BADGE_COLORS[item.role] || {
                      bg: "rgba(108, 117, 125, 0.1)",
                      color: "#6c757d",
                      border: "#6c757d",
                    };
                    const isActive = (item.status || USER_STATUS.ACTIVE) === USER_STATUS.ACTIVE;
                    const isCurrentUser = item.uid === currentAdmin?.uid || item.id === currentAdmin?.uid;

                    return (
                      <tr key={item.id || item.uid} style={{ borderBottom: "1px solid var(--color-border, #E5E5E5)" }}>
                        {/* Name & Avatar */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                              style={{
                                width: "38px",
                                height: "38px",
                                background: "linear-gradient(135deg, #A51C30, #7A1523)",
                                fontSize: "0.85rem",
                              }}
                            >
                              {(item.name || item.email || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-bold" style={{ color: "var(--color-text, #333333)" }}>
                                {item.name || "Unnamed User"}
                                {isCurrentUser && (
                                  <span className="badge bg-secondary ms-2" style={{ fontSize: "0.6rem" }}>
                                    You
                                  </span>
                                )}
                              </div>
                              <small className="text-muted">{item.email}</small>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3">
                          <span
                            className="badge py-1 px-2"
                            style={{
                              backgroundColor: roleBadge.bg,
                              color: roleBadge.color,
                              border: `1px solid ${roleBadge.border}`,
                              borderRadius: "50px",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            {ROLE_LABELS[item.role] || item.role || "No Role"}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="py-3">
                          {item.role === ROLES.HOD ? (
                            <span className="fw-medium" style={{ color: "#fd7e14" }}>
                              <i className="bi bi-building me-1"></i>
                              {item.departmentName || item.departmentId || "Unassigned"}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3">
                          <span
                            className="badge py-1 px-2"
                            style={{
                              backgroundColor: isActive ? "rgba(40, 167, 69, 0.1)" : "rgba(108, 117, 125, 0.1)",
                              color: isActive ? "#28a745" : "#6c757d",
                              borderRadius: "50px",
                              fontSize: "0.72rem",
                              fontWeight: "500",
                            }}
                          >
                            <i className={`bi ${isActive ? "bi-check-circle-fill" : "bi-dash-circle-fill"} me-1`}></i>
                            {isActive ? "Active" : "Deactivated"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="py-3 text-muted d-none d-lg-table-cell">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Last Login */}
                        <td className="py-3 text-muted d-none d-xl-table-cell">
                          {formatDate(item.lastLogin)}
                        </td>

                        {/* Actions */}
                        <td className="pe-4 py-3 text-end">
                          <div className="d-inline-flex gap-1 align-items-center">
                            {/* Edit */}
                            <button
                              className="btn btn-sm btn-light text-primary rounded-circle"
                              style={{ width: "32px", height: "32px", padding: 0 }}
                              onClick={() => {
                                setEditingUser(item);
                                setShowModal(true);
                              }}
                              title="Edit User"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            {/* Send Password Reset */}
                            <button
                              className="btn btn-sm btn-light text-secondary rounded-circle"
                              style={{ width: "32px", height: "32px", padding: 0 }}
                              onClick={() => handleSendPasswordReset(item)}
                              title="Send Password Recovery Email"
                            >
                              <i className="bi bi-key"></i>
                            </button>

                            {/* Activate / Deactivate Toggle */}
                            {!isCurrentUser && (
                              <button
                                className={`btn btn-sm btn-light ${isActive ? "text-warning" : "text-success"} rounded-circle`}
                                style={{ width: "32px", height: "32px", padding: 0 }}
                                onClick={() => handleToggleStatus(item)}
                                title={isActive ? "Deactivate User" : "Activate User"}
                              >
                                <i className={`bi ${isActive ? "bi-person-slash" : "bi-person-check"}`}></i>
                              </button>
                            )}

                            {/* Permanent Delete */}
                            {!isCurrentUser && (
                              <button
                                className="btn btn-sm btn-light text-danger rounded-circle"
                                style={{ width: "32px", height: "32px", padding: 0 }}
                                onClick={() => handleDeleteUser(item)}
                                title="Delete User Permanently"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Create/Edit Modal */}
      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onUserSaved={() => {}}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;
