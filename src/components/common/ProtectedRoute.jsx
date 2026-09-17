import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Unauthorized from "./Unauthorized";
import { USER_STATUS } from "../../constants/roles";

export const ProtectedRoute = ({
  children,
  allowedRoles = null,
  requiredPermission = null,
}) => {
  const { user, userProfile, role, status, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "var(--color-bg-alt, #F8F9FA)" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#A51C30", width: "3.2rem", height: "3.2rem", borderWidth: "0.25em" }}
        >
          <span className="visually-hidden">Authenticating...</span>
        </div>
        <p className="text-muted small mt-3 fw-medium">Verifying authorization...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Account deactivated
  if (status === USER_STATUS.DEACTIVATED) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role restrictions if specified
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Unauthorized />;
    }
  }

  // Check permission restrictions if specified
  if (requiredPermission) {
    if (!hasPermission(requiredPermission)) {
      return <Unauthorized />;
    }
  }

  return children;
};

export default ProtectedRoute;
