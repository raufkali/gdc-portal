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
        <div className="section-title" data-aos="fade-up">
          <h2>Our Vision, Mission & Aims</h2>
          <p className="subtitle text-muted">
            Guiding principles that shape our institution
          </p>
        </div>

        {/* Vision */}
        <div className="row mb-4" data-aos="fade-up">
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-start">
                  <div className="me-3 flex-shrink-0">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(165, 28, 48, 0.1)",
                        color: "#A51C30",
                      }}
                    >
                      <i className="bi bi-eye" style={{ fontSize: "28px" }}></i>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#A51C30",
                      }}
                    >
                      Our Vision
                    </h3>
                    <p
                      className="lead mb-0"
                      style={{
                        fontSize: "1.15rem",
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
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-start">
                  <div className="me-3 flex-shrink-0">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(40, 167, 69, 0.1)",
                        color: "#28a745",
                      }}
                    >
                      <i
                        className="bi bi-bullseye"
                        style={{ fontSize: "28px" }}
                      ></i>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#28a745",
                      }}
                    >
                      Our Mission
                    </h3>
                    <p
                      className="lead mb-0"
                      style={{
                        fontSize: "1.15rem",
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

        {/* Aims */}
        <div className="row mb-4" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-start">
                  <div className="me-3 flex-shrink-0">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 193, 7, 0.1)",
                        color: "#ffc107",
                      }}
                    >
                      <i
                        className="bi bi-list-check"
                        style={{ fontSize: "28px" }}
                      ></i>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#ffc107",
                      }}
                    >
                      Our Aims & Objectives
                    </h3>
                    <ul className="list-unstyled mb-0">
                      {content.aims.map((aim, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-start mb-2"
                        >
                          <span className="me-2" style={{ color: "#A51C30" }}>
                            <i className="bi bi-check-circle-fill"></i>
                          </span>
                          <span
                            style={{
                              color: "var(--color-text)",
                              fontSize: "1.05rem",
                            }}
                          >
                            {aim}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                background: "linear-gradient(135deg, #A51C30 0%, #7A1523 100%)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start">
                  <div className="me-3 flex-shrink-0">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                      }}
                    >
                      <i
                        className="bi bi-gift"
                        style={{ fontSize: "28px" }}
                      ></i>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "#ffffff",
                      }}
                    >
                      What We Offer
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "1.1rem",
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
