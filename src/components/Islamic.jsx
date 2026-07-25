import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const IslamicStudies = () => {
  const PROGRAMS = [
    {
      title: "Intermediate in Islamic Studies (IIS)",
      desc: "A foundational study of Quranic sciences, Hadith, and Arabic language designed for secondary level academic excellence.",
      focus: ["Quranic Arabic", "Ethics", "Basic Fiqh"],
      icon: "bi-book"
    },
    {
      title: "BS Islamic Studies",
      desc: "An advanced four-year research program focusing on Islamic Jurisprudence, History, and Contemporary Global Thought.",
      focus: ["Hermeneutics", "Comparative Religion", "Research"],
      icon: "bi-mortarboard"
    }
  ];

  const SEMESTERS = [
    { num: "Phase 1", title: "Classical Foundations", subjects: ["Quran & Tafseer", "Arabic Grammar", "Islamic History"], color: "#0d6efd" },
    { num: "Phase 2", title: "Legislative Studies", subjects: ["Hadith Studies", "Fiqh Basics", "Islamic Ethics"], color: "#0dcaf0" },
    { num: "Phase 3", title: "Social Sciences", subjects: ["Jurisprudence", "Civilization", "Comparative Religion"], color: "#6610f2" },
    { num: "Phase 4", title: "Modern Research", subjects: ["Contemporary Thought", "Philosophy", "Thesis"], color: "#6f42c1" },
  ];

  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 25, 50, 0.85), rgba(10, 25, 50, 0.85)), url('https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px" }}>
              Knowledge • Wisdom • Character
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span style={{ color: "#00d4ff" }}>Islamic Studies</span></h1>
            <p className="lead mx-auto opacity-75 mb-0" style={{ maxWidth: "700px" }}>
              Nurturing academic excellence through classical scholarship and modern research to build a balanced understanding of Islamic values.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "PhD Scholars", val: "05+" },
              { label: "Publications", val: "40+" },
              { label: "Alumni Network", val: "1500+" },
              { label: "Success Rate", val: "95%" }
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
                <h2 className="fw-bold text-dark display-6 mb-4">Promoting Values & Scholarship</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Department of Islamic Studies provides a deep understanding of 
                  Quranic teachings and Jurisprudence in a modern academic context.
                </p>
                <div className="p-4 rounded-4 bg-light border-start border-primary border-4 mb-4">
                  <p className="mb-0 text-dark fw-medium">
                    "Our mission is to empower students to apply Islamic principles effectively 
                    in academic, social, and professional life while fostering harmony."
                  </p>
                </div>
                <p className="text-secondary">
                  We bridge the gap between tradition and modernity, preparing our graduates 
                  to lead with both intellectual depth and moral integrity.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1590073242672-76be2d68972f?auto=format&fit=crop&w=800&q=80" 
                alt="Islamic Research Library" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Academic Programs</h2>
            <div className="mx-auto bg-primary mt-2" style={{ height: '3px', width: '50px' }}></div>
          </div>
          <div className="row g-4 text-start">
            {PROGRAMS.map((p, i) => (
              <div key={i} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift bg-light">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-white p-3 rounded-3 shadow-sm me-3 text-primary">
                      <i className={`bi ${p.icon} fs-3`}></i>
                    </div>
                    <h4 className="fw-bold mb-0">{p.title}</h4>
                  </div>
                  <p className="text-secondary mb-4">{p.desc}</p>
                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    {p.focus.map((tag, idx) => (
                      <span key={idx} className="badge bg-white text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill small">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SEMESTER ROADMAP --- */}
        <div className="bg-light py-5 mt-5">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Curriculum Roadmap</h2>
              <p className="text-muted">A structured pathway through the BS Islamic Studies program.</p>
            </div>
            <div className="row g-4">
              {SEMESTERS.map((s, i) => (
                <div key={i} className="col-md-3">
                  <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                    <div className="p-3 text-white fw-bold text-center" style={{ backgroundColor: s.color }}>
                      {s.num}
                    </div>
                    <div className="p-4 bg-white">
                      <h6 className="fw-bold text-dark mb-3">{s.title}</h6>
                      <ul className="list-unstyled mb-0">
                        {s.subjects.map((sub, idx) => (
                          <li key={idx} className="small text-muted mb-2 d-flex align-items-start">
                            <i className="bi bi-chevron-right text-primary me-2 mt-1" style={{fontSize: '0.7rem'}}></i>
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- FACULTY SECTION --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Distinguished Faculty</h2>
            <p className="text-muted">Academic leaders dedicated to theological research and social ethics.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Dr. Hafiz Muhammad Ali", role: "Head of Department", spec: "Fiqh / PhD", exp: "20+ Yrs", icon: "bi-person-badge" },
              { name: "Mr. Salman Ahmed", role: "Assistant Professor", spec: "Arabic Literature", exp: "14+ Yrs", icon: "bi-person-check" },
              { name: "Ms. Sara Khan", role: "Senior Lecturer", spec: "Comparative Religion", exp: "7+ Yrs", icon: "bi-person-video3" }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 text-center hover-lift border-bottom border-primary border-5">
                  <div className="mx-auto bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{ width: "100px", height: "100px" }}>
                    <i className={`bi ${f.icon} display-4`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{f.name}</h5>
                  <p className="text-primary small fw-bold text-uppercase mb-2">{f.role}</p>
                  <div className="bg-light p-2 rounded-3 small text-muted">
                    <strong>Specialization:</strong> {f.spec} <br/>
                    <strong>Experience:</strong> {f.exp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="container mb-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg">
            <h2 className="fw-bold mb-3">Join Our Research Community</h2>
            <p className="opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>Admissions are open for the 2026 academic session. Become part of a legacy of learning and integrity.</p>
            <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow">Apply for Admission</button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.1) !important; }
          .btn-primary { background-color: #0d6efd; border-color: #0d6efd; }
          .text-primary { color: #0d6efd !important; }
          .rounded-5 { border-radius: 2rem !important; }
          .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
        `}</style>

      </div>
      
      <Footer />
    </>
  );
};

export default IslamicStudies;