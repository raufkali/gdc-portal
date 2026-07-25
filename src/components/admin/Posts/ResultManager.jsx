// src/admin/Posts/ResultManager.jsx
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

const ResultManager = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "Computer Science",
    session: "2022-2026",
    semester: "1st Semester",
    file: null,
    key: "",
  });

  const departments = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Physics",
    "Chemistry",
    "Mathematics",
  ];
  const sessions = ["2022-2026", "2023-2027", "2024-2028", "2025-2029"];
  const semesters = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "results"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are accepted");
      e.target.value = "";
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("File too large. Maximum 15MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToR2WithProgress(
        file,
        "results/",
        (progress) => setUploadProgress(Math.round(progress)),
      );
      setForm({ ...form, file: result.url, key: result.key });
      alert("✅ PDF uploaded successfully!");
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
    if (!form.file) return alert("Please upload a PDF first");
    setSaving(true);
    try {
      await addDoc(collection(db, "results"), {
        title: form.title,
        department: form.department,
        session: form.session,
        semester: form.semester,
        pdfUrl: form.file,
        key: form.key,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowForm(false);
      setForm({
        title: "",
        department: "Computer Science",
        session: "2022-2026",
        semester: "1st Semester",
        file: null,
        key: "",
      });
      loadResults();
      alert("✅ Result uploaded!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, key) => {
    if (!confirm("Delete this result?")) return;
    try {
      await deleteDoc(doc(db, "results", id));
      if (key) await deleteFromR2(key);
      loadResults();
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
        <h5>Result Ledgers</h5>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + {showForm ? "Cancel" : "Upload Result"}
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
              name="department"
              value={form.department}
              onChange={handleChange}
              className="form-control"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div className="form-row">
              <select
                name="session"
                value={form.session}
                onChange={handleChange}
                className="form-control"
              >
                {sessions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="form-control"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ PDF UPLOAD */}
            <div className="file-upload-area">
              <p className="file-hint">Upload PDF (Max 15MB)</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="file-input"
                id="result-upload"
                disabled={uploading}
              />
              <label htmlFor="result-upload" className="file-label">
                <i className="bi bi-cloud-upload"></i>
                {uploading ? `Uploading ${uploadProgress}%...` : "Choose PDF"}
              </label>
              {uploading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                  <div style={{ width: uploadProgress + "%" }}></div>
                </div>
              )}
              {form.file && !uploading && (
                <span className="upload-success">✅ PDF uploaded</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-save"
              disabled={saving || !form.file || uploading}
            >
              {saving ? "Uploading..." : "Upload Result"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : results.length === 0 ? (
        <div className="empty-state">No results uploaded yet.</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Session</th>
                <th>Semester</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.department}</td>
                  <td>{r.session}</td>
                  <td>
                    <span className="badge">{r.semester}</span>
                  </td>
                  <td>
                    <a
                      href={r.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-view"
                    >
                      View
                    </a>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(r.id, r.key)}
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
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .btn-save { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .table-container { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; text-align: left; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
        .admin-table tr:hover { background: #f8fafc; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; background: #e2e8f0; color: #475569; }
        .btn-view { padding: 4px 10px; background: #e2e8f0; color: #475569; border-radius: 4px; text-decoration: none; font-size: 0.75rem; margin-right: 4px; }
        .btn-view:hover { background: #B98B33; color: #fff; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 6px 8px; cursor: pointer; }
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

export default ResultManager;
