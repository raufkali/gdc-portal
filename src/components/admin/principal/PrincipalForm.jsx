// src/components/admin/principal/PrincipalForm.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";

const PrincipalForm = ({ principal, onUpdate, pushToast }) => {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    message: "",
    vision: "",
    mission: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (principal) {
      setFormData({
        name: principal.name || "",
        qualification: principal.qualification || "",
        message: principal.message || "",
        vision: principal.vision || "",
        mission: principal.mission || "",
        photo: principal.photo || "",
      });
    }
  }, [principal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "principal", "main");
      await setDoc(
        docRef,
        {
          ...formData,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      pushToast("Principal's desk updated successfully!");
      onUpdate();
    } catch (error) {
      pushToast("Failed to update principal's desk.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="principal-form">
      <div className="form-card">
        <div className="form-card-header">
          <h5>
            <i className="bi bi-person-badge"></i> Principal Desk Settings
          </h5>
          <p>
            Update the principal's profile and message displayed on the website
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Principal Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. M. Aslam Khan"
              />
            </div>
            <div className="form-group">
              <label>Qualifications</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="PhD in Education Management"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Photo URL</label>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label>Welcome Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Welcome message from the principal..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vision</label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                placeholder="Institutional vision..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Mission</label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Institutional mission..."
                rows="3"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : null}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <style>{`
        .principal-form { width: 100%; }
        .form-card { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .form-card-header { margin-bottom: 24px; }
        .form-card-header h5 { font-weight: 700; color: #0f172a; font-family: 'Lora', serif; margin-bottom: 4px; }
        .form-card-header h5 i { color: #B98B33; margin-right: 8px; }
        .form-card-header p { color: #94a3b8; font-size: 0.875rem; margin: 0; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; color: #0f172a; font-size: 0.85rem; margin-bottom: 4px; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; transition: all 0.2s ease; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #B98B33; box-shadow: 0 0 0 3px rgba(185, 139, 51, 0.1); }
        .form-group textarea { resize: vertical; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .btn-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner-sm { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default PrincipalForm;
