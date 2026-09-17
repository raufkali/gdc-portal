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
  // ==========================================================
  // ALWAYS start in loading state so the entrance animation
  // and spinner run every time the section mounts, including
  // when returning from /gallery. The cache only avoids the
  // network round-trip, not the visual warm-up.
  // ==========================================================
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchGallery = async () => {
      // ------------------------------------------------------
      // Cache hit — show the cached data, but still go through
      // a short loading beat so the entrance animation plays.
      // ------------------------------------------------------
      if (
        cachedGallery &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        // Small delay (one frame + tiny timeout) so React paints
        // the loading state first, then transitions to loaded.
        // This is what makes the animation reliably re-trigger.
        const timer = setTimeout(() => {
          if (!isMounted) return;
          setImages(cachedGallery);
          setFromCache(true);
          setLoading(false);
        }, 220);

        return () => clearTimeout(timer);
      }

      // ------------------------------------------------------
      // Cache miss — fetch from Firestore.
      // ------------------------------------------------------
      try {
        const snap = await getDocs(collection(db, "gallery"));

        let data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (data.length > 0) {
          cachedGallery = data;
          cacheTimestamp = Date.now();
          if (!isMounted) return;
          setImages(data);
          setFromCache(false);
        } else {
          const fallback = FALLBACK_IMAGES;
          cachedGallery = fallback;
          cacheTimestamp = Date.now();
          if (!isMounted) return;
          setImages(fallback);
          setFromCache(false);
        }
      } catch (error) {
        console.error("Error fetching gallery preview:", error);

        const fallback = FALLBACK_IMAGES;
        cachedGallery = fallback;
        cacheTimestamp = Date.now();

        if (!isMounted) return;
        setImages(fallback);
        setFromCache(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container m-0 text-center">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "#ffff",
              backgroundColor: "#A51C30",
            }}
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
    <section
      className="py-5 gallery-preview-section"
      style={{
        color: "#ffff",
        backgroundColor: "#A51C30",
      }}
    >
      <div className="container-fluid m-0 py-5 px-2">
        {/* TITLE SECTION */}
        <div className="text-center mb-5 gallery-animate-in">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "transparent",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
              border: "2px solid white",
            }}
          >
            Visual Stories
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "#ffff",
              marginBottom: "0.25rem",
            }}
          >
            Media <span style={{ color: "#ffff" }}>Gallery</span>
          </h2>

          <p
            className="text-light"
            style={{
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore our campus life through images
          </p>
        </div>

        {/* =========================================================
            DESKTOP GALLERY
            ========================================================= */}
        <div className="gallery-desktop-grid row g-3">
          {displayImages.map((img, index) => (
            <div
              key={img.id}
              className="col-md-4 col-sm-6 gallery-animate-in"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <Link
                to="/gallery"
                style={{
                  textDecoration: "none",
                  display: "block",
                }}
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

                    {/* Desktop Overlay */}
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
                          e.currentTarget.style.opacity = "1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth > 768) {
                          e.currentTarget.style.opacity = "0";
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
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* =========================================================
            MOBILE STACKED GALLERY
            Same sticky-card concept used for customer reviews.
            ========================================================= */}
        <div className="gallery-mobile-stack">
          {displayImages.map((img, index) => {
            /*
              Each following card sits slightly lower than the
              previous one.

              Card 1 → top: 80px
              Card 2 → top: 94px
              Card 3 → top: 108px
              etc.

              This creates the visible stacked-card effect while
              scrolling.
            */
            const stickyTop = 80 + index * 14;

            return (
              <div
                key={img.id}
                className="gallery-mobile-sticky-card gallery-animate-in"
                style={{
                  top: `${stickyTop}px`,
                  animationDelay: `${index * 90}ms`,
                }}
              >
                <Link to="/gallery" className="gallery-mobile-card-link">
                  <div className="gallery-mobile-card">
                    <div className="gallery-mobile-image-wrapper">
                      <img
                        src={img.imageUrl}
                        alt={img.caption || "Gallery"}
                        loading="lazy"
                        decoding="async"
                        className="gallery-mobile-image"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/800x600?text=Image+Not+Found";
                        }}
                      />

                      {/* Dark image gradient */}
                      <div className="gallery-mobile-gradient" />

                      {/* Caption */}
                      {img.caption && (
                        <div className="gallery-mobile-caption">
                          <span className="gallery-mobile-caption-label">
                            Visual Story
                          </span>

                          <h3>{img.caption}</h3>

                          <div className="gallery-mobile-caption-line" />

                          <p>
                            <i className="bi bi-arrow-right-circle me-1"></i>
                            View Gallery
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Extra scroll space so the final card can complete
              its sticky position naturally. */}
          <div className="gallery-mobile-stack-spacer" />
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="text-center gallery-animate-in  mt-0">
          <Link
            to="/gallery"
            className="btn"
            style={{
              background: "transparent",
              color: "#ffff",
              padding: "0.7rem 3rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #ffff",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eb2d49";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(165, 28, 48, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ffff";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            View Full Gallery
          </Link>
        </div>
      </div>

      {/* =========================================================
          RESPONSIVE STYLES
          ========================================================= */}
      <style>{`
        /* ---------------------------------------------------------
           ENTRANCE ANIMATION
           Runs every time the section mounts (including when
           navigating back from /gallery), because the component
           always starts in the loading state.
           --------------------------------------------------------- */

        @keyframes galleryFadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gallery-animate-in {
          animation: galleryFadeUp 0.7s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-animate-in {
            animation: none !important;
          }
        }

        /* ---------------------------------------------------------
           DESKTOP
           --------------------------------------------------------- */

        .gallery-mobile-stack {
          display: none;
        }

        /* ---------------------------------------------------------
           MOBILE
           --------------------------------------------------------- */

        @media (max-width: 768px) {
          .gallery-desktop-grid {
            display: none !important;
          }

          .gallery-mobile-stack {
            display: block;
            position: relative;
            width: 100%;
            padding-top: 10px;
          }

          /*
            Every card becomes sticky.

            The cards naturally stack because each one has a
            slightly different top value.
          */
          .gallery-mobile-sticky-card {
            position: sticky;
            width: 100%;
            padding-bottom: 18px;
            z-index: 1;
          }

          /*
            Later cards appear above earlier cards when they
            reach the sticky area.
          */
          .gallery-mobile-sticky-card:nth-child(1) {
            z-index: 1;
          }

          .gallery-mobile-sticky-card:nth-child(2) {
            z-index: 2;
          }

          .gallery-mobile-sticky-card:nth-child(3) {
            z-index: 3;
          }

          .gallery-mobile-sticky-card:nth-child(4) {
            z-index: 4;
          }

          .gallery-mobile-sticky-card:nth-child(5) {
            z-index: 5;
          }

          .gallery-mobile-sticky-card:nth-child(6) {
            z-index: 6;
          }

          .gallery-mobile-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
          }

          .gallery-mobile-card {
            position: relative;
            width: 100%;
            border-radius: 18px;
            overflow: hidden;
            background: #fff;
            box-shadow:
              0 8px 25px rgba(0, 0, 0, 0.18),
              0 2px 8px rgba(0, 0, 0, 0.08);

            transition:
              transform 0.5s
                cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.5s
                cubic-bezier(0.22, 1, 0.36, 1);
          }

          .gallery-mobile-image-wrapper {
            position: relative;
            width: 100%;
            height: 390px;
            overflow: hidden;
            background: #f8f9fa;
          }

          .gallery-mobile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          /*
            Bottom gradient makes the caption readable without
            covering the whole photograph.
          */
          .gallery-mobile-gradient {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.02) 25%,
                rgba(0, 0, 0, 0.12) 48%,
                rgba(0, 0, 0, 0.82) 100%
              );
            pointer-events: none;
          }

          .gallery-mobile-caption {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 1.5rem 1.25rem 1.35rem;
            color: #fff;
          }

          .gallery-mobile-caption-label {
            display: inline-block;
            margin-bottom: 0.45rem;
            font-size: 0.65rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.8px;
            opacity: 0.8;
          }

          .gallery-mobile-caption h3 {
            margin: 0;
            color: #fff;
            font-family:
              "Playfair Display",
              Georgia,
              serif;
            font-size: 1.45rem;
            font-weight: 700;
            line-height: 1.2;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
          }

          .gallery-mobile-caption-line {
            width: 42px;
            height: 3px;
            margin-top: 0.65rem;
            border-radius: 3px;
            background: #a51c30;
          }

          .gallery-mobile-caption p {
            margin: 0.65rem 0 0;
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.6px;
            text-transform: uppercase;
          }

          /*
            This gives the sticky sequence enough vertical
            scrolling room after the final card.
          */
          .gallery-mobile-stack-spacer {
            height: 40vh;
          }

          /*
            The button gets enough separation from the stacked
            gallery after the cards finish.
          */
          .gallery-mobile-stack + .text-center {
            margin-top: 2rem !important;
          }
        }

        /* ---------------------------------------------------------
           VERY SMALL PHONES
           --------------------------------------------------------- */

        @media (max-width: 380px) {
          .gallery-mobile-image-wrapper {
            height: 350px;
          }

          .gallery-mobile-caption h3 {
            font-size: 1.3rem;
          }

          .gallery-mobile-caption {
            padding: 1.25rem 1.15rem;
          }
        }
      `}</style>
    </section>
  );
};

export default GalleryPreview;
