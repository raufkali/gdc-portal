import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedStars = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

const CollegeStarsSection = () => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStars = async () => {
      // --------------------------------------------------
      // Use fresh cache
      // --------------------------------------------------
      if (
        cachedStars &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setStars(cachedStars.slice(0, 4));
          setLoading(false);
        }

        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "collegeStars"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        cachedStars = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setStars(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching college stars:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStars();

    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <section
        className="py-5"
        style={{
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div className="container text-center py-4">
          <div
            className="spinner-border"
            style={{
              color: "#A51C30",
              width: "1.8rem",
              height: "1.8rem",
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!stars.length) {
    return null;
  }

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "var(--color-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container py-lg-4">
        {/* ==================================================
            SECTION HEADER
        ================================================== */}
        <div className="text-center mb-5" data-aos="fade-up">
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
            Our Pride
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.3rem, 5vw, 4rem)",
              fontWeight: "700",
              lineHeight: "1.15",
              color: "var(--color-text)",
              marginBottom: "0.8rem",
            }}
          >
            Meet Our <span style={{ color: "#A51C30" }}>College Stars</span>
          </h2>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              lineHeight: "1.7",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Celebrating the outstanding alumni whose achievements continue to
            inspire our students and bring pride to Government Degree College
            Gulabad.
          </p>
        </div>

        {/* ==================================================
            STARS
        ================================================== */}
        <div className="row g-3 g-lg-4">
          {stars.map((star, index) => (
            <div
              key={star.id}
              className="col-12 col-sm-6 col-lg-3"
              data-aos="fade-up"
              data-aos-delay={index * 100}
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
                  e.currentTarget.style.transform = "translateY(-6px)";

                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(0,0,0,0.09)";

                  e.currentTarget.style.borderColor = "rgba(165, 28, 48, 0.25)";
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
                    zIndex: 2,
                  }}
                />

                {/* ==================================================
                    PROFILE IMAGE
                ================================================== */}
                <div
                  style={{
                    position: "relative",
                    height: "230px",
                    overflow: "hidden",
                    background: "rgba(165, 28, 48, 0.05)",
                  }}
                >
                  {star.imageUrl ? (
                    <img
                      src={star.imageUrl}
                      alt={`${star.name} - College Star`}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center h-100"
                      style={{
                        color: "#A51C30",
                        fontSize: "3.5rem",
                      }}
                    >
                      <i className="bi bi-person-circle" />
                    </div>
                  )}

                  {/* Number */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.94)",
                      color: "#A51C30",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Batch */}
                  {star.batch && (
                    <span
                      style={{
                        position: "absolute",
                        right: "14px",
                        bottom: "14px",
                        background: "rgba(255,255,255,0.94)",
                        color: "#A51C30",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "50px",
                        fontSize: "0.68rem",
                        fontWeight: "700",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                      }}
                    >
                      {star.batch}
                    </span>
                  )}
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}
                <div
                  className="p-3 p-lg-4"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "190px",
                  }}
                >
                  {/* Name */}
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "var(--color-text)",
                      lineHeight: "1.3",
                      marginBottom: "0.7rem",
                    }}
                    title={star.name}
                  >
                    {star.name}
                  </h3>

                  {/* Achievement */}
                  {star.achievement && (
                    <div
                      className="d-flex align-items-start gap-2"
                      style={{
                        color: "#A51C30",
                        marginBottom: "0.8rem",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          background: "rgba(165, 28, 48, 0.07)",
                        }}
                      >
                        <i
                          className="bi bi-trophy-fill"
                          style={{
                            fontSize: "0.72rem",
                          }}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          lineHeight: "1.5",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title={star.achievement}
                      >
                        {star.achievement}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {star.description && (
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.78rem",
                        lineHeight: "1.55",
                        marginBottom: "1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {star.description}
                    </p>
                  )}

                  {/* Bottom action */}
                  {star.link && (
                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: "0.9rem",
                        borderTop: "1px solid var(--color-border)",
                      }}
                    >
                      <a
                        href={star.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          color: "#A51C30",
                          fontSize: "0.78rem",
                          fontWeight: "700",
                          textDecoration: "none",
                          transition: "all 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.gap = "0.7rem";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.gap = "0.4rem";
                        }}
                      >
                        Learn More
                        <i className="bi bi-arrow-up-right" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* ==================================================
            CTA
        ================================================== */}
        <div
          className="text-center mt-5"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Link
            to="/college-stars"
            className="btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              background: "linear-gradient(145deg, #A51C30, #7A1523)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "0.7rem 1.7rem",
              fontSize: "0.84rem",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 7px 22px rgba(165, 28, 48, 0.18)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";

              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(165, 28, 48, 0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";

              e.currentTarget.style.boxShadow =
                "0 7px 22px rgba(165, 28, 48, 0.18)";
            }}
          >
            View All College Stars
            <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollegeStarsSection;
