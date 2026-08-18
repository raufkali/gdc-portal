import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

// Simple in-memory cache for program details (keyed by slug/id)
const cachedPrograms = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const ProgramDetail = () => {
  const { slug } = useParams();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      const cacheKey = slug;

      // 1. Check cache
      if (
        cachedPrograms[cacheKey] &&
        cachedPrograms[cacheKey].timestamp &&
        Date.now() - cachedPrograms[cacheKey].timestamp < CACHE_TTL
      ) {
        setProgram(cachedPrograms[cacheKey].data);
        setLoading(false);
        return;
      }

      try {
        // 2. Fetch programs and find by slug or ID
        const data = await fetchCollection("programs");

        const found = data.find((p) => p.slug === slug || p.id === slug);

        if (found) {
          // Cache program
          cachedPrograms[cacheKey] = {
            data: found,
            timestamp: Date.now(),
          };

          setProgram(found);
        } else {
          setProgram(null);
        }
      } catch (error) {
        console.error("Error fetching program:", error);

        // Fallback to stale cache if available
        if (cachedPrograms[cacheKey]) {
          setProgram(cachedPrograms[cacheKey].data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  // Loading
  if (loading) {
    return <Loader />;
  }

  // Program not found
  if (!program) {
    return (
      <div
        className="container py-5 mt-5 text-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="display-1 text-muted mb-4">
          <i className="bi bi-exclamation-triangle"></i>
        </div>

        <h2 className="fw-bold" style={{ color: "var(--color-text)" }}>
          Program Not Found
        </h2>

        <p className="text-muted mb-4">
          The program you’re looking for doesn’t exist or has been removed.
        </p>

        <Link
          to="/programs"
          className="btn"
          style={{
            background: "#A51C30",
            color: "#fff",
            borderRadius: "50px",
            padding: "0.6rem 2rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#7A1523";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 15px rgba(165, 28, 48, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#A51C30";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="container">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/programs"
            className="btn"
            style={{
              background: "transparent",
              color: "#A51C30",
              padding: "0.4rem 1.5rem",
              borderRadius: "50px",
              border: "2px solid #A51C30",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#A51C30";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#A51C30";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Programs
          </Link>
        </div>

        {/* Program Content */}
        <div
          className="card border-0 shadow-lg overflow-hidden"
          style={{
            borderRadius: "16px",
            backgroundColor: "var(--card-bg)",
          }}
        >
          <div className="card-body p-4 p-md-5">
            {/* Category */}
            {program.category && (
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(165, 28, 48, 0.08)",
                  color: "#A51C30",
                  padding: "0.3rem 1.2rem",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "0.9rem",
                }}
              >
                {program.category}
              </div>
            )}

            {/* Title */}
            <h1
              className="fw-bold"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                lineHeight: "1.2",
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              {program.title}
            </h1>

            {/* Subtitle */}
            {program.subtitle && (
              <h5
                style={{
                  color: "#A51C30",
                  fontWeight: "500",
                  lineHeight: "1.5",
                  marginBottom: "1.5rem",
                }}
              >
                {program.subtitle}
              </h5>
            )}

            {/* Divider */}
            <div
              style={{
                width: "70px",
                height: "3px",
                background: "#A51C30",
                borderRadius: "10px",
                marginBottom: "1.5rem",
              }}
            />

            {/* Description */}
            {program.description && (
              <div
                className="mb-4"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "1.05rem",
                  lineHeight: "1.8",
                  maxWidth: "900px",
                }}
              >
                {program.description}
              </div>
            )}

            {/* Program Details */}
            {(program.duration || program.fee || program.eligibility) && (
              <div className="row g-3 mt-3">
                {/* Duration */}
                {program.duration && (
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 h-100"
                      style={{
                        background: "rgba(165, 28, 48, 0.04)",
                        border: "1px solid rgba(165, 28, 48, 0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "rgba(165, 28, 48, 0.08)",
                          marginRight: "1rem",
                        }}
                      >
                        <i
                          className="bi bi-clock"
                          style={{
                            color: "#A51C30",
                            fontSize: "1.3rem",
                          }}
                        ></i>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#6c757d",
                            marginBottom: "2px",
                          }}
                        >
                          Duration
                        </div>

                        <div
                          style={{
                            fontWeight: "600",
                            color: "var(--color-text)",
                          }}
                        >
                          {program.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee */}
                {program.fee && (
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 h-100"
                      style={{
                        background: "rgba(165, 28, 48, 0.04)",
                        border: "1px solid rgba(165, 28, 48, 0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "rgba(165, 28, 48, 0.08)",
                          marginRight: "1rem",
                        }}
                      >
                        <i
                          className="bi bi-cash-stack"
                          style={{
                            color: "#A51C30",
                            fontSize: "1.3rem",
                          }}
                        ></i>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#6c757d",
                            marginBottom: "2px",
                          }}
                        >
                          Fee Structure
                        </div>

                        <div
                          style={{
                            fontWeight: "600",
                            color: "var(--color-text)",
                          }}
                        >
                          {program.fee}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                {program.eligibility && (
                  <div className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 h-100"
                      style={{
                        background: "rgba(165, 28, 48, 0.04)",
                        border: "1px solid rgba(165, 28, 48, 0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "rgba(165, 28, 48, 0.08)",
                          marginRight: "1rem",
                        }}
                      >
                        <i
                          className="bi bi-check-circle"
                          style={{
                            color: "#A51C30",
                            fontSize: "1.3rem",
                          }}
                        ></i>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#6c757d",
                            marginBottom: "2px",
                          }}
                        >
                          Eligibility
                        </div>

                        <div
                          style={{
                            fontWeight: "600",
                            color: "var(--color-text)",
                          }}
                        >
                          {program.eligibility}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div
              className="mt-5 pt-4 border-top"
              style={{
                borderColor: "rgba(165, 28, 48, 0.15)",
              }}
            >
              <div className="d-flex flex-wrap gap-3">
                {/* Eligibility */}
                <Link
                  to="/eligibility-criteria"
                  className="btn"
                  style={{
                    background: "linear-gradient(145deg, #A51C30, #7A1523)",
                    color: "#fff",
                    padding: "0.7rem 2rem",
                    borderRadius: "50px",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(165, 28, 48, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(165, 28, 48, 0.3)";
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Check Eligibility
                </Link>

                {/* Contact */}
                <Link
                  to="/contact"
                  className="btn btn-outline-secondary"
                  style={{
                    padding: "0.7rem 2rem",
                    borderRadius: "50px",
                    fontWeight: "600",
                    textDecoration: "none",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#A51C30";
                    e.currentTarget.style.color = "#A51C30";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
