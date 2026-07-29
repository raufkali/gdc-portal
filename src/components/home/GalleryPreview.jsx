import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ✅ Cache for gallery
let cachedGallery = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

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
        console.log("📡 Fetching gallery from server");
        const data = await fetchCollection("gallery", [
          { type: "orderBy", field: "uploadedAt", direction: "desc" },
        ]);
        cachedGallery = data;
        cacheTimestamp = Date.now();
        setImages(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching gallery:", error);
        if (cachedGallery) {
          setImages(cachedGallery);
          setFromCache(true);
        }
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

  if (!images.length) return null;

  const displayImages = images.slice(0, 6);

  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
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

        <div className="row g-3">
          {displayImages.map((img) => (
            <div key={img.id} className="col-md-4 col-sm-6">
              <div
                className="card border-0 shadow-sm overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                <img
                  src={img.imageUrl}
                  className="w-100"
                  alt={img.caption || "Gallery"}
                  loading="lazy"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link
            to="/gallery"
            className="btn"
            style={{
              background: "transparent",
              color: "#A51C30",
              padding: "0.6rem 2.5rem",
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
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(165, 28, 48, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#A51C30";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i> View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
