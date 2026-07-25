// src/components/Navbar.jsx (Updated)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch departments from Firestore
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const q = query(collection(db, "departments"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const depts = [];
        querySnapshot.forEach((doc) => {
          depts.push({ id: doc.id, ...doc.data() });
        });
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
      const currentScrollPos = window.pageYOffset;
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 50;
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top transition-all ${visible ? "nav-down" : "nav-up"}`}
      style={{
        background: "#0f172a",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "0.75rem 0",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{ textDecoration: "none" }}
        >
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

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "invert(1)" }}
          ></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/">
                Home
              </Link>
            </li>

            {/* ✅ DYNAMIC ACADEMICS DROPDOWN */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle nav-link-sync"
                href="#"
                data-bs-toggle="dropdown"
              >
                Academics
              </a>
              <ul className="dropdown-menu shadow-xl border-0 p-2 animate-dropdown">
                {loading ? (
                  <li>
                    <span className="dropdown-item text-muted">Loading...</span>
                  </li>
                ) : departments.length === 0 ? (
                  <li>
                    <span className="dropdown-item text-muted">
                      No departments yet
                    </span>
                  </li>
                ) : (
                  departments.map((dept) => (
                    <li key={dept.id}>
                      <Link
                        className="dropdown-item sync-dropdown-item"
                        to={`/department/${dept.id}`}
                      >
                        {dept.name}
                      </Link>
                    </li>
                  ))
                )}
                <li>
                  <hr className="dropdown-divider mx-2" />
                </li>
                <li>
                  <Link
                    className="dropdown-item sync-dropdown-item text-primary"
                    to="/departments"
                  >
                    View All
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle nav-link-sync"
                href="#"
                data-bs-toggle="dropdown"
              >
                Admissions
              </a>
              <ul className="dropdown-menu shadow-xl border-0 p-2 animate-dropdown">
                <li>
                  <Link
                    className="dropdown-item sync-dropdown-item"
                    to="/offered-program"
                  >
                    Offered Programs
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item sync-dropdown-item"
                    to="/eligibility-criteria"
                  >
                    Eligibility
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item sync-dropdown-item"
                    to="/fee-structure"
                  >
                    Fee Structure
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider mx-2" />
                </li>
                <li>
                  <Link
                    className="dropdown-item sync-dropdown-item fw-bold text-primary"
                    to="/online-admission"
                  >
                    Apply Online
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/announcements">
                Announcements
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/media">
                Media
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-sync" to="/contact">
                Contact
              </Link>
            </li>

            <li className="nav-item ms-lg-3">
              <Link to="/gdc-admin-portal" className="btn btn-admin-login">
                <i className="bi bi-shield-lock-fill me-2"></i>
                ADMIN
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .transition-all { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-down { transform: translateY(0); }
        .nav-up { transform: translateY(-100%); }
        .brand-title { font-weight: 800; font-size: 1.2rem; letter-spacing: 0.02em; }
        .brand-subtitle { color: #94a3b8; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; }
        .nav-link-sync { color: #f8fafc !important; opacity: 0.85; font-weight: 500; font-size: 0.9rem; padding: 0.5rem 1rem !important; }
        .nav-link-sync:hover { opacity: 1; color: #3b82f6 !important; }
        .dropdown-menu { background: #1e293b; border-radius: 8px; margin-top: 10px !important; }
        .sync-dropdown-item { color: #cbd5e1 !important; font-size: 0.85rem; padding: 0.6rem 1rem; }
        .sync-dropdown-item:hover { background-color: #334155; color: white !important; transform: translateX(4px); }
        .btn-admin-login { background: linear-gradient(135deg, #B98B33, #8a6a22); color: white; font-size: 0.75rem; font-weight: 700; padding: 0.6rem 1.2rem; border-radius: 4px; border: none; transition: all 0.3s; cursor: pointer; display: flex; align-items: center; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(185, 139, 51, 0.3); text-decoration: none; }
        .btn-admin-login:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(185, 139, 51, 0.5); background: linear-gradient(135deg, #d4a345, #a67a2e); color: white; }
        @keyframes navFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-dropdown { animation: navFade 0.2s ease-out; }
        @media (max-width: 991px) {
          .navbar-collapse { background: #0f172a; padding: 1.5rem; margin-top: 10px; border-radius: 10px; }
          .btn-admin-login { width: 100%; justify-content: center; margin-top: 8px; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
