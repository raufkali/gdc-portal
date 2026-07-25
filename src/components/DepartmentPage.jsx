// src/components/DepartmentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Footer from "../page/Footer";

const DepartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDepartment = async () => {
      setLoading(true);
      setError(false);
      try {
        // Try to find department by ID
        const docRef = doc(db, "departments", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDepartment({ id: docSnap.id, ...docSnap.data() });
        } else {
          // If not found by ID, try to find by name (for old URLs)
          setError(true);
        }
      } catch (error) {
        console.error("Error loading department:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadDepartment();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state - Department not found
  if (error || !department) {
    return (
      <div className="container py-5 text-center">
        <h2 className="display-4 text-muted">Department Not Found</h2>
        <p className="lead">The department you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  // ✅ Department found - Display it!
  return (
    <>
      <div className="bg-white min-vh-100">
        {/* Hero Section */}
        <div
          className="position-relative py-5 d-flex align-items-center"
          style={{
            background: `linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
            minHeight: "400px",
          }}
        >
          <div className="container text-center text-white">
            <h6
              className="text-info text-uppercase fw-bold mb-3"
              style={{ letterSpacing: "3px" }}
            >
              Academic Department
            </h6>
            <h1 className="display-3 fw-bold mb-4">
              Department of <br />
              <span className="text-info">{department.name}</span>
            </h1>
            <p
              className="lead mx-auto opacity-75 mb-4"
              style={{ maxWidth: "700px" }}
            >
              {department.description ||
                "Excellence in education and research."}
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-info btn-lg rounded-pill px-4 fw-bold text-white shadow-lg">
                Explore Programs
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "HOD", val: department.hod || "Not Assigned" },
              { label: "Programs", val: department.courses?.length || 0 },
              { label: "Established", val: "2010" },
              { label: "Students", val: "120+" },
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4 rounded-4 bg-white">
                  <h5 className="fw-bold text-dark mb-0">{stat.val}</h5>
                  <small
                    className="text-muted text-uppercase fw-bold"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {stat.label}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="container py-5 my-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="fw-bold text-dark display-6 mb-4">
                About {department.name}
              </h2>
              <p className="text-secondary fs-5 mb-4">
                {department.description}
              </p>
              <div className="border-start border-info border-4 ps-4 my-4">
                <p className="fst-italic text-dark fs-5">
                  "Head of Department: {department.hod || "To be announced"}"
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
                alt={`${department.name} Department`}
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Programs */}
        {department.courses && department.courses.length > 0 && (
          <div className="bg-light py-5">
            <div className="container py-4 text-center">
              <h2 className="fw-bold mb-2">Programs Offered</h2>
              <div className="row g-4 justify-content-center mt-3">
                {department.courses.map((course, i) => (
                  <div key={i} className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                      <h5 className="fw-bold text-dark">{course}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <style>{`
          .hover-lift { transition: transform 0.4s ease, box-shadow 0.4s ease; }
          .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.15) !important; }
          .btn-info { background-color: #00a2ff; border-color: #00a2ff; }
          .text-info { color: #00a2ff !important; }
          .rounded-5 { border-radius: 2rem !important; }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default DepartmentPage;
