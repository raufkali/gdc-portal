import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const ExamResult = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const pdfViewerRef = useRef(null);

  useEffect(() => {
    fetchCollection("examResults", [
      { type: "orderBy", field: "year", direction: "desc" },
    ])
      .then((data) => {
        setResults(data);
        setFilteredResults(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Get unique departments and years
  const departments = [
    "All",
    ...new Set(results.map((r) => r.department).filter(Boolean)),
  ];
  const years = ["All", ...new Set(results.map((r) => r.year).filter(Boolean))];

  // Filter and sort results
  useEffect(() => {
    let filtered = [...results];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (result) =>
          result.title?.toLowerCase().includes(term) ||
          result.department?.toLowerCase().includes(term) ||
          result.year?.includes(term) ||
          result.semester?.toLowerCase().includes(term) ||
          result.description?.toLowerCase().includes(term),
      );
    }

    // Department filter
    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (result) => result.department === selectedDepartment,
      );
    }

    // Year filter
    if (selectedYear !== "All") {
      filtered = filtered.filter((result) => result.year === selectedYear);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy] || "";
      let bVal = b[sortBy] || "";

      if (sortBy === "year") {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredResults(filtered);
  }, [
    results,
    searchTerm,
    selectedDepartment,
    selectedYear,
    sortBy,
    sortOrder,
  ]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleViewPDF = (result) => {
    setSelectedResult(result);
    setShowPdfViewer(true);
    document.body.style.overflow = "hidden";
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setSelectedResult(null);
    document.body.style.overflow = "auto";
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closePdfViewer();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
            Search, filter, and download exam result PDFs
          </p>
        </div>

        {/* Search & Filters */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: "14px" }}
        >
          <div className="card-body p-4">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by title, department, year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: "0 8px 8px 0" }}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setSearchTerm("")}
                      style={{ borderRadius: "8px" }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Department Filter */}
              <div className="col-md-3">
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

              {/* Year Filter */}
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ borderRadius: "8px" }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year === "All" ? "All Years" : year}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="col-md-3 d-flex gap-2 justify-content-md-end">
                <div className="btn-group" role="group">
                  <button
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("grid")}
                    style={{ borderRadius: "8px 0 0 8px" }}
                  >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </button>
                  <button
                    className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setViewMode("list")}
                    style={{ borderRadius: "0 8px 8px 0" }}
                  >
                    <i className="bi bi-list-ul"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count & Sort */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-2 border-top">
              <span className="text-muted small">
                <i className="bi bi-file-earmark-pdf me-1"></i>
                {filteredResults.length} result
                {filteredResults.length !== 1 ? "s" : ""} found
              </span>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm ${sortBy === "title" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => toggleSort("title")}
                  style={{ borderRadius: "8px", fontSize: "0.75rem" }}
                >
                  Title{" "}
                  {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  className={`btn btn-sm ${sortBy === "year" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => toggleSort("year")}
                  style={{ borderRadius: "8px", fontSize: "0.75rem" }}
                >
                  Year {sortBy === "year" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  className={`btn btn-sm ${sortBy === "department" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => toggleSort("department")}
                  style={{ borderRadius: "8px", fontSize: "0.75rem" }}
                >
                  Department{" "}
                  {sortBy === "department" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-5" data-aos="fade-up">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-file-earmark-pdf"></i>
            </div>
            <h4 className="text-muted">No results found</h4>
            <p className="text-muted small">
              {searchTerm ||
              selectedDepartment !== "All" ||
              selectedYear !== "All"
                ? "No results match your search criteria. Try adjusting your filters."
                : "Exam result PDFs will be uploaded here as they become available."}
            </p>
            {(searchTerm ||
              selectedDepartment !== "All" ||
              selectedYear !== "All") && (
              <button
                className="btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("All");
                  setSelectedYear("All");
                }}
                style={{
                  background: "#A51C30",
                  color: "#fff",
                  borderRadius: "50px",
                  padding: "0.5rem 1.5rem",
                  border: "none",
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>
                Clear Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div
            className="row g-4"
            data-aos="fade"
            data-aos-delay="200"
            data-aos-once="true"
          >
            {filteredResults.map((result) => (
              <div key={result.id} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid rgba(165, 28, 48, 0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(165, 28, 48, 0.12)";
                    e.currentTarget.style.borderColor =
                      "rgba(165, 28, 48, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor =
                      "rgba(165, 28, 48, 0.06)";
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    style={{
                      height: "4px",
                      background: "linear-gradient(90deg, #A51C30, #7A1523)",
                      width: "100%",
                    }}
                  ></div>

                  <div className="card-body p-4">
                    <div className="d-flex align-items-start gap-3">
                      {/* PDF Icon - Crimson */}
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "12px",
                          background: "rgba(165, 28, 48, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: "1px solid rgba(165, 28, 48, 0.1)",
                        }}
                      >
                        <i
                          className="bi bi-file-earmark-pdf fs-3"
                          style={{ color: "#A51C30" }}
                        ></i>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title */}
                        <h6
                          className="fw-bold mb-2"
                          style={{
                            color: "var(--color-text)",
                            fontSize: "0.95rem",
                            lineHeight: "1.4",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          title={result.title}
                        >
                          {result.title}
                        </h6>

                        {/* Badges - All Crimson */}
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          {result.department && (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(165, 28, 48, 0.08)",
                                color: "#A51C30",
                                fontSize: "0.65rem",
                                fontWeight: "600",
                                padding: "0.3rem 0.7rem",
                                borderRadius: "50px",
                              }}
                            >
                              <i
                                className="bi bi-building me-1"
                                style={{ fontSize: "0.6rem" }}
                              ></i>
                              {result.department}
                            </span>
                          )}
                          {result.year && (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(165, 28, 48, 0.06)",
                                color: "#A51C30",
                                fontSize: "0.65rem",
                                fontWeight: "600",
                                padding: "0.3rem 0.7rem",
                                borderRadius: "50px",
                              }}
                            >
                              <i
                                className="bi bi-calendar me-1"
                                style={{ fontSize: "0.6rem" }}
                              ></i>
                              {result.year}
                            </span>
                          )}
                          {result.semester && (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(165, 28, 48, 0.04)",
                                color: "#A51C30",
                                fontSize: "0.65rem",
                                fontWeight: "600",
                                padding: "0.3rem 0.7rem",
                                borderRadius: "50px",
                              }}
                            >
                              <i
                                className="bi bi-book me-1"
                                style={{ fontSize: "0.6rem" }}
                              ></i>
                              {result.semester}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {result.description && (
                          <p
                            className="text-muted small mb-0"
                            style={{
                              fontSize: "0.8rem",
                              lineHeight: "1.5",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
                    <div className="d-flex gap-2">
                      {/* View Button - Crimson */}
                      <button
                        onClick={() => handleViewPDF(result)}
                        className="btn flex-grow-1"
                        style={{
                          background:
                            "linear-gradient(145deg, #A51C30, #7A1523)",
                          color: "#fff",
                          borderRadius: "50px",
                          padding: "0.45rem 1rem",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          border: "none",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(165, 28, 48, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 25px rgba(165, 28, 48, 0.35)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 12px rgba(165, 28, 48, 0.2)";
                        }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View PDF
                      </button>

                      {/* Download Button - Crimson Outline */}
                      <a
                        href={result.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          background: "transparent",
                          color: "#A51C30",
                          borderRadius: "50px",
                          padding: "0.45rem 1rem",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          border: "2px solid #A51C30",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#A51C30";
                          e.target.style.color = "#fff";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 20px rgba(165, 28, 48, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#A51C30";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <i className="bi bi-download"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "14px" }}
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead
                  style={{
                    background: "linear-gradient(145deg, #A51C30, #7A1523)",
                    color: "#fff",
                    borderRadius: "14px 14px 0 0",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        borderTop: "none",
                        padding: "1rem",
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        borderTop: "none",
                        padding: "1rem",
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      Title
                    </th>
                    <th
                      style={{
                        borderTop: "none",
                        padding: "1rem",
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      Department
                    </th>
                    <th
                      style={{
                        borderTop: "none",
                        padding: "1rem",
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      Year
                    </th>
                    <th
                      style={{
                        borderTop: "none",
                        padding: "1rem",
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      Semester
                    </th>
                    <th
                      style={{
                        borderTop: "none",
                        padding: "1rem",
                        color: "#fff",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <tr
                      key={result.id}
                      style={{
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(165, 28, 48, 0.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div>
                          <strong style={{ color: "var(--color-text)" }}>
                            {result.title}
                          </strong>
                          {result.description && (
                            <div
                              className="small text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {result.description.substring(0, 60)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {result.department && (
                          <span
                            className="badge"
                            style={{
                              background: "rgba(165, 28, 48, 0.08)",
                              color: "#A51C30",
                              fontSize: "0.7rem",
                              fontWeight: "500",
                              padding: "0.3rem 0.7rem",
                              borderRadius: "50px",
                            }}
                          >
                            <i
                              className="bi bi-building me-1"
                              style={{ fontSize: "0.6rem" }}
                            ></i>
                            {result.department}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {result.year && (
                          <span
                            className="badge"
                            style={{
                              background: "rgba(165, 28, 48, 0.06)",
                              color: "#A51C30",
                              fontSize: "0.7rem",
                              fontWeight: "500",
                              padding: "0.3rem 0.7rem",
                              borderRadius: "50px",
                            }}
                          >
                            <i
                              className="bi bi-calendar me-1"
                              style={{ fontSize: "0.6rem" }}
                            ></i>
                            {result.year}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {result.semester && (
                          <span
                            className="badge"
                            style={{
                              background: "rgba(165, 28, 48, 0.04)",
                              color: "#A51C30",
                              fontSize: "0.7rem",
                              fontWeight: "500",
                              padding: "0.3rem 0.7rem",
                              borderRadius: "50px",
                            }}
                          >
                            <i
                              className="bi bi-book me-1"
                              style={{ fontSize: "0.6rem" }}
                            ></i>
                            {result.semester}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleViewPDF(result)}
                            className="btn btn-sm"
                            style={{
                              background:
                                "linear-gradient(145deg, #A51C30, #7A1523)",
                              color: "#fff",
                              borderRadius: "50px",
                              padding: "0.25rem 1rem",
                              fontSize: "0.7rem",
                              border: "none",
                              transition: "all 0.3s ease",
                              boxShadow: "0 2px 8px rgba(165, 28, 48, 0.2)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-1px)";
                              e.target.style.boxShadow =
                                "0 4px 15px rgba(165, 28, 48, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow =
                                "0 2px 8px rgba(165, 28, 48, 0.2)";
                            }}
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                          <a
                            href={result.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm"
                            style={{
                              background: "transparent",
                              color: "#A51C30",
                              borderRadius: "50px",
                              padding: "0.25rem 0.8rem",
                              fontSize: "0.7rem",
                              border: "2px solid #A51C30",
                              textDecoration: "none",
                              transition: "all 0.3s ease",
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
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedResult && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 1rem",
              marginBottom: "1rem",
              flexShrink: 0,
            }}
          >
            <div>
              <h5 style={{ color: "#fff", margin: 0 }}>
                <i
                  className="bi bi-file-earmark-pdf me-2"
                  style={{ color: "#dc3545" }}
                ></i>
                {selectedResult.title}
              </h5>
              <div className="d-flex gap-3 mt-1">
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                  }}
                >
                  <i className="bi bi-building me-1"></i>
                  {selectedResult.department || "General"}
                </span>
                {selectedResult.year && (
                  <span
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <i className="bi bi-calendar me-1"></i>
                    {selectedResult.year}
                  </span>
                )}
                {selectedResult.semester && (
                  <span
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <i className="bi bi-book me-1"></i>
                    {selectedResult.semester}
                  </span>
                )}
              </div>
            </div>
            <div className="d-flex gap-2">
              <a
                href={selectedResult.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "50px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <i className="bi bi-download me-1"></i>
                Download
              </a>
              <button
                onClick={closePdfViewer}
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "50px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div
            style={{
              flex: 1,
              background: "#1a1a1a",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <iframe
              ref={pdfViewerRef}
              src={`${selectedResult.pdfUrl}#toolbar=0&navpanes=0`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#fff",
              }}
              title="PDF Viewer"
            />
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "0.75rem 1rem",
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.8rem",
              flexShrink: 0,
            }}
          >
            <i className="bi bi-arrow-up-left me-1"></i>
            Click outside or press ESC to close
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResult;
