import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Chem = () => {
  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 30, 60, 0.85), rgba(10, 30, 60, 0.85)), url('https://images.unsplash.com/photo-1532187875605-1ef6382391ee?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              Deciphering Molecular Bonds
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span className="text-info">Chemistry</span></h1>
            <p className="lead mx-auto opacity-75 mb-4" style={{ maxWidth: "700px" }}>
              Advancing scientific knowledge through the study of matter, chemical synthesis, and innovative laboratory research at GDC Gulabad.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2012" },
              { label: "Doctoral Faculty", val: "06+" },
              { label: "Research Labs", val: "03" },
              { label: "Student Success", val: "94%" }
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
                <h2 className="fw-bold text-dark display-6 mb-4">Pioneering the Future of Science</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Department of Chemistry provides a rigorous academic path covering organic, inorganic, and physical chemistry. 
                </p>
                <div className="border-start border-info border-4 ps-4 my-4">
                  <p className="fst-italic text-dark fs-5">
                    "Our goal is to prepare future scientists with the analytical tools needed to solve global challenges in health, energy, and environment."
                  </p>
                </div>
                <p className="text-secondary">
                  Equipped with modern instrumentation, our students engage in hands-on experimentation, 
                  bridging the gap between theoretical stoichiometry and industrial application.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1581093588401-637f0133e2b1?auto=format&fit=crop&w=800&q=80" 
                alt="Chemistry Laboratory" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2">Academic Programs</h2>
            <p className="text-muted mb-5">Leading paths in chemical education and pharmaceutical foundations.</p>
            <div className="row g-4 text-start">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-droplet-half text-info fs-3"></i>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3">Intermediate</span>
                   </div>
                   <h4 className="fw-bold">FSc (Pre-Medical)</h4>
                   <p className="text-secondary">A specialized foundation for students pursuing careers in Medicine, Pharmacy, and Biotechnology.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Organic Chemistry</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Biochemistry</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Reaction Kinetics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Periodic Trends</div>
                   </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-eyedropper text-primary fs-3"></i>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3">Graduate</span>
                   </div>
                   <h4 className="fw-bold">BS Chemistry</h4>
                   <p className="text-secondary">An intensive four-year program focused on research, analytical techniques, and industrial synthesis.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Analytical Chemistry</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Polymer Science</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Thermodynamics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Spectroscopy</div>
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
            <p className="text-muted">Structured progress from basic stoichiometry to advanced synthesis.</p>
            <div className="mx-auto bg-info mt-2" style={{ height: '3px', width: '60px' }}></div>
          </div>
          <div className="row g-4">
            {[
              { 
                sem: "Years 1-2", 
                title: "Inorganic Core", 
                desc: "Fundamentals of Atomic Structure, Periodic Trends, and basic Qualitative Analysis.", 
                icon: "bi-bounding-box",
                color: "bg-info"
              },
              { 
                sem: "Year 3", 
                title: "Organic & Physical", 
                desc: "In-depth study of Carbon compounds, Reaction mechanisms, and Chemical Equilibrium.", 
                icon: "bi-diagram-3",
                color: "bg-primary"
              },
              { 
                sem: "Year 4", 
                title: "Advanced Research", 
                desc: "Focus on Environmental Chemistry, Industrial Chemistry, and Instrumental Methods.", 
                icon: "bi-funnel",
                color: "bg-dark"
              },
              { 
                sem: "Final Sem", 
                title: "Thesis Project", 
                desc: "Capstone research project focusing on independent lab synthesis and data analysis.", 
                icon: "bi-flask-fill",
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
            <h2 className="fw-bold">Distinguished Faculty</h2>
            <p className="text-muted">Led by experienced chemists and PhD researchers dedicated to academic growth.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { 
                name: "Dr. Sana Iqbal", 
                role: "HOD / Professor", 
                spec: "Organic Chemistry", 
                qual: "PhD / Post-Doctoral Fellow",
                icon: "bi-person-badge"
              },
              { 
                name: "Mr. Imran Ali", 
                role: "Assistant Professor", 
                spec: "Analytical Chemistry", 
                qual: "M.Phil Chemistry",
                icon: "bi-person-gear"
              },
              { 
                name: "Ms. Hina Shah", 
                role: "Senior Lecturer", 
                spec: "Biochemistry", 
                qual: "MS Chemistry",
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
            <h2 className="fw-bold mb-3">Begin Your Scientific Discovery</h2>
            <p className="opacity-75 mb-4">Admissions for the Chemistry Department are now open. Explore the molecular mysteries of our world.</p>
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

export default Chem;