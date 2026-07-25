// src/admin/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect handled by parent component
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="login-brand">
          <div className="brand-seal">GDC</div>
          <h2>GDC Gulabad</h2>
          <p>Admin Portal</p>
        </div>

        <div className="login-form">
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          padding: 20px;
        }
        .admin-login-container { width: 100%; max-width: 400px; }
        .login-brand { text-align: center; margin-bottom: 32px; }
        .brand-seal {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          font-family: 'Georgia', serif; font-weight: 700; font-size: 28px;
          color: #fff;
          background: radial-gradient(circle at 30% 30%, #d3ac5c, #8a6a22);
          box-shadow: 0 8px 30px rgba(185,139,51,0.3);
        }
        .login-brand h2 { color: #fff; font-weight: 700; margin-bottom: 4px; }
        .login-brand p { color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
        .login-form { background: #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .login-error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; font-size: 0.875rem; }
        .form-input { width: 100%; padding: 12px 14px; margin-bottom: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.9rem; }
        .form-input:focus { outline: none; border-color: #B98B33; }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .btn-login { width: 100%; padding: 14px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; }
        .btn-login:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(185,139,51,0.3); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default Login;
