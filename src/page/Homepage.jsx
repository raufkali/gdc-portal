import React, { useState, useEffect } from "react";
import Principal from "./Principal";
import StatsBar from "./StatsBar";
import Departments from "./Departments";
import FacultyProfiles from "./FacultyProfiles";
import Footer from "./Footer";
import AboutCollege from "./AboutCollege";
import AdminResultUpload from "./AdminResultUpload";

import CollegeFaq from "./CollegeFaq";
import { Link } from "react-router-dom"; 

// --- Typing Effect Component ---
function TypingEffect({ text, speed = 60 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <h1 className="hero-title fw-bold text-white mb-3" style={{ lineHeight: '1.1' }}>
      {displayedText}<span className="text-primary animate-pulse">|</span>
    </h1>
  );
}

function Homepage() {
  const images = [
    "collegemain.jpg",
    "newclg.jpg",
    "collegemain.jpg",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80",
  ];

 const resourceLinks = [
  { label: 'Admissions', icon: 'bi-mortarboard', url: 'https://admission.hed.gkp.pk/', isExternal: true },
  { label: 'E-Library', icon: 'bi-book', url: '#', isExternal: false },
  { label: 'Exam Results', icon: 'bi-award', url: '/exam-reslut', isExternal: false },
  { label: 'Faculty', icon: 'bi-people', url: '#', isExternal: false }
];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="homepage-wrapper overflow-x-hidden" style={{ width: '100vw' }}>
      
      {/* 1. HERO SECTION */}
      <section 
        className="hero-section position-relative w-100 overflow-hidden" 
        style={{ minHeight: '100vh' }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.4)), url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentIndex === idx ? 1 : 0,
              zIndex: currentIndex === idx ? 1 : 0,
              transform: currentIndex === idx ? 'scale(1.08)' : 'scale(1)',
              transition: 'opacity 1.5s ease-in-out, transform 8s linear'
            }}
          />
        ))}

        <div className="container h-100 position-relative" style={{ zIndex: 10, paddingTop: '120px', paddingBottom: '80px' }}>
          <div className="row h-100 align-items-center">
            
            <div className="col-lg-8 text-white animate-fade-in">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: '50px', height: '3px', background: '#0D6EFD' }}></div>
                <span className="text-uppercase tracking-widest fw-bold small" style={{ letterSpacing: '4px' }}>Established 1995</span>
              </div>
              
              <TypingEffect text="Shape Your Future at GDC Gulabad" />
              
              <p className="lead opacity-75 mb-4 d-none d-md-block hero-desc">
                Join a community dedicated to academic rigor and character building under the Higher Education Department of KPK.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-5 mb-lg-0">
                <a href="https://admission.hed.gkp.pk/" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg rounded-1 px-5 py-3 fw-bold shadow-lg border-0 btn-glow">
                  Apply Now
                </a>
              </div>

              {/* --- MOBILE QUICK LINKS GRID (Visible only on Mobile) --- */}
              <div className="d-lg-none mt-5">
                <div className="mb-3 d-flex align-items-center gap-2">
                  <div style={{ width: '30px', height: '2px', background: '#0D6EFD' }}></div>
                  <span className="text-white small fw-bold text-uppercase tracking-wider">Quick Access</span>
                </div>
                <div className="row g-2">
                  {resourceLinks.map((item, i) => (
                    <div key={i} className="col-6">
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-decoration-none">
                        <div className="mobile-resource-card">
                          <i className={`${item.icon} mb-1`}></i>
                          <span>{item.label}</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- DESKTOP RESOURCE PANEL (Visible only on Desktop) --- */}
            <div className="col-lg-4 d-none d-lg-block">
              <div className="glass-panel p-4 rounded-4 border border-white-50 shadow-lg">
                <h5 className="text-white fw-bold mb-4 border-bottom border-white-50 pb-3">Student Resources</h5>
                <div className="row g-3">
                  {resourceLinks.map((item, i) => (
                    <div key={i} className="col-6">
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-decoration-none">
                        <div className="quick-link-item p-3 text-center rounded-3 border border-white-50 transition-all">
                          <i className={`${item.icon} fs-2 text-white mb-2 d-block`}></i>
                          <span className="text-white small fw-bold uppercase" style={{ fontSize: '0.75rem' }}>{item.label}</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Indicators */}
        <div className="position-absolute bottom-0 start-0 w-100 d-flex px-0" style={{ zIndex: 20 }}>
          {images.map((_, i) => (
            <div key={i} className="flex-grow-1" style={{
                height: '5px',
                background: currentIndex === i ? '#0D6EFD' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.5s ease',
                boxShadow: currentIndex === i ? '0 0 15px #0D6EFD' : 'none'
            }} />
          ))}
        </div>
      </section>

      {/* 2. BODY CONTENT */}
      <div className="main-content-area bg-white position-relative" style={{ zIndex: 30 }}>
        <Principal />
        <StatsBar />
        <CollegeFaq />
        <AboutCollege />
        <Departments />
        <FacultyProfiles />
        <AdminResultUpload></AdminResultUpload>
        <Footer />
      </div>

      <style>{`
        body, html { margin: 0; padding: 0; overflow-x: hidden; }
        .hero-title { font-size: calc(1.8rem + 2vw); }
        .hero-desc { max-width: 600px; font-size: 1.1rem; }

        /* Desktop Glass Panel */
        .glass-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .quick-link-item {
          cursor: pointer;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }
        .quick-link-item:hover {
          background: #0D6EFD;
          transform: translateY(-8px);
          border-color: #0D6EFD !important;
        }

        /* Mobile Resource Cards */
        .mobile-resource-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 20px 10px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .mobile-resource-card i { font-size: 1.6rem; color: #0D6EFD; }
        .mobile-resource-card span { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-top: 5px; }
        .mobile-resource-card:active { background: #0D6EFD; transform: scale(0.95); }
        .mobile-resource-card:active i { color: white; }

        /* Animations */
        .btn-glow:hover { box-shadow: 0 0 20px rgba(13, 110, 253, 0.6) !important; }
        .animate-pulse { animation: pulse 1.2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-fade-in { animation: fadeInUp 1s ease-out; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 991px) {
          .hero-section { height: auto !important; min-height: 100vh; }
          .hero-title { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
}

export default Homepage;