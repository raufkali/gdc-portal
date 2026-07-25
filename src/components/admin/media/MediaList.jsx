// src/components/admin/media/MediaList.jsx
import React, { useState } from "react";

const MediaList = ({ media, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const types = ["All", "image", "video"];

  const filteredMedia = media.filter((m) => {
    const matchesSearch = m.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="media-list">
      <div className="list-header">
        <div className="list-controls">
          <div className="list-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={onAdd}>
          <i className="bi bi-plus-lg"></i> Add Media
        </button>
      </div>

      <div className="media-grid">
        {filteredMedia.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-images"></i>
            <h5>No media found</h5>
            <p>Click "Add Media" to upload</p>
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div key={item.id} className="media-card">
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="media-preview"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={item.url}
                  className="media-preview"
                  alt={item.title}
                />
              )}
              <div className="media-info">
                <div className="media-meta">
                  <span className="media-type">{item.type}</span>
                  <span className="media-category">{item.category}</span>
                </div>
                <p className="media-title">{item.title}</p>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(item.id, item.title)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .media-list { width: 100%; }
        .list-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .list-controls { display: flex; gap: 12px; flex: 1; flex-wrap: wrap; }
        .list-search { display: flex; align-items: center; background: #fff; border-radius: 8px; padding: 8px 14px; gap: 8px; flex: 1; min-width: 180px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .list-search input { border: none; background: none; padding: 6px 0; font-size: 0.875rem; color: #0f172a; outline: none; width: 100%; }
        .filter-select { padding: 8px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; background: #fff; color: #0f172a; cursor: pointer; }
        .btn-primary { padding: 10px 20px; background: linear-gradient(135deg, #B98B33, #8a6a22); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; white-space: nowrap; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(185, 139, 51, 0.3); }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .media-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.2s ease; }
        .media-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .media-preview { width: 100%; height: 160px; object-fit: cover; }
        .media-info { padding: 12px 14px; position: relative; }
        .media-meta { display: flex; gap: 6px; margin-bottom: 4px; }
        .media-type { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: #dbeafe; color: #2563eb; }
        .media-category { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: #f1f5f9; color: #64748b; }
        .media-title { font-weight: 500; color: #0f172a; margin: 4px 0 0; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .btn-delete { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: none; color: #94a3b8; padding: 4px 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
        .btn-delete:hover { color: #ef4444; }
        .empty-state { text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; border: 2px dashed #e2e8f0; grid-column: 1 / -1; }
        .empty-state i { font-size: 3rem; color: #cbd5e1; }
        .empty-state h5 { color: #0f172a; margin-top: 12px; }
        .empty-state p { color: #94a3b8; }
        @media (max-width: 480px) { .media-grid { grid-template-columns: 1fr 1fr; } .list-header { flex-direction: column; } .list-controls { width: 100%; } .list-search { min-width: 0; } .btn-primary { width: 100%; justify-content: center; } }
      `}</style>
    </div>
  );
};

export default MediaList;
