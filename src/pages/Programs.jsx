import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch programs
  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      try {
        const data = await fetchCollection("programs");
        if (isMounted) setPrograms(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPrograms();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    programs.forEach((p) => {
      if (p.category) cats.add(p.category);
      else cats.add("Other");
    });
    return ["All", ...Array.from(cats)];
  }, [programs]);

  // Filter programs based on category and search
  useEffect(() => {
    let result = programs;

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => (p.category || "Other") === selectedCategory,
      );
    }

    // Search filter (title, subtitle, description)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.subtitle?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    setFilteredPrograms(result);
  }, [programs, selectedCategory, searchQuery]);

  useEffect(() => {
    if (!loading && programs.length > 0) {
      const timeoutId = setTimeout(() => {
        if (window.AOS) {
          window.AOS.refresh();
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, programs]);

  // Intersection Observer for visibility
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [loading]);

  const handleImageError = (programId) => {
    setImageErrors((prev) => ({ ...prev, [programId]: true }));
  };

  if (loading) return <Loader />;

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
      ref={sectionRef}
    >
      <div className="container">
        {/* Page Header */}
        <div
          className="text-center mb-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
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
        </div>

        {/* Filter and Search Bar */}
        <div
          className="mb-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "0.4rem 1.2rem",
                      borderRadius: "50px",
                      border:
                        selectedCategory === cat
                          ? "2px solid #A51C30"
                          : "2px solid transparent",
                      background:
                        selectedCategory === cat ? "#A51C30" : "transparent",
                      color:
                        selectedCategory === cat ? "#fff" : "var(--color-text)",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor:
                        selectedCategory === cat
                          ? "#A51C30"
                          : "rgba(165, 28, 48, 0.05)",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== cat) {
                        e.target.style.borderColor = "#A51C30";
                        e.target.style.backgroundColor =
                          "rgba(165, 28, 48, 0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== cat) {
                        e.target.style.borderColor = "transparent";
                        e.target.style.backgroundColor =
                          "rgba(165, 28, 48, 0.05)";
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    borderRadius: "50px",
                    paddingLeft: "2.5rem",
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--color-text)",
                  }}
                />
                <i
                  className="bi bi-search"
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#A51C30",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-search"></i>
            </div>
            <h4 className="text-muted">No programs found</h4>
            <p className="text-muted small">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredPrograms.map((program, index) => {
              const hasImageError = imageErrors[program.id];

              return (
                <div
                  key={program.id}
                  className="col-md-6 col-lg-4"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
                  }}
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
                    {program.imageUrl && !hasImageError ? (
                      <div
                        style={{
                          height: "200px",
                          overflow: "hidden",
                          position: "relative",
                          background: "#f0f0f0",
                        }}
                      >
                        <img
                          src={program.imageUrl}
                          alt={program.title}
                          loading="lazy"
                          decoding="async"
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
                          onError={() => handleImageError(program.id)}
                        />
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
                    ) : (
                      <div
                        style={{
                          height: "200px",
                          background:
                            "linear-gradient(145deg, #1A1A1A, #2C2C2C)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "4rem",
                            fontWeight: "700",
                            color: "rgba(255,255,255,0.1)",
                          }}
                        >
                          {program.title?.charAt(0) || "P"}
                        </div>
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
                              color: "#856404",
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
                          background:
                            "linear-gradient(145deg, #A51C30, #7A1523)",
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
              );
            })}
          </div>
        )}

        {/* Bottom CTA Section */}
        {programs.length > 0 && (
          <div
            className="text-center mt-5 pt-3"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s`,
            }}
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
