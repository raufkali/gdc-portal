import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

// Cache for department detail (by slug/id)
const cachedDepartments = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const DepartmentDetail = () => {
  const { slug } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [departmentResults, setDepartmentResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      // Check cache for this specific department
      const cacheKey = slug;
      if (
        cachedDepartments[cacheKey] &&
        cachedDepartments[cacheKey].timestamp &&
        Date.now() - cachedDepartments[cacheKey].timestamp < CACHE_TTL
      ) {
        setDept(cachedDepartments[cacheKey].data);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("departments");
        const found = data.find((d) => d.slug === slug || d.id === slug);

        if (found) {
          // Cache the found department
          cachedDepartments[cacheKey] = {
            data: found,
            timestamp: Date.now(),
          };
          setDept(found);
          setFromCache(false);
        } else {
          setDept(null);
        }
      } catch (error) {
        console.error("Error fetching department:", error);
        // Try to use stale cache if available
        if (cachedDepartments[cacheKey]) {
          setDept(cachedDepartments[cacheKey].data);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [slug]);

  // Fetch department-specific results
  useEffect(() => {
    const fetchDepartmentResults = async () => {
      if (!dept) return;

      setResultsLoading(true);
      try {
        // Fetch all exam results
        const allResults = await fetchCollection("examResults", [
          { type: "orderBy", field: "year", direction: "desc" },
        ]);

        // Filter results for this specific department
        const filtered = allResults.filter(
          (result) => result.department === dept.name,
        );

        // Sort by year (newest first) and limit to 5
        const sorted = filtered
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .slice(0, 5);

        setDepartmentResults(sorted);
      } catch (error) {
        console.error("Error fetching department results:", error);
        setDepartmentResults([]);
      } finally {
        setResultsLoading(false);
      }
    };

    if (dept) {
      fetchDepartmentResults();
    }
  }, [dept]);

  // Get images array (single imageUrl or multiple images)
  const getImages = () => {
    if (!dept) return [];
    if (dept.images && Array.isArray(dept.images) && dept.images.length > 0) {
      return dept.images;
    }
    if (dept.imageUrl) {
      return [dept.imageUrl];
    }
    return [];
  };

  const images = getImages();
  const hasMultipleImages = images.length > 1;

  // Next/Prev functions
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return <Loader />;

  if (!dept) {
    return (
      <div className="container py-5 mt-5" style={{ minHeight: "70vh" }}>
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-4">
            <i className="bi bi-building"></i>
          </div>
          <h2 className="mb-3">Department not found</h2>
          <p className="text-muted mb-4">
            The department you're looking for doesn't exist.
          </p>
          <Link to="/departments" className="btn btn-primary rounded-pill px-4">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)", minHeight: "100vh" }}
    >
      <div className="container">
        {/* Back Button */}
        <Link
          to="/departments"
          className="btn btn-outline-secondary rounded-pill mb-4"
          style={{
            padding: "0.4rem 1.5rem",
            fontSize: "0.9rem",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#A51C30";
            e.target.style.color = "#A51C30";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.color = "var(--color-text)";
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Departments
        </Link>

        {/* Main Card */}
        <div
          className="card border-0 shadow-lg overflow-hidden"
          style={{ borderRadius: "16px" }}
        >
          {/* Image Carousel */}
          {images.length > 0 && (
            <div
              className="position-relative"
              style={{ background: "#1A1A1A" }}
            >
              <div
                className="position-relative"
                style={{ height: "400px", overflow: "hidden" }}
              >
                <img
                  src={images[activeImageIndex]}
                  alt={dept.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.5s ease",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/1200x400?text=Image+Not+Found";
                    e.target.style.objectFit = "contain";
                  }}
                />
              </div>

              {/* Image Counter */}
              {hasMultipleImages && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    padding: "4px 14px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    zIndex: 5,
                  }}
                >
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "20px",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      zIndex: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(165, 28, 48, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(0,0,0,0.5)";
                    }}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextImage}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "20px",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      zIndex: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(165, 28, 48, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(0,0,0,0.5)";
                    }}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>

                  {/* Dots Indicator */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "8px",
                      zIndex: 5,
                    }}
                  >
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          border: "none",
                          background:
                            index === activeImageIndex
                              ? "#A51C30"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => {
                          if (index !== activeImageIndex) {
                            e.target.style.background = "rgba(255,255,255,0.7)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== activeImageIndex) {
                            e.target.style.background = "rgba(255,255,255,0.4)";
                          }
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="card-body p-4 p-lg-5">
            <div className="row g-4">
              <div className="col-lg-8">
                {/* Department Name */}
                <h1
                  className="fw-bold mb-3"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(2rem, 3vw, 2.8rem)",
                    color: "var(--color-text)",
                  }}
                >
                  {dept.name}
                </h1>

                {/* Category Badge */}
                {dept.category && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(165, 28, 48, 0.1)",
                      color: "#A51C30",
                      padding: "0.25rem 1rem",
                      borderRadius: "50px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    {dept.category}
                  </span>
                )}

                {/* Description */}
                <p
                  className="lead"
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "var(--color-text)",
                  }}
                >
                  {dept.description}
                </p>

                {/* Additional Info */}
                <div className="row g-3 mt-3">
                  {dept.headName && (
                    <div className="col-md-6">
                      <div
                        className="d-flex align-items-center gap-2 p-3 bg-light rounded-3"
                        style={{ backgroundColor: "var(--color-bg-alt)" }}
                      >
                        <i
                          className="bi bi-person-badge fs-4"
                          style={{ color: "#A51C30" }}
                        ></i>
                        <div>
                          <div className="small text-muted">
                            Head of Department
                          </div>
                          <div className="fw-semibold">{dept.headName}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dept.facultyCount && (
                    <div className="col-md-6">
                      <div
                        className="d-flex align-items-center gap-2 p-3 bg-light rounded-3"
                        style={{ backgroundColor: "var(--color-bg-alt)" }}
                      >
                        <i
                          className="bi bi-people fs-4"
                          style={{ color: "#A51C30" }}
                        ></i>
                        <div>
                          <div className="small text-muted">
                            Faculty Members
                          </div>
                          <div className="fw-semibold">{dept.facultyCount}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="col-lg-4">
                <div
                  className="card border-0 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "var(--color-bg-alt)",
                  }}
                >
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3">Department Details</h6>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted small">Status</span>
                      <span className="badge bg-success rounded-pill">
                        Active
                      </span>
                    </div>
                    {dept.programs && (
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted small">Programs</span>
                        <span className="fw-semibold small">
                          {dept.programs}
                        </span>
                      </div>
                    )}
                    {dept.established && (
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="text-muted small">Established</span>
                        <span className="fw-semibold small">
                          {dept.established}
                        </span>
                      </div>
                    )}

                    <Link
                      to="/contact"
                      className="btn w-100"
                      style={{
                        background: "linear-gradient(145deg, #A51C30, #7A1523)",
                        color: "#fff",
                        borderRadius: "50px",
                        padding: "0.6rem",
                        fontWeight: "600",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 8px 25px rgba(165, 28, 48, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Contact Department
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Results Section */}
            <div className="mt-5 pt-4 border-top">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4
                  className="fw-bold mb-0"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                  }}
                >
                  <i
                    className="bi bi-file-earmark-pdf me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Recent Results
                </h4>
                <Link
                  to="/exam-result"
                  className="btn btn-sm"
                  style={{
                    color: "#A51C30",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>

              {resultsLoading ? (
                <div className="text-center py-4">
                  <div
                    className="spinner-border spinner-border-sm"
                    style={{ color: "#A51C30" }}
                  ></div>
                  <span className="ms-2 text-muted">Loading results...</span>
                </div>
              ) : departmentResults.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-inbox fs-3 d-block mb-2"></i>
                    <p className="mb-0">
                      No exam results available for {dept.name} yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {departmentResults.map((result) => (
                    <div key={result.id} className="col-md-6 col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: "12px",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          backgroundColor: "var(--card-bg)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 30px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(0,0,0,0.05)";
                        }}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex align-items-start gap-2">
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                background: "rgba(220, 53, 69, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <i
                                className="bi bi-file-earmark-pdf"
                                style={{ color: "#dc3545", fontSize: "1.2rem" }}
                              ></i>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h6
                                className="fw-bold mb-1"
                                style={{
                                  fontSize: "0.85rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                title={result.title}
                              >
                                {result.title}
                              </h6>
                              <div className="d-flex flex-wrap gap-1">
                                {result.year && (
                                  <span
                                    className="badge"
                                    style={{
                                      background: "rgba(220, 53, 69, 0.1)",
                                      color: "#A51C30",
                                      fontSize: "0.6rem",
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
                                      background: "rgba(220, 53, 69, 0.1)",
                                      color: "#A51C30",
                                      fontSize: "0.6rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <i className="bi bi-book me-1"></i>
                                    {result.semester}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent border-0 pt-0 pb-2 px-3">
                          <a
                            href={result.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn w-100"
                            style={{
                              background:
                                "linear-gradient(145deg, #A51C30, #7A1523)",
                              color: "#fff",
                              borderRadius: "50px",
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
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
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Departments (Optional) */}
        <div className="mt-5">
          <h4
            className="fw-bold mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore Other Departments
          </h4>
          <Link
            to="/departments"
            className="btn btn-outline-primary rounded-pill"
            style={{
              borderColor: "#A51C30",
              color: "#A51C30",
              padding: "0.5rem 1.5rem",
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
            <i className="bi bi-grid me-2"></i>
            View All Departments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
