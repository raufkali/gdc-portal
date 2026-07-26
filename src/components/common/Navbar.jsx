import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { fetchCollection } from "../../firebase/db";

const Navbar = () => {
  const [departments, setDepartments] = useState([]);
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  // Fetch departments from Firestore
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await fetchCollection("departments");
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Close navbar on link click (mobile)
  const closeNavbar = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      const toggler = document.querySelector(".navbar-toggler");
      if (toggler) {
        toggler.click();
      }
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/activities", label: "Activities" },
    { path: "/gallery", label: "Gallery" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-dark shadow-lg"
      style={{
        padding: "0.8rem 0",
        zIndex: 1050,
      }}
    >
      <div className="container">
        {/* Brand / Logo */}
        <Link
          className="navbar-brand text-white fw-bold"
          to="/"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.6rem",
            letterSpacing: "-0.5px",
          }}
        >
          {settings?.brandName || "GDC Gulabad"}
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "0.5rem 0.8rem",
            borderRadius: "4px",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Main Nav Links */}
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                  to={link.path}
                  onClick={closeNavbar}
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    padding: "0.5rem 1rem",
                    position: "relative",
                    transition: "color 0.3s ease",
                  }}
                >
                  {link.label}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: location.pathname === link.path ? "100%" : "0%",
                      height: "2px",
                      backgroundColor: "#A51C30",
                      transition: "width 0.3s ease",
                    }}
                    className="hover-underline"
                  />
                </Link>
              </li>
            ))}

            {/* Departments Dropdown - Hover */}
            <li
              className="nav-item dropdown"
              onMouseEnter={(e) => {
                const dropdown =
                  e.currentTarget.querySelector(".dropdown-menu");
                if (dropdown && window.innerWidth >= 992) {
                  dropdown.classList.add("show");
                }
              }}
              onMouseLeave={(e) => {
                const dropdown =
                  e.currentTarget.querySelector(".dropdown-menu");
                if (dropdown && window.innerWidth >= 992) {
                  dropdown.classList.remove("show");
                }
              }}
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="departmentsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  padding: "0.5rem 1rem",
                }}
                onClick={(e) => {
                  // Only toggle on mobile
                  if (window.innerWidth < 992) {
                    e.preventDefault();
                    const dropdown =
                      e.currentTarget.parentElement.querySelector(
                        ".dropdown-menu",
                      );
                    if (dropdown) {
                      dropdown.classList.toggle("show");
                    }
                  }
                }}
              >
                Departments
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="departmentsDropdown"
                style={{
                  background: "#1A1A1A",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  padding: "0.5rem 0",
                  minWidth: "220px",
                }}
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/departments"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-building me-2"></i>
                    All Departments
                  </Link>
                </li>
                <li>
                  <hr
                    className="dropdown-divider"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  />
                </li>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <li key={dept.id}>
                      <Link
                        className="dropdown-item"
                        to={`/departments/${dept.slug || dept.id}`}
                        onClick={closeNavbar}
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          padding: "0.5rem 1.5rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <i className="bi bi-book me-2"></i>
                        {dept.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span
                      className="dropdown-item text-muted"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <i className="bi bi-hourglass me-2"></i>
                      Loading departments...
                    </span>
                  </li>
                )}
              </ul>
            </li>

            {/* Quick Links Dropdown - Hover */}
            <li
              className="nav-item dropdown"
              onMouseEnter={(e) => {
                const dropdown =
                  e.currentTarget.querySelector(".dropdown-menu");
                if (dropdown && window.innerWidth >= 992) {
                  dropdown.classList.add("show");
                }
              }}
              onMouseLeave={(e) => {
                const dropdown =
                  e.currentTarget.querySelector(".dropdown-menu");
                if (dropdown && window.innerWidth >= 992) {
                  dropdown.classList.remove("show");
                }
              }}
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="quickLinksDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  padding: "0.5rem 1rem",
                }}
                onClick={(e) => {
                  if (window.innerWidth < 992) {
                    e.preventDefault();
                    const dropdown =
                      e.currentTarget.parentElement.querySelector(
                        ".dropdown-menu",
                      );
                    if (dropdown) {
                      dropdown.classList.toggle("show");
                    }
                  }
                }}
              >
                Quick Links
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="quickLinksDropdown"
                style={{
                  background: "#1A1A1A",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  padding: "0.5rem 0",
                  minWidth: "200px",
                }}
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/announcements"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="bi bi-megaphone me-2"></i>
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/media"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="bi bi-images me-2"></i>
                    Media
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/exam-result"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Exam Results
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/fee-structure"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="bi bi-cash-stack me-2"></i>
                    Fee Structure
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/eligibility-criteria"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Eligibility Criteria
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/faq"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      padding: "0.5rem 1.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    FAQ
                  </Link>
                </li>
              </ul>
            </li>

            {/* Login / User Section */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/admin"
                    onClick={closeNavbar}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: "500",
                      fontSize: "0.95rem",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={() => {
                      logout();
                      closeNavbar();
                    }}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: "500",
                      fontSize: "0.95rem",
                      padding: "0.5rem 1rem",
                      textDecoration: "none",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn"
                  to="/admin/login"
                  onClick={closeNavbar}
                  style={{
                    background: "linear-gradient(135deg, #A51C30, #7A1523)",
                    color: "#fff",
                    borderRadius: "50px",
                    padding: "0.4rem 1.5rem",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(165, 28, 48, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(165, 28, 48, 0.3)";
                  }}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
