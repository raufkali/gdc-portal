import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer Component for GDC Gulabad
 * Updated: "About College" now navigates to a dedicated route.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  // Function to handle smooth scroll for remaining in-page anchors
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="footer-section pt-5 pb-3">
      <div className="container">
        <div className="row g-4 mb-5">
          
          {/* Column 1: College Identity */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-logo mb-4">
              <h3 className="fw-bold text-white mb-1">
                GDC <span className="text-primary-gradient">GULABAD</span>
              </h3>
              <small className="text-uppercase tracking-wider text-secondary-light">
                Govt. Degree College Gulabad (Dir Lower)
              </small>
            </div>
            <p className="footer-about-text text-secondary-muted pe-lg-4">
              Providing quality education and fostering academic excellence since our inception. 
              We empower students to lead with knowledge and integrity in a changing world.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6 ps-lg-5">
            <h5 className="text-white fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                {/* CHANGED: Now uses Link to navigate to the about route */}
                <Link to="/about-colleg">About College</Link>
              </li>
              <li>
                <a href="#faculty" onClick={(e) => scrollToSection(e, "faculty")}>Our Faculty</a>
              </li>
             <li>
  <a 
    href="https://admission.hed.gkp.pk/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-decoration-none"
  >
    Admissions
  </a>
</li>
             <li>
  <Link to="/offered-program" className="footer-link-btn">
    Departments 
  </Link>
</li>
              <li>
                <Link to="/news">Latest News</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="text-white fw-bold mb-4">Resources</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#portal">Student Portal</a></li>
              <li><a href="#results">Online Result</a></li>
              <li><a href="#library">Library Access</a></li>
              <li><a href="#downloads">Downloads</a></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-4">Visit Us</h5>
            <div className="contact-item d-flex mb-3">
              <i className="bi bi-geo-alt-fill text-primary me-3 fs-5"></i>
              <p className="text-secondary-muted mb-0">
                Gulabad, Tehsil Adenzai, District Dir Lower, KP, Pakistan
              </p>
            </div>
            <div className="contact-item d-flex mb-3">
              <i className="bi bi-telephone-fill text-primary me-3 fs-5"></i>
              <p className="text-secondary-muted mb-0">+92 (0945) 123456</p>
            </div>
            <div className="contact-item d-flex mb-3">
              <i className="bi bi-envelope-at-fill text-primary me-3 fs-5"></i>
              <p className="text-secondary-muted mb-0">info@gdcgulabad.edu.pk</p>
            </div>
            
            <div className="mt-4 p-3 rounded-4 bg-navy-light border border-secondary border-opacity-10">
               <small className="d-block text-white fw-bold mb-2 text-uppercase" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Office Hours</small>
               <div className="d-flex justify-content-between text-secondary-muted small">
                 <span>Mon - Sat:</span>
                 <span className="text-white">08:30 AM - 02:30 PM</span>
               </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-10" />

        {/* Bottom Bar */}
        <div className="row pt-3 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-secondary-muted mb-0 small">
              &copy; {currentYear} <strong>GDC Gulabad</strong>. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <p className="text-secondary-muted mb-0 small">
              Developed for <span className="text-white fw-semibold">Academic Excellence</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: #0F172A; 
          color: #94A3B8;
          font-family: 'Inter', sans-serif;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .text-primary-gradient {
          background: linear-gradient(90deg, #3B82F6, #60A5FA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .text-secondary-light { color: #CBD5E1; }
        .text-secondary-muted { color: #94A3B8; }

        .bg-navy-light {
          background-color: rgba(30, 41, 59, 0.4);
        }

        .footer-about-text {
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .footer-links li {
          margin-bottom: 14px;
        }

        .footer-links a {
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #3B82F6;
          transform: translateX(5px);
        }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          color: #94A3B8;
          text-decoration: none;
          transition: 0.3s all ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .social-icon-btn:hover {
          background: #3B82F6;
          color: white;
          transform: translateY(-5px);
          border-color: #3B82F6;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }

        .tracking-wider { letter-spacing: 1px; }

        @media (max-width: 768px) {
          .footer-section { text-align: center; }
          .contact-item { justify-content: center; }
          .footer-links a:hover { transform: none; color: #3B82F6; }
          .footer-logo { display: flex; flex-direction: column; align-items: center; }
        }
      `}</style>
    </footer>
  );
}

export default Footer;