// src/components/Computer.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../page/Footer";

const Computer = () => {
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [facultyError, setFacultyError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFaculty() {
      setFacultyLoading(true);
      setFacultyError("");
      try {
        const q = query(collection(db, "faculty"), orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        if (cancelled) return;

        const all = [];
        querySnapshot.forEach((doc) => {
          all.push({ id: doc.id, ...doc.data() });
        });

        const filtered = all.filter(
          (f) => (f.dept || "").trim().toLowerCase() === "computer science",
        );
        setFaculty(filtered);
      } catch (err) {
        if (!cancelled) {
          console.error("Faculty retrieval crash:", err);
          setFacultyError(
            "Failed to load faculty members. Please ensure the backend server is active.",
          );
        }
      } finally {
        if (!cancelled) setFacultyLoading(false);
      }
    }

    loadFaculty();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="bg-white min-vh-100">
        {/* --- HERO SECTION --- */}
        <div
          className="position-relative py-5 d-flex align-items-center"
          style={{
            background:
              "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat",
            minHeight: "500px",
          }}
        >
          <div className="container text-center text-white">
            <h6
              className="text-info text-uppercase fw-bold mb-1"
              style={{ letterSpacing: "3px" }}
            >
              Excellence in Technology
            </h6>
            <h1 className="display-3 fw-bold mb-1">
              Department of <br />
              <span className="text-info">Computer Science</span>
            </h1>
            <p
              className="lead mx-auto opacity-75 mb-4"
              style={{ maxWidth: "700px" }}
            >
              Bridging the gap between theoretical foundations and modern
              technological innovation at GDC Gulabad.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-info btn-lg rounded-pill px-4 fw-bold text-white shadow-lg">
                Explore Programs
              </button>
              <button className="btn btn-outline-light btn-lg rounded-pill px-4">
                Research Labs
              </button>
            </div>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="container" style={{ marginTop: "-50px" }}>
          <div className="row g-4 justify-content-center">
            {[
              { label: "Established", val: "2010" },
              { label: "Faculty Members", val: "12+" },
              { label: "Success Rate", val: "95%" },
              { label: "Specializations", val: "06" },
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4 rounded-4 bg-white">
                  <h3 className="fw-bold text-dark mb-0">{stat.val}</h3>
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

        {/* --- ABOUT SECTION --- */}
        <div className="container py-5 my-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <h2 className="fw-bold text-dark display-6 mb-4">
                  Pioneering the Digital Frontier
                </h2>
                <p className="text-secondary fs-5 mb-4">
                  The Department of Computer Science at Government Degree
                  College Gulabad provides an extensive and well-balanced
                  academic experience in the field of computing.
                </p>
                <div className="border-start border-info border-4 ps-4 my-4">
                  <p className="fst-italic text-dark fs-5">
                    "Our goal is to cultivate critical thinking and programming
                    excellence to prepare students for careers in the
                    ever-evolving digital world."
                  </p>
                </div>
                <p className="text-secondary">
                  Students gain in-depth knowledge of software engineering,
                  databases, artificial intelligence, and emerging technologies
                  through a curriculum aligned with international standards.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Students working"
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* --- PROGRAMS SECTION --- */}
        <div className="bg-light py-5">
          <div className="container py-4 text-center">
            <h2 className="fw-bold mb-2">Academic Programs</h2>
            <p className="text-muted mb-5">
              Rigorous curricula designed for the modern tech landscape.
            </p>
            <div className="row g-4 text-start">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-info bg-opacity-10 p-3 rounded-3">
                      <i className="bi bi-mortarboard-fill text-info fs-3"></i>
                    </div>
                    <span className="badge bg-dark rounded-pill px-3">
                      2 Years
                    </span>
                  </div>
                  <h4 className="fw-bold">ICS (Computer Science)</h4>
                  <p className="text-secondary">
                    An intermediate program establishing a strong foundation in
                    computer architecture, mathematics, and logical reasoning.
                  </p>
                  <div className="row g-2 mb-3">
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-info me-2"></i>
                      C++ Programming
                    </div>
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-info me-2"></i>
                      Digital Logic
                    </div>
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-info me-2"></i>
                      Data Processing
                    </div>
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-info me-2"></i>
                      Web Basics
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                      <i className="bi bi-laptop text-primary fs-3"></i>
                    </div>
                    <span className="badge bg-primary rounded-pill px-3">
                      4 Years
                    </span>
                  </div>
                  <h4 className="fw-bold">BS Computer Science</h4>
                  <p className="text-secondary">
                    A flagship degree program focused on engineering scalable
                    software systems and solving complex computational problems.
                  </p>
                  <div className="row g-2 mb-3">
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Full Stack Dev
                    </div>
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      AI & Robotics
                    </div>
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Cyber Security
                    </div>
                    <div className="col-6 small text-muted">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Cloud Computing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COURSE HIGHLIGHTS --- */}
        <div className="container py-5 my-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Course Highlights</h2>
            <p className="text-muted">
              Mastering the core pillars of Computer Science
            </p>
            <div
              className="mx-auto bg-info mt-2"
              style={{ height: "3px", width: "60px" }}
            ></div>
          </div>
          <div className="row g-4">
            {[
              {
                icon: "bi-code-slash",
                title: "Software Engineering",
                desc: "Requirement analysis, design patterns, and agile methodologies.",
                tags: ["React", "Python", "Java"],
              },
              {
                icon: "bi-database-fill-gear",
                title: "Data Systems",
                desc: "Advanced SQL, NoSQL architectures, and big data management.",
                tags: ["MySQL", "MongoDB"],
              },
              {
                icon: "bi-cpu",
                title: "Artificial Intelligence",
                desc: "Exploring neural networks, deep learning, and automation.",
                tags: ["TensorFlow", "NLP"],
              },
              {
                icon: "bi-shield-lock",
                title: "Network Security",
                desc: "Cryptography, secure protocols, and ethical hacking.",
                tags: ["CCNA", "Security+"],
              },
            ].map((c, i) => (
              <div key={i} className="col-md-3">
                <div className="p-4 rounded-4 border-0 shadow-sm bg-white text-center h-100 hover-lift">
                  <div className="text-info mb-3">
                    <i className={`${c.icon} fs-1`}></i>
                  </div>
                  <h6 className="fw-bold text-dark">{c.title}</h6>
                  <p className="small text-muted mb-3">{c.desc}</p>
                  <div className="d-flex flex-wrap justify-content-center gap-1">
                    {c.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="badge bg-light text-dark border small"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FACULTY SECTION (dynamic — fetched from Firebase) --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Expert Faculty</h2>
            <p className="text-muted">
              Academic leaders dedicated to student success and research
              innovation.
            </p>
          </div>

          {facultyLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading faculty...</span>
              </div>
            </div>
          ) : facultyError ? (
            <div className="alert alert-danger text-center">{facultyError}</div>
          ) : faculty.length === 0 ? (
            <div className="text-center text-muted py-5 border rounded-3 bg-light bg-opacity-50">
              No faculty members have been added for this department yet.
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {faculty.map((f) => (
                <div key={f.id} className="col-lg-4 col-md-6 text-center">
                  <div className="card border-0 shadow-sm p-4 rounded-5 h-100 hover-lift">
                    <div className="position-relative d-inline-block mx-auto mb-4">
                      <img
                        src={
                          f.url ||
                          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                        }
                        className="rounded-circle border border-5 border-info border-opacity-10 shadow-sm"
                        width="130"
                        height="130"
                        alt={f.name}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="position-absolute bottom-0 end-0 bg-info rounded-circle p-2 shadow">
                        <i className="bi bi-patch-check-fill text-white"></i>
                      </div>
                    </div>
                    <h5 className="fw-bold mb-1">{f.name}</h5>
                    <p
                      className="text-info small fw-bold text-uppercase mb-2"
                      style={{ letterSpacing: "1px" }}
                    >
                      {f.designation || "Faculty Member"}
                    </p>
                    <p className="text-muted small mb-3">{f.qualification}</p>
                    <div className="bg-light p-2 rounded-3">
                      <small className="text-dark fw-bold">
                        Expertise: {f.bio || "General Computer Science"}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="container mb-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg">
            <h2 className="fw-bold mb-3">Ready to start your journey?</h2>
            <p className="opacity-75 mb-4">
              Admissions are open for the Fall 2026 session. Join the next
              generation of innovators.
            </p>
            <button className="btn btn-info text-white px-5 py-3 rounded-pill fw-bold shadow">
              Apply Now
            </button>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; }
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

export default Computer;
