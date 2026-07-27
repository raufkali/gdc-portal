import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const ExamResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCollection("examResults", [
      { type: "orderBy", field: "year", direction: "desc" },
    ])
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  // Get unique departments
  const departments = [
    "All",
    ...new Set(results.map((r) => r.department).filter(Boolean)),
  ];

  // Filter results
  const filteredResults = results.filter((result) => {
    const matchDepartment =
      selectedDepartment === "All" || result.department === selectedDepartment;
    const matchSearch =
      result.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.year?.includes(searchTerm);
    return matchDepartment && matchSearch;
  });

  if (loading) return <Loader />;

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
        paddingTop: "5rem",
      }}
    >
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5" data-aos="fade-up">
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
            Exam Results
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
            Result <span style={{ color: "#A51C30" }}>Downloads</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Download exam result PDFs by department and year
          </p>
        </div>

        {/* Search & Filter */}
        <div className="row g-3 mb-4" data-aos="fade-up" data-aos-delay="100">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: "0 8px 8px 0" }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ borderRadius: "8px" }}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "All" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 text-md-end">
            <span className="text-muted small">
              <i className="bi bi-file-earmark-pdf me-1"></i>
              {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-5" data-aos="fade-up">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-file-earmark-pdf"></i>
            </div>
            <h4 className="text-muted">No results available</h4>
            <p className="text-muted small">
              {searchTerm || selectedDepartment !== "All"
                ? "No results match your search criteria."
                : "Exam result PDFs will be uploaded here as they become available."}
            </p>
          </div>
        ) : (
          <div className="row g-3" data-aos="fade-up" data-aos-delay="200">
            {filteredResults.map((result) => (
              <div key={result.id} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    backgroundColor: "var(--card-bg)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(0,0,0,0.05)";
                  }}
                >
                  <div className="card-body p-4">
                    {/* PDF Icon */}
                    <div className="d-flex align-items-start gap-3">
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "10px",
                          background: "rgba(220, 53, 69, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className="bi bi-file-earmark-pdf fs-2"
                          style={{ color: "#dc3545" }}
                        ></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6
                          className="fw-bold mb-1"
                          style={{
                            color: "var(--color-text)",
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={result.title}
                        >
                          {result.title}
                        </h6>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <span
                            className="badge"
                            style={{
                              background: "rgba(165, 28, 48, 0.1)",
                              color: "#A51C30",
                              fontSize: "0.7rem",
                              fontWeight: "500",
                            }}
                          >
                            <i className="bi bi-building me-1"></i>
                            {result.department || "General"}
                          </span>
                          {result.year && (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(23, 162, 184, 0.1)",
                                color: "#17a2b8",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                              }}
                            >
                              <i className="bi bi-calendar me-1"></i>
                              {result.year}
                            </span>
                          )}
                          {result.semester && (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(255, 193, 7, 0.1)",
                                color: "#ffc107",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                              }}
                            >
                              <i className="bi bi-book me-1"></i>
                              {result.semester}
                            </span>
                          )}
                        </div>
                        {result.description && (
                          <p
                            className="text-muted small mt-2 mb-0"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
                    <a
                      href={result.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100"
                      style={{
                        background: "linear-gradient(145deg, #A51C30, #7A1523)",
                        color: "#fff",
                        borderRadius: "50px",
                        padding: "0.4rem 1rem",
                        fontWeight: "500",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 8px 20px rgba(165, 28, 48, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <i className="bi bi-download"></i>
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results CTA */}
        {results.length === 0 && (
          <div
            className="text-center mt-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                background: "var(--color-bg)",
                padding: "2rem 1rem",
              }}
            >
              <h5
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)",
                  fontWeight: "700",
                  color: "var(--color-text)",
                  marginBottom: "0.5rem",
                }}
              >
                No Results{" "}
                <span style={{ color: "#A51C30" }}>Uploaded Yet</span>
              </h5>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.95rem",
                  maxWidth: "500px",
                  margin: "0 auto 1.2rem",
                }}
              >
                Result PDFs will appear here once uploaded by the
                administration.
              </p>
              <Link
                to="/contact"
                className="btn"
                style={{
                  background: "linear-gradient(145deg, #A51C30, #7A1523)",
                  color: "#fff",
                  padding: "0.6rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                  display: "inline-block",
                  fontSize: "0.9rem",
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
                <i className="bi bi-envelope me-2"></i>
                Contact Administration
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResult;
