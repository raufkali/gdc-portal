import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ✅ Cache for testimonials
let cachedTestimonials = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(() => {
    if (
      cachedTestimonials &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedTestimonials;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedTestimonials &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedTestimonials &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (
        cachedTestimonials &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setTestimonials(cachedTestimonials);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("testimonials");
        cachedTestimonials = data;
        cacheTimestamp = Date.now();
        setTestimonials(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        if (cachedTestimonials) {
          setTestimonials(cachedTestimonials);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(testimonials.length, 3));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container text-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading testimonials...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials.length) return null;

  const visibleTestimonials = testimonials.slice(0, 3);

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "var(--color-primary-dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(165, 28, 48, 0.03)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          backgroundColor: "rgba(165, 28, 48, 0.02)",
          pointerEvents: "none",
        }}
      />

      <div className="container position-relative">
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "var(--bg-dark)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
              border: "2px solid #fff",
            }}
          >
            Testimonials
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "0.25rem",
            }}
          >
            What Our Students Say
          </h2>
          <p
            style={{
              color: "var(--color-text-light)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Real experiences from students who found their path at GDC Gulabad
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {visibleTestimonials.map((t, index) => (
            <div
              key={t.id}
              className="col-md-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-once="false"
                data-aos-delay="100"
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "var(--card-bg)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,0.05)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "20px",
                    fontSize: "2.5rem",
                    color: "rgba(165, 28, 48, 0.06)",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    lineHeight: "1",
                    pointerEvents: "none",
                  }}
                >
                  "
                </div>

                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {t.imageUrl ? (
                      <img
                        src={t.imageUrl}
                        alt={t.studentName}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          border: "2px solid rgba(165, 28, 48, 0.12)",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #A51C30, #7A1523)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                          flexShrink: 0,
                        }}
                      >
                        {t.studentName?.charAt(0) || "S"}
                      </div>
                    )}
                    <div>
                      <h6
                        className="fw-bold mb-0"
                        style={{
                          color: "var(--color-text)",
                          fontSize: "0.95rem",
                        }}
                      >
                        {t.studentName || "Anonymous"}
                      </h6>
                      {t.program && (
                        <small
                          style={{
                            color: "#A51C30",
                            fontWeight: "500",
                            fontSize: "0.75rem",
                          }}
                        >
                          <i className="bi bi-mortarboard me-1"></i>
                          {t.program}
                        </small>
                      )}
                    </div>
                  </div>

                  {t.rating && (
                    <div className="mb-2">
                      <span style={{ color: "#ffc107", fontSize: "0.85rem" }}>
                        {"★".repeat(Math.floor(t.rating))}
                        {t.rating % 1 !== 0 && "☆"}
                      </span>
                    </div>
                  )}

                  <blockquote className="blockquote mb-0">
                    <p
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: "1.8",
                        color: "var(--color-text)",
                        fontStyle: "italic",
                        marginBottom: "0.25rem",
                        paddingLeft: "0.75rem",
                        borderLeft: "3px solid #A51C30",
                      }}
                    >
                      "{t.content}"
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/testimonials"
            className="btn"
            style={{
              background: "transparent",
              color: "#ffff",
              padding: "0.6rem 2.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #ffff",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#ee2846";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(165, 28, 48, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i> View All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
