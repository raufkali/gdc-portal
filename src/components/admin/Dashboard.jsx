// src/admin/Dashboard.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

// Import admin components
import PrincipalSettings from "./settings/PrincipalSettings";
import FacultyManager from "./settings/FacultyManager";
import DepartmentManager from "./settings/DepartmentManager";
import MediaManager from "./settings/MediaManager";
import NoticeManager from "./Posts/NoticeManager";
import ResultManager from "./Posts/ResultManager";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("principal");

  const tabs = [
    { id: "principal", label: "Principal Desk", icon: "bi-person-badge" },
    { id: "faculty", label: "Faculty", icon: "bi-people-fill" },
    { id: "departments", label: "Departments", icon: "bi-building-fill" },
    { id: "media", label: "Media", icon: "bi-images" },
    { id: "notices", label: "Notices", icon: "bi-megaphone-fill" },
    { id: "results", label: "Results", icon: "bi-file-earmark-pdf-fill" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "principal":
        return <PrincipalSettings />;
      case "faculty":
        return <FacultyManager />;
      case "departments":
        return <DepartmentManager />;
      case "media":
        return <MediaManager />;
      case "notices":
        return <NoticeManager />;
      case "results":
        return <ResultManager />;
      default:
        return <PrincipalSettings />;
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">GDC</div>
          <div>
            <h5>Admin Panel</h5>
            <p>Gulabad Campus</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="content-header">
          <h4>{tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}</h4>
        </div>
        {renderContent()}
      </div>

      <style>{`
        .admin-dashboard { display: flex; min-height: 100vh; background: #f1f5f9; font-family: 'Inter', sans-serif; }
        .admin-sidebar {
          width: 260px; min-height: 100vh;
          background: #0f172a; padding: 24px 16px;
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 1000;
        }
        .sidebar-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px; }
        .brand-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Georgia', serif; font-weight: 700; font-size: 18px; color: #fff; background: radial-gradient(circle at 30% 30%, #d3ac5c, #8a6a22); flex-shrink: 0; }
        .sidebar-brand h5 { color: #fff; font-weight: 700; margin: 0; font-size: 1.1rem; }
        .sidebar-brand p { color: #94a3b8; font-size: 0.7rem; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; border-radius: 8px; background: transparent; color: #94a3b8; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; cursor: pointer; width: 100%; text-align: left; }
        .sidebar-nav-item i { font-size: 1.2rem; width: 24px; }
        .sidebar-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .sidebar-nav-item.active { background: rgba(185,139,51,0.12); color: #B98B33; }
        .sidebar-footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
        .sidebar-nav-item.logout { color: #ef4444; }
        .sidebar-nav-item.logout:hover { background: rgba(239,68,68,0.1); }
        .admin-content { margin-left: 260px; padding: 32px; width: calc(100% - 260px); min-height: 100vh; }
        .content-header { margin-bottom: 24px; }
        .content-header h4 { font-weight: 700; color: #0f172a; margin: 0; font-family: 'Lora', serif; }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-content { margin-left: 0; width: 100%; padding: 16px; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
