import { Link } from "react-router-dom";

const EligibilityCriteria = () => {
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
            Admissions
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
            Eligibility <span style={{ color: "#A51C30" }}>Criteria</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            HEC-aligned eligibility requirements for admission at GDC Gulabad
          </p>
        </div>

        {/* FSc Programs */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="100">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              borderLeft: "4px solid #A51C30",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(165, 28, 48, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-mortarboard fs-3"
                    style={{ color: "#A51C30" }}
                  ></i>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.5rem, 2vw, 2rem)",
                    fontWeight: "700",
                    color: "#A51C30",
                    marginBottom: 0,
                  }}
                >
                  FSc Programs (Intermediate)
                </h3>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "rgba(165, 28, 48, 0.04)" }}
                  >
                    <h6
                      className="fw-bold mb-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      <i
                        className="bi bi-check-circle-fill me-2"
                        style={{ color: "#A51C30" }}
                      ></i>
                      Eligibility Requirements
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          Matriculation (SSC) with at least <strong>45%</strong>{" "}
                          marks
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          Minimum age: <strong>16 years</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          Local/Domicile certificate of <strong>KPK</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          As per <strong>HEC</strong> intermediate admission
                          policy
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "rgba(40, 167, 69, 0.04)" }}
                  >
                    <h6
                      className="fw-bold mb-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      <i
                        className="bi bi-book me-2"
                        style={{ color: "#28a745" }}
                      ></i>
                      Available Programs
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>FSc Pre-Medical</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>FSc Pre-Engineering</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>FSc Computer Science</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>FSc General Science</strong>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BS Programs */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="200">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              borderLeft: "4px solid #28a745",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(40, 167, 69, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-award fs-3"
                    style={{ color: "#28a745" }}
                  ></i>
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.5rem, 2vw, 2rem)",
                    fontWeight: "700",
                    color: "#28a745",
                    marginBottom: 0,
                  }}
                >
                  BS Programs (Bachelor)
                </h3>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "rgba(40, 167, 69, 0.04)" }}
                  >
                    <h6
                      className="fw-bold mb-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      <i
                        className="bi bi-check-circle-fill me-2"
                        style={{ color: "#28a745" }}
                      ></i>
                      Eligibility Requirements
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          FSc / FA / ICS with at least <strong>45%</strong>{" "}
                          marks
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          Intermediate certificate from recognized board
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          As per <strong>HEC</strong> undergraduate admission
                          policy
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-success mt-1">
                          <i className="bi bi-check-lg"></i>
                        </span>
                        <span>
                          Local/Domicile certificate of <strong>KPK</strong>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "rgba(23, 162, 184, 0.04)" }}
                  >
                    <h6
                      className="fw-bold mb-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      <i
                        className="bi bi-book me-2"
                        style={{ color: "#17a2b8" }}
                      ></i>
                      Available Programs
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>BS Computer Science</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>BS English</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>BS Physics</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>BS Mathematics</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>BS Chemistry</strong>
                        </span>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <span className="text-primary mt-1">
                          <i className="bi bi-dot"></i>
                        </span>
                        <span>
                          <strong>BS Zoology</strong>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Guidelines */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="300">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(135deg, #A51C30, #7A1523)",
              color: "#fff",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-info-circle fs-3"
                    style={{ color: "#fff" }}
                  ></i>
                </div>
                <div>
                  <h5
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)",
                      fontWeight: "700",
                      color: "#fff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    General Guidelines
                  </h5>
                  <ul
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                      lineHeight: "1.8",
                      paddingLeft: "1.2rem",
                    }}
                  >
                    <li>
                      All admissions are conducted as per{" "}
                      <strong>HEC Pakistan</strong> policies and guidelines.
                    </li>
                    <li>
                      Final eligibility is determined by the college admission
                      committee.
                    </li>
                    <li>
                      Contact the admission office for any queries or special
                      cases.
                    </li>
                    <li>
                      Admission forms are available online and at the college
                      campus.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="text-center mt-4"
          data-aos="fade-up"
          data-aos-delay="350"
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
              Ready to <span style={{ color: "#A51C30" }}>Apply</span>?
            </h5>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.95rem",
                maxWidth: "500px",
                margin: "0 auto 1.2rem",
              }}
            >
              Start your journey toward academic excellence at GDC Gulabad.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
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
                Contact Admission Office
              </Link>
              <Link
                to="/fee-structure"
                className="btn btn-outline-secondary"
                style={{
                  padding: "0.6rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
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
                <i className="bi bi-cash-stack me-2"></i>
                View Fee Structure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCriteria;
