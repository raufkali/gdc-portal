// src/admin/Posts/NoticeManager.jsx
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

const NoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "General",
    details: "",
    extraDetails: "",
    fileUrl: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "announcements"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "announcements"), {
        ...form,
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowForm(false);
      setForm({
        title: "",
        category: "General",
        details: "",
        extraDetails: "",
        fileUrl: "",
        imageUrl: "",
      });
      loadNotices();
      alert("✅ Notice published!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      loadNotices();
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
        <h5>Notices</h5>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + {showForm ? "Cancel" : "New Notice"}
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
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-control"
            >
              <option>General</option>
              <option>Admission</option>
              <option>Exams</option>
              <option>Events</option>
              <option>Holidays</option>
            </select>
            <textarea
              name="details"
              placeholder="Details *"
              value={form.details}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
            <textarea
              name="extraDetails"
              placeholder="Extra Details (optional)"
              value={form.extraDetails}
              onChange={handleChange}
              className="form-control"
              rows="2"
            />
            <input
              name="fileUrl"
              placeholder="File URL (optional)"
              value={form.fileUrl}
              onChange={handleChange}
              className="form-control"
            />
            <input
              name="imageUrl"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={handleChange}
              className="form-control"
            />
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Publishing..." : "Publish Notice"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : notices.length === 0 ? (
        <div className="empty-state">No notices yet.</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Title</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td>
                    <span className="badge">{n.category}</span>
                  </td>
                  <td>{n.title}</td>
                  <td>{n.date}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(n.id, n.title)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        .table-container { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; text-align: left; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
        .admin-table tr:hover { background: #f8fafc; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; background: #e2e8f0; color: #475569; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 6px 8px; cursor: pointer; }
        .btn-delete:hover { color: #ef4444; }
        .loading { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-state { text-align: center; padding: 40px; background: #fff; border-radius: 12px; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default NoticeManager;
