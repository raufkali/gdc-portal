import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const departments = [
    { path: "/computer-science", name: "Computer Science" },
    { path: "/physics", name: "Physics" },
    { path: "/chemistry", name: "Chemistry" },
    { path: "/zoology", name: "Zoology" },
    { path: "/mathematics", name: "Mathematics" },
    { path: "/urdu", name: "Urdu" },
    { path: "/islamic-study", name: "Islamic Study" },
    { path: "/economics", name: "Economics" },
    { path: "/political-science", name: "Political Science" },
    { path: "/english", name: "English" }
  ];

  return (
    <nav 
      className={`navbar navbar-expand-lg fixed-top transition-all ${visible ? 'nav-down' : 'nav-up'}`}
      style={{
        background: "#0f172a", // Deep Slate (Common Footer Background)
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "0.75rem 0"
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ textDecoration: 'none' }}>
          <img
            src="newlogo.jpg"
            alt="GDC Logo"
            width="45"
            height="45"
            className="me-3 rounded-circle border border-secondary"
          />
          <div className="d-flex flex-column">
            <span className="brand-title text-white">GDC GULABAD</span>
            <span className="brand-subtitle">GOVT. DEGREE COLLEGE</span>
          </div>
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            
            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/">Home</Link>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle nav-link-sync" href="#" data-bs-toggle="dropdown">
                Academics
              </a>
              <ul className="dropdown-menu shadow-xl border-0 p-2 animate-dropdown">
                {departments.map((dept, index) => (
                  <li key={index}>
                    <Link className="dropdown-item sync-dropdown-item" to={dept.path}>{dept.name}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle nav-link-sync" href="#" data-bs-toggle="dropdown">
                Admissions
              </a>
              <ul className="dropdown-menu shadow-xl border-0 p-2 animate-dropdown">
                <li><Link className="dropdown-item sync-dropdown-item" to="/offered-program">Offered Programs</Link></li>
                <li><Link className="dropdown-item sync-dropdown-item" to="/eligibility-criteria">Eligibility</Link></li>
                <li><Link className="dropdown-item sync-dropdown-item" to="/fee-structure">Fee Structure</Link></li>
                <li><hr className="dropdown-divider mx-2" /></li>
                <li><Link className="dropdown-item sync-dropdown-item fw-bold text-primary" to="/online-admission">Apply Online</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/announcements">Announcements</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/media">Media</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/contact">Contact</Link>
            </li>

            <li className="nav-item ms-lg-3">
              <Link to="/login" className="btn btn-sync-primary">
                PORTAL LOGIN
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        :root {
          --footer-bg: #0f172a;
          --footer-text: #f8fafc;
          --accent-blue: #3b82f6;
          --font-family: 'Inter', sans-serif;
        }

        .transition-all { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-down { transform: translateY(0); }
        .nav-up { transform: translateY(-100%); }

        .brand-title { 
          font-weight: 800; 
          font-size: 1.2rem; 
          font-family: var(--font-family);
          letter-spacing: 0.02em;
        }
        .brand-subtitle { 
          color: #94a3b8; 
          font-size: 0.65rem; 
          font-weight: 600; 
          letter-spacing: 0.1em;
        }

        .nav-link-sync {
          color: var(--footer-text) !important;
          opacity: 0.85;
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.9rem;
          padding: 0.5rem 1rem !important;
        }
        .nav-link-sync:hover { 
          opacity: 1;
          color: var(--accent-blue) !important; 
        }

        .dropdown-menu { 
          background: #1e293b; 
          border-radius: 8px; 
          margin-top: 10px !important; 
        }
        .sync-dropdown-item {
          color: #cbd5e1 !important;
          font-size: 0.85rem;
          padding: 0.6rem 1rem;
        }
        .sync-dropdown-item:hover {
          background-color: #334155;
          color: white !important;
          transform: translateX(4px);
        }

        .btn-sync-primary {
          background-color: var(--accent-blue);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          border: none;
          transition: 0.2s;
        }
        .btn-sync-primary:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
        }

        @keyframes navFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown { animation: navFade 0.2s ease-out; }

        @media (max-width: 991px) {
          .navbar-collapse {
            background: #0f172a;
            padding: 1.5rem;
            margin-top: 10px;
            border-radius: 10px;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;