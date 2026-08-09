import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// NOTE: no more module-level cachedPrograms/cacheTimestamp here.
// This now shares the same cache as Programs.jsx via fetchCollection()
// in firebase/db.js, so visiting Home then /programs (or vice versa)
// doesn't trigger a second Firestore read for identical data.

const ProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayPrograms = useMemo(() => programs.slice(0, 4), [programs]);

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

  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="text-center">
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#A51C30" }}
            >
              <span className="visually-hidden">Loading programs...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!programs.length) return null;

  return (
    <section className="pb-3 bg-primary-dark">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#ffff",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "var(--color-primary-dark)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
              border: "2px solid #ffff",
            }}
          >
            Academics
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "white",
              marginBottom: "0.25rem",
            }}
          >
            What We Offer
          </h2>
          <p
            style={{
              color: "var(--color-text-light)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore our diverse range of academic programs
          </p>
        </div>

        <div className="row g-4" style={{ display: "flex", flexWrap: "wrap" }}>
          {displayPrograms.map((program, index) => (
            <div
              key={program.id}
              className="col-md-3 col-sm-6"
              style={{ display: "flex" }}
              data-aos={`${index % 2 == 0 ? "fade-right" : "fade-left"}`}
              data-aos-duration="400"
              data-aos-once="false"
              data-aos-delay={index * 100}
            >
              <div
                className="card shadow-sm border-0 hover-lift"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  flex: "1",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.08)";
                }}
              >
                {program.imageUrl && (
                  <img
                    src={program.imageUrl}
                    className="card-img-top"
                    alt={program.title}
                    loading="lazy"
                    decoding="async"
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div
                  className="card-body d-flex flex-column"
                  style={{ flex: "1" }}
                >
                  <h5
                    className="card-title fw-bold"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.1rem",
                      color: "var(--color-text)",
                    }}
                  >
                    {program.title}
                  </h5>
                  {program.subtitle && (
                    <p
                      className="small"
                      style={{ color: "#A51C30", fontWeight: "500" }}
                    >
                      {program.subtitle}
                    </p>
                  )}
                  <p
                    className="card-text"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      lineHeight: "1.6",
                      flex: "1",
                    }}
                  >
                    {program.description?.substring(0, 80)}...
                  </p>
                  <Link
                    to={`/programs/${program.slug || program.id}`}
                    className="btn btn-sm align-self-start"
                    style={{
                      background: "#A51C30",
                      color: "#fff",
                      borderRadius: "50px",
                      padding: "0.3rem 1.5rem",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      border: "none",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      marginTop: "auto",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#7A1523";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(165, 28, 48, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#A51C30";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-arrow-right me-1"></i> Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/programs"
            className="btn"
            style={{
              background: "transparent",
              color: "#ffffff",
              padding: "0.6rem 2.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #ffffff",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#df2d48";
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
            <i className="bi bi-arrow-right me-2 "></i> View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
