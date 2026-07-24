import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Math = () => {
  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 30, 80, 0.85), rgba(10, 30, 80, 0.85)), url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              The Language of the Universe
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span className="text-info">Mathematics</span></h1>
            <p className="lead mx-auto opacity-75 mb-4" style={{ maxWidth: "700px" }}>
              Building logical thinkers and expert problem solvers through the power of numbers and analytical reasoning at GDC Gulabad.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2009" },
              { label: "PhD Faculty", val: "05+" },
              { label: "Success Rate", val: "96%" },
              { label: "Research Areas", val: "08" }
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4 rounded-4 bg-white">
                  <h3 className="fw-bold text-dark mb-0">{stat.val}</h3>
                  <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{stat.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ABOUT SECTION --- */}
        <div className="container py-5 my-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <h2 className="fw-bold text-dark display-6 mb-4">Precision & Analytical Logic</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Mathematics Department at GDC Gulabad focuses on equipping students with 
                  advanced analytical skills and computational techniques.
                </p>
                <div className="border-start border-info border-4 ps-4 my-4">
                  <p className="fst-italic text-dark fs-5">
                    "Mathematics is the language in which God has written the universe. Our goal 
                    is to help students speak that language fluently."
                  </p>
                </div>
                <p className="text-secondary">
                  From pure Calculus to applied Mathematical Modeling, we prepare students for 
                  high-level careers in data science, actuarial studies, and scientific research.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1509228468518-180dd48a5791?auto=format&fit=crop&w=800&q=80" 
                alt="Mathematics blackboard" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2">Academic Programs</h2>
            <p className="text-muted mb-5">Foundation and Advanced levels of Mathematical Sciences.</p>
            <div className="row g-4 text-start">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-calculator text-info fs-3"></i>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3">Intermediate</span>
                   </div>
                   <h4 className="fw-bold">FSc (Pre-Engineering)</h4>
                   <p className="text-secondary">A rigorous two-year program focusing on algebra, trigonometry, and calculus for aspiring engineers.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Advanced Calculus</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Analytical Geometry</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Vector Algebra</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Trigonometry</div>
                   </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-infinity text-primary fs-3"></i>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3">Graduate</span>
                   </div>
                   <h4 className="fw-bold">BS Mathematics</h4>
                   <p className="text-secondary">Comprehensive degree covering Abstract Algebra, Numerical Analysis, and Mathematical Modeling.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Abstract Algebra</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Complex Analysis</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Discrete Math</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Number Theory</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SEMESTER HIGHLIGHTS --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Semester Timeline</h2>
            <p className="text-muted">Key focus areas throughout the BS Mathematical Journey.</p>
            <div className="mx-auto bg-info mt-2" style={{ height: '3px', width: '60px' }}></div>
          </div>
          <div className="row g-4">
            {[
              { 
                sem: "Years 1-2", 
                title: "Core Foundation", 
                desc: "Focus on Calculus I-III, Linear Algebra, and Differential Equations.", 
                icon: "bi-layers-half",
                color: "bg-info"
              },
              { 
                sem: "Year 3", 
                title: "Advanced Analysis", 
                desc: "Introduction to Real Analysis, Mechanics, and Group Theory.", 
                icon: "bi-graph-up-arrow",
                color: "bg-primary"
              },
              { 
                sem: "Year 4", 
                title: "Specialization", 
                desc: "Numerical Analysis, Topology, and Functional Analysis electives.", 
                icon: "bi-bezier2",
                color: "bg-dark"
              },
              { 
                sem: "Final Sem", 
                title: "Research Thesis", 
                desc: "Independent research project focusing on Applied or Pure Mathematics.", 
                icon: "bi-search",
                color: "bg-info"
              }
            ].map((c, i) => (
              <div key={i} className="col-md-3">
                <div className="p-4 rounded-4 border-0 shadow-sm bg-white text-center h-100 hover-lift">
                  <div className={`mx-auto ${c.color} text-white rounded-circle d-flex align-items-center justify-content-center mb-3`} style={{ width: "60px", height: "60px" }}>
                    <i className={`bi ${c.icon} fs-4`}></i>
                  </div>
                  <span className="badge bg-light text-dark mb-2">{c.sem}</span>
                  <h6 className="fw-bold">{c.title}</h6>
                  <p className="small text-muted mb-0">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FACULTY SECTION --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Mathematical Experts</h2>
            <p className="text-muted">Learning from distinguished researchers and experienced educators.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { 
                name: "Dr. Ahmad Khan", 
                role: "HOD / Associate Professor", 
                spec: "Fluid Dynamics", 
                qual: "PhD Mathematics",
                icon: "bi-person-badge"
              },
              { 
                name: "Ms. Sana Ali", 
                role: "Assistant Professor", 
                spec: "Applied Mathematics", 
                qual: "M.Phil Mathematics",
                icon: "bi-person-gear"
              },
              { 
                name: "Mr. Asif Raza", 
                role: "Senior Lecturer", 
                spec: "Pure Mathematics", 
                qual: "MS Mathematics",
                icon: "bi-person-video3"
              }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 hover-lift text-center">
                  <div className="mx-auto bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "100px", height: "100px" }}>
                    <i className={`bi ${f.icon} display-4`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{f.name}</h5>
                  <p className="text-info small fw-bold text-uppercase mb-2">{f.role}</p>
                  <p className="text-muted small mb-3">{f.qual}</p>
                  <div className="mt-auto pt-3 border-top">
                    <small className="text-secondary fst-italic">Expertise: {f.spec}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="container mb-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg">
            <h2 className="fw-bold mb-3">Master the Language of Logic</h2>
            <p className="opacity-75 mb-4">Fall 2026 admissions for BS Mathematics are now open. Start your journey today.</p>
            <button className="btn btn-info text-white px-5 py-3 rounded-pill fw-bold shadow">Apply Now</button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.15) !important; }
          .btn-info { background-color: #00a2ff; border-color: #00a2ff; }
          .text-info { color: #00a2ff !important; }
          .rounded-5 { border-radius: 2rem !important; }
        `}</style>

      </div>
      
      <Footer />
    </>
  );
};

export default Math;