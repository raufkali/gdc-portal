import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

// ✅ Cache for programs
let cachedPrograms = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const Programs = () => {
  // ✅ Initialize with cached data if available
  const [programs, setPrograms] = useState(() => {
    if (
      cachedPrograms &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      console.log("📦 Programs instant from cache");
      return cachedPrograms;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedPrograms &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedPrograms &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      // ✅ If cache is valid, skip fetching
      if (
        cachedPrograms &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setPrograms(cachedPrograms);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching programs from server");
        const data = await fetchCollection("programs");

        cachedPrograms = data;
        cacheTimestamp = Date.now();
        setPrograms(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching programs:", error);
        if (cachedPrograms) {
          setPrograms(cachedPrograms);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) return <Loader />;

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
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
            Academic Programs
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
            Our <span style={{ color: "#A51C30" }}>Programs</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Explore our diverse range of academic programs designed to shape
            future leaders and professionals
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

        {/* Programs Grid */}
        {programs.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-book"></i>
            </div>
            <h4 className="text-muted">No programs available</h4>
            <p className="text-muted small">
              Please check back later for updates.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className="col-md-6 col-lg-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    backgroundColor: "var(--card-bg)",
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
                  {/* Image */}
                  {program.imageUrl && (
                    <div
                      style={{
                        height: "200px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={program.imageUrl}
                        alt={program.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
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
                              height: 200px;
                              background: linear-gradient(145deg, #1A1A1A, #2C2C2C);
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              color: #fff;
                              font-family: 'Playfair Display', Georgia, serif;
                              font-size: 4rem;
                              font-weight: 700;
                              color: rgba(255,255,255,0.1);
                            ">
                              <span>${program.title?.charAt(0) || "P"}</span>
                            </div>
                          `;
                        }}
                      />
                      {/* Program type badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          background: "rgba(165, 28, 48, 0.9)",
                          color: "#fff",
                          padding: "0.3rem 1rem",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {program.duration || "Program"}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="card-body p-4">
                    <h5
                      className="card-title fw-bold"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1.25rem",
                        color: "var(--color-text)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {program.title}
                    </h5>

                    {program.subtitle && (
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#A51C30",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {program.subtitle}
                      </p>
                    )}

                    <p
                      className="card-text"
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.95rem",
                        lineHeight: "1.7",
                        marginBottom: "1rem",
                      }}
                    >
                      {program.description?.substring(0, 120)}
                      {program.description?.length > 120 && "..."}
                    </p>

                    {/* Program details tags */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {program.duration && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(165, 28, 48, 0.08)",
                            color: "#A51C30",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "50px",
                            fontWeight: "500",
                          }}
                        >
                          <i className="bi bi-clock me-1"></i>
                          {program.duration}
                        </span>
                      )}
                      {program.eligibility && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(40, 167, 69, 0.08)",
                            color: "#28a745",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "50px",
                            fontWeight: "500",
                          }}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Eligible
                        </span>
                      )}
                      {program.fee && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(255, 193, 7, 0.08)",
                            color: "#ffc107",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "50px",
                            fontWeight: "500",
                          }}
                        >
                          <i className="bi bi-cash-stack me-1"></i>
                          {program.fee}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/programs/${program.slug || program.id}`}
                      className="btn w-100"
                      style={{
                        background: "linear-gradient(145deg, #A51C30, #7A1523)",
                        color: "#fff",
                        borderRadius: "50px",
                        padding: "0.6rem 1.5rem",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        border: "none",
                        transition: "all 0.3s ease",
                        textDecoration: "none",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 8px 25px rgba(165, 28, 48, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <i className="bi bi-arrow-right me-2"></i>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Section */}
        {programs.length > 0 && (
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
                Ready to <span style={{ color: "#A51C30" }}>Apply</span>?
              </h4>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "1.05rem",
                  maxWidth: "500px",
                  margin: "0 auto 1.5rem",
                }}
              >
                Take the first step toward your academic future at GDC Gulabad.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link
                  to="/eligibility-criteria"
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
                  <i className="bi bi-check-circle me-2"></i>
                  Check Eligibility
                </Link>
                <Link
                  to="/contact"
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
                  <i className="bi bi-envelope me-2"></i>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
