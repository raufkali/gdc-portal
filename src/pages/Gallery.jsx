import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Loader from "../components/common/Loader";
import Masonry from "react-masonry-css";

// Cache for gallery images
let cachedImages = null;
let cacheTimestamp = null;
const CACHE_TTL = 10 * 60 * 1000;

// Sample fallback images
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

// Generate stable heights ONLY ONCE
const addStableHeights = (images) => {
  return images.map((img, index) => ({
    ...img,

    // Deterministic height instead of Math.random()
    displayHeight: 300 + ((index * 73) % 200),
  }));
};

const Gallery = () => {
  const hasValidCache =
    cachedImages && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL;

  const [images, setImages] = useState(hasValidCache ? cachedImages : []);
  const [loading, setLoading] = useState(!hasValidCache);
  const [fromCache, setFromCache] = useState(!!hasValidCache);

  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // =========================
  // FETCH GALLERY
  // =========================

  useEffect(() => {
    const fetchImages = async () => {
      // Use cache if valid
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

        let data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (data.length > 0) {
          // Add stable heights ONCE
          data = addStableHeights(data);

          cachedImages = data;
          cacheTimestamp = Date.now();

          setImages(data);
          setFromCache(false);
        } else {
          const fallback = addStableHeights(FALLBACK_IMAGES);

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
          const fallback = addStableHeights(FALLBACK_IMAGES);

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

  // =========================
  // LIGHTBOX
  // =========================

  const openLightbox = (img) => {
    setSelectedImage(img);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Restore body scroll if component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  // =========================
  // MASONRY BREAKPOINTS
  // =========================

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div
      className="gallery-page py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
        paddingTop: "5rem",
      }}
    >
      <div className="container">
        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="text-center mb-5">
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
        </div>

        {/* =========================
            MASONRY GRID
        ========================= */}

        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {images.map((img, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div key={img.id} className="gallery-item">
                <div
                  className={`gallery-card ${isHovered ? "is-hovered" : ""}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => openLightbox(img)}
                >
                  {/* =========================
                      IMAGE CONTAINER
                  ========================= */}

                  <div
                    className="gallery-image-container"
                    style={{
                      height: `${img.displayHeight}px`,
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || "Gallery image"}
                      className="gallery-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";

                        const parent = e.currentTarget.parentElement;

                        if (parent) {
                          parent.innerHTML = `
                            <div class="image-error">
                              <i class="bi bi-image"></i>
                            </div>
                          `;
                        }
                      }}
                    />

                    {/* =========================
                        DESKTOP HOVER OVERLAY
                    ========================= */}

                    <div className="gallery-overlay">
                      {img.caption && (
                        <>
                          <h4 className="gallery-overlay-title">
                            {img.caption}
                          </h4>

                          <div className="gallery-line" />

                          <p className="gallery-view-text">
                            <i className="bi bi-arrow-up-circle me-1"></i>
                            Click to view
                          </p>
                        </>
                      )}
                    </div>

                    {/* =========================
                        MOBILE CAPTION
                    ========================= */}

                    {img.caption && (
                      <div className="mobile-caption">
                        <p>{img.caption}</p>
                      </div>
                    )}

                    {/* =========================
                        VIEW BADGE
                    ========================= */}

                    <div className="view-badge">
                      <i className="bi bi-eye me-1"></i>
                      View
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Masonry>

        {/* =========================
            IMAGE COUNT
        ========================= */}

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

      {/* =========================
          LIGHTBOX
      ========================= */}

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          {/* CLOSE BUTTON */}

          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          {/* IMAGE */}

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || "Gallery image"}
              className="lightbox-image"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/800x600?text=Image+Not+Found";
              }}
            />

            {selectedImage.caption && (
              <div className="lightbox-caption">
                <i className="bi bi-image me-2"></i>
                {selectedImage.caption}
              </div>
            )}
          </div>

          {/* HELP TEXT */}

          <div className="lightbox-help">
            <i className="bi bi-x-circle me-2"></i>
            Click outside or press ESC to close
          </div>
        </div>
      )}

      {/* =========================
          STYLES
      ========================= */}

      <style>{`
        /* ========================================
           MASONRY
        ======================================== */

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

        /* ========================================
           GALLERY CARD
        ======================================== */

        .gallery-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          cursor: pointer;
          background: var(--card-bg);

          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.06);

          transition:
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .gallery-card:hover {
          box-shadow:
            0 12px 30px rgba(165, 28, 48, 0.15);
        }

        /* ========================================
           IMAGE CONTAINER
        ======================================== */

        .gallery-image-container {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;

          transition:
            transform 0.5s ease,
            filter 0.3s ease;
        }

        .gallery-card:hover .gallery-image {
          transform: scale(1.04);
        }

        /* ========================================
           DESKTOP OVERLAY
        ======================================== */

        .gallery-overlay {
          position: absolute;
          inset: 0;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 1.5rem;

          background: rgba(0, 0, 0, 0.75);

          opacity: 0;

          transition:
            opacity 0.3s ease;
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-overlay-title {
          color: #fff;
          margin: 0;

          font-size: clamp(1rem, 1.2vw, 1.3rem);
          font-weight: 700;

          font-family:
            "Playfair Display",
            Georgia,
            serif;

          text-align: center;

          text-shadow:
            0 2px 10px rgba(0, 0, 0, 0.3);

          letter-spacing: 0.5px;
        }

        .gallery-line {
          width: 40px;
          height: 3px;

          background: #A51C30;

          margin-top: 0.5rem;

          border-radius: 2px;
        }

        .gallery-view-text {
          color: rgba(255, 255, 255, 0.7);

          font-size: 0.7rem;

          margin-top: 0.5rem;

          margin-bottom: 0;

          font-weight: 300;

          letter-spacing: 0.5px;

          text-transform: uppercase;
        }

        /* ========================================
           MOBILE CAPTION
        ======================================== */

        .mobile-caption {
          display: none;

          position: absolute;

          bottom: 0;
          left: 0;
          right: 0;

          padding:
            1.5rem
            1rem
            1rem;

          background:
            linear-gradient(
              transparent,
              rgba(0, 0, 0, 0.8)
            );
        }

        .mobile-caption p {
          color: #fff;

          margin: 0;

          font-size: 0.85rem;

          font-weight: 600;

          font-family:
            "Playfair Display",
            Georgia,
            serif;

          text-shadow:
            0 2px 8px rgba(0, 0, 0, 0.3);

          letter-spacing: 0.3px;
        }

        /* ========================================
           VIEW BADGE
        ======================================== */

        .view-badge {
          position: absolute;

          top: 1rem;
          right: 1rem;

          background: rgba(0, 0, 0, 0.5);

          color: #fff;

          padding:
            0.3rem
            0.8rem;

          border-radius: 50px;

          font-size: 0.65rem;

          font-weight: 600;

          letter-spacing: 1px;

          text-transform: uppercase;

          transition:
            background 0.3s ease,
            transform 0.3s ease;

          backdrop-filter: blur(10px);

          border:
            1px solid
            rgba(255, 255, 255, 0.15);
        }

        .gallery-card:hover .view-badge {
          background: rgba(165, 28, 48, 0.95);

          transform: translateY(-2px);
        }

        /* ========================================
           IMAGE ERROR
        ======================================== */

        .image-error {
          width: 100%;
          height: 100%;

          background:
            linear-gradient(
              145deg,
              #f8f9fa,
              #e9ecef
            );

          display: flex;

          align-items: center;

          justify-content: center;

          color: #adb5bd;

          font-size: 3rem;
        }

        /* ========================================
           LIGHTBOX
        ======================================== */

        .lightbox {
          position: fixed;

          inset: 0;

          background:
            rgba(0, 0, 0, 0.92);

          z-index: 9999;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 2rem;

          animation:
            fadeIn 0.3s ease;
        }

        .lightbox-close {
          position: absolute;

          top: 1.5rem;
          right: 2rem;

          background:
            rgba(255, 255, 255, 0.05);

          border:
            1px solid
            rgba(255, 255, 255, 0.1);

          border-radius: 50%;

          color: #fff;

          font-size: 1.3rem;

          cursor: pointer;

          transition:
            all 0.3s ease;

          z-index: 10;

          width: 50px;
          height: 50px;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .lightbox-close:hover {
          background:
            rgba(165, 28, 48, 0.8);

          transform: rotate(90deg);
        }

        .lightbox-content {
          max-width: 90vw;
          max-height: 85vh;

          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 30px 60px
            rgba(0, 0, 0, 0.5);

          animation:
            lightboxScale 0.3s ease;
        }

        .lightbox-image {
          max-width: 90vw;
          max-height: 85vh;

          object-fit: contain;

          display: block;
        }

        .lightbox-caption {
          padding:
            1rem
            1.5rem;

          background:
            rgba(0, 0, 0, 0.6);

          color: #fff;

          text-align: center;

          font-size: 1rem;

          backdrop-filter: blur(10px);

          border-top:
            1px solid
            rgba(255, 255, 255, 0.05);
        }

        .lightbox-help {
          position: absolute;

          bottom: 2rem;

          left: 50%;

          transform:
            translateX(-50%);

          color:
            rgba(255, 255, 255, 0.3);

          font-size: 0.8rem;

          background:
            rgba(0, 0, 0, 0.3);

          padding:
            0.5rem
            1.5rem;

          border-radius: 50px;

          backdrop-filter: blur(10px);

          border:
            1px solid
            rgba(255, 255, 255, 0.05);

          white-space: nowrap;
        }

        /* ========================================
           ANIMATIONS
        ======================================== */

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes lightboxScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ========================================
           MOBILE
        ======================================== */

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

          .gallery-overlay {
            display: none;
          }

          .mobile-caption {
            display: block;
          }

          .view-badge {
            display: none;
          }

          .gallery-card:hover {
            box-shadow:
              0 4px 15px
              rgba(0, 0, 0, 0.08);
          }

          .gallery-card:hover .gallery-image {
            transform: none;
          }

          .lightbox {
            padding: 1rem;
          }

          .lightbox-close {
            top: 1rem;
            right: 1rem;

            width: 45px;
            height: 45px;
          }

          .lightbox-content {
            max-width: 95vw;
            max-height: 80vh;
          }

          .lightbox-image {
            max-width: 95vw;
            max-height: 75vh;
          }

          .lightbox-help {
            bottom: 1rem;

            font-size: 0.7rem;

            padding:
              0.4rem
              1rem;
          }
        }

        @media (max-width: 500px) {
          .gallery-page {
            padding-top: 4rem !important;
          }

          .gallery-item {
            margin-bottom: 10px;
          }

          .masonry-grid {
            margin-left: -8px;
          }

          .masonry-grid-column {
            padding-left: 8px;
          }

          .mobile-caption {
            padding:
              1.2rem
              0.8rem
              0.8rem;
          }

          .mobile-caption p {
            font-size: 0.8rem;
          }

          .lightbox-caption {
            font-size: 0.9rem;

            padding:
              0.8rem
              1rem;
          }
        }

        /* ========================================
           REDUCE MOTION
        ======================================== */

        @media (prefers-reduced-motion: reduce) {
          .gallery-card,
          .gallery-image,
          .gallery-overlay,
          .view-badge {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
