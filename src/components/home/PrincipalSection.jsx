import { useSettings } from "../../contexts/SettingsContext";

const PrincipalSection = () => {
  const { settings, loading } = useSettings();

  // Show loading state
  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no settings, show placeholder
  if (!settings || !settings.principalName) {
    return (
      <section
        className="py-5"
        style={{ backgroundColor: "var(--color-bg-alt)" }}
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

  const hasImage =
    settings.principalImageUrl &&
    typeof settings.principalImageUrl === "string" &&
    settings.principalImageUrl.trim() !== "";

  // Check if image URL is valid (starts with http or data:image)
  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("data:image");
  };

  const imageUrl = isValidImageUrl(settings.principalImageUrl)
    ? settings.principalImageUrl
    : null;

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        position: "relative",
        overflow: "hidden",
      }}
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
        {/* Section Title */}
        <div className="text-center mb-5">
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
          >
            A word from our leader about our vision and commitment to excellence
          </p>
        </div>

        {/* Main Content */}
        <div className="row g-4 align-items-center">
          {/* Left Column - Image */}
          <div className="col-lg-4 col-md-5" data-aos="fade-right">
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
                <img
                  src={imageUrl}
                  alt={settings.principalName || "Principal"}
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 320px;
                        padding: 2rem;
                        text-align: center;
                        background: linear-gradient(145deg, #1A1A1A, #2C2C2C);
                        color: #fff;
                      ">
                        <div>
                          <div style="
                            width: 80px;
                            height: 80px;
                            border-radius: 50%;
                            background: rgba(165, 28, 48, 0.2);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 1rem;
                          ">
                            <i class="bi bi-person display-4" style="color: #A51C30;"></i>
                          </div>
                          <h4 style="color: #fff; font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem;">
                            ${settings.principalName || "Principal"}
                          </h4>
                          <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">
                            ${settings.principalDesignation || "GDC Gulabad"}
                          </p>
                        </div>
                      </div>
                    `;
                  }}
                />
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

          {/* Right Column - Content */}
          <div className="col-lg-8 col-md-7" data-aos="fade-left">
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "16px" }}
            >
              <div className="card-body p-4 p-lg-5">
                {/* Name and Designation */}
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

                {/* Quote / Message */}
                <div
                  style={{
                    position: "relative",
                    padding: "1rem 0",
                    marginBottom: "1rem",
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
                    className="lead"
                    style={{
                      fontSize: "clamp(1rem, 1.1vw, 1.15rem)",
                      lineHeight: "1.8",
                      color: "var(--color-text)",
                      paddingLeft: "2rem",
                      paddingTop: "0.25rem",
                      fontStyle: "italic",
                      fontWeight: "400",
                    }}
                  >
                    {settings.principalMessage || (
                      <>
                        Welcome to our college. We are committed to providing
                        quality education and fostering academic excellence in a
                        supportive and inclusive environment.
                      </>
                    )}
                  </div>
                </div>

                {/* Stats / Highlights */}
                <div className="row g-2 mt-2">
                  <div className="col-4">
                    <div className="text-center">
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "700",
                          color: "#A51C30",
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {settings.experience || "20+"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Years Experience
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "700",
                          color: "#A51C30",
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {settings.students || "5000+"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Students Impacted
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "700",
                          color: "#A51C30",
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {settings.programs || "12+"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Programs Offered
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr
                  className="my-3"
                  style={{
                    borderColor: "var(--color-border)",
                    opacity: "0.5",
                  }}
                />

                {/* Bottom section with contact */}
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <i className="bi bi-envelope me-2"></i>
                    {settings.contactEmail || "info@gdcgulabad.edu.pk"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <i className="bi bi-telephone me-2"></i>
                    {settings.contactPhone || "+92 123 4567890"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalSection;
