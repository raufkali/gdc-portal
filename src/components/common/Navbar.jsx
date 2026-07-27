import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { fetchCollection } from "../../firebase/db";

const Navbar = () => {
  const [departments, setDepartments] = useState([]);
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [announcementCount, setAnnouncementCount] = useState(0);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const sidebarRef = useRef(null);

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

  // Fetch announcement count
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await fetchCollection("announcements");
        setAnnouncementCount(data.length);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) setScrolled(true);
      else setScrolled(false);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    setOpenAccordion(null);
  }, [location.pathname]);

  // Lock body scroll while sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      const handleKey = (e) => {
        if (e.key === "Escape") setSidebarOpen(false);
      };
      document.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKey);
      };
    }
    document.body.style.overflow = "";
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  // Main nav links - ADDED CONTACT US
  const mainNavLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/contact", label: "Contact Us" },
  ];

  // Campus Life dropdown
  const campusLifeLinks = [
    { path: "/activities", label: "Activities", icon: "bi-calendar-event" },
    { path: "/gallery", label: "Gallery", icon: "bi-images" },
    { path: "/testimonials", label: "Testimonials", icon: "bi-chat-quote" },
  ];

  // Quick links dropdown
  const quickLinks = [
    {
      path: "/eligibility-criteria",
      label: "Eligibility Criteria",
      icon: "bi-check-circle",
    },
    {
      path: "/exam-result",
      label: "Exam Results",
      icon: "bi-file-earmark-text",
    },
    { path: "/fee-structure", label: "Fee Structure", icon: "bi-cash-stack" },
    { path: "/faq", label: "FAQ", icon: "bi-question-circle" },
  ];

  // Check active states
  const isCampusLifeActive = campusLifeLinks.some(
    (link) => location.pathname === link.path,
  );
  const isQuickLinkActive = quickLinks.some(
    (link) => location.pathname === link.path,
  );
  const isDeptActive = departments.some(
    (d) => location.pathname === `/departments/${d.slug || d.id}`,
  );

  // Sidebar sections
  const sidebarSections = [
    {
      key: "departments",
      label: "Departments",
      active: isDeptActive,
      items: [
        { path: "/departments", label: "All Departments", icon: "bi-building" },
        ...departments.map((d) => ({
          path: `/departments/${d.slug || d.id}`,
          label: d.name,
          icon: "bi-book",
        })),
      ],
    },
    {
      key: "campus",
      label: "Campus Life",
      active: isCampusLifeActive,
      items: campusLifeLinks,
    },
    {
      key: "quick",
      label: "Quick Links",
      active: isQuickLinkActive,
      items: quickLinks,
    },
  ];

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top ${scrolled ? "bg-dark shadow" : "bg-dark"} ${hidden ? "navbar-hidden" : ""}`}
        style={{
          padding: scrolled ? "0.4rem 0" : "0.7rem 0",
          zIndex: 1050,
          transition:
            "transform 0.3s ease, padding 0.3s ease, background 0.3s ease",
          borderBottom: scrolled ? "none" : "1px solid rgba(255,255,255,0.05)",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <div className="container">
          <div className="d-flex align-items-center w-100">
            {/* Logo - LEFT */}
            <Link
              className="navbar-brand text-white fw-bold d-flex align-items-center gap-2"
              to="/"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.4rem",
                letterSpacing: "-0.5px",
                flexShrink: 0,
              }}
            >
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  style={{
                    height: "42px",
                    width: "42px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "38px",
                    width: "38px",
                    borderRadius: "4px",
                    background: "#A51C30",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  G
                </div>
              )}
              <span className="d-none d-sm-inline">
                {settings?.brandName || "GDC Gulabad"}
              </span>
            </Link>

            {/* DESKTOP ONLY: centered nav links */}
            <div className="d-none d-lg-flex flex-grow-1">
              <ul className="navbar-nav mx-auto align-items-lg-center">
                {mainNavLinks.map((link) => (
                  <li className="nav-item" key={link.path}>
                    <Link
                      className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                      to={link.path}
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: "500",
                        fontSize: "0.9rem",
                        padding: "0.5rem 0.9rem",
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
                          width: location.pathname === link.path ? "80%" : "0%",
                          height: "2px",
                          backgroundColor: "#A51C30",
                          transition: "width 0.3s ease",
                        }}
                        className="hover-underline"
                      />
                    </Link>
                  </li>
                ))}

                {/* Departments Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle ${isDeptActive ? "active" : ""}`}
                    href="#"
                    id="departmentsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      padding: "0.5rem 0.9rem",
                      cursor: "pointer",
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
                      padding: "0.4rem 0",
                      minWidth: "200px",
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/departments"
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          padding: "0.5rem 1.2rem",
                          fontSize: "0.9rem",
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
                        style={{ borderColor: "rgba(255,255,255,0.06)" }}
                      />
                    </li>
                    {departments.length > 0 ? (
                      departments.slice(0, 8).map((dept) => (
                        <li key={dept.id}>
                          <Link
                            className="dropdown-item"
                            to={`/departments/${dept.slug || dept.id}`}
                            style={{
                              color: "rgba(255,255,255,0.85)",
                              padding: "0.5rem 1.2rem",
                              fontSize: "0.9rem",
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
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          <i className="bi bi-hourglass me-2"></i> Loading...
                        </span>
                      </li>
                    )}
                    {departments.length > 8 && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/departments"
                          style={{
                            color: "#A51C30",
                            padding: "0.5rem 1.2rem",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                          }}
                        >
                          <i className="bi bi-arrow-right me-2"></i>
                          View All ({departments.length})
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>

                {/* Campus Life Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle ${isCampusLifeActive ? "active" : ""}`}
                    href="#"
                    id="campusLifeDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      padding: "0.5rem 0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    Campus Life
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="campusLifeDropdown"
                    style={{
                      background: "#1A1A1A",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                      padding: "0.4rem 0",
                      minWidth: "190px",
                    }}
                  >
                    {campusLifeLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          className="dropdown-item"
                          to={link.path}
                          style={{
                            color:
                              location.pathname === link.path
                                ? "#A51C30"
                                : "rgba(255,255,255,0.85)",
                            padding: "0.5rem 1.2rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          <i className={`bi ${link.icon} me-2`}></i>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Quick Links Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle ${isQuickLinkActive ? "active" : ""}`}
                    href="#"
                    id="quickLinksDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      padding: "0.5rem 0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    Quick Links
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="quickLinksDropdown"
                    style={{
                      background: "#1A1A1A",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                      padding: "0.4rem 0",
                      minWidth: "200px",
                    }}
                  >
                    {quickLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          className="dropdown-item"
                          to={link.path}
                          style={{
                            color:
                              location.pathname === link.path
                                ? "#A51C30"
                                : "rgba(255,255,255,0.85)",
                            padding: "0.5rem 1.2rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          <i className={`bi ${link.icon} me-2`}></i>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>

            {/* RIGHT: Notification Bell + Login/Dashboard + Mobile Toggler */}
            <div className="d-flex align-items-center gap-2 ms-auto">
              {/* Notification Bell */}
              <Link
                to="/announcements"
                className="position-relative"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "1.2rem",
                  padding: "0.3rem 0.3rem",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "color 0.3s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.8)")
                }
              >
                <i className="bi bi-bell"></i>
                {announcementCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-6px",
                      background: "#dc3545",
                      color: "#fff",
                      fontSize: "0.5rem",
                      fontWeight: "700",
                      minWidth: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                      boxShadow: "0 2px 8px rgba(220, 53, 69, 0.4)",
                      animation: "pulse-badge 2s infinite",
                    }}
                  >
                    {announcementCount > 9 ? "9+" : announcementCount}
                  </span>
                )}
              </Link>

              {/* Desktop: Login/Dashboard Button */}
              <div className="d-none d-lg-block">
                {user ? (
                  <div className="d-flex align-items-center gap-1">
                    <Link
                      className="btn btn-sm"
                      to="/admin"
                      style={{
                        background: "rgba(165, 28, 48, 0.15)",
                        color: "#A51C30",
                        borderRadius: "50px",
                        padding: "0.25rem 1rem",
                        fontWeight: "500",
                        fontSize: "0.8rem",
                        border: "1px solid rgba(165, 28, 48, 0.2)",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#A51C30";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(165, 28, 48, 0.15)";
                        e.target.style.color = "#A51C30";
                      }}
                    >
                      <i className="bi bi-speedometer2 me-1"></i>
                      Dashboard
                    </Link>
                    <button
                      className="btn btn-link btn-sm text-white-50"
                      onClick={logout}
                      style={{
                        textDecoration: "none",
                        fontSize: "0.8rem",
                        padding: "0.25rem 0.5rem",
                      }}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                    </button>
                  </div>
                ) : (
                  <Link
                    className="btn btn-sm"
                    to="/admin/login"
                    style={{
                      background: "#A51C30",
                      color: "#fff",
                      borderRadius: "50px",
                      padding: "0.25rem 1.2rem",
                      fontWeight: "500",
                      fontSize: "0.8rem",
                      border: "none",
                      boxShadow: "0 2px 10px rgba(165, 28, 48, 0.3)",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#7A1523";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(165, 28, 48, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#A51C30";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 2px 10px rgba(165, 28, 48, 0.3)";
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                )}
              </div>

              {/* MOBILE ONLY: hamburger button */}
              <button
                className="navbar-toggler border-0 d-lg-none"
                type="button"
                aria-controls="mobileSidebar"
                aria-expanded={sidebarOpen}
                aria-label="Toggle navigation"
                onClick={() => setSidebarOpen(true)}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "0.35rem 0.6rem",
                  borderRadius: "6px",
                }}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse-badge {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
        `}</style>
      </nav>

      {/* ===================== MOBILE SIDEBAR ===================== */}

      {/* Overlay */}
      <div
        onClick={closeSidebar}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 1060,
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Panel */}
      <aside
        id="mobileSidebar"
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="d-lg-none"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(85vw, 340px)",
          background: "#161616",
          zIndex: 1061,
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1)",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Sidebar header */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{
            padding: "1rem 1.1rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <span
            className="text-white fw-bold"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.15rem",
            }}
          >
            {settings?.brandName || "GDC Gulabad"}
          </span>
          <button
            onClick={closeSidebar}
            aria-label="Close menu"
            className="btn-close btn-close-white"
            style={{ opacity: 0.8 }}
          />
        </div>

        {/* Sidebar links */}
        <div style={{ padding: "0.5rem 0.6rem", flex: 1 }}>
          {mainNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className="d-block"
              style={{
                color:
                  location.pathname === link.path
                    ? "#fff"
                    : "rgba(255,255,255,0.85)",
                background:
                  location.pathname === link.path
                    ? "rgba(165, 28, 48, 0.18)"
                    : "transparent",
                fontWeight: "500",
                fontSize: "0.95rem",
                padding: "0.7rem 0.9rem",
                borderRadius: "8px",
                textDecoration: "none",
                marginBottom: "0.15rem",
              }}
            >
              {link.label}
            </Link>
          ))}

          {sidebarSections.map((section) => {
            const isOpen = openAccordion === section.key;
            return (
              <div key={section.key} style={{ marginBottom: "0.15rem" }}>
                <button
                  onClick={() => toggleAccordion(section.key)}
                  className="d-flex align-items-center justify-content-between w-100 border-0"
                  aria-expanded={isOpen}
                  style={{
                    color: section.active ? "#fff" : "rgba(255,255,255,0.85)",
                    background: section.active
                      ? "rgba(165, 28, 48, 0.18)"
                      : "transparent",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "8px",
                  }}
                >
                  {section.label}
                  <i
                    className="bi bi-chevron-down"
                    style={{
                      transition: "transform 0.25s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      fontSize: "0.8rem",
                    }}
                  ></i>
                </button>

                <div
                  style={{
                    maxHeight: isOpen
                      ? `${section.items.length * 46 + 16}px`
                      : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.28s ease",
                  }}
                >
                  <div style={{ padding: "0.3rem 0.4rem 0.5rem 1.1rem" }}>
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeSidebar}
                        className="d-flex align-items-center"
                        style={{
                          color:
                            location.pathname === item.path
                              ? "#A51C30"
                              : "rgba(255,255,255,0.75)",
                          fontSize: "0.88rem",
                          padding: "0.5rem 0.6rem",
                          borderRadius: "6px",
                          textDecoration: "none",
                        }}
                      >
                        {item.icon && (
                          <i className={`bi ${item.icon} me-2`}></i>
                        )}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar footer: login/dashboard */}
        <div
          style={{
            padding: "0.9rem 1rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          {user ? (
            <div className="d-flex gap-2">
              <Link
                to="/admin"
                onClick={closeSidebar}
                className="btn flex-grow-1"
                style={{
                  background: "rgba(165, 28, 48, 0.15)",
                  color: "#A51C30",
                  borderRadius: "50px",
                  padding: "0.5rem 1rem",
                  fontWeight: "500",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(165, 28, 48, 0.2)",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                style={{ borderRadius: "50px", padding: "0.5rem 1rem" }}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              onClick={closeSidebar}
              className="btn w-100"
              style={{
                background: "#A51C30",
                color: "#fff",
                borderRadius: "50px",
                padding: "0.55rem 1rem",
                fontWeight: "500",
                fontSize: "0.9rem",
                border: "none",
                textAlign: "center",
                display: "block",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
