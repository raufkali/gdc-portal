import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
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
| Student Activities Page
|--------------------------------------------------------------------------
*/

const StudentActivities = () => {
  const hasValidCache = () =>
    cachedActivities &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_TTL;

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [activities, setActivities] = useState(() =>
    hasValidCache() ? cachedActivities : [],
  );

  const [loading, setLoading] = useState(() => !hasValidCache());

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [sortOrder, setSortOrder] = useState("newest");

  /*
  |--------------------------------------------------------------------------
  | Fetch Activities
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      /*
      |--------------------------------------------------------------------------
      | Cached Data
      |--------------------------------------------------------------------------
      */

      if (hasValidCache()) {
        if (isMounted) {
          setActivities(cachedActivities);
          setLoading(false);
        }

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
        | Cache
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
          if (cachedActivities?.length) {
            setActivities(cachedActivities);
          }

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
  | Format Date
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
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  |
  | Uses organizer as the category because your existing documents already
  | contain organizer. If you later add a dedicated "category" field,
  | simply replace activity.organizer with activity.category.
  |
  */

  const categories = useMemo(() => {
    const values = activities
      .map((activity) => activity.organizer)
      .filter(Boolean)
      .map((value) => value.trim());

    return ["All", ...new Set(values)];
  }, [activities]);

  /*
  |--------------------------------------------------------------------------
  | Filter + Search + Sort
  |--------------------------------------------------------------------------
  */

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((activity) => {
        const title = activity.title?.toLowerCase() || "";

        const description = activity.description?.toLowerCase() || "";

        const location = activity.location?.toLowerCase() || "";

        const organizer = activity.organizer?.toLowerCase() || "";

        return (
          title.includes(search) ||
          description.includes(search) ||
          location.includes(search) ||
          organizer.includes(search)
        );
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (selectedCategory !== "All") {
      result = result.filter(
        (activity) => activity.organizer?.trim() === selectedCategory,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Sort
    |--------------------------------------------------------------------------
    */

    result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [activities, searchTerm, selectedCategory, sortOrder]);

  /*
  |--------------------------------------------------------------------------
  | Featured Activity
  |--------------------------------------------------------------------------
  */

  const featuredActivity =
    !searchTerm && selectedCategory === "All" && sortOrder === "newest"
      ? filteredActivities[0]
      : null;

  /*
  |--------------------------------------------------------------------------
  | Remaining Activities
  |--------------------------------------------------------------------------
  */

  const gridActivities = featuredActivity
    ? filteredActivities.slice(1)
    : filteredActivities;

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="student-activities-page py-5 mt-5"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          minHeight: "70vh",
        }}
      >
        <div className="container">
          <div className="activities-loading">
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#A51C30" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>

            <p>Loading student activities...</p>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (!activities.length) {
    return (
      <div
        className="student-activities-page py-5 mt-5"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          minHeight: "70vh",
        }}
      >
        <div className="container">
          <div className="activities-empty">
            <div className="empty-icon">
              <i className="bi bi-calendar2-event"></i>
            </div>

            <span className="empty-kicker">Student Life</span>

            <h2>No Activities Yet</h2>

            <p>
              Stay tuned for upcoming student events, activities and campus
              experiences.
            </p>

            <Link to="/" className="empty-button">
              Back to Home
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="student-activities-page py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "70vh",
      }}
    >
      <div className="container py-5">
        {/* ================================================================
            PAGE HEADER
        ================================================================= */}

        <header className="activities-header" data-aos="fade-up">
          <div className="header-left">
            <span className="header-kicker">Student Life</span>

            <h1>
              Student <span>Activities</span>
            </h1>

            <p>
              Explore the events, achievements and experiences that bring our
              campus community to life.
            </p>
          </div>

          <div className="activity-count">
            <strong>{activities.length}</strong>

            <span>{activities.length === 1 ? "Activity" : "Activities"}</span>
          </div>
        </header>

        {/* ================================================================
            FEATURED ACTIVITY
        ================================================================= */}

        {featuredActivity && (
          <article
            className="featured-activity"
            data-aos="fade-up"
            data-aos-duration="700"
          >
            <Link to="/student-activities" className="featured-activity-image">
              {featuredActivity.imageUrl ? (
                <img
                  src={featuredActivity.imageUrl}
                  alt={featuredActivity.title || "Featured student activity"}
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";

                    e.currentTarget.parentElement.classList.add(
                      "image-fallback",
                    );
                  }}
                />
              ) : (
                <div className="image-fallback">
                  <i className="bi bi-image"></i>
                </div>
              )}

              <div className="featured-overlay"></div>

              <span className="featured-label">Featured Activity</span>

              <div className="featured-image-content">
                {featuredActivity.organizer && (
                  <span className="featured-category">
                    {featuredActivity.organizer}
                  </span>
                )}

                <h2>{featuredActivity.title}</h2>

                <div className="featured-meta">
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
            </Link>

            {featuredActivity.description && (
              <div className="featured-description">
                <p>{featuredActivity.description}</p>
              </div>
            )}
          </article>
        )}

        {/* ================================================================
            FILTER / SEARCH BAR
        ================================================================= */}

        <div
          className="activities-toolbar"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* Search */}

          <div className="activity-search">
            <i className="bi bi-search"></i>

            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              aria-label="Search activities"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          {/* Category */}

          <div className="category-scroll">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}

          <div className="sort-control">
            <i className="bi bi-sort-down"></i>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort activities"
            >
              <option value="newest">Newest First</option>

              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* ================================================================
            RESULTS INFO
        ================================================================= */}

        <div className="results-bar">
          <div>
            <strong>{filteredActivities.length}</strong>{" "}
            {filteredActivities.length === 1 ? "activity" : "activities"} found
          </div>

          {(searchTerm || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSortOrder("newest");
              }}
            >
              Clear filters
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>

        {/* ================================================================
            NO SEARCH RESULTS
        ================================================================= */}

        {!filteredActivities.length && (
          <div className="no-results">
            <div>
              <i className="bi bi-search"></i>
            </div>

            <h3>No Activities Found</h3>

            <p>Try another search term or select a different category.</p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Show All Activities
            </button>
          </div>
        )}

        {/* ================================================================
            ACTIVITY GRID
        ================================================================= */}

        {gridActivities.length > 0 && (
          <div className="activities-grid">
            {gridActivities.map((activity, index) => (
              <article
                className="activity-card"
                key={activity.id}
                data-aos="fade-up"
                data-aos-delay={Math.min(index, 5) * 70}
              >
                {/* Image */}

                <Link to="/student-activities" className="activity-card-image">
                  {activity.imageUrl ? (
                    <img
                      src={activity.imageUrl}
                      alt={activity.title || "Student activity"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";

                        e.currentTarget.parentElement.classList.add(
                          "image-fallback",
                        );
                      }}
                    />
                  ) : (
                    <div className="image-fallback">
                      <i className="bi bi-image"></i>
                    </div>
                  )}

                  {activity.organizer && (
                    <span className="card-category">{activity.organizer}</span>
                  )}
                </Link>

                {/* Card Body */}

                <div className="activity-card-body">
                  <h3>
                    <Link to="/student-activities">{activity.title}</Link>
                  </h3>

                  {/* Meta */}

                  {(activity.date || activity.location) && (
                    <div className="activity-meta">
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
                  )}

                  {/* Description */}

                  {activity.description && (
                    <p className="activity-description">
                      {activity.description}
                    </p>
                  )}

                  {/* Footer */}

                  <div className="activity-card-footer">
                    {activity.organizer && (
                      <span className="organizer">
                        <i className="bi bi-person"></i>
                        <span>{activity.organizer}</span>
                      </span>
                    )}

                    <span className="read-more">
                      Explore
                      <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ================================================================
            BOTTOM CTA
        ================================================================= */}

        {activities.length > 3 && (
          <div className="activities-bottom" data-aos="fade-up">
            <span>Student Life at GDC Gulabad</span>

            <h2>More Than Just the Classroom</h2>

            <p>
              Discover the events, activities and experiences that make our
              college community memorable.
            </p>

            <Link to="/" className="bottom-home-button">
              Explore GDC Gulabad
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>

      {/* ==================================================================
          STYLES
      =================================================================== */}

      <style>{`

        /* ================================================================
           LOADING
        ================================================================= */

        .activities-loading {
          min-height: 55vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .activities-loading p {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }


        /* ================================================================
           HEADER
        ================================================================= */

        .activities-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(128,128,128,0.16);
        }

        .header-left {
          min-width: 0;
        }

        .header-kicker {
          display: inline-block;
          margin-bottom: 7px;
          color: #A51C30;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .activities-header h1 {
          margin: 0 0 9px;
          color: var(--color-text);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.2rem, 5vw, 3.7rem);
          font-weight: 700;
          line-height: 1.05;
        }

        .activities-header h1 span {
          color: #A51C30;
        }

        .activities-header p {
          max-width: 680px;
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.65;
        }

        .activity-count {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 85px;
          height: 85px;
          border: 1px solid rgba(165,28,48,0.25);
          background: rgba(165,28,48,0.045);
        }

        .activity-count strong {
          color: #A51C30;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          line-height: 1;
        }

        .activity-count span {
          margin-top: 4px;
          color: var(--color-text-muted);
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }


        /* ================================================================
           FEATURED
        ================================================================= */

        .featured-activity {
          margin-bottom: 30px;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid rgba(128,128,128,0.12);
        }

        .featured-activity-image {
          position: relative;
          display: block;
          height: 440px;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          background: var(--color-bg-alt);
        }

        .featured-activity-image > img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .featured-activity:hover
        .featured-activity-image > img {
          transform: scale(1.035);
        }

        .featured-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(0,0,0,0.88) 0%,
              rgba(0,0,0,0.62) 28%,
              rgba(0,0,0,0.15) 68%,
              rgba(0,0,0,0.02) 100%
            );
        }

        .featured-label {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 2;
          padding: 5px 11px;
          background: #A51C30;
          color: #fff;
          font-size: 0.59rem;
          font-weight: 700;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        .featured-image-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 28px;
        }

        .featured-category {
          display: inline-block;
          max-width: 100%;
          margin-bottom: 9px;
          padding: 4px 9px;
          background: rgba(165,28,48,0.95);
          color: #fff;
          font-size: 0.59rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .featured-image-content h2 {
          max-width: 850px;
          margin: 0 0 11px;
          color: #fff;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 700;
          line-height: 1.12;

          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          overflow-wrap: anywhere;
        }

        .featured-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          color: rgba(255,255,255,0.82);
          font-size: 0.68rem;
        }

        .featured-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-width: 0;
        }

        .featured-meta i {
          color: #fff;
        }

        .featured-description {
          padding: 14px 18px;
          border-top: 1px solid rgba(128,128,128,0.12);
        }

        .featured-description p {
          max-width: 900px;
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          line-height: 1.6;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          overflow-wrap: anywhere;
          word-break: break-word;
        }


        /* ================================================================
           TOOLBAR
        ================================================================= */

        .activities-toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.5fr) auto;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding: 10px;
          background: var(--card-bg);
          border: 1px solid rgba(128,128,128,0.14);
        }

        .activity-search {
          position: relative;
          min-width: 0;
        }

        .activity-search > i {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          font-size: 0.78rem;
          pointer-events: none;
        }

        .activity-search input {
          width: 100%;
          height: 38px;
          padding: 0 38px 0 34px;
          border: 1px solid rgba(128,128,128,0.18);
          outline: none;
          background: var(--color-bg-alt);
          color: var(--color-text);
          font-size: 0.72rem;
          border-radius: 0;
        }

        .activity-search input::placeholder {
          color: var(--color-text-muted);
        }

        .activity-search input:focus {
          border-color: rgba(165,28,48,0.5);
        }

        .activity-search button {
          position: absolute;
          top: 50%;
          right: 7px;
          width: 25px;
          height: 25px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .activity-search button:hover {
          color: #A51C30;
        }

        .category-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 1px;
        }

        .category-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-button {
          flex-shrink: 0;
          height: 34px;
          padding: 0 11px;
          border: 1px solid rgba(128,128,128,0.18);
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.61rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .category-button:hover {
          border-color: #A51C30;
          color: #A51C30;
        }

        .category-button.active {
          border-color: #A51C30;
          background: #A51C30;
          color: #fff;
        }

        .sort-control {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 9px;
          border: 1px solid rgba(128,128,128,0.18);
          background: var(--color-bg-alt);
        }

        .sort-control i {
          color: #A51C30;
          font-size: 0.75rem;
        }

        .sort-control select {
          max-width: 110px;
          border: none;
          outline: none;
          background: transparent;
          color: var(--color-text);
          font-size: 0.62rem;
          cursor: pointer;
        }


        /* ================================================================
           RESULTS BAR
        ================================================================= */

        .results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 32px;
          margin-bottom: 14px;
          color: var(--color-text-muted);
          font-size: 0.62rem;
        }

        .results-bar strong {
          color: var(--color-text);
        }

        .results-bar button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0;
          border: none;
          background: transparent;
          color: #A51C30;
          font-size: 0.62rem;
          cursor: pointer;
        }


        /* ================================================================
           GRID
        ================================================================= */

        .activities-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
        }


        /* ================================================================
           ACTIVITY CARD
        ================================================================= */

        .activity-card {
          min-width: 0;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid rgba(128,128,128,0.12);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .activity-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 16px 35px rgba(0,0,0,0.09);
        }

        .activity-card-image {
          position: relative;
          display: block;
          height: 220px;
          overflow: hidden;
          background: var(--color-bg-alt);
          text-decoration: none;
        }

        .activity-card-image > img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .activity-card:hover
        .activity-card-image > img {
          transform: scale(1.045);
        }

        .card-category {
          position: absolute;
          left: 11px;
          bottom: 11px;
          max-width: calc(100% - 22px);
          padding: 4px 8px;
          background: #A51C30;
          color: #fff;
          font-size: 0.54rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-card-body {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 210px;
          padding: 16px;
        }

        .activity-card-body h3 {
          min-width: 0;
          margin: 0 0 9px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.08rem;
          font-weight: 700;
          line-height: 1.3;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .activity-card-body h3 a {
          color: var(--color-text);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .activity-card-body h3 a:hover {
          color: #A51C30;
        }

        .activity-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px 12px;
          margin-bottom: 9px;
          color: var(--color-text-muted);
          font-size: 0.59rem;
        }

        .activity-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          max-width: 100%;
        }

        .activity-meta span:last-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .activity-meta i {
          flex-shrink: 0;
          color: #A51C30;
        }

        .activity-description {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.72rem;
          line-height: 1.6;

          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;

          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .activity-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-width: 0;
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid rgba(128,128,128,0.12);
        }

        .organizer {
          display: flex;
          align-items: center;
          gap: 5px;
          min-width: 0;
          color: var(--color-text-muted);
          font-size: 0.58rem;
        }

        .organizer i {
          flex-shrink: 0;
          color: #A51C30;
        }

        .organizer span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .read-more {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #A51C30;
          font-size: 0.59rem;
          font-weight: 700;
        }

        .read-more i {
          transition: transform 0.2s ease;
        }

        .activity-card:hover
        .read-more i {
          transform: translateX(3px);
        }


        /* ================================================================
           IMAGE FALLBACK
        ================================================================= */

        .image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              rgba(165,28,48,0.07),
              rgba(128,128,128,0.07)
            );
          color: rgba(128,128,128,0.5);
        }

        .image-fallback i {
          font-size: 2rem;
        }


        /* ================================================================
           NO RESULTS
        ================================================================= */

        .no-results {
          padding: 65px 20px;
          text-align: center;
          background: var(--card-bg);
          border: 1px solid rgba(128,128,128,0.12);
        }

        .no-results > div {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          background: rgba(165,28,48,0.07);
          color: #A51C30;
          font-size: 1.15rem;
        }

        .no-results h3 {
          margin: 0 0 6px;
          color: var(--color-text);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem;
        }

        .no-results p {
          margin: 0 auto 18px;
          max-width: 420px;
          color: var(--color-text-muted);
          font-size: 0.75rem;
        }

        .no-results button {
          padding: 8px 15px;
          border: 1px solid #A51C30;
          background: transparent;
          color: #A51C30;
          font-size: 0.65rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .no-results button:hover {
          background: #A51C30;
          color: #fff;
        }


        /* ================================================================
           EMPTY
        ================================================================= */

        .activities-empty {
          min-height: 55vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-icon {
          width: 75px;
          height: 75px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          background: rgba(165,28,48,0.07);
          color: #A51C30;
          font-size: 1.8rem;
        }

        .empty-kicker {
          color: #A51C30;
          font-size: 0.63rem;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .activities-empty h2 {
          margin: 6px 0 7px;
          color: var(--color-text);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
        }

        .activities-empty p {
          max-width: 450px;
          margin: 0 0 20px;
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        .empty-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #A51C30;
          color: #fff;
          text-decoration: none;
          font-size: 0.68rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .empty-button:hover {
          background: #7A1523;
          color: #fff;
        }


        /* ================================================================
           BOTTOM CTA
        ================================================================= */

        .activities-bottom {
          position: relative;
          margin-top: 45px;
          padding: 45px 25px;
          overflow: hidden;
          text-align: center;
          background:
            linear-gradient(
              135deg,
              rgba(165,28,48,0.96),
              rgba(122,21,35,0.96)
            );
        }

        .activities-bottom::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.09;
          background-image:
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.7) 20px,
              rgba(255,255,255,0.7) 22px
            );
        }

        .activities-bottom > * {
          position: relative;
          z-index: 1;
        }

        .activities-bottom > span {
          display: block;
          margin-bottom: 6px;
          color: rgba(255,255,255,0.75);
          font-size: 0.59rem;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .activities-bottom h2 {
          margin: 0 0 8px;
          color: #fff;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
        }

        .activities-bottom p {
          max-width: 500px;
          margin: 0 auto 18px;
          color: rgba(255,255,255,0.78);
          font-size: 0.72rem;
          line-height: 1.6;
        }

        .bottom-home-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #fff;
          color: #A51C30;
          text-decoration: none;
          font-size: 0.65rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .bottom-home-button:hover {
          background: rgba(255,255,255,0.9);
          color: #7A1523;
          transform: translateY(-2px);
        }


        /* ================================================================
           LARGE TABLET
        ================================================================= */

        @media (max-width: 1000px) {

          .activities-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .activities-toolbar {
            grid-template-columns:
              minmax(200px, 0.8fr)
              minmax(0, 1fr);
          }

          .sort-control {
            grid-column: 2;
            justify-self: end;
          }

          .category-scroll {
            grid-column: 1 / -1;
            grid-row: 2;
          }

        }


        /* ================================================================
           TABLET
        ================================================================= */

        @media (max-width: 767px) {

          .student-activities-page {
            padding-top: 35px !important;
            margin-top: 0 !important;
          }

          .activities-header {
            align-items: center;
            margin-bottom: 22px;
            padding-bottom: 15px;
          }

          .activities-header h1 {
            font-size: 2.15rem;
          }

          .activities-header p {
            font-size: 0.76rem;
          }

          .activity-count {
            width: 65px;
            height: 65px;
          }

          .activity-count strong {
            font-size: 1.35rem;
          }

          .activity-count span {
            font-size: 0.48rem;
          }


          /* Featured */

          .featured-activity-image {
            height: 330px;
          }

          .featured-image-content {
            padding: 18px;
          }

          .featured-image-content h2 {
            font-size: 1.55rem;
          }

          .featured-description {
            padding: 12px 14px;
          }


          /* Toolbar */

          .activities-toolbar {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .activity-search {
            width: 100%;
          }

          .category-scroll {
            width: 100%;
          }

          .sort-control {
            width: 100%;
            justify-content: flex-start;
          }

          .sort-control select {
            max-width: none;
            width: 100%;
          }


          /* Grid */

          .activities-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .activity-card {
            display: grid;
            grid-template-columns: 135px minmax(0, 1fr);
          }

          .activity-card-image {
            height: 100%;
            min-height: 180px;
          }

          .activity-card-body {
            min-height: 180px;
            padding: 13px;
          }

          .activity-card-body h3 {
            font-size: 0.95rem;
          }

          .activity-description {
            -webkit-line-clamp: 2;
          }

          .activity-card-footer {
            padding-top: 9px;
          }


          /* CTA */

          .activities-bottom {
            margin-top: 30px;
            padding: 35px 18px;
          }

        }


        /* ================================================================
           SMALL MOBILE
        ================================================================= */

        @media (max-width: 480px) {

          .activities-header {
            align-items: flex-start;
          }

          .activities-header h1 {
            font-size: 1.9rem;
          }

          .activities-header p {
            font-size: 0.71rem;
          }

          .activity-count {
            width: 55px;
            height: 55px;
          }

          .activity-count strong {
            font-size: 1.1rem;
          }


          .featured-activity-image {
            height: 280px;
          }

          .featured-label {
            top: 11px;
            left: 11px;
            font-size: 0.5rem;
          }

          .featured-image-content {
            padding: 13px;
          }

          .featured-image-content h2 {
            font-size: 1.25rem;
          }

          .featured-meta {
            gap: 8px;
            font-size: 0.56rem;
          }


          .activity-card {
            grid-template-columns: 105px minmax(0, 1fr);
          }

          .activity-card-image {
            min-height: 155px;
          }

          .activity-card-body {
            min-height: 155px;
            padding: 10px;
          }

          .activity-card-body h3 {
            margin-bottom: 6px;
            font-size: 0.82rem;
          }

          .activity-meta {
            margin-bottom: 6px;
            font-size: 0.52rem;
          }

          .activity-description {
            font-size: 0.61rem;
            line-height: 1.45;
          }

          .organizer {
            font-size: 0.5rem;
          }

          .read-more {
            font-size: 0.51rem;
          }

          .card-category {
            left: 6px;
            bottom: 6px;
            padding: 3px 6px;
            font-size: 0.46rem;
          }

          .activities-bottom h2 {
            font-size: 1.4rem;
          }

        }

      `}</style>
    </div>
  );
};

export default StudentActivities;
