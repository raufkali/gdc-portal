import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Econom = () => {
  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)), url('https://images.unsplash.com/photo-1591033594798-33227a05780d?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-warning text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              Insight into Global Markets
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span className="text-info">Economics</span></h1>
            <p className="lead mx-auto opacity-75 mb-4" style={{ maxWidth: "700px" }}>
              Understanding financial systems, resource allocation, and policy making to shape a sustainable future at GDC Gulabad.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2014" },
              { label: "Expert Faculty", val: "08+" },
              { label: "Graduation Rate", val: "92%" },
              { label: "Research Papers", val: "45+" }
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

        {/* --- ABOUT SECTION (Text Left, Image Right) --- */}
        <div className="container py-5 my-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <h2 className="fw-bold text-dark display-6 mb-4">Decoding the Modern Economy</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Department of Economics offers a rigorous academic journey into micro and macro-economic theory.
                </p>
                <div className="border-start border-info border-4 ps-4 my-4">
                  <p className="fst-italic text-dark fs-5">
                    "Our mission is to empower students with analytical tools to solve complex 
                    socio-economic challenges in a rapidly changing global landscape."
                  </p>
                </div>
                <p className="text-secondary">
                  We focus on econometrics, development economics, and financial systems, ensuring our 
                  graduates are prepared for careers in banking, research, and public policy.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                alt="Economic Analysis" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2">Academic Programs</h2>
            <p className="text-muted mb-5">Foundation and advanced pathways in Economic Sciences.</p>
            <div className="row g-4 text-start">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-graph-up text-info fs-3"></i>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3">Intermediate</span>
                   </div>
                   <h4 className="fw-bold">I-ECON (Economics Group)</h4>
                   <p className="text-secondary">An introductory program focusing on basic economic principles, statistics, and commercial geography.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Micro Economics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Statistics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Comm. Geography</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Math Foundations</div>
                   </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-bank text-primary fs-3"></i>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3">Graduate</span>
                   </div>
                   <h4 className="fw-bold">BS Economics</h4>
                   <p className="text-secondary">A comprehensive four-year degree exploring mathematical economics, econometrics, and policy analysis.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Econometrics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Monetary Policy</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Int. Trade</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Development Econ</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SEMESTER HIGHLIGHTS --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Curriculum Roadmap</h2>
            <div className="mx-auto bg-info mt-2" style={{ height: '3px', width: '60px' }}></div>
          </div>
          <div className="row g-4">
            {[
              { phase: "Phase 1", title: "Micro Theory", desc: "Understanding individual markets and consumer behavior analysis.", color: "bg-info" },
              { phase: "Phase 2", title: "Macro Dynamics", desc: "National income, inflation, and global economic growth models.", color: "bg-primary" },
              { phase: "Phase 3", title: "Econometrics", desc: "Statistical methods and data analysis for economic forecasting.", color: "bg-dark" },
              { phase: "Phase 4", title: "Policy Research", desc: "Senior research project and public policy implementation.", color: "bg-info" }
            ].map((c, i) => (
              <div key={i} className="col-md-3">
                <div className="p-4 rounded-4 border-0 shadow-sm bg-white text-center h-100 hover-lift border-top border-info border-4">
                  <span className={`badge ${c.color} mb-3 px-3 py-2 rounded-pill`}>{c.phase}</span>
                  <h6 className="fw-bold text-dark mb-2">{c.title}</h6>
                  <p className="small text-muted mb-0">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FACULTY SECTION --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Expert Faculty</h2>
            <p className="text-muted">Dedicated educators with deep industry and academic roots.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Dr. Asad Mehmood", role: "HOD / Associate Professor", spec: "PhD Development Economics", icon: "bi-person-badge" },
              { name: "Ms. Nadia Tariq", role: "Assistant Professor", spec: "M.Phil Monetary Policy", icon: "bi-person-gear" },
              { name: "Mr. Ali Khan", role: "Senior Lecturer", spec: "MS Econometrics", icon: "bi-person-video3" }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 hover-lift text-center">
                  <div className="mx-auto bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{ width: "100px", height: "100px" }}>
                    <i className={`bi ${f.icon} display-4`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{f.name}</h5>
                  <p className="text-info small fw-bold text-uppercase mb-2">{f.role}</p>
                  <div className="mt-auto pt-3 border-top">
                    <small className="text-secondary fst-italic">{f.spec}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="container mb-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg">
            <h2 className="fw-bold mb-3">Shape the Financial Future</h2>
            <p className="opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>Admissions for the Fall 2026 session are now open. Join our community of analytical thinkers.</p>
            <button className="btn btn-info text-white px-5 py-3 rounded-pill fw-bold shadow">Apply Now</button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.1) !important; }
          .btn-info { background-color: #00a2ff; border-color: #00a2ff; }
          .text-info { color: #00a2ff !important; }
          .rounded-5 { border-radius: 2rem !important; }
          .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
        `}</style>

      </div>
      
      <Footer />
    </>
  );
};

export default Econom;