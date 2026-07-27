import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await fetchCollection("departments");
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Get unique categories from departments
  const categories = [
    "All",
    ...new Set(departments.map((d) => d.category).filter(Boolean)),
  ];

  const filteredDepts =
    activeCategory === "All"
      ? departments
      : departments.filter((d) => d.category === activeCategory);

  if (loading) {
    return (
      <section
        className="py-5 mt-5"
        style={{ backgroundColor: "var(--color-bg-alt)" }}
      >
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading departments...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (departments.length === 0) {
    return (
      <section
        className="py-5 mt-5"
        style={{ backgroundColor: "var(--color-bg-alt)" }}
      >
        <div className="container">
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-building"></i>
            </div>
            <h4 className="text-muted">No departments available</h4>
            <p className="text-muted small">
              Please check back later for updates.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <div className="container">
        {/* Header */}
        <div className="d-md-flex justify-content-between align-items-end mb-5">
          <div>
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
                marginBottom: "0.5rem",
              }}
            >
              Academics
            </span>
            <h2
              className="fw-bold mb-1"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Academic Departments
            </h2>
            <p className="text-muted mb-0">
              Discover excellence across various disciplines.
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="mt-3 mt-md-0 p-1 bg-white rounded-pill shadow-sm border d-inline-flex">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn btn-sm rounded-pill px-4 transition-all ${activeCategory === cat ? "btn-active-cat" : "btn-light border-0 text-muted"}`}
                  style={{
                    transition: "all 0.3s ease",
                    backgroundColor:
                      activeCategory === cat ? "#A51C30" : "transparent",
                    color: activeCategory === cat ? "#fff" : "#6c757d",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat) {
                      e.target.style.backgroundColor = "#f8f9fa";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departments Grid */}
        <div className="row g-4">
          {filteredDepts.map((dept) => (
            <div key={dept.id} className="col-12 col-sm-6 col-lg-3">
              <Link
                to={`/departments/${dept.slug || dept.id}`}
                className="text-decoration-none"
                style={{ display: "block", height: "100%" }}
              >
                <div
                  className="dept-card-premium overflow-hidden h-100 bg-white shadow-sm border"
                  style={{
                    borderRadius: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    border: "1px solid #e5e5e5 !important",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.borderColor = "#A51C30";
                    e.currentTarget.style.boxShadow =
                      "0 20px 25px -5px rgba(165,28,48,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e5e5e5";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Image */}
                  <div
                    className="position-relative"
                    style={{ height: "160px", overflow: "hidden" }}
                  >
                    {dept.imageUrl ? (
                      <img
                        src={dept.imageUrl}
                        alt={dept.name}
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div style="
                              width: 100%;
                              height: 160px;
                              background: linear-gradient(145deg, #1A1A1A, #2C2C2C);
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              color: rgba(255,255,255,0.1);
                              font-size: 3rem;
                            ">
                              <i class="bi bi-building"></i>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "160px",
                          background:
                            "linear-gradient(145deg, #1A1A1A, #2C2C2C)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(255,255,255,0.1)",
                          fontSize: "3rem",
                        }}
                      >
                        <i className="bi bi-building"></i>
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        background:
                          "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
                      }}
                    ></div>
                    {dept.category && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(255,255,255,0.92)",
                          backdropFilter: "blur(4px)",
                          color: "#1E1B18",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                        }}
                      >
                        {dept.category}
                      </span>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-25px",
                        left: "25px",
                        width: "50px",
                        height: "50px",
                        background: "#A51C30",
                        color: "white",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        boxShadow: "0 8px 15px rgba(165,28,48,0.3)",
                        zIndex: 2,
                      }}
                    >
                      <i className={`bi ${dept.icon || "bi-building"}`}></i>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-5">
                    <h5
                      className="fw-bold mb-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      {dept.name}
                    </h5>
                    <p className="text-muted small mb-4">
                      {dept.description?.substring(0, 50)}...
                    </p>

                    {/* Enrollment Progress */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="x-small fw-bold text-muted text-uppercase">
                          Faculty
                        </span>
                        <span
                          className="x-small fw-bold"
                          style={{ color: "#A51C30" }}
                        >
                          {dept.facultyCount || 0}
                        </span>
                      </div>
                      <div
                        className="progress"
                        style={{
                          height: "4px",
                          backgroundColor: "#e5e5e5",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${Math.min((dept.facultyCount || 0) * 5, 100)}%`,
                            backgroundColor: "#A51C30",
                            borderRadius: "2px",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <span className="text-muted x-small">
                        Head: <strong>{dept.headName || "TBA"}</strong>
                      </span>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "1px solid #e5e5e5",
                          background: "white",
                          color: "#6B655A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#A51C30";
                          e.target.style.color = "white";
                          e.target.style.borderColor = "#A51C30";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "white";
                          e.target.style.color = "#6B655A";
                          e.target.style.borderColor = "#e5e5e5";
                        }}
                      >
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-5">
          <Link
            to="/departments"
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
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 8px 30px rgba(165, 28, 48, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(165, 28, 48, 0.3)";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i>
            View All Departments
          </Link>
        </div>
      </div>

      <style>{`
        .x-small { font-size: 0.7rem; }
        .progress { background-color: #e5e5e5; }
      `}</style>
    </section>
  );
};

export default Departments;
