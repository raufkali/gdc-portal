import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedAchievements = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

const StudentAchievements = () => {
  const [achievements, setAchievements] = useState(() => {
    if (
      cachedAchievements &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedAchievements;
    }

    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedAchievements &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Achievements
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    const fetchAchievements = async () => {
      if (
        cachedAchievements &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setAchievements(cachedAchievements);
          setLoading(false);
        }

        return;
      }

      try {
        const snap = await getDocs(collection(db, "studentAchievements"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Newest achievements first
        data.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;

          return new Date(b.date) - new Date(a.date);
        });

        cachedAchievements = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setAchievements(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching student achievements:", error);

        if (isMounted) {
          if (cachedAchievements) {
            setAchievements(cachedAchievements);
          }

          setLoading(false);
        }
      }
    };

    fetchAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredAchievements = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return achievements;
    }

    return achievements.filter((item) => {
      return (
        item.studentName?.toLowerCase().includes(query) ||
        item.title?.toLowerCase().includes(query) ||
        item.achievement?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });
  }, [achievements, search]);

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
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "70vh",
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <p
            className="mb-0"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            Loading achievements...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty
  |--------------------------------------------------------------------------
  */

  if (!achievements.length) {
    return (
      <div
        className="py-5 mt-5"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          minHeight: "70vh",
        }}
      >
        <div className="container">
          <div className="achievement-empty-state">
            <div className="achievement-empty-icon">
              <i className="bi bi-trophy"></i>
            </div>

            <h2>Student Achievements</h2>

            <p>Outstanding student achievements will appear here.</p>
          </div>
        </div>

        <style>{`
          .achievement-empty-state {
            min-height: 55vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .achievement-empty-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(165, 28, 48, 0.08);
            color: #A51C30;
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }

          .achievement-empty-state h2 {
            font-family: 'Playfair Display', Georgia, serif;
            color: var(--color-text);
            font-weight: 700;
          }

          .achievement-empty-state p {
            color: var(--color-text-muted);
          }
        `}</style>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="student-achievements-page py-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
      }}
    >
      <div className="container">
        {/* ================================================================
            HEADER
        ================================================================= */}

        <header className="achievements-header">
          <div className="achievements-eyebrow">Student Success</div>

          <h2>
            Our Students,
            <span style={{ color: "#A51C30" }}> Our Pride.</span>
          </h2>

          <p>
            Celebrating the achievements, talents, and success stories of the
            students who make GDC Gulabad proud.
          </p>
        </header>

        {/* ================================================================
            SEARCH
        ================================================================= */}

        {achievements.length > 4 && (
          <div className="achievements-search-wrapper">
            <div className="achievements-search">
              <i className="bi bi-search"></i>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or achievement..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================
            RESULTS COUNT
        ================================================================= */}

        {search && (
          <div className="achievement-results">
            {filteredAchievements.length}{" "}
            {filteredAchievements.length === 1 ? "result" : "results"} found
          </div>
        )}

        {/* ================================================================
            NO SEARCH RESULTS
        ================================================================= */}

        {filteredAchievements.length === 0 && (
          <div className="no-achievement-results">
            <i className="bi bi-search"></i>

            <h3>No achievements found</h3>

            <p>Try searching for another student or achievement.</p>

            <button onClick={() => setSearch("")}>Clear Search</button>
          </div>
        )}

        {/* ================================================================
            ACHIEVEMENTS
        ================================================================= */}

        {filteredAchievements.length > 0 && (
          <div className="achievement-list">
            {filteredAchievements.map((item, index) => {
              const isFeatured = index === 0 && !search;

              return (
                <article
                  key={item.id}
                  className={`achievement-item ${
                    isFeatured ? "achievement-featured" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 70, 500)}
                >
                  {/* ----------------------------------------------------
                        IMAGE
                    ----------------------------------------------------- */}

                  <div className="achievement-image-wrapper">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={
                          item.studentName ||
                          item.title ||
                          "Student achievement"
                        }
                        loading={index < 2 ? "eager" : "lazy"}
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
                      className="achievement-image-fallback"
                      style={{
                        display: item.imageUrl ? "none" : "flex",
                      }}
                    >
                      <i className="bi bi-person"></i>
                    </div>

                    {isFeatured && (
                      <div className="featured-badge">
                        <i className="bi bi-star-fill"></i>
                        Featured
                      </div>
                    )}
                  </div>

                  {/* ----------------------------------------------------
                        CONTENT
                    ----------------------------------------------------- */}

                  <div className="achievement-content">
                    <div className="achievement-topline">
                      <span className="achievement-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {item.date && (
                        <span className="achievement-date">
                          <i className="bi bi-calendar3"></i>
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>

                    <h2 className="achievement-name">{item.studentName}</h2>

                    {item.title && (
                      <div className="achievement-title">{item.title}</div>
                    )}

                    {item.achievement && (
                      <div className="achievement-highlight">
                        <span className="highlight-line"></span>

                        <span>{item.achievement}</span>
                      </div>
                    )}

                    {item.description && (
                      <p className="achievement-description">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* ----------------------------------------------------
                        SIDE NUMBER
                    ----------------------------------------------------- */}

                  <div className="achievement-side-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================================================================
          STYLES
      =================================================================== */}

      <style>{`

        /* ================================================================
           HEADER
        ================================================================= */

        .achievements-header {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 3rem;
        }

        .achievements-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          color: #A51C30;

          background: rgba(165, 28, 48, 0.08);

          padding: 0.45rem 1.25rem;

          border-radius: 50px;

          font-size: 0.78rem;
          font-weight: 700;

          letter-spacing: 2px;
          text-transform: uppercase;

          margin-bottom: 1rem;
        }

        .achievements-header h1 {
          margin: 0;

          font-family:
            'Playfair Display',
            Georgia,
            serif;

          font-weight: 700;

          font-size:
            clamp(2.5rem, 6vw, 4.5rem);

          line-height: 1.05;

          letter-spacing: -1.5px;

          color: var(--color-text);
        }

        .achievements-header h1 span {
          color: #A51C30;
        }

        .achievements-header p {
          max-width: 650px;

          margin:
            1.25rem auto 0;

          color:
            var(--color-text-muted);

          font-size:
            clamp(0.95rem, 2vw, 1.08rem);

          line-height: 1.7;
        }


        /* ================================================================
           SEARCH
        ================================================================= */

        .achievements-search-wrapper {
          display: flex;
          justify-content: center;

          margin-bottom: 1rem;
        }

        .achievements-search {
          width: 100%;
          max-width: 560px;

          display: flex;
          align-items: center;

          background:
            var(--card-bg);

          border:
            1px solid
            var(--border-color, rgba(0,0,0,0.08));

          border-radius: 50px;

          padding:
            0.25rem 0.4rem 0.25rem 1.25rem;

          box-shadow:
            0 5px 20px rgba(0,0,0,0.04);

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .achievements-search:focus-within {
          border-color:
            rgba(165, 28, 48, 0.4);

          box-shadow:
            0 8px 25px
            rgba(165, 28, 48, 0.08);
        }

        .achievements-search > i {
          color: #A51C30;
          font-size: 0.95rem;
          margin-right: 0.75rem;
        }

        .achievements-search input {
          flex: 1;

          min-width: 0;

          border: none;
          outline: none;

          background: transparent;

          color:
            var(--color-text);

          font-size: 0.9rem;

          padding: 0.65rem 0;
        }

        .achievements-search input::placeholder {
          color:
            var(--color-text-muted);
        }

        .achievements-search button {
          width: 34px;
          height: 34px;

          flex-shrink: 0;

          border: none;
          border-radius: 50%;

          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }


        /* ================================================================
           RESULT COUNT
        ================================================================= */

        .achievement-results {
          text-align: center;

          color:
            var(--color-text-muted);

          font-size: 0.78rem;

          margin:
            1rem 0 1.5rem;
        }


        /* ================================================================
           LIST
        ================================================================= */

        .achievement-list {
          max-width: 1050px;
          margin: 0 auto;
        }

        .achievement-item {
          position: relative;

          display: grid;

          grid-template-columns:
            210px minmax(0, 1fr) 45px;

          gap: 2rem;

          align-items: center;

          padding:
            2rem 0;

          border-top:
            1px solid
            var(--border-color, rgba(0,0,0,0.09));

          transition:
            transform 0.3s ease;
        }

        .achievement-item:last-child {
          border-bottom:
            1px solid
            var(--border-color, rgba(0,0,0,0.09));
        }

        .achievement-item:hover {
          transform: translateX(5px);
        }


        /* ================================================================
           FEATURED
        ================================================================= */

        .achievement-featured {
          grid-template-columns:
            320px minmax(0, 1fr) 45px;

          padding:
            2.5rem 0;
        }

        .achievement-featured
        .achievement-image-wrapper {
          height: 250px;
        }

        .achievement-featured
        .achievement-name {
          font-size:
            clamp(1.8rem, 4vw, 2.5rem);
        }


        /* ================================================================
           IMAGE
        ================================================================= */

        .achievement-image-wrapper {
          position: relative;

          width: 100%;
          height: 150px;

          overflow: hidden;

          background:
            rgba(165, 28, 48, 0.05);

          border-radius: 4px;
        }

        .achievement-image-wrapper img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 0.5s ease;
        }

        .achievement-item:hover
        .achievement-image-wrapper img {
          transform: scale(1.04);
        }

        .achievement-image-fallback {
          width: 100%;
          height: 100%;

          align-items: center;
          justify-content: center;

          color: #A51C30;

          font-size: 3rem;

          background:
            linear-gradient(
              135deg,
              rgba(165,28,48,0.12),
              rgba(165,28,48,0.03)
            );
        }


        /* ================================================================
           FEATURED BADGE
        ================================================================= */

        .featured-badge {
          position: absolute;

          left: 10px;
          bottom: 10px;

          display: inline-flex;
          align-items: center;
          gap: 5px;

          background: #a51c3148;
          color: #fff;

          padding:
            0.35rem 0.7rem;

          border-radius: 3px;

          font-size: 0.68rem;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.5px;
        }


        /* ================================================================
           CONTENT
        ================================================================= */

        .achievement-content {
          min-width: 0;
        }

        .achievement-topline {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 1rem;

          margin-bottom: 0.6rem;
        }

        .achievement-index {
          color: #A51C30;

          font-size: 0.7rem;

          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .achievement-date {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          color:
            var(--color-text-muted);

          font-size: 0.72rem;

          white-space: nowrap;
        }

        .achievement-name {
          margin: 0;

          color:
            var(--color-text);

          font-family:
            'Playfair Display',
            Georgia,
            serif;

          font-size: 1.45rem;

          line-height: 1.2;

          font-weight: 700;

          overflow-wrap: anywhere;
        }

        .achievement-title {
          color:
            var(--color-text-muted);

          font-size: 0.78rem;

          font-weight: 600;

          margin-top: 0.35rem;

          text-transform: uppercase;

          letter-spacing: 0.8px;

          overflow-wrap: anywhere;
        }

        .achievement-highlight {
          display: flex;

          align-items: flex-start;

          gap: 0.7rem;

          margin-top: 0.9rem;

          color:
            var(--color-text);

          font-size: 0.92rem;

          line-height: 1.5;

          font-weight: 600;

          overflow-wrap: anywhere;
        }

        .highlight-line {
          width: 3px;

          min-width: 3px;

          height: 22px;

          margin-top: 2px;

          background: #A51C30;

          border-radius: 5px;
        }

        .achievement-description {
          max-width: 680px;

          margin:
            0.75rem 0 0;

          color:
            var(--color-text-muted);

          font-size: 0.85rem;

          line-height: 1.7;

          display: -webkit-box;

          -webkit-line-clamp: 3;

          -webkit-box-orient: vertical;

          overflow: hidden;

          overflow-wrap: anywhere;
        }


        /* ================================================================
           SIDE NUMBER
        ================================================================= */

        .achievement-side-number {
          align-self: center;

          color:
            rgba(165, 28, 48, 0.12);

          font-family:
            'Playfair Display',
            Georgia,
            serif;

          font-size: 2.4rem;

          font-weight: 700;

          text-align: right;
        }


        /* ================================================================
           LOADING
        ================================================================= */

        .achievement-loading {
          min-height: 55vh;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;
        }

        .achievement-loading p {
          margin-top: 0.75rem;

          color:
            var(--color-text-muted);

          font-size: 0.85rem;
        }


        /* ================================================================
           NO RESULTS
        ================================================================= */

        .no-achievement-results {
          min-height: 35vh;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;
        }

        .no-achievement-results > i {
          font-size: 2rem;

          color: #A51C30;

          margin-bottom: 1rem;
        }

        .no-achievement-results h3 {
          font-family:
            'Playfair Display',
            Georgia,
            serif;

          color:
            var(--color-text);

          font-weight: 700;
        }

        .no-achievement-results p {
          color:
            var(--color-text-muted);
        }

        .no-achievement-results button {
          border: none;

          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;

          border-radius: 50px;

          padding:
            0.55rem 1.2rem;

          font-size: 0.8rem;

          font-weight: 600;

          cursor: pointer;
        }


        /* ================================================================
           TABLET
        ================================================================= */

        @media (max-width: 991.98px) {

          .achievement-item,
          .achievement-featured {
            grid-template-columns:
              180px minmax(0, 1fr) 35px;

            gap: 1.5rem;
          }

          .achievement-image-wrapper {
            height: 135px;
          }

          .achievement-featured
          .achievement-image-wrapper {
            height: 190px;
          }

          .achievement-name {
            font-size: 1.3rem;
          }

          .achievement-featured
          .achievement-name {
            font-size: 1.9rem;
          }

          .achievement-side-number {
            font-size: 1.8rem;
          }
        }


        /* ================================================================
           MOBILE
        ================================================================= */

        @media (max-width: 767.98px) {

          .student-achievements-page {
            padding-top: 2.5rem !important;
          }

          .achievements-header {
            margin-bottom: 2rem;
          }

          .achievements-header h1 {
            font-size: 2.5rem;
            letter-spacing: -0.8px;
          }

          .achievements-header p {
            font-size: 0.9rem;
            line-height: 1.6;
          }

          .achievement-item,
          .achievement-featured {
            display: grid;

            grid-template-columns:
              90px minmax(0, 1fr);

            gap: 1rem;

            padding: 1.5rem 0;
          }

          .achievement-image-wrapper,
          .achievement-featured
          .achievement-image-wrapper {
            width: 90px;
            height: 110px;

            grid-row: span 1;
          }

          .achievement-content {
            min-width: 0;
          }

          .achievement-side-number {
            display: none;
          }

          .achievement-topline {
            margin-bottom: 0.4rem;
          }

          .achievement-date {
            font-size: 0.65rem;
          }

          .achievement-name,
          .achievement-featured
          .achievement-name {
            font-size: 1.15rem;
            line-height: 1.25;
          }

          .achievement-title {
            font-size: 0.65rem;
            margin-top: 0.25rem;
          }

          .achievement-highlight {
            font-size: 0.8rem;
            margin-top: 0.55rem;
            line-height: 1.4;
          }

          .achievement-description {
            font-size: 0.76rem;
            line-height: 1.55;

            -webkit-line-clamp: 2;

            margin-top: 0.5rem;
          }

          .featured-badge {
            left: 4px;
            bottom: 4px;

            font-size: 0.55rem;

            padding:
              0.25rem 0.45rem;
          }

          .achievement-index {
            font-size: 0.62rem;
          }
        }


        /* ================================================================
           SMALL MOBILE
        ================================================================= */

        @media (max-width: 400px) {

          .achievement-item,
          .achievement-featured {
            grid-template-columns:
              75px minmax(0, 1fr);

            gap: 0.8rem;
          }

          .achievement-image-wrapper,
          .achievement-featured
          .achievement-image-wrapper {
            width: 75px;
            height: 95px;
          }

          .achievement-name,
          .achievement-featured
          .achievement-name {
            font-size: 1.05rem;
          }

          .achievement-highlight {
            font-size: 0.75rem;
          }

          .achievement-description {
            font-size: 0.72rem;
          }
        }

      `}</style>
    </div>
  );
};

export default StudentAchievements;
