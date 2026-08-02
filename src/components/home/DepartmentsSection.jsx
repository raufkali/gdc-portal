import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ✅ Cache for departments
let cachedDepartments = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState(() => {
    if (
      cachedDepartments &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedDepartments;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedDepartments &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (
        cachedDepartments &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setDepartments(cachedDepartments);
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching departments from server");
        const data = await fetchCollection("departments");
        cachedDepartments = data;
        cacheTimestamp = Date.now();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        if (cachedDepartments) {
          setDepartments(cachedDepartments);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Auto-rotate departments
  useEffect(() => {
    if (departments.length <= 1) return;

    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [departments.length]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? departments.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === departments.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const displayDepartments = useMemo(() => {
    return departments.slice(0, 6);
  }, [departments]);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "var(--color-primary)" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!departments.length) return null;

  const currentDept = displayDepartments[activeIndex];

  return (
    <>
      <style>{`
        #departments-section .carousel-container {
          width: 100%;
          border-radius: 0;
          margin: 0;
        }

        #departments-section .carousel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          display: flex;
          align-items: center;
        }

        #departments-section .overlay-content {
          max-width: 55%;
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        #departments-section .explore-btn {
          width: auto;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 28px;
          border-radius: 50px;
          background: transparent;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all var(--transition-speed) ease;
          border: 2px solid var(--color-primary);
          box-shadow: 0 4px 20px rgba(165, 28, 48, 0.3);
          white-space: nowrap;
        }

        #departments-section .explore-btn:hover {
          background: transparent;
          color: #fff;
          transform: translateX(5px);
          border-color: #fff;
        }

        #departments-section .dept-tabs-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 3;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          padding: 10px 15px;
          background: rgba(0, 0, 0, 0.27);
          gap: 0;
        }

        #departments-section .dept-tab-btn {
          border: none;
          border-radius: 0;
          padding: 12px 20px;
          background: #ffffff37;
          color: rgba(255,255,255,0.8);
          font-size: 0.8rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        #departments-section .dept-tab-btn.active {
          background: var(--color-primary);
          color: #fff;
          font-weight: 600;
        }

        #departments-section .dept-tab-btn:not(.active):hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        @media (max-width: 768px) {
          #departments-section .carousel-container {
            height: 400px;
          }

          #departments-section .overlay-bg {
            background: rgba(0,0,0,0.65) !important;
          }

          #departments-section .overlay-content {
            max-width: 100%;
            padding: 0 20px;
          }

          #departments-section .explore-btn {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          #departments-section .dept-tabs-bar
           {
          
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          #departments-section .dept-tabs-bar::-webkit-scrollbar {
            display: none;
          }

          #departments-section .dept-tab-btn {
            padding: 12px 15px;
            font-size: 0.75rem;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="departments-section"
        style={{
          padding: "60px 0 0 0",
          background: "var(--color-secondary)",
          position: "relative",
        }}
      >
        <div className="container">
          {/* Header */}
          <div className="text-center mb-4" data-aos="fade-right">
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "2px",
                display: "inline-block",
                background: "rgba(165, 28, 48, 0.08)",
                color: "white",
                padding: "0.3rem 1.2rem",
                borderRadius: "50px",
                marginBottom: "0.5rem",
                border: "2px solid #fff",
              }}
            >
              Academic Excellence
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3vw, 2.5rem)",
                fontWeight: "700",
                color: "white",
                marginBottom: "0.25rem",
              }}
            >
              Our{" "}
              <span style={{ color: "var(--color-primary)" }}>Departments</span>
            </h2>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "1rem",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Discover excellence across various disciplines
            </p>
          </div>
        </div>

        {/* Spotlight Carousel */}
        <div
          data-aos="fade-up"
          className="carousel-container"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "var(--color-bg-dark)",
            boxShadow: "var(--card-shadow)",
            height: "800px",
            maxHeight: "85vh",
            marginTop: "30px",
          }}
        >
          {/* Background Image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${currentDept.imageUrl || "https://via.placeholder.com/1200x600/1a1a1a/A51C30?text=Department"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
              transform: isTransitioning ? "scale(1.08)" : "scale(1)",
            }}
          />

          {/* Dark Overlay - Gradient (desktop), solid on mobile via CSS */}
          <div
            className="overlay-bg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
              zIndex: 1,
            }}
          />

          {/* Text Content Overlay */}
          <div className="carousel-overlay">
            <div className="container">
              <div
                className="overlay-content"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning
                    ? "translateX(30px)"
                    : "translateX(0)",
                }}
              >
                {/* Department Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      background: "var(--color-primary)",
                      color: "#fff",
                      padding: "4px 16px",
                      borderRadius: "50px",
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {currentDept.category || "Department"}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.7rem",
                      fontWeight: "400",
                    }}
                  >
                    {activeIndex + 1} / {displayDepartments.length}
                  </span>
                </div>

                {/* Department Name */}
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: "8px",
                    lineHeight: "1.1",
                    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  {currentDept.name}
                </h3>

                {/* Explore Button */}
                <Link
                  to={`/departments/${currentDept.slug || currentDept.id}`}
                  className="explore-btn"
                >
                  <span>Explore Department</span>
                  <span style={{ fontSize: "1.2rem" }}>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Tabs – Rectangular, on top of image */}
          {displayDepartments.length > 1 && (
            <div className="dept-tabs-bar">
              {displayDepartments.map((dept, index) => (
                <button
                  key={dept.id}
                  onClick={() => goToSlide(index)}
                  className={`dept-tab-btn ${index === activeIndex ? "active" : ""}`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DepartmentsSection;
