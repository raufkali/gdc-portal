// src/page/AboutCollege.jsx
import React, { useState, useEffect } from "react";
import Footer from "./Footer";

const AboutCollege = () => {
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Academic Years", value: "25+" },
    { label: "Expert Faculty", value: "120+" },
    { label: "Graduated Alumni", value: "8000+" },
    { label: "BS Programs", value: "10" },
  ];

  return (
    <>
      <section className="about-hero">
        <div className="container-custom">
          <div className="about-hero-content">
            <span className="hero-badge">About Us</span>
            <h1>
              Empowering the Next <span className="highlight">Generation</span>
            </h1>
            <p>
              Govt. Degree College Gulabad is dedicated to fostering an
              environment of rigorous academic inquiry and professional
              integrity.
            </p>
          </div>
        </div>
      </section>

      <section className="about-main">
        <div className="container-custom">
          <div className="about-grid">
            <div className="about-image">
              <img
                src="collegemain.jpg"
                alt="GDC Gulabad Campus"
                className="rounded-image"
              />
            </div>

            <div className="about-text">
              <h2>A Legacy of Excellence</h2>
              <p>
                Govt. Degree College Gulabad is dedicated to fostering an
                environment of rigorous academic inquiry and professional
                integrity. We provide students with the tools to navigate a
                complex global landscape.
              </p>

              <div className="about-stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="about-stat">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>

              <button
                className="btn-gdc btn-gdc-primary"
                onClick={() => setShowStory(!showStory)}
              >
                {showStory ? "Read Less" : "Discover Our Story"}
              </button>

              {showStory && (
                <div className="about-story">
                  <p>
                    Founded with a vision to bring quality higher education to
                    the region, GDC Gulabad has evolved from a small building
                    into a sprawling modern campus. Our alumni now lead in
                    fields of medicine, engineering, and public service across
                    the country.
                  </p>
                  <ul>
                    <li>
                      <i className="bi bi-check-circle-fill text-gold"></i>{" "}
                      Modern Science Labs
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill text-gold"></i>{" "}
                      Digital Library Access
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill text-gold"></i>{" "}
                      Career Counseling Cell
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .about-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .about-hero-content { max-width: 700px; }
        .about-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; font-family: var(--font-serif); }
        .about-hero-content h1 .highlight { color: var(--gdc-gold); }
        .about-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); line-height: 1.7; }
        .about-main { padding: 80px 0; background: #f8f9fa; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .rounded-image { width: 100%; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        .about-text h2 { font-size: 2.2rem; margin-bottom: 16px; font-family: var(--font-serif); }
        .about-text p { color: #555; line-height: 1.8; }
        .about-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
        .about-stat { text-align: center; padding: 12px; background: #fff; border-radius: 8px; }
        .about-stat h3 { font-size: 1.5rem; color: var(--gdc-gold); font-family: var(--font-serif); }
        .about-stat p { font-size: 0.75rem; color: #6c757d; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .about-story { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; }
        .about-story ul { list-style: none; padding: 0; margin: 12px 0 0; }
        .about-story ul li { padding: 4px 0; font-size: 0.9rem; color: #444; display: flex; align-items: center; gap: 8px; }
        .text-gold { color: var(--gdc-gold); }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-hero { padding: 100px 0 40px; }
          .about-hero-content h1 { font-size: 2.2rem; }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
};

export default AboutCollege;
