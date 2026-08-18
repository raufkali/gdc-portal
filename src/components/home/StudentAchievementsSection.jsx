import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedAchievements = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

const StudentAchievementsSection = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAchievements = async () => {
      // --------------------------------------------------
      // Fresh cache
      // --------------------------------------------------
      if (
        cachedAchievements &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setAchievements(cachedAchievements.slice(0, 4));
          setLoading(false);
        }

        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "studentAchievements"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Newest first
        data.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;

          return new Date(b.date) - new Date(a.date);
        });

        cachedAchievements = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setAchievements(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching student achievements:", error);

        // Fallback to stale cache
        if (isMounted && cachedAchievements) {
          setAchievements(cachedAchievements.slice(0, 4));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Date formatter
  // --------------------------------------------------
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // --------------------------------------------------
  // Don't render section if there is nothing to show
  // --------------------------------------------------
  if (!loading && !achievements.length) {
    return null;
  }

  return (
    <section
      className="student-achievements-section py-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container py-lg-4">
        {/* ==================================================
            HEADER
        ================================================== */}
        <div className="achievements-section-header" data-aos="fade-up">
          <div>
            <span className="achievements-eyebrow">Student Success</span>

            <h2>
              Latest <span>Achievements</span>
            </h2>

            <p>
              Celebrating the accomplishments, talents, and success stories of
              our students.
            </p>
          </div>

          <Link to="/student-achievements" className="achievements-view-all">
            View All Achievements
            <i className="bi bi-arrow-right" />
          </Link>
        </div>

        {/* ==================================================
            NEWS LIST
        ================================================== */}
        {loading ? (
          <div
            className="achievements-loading"
            aria-label="Loading achievements"
          >
            <div
              className="spinner-border"
              style={{
                color: "#A51C30",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="achievements-news-list">
            {achievements.map((item, index) => {
              const isFeatured = index === 0;

              return (
                <article
                  key={item.id}
                  className={`achievement-news-item ${
                    isFeatured ? "achievement-news-featured" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  {/* ==================================================
                      IMAGE
                  ================================================== */}
                  <div className="achievement-news-image">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={
                          item.studentName ||
                          item.title ||
                          "Student achievement"
                        }
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const fallback = e.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="achievement-news-image-fallback"
                      style={{
                        display: item.imageUrl ? "none" : "flex",
                      }}
                    >
                      <i className="bi bi-trophy" />
                    </div>
                  </div>

                  {/* ==================================================
                      CONTENT
                  ================================================== */}
                  <div className="achievement-news-content">
                    <div className="achievement-news-meta">
                      <span className="achievement-news-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="achievement-news-label">
                        Student Achievement
                      </span>

                      {item.date && (
                        <>
                          <span className="achievement-meta-dot">•</span>

                          <span className="achievement-news-date">
                            <i className="bi bi-calendar3" />
                            {formatDate(item.date)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3>{item.studentName || "GDC Gulabad Student"}</h3>

                    {item.title && (
                      <div className="achievement-news-title">{item.title}</div>
                    )}

                    {item.achievement && (
                      <div className="achievement-news-highlight">
                        <span />

                        <p>{item.achievement}</p>
                      </div>
                    )}

                    {item.description && (
                      <p className="achievement-news-description">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* ==================================================
                      ARROW
                  ================================================== */}
                  <div className="achievement-news-arrow">
                    <i className="bi bi-arrow-up-right" />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ==================================================
            BOTTOM CTA
        ================================================== */}
        {!loading && achievements.length > 0 && (
          <div
            className="achievements-bottom"
            data-aos="fade-up"
            data-aos-delay="350"
          >
            <div className="achievements-bottom-line" />

            <Link
              to="/student-achievements"
              className="achievements-bottom-link"
            >
              Explore all student achievements
              <i className="bi bi-arrow-right" />
            </Link>

            <div className="achievements-bottom-line" />
          </div>
        )}
      </div>

      {/* ================================================================
          STYLES
      ================================================================= */}
      <style>{`

        /* ================================================================
           SECTION HEADER
        ================================================================= */

        .achievements-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .achievements-eyebrow {
          display: inline-flex;
          align-items: center;
          color: #A51C30;
          background: rgba(165, 28, 48, 0.08);
          padding: 0.4rem 1.25rem;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
        }

        .achievements-section-header h2 {
          margin: 0;
          font-family:
            'Playfair Display',
            Georgia,
            serif;
          font-size:
            clamp(2.2rem, 4.5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--color-text);
        }

        .achievements-section-header h2 span {
          color: #A51C30;
        }

        .achievements-section-header p {
          margin:
            0.75rem 0 0;
          max-width: 620px;
          color: var(--color-text-muted);
          font-size: 1rem;
          line-height: 1.7;
        }


        /* ================================================================
           VIEW ALL BUTTON
        ================================================================= */

        .achievements-view-all {
          flex-shrink: 0;

          display: inline-flex;
          align-items: center;
          gap: 0.55rem;

          color: #A51C30;

          font-size: 0.82rem;
          font-weight: 700;

          text-decoration: none;

          padding:
            0.65rem 1.15rem;

          border:
            1px solid
            rgba(165, 28, 48, 0.2);

          border-radius: 50px;

          transition:
            all 0.25s ease;
        }

        .achievements-view-all i {
          transition:
            transform 0.25s ease;
        }

        .achievements-view-all:hover {
          background: #A51C30;
          color: #fff;
          border-color: #A51C30;
        }

        .achievements-view-all:hover i {
          transform: translateX(3px);
        }


        /* ================================================================
           NEWS LIST
        ================================================================= */

        .achievements-news-list {
          max-width: 1100px;
          margin: 0 auto;
        }

        .achievement-news-item {
          position: relative;

          display: grid;

          grid-template-columns:
            170px
            minmax(0, 1fr)
            45px;

          gap: 1.75rem;

          align-items: center;

          padding:
            1.6rem 0;

          border-top:
            1px solid
            var(
              --color-border,
              rgba(0, 0, 0, 0.08)
            );

          transition:
            transform 0.3s ease;
        }

        .achievement-news-item:last-child {
          border-bottom:
            1px solid
            var(
              --color-border,
              rgba(0, 0, 0, 0.08)
            );
        }

        .achievement-news-item:hover {
          transform: translateX(6px);
        }


        /* ================================================================
           FEATURED FIRST ITEM
        ================================================================= */

        .achievement-news-featured {
          grid-template-columns:
            250px
            minmax(0, 1fr)
            45px;

          padding:
            2rem 0;
        }

        .achievement-news-featured
        .achievement-news-image {
          height: 190px;
        }

        .achievement-news-featured
        .achievement-news-content h3 {
          font-size:
            clamp(1.7rem, 3vw, 2.25rem);
        }


        /* ================================================================
           IMAGE
        ================================================================= */

        .achievement-news-image {
          width: 100%;
          height: 120px;

          overflow: hidden;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              rgba(165, 28, 48, 0.12),
              rgba(165, 28, 48, 0.03)
            );
        }

        .achievement-news-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 0.5s ease;
        }

        .achievement-news-item:hover
        .achievement-news-image img {
          transform: scale(1.04);
        }

        .achievement-news-image-fallback {
          width: 100%;
          height: 100%;

          align-items: center;
          justify-content: center;

          color: #A51C30;

          font-size: 2.4rem;
        }


        /* ================================================================
           META
        ================================================================= */

        .achievement-news-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          gap: 0.55rem;

          margin-bottom: 0.55rem;
        }

        .achievement-news-number {
          color: #A51C30;

          font-size: 0.68rem;
          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .achievement-news-label {
          color: #A51C30;

          font-size: 0.67rem;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .achievement-meta-dot {
          color:
            var(--color-text-muted);

          font-size: 0.7rem;
        }

        .achievement-news-date {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;

          color:
            var(--color-text-muted);

          font-size: 0.68rem;
        }


        /* ================================================================
           CONTENT
        ================================================================= */

        .achievement-news-content {
          min-width: 0;
        }

        .achievement-news-content h3 {
          margin: 0;

          color:
            var(--color-text);

          font-family:
            'Playfair Display',
            Georgia,
            serif;

          font-size: 1.45rem;
          font-weight: 700;

          line-height: 1.2;

          overflow-wrap: anywhere;
        }

        .achievement-news-title {
          margin-top: 0.3rem;

          color:
            var(--color-text-muted);

          font-size: 0.75rem;
          font-weight: 600;

          text-transform: uppercase;
          letter-spacing: 0.8px;

          overflow-wrap: anywhere;
        }

        .achievement-news-highlight {
          display: flex;

          align-items: flex-start;

          gap: 0.65rem;

          margin-top: 0.75rem;
        }

        .achievement-news-highlight > span {
          width: 3px;
          min-width: 3px;

          height: 21px;

          margin-top: 2px;

          border-radius: 5px;

          background: #A51C30;
        }

        .achievement-news-highlight p {
          margin: 0;

          color:
            var(--color-text);

          font-size: 0.88rem;
          font-weight: 600;

          line-height: 1.5;

          overflow-wrap: anywhere;
        }

        .achievement-news-description {
          max-width: 700px;

          margin:
            0.55rem 0 0;

          color:
            var(--color-text-muted);

          font-size: 0.8rem;

          line-height: 1.6;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;
        }


        /* ================================================================
           ARROW
        ================================================================= */

        .achievement-news-arrow {
          width: 38px;
          height: 38px;

          border:
            1px solid
            rgba(165, 28, 48, 0.16);

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #A51C30;

          transition:
            all 0.3s ease;
        }

        .achievement-news-item:hover
        .achievement-news-arrow {
          background: #A51C30;
          color: #fff;

          transform:
            translate(2px, -2px);
        }


        /* ================================================================
           BOTTOM
        ================================================================= */

        .achievements-bottom {
          display: flex;

          align-items: center;

          gap: 1.25rem;

          max-width: 800px;

          margin:
            2.5rem auto 0;
        }

        .achievements-bottom-line {
          flex: 1;

          height: 1px;

          background:
            var(
              --color-border,
              rgba(0, 0, 0, 0.08)
            );
        }

        .achievements-bottom-link {
          flex-shrink: 0;

          display: inline-flex;
          align-items: center;

          gap: 0.45rem;

          color: #A51C30;

          font-size: 0.78rem;
          font-weight: 700;

          text-decoration: none;
        }

        .achievements-bottom-link i {
          transition:
            transform 0.25s ease;
        }

        .achievements-bottom-link:hover i {
          transform:
            translateX(4px);
        }


        /* ================================================================
           LOADING
        ================================================================= */

        .achievements-loading {
          min-height: 250px;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        /* ================================================================
           TABLET
        ================================================================= */

        @media (max-width: 991.98px) {

          .achievements-section-header {
            align-items: flex-start;
          }

          .achievement-news-item {
            grid-template-columns:
              140px
              minmax(0, 1fr)
              40px;

            gap: 1.25rem;
          }

          .achievement-news-featured {
            grid-template-columns:
              200px
              minmax(0, 1fr)
              40px;
          }

          .achievement-news-image {
            height: 110px;
          }

          .achievement-news-featured
          .achievement-news-image {
            height: 155px;
          }

          .achievement-news-content h3 {
            font-size: 1.25rem;
          }

          .achievement-news-featured
          .achievement-news-content h3 {
            font-size: 1.7rem;
          }
        }


        /* ================================================================
           MOBILE
        ================================================================= */

        @media (max-width: 767.98px) {

          .student-achievements-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .achievements-section-header {
            display: block;
            margin-bottom: 1.8rem;
          }

          .achievements-section-header h2 {
            font-size: 2.35rem;
          }

          .achievements-section-header p {
            font-size: 0.9rem;
          }

          .achievements-view-all {
            margin-top: 1rem;
          }

          .achievement-news-item,
          .achievement-news-featured {
            grid-template-columns:
              82px
              minmax(0, 1fr);

            gap: 1rem;

            padding: 1.25rem 0;
          }

          .achievement-news-image,
          .achievement-news-featured
          .achievement-news-image {
            width: 82px;
            height: 105px;
          }

          .achievement-news-arrow {
            display: none;
          }

          .achievement-news-content h3,
          .achievement-news-featured
          .achievement-news-content h3 {
            font-size: 1.12rem;
          }

          .achievement-news-label {
            font-size: 0.6rem;
          }

          .achievement-news-number {
            font-size: 0.6rem;
          }

          .achievement-news-date {
            font-size: 0.62rem;
          }

          .achievement-news-title {
            font-size: 0.63rem;
          }

          .achievement-news-highlight {
            margin-top: 0.55rem;
          }

          .achievement-news-highlight p {
            font-size: 0.76rem;
          }

          .achievement-news-description {
            font-size: 0.72rem;
            -webkit-line-clamp: 2;
          }

          .achievements-bottom {
            gap: 0.7rem;
            margin-top: 2rem;
          }

          .achievements-bottom-link {
            font-size: 0.7rem;
            text-align: center;
          }
        }


        /* ================================================================
           SMALL MOBILE
        ================================================================= */

        @media (max-width: 400px) {

          .achievement-news-item,
          .achievement-news-featured {
            grid-template-columns:
              68px
              minmax(0, 1fr);

            gap: 0.75rem;
          }

          .achievement-news-image,
          .achievement-news-featured
          .achievement-news-image {
            width: 68px;
            height: 90px;
          }

          .achievement-news-content h3,
          .achievement-news-featured
          .achievement-news-content h3 {
            font-size: 1rem;
          }

          .achievement-news-highlight p {
            font-size: 0.72rem;
          }

          .achievement-news-description {
            font-size: 0.68rem;
          }

          .achievements-section-header h2 {
            font-size: 2.1rem;
          }
        }

      `}</style>
    </section>
  );
};

export default StudentAchievementsSection;
