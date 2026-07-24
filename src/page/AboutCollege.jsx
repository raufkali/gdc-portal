import React, { useState } from "react"; // Added useState

function AboutCollege() {
  // State to track if the story is expanded
  const [showStory, setShowStory] = useState(false);

  const stats = [
    { label: "Academic Years", value: "25+" },
    { label: "Expert Faculty", value: "120+" },
    { label: "Graduated Alumni", value: "8000+" },
    { label: "BS Programs", value: "10" },
  ];

  return (
    <section className="about-section" style={{ background: "#0f172a", color: "#f8fafc", padding: "100px 0" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          
          {/* Left Side: Visual Experience */}
          <div className="col-lg-6">
            <div className="position-relative">
              <div className="img-container rounded-4 overflow-hidden shadow-2xl">
                <img
                  src="collegemain.jpg" 
                  alt="GDC Gulabad Campus"
                  className="img-fluid w-90"
                  style={{ transition: 'transform 0.6s ease' }}
                />
              </div>
              
              <div className="floating-badge d-none d-md-block">
                <div className="p-4 rounded-4 shadow-lg text-center" style={{ background: "rgba(30, 41, 59, 0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <h2 className="fw-bold mb-0 text-primary">A+</h2>
                  <span className="small text-uppercase fw-bold text-white-50">HEC Ranked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="col-lg-6">
            <div className="ps-lg-4">
              <div className="d-flex align-items-center mb-3">
                <div style={{ width: "40px", height: "2px", background: "#3b82f6", marginRight: "15px" }}></div>
                <span className="text-primary fw-bold text-uppercase" style={{ letterSpacing: "3px", fontSize: "0.8rem" }}>
                  A Legacy of Excellence
                </span>
              </div>
              
              <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Empowering the Next Generation of Leaders
              </h1>
              
              <p className="text-secondary-light mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#94a3b8" }}>
                Govt. Degree College Gulabad is dedicated to fostering an environment of rigorous academic 
                inquiry and professional integrity. We provide students with the tools to navigate a complex 
                global landscape.
              </p>

              {/* Stats Grid */}
              <div className="row g-4 mt-2">
                {stats.map((stat, index) => (
                  <div className="col-sm-6" key={index}>
                    <div className="stat-card p-4 h-100 rounded-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <h2 className="fw-bold mb-1" style={{ color: "#3b82f6" }}>{stat.value}</h2>
                      <p className="mb-0 text-white-50 fw-semibold" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* REVEALED CONTENT (The Story) */}
              <div className={`story-content ${showStory ? 'expanded' : ''}`}>
                <div className="pt-4 border-top border-secondary mt-4">
                    <h5 className="text-white fw-bold">Our Journey</h5>
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                        Founded with a vision to bring quality higher education to the region, GDC Gulabad 
                        has evolved from a small building into a sprawling modern campus. Our alumni now 
                        lead in fields of medicine, engineering, and public service across the country.
                    </p>
                    <ul className="list-unstyled" style={{ color: "#94a3b8" }}>
                        <li><i className="bi bi-check2-circle text-primary me-2"></i> Modern Science Labs</li>
                        <li><i className="bi bi-check2-circle text-primary me-2"></i> Digital Library Access</li>
                        <li><i className="bi bi-check2-circle text-primary me-2"></i> Career Counseling Cell</li>
                    </ul>
                </div>
              </div>

              {/* TOGGLE BUTTON */}
              <div className="mt-5">
                <button className="btn-discover" onClick={() => setShowStory(!showStory)}>
                  <span>{showStory ? "SHOW LESS" : "DISCOVER OUR STORY"}</span>
                  <div className={`icon-circle ${showStory ? 'rotate-icon' : ''}`}>
                    <svg width="15" height="15" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 19L20.5 12L13.5 5M4.5 12H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        /* Reveal Animation Logic */
        .story-content {
          max-height: 0;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(20px);
        }

        .story-content.expanded {
          max-height: 500px; /* Adjust based on content height */
          opacity: 1;
          transform: translateY(0);
        }

        .rotate-icon {
          transform: rotate(90deg);
          background: #ef4444 !important; /* Changes to red when showing "Less" */
        }

        /* Button Styles */
        .btn-discover {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 8px 8px 25px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .btn-discover .icon-circle {
          background: #3b82f6;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          transition: all 0.4s ease;
        }

        .btn-discover:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }

        /* Standard Visuals */
        .img-container:hover img { transform: scale(1.05); }
        .text-primary { color: #3b82f6 !important; }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover {
          background: rgba(255,255,255,0.07) !important;
          border-color: #3b82f6 !important;
          transform: translateY(-5px);
        }
      `}</style>
    </section>
  );
}

export default AboutCollege;