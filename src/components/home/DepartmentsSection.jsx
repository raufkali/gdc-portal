import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedDepartments = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

// How many departments to show in this section
const MAX_DEPARTMENTS = 5;

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
      // Cache hit
      if (
        cachedDepartments &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setDepartments(cachedDepartments);
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDocs(collection(db, "departments"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        cachedDepartments = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setDepartments(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchDepartments();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div
            className="spinner-border"
            style={{ color: "#A51C30" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!departments.length) return null;

  // ------------------------------------------------------------
  // Prefer Computer Science as the first / banner department.
  // ------------------------------------------------------------
  const csMatch = departments.find((d) => {
    const name = String(d.name || "").toLowerCase();
    return (
      name.includes("computer science") ||
      name.includes("computer sciences") ||
      name === "cs"
    );
  });

  const bannerDept = csMatch || departments[0];

  const otherDepts = departments
    .filter((d) => d.id !== bannerDept.id)
    .slice(0, MAX_DEPARTMENTS - 1);

  return (
    <section
      className="py-5 departments-section"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <div className="container">
        {/* =========================================================
            SECTION HEADER
            ========================================================= */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
            }}
          >
            Academic Departments
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.25rem",
            }}
          >
            View Our <span style={{ color: "#A51C30" }}>Departments</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore our academic departments, each dedicated to excellence in
            teaching and research.
          </p>
        </div>

        {/* =========================================================
            BANNER DEPARTMENT — image left, text right
            ========================================================= */}
        {bannerDept && (
          <div
            className="department-banner"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            {/* IMAGE */}
            <div className="department-banner-image-wrap">
              {bannerDept.imageUrl ? (
                <img
                  src={bannerDept.imageUrl}
                  alt={bannerDept.name}
                  className="department-banner-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="department-banner-image-fallback">
                  <i className="bi bi-building"></i>
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="department-banner-text">
              {bannerDept.category && (
                <span className="department-banner-category">
                  {bannerDept.category}
                </span>
              )}

              <h3 className="department-banner-title">{bannerDept.name}</h3>

              {bannerDept.description && (
                <p className="department-banner-desc">
                  {bannerDept.description}
                </p>
              )}

              <Link
                to={`/departments/${bannerDept.id}`}
                className="department-banner-cta"
              >
                Explore Department
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================
            ALTERNATING DEPARTMENTS
            ========================================================= */}
        {otherDepts.length > 0 && (
          <div className="department-alternating-list mt-5">
            {otherDepts.map((dept, index) => {
              // index 0 → text left, image right
              // index 1 → image left, text right
              // index 2 → text left, image right … etc.
              const isReversed = index % 2 === 0;

              return (
                <div
                  key={dept.id}
                  className={`department-row ${
                    isReversed ? "department-row-reversed" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={index * 80}
                >
                  {/* IMAGE */}
                  <div className="department-row-image-wrap">
                    {dept.imageUrl ? (
                      <img
                        src={dept.imageUrl}
                        alt={dept.name}
                        className="department-row-image"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="department-row-image-fallback">
                        <i className="bi bi-building"></i>
                      </div>
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="department-row-text">
                    {dept.category && (
                      <span className="department-row-category">
                        {dept.category}
                      </span>
                    )}

                    <h4 className="department-row-title">{dept.name}</h4>

                    {dept.description && (
                      <p className="department-row-desc">{dept.description}</p>
                    )}

                    <Link
                      to={`/departments/${dept.id}`}
                      className="department-row-cta"
                    >
                      Learn More
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================
            VIEW ALL
            ========================================================= */}
        <div className="text-center mt-5">
          <Link
            to="/departments"
            className="btn"
            style={{
              background: "transparent",
              color: "#A51C30",
              padding: "0.5rem 2.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #A51C30",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#A51C30";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(165, 28, 48, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            View All Departments <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>

      {/* =========================================================
          STYLES
          ========================================================= */}
      <style>{`
        /* =====================================================
           BANNER — first department (image left, text right)
           ===================================================== */
        .department-banner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .department-banner-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
        }

        .department-banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .department-banner-image-wrap:hover .department-banner-image {
          transform: scale(1.04);
        }

        .department-banner-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #f5e6e9, #ecd2d8);
          color: #A51C30;
          font-size: 3rem;
        }

        .department-banner-text {
          display: flex;
          flex-direction: column;
        }

        .department-banner-category {
          font-size: 0.75rem;
          color: #A51C30;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 0.5rem;
        }

        .department-banner-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.15;
          margin: 0 0 1rem;
        }

        .department-banner-desc {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--color-text-muted);
          margin: 0 0 1.5rem;
        }

        .department-banner-cta {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          background: #A51C30;
          color: #fff;
          padding: 0.65rem 1.6rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .department-banner-cta:hover {
          background: #7A1523;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(165, 28, 48, 0.3);
        }

        /* =====================================================
           ALTERNATING ROWS
           ===================================================== */
        .department-alternating-list {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .department-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        /* reversed → image goes to the right */
        .department-row-reversed {
          direction: rtl;
        }

        .department-row-reversed > * {
          direction: ltr;
        }

        .department-row-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.1);
        }

        .department-row-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .department-row-image-wrap:hover .department-row-image {
          transform: scale(1.04);
        }

        .department-row-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #f5e6e9, #ecd2d8);
          color: #A51C30;
          font-size: 2.5rem;
        }

        .department-row-text {
          display: flex;
          flex-direction: column;
        }

        .department-row-category {
          font-size: 0.7rem;
          color: #A51C30;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          margin-bottom: 0.4rem;
        }

        .department-row-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(1.35rem, 2.2vw, 1.85rem);
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.2;
          margin: 0 0 0.8rem;
        }

        .department-row-desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-text-muted);
          margin: 0 0 1.25rem;
        }

        .department-row-cta {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          color: #A51C30;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .department-row-cta i {
          transition: transform 0.3s ease;
        }

        .department-row-cta:hover {
          color: #7A1523;
        }

        .department-row-cta:hover i {
          transform: translateX(4px);
        }

        /* =====================================================
           TABLET — slightly smaller gap & text
           ===================================================== */
        @media (max-width: 991.98px) {
          .department-banner,
          .department-row {
            gap: 1.75rem;
          }

          .department-alternating-list {
            gap: 3rem;
          }

          .department-banner-title {
            font-size: 1.65rem;
          }

          .department-row-title {
            font-size: 1.25rem;
          }

          .department-banner-desc,
          .department-row-desc {
            font-size: 0.9rem;
            line-height: 1.65;
          }
        }

        /* =====================================================
           MOBILE — SAME LAYOUT, JUST SMALLER
           Two columns preserved so the alternating effect
           stays exactly like desktop.
           ===================================================== */
        @media (max-width: 767.98px) {
          .department-banner,
          .department-row {
            gap: 0.85rem;
          }

          .department-alternating-list {
            gap: 1.75rem;
          }

          /* Keep aspect ratio a bit wider so the smaller
             image still reads clearly. */
          .department-banner-image-wrap,
          .department-row-image-wrap {
            aspect-ratio: 4 / 3;
            border-radius: 12px;
          }

          /* Smaller banner text */
          .department-banner-category {
            font-size: 0.6rem;
            letter-spacing: 1px;
            margin-bottom: 0.25rem;
          }

          .department-banner-title {
            font-size: 1rem;
            line-height: 1.2;
            margin: 0 0 0.45rem;
          }

          .department-banner-desc {
            font-size: 0.72rem;
            line-height: 1.5;
            margin: 0 0 0.75rem;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .department-banner-cta {
            padding: 0.4rem 0.9rem;
            font-size: 0.7rem;
            border-radius: 30px;
          }

          /* Smaller row text */
          .department-row-category {
            font-size: 0.58rem;
            letter-spacing: 0.9px;
            margin-bottom: 0.2rem;
          }

          .department-row-title {
            font-size: 0.95rem;
            line-height: 1.2;
            margin: 0 0 0.35rem;
          }

          .department-row-desc {
            font-size: 0.7rem;
            line-height: 1.5;
            margin: 0 0 0.6rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .department-row-cta {
            font-size: 0.7rem;
          }

          .department-row-cta i {
            font-size: 0.7rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .department-banner-image,
          .department-row-image,
          .department-row-cta i {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default DepartmentsSection;
