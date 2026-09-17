import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, userProfile, role, claimAdminRole, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [claiming, setClaiming] = useState(false);

  const handleClaimAdmin = async () => {
    setClaiming(true);
    try {
      await claimAdminRole();
      showSuccess("Administrator role granted successfully!");
      navigate("/admin");
    } catch (err) {
      showError("Failed to initialize administrator role: " + err.message);
    } finally {
      setClaiming(false);
    }
  };

  const hasNoRole = !role && !userProfile?.role;

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: "var(--color-bg-alt, #F8F9FA)" }}
    >
      <div className="container" style={{ maxWidth: "560px" }}>
        <div
          className="card border-0 shadow-lg text-center p-4 p-md-5"
          style={{
            borderRadius: "16px",
            backgroundColor: "var(--card-bg, #ffffff)",
          }}
        >
          {/* Shield Lock Icon */}
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: hasNoRole ? "rgba(255, 193, 7, 0.15)" : "rgba(165, 28, 48, 0.1)",
              color: hasNoRole ? "#d39e00" : "#A51C30",
            }}
          >
            <i className={`bi ${hasNoRole ? "bi-person-badge-fill" : "bi-shield-x"} fs-1`}></i>
          </div>

          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: hasNoRole ? "#d39e00" : "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {hasNoRole ? "Role Setup Required" : "Security Check"}
          </span>

          <h3
            className="fw-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "var(--color-text, #333333)",
            }}
          >
            {hasNoRole ? "No Role Assigned" : "Access Restricted"}
          </h3>

          {hasNoRole ? (
            <div className="text-start mt-3 mb-4 p-3 rounded" style={{ backgroundColor: "rgba(255, 193, 7, 0.08)", border: "1px solid rgba(255, 193, 7, 0.3)" }}>
              <p className="small mb-2" style={{ color: "#333" }}>
                Your account (<strong>{user?.email || "Authenticated User"}</strong>) exists in Firebase Authentication, but no role document was created for it in the database.
              </p>
              <p className="small mb-0 text-muted">
                If this is your main administrator account, click below to initialize yourself as <strong>Admin</strong>.
              </p>
            </div>
          ) : (
            <p
              className="text-muted small mb-4"
              style={{ lineHeight: "1.6" }}
            >
              You do not have permission to access this section. Your current role{" "}
              {userProfile?.role && (
                <span className="badge bg-secondary text-capitalize ms-1">
                  {userProfile.role.replace(/_/g, " ")}
                </span>
              )}{" "}
              is not authorized to view this resource. If you believe this is an error, please contact the administrator.
            </p>
          )}

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {hasNoRole ? (
              <>
                <button
                  onClick={handleClaimAdmin}
                  className="btn px-4 text-white"
                  disabled={claiming}
                  style={{
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    backgroundColor: "#A51C30",
                    borderColor: "#A51C30",
                    boxShadow: "0 4px 12px rgba(165, 28, 48, 0.3)",
                  }}
                >
                  {claiming ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Setting up Admin...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Initialize as Administrator
                    </>
                  )}
                </button>
                <button
                  onClick={() => logout()}
                  className="btn btn-outline-secondary px-4"
                  style={{ borderRadius: "50px", fontSize: "0.85rem" }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="btn px-4"
                  style={{
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    borderColor: "var(--color-border, #E5E5E5)",
                    color: "var(--color-text, #333333)",
                    background: "transparent",
                  }}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Go Back
                </button>

                <Link
                  to="/admin"
                  className="btn px-4 text-white"
                  style={{
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    backgroundColor: "#A51C30",
                    borderColor: "#A51C30",
                    boxShadow: "0 4px 12px rgba(165, 28, 48, 0.3)",
                    textDecoration: "none",
                  }}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
