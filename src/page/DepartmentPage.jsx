// src/page/DepartmentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Footer from "./Footer";

const DepartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDept = async () => {
      try {
        const docRef = doc(db, "departments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDept({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate("/departments");
        }
      } catch (error) {
        console.error("Error loading department:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDept();
  }, [id, navigate]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-gold" role="status" />
      </div>
    );
  }

  if (!dept) return null;

  return (
    <>
      <section className="dept-hero">
        <div className="container-custom">
          <div className="dept-hero-content">
            <span className="hero-badge">Department</span>
            <h1>{dept.name}</h1>
            <p>{dept.description || "Department of Excellence"}</p>
          </div>
        </div>
      </section>

      <section className="dept-content">
        <div className="container-custom">
          <div className="dept-grid">
            <div className="dept-info">
              <div className="dept-card-detail">
                <h3>About the Department</h3>
                <p>
                  {dept.description ||
                    `${dept.name} department is committed to academic excellence and research.`}
                </p>
              </div>

              {dept.courses && dept.courses.length > 0 && (
                <div className="dept-card-detail">
                  <h3>Programs Offered</h3>
                  <div className="course-list">
                    {dept.courses.map((course, i) => (
                      <span key={i} className="course-tag">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="dept-sidebar">
              <div className="dept-card-detail">
                <h4>Department Head</h4>
                <p className="hod-name">{dept.hod || "To be announced"}</p>
              </div>
              <div className="dept-card-detail">
                <h4>Contact</h4>
                <p>
                  <i className="bi bi-envelope"></i>{" "}
                  {dept.email || "dept@gdc.edu.pk"}
                </p>
                <p>
                  <i className="bi bi-telephone"></i>{" "}
                  {dept.phone || "+92 945 123456"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .dept-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .dept-hero-content { max-width: 700px; }
        .dept-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; font-family: var(--font-serif); }
        .dept-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .dept-content { padding: 60px 0; background: #f8f9fa; }
        .dept-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
        .dept-card-detail { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .dept-card-detail h3 { font-size: 1.3rem; margin-bottom: 12px; font-family: var(--font-serif); }
        .dept-card-detail h4 { font-size: 1rem; margin-bottom: 8px; color: #0f172a; }
        .dept-card-detail p { color: #555; line-height: 1.7; }
        .course-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .course-tag { padding: 6px 16px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 50px; font-size: 0.85rem; color: #0f172a; }
        .hod-name { font-size: 1.1rem; font-weight: 600; color: var(--gdc-gold); }
        .dept-sidebar .dept-card-detail p { display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 0.9rem; }

        @media (max-width: 768px) {
          .dept-hero { padding: 100px 0 40px; }
          .dept-hero-content h1 { font-size: 2.2rem; }
          .dept-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default DepartmentPage;
