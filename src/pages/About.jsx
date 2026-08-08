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

  const accent = "#A51C30";
  const accentDark = "#7A1523";

  const stats = [
    {
      value: content.established,
      label: "Established",
      icon: "bi-calendar3",
    },
    {
      value: content.students,
      label: "Students",
      icon: "bi-people",
    },
    {
      value: content.programs,
      label: "Programs",
      icon: "bi-mortarboard",
    },
    {
      value: content.faculty,
      label: "Faculty Members",
      icon: "bi-person-workspace",
    },
  ];

  return (
    <section
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* =====================================================
            PAGE INTRO
        ====================================================== */}

        <div
          className="row align-items-end g-4 mb-5"
          data-aos="fade-up"
          data-aos-duration="900"
          data-aos-once="false"
        >
          <div className="col-lg-7">
            <div
              className="d-flex align-items-center gap-3 mb-3"
              style={{ color: accent }}
            >
              <span
                style={{
                  width: "42px",
                  height: "2px",
                  display: "block",
                  backgroundColor: accent,
                  borderRadius: "10px",
                }}
              />

              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                }}
              >
                About Our College
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.3rem, 5vw, 4rem)",
                fontWeight: "700",
                lineHeight: "1.03",
                letterSpacing: "-1.8px",
                color: "var(--color-text)",
                margin: 0,
              }}
            >
              More than education.
              <br />
              <span style={{ color: accent }}>A foundation for life.</span>
            </h1>
          </div>

          <div className="col-lg-5">
            <p
              className="mb-0"
              style={{
                maxWidth: "520px",
                marginLeft: "auto",
                color: "var(--color-text-muted)",
                fontSize: "clamp(0.98rem, 1.3vw, 1.08rem)",
                lineHeight: "1.85",
              }}
            >
              Discover the vision, mission, values, and educational philosophy
              that define {content.collegeName}.
            </p>
          </div>
        </div>

        {/* =====================================================
            COLLEGE IDENTITY / LOCATION
        ====================================================== */}

        <div
          className="row g-3 mb-5"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
          data-aos-once="false"
        >
          <div className="col-lg-8">
            <div
              className="h-100 d-flex align-items-center"
              style={{
                borderRadius: "20px",
                padding: "clamp(22px, 4vw, 32px)",
                backgroundColor: "var(--card-bg)",
                border: "1px solid rgba(165, 28, 48, 0.08)",
                boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    minWidth: "52px",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(165, 28, 48, 0.09)",
                    color: accent,
                  }}
                >
                  <i className="bi bi-building" style={{ fontSize: "23px" }} />
                </div>

                <div>
                  <span
                    style={{
                      display: "block",
                      color: accent,
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Our Institution
                  </span>

                  <h2
                    className="mb-1"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.25rem, 2.5vw, 1.8rem)",
                      fontWeight: "700",
                      color: "var(--color-text)",
                    }}
                  >
                    {content.collegeName}
                  </h2>

                  <p
                    className="mb-0"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <i className="bi bi-geo-alt me-1" />
                    {content.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="h-100 d-flex align-items-center justify-content-center text-center"
              style={{
                borderRadius: "20px",
                padding: "25px",
                background: "linear-gradient(145deg, #A51C30, #7A1523)",
                boxShadow: "0 15px 40px rgba(165, 28, 48, 0.16)",
                color: "#fff",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: "700",
                    lineHeight: "1",
                    marginBottom: "7px",
                  }}
                >
                  2005
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  A tradition of education
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATS
        ====================================================== */}

        <div
          className="row g-3 mb-5"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="150"
          data-aos-once="false"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="col-6 col-lg-3"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-delay={150 + index * 80}
              data-aos-once="false"
            >
              <div
                className="h-100"
                style={{
                  position: "relative",
                  borderRadius: "18px",
                  padding: "clamp(20px, 3vw, 28px)",
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid rgba(165, 28, 48, 0.07)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.035)",
                  transition:
                    "transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(0,0,0,0.035)";
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(165, 28, 48, 0.08)",
                      color: accent,
                    }}
                  >
                    <i
                      className={`bi ${stat.icon}`}
                      style={{ fontSize: "19px" }}
                    />
                  </div>

                  <span
                    style={{
                      color: accent,
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                    }}
                  >
                    0{index + 1}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                    fontWeight: "700",
                    lineHeight: "1",
                    color: accent,
                    marginBottom: "8px",
                  }}
                >
                  {stat.value}
                </div>

                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "600",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            SECTION LABEL
        ====================================================== */}

        <div
          className="text-center mb-4"
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-once="false"
        >
          <span
            style={{
              display: "inline-block",
              color: accent,
              fontSize: "0.7rem",
              fontWeight: "700",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            What Guides Us
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Our Foundation
          </h2>
        </div>

        {/* =====================================================
            VISION + MISSION
        ====================================================== */}

        <div className="row g-4 mb-5">
          {/* VISION */}

          <div
            className="col-lg-7"
            data-aos="fade-right"
            data-aos-duration="900"
            data-aos-once="false"
          >
            <div
              className="h-100"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                padding: "clamp(28px, 4vw, 50px)",
                backgroundColor: "var(--card-bg)",
                border: "1px solid rgba(165, 28, 48, 0.08)",
                boxShadow: "0 15px 45px rgba(0,0,0,0.055)",
                transition:
                  "transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-7px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 60px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 15px 45px rgba(0,0,0,0.055)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-45px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(9rem, 18vw, 15rem)",
                  fontWeight: "700",
                  lineHeight: "1",
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
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-4">
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
                        fontSize: "0.68rem",
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
                        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
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
                  style={{
                    color: "var(--color-text)",
                    fontSize: "clamp(1rem, 1.4vw, 1.12rem)",
                    lineHeight: "1.9",
                  }}
                >
                  {content.vision}
                </p>
              </div>
            </div>
          </div>

          {/* MISSION */}

          <div
            className="col-lg-5"
            data-aos="fade-left"
            data-aos-duration="900"
            data-aos-delay="100"
            data-aos-once="false"
          >
            <div
              className="h-100"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                padding: "clamp(28px, 4vw, 45px)",
                background: "linear-gradient(145deg, #A51C30 0%, #7A1523 100%)",
                boxShadow: "0 18px 45px rgba(165, 28, 48, 0.18)",
                transition:
                  "transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-7px)";
                e.currentTarget.style.boxShadow =
                  "0 28px 60px rgba(165, 28, 48, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(165, 28, 48, 0.18)";
              }}
            >
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
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-4">
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
                        fontSize: "0.68rem",
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
                        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
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
                  style={{
                    color: "rgba(255,255,255,0.93)",
                    fontSize: "clamp(0.98rem, 1.3vw, 1.05rem)",
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
            AIMS & OBJECTIVES
        ====================================================== */}

        <div
          className="text-center mb-4"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-once="false"
        >
          <span
            style={{
              color: accent,
              fontSize: "0.7rem",
              fontWeight: "700",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            03 / Our Direction
          </span>

          <h2
            className="mt-2 mb-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "var(--color-text)",
            }}
          >
            Aims & Objectives
          </h2>

          <p
            className="mb-0"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.95rem",
            }}
          >
            Turning our principles into meaningful action.
          </p>
        </div>

        <div className="row g-3 mb-5">
          {content.aims.map((aim, index) => (
            <div
              key={index}
              className="col-12 col-md-6 col-xl-3"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-delay={(index % 4) * 80}
              data-aos-once="false"
            >
              <div
                className="h-100 text-center"
                style={{
                  padding: "clamp(24px, 3vw, 30px) 22px",
                  borderRadius: "19px",
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid rgba(165, 28, 48, 0.08)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.035)",
                  transition:
                    "transform .4s ease, box-shadow .4s ease, border-color .4s ease",
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
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: accent,
                    fontSize: "2.2rem",
                    fontWeight: "700",
                    lineHeight: "1",
                    marginBottom: "18px",
                    opacity: 0.8,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  style={{
                    width: "32px",
                    height: "2px",
                    backgroundColor: accent,
                    margin: "0 auto 18px",
                    borderRadius: "10px",
                  }}
                />

                <p
                  className="mb-0"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "0.92rem",
                    lineHeight: "1.7",
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

        <div
          data-aos="fade-up"
          data-aos-duration="900"
          data-aos-once="false"
          className="mb-5"
        >
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
            {/* Background typography */}

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
              <div className="col-lg-4 mb-4 mb-lg-0">
                <div className="d-flex align-items-center gap-3 mb-4">
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

                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.68rem",
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
                        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                        fontWeight: "700",
                        color: "#fff",
                        lineHeight: "1.15",
                      }}
                    >
                      What We Offer
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    width: "45px",
                    height: "3px",
                    backgroundColor: "#fff",
                    opacity: 0.8,
                    borderRadius: "10px",
                  }}
                />
              </div>

              <div className="col-lg-8">
                <p
                  className="mb-0"
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

        {/* =====================================================
            CTA
        ====================================================== */}

        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="900"
          data-aos-once="false"
        >
          <div
            style={{
              position: "relative",
              borderRadius: "24px",
              padding: "clamp(32px, 5vw, 50px) 20px",
              backgroundColor: "var(--color-bg)",
              border: "1px solid rgba(165, 28, 48, 0.08)",
              boxShadow: "0 10px 35px rgba(0,0,0,0.035)",
            }}
          >
            <span
              style={{
                color: accent,
                fontSize: "0.7rem",
                fontWeight: "700",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
              }}
            >
              Begin Your Journey
            </span>

            <h2
              className="mt-2 mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
                fontWeight: "700",
                color: "var(--color-text)",
              }}
            >
              Ready to join <span style={{ color: accent }}>GDC Gulabad?</span>
            </h2>

            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                maxWidth: "520px",
                margin: "0 auto 1.7rem",
                lineHeight: "1.7",
              }}
            >
              Start your journey toward academic excellence and a meaningful
              future.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link
                to="/programs"
                className="btn"
                style={{
                  background: "linear-gradient(145deg, #A51C30, #7A1523)",
                  color: "#fff",
                  padding: "0.72rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 5px 18px rgba(165, 28, 48, 0.25)",
                  transition: "transform .3s ease, box-shadow .3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 9px 28px rgba(165, 28, 48, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 18px rgba(165, 28, 48, 0.25)";
                }}
              >
                <i className="bi bi-book me-2" />
                Explore Programs
              </Link>

              <Link
                to="/contact"
                className="btn"
                style={{
                  padding: "0.72rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  background: "transparent",
                  transition: "all .3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-envelope me-2" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
