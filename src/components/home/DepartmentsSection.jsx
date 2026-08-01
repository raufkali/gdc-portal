import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ✅ Cache for departments
let cachedDepartments = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState(() => {
    if (
      cachedDepartments &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedDepartments;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedDepartments &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedDepartments &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      if (
        cachedDepartments &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setDepartments(cachedDepartments);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching departments from server");
        const data = await fetchCollection("departments");
        cachedDepartments = data;
        cacheTimestamp = Date.now();
        setDepartments(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        if (cachedDepartments) {
          setDepartments(cachedDepartments);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container text-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading departments...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!departments.length) return null;

  const displayDepartments = departments.slice(0, 4);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-left">
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
            Our <span style={{ color: "#A51C30" }}>Departments</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Discover excellence across various disciplines
          </p>
        </div>

        <div className="row g-4">
          {displayDepartments.map((dept) => (
            <div
              key={dept.id}
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-once="false"
              data-aos-delay="100"
              className="col-md-3 col-sm-6"
            >
              <Link
                to={`/departments/${dept.slug || dept.id}`}
                className="text-decoration-none"
              >
                <div
                  className="card h-100 shadow-sm border-0 hover-lift"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  {dept.imageUrl && (
                    <img
                      src={dept.imageUrl}
                      className="card-img-top"
                      alt={dept.name}
                      loading="lazy"
                      style={{ height: "160px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="card-body text-center">
                    <h5
                      className="card-title fw-bold"
                      style={{ fontSize: "1rem", color: "var(--color-text)" }}
                    >
                      {dept.name}
                    </h5>
                    <p
                      className="card-text small text-muted"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {dept.description?.substring(0, 50)}...
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link
            to="/departments"
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
            <i className="bi bi-arrow-right me-2"></i> All Departments
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
