import { useSettings } from "../../contexts/SettingsContext";
import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

// ✅ Cache settings for 10 minutes
let cachedSettings = null;
let cacheTimestamp = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const PrincipalSection = () => {
  const { settings: contextSettings, loading: contextLoading } = useSettings();

  // ✅ Add refs for AOS elements
  const sectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);

  // ✅ Initialize with cached data if available
  const [settings, setSettings] = useState(() => {
    if (
      cachedSettings &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      console.log("📦 Principal settings instant from cache");
      return cachedSettings;
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedSettings &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedSettings &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      // ✅ If context settings are already loaded, use them
      if (contextSettings && !contextLoading) {
        setSettings(contextSettings);
        setLoading(false);
        return;
      }

      // ✅ If cache is valid, skip fetching
      if (
        cachedSettings &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        console.log("📦 Principal settings from cache");
        setSettings(cachedSettings);
        setFromCache(true);
        setLoading(false);
        return;
      }

      // Fetch from Firestore
      try {
        console.log("📡 Fetching principal settings from server");
        const docRef = doc(db, "settings", "website");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          cachedSettings = data;
          cacheTimestamp = Date.now();
          setSettings(data);
          setFromCache(false);
        } else {
          // Use fallback settings
          const fallback = {
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
          };
          cachedSettings = fallback;
          cacheTimestamp = Date.now();
          setSettings(fallback);
          setFromCache(false);
        }
      } catch (error) {
        console.error("Error fetching principal settings:", error);
        // Use cached settings if available, even if expired
        if (cachedSettings) {
          console.log("⚠️ Using stale cache for principal settings");
          setSettings(cachedSettings);
          setFromCache(true);
        } else {
          // Ultimate fallback
          setSettings({
            principalName: "Dr. Muhammad Ali",
            principalDesignation: "Principal, GDC Gulabad",
            principalMessage: "Welcome to our college.",
            contactEmail: "info@gdcgulabad.edu.pk",
            contactPhone: "+92 123 4567890",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [contextSettings, contextLoading]);

  // ✅ Intersection Observer for manual animation control
  useEffect(() => {
    if (!loading && settings) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              // Apply animations when visible
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
  }, [loading, settings]);

  // ✅ Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show loading state
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

  // If no settings, show placeholder
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
        minHeight: "400px", // ✅ Prevent layout shift
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

        {/* Main Content */}
        <div
          className="row g-4 align-items-center"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-once="false"
          data-aos-delay="100"
        >
          {/* Left Column - Image with manual animation */}
          <div
            className="col-lg-4 col-md-5"
            ref={leftColumnRef}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
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
                    loading="lazy"
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
                  {/* Image loading skeleton */}
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

          {/* Right Column - Content with manual animation */}
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

      {/* Add shimmer animation styles */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default PrincipalSection;
