import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

//  Cache for testimonials
let cachedTestimonials = null;
let cacheTimestamp = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <span style={{ color: "#ffc107", fontSize: "0.9rem" }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 !== 0 && "☆"}
      <span
        style={{
          color: "var(--color-text-muted)",
          fontSize: "0.8rem",
          marginLeft: "4px",
        }}
      >
        ({rating})
      </span>
    </span>
  );
};

const Testimonials = () => {
  //  Initialize with cached data if available
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      //  If cache is valid, skip fetching
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
            Student Voices
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
            What Our <span style={{ color: "#A51C30" }}>Students Say</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Real stories from real students about their experience at GDC
            Gulabad
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
            ></span>
          )}
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-5 mt-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-chat-quote"></i>
            </div>
            <h4 className="text-muted">No testimonials yet</h4>
            <p className="text-muted small">
              Please check back later for student stories.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {testimonials.map((t, index) => (
              <div
                key={t.id}
                className="col-md-6 col-lg-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    backgroundColor: "var(--card-bg)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Quote Icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      fontSize: "3rem",
                      color: "rgba(165, 28, 48, 0.06)",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      lineHeight: "1",
                      pointerEvents: "none",
                    }}
                  >
                    "
                  </div>

                  <div className="card-body p-4">
                    {/* Student Info */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {t.imageUrl ? (
                        <img
                          src={t.imageUrl}
                          alt={t.studentName}
                          className="rounded-circle"
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                            border: "3px solid rgba(165, 28, 48, 0.15)",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #A51C30, #7A1523)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: "1.2rem",
                            flexShrink: 0,
                          }}
                        >
                          {t.studentName?.charAt(0) || "S"}
                        </div>
                      )}
                      <div>
                        <h6
                          className="fw-bold mb-0"
                          style={{ color: "var(--color-text)" }}
                        >
                          {t.studentName || "Anonymous"}
                        </h6>
                        {t.program && (
                          <small
                            style={{
                              color: "#A51C30",
                              fontWeight: "500",
                              fontSize: "0.8rem",
                            }}
                          >
                            <i className="bi bi-mortarboard me-1"></i>
                            {t.program}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {t.rating && (
                      <div className="mb-2">
                        <StarRating rating={t.rating} />
                      </div>
                    )}

                    {/* Content */}
                    <blockquote className="blockquote mb-0">
                      <p
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: "1.8",
                          color: "var(--color-text)",
                          fontStyle: "italic",
                          marginBottom: "0.5rem",
                          paddingLeft: "0.5rem",
                          borderLeft: "3px solid #A51C30",
                        }}
                      >
                        "{t.content}"
                      </p>
                    </blockquote>

                    {/* Date if available */}
                    {t.date && (
                      <small
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "0.7rem",
                          display: "block",
                          marginTop: "0.5rem",
                        }}
                      >
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date(t.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Count */}
        {testimonials.length > 0 && (
          <div className="text-center mt-4">
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
              }}
            >
              <i className="bi bi-chat-quote me-1"></i>
              {testimonials.length} student{testimonials.length > 1 ? "s" : ""}{" "}
              shared their experience
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div
          className="text-center mt-5 pt-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              background: "var(--color-bg)",
              padding: "2.5rem 1rem",
            }}
          >
            <h4
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 2vw, 2rem)",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              Ready to <span style={{ color: "#A51C30" }}>Share</span> Your
              Story?
            </h4>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "1.05rem",
                maxWidth: "500px",
                margin: "0 auto 1.5rem",
              }}
            >
              We'd love to hear about your journey at GDC Gulabad.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <a
                href="/contact"
                className="btn"
                style={{
                  background: "linear-gradient(145deg, #A51C30, #7A1523)",
                  color: "#fff",
                  padding: "0.7rem 2.5rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 8px 30px rgba(165, 28, 48, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(165, 28, 48, 0.3)";
                }}
              >
                <i className="bi bi-send me-2"></i>
                Get in Touch
              </a>
              <a
                href="/programs"
                className="btn btn-outline-secondary"
                style={{
                  padding: "0.7rem 2.5rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#A51C30";
                  e.target.style.color = "#A51C30";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-book me-2"></i>
                Explore Programs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
