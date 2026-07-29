import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Loader from "../components/common/Loader";

// ✅ Cache for gallery images
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
  // ✅ Initialize with cached data if available
  const [images, setImages] = useState(() => {
    if (
      cachedImages &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      console.log("📦 Gallery images instant from cache");
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

  useEffect(() => {
    const fetchImages = async () => {
      // ✅ If cache is valid, skip fetching
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
        console.log("📡 Fetching gallery images from server...");

        // Fetch all images from gallery collection
        const snap = await getDocs(collection(db, "gallery"));
        let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        console.log(`📦 Found ${data.length} images`);

        if (data.length > 0) {
          // ✅ Cache the data
          cachedImages = data;
          cacheTimestamp = Date.now();
          setImages(data);
          setFromCache(false);
        } else {
          // Use fallback images if no images exist
          console.log("🔄 Using fallback images");
          const fallback = FALLBACK_IMAGES;
          cachedImages = fallback;
          cacheTimestamp = Date.now();
          setImages(fallback);
          setFromCache(false);
        }
      } catch (error) {
        console.error("❌ Error fetching gallery:", error);
        // Use fallback images on error
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

  // Open image in lightbox
  const openLightbox = (img) => {
    setSelectedImage(img);
    document.body.style.overflow = "hidden";
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) return <Loader />;

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
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: "700",
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

        {/* Gallery Grid */}
        <div className="row g-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="col-6 col-md-4 col-lg-3"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  background: "var(--card-bg)",
                  aspectRatio: "1/1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.08)";
                }}
                onClick={() => openLightbox(img)}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Gallery image"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(145deg, #1A1A1A, #2C2C2C);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: rgba(255,255,255,0.1);
                        font-size: 3rem;
                      ">
                        <i class="bi bi-image"></i>
                      </div>
                    `;
                  }}
                />
                {/* Overlay on hover */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem 1rem 1rem",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                  className="gallery-overlay"
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "0";
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                    }}
                  >
                    <i className="bi bi-zoom-in me-1"></i>
                    Click to view
                  </div>
                  {img.caption && (
                    <div
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {img.caption}
                    </div>
                  )}
                </div>
              </div>
              {img.caption && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    marginBottom: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>

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
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "2.5rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "rotate(0)";
            }}
          >
            <i className="bi bi-x"></i>
          </button>

          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "12px",
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
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1rem",
                }}
              >
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
            }}
          >
            Click outside or press ESC to close
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
