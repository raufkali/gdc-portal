// src/components/admin/results/ResultForm.jsx
import React, { useState } from "react";
import { uploadToCloudinary } from "../../../cloudinary";

const ResultForm = ({
  onSubmit,
  onCancel,
  loading,
  uploadProgress,
  setUploadProgress,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "Computer Science",
    session: "2022-2026",
    semester: "1st Semester",
    file: null,
    publicId: "",
  });

  const departments = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
  ];
  const sessions = [
    "2022-2026",
    "2023-2027",
    "2024-2028",
    "2025-2029",
    "2026-2030",
  ];
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are accepted.");
      e.target.value = "";
      return;
    }

    try {
      const result = await uploadToCloudinary(file, "results", (progress) =>
        setUploadProgress(progress),
      );
      setFormData((prev) => ({
        ...prev,
        file: result.url,
        publicId: result.publicId,
      }));
    } catch (error) {
      alert("Failed to upload PDF to Cloudinary.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="result-form-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h5>Upload Result Ledger</h5>
          <button className="modal-close" onClick={onCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Ledger Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Computer Science Internal Marks Fall 2024-25"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Session *</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                required
              >
                {sessions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Semester *</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>PDF File *</label>
            <div className="file-upload-area">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                required
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="file-label">
                <i className="bi bi-cloud-upload"></i>
                <span>
                  {formData.file ? "PDF uploaded ✓" : "Click to upload PDF"}
                </span>
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span>{uploadProgress}%</span>
                </div>
              )}
              {formData.file && uploadProgress === 100 && (
                <div className="upload-success">
                  <i className="bi bi-check-circle-fill"></i> Uploaded to
                  Cloudinary!
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !formData.file}
            >
              {loading ? <span className="spinner-sm"></span> : null}
              {loading ? "Uploading..." : "Upload Result"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .result-form-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); }
        .modal-content { position: relative; background: #fff; border-radius: 16px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; background: #fff; z-index: 1; }
        .modal-header h5 { font-weight: 700; color: #0f172a; margin: 0; font-family: 'Lora', serif; }
        .modal-close { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 4px; }
        .modal-close:hover { color: #0f172a; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; color: #0f172a; font-size: 0.85rem; margin-bottom: 4px; }
        .form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; transition: all 0.2s ease; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #B98B33; box-shadow: 0 0 0 3px rgba(185, 139, 51, 0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .file-upload-area { border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; transition: all 0.2s ease; }
        .file-upload-area:hover { border-color: #B98B33; }
        .file-upload-area input[type="file"] { display: none; }
        .file-label { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #64748b; }
        .file-label i { font-size: 2rem; color: #B98B33; }
        .upload-progress { margin-top: 12px; background: #f1f5f9; border-radius: 6px; height: 24px; position: relative; overflow: hidden; }
        .upload-progress .progress-bar { height: 100%; background: linear-gradient(90deg, #B98B33, #d4a345); transition: width 0.3s ease; border-radius: 6px; }
        .upload-progress span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.75rem; font-weight: 600; color: #0f172a; }
        .upload-success { margin-top: 12px; padding: 8px 12px; background: #d1fae5; color: #059669; border-radius: 6px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e2e8f0; position: sticky; bottom: 0; background: #fff; }
        .btn-cancel { padding: 10px 24px; background: transparent; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-cancel:hover { background: #f1f5f9; }
        .btn-submit { padding: 10px 24px; background: linear-gradient(135deg, #B98B33, #8a6a22); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } .modal-footer { flex-direction: column; } .btn-cancel, .btn-submit { width: 100%; justify-content: center; } }
      `}</style>
    </div>
  );
};

export default ResultForm;
