import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Loader from "../components/common/Loader";
import Masonry from "react-masonry-css";

//  Cache for gallery images
let cachedImages = null;
let cacheTimestamp = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

const Gallery = () => {
  const [images, setImages] = useState(() => {
    if (
      cachedImages &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedImages;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedImages &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedImages &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (
        cachedImages &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setImages(cachedImages);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, "gallery"));
        let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (data.length > 0) {
          cachedImages = data;
          cacheTimestamp = Date.now();
          setImages(data);
          setFromCache(false);
        } else {
          const fallback = FALLBACK_IMAGES;
          cachedImages = fallback;
          cacheTimestamp = Date.now();
          setImages(fallback);
          setFromCache(false);
        }
      } catch (error) {
        console.error("❌ Error fetching gallery:", error);
        if (cachedImages) {
          setImages(cachedImages);
          setFromCache(true);
        } else {
          const fallback = FALLBACK_IMAGES;
          cachedImages = fallback;
          cacheTimestamp = Date.now();
          setImages(fallback);
          setFromCache(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const openLightbox = (img) => {
    setSelectedImage(img);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) return <Loader />;

  // Masonry breakpoints
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
        paddingTop: "5rem",
      }}
    >
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.4rem 1.5rem",
              borderRadius: "50px",
              marginBottom: "0.75rem",
            }}
          >
            Visual Stories
          </span>
          <h1
            className="fw-bold"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            Media <span style={{ color: "#A51C30" }}>Gallery</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Explore our campus life, events, and achievements through images
          </p>
          {fromCache && process.env.NODE_ENV === "development" && (
            <span
              style={{
                fontSize: "0.65rem",
                color: "#28a745",
                background: "rgba(40, 167, 69, 0.1)",
                padding: "0.15rem 0.8rem",
                borderRadius: "50px",
                display: "inline-block",
                marginTop: "0.5rem",
              }}
            >
              ⚡ Cached
            </span>
          )}
        </div>

        {/* Pinterest-style Masonry Grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
          style={{
            display: "flex",
            marginLeft: "-16px",
            width: "auto",
          }}
        >
          {images.map((img, index) => {
            // Generate random heights for Pinterest effect (300-500px)
            const randomHeight = 300 + Math.floor(Math.random() * 200);

            return (
              <div
                key={img.id}
                className="gallery-item"
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 50, 500)}
                data-aos-once="true"
                style={{
                  paddingLeft: "16px",
                  marginBottom: "16px",
                }}
              >
                <div
                  className="card border-0 overflow-hidden"
                  style={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    backgroundColor: "var(--card-bg)",
                    position: "relative",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    transition:
                      "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease",
                    transform:
                      hoveredIndex === index
                        ? "translateY(-8px)"
                        : "translateY(0)",
                    boxShadow:
                      hoveredIndex === index
                        ? "0 20px 40px rgba(165, 28, 48, 0.15)"
                        : "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => openLightbox(img)}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      height: `${randomHeight}px`,
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || "Gallery image"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        transform:
                          hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div style="
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(145deg, #f8f9fa, #e9ecef);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #adb5bd;
                            font-size: 3rem;
                          ">
                            <i class="bi bi-image"></i>
                          </div>
                        `;
                      }}
                    />

                    {/* Overlay - Clean and Minimal */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "2rem 1.5rem 1.5rem",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                        opacity: hoveredIndex === index ? 1 : 0,
                        transition: "opacity 0.4s ease, transform 0.4s ease",
                        transform:
                          hoveredIndex === index
                            ? "translateY(0)"
                            : "translateY(10px)",
                        pointerEvents: "none",
                      }}
                    >
                      {img.caption && (
                        <div
                          style={{
                            color: "#fff",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            lineHeight: "1.3",
                          }}
                        >
                          {img.caption}
                        </div>
                      )}
                      <div
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.7rem",
                          marginTop: "0.3rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            background: "#A51C30",
                            padding: "0.15rem 0.6rem",
                            borderRadius: "50px",
                            fontSize: "0.6rem",
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          View
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption visible always (below image) */}
                  {img.caption && (
                    <div
                      className="px-3 py-2"
                      style={{
                        borderTop: "1px solid rgba(165, 28, 48, 0.06)",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          color: "var(--color-text)",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Masonry>

        {/* Image Count */}
        {images.length > 0 && (
          <div className="text-center mt-4">
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
              }}
            >
              <i className="bi bi-images me-1"></i>
              {images.length} image{images.length > 1 ? "s" : ""} in gallery
            </p>
          </div>
        )}
      </div>

      {/* ===== LIGHTBOX ===== */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            animation: "fadeIn 0.3s ease",
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "2rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              color: "#fff",
              fontSize: "2rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 10,
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(165, 28, 48, 0.8)";
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.05)";
              e.target.style.transform = "rotate(0)";
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>

          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || "Gallery image"}
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x600?text=Image+Not+Found";
              }}
            />
            {selectedImage.caption && (
              <div
                style={{
                  padding: "1rem 1.5rem",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1rem",
                  backdropFilter: "blur(10px)",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <i className="bi bi-image me-2"></i>
                {selectedImage.caption}
              </div>
            )}
          </div>

          {/* Navigation hint */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.8rem",
              background: "rgba(0,0,0,0.3)",
              padding: "0.5rem 1.5rem",
              borderRadius: "50px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <i className="bi bi-x-circle me-2"></i>
            Click outside or press ESC to close
          </div>
        </div>
      )}

      {/* Add some global styles for the masonry grid */}
      <style>{`
        .masonry-grid {
          display: flex;
          margin-left: -16px;
          width: auto;
        }
        .masonry-grid-column {
          padding-left: 16px;
          background-clip: padding-box;
        }
        .gallery-item {
          margin-bottom: 16px;
          break-inside: avoid;
        }
        
        /* Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .gallery-item {
            margin-bottom: 12px;
          }
          .masonry-grid {
            margin-left: -12px;
          }
          .masonry-grid-column {
            padding-left: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
