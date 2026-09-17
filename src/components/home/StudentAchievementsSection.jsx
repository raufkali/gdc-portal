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
      if (
        cachedAchievements &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setAchievements(cachedAchievements.slice(0, 5));
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

        data.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date) - new Date(a.date);
        });

        cachedAchievements = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setAchievements(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching student achievements:", error);

        if (isMounted && cachedAchievements) {
          setAchievements(cachedAchievements.slice(0, 5));
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

  if (!loading && !achievements.length) {
    return null;
  }

  const [featured, ...rest] = achievements;

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
            <span className="achievements-eyebrow">
              <i className="bi bi-award-fill" />
              Student Success
            </span>

            <h2>
              Achievements <span>Board</span>
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
            LOADING
        ================================================== */}
        {loading ? (
          <div
            className="achievements-loading"
            aria-label="Loading achievements"
          >
            <div
              className="spinner-border"
              style={{ color: "#A51C30" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="achievements-board">
            {/* ==================================================
                FEATURED PROFILE CARD
            ================================================== */}
            {featured && (
              <article
                className="achievement-profile achievement-profile-featured"
                data-aos="fade-up"
                data-aos-duration="600"
              >
                {/* Featured tag on the face */}
                <span className="achievement-featured-tag">
                  <i className="bi bi-star-fill" />
                  Featured
                </span>

                {/* Circular avatar */}
                <div className="achievement-avatar-wrap">
                  <div className="achievement-avatar-ring" />
                  <div className="achievement-avatar">
                    {featured.imageUrl ? (
                      <img
                        src={featured.imageUrl}
                        alt={
                          featured.studentName ||
                          featured.title ||
                          "Student achievement"
                        }
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fb = e.currentTarget.nextElementSibling;
                          if (fb) fb.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <span
                      className="achievement-avatar-fallback"
                      style={{ display: featured.imageUrl ? "none" : "flex" }}
                    >
                      <i className="bi bi-trophy-fill" />
                    </span>
                  </div>

                  {/* Medal / date pill */}
                  {featured.date && (
                    <span className="achievement-date-pill">
                      {formatDate(featured.date)}
                    </span>
                  )}
                </div>

                {/* Identity */}
                <div className="achievement-identity">
                  <h3 className="achievement-name">
                    {featured.studentName || "GDC Gulabad Student"}
                  </h3>

                  {featured.title && (
                    <div className="achievement-title">{featured.title}</div>
                  )}
                </div>

                <div className="achievement-divider" />

                {/* Achievement */}
                {featured.achievement && (
                  <div className="achievement-highlight">
                    <span className="achievement-highlight-bar" />
                    <p>{featured.achievement}</p>
                  </div>
                )}

                {/* Description */}
                {featured.description && (
                  <p className="achievement-bio">{featured.description}</p>
                )}

                {/* Footer */}
                <div className="achievement-footer">
                  <span className="achievement-footer-label">
                    Achievement of the Month
                  </span>
                  <i className="bi bi-arrow-up-right" />
                </div>
              </article>
            )}

            {/* ==================================================
                OTHER PROFILE CARDS
            ================================================== */}
            {rest.length > 0 && (
              <div className="achievement-profile-grid">
                {rest.map((item, index) => (
                  <article
                    key={item.id}
                    className="achievement-profile"
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 80}
                  >
                    {/* Number */}
                    <span className="achievement-index">
                      {String(index + 2).padStart(2, "0")}
                    </span>

                    {/* Circular avatar */}
                    <div className="achievement-avatar-wrap">
                      <div className="achievement-avatar-ring" />
                      <div className="achievement-avatar">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={
                              item.studentName ||
                              item.title ||
                              "Student achievement"
                            }
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fb = e.currentTarget.nextElementSibling;
                              if (fb) fb.style.display = "flex";
                            }}
                          />
                        ) : null}

                        <span
                          className="achievement-avatar-fallback"
                          style={{ display: item.imageUrl ? "none" : "flex" }}
                        >
                          <i className="bi bi-trophy" />
                        </span>
                      </div>

                      {item.date && (
                        <span className="achievement-date-pill">
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>

                    {/* Identity */}
                    <div className="achievement-identity">
                      <h4 className="achievement-name">
                        {item.studentName || "GDC Gulabad Student"}
                      </h4>

                      {item.title && (
                        <div className="achievement-title">{item.title}</div>
                      )}
                    </div>

                    <div className="achievement-divider" />

                    {/* Achievement */}
                    {item.achievement && (
                      <div className="achievement-highlight">
                        <span className="achievement-highlight-bar" />
                        <p>{item.achievement}</p>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="achievement-bio">{item.description}</p>
                    )}

                    {/* Footer */}
                    <div className="achievement-footer">
                      <span className="achievement-footer-label">
                        Student Achievement
                      </span>
                      <i className="bi bi-arrow-up-right" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================
            BOTTOM
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
          gap: 0.5rem;
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

        .achievements-eyebrow i {
          font-size: 0.72rem;
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
           BOARD LAYOUT
        ================================================================= */

        .achievements-board {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .achievement-profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }

        /* ================================================================
           PROFILE CARD (shared)
        ================================================================= */

        .achievement-profile {
          position: relative;

          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;

          padding: 2.4rem 1.5rem 1.25rem;

          background: var(--card-bg, #ffffff);
          border: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
          border-radius: 20px;

          overflow: hidden;

          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.05),
            0 2px 6px rgba(0, 0, 0, 0.03);

          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease;
        }

        .achievement-profile:hover {
          transform: translateY(-5px);
          box-shadow:
            0 22px 45px rgba(0, 0, 0, 0.1),
            0 4px 10px rgba(0, 0, 0, 0.05);
          border-color: rgba(165, 28, 48, 0.25);
        }

        /* Subtle top gradient wash */
        .achievement-profile::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(
            180deg,
            rgba(165, 28, 48, 0.06),
            rgba(165, 28, 48, 0)
          );
          pointer-events: none;
        }

        /* ================================================================
           INDEX NUMBER (small cards)
        ================================================================= */

        .achievement-index {
          position: absolute;
          top: 12px;
          right: 16px;
          font-family:
            'Playfair Display',
            Georgia,
            serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(165, 28, 48, 0.22);
          letter-spacing: 1px;
        }

        /* ================================================================
           FEATURED TAG (on face of card)
        ================================================================= */

        .achievement-featured-tag {
          position: absolute;
          top: 14px;
          left: 14px;

          z-index: 5;

          display: inline-flex;
          align-items: center;
          gap: 0.4rem;

          background: linear-gradient(145deg, #A51C30, #7A1523);
          color: #fff;

          padding: 0.4rem 0.9rem;

          border-radius: 50px;

          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.2px;

          box-shadow:
            0 6px 16px rgba(165, 28, 48, 0.35);

          transform: rotate(-3deg);
        }

        .achievement-featured-tag i {
          font-size: 0.65rem;
        }

        /* ================================================================
           AVATAR
        ================================================================= */

        .achievement-avatar-wrap {
          position: relative;
          width: 108px;
          height: 108px;
          margin-bottom: 1rem;
        }

        .achievement-avatar-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px dashed rgba(165, 28, 48, 0.3);
          pointer-events: none;
        }

        .achievement-avatar {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(145deg, #f5e6e9, #ecd2d8);
          box-shadow:
            0 10px 24px rgba(165, 28, 48, 0.18),
            0 0 0 4px var(--card-bg, #ffffff),
            0 0 0 5px rgba(165, 28, 48, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .achievement-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .achievement-profile:hover .achievement-avatar img {
          transform: scale(1.06);
        }

        .achievement-avatar-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #A51C30;
          font-size: 2.6rem;
        }

        /* Date pill overlapping the avatar bottom */
        .achievement-date-pill {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);

          display: inline-flex;
          align-items: center;

          background: #A51C30;
          color: #fff;

          padding: 0.24rem 0.7rem;
          border-radius: 50px;

          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          white-space: nowrap;

          box-shadow: 0 6px 14px rgba(165, 28, 48, 0.3);

          z-index: 2;
        }

        /* ================================================================
           IDENTITY
        ================================================================= */

        .achievement-identity {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-top: 0.35rem;
        }

        .achievement-name {
          margin: 0 0 0.35rem;
          font-family:
            'Playfair Display',
            Georgia,
            serif;
          font-size: 1.12rem;
          font-weight: 700;
          line-height: 1.25;
          color: var(--color-text);
          max-width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          overflow-wrap: anywhere;
        }

        .achievement-title {
          color: #A51C30;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.1px;
          max-width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ================================================================
           DIVIDER
        ================================================================= */

        .achievement-divider {
          width: 42px;
          height: 2px;
          background: rgba(165, 28, 48, 0.25);
          border-radius: 2px;
          margin: 1rem 0 0.85rem;
        }

        /* ================================================================
           HIGHLIGHT (achievement line)
        ================================================================= */

        .achievement-highlight {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          width: 100%;
          text-align: left;
          margin-bottom: 0.65rem;
        }

        .achievement-highlight-bar {
          width: 3px;
          min-width: 3px;
          height: 20px;
          margin-top: 2px;
          border-radius: 3px;
          background: #A51C30;
        }

        .achievement-highlight p {
          margin: 0;
          color: var(--color-text);
          font-size: 0.82rem;
          font-weight: 600;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          overflow-wrap: anywhere;
        }

        /* ================================================================
           BIO
        ================================================================= */

        .achievement-bio {
          margin: 0 0 1rem;
          color: var(--color-text-muted);
          font-size: 0.78rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ================================================================
           FOOTER
        ================================================================= */

        .achievement-footer {
          margin-top: auto;
          padding-top: 0.85rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
        }

        .achievement-footer-label {
          color: #A51C30;
          font-size: 0.64rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.3px;
        }

        .achievement-footer > i {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #A51C30;
          border: 1px solid rgba(165, 28, 48, 0.2);
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .achievement-profile:hover .achievement-footer > i {
          background: #A51C30;
          color: #fff;
          transform: translate(2px, -2px);
        }

        /* ================================================================
           FEATURED PROFILE CARD — bigger avatar, wider card
        ================================================================= */

        .achievement-profile-featured {
          padding: 3rem 2rem 1.5rem;
        }

        .achievement-profile-featured .achievement-avatar-wrap {
          width: 140px;
          height: 140px;
          margin-bottom: 1.25rem;
        }

        .achievement-profile-featured .achievement-avatar-fallback {
          font-size: 3.4rem;
        }

        .achievement-profile-featured .achievement-name {
          font-size: clamp(1.5rem, 2.6vw, 2rem);
          -webkit-line-clamp: 2;
        }

        .achievement-profile-featured .achievement-title {
          font-size: 0.78rem;
          letter-spacing: 1.4px;
        }

        .achievement-profile-featured .achievement-highlight p {
          font-size: 0.95rem;
          -webkit-line-clamp: 3;
        }

        .achievement-profile-featured .achievement-bio {
          font-size: 0.88rem;
          -webkit-line-clamp: 3;
        }

        .achievement-profile-featured .achievement-footer-label {
          font-size: 0.7rem;
        }

        /* ================================================================
           BOTTOM
        ================================================================= */

        .achievements-bottom {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          max-width: 800px;
          margin: 2.5rem auto 0;
        }

        .achievements-bottom-line {
          flex: 1;
          height: 1px;
          background: var(--color-border, rgba(0, 0, 0, 0.08));
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
          transition: transform 0.25s ease;
        }

        .achievements-bottom-link:hover i {
          transform: translateX(4px);
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

          .achievement-profile-grid {
            grid-template-columns: 1fr;
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
            font-size: 2.2rem;
          }

          .achievements-section-header p {
            font-size: 0.9rem;
          }

          .achievements-view-all {
            margin-top: 1rem;
          }

          /* Featured card scales down */
          .achievement-profile-featured {
            padding: 2.4rem 1.25rem 1.25rem;
          }

          .achievement-profile-featured .achievement-avatar-wrap {
            width: 110px;
            height: 110px;
          }

          .achievement-profile-featured .achievement-avatar-fallback {
            font-size: 2.6rem;
          }

          .achievement-profile-featured .achievement-name {
            font-size: 1.35rem;
          }

          .achievement-profile-featured .achievement-highlight p {
            font-size: 0.85rem;
          }

          .achievement-profile-featured .achievement-bio {
            font-size: 0.78rem;
          }

          /* Smaller profile cards */
          .achievement-profile {
            padding: 2rem 1.15rem 1.1rem;
          }

          .achievement-avatar-wrap {
            width: 88px;
            height: 88px;
          }

          .achievement-avatar-fallback {
            font-size: 2.1rem;
          }

          .achievement-name {
            font-size: 1rem;
          }

          .achievement-title {
            font-size: 0.62rem;
          }

          .achievement-highlight p {
            font-size: 0.76rem;
          }

          .achievement-bio {
            font-size: 0.72rem;
            -webkit-line-clamp: 3;
          }

          .achievement-footer-label {
            font-size: 0.6rem;
          }

          .achievement-footer > i {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
          }

          .achievement-featured-tag {
            font-size: 0.6rem;
            padding: 0.32rem 0.75rem;
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
          .achievement-avatar-wrap {
            width: 78px;
            height: 78px;
          }

          .achievement-profile-featured .achievement-avatar-wrap {
            width: 96px;
            height: 96px;
          }

          .achievement-name {
            font-size: 0.92rem;
          }

          .achievement-profile-featured .achievement-name {
            font-size: 1.2rem;
          }

          .achievements-section-header h2 {
            font-size: 2rem;
          }
        }

        /* ================================================================
           REDUCED MOTION
        ================================================================= */

        @media (prefers-reduced-motion: reduce) {
          .achievement-profile,
          .achievement-avatar img,
          .achievement-footer > i {
            transition: none !important;
          }
        }

      `}</style>
    </section>
  );
};

export default StudentAchievementsSection;
