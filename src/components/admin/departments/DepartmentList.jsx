// src/components/admin/departments/DepartmentList.jsx
import React, { useState } from "react";

const DepartmentList = ({ departments, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = departments.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hod?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="department-list">
      <div className="list-header">
        <div className="list-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={onAdd}>
          <i className="bi bi-plus-lg"></i> Add Department
        </button>
      </div>

      <div className="department-grid">
        {filteredDepartments.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-building"></i>
            <h5>No departments found</h5>
            <p>Click "Add Department" to get started</p>
          </div>
        ) : (
          filteredDepartments.map((dept) => (
            <div key={dept.id} className="department-card">
              <div className="dept-header">
                <h5>{dept.name}</h5>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(dept.id, dept.name)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <p className="dept-hod">
                <strong>HOD:</strong> {dept.hod}
              </p>
              <p className="dept-desc">{dept.description}</p>
              <div className="dept-courses">
                {dept.courses?.map((course, idx) => (
                  <span key={idx} className="course-tag">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .department-list { width: 100%; }
        .list-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .list-search { display: flex; align-items: center; background: #fff; border-radius: 8px; padding: 8px 14px; gap: 8px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .list-search input { border: none; background: none; padding: 6px 0; font-size: 0.875rem; color: #0f172a; outline: none; width: 100%; }
        .btn-primary { padding: 10px 20px; background: linear-gradient(135deg, #B98B33, #8a6a22); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; white-space: nowrap; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .department-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .department-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.2s ease; }
        .department-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .dept-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; }
        .dept-header h5 { font-weight: 700; color: #0f172a; margin: 0; font-family: 'Lora', serif; }
        .dept-hod { font-size: 0.9rem; color: #475569; margin-bottom: 4px; }
        .dept-desc { font-size: 0.85rem; color: #64748b; margin-bottom: 12px; }
        .dept-courses { display: flex; flex-wrap: wrap; gap: 6px; }
        .course-tag { padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500; background: #f1f5f9; color: #475569; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 4px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
        .btn-delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .empty-state { text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; border: 2px dashed #e2e8f0; grid-column: 1 / -1; }
        .empty-state i { font-size: 3rem; color: #cbd5e1; }
        .empty-state h5 { color: #0f172a; margin-top: 12px; }
        .empty-state p { color: #94a3b8; }
        @media (max-width: 480px) { .department-grid { grid-template-columns: 1fr; } .list-header { flex-direction: column; } .list-search { width: 100%; } .btn-primary { width: 100%; justify-content: center; } }
      `}</style>
    </div>
  );
};

export default DepartmentList;
