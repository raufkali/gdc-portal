import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../page/Footer";

function EligibilityCriteria() {
  // Ensure page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requirementsInter = [
    "Passed Matriculation (SSC) from a recognized board.",
    "Minimum of 45% marks in relevant subjects.",
    "Age limit as per Higher Education Department (HED) regulations.",
    "Admissions strictly based on the provincial merit policy."
  ];

  const requirementsBS = [
    "Passed Intermediate (FA/FSc) from a recognized board.",
    "Minimum of 45% marks in the relevant discipline.",
    "Mathematics mandatory for BS Computer Science applicants.",
    "Merit-based selection as per University & HED guidelines."
  ];

  return (
    <div className="bg-white min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- ELIGIBILITY HERO SECTION --- */}
      <header className="eligibility-hero d-flex align-items-center justify-content-center text-center text-white">
        <div className="hero-overlay"></div>
        
        <div className="container position-relative z-index-1 py-5">
          <span className="badge bg-info text-dark px-3 py-2 rounded-pill mb-3 fw-bold animate-fade-in" style={{ letterSpacing: "2px" }}>
            ADMISSIONS 2024-2025
          </span>
          <h1 className="display-3 fw-bold tracking-tight mb-3">Eligibility <span className="text-info">Criteria</span></h1>
          <p className="lead fw-light text-white-50 mx-auto mb-4" style={{ maxWidth: '700px' }}>
            Detailed academic requirements and document checklists for prospective students of GDC Gulabad.
          </p>
          
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase small fw-bold mb-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-white-50 text-decoration-none hover-info transition-base">Home</a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">Requirements</li>
            </ol>
          </nav>
        </div>
      </header>

      {/* --- CRITERIA CARDS SECTION --- */}
      <div className="container py-5" style={{ marginTop: "-30px" }}>
        <div className="row g-4 justify-content-center">
          
          {/* --- INTERMEDIATE SECTION --- */}
          <div className="col-lg-5">
            <div className="criteria-card h-100 border-0 shadow-lg rounded-4 overflow-hidden bg-white">
              <div className="card-header position-relative p-0 border-0">
                <img 
                  src="https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Intermediate Study" 
                  className="w-100" 
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="header-overlay d-flex flex-column align-items-center justify-content-center">
                  <h4 className="mb-0 fw-bold text-white">Intermediate</h4>
                  <p className="text-white-50 small mb-0 text-uppercase">FA / F.Sc Programs</p>
                </div>
              </div>
              <div className="card-body p-4 p-md-5">
                <section className="mb-4">
                  <h6 className="text-primary fw-bold text-uppercase small mb-4 border-bottom pb-2">Academic Standards</h6>
                  <ul className="list-unstyled custom-list">
                    {requirementsInter.map((item, i) => (
                      <li key={i} className="d-flex mb-3 align-items-start">
                        <i className="bi bi-check2-circle text-success me-3 mt-1 fs-5"></i>
                        <span className="text-dark opacity-75">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="p-4 rounded-4 bg-light-blue border-start border-primary border-4 shadow-sm">
                  <h6 className="text-primary fw-bold text-uppercase small mb-3">
                    <i className="bi bi-files me-2"></i>Documents Checklist
                  </h6>
                  <div className="row g-2 small text-muted">
                    {["Matric Certificate", "Character Cert.", "Domicile", "4 Photos", "CNIC / Form-B"].map((doc, idx) => (
                      <div key={idx} className="col-6 d-flex align-items-center">
                        <span className="dot-info me-2"></span> {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- BS PROGRAMS SECTION --- */}
          <div className="col-lg-5">
            <div className="criteria-card h-100 border-0 shadow-lg rounded-4 overflow-hidden bg-white">
              <div className="card-header position-relative p-0 border-0">
                <img 
                  src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="BS Study" 
                  className="w-100" 
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="header-overlay d-flex flex-column align-items-center justify-content-center" style={{ background: "rgba(15, 23, 42, 0.85)" }}>
                  <h4 className="mb-0 fw-bold text-white">BS Programs</h4>
                  <p className="text-white-50 small mb-0 text-uppercase">4-Year Degree</p>
                </div>
              </div>
              <div className="card-body p-4 p-md-5">
                <section className="mb-4">
                  <h6 className="fw-bold text-uppercase small mb-4 border-bottom pb-2" style={{ color: '#0A1428' }}>Academic Standards</h6>
                  <ul className="list-unstyled custom-list">
                    {requirementsBS.map((item, i) => (
                      <li key={i} className="d-flex mb-3 align-items-start">
                        <i className="bi bi-check2-circle text-success me-3 mt-1 fs-5"></i>
                        <span className="text-dark opacity-75">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #0A1428' }}>
                  <h6 className="fw-bold text-uppercase small mb-3" style={{ color: '#0A1428' }}>
                    <i className="bi bi-files me-2"></i>Documents Checklist
                  </h6>
                  <div className="row g-2 small text-muted">
                    {["Inter Certificate", "Character Cert.", "Domicile", "4 Photos", "Original CNIC"].map((doc, idx) => (
                      <div key={idx} className="col-6 d-flex align-items-center">
                        <span className="dot-navy me-2"></span> {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- PROFESSIONAL ADVISORY --- */}
        <div className="mt-5 pt-4">
          <div className="alert border-0 bg-light-blue rounded-4 p-4 text-center shadow-sm">
            <i className="bi bi-info-circle-fill text-primary fs-3 mb-2 d-block"></i>
            <p className="text-dark mb-1 fw-bold">Admission Policy Advisory</p>
            <p className="small text-secondary mb-0 mx-auto" style={{ maxWidth: "800px" }}>
              The final merit list is generated based on the HED weighted formula. Meeting the 45% minimum threshold 
              ensures eligibility for application, but does not guarantee selection in competitive disciplines.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css');
        
        .eligibility-hero {
          position: relative;
          min-height: 480px;
          background: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), 
                      url('https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') 
                      center/cover no-repeat fixed;
        }

        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
        }

        .header-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(13, 110, 253, 0.85);
        }

        .z-index-1 { z-index: 1; }
        .bg-light-blue { background-color: #f0f7ff; }
        
        .criteria-card { 
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        
        .criteria-card:hover { 
          transform: translateY(-12px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.15) !important;
        }

        .dot-info { width: 6px; height: 6px; background: #0d6efd; border-radius: 50%; }
        .dot-navy { width: 6px; height: 6px; background: #0A1428; border-radius: 50%; }

        .transition-base { transition: all 0.3s ease; }
        .hover-info:hover { color: #0dcaf0 !important; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }

        @media (max-width: 768px) {
          .eligibility-hero { min-height: 350px; }
          .display-3 { font-size: 2.3rem; }
          .container { margin-top: -40px !important; }
        }
      `}</style>
      <Footer />
    </div>
  );
}

export default EligibilityCriteria;