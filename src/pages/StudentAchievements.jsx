import React from "react";
import { Link } from "react-router-dom";

const StudentAchievements = () => {
  return (
    <div className="container py-5 mt-5" style={{ minHeight: "70vh" }}>
      <div className="text-center py-5">
        <div className="display-1 text-muted mb-4">
          <i className="bi bi-trophy" style={{ color: "#A51C30" }}></i>
        </div>
        <h1
          className="fw-bold"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text)",
          }}
        >
          Student Achievements
        </h1>
        <p
          className="lead text-muted"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          Celebrating the success of our students. This page is coming soon.
        </p>
        <Link
          to="/"
          className="btn mt-4 rounded-pill px-4"
          style={{
            background: "#A51C30",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#7A1523")}
          onMouseLeave={(e) => (e.target.style.background = "#A51C30")}
        >
          <i className="bi bi-house me-2"></i> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default StudentAchievements;
