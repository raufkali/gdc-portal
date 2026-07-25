// src/admin/settings/MediaManager.jsx
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
import { uploadToR2WithProgress, deleteFromR2 } from "../../cloudflare";

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "image",
    category: "campus",
    date: "Recent",
    description: "",
    url: "",
    key: "",
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMedia(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = form.type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for image
    if (file.size > maxSize) {
      alert(`File too large. Max ${form.type === "video" ? "50MB" : "10MB"}`);
      e.target.value = "";
      return;
    }

    const validTypes =
      form.type === "video"
        ? ["video/mp4", "video/webm", "video/ogg"]
        : ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!validTypes.includes(file.type)) {
      alert(`Please select a valid ${form.type} file`);
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToR2WithProgress(file, "media/", (progress) =>
        setUploadProgress(Math.round(progress)),
      );
      setForm({ ...form, url: result.url, key: result.key });
      alert("✅ File uploaded successfully!");
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
    if (!form.url) return alert("Please upload a file first");
    setSaving(true);
    try {
      await addDoc(collection(db, "media"), {
        ...form,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowForm(false);
      setForm({
        title: "",
        type: "image",
        category: "campus",
        date: "Recent",
        description: "",
        url: "",
        key: "",
      });
      loadMedia();
      alert("✅ Media added!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, key) => {
    if (!confirm("Delete this media?")) return;
    try {
      await deleteDoc(doc(db, "media", id));
      if (key) await deleteFromR2(key);
      loadMedia();
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
        <h5>Media Gallery</h5>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + {showForm ? "Cancel" : "Add Media"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Title *"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />

            <div className="form-row">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="form-control"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-control"
              >
                <option value="campus">Campus</option>
                <option value="events">Events</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <input
              name="date"
              placeholder="Date (e.g. June 2024)"
              value={form.date}
              onChange={handleChange}
              className="form-control"
            />

            {/* ✅ FILE UPLOAD */}
            <div className="file-upload-area">
              <p className="file-hint">
                {form.type === "image"
                  ? "Upload Image (JPG, PNG, GIF)"
                  : "Upload Video (MP4, WebM)"}
              </p>
              <input
                type="file"
                accept={form.type === "image" ? "image/*" : "video/*"}
                onChange={handleFileUpload}
                className="file-input"
                id="media-upload"
                disabled={uploading}
              />
              <label htmlFor="media-upload" className="file-label">
                <i className="bi bi-cloud-upload"></i>
                {uploading ? `Uploading ${uploadProgress}%...` : "Choose File"}
              </label>
              {uploading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                  <div style={{ width: uploadProgress + "%" }}></div>
                </div>
              )}
              {form.url && !uploading && (
                <span className="upload-success">✅ File uploaded</span>
              )}
            </div>

            <textarea
              name="description"
              placeholder="Description *"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              rows="2"
              required
            />

            <button
              type="submit"
              className="btn-save"
              disabled={saving || !form.url || uploading}
            >
              {saving ? "Saving..." : "Add Media"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : media.length === 0 ? (
        <div className="empty-state">No media yet.</div>
      ) : (
        <div className="media-grid">
          {media.map((m) => (
            <div key={m.id} className="media-card">
              {m.type === "video" ? (
                <video
                  src={m.url}
                  className="media-preview"
                  muted
                  playsInline
                />
              ) : (
                <img src={m.url} className="media-preview" alt={m.title} />
              )}
              <div className="media-info">
                <span className="media-title">{m.title}</span>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(m.id, m.key)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
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
        .form-control { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; margin-bottom: 10px; }
        .form-control:focus { outline: none; border-color: #B98B33; }
        .btn-save { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .media-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .media-preview { width: 100%; height: 160px; object-fit: cover; }
        .media-info { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; }
        .media-title { font-weight: 500; color: #0f172a; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 4px 6px; cursor: pointer; }
        .btn-delete:hover { color: #ef4444; }
        .loading { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-state { text-align: center; padding: 40px; background: #fff; border-radius: 12px; color: #94a3b8; }
        
        /* File Upload */
        .file-upload-area { border: 2px dashed #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 10px; }
        .file-upload-area:hover { border-color: #B98B33; }
        .file-hint { font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; }
        .file-input { display: none; }
        .file-label { display: inline-block; padding: 8px 20px; background: #f1f5f9; border-radius: 8px; cursor: pointer; color: #475569; font-weight: 600; }
        .file-label:hover { background: #e2e8f0; }
        .file-label i { margin-right: 8px; }
        .progress-bar { width: 100%; height: 6px; background: #e2e8f0; border-radius: 4px; margin-top: 8px; overflow: hidden; }
        .progress-bar div { height: 100%; background: linear-gradient(90deg, #B98B33, #d4a345); transition: width 0.3s; }
        .upload-success { font-size: 0.8rem; color: #059669; display: block; margin-top: 6px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default MediaManager;
