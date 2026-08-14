import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Cache for gallery
let cachedGallery = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

// Sample fallback images when no images exist
const FALLBACK_IMAGES = [
  {
    id: "fallback-1",
    imageUrl: "https://picsum.photos/seed/campus1/800/600",
    caption: "Campus Life",
  },
  {
    id: "fallback-2",
    imageUrl: "https://picsum.photos/seed/campus2/800/600",
    caption: "Student Activities",
  },
  {
    id: "fallback-3",
    imageUrl: "https://picsum.photos/seed/campus3/800/600",
    caption: "Academic Excellence",
  },
  {
    id: "fallback-4",
    imageUrl: "https://picsum.photos/seed/campus4/800/600",
    caption: "College Events",
  },
  {
    id: "fallback-5",
    imageUrl: "https://picsum.photos/seed/campus5/800/600",
    caption: "Our Campus",
  },
  {
    id: "fallback-6",
    imageUrl: "https://picsum.photos/seed/campus6/800/600",
    caption: "Student Life",
  },
];

const GalleryPreview = () => {
  const [images, setImages] = useState(() => {
    if (
      cachedGallery &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedGallery;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedGallery &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedGallery &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    const fetchGallery = async () => {
      if (
        cachedGallery &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setImages(cachedGallery);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, "gallery"));
        let data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (data.length > 0) {
          cachedGallery = data;
          cacheTimestamp = Date.now();
          setImages(data);
          setFromCache(false);
        } else {
          const fallback = FALLBACK_IMAGES;
          cachedGallery = fallback;
          cacheTimestamp = Date.now();
          setImages(fallback);
          setFromCache(false);
        }
      } catch (error) {
        console.error("Error fetching gallery preview:", error);
        const fallback = FALLBACK_IMAGES;
        cachedGallery = fallback;
        cacheTimestamp = Date.now();
        setImages(fallback);
        setFromCache(false);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading gallery...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!images.length) {
    return null;
  }

  const displayImages = images.slice(0, 6);

  return (
    <section className="py-5">
      <div className="container">
        {/* TITLE SECTION - NOW INCLUDED */}
        <div className="text-center mb-5">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
            }}
          >
            Visual Stories
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.25rem",
            }}
          >
            Media <span style={{ color: "#A51C30" }}>Gallery</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore our campus life through images
          </p>
        </div>

        {/* GALLERY GRID */}
        <div className="row g-3">
          {displayImages.map((img, index) => (
            <div key={img.id} className="col-md-4 col-sm-6">
              <Link
                to="/gallery"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className="card border-0 shadow-sm overflow-hidden"
                  style={{
                    borderRadius: "12px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    backgroundColor: "#fff",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) {
                      const card = e.currentTarget;
                      card.style.transform = "translateY(-5px)";
                      card.style.boxShadow =
                        "0 12px 30px rgba(165, 28, 48, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth > 768) {
                      const card = e.currentTarget;
                      card.style.transform = "translateY(0)";
                      card.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                    }
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      height: "220px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      className="w-100"
                      alt={img.caption || "Gallery"}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />

                    {/* Desktop Overlay with Title - Shows on hover */}
                    <div
                      className="desktop-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.75)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        padding: "1.5rem",
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth > 768) {
                          e.target.style.opacity = "1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth > 768) {
                          e.target.style.opacity = "0";
                        }
                      }}
                    >
                      {img.caption && (
                        <>
                          <h4
                            style={{
                              color: "#fff",
                              margin: 0,
                              fontSize: "1.1rem",
                              fontWeight: "700",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              textAlign: "center",
                              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {img.caption}
                          </h4>
                          <div
                            style={{
                              width: "40px",
                              height: "3px",
                              background: "#A51C30",
                              marginTop: "0.5rem",
                              borderRadius: "2px",
                            }}
                          />
                          <p
                            style={{
                              color: "rgba(255,255,255,0.8)",
                              fontSize: "0.7rem",
                              marginTop: "0.5rem",
                              fontWeight: "300",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                            }}
                          >
                            <i className="bi bi-arrow-right-circle me-1"></i>
                            View Gallery
                          </p>
                        </>
                      )}
                    </div>

                    {/* Mobile Title - Always visible */}
                    <div
                      className="mobile-title"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "1.5rem 1rem 1rem 1rem",
                        background: "rgba(0, 0, 0, 0.7)",
                        display: window.innerWidth <= 768 ? "block" : "none",
                      }}
                    >
                      {img.caption && (
                        <p
                          style={{
                            color: "#fff",
                            margin: 0,
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            fontFamily: "'Playfair Display', Georgia, serif",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="text-center mt-4">
          <Link
            to="/gallery"
            className="btn"
            style={{
              background: "transparent",
              color: "#A51C30",
              padding: "0.7rem 3rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #A51C30",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#A51C30";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 10px 30px rgba(165, 28, 48, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#A51C30";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-grid-3x3-gap-fill me-2"></i> View Full Gallery
          </Link>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-overlay {
            display: none !important;
          }
          .mobile-title {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-title {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GalleryPreview;
