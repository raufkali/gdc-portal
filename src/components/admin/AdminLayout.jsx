// src/components/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children, activeTab, onTabChange, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <div className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        <AdminHeader
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
        <div className="admin-content">{children}</div>
      </div>

      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: #f1f5f9; }
        .admin-main { flex: 1; margin-left: 280px; min-height: 100vh; transition: margin-left 0.3s ease; }
        .admin-content { padding: 24px; }
        .sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; }
        @media (max-width: 768px) { .admin-main { margin-left: 0; } .admin-content { padding: 16px; } }
      `}</style>
    </div>
  );
};

export default AdminLayout;
