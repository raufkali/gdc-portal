// src/components/admin/AdminSidebar.jsx
import React from "react";

const AdminSidebar = ({
  activeTab,
  onTabChange,
  onLogout,
  isOpen,
  onClose,
  isMobile,
}) => {
  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { key: "teachers", label: "Teachers", icon: "bi-people-fill" },
    { key: "notices", label: "Notices", icon: "bi-megaphone-fill" },
    { key: "results", label: "Results", icon: "bi-file-earmark-pdf-fill" },
    { key: "departments", label: "Departments", icon: "bi-building-fill" },
    { key: "media", label: "Media", icon: "bi-images" },
    { key: "principal", label: "Principal Desk", icon: "bi-person-badge" },
  ];

  return (
    <>
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">GDC</div>
          <div className="brand-text">
            <h5>Admin Panel</h5>
            <p>Gulabad Campus</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`sidebar-nav-item ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => {
                onTabChange(tab.key);
                if (isMobile) onClose();
              }}
            >
              <i className={`bi ${tab.icon}`}></i>
              <span>{tab.label}</span>
              {activeTab === tab.key && (
                <span className="active-indicator"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item logout" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-sidebar { width: 280px; min-height: 100vh; background: #0f172a; padding: 24px 16px; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 1000; transition: transform 0.3s ease; }
        .sidebar-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px; }
        .brand-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Georgia', serif; font-weight: 700; font-size: 18px; color: #fff; background: radial-gradient(circle at 30% 30%, #d3ac5c, #8a6a22); flex-shrink: 0; }
        .brand-text h5 { color: #fff; font-weight: 700; margin: 0; font-family: 'Lora', serif; font-size: 1.1rem; }
        .brand-text p { color: #94a3b8; font-size: 0.7rem; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; border-radius: 8px; background: transparent; color: #94a3b8; font-weight: 500; font-size: 0.9rem; transition: all 0.2s ease; cursor: pointer; width: 100%; text-align: left; position: relative; }
        .sidebar-nav-item i { font-size: 1.2rem; width: 24px; }
        .sidebar-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .sidebar-nav-item.active { background: rgba(185, 139, 51, 0.12); color: #B98B33; }
        .active-indicator { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 24px; background: #B98B33; border-radius: 2px; }
        .sidebar-nav-item.logout { margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; color: #ef4444; }
        .sidebar-nav-item.logout:hover { background: rgba(239, 68, 68, 0.1); }
        @media (max-width: 768px) { .admin-sidebar { transform: translateX(-100%); } .admin-sidebar.open { transform: translateX(0); } }
      `}</style>
    </>
  );
};

export default AdminSidebar;
