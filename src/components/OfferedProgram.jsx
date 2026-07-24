import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../page/Footer";

const OfferedProgram = () => {
  const [filter, setFilter] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const programs = [
    {
      title: "BS Computer Science",
      description: "Master software engineering, AI, and data structures in our modern tech labs.",
      details: "Our BSCS program focuses on Software Development, Artificial Intelligence, and Cybersecurity. Students gain access to modern coding labs.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Tech",
      color: "#0d6efd"
    },
    {
      title: "BS Mathematics",
      description: "Explore the language of the universe through calculus and algebra.",
      details: "Advanced training in pure and applied mathematics, preparing students for research and data science.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/3773937/pexels-photo-3773937.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Science",
      color: "#6610f2"
    },
    {
      title: "BS English",
      description: "Enhance critical thinking through world literature and linguistics.",
      details: "A deep dive into classical prose, poetry, and modern drama, emphasizing communication.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Humanities",
      color: "#6f42c1"
    },
    {
     title: "BS Physics",
     description: "Unlock the mysteries of matter, energy, and the laws of the physical world.",
     details: "Rigorous training in Quantum Mechanics, Thermodynamics, and Astrophysics.",
     duration: "4 Years",
     image: "https://images.pexels.com/photos/3912447/pexels-photo-3912447.jpeg?auto=compress&cs=tinysrgb&w=800",
     category: "Science",
     color: "#0dcaf0"
   },
    {
      title: "BS Chemistry",
      description: "Study molecular structures and chemical reactions through research.",
      details: "Hands-on experience in Organic and Inorganic Chemistry in advanced research labs.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Science",
      color: "#198754"
    },
  {
    title: "BS Zoology",
    description: "Analyze animal life, genetics, and ecology for biodiversity conservation.",
    details: "Includes fieldwork and specimen analysis of animal physiology.",
    duration: "4 Years",
    image: "https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Science",
    color: "#20c997"
  },
    {
      title: "BS Economics",
      description: "Understand global financial systems and market dynamics.",
      details: "Focuses on Macroeconomics and Econometrics. Ideal for banking and policy roles.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Social Science",
      color: "#fd7e14"
    },
    {
    title: "BS Political Science",
    description: "Study governance, international relations, and public administration.",
    details: "Analyze political systems and international law for public service.",
    duration: "4 Years",
    image: "https://images.pexels.com/photos/15792534/pexels-photo-15792534/free-photo-of-white-house-washington-dc.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Social Science",
    color: "#dc3545"
  },
    {
      title: "BS Urdu",
      description: "Explore the literary depth of the Urdu language and heritage.",
      details: "Comprehensive study of Urdu history, poetry, and modern journalism.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Humanities",
      color: "#e83e8c"
    },
    {
      title: "BS Islamic Studies",
      description: "A comprehensive study of Islamic history, jurisprudence, and ethics.",
      details: "Engage with Quranic sciences and modern Islamic philosophy.",
      duration: "4 Years",
      image: "https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Humanities",
      color: "#157347"
    }
  ];

  const filteredPrograms = filter === "All" 
    ? programs 
    : programs.filter(p => p.category === filter);

  return (
    <div className="offered-program-page bg-white min-vh-100" style={{fontFamily: "'Inter', sans-serif", paddingTop: '70px'}}>
      
      {/* SIDE DRAWER MODAL */}
      {selectedProgram && (
        <div className="custom-drawer-backdrop" onClick={() => setSelectedProgram(null)}>
          <div className="side-drawer p-4 p-md-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="badge px-3 py-2 rounded-pill" style={{backgroundColor: selectedProgram.color}}>{selectedProgram.category}</span>
              <button className="btn-close" onClick={() => setSelectedProgram(null)}></button>
            </div>
            <img src={selectedProgram.image} className="rounded-4 mb-4 w-100 shadow-sm" style={{height: '240px', objectFit: 'cover'}} alt={selectedProgram.title} />
            <h3 className="fw-bold text-navy">{selectedProgram.title}</h3>
            <p className="text-secondary lh-lg mt-4">{selectedProgram.details}</p>
            <div className="mt-5">
              <button className="btn btn-navy w-100 py-3 rounded-4 fw-bold shadow-lg">Apply for Admission</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <header className="hero-modern">
        <div className="container position-relative z-index-1 text-center text-white">
          <span className="badge bg-info text-dark px-3 py-2 rounded-pill mb-3 fw-bold shadow">DISCOVER YOUR PATH</span>
          <h1 className="display-4 fw-bold mb-3">Offered <span className="text-info">Programs</span></h1>
          <p className="lead opacity-80 mx-auto d-none d-md-block" style={{maxWidth: "750px"}}>
            Empowering students with 4-year professional BS degrees across diverse academic disciplines.
          </p>
        </div>
      </header>

      {/* --- FILTER BAR --- */}
      <div className="container" style={{marginTop: "-35px"}}>
        <div className="glass-filter shadow-lg rounded-5 p-2 mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
           {["All", "Tech", "Science", "Social Science", "Humanities"].map(cat => (
              <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
        </div>

        {/* --- PROGRAM GRID --- */}
        <div className="row g-4 px-lg-4 pb-5">
          {filteredPrograms.map((program, index) => (
            <div className="col-xl-6 col-lg-6" key={index}>
              <div className="horizontal-program-card shadow-sm h-100 bg-white border-0 rounded-4 overflow-hidden" onClick={() => setSelectedProgram(program)}>
                <div className="row g-0 h-100">
                  <div className="col-4 overflow-hidden card-img-container">
                    <img src={program.image} className="h-100 w-100 transition-zoom" style={{objectFit: 'cover'}} alt={program.title} />
                  </div>
                  <div className="col-8">
                    <div className="card-body p-3 p-md-4 d-flex flex-column h-100">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="fw-bold text-navy mb-1">{program.title}</h6>
                        <i className="bi bi-arrow-up-right text-info small"></i>
                      </div>
                      <p className="text-muted small lh-sm d-none d-md-block">{program.description}</p>
                      <div className="d-flex align-items-center justify-content-between mt-auto">
                        <span className="fw-bold extra-small text-primary"><i className="bi bi-clock me-1"></i> {program.duration}</span>
                        <span className="badge rounded-pill" style={{backgroundColor: program.color, fontSize: '8px'}}>{program.category.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css');
        
        .extra-small { font-size: 0.7rem; }
        .text-navy { color: #0a192f; }
        .btn-navy { background: #0a192f; color: white; }
        .btn-navy:hover { background: #112240; color: white; }

        .hero-modern {
          position: relative;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)), 
                      url('https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') center/cover no-repeat;
        }

        .glass-filter {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          width: fit-content; 
          margin: 0 auto;
          border: 1px solid rgba(0,0,0,0.05);
          z-index: 10;
          position: relative;
        }

        .filter-btn {
          border: none; background: transparent; padding: 8px 20px;
          border-radius: 50px; font-weight: 700; color: #64748b;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }

        .filter-btn.active { background: #0a192f; color: white; }

        .horizontal-program-card {
          cursor: pointer; transition: all 0.4s ease;
          border: 1px solid #f1f5f9 !important;
        }

        .horizontal-program-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
          border-color: #0dcaf0 !important;
        }

        .transition-zoom { transition: transform 0.6s ease; }
        .horizontal-program-card:hover .transition-zoom { transform: scale(1.05); }

        .custom-drawer-backdrop {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 25, 47, 0.7); backdrop-filter: blur(5px);
          z-index: 3000; display: flex; justify-content: flex-end;
        }

        .side-drawer {
          background: white; width: 100%; max-width: 450px;
          height: 100vh; animation: drawerSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }

        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 768px) {
            .side-drawer { max-width: 100%; }
            .hero-modern { height: 250px; }
            .display-4 { font-size: 2rem; }
            .horizontal-program-card { height: 130px !important; }
        }
      `}</style>
    </div>
  );
};

export default OfferedProgram;