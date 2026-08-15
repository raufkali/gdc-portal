import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedActivities = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const StudentActivitiesSection = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      if (
        cachedActivities &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setActivities(cachedActivities.slice(0, 4));
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDocs(collection(db, "studentActivities"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        cachedActivities = data;
        cacheTimestamp = Date.now();
        if (isMounted) {
          setActivities(data.slice(0, 4));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching student activities:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchActivities();
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

  if (!activities.length) return null;

  return (
    <section className="py-5" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container">
        <div className="text-center mb-4" data-aos="fade-up">
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
            Student Life
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
            Student <span style={{ color: "#A51C30" }}>Activities</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Events and activities that bring our campus to life
          </p>
        </div>

        <div className="row g-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="col-md-3 col-sm-6"
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
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.08)";
                }}
              >
                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    className="card-img-top"
                    alt={activity.title}
                    style={{ height: "160px", objectFit: "cover" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="card-body p-3">
                  <h6
                    className="fw-bold"
                    style={{ color: "var(--color-text)", fontSize: "1rem" }}
                  >
                    {activity.title}
                  </h6>
                  {activity.date && (
                    <p className="small text-muted mb-1">
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {activity.location && (
                    <p className="small text-muted">
                      <i className="bi bi-geo-alt me-1"></i> {activity.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link
            to="/student-activities"
            className="btn"
            style={{
              background: "transparent",
              color: "#A51C30",
              padding: "0.5rem 2rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "0.9rem",
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
            View All Activities <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudentActivitiesSection;
