import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Aboutcolleg() {
  const [activeTab, setActiveTab] = useState('mission');

  // Ensures page starts at the top when navigated to from Footer
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabContent = {
    mission: "To provide accessible, high-quality education that empowers students from all backgrounds to achieve their full potential and contribute meaningfully to society.",
    vision: "To be a leading regional institution recognized for academic excellence, innovative teaching, and the development of character and leadership.",
  };

  return (
    <div>
    <section className="about-section py-5 bg-white overflow-hidden">
      <div className="container py-lg-5">
        <div className="row g-5 align-items-center">
          
          {/* --- LEFT SIDE: LAYERED IMAGES & STATS --- */}
          <div className="col-lg-6 position-relative">
            <div className="about-img-container">
              {/* Main Image: Modern Campus Architecture */}
              <div className="main-img-box shadow-lg">
                <img 
                  src="collegemain.jpg" 
                  alt="College Campus" 
                  className="img-fluid rounded-4"
                />
              </div>
              
              {/* Accent Image: Students Collaborating */}
              <div className="accent-img-box d-none d-md-block shadow-lg animate-float-slow">
                <img 
                  src="ownimg.jpg" 
                  alt="Students" 
                  className="img-fluid rounded-5 border border-white border-4"
                />
              </div>

              {/* Floating Experience Badge */}
              <div className="stat-card-pro animate-float">
                <span className="h2 fw-bold text-primary d-block mb-0">30+</span>
                <span className="text-uppercase fw-bold text-dark small" style={{letterSpacing: '1px'}}>Years of Excellence</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTENT & TABS --- */}
          <div className="col-lg-6 ps-lg-5">
            <div className="section-title mb-4">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3 fw-bold text-uppercase">Establishment 1995</span>
              <h2 className="display-5 fw-bold text-dark mb-4">
                Inspiring <span className="text-primary">Academic</span> Brilliance
              </h2>
              <p className="lead text-muted mb-4">
                Govt. Degree College Gulabad (Dir Lower) stands as a beacon of knowledge, dedicated to nurturing the next generation of leaders through rigorous academic standards and moral guidance.
              </p>
            </div>

            {/* Mission/Vision Tabs */}
            <div className="tabs-container p-4 bg-light rounded-4 mb-4 border-start border-primary border-4">
              <div className="d-flex gap-3 mb-3">
                <button 
                  onClick={() => setActiveTab('mission')}
                  className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === 'mission' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  Our Mission
                </button>
                <button 
                  onClick={() => setActiveTab('vision')}
                  className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === 'vision' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  Our Vision
                </button>
              </div>
              <p className="text-secondary small fst-italic mb-0 animate-fade-in" key={activeTab}>
                "{tabContent[activeTab]}"
              </p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-primary text-white shadow-sm">
                    <i className="bi bi-mortarboard"></i>
                  </div>
                  <h6 className="fw-bold mb-0">Verified Faculty</h6>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-info text-white shadow-sm">
                    <i className="bi bi-laptop"></i>
                  </div>
                  <h6 className="fw-bold mb-0">IT Infrastructure</h6>
                </div>
              </div>
            </div>

            {/* --- ATTRACTIVE BUTTONS --- */}
            <div className="d-flex flex-wrap gap-4 mt-2">
              <Link to="/offered-program" className="btn-attractive btn-gradient-blue">
                <span>View Programs</span>
                <i className="bi bi-arrow-right-short"></i>
              </Link>

              <Link to="/online-admission" className="btn-attractive btn-outline-modern">
                <span>Apply Now</span>
                <i className="bi bi-person-plus"></i>
              </Link>
            </div>
          </div>
      

        </div>
        
      </div>
      <style>{`
        /* Image Layout */
        .about-img-container { position: relative; padding: 20px; }
        .main-img-box { position: relative; z-index: 2; border-radius: 20px; overflow: hidden; }
        .accent-img-box { position: absolute; width: 250px; bottom: -40px; left: -40px; z-index: 3; }
        .stat-card-pro { position: absolute; top: 20px; right: -10px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.12); z-index: 4; text-align: center; min-width: 150px; }
        
        /* Icons */
        .icon-circle { width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

        /* --- ATTRACTIVE BUTTON STYLES --- */
        .btn-attractive {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 38px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.5px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
          border: none;
          z-index: 1;
        }

        .btn-gradient-blue {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: white !important;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
        }

        .btn-gradient-blue:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
        }

        .btn-outline-modern {
          background: #ffffff;
          color: #1e293b !important;
          border: 2px solid #e2e8f0;
        }

        .btn-outline-modern:hover {
          transform: translateY(-5px);
          background: #1e293b;
          color: #ffffff !important;
          border-color: #1e293b;
        }

        .btn-attractive i { font-size: 1.2rem; transition: transform 0.3s ease; }
        .btn-attractive:hover i { transform: translateX(5px); }

        .btn-attractive::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
          z-index: -1;
        }
        .btn-attractive:hover::after { left: 100%; }

        /* Animations */
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 991px) {
          .accent-img-box { display: none; }
          .stat-card-pro { right: 20px; top: -20px; }
          .btn-attractive { width: 100%; }
        }
      `}</style>
      
    </section>
    <Footer></Footer>
    </div>
  );
}

export default Aboutcolleg;