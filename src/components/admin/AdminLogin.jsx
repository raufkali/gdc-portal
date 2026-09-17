import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { formatFirebaseError } from "../../contexts/NotificationContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  const { login, resetPassword, authError } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/admin");
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    if (!forgotEmail) {
      setForgotError("Please provide your registered email address.");
      return;
    }
    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess("Password reset instructions have been sent to your email.");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess("");
        setForgotEmail("");
      }, 3500);
    } catch (err) {
      setForgotError(formatFirebaseError(err));
    } finally {
      setForgotLoading(false);
    }
  };

  const displayError = authError || error;

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #A51C30 0%, #7A1523 50%, #1A1A1A 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div className="container col-12 col-lg-8" style={{ maxWidth: "560px" }}>
        {/* Login Card */}
        <div
          className="card shadow-lg border-0"
          style={{
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <div className="card-body p-4 p-md-5">
            {/* Logo / Brand */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  background: "linear-gradient(135deg, #A51C30, #7A1523)",
                  width: "100px",
                  height: "100px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "2px solid var(--color-primary-dark, #7A1523)",
                }}
              >
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings?.brandName || "Logo"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      const parent = e.target.parentElement;
                      const icon = document.createElement("i");
                      icon.className = "bi bi-shield-lock fs-1 text-white";
                      parent.appendChild(icon);
                    }}
                  />
                ) : (
                  <i className="bi bi-shield-lock fs-1 text-white"></i>
                )}
              </div>
              <h3
                className="fw-bold"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#1A1A1A",
                }}
              >
                {settings?.brandName || "GDC Gulabad"}
              </h3>
              <p className="text-muted small">Staff & Admin Portal Login</p>
            </div>

            {/* Error Alert */}
            {displayError && (
              <div
                className="alert alert-danger d-flex align-items-center"
                style={{
                  borderRadius: "10px",
                  borderLeft: "4px solid #A51C30",
                  fontSize: "0.85rem",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                <div>{displayError}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="input-group">
                  <span
                    className="input-group-text border-0"
                    style={{
                      background: "#f8f9fa",
                      color: "#A51C30",
                    }}
                  >
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-0"
                    style={{
                      background: "#f8f9fa",
                      padding: "0.75rem 1rem",
                    }}
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <span
                    className="input-group-text border-0"
                    style={{
                      background: "#f8f9fa",
                      color: "#A51C30",
                    }}
                  >
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-0"
                    style={{
                      background: "#f8f9fa",
                      padding: "0.75rem 1rem",
                    }}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: "#A51C30", fontSize: "0.82rem", fontWeight: "500" }}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="btn w-100 py-2 fw-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #A51C30, #7A1523)",
                  borderRadius: "50px",
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>

              <div className="row text-center pt-4">
                <Link
                  to="/"
                  style={{
                    color: "#A51C30",
                    textDecoration: "none",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-3">
          <small style={{ color: "rgba(255,255,255,0.6)" }}>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.brandName || "GDC Gulabad"}. All rights reserved.
          </small>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1060,
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
            <div
              className="modal-content shadow-lg border-0"
              style={{ borderRadius: "16px", backgroundColor: "#ffffff" }}
            >
              <div className="modal-body p-4 p-md-5 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "rgba(165, 28, 48, 0.1)",
                    color: "#A51C30",
                  }}
                >
                  <i className="bi bi-key fs-2"></i>
                </div>
                <h5
                  className="fw-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Reset Your Password
                </h5>
                <p className="text-muted small mb-3">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>

                {forgotSuccess && (
                  <div className="alert alert-success small text-start mb-3">
                    <i className="bi bi-check-circle-fill me-1"></i> {forgotSuccess}
                  </div>
                )}
                {forgotError && (
                  <div className="alert alert-danger small text-start mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> {forgotError}
                  </div>
                )}

                <form onSubmit={handleForgotPassword}>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your registered email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      disabled={forgotLoading}
                      style={{ borderRadius: "10px", padding: "0.6rem 1rem" }}
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      type="button"
                      className="btn px-4"
                      onClick={() => setShowForgotModal(false)}
                      disabled={forgotLoading}
                      style={{
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        borderColor: "#E5E5E5",
                        background: "transparent",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn px-4 text-white"
                      disabled={forgotLoading}
                      style={{
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        backgroundColor: "#A51C30",
                        borderColor: "#A51C30",
                      }}
                    >
                      {forgotLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
