// src/components/admin/dashboard/DashboardStats.jsx
import React from "react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      {stats.map((stat) => (
        <div key={stat.key} className="stat-card">
          <div
            className="stat-icon"
            style={{ background: `${stat.color}15`, color: stat.color }}
          >
            <i className={`bi ${stat.icon}`}></i>
          </div>
          <div className="stat-info">
            <h3>{stat.count}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}

      <style>{`
        .dashboard-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.2s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
        .stat-info h3 { font-weight: 700; color: #0f172a; margin: 0; font-size: 1.5rem; }
        .stat-info p { color: #94a3b8; font-size: 0.8rem; margin: 0; }
        @media (max-width: 480px) { .dashboard-stats { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
};

export default DashboardStats;
