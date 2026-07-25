// src/components/admin/notices/NoticeList.jsx
import React, { useState } from "react";

const NoticeList = ({ notices, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = [
    "All",
    "General",
    "Admission",
    "Exams",
    "Events",
    "Holidays",
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesSearch = n.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || n.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category) => {
    const colors = {
      General: "#64748b",
      Admission: "#2563eb",
      Exams: "#dc2626",
      Events: "#0891b2",
      Holidays: "#d97706",
    };
    return { background: colors[category] || "#64748b" };
  };

  return (
    <div className="notice-list">
      <div className="list-header">
        <div className="list-controls">
          <div className="list-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={onAdd}>
          <i className="bi bi-plus-lg"></i> New Notice
        </button>
      </div>

      <div className="table-container">
        {filteredNotices.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-megaphone"></i>
            <h5>No notices found</h5>
            <p>Click "New Notice" to create one</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((notice) => (
                <tr key={notice.id}>
                  <td>
                    <span
                      className="category-badge"
                      style={getCategoryBadge(notice.category)}
                    >
                      {notice.category}
                    </span>
                  </td>
                  <td className="notice-title">{notice.title}</td>
                  <td>
                    {notice.date
                      ? new Date(notice.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(notice.id, notice.title)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .notice-list { width: 100%; }
        .list-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .list-controls { display: flex; gap: 12px; flex: 1; flex-wrap: wrap; }
        .list-search { display: flex; align-items: center; background: #fff; border-radius: 8px; padding: 8px 14px; gap: 8px; flex: 1; min-width: 180px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .list-search input { border: none; background: none; padding: 6px 0; font-size: 0.875rem; color: #0f172a; outline: none; width: 100%; }
        .filter-select { padding: 8px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; background: #fff; color: #0f172a; cursor: pointer; }
        .btn-primary { padding: 10px 20px; background: linear-gradient(135deg, #B98B33, #8a6a22); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; white-space: nowrap; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .table-container { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; text-align: left; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .admin-table tr:hover { background: #f8fafc; }
        .category-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; color: #fff; }
        .notice-title { font-weight: 500; color: #0f172a; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 6px 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
        .btn-delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-state i { font-size: 3rem; color: #cbd5e1; }
        .empty-state h5 { color: #0f172a; margin-top: 12px; }
        .empty-state p { color: #94a3b8; }
        @media (max-width: 640px) { .list-header { flex-direction: column; } .list-controls { width: 100%; } .list-search { min-width: 0; } .btn-primary { width: 100%; justify-content: center; } .admin-table { font-size: 0.8rem; } .admin-table th, .admin-table td { padding: 8px 10px; } }
      `}</style>
    </div>
  );
};

export default NoticeList;
