import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExamResult() {
  // Filter Selection States
  const [semester, setSemester] = useState('1st Semester');
  const [department, setDepartment] = useState('Computer Science');
  const [session, setSession] = useState('2022-2026');
  
  // Data and UI Loading States
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch published ledgers matching the current selected filters
  const fetchResultLedgers = async () => {
    setLoading(true);
    setError('');
    try {
      // Send selected semester as a URL parameter to the router gateway
      const response = await axios.get(`http://localhost:5000/api/results/semester/${semester}`);
      
      if (response.data.success) {
        // Filter the results further by department and session on the client side for maximum accuracy
        const filteredData = response.data.data.filter(item => 
          item.department.toLowerCase() === department.trim().toLowerCase() &&
          item.session.trim() === session.trim()
        );
        setLedgers(filteredData);
      }
    } catch (err) {
      console.error("Student result viewer retrieval crash:", err);
      setError("Failed to look up academic records. Please ensure your backend server gateway is active.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically refresh the ledger lists whenever any select filters shift
  useEffect(() => {
    fetchResultLedgers();
  }, [semester, department, session]);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 my-4 bg-white" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="d-flex align-items-center mb-3">
        <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3 text-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-file-earmark-text-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4.5 11a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4.5 6a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </div>
        <h5 className="fw-bold text-dark mb-0">Academic Notice Board & Results</h5>
      </div>

      <p className="text-muted small mb-4">
        Select your timeline details below to access, print, or download official college transcript sheets and internal examination marks ledgers.
      </p>

      {/* Filter Parameters Row Control Panel */}
      <div className="row g-3 mb-4 bg-light p-3 rounded-3 mx-0">
        <div className="col-md-4">
          <label className="form-label small fw-bold text-secondary">Department</label>
          <select className="form-select rounded-3" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label small fw-bold text-secondary">Choose Semester</label>
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

        <div className="col-md-4">
          <label className="form-label small fw-bold text-secondary">Session Batch</label>
          <select className="form-select rounded-3" value={session} onChange={(e) => setSession(e.target.value)}>
            <option value="2022-2026">2022-2026</option>
            <option value="2023-2027">2023-2027</option>
            <option value="2024-2028">2024-2028</option>
            <option value="2025-2029">2025-2029</option>
            <option value="2026-2030">2026-2030</option>
            <option value="2027-2031">2027-2031</option>
            <option value="2028-2032">2028-2032</option>

          </select>
        </div>
      </div>

      {/* Output Render State Engine */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Searching academic databases...</span>
          </div>
          <p className="text-muted small mt-2 mb-0">Retrieving official ledger publications...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger py-2 small fw-medium rounded-3">{error}</div>
      ) : ledgers.length === 0 ? (
        <div className="text-center py-5 border rounded-3 border-dashed bg-light bg-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-folder-x text-muted mb-2" viewBox="0 0 16 16">
            <path d="M.5 3 .04 4.355A1 1 0 0 0 1 5.5h14a1 1 0 0 0 .96-1.145L15.5 3H.5zM15 6H1v7.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V6zM2 4h12V3H2v1zM6.854 8.146 8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 1 1 .708-.708z"/>
          </svg>
          <h6 className="fw-bold text-secondary mb-1">No Result File Found</h6>
          <p className="text-muted small mb-0 px-3">No matching exam result sheets have been published yet for this specific selection.</p>
        </div>
      ) : (
        <div className="list-group rounded-3">
          {ledgers.map((doc) => (
            <div 
              key={doc._id} 
              className="list-group-item list-group-item-action d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 mb-2 border rounded-3 shadow-sm bg-white"
            >
              <div className="mb-2 mb-sm-0">
                <h6 className="fw-bold mb-1 text-dark text-capitalize">{doc.title}</h6>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10 py-1 px-2 small">{doc.semester}</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 py-1 px-2 small">{doc.department}</span>
                  <small className="text-muted small">Updated: {new Date(doc.updatedAt).toLocaleDateString()}</small>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                {/* Opens the PDF on a separate web viewer tab canvas */}
                <a 
                  href={`http://localhost:5000${doc.pdfUrl}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline-primary btn-sm fw-bold px-3 py-1.5 rounded-2"
                >
                  👁️ View File
                </a>
                {/* Forces a direct browser hardware download save */}
                <a 
                  href={`http://localhost:5000${doc.pdfUrl}`} 
                  className="btn btn-primary btn-sm fw-bold px-3 py-1.5 rounded-2"
                  download
                >
                  📥 Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamResult;