const VisionMissionAims = () => {
  // Static content – not controlled by admin
  const content = {
    vision:
      "To become a center of excellence in higher education, producing competent professionals who can contribute to the socio-economic development of the region and the nation.",
    mission:
      "To provide quality education through innovative teaching methodologies, promote research and critical thinking, and foster ethical values and social responsibility among students.",
    aims: [
      "To offer diverse academic programs that meet the needs of the community and the job market.",
      "To develop students' intellectual, moral, and social capacities through holistic education.",
      "To promote a culture of research, innovation, and lifelong learning.",
      "To strengthen community engagement and contribute to sustainable development.",
      "To provide equal opportunities for all students regardless of background.",
    ],
    whatWeOffer:
      "GDC Gulabad offers a wide range of undergraduate and graduate programs in Arts, Sciences, and Commerce. Our curriculum is designed to provide both theoretical knowledge and practical skills, preparing students for successful careers and meaningful lives.",
  };

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <div className="container">
        {/* Section Title */}
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
            Our Identity
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            Vision, Mission <span style={{ color: "#A51C30" }}>& Aims</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Guiding principles that shape our institution
          </p>
        </div>

        {/* Vision & Mission - 2 columns */}
        <div className="row g-4 mb-4">
          {/* Vision */}
          <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-once="false"
              data-aos-delay="100"
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                borderLeft: "4px solid #A51C30",
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
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(165, 28, 48, 0.1)",
                      color: "#A51C30",
                    }}
                  >
                    <i className="bi bi-eye" style={{ fontSize: "24px" }}></i>
                  </div>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.3rem, 1.8vw, 1.6rem)",
                        color: "#A51C30",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Our Vision
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                        lineHeight: "1.8",
                        color: "var(--color-text)",
                      }}
                    >
                      {content.vision}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div
            className="col-md-6"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-once="false"
            data-aos-delay="100"
          >
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                borderLeft: "4px solid #A51C30",
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
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(165, 28, 48, 0.1)",
                      color: "#A51C30",
                    }}
                  >
                    <i
                      className="bi bi-bullseye"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </div>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.3rem, 1.8vw, 1.6rem)",
                        color: "#A51C30",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Our Mission
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                        lineHeight: "1.8",
                        color: "var(--color-text)",
                      }}
                    >
                      {content.mission}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aims - Full Width */}
        <div
          className="row g-4 mb-4"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-once="false"
          data-aos-delay="200"
        >
          <div className="col-12">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                borderLeft: "4px solid #A51C30",
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
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(165, 28, 48, 0.1)",
                      color: "#A51C30",
                    }}
                  >
                    <i
                      className="bi bi-list-check"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.3rem, 1.8vw, 1.6rem)",
                        color: "#A51C30",
                      }}
                    >
                      Our Aims & Objectives
                    </h3>
                    <div className="row g-2">
                      {content.aims.map((aim, index) => (
                        <div key={index} className="col-lg-6 col-xl-4">
                          <div
                            className="d-flex align-items-start gap-2 p-2 rounded"
                            style={{ transition: "background 0.2s ease" }}
                          >
                            <span
                              className="flex-shrink-0 mt-1"
                              style={{ color: "#A51C30" }}
                            >
                              <i className="bi bi-check-circle-fill"></i>
                            </span>
                            <span
                              style={{
                                color: "var(--color-text)",
                                fontSize: "clamp(0.9rem, 1vw, 0.95rem)",
                                lineHeight: "1.5",
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
        </div>

        {/* What We Offer - Full Width with Gradient */}
        <div
          className="row"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-once="false"
          data-aos-delay="100"
        >
          <div className="col-12">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "linear-gradient(135deg, #A51C30 0%, #7A1523 100%)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(165, 28, 48, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                    }}
                  >
                    <i className="bi bi-gift" style={{ fontSize: "24px" }}></i>
                  </div>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.3rem, 1.8vw, 1.6rem)",
                        color: "#ffffff",
                      }}
                    >
                      What We Offer
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                        lineHeight: "1.8",
                        color: "rgba(255,255,255,0.95)",
                      }}
                    >
                      {content.whatWeOffer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionAims;
