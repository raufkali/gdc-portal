// src/admin/Settings/MediaManager.jsx
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert("File too large (max 15MB)");
      return;
    }
    setSaving(true);
    setUploadProgress(0);
    try {
      const result = await uploadToR2WithProgress(file, "media/", (p) =>
        setUploadProgress(p),
      );
      setForm({ ...form, url: result.url, key: result.key });
      alert("✅ File uploaded!");
    } catch (error) {
      alert("❌ Upload failed: " + error.message);
    } finally {
      setSaving(false);
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
            <input
              name="date"
              placeholder="Date (e.g. June 2024)"
              value={form.date}
              onChange={handleChange}
              className="form-control"
            />
            <input
              type="file"
              accept={form.type === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="form-control"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div style={{ width: uploadProgress + "%" }}></div>
              </div>
            )}
            {form.url && <p className="success">✅ File ready</p>}
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
              disabled={saving || !form.url}
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
        .form-control { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; margin-bottom: 10px; }
        .form-control:focus { outline: none; border-color: #B98B33; }
        .btn-save { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .progress-bar { width: 100%; height: 6px; background: #e2e8f0; border-radius: 4px; margin-bottom: 10px; overflow: hidden; }
        .progress-bar div { height: 100%; background: linear-gradient(90deg, #B98B33, #d4a345); transition: width 0.3s; }
        .success { color: #059669; font-size: 0.85rem; margin-bottom: 10px; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .media-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .media-preview { width: 100%; height: 160px; object-fit: cover; }
        .media-info { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; }
        .media-title { font-weight: 500; color: #0f172a; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 4px 6px; cursor: pointer; }
        .btn-delete:hover { color: #ef4444; }
        .loading { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-state { text-align: center; padding: 40px; background: #fff; border-radius: 12px; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default MediaManager;
