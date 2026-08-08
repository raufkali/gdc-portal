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

  const accent = "#A51C30";
  const accentDark = "#7A1523";

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="row align-items-end"
          style={{
            marginBottom: "clamp(40px, 7vw, 70px)",
          }}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-once="false"
        >
          {/* Heading */}
          <div className="col-lg-7 text-center text-lg-start">
            <div
              className="d-flex align-items-center gap-3 mb-3 justify-content-center justify-content-lg-start"
              style={{ color: accent }}
            >
              <span
                style={{
                  display: "block",
                  width: "42px",
                  height: "2px",
                  backgroundColor: accent,
                }}
              />

              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                }}
              >
                Our Identity
              </span>

              {/* Mobile right line */}
              <span
                className="d-block d-lg-none"
                style={{
                  width: "42px",
                  height: "2px",
                  backgroundColor: accent,
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
                fontWeight: "700",
                lineHeight: "1.05",
                letterSpacing: "-1.5px",
                color: "var(--color-text)",
                margin: 0,
              }}
            >
              Shaping minds.
              <br />
              <span style={{ color: accent }}>Building futures.</span>
            </h2>
          </div>

          {/* Description */}
          <div className="col-lg-5 mt-4 mt-lg-0">
            <p
              className="mb-0 mx-auto"
              style={{
                maxWidth: "520px",
                marginLeft: "auto",
                color: "var(--color-text-muted)",
                fontSize: "1rem",
                lineHeight: "1.8",
                textAlign: "center",
              }}
            >
              Our vision, mission, and objectives provide the foundation for an
              educational environment focused on knowledge, character,
              innovation, and meaningful contribution to society.
            </p>
          </div>
        </div>

        {/* =====================================================
            VISION + MISSION
        ====================================================== */}

        <div className="row g-4 mb-5">
          {/* ================= VISION ================= */}

          <div
            className="col-lg-7"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-once="false"
          >
            <div
              className="h-100"
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                backgroundColor: "var(--card-bg)",
                border: "1px solid rgba(165, 28, 48, 0.08)",
                boxShadow: "0 15px 45px rgba(0,0,0,0.055)",
                padding: "clamp(28px, 4vw, 50px)",
                transition:
                  "transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 60px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 15px 45px rgba(0,0,0,0.055)";
              }}
            >
              {/* Background number */}
              <div
                style={{
                  position: "absolute",
                  right: "-15px",
                  top: "-35px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(9rem, 18vw, 15rem)",
                  lineHeight: "1",
                  fontWeight: "700",
                  color: "rgba(165, 28, 48, 0.035)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                01
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth: "760px",
                }}
              >
                {/* Vision header */}
                <div
                  className="d-flex align-items-center gap-3 mb-4"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="150"
                  data-aos-once="false"
                >
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      minWidth: "58px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(165, 28, 48, 0.09)",
                      color: accent,
                    }}
                  >
                    <i className="bi bi-eye" style={{ fontSize: "25px" }} />
                  </div>

                  <div>
                    <span
                      style={{
                        display: "block",
                        color: accent,
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: "3px",
                      }}
                    >
                      01 / Foundation
                    </span>

                    <h3
                      className="mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.65rem, 3vw, 2.2rem)",
                        fontWeight: "700",
                        color: "var(--color-text)",
                      }}
                    >
                      Our Vision
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    width: "55px",
                    height: "3px",
                    backgroundColor: accent,
                    marginBottom: "24px",
                    borderRadius: "10px",
                  }}
                />

                <p
                  className="mb-0"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="250"
                  data-aos-once="false"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "clamp(1rem, 1.4vw, 1.18rem)",
                    lineHeight: "1.9",
                  }}
                >
                  {content.vision}
                </p>
              </div>
            </div>
          </div>

          {/* ================= MISSION ================= */}

          <div
            className="col-lg-5"
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="100"
            data-aos-once="false"
          >
            <div
              className="h-100"
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                background: "linear-gradient(145deg, #A51C30 0%, #7A1523 100%)",
                padding: "clamp(28px, 4vw, 45px)",
                boxShadow: "0 18px 45px rgba(165, 28, 48, 0.18)",
                transition:
                  "transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 28px 60px rgba(165, 28, 48, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(165, 28, 48, 0.18)";
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  width: "260px",
                  height: "260px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  right: "-120px",
                  top: "-120px",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: "170px",
                  height: "170px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.06)",
                  right: "-45px",
                  top: "-45px",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Mission header
                    Same horizontal structure as Vision */}
                <div
                  className="d-flex align-items-center gap-3 mb-4"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="200"
                  data-aos-once="false"
                >
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      minWidth: "58px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255,255,255,0.14)",
                      color: "#fff",
                    }}
                  >
                    <i
                      className="bi bi-bullseye"
                      style={{ fontSize: "25px" }}
                    />
                  </div>

                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: "3px",
                      }}
                    >
                      02 / Direction
                    </span>

                    <h3
                      className="mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.65rem, 3vw, 2.2rem)",
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      Our Mission
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    width: "45px",
                    height: "3px",
                    backgroundColor: "#fff",
                    opacity: 0.8,
                    marginBottom: "24px",
                    borderRadius: "10px",
                  }}
                />

                <p
                  className="mb-0"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="300"
                  data-aos-once="false"
                  style={{
                    color: "rgba(255,255,255,0.93)",
                    fontSize: "1rem",
                    lineHeight: "1.85",
                  }}
                >
                  {content.mission}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            AIMS HEADER
        ====================================================== */}

        <div
          className="text-center mb-4"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-once="false"
        >
          {/* Decorative line */}
          <div
            className="d-flex align-items-center justify-content-center gap-3"
            style={{
              color: accent,
            }}
          >
            <span
              style={{
                width: "42px",
                height: "2px",
                backgroundColor: accent,
              }}
            />

            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: "700",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
              }}
            >
              Our Direction
            </span>

            <span
              style={{
                width: "42px",
                height: "2px",
                backgroundColor: accent,
              }}
            />
          </div>

          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              lineHeight: "1.15",
              marginTop: "12px",
              marginBottom: "8px",
            }}
          >
            Aims & Objectives
          </h3>

          <p
            className="mb-0"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.92rem",
              lineHeight: "1.7",
            }}
          >
            Turning our principles into meaningful action.
          </p>
        </div>

        {/* =====================================================
            AIMS
        ====================================================== */}

        <div
          className="row g-3 mb-5"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-once="false"
        >
          {content.aims.map((aim, index) => (
            <div
              key={index}
              className="col-md-6 col-xl"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-delay={index * 100}
              data-aos-once="false"
            >
              <div
                className="h-100"
                style={{
                  position: "relative",
                  padding: "28px 24px",
                  borderRadius: "18px",
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid rgba(165, 28, 48, 0.08)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.035)",
                  transition:
                    "transform .35s ease, box-shadow .35s ease, border-color .35s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-7px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 38px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "rgba(165, 28, 48, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.035)";
                  e.currentTarget.style.borderColor = "rgba(165, 28, 48, 0.08)";
                }}
              >
                {/* Centered number */}
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: accent,
                    fontSize: "2.1rem",
                    fontWeight: "700",
                    lineHeight: "1",
                    marginBottom: "18px",
                    opacity: 0.8,
                    textAlign: "center",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Centered divider */}
                <div
                  style={{
                    width: "32px",
                    height: "2px",
                    backgroundColor: accent,
                    margin: "0 auto 18px auto",
                  }}
                />

                <p
                  className="mb-0"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "0.93rem",
                    lineHeight: "1.7",
                    textAlign: "center",
                  }}
                >
                  {aim}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            WHAT WE OFFER
        ====================================================== */}

        <div data-aos="fade-up" data-aos-duration="900" data-aos-once="false">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "24px",
              background: "linear-gradient(145deg, #A51C30 0%, #7A1523 100%)",
              padding: "clamp(28px, 5vw, 55px)",
              boxShadow: "0 20px 50px rgba(165, 28, 48, 0.17)",
            }}
          >
            {/* Large background text */}
            <div
              style={{
                position: "absolute",
                right: "-25px",
                bottom: "-45px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(7rem, 15vw, 13rem)",
                fontWeight: "700",
                lineHeight: "1",
                color: "rgba(255,255,255,0.045)",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              GDC
            </div>

            <div
              className="row align-items-center position-relative"
              style={{ zIndex: 1 }}
            >
              {/* =================================================
          TITLE
      ================================================== */}

              <div className="col-lg-4 mb-4 mb-lg-0">
                <div
                  className="d-flex align-items-center gap-3 mb-4"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="150"
                  data-aos-once="false"
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      minWidth: "58px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255,255,255,0.14)",
                      color: "#fff",
                    }}
                  >
                    <i className="bi bi-gift" style={{ fontSize: "25px" }} />
                  </div>

                  {/* Label + Title */}
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: "3px",
                      }}
                    >
                      04 / Experience
                    </span>

                    <h3
                      className="mb-0"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.65rem, 3vw, 2.2rem)",
                        fontWeight: "700",
                        color: "#fff",
                        lineHeight: "1.15",
                      }}
                    >
                      What We Offer
                    </h3>
                  </div>
                </div>

                {/* Accent divider */}
                <div
                  style={{
                    width: "45px",
                    height: "3px",
                    backgroundColor: "#fff",
                    opacity: 0.8,
                    marginBottom: "0",
                    borderRadius: "10px",
                  }}
                />
              </div>

              {/* =================================================
          DESCRIPTION
      ================================================== */}

              <div className="col-lg-8">
                <p
                  className="mb-0"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay="300"
                  data-aos-once="false"
                  style={{
                    color: "rgba(255,255,255,0.94)",
                    fontSize: "clamp(1rem, 1.4vw, 1.13rem)",
                    lineHeight: "1.9",
                    maxWidth: "760px",
                  }}
                >
                  {content.whatWeOffer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionAims;
