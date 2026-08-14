import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

// ============================================================
// Cache for departments
// ============================================================

let cachedDepartments = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================================
// Departments
// ============================================================

const Departments = () => {
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

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedDepartments &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [activeCategory, setActiveCategory] = useState("All");

  // ============================================================
  // Fetch Departments
  // ============================================================

  useEffect(() => {
    const fetchDepartments = async () => {
      // Use valid cache
      if (
        cachedDepartments &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setDepartments(cachedDepartments);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("departments");

        cachedDepartments = data;
        cacheTimestamp = Date.now();

        setDepartments(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching departments:", error);

        // Fall back to old cache if available
        if (cachedDepartments) {
          setDepartments(cachedDepartments);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // ============================================================
  // Categories
  // ============================================================

  const categories = [
    "All",
    ...new Set(
      departments.map((department) => department.category).filter(Boolean),
    ),
  ];

  // ============================================================
  // Filter Departments
  // ============================================================

  const filteredDepts =
    activeCategory === "All"
      ? departments
      : departments.filter(
          (department) => department.category === activeCategory,
        );

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <section
        className="py-5 mt-5 departments-page"
        style={{
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#A51C30" }}
            >
              <span className="visually-hidden">Loading departments...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // Empty State
  // ============================================================

  if (departments.length === 0) {
    return (
      <section
        className="py-5 mt-5 departments-page"
        style={{
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="container">
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-building"></i>
            </div>

            <h4 className="text-muted">No departments available</h4>

            <p className="text-muted small">
              Please check back later for updates.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // Main
  // ============================================================

  return (
    <section
      className="py-5 mt-5 departments-page"
      style={{
        backgroundColor: "var(--color-bg-alt)",
      }}
    >
      <div className="container departments-container">
        {/* ======================================================
            Header
        ====================================================== */}

        <div className="departments-header mb-5">
          <div className="departments-heading">
            <span className="academics-badge">Academics</span>

            <h2 className="departments-title">Academic Departments</h2>

            <p className="departments-subtitle">
              Discover excellence across various disciplines.
            </p>

            {fromCache && process.env.NODE_ENV === "development" && (
              <span className="cache-indicator">Cached</span>
            )}
          </div>

          {/* ====================================================
              Category Filter
          ==================================================== */}

          {categories.length > 1 && (
            <div className="category-filter-wrapper">
              <div className="category-filter">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`category-button ${
                      activeCategory === cat ? "category-button-active" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================
            Departments Grid
        ====================================================== */}

        <div className="row g-4 departments-grid">
          {filteredDepts.map((dept) => (
            <div key={dept.id} className="col-12 col-sm-6 col-lg-3">
              {/* IMPORTANT:
                  Your route is /departments/:id
                  Therefore ALWAYS use dept.id.
              */}

              <Link
                to={`/departments/${dept.id}`}
                className="text-decoration-none department-link"
              >
                <div
                  className="dept-card-premium"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";

                    e.currentTarget.style.borderColor = "#A51C30";

                    e.currentTarget.style.boxShadow =
                      "0 20px 25px -5px rgba(165,28,48,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";

                    e.currentTarget.style.borderColor = "#e5e5e5";

                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* ==================================================
                      Image
                  ================================================== */}

                  <div className="department-image-wrapper">
                    {dept.imageUrl ? (
                      <img
                        src={dept.imageUrl}
                        alt={dept.name}
                        className="department-image"
                        loading="lazy"
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";

                          if (e.target.parentElement) {
                            e.target.parentElement.innerHTML = `
                              <div class="department-image-fallback">
                                <i class="bi bi-building"></i>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="department-image-fallback">
                        <i className="bi bi-building"></i>
                      </div>
                    )}

                    {/* Image Gradient */}

                    <div className="department-image-gradient"></div>

                    {/* Category */}

                    {dept.category && (
                      <span className="department-category">
                        {dept.category}
                      </span>
                    )}

                    {/* Icon */}

                    <div className="department-icon">
                      <i className={`bi ${dept.icon || "bi-building"}`}></i>
                    </div>
                  </div>

                  {/* ==================================================
                      Content
                  ================================================== */}

                  <div className="department-content">
                    <h5 className="department-name">{dept.name}</h5>

                    <p className="department-description">
                      {dept.description
                        ? `${dept.description.substring(0, 50)}${
                            dept.description.length > 50 ? "..." : ""
                          }`
                        : "Explore this academic department."}
                    </p>

                    {/* ==================================================
                        Faculty
                    ================================================== */}

                    <div className="faculty-section">
                      <div className="faculty-header">
                        <span className="faculty-label">Faculty</span>

                        <span className="faculty-count">
                          {dept.facultyCount || 0}
                        </span>
                      </div>

                      <div className="faculty-progress">
                        <div
                          className="faculty-progress-bar"
                          style={{
                            width: `${Math.min(
                              (dept.facultyCount || 0) * 5,
                              100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* ==================================================
                        Footer
                    ================================================== */}

                    <div className="department-footer">
                      <span className="department-head">
                        Head: <strong>{dept.headName || "TBA"}</strong>
                      </span>

                      <div className="department-arrow">
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          Styles
      ============================================================ */}

      <style>{`

        /* ==========================================================
           PAGE
        ========================================================== */

        .departments-page {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .departments-container {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
        }

        /* ==========================================================
           HEADER
        ========================================================== */

        .departments-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          width: 100%;
        }

        .departments-heading {
          min-width: 0;
        }

        .academics-badge {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #A51C30;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: rgba(165, 28, 48, 0.08);
          padding: 0.4rem 1.5rem;
          border-radius: 50px;
          margin-bottom: 0.5rem;
        }

        .departments-title {
          font-size: clamp(
            1.8rem,
            3vw,
            2.5rem
          );
          font-family:
            "Playfair Display",
            Georgia,
            serif;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .departments-subtitle {
          color: var(--color-text-muted);
          margin-bottom: 0;
        }

        .cache-indicator {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.15rem 0.8rem;
          border-radius: 50px;
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          font-size: 0.65rem;
        }

        /* ==========================================================
           CATEGORY FILTER
        ========================================================== */

        .category-filter-wrapper {
          /*
           * Critical mobile fix:
           * Never allow the filter itself to increase
           * the width of the page.
           */
          min-width: 0;
          max-width: 100%;
        }

        .category-filter {
          display: flex;
          align-items: center;
          gap: 3px;

          /*
           * Desktop
           */
          width: max-content;
          max-width: 100%;

          padding: 4px;

          background: #fff;
          border-radius: 50px;
          border: 1px solid #e5e5e5;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.04);

          /*
           * Prevent the category buttons from
           * expanding the document.
           */
          overflow-x: auto;
          overflow-y: hidden;

          scrollbar-width: none;
          -ms-overflow-style: none;

          -webkit-overflow-scrolling: touch;
        }

        .category-filter::-webkit-scrollbar {
          display: none;
        }

        .category-button {
          flex: 0 0 auto;

          border: none;
          outline: none;

          background: transparent;
          color: #6c757d;

          padding: 8px 18px;

          border-radius: 50px;

          font-size: 0.82rem;
          font-weight: 600;

          white-space: nowrap;

          cursor: pointer;

          transition:
            background-color 0.25s ease,
            color 0.25s ease,
            transform 0.2s ease;
        }

        .category-button:hover {
          background: #f8f9fa;
          color: #A51C30;
        }

        .category-button-active {
          background: #A51C30 !important;
          color: #fff !important;
        }

        .category-button:active {
          transform: scale(0.97);
        }

        /* ==========================================================
           CARD
        ========================================================== */

        .department-link {
          display: block;
          height: 100%;
          width: 100%;
        }

        .dept-card-premium {
          width: 100%;
          height: 100%;

          position: relative;

          overflow: hidden;

          border-radius: 12px;
          border: 1px solid #e5e5e5;

          background: var(--card-bg);

          cursor: pointer;

          transition:
            all 0.3s cubic-bezier(
              0.4,
              0,
              0.2,
              1
            );
        }

        /* ==========================================================
           IMAGE
        ========================================================== */

        .department-image-wrapper {
          position: relative;

          width: 100%;
          height: 160px;

          overflow: hidden;
        }

        .department-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 0.5s ease;
        }

        .department-image-fallback {
          width: 100%;
          height: 160px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              145deg,
              #1A1A1A,
              #2C2C2C
            );

          color: rgba(
            255,
            255,
            255,
            0.1
          );

          font-size: 3rem;
        }

        .department-image-gradient {
          position: absolute;

          left: 0;
          right: 0;
          bottom: 0;

          height: 60%;

          background:
            linear-gradient(
              to top,
              rgba(255,255,255,1),
              rgba(255,255,255,0)
            );

          pointer-events: none;
        }

        /* ==========================================================
           CATEGORY BADGE
        ========================================================== */

        .department-category {
          position: absolute;

          top: 12px;
          right: 12px;

          max-width: calc(100% - 24px);

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          background:
            rgba(255,255,255,0.92);

          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);

          color: #1E1B18;

          padding: 4px 12px;

          border-radius: 20px;

          font-size: 0.7rem;
          font-weight: 700;

          z-index: 3;
        }

        /* ==========================================================
           DEPARTMENT ICON
        ========================================================== */

        .department-icon {
          position: absolute;

          bottom: -25px;
          left: 25px;

          width: 50px;
          height: 50px;

          background: #A51C30;
          color: white;

          border-radius: 8px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 1.4rem;

          box-shadow:
            0 8px 15px
            rgba(165,28,48,0.3);

          z-index: 4;
        }

        /* ==========================================================
           CONTENT
        ========================================================== */

        .department-content {
          padding: 3rem 1.5rem 1.5rem;
        }

        .department-name {
          color: var(--color-text);

          font-size: 1.1rem;
          font-weight: 700;

          line-height: 1.3;

          margin-bottom: 0.5rem;

          /*
           * Prevent very long department names
           * from destroying the card layout.
           */
          overflow-wrap: anywhere;
        }

        .department-description {
          color: var(--color-text-muted);

          font-size: 0.8rem;

          line-height: 1.5;

          min-height: 38px;

          margin-bottom: 1.5rem;
        }

        /* ==========================================================
           FACULTY
        ========================================================== */

        .faculty-section {
          margin-bottom: 1.5rem;
        }

        .faculty-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 5px;
        }

        .faculty-label {
          font-size: 0.7rem;
          font-weight: 700;

          color: var(--color-text-muted);

          text-transform: uppercase;
        }

        .faculty-count {
          font-size: 0.7rem;
          font-weight: 700;

          color: #A51C30;
        }

        .faculty-progress {
          width: 100%;
          height: 4px;

          background: #e5e5e5;

          border-radius: 2px;

          overflow: hidden;
        }

        .faculty-progress-bar {
          height: 100%;

          background: #A51C30;

          border-radius: 2px;

          transition: width 0.5s ease;
        }

        /* ==========================================================
           FOOTER
        ========================================================== */

        .department-footer {
          display: flex;

          justify-content: space-between;
          align-items: center;

          gap: 10px;

          padding-top: 1rem;

          border-top: 1px solid #e5e5e5;
        }

        .department-head {
          min-width: 0;

          color: var(--color-text-muted);

          font-size: 0.7rem;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .department-head strong {
          color: var(--color-text);
        }

        .department-arrow {
          width: 32px;
          height: 32px;

          flex: 0 0 32px;

          border-radius: 50%;

          border: 1px solid #e5e5e5;

          background: white;

          color: #6B655A;

          display: flex;
          align-items: center;
          justify-content: center;

          transition: all 0.3s ease;
        }

        .dept-card-premium:hover
        .department-arrow {
          background: #A51C30;
          color: white;
          border-color: #A51C30;
        }

        /* ==========================================================
           MOBILE
        ========================================================== */

        @media (max-width: 767.98px) {

          /*
           * Absolute protection against horizontal overflow.
           */
          .departments-page,
          .departments-container {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .departments-container {
            padding-left: 16px;
            padding-right: 16px;
          }

          /* -----------------------------------------------
             Header
          ----------------------------------------------- */

          .departments-header {
            display: block;

            width: 100%;

            margin-bottom: 2rem !important;
          }

          .departments-title {
            font-size: 1.9rem;
            line-height: 1.15;

            max-width: 100%;
          }

          .departments-subtitle {
            font-size: 0.88rem;

            line-height: 1.5;

            max-width: 95%;
          }

          .academics-badge {
            font-size: 0.72rem;
            letter-spacing: 1.5px;

            padding:
              0.35rem
              1rem;
          }

          /* -----------------------------------------------
             Category filter
          ----------------------------------------------- */

          .category-filter-wrapper {
            width: 100%;
            max-width: 100%;

            margin-top: 20px;

            /*
             * Important:
             * the wrapper itself never grows beyond viewport.
             */
            overflow: hidden;
          }

          .category-filter {
            width: 100%;
            max-width: 100%;

            /*
             * Horizontal scrolling INSIDE the filter.
             */
            overflow-x: auto;

            border-radius: 14px;

            padding: 4px;

            gap: 2px;

            /*
             * Make the scrollbar invisible.
             */
            scrollbar-width: none;
          }

          .category-filter::-webkit-scrollbar {
            display: none;
          }

          .category-button {
            padding:
              8px
              14px;

            font-size: 0.74rem;

            flex-shrink: 0;
          }

          /* -----------------------------------------------
             Grid
          ----------------------------------------------- */

          .departments-grid {
            margin-left: 0;
            margin-right: 0;
          }

          .departments-grid > div {
            padding-left: 8px;
            padding-right: 8px;
          }

          /* -----------------------------------------------
             Cards
          ----------------------------------------------- */

          .department-image-wrapper {
            height: 180px;
          }

          .department-image-fallback {
            height: 180px;
          }

          .department-content {
            padding:
              3rem
              1.25rem
              1.25rem;
          }

          .department-name {
            font-size: 1.05rem;
          }

          .department-description {
            font-size: 0.78rem;
          }

          .department-icon {
            left: 20px;
          }
        }

        /* ==========================================================
           VERY SMALL PHONES
        ========================================================== */

        @media (max-width: 390px) {

          .departments-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .departments-title {
            font-size: 1.7rem;
          }

          .departments-subtitle {
            font-size: 0.82rem;
          }

          .category-button {
            padding:
              7px
              12px;

            font-size: 0.7rem;
          }

          .department-content {
            padding:
              3rem
              1rem
              1rem;
          }

          .department-head {
            max-width: 75%;
          }
        }

        /* ==========================================================
           ACCESSIBILITY
        ========================================================== */

        @media (prefers-reduced-motion: reduce) {

          .dept-card-premium,
          .department-image,
          .department-arrow,
          .category-button {
            transition: none !important;
          }
        }

      `}</style>
    </section>
  );
};

export default Departments;
