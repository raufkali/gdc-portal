import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Import all admin components
import ContentManager from "./ContentManager";
import SettingsManager from "./SettingsManager";
import AnnouncementsManager from "./content/AnnouncementsManager";
import ResultsManager from "./content/ResultsManager";

// Dashboard Overview Component
const DashboardOverview = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          bannersSnap,
          programsSnap,
          deptsSnap,
          gallerySnap,
          testimonialsSnap,
          announcementsSnap,
          resultsSnap,
          activitiesSnap,
        ] = await Promise.all([
          getDocs(collection(db, "banners")),
          getDocs(collection(db, "programs")),
          getDocs(collection(db, "departments")),
          getDocs(collection(db, "gallery")),
          getDocs(collection(db, "testimonials")),
          getDocs(collection(db, "announcements")),
          getDocs(collection(db, "examResults")),
          getDocs(collection(db, "activities")),
        ]);

        const activeBanners = bannersSnap.docs.filter(
          (doc) => doc.data().active === true || doc.data().active === "true",
        ).length;

        setStats([
          {
            label: "Banners",
            value: activeBanners || bannersSnap.size,
            icon: "bi-images",
          },
          { label: "Programs", value: programsSnap.size, icon: "bi-book" },
          { label: "Departments", value: deptsSnap.size, icon: "bi-building" },
          { label: "Gallery", value: gallerySnap.size, icon: "bi-image" },
          {
            label: "Testimonials",
            value: testimonialsSnap.size,
            icon: "bi-chat-quote",
          },
          {
            label: "Announcements",
            value: announcementsSnap.size,
            icon: "bi-megaphone",
          },
          {
            label: "Results",
            value: resultsSnap.size,
            icon: "bi-file-earmark-pdf",
          },
          {
            label: "Activities",
            value: activitiesSnap.size,
            icon: "bi-calendar-event",
          },
        ]);

        const announcementsData = announcementsSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(0);
            const dateB = b.date?.toDate?.() || new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5);

        setRecentAnnouncements(announcementsData);

        const resultsData = resultsSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5);

        setRecentResults(resultsData);

        const activitiesData = activitiesSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(0);
            const dateB = b.date?.toDate?.() || new Date(0);
            return dateB - dateA;
          })
          .slice(0, 3);

        setRecentActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#A51C30", width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-1 fw-bold" style={{ color: "var(--color-text)" }}>
            Welcome back, <span style={{ color: "#A51C30" }}>Admin</span>
          </h4>
          <p className="text-muted small mb-0">
            <i className="bi bi-calendar3 me-1"></i>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <span
            className="badge p-2 px-3"
            style={{ background: "rgba(165, 28, 48, 0.08)", color: "#A51C30" }}
          >
            <i
              className="bi bi-circle-fill me-1"
              style={{ fontSize: "8px", color: "#28a745" }}
            ></i>
            Online
          </span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "10px",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6
                      className="text-muted small text-uppercase mb-0 fw-semibold"
                      style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}
                    >
                      {stat.label}
                    </h6>
                    <h3
                      className="fw-bold mb-0"
                      style={{ fontSize: "1.5rem", color: "var(--color-text)" }}
                    >
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(165, 28, 48, 0.08)",
                      color: "#A51C30",
                    }}
                  >
                    <i className={`bi ${stat.icon} fs-5`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6
                  className="fw-bold mb-0"
                  style={{ color: "var(--color-text)" }}
                >
                  <i
                    className="bi bi-megaphone me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Recent Announcements
                </h6>
                <Link
                  to="/admin/announcements"
                  className="btn btn-sm"
                  style={{
                    color: "#A51C30",
                    borderRadius: "50px",
                    padding: "0.15rem 0.8rem",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(165, 28, 48, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  View All
                </Link>
              </div>
              {recentAnnouncements.length === 0 ? (
                <p className="text-muted text-center py-3 small">
                  No announcements yet
                </p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {recentAnnouncements.map((item) => (
                    <li
                      key={item.id}
                      className="d-flex align-items-start gap-2 mb-2 pb-2"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "6px",
                          height: "6px",
                          background: "#A51C30",
                          marginTop: "6px",
                        }}
                      ></div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <p
                          className="mb-0 small fw-medium"
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--color-text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title || "Untitled"}
                        </p>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {formatDate(item.date)}
                          {item.author && ` • ${item.author}`}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6
                  className="fw-bold mb-0"
                  style={{ color: "var(--color-text)" }}
                >
                  <i
                    className="bi bi-file-earmark-pdf me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Recent Results
                </h6>
                <Link
                  to="/admin/results"
                  className="btn btn-sm"
                  style={{
                    color: "#A51C30",
                    borderRadius: "50px",
                    padding: "0.15rem 0.8rem",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(165, 28, 48, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  View All
                </Link>
              </div>
              {recentResults.length === 0 ? (
                <p className="text-muted text-center py-3 small">
                  No results uploaded yet
                </p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {recentResults.map((item) => (
                    <li
                      key={item.id}
                      className="d-flex align-items-start gap-2 mb-2 pb-2"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "6px",
                          height: "6px",
                          background: "#A51C30",
                          marginTop: "6px",
                        }}
                      ></div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <p
                          className="mb-0 small fw-medium"
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--color-text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title || "Untitled"}
                          {item.department && (
                            <span
                              className="text-muted fw-normal"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {" "}
                              • {item.department}
                            </span>
                          )}
                        </p>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {item.year || "No year"}
                          {item.semester && ` • ${item.semester}`}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}
          >
            <div className="card-body p-3 p-md-4">
              <h6
                className="fw-bold mb-3"
                style={{ color: "var(--color-text)" }}
              >
                <i
                  className="bi bi-clock-history me-2"
                  style={{ color: "#A51C30" }}
                ></i>
                Recent Activities
              </h6>
              {recentActivities.length === 0 ? (
                <p className="text-muted text-center py-3 small">
                  No activities yet
                </p>
              ) : (
                <div className="row g-2">
                  {recentActivities.map((item) => (
                    <div key={item.id} className="col-md-4">
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(165, 28, 48, 0.04)",
                          border: "1px solid rgba(165, 28, 48, 0.06)",
                        }}
                      >
                        <p
                          className="mb-0 small fw-medium"
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--color-text)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.title || "Activity"}
                        </p>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {formatDate(item.date)}
                          {item.author && ` • ${item.author}`}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Navigation items - Only main items, no child links
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "bi-grid", exact: true },
    { path: "/admin/content", label: "Content", icon: "bi-folder" },
    {
      path: "/admin/announcements",
      label: "Announcements",
      icon: "bi-megaphone",
    },
    { path: "/admin/results", label: "Results", icon: "bi-file-earmark-pdf" },
    { path: "/admin/settings", label: "Settings", icon: "bi-gear" },
    { path: "/", label: "Home", icon: "bi-house" },
  ];

  const isActive = (path, exact = false) => {
    const currentPath = location.pathname;

    // For Home path "/", only match exactly "/"
    if (path === "/") {
      return currentPath === "/";
    }

    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  return (
    <div className="admin-wrapper d-flex pt-0" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className={`admin-sidebar bg-dark text-white d-flex flex-column ${sidebarOpen ? "open" : ""}`}
        style={{
          width: "280px",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          flexShrink: 0,
          transition: "transform 0.3s ease",
          zIndex: 1040,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: "2px 0 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Brand with Logo */}
        <div className="sidebar-brand p-3 text-center border-bottom border-secondary">
          <div className="d-flex align-items-center justify-content-center gap-2">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                style={{
                  height: "40px",
                  width: "40px",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <div
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "8px",
                  background: "#A51C30",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                G
              </div>
            )}
            <h4
              className="fw-bold mb-0"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span style={{ color: "#A51C30" }}>GDC</span> Gulabad
            </h4>
          </div>
          <small className="text-muted">Admin Panel</small>
        </div>

        {/* Navigation */}
        <nav className="nav flex-column p-3 flex-grow-1">
          {navItems.map((item) => {
            const isItemActive = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link text-white d-flex align-items-center gap-2 py-2 px-3 rounded ${isItemActive ? "active" : ""}`}
                style={{
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  fontSize: "0.95rem",
                  background: isItemActive ? "#A51C30" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isItemActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isItemActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span className="flex-grow-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={logout}
            className="btn w-100"
            style={{
              background: "rgba(165, 28, 48, 0.15)",
              color: "#A51C30",
              borderRadius: "50px",
              padding: "0.4rem 1rem",
              fontWeight: "500",
              fontSize: "0.85rem",
              border: "1px solid rgba(165, 28, 48, 0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#A51C30";
              e.target.style.color = "#fff";
              e.target.style.border = "1px solid #A51C30";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(165, 28, 48, 0.15)";
              e.target.style.color = "#A51C30";
              e.target.style.border = "1px solid rgba(165, 28, 48, 0.2)";
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="d-md-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1039,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className="admin-content flex-grow-1 p-3 p-md-4"
        style={{
          background: "var(--color-bg-alt)",
          minHeight: "100vh",
          marginLeft: "0",
          width: "100%",
        }}
      >
        {/* Mobile Hamburger */}
        <div className="d-flex justify-content-end d-md-none mb-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "sticky",
              top: "10px",
              zIndex: 10,
              borderRadius: "8px",
              background: "#A51C30",
              color: "#fff",
              border: "none",
              padding: "0.4rem 0.8rem",
            }}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/content" element={<ContentManager />} />
          <Route
            path="/content/banners"
            element={<ContentManager initialTab="banners" />}
          />
          <Route
            path="/content/programs"
            element={<ContentManager initialTab="programs" />}
          />
          <Route
            path="/content/departments"
            element={<ContentManager initialTab="departments" />}
          />
          <Route
            path="/content/activities"
            element={<ContentManager initialTab="activities" />}
          />
          <Route
            path="/content/gallery"
            element={<ContentManager initialTab="gallery" />}
          />
          <Route
            path="/content/testimonials"
            element={<ContentManager initialTab="testimonials" />}
          />
          <Route
            path="/content/faqs"
            element={<ContentManager initialTab="faqs" />}
          />
          <Route path="/announcements" element={<AnnouncementsManager />} />
          <Route path="/results" element={<ResultsManager />} />
          <Route path="/settings" element={<SettingsManager />} />
          <Route
            path="/settings/principal"
            element={<SettingsManager section="principal" />}
          />
          <Route
            path="/settings/contact"
            element={<SettingsManager section="contact" />}
          />
          <Route
            path="/settings/social"
            element={<SettingsManager section="social" />}
          />
          <Route
            path="/settings/footer"
            element={<SettingsManager section="footer" />}
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
