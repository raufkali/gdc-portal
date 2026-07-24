import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import jsPDF from "jspdf";
import Footer from "../page/Footer"; 

const Announcement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  
  // Track which notice IDs have their extra details expanded
  const [expandedNotices, setExpandedNotices] = useState({});

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/announcements");
        
        if (response.data && Array.isArray(response.data)) {
          setNotices(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setNotices(response.data.data);
        } else {
          setNotices([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error pulling announcements from cluster:", err.message);
        setError("Failed to stream announcements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const toggleExpand = (id) => {
    setExpandedNotices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredNotices = filter === "All" 
    ? notices 
    : notices.filter(n => n.category && n.category.toLowerCase() === filter.toLowerCase());

  const getCategoryColor = (cat) => {
    const colors = {
      exams: "#dc3545",
      admission: "#198754",
      events: "#0dcaf0",
      holidays: "#fd7e14",
      general: "#6c757d"
    };
    return colors[cat?.toLowerCase()] || "#0d6efd";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: "??", month: "UNK", year: "????" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: "??", month: "UNK", year: "????" };
    
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return { day, month, year };
  };

  const generateIndividualPDF = (notice) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("GDC GULABAD", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("OFFICIAL NOTICE BOARD", 105, 30, { align: "center" });
    
    doc.setTextColor(40);
    doc.setFontSize(12);
    const displayId = notice._id ? notice._id.substring(notice._id.length - 6).toUpperCase() : "DOC";
    const displayDate = notice.date ? new Date(notice.date).toLocaleDateString() : "N/A";

    doc.text(`Notification Ref: #GDC-${displayId}`, 20, 55);
    doc.text(`Issued Date: ${displayDate}`, 190, 55, { align: "right" });
    doc.line(20, 60, 190, 60);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(notice.title || "No Title Provided", 20, 75, { maxWidth: 170 });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Combine details and extra info for complete offline PDF backups
    const mainBody = notice.details || "";
    const extraBody = notice.extraDetails ? `\n\nAdditional Instructions:\n${notice.extraDetails}` : "";
    doc.text(mainBody + extraBody, 20, 95, { maxWidth: 170 });
    
    doc.save(`Notice_${displayId}.pdf`);
  };

  const categories = ["All", "General", "Exams", "Events", "Holidays", "Admission"];

  return (
    <div className="announcement-wrapper bg-light min-vh-100">
      {/* --- HERO HEADER --- */}
      <div className="notice-hero">
        <div className="container text-center">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase mb-3">
              <li className="breadcrumb-item"><a href="/" className="text-info text-decoration-none small">Home</a></li>
              <li className="breadcrumb-item active text-white opacity-50 small" aria-current="page">Notice Board</li>
            </ol>
          </nav>
          <h1 className="display-4 fw-bold text-white mb-2">Updates & <span className="text-info">Announcements</span></h1>
          <p className="lead text-white-50">Stay informed with the latest official notifications from GDC Gulabad.</p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container pb-5" style={{ marginTop: "-50px" }}>
        <div className="row g-4">
          
          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="filter-sidebar shadow-lg">
              <h6 className="section-title">Categories</h6>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`category-item ${filter === cat ? "active" : ""}`}
                  >
                    <span>{cat}</span>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="contact-box mt-4 p-4 rounded-4 shadow-sm bg-dark text-white">
              <h6 className="fw-bold mb-3">Need Help?</h6>
              <p className="small text-white-50">Contact the Registrar office for admission related queries.</p>
              <a href="mailto:info@gdcgulabad.edu.pk" className="btn btn-outline-info btn-sm w-100">Contact Us</a>
            </div>
          </div>

          {/* NOTICES LIST */}
          <div className="col-lg-9">
            <div className="d-flex flex-column gap-4">
              
              {loading ? (
                <div className="empty-state shadow-sm text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5>Streaming Announcements...</h5>
                </div>
              ) : error ? (
                <div className="empty-state shadow-sm text-center py-5 border border-danger border-opacity-25">
                  <i className="bi bi-exclamation-triangle display-3 text-danger mb-3"></i>
                  <h5 className="text-danger">{error}</h5>
                </div>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => {
                  const { day, month, year } = formatDate(notice.date);
                  const isExpanded = !!expandedNotices[notice._id];
                  
                  return (
                    <div key={notice._id} className="notice-card shadow-sm d-flex flex-column align-items-stretch">
                      
                      {/* Main notice card top section layout */}
                      <div className="d-flex gap-4 mobile-card-stack">
                        <div className="notice-date-box">
                          <span className="day">{day}</span>
                          <span className="month">{month}</span>
                          <span className="year">{year}</span>
                        </div>
                        
                        <div className="notice-body flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="category-tag" style={{ color: getCategoryColor(notice.category), backgroundColor: `${getCategoryColor(notice.category)}15` }}>
                              {notice.category || "General"}
                            </span>
                          </div>
                          <h5 className="notice-title">{notice.title}</h5>
                          <p className="notice-desc">{notice.details}</p>
                        </div>

                        {/* Interactive Actions Grid */}
                        <div className="notice-actions d-flex flex-column gap-2 align-self-start">
                          <button onClick={() => generateIndividualPDF(notice)} className="pdf-btn btn w-100">
                            <i className="bi bi-download me-2"></i> PDF
                          </button>
                          
                          {/* Render dynamic document view option if link exists */}
                          {notice.fileUrl && (
                            <a href={notice.fileUrl} target="_blank" rel="noreferrer" className="view-doc-btn btn btn-sm btn-outline-primary w-100 fw-bold">
                              <i className="bi bi-file-earmark-text me-1"></i> Official Doc
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Dropdown triggers for additional structured instructions */}
                      {notice.extraDetails && (
                        <div className="mt-3 pt-2 border-top border-light">
                          <button 
                            className="btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center gap-1 fw-bold text-secondary"
                            onClick={() => toggleExpand(notice._id)}
                          >
                            <span>{isExpanded ? "Hide Detailed Notices" : "View Full Instructions / Details"}</span>
                            <i className={`bi bi-chevron-${isExpanded ? "up" : "down"} small`}></i>
                          </button>
                          
                          {isExpanded && (
                            <div className="extra-details-panel mt-3 p-3 bg-light rounded-3 border-start border-primary border-3">
                              <h6 className="fw-bold text-dark small mb-2"><i className="bi bi-info-circle me-1"></i> Supplementary Details:</h6>
                              <p className="small text-muted mb-0 whitespace-prewrap">{notice.extraDetails}</p>
                              
                              {/* Display attached image preview if configured */}
                              {notice.imageUrl && (
                                <div className="notice-image-preview mt-3">
                                  <a href={notice.imageUrl} target="_blank" rel="noreferrer">
                                    <img 
                                      src={notice.imageUrl} 
                                      alt="Notice scan attachment" 
                                      className="img-fluid rounded border border-secondary border-opacity-25 shadow-sm max-h-300"
                                    />
                                  </a>
                                  <div className="text-muted small mt-1 italic"><i className="bi bi-zoom-in"></i> Click image to open high resolution scan</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })
              ) : (
                <div className="empty-state shadow-sm">
                  <i className="bi bi-megaphone display-1 text-light mb-3"></i>
                  <h5>No Notifications Found</h5>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />

      <style>{`
        .notice-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 100px 0 120px 0;
          text-align: center;
        }
        .filter-sidebar {
          background: white;
          border-radius: 16px;
          padding: 24px;
          position: sticky;
          top: 100px;
        }
        .section-title {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #94a3b8;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        .category-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #475569;
          font-weight: 600;
          transition: all 0.2s;
          text-align: left;
        }
        .category-item:hover { background: #f8fafc; color: #0d6efd; }
        .category-item.active { background: #0d6efd; color: white; box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2); }
        .notice-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #f1f5f9;
        }
        .notice-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .notice-date-box {
          background: #f8fafc;
          border-radius: 12px;
          min-width: 80px;
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
        }
        .notice-date-box .day { font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1; }
        .notice-date-box .month { font-size: 0.75rem; font-weight: 700; color: #64748b; }
        .notice-date-box .year { font-size: 0.65rem; color: #94a3b8; }
        .notice-title { font-weight: 700; color: #1e293b; margin-bottom: 8px; line-height: 1.4; }
        .notice-desc { color: #64748b; font-size: 0.9rem; margin-bottom: 0; }
        .category-tag {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .pdf-btn {
          background: #f1f5f9;
          border: none;
          color: #475569;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 10px 18px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .pdf-btn:hover { background: #0f172a; color: white; }
        .view-doc-btn {
          font-size: 0.75rem;
          padding: 8px 12px;
          border-radius: 10px;
        }
        .whitespace-prewrap {
          white-space: pre-wrap;
        }
        .max-h-300 {
          max-height: 300px;
          object-fit: contain;
        }
        .italic {
          font-style: italic;
        }
        .extra-details-panel {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .mobile-card-stack { flex-direction: column; gap: 16px; }
          .notice-date-box { flex-direction: row; height: auto; min-width: 100%; gap: 10px; padding: 10px; }
          .notice-actions { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Announcement;