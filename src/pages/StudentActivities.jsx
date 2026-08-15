import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedActivities = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const StudentActivities = () => {
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

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      if (
        cachedActivities &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setActivities(cachedActivities);
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDocs(collection(db, "studentActivities"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (isMounted) {
          cachedActivities = data;
          cacheTimestamp = Date.now();
          setActivities(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching student activities:", error);
        if (cachedActivities && isMounted) {
          setActivities(cachedActivities);
          setLoading(false);
        } else if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-5 mt-5 text-center">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#A51C30" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="display-1 text-muted mb-4">
          <i className="bi bi-people"></i>
        </div>
        <h2
          className="fw-bold"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text)",
          }}
        >
          No Activities Yet
        </h2>
        <p className="text-muted">Stay tuned for upcoming student events.</p>
      </div>
    );
  }

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)", minHeight: "70vh" }}
    >
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.4rem 1.5rem",
              borderRadius: "50px",
              marginBottom: "0.75rem",
            }}
          >
            Student Life
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            Student <span style={{ color: "#A51C30" }}>Activities</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Explore the vibrant events and activities that make our campus life
            special.
          </p>
        </div>

        <div className="row g-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.08)";
                }}
              >
                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    className="card-img-top"
                    alt={activity.title}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="card-body p-4">
                  <h5
                    className="fw-bold"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.2rem",
                      color: "var(--color-text)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {activity.title}
                  </h5>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {activity.date && (
                      <span className="small text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    {activity.location && (
                      <span className="small text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        {activity.location}
                      </span>
                    )}
                  </div>
                  {activity.description && (
                    <p
                      className="card-text small"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {activity.description.length > 120
                        ? activity.description.substring(0, 120) + "..."
                        : activity.description}
                    </p>
                  )}
                  {activity.organizer && (
                    <p className="small text-muted">
                      <i className="bi bi-person me-1"></i> {activity.organizer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentActivities;
