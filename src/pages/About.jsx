import { Link } from "react-router-dom";

const About = () => {
  // Static content
  const content = {
    vision:
      "To become a center of excellence in higher education, producing competent professionals who can contribute to the socio-economic development of the region and the nation. We aspire to be a leading institution that nurtures critical thinking, innovation, and ethical leadership.",

    mission:
      "To provide quality education through innovative teaching methodologies, promote research and critical thinking, and foster ethical values and social responsibility among students. We are committed to creating an inclusive learning environment that empowers students to reach their full potential.",

    aims: [
      "To offer diverse academic programs that meet the needs of the community and the job market.",
      "To develop students' intellectual, moral, and social capacities through holistic education.",
      "To promote a culture of research, innovation, and lifelong learning.",
      "To strengthen community engagement and contribute to sustainable development.",
      "To provide equal opportunities for all students regardless of background.",
      "To foster critical thinking, creativity, and problem-solving skills.",
      "To prepare students for successful careers and meaningful lives.",
      "To promote environmental awareness and social responsibility.",
    ],

    whatWeOffer:
      "GDC Gulabad offers a wide range of undergraduate and graduate programs in Arts, Sciences, and Commerce. Our curriculum is designed to provide both theoretical knowledge and practical skills, preparing students for successful careers and meaningful lives. We offer state-of-the-art facilities, experienced faculty, and a supportive learning environment that encourages academic excellence and personal growth.",

    collegeName: "Government Degree College Gulabad",
    established: "2005",
    location: "Gulabad, District Chitral, KPK, Pakistan",
    students: "5000+",
    programs: "12+",
    faculty: "150+",
  };

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
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
            About Our College
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
            Know More About{" "}
            <span style={{ color: "#A51C30" }}>GDC Gulabad</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Discover our vision, mission, and the values that drive us toward
            excellence in education
          </p>
        </div>

        {/* College Quick Stats */}
        <div className="row g-3 mb-5" data-aos="fade-up" data-aos-delay="50">
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body py-3">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#A51C30",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {content.established}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Established
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body py-3">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#A51C30",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {content.students}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Students
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body py-3">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#A51C30",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {content.programs}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Programs
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body py-3">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#A51C30",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {content.faculty}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Faculty Members
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision - Full Width */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="100">
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              borderLeft: "6px solid #A51C30",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(165, 28, 48, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-eye fs-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)",
                      fontWeight: "700",
                      color: "#A51C30",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Our Vision
                  </h3>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.8",
                      color: "var(--color-text)",
                      marginBottom: 0,
                    }}
                  >
                    {content.vision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission - Full Width */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="150">
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              borderLeft: "6px solid #A51C30",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(165, 28, 48, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-bullseye fs-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)",
                      fontWeight: "700",
                      color: "#A51C30",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Our Mission
                  </h3>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.8",
                      color: "var(--color-text)",
                      marginBottom: 0,
                    }}
                  >
                    {content.mission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aims & Objectives - Full Width with List */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="200">
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              borderLeft: "6px solid #A51C30",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(165, 28, 48, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-list-check fs-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)",
                      fontWeight: "700",
                      color: "#A51C30",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Aims & Objectives
                  </h3>
                  <div className="row g-2">
                    {content.aims.map((aim, index) => (
                      <div key={index} className="col-lg-6">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                            padding: "0.5rem 0",
                          }}
                        >
                          <span
                            style={{ color: "#A51C30", fontSize: "1.2rem" }}
                          >
                            <i className="bi bi-check-circle-fill"></i>
                          </span>
                          <span
                            style={{
                              fontSize: "0.95rem",
                              lineHeight: "1.6",
                              color: "var(--color-text)",
                            }}
                          >
                            {aim}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer - Full Width with Gradient */}
        <div className="mb-4" data-aos="fade-up" data-aos-delay="250">
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(145deg, #A51C30, #7A1523)",
              color: "#fff",
            }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-gift fs-2" style={{ color: "#fff" }}></i>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)",
                      fontWeight: "700",
                      color: "#fff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    What We Offer
                  </h3>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.8",
                      color: "rgba(255,255,255,0.95)",
                      marginBottom: 0,
                    }}
                  >
                    {content.whatWeOffer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div
          className="text-center mt-5 pt-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              background: "var(--color-bg)",
              padding: "2.5rem 1rem",
            }}
          >
            <h4
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 2vw, 2rem)",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              Ready to Join{" "}
              <span style={{ color: "#A51C30" }}>GDC Gulabad</span>?
            </h4>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "1.05rem",
                maxWidth: "500px",
                margin: "0 auto 1.5rem",
              }}
            >
              Start your journey toward academic excellence today.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link
                to="/programs"
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
                <i className="bi bi-book me-2"></i>
                Explore Programs
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline-secondary"
                style={{
                  padding: "0.7rem 2.5rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
