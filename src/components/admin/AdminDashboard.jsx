import { useState, useEffect } from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";

// Import all admin components
import ContentManager from "./ContentManager";
import SettingsManager from "./SettingsManager";

// Dashboard Overview Component
const DashboardOverview = () => {
  const { user } = useAuth();
  const { settings } = useSettings();

  // Stats data with real values
  const stats = [
    {
      label: "Total Pages",
      value: "12",
      icon: "bi-file-earmark",
      color: "primary",
      bg: "bg-primary",
    },
    {
      label: "Banners",
      value: "4",
      icon: "bi-images",
      color: "success",
      bg: "bg-success",
    },
    {
      label: "Programs",
      value: "8",
      icon: "bi-book",
      color: "info",
      bg: "bg-info",
    },
    {
      label: "Departments",
      value: "6",
      icon: "bi-building",
      color: "warning",
      bg: "bg-warning",
    },
  ];

  // Recent activity items
  const recentActivities = [
    { action: "New banner added", time: "2 hours ago", icon: "bi-images" },
    {
      action: "Program updated: Computer Science",
      time: "5 hours ago",
      icon: "bi-book",
    },
    {
      action: "New department added: Physics",
      time: "1 day ago",
      icon: "bi-building",
    },
    {
      action: "Gallery updated with 5 new images",
      time: "2 days ago",
      icon: "bi-image",
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-1 fw-bold">
            Welcome back,{" "}
            <span className="text-primary">
              {user?.displayName || user?.email?.split("@")[0] || "Admin"}!
            </span>
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
          <span className="badge bg-success bg-opacity-10 text-success p-2 px-3">
            <i
              className="bi bi-circle-fill me-1"
              style={{ fontSize: "8px" }}
            ></i>
            Online
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-sm-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100 hover-lift">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted small text-uppercase mb-1 fw-semibold">
                      {stat.label}
                    </h6>
                    <h3 className="fw-bold mb-0 display-6">{stat.value}</h3>
                  </div>
                  <div
                    className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${stat.bg} bg-opacity-10`}
                    style={{
                      width: "56px",
                      height: "56px",
                    }}
                  >
                    <i
                      className={`bi ${stat.icon} fs-3 text-${stat.color}`}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-lightning me-2 text-primary"></i>
                Quick Actions
              </h6>
              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/admin/content/banners"
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Banner
                </Link>
                <Link
                  to="/admin/content/programs"
                  className="btn btn-outline-success btn-sm"
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Program
                </Link>
                <Link
                  to="/admin/content/departments"
                  className="btn btn-outline-info btn-sm"
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Department
                </Link>
                <Link
                  to="/admin/content/activities"
                  className="btn btn-outline-warning btn-sm"
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Activity
                </Link>
                <Link
                  to="/admin/content/gallery"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Recent Activity
              </h6>
              <ul className="list-unstyled mb-0">
                {recentActivities.map((activity, idx) => (
                  <li
                    key={idx}
                    className="d-flex align-items-start mb-2 pb-2 border-bottom border-light"
                  >
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                      <i className={`bi ${activity.icon} text-primary`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 small fw-medium">{activity.action}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </li>
                ))}
              </ul>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Navigation items with icons (removed Users & Analytics)
  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "bi-grid",
      exact: true,
    },
    {
      path: "/admin/content",
      label: "Content Management",
      icon: "bi-folder",
    },
    {
      path: "/admin/settings",
      label: "Website Settings",
      icon: "bi-gear",
    },
  ];

  // Check if a path is active
  const isActive = (path, exact = false) => {
    const currentPath = location.pathname;
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  // Check if any child is active
  const isChildActive = (children) => {
    return children?.some((child) => location.pathname === child.path);
  };

  return (
    <div className="admin-wrapper d-flex pt-0" style={{ minHeight: "100vh" }}>
      {/* ===== SIDEBAR ===== */}
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
        {/* Brand */}
        <div className="sidebar-brand p-3 text-center border-bottom border-secondary">
          <h4
            className="fw-bold mb-0"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-primary">GDC</span> Gulabad
          </h4>
          <small className="text-muted">Admin Panel</small>
        </div>

        {/* User Info */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2">
              <i className="bi bi-person-circle fs-3 text-primary"></i>
            </div>
            <div className="flex-grow-1">
              <p
                className="mb-0 fw-semibold text-white"
                style={{ fontSize: "0.95rem" }}
              >
                {user?.displayName || user?.email?.split("@")[0] || "Admin"}
              </p>
              <small className="text-muted">{user?.email}</small>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav flex-column p-3 flex-grow-1">
          {navItems.map((item) => {
            const isItemActive = isActive(item.path, item.exact);
            const hasActiveChild = isChildActive(item.children);
            const isExpanded = isItemActive || hasActiveChild;

            return (
              <div key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`nav-link text-white d-flex align-items-center gap-2 py-2 px-3 rounded ${
                    isItemActive ? "active bg-primary" : ""
                  }`}
                  style={{
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    fontSize: "0.95rem",
                  }}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  {item.children && (
                    <i
                      className={`bi bi-chevron-${isExpanded ? "down" : "right"} small`}
                    ></i>
                  )}
                </Link>

                {/* Sub-items */}
                {item.children && isExpanded && (
                  <div className="ms-3 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`nav-link d-flex align-items-center gap-2 py-1 px-3 rounded small ${
                          location.pathname === child.path
                            ? "active text-white bg-primary bg-opacity-25"
                            : "text-white-50"
                        }`}
                        style={{
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          fontSize: "0.85rem",
                        }}
                      >
                        <i className="bi bi-dot"></i>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={logout}
            className="btn btn-outline-danger btn-sm w-100"
            style={{ borderRadius: "50px" }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* ===== OVERLAY FOR MOBILE ===== */}
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

      {/* ===== MAIN CONTENT ===== */}
      <main
        className="admin-content flex-grow-1 p-4"
        style={{
          background: "var(--color-bg-alt)",
          minHeight: "100vh",
          marginLeft: "0",
          width: "100%",
        }}
      >
        {/* Mobile Hamburger */}
        <button
          className="btn btn-dark d-md-none mb-3"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "sticky",
            top: "10px",
            zIndex: 10,
            borderRadius: "8px",
          }}
        >
          <i className="bi bi-list fs-4"></i>
        </button>

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
