import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function FacultyProfiles() {
  const [facultyData, setFacultyData] = useState([]);
  const [activeFaculty, setActiveFaculty] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- CONNECT TO BACKEND API ---
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/faculty");
        setFacultyData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching faculty data:", err);
        setError("Unable to load faculty profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <>
      <div className="bg-white min-vh-100">
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-4 d-flex align-items-center text-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 25, 47, 0.9), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat",
            minHeight: "350px"
          }}
        >
          <div className="container text-white mt-4">
            <h6 className="text-info text-uppercase fw-bold mb-2" style={{ letterSpacing: "2px", fontSize: "0.8rem" }}>Expert Faculty</h6>
            <h1 className="display-5 fw-bold mb-3">Dedicated <span className="text-info">Scholars</span></h1>
            <p className="small mx-auto opacity-75 mb-0" style={{ maxWidth: "600px" }}>
              Our faculty members bring years of experience and deep subject expertise to Govt Degree College Gulabad.
            </p>
          </div>
        </div>

        {/* --- DYNAMIC STATE HANDLING (LOADING / ERROR) --- */}
        <div className="container py-5 mt-5" style={{ marginTop: "-60px" }}>
          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-info" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading profiles...</span>
              </div>
              <p className="text-muted mt-3 fw-semibold">Loading faculty profiles from server...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center max-w-xl mx-auto border-2 rounded-3 shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              {error}
            </div>
          ) : facultyData.length === 0 ? (
            <div className="text-center my-5 py-4 bg-light rounded-3 shadow-sm border">
              <p className="text-secondary mb-0 fw-medium">No faculty profiles available at the moment.</p>
            </div>
          ) : (
            /* --- FACULTY GRID --- */
            <>
              <div className={`faculty-container ${showAll ? 'is-expanded' : 'is-collapsed'}`}>
                <div className="row g-4 justify-content-center">
                  {facultyData.map((faculty, index) => {
                    const isHidden = !showAll && index >= 3;
                    return (
                      <div 
                        key={faculty._id || faculty.id} 
                        className={`col-lg-4 col-md-6 faculty-anim-card ${isHidden ? 'card-off' : 'card-on'}`}
                        style={{ transitionDelay: isHidden ? '0s' : `${index * 0.1}s` }}
                      >
                        <div 
                          className="card h-100 border-0 shadow-lg faculty-card overflow-hidden" 
                          style={{ cursor: 'pointer', borderRadius: "20px" }}
                          onClick={() => setActiveFaculty(faculty)}
                        >
                          <div className="position-relative overflow-hidden" style={{ height: "320px" }}>
                            <img 
                              src={faculty.url || faculty.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"} 
                              alt={faculty.name} 
                              className="w-100 h-100 object-fit-cover transition-img" 
                            />
                            <div className="position-absolute top-0 start-0 m-3">
                              <span className="badge bg-info text-dark fw-bold px-3 py-2 rounded-pill shadow">
                                {faculty.dept}
                              </span>
                            </div>
                            <div className="faculty-overlay d-flex flex-column justify-content-end p-4 text-white">
                              <small className="text-info text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Exp. Level</small>
                              <span className="fw-semibold">{faculty.experience || "Senior Faculty"}</span>
                            </div>
                          </div>
                          <div className="card-body p-4 text-center">
                            <h5 className="fw-bold mb-1 text-dark">{faculty.name}</h5>
                            <span className="text-muted small fw-bold">{faculty.qualification}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- PROFESSIONAL TOGGLE BUTTON --- */}
              {facultyData.length > 3 && (
                <div className="text-center mt-5">
                  <button 
                    className={`pro-toggle-btn ${showAll ? 'active' : ''}`}
                    onClick={() => setShowAll(!showAll)}
                  >
                    <span className="pro-btn-text">
                      {showAll ? "Show Less" : `View All faculty members (${facultyData.length})`}
                    </span>
                    <div className="pro-btn-icon">
                       <i className={`bi bi-chevron-${showAll ? 'up' : 'down'}`}></i>
                    </div>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- DYNAMIC MODAL --- */}
        {activeFaculty && (
          <div className="landscape-modal-overlay">
            <div className="modal-backdrop-blur" onClick={() => setActiveFaculty(null)}></div>
            <div className="landscape-card animate-slide-up shadow-2xl border-0">
              <button className="close-btn" onClick={() => setActiveFaculty(null)}>&times;</button>
              
              <div className="row g-0">
                <div className="col-md-5">
                  <img 
                    src={activeFaculty.url || activeFaculty.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"} 
                    className="w-100 h-100 object-fit-cover" 
                    alt={activeFaculty.name} 
                    style={{ minHeight: "450px" }}
                  />
                </div>

                <div className="col-md-7 p-4 p-lg-5 bg-white d-flex flex-column justify-content-center text-start">
                  <div className="mb-3">
                    <h3 className="fw-bold text-dark mb-1">{activeFaculty.name}</h3>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-info-subtle text-info border border-info-subtle px-3">{activeFaculty.dept} Specialist</span>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-6 mb-3">
                      <small className="text-muted d-block fw-bold text-uppercase" style={{fontSize:'0.65rem'}}>Qualification</small>
                      <span className="text-dark fw-semibold">{activeFaculty.qualification}</span>
                    </div>
                    <div className="col-6 mb-3">
                      <small className="text-muted d-block fw-bold text-uppercase" style={{fontSize:'0.65rem'}}>Experience</small>
                      <span className="text-dark fw-semibold">{activeFaculty.experience || "10+ Years"}</span>
                    </div>
                    <div className="col-12">
                      <small className="text-muted d-block fw-bold text-uppercase" style={{fontSize:'0.65rem'}}>Office Location</small>
                      <span className="text-dark"><i className="bi bi-geo-alt-fill text-info me-1"></i>{activeFaculty.office || "Academic Block"}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-4 border-start border-info border-4">
                    <p className="text-secondary small fst-italic mb-0" style={{ lineHeight: '1.6' }}>
                      "{activeFaculty.bio || "Dedicated to academic excellence and nurturing the next generation of scholars."}"
                    </p>
                  </div>

                  <a href={`mailto:${activeFaculty.email || 'info@gdc.edu.pk'}`} className="btn btn-info text-white fw-bold rounded-pill py-3 shadow-sm">
                    <i className="bi bi-envelope-at-fill me-2"></i> Send Inquiry
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Professional Toggle Button */
        .pro-toggle-btn {
            background: #0a192f;
            color: white;
            border: none;
            padding: 8px 8px 8px 25px;
            border-radius: 50px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(10, 25, 47, 0.15);
        }
        .pro-toggle-btn:hover {
            background: #0d6efd;
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(13, 110, 253, 0.25);
        }
        .pro-btn-icon {
            width: 35px;
            height: 35px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.4s ease;
        }
        .pro-toggle-btn.active .pro-btn-icon {
            transform: rotate(180deg);
        }

        /* Grid Expansion Logic */
        .faculty-container {
            overflow: hidden;
            transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .is-collapsed {
            max-height: 520px;
        }
        .is-expanded {
            max-height: 4000px;
        }

        /* Card Animation */
        .faculty-anim-card {
            transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .card-off {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
            pointer-events: none;
        }
        .card-on {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Styling Details */
        .faculty-card { transition: all 0.4s ease; }
        .faculty-card:hover { transform: translateY(-10px); }
        .transition-img { transition: transform 0.6s ease; }
        .faculty-card:hover .transition-img { transform: scale(1.1); }
        .faculty-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #0a192f, transparent); opacity: 0; transition: 0.4s; }
        .faculty-card:hover .faculty-overlay { opacity: 1; }
        .landscape-modal-overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; }
        .modal-backdrop-blur { position: absolute; inset: 0; background: rgba(10, 25, 47, 0.85); backdrop-filter: blur(8px); }
        .landscape-card { position: relative; width: 100%; max-width: 950px; background: white; border-radius: 25px; overflow: hidden; z-index: 10001; }
        .close-btn { position: absolute; top: 15px; right: 15px; border: none; background: white; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; z-index: 10002; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

export default FacultyProfiles;