import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";
import { formatDate } from "../../utils/helpers";

//  Cache for activities
let cachedActivities = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const ActivitiesSection = () => {
  const [activities, setActivities] = useState(() => {
    if (
      cachedActivities &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedActivities;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedActivities &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedActivities &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    const fetchActivities = async () => {
      if (
        cachedActivities &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setActivities(cachedActivities);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("activities", [
          { type: "orderBy", field: "date", direction: "desc" },
        ]);
        cachedActivities = data;
        cacheTimestamp = Date.now();
        setActivities(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        if (cachedActivities) {
          setActivities(cachedActivities);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading activities...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!activities.length) return null;

  const displayActivities = activities.slice(0, 3);

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--color-primary-dark)" }}
    >
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "var(--color-primary-dark)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
              border: "2px solid #ffff",
            }}
          >
            Campus Life
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "#ffff",
              marginBottom: "0.25rem",
            }}
          >
            Recent Activities
          </h2>
          <p
            style={{
              color: "var(--color-text-light)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Stay updated with the latest events and happenings
          </p>
        </div>

        <div className="row g-4">
          {displayActivities.map((activity, indx) => (
            <div key={activity.id} className="col-md-4">
              <div
                data-aos={`${indx % 2 == 0 ? "fade-left" : "fade-right"}`}
                data-aos-duration="600"
                data-aos-once="false"
                data-aos-delay="100"
                className="card h-100 shadow-sm border-0 hover-lift"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    className="card-img-top"
                    alt={activity.title}
                    loading="lazy"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title fw-bold"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.1rem",
                      color: "var(--color-text)",
                    }}
                  >
                    {activity.title}
                  </h5>
                  <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-calendar3 me-1"></i>
                    {formatDate(activity.date)}
                  </small>
                  <p
                    className="card-text mt-2 flex-grow-1"
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.85rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {activity.content?.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/activities/${activity.slug || activity.id}`}
                    className="btn btn-sm align-self-start"
                    style={{
                      background: "#A51C30",
                      color: "#fff",
                      borderRadius: "50px",
                      padding: "0.3rem 1.5rem",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      border: "none",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#7A1523";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(165, 28, 48, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#A51C30";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-arrow-right me-1"></i> Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/activities"
            className="btn"
            style={{
              background: "transparent",
              color: "#ffffff",
              padding: "0.6rem 2.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "2px solid #ffffff",
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f4304d";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(165, 28, 48, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i> All Activities
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
