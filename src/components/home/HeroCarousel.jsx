import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
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

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Try to fetch with ordering first
        let data = [];
        try {
          const q = query(
            collection(db, "banners"),
            where("active", "==", true),
            orderBy("order"),
          );
          const snap = await getDocs(q);
          data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (indexError) {
          // If index doesn't exist, fetch without orderBy
          console.warn(
            "Index not found, fetching without orderBy:",
            indexError,
          );
          const snap = await getDocs(collection(db, "banners"));
          data = snap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((b) => b.active === true || b.active === "true")
            .sort((a, b) => (a.order || 0) - (b.order || 0));
        }

        if (data.length > 0) {
          setBanners(data);
          setUsingFallback(false);
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

  const handleImageError = (bannerId) => {
    setImageErrors((prev) => ({ ...prev, [bannerId]: true }));
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh", background: "#1A1A1A" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ color: "#A51C30" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{
        height: "85vh",
        minHeight: "500px",
        maxHeight: "800px",
        position: "relative",
        marginTop: "0",
        overflow: "hidden",
      }}
    >
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
              {/* Image background for Firestore banners */}
              {!isFallback && banner.imageUrl && !hasImageError && (
                <img
                  src={banner.imageUrl}
                  className="d-block"
                  alt={banner.title || "Banner"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  onError={() => handleImageError(banner.id)}
                />
              )}

              {/* Dark overlay for all banners */}
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
                      fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
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
                      fontSize: "clamp(1rem, 2vw, 1.5rem)",
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
                      padding: "0.8rem 2.5rem",
                      fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
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
                      e.target.style.transform = "translateY(-3px)";
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

      {/* Controls - Only show if more than 1 banner */}
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
              opacity: 0.7,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
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
              opacity: 0.7,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}

      {/* Indicators - Only show if more than 1 banner */}
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
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.8)",
                background: index === 0 ? "#A51C30" : "transparent",
                margin: "0 6px",
                padding: 0,
                transition: "all 0.3s ease",
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
            bottom: "100px",
            right: "20px",
            zIndex: 10,
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "50px",
            fontSize: "clamp(11px, 0.8vw, 13px)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            letterSpacing: "0.5px",
          }}
        >
          <span style={{ marginRight: "6px" }}>⚡</span>
          Preview Mode – Add banners in admin panel
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
