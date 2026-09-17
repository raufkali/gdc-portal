import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedStars = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

const CollegeStarsSection = () => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStars = async () => {
      if (
        cachedStars &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setStars(cachedStars.slice(0, 4));
          setLoading(false);
        }
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "collegeStars"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        cachedStars = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setStars(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching college stars:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStars();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section
        className="py-5"
        style={{
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div className="container text-center py-4">
          <div
            className="spinner-border"
            style={{
              color: "#A51C30",
              width: "1.8rem",
              height: "1.8rem",
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!stars.length) {
    return null;
  }

  return (
    <section
      className="py-5 stars-section"
      style={{
        backgroundColor: "var(--color-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container py-lg-4">
        {/* ==================================================
            SECTION HEADER
        ================================================== */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: "700",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(165, 28, 48, 0.07)",
              padding: "0.45rem 1.25rem",
              borderRadius: "50px",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#A51C30",
                borderRadius: "50%",
              }}
            />
            Our Pride
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.3rem, 5vw, 4rem)",
              fontWeight: "700",
              lineHeight: "1.15",
              color: "var(--color-text)",
              marginBottom: "0.8rem",
            }}
          >
            Meet Our <span style={{ color: "#A51C30" }}>College Stars</span>
          </h2>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              lineHeight: "1.7",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Celebrating the outstanding alumni whose achievements continue to
            inspire our students and bring pride to Government Degree College
            Gulabad.
          </p>
        </div>

        {/* ==================================================
            PROFILE CARDS
        ================================================== */}
        <div className="stars-grid">
          {stars.map((star, index) => (
            <article
              key={star.id}
              className="star-profile-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* ==================================================
                  AVATAR
              ================================================== */}
              <div className="star-avatar-wrap">
                <div className="star-avatar-ring" />
                <div className="star-avatar">
                  {star.imageUrl ? (
                    <img
                      src={star.imageUrl}
                      alt={`${star.name} - College Star`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="star-avatar-fallback">
                      <i className="bi bi-person-fill" />
                    </span>
                  )}
                </div>

                {/* Batch pill on the avatar corner */}
                {star.batch && (
                  <span className="star-batch-pill">{star.batch}</span>
                )}
              </div>

              {/* ==================================================
                  IDENTITY
              ================================================== */}
              <div className="star-identity">
                <h3 className="star-name" title={star.name}>
                  {star.name}
                </h3>

                {star.achievement && (
                  <div className="star-role" title={star.achievement}>
                    <i className="bi bi-trophy-fill" />
                    <span>{star.achievement}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="star-divider" />

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}
              {star.description && (
                <p className="star-bio">{star.description}</p>
              )}

              {/* ==================================================
                  ACTION
              ================================================== */}
              {star.link && (
                <a
                  href={star.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="star-action"
                >
                  <span>Learn More</span>
                  <i className="bi bi-arrow-up-right" />
                </a>
              )}

              {/* Decorative index number */}
              <span className="star-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>

        {/* ==================================================
            CTA
        ================================================== */}
        <div
          className="text-center mt-5"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Link
            to="/college-stars"
            className="btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              background: "linear-gradient(145deg, #A51C30, #7A1523)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "0.7rem 1.7rem",
              fontSize: "0.84rem",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 7px 22px rgba(165, 28, 48, 0.18)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";

              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(165, 28, 48, 0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";

              e.currentTarget.style.boxShadow =
                "0 7px 22px rgba(165, 28, 48, 0.18)";
            }}
          >
            View All College Stars
            <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </div>

      {/* ==================================================
          PROFILE CARD STYLES
      ================================================== */}
      <style>{`
        .stars-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
        }

        /* ==================================================
           PROFILE CARD
        ================================================== */
        .star-profile-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2.5rem 1.25rem 1.25rem;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
          border-radius: 20px;
          overflow: hidden;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease;
        }

        .star-profile-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 45px rgba(0, 0, 0, 0.1);
          border-color: rgba(165, 28, 48, 0.25);
        }

        /* Subtle top gradient bar */
        .star-profile-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 90px;
          background: linear-gradient(
            180deg,
            rgba(165, 28, 48, 0.06),
            rgba(165, 28, 48, 0)
          );
          pointer-events: none;
        }

        /* Faint index number in the corner */
        .star-index {
          position: absolute;
          top: 12px;
          right: 16px;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(165, 28, 48, 0.18);
          letter-spacing: 1px;
        }

        /* ==================================================
           AVATAR
        ================================================== */
        .star-avatar-wrap {
          position: relative;
          width: 118px;
          height: 118px;
          margin-bottom: 1rem;
        }

        .star-avatar-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px dashed rgba(165, 28, 48, 0.3);
          pointer-events: none;
        }

        .star-avatar {
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

        .star-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .star-profile-card:hover .star-avatar img {
          transform: scale(1.06);
        }

        .star-avatar-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #A51C30;
          font-size: 3rem;
        }

        .star-batch-pill {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          background: #A51C30;
          color: #fff;
          padding: 0.22rem 0.65rem;
          border-radius: 50px;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 6px 14px rgba(165, 28, 48, 0.3);
          white-space: nowrap;
          z-index: 2;
        }

        /* ==================================================
           IDENTITY
        ================================================== */
        .star-identity {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 0.85rem;
          width: 100%;
        }

        .star-name {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text, #1d1d1d);
          line-height: 1.25;
          margin: 0 0 0.4rem;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 100%;
        }

        .star-role {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          max-width: 100%;
          color: #A51C30;
          font-size: 0.76rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .star-role i {
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        .star-role span {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-align: center;
        }

        /* ==================================================
           DIVIDER
        ================================================== */
        .star-divider {
          width: 42px;
          height: 2px;
          background: rgba(165, 28, 48, 0.25);
          border-radius: 2px;
          margin: 1rem 0 0.85rem;
        }

        /* ==================================================
           BIO
        ================================================== */
        .star-bio {
          color: var(--color-text-muted, #6c757d);
          font-size: 0.8rem;
          line-height: 1.6;
          margin: 0 0 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ==================================================
           ACTION
        ================================================== */
        .star-action {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding-top: 0.9rem;
          width: 100%;
          border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
          color: #A51C30;
          font-size: 0.76rem;
          font-weight: 700;
          text-decoration: none;
          transition: gap 0.25s ease, color 0.25s ease;
        }

        .star-action:hover {
          color: #7A1523;
          gap: 0.65rem;
        }

        .star-action i {
          transition: transform 0.25s ease;
        }

        .star-action:hover i {
          transform: translate(2px, -2px);
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */
        @media (max-width: 991.98px) {
          .stars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem;
          }
        }

        @media (max-width: 575.98px) {
          .stars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
          }

          .star-profile-card {
            padding: 1.75rem 0.75rem 0.9rem;
            border-radius: 16px;
          }

          .star-avatar-wrap {
            width: 78px;
            height: 78px;
            margin-bottom: 0.65rem;
          }

          .star-avatar-ring {
            inset: -5px;
          }

          .star-avatar {
            box-shadow:
              0 6px 16px rgba(165, 28, 48, 0.15),
              0 0 0 3px var(--card-bg, #ffffff),
              0 0 0 4px rgba(165, 28, 48, 0.13);
          }

          .star-avatar-fallback {
            font-size: 2rem;
          }

          .star-batch-pill {
            font-size: 0.55rem;
            padding: 0.18rem 0.5rem;
            bottom: -3px;
          }

          .star-index {
            font-size: 0.7rem;
            top: 10px;
            right: 12px;
          }

          .star-name {
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
          }

          .star-role {
            font-size: 0.65rem;
          }

          .star-role i {
            font-size: 0.6rem;
          }

          .star-divider {
            width: 30px;
            margin: 0.7rem 0 0.6rem;
          }

          .star-bio {
            font-size: 0.7rem;
            -webkit-line-clamp: 3;
            margin-bottom: 0.75rem;
          }

          .star-action {
            padding-top: 0.7rem;
            font-size: 0.68rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .star-profile-card,
          .star-avatar img,
          .star-action,
          .star-action i {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CollegeStarsSection;
