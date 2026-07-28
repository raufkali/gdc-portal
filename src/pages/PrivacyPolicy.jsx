import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
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
            Legal
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
            Privacy <span style={{ color: "#A51C30" }}>Policy</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Your privacy matters to us. Learn how we collect, use, and protect
            your information.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                backgroundColor: "var(--card-bg)",
                overflow: "hidden",
              }}
            >
              {/* Last Updated Badge */}
              <div
                className="p-4"
                style={{
                  background: "rgba(165, 28, 48, 0.04)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-clock-history"
                    style={{ color: "#A51C30" }}
                  ></i>
                  <span className="small text-muted">
                    Last Updated: <strong>{currentYear}</strong>
                  </span>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                <p className="lead" style={{ color: "var(--color-text)" }}>
                  Government Degree College Gulabad is committed to protecting
                  the privacy and security of your personal information.
                </p>

                {/* Section 1 */}
                <div className="mb-4" data-aos="fade-up" data-aos-delay="100">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(165, 28, 48, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#A51C30",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      >
                        1
                      </span>
                    </div>
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#A51C30",
                      }}
                    >
                      Information We Collect
                    </h5>
                  </div>
                  <p
                    style={{ color: "var(--color-text)", paddingLeft: "4rem" }}
                  >
                    GDC Gulabad collects information to provide better services
                    to our students, faculty, and visitors. We may collect:
                  </p>
                  <ul
                    style={{ paddingLeft: "4rem", color: "var(--color-text)" }}
                  >
                    <li>
                      Full name and contact information (email, phone, address)
                    </li>
                    <li>Academic records and enrollment history</li>
                    <li>Course registration and attendance data</li>
                    <li>Payment and fee records</li>
                    <li>Student ID and examination details</li>
                    <li>Information provided through forms and applications</li>
                  </ul>
                </div>

                {/* Section 2 */}
                <div className="mb-4" data-aos="fade-up" data-aos-delay="150">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(40, 167, 69, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#28a745",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      >
                        2
                      </span>
                    </div>
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#28a745",
                      }}
                    >
                      How We Use Your Information
                    </h5>
                  </div>
                  <p
                    style={{ color: "var(--color-text)", paddingLeft: "4rem" }}
                  >
                    We use the collected information for the following purposes:
                  </p>
                  <ul
                    style={{ paddingLeft: "4rem", color: "var(--color-text)" }}
                  >
                    <li>To provide academic and administrative services</li>
                    <li>To communicate important announcements and updates</li>
                    <li>To improve our educational programs and services</li>
                    <li>To comply with legal and regulatory requirements</li>
                    <li>
                      To process admissions, registrations, and fee payments
                    </li>
                    <li>To maintain academic records and transcripts</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div className="mb-4" data-aos="fade-up" data-aos-delay="200">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(255, 193, 7, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#ffc107",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      >
                        3
                      </span>
                    </div>
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#ffc107",
                      }}
                    >
                      Information Sharing
                    </h5>
                  </div>
                  <p
                    style={{ color: "var(--color-text)", paddingLeft: "4rem" }}
                  >
                    We respect your privacy and do not share your personal
                    information with third parties except:
                  </p>
                  <ul
                    style={{ paddingLeft: "4rem", color: "var(--color-text)" }}
                  >
                    <li>As required by law or government regulations</li>
                    <li>With your explicit consent</li>
                    <li>
                      To affiliated educational institutions for academic
                      purposes
                    </li>
                    <li>
                      To service providers who assist in college operations
                    </li>
                  </ul>
                  <p
                    style={{ color: "var(--color-text)", paddingLeft: "4rem" }}
                  >
                    We never sell or rent your personal information to third
                    parties for marketing purposes.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="mb-4" data-aos="fade-up" data-aos-delay="250">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(23, 162, 184, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#17a2b8",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      >
                        4
                      </span>
                    </div>
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#17a2b8",
                      }}
                    >
                      Data Security
                    </h5>
                  </div>
                  <p
                    style={{ color: "var(--color-text)", paddingLeft: "4rem" }}
                  >
                    We implement appropriate security measures to protect your
                    information from unauthorized access, alteration,
                    disclosure, or destruction. These measures include:
                  </p>
                  <ul
                    style={{ paddingLeft: "4rem", color: "var(--color-text)" }}
                  >
                    <li>Secure data storage and encryption</li>
                    <li>Access controls and authentication protocols</li>
                    <li>Regular security audits and updates</li>
                    <li>Staff training on data protection</li>
                    <li>Firewall and anti-virus protection</li>
                  </ul>
                </div>

                {/* Section 5 */}
                <div className="mb-4" data-aos="fade-up" data-aos-delay="300">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(220, 53, 69, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#dc3545",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      >
                        5
                      </span>
                    </div>
                    <h5
                      className="fw-bold mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#dc3545",
                      }}
                    >
                      Your Rights
                    </h5>
                  </div>
                  <ul
                    style={{ paddingLeft: "4rem", color: "var(--color-text)" }}
                  >
                    <li>
                      You have the right to access your personal information
                    </li>
                    <li>
                      You have the right to request corrections to your data
                    </li>
                    <li>You have the right to request deletion of your data</li>
                    <li>You have the right to withdraw consent at any time</li>
                    <li>
                      You have the right to file a complaint with the relevant
                      authority
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-5 pt-3" data-aos="fade-up" data-aos-delay="400">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              background: "var(--color-bg)",
              padding: "1.5rem",
            }}
          >
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                to="/"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
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
                <i className="bi bi-house me-2"></i>
                Home
              </Link>
              <Link
                to="/about"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
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
                <i className="bi bi-info-circle me-2"></i>
                About Us
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
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
                <i className="bi bi-envelope me-2"></i>
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
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
                <i className="bi bi-question-circle me-2"></i>
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
