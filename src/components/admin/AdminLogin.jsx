import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #A51C30 0%, #7A1523 50%, #1A1A1A 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div className="container col-12 col-lg-8">
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
                  border: "2px solid var(--color-primary-dark)",
                }}
              >
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings?.brandName || "Logo"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      // Show fallback icon on error
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
              <p className="text-muted small">Admin Login</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                className="alert alert-danger d-flex align-items-center"
                style={{
                  borderRadius: "10px",
                  borderLeft: "4px solid #A51C30",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
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
                  />
                </div>
              </div>

              <div className="mb-4">
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
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 py-2 fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #A51C30, #7A1523)",
                  color: "#fff",
                  borderRadius: "50px",
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(165, 28, 48, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(165, 28, 48, 0.3)";
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </>
                )}
              </button>

              <div className="row text-center pt-3">
                <Link
                  to="/"
                  style={{
                    color: "#A51C30",
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#7A1523";
                    e.target.style.transform = "translateX(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#A51C30";
                    e.target.style.transform = "translateX(0)";
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
          <small style={{ color: "rgba(255,255,255,0.5)" }}>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.brandName || "GDC Gulabad"}. All rights reserved.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
