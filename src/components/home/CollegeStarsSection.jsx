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
      // Use cache if fresh
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
        const snap = await getDocs(collection(db, "collegeStars"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        cachedStars = data;
        cacheTimestamp = Date.now();
        if (isMounted) {
          setStars(data.slice(0, 4));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching college stars:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchStars();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div
            className="spinner-border"
            style={{ color: "#A51C30" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!stars.length) return null;

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container py-lg-3">
        {/* Section Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "#A51C30",
              background: "rgba(165, 28, 48, 0.07)",
              border: "1px solid rgba(165, 28, 48, 0.12)",
              padding: "0.4rem 1.1rem",
              borderRadius: "50px",
              fontSize: "0.75rem",
              fontWeight: "700",
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Our Pride
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              fontWeight: "700",
              lineHeight: "1.15",
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            College <span style={{ color: "#A51C30" }}>Stars</span>
          </h2>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1rem",
              maxWidth: "620px",
              lineHeight: "1.7",
              margin: "0 auto",
            }}
          >
            Celebrating the remarkable alumni whose achievements continue to
            bring pride to Government Degree College Gulabad.
          </p>
        </div>

        {/* Stars */}
        <div className="row g-4">
          {stars.map((star, index) => (
            <div
              key={star.id}
              className="col-sm-6 col-lg-3"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="h-100"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0, 0, 0, 0.07)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-7px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(0,0,0,0.10)";
                  e.currentTarget.style.borderColor = "rgba(165, 28, 48, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 20px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.07)";
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    height: "220px",
                    overflow: "hidden",
                    background: "rgba(165, 28, 48, 0.04)",
                  }}
                >
                  {star.imageUrl ? (
                    <img
                      src={star.imageUrl}
                      alt={star.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.5s ease",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center h-100"
                      style={{
                        color: "#A51C30",
                        fontSize: "3rem",
                      }}
                    >
                      <i className="bi bi-person-circle"></i>
                    </div>
                  )}

                  {/* Star Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "#fff",
                      color: "#A51C30",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  >
                    <i className="bi bi-star-fill"></i>
                  </div>

                  {/* Batch */}
                  {star.batch && (
                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        bottom: "12px",
                        background: "rgba(255,255,255,0.94)",
                        color: "#A51C30",
                        padding: "0.3rem 0.7rem",
                        borderRadius: "50px",
                        fontSize: "0.68rem",
                        fontWeight: "700",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {star.batch}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div
                  className="p-3 p-lg-4"
                  style={{
                    minHeight: "165px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h5
                    className="fw-bold mb-2"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.15rem",
                      color: "var(--color-text)",
                      lineHeight: "1.3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={star.name}
                  >
                    {star.name}
                  </h5>

                  {star.achievement && (
                    <div
                      className="d-flex align-items-start gap-2"
                      style={{
                        color: "#A51C30",
                        marginBottom: "0.7rem",
                      }}
                    >
                      <i
                        className="bi bi-trophy-fill"
                        style={{
                          fontSize: "0.8rem",
                          marginTop: "3px",
                          flexShrink: 0,
                        }}
                      ></i>

                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          lineHeight: "1.45",
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

                  {/* Optional description */}
                  {star.description && (
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.78rem",
                        lineHeight: "1.5",
                        marginBottom: "0.8rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {star.description}
                    </p>
                  )}

                  {/* Learn More */}
                  {star.link && (
                    <a
                      href={star.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        color: "#A51C30",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        textDecoration: "none",
                      }}
                    >
                      Learn more
                      <i className="bi bi-arrow-up-right"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
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
              gap: "0.6rem",
              background: "#A51C30",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "0.7rem 1.6rem",
              fontSize: "0.85rem",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 8px 22px rgba(165, 28, 48, 0.18)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#7A1523";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(165, 28, 48, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#A51C30";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 22px rgba(165, 28, 48, 0.18)";
            }}
          >
            View All College Stars
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollegeStarsSection;
