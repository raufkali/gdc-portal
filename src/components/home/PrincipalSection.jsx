import { useSettings } from "../../contexts/SettingsContext";
import { useState, useEffect, useRef } from "react";
import { fetchDocument } from "../../firebase/db";

// ============================================================
// TYPEWRITER HOOK — only used for the principal's message
// ============================================================

const useTypewriter = (text, enabled, speed = 18) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed("");
      setDone(false);
      return undefined;
    }

    let i = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return { displayed, done };
};

const PrincipalSection = () => {
  const { settings: contextSettings, loading: contextLoading } = useSettings();

  const sectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMessageOpen, setMobileMessageOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (contextSettings && !contextLoading) {
        setSettings(contextSettings);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchDocument("settings", "website", {
          cacheTTL: 10 * 60 * 1000,
        });

        if (data) {
          setSettings(data);
        } else {
          setSettings({
            principalName: "Dr. Muhammad Ali",
            principalDesignation: "Principal, GDC Gulabad",
            principalImageUrl: "",
            principalMessage:
              "Welcome to our college. We are committed to providing quality education and fostering academic excellence.",
            contactEmail: "info@gdcgulabad.edu.pk",
            contactPhone: "+92 123 4567890",
            experience: "20+",
            students: "5000+",
            programs: "12+",
          });
        }
      } catch (error) {
        console.error("Error fetching principal settings:", error);
        setSettings({
          principalName: "Dr. Muhammad Ali",
          principalDesignation: "Principal, GDC Gulabad",
          principalMessage: "Welcome to our college.",
          contactEmail: "info@gdcgulabad.edu.pk",
          contactPhone: "+92 123 4567890",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [contextSettings, contextLoading]);

  useEffect(() => {
    if (!loading && settings) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (leftColumnRef.current) {
                leftColumnRef.current.style.opacity = "1";
                leftColumnRef.current.style.transform = "translateX(0)";
              }
              if (rightColumnRef.current) {
                rightColumnRef.current.style.opacity = "1";
                rightColumnRef.current.style.transform = "translateX(0)";
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        },
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }
    return undefined;
  }, [loading, settings]);

  const handleImageLoad = () => setImageLoaded(true);

  const messageText = settings?.principalMessage || "";
  const emailText = settings?.contactEmail || "info@gdcgulabad.edu.pk";
  const phoneText = settings?.contactPhone || "+92 123 4567890";

  const typingActive =
    isVisible &&
    (mobileMessageOpen ||
      typeof window === "undefined" ||
      window.innerWidth > 991.98);

  const { displayed: typedMessage, done: messageDone } = useTypewriter(
    messageText,
    typingActive,
    18,
  );

  if (loading) {
    return (
      <section className="py-5 bg-light" ref={sectionRef}>
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#A51C30" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!settings || !settings.principalName) {
    return (
      <section
        className="py-5"
        style={{ backgroundColor: "var(--color-bg-alt)" }}
        ref={sectionRef}
      >
        <div className="container">
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-person"></i>
            </div>
            <h2 className="mb-3">Message from the Principal</h2>
            <p className="text-muted">
              Principal information will be added soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("data:image");
  };

  const imageUrl = isValidImageUrl(settings.principalImageUrl)
    ? settings.principalImageUrl
    : null;

  return (
    <section
      className="principal-section pt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        position: "relative",
        overflow: "hidden",
        minHeight: "400px",
        paddingBottom: "30vh",
      }}
      ref={sectionRef}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          backgroundColor: "rgba(165, 28, 48, 0.03)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(165, 28, 48, 0.02)",
          pointerEvents: "none",
        }}
      />

      <div className="container position-relative">
        <div
          className="text-center mb-5"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
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
            Leadership
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-once="false"
            data-aos-delay="100"
          >
            Message from the <span style={{ color: "#A51C30" }}>Principal</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-once="false"
            data-aos-delay="100"
          >
            A word from our leader about our vision and commitment to excellence
          </p>
        </div>

        <div className="row g-4 align-items-center">
          {/* Left Column — Image (desktop) / Circular logo (mobile) */}
          <div
            className="col-lg-4 col-md-5"
            ref={leftColumnRef}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className="principal-desktop-card">
              <div
                className="card border-0 shadow-lg"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "linear-gradient(145deg, #1A1A1A, #2C2C2C)",
                  maxWidth: "320px",
                  margin: "0 auto",
                }}
              >
                {imageUrl ? (
                  <div style={{ position: "relative", minHeight: "320px" }}>
                    <img
                      src={imageUrl}
                      alt={settings.principalName || "Principal"}
                      loading="eager"
                      decoding="sync"
                      onLoad={handleImageLoad}
                      style={{
                        width: "100%",
                        height: "320px",
                        objectFit: "cover",
                        opacity: imageLoaded ? 1 : 0,
                        transition: "opacity 0.5s ease",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {!imageLoaded && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(90deg, #2C2C2C 25%, #3C3C3C 50%, #2C2C2C 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite",
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "320px",
                      padding: "2rem",
                      textAlign: "center",
                      background: "linear-gradient(145deg, #1A1A1A, #2C2C2C)",
                      color: "#fff",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background: "rgba(165, 28, 48, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1rem",
                        }}
                      >
                        <i
                          className="bi bi-person display-4"
                          style={{ color: "#A51C30" }}
                        ></i>
                      </div>
                      <h4
                        style={{
                          color: "#fff",
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.2rem",
                        }}
                      >
                        {settings.principalName || "Principal"}
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {settings.principalDesignation || "GDC Gulabad"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE CIRCULAR LOGO */}
            <div className="principal-mobile-logo-wrap">
              <button
                type="button"
                onClick={() => setMobileMessageOpen((v) => !v)}
                className={`principal-mobile-logo ${
                  mobileMessageOpen ? "is-open" : ""
                }`}
                aria-label={
                  mobileMessageOpen
                    ? "Hide principal message"
                    : "Show principal message"
                }
                aria-expanded={mobileMessageOpen}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={settings.principalName || "Principal"}
                    className="principal-mobile-logo-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="principal-mobile-logo-fallback">
                    {(settings.principalName || "P").charAt(0)}
                  </span>
                )}

                <span className="principal-mobile-logo-tap">
                  <i className="bi bi-chat-quote-fill" aria-hidden="true" />
                </span>
              </button>

              <div className="principal-mobile-logo-name">
                <strong>{settings.principalName}</strong>
                <span>{settings.principalDesignation}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="col-lg-8 col-md-7"
            ref={rightColumnRef}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.2s",
            }}
          >
            <div
              className={`principal-message-card card border-0 shadow-lg ${
                mobileMessageOpen ? "is-open" : ""
              }`}
              style={{ borderRadius: "16px" }}
            >
              <div className="card-body p-4 p-lg-5">
                <div className="mb-3">
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)",
                      fontWeight: "700",
                      color: "var(--color-text)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {settings.principalName}
                  </h3>
                  {settings.principalDesignation && (
                    <p
                      style={{
                        color: "#A51C30",
                        fontWeight: "500",
                        fontSize: "1rem",
                      }}
                    >
                      <i className="bi bi-briefcase me-2"></i>
                      {settings.principalDesignation}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    position: "relative",
                    padding: "1rem 0",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "0",
                      fontSize: "3rem",
                      color: "rgba(165, 28, 48, 0.1)",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      lineHeight: "1",
                    }}
                  >
                    "
                  </div>
                  <div
                    className="lead principal-typed-message"
                    style={{
                      fontSize: "clamp(1rem, 1.1vw, 1.15rem)",
                      lineHeight: "1.8",
                      color: "var(--color-text)",
                      paddingLeft: "2rem",
                      paddingTop: "0.25rem",
                      fontStyle: "italic",
                      fontWeight: "400",
                      minHeight: "4.5rem",
                    }}
                  >
                    {typedMessage}
                    {!messageDone && typingActive && (
                      <span className="principal-caret" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* STATS STRIP — static values */}
            <div className="principal-stats-strip">
              <div className="principal-stat-tile">
                <div className="principal-stat-value">
                  {settings.experience || "20+"}
                </div>
                <div className="principal-stat-label">Years Experience</div>
              </div>

              <div className="principal-stat-tile">
                <div className="principal-stat-value">
                  {settings.students || "5000+"}
                </div>
                <div className="principal-stat-label">Students Impacted</div>
              </div>

              <div className="principal-stat-tile">
                <div className="principal-stat-value">
                  {settings.programs || "12+"}
                </div>
                <div className="principal-stat-label">Programs Offered</div>
              </div>
            </div>

            {/* CONTACT STRIP — static values */}
            <div className="principal-contact-strip">
              <div className="principal-contact-item">
                <span className="principal-contact-icon">
                  <i className="bi bi-envelope-fill" aria-hidden="true" />
                </span>
                <div className="principal-contact-text">
                  <span className="principal-contact-label">Email</span>
                  <span className="principal-contact-value">{emailText}</span>
                </div>
              </div>

              <div className="principal-contact-item">
                <span className="principal-contact-icon">
                  <i className="bi bi-telephone-fill" aria-hidden="true" />
                </span>
                <div className="principal-contact-text">
                  <span className="principal-contact-label">Phone</span>
                  <span className="principal-contact-value">{phoneText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          STYLES
          ========================================================= */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Caret for the principal message typing only */
        .principal-caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          margin-left: 3px;
          background: #A51C30;
          vertical-align: -0.1em;
          animation: principalCaret 0.9s steps(2, start) infinite;
        }

        @keyframes principalCaret {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }

        /* =====================================================
           STATS STRIP
        ===================================================== */
        .principal-stats-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.9rem;
          margin-top: 1rem;
        }

        .principal-stat-tile {
          position: relative;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
          border-radius: 14px;
          padding: 1.1rem 0.75rem;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .principal-stat-tile::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 3px;
          border-radius: 0 0 3px 3px;
          background: #A51C30;
        }

        .principal-stat-value {
          font-size: clamp(1.35rem, 2.4vw, 1.75rem);
          font-weight: 700;
          color: #A51C30;
          font-family: "Playfair Display", Georgia, serif;
          font-variant-numeric: tabular-nums;
          line-height: 1.1;
          margin-bottom: 0.35rem;
        }

        .principal-stat-label {
          font-size: 0.68rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
        }

        /* =====================================================
           CONTACT STRIP
        ===================================================== */
        .principal-contact-strip {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .principal-contact-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
          min-width: 0;
        }

        .principal-contact-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #A51C30, #7A1523);
          color: #fff;
          font-size: 1rem;
        }

        .principal-contact-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .principal-contact-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-bottom: 0.15rem;
        }

        .principal-contact-value {
          font-size: 0.85rem;
          color: var(--color-text);
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        /* =====================================================
           MOBILE CIRCULAR LOGO
        ===================================================== */
        .principal-mobile-logo-wrap {
          display: none;
        }

        .custom-shape-divider-bottom-1786172763 {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }

        .custom-shape-divider-bottom-1786172763 svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 109px;
        }

        .custom-shape-divider-bottom-1786172763 .shape-fill {
          fill: #7A1523;
        }

        @media (max-width: 991.98px) {
          .principal-desktop-card {
            display: none;
          }

          .principal-mobile-logo-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.85rem;
            margin-bottom: 1.5rem;
          }

          .principal-mobile-logo {
            position: relative;
            width: 132px;
            height: 132px;
            border-radius: 50%;
            border: none;
            padding: 0;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .principal-mobile-logo-img,
          .principal-mobile-logo-fallback {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(145deg, #1A1A1A, #2C2C2C);
            color: #fff;
            font-family: "Playfair Display", Georgia, serif;
            font-size: 3rem;
            font-weight: 700;
            box-shadow:
              0 12px 30px rgba(0, 0, 0, 0.25),
              0 3px 10px rgba(0, 0, 0, 0.15);
          }

          .principal-mobile-logo-tap {
            position: absolute;
            right: -4px;
            bottom: -4px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(145deg, #A51C30, #7A1523);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.05rem;
            box-shadow: 0 6px 16px rgba(165, 28, 48, 0.4);
          }

          .principal-mobile-logo-name {
            text-align: center;
            display: flex;
            flex-direction: column;
            line-height: 1.3;
          }

          .principal-mobile-logo-name strong {
            font-family: "Playfair Display", Georgia, serif;
            font-size: 1.15rem;
            color: var(--color-text);
          }

          .principal-mobile-logo-name span {
            font-size: 0.8rem;
            color: #A51C30;
          }

          /* Mobile: card hidden until tapped, no transitions */
          .principal-message-card {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin-top: 0;
          }

          .principal-message-card.is-open {
            max-height: none;
            opacity: 1;
            overflow: visible;
            margin-top: 0.5rem;
          }

          /* Stats + contact hidden until message opened */
          .principal-stats-strip,
          .principal-contact-strip {
            display: none;
          }

          .principal-message-card.is-open ~ .principal-stats-strip,
          .principal-message-card.is-open ~ .principal-contact-strip {
            display: grid;
          }

          .principal-contact-strip {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 992px) {
          .principal-message-card {
            max-height: none;
            opacity: 1;
            overflow: visible;
          }
        }

        @media (max-width: 575.98px) {
          .principal-stats-strip {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.55rem;
          }

          .principal-stat-tile {
            padding: 0.85rem 0.5rem;
            border-radius: 12px;
          }

          .principal-stat-value {
            font-size: 1.15rem;
          }

          .principal-stat-label {
            font-size: 0.6rem;
            letter-spacing: 0.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .principal-caret {
            animation: none !important;
          }
        }
      `}</style>

      <div className="custom-shape-divider-bottom-1786172763">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default PrincipalSection;
