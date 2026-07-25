// src/components/admin/teachers/TeacherList.jsx
import React, { useState } from "react";

const TeacherList = ({ teachers, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dept?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="teacher-list">
      <div className="list-header">
        <div className="list-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={onAdd}>
          <i className="bi bi-plus-lg"></i> Add Teacher
        </button>
      </div>

      <div className="teacher-grid">
        {filteredTeachers.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-people"></i>
            <h5>No teachers found</h5>
            <p>Click "Add Teacher" to get started</p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <img
                src={
                  teacher.url ||
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                }
                alt={teacher.name}
                className="teacher-avatar"
              />
              <div className="teacher-info">
                <h6>{teacher.name}</h6>
                <span className="teacher-dept">{teacher.dept}</span>
                <span className="teacher-qual">{teacher.qualification}</span>
              </div>
              <button
                className="btn-delete"
                onClick={() => onDelete(teacher.id, teacher.name)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .teacher-list { width: 100%; }
        .list-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .list-search { display: flex; align-items: center; background: #fff; border-radius: 8px; padding: 8px 14px; gap: 8px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .list-search input { border: none; background: none; padding: 6px 0; font-size: 0.875rem; color: #0f172a; outline: none; width: 100%; }
        .list-search i { color: #94a3b8; }
        .btn-primary { padding: 10px 20px; background: linear-gradient(135deg, #B98B33, #8a6a22); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; white-space: nowrap; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .teacher-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .teacher-card { background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.2s ease; position: relative; }
        .teacher-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .teacher-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .teacher-info { flex: 1; min-width: 0; }
        .teacher-info h6 { font-weight: 600; color: #0f172a; margin: 0; font-size: 0.95rem; }
        .teacher-dept { display: block; font-size: 0.75rem; color: #B98B33; font-weight: 600; }
        .teacher-qual { display: block; font-size: 0.7rem; color: #94a3b8; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
        .btn-delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .empty-state { text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; border: 2px dashed #e2e8f0; grid-column: 1 / -1; }
        .empty-state i { font-size: 3rem; color: #cbd5e1; }
        .empty-state h5 { color: #0f172a; margin-top: 12px; }
        .empty-state p { color: #94a3b8; }
        @media (max-width: 480px) { .teacher-grid { grid-template-columns: 1fr; } .list-header { flex-direction: column; } .list-search { width: 100%; } .btn-primary { width: 100%; justify-content: center; } }
      `}</style>
    </div>
  );
};

export default TeacherList;
