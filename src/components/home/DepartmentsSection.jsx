import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ---- Layout tokens (brand: maroon #A51C30 on off-white #f8f9fc) ----
const LAYOUT = {
  desktop: { width: 320, height: 440, gap: 260, maxOffset: 2 },
  mobile: { width: 220, height: 300, gap: 150, maxOffset: 1 },
};

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive breakpoint
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await fetchCollection("departments");
        setDepartments(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const total = departments.length;

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || total === 0) return;
      const next = ((index % total) + total) % total;
      if (next === activeIndex) return;
      setIsTransitioning(true);
      setActiveIndex(next);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [activeIndex, isTransitioning, total],
  );

  // Autoplay
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    intervalRef.current = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [total, activeIndex, goToSlide, isPaused]);

  // Swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToSlide(activeIndex + 1);
      else goToSlide(activeIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goToSlide(activeIndex + 1);
      if (e.key === "ArrowLeft") goToSlide(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, goToSlide]);

  // Shortest signed distance from activeIndex, so the fan wraps both ways
  const getOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading departments…</span>
        </div>
      </div>
    );
  }

  if (!total) return null;

  const cfg = isMobile ? LAYOUT.mobile : LAYOUT.desktop;

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f8f9fc",
        padding: "4rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
      .custom-shape-divider-top-1786172948 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-top-1786172948 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 112px;
}

.custom-shape-divider-top-1786172948 .shape-fill {
    fill: #7A1523;
}
      `}</style>
      <div class="custom-shape-divider-top-1786172948">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      {/* Subtle background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-40%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(165,28,48,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(165,28,48,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 2, maxWidth: "100%" }}
      >
        {/* ---- Header ---- */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "3px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.06)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.75rem",
            }}
          >
            Academic Excellence
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
              letterSpacing: "-0.5px",
            }}
          >
            Explore Our{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #A51C30, #d43d55)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Departments
            </span>
          </h2>
          <p
            style={{
              color: "#6c757d",
              fontSize: "clamp(1rem, 1.1vw, 1.2rem)",
              maxWidth: "550px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Discover our diverse academic programs designed to shape future
            leaders and innovators.
          </p>
        </div>

        {/* ---- Fan Carousel ---- */}
        <div
          style={{
            position: "relative",
            height: `${cfg.height + 40}px`,
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredIndex(null);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {departments.map((dept, idx) => {
            const diff = getOffset(idx);
            if (Math.abs(diff) > cfg.maxOffset) return null;

            const isCenter = diff === 0;
            const isHovered = hoveredIndex === idx;
            const absDiff = Math.abs(diff);

            const baseScale = isCenter ? 1 : absDiff === 1 ? 0.84 : 0.7;
            const hoverBoost = isHovered && !isCenter ? 0.06 : 0;
            const scale = baseScale + hoverBoost;

            const opacity = isCenter ? 1 : absDiff === 1 ? 0.55 : 0.22;
            const lift = isCenter && isHovered ? -14 : isHovered ? -8 : 0;
            const translateX = diff * cfg.gap;

            return (
              <div
                key={dept.id}
                onClick={() => !isCenter && goToSlide(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                role={isCenter ? undefined : "button"}
                aria-label={!isCenter ? `Go to ${dept.name}` : undefined}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: `${cfg.width}px`,
                  height: `${cfg.height}px`,
                  transform: `translate(-50%, calc(-50% + ${lift}px)) translateX(${translateX}px) scale(${scale})`,
                  transition:
                    "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.55s ease, box-shadow 0.35s ease",
                  opacity,
                  zIndex: isCenter ? 10 : 10 - absDiff,
                  borderRadius: "22px",
                  overflow: "hidden",
                  cursor: isCenter ? "default" : "pointer",
                  backgroundColor: "#e9e9ee",
                  boxShadow: isCenter
                    ? isHovered
                      ? "0 30px 70px rgba(165,28,48,0.22)"
                      : "0 20px 55px rgba(0,0,0,0.14)"
                    : "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                {/* Image */}
                {dept.imageUrl ? (
                  <img
                    src={dept.imageUrl}
                    alt={dept.name}
                    loading={absDiff === 0 ? "eager" : "lazy"}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                      transition:
                        "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, #f0f0f0, #dcdce2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      color: "#c9c9d1",
                    }}
                  >
                    <i className="bi bi-building" />
                  </div>
                )}

                {/* Scrim */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isCenter
                      ? "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Content overlay */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: isCenter ? "1.5rem" : "1rem",
                    color: "#fff",
                  }}
                >
                  <h5
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: isCenter ? "1.35rem" : "0.9rem",
                      fontWeight: "700",
                      marginBottom: isCenter ? "0.5rem" : 0,
                      lineHeight: "1.3",
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      color: "#fff",
                    }}
                  >
                    {dept.name}
                  </h5>

                  {isCenter && (
                    <Link
                      to={`/departments/${dept.slug || dept.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: isHovered ? "0.75rem" : "0.5rem",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        transition: "gap 0.3s ease",
                      }}
                    >
                      Learn More
                      <span style={{ fontSize: "1.1rem" }}>→</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- Controls: arrow / dots / arrow ---- */}
        {total > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.25rem",
              marginTop: "2rem",
            }}
          >
            <button
              className="dept-arrow-btn"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label="Previous department"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                color: "#1a1a1a",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              ←
            </button>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              {departments.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="dept-dot-btn"
                  style={{
                    width: idx === activeIndex ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "50px",
                    border: "none",
                    background: idx === activeIndex ? "#A51C30" : "#d0d0d0",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              className="dept-arrow-btn"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label="Next department"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                background: "#fff",
                color: "#1a1a1a",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              →
            </button>
          </div>
        )}

        {/* ---- CTA Button ---- */}
        <div className="text-center mt-4">
          <Link
            to="/departments"
            className="dept-cta-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#1a1a1a",
              fontWeight: "600",
              fontSize: "0.95rem",
              textDecoration: "none",
              padding: "0.6rem 2rem",
              borderRadius: "50px",
              border: "2px solid #e0e0e0",
              transition: "all 0.3s ease",
              background: "transparent",
              marginBottom: "10vh",
            }}
          >
            View All Departments
            <span style={{ fontSize: "1.1rem" }}>→</span>
          </Link>
        </div>
      </div>

      {/* ---- Hover states via CSS (kept separate from JS-driven fan transforms) ---- */}
      <style>{`
        .dept-arrow-btn:hover {
          background: #A51C30 !important;
          color: #fff !important;
          border-color: #A51C30 !important;
          box-shadow: 0 8px 24px rgba(165,28,48,0.25);
          transform: scale(1.06);
        }
        .dept-dot-btn:hover {
          background: #b0b0b0;
        }
        .dept-cta-link:hover {
          border-color: #A51C30 !important;
          background: rgba(165,28,48,0.04) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        @media (max-width: 768px) {
          .dept-arrow-btn {
            width: 36px !important;
            height: 36px !important;
          }
        }
          .custom-shape-divider-bottom-1786173539 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-bottom-1786173539 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 64px;
}

.custom-shape-divider-bottom-1786173539 .shape-fill {
    fill: #7A1523;
}
      `}</style>
      <div class="custom-shape-divider-bottom-1786173539">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M649.97 0L599.91 54.12 550.03 0 0 0 0 120 1200 120 1200 0 649.97 0z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default DepartmentsSection;
