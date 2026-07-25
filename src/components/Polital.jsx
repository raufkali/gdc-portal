import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Polital = () => {
  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 30, 70, 0.85), rgba(10, 30, 70, 0.85)), url('https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              Power, Policy, and Public Service
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span className="text-info">Political Science</span></h1>
            <p className="lead mx-auto opacity-75 mb-4" style={{ maxWidth: "700px" }}>
              Analyzing governance systems, international relations, and political behavior to shape the leaders of tomorrow at GDC Gulabad.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2013" },
              { label: "PhD/MPhil Faculty", val: "06+" },
              { label: "Research Focus", val: "Global" },
              { label: "Student Society", val: "Active" }
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
                <h2 className="fw-bold text-dark display-6 mb-4">Shaping Informed Citizens</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Political Science Department equips students with a deep understanding of 
                  national and international political dynamics.
                </p>
                <div className="border-start border-info border-4 ps-4 my-4">
                  <p className="fst-italic text-dark fs-5">
                    "Man is by nature a political animal. Our goal is to translate that nature 
                    into leadership, diplomacy, and effective governance."
                  </p>
                </div>
                <p className="text-secondary">
                  Our curriculum covers political theory, comparative politics, and public policy, 
                  preparing graduates for careers in civil services, law, and global organizations.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80" 
                alt="Government Building" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2">Academic Pathways</h2>
            <p className="text-muted mb-5">Foundation and advanced degrees in Political Sciences.</p>
            <div className="row g-4 text-start">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-bank text-info fs-3"></i>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3">Intermediate</span>
                   </div>
                   <h4 className="fw-bold">I.A (Political Science Group)</h4>
                   <p className="text-secondary">A foundational program introducing students to civics, basic governance, and political rights.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Civics & Ethics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Political History</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Citizen Rights</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Social Laws</div>
                   </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-globe text-primary fs-3"></i>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3">Graduate</span>
                   </div>
                   <h4 className="fw-bold">BS Political Science</h4>
                   <p className="text-secondary">A comprehensive 4-year degree covering international relations, policy analysis, and political philosophy.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Int. Relations</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Foreign Policy</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Comp. Politics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Public Law</div>
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
              { phase: "Year 1", title: "Political Theory", desc: "Introduction to major political ideologies and concepts.", color: "bg-info" },
              { phase: "Year 2", title: "Comparative Gov", desc: "Analyzing different world political systems and structures.", color: "bg-primary" },
              { phase: "Year 3", title: "Int. Relations", desc: "Global affairs, diplomacy, and international organizations.", color: "bg-dark" },
              { phase: "Year 4", title: "Policy & Thesis", desc: "Senior research project and advanced public policy.", color: "bg-info" }
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
            <h2 className="fw-bold">Departmental Faculty</h2>
            <p className="text-muted">Academic leaders with expertise in governance and policy research.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Dr. Farah Naz", role: "HOD / Associate Professor", spec: "International Relations", icon: "bi-person-badge" },
              { name: "Mr. Imran Ali", role: "Assistant Professor", spec: "Comparative Politics", icon: "bi-person-gear" },
              { name: "Ms. Sana Qureshi", role: "Senior Lecturer", spec: "Public Policy", icon: "bi-person-video3" }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 hover-lift text-center">
                  <div className="mx-auto bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "100px", height: "100px" }}>
                    <i className={`bi ${f.icon} display-4`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{f.name}</h5>
                  <p className="text-info small fw-bold text-uppercase mb-2">{f.role}</p>
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
            <h2 className="fw-bold mb-3">Become a Leader of Tomorrow</h2>
            <p className="opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>Admissions for the 2026 academic session are now open. Explore the politics of today to lead the world of tomorrow.</p>
            <button className="btn btn-info text-white px-5 py-3 rounded-pill fw-bold shadow">Enroll Now</button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.1) !important; }
          .btn-info { background-color: #00a2ff; border-color: #00a2ff; }
          .text-info { color: #00a2ff !important; }
          .rounded-5 { border-radius: 2rem !important; }
        `}</style>

      </div>
      
      <Footer />
    </>
  );
};

export default Polital;