// src/admin/Settings/DepartmentManager.jsx
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

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    hod: "",
    description: "",
    courses: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "departments"), orderBy("name"));
      const snap = await getDocs(q);
      setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const courses = form.courses
        ? form.courses
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];
      await addDoc(collection(db, "departments"), {
        name: form.name,
        hod: form.hod,
        description: form.description,
        courses: courses,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowForm(false);
      setForm({ name: "", hod: "", description: "", courses: "" });
      loadDepartments();
      alert("✅ Department added!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "departments", id));
      loadDepartments();
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
        <h5>Departments</h5>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + {showForm ? "Cancel" : "Add Department"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Department Name *"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              required
            />
            <input
              name="hod"
              placeholder="HOD Name *"
              value={form.hod}
              onChange={handleChange}
              className="form-control"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              rows="2"
            />
            <input
              name="courses"
              placeholder="Courses (comma separated)"
              value={form.courses}
              onChange={handleChange}
              className="form-control"
            />
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Add Department"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : departments.length === 0 ? (
        <div className="empty-state">No departments yet.</div>
      ) : (
        <div className="department-grid">
          {departments.map((d) => (
            <div key={d.id} className="department-card">
              <div className="dept-header">
                <h6>{d.name}</h6>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(d.id, d.name)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <p className="hod">
                <strong>HOD:</strong> {d.hod}
              </p>
              <p className="desc">{d.description}</p>
              <div className="courses">
                {d.courses?.map((c, i) => (
                  <span key={i} className="course-tag">
                    {c}
                  </span>
                ))}
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
        .department-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .department-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .dept-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; }
        .dept-header h6 { font-weight: 700; color: #0f172a; margin: 0; font-size: 1rem; }
        .hod { font-size: 0.9rem; color: #475569; margin-bottom: 4px; }
        .desc { font-size: 0.85rem; color: #64748b; margin-bottom: 12px; }
        .courses { display: flex; flex-wrap: wrap; gap: 6px; }
        .course-tag { padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500; background: #f1f5f9; color: #475569; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 4px; cursor: pointer; }
        .btn-delete:hover { color: #ef4444; }
        .loading { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-state { text-align: center; padding: 40px; background: #fff; border-radius: 12px; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default DepartmentManager;
