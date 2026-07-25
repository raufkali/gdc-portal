// src/components/Media.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../page/Footer"; 

const Media = () => {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setMediaItems(items);
      } catch (err) {
        console.error("Error connecting to Firebase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const downloadMedia = async (url, title) => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Failed to download image asset.");
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="bg-white min-vh-100">
        
        <div 
          className="position-relative py-5 d-flex align-items-center text-center" 
          style={{ 
            background: "linear-gradient(rgba(10, 25, 47, 0.92), rgba(10, 25, 47, 0.92)), url('https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat",
            minHeight: "380px"
          }}
        >
          <div className="container text-white mt-4">
            <h6 className="text-info text-uppercase fw-bold mb-2" style={{ letterSpacing: "3px", fontSize: "0.8rem" }}>
              Digital Archive
            </h6>
            <h1 className="display-5 fw-bold mb-3">Media <span className="text-info">Hub</span></h1>
            
            <div className="mx-auto" style={{ maxWidth: "450px" }}>
              <div className="input-group bg-white rounded-pill overflow-hidden p-1 shadow-lg">
                <span className="input-group-text bg-white border-0 ps-4">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-0 py-2 ps-2 shadow-none small" 
                  placeholder="Search gallery..." 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            {["all", "campus", "events", "sports"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`btn rounded-pill px-4 py-1 fw-bold text-uppercase transition-all ${
                  filter === cat ? "btn-info text-white shadow-sm" : "btn-light text-secondary"
                }`}
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Syncing Archive...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4 mb-5">
              {filteredMedia.length > 0 ? (
                filteredMedia.map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4" onClick={() => setSelectedItem(item)}>
                    <div className="card border-0 rounded-4 overflow-hidden shadow-sm hover-lift bg-white h-100">
                      <div className="position-relative overflow-hidden" style={{ height: "240px" }}>
                        {item.type === 'video' && !item.url.includes("youtube.com") && !item.url.includes("youtu.be") && !item.url.includes("embed") ? (
                          <video src={item.url} className="h-100 w-100 object-fit-cover" muted playsInline />
                        ) : (
                          <img 
                            src={item.type === 'video' ? 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80' : item.url} 
                            className="card-img-top h-100 w-100 object-fit-cover transition-img" 
                            alt={item.title} 
                          />
                        )}
                        <div className="media-type-tag">
                          {item.type === 'video' ? <i className="bi bi-play-circle-fill text-info"></i> : <i className="bi bi-camera-fill"></i>}
                        </div>
                      </div>
                      <div className="card-body p-4 text-center">
                        <span className="text-info small fw-bold text-uppercase mb-1 d-block" style={{fontSize: '0.7rem'}}>{item.category}</span>
                        <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No operational media items found inside this tier.</p>
                </div>
              )}
            </div>
          )}

          {selectedItem && (
            <div className="modal-overlay animate-fade-in" onClick={() => setSelectedItem(null)}>
              <div className="modal-card animate-slide-up shadow-lg" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedItem(null)}>&times;</button>
                <div className="row g-0">
                  <div className="col-lg-7 bg-black d-flex align-items-center justify-content-center">
                    {selectedItem.type === "image" ? (
                      <img src={selectedItem.url} className="img-fluid w-100 h-100 object-fit-contain" alt="Full view" />
                    ) : (
                      selectedItem.url.includes("youtube.com") || selectedItem.url.includes("youtu.be") || selectedItem.url.includes("embed") ? (
                        <iframe className="w-100 h-100" style={{ minHeight: "400px" }} src={selectedItem.url} allowFullScreen title="video"></iframe>
                      ) : (
                        <video src={selectedItem.url} controls className="w-100" style={{ maxHeight: "500px" }} />
                      )
                    )}
                  </div>
                  <div className="col-lg-5 p-4 p-lg-5 bg-white d-flex flex-column justify-content-center">
                    <div className="mb-4">
                      <span className="badge bg-info mb-2 px-3 py-2 rounded-pill text-uppercase" style={{fontSize: '0.65rem'}}>{selectedItem.category}</span>
                      <h3 className="fw-bold text-dark mb-1">{selectedItem.title}</h3>
                      <p className="text-muted small mb-0"><i className="bi bi-calendar3 me-2"></i>{selectedItem.date || "Recent"}</p>
                    </div>
                    
                    <p className="text-secondary small mb-5" style={{ lineHeight: "1.7" }}>{selectedItem.description}</p>
                    
                    <div className="mt-auto">
                      {selectedItem.type === "image" ? (
                        <button 
                          className="btn btn-info w-100 py-3 rounded-pill text-white fw-bold shadow-sm"
                          disabled={isDownloading}
                          onClick={() => downloadMedia(selectedItem.url, selectedItem.title)}
                        >
                          <i className={`bi ${isDownloading ? 'bi-hourglass-split' : 'bi-download'} me-2`}></i> 
                          {isDownloading ? "Downloading Asset..." : "Download Original"}
                        </button>
                      ) : (
                        selectedItem.url.includes("youtube.com") || selectedItem.url.includes("youtu.be") ? (
                          <a href={selectedItem.url} target="_blank" rel="noreferrer" className="btn btn-outline-info w-100 py-3 rounded-pill fw-bold">
                            <i className="bi bi-youtube me-2"></i> Open Stream Platform
                          </a>
                        ) : (
                          <a href={selectedItem.url} download={`${selectedItem.title.replace(/\s+/g, '-').toLowerCase()}.mp4`} className="btn btn-info w-100 py-3 rounded-pill text-white fw-bold">
                            <i className="bi bi-download me-2"></i> Save Video to Device
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          .hover-lift { cursor: pointer; transition: all 0.4s ease; }
          .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(10, 25, 47, 0.1) !important; }
          .transition-img { transition: transform 0.6s ease; }
          .hover-lift:hover .transition-img { transform: scale(1.08); }
          
          .media-type-tag { position: absolute; bottom: 15px; right: 15px; color: white; font-size: 1.4rem; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
          
          .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 25, 47, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-card { background: white; width: 100%; max-width: 1000px; border-radius: 25px; overflow: hidden; position: relative; }
          .modal-close { position: absolute; top: 15px; right: 20px; font-size: 2rem; background: none; border: none; color: #333; z-index: 10; cursor: pointer; }
          
          .animate-fade-in { animation: fadeIn 0.3s forwards; }
          .animate-slide-up { animation: slideUp 0.4s ease-out; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          
          .object-fit-cover { object-fit: cover; }
          .object-fit-contain { object-fit: contain; }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default Media;