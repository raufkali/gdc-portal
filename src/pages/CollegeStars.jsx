import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Module-level cache
let cachedStars = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const CollegeStars = () => {
  const [stars, setStars] = useState(() => {
    if (
      cachedStars &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedStars;
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    return !(
      cachedStars &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStars = async () => {
      // Check cache
      if (
        cachedStars &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setStars(cachedStars);
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDocs(collection(db, "collegeStars"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort by name or date if needed
        if (isMounted) {
          cachedStars = data;
          cacheTimestamp = Date.now();
          setStars(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching college stars:", error);
        if (cachedStars && isMounted) {
          setStars(cachedStars);
          setLoading(false);
        } else if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStars();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-5 mt-5 text-center">
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

  if (!stars.length) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="display-1 text-muted mb-4">
          <i className="bi bi-star"></i>
        </div>
        <h2
          className="fw-bold"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text)",
          }}
        >
          No Stars Yet
        </h2>
        <p className="text-muted">
          Check back later for our outstanding alumni.
        </p>
      </div>
    );
  }

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)", minHeight: "70vh" }}
    >
      <div className="container">
        {/* Header */}
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
            Our Pride
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
            College <span style={{ color: "#A51C30" }}>Stars</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Meet our exceptional alumni who have made us proud with their
            achievements.
          </p>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {stars.map((star, index) => (
            <div
              key={star.id}
              className="col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.08)";
                }}
              >
                {star.imageUrl && (
                  <img
                    src={star.imageUrl}
                    className="card-img-top"
                    alt={star.name}
                    style={{ height: "220px", objectFit: "cover" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1.25rem",
                        color: "var(--color-text)",
                      }}
                    >
                      {star.name}
                    </h5>
                    {star.batch && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(165, 28, 48, 0.08)",
                          color: "#A51C30",
                          fontSize: "0.7rem",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "50px",
                          fontWeight: "500",
                        }}
                      >
                        {star.batch}
                      </span>
                    )}
                  </div>
                  {star.achievement && (
                    <p
                      className="small fw-semibold"
                      style={{ color: "#A51C30", marginBottom: "0.5rem" }}
                    >
                      <i className="bi bi-trophy me-1"></i> {star.achievement}
                    </p>
                  )}
                  {star.description && (
                    <p
                      className="card-text small"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {star.description}
                    </p>
                  )}
                  {star.link && (
                    <a
                      href={star.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm mt-2"
                      style={{
                        background: "transparent",
                        color: "#A51C30",
                        border: "1px solid #A51C30",
                        borderRadius: "50px",
                        padding: "0.2rem 1rem",
                        fontSize: "0.75rem",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#A51C30";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#A51C30";
                      }}
                    >
                      <i className="bi bi-link-45deg me-1"></i> Learn More
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeStars;
