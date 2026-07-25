// src/page/DepartmentList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const q = query(collection(db, "departments"), orderBy("name"));
        const snapshot = await getDocs(q);
        const depts = [];
        snapshot.forEach((doc) => depts.push({ id: doc.id, ...doc.data() }));
        setDepartments(depts);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

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

  const icons = [
    "bi-laptop",
    "bi-flask",
    "bi-lightning",
    "bi-calculator",
    "bi-book",
    "bi-translate",
    "bi-building",
    "bi-bank",
    "bi-bug",
    "bi-flower1",
  ];

  return (
    <>
      {/* Hero */}
      <section className="deptlist-hero">
        <div className="container-custom">
          <div className="deptlist-hero-content">
            <span className="hero-badge">Explore</span>
            <h1>
              Academic <span className="highlight">Departments</span>
            </h1>
            <p>Discover our diverse range of academic programs</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="deptlist-grid">
        <div className="container-custom">
          {departments.length === 0 ? (
            <p className="text-center text-muted">No departments available.</p>
          ) : (
            <div className="deptlist-grid-items">
              {departments.map((dept, i) => (
                <Link
                  to={`/department/${dept.id}`}
                  key={dept.id}
                  className="deptlist-card"
                >
                  <div className="deptlist-icon">
                    <i className={icons[i % icons.length]}></i>
                  </div>
                  <h4>{dept.name}</h4>
                  <p>{dept.description || "Department of Excellence"}</p>
                  <span>HOD: {dept.hod || "TBA"}</span>
                  {dept.courses && dept.courses.length > 0 && (
                    <div className="deptlist-courses">
                      {dept.courses.slice(0, 2).map((c, idx) => (
                        <span key={idx}>{c}</span>
                      ))}
                      {dept.courses.length > 2 && (
                        <span>+{dept.courses.length - 2} more</span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .deptlist-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .deptlist-hero-content { max-width: 600px; }
        .deptlist-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; }
        .deptlist-hero-content h1 .highlight { color: #b8860b; }
        .deptlist-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .deptlist-grid { padding: 60px 0; background: #f8f9fa; }
        .deptlist-grid-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .deptlist-card {
          background: #fff; border-radius: 12px; padding: 24px; text-decoration: none; color: inherit;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04); transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .deptlist-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: #b8860b;
        }
        .deptlist-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(184,134,11,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #b8860b; margin-bottom: 12px; }
        .deptlist-card h4 { margin: 0 0 4px; }
        .deptlist-card p { color: #6c757d; font-size: 0.9rem; margin: 0 0 8px; }
        .deptlist-card span { font-size: 0.85rem; color: #0a1628; }
        .deptlist-courses { margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap; }
        .deptlist-courses span { font-size: 0.7rem; padding: 2px 12px; background: #f8f9fa; border-radius: 20px; color: #6c757d; }
        @media (max-width: 768px) {
          .deptlist-hero { padding: 100px 0 40px; }
          .deptlist-hero-content h1 { font-size: 2.2rem; }
        }
      `}</style>
    </>
  );
};

export default DepartmentList;
