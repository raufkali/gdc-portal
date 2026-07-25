// src/admin/settings/PrincipalSettings.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadToR2WithProgress } from "../../cloudflare";

const PrincipalSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be under 5MB");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToR2WithProgress(
        file,
        "principal/",
        (progress) => setUploadProgress(Math.round(progress)),
      );
      setForm({ ...form, photo: result.url });
      alert("✅ Photo uploaded successfully!");
    } catch (error) {
      alert("❌ Upload failed: " + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  };

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

        {/* ✅ PHOTO UPLOAD - REAL FILE UPLOAD */}
        <div className="form-group">
          <label>Photo</label>
          <div className="file-upload-area">
            {form.photo && (
              <div className="current-image">
                <img src={form.photo} alt="Current" className="preview-thumb" />
                <span className="current-label">Current Photo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="file-input"
              id="principal-photo"
              disabled={uploading}
            />
            <label htmlFor="principal-photo" className="file-label">
              <i className="bi bi-cloud-upload"></i>
              {uploading
                ? `Uploading ${uploadProgress}%...`
                : "Upload New Photo"}
            </label>
            {uploading && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div style={{ width: uploadProgress + "%" }}></div>
              </div>
            )}
          </div>
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
        <button
          type="submit"
          className="btn-save"
          disabled={saving || uploading}
        >
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
        
        /* File Upload Styles */
        .file-upload-area { border: 2px dashed #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
        .file-upload-area:hover { border-color: #B98B33; }
        .file-input { display: none; }
        .file-label { display: inline-block; padding: 8px 20px; background: #f1f5f9; border-radius: 8px; cursor: pointer; color: #475569; font-weight: 600; }
        .file-label:hover { background: #e2e8f0; }
        .file-label i { margin-right: 8px; }
        .current-image { display: flex; align-items: center; gap: 12px; justify-content: center; margin-bottom: 12px; }
        .preview-thumb { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
        .current-label { font-size: 0.75rem; color: #94a3b8; }
        .progress-bar { width: 100%; height: 6px; background: #e2e8f0; border-radius: 4px; margin-top: 8px; overflow: hidden; }
        .progress-bar div { height: 100%; background: linear-gradient(90deg, #B98B33, #d4a345); transition: width 0.3s; }
      `}</style>
    </div>
  );
};

export default PrincipalSettings;
