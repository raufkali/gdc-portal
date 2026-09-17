import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";

const PrincipalDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    announcements: 0,
    results: 0,
    messages: 0,
    departments: 0,
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrincipalData = async () => {
      setLoading(true);
      try {
        const [annSnap, resSnap, msgSnap, depSnap] = await Promise.all([
          getDocs(collection(db, "announcements")),
          getDocs(collection(db, "examResults")),
          getDocs(collection(db, "contacts")),
          getDocs(collection(db, "departments")),
        ]);

        setStats({
          announcements: annSnap.size,
          results: resSnap.size,
          messages: msgSnap.size,
          departments: depSnap.size,
        });

        // Recent announcements
        const annList = annSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(a.date || 0);
            const dateB = b.date?.toDate?.() || new Date(b.date || 0);
            return dateB - dateA;
          })
          .slice(0, 5);
        setRecentAnnouncements(annList);

        // Recent messages
        const msgList = msgSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const dateA = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
            const dateB = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
            return dateB - dateA;
          })
          .slice(0, 5);
        setRecentMessages(msgList);
      } catch (err) {
        console.error("Principal dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrincipalData();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ height: "350px" }}>
        <div className="spinner-border" role="status" style={{ color: "#A51C30", width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "var(--color-text)" }}>
            Welcome, <span style={{ color: "#A51C30" }}>{userProfile?.name || "Principal"}</span>
          </h4>
          <p className="text-muted small mb-0">
            <i className="bi bi-briefcase me-1"></i> Executive Portal Overview & Communication Dashboard
          </p>
        </div>
        <div>
          <span
            className="badge p-2 px-3"
            style={{ background: "rgba(111, 66, 193, 0.1)", color: "#6f42c1" }}
          >
            <i className="bi bi-shield-check me-1"></i> Executive Access
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Announcements
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>
                    {stats.announcements}
                  </h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(165, 28, 48, 0.08)", color: "#A51C30" }}>
                  <i className="bi bi-megaphone fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Exam Results
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>
                    {stats.results}
                  </h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(13, 110, 253, 0.08)", color: "#0d6efd" }}>
                  <i className="bi bi-file-earmark-pdf fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Messages
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>
                    {stats.messages}
                  </h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(25, 135, 84, 0.08)", color: "#198754" }}>
                  <i className="bi bi-envelope fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                    Departments
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>
                    {stats.departments}
                  </h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "rgba(253, 126, 20, 0.08)", color: "#fd7e14" }}>
                  <i className="bi bi-building fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="row g-3">
        {/* Recent Announcements */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: "var(--color-text)" }}>
                  <i className="bi bi-megaphone me-2" style={{ color: "#A51C30" }}></i>
                  Official Notifications
                </h6>
                <Link to="/admin/announcements" className="btn btn-sm" style={{ color: "#A51C30", fontSize: "0.75rem", fontWeight: "500" }}>
                  Manage
                </Link>
              </div>

              {recentAnnouncements.length === 0 ? (
                <p className="text-muted text-center py-4 small">No announcements posted yet.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {recentAnnouncements.map((item) => (
                    <li key={item.id} className="d-flex align-items-start gap-2 mb-2 pb-2" style={{ borderBottom: "1px solid var(--color-border, #E5E5E5)" }}>
                      <div className="rounded-circle flex-shrink-0" style={{ width: "6px", height: "6px", background: "#A51C30", marginTop: "6px" }} />
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <p className="mb-0 small fw-medium text-truncate" style={{ color: "var(--color-text)" }}>
                          {item.title || "Untitled"}
                        </p>
                        <small className="text-muted" style={{ fontSize: "0.68rem" }}>
                          {formatDate(item.date)} {item.author && ` • ${item.author}`}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: "var(--color-text)" }}>
                  <i className="bi bi-envelope me-2" style={{ color: "#A51C30" }}></i>
                  College Inquiries
                </h6>
                <Link to="/admin/messages" className="btn btn-sm" style={{ color: "#A51C30", fontSize: "0.75rem", fontWeight: "500" }}>
                  View All
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <p className="text-muted text-center py-4 small">No messages received yet.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {recentMessages.map((item) => (
                    <li key={item.id} className="d-flex align-items-start gap-2 mb-2 pb-2" style={{ borderBottom: "1px solid var(--color-border, #E5E5E5)" }}>
                      <div className="rounded-circle flex-shrink-0" style={{ width: "6px", height: "6px", background: "#0d6efd", marginTop: "6px" }} />
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="mb-0 small fw-medium text-truncate" style={{ color: "var(--color-text)" }}>
                            {item.name || "Anonymous"}
                          </p>
                          <small className="text-muted" style={{ fontSize: "0.65rem" }}>
                            {formatDate(item.timestamp)}
                          </small>
                        </div>
                        <small className="text-muted text-truncate d-block" style={{ fontSize: "0.72rem" }}>
                          {item.subject || item.message || "No content"}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
