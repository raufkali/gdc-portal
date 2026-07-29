import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

// ----- Fallback Banners (HTML/CSS – no images needed) -----
const FALLBACK_BANNERS = [
  {
    id: "fallback-1",
    title: "Welcome to GDC Gulabad",
    subtitle: "Excellence in Education & Research",
    bgGradient: "linear-gradient(135deg, #A51C30 0%, #1A1A1A 100%)",
  },
  {
    id: "fallback-2",
    title: "Government Degree College",
    subtitle: "Inspiring Minds, Shaping Futures",
    bgGradient:
      "linear-gradient(135deg, #1A1A1A 0%, #A51C30 50%, #1A1A1A 100%)",
  },
  {
    id: "fallback-3",
    title: "Our Programs",
    subtitle: "Explore our diverse range of academic offerings",
    bgGradient: "linear-gradient(135deg, #A51C30 0%, #2C2C2C 100%)",
  },
  {
    id: "fallback-4",
    title: "Campus Life & Activities",
    subtitle: "Beyond the Classroom – Explore, Engage, Excel",
    bgGradient: "linear-gradient(135deg, #1A1A1A 0%, #A51C30 100%)",
  },
];

// ✅ Cache for banners with TTL
let cachedBanners = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const HeroCarousel = () => {
  const [banners, setBanners] = useState(() => {
    // ✅ Initialize with cached data if available
    if (
      cachedBanners &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      console.log("📦 Instant: Banners from cache on load");
      return cachedBanners;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    // ✅ If cache exists and valid, don't show loading
    return !(
      cachedBanners &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [usingFallback, setUsingFallback] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedBanners &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // ✅ If we have valid cache, skip fetching
        if (
          cachedBanners &&
          cacheTimestamp &&
          Date.now() - cacheTimestamp < CACHE_TTL
        ) {
          console.log("📦 Using cached banners");
          setBanners(cachedBanners);
          setFromCache(true);
          setLoading(false);
          return;
        }

        console.log("📡 Fetching banners from server...");
        const q = query(collection(db, "banners"), where("active", "==", true));
        const snap = await getDocs(q);

        const data = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log("✅ Banners fetched:", data.length);

        if (data.length > 0) {
          // ✅ Cache the data
          cachedBanners = data;
          cacheTimestamp = Date.now();
          setBanners(data);
          setUsingFallback(false);
          setFromCache(false);
        } else {
          setBanners(FALLBACK_BANNERS);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners(FALLBACK_BANNERS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Listen to carousel slide events
  useEffect(() => {
    const carouselElement = document.getElementById("heroCarousel");
    if (carouselElement) {
      const handleSlide = (event) => {
        const newIndex = event.to;
        setActiveIndex(newIndex);

        const indicators = carouselElement.querySelectorAll(
          ".carousel-indicators button",
        );
        indicators.forEach((indicator, index) => {
          if (index === newIndex) {
            indicator.classList.add("active");
            indicator.style.background = "#A51C30";
          } else {
            indicator.classList.remove("active");
            indicator.style.background = "transparent";
          }
        });
      };

      carouselElement.addEventListener("slide.bs.carousel", handleSlide);
      return () => {
        carouselElement.removeEventListener("slide.bs.carousel", handleSlide);
      };
    }
  }, [banners.length]);

  const handleImageError = (bannerId) => {
    setImageErrors((prev) => ({ ...prev, [bannerId]: true }));
  };

  // ✅ If still loading and no cached data, show spinner
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh", background: "#1A1A1A" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#A51C30" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ✅ If no banners and not loading, show nothing (or fallback)
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="5000"
      ref={carouselRef}
      style={{
        height: "85vh",
        minHeight: "500px",
        maxHeight: "800px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ✅ Cache indicator */}
      {fromCache &&
        !usingFallback &&
        process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              zIndex: 20,
              background: "rgba(40, 167, 69, 0.9)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "50px",
              fontSize: "10px",
              fontWeight: "600",
            }}
          >
            ⚡ Cached
          </div>
        )}

      <div className="carousel-inner" style={{ height: "100%", width: "100%" }}>
        {banners.map((banner, index) => {
          const isFallback = banner.bgGradient !== undefined;
          const hasImageError = imageErrors[banner.id];

          return (
            <div
              key={banner.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              style={{
                height: "100%",
                width: "100%",
                background: isFallback ? banner.bgGradient : "#1A1A1A",
                position: "relative",
              }}
            >
              {/* Image for Firestore banners */}
              {!isFallback && banner.imageUrl && !hasImageError && (
                <img
                  src={banner.imageUrl}
                  className="d-block w-100 h-100"
                  alt={banner.title || "Banner"}
                  loading={index > 1 ? "lazy" : "eager"}
                  style={{
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  onError={() => handleImageError(banner.id)}
                />
              )}

              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: isFallback
                    ? "rgba(0,0,0,0.1)"
                    : "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
                  zIndex: 1,
                }}
              />

              {/* Content */}
              <div
                className="container"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  padding: "0 2rem",
                  width: "100%",
                  maxWidth: "1200px",
                }}
              >
                <div style={{ maxWidth: "700px" }}>
                  <h1
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(2rem, 5vw, 4rem)",
                      fontWeight: "700",
                      color: "#ffffff",
                      textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                      marginBottom: "0.75rem",
                      lineHeight: "1.1",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {banner.title}
                  </h1>
                  <p
                    style={{
                      fontSize: "clamp(0.95rem, 1.5vw, 1.3rem)",
                      fontWeight: "300",
                      color: "rgba(255,255,255,0.95)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                      marginBottom: "1.5rem",
                      maxWidth: "600px",
                      lineHeight: "1.6",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {banner.subtitle}
                  </p>
                  <Link
                    to="#programs"
                    className="btn btn-primary"
                    style={{
                      padding: "0.7rem 2.2rem",
                      fontSize: "clamp(0.85rem, 1vw, 1rem)",
                      fontWeight: "600",
                      borderRadius: "50px",
                      backgroundColor: "#A51C30",
                      border: "none",
                      color: "#fff",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(165, 28, 48, 0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#7A1523";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 30px rgba(165, 28, 48, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#A51C30";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(165, 28, 48, 0.4)";
                    }}
                  >
                    Explore Programs
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
            style={{
              zIndex: 10,
              width: "5%",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
            style={{
              zIndex: 10,
              width: "5%",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div
          className="carousel-indicators"
          style={{ zIndex: 10, bottom: "30px" }}
        >
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === activeIndex ? "active" : ""}
              aria-current={index === activeIndex ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.8)",
                background: index === activeIndex ? "#A51C30" : "transparent",
                margin: "0 6px",
                padding: 0,
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (index !== activeIndex) {
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (index !== activeIndex) {
                  e.target.style.background = "transparent";
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Preview Mode badge */}
      {usingFallback && (
        <div
          style={{
            position: "absolute",
            bottom: "90px",
            right: "20px",
            zIndex: 10,
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: "50px",
            fontSize: "clamp(10px, 0.7vw, 12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            letterSpacing: "0.3px",
          }}
        >
          <span style={{ marginRight: "4px" }}>⚡</span>
          Preview Mode
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
