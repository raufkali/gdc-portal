import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedDepartments = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredDept, setFeaturedDept] = useState(null);
  const [otherDepts, setOtherDepts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
      if (
        cachedDepartments &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setDepartments(cachedDepartments);
          processDepartments(cachedDepartments);
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDocs(collection(db, "departments"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort by name or order if available – fallback to random?
        // We'll just keep the order as is from Firestore.
        cachedDepartments = data;
        cacheTimestamp = Date.now();
        if (isMounted) {
          setDepartments(data);
          processDepartments(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        if (isMounted) setLoading(false);
      }
    };

    const processDepartments = (data) => {
      if (data.length === 0) {
        setFeaturedDept(null);
        setOtherDepts([]);
        return;
      }
      setFeaturedDept(data[0]);
      setOtherDepts(data.slice(1, 4));
    };

    fetchDepartments();
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

  if (!departments.length) return null;

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <div className="container">
        {/* Section Header */}
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
            Academic Departments
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
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore our academic departments, each dedicated to excellence in
            teaching and research.
          </p>
        </div>

        {/* Featured Department */}
        {featuredDept && (
          <div className="mb-4" data-aos="fade-up" data-aos-duration="600">
            <div
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                borderRadius: "20px",
                backgroundColor: "var(--card-bg)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 50px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 40px rgba(0,0,0,0.08)";
              }}
            >
              <div className="row g-0">
                {featuredDept.imageUrl && (
                  <div className="col-lg-6">
                    <div
                      style={{
                        height: "100%",
                        minHeight: "280px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={featuredDept.imageUrl}
                        alt={featuredDept.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.03)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "20px",
                          left: "20px",
                          background: "#A51C30",
                          color: "#fff",
                          padding: "0.3rem 1.2rem",
                          borderRadius: "50px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Featured
                      </div>
                    </div>
                  </div>
                )}
                <div className={featuredDept.imageUrl ? "col-lg-6" : "col-12"}>
                  <div className="p-4 p-md-5 d-flex flex-column h-100">
                    {featuredDept.category && (
                      <div className="mb-2">
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#A51C30",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {featuredDept.category}
                        </span>
                      </div>
                    )}
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                        fontWeight: "700",
                        color: "var(--color-text)",
                        marginBottom: "0.75rem",
                        lineHeight: "1.2",
                      }}
                    >
                      {featuredDept.name}
                    </h3>
                    {featuredDept.description && (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "1rem",
                          lineHeight: "1.7",
                          flex: "1",
                          marginBottom: "1rem",
                        }}
                      >
                        {featuredDept.description}
                      </p>
                    )}
                    <div className="mt-3">
                      <Link
                        to={`/departments/${featuredDept.id}`}
                        className="btn"
                        style={{
                          background: "#A51C30",
                          color: "#fff",
                          borderRadius: "50px",
                          padding: "0.5rem 1.8rem",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          border: "none",
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#7A1523";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 25px rgba(165, 28, 48, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#A51C30";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Explore Department{" "}
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of other departments */}
        {otherDepts.length > 0 && (
          <div className="row g-4">
            {otherDepts.map((dept, index) => (
              <div
                key={dept.id}
                className="col-md-4"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "var(--card-bg)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.06)";
                  }}
                >
                  {dept.imageUrl && (
                    <div style={{ overflow: "hidden" }}>
                      <img
                        src={dept.imageUrl}
                        className="card-img-top"
                        alt={dept.name}
                        style={{
                          height: "180px",
                          width: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                  <div className="card-body p-3">
                    <h6
                      className="fw-bold"
                      style={{
                        color: "var(--color-text)",
                        fontSize: "1rem",
                        marginBottom: "0.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {dept.name}
                    </h6>
                    {dept.description && (
                      <p
                        className="small"
                        style={{
                          color: "var(--color-text-muted)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {dept.description}
                      </p>
                    )}
                    {dept.category && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(165, 28, 48, 0.08)",
                          color: "#A51C30",
                          fontSize: "0.65rem",
                          padding: "0.25rem 0.7rem",
                          borderRadius: "50px",
                          fontWeight: "500",
                        }}
                      >
                        {dept.category}
                      </span>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
                    <Link
                      to={`/departments/${dept.id}`}
                      className="btn w-100"
                      style={{
                        background: "transparent",
                        color: "#A51C30",
                        border: "1px solid #A51C30",
                        borderRadius: "50px",
                        padding: "0.3rem 0.8rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#A51C30";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#A51C30";
                      }}
                    >
                      Learn More <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All button */}
        <div className="text-center mt-5">
          <Link
            to="/departments"
            className="btn"
            style={{
              background: "transparent",
              color: "#A51C30",
              padding: "0.5rem 2.5rem",
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
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            View All Departments <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
