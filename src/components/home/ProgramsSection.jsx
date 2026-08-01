import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ✅ Cache for programs
let cachedPrograms = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const ProgramsSection = () => {
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

  const displayPrograms = programs.slice(0, 4);

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
            }}
          >
            Academics
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.25rem",
            }}
          >
            What We <span style={{ color: "#A51C30" }}>Offer</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore our diverse range of academic programs
          </p>
        </div>

        <div className="row g-4">
          {displayPrograms.map((program) => (
            <div key={program.id} className="col-md-3 col-sm-6">
              <div
                className="card h-100 shadow-sm border-0 hover-lift"
                data-aos="fade-right"
                data-aos-duration="600"
                data-aos-once="false"
                data-aos-delay="100"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                {program.imageUrl && (
                  <img
                    src={program.imageUrl}
                    className="card-img-top"
                    alt={program.title}
                    loading="lazy"
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="card-body d-flex flex-column">
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
                    className="card-text flex-grow-1"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      lineHeight: "1.6",
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
              color: "#A51C30",
              padding: "0.6rem 2.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #A51C30",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#A51C30";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(165, 28, 48, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#A51C30";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i> View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
