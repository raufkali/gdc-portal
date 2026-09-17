import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/config";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";

const HODDashboard = () => {
  const { userProfile, departmentId } = useAuth();
  const [department, setDepartment] = useState(null);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [resultsCount, setResultsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (!departmentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const deptRef = doc(db, "departments", departmentId);
        const deptSnap = await getDoc(deptRef);

        if (deptSnap.exists()) {
          setDepartment({ id: deptSnap.id, ...deptSnap.data() });
        }

        // Department-scoped announcements count
        const annQ = query(
          collection(db, "announcements"),
          where("departmentId", "==", departmentId)
        );
        const annSnap = await getDocs(annQ);
        setAnnouncementsCount(annSnap.size);

        // Department-scoped results count
        const resQ = query(
          collection(db, "examResults"),
          where("departmentId", "==", departmentId)
        );
        const resSnap = await getDocs(resQ);
        setResultsCount(resSnap.size);
      } catch (err) {
        console.error("HOD dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [departmentId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ height: "350px" }}>
        <div className="spinner-border" role="status" style={{ color: "#A51C30", width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!departmentId) {
    return (
      <div className="alert alert-warning p-4 rounded-3 text-center my-4">
        <i className="bi bi-exclamation-triangle-fill fs-2 text-warning d-block mb-2"></i>
        <h5 className="fw-bold">No Department Assigned</h5>
        <p className="small text-muted mb-0">
          Your account has the Head of Department role, but has not yet been assigned to a department. Please contact the administrator.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "var(--color-text)" }}>
            Welcome, <span style={{ color: "#A51C30" }}>{userProfile?.name || "HOD"}</span>
          </h4>
          <p className="text-muted small mb-0">
            <i className="bi bi-building me-1"></i> Managing Department:{" "}
            <strong>{department?.name || userProfile?.departmentName || departmentId}</strong>
          </p>
        </div>
        <div>
          <span
            className="badge p-2 px-3"
            style={{ background: "rgba(253, 126, 20, 0.12)", color: "#fd7e14", border: "1px solid #fd7e14" }}
          >
            <i className="bi bi-shield-lock me-1"></i> Department-Scoped Access
          </span>
        </div>
      </div>

      {/* Department Overview Card */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "12px", backgroundColor: "var(--card-bg)" }}
      >
        <div className="card-body p-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-3 text-center">
              {department?.imageUrl ? (
                <img
                  src={department.imageUrl}
                  alt={department.name}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center mx-auto rounded"
                  style={{
                    width: "100%",
                    height: "140px",
                    background: "rgba(165, 28, 48, 0.08)",
                    color: "#A51C30",
                  }}
                >
                  <i className="bi bi-building display-4"></i>
                </div>
              )}
            </div>
            <div className="col-12 col-md-9">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: "var(--color-text)" }}>
                    {department?.name || "Department"}
                  </h4>
                  <p className="text-muted small mb-2">{department?.subtitle || "Academic Department"}</p>
                </div>
                <Link
                  to="/admin/departments"
                  className="btn btn-sm text-white px-3"
                  style={{
                    backgroundColor: "#A51C30",
                    borderRadius: "50px",
                    fontSize: "0.8rem",
                  }}
                >
                  <i className="bi bi-pencil me-1"></i> Edit Department
                </Link>
              </div>

              <p className="text-muted small mb-3" style={{ lineHeight: "1.6" }}>
                {department?.description || "No department description provided yet."}
              </p>

              <div className="d-flex flex-wrap gap-3">
                <span className="badge p-2 px-3 bg-light text-dark border">
                  <i className="bi bi-people me-1 text-primary"></i> Faculty Count:{" "}
                  <strong>{department?.facultyCount || "0"}</strong>
                </span>
                <span className="badge p-2 px-3 bg-light text-dark border">
                  <i className="bi bi-person-badge me-1 text-success"></i> Head:{" "}
                  <strong>{department?.headName || userProfile?.name || "HOD"}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                  Department Announcements
                </h6>
                <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "#A51C30" }}>
                  {announcementsCount}
                </h3>
              </div>
              <Link
                to="/admin/announcements"
                className="btn btn-sm text-white rounded-pill px-3"
                style={{ backgroundColor: "#A51C30", fontSize: "0.8rem" }}
              >
                Manage
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "var(--card-bg)" }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted small text-uppercase mb-0 fw-semibold" style={{ fontSize: "0.65rem" }}>
                  Department Exam Results
                </h6>
                <h3 className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "#0d6efd" }}>
                  {resultsCount}
                </h3>
              </div>
              <Link
                to="/admin/results"
                className="btn btn-sm text-white rounded-pill px-3"
                style={{ backgroundColor: "#0d6efd", fontSize: "0.8rem" }}
              >
                Manage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
