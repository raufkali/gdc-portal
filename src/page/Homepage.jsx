// src/page/Homepage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Principal from "./Principal";
import Footer from "./Footer";

function Homepage() {
  const [departments, setDepartments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptQuery = query(collection(db, "departments"), orderBy("name"));
        const deptSnap = await getDocs(deptQuery);
        const depts = [];
        deptSnap.forEach((doc) => depts.push({ id: doc.id, ...doc.data() }));
        setDepartments(depts);

        // Fetch latest notices
        const noticeQuery = query(
          collection(db, "announcements"),
          orderBy("date", "desc"),
          limit(5),
        );
        const noticeSnap = await getDocs(noticeQuery);
        const noticesList = [];
        noticeSnap.forEach((doc) =>
          noticesList.push({ id: doc.id, ...doc.data() }),
        );
        setNotices(noticesList);

        // Fetch latest media
        const mediaQuery = query(
          collection(db, "media"),
          orderBy("createdAt", "desc"),
          limit(6),
        );
        const mediaSnap = await getDocs(mediaQuery);
        const mediaList = [];
        mediaSnap.forEach((doc) =>
          mediaList.push({ id: doc.id, ...doc.data() }),
        );
        setMedia(mediaList);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { number: "1200+", label: "Students" },
    { number: "45+", label: "Faculty" },
    { number: "12", label: "Programs" },
    { number: "25+", label: "Years" },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-gold" role="status" />
      </div>
    );
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-harvard">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className="hero-bg"
            style={{
              backgroundImage: `url(${img})`,
              opacity: currentImage === idx ? 0.5 : 0,
              transition: "opacity 1.5s ease",
            }}
          />
        ))}
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-badge">Since 1995</span>
          <h1>
            Shape Your <span className="highlight">Future</span>
            <br />
            at GDC Gulabad
          </h1>
          <p className="hero-desc">
            Join a community dedicated to academic rigor and character building
            under the Higher Education Department of KPK.
          </p>

          <div className="d-flex flex-wrap gap-3 mb-5">
            <a
              href="https://admission.hed.gkp.pk/"
              target="_blank"
              rel="noreferrer"
              className="btn-gdc btn-gdc-primary"
            >
              Apply Now <i className="bi bi-arrow-right"></i>
            </a>
            <Link to="/about-college" className="btn-gdc btn-gdc-outline">
              Learn More
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="number">{stat.number}</div>
                <div className="label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL SECTION */}
      <Principal />

      {/* DEPARTMENTS SECTION */}
      <section className="home-departments">
        <div className="container-custom">
          <div className="section-title">
            <h2>Academic Departments</h2>
            <p className="subtitle">
              Explore our diverse range of academic programs
            </p>
            <div className="divider" />
          </div>

          {departments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No departments added yet.</p>
            </div>
          ) : (
            <div className="row g-4">
              {departments.slice(0, 8).map((dept) => (
                <div key={dept.id} className="col-lg-3 col-md-4 col-sm-6">
                  <Link
                    to={`/department/${dept.id}`}
                    className="text-decoration-none"
                  >
                    <div className="home-dept-card">
                      <div className="home-dept-icon">
                        <i className="bi bi-building"></i>
                      </div>
                      <h6>{dept.name}</h6>
                      <small>{dept.hod || "TBA"}</small>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/departments" className="btn-gdc btn-gdc-primary">
              View All Departments <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS SECTION */}
      <section className="home-announcements">
        <div className="container-custom">
          <div className="section-title">
            <h2>Latest Announcements</h2>
            <div className="divider" />
          </div>

          {notices.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No announcements yet.</p>
            </div>
          ) : (
            <div className="home-notice-list">
              {notices.map((notice) => {
                const date = notice.date ? new Date(notice.date) : new Date();
                return (
                  <div key={notice.id} className="home-notice-item">
                    <div className="home-notice-date">
                      <span className="day">{date.getDate()}</span>
                      <span className="month">
                        {date.toLocaleString("default", { month: "short" })}
                      </span>
                    </div>
                    <div className="home-notice-content">
                      <span className="category">
                        {notice.category || "General"}
                      </span>
                      <h6>{notice.title}</h6>
                      <p>{notice.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/announcements" className="btn-gdc btn-gdc-navy">
              View All Announcements <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* MEDIA SECTION */}
      {media.length > 0 && (
        <section className="home-media">
          <div className="container-custom">
            <div className="section-title">
              <h2>Media Gallery</h2>
              <div className="divider" />
            </div>

            <div className="row g-3">
              {media.slice(0, 6).map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6">
                  <div className="home-media-card">
                    {item.type === "video" ? (
                      <video src={item.url} muted playsInline />
                    ) : (
                      <img src={item.url} alt={item.title} />
                    )}
                    <div className="home-media-overlay">
                      <span>{item.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <Link to="/media" className="btn-gdc btn-gdc-primary">
                View All Media <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        .home-departments { padding: 60px 0; background: #f8f9fa; }
        .home-dept-card {
          background: #fff;
          padding: 24px 16px;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.04);
          height: 100%;
        }
        .home-dept-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: var(--gdc-gold);
        }
        .home-dept-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(184,134,11,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 1.3rem;
          color: var(--gdc-gold);
        }
        .home-dept-card h6 { margin: 0; font-weight: 600; color: #0f172a; }
        .home-dept-card small { color: #94a3b8; font-size: 0.8rem; }

        .home-announcements { padding: 60px 0; background: #fff; }
        .home-notice-list { max-width: 800px; margin: 0 auto; }
        .home-notice-item {
          display: flex;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .home-notice-item:hover { background: #fafbfc; padding-left: 12px; border-radius: 8px; }
        .home-notice-item:last-child { border-bottom: none; }
        .home-notice-date {
          min-width: 60px;
          text-align: center;
          padding-top: 4px;
        }
        .home-notice-date .day {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          font-family: var(--font-serif);
          line-height: 1;
        }
        .home-notice-date .month {
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: uppercase;
        }
        .home-notice-content { flex: 1; }
        .home-notice-content .category {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          color: var(--gdc-gold);
        }
        .home-notice-content h6 {
          font-size: 1rem;
          margin: 2px 0;
          font-weight: 600;
          color: #0f172a;
        }
        .home-notice-content p {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .home-media { padding: 60px 0; background: #f8f9fa; }
        .home-media-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: #e2e8f0;
          cursor: pointer;
        }
        .home-media-card img,
        .home-media-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .home-media-card:hover img,
        .home-media-card:hover video {
          transform: scale(1.05);
        }
        .home-media-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px 16px 12px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          color: #fff;
        }
        .home-media-overlay span {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .text-gold { color: var(--gdc-gold); }
        .text-muted { color: #94a3b8; }

        @media (max-width: 768px) {
          .home-notice-item { flex-direction: column; gap: 8px; }
          .home-notice-date { display: flex; gap: 8px; align-items: center; }
          .home-notice-date .day { font-size: 1.2rem; }
        }
      `}</style>
    </>
  );
}

export default Homepage;
