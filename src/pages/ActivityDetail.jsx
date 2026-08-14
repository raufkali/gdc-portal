// ActivityDetail.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

// Cache for activity details
const cachedActivities = {};
const CACHE_TTL = 10 * 60 * 1000;

const ActivityDetail = () => {
  const { slug } = useParams();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      const cacheKey = slug;

      // Check cache
      if (
        cachedActivities[cacheKey] &&
        cachedActivities[cacheKey].timestamp &&
        Date.now() - cachedActivities[cacheKey].timestamp < CACHE_TTL
      ) {
        setActivity(cachedActivities[cacheKey].data);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("activities");

        const found = data.find((a) => a.slug === slug || a.id === slug);

        if (found) {
          cachedActivities[cacheKey] = {
            data: found,
            timestamp: Date.now(),
          };

          setActivity(found);
          setFromCache(false);
        } else {
          setActivity(null);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);

        // Use stale cache if available
        if (cachedActivities[cacheKey]) {
          setActivity(cachedActivities[cacheKey].data);
          setFromCache(true);
        } else {
          setActivity(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!activity) {
    return (
      <div
        className="activity-detail-page"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          minHeight: "100vh",
        }}
      >
        <div
          className="container py-5"
          style={{
            paddingTop: "9rem",
            paddingBottom: "5rem",
          }}
        >
          <div className="activity-not-found text-center">
            <div className="not-found-icon">
              <i className="bi bi-calendar-x"></i>
            </div>

            <span className="section-label">Campus Life</span>

            <h1>
              Activity <span>Not Found</span>
            </h1>

            <p>
              The activity you're looking for may have been removed or the link
              may be incorrect.
            </p>

            <Link to="/activities" className="back-button">
              <i className="bi bi-arrow-left"></i>
              Back to Activities
            </Link>
          </div>
        </div>

        <style>{`
          .activity-detail-page {
            color: var(--color-text);
          }

          .activity-not-found {
            max-width: 650px;
            margin: 0 auto;
          }

          .not-found-icon {
            width: 90px;
            height: 90px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            background: rgba(165, 28, 48, 0.08);
            color: #A51C30;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
          }

          .section-label {
            display: inline-block;
            color: #A51C30;
            background: rgba(165, 28, 48, 0.08);
            padding: 0.4rem 1.4rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 0.75rem;
          }

          .activity-not-found h1 {
            font-family: "Playfair Display", Georgia, serif;
            font-weight: 700;
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 0.75rem;
          }

          .activity-not-found h1 span {
            color: #A51C30;
          }

          .activity-not-found p {
            color: var(--color-text-muted);
            max-width: 520px;
            margin: 0 auto 1.75rem;
            line-height: 1.8;
          }

          .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.65rem 1.5rem;
            border-radius: 50px;
            background: #A51C30;
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .back-button:hover {
            background: #7A1523;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(165, 28, 48, 0.25);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="activity-detail-page"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: "7rem",
          paddingBottom: "5rem",
        }}
      >
        {/* =========================================
            TOP NAVIGATION
        ========================================= */}

        <div className="activity-topbar">
          <Link to="/activities" className="back-link">
            <i className="bi bi-arrow-left"></i>
            Back to Activities
          </Link>

          {fromCache && process.env.NODE_ENV === "development" && (
            <span className="cache-badge">
              <i className="bi bi-lightning-charge-fill"></i>
              Cached
            </span>
          )}
        </div>

        {/* =========================================
            ARTICLE
        ========================================= */}

        <article className="activity-article">
          {/* HERO IMAGE */}

          {activity.imageUrl && (
            <div className="activity-hero">
              <img
                src={activity.imageUrl}
                alt={activity.title}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add("image-fallback");
                }}
              />

              <div className="hero-gradient"></div>

              {/* Date badge */}

              {activity.date && (
                <div className="hero-date">
                  <i className="bi bi-calendar3"></i>
                  {formatDate(activity.date)}
                </div>
              )}
            </div>
          )}

          {/* ARTICLE BODY */}

          <div className="activity-body">
            {/* CATEGORY */}

            <span className="section-label">Campus Life</span>

            {/* TITLE */}

            <h1 className="activity-title">{activity.title}</h1>

            {/* META */}

            <div className="activity-meta">
              {activity.date && (
                <span>
                  <i className="bi bi-calendar3"></i>
                  {formatDate(activity.date)}
                </span>
              )}

              {activity.author && (
                <>
                  <span className="meta-divider"></span>

                  <span>
                    <i className="bi bi-person-circle"></i>
                    {activity.author}
                  </span>
                </>
              )}
            </div>

            <div className="title-divider"></div>

            {/* CONTENT */}

            <div className="activity-content">{activity.content}</div>

            {/* AUTHOR */}

            {activity.author && (
              <div className="author-box">
                <div className="author-icon">
                  <i className="bi bi-person"></i>
                </div>

                <div>
                  <span className="author-label">Written by</span>

                  <strong>{activity.author}</strong>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* =========================================
            BOTTOM NAVIGATION
        ========================================= */}

        <div className="article-footer">
          <Link to="/activities" className="all-activities-button">
            <i className="bi bi-grid-3x3-gap"></i>
            View All Activities
          </Link>
        </div>
      </div>

      {/* =========================================
          STYLES
      ========================================= */}

      <style>{`
        /* ========================================
           PAGE
        ======================================== */

        .activity-detail-page {
          color: var(--color-text);
        }

        /* ========================================
           TOP BAR
        ======================================== */

        .activity-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;

          color: var(--color-text-muted);

          text-decoration: none;

          font-size: 0.9rem;
          font-weight: 500;

          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #A51C30;
          transform: translateX(-3px);
        }

        .back-link i {
          font-size: 1rem;
        }

        .cache-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;

          color: #28a745;
          background: rgba(40, 167, 69, 0.08);

          padding: 0.25rem 0.8rem;

          border-radius: 50px;

          font-size: 0.65rem;
        }

        /* ========================================
           ARTICLE CARD
        ======================================== */

        .activity-article {
          max-width: 1000px;
          margin: 0 auto;

          background: var(--card-bg);

          border-radius: 20px;

          overflow: hidden;

          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.06);

          border:
            1px solid
            rgba(0, 0, 0, 0.04);
        }

        /* ========================================
           HERO
        ======================================== */

        .activity-hero {
          position: relative;

          width: 100%;
          height: 450px;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #f8f9fa,
              #e9ecef
            );
        }

        .activity-hero img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          transition:
            transform 0.6s ease;
        }

        .activity-article:hover .activity-hero img {
          transform: scale(1.015);
        }

        .hero-gradient {
          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.45),
              transparent 45%
            );

          pointer-events: none;
        }

        .hero-date {
          position: absolute;

          bottom: 1.5rem;
          left: 1.5rem;

          display: inline-flex;
          align-items: center;
          gap: 0.5rem;

          padding:
            0.45rem
            1rem;

          border-radius: 50px;

          background:
            rgba(165, 28, 48, 0.95);

          color: #fff;

          font-size: 0.8rem;

          font-weight: 500;

          backdrop-filter: blur(8px);

          box-shadow:
            0 5px 15px
            rgba(0, 0, 0, 0.15);
        }

        .image-fallback {
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              145deg,
              #f8f9fa,
              #e9ecef
            );
        }

        .image-fallback::after {
          content: "\\F4DA";

          font-family:
            "bootstrap-icons";

          font-size: 4rem;

          color: #adb5bd;
        }

        /* ========================================
           BODY
        ======================================== */

        .activity-body {
          padding:
            3rem
            4rem
            3.5rem;
        }

        .section-label {
          display: inline-block;

          color: #A51C30;

          background:
            rgba(165, 28, 48, 0.08);

          padding:
            0.4rem
            1.4rem;

          border-radius: 50px;

          font-size: 0.8rem;

          font-weight: 600;

          letter-spacing: 2px;

          text-transform: uppercase;

          margin-bottom: 1rem;
        }

        /* ========================================
           TITLE
        ======================================== */

        .activity-title {
          font-family:
            "Playfair Display",
            Georgia,
            serif;

          font-size:
            clamp(2rem, 4vw, 3.2rem);

          line-height: 1.2;

          font-weight: 700;

          color: var(--color-text);

          margin: 0 0 1rem;

          max-width: 850px;
        }

        /* ========================================
           META
        ======================================== */

        .activity-meta {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 0.75rem;

          color: var(--color-text-muted);

          font-size: 0.85rem;
        }

        .activity-meta span {
          display: inline-flex;

          align-items: center;

          gap: 0.4rem;
        }

        .activity-meta i {
          color: #A51C30;
        }

        .meta-divider {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #adb5bd;
        }

        .title-divider {
          width: 60px;
          height: 3px;

          background: #A51C30;

          border-radius: 3px;

          margin:
            1.5rem
            0
            2rem;
        }

        /* ========================================
           CONTENT
        ======================================== */

        .activity-content {
          color: var(--color-text);

          font-size: 1.05rem;

          line-height: 2;

          white-space: pre-line;

          max-width: 850px;
        }

        /* ========================================
           AUTHOR
        ======================================== */

        .author-box {
          display: inline-flex;

          align-items: center;

          gap: 0.75rem;

          margin-top: 2.5rem;

          padding:
            0.75rem
            1.2rem;

          border-radius: 12px;

          background:
            var(--color-bg-alt);

          border:
            1px solid
            var(--color-border);
        }

        .author-icon {
          width: 38px;
          height: 38px;

          border-radius: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            rgba(165, 28, 48, 0.1);

          color: #A51C30;
        }

        .author-box div:last-child {
          display: flex;
          flex-direction: column;
        }

        .author-label {
          color: var(--color-text-muted);

          font-size: 0.65rem;

          text-transform: uppercase;

          letter-spacing: 1px;
        }

        .author-box strong {
          color: var(--color-text);

          font-size: 0.85rem;

          font-weight: 600;
        }

        /* ========================================
           FOOTER
        ======================================== */

        .article-footer {
          display: flex;

          justify-content: center;

          margin-top: 2rem;
        }

        .all-activities-button {
          display: inline-flex;

          align-items: center;

          gap: 0.5rem;

          padding:
            0.7rem
            1.8rem;

          border-radius: 50px;

          border:
            2px solid
            #A51C30;

          color: #A51C30;

          background: transparent;

          text-decoration: none;

          font-size: 0.9rem;

          font-weight: 600;

          transition: all 0.3s ease;
        }

        .all-activities-button:hover {
          background: #A51C30;

          color: #fff;

          transform: translateY(-3px);

          box-shadow:
            0 8px 25px
            rgba(165, 28, 48, 0.25);
        }

        /* ========================================
           TABLET
        ======================================== */

        @media (max-width: 768px) {
          .activity-detail-page > .container {
            padding-top: 6rem !important;
          }

          .activity-article {
            border-radius: 16px;
          }

          .activity-hero {
            height: 330px;
          }

          .activity-body {
            padding:
              2rem
              1.5rem
              2.5rem;
          }

          .activity-title {
            font-size: clamp(1.8rem, 7vw, 2.5rem);
          }

          .activity-content {
            font-size: 1rem;
            line-height: 1.85;
          }
        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 500px) {
          .activity-detail-page > .container {
            padding-top: 5.5rem !important;
            padding-bottom: 3rem !important;
          }

          .activity-topbar {
            margin-bottom: 1rem;
          }

          .back-link {
            font-size: 0.8rem;
          }

          .activity-article {
            border-radius: 14px;
          }

          .activity-hero {
            height: 250px;
          }

          .hero-date {
            left: 1rem;
            bottom: 1rem;

            font-size: 0.7rem;

            padding:
              0.4rem
              0.8rem;
          }

          .activity-body {
            padding:
              1.75rem
              1.2rem
              2rem;
          }

          .section-label {
            font-size: 0.7rem;

            padding:
              0.35rem
              1rem;

            letter-spacing: 1.5px;
          }

          .activity-title {
            font-size: 1.8rem;
          }

          .activity-meta {
            font-size: 0.75rem;
          }

          .activity-content {
            font-size: 0.95rem;

            line-height: 1.8;
          }

          .author-box {
            margin-top: 2rem;

            width: 100%;
          }

          .all-activities-button {
            width: 100%;

            justify-content: center;
          }
        }

        /* ========================================
           REDUCED MOTION
        ======================================== */

        @media (prefers-reduced-motion: reduce) {
          .activity-article,
          .activity-hero img,
          .back-link,
          .all-activities-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityDetail;
