// src/page/Media.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Footer from "./Footer";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const items = [];
        snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
        setMedia(items);
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filtered =
    filter === "all" ? media : media.filter((m) => m.category === filter);

  const categories = ["all", "campus", "events", "sports"];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-gold" role="status" />
      </div>
    );
  }

  return (
    <>
      <section className="media-hero">
        <div className="container-custom">
          <div className="media-hero-content">
            <span className="hero-badge">Gallery</span>
            <h1>
              Media <span className="highlight">Hub</span>
            </h1>
            <p>Explore campus life through photos and videos</p>
          </div>
        </div>
      </section>

      <section className="media-gallery">
        <div className="container-custom">
          <div className="media-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="media-grid">
            {filtered.length === 0 ? (
              <div className="media-empty">
                <i className="bi bi-images"></i>
                <h5>No media found</h5>
                <p>Check back later for updates.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="media-item"
                  onClick={() => setSelected(item)}
                >
                  {item.type === "video" ? (
                    <video src={item.url} muted playsInline />
                  ) : (
                    <img src={item.url} alt={item.title} />
                  )}
                  <div className="media-overlay">
                    <span>{item.title}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {selected && (
        <div className="media-modal" onClick={() => setSelected(null)}>
          <div
            className="media-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelected(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            {selected.type === "video" ? (
              <video src={selected.url} controls autoPlay />
            ) : (
              <img src={selected.url} alt={selected.title} />
            )}
            <div className="modal-info">
              <h5>{selected.title}</h5>
              <p>{selected.description}</p>
              <small>
                {selected.category} · {selected.date || "Recent"}
              </small>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .media-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .media-hero-content { max-width: 600px; }
        .media-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; font-family: var(--font-serif); }
        .media-hero-content h1 .highlight { color: var(--gdc-gold); }
        .media-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .media-gallery { padding: 60px 0; background: #f8f9fa; }
        .media-filters { display: flex; gap: 8px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
        .media-filters .filter-btn {
          padding: 8px 24px; border: none; border-radius: 50px; font-weight: 600; font-size: 0.85rem;
          background: #fff; color: #6c757d; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .media-filters .filter-btn:hover { background: #e9ecef; }
        .media-filters .filter-btn.active { background: #b8860b; color: #fff; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .media-item {
          position: relative; border-radius: 12px; overflow: hidden; cursor: pointer;
          aspect-ratio: 4/3; background: #e9ecef;
        }
        .media-item img, .media-item video {
          width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;
        }
        .media-item:hover img, .media-item:hover video { transform: scale(1.05); }
        .media-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 40px 16px 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          color: #fff; opacity: 0; transition: opacity 0.3s ease;
        }
        .media-item:hover .media-overlay { opacity: 1; }
        .media-overlay span { font-weight: 600; font-size: 0.9rem; }
        .media-empty { text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; grid-column: 1 / -1; }
        .media-empty i { font-size: 3rem; color: #cbd5e1; }
        .media-empty h5 { margin: 16px 0 4px; }
        .media-empty p { color: #94a3b8; }
        .media-modal {
          position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 40px;
        }
        .media-modal-content {
          position: relative; max-width: 800px; width: 100%; max-height: 90vh; overflow: auto;
          background: #fff; border-radius: 16px;
        }
        .media-modal-content img, .media-modal-content video { width: 100%; max-height: 60vh; object-fit: contain; }
        .modal-close {
          position: absolute; top: 12px; right: 16px;
          background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;
          z-index: 10; background: rgba(0,0,0,0.4); width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-info { padding: 20px; }
        .modal-info h5 { margin: 0; font-family: var(--font-serif); }
        .modal-info p { color: #6c757d; margin: 4px 0 0; }
        .modal-info small { color: #adb5bd; }

        @media (max-width: 768px) {
          .media-hero { padding: 100px 0 40px; }
          .media-hero-content h1 { font-size: 2.2rem; }
          .media-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .media-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default Media;
