// src/components/admin/AdminLogin.jsx
import React, { useState } from "react";

const AdminLogin = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-brand">
          <div className="brand-seal">GDC</div>
          <h2>GDC Gulabad</h2>
          <p>Administration Portal</p>
        </div>

        <div className="admin-login-form">
          {error && (
            <div className="login-error">
              <i className="bi bi-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <i className="bi bi-envelope"></i> Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@college.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <i className="bi bi-lock"></i> Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? "" : "-slash"}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <i className="bi bi-box-arrow-in-right"></i>
              )}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>Secure admin access only</p>
          </div>
        </div>
      </div>

      <style>{`
        .admin-login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 20px; }
        .admin-login-container { width: 100%; max-width: 420px; }
        .admin-login-brand { text-align: center; margin-bottom: 32px; }
        .brand-seal { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-family: 'Georgia', serif; font-weight: 700; font-size: 28px; color: #fff; background: radial-gradient(circle at 30% 30%, #d3ac5c, #8a6a22); box-shadow: 0 8px 30px rgba(185, 139, 51, 0.3); }
        .admin-login-brand h2 { color: #fff; font-weight: 700; font-family: 'Lora', serif; margin-bottom: 4px; }
        .admin-login-brand p { color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
        .admin-login-form { background: #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .login-error { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; font-size: 0.875rem; display: flex; align-items: center; gap: 8px; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; color: rgba(255,255,255,0.7); font-size: 0.8rem; font-weight: 600; margin-bottom: 6px; }
        .form-group label i { margin-right: 8px; }
        .form-input { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.9rem; transition: all 0.2s; }
        .form-input:focus { outline: none; border-color: #B98B33; box-shadow: 0 0 0 3px rgba(185, 139, 51, 0.15); }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .password-input-wrapper { position: relative; }
        .password-input-wrapper .form-input { padding-right: 44px; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 4px; font-size: 1.1rem; }
        .password-toggle:hover { color: rgba(255,255,255,0.7); }
        .btn-login { width: 100%; padding: 14px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .btn-login:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(185, 139, 51, 0.3); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-footer { text-align: center; margin-top: 20px; color: rgba(255,255,255,0.3); font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
