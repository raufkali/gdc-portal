// src/page/Departments.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Departments = () => {
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
      <div className="text-center py-5">
        <div className="spinner-border text-gold" role="status" />
      </div>
    );
  }

  const deptIcons = [
    "bi-laptop",
    "bi-flask",
    "bi-cpu",
    "bi-calculator",
    "bi-book",
    "bi-translate",
    "bi-building",
    "bi-bank",
    "bi-tree",
    "bi-bug",
  ];

  return (
    <section className="departments-section">
      <div className="container-custom">
        <div className="section-title">
          <h2>Academic Departments</h2>
          <p className="subtitle">
            Explore our diverse range of academic programs
          </p>
          <div className="divider" />
        </div>

        {departments.length === 0 ? (
          <p className="text-center text-muted">
            No departments available yet.
          </p>
        ) : (
          <div className="dept-grid">
            {departments.map((dept, index) => (
              <Link
                to={`/department/${dept.id}`}
                className="dept-card"
                key={dept.id}
              >
                <div className="icon">
                  <i className={deptIcons[index % deptIcons.length]}></i>
                </div>
                <h5>{dept.name}</h5>
                <div className="dept-hod">HOD: {dept.hod || "TBA"}</div>
                <p className="dept-desc">
                  {dept.description || "Department of Excellence"}
                </p>
                {dept.courses && dept.courses.length > 0 && (
                  <div className="dept-courses">
                    {dept.courses.slice(0, 3).map((course, i) => (
                      <span key={i}>{course}</span>
                    ))}
                    {dept.courses.length > 3 && (
                      <span>+{dept.courses.length - 3} more</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .text-gold { color: var(--gdc-gold); }
        .dept-grid a { text-decoration: none; }
      `}</style>
    </section>
  );
};

export default Departments;
