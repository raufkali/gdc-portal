import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust the path to your Footer component
import Footer from "../page/Footer"; 

const Zoology = () => {
  const PROGRAMS = [
    {
      title: "FSc Pre-Medical",
      desc: "A foundational program focusing on biological sciences and organic mechanisms to prepare students for medical disciplines.",
      focus: ["Anatomy", "Genetics", "Physiology"],
      icon: "bi-microscope"
    },
    {
      title: "BS Zoology",
      desc: "An advanced research-led study focusing on animal diversity, ecology, and wildlife management.",
      focus: ["Entomology", "Evolutionary Bio", "Molecular Biology"],
      icon: "bi-tree"
    }
  ];

  const SEMESTERS = [
    { num: "Phase 1", title: "Biological Foundation", subjects: ["Animal Diversity", "Lab Tech", "Ecology"], color: "#198754" },
    { num: "Phase 2", title: "Molecular Studies", subjects: ["Cell Biology", "Genetics", "Biochem"], color: "#20c997" },
    { num: "Phase 3", title: "Evolutionary Theory", subjects: ["Physiology", "Evolution", "Research"], color: "#0dcaf0" },
    { num: "Phase 4", title: "Specialization", subjects: ["Wildlife", "Entomology", "Behavior"], color: "#0d6efd" },
  ];

  return (
    <>
      <div className="bg-white min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div 
          className="position-relative py-5 d-flex align-items-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 40, 20, 0.85), rgba(10, 40, 20, 0.85)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat fixed",
            minHeight: "500px"
          }}
        >
          <div className="container text-center text-white">
            <h6 className="text-success text-uppercase fw-bold mb-3" style={{ letterSpacing: "3px", color: "#60ff80 !important" }}>
              Exploring Natural Biodiversity
            </h6>
            <h1 className="display-3 fw-bold mb-4">Department of <br/><span style={{ color: "#60ff80" }}>Zoology</span></h1>
            <p className="lead mx-auto opacity-75 mb-0" style={{ maxWidth: "700px" }}>
              Advancing the understanding of animal life, ecosystems, and conservation biology through rigorous empirical research at GDC Gulabad.
            </p>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Faculty Experts", val: "08+" },
              { label: "Field Research", val: "15+" },
              { label: "Species Catalogued", val: "1200+" },
              { label: "Student Success", val: "92%" }
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
                <h2 className="fw-bold text-dark display-6 mb-4">Protecting Global Biodiversity</h2>
                <p className="text-secondary fs-5 mb-4">
                  The Department of Zoology provides comprehensive knowledge about 
                  animal biology, physiology, and environmental conservation. 
                </p>
                <div className="p-4 rounded-4 bg-light border-start border-success border-4 mb-4">
                  <p className="mb-0 text-dark fw-medium">
                    "Our mission is to foster curiosity and scientific inquiry, preparing students 
                    for careers in research, wildlife management, and ecology."
                  </p>
                </div>
                <p className="text-secondary">
                  We combine fieldwork excellence with modern laboratory practices to ensure 
                  our graduates are ready for the challenges of 21st-century biological science.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1551029506-0807df4e2031?auto=format&fit=crop&w=800&q=80" 
                alt="Zoology Research" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- ACADEMIC PROGRAMS --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Academic Programs</h2>
            <div className="mx-auto bg-success mt-2" style={{ height: '3px', width: '50px' }}></div>
          </div>
          <div className="row g-4 text-start">
            {PROGRAMS.map((p, i) => (
              <div key={i} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift bg-light">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-white p-3 rounded-3 shadow-sm me-3 text-success">
                      <i className={`bi ${p.icon} fs-3`}></i>
                    </div>
                    <h4 className="fw-bold mb-0">{p.title}</h4>
                  </div>
                  <p className="text-secondary mb-4">{p.desc}</p>
                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    {p.focus.map((tag, idx) => (
                      <span key={idx} className="badge bg-white text-success border border-success border-opacity-25 px-3 py-2 rounded-pill small">
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
              <p className="text-muted">A structured pathway from animal diversity to specialized research.</p>
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
                            <i className="bi bi-chevron-right text-success me-2 mt-1" style={{fontSize: '0.7rem'}}></i>
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
            <p className="text-muted">Academic leadership dedicated to biological research and wildlife conservation.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Dr. Ayesha Khan", role: "Head of Department", spec: "Entomology / PhD", exp: "17+ Yrs", icon: "bi-person-badge" },
              { name: "Mr. Asad Ali", role: "Assistant Professor", spec: "Wildlife Management", exp: "12+ Yrs", icon: "bi-person-check" },
              { name: "Ms. Sana Rehman", role: "Senior Lecturer", spec: "Molecular Biology", exp: "6+ Yrs", icon: "bi-person-video3" }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-5 h-100 text-center hover-lift border-bottom border-success border-5">
                  <div className="mx-auto bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{ width: "100px", height: "100px" }}>
                    <i className={`bi ${f.icon} display-4`}></i>
                  </div>
                  <h5 className="fw-bold mb-1">{f.name}</h5>
                  <p className="text-success small fw-bold text-uppercase mb-2">{f.role}</p>
                  <div className="bg-light p-2 rounded-3 small text-muted">
                    <strong>Spec:</strong> {f.spec} <br/>
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
            <h2 className="fw-bold mb-3">Begin Your Biological Exploration</h2>
            <p className="opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>Admissions are open for the Fall 2024 session. Join our research community and explore the wonders of the animal kingdom.</p>
            <button className="btn btn-success text-white px-5 py-3 rounded-pill fw-bold shadow">Apply Now</button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.1) !important; }
          .btn-success { background-color: #198754; border-color: #198754; }
          .text-success { color: #198754 !important; }
          .rounded-5 { border-radius: 2rem !important; }
          .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
        `}</style>

      </div>
      
      <Footer />
    </>
  );
};

export default Zoology;