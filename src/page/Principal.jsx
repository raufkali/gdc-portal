import React, { useState, useEffect } from "react";
import axios from "axios";

// Set your global API base URL context path here
const API_BASE_URL = "http://192.168.43.56:5000/api";

function Principal() {
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- DYNAMIC DATA BACKEND STATE ---
  const [principal, setPrincipal] = useState({
    name: "Dr. M. Aslam Khan",
    qualification: "PhD in Education Management",
    message: "Loading message details from live server...",
    photo: "",
    vision: "Loading institutional vision...",
    mission: "Loading mission guidelines..."
  });

  // Fetch data directly from your server endpoint
  useEffect(() => {
    const fetchPrincipalData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/principal`);
        // If your backend serves an array, take the first entry: res.data[0]
        if (res.data) {
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          setPrincipal({
            name: data.name || "Dr. M. Aslam Khan",
            qualification: data.qualification || "PhD in Education Management",
            message: data.message || "",
            photo: data.photo || "", // Your server handles matching binary uploads here
            vision: data.vision || "",
            mission: data.mission || ""
          });
        }
      } catch (err) {
        console.error("Error connecting to leadership endpoint router:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrincipalData();
  }, []);

  // Gracefully handles empty states or network latency
  const messageText = principal.message || "";
  const shortMessage = messageText.length > 200 
    ? messageText.substring(0, 200) + "..." 
    : messageText;

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-50 bg-light">
        <div className="text-muted small fw-bold text-uppercase tracking-wider">Syncing Desk Data Stream...</div>
      </div>
    );
  }

  return (
    <section className="py-5" style={{ background: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <h6 className="text-primary fw-bold text-uppercase mb-2" style={{ letterSpacing: "3px", fontSize: "0.8rem" }}>College Leadership</h6>
          <h2 className="fw-bold display-5 text-dark">Principal's Message</h2>
          <div className="mx-auto" style={{ height: "3px", width: "40px", background: "#0D6EFD" }}></div>
        </div>

        {/* Executive Profile Card */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-11 col-xl-10">
            <div className="bg-white rounded-4 shadow-sm border-0 position-relative overflow-hidden">
              <div className="row g-0">
                
                {/* Profile Image Column (Dynamic Photo & Name) */}
                <div className="col-md-4 p-5 d-flex flex-column align-items-center justify-content-center bg-light-subtle border-end border-light">
                  <div className="avatar-wrapper mb-4">
                    <img
                      src={principal.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"}
                      alt="Principal Profile Asset"
                      className="rounded-circle shadow-sm"
                      style={{ width: "230px", height: "230px", objectFit: "cover", border: "4px solid white" }}
                    />
                  </div>
                  <h5 className="fw-bold mb-1 text-center" style={{ color: "#1E293B" }}>{principal.name}</h5>
                  <p className="text-muted small text-center mb-2">{principal.qualification}</p>
                  <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold" style={{ fontSize: "0.7rem" }}>OFFICE OF THE PRINCIPAL</span>
                </div>

                {/* Message Body Column (Dynamic Message) */}
                <div className="col-md-8 p-4 p-md-5 d-flex flex-column">
                  <div className="quote-icon mb-3 text-primary opacity-25">
                    <i className="bi bi-quote" style={{ fontSize: "3rem" }}></i>
                  </div>
                  
                  <div className="flex-grow-1">
                    <p className="text-secondary fs-5 lh-lg mb-4" style={{ textAlign: "justify", fontStyle: "italic", fontWeight: "400" }}>
                      {showFullMessage ? messageText : shortMessage}
                    </p>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between pt-4 border-top">
                    {messageText.length > 200 && (
                        <button 
                          className="btn btn-link text-primary text-decoration-none fw-bold p-0"
                          onClick={() => setShowFullMessage(!showFullMessage)}
                        >
                          {showFullMessage ? "Collapse Message" : "Read Full Message"} <i className={`bi bi-arrow-${showFullMessage ? 'up' : 'down'}-short`}></i>
                        </button>
                    )}
                    
                    <div className="text-end ms-auto">
                       <h4 className="mb-0 signature-style">{principal.name}</h4>
                       <p className="text-muted x-small fw-bold text-uppercase tracking-wider mb-0">Principal, GDC Gulabad</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Pillar Cards (Dynamic Vision/Mission) */}
        <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="pillar-card p-4 h-100 bg-white border border-light shadow-sm rounded-4 transition-hover">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-rounded me-3" style={{ backgroundColor: `#0d6efd15`, color: "#0d6efd" }}>
                    <i className="bi bi-eye"></i>
                  </div>
                  <h4 className="fw-bold mb-0" style={{ color: "#1E293B" }}>Our Vision</h4>
                </div>
                <p className="text-muted small lh-base mb-0">{principal.vision || "Vision details currently offline."}</p>
              </div>
            </div>

            <div className="col-md-5">
              <div className="pillar-card p-4 h-100 bg-white border border-light shadow-sm rounded-4 transition-hover">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-rounded me-3" style={{ backgroundColor: `#f59e0b15`, color: "#f59e0b" }}>
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h4 className="fw-bold mb-0" style={{ color: "#1E293B" }}>Our Mission</h4>
                </div>
                <p className="text-muted small lh-base mb-0">{principal.mission || "Mission parameters currently offline."}</p>
              </div>
            </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600;700&display=swap');
        
        .signature-style { 
          font-family: 'Great Vibes', cursive; 
          color: #0F172A;
          font-size: 1.8rem;
        }

        .avatar-wrapper {
          position: relative;
          display: inline-block;
        }

        .avatar-wrapper::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 1px dashed #0d6efd;
          border-radius: 50%;
          opacity: 0.3;
        }

        .icon-rounded {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .pillar-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pillar-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px -5px rgba(0,0,0,0.05);
          border-color: #0d6efd20 !important;
        }

        .x-small { font-size: 0.65rem; }
        .tracking-wider { letter-spacing: 1.5px; }
      `}</style>
    </section>
  );
}

export default Principal;