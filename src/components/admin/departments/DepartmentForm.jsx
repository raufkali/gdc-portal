// src/components/admin/departments/DepartmentForm.jsx
import React, { useState } from "react";

const DepartmentForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      hod: "",
      description: "",
      courses: "",
    },
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="dept-form-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h5>{initialData ? "Edit Department" : "Add New Department"}</h5>
          <button className="modal-close" onClick={onCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Department Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label>HOD Name *</label>
            <input
              type="text"
              name="hod"
              value={formData.hod}
              onChange={handleChange}
              placeholder="Dr. Ahmad Khan"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Department description..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Programs (comma separated)</label>
            <input
              type="text"
              name="courses"
              value={formData.courses}
              onChange={handleChange}
              placeholder="BSCS, MCS, PhD"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spinner-sm"></span> : null}
              {initialData ? "Update Department" : "Create Department"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .dept-form-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); }
        .modal-content { position: relative; background: #fff; border-radius: 16px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; background: #fff; z-index: 1; }
        .modal-header h5 { font-weight: 700; color: #0f172a; margin: 0; font-family: 'Lora', serif; }
        .modal-close { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 4px; }
        .modal-close:hover { color: #0f172a; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; color: #0f172a; font-size: 0.85rem; margin-bottom: 4px; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; transition: all 0.2s ease; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #B98B33; box-shadow: 0 0 0 3px rgba(185, 139, 51, 0.1); }
        .form-group textarea { resize: vertical; font-family: inherit; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e2e8f0; position: sticky; bottom: 0; background: #fff; }
        .btn-cancel { padding: 10px 24px; background: transparent; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-cancel:hover { background: #f1f5f9; }
        .btn-submit { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .modal-footer { flex-direction: column; } .btn-cancel, .btn-submit { width: 100%; justify-content: center; } }
      `}</style>
    </div>
  );
};

export default DepartmentForm;
