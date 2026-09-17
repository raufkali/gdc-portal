import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: "var(--color-bg-alt, #F8F9FA)" }}
    >
      <div className="container" style={{ maxWidth: "520px" }}>
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
              backgroundColor: "rgba(165, 28, 48, 0.1)",
              color: "#A51C30",
            }}
          >
            <i className="bi bi-shield-x fs-1"></i>
          </div>

          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Security Check
          </span>

          <h3
            className="fw-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "var(--color-text, #333333)",
            }}
          >
            Access Restricted
          </h3>

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

          <div className="d-flex flex-wrap gap-2 justify-content-center">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
