import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Module-level cache
let cachedStars = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

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

  const [loading, setLoading] = useState(
    !(cachedStars && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL),
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStars = async () => {
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

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          cachedStars = data;
          cacheTimestamp = Date.now();

          setStars(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching college stars:", error);

        if (isMounted) {
          if (cachedStars) {
            setStars(cachedStars);
          }

          setLoading(false);
        }
      }
    };

    fetchStars();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filtered Stars
  |--------------------------------------------------------------------------
  */

  const filteredStars = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return stars;

    return stars.filter((star) => {
      return (
        star.name?.toLowerCase().includes(query) ||
        star.achievement?.toLowerCase().includes(query) ||
        star.description?.toLowerCase().includes(query) ||
        star.batch?.toLowerCase().includes(query)
      );
    });
  }, [stars, search]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/);

    if (!parts.length) return "?";

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const truncateText = (text, length = 180) => {
    if (!text) return "";

    if (text.length <= length) return text;

    return `${text.substring(0, length).trim()}...`;
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="py-5 mt-5"
        style={{
          minHeight: "70vh",
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="container py-5 text-center">
          <div
            className="spinner-border"
            role="status"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              color: "#A51C30",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <p
            className="mt-3 mb-0"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Discovering our college stars...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (!stars.length) {
    return (
      <div
        className="py-5 mt-5"
        style={{
          minHeight: "70vh",
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="container py-5 text-center">
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(165, 28, 48, 0.08)",
              color: "#A51C30",
              fontSize: "2rem",
            }}
          >
            <i className="bi bi-stars"></i>
          </div>

          <h2
            className="fw-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "var(--color-text)",
            }}
          >
            Our Stars Are Coming
          </h2>

          <p
            className="mb-0"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            Outstanding alumni and their achievements will appear here.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="college-stars-page py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "70vh",
      }}
    >
      <div className="container">
        {/* ================================================================
            HEADER
        ================================================================= */}

        <div
          className="text-center mb-5"
          data-aos="fade-up"
          style={{
            maxWidth: "850px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              background: "rgba(165, 28, 48, 0.07)",
              padding: "0.45rem 1.15rem",
              borderRadius: "50px",
              marginBottom: "1rem",
            }}
          >
            <i className="bi bi-stars"></i>
            Our Pride
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: "1.05",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "1rem",
              letterSpacing: "-1px",
            }}
          >
            College <span style={{ color: "#A51C30" }}>Stars</span>
          </h1>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              lineHeight: "1.8",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Celebrating the remarkable graduates of GDC Gulabad who have gone on
            to achieve excellence, inspire others, and make their college proud.
          </p>
        </div>

        {/* ================================================================
            SEARCH
        ================================================================= */}

        {stars.length > 3 && (
          <div className="mb-5" data-aos="fade-up" data-aos-delay="100">
            <div
              className="mx-auto"
              style={{
                maxWidth: "520px",
                position: "relative",
              }}
            >
              <i
                className="bi bi-search"
                style={{
                  position: "absolute",
                  left: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#A51C30",
                  zIndex: 2,
                }}
              ></i>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alumni, achievements or batch..."
                className="form-control"
                style={{
                  height: "52px",
                  borderRadius: "50px",
                  border: "1px solid rgba(165, 28, 48, 0.12)",
                  backgroundColor: "var(--card-bg)",
                  color: "var(--color-text)",
                  paddingLeft: "48px",
                  paddingRight: "45px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                }}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "var(--color-text-muted)",
                    fontSize: "1rem",
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================
            RESULTS COUNT
        ================================================================= */}

        {search && (
          <div
            className="mb-4"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
            }}
          >
            Showing{" "}
            <strong style={{ color: "#A51C30" }}>{filteredStars.length}</strong>{" "}
            {filteredStars.length === 1 ? "alumnus" : "alumni"}
          </div>
        )}

        {/* ================================================================
            ALUMNI LIST
        ================================================================= */}

        {filteredStars.length > 0 ? (
          <div className="stars-list">
            {filteredStars.map((star, index) => (
              <article
                key={star.id}
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 70, 400)}
                className="star-profile"
                style={{
                  position: "relative",
                  background: "var(--card-bg)",
                  borderRadius: "18px",
                  border: "1px solid rgba(165, 28, 48, 0.07)",
                  marginBottom: "1.25rem",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";

                  e.currentTarget.style.boxShadow =
                    "0 18px 45px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";

                  e.currentTarget.style.boxShadow =
                    "0 5px 25px rgba(0,0,0,0.04)";
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
                    background:
                      "linear-gradient(to bottom, #A51C30, rgba(165,28,48,0.15))",
                  }}
                />

                <div className="p-4 p-md-4">
                  <div className="row align-items-center g-4">
                    {/* ====================================================
                        IMAGE
                    ===================================================== */}

                    <div className="col-auto">
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          padding: "4px",
                          background:
                            "linear-gradient(145deg, #A51C30, rgba(165,28,48,0.15))",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "rgba(165,28,48,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {star.imageUrl ? (
                            <img
                              src={star.imageUrl}
                              alt={star.name || "College Star"}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";

                                const parent = e.currentTarget.parentElement;

                                if (parent) {
                                  parent.innerHTML = `
                                    <span style="
                                      font-family: Georgia, serif;
                                      font-size: 1.4rem;
                                      font-weight: 700;
                                      color: #A51C30;
                                    ">
                                      ${getInitials(star.name)}
                                    </span>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                fontFamily: "Georgia, serif",
                                fontSize: "1.4rem",
                                fontWeight: "700",
                                color: "#A51C30",
                              }}
                            >
                              {getInitials(star.name)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ====================================================
                        MAIN CONTENT
                    ===================================================== */}

                    <div className="col">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <h2
                          className="mb-0"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "clamp(1.25rem, 2vw, 1.55rem)",
                            fontWeight: "700",
                            color: "var(--color-text)",
                            lineHeight: "1.25",
                          }}
                        >
                          {star.name}
                        </h2>

                        {star.batch && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              background: "rgba(165, 28, 48, 0.07)",
                              color: "#A51C30",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "50px",
                              fontSize: "0.68rem",
                              fontWeight: "700",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <i className="bi bi-mortarboard"></i>
                            {star.batch}
                          </span>
                        )}
                      </div>

                      {/* Achievement */}

                      {star.achievement && (
                        <div
                          className="d-flex align-items-start gap-2 mt-2"
                          style={{
                            color: "#A51C30",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          }}
                        >
                          <i
                            className="bi bi-trophy-fill"
                            style={{
                              marginTop: "3px",
                              flexShrink: 0,
                            }}
                          ></i>

                          <span
                            style={{
                              minWidth: 0,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {truncateText(star.achievement, 150)}
                          </span>
                        </div>
                      )}

                      {/* Description */}

                      {star.description && (
                        <p
                          className="mb-0 mt-2"
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: "0.88rem",
                            lineHeight: "1.7",
                            maxWidth: "760px",
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {truncateText(star.description, 220)}
                        </p>
                      )}
                    </div>

                    {/* ====================================================
                        ACTION
                    ===================================================== */}

                    {star.link && (
                      <div className="col-12 col-md-auto">
                        <a
                          href={star.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-inline-flex align-items-center justify-content-center gap-2"
                          style={{
                            minWidth: "125px",
                            height: "40px",
                            padding: "0 1rem",
                            borderRadius: "50px",
                            border: "1px solid rgba(165,28,48,0.25)",
                            background: "transparent",
                            color: "#A51C30",
                            fontSize: "0.78rem",
                            fontWeight: "600",
                            textDecoration: "none",
                            transition: "all 0.25s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#A51C30";

                            e.currentTarget.style.color = "#fff";

                            e.currentTarget.style.borderColor = "#A51C30";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";

                            e.currentTarget.style.color = "#A51C30";

                            e.currentTarget.style.borderColor =
                              "rgba(165,28,48,0.25)";
                          }}
                        >
                          Learn More
                          <i className="bi bi-arrow-up-right"></i>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ================================================================
             NO SEARCH RESULTS
          ================================================================= */

          <div className="text-center py-5" data-aos="fade-up">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(165, 28, 48, 0.07)",
                color: "#A51C30",
                fontSize: "1.6rem",
              }}
            >
              <i className="bi bi-search"></i>
            </div>

            <h4
              className="fw-bold mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "var(--color-text)",
              }}
            >
              No alumni found
            </h4>

            <p
              className="mb-3"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              Try searching with a different name, batch, or achievement.
            </p>

            <button
              type="button"
              className="btn rounded-pill px-4"
              onClick={() => setSearch("")}
              style={{
                background: "#A51C30",
                color: "#fff",
                border: "none",
                fontSize: "0.85rem",
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ================================================================
            BOTTOM MESSAGE
        ================================================================= */}

        {!search && filteredStars.length > 0 && (
          <div className="text-center mt-5 pt-4" data-aos="fade-up">
            <div
              style={{
                width: "60px",
                height: "1px",
                background: "rgba(165,28,48,0.25)",
                margin: "0 auto 1.25rem",
              }}
            />

            <p
              className="mb-0"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "var(--color-text-muted)",
              }}
            >
              Their success is a reflection of the spirit of GDC Gulabad.
            </p>
          </div>
        )}
      </div>

      {/* ================================================================
          RESPONSIVE STYLES
      ================================================================= */}

      <style>
        {`
          .college-stars-page input::placeholder {
            color: var(--color-text-muted);
            opacity: 0.75;
          }

          .college-stars-page input:focus {
            border-color: rgba(165, 28, 48, 0.35) !important;
            box-shadow:
              0 0 0 3px rgba(165, 28, 48, 0.06),
              0 8px 30px rgba(0,0,0,0.04) !important;
            outline: none;
          }

          @media (max-width: 575.98px) {
            .college-stars-page {
              padding-top: 3rem !important;
            }

            .star-profile {
              border-radius: 15px !important;
            }

            .star-profile .p-4 {
              padding: 1.25rem !important;
            }

            .star-profile .col-auto {
              width: 100%;
            }

            .star-profile .col-auto > div {
              margin: 0 auto;
            }

            .star-profile .col {
              width: 100%;
              text-align: center;
            }

            .star-profile .col .d-flex {
              justify-content: center;
            }

            .star-profile .col-12.col-md-auto {
              width: 100%;
            }

            .star-profile .col-12.col-md-auto a {
              width: 100%;
            }
          }

          @media (min-width: 576px) and (max-width: 767.98px) {
            .star-profile .col-auto {
              width: 100%;
            }

            .star-profile .col-auto > div {
              margin: 0 auto;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CollegeStars;
