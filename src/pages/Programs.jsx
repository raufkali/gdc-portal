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

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --------------------------------------------------
  // Fetch programs
  // --------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      try {
        const data = await fetchCollection("programs");

        if (isMounted) {
          setPrograms(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------
  const categories = useMemo(() => {
    const cats = new Set();

    programs.forEach((program) => {
      if (program.category?.trim()) {
        cats.add(program.category.trim());
      } else {
        cats.add("Other");
      }
    });

    return ["All", ...Array.from(cats)];
  }, [programs]);

  // --------------------------------------------------
  // Filter programs
  // --------------------------------------------------
  useEffect(() => {
    let result = [...programs];

    if (selectedCategory !== "All") {
      result = result.filter(
        (program) => (program.category || "Other") === selectedCategory,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((program) => {
        const title = program.title?.toLowerCase() || "";
        const subtitle = program.subtitle?.toLowerCase() || "";
        const description = program.description?.toLowerCase() || "";
        const category = program.category?.toLowerCase() || "";

        return (
          title.includes(query) ||
          subtitle.includes(query) ||
          description.includes(query) ||
          category.includes(query)
        );
      });
    }

    setFilteredPrograms(result);
  }, [programs, selectedCategory, searchQuery]);

  // --------------------------------------------------
  // AOS refresh
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Intersection observer
  // --------------------------------------------------
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "50px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const getProgramNumber = (index) => String(index + 1).padStart(2, "0");

  const getCategoryIcon = (category = "") => {
    const value = category.toLowerCase();

    if (
      value.includes("computer") ||
      value.includes("computing") ||
      value.includes("information") ||
      value.includes("software") ||
      value.includes("technology") ||
      value.includes("artificial") ||
      value.includes("machine")
    ) {
      return "bi-cpu";
    }

    if (
      value.includes("science") ||
      value.includes("biology") ||
      value.includes("environment") ||
      value.includes("ecology")
    ) {
      return "bi-tree";
    }

    if (
      value.includes("business") ||
      value.includes("commerce") ||
      value.includes("management") ||
      value.includes("account")
    ) {
      return "bi-briefcase";
    }

    if (value.includes("education") || value.includes("teaching")) {
      return "bi-mortarboard";
    }

    if (
      value.includes("english") ||
      value.includes("language") ||
      value.includes("literature")
    ) {
      return "bi-book";
    }

    if (value.includes("mathematics") || value.includes("math")) {
      return "bi-calculator";
    }

    if (value.includes("physics")) {
      return "bi-lightning-charge";
    }

    if (value.includes("chemistry") || value.includes("chemical")) {
      return "bi-droplet";
    }

    if (value.includes("social") || value.includes("sociology")) {
      return "bi-people";
    }

    if (value.includes("political") || value.includes("law")) {
      return "bi-bank";
    }

    if (value.includes("arts") || value.includes("humanities")) {
      return "bi-palette";
    }

    return "bi-mortarboard";
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="py-5 mt-5"
      ref={sectionRef}
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="container">
        {/* ==================================================
            HEADER
        ================================================== */}
        <div
          className="text-center mb-5"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: "700",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(165, 28, 48, 0.07)",
              padding: "0.45rem 1.25rem",
              borderRadius: "50px",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#A51C30",
                borderRadius: "50%",
              }}
            />
            Academic Programs
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.3rem, 5vw, 4rem)",
              fontWeight: "700",
              lineHeight: "1.15",
              color: "var(--color-text)",
              marginBottom: "0.8rem",
            }}
          >
            Discover Your <span style={{ color: "#A51C30" }}>Path</span>
          </h1>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              lineHeight: "1.7",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Explore academic programs at GDC Gulabad and find the path that
            matches your ambitions, interests, and future goals.
          </p>
        </div>

        {/* ==================================================
            FILTER / SEARCH
        ================================================== */}
        <div
          className="mb-5"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(25px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          <div
            className="p-3 p-md-4"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="row g-3 align-items-center">
              {/* Categories */}
              <div className="col-lg-8">
                <div
                  className="d-flex flex-wrap gap-2"
                  role="group"
                  aria-label="Program categories"
                >
                  {categories.map((category) => {
                    const active = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        style={{
                          padding: "0.42rem 1.05rem",
                          borderRadius: "50px",
                          border: active
                            ? "1px solid #A51C30"
                            : "1px solid var(--color-border)",
                          background: active
                            ? "#A51C30"
                            : "var(--color-bg-alt)",
                          color: active ? "#fff" : "var(--color-text)",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.borderColor = "#A51C30";
                            e.currentTarget.style.color = "#A51C30";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.borderColor =
                              "var(--color-border)";
                            e.currentTarget.style.color = "var(--color-text)";
                          }
                        }}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="col-lg-4">
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <i
                    className="bi bi-search"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#A51C30",
                      zIndex: 2,
                    }}
                  />

                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search programs..."
                    aria-label="Search academic programs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      borderRadius: "50px",
                      padding: "0.7rem 1rem 0.7rem 2.6rem",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-bg-alt)",
                      color: "var(--color-text)",
                      boxShadow: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            RESULTS HEADER
        ================================================== */}
        {filteredPrograms.length > 0 && (
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <span>
              Showing{" "}
              <strong
                style={{
                  color: "var(--color-text)",
                }}
              >
                {filteredPrograms.length}
              </strong>{" "}
              {filteredPrograms.length === 1 ? "program" : "programs"}
            </span>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#A51C30",
                  fontWeight: "600",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Clear filter
                <i className="bi bi-x ms-1"></i>
              </button>
            )}
          </div>
        )}

        {/* ==================================================
            PROGRAM LIST
        ================================================== */}
        {filteredPrograms.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              background: "var(--card-bg)",
              borderRadius: "16px",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                margin: "0 auto 1.25rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(165, 28, 48, 0.07)",
                color: "#A51C30",
                fontSize: "1.6rem",
              }}
            >
              <i className="bi bi-search"></i>
            </div>

            <h4
              style={{
                color: "var(--color-text)",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: "700",
              }}
            >
              No programs found
            </h4>

            <p
              className="text-muted mb-3"
              style={{
                fontSize: "0.9rem",
              }}
            >
              Try adjusting your search or category filter.
            </p>

            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="btn"
                style={{
                  borderRadius: "50px",
                  padding: "0.5rem 1.4rem",
                  background: "#A51C30",
                  color: "#fff",
                  fontWeight: "600",
                  border: "none",
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="row g-3 g-lg-4">
            {filteredPrograms.map((program, index) => {
              const category = program.category || "Academic Program";

              return (
                <div
                  key={program.id}
                  className="col-12 col-lg-6"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 0.6s ease ${
                      index * 0.08
                    }s, transform 0.6s ease ${index * 0.08}s`,
                  }}
                >
                  <article
                    className="h-100"
                    style={{
                      position: "relative",
                      background: "var(--card-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "18px",
                      overflow: "hidden",
                      transition:
                        "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 18px 40px rgba(0,0,0,0.09)";
                      e.currentTarget.style.borderColor =
                        "rgba(165, 28, 48, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    {/* Accent line */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        background: "linear-gradient(180deg, #A51C30, #7A1523)",
                      }}
                    />

                    <div className="p-4 p-md-4">
                      {/* Top row */}
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "#A51C30",
                            fontSize: "0.73rem",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          <span
                            style={{
                              width: "30px",
                              height: "30px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                              background: "rgba(165, 28, 48, 0.08)",
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: "0.8rem",
                            }}
                          >
                            {getProgramNumber(index)}
                          </span>

                          {category}
                        </div>

                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            background: "rgba(165, 28, 48, 0.06)",
                            color: "#A51C30",
                            fontSize: "1.1rem",
                          }}
                          title={category}
                          aria-hidden="true"
                        >
                          <i className={`bi ${getCategoryIcon(category)}`} />
                        </div>
                      </div>

                      {/* Program title */}
                      <h2
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "clamp(1.35rem, 2vw, 1.65rem)",
                          lineHeight: "1.3",
                          fontWeight: "700",
                          color: "var(--color-text)",
                          marginBottom: "0.45rem",
                        }}
                      >
                        {program.title}
                      </h2>

                      {/* Subtitle */}
                      {program.subtitle && (
                        <p
                          style={{
                            color: "#A51C30",
                            fontSize: "0.84rem",
                            fontWeight: "600",
                            lineHeight: "1.5",
                            marginBottom: "0.85rem",
                          }}
                        >
                          {program.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      {program.description && (
                        <p
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: "0.9rem",
                            lineHeight: "1.7",
                            marginBottom: "1.2rem",
                          }}
                        >
                          {program.description.substring(0, 145)}
                          {program.description.length > 145 ? "..." : ""}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {program.duration && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.73rem",
                              color: "var(--color-text-muted)",
                              background: "var(--color-bg-alt)",
                              border: "1px solid var(--color-border)",
                              padding: "0.38rem 0.7rem",
                              borderRadius: "50px",
                              fontWeight: "500",
                            }}
                          >
                            <i
                              className="bi bi-clock"
                              style={{
                                color: "#A51C30",
                              }}
                            />
                            {program.duration}
                          </span>
                        )}

                        {program.eligibility && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.73rem",
                              color: "#287a3d",
                              background: "rgba(40, 167, 69, 0.06)",
                              border: "1px solid rgba(40, 167, 69, 0.12)",
                              padding: "0.38rem 0.7rem",
                              borderRadius: "50px",
                              fontWeight: "500",
                            }}
                          >
                            <i className="bi bi-check-circle" />
                            Eligible
                          </span>
                        )}

                        {program.fee && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.73rem",
                              color: "#856404",
                              background: "rgba(255, 193, 7, 0.07)",
                              border: "1px solid rgba(255, 193, 7, 0.15)",
                              padding: "0.38rem 0.7rem",
                              borderRadius: "50px",
                              fontWeight: "500",
                            }}
                          >
                            <i className="bi bi-cash-stack" />
                            {program.fee}
                          </span>
                        )}
                      </div>

                      {/* Bottom action */}
                      <div
                        style={{
                          borderTop: "1px solid var(--color-border)",
                          paddingTop: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: "0.75rem",
                          }}
                        >
                          Explore program
                        </span>

                        <Link
                          to={`/programs/${program.slug || program.id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            color: "#A51C30",
                            fontWeight: "700",
                            fontSize: "0.82rem",
                            textDecoration: "none",
                            transition: "all 0.25s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.gap = "0.7rem";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.gap = "0.45rem";
                          }}
                        >
                          View Details
                          <i className="bi bi-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}

        {/* ==================================================
            BOTTOM CTA
        ================================================== */}
        {programs.length > 0 && (
          <div
            className="text-center mt-5 pt-3"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "18px",
                background: "var(--card-bg)",
                border: "1px solid var(--color-border)",
                padding: "3rem 1.25rem",
                boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              }}
            >
              {/* Decorative elements */}
              <div
                style={{
                  position: "absolute",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  border: "1px solid rgba(165, 28, 48, 0.08)",
                  top: "-100px",
                  right: "-60px",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "1px solid rgba(165, 28, 48, 0.06)",
                  bottom: "-70px",
                  left: "-40px",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    color: "#A51C30",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Start Your Journey
                </span>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    fontWeight: "700",
                    color: "var(--color-text)",
                    marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  Ready to{" "}
                  <span
                    style={{
                      color: "#A51C30",
                    }}
                  >
                    Apply?
                  </span>
                </h2>

                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: "1.7",
                    maxWidth: "520px",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  Take the first step toward your academic future at GDC
                  Gulabad.
                </p>

                <div className="d-flex flex-wrap gap-3 justify-content-center">
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
                      boxShadow: "0 5px 18px rgba(165, 28, 48, 0.25)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 28px rgba(165, 28, 48, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 5px 18px rgba(165, 28, 48, 0.25)";
                    }}
                  >
                    <i className="bi bi-check-circle me-2" />
                    Check Eligibility
                  </Link>

                  <Link
                    to="/contact"
                    className="btn"
                    style={{
                      padding: "0.7rem 2rem",
                      borderRadius: "50px",
                      fontWeight: "600",
                      textDecoration: "none",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#A51C30";
                      e.currentTarget.style.color = "#A51C30";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <i className="bi bi-envelope me-2" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
