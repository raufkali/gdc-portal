import React, { useState, useRef } from 'react';
import axios from 'axios';

function AdminResultUpload() {
  // Form State Elements
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('1st Semester');
  const [department, setDepartment] = useState('Computer Science');
  const [session, setSession] = useState('2022-2026');
  const [file, setFile] = useState(null);
  
  // Interface Status Indicators
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  // Reference hook to reset the HTML file input element layout cleanly
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
      setIsError(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setIsError(true);
      setMessage("Please attach an official academic PDF transcript sheet first.");
      return;
    }

    // Packing values into a multipart FormData package
    const formData = new FormData();
    formData.append('resultPdf', file);
    formData.append('title', title.trim());
    formData.append('semester', semester);
    formData.append('department', department.trim());
    formData.append('session', session.trim());

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.post('http://localhost:5000/api/results/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setIsError(false);
        setMessage(`🎉 ${response.data.message || 'Ledger deployed successfully!'}`);
        
        // Reset volatile state elements cleanly
        setTitle('');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      console.error("Admin upload sub-module crash:", err);
      setIsError(true);
      setMessage(`Upload Error: ${err.response?.data?.message || "Could not publish document metadata onto server."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 my-4 bg-white" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
            <path d="M8 2a5.5 5.5 0 0 0-5.437 5.05A4 4 0 0 0 1 11.5c0 1.922 1.578 3.5 3.5 3.5h9c1.922 0 3.5-1.578 3.5-3.5a4.002 4.002 0 0 0-3.063-3.95A5.5 5.5 0 0 0 8 2zM7.5 7.414V11a.5.5 0 0 0 1 0V7.414l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 7.414z"/>
          </svg>
        </div>
        <h5 className="fw-bold text-dark mb-0">Publish Academic Transcript Sheets</h5>
      </div>

      <p className="text-muted small mb-4">
        Upload the official internal or final examination marks ledger. Students will be able to look up, stream, and save the original document by selecting their matching academic timeline parameters.
      </p>

      <form onSubmit={handleUploadSubmit}>
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">Document Title</label>
          <input 
            type="text" 
            className="form-control rounded-3" 
            placeholder="e.g., Computer science internal marks fall 2024,25" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold text-secondary">Target Semester</label>
            <select className="form-select rounded-3" value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="3rd Semester">3rd Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
              <option value="6th Semester">6th Semester</option>
              <option value="7th Semester">7th Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold text-secondary">Academic Session</label>
            <input 
              type="text" 
              className="form-control rounded-3" 
              placeholder="e.g., 2022-2026" 
              value={session}
              onChange={(e) => setSession(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">Department Scope</label>
          <input 
            type="text" 
            className="form-control rounded-3" 
            placeholder="e.g., Computer Science" 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required 
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold text-secondary">Select Result Document (PDF)</label>
          <input 
            type="file" 
            className="form-control rounded-3" 
            accept=".pdf" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            required 
          />
          <div className="form-text xsmall text-muted">Only standardized application/pdf extensions are processed.</div>
        </div>

        <button type="submit" className="btn btn-primary fw-bold w-100 py-2 rounded-3 shadow-sm" disabled={loading}>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center">
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span>Publishing and Uploading to Disk Storage...</span>
            </div>
          ) : (
            "Publish Transcript Ledger"
          )}
        </button>
      </form>

      {message && (
        <div className={`alert mt-3 py-2 small fw-medium rounded-3 ${isError ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AdminResultUpload;