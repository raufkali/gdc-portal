// src/components/admin/AdminHeader.jsx
import React from "react";

const AdminHeader = ({ title, onMenuClick, isMobile }) => {
  return (
    <div className="admin-header">
      {isMobile && (
        <button className="header-menu-btn" onClick={onMenuClick}>
          <i className="bi bi-list"></i>
        </button>
      )}
      <div className="header-title">
        <h4>{title}</h4>
        <p>Manage your college content</p>
      </div>
      <div className="header-actions">
        <div className="header-search">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <style>{`
        .admin-header { background: #fff; padding: 16px 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
        .header-menu-btn { background: none; border: none; font-size: 1.5rem; color: #0f172a; cursor: pointer; padding: 4px; }
        .header-title h4 { font-weight: 700; color: #0f172a; margin: 0; font-family: 'Lora', serif; }
        .header-title p { color: #94a3b8; font-size: 0.8rem; margin: 0; }
        .header-actions { display: flex; align-items: center; gap: 16px; }
        .header-search { display: flex; align-items: center; background: #f1f5f9; border-radius: 8px; padding: 6px 14px; gap: 8px; }
        .header-search i { color: #94a3b8; }
        .header-search input { border: none; background: none; padding: 6px 0; font-size: 0.875rem; color: #0f172a; outline: none; width: 160px; }
        .header-search input::placeholder { color: #94a3b8; }
        @media (max-width: 768px) { .admin-header { padding: 12px 16px; flex-wrap: wrap; } .header-title h4 { font-size: 1.1rem; } .header-search input { width: 100px; } }
      `}</style>
    </div>
  );
};

export default AdminHeader;