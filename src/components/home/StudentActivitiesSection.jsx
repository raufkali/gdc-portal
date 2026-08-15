import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

/*
|--------------------------------------------------------------------------
| Cache
|--------------------------------------------------------------------------
*/

let cachedActivities = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/*
|--------------------------------------------------------------------------
| Student Activities / News Section
|--------------------------------------------------------------------------
*/

const StudentActivitiesSection = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Fetch Activities
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    const processActivities = (data) => {
      if (!isMounted) return;

      setActivities(data);
    };

    const fetchActivities = async () => {
      /*
      |--------------------------------------------------------------------------
      | Use Cache
      |--------------------------------------------------------------------------
      */

      if (
        cachedActivities &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        processActivities(cachedActivities);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, "studentActivities"));

        const data = snap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);

            return dateB - dateA;
          });

        /*
        |--------------------------------------------------------------------------
        | Update Cache
        |--------------------------------------------------------------------------
        */

        cachedActivities = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setActivities(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching student activities:", error);

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section
        className="py-5"
        style={{
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="container">
          <div className="news-loading" aria-label="Loading activities">
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
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (!activities.length) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Date Formatter
  |--------------------------------------------------------------------------
  */

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const featuredActivity = activities[0];

  const secondaryActivities = activities.slice(1, 3);

  const latestActivities = activities.slice(1, 6);

  const bottomActivities = activities.slice(6, 10);

  /*
  |--------------------------------------------------------------------------
  | Safe Image Component
  |--------------------------------------------------------------------------
  */

  const ActivityImage = ({ activity, className = "", style = {} }) => {
    if (!activity?.imageUrl) {
      return (
        <div
          className={`activity-image-placeholder ${className}`}
          style={style}
        >
          <i className="bi bi-image"></i>
        </div>
      );
    }

    return (
      <img
        src={activity.imageUrl}
        alt={activity.title || "Student activity"}
        className={className}
        style={style}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement.classList.add("image-failed");
        }}
      />
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="student-news-section py-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
      }}
    >
      <div className="container">
        {/* ================================================================
            SECTION HEADER
        ================================================================= */}

        <div className="section-heading mb-4">
          <div>
            <span className="section-kicker">Campus Updates</span>

            <h2 className="section-title">
              Student <span>Activities</span>
            </h2>
          </div>

          <Link to="/student-activities" className="view-all-link">
            View All
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {/* ================================================================
            TOP NEWS GRID
        ================================================================= */}

        <div className="news-layout">
          {/* ==============================================================
              FEATURED STORY
          =============================================================== */}

          <article className="featured-story shadow-sm bg-white ">
            <Link to="/student-activities" className="story-image-link">
              <div className="featured-image-wrapper">
                <ActivityImage
                  activity={featuredActivity}
                  className="featured-image"
                />

                <div className="image-overlay"></div>

                <span className="featured-badge">Featured</span>

                <div className="featured-content">
                  {featuredActivity.organizer && (
                    <span className="story-category">
                      {featuredActivity.organizer}
                    </span>
                  )}

                  <h3>{featuredActivity.title}</h3>

                  <div className="story-meta">
                    {featuredActivity.date && (
                      <span>
                        <i className="bi bi-calendar3"></i>
                        {formatDate(featuredActivity.date)}
                      </span>
                    )}

                    {featuredActivity.location && (
                      <span>
                        <i className="bi bi-geo-alt"></i>
                        {featuredActivity.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {featuredActivity.description && (
              <p className="featured-description px-3">
                {featuredActivity.description}
              </p>
            )}
          </article>

          {/* ==============================================================
              SECONDARY STORIES
          =============================================================== */}

          <div className="secondary-stories">
            {secondaryActivities.map((activity, index) => (
              <article className="secondary-story" key={activity.id}>
                <Link to="/student-activities" className="secondary-image-link">
                  <div className="secondary-image-wrapper">
                    <ActivityImage
                      activity={activity}
                      className="secondary-image"
                    />

                    <span className="small-category">
                      {activity.organizer || "Campus"}
                    </span>
                  </div>
                </Link>

                <div className="secondary-content">
                  <h3>
                    <Link to="/student-activities">{activity.title}</Link>
                  </h3>

                  <div className="small-meta">
                    {activity.date && (
                      <span>
                        <i className="bi bi-calendar3"></i>
                        {formatDate(activity.date)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ==============================================================
              LATEST ACTIVITIES SIDEBAR
          =============================================================== */}

          <aside className="latest-sidebar">
            <div className="sidebar-heading">
              <div>
                <span className="sidebar-kicker">Campus</span>

                <h3>Latest Activities</h3>
              </div>

              <Link to="/student-activities">View All</Link>
            </div>

            <div className="latest-list">
              {latestActivities.map((activity, index) => (
                <Link
                  to="/student-activities"
                  className="latest-item"
                  key={activity.id}
                >
                  <div className="latest-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="latest-thumb">
                    <ActivityImage
                      activity={activity}
                      className="latest-image"
                    />
                  </div>

                  <div className="latest-content">
                    <h4>{activity.title}</h4>

                    <div className="latest-meta">
                      {activity.date && (
                        <>
                          <i className="bi bi-calendar3"></i>
                          {formatDate(activity.date)}
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* ================================================================
            MORE ACTIVITIES
        ================================================================= */}

        {bottomActivities.length > 0 && (
          <div className="more-section">
            <div className="more-section-heading">
              <div>
                <span>More From Campus</span>

                <h3>More Activities</h3>
              </div>

              <Link to="/student-activities">
                View All
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="more-grid">
              {bottomActivities.map((activity) => (
                <article className="more-card" key={activity.id}>
                  <Link to="/student-activities" className="more-card-image">
                    <ActivityImage activity={activity} className="more-image" />

                    <span className="more-category">
                      {activity.organizer || "Campus"}
                    </span>
                  </Link>

                  <div className="more-card-body">
                    <h4>
                      <Link to="/student-activities">{activity.title}</Link>
                    </h4>

                    {activity.description && <p>{activity.description}</p>}

                    <div className="more-meta">
                      {activity.date && (
                        <span>
                          <i className="bi bi-calendar3"></i>
                          {formatDate(activity.date)}
                        </span>
                      )}

                      {activity.location && (
                        <span>
                          <i className="bi bi-geo-alt"></i>
                          {activity.location}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            MOBILE VIEW ALL
        ================================================================= */}

        <div className="mobile-view-all">
          <Link to="/student-activities">
            View All Activities
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* ==================================================================
          COMPONENT STYLES
      =================================================================== */}

      <style>{`

        /* ================================================================
           LOADING
        ================================================================= */

        .news-loading {
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }


        /* ================================================================
           SECTION HEADER
        ================================================================= */

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(128, 128, 128, 0.18);
          padding-bottom: 15px;
        }

        .section-kicker {
          display: block;
          color: #A51C30;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .section-title {
          margin: 0;
          color: var(--color-text);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.65rem, 3vw, 2.35rem);
          line-height: 1.1;
          font-weight: 700;
        }

        .section-title span {
          color: #A51C30;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--color-text);
          text-decoration: none;
          font-size: 0.76rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.25s ease;
        }

        .view-all-link:hover {
          color: #A51C30;
        }

        .view-all-link i {
          font-size: 0.85rem;
          transition: transform 0.25s ease;
        }

        .view-all-link:hover i {
          transform: translateX(4px);
        }


        /* ================================================================
           MAIN NEWS LAYOUT
        ================================================================= */

        .news-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(190px, 0.85fr) minmax(250px, 0.95fr);
          gap: 14px;
          align-items: stretch;
        }


        /* ================================================================
           FEATURED STORY
        ================================================================= */

        .featured-story {
          min-width: 0;
        }

        .story-image-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .featured-image-wrapper {
          position: relative;
          width: 100%;
          height: 410px;
          overflow: hidden;
          background: var(--card-bg);
        }

        .featured-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.55s ease;
        }

        .featured-story:hover .featured-image {
          transform: scale(1.04);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.86) 0%,
              rgba(0, 0, 0, 0.48) 38%,
              rgba(0, 0, 0, 0.05) 72%,
              rgba(0, 0, 0, 0) 100%
            );
          pointer-events: none;
        }

        .featured-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          background: #A51C30;
          color: #fff;
          padding: 4px 10px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .featured-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 20px;
          color: #fff;
        }

        .story-category {
          display: inline-block;
          color: #fff;
          background: #A51C30;
          padding: 3px 8px;
          margin-bottom: 8px;
          font-size: 0.59rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .featured-content h3 {
          margin: 0 0 9px;
          color: #fff;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.35rem, 2.5vw, 2rem);
          font-weight: 700;
          line-height: 1.14;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .story-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.67rem;
          color: rgba(255, 255, 255, 0.82);
        }

        .story-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .story-meta i {
          color: #fff;
        }

        .featured-description {
          margin: 10px 0 0;
          color: var(--color-text-muted);
          font-size: 0.82rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }


        /* ================================================================
           SECONDARY STORIES
        ================================================================= */

        .secondary-stories {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 14px;
          min-width: 0;
        }

        .secondary-story {
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: var(--card-bg);
          overflow: hidden;
        }

        .secondary-image-link {
          display: block;
          text-decoration: none;
        }

        .secondary-image-wrapper {
          position: relative;
          height: 185px;
          overflow: hidden;
          background: var(--color-bg-alt);
        }

        .secondary-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }

        .secondary-story:hover .secondary-image {
          transform: scale(1.05);
        }

        .small-category {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: #A51C30;
          color: #fff;
          padding: 3px 7px;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .secondary-content {
          padding: 10px 11px 11px;
        }

        .secondary-content h3 {
          margin: 0 0 7px;
          font-size: 0.91rem;
          line-height: 1.3;
          font-weight: 700;
        }

        .secondary-content h3 a {
          color: var(--color-text);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .secondary-content h3 a:hover {
          color: #A51C30;
        }

        .small-meta {
          color: var(--color-text-muted);
          font-size: 0.62rem;
        }

        .small-meta i {
          margin-right: 4px;
          color: #A51C30;
        }


        /* ================================================================
           LATEST SIDEBAR
        ================================================================= */

        .latest-sidebar {
          min-width: 0;
          border: 1px solid rgba(128, 128, 128, 0.17);
          background: var(--card-bg);
        }

        .sidebar-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          padding: 13px 13px 11px;
          border-bottom: 2px solid #A51C30;
        }

        .sidebar-kicker {
          display: block;
          color: #A51C30;
          font-size: 0.54rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sidebar-heading h3 {
          margin: 1px 0 0;
          color: var(--color-text);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
        }

        .sidebar-heading > a {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.58rem;
          white-space: nowrap;
        }

        .sidebar-heading > a:hover {
          color: #A51C30;
        }

        .latest-list {
          display: flex;
          flex-direction: column;
        }

        .latest-item {
          display: grid;
          grid-template-columns: 20px 65px minmax(0, 1fr);
          gap: 8px;
          align-items: center;
          padding: 10px 11px;
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(128, 128, 128, 0.13);
          transition: background 0.2s ease;
        }

        .latest-item:last-child {
          border-bottom: none;
        }

        .latest-item:hover {
          background: rgba(128, 128, 128, 0.05);
        }

        .latest-number {
          color: #A51C30;
          font-size: 0.67rem;
          font-weight: 800;
        }

        .latest-thumb {
          width: 65px;
          height: 52px;
          overflow: hidden;
          background: var(--color-bg-alt);
        }

        .latest-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .latest-item:hover .latest-image {
          transform: scale(1.07);
        }

        .latest-content {
          min-width: 0;
        }

        .latest-content h4 {
          margin: 0 0 5px;
          color: var(--color-text);
          font-size: 0.71rem;
          line-height: 1.32;
          font-weight: 700;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .latest-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--color-text-muted);
          font-size: 0.55rem;
        }

        .latest-meta i {
          color: #A51C30;
        }


        /* ================================================================
           IMAGE PLACEHOLDER
        ================================================================= */

        .activity-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              rgba(165, 28, 48, 0.08),
              rgba(128, 128, 128, 0.08)
            );
          color: rgba(128, 128, 128, 0.55);
        }

        .activity-image-placeholder i {
          font-size: 1.8rem;
        }

        .image-failed {
          background:
            linear-gradient(
              135deg,
              rgba(165, 28, 48, 0.08),
              rgba(128, 128, 128, 0.08)
            );
        }


        /* ================================================================
           ADVERTISEMENT
        ================================================================= */

        .advertisement-banner {
          position: relative;
          min-height: 115px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              rgba(165, 28, 48, 0.96),
              rgba(122, 21, 35, 0.96)
            );
          color: #fff;
        }

        .advertisement-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 18px,
              rgba(255,255,255,0.7) 18px,
              rgba(255,255,255,0.7) 20px
            );
        }

        .advertisement-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 20px 100px;
        }

        .advertisement-label {
          display: block;
          margin-bottom: 2px;
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .advertisement-content h3 {
          margin: 0;
          color: #fff;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.45rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .advertisement-content p {
          margin: 4px 0 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.68rem;
        }

        .advertisement-size {
          position: absolute;
          right: 13px;
          bottom: 8px;
          z-index: 2;
          color: rgba(255,255,255,0.65);
          font-size: 0.5rem;
        }


        /* ================================================================
           MORE ACTIVITIES
        ================================================================= */

        .more-section {
          margin-top: 30px;
        }

        .more-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 13px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(128, 128, 128, 0.18);
        }

        .more-section-heading span {
          display: block;
          color: #A51C30;
          font-size: 0.57rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .more-section-heading h3 {
          margin: 2px 0 0;
          color: var(--color-text);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 700;
        }

        .more-section-heading > a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.66rem;
          font-weight: 600;
        }

        .more-section-heading > a:hover {
          color: #A51C30;
        }

        .more-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .more-card {
          min-width: 0;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid rgba(128, 128, 128, 0.12);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .more-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        .more-card-image {
          position: relative;
          display: block;
          height: 150px;
          overflow: hidden;
          text-decoration: none;
          background: var(--color-bg-alt);
        }

        .more-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .more-card:hover .more-image {
          transform: scale(1.05);
        }

        .more-category {
          position: absolute;
          left: 8px;
          bottom: 8px;
          background: #A51C30;
          color: #fff;
          padding: 3px 7px;
          font-size: 0.53rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .more-card-body {
          padding: 11px;
        }

        .more-card-body h4 {
          margin: 0 0 6px;
          font-size: 0.83rem;
          line-height: 1.3;
          font-weight: 700;
        }

        .more-card-body h4 a {
          color: var(--color-text);
          text-decoration: none;
        }

        .more-card-body h4 a:hover {
          color: #A51C30;
        }

        .more-card-body p {
          margin: 0 0 8px;
          color: var(--color-text-muted);
          font-size: 0.68rem;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .more-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          color: var(--color-text-muted);
          font-size: 0.55rem;
        }

        .more-meta span {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .more-meta i {
          color: #A51C30;
        }


        /* ================================================================
           MOBILE VIEW ALL
        ================================================================= */

        .mobile-view-all {
          display: none;
          text-align: center;
          margin-top: 25px;
        }

        .mobile-view-all a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border: 1px solid #A51C30;
          color: #A51C30;
          text-decoration: none;
          font-size: 0.76rem;
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .mobile-view-all a:hover {
          background: #A51C30;
          color: #fff;
        }


        /* ================================================================
           LARGE TABLET
        ================================================================= */

        @media (max-width: 1100px) {

          .news-layout {
            grid-template-columns:
              minmax(0, 1.5fr)
              minmax(180px, 0.8fr)
              minmax(220px, 0.85fr);
          }

          .featured-image-wrapper {
            height: 380px;
          }

          .secondary-image-wrapper {
            height: 168px;
          }

          .latest-item {
            grid-template-columns: 18px 58px minmax(0, 1fr);
            gap: 7px;
            padding: 9px;
          }

          .latest-thumb {
            width: 58px;
            height: 48px;
          }

          .latest-content h4 {
            font-size: 0.67rem;
          }

          .more-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

        }


        /* ================================================================
           TABLET
        ================================================================= */

        @media (max-width: 850px) {

          .news-layout {
            grid-template-columns:
              minmax(0, 1.5fr)
              minmax(180px, 0.9fr);
          }

          .latest-sidebar {
            grid-column: 1 / -1;
          }

          .latest-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .latest-item:nth-child(odd) {
            border-right: 1px solid rgba(128,128,128,0.13);
          }

          .latest-item:last-child {
            border-bottom: none;
          }

          .featured-image-wrapper {
            height: 390px;
          }

          .secondary-image-wrapper {
            height: 178px;
          }

        }


        /* ================================================================
           MOBILE
        ================================================================= */

        @media (max-width: 767px) {

          .student-news-section {
            padding-top: 35px !important;
            padding-bottom: 35px !important;
          }

          .section-heading {
            align-items: center;
            margin-bottom: 15px !important;
          }

          .section-kicker {
            font-size: 0.58rem;
          }

          .section-title {
            font-size: 1.55rem;
          }

          .section-heading > .view-all-link {
            display: none;
          }

          .news-layout {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .featured-image-wrapper {
            height: 330px;
          }

          .featured-content {
            padding: 15px;
          }

          .featured-content h3 {
            font-size: 1.35rem;
            -webkit-line-clamp: 3;
          }

          .featured-description {
            font-size: 0.76rem;
            margin-top: 8px;
          }


          /* Secondary stories become horizontal cards */

          .secondary-stories {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .secondary-story {
            display: grid;
            grid-template-columns: 125px minmax(0, 1fr);
            min-height: 100px;
          }

          .secondary-image-wrapper {
            height: 100%;
            min-height: 100px;
          }

          .secondary-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 10px 12px;
          }

          .secondary-content h3 {
            font-size: 0.82rem;
            margin-bottom: 6px;
          }


          /* Latest */

          .latest-sidebar {
            width: 100%;
          }

          .latest-list {
            display: flex;
          }

          .latest-item {
            grid-template-columns: 20px 70px minmax(0, 1fr);
            padding: 10px;
            border-right: none !important;
          }

          .latest-thumb {
            width: 70px;
            height: 55px;
          }

          .latest-content h4 {
            font-size: 0.75rem;
          }


          /* Advertisement */

          .advertisement-banner {
            min-height: 130px;
          }

          .advertisement-content {
            padding: 20px 25px;
          }

          .advertisement-content h3 {
            font-size: 1.35rem;
          }

          .advertisement-content p {
            font-size: 0.62rem;
          }


          /* More */

          .more-section {
            margin-top: 25px;
          }

          .more-section-heading {
            align-items: center;
          }

          .more-section-heading > a {
            display: none;
          }

          .more-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .more-card {
            display: grid;
            grid-template-columns: 115px minmax(0, 1fr);
          }

          .more-card-image {
            height: 100%;
            min-height: 120px;
          }

          .more-card-body {
            padding: 10px;
          }

          .more-card-body h4 {
            font-size: 0.78rem;
          }

          .more-card-body p {
            font-size: 0.62rem;
          }

          .mobile-view-all {
            display: block;
          }

        }


        /* ================================================================
           SMALL MOBILE
        ================================================================= */

        @media (max-width: 480px) {

          .featured-image-wrapper {
            height: 285px;
          }

          .featured-content h3 {
            font-size: 1.2rem;
          }

          .story-meta {
            gap: 8px;
            font-size: 0.59rem;
          }

          .secondary-story {
            grid-template-columns: 105px minmax(0, 1fr);
          }

          .latest-item {
            grid-template-columns: 17px 62px minmax(0, 1fr);
            gap: 7px;
          }

          .latest-thumb {
            width: 62px;
            height: 50px;
          }

          .latest-content h4 {
            font-size: 0.69rem;
          }

          .advertisement-content h3 {
            font-size: 1.15rem;
          }

          .advertisement-content p {
            display: none;
          }

          .more-card {
            grid-template-columns: 100px minmax(0, 1fr);
          }

          .more-card-image {
            min-height: 105px;
          }

        }

      `}</style>
    </section>
  );
};

export default StudentActivitiesSection;
