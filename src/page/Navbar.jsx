// src/page/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const q = query(collection(db, "departments"), orderBy("name"));
        const snapshot = await getDocs(q);
        const depts = [];
        snapshot.forEach((doc) => depts.push({ id: doc.id, ...doc.data() }));
        setDepartments(depts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav className={`navbar-harvard ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="brand">
          <div className="brand-icon">G</div>
          <div className="brand-text">
            <span className="name">GDC Gulabad</span>
            <span className="tagline">Government Degree College</span>
          </div>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className={`bi ${mobileOpen ? "bi-x-lg" : "bi-list"}`}></i>
        </button>

        <ul className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle">
              Academics
            </a>
            <div className="dropdown-menu">
              {loading ? (
                <a className="text-muted">Loading...</a>
              ) : departments.length === 0 ? (
                <a className="text-muted">No departments</a>
              ) : (
                departments.map((dept) => (
                  <Link key={dept.id} to={`/department/${dept.id}`}>
                    {dept.name}
                  </Link>
                ))
              )}
              <hr
                style={{
                  margin: "4px 16px",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              />
              <Link to="/departments">View All Departments</Link>
            </div>
          </li>

          <li>
            <Link
              to="/announcements"
              className={location.pathname === "/announcements" ? "active" : ""}
            >
              Announcements
            </Link>
          </li>
          <li>
            <Link
              to="/media"
              className={location.pathname === "/media" ? "active" : ""}
            >
              Media
            </Link>
          </li>
          <li>
            <Link
              to="/about-college"
              className={location.pathname === "/about-college" ? "active" : ""}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={location.pathname === "/contact" ? "active" : ""}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link to="/login" className="btn-admin">
              Admin
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        .navbar-harvard {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1050;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent; padding: 0;
        }
        .navbar-harvard.scrolled {
          background: rgba(10, 22, 40, 0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 30px rgba(0,0,0,0.1);
        }
        .navbar-harvard .navbar-container {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 70px;
        }
        .navbar-harvard .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .navbar-harvard .brand-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, var(--gdc-gold-light), var(--gdc-gold-dark));
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-serif); font-weight: 700; font-size: 16px; color: #fff;
        }
        .navbar-harvard .brand-text { color: #fff; line-height: 1.2; }
        .navbar-harvard .brand-text .name { font-family: var(--font-serif); font-weight: 700; font-size: 1.1rem; letter-spacing: 0.5px; }
        .navbar-harvard .brand-text .tagline { font-size: 0.55rem; font-weight: 400; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 2px; display: block; }

        .navbar-harvard .nav-links { display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0; }
        .navbar-harvard .nav-links a {
          color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.85rem; font-weight: 500;
          padding: 8px 16px; border-radius: 6px; transition: all 0.2s ease; position: relative;
        }
        .navbar-harvard .nav-links a:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .navbar-harvard .nav-links a.active { color: var(--gdc-gold-light); }

        .navbar-harvard .nav-links .dropdown { position: relative; }
        .navbar-harvard .nav-links .dropdown-menu {
          position: absolute; top: 100%; left: 0; min-width: 200px;
          background: rgba(26, 42, 74, 0.98); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
          padding: 8px 0; opacity: 0; visibility: hidden; transform: translateY(10px);
          transition: all 0.2s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .navbar-harvard .nav-links .dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .navbar-harvard .nav-links .dropdown-menu a { display: block; padding: 10px 20px; color: rgba(255,255,255,0.7); font-size: 0.85rem; }
        .navbar-harvard .nav-links .dropdown-menu a:hover { background: rgba(255,255,255,0.05); color: #fff; }

        .navbar-harvard .btn-admin {
          background: linear-gradient(135deg, var(--gdc-gold), var(--gdc-gold-dark));
          color: #fff; padding: 8px 20px; border-radius: 50px; font-size: 0.75rem;
          font-weight: 600; text-decoration: none; transition: all 0.3s ease; border: none; cursor: pointer;
        }
        .navbar-harvard .btn-admin:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(184,134,11,0.3); }

        .navbar-harvard .mobile-toggle { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 4px; }

        @media (max-width: 992px) {
          .navbar-harvard .mobile-toggle { display: block; }
          .navbar-harvard .nav-links {
            display: none; flex-direction: column; position: absolute; top: 70px; left: 0; right: 0;
            background: rgba(10, 22, 40, 0.98); backdrop-filter: blur(12px);
            padding: 20px 24px; gap: 4px; border-top: 1px solid rgba(255,255,255,0.05);
          }
          .navbar-harvard .nav-links.open { display: flex; }
          .navbar-harvard .nav-links a { padding: 12px 16px; width: 100%; }
          .navbar-harvard .nav-links .dropdown-menu {
            position: static; opacity: 1; visibility: visible; transform: none;
            background: rgba(255,255,255,0.03); box-shadow: none; padding-left: 20px;
          }
          .navbar-harvard .nav-links .dropdown-menu a { padding: 8px 16px; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
