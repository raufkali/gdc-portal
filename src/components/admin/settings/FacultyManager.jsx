// src/admin/settings/FacultyManager.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { uploadToR2WithProgress } from "../../cloudflare";
const FacultyManager = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dept: "",
    qualification: "",
    experience: "",
    email: "",
    url: "",
    bio: "",
    office: "",
  });

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "faculty"), orderBy("name"));
      const snap = await getDocs(q);
      setFaculty(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading faculty:", error);
    } finally {
      setLoading(false);
    }
  };

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
        "faculty/",
        (progress) => setUploadProgress(Math.round(progress)),
      );
      setForm({ ...form, url: result.url });
      alert("✅ Photo uploaded successfully!");
    } catch (error) {
      alert("❌ Upload failed: " + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "faculty"), {
        ...form,
        url:
          form.url ||
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowForm(false);
      setForm({
        name: "",
        dept: "",
        qualification: "",
        experience: "",
        email: "",
        url: "",
        bio: "",
        office: "",
      });
      loadFaculty();
      alert("✅ Faculty member added!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "faculty", id));
      loadFaculty();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="list-header">
        <h5>Faculty Members</h5>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + {showForm ? "Cancel" : "Add Teacher"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="name"
                placeholder="Name *"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
              <input
                name="dept"
                placeholder="Department *"
                value={form.dept}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-row">
              <input
                name="qualification"
                placeholder="Qualification *"
                value={form.qualification}
                onChange={handleChange}
                className="form-control"
                required
              />
              <input
                name="experience"
                placeholder="Experience *"
                value={form.experience}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-row">
              <input
                name="email"
                placeholder="Email *"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                required
              />

              {/* ✅ PHOTO UPLOAD */}
              <div className="file-upload-wrapper">
                <label className="file-upload-label">
                  <i className="bi bi-camera"></i>
                  {form.url ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="file-input"
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div style={{ width: uploadProgress + "%" }}></div>
                    </div>
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                )}
                {form.url && !uploading && (
                  <span className="upload-success">✅ Photo uploaded</span>
                )}
              </div>
            </div>
            <div className="form-row">
              <input
                name="bio"
                placeholder="Bio"
                value={form.bio}
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="office"
                placeholder="Office Location"
                value={form.office}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Add Faculty"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : faculty.length === 0 ? (
        <div className="empty-state">No faculty members yet.</div>
      ) : (
        <div className="faculty-grid">
          {faculty.map((f) => (
            <div key={f.id} className="faculty-card">
              <img
                src={
                  f.url ||
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                }
                alt={f.name}
                className="faculty-avatar"
              />
              <div className="faculty-info">
                <h6>{f.name}</h6>
                <span className="dept">{f.dept}</span>
                <span className="qual">{f.qualification}</span>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDelete(f.id, f.name)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .list-header h5 { font-weight: 700; color: #0f172a; margin: 0; font-family: 'Lora', serif; }
        .btn-primary { padding: 8px 16px; background: linear-gradient(135deg, #B98B33, #8a6a22); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(185,139,51,0.3); }
        .form-card { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .form-control { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; width: 100%; }
        .form-control:focus { outline: none; border-color: #B98B33; }
        .btn-save { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .faculty-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .faculty-card { background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .faculty-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .faculty-info { flex: 1; min-width: 0; }
        .faculty-info h6 { font-weight: 600; color: #0f172a; margin: 0; font-size: 0.95rem; }
        .faculty-info .dept { display: block; font-size: 0.75rem; color: #B98B33; font-weight: 600; }
        .faculty-info .qual { display: block; font-size: 0.7rem; color: #94a3b8; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 6px; cursor: pointer; }
        .btn-delete:hover { color: #ef4444; }
        .loading { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-state { text-align: center; padding: 40px; background: #fff; border-radius: 12px; color: #94a3b8; }
        
        /* File Upload Styles */
        .file-upload-wrapper { display: flex; flex-direction: column; gap: 6px; }
        .file-upload-label { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f1f5f9; border-radius: 8px; cursor: pointer; font-size: 0.85rem; color: #475569; border: 1px solid #e2e8f0; }
        .file-upload-label:hover { background: #e2e8f0; }
        .file-input { display: none; }
        .upload-progress { display: flex; align-items: center; gap: 12px; }
        .progress-bar { flex: 1; height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .progress-bar div { height: 100%; background: linear-gradient(90deg, #B98B33, #d4a345); transition: width 0.3s; }
        .progress-text { font-size: 0.75rem; color: #94a3b8; min-width: 40px; }
        .upload-success { font-size: 0.8rem; color: #059669; }
        
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default FacultyManager;
