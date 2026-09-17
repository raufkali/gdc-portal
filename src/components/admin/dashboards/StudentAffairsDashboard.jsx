import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";

const StudentAffairsDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    collegeStars: 0,
    achievements: 0,
    activities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentStats = async () => {
      setLoading(true);
      try {
        const [starsSnap, achSnap, actSnap] = await Promise.all([
          getDocs(collection(db, "collegeStars")),
          getDocs(collection(db, "studentAchievements")),
          getDocs(collection(db, "studentActivities")),
        ]);

        setStats({
          collegeStars: starsSnap.size,
          achievements: achSnap.size,
          activities: actSnap.size,
        });
      } catch (err) {
        console.error("Student Affairs stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, []);

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
            Welcome, <span style={{ color: "#A51C30" }}>{userProfile?.name || "Student Affairs Manager"}</span>
          </h4>
          <p className="text-muted small mb-0">
            <i className="bi bi-mortarboard me-1"></i> Student Highlights, Star Students & Extracurricular Activities
          </p>
        </div>
        <div>
          <span
            className="badge p-2 px-3"
            style={{ background: "rgba(25, 135, 84, 0.1)", color: "#198754" }}
          >
            <i className="bi bi-award me-1"></i> Student Affairs Management
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "46px", height: "46px", background: "rgba(165, 28, 48, 0.08)", color: "#A51C30" }}>
                  <i className="bi bi-star-fill fs-5"></i>
                </div>
                <h2 className="fw-bold mb-0" style={{ color: "var(--color-text)" }}>
                  {stats.collegeStars}
                </h2>
              </div>
              <h6 className="fw-bold mb-1">College Stars</h6>
              <p className="text-muted small mb-3">Distinguished students, position holders, and academic achievers.</p>
              <Link to="/admin/students" className="btn btn-sm text-white rounded-pill px-3" style={{ backgroundColor: "#A51C30" }}>
                Manage Stars <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "46px", height: "46px", background: "rgba(40, 167, 69, 0.1)", color: "#28a745" }}>
                  <i className="bi bi-trophy-fill fs-5"></i>
                </div>
                <h2 className="fw-bold mb-0" style={{ color: "var(--color-text)" }}>
                  {stats.achievements}
                </h2>
              </div>
              <h6 className="fw-bold mb-1">Student Achievements</h6>
              <p className="text-muted small mb-3">Competitions, awards, national/regional sports, and honors.</p>
              <Link to="/admin/students" className="btn btn-sm text-white rounded-pill px-3" style={{ backgroundColor: "#28a745" }}>
                Manage Achievements <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "46px", height: "46px", background: "rgba(13, 110, 253, 0.1)", color: "#0d6efd" }}>
                  <i className="bi bi-people-fill fs-5"></i>
                </div>
                <h2 className="fw-bold mb-0" style={{ color: "var(--color-text)" }}>
                  {stats.activities}
                </h2>
              </div>
              <h6 className="fw-bold mb-1">Student Activities</h6>
              <p className="text-muted small mb-3">Workshops, debates, cultural days, societies, and clubs.</p>
              <Link to="/admin/students" className="btn btn-sm text-white rounded-pill px-3" style={{ backgroundColor: "#0d6efd" }}>
                Manage Activities <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAffairsDashboard;
