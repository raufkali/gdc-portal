import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Eng = () => {
  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(15, 35, 75, 0.85), rgba(15, 35, 75, 0.85)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              Literature • Linguistics • Communication
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span style={{ color: "#00d4ff" }}>English</span></h1>
            <p className="lead mx-auto opacity-75 mb-4" style={{ maxWidth: "700px" }}>
              Fostering critical thinking, literary appreciation, and global communication skills through the study of world languages and literature.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2007" },
              { label: "Expert Faculty", val: "10+" },
              { label: "Annual Seminars", val: "05+" },
              { label: "Alumni Success", val: "94%" }
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
                <h2 className="fw-bold text-dark display-6 mb-4">Mastering the Art of Expression</h2>
                <p className="text-secondary fs-5 mb-4">
                  The English Department at GDC Gulabad offers a rich academic experience, blending classical literary studies with modern linguistics.
                </p>
                <div className="p-4 rounded-4 bg-light border-start border-primary border-4 mb-4">
                  <p className="mb-0 text-dark fw-medium">
                    "Language is the blood of the soul into which thoughts run and out of which they grow. Our mission is to prepare students for the global professional landscape."
                  </p>
                </div>
                <div className="row g-3">
                  {["Critical Analysis", "Creative Writing", "Global Linguistics"].map((item, i) => (
                    <div key={i} className="col-6 small fw-bold text-primary">
                      <i className="bi bi-check-circle-fill me-2"></i> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80" 
                alt="English Literature Books" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="bg-light py-5">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Academic Programs</h2>
              <p className="text-muted">Structured pathways for literary and linguistic mastery</p>
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift bg-white">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 d-inline-block mb-3">
                    <i className="bi bi-journal-text text-primary fs-3"></i>
                  </div>
                  <h4 className="fw-bold">Intermediate (FA/FSc)</h4>
                  <p className="text-secondary">A foundational program focusing on functional English, grammar, composition, and an introduction to poetry.</p>
                  <ul className="list-unstyled text-muted small mt-3">
                    <li className="mb-2"><i className="bi bi-dot text-primary"></i> Functional Grammar</li>
                    <li className="mb-2"><i className="bi bi-dot text-primary"></i> Essay Writing & Precis</li>
                    <li><i className="bi bi-dot text-primary"></i> Introductory Literature</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift bg-white">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 d-inline-block mb-3">
                    <i className="bi bi-mortarboard text-info fs-3"></i>
                  </div>
                  <h4 className="fw-bold">BS English (4 Years)</h4>
                  <p className="text-secondary">An intensive research-oriented degree covering History of Literature, Linguistics, and Post-Colonial studies.</p>
                  <ul className="list-unstyled text-muted small mt-3">
                    <li className="mb-2"><i className="bi bi-dot text-info"></i> Phonetics & Phonology</li>
                    <li className="mb-2"><i className="bi bi-dot text-info"></i> Shakespearean Drama</li>
                    <li><i className="bi bi-dot text-info"></i> Modern Literary Theory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SEMESTER HIGHLIGHTS (Phase Roadmap) --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Curriculum Roadmap</h2>
            <div className="mx-auto bg-primary mt-2" style={{ height: '3px', width: '50px' }}></div>
          </div>
          <div className="row g-4">
            {[
              { phase: "Year 1", title: "Foundations", desc: "Communication skills and history of English literature.", color: "#0d6efd" },
              { phase: "Year 2", title: "Linguistics", desc: "Core linguistic concepts and classical poetry.", color: "#0dcaf0" },
              { phase: "Year 3", title: "Specialization", desc: "Modern drama, novel, and American literature.", color: "#6610f2" },
              { phase: "Year 4", title: "Research", desc: "Post-colonial studies and senior research thesis.", color: "#6f42c1" }
            ].map((p, i) => (
              <div key={i} className="col-md-3">
                <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden text-center hover-lift">
                  <div className="p-3 text-white fw-bold" style={{ backgroundColor: p.color }}>{p.phase}</div>
                  <div className="card-body">
                    <h6 className="fw-bold">{p.title}</h6>
                    <p className="small text-muted mb-0">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FACULTY SECTION --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Expert Faculty</h2>
            <p className="text-muted">Leading scholars in Literature and Applied Linguistics</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Dr. Ayesha Khan", role: "HOD / PhD Literature", exp: "18+ Yrs", icon: "bi-person-badge" },
              { name: "Mr. Ali Raza", role: "Assistant Professor", exp: "12+ Yrs", icon: "bi-person-check" },
              { name: "Ms. Maria Saeed", role: "Senior Lecturer", exp: "8+ Yrs", icon: "bi-person-video3" }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 text-center hover-lift">
                  <div className="mx-auto bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "90px", height: "90px" }}>
                    <i className={`bi ${f.icon} display-5`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{f.name}</h5>
                  <p className="text-primary small fw-bold text-uppercase mb-2">{f.role}</p>
                  <div className="bg-light p-2 rounded-pill small text-muted">
                    Exp: {f.exp} Academic Excellence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="container mb-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg">
            <h2 className="fw-bold mb-3">Begin Your Literary Journey</h2>
            <p className="opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>Admissions for the 2026 academic session are now open. Join GDC Gulabad to excel in English studies.</p>
            <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow">Apply Online</button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.1) !important; }
          .rounded-5 { border-radius: 2rem !important; }
        `}</style>

      </div>
      
      <Footer />
    </>
  );
};

export default Eng;