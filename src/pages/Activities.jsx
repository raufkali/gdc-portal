import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";
import { useNotification } from "../contexts/NotificationContext";

//  Cache for activities
let cachedActivities = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const Activities = () => {
  const { showSuccess, showError } = useNotification();
  //  Initialize with cached data if available
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

  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      //  If cache is valid, skip fetching
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

  // Share function using Web Share API
  const handleShare = async (activity) => {
    const shareData = {
      title: activity.title,
      text: `${activity.title}\n\n${activity.content?.substring(0, 150)}...`,
      url: window.location.href,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        // User cancelled or share failed
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        showSuccess("Link copied to clipboard!");
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        showError("Copy the link manually: " + window.location.href);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
    >
      <div className="container">
        {/* Page Header */}
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
            Campus Life
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
            Recent <span style={{ color: "#A51C30" }}>Activities</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Stay updated with the latest events, achievements, and happenings at
            GDC Gulabad
          </p>
          {fromCache && process.env.NODE_ENV === "development" && (
            <span
              style={{
                fontSize: "0.65rem",
                color: "#28a745",
                background: "rgba(40, 167, 69, 0.1)",
                padding: "0.15rem 0.8rem",
                borderRadius: "50px",
                display: "inline-block",
                marginTop: "0.5rem",
              }}
            ></span>
          )}
        </div>

        {/* Share Success Toast */}
        {shareSuccess && (
          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "20px",
              zIndex: 9999,
              background: "#28a745",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "50px",
              boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
              fontSize: "0.95rem",
              fontWeight: "500",
              animation: "slideIn 0.3s ease",
            }}
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            Link shared successfully!
          </div>
        )}

        {/* Activities Feed */}
        {activities.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-calendar-event"></i>
            </div>
            <h4 className="text-muted">No activities yet</h4>
            <p className="text-muted small">
              Please check back later for updates.
            </p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="mb-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className="card border-0 shadow-sm"
                    style={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      backgroundColor: "var(--card-bg)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 30px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 5px 15px rgba(0,0,0,0.05)";
                    }}
                  >
                    {/* Image with Date Badge */}
                    {activity.imageUrl && (
                      <div style={{ position: "relative" }}>
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          style={{
                            width: "100%",
                            height: "220px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "1rem",
                            left: "1rem",
                            background: "rgba(165, 28, 48, 0.9)",
                            color: "#fff",
                            padding: "0.35rem 1rem",
                            borderRadius: "50px",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="card-body p-4">
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          color: "var(--color-text)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {activity.title}
                      </h4>

                      {activity.author && (
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#A51C30",
                            fontWeight: "500",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <i className="bi bi-person-circle me-1"></i>
                          {activity.author}
                        </p>
                      )}

                      <p
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: "1.8",
                          color: "var(--color-text)",
                          marginBottom: "1rem",
                        }}
                      >
                        {activity.content}
                      </p>
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        {/* Read More */}
                        <Link
                          to={`/activities/${activity.slug || activity.id}`}
                          className="btn"
                          style={{
                            background: "#A51C30",
                            color: "#fff",
                            border: "1px solid #A51C30",
                            borderRadius: "50px",
                            padding: "0.45rem 1.3rem",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#7A1523";
                            e.currentTarget.style.borderColor = "#7A1523";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 15px rgba(165, 28, 48, 0.25)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#A51C30";
                            e.currentTarget.style.borderColor = "#A51C30";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Read More
                          <i className="bi bi-arrow-right"></i>
                        </Link>

                        {/* Share */}
                        <button
                          onClick={() => handleShare(activity)}
                          className="btn"
                          style={{
                            background: "transparent",
                            color: "var(--color-text-muted)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "50px",
                            padding: "0.45rem 1.2rem",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#A51C30";
                            e.currentTarget.style.color = "#A51C30";
                            e.currentTarget.style.background =
                              "rgba(165, 28, 48, 0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--color-border)";
                            e.currentTarget.style.color =
                              "var(--color-text-muted)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <i className="bi bi-share"></i>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Section */}
        {activities.length > 0 && (
          <div
            className="text-center mt-5 pt-3"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                background: "var(--color-bg)",
                padding: "2rem 1rem",
              }}
            >
              <h4
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.3rem, 1.8vw, 1.8rem)",
                  fontWeight: "700",
                  color: "var(--color-text)",
                  marginBottom: "0.5rem",
                }}
              >
                Want to <span style={{ color: "#A51C30" }}>Share</span> Your
                Story?
              </h4>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "1rem",
                  maxWidth: "500px",
                  margin: "0 auto 1.2rem",
                }}
              >
                We'd love to hear about your achievements and experiences at GDC
                Gulabad.
              </p>
              <Link
                to="/contact"
                className="btn"
                style={{
                  background: "linear-gradient(145deg, #A51C30, #7A1523)",
                  color: "#fff",
                  padding: "0.6rem 2.2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                  display: "inline-block",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 8px 30px rgba(165, 28, 48, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(165, 28, 48, 0.3)";
                }}
              >
                <i className="bi bi-send me-2"></i>
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
