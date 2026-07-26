import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dummy departments – replace with Firestore data later
  const departments = [
    { name: "Computer Science", slug: "computer-science" },
    { name: "English", slug: "english" },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${scrolled ? "bg-dark shadow" : "bg-transparent"}`}
      style={{ transition: "background 0.3s" }}
    >
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">
          {settings?.brandName || "GDC Gulabad"}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/programs">
                Programs
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="departmentsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Departments
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="departmentsDropdown"
              >
                {departments.map((dept) => (
                  <li key={dept.slug}>
                    <Link
                      className="dropdown-item"
                      to={`/departments/${dept.slug}`}
                    >
                      {dept.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/activities">
                Activities
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gallery">
                Gallery
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/testimonials">
                Testimonials
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            {user ? (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={logout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-light ms-2" to="/admin/login">
                  Sign In
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
