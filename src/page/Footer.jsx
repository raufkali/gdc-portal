// src/page/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-gdc">
      <div className="container-custom">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>GDC Gulabad</h4>
            <p>
              Government Degree College Gulabad is committed to providing
              quality education and fostering academic excellence in the region.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h6>Quick Links</h6>
            <ul>
              <li>
                <Link to="/about-college">About College</Link>
              </li>
              <li>
                <Link to="/departments">Departments</Link>
              </li>
              <li>
                <Link to="/announcements">Announcements</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h6>Resources</h6>
            <ul>
              <li>
                <a
                  href="https://admission.hed.gkp.pk/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Admissions
                </a>
              </li>
              <li>
                <Link to="/exam-result">Results</Link>
              </li>
              <li>
                <Link to="/eligibility-criteria">Eligibility</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h6>Contact</h6>
            <ul>
              <li>
                <i className="bi bi-geo-alt"></i> Gulabad, Dir Lower, KP
              </li>
              <li>
                <i className="bi bi-telephone"></i> +92 945 123456
              </li>
              <li>
                <i className="bi bi-envelope"></i> info@gdcgulabad.edu.pk
              </li>
              <li>
                <i className="bi bi-clock"></i> Mon-Sat: 08:30 AM - 02:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} GDC Gulabad. All rights reserved.</span>
          <span>Developed for Academic Excellence</span>
        </div>
      </div>

      <style>{`
        .footer-gdc {
          background: #0f172a;
          color: rgba(255,255,255,0.7);
          padding: 60px 0 30px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-gdc .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 40px;
        }
        .footer-gdc .footer-brand h4 {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 12px;
          font-family: var(--font-serif);
        }
        .footer-gdc .footer-brand p {
          font-size: 0.9rem;
          line-height: 1.7;
          max-width: 350px;
          color: rgba(255,255,255,0.6);
        }
        .footer-gdc .footer-socials {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .footer-gdc .footer-socials a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .footer-gdc .footer-socials a:hover {
          background: var(--gdc-gold);
          border-color: var(--gdc-gold);
          color: #fff;
          transform: translateY(-2px);
        }
        .footer-gdc .footer-links h6 {
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer-gdc .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-gdc .footer-links ul li {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footer-gdc .footer-links ul a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .footer-gdc .footer-links ul a:hover {
          color: var(--gdc-gold-light);
        }
        .footer-gdc .footer-links ul li i {
          color: var(--gdc-gold);
          width: 18px;
          font-size: 0.9rem;
        }
        .footer-gdc .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        @media (max-width: 768px) {
          .footer-gdc .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 480px) {
          .footer-gdc .footer-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .footer-gdc .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
