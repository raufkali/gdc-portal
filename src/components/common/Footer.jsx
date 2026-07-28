import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="site-footer pt-5 pb-3">
      <div className="container">
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <div className="footer-logo mb-4 d-flex align-items-center gap-3">
              {/* Logo */}
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  style={{
                    height: "50px",
                    width: "50px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "8px",
                    background: "#A51C30",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  G
                </div>
              )}
              <div>
                <h3 className="fw-bold text-white mb-0">
                  GDC <span className="text-crimson">GULABAD</span>
                </h3>
                <small className="text-uppercase tracking-wider text-secondary-light">
                  Govt. Degree College Gulabad (Dir Lower)
                </small>
              </div>
            </div>
            <p className="footer-about-text text-secondary-muted pe-lg-4">
              Providing quality education and fostering academic excellence
              since our inception. We empower students to lead with knowledge
              and integrity in a changing world.
            </p>
            <div className="d-flex gap-3 mt-4">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                >
                  <i className="bi bi-facebook"></i>
                </a>
              )}
              {settings?.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              )}
              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              )}
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6 ps-lg-5">
            <h5 className="text-white fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/about">About College</Link>
              </li>
              <li>
                <Link to="/departments">Our Departments</Link>
              </li>
              <li>
                <Link to="/programs">Offered Programs</Link>
              </li>
              <li>
                <Link to="/announcements">Latest News</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="text-white fw-bold mb-4">Resources</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/exam-result">Exam Results</Link>
              </li>
              <li>
                <Link to="/gallery">Media Gallery</Link>
              </li>
              <li>
                <Link to="/eligibility-criteria">Eligibility</Link>
              </li>
              <li>
                <Link to="/faq">FAQs</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-4">Visit Us</h5>
            <div className="contact-item d-flex mb-3">
              <i className="bi bi-geo-alt-fill text-crimson me-3 fs-5"></i>
              <p className="text-secondary-muted mb-0">
                {settings?.contactAddress ||
                  "Gulabad, Tehsil Adenzai, District Dir Lower, KP, Pakistan"}
              </p>
            </div>
            <div className="contact-item d-flex mb-3">
              <i className="bi bi-telephone-fill text-crimson me-3 fs-5"></i>
              <p className="text-secondary-muted mb-0">
                {settings?.contactPhone || "+92 (0945) 123456"}
              </p>
            </div>
            <div className="contact-item d-flex mb-3">
              <i className="bi bi-envelope-at-fill text-crimson me-3 fs-5"></i>
              <p className="text-secondary-muted mb-0">
                {settings?.contactEmail || "info@gdcgulabad.edu.pk"}
              </p>
            </div>

            <div className="mt-4 p-3 rounded-3 office-hours-card">
              <small
                className="d-block text-white fw-bold mb-2 text-uppercase"
                style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
              >
                Office Hours
              </small>
              <div className="d-flex justify-content-between text-secondary-muted small">
                <span>Mon - Sat:</span>
                <span className="text-white">08:30 AM - 02:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-10" />

        <div className="row pt-3 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-secondary-muted mb-0 small">
              &copy; {currentYear}{" "}
              <strong>{settings?.brandName || "GDC Gulabad"}</strong>. All
              Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <p className="text-secondary-muted mb-0 small">
              Developed for{" "}
              <span className="text-white fw-semibold">
                Academic Excellence
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer { background-color: var(--ink, #1E1B18); color: #A39C8E; font-family: 'Inter', sans-serif; border-top: 4px solid var(--crimson, #A51C30); }
        .text-crimson { color: var(--crimson, #A51C30) !important; }
        .text-secondary-light { color: #CBBFAE; }
        .text-secondary-muted { color: #A39C8E; }
        .office-hours-card { background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
        .footer-about-text { font-size: 0.9rem; line-height: 1.7; }
        .footer-links li { margin-bottom: 14px; }
        .footer-links a { color: #A39C8E; text-decoration: none; transition: all 0.3s ease; font-size: 0.95rem; display: inline-block; }
        .footer-links a:hover { color: var(--crimson, #A51C30); transform: translateX(5px); }
        .social-icon-btn { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 4px; background: rgba(255,255,255,0.04); color: #A39C8E; text-decoration: none; transition: 0.3s all ease; border: 1px solid rgba(255,255,255,0.08); }
        .social-icon-btn:hover { background: var(--crimson, #A51C30); color: white; border-color: var(--crimson, #A51C30); }
        .tracking-wider { letter-spacing: 1px; }
        @media (max-width: 768px) {
          .site-footer { text-align: center; }
          .contact-item { justify-content: center; }
          .footer-links a:hover { transform: none; color: var(--crimson, #A51C30); }
          .footer-logo { display: flex; flex-direction: column; align-items: center; }
          .footer-logo .d-flex { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
