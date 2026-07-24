import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Physics = () => {
  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(15, 32, 67, 0.85), rgba(15, 32, 67, 0.85)), url('https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-warning text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              Exploring Cosmic Mysteries
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span className="text-info">Physics</span></h1>
            <p className="lead mx-auto opacity-75 mb-4" style={{ maxWidth: "700px" }}>
              Understanding the fundamental principles of nature—from subatomic particles to the vastness of the universe at GDC Gulabad.
            </p>
            <div className="d-flex justify-content-center gap-3">
               <button className="btn btn-info btn-lg rounded-pill px-4 fw-bold text-white shadow-lg">View Curriculum</button>
               <button className="btn btn-outline-light btn-lg rounded-pill px-4">Research Labs</button>
            </div>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2008" },
              { label: "Faculty Members", val: "08+" },
              { label: "Lab Equipment", val: "50+" },
              { label: "Graduation Rate", val: "92%" }
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
                <h2 className="fw-bold text-dark display-6 mb-4">Unveiling the Laws of the Universe</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Department of Physics at Government Degree College Gulabad provides a 
                  comprehensive academic experience built on classical and modern physics foundations. 
                </p>
                <div className="border-start border-info border-4 ps-4 my-4">
                  <p className="fst-italic text-dark fs-5">
                    "Our mission is to empower students with analytical skills and curiosity-driven innovation to solve real-world scientific challenges."
                  </p>
                </div>
                <p className="text-secondary">
                  We combine rigorous theoretical learning with advanced practical experimentation in our 
                  specialized laboratories, covering everything from quantum mechanics to thermodynamics.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80" 
                alt="Physics Lab" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- MODIFIED ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2">Academic Programs</h2>
            <p className="text-muted mb-5">Foundation and Advanced levels of physical sciences.</p>
            <div className="row g-4 text-start">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-book text-info fs-3"></i>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3">Intermediate</span>
                   </div>
                   <h4 className="fw-bold">FSc (Pre-Engineering)</h4>
                   <p className="text-secondary">A rigorous two-year program preparing students for top engineering and physics universities nationwide.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Waves & Optics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Electrodynamics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Thermodynamics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-info me-2"></i>Modern Physics</div>
                   </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                        <i className="bi bi-cpu text-primary fs-3"></i>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3">Graduate</span>
                   </div>
                   <h4 className="fw-bold">BS Physics</h4>
                   <p className="text-secondary">A deep dive into the mathematical and experimental nature of reality over eight comprehensive semesters.</p>
                   <div className="row g-2 mb-3">
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Quantum Mechanics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Nuclear Physics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Solid State Physics</div>
                      <div className="col-6 small text-muted"><i className="bi bi-check-circle-fill text-primary me-2"></i>Relativity</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODIFIED SEMESTER HIGHLIGHTS --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Semester Timeline</h2>
            <p className="text-muted">Key areas of focus throughout the BS program.</p>
            <div className="mx-auto bg-info mt-2" style={{ height: '3px', width: '60px' }}></div>
          </div>
          <div className="row g-4">
            {[
              { 
                sem: "Years 1-2", 
                title: "Core Foundation", 
                desc: "Focus on Mathematical Methods, Classical Mechanics, and Heat & Thermodynamics.", 
                icon: "bi-layers-half",
                color: "bg-info"
              },
              { 
                sem: "Year 3", 
                title: "Advanced Theory", 
                desc: "Introduction to Quantum Mechanics, Electromagnetism II, and Statistical Mechanics.", 
                icon: "bi-infinite",
                color: "bg-primary"
              },
              { 
                sem: "Year 4", 
                title: "Specialization", 
                desc: "Nuclear Physics, Solid State Physics, and High Energy Physics electives.", 
                icon: "bi-atom",
                color: "bg-dark"
              },
              { 
                sem: "Final Sem", 
                title: "Research Project", 
                desc: "Independent laboratory research and thesis under faculty supervision.", 
                icon: "bi-microscope",
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

        {/* --- MODIFIED FACULTY SECTION --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Distinguished Faculty</h2>
            <p className="text-muted">Guided by experienced physicists and industry-standard researchers.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { 
                name: "Prof. Muhammad Aslam", 
                role: "HOD / Associate Professor", 
                spec: "Quantum Optics", 
                qual: "M.Sc Physics (Gold Medalist)",
                icon: "bi-person-badge"
              },
              { 
                name: "Mr. Shahid Khan", 
                role: "Assistant Professor", 
                spec: "Electronics & Telecomm", 
                qual: "M.Phil Physics",
                icon: "bi-person-gear"
              },
              { 
                name: "Ms. Nida Ahmed", 
                role: "Senior Lecturer", 
                spec: "Theoretical Physics", 
                qual: "MS Physics",
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
            <p className="opacity-75 mb-4">Admissions for BS Physics are now open. Explore the mysteries of the physical world.</p>
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

export default Physics;