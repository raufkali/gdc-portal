// src/components/admin/results/ResultList.jsx
import React, { useState } from "react";

const ResultList = ({ results, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("All");

  const semesters = [
    "All",
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  const filteredResults = results.filter((r) => {
    const matchesSearch = r.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSemester =
      filterSemester === "All" || r.semester === filterSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="result-list">
      <div className="list-header">
        <div className="list-controls">
          <div className="list-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
          >
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={onAdd}>
          <i className="bi bi-plus-lg"></i> Upload Result
        </button>
      </div>

      <div className="table-container">
        {filteredResults.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-file-earmark-pdf"></i>
            <h5>No results uploaded</h5>
            <p>Click "Upload Result" to add one</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Session</th>
                <th>Semester</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td className="result-title">{result.title}</td>
                  <td>{result.department}</td>
                  <td>{result.session}</td>
                  <td>
                    <span className="semester-badge">{result.semester}</span>
                  </td>
                  <td>
                    {result.updatedAt?.toDate?.()?.toLocaleDateString() ||
                      "N/A"}
                  </td>
                  <td>
                    <div className="action-group">
                      <a
                        href={result.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view"
                      >
                        <i className="bi bi-eye"></i>
                      </a>
                      <a href={result.pdfUrl} download className="btn-download">
                        <i className="bi bi-download"></i>
                      </a>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(result.id, result.title)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .result-list { width: 100%; }
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
        .result-title { font-weight: 500; color: #0f172a; }
        .semester-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; background: #e2e8f0; color: #475569; }
        .action-group { display: flex; gap: 4px; }
        .btn-view, .btn-download { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: none; color: #64748b; background: transparent; transition: all 0.2s ease; text-decoration: none; }
        .btn-view:hover { background: #dbeafe; color: #2563eb; }
        .btn-download:hover { background: #d1fae5; color: #059669; }
        .btn-delete { background: none; border: none; color: #94a3b8; padding: 6px 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
        .btn-delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-state i { font-size: 3rem; color: #cbd5e1; }
        .empty-state h5 { color: #0f172a; margin-top: 12px; }
        .empty-state p { color: #94a3b8; }
        @media (max-width: 768px) { .list-header { flex-direction: column; } .list-controls { width: 100%; } .list-search { min-width: 0; } .btn-primary { width: 100%; justify-content: center; } .admin-table { font-size: 0.75rem; } .admin-table th, .admin-table td { padding: 6px 8px; } .action-group { flex-wrap: wrap; } }
      `}</style>
    </div>
  );
};

export default ResultList;
