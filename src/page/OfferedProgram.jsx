// src/page/OfferedProgram.jsx
import React, { useState, useEffect } from "react";

const OfferedProgram = () => {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const programs = [
    {
      title: "BS Computer Science",
      category: "Tech",
      duration: "4 Years",
      color: "#b8860b",
      description: "Master software engineering, AI, and data structures.",
      details:
        "Our BSCS program focuses on Software Development, Artificial Intelligence, and Cybersecurity.",
    },
    {
      title: "BS Mathematics",
      category: "Science",
      duration: "4 Years",
      color: "#0a1628",
      description:
        "Explore the language of the universe through calculus and algebra.",
      details: "Advanced training in pure and applied mathematics.",
    },
    {
      title: "BS English",
      category: "Humanities",
      duration: "4 Years",
      color: "#6c757d",
      description: "Enhance critical thinking through world literature.",
      details: "A deep dive into classical prose, poetry, and modern drama.",
    },
    {
      title: "BS Physics",
      category: "Science",
      duration: "4 Years",
      color: "#1a2a4a",
      description: "Unlock the mysteries of matter and energy.",
      details: "Rigorous training in Quantum Mechanics and Astrophysics.",
    },
    {
      title: "BS Chemistry",
      category: "Science",
      duration: "4 Years",
      color: "#198754",
      description: "Study molecular structures and chemical reactions.",
      details: "Hands-on experience in Organic and Inorganic Chemistry.",
    },
    {
      title: "BS Zoology",
      category: "Science",
      duration: "4 Years",
      color: "#20c997",
      description: "Analyze animal life, genetics, and ecology.",
      details: "Fieldwork and specimen analysis of animal physiology.",
    },
    {
      title: "BS Economics",
      category: "Social Science",
      duration: "4 Years",
      color: "#d97706",
      description: "Understand global financial systems and markets.",
      details: "Focuses on Macroeconomics and Econometrics.",
    },
    {
      title: "BS Political Science",
      category: "Social Science",
      duration: "4 Years",
      color: "#dc3545",
      description: "Study governance and international relations.",
      details: "Analyze political systems and international law.",
    },
  ];

  const filtered =
    filter === "All" ? programs : programs.filter((p) => p.category === filter);

  return (
    <>
      {/* Hero */}
      <section className="programs-hero">
        <div className="container-custom">
          <div className="programs-hero-content">
            <span className="hero-badge">Programs</span>
            <h1>
              Offered <span className="highlight">Programs</span>
            </h1>
            <p>4-year professional BS degrees across diverse disciplines</p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="programs-content">
        <div className="container-custom">
          <div className="programs-filters">
            {["All", "Tech", "Science", "Social Science", "Humanities"].map(
              (cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? "active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ),
            )}
          </div>

          <div className="programs-grid">
            {filtered.map((program, i) => (
              <div
                key={i}
                className="program-card"
                onClick={() => setSelected(program)}
              >
                <div
                  className="program-color"
                  style={{ background: program.color }}
                />
                <h5>{program.title}</h5>
                <p>{program.description}</p>
                <div className="program-meta">
                  <span className="program-category">{program.category}</span>
                  <span className="program-duration">
                    <i className="bi bi-clock"></i> {program.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="program-modal" onClick={() => setSelected(null)}>
          <div
            className="program-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelected(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div
              className="program-modal-header"
              style={{ background: selected.color }}
            >
              <h3>{selected.title}</h3>
              <span>{selected.category}</span>
            </div>
            <div className="program-modal-body">
              <p>{selected.details}</p>
              <div className="program-modal-meta">
                <span>
                  <i className="bi bi-clock"></i> {selected.duration}
                </span>
              </div>
              <button className="btn-gdc btn-gdc-primary">Apply Now</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .programs-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .programs-hero-content { max-width: 600px; }
        .programs-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; }
        .programs-hero-content h1 .highlight { color: #b8860b; }
        .programs-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .programs-content { padding: 60px 0; background: #f8f9fa; }
        .programs-filters { display: flex; gap: 8px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
        .programs-filters .filter-btn { padding: 8px 24px; border: none; border-radius: 50px; font-weight: 600; font-size: 0.85rem; background: #fff; color: #6c757d; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .programs-filters .filter-btn:hover { background: #e9ecef; }
        .programs-filters .filter-btn.active { background: #0a1628; color: #fff; }
        .programs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .program-card { background: #fff; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border-top: 4px solid transparent; }
        .program-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .program-color { width: 40px; height: 4px; border-radius: 2px; margin-bottom: 12px; }
        .program-card h5 { margin: 0 0 4px; }
        .program-card p { color: #6c757d; font-size: 0.9rem; margin: 0 0 12px; }
        .program-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .program-category { font-size: 0.7rem; padding: 2px 12px; border-radius: 20px; background: #f8f9fa; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; }
        .program-duration { font-size: 0.8rem; color: #6c757d; }
        .program-duration i { margin-right: 4px; }
        .program-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .program-modal-content { max-width: 500px; width: 100%; background: #fff; border-radius: 16px; overflow: hidden; }
        .program-modal-header { padding: 24px; color: #fff; }
        .program-modal-header h3 { color: #fff; margin: 0; }
        .program-modal-header span { font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
        .program-modal-body { padding: 24px; }
        .program-modal-body p { color: #444; line-height: 1.7; }
        .program-modal-meta { margin: 16px 0 20px; }
        .program-modal-meta span { display: inline-block; padding: 6px 16px; background: #f8f9fa; border-radius: 8px; font-size: 0.85rem; color: #0a1628; }
        .program-modal-meta span i { margin-right: 6px; }
        .modal-close { position: absolute; top: 12px; right: 16px; background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.2rem; cursor: pointer; }
        .program-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .program-modal-content { position: relative; max-width: 500px; width: 100%; background: #fff; border-radius: 16px; overflow: hidden; }
        @media (max-width: 768px) {
          .programs-hero { padding: 100px 0 40px; }
          .programs-hero-content h1 { font-size: 2.2rem; }
        }
      `}</style>
    </>
  );
};

export default OfferedProgram;
