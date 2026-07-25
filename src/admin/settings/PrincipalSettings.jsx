// src/admin/settings/PrincipalSettings.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const PrincipalSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    qualification: "",
    message: "",
    vision: "",
    mission: "",
    photo: "",
  });

  useEffect(() => {
    const loadPrincipal = async () => {
      try {
        const docRef = doc(db, "principal", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        }
      } catch (error) {
        console.error("Error loading principal:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPrincipal();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "principal", "main"), {
        ...form,
        updatedAt: serverTimestamp(),
      });
      alert("✅ Principal info saved!");
    } catch (error) {
      alert("❌ Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="settings-card">
      <h5 className="section-title">Principal's Desk</h5>
      <p className="section-desc">
        This content appears on the homepage and about page.
      </p>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Qualifications</label>
          <input
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Photo URL</label>
          <input
            name="photo"
            value={form.photo}
            onChange={handleChange}
            className="form-control"
            placeholder="https://..."
          />
        </div>
        <div className="form-group">
          <label>Welcome Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="form-control"
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Vision</label>
          <textarea
            name="vision"
            value={form.vision}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          />
        </div>
        <div className="form-group">
          <label>Mission</label>
          <textarea
            name="mission"
            value={form.mission}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          />
        </div>
        <button type="submit" className="btn-save" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <style>{`
        .settings-card { background: #fff; border-radius: 12px; padding: 24px; max-width: 640px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .section-title { font-weight: 700; color: #0f172a; margin-bottom: 4px; font-family: 'Lora', serif; }
        .section-desc { color: #94a3b8; font-size: 0.875rem; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; color: #0f172a; font-size: 0.85rem; margin-bottom: 4px; }
        .form-control { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; }
        .form-control:focus { outline: none; border-color: #B98B33; }
        textarea.form-control { resize: vertical; font-family: inherit; }
        .btn-save { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
        .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(185,139,51,0.3); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .loading { text-align: center; padding: 40px; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default PrincipalSettings;
