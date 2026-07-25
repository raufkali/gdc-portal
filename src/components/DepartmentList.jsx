// src/components/DepartmentList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Footer from "../page/Footer";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const q = query(collection(db, "departments"), orderBy("name"));
        const snapshot = await getDocs(q);
        const depts = [];
        snapshot.forEach((doc) => {
          depts.push({ id: doc.id, ...doc.data() });
        });
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold">Academic Departments</h1>
            <p className="text-muted">
              Explore our diverse range of academic programs
            </p>
            <div
              className="mx-auto bg-primary"
              style={{ height: "3px", width: "60px" }}
            ></div>
          </div>

          {departments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No departments available yet.</p>
            </div>
          ) : (
            <div className="row g-4">
              {departments.map((dept) => (
                <div key={dept.id} className="col-md-4 col-lg-3">
                  <Link
                    to={`/department/${dept.id}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 border-0 shadow-sm hover-card">
                      <div className="card-body text-center p-4">
                        <div className="dept-icon mb-3">
                          <i className="bi bi-building fs-1 text-primary"></i>
                        </div>
                        <h5 className="card-title fw-bold">{dept.name}</h5>
                        <p className="card-text text-muted small">
                          {dept.description || "Department of Excellence"}
                        </p>
                        <span className="badge bg-primary">
                          HOD: {dept.hod || "TBA"}
                        </span>
                        {dept.courses && dept.courses.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">
                              {dept.courses.length} Programs
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          border-color: #0d6efd !important;
        }
        .vh-50 { min-height: 50vh; }
        .dept-icon i { font-size: 2.5rem; color: #0d6efd; }
      `}</style>

      <Footer />
    </>
  );
};

export default DepartmentList;
