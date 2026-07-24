import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState("teachers");

  // --- DYNAMIC DATA STATES ---
  const [teachers, setTeachers] = useState(() =>
    JSON.parse(localStorage.getItem("gdc_teachers") || "[]"),
  );
  const [notices, setNotices] = useState(() =>
    JSON.parse(localStorage.getItem("gdc_notices") || "[]"),
  );
  const [media, setMedia] = useState(() =>
    JSON.parse(localStorage.getItem("gdc_media") || "[]"),
  );

  // --- SYNC TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem("gdc_teachers", JSON.stringify(teachers));
  }, [teachers]);
  useEffect(() => {
    localStorage.setItem("gdc_notices", JSON.stringify(notices));
  }, [notices]);
  useEffect(() => {
    localStorage.setItem("gdc_media", JSON.stringify(media));
  }, [media]);

  // Shortcut Listener (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") setShowLogin(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "gdc123") {
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      alert("Access Denied");
    }
  };

  // --- ADD FUNCTIONS ---
  const addTeacher = () => {
    const name = prompt("Teacher Name:");
    const role = prompt("Role (e.g. Associate Professor):");
    const image = prompt("Image URL (Unsplash link):");
    if (name)
      setTeachers([
        ...teachers,
        {
          id: Date.now(),
          name,
          role,
          image:
            image ||
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
        },
      ]);
  };

  const addNotice = () => {
    const title = prompt("Notice Title:");
    const tag = prompt("Category (Admission/Exams/Holiday):");
    if (title)
      setNotices([
        {
          id: Date.now(),
          title,
          tag,
          date: new Date().toLocaleDateString(),
          priority: "normal",
        },
        ...notices,
      ]);
  };

  const addMedia = () => {
    const title = prompt("Media Title:");
    const url = prompt("Image/Video URL:");
    const type = prompt("Type (image/video):");
    if (title)
      setMedia([
        {
          id: Date.now(),
          title,
          url,
          type,
          category: "campus",
          date: "Recent",
        },
        ...media,
      ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white text-center">
        <div>
          <h1 className="display-1 opacity-10">GDC</h1>
          <p className="text-muted">Restricted Access. Admin Only.</p>
          {showLogin && (
            <form onSubmit={handleLogin} className="mt-3">
              <input
                type="password"
                px-3
                className="form-control mb-2"
                placeholder="Passcode"
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
              <button className="btn btn-info w-100 fw-bold text-white">
                Unlock Panel
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* SIDEBAR */}
      <div className="bg-dark text-white p-4" style={{ width: "280px" }}>
        <h4 className="text-info fw-bold mb-5 mt-2">GDC Admin</h4>
        <div className="d-grid gap-3">
          <button
            onClick={() => setActiveTab("teachers")}
            className={`btn text-start py-3 ${activeTab === "teachers" ? "btn-info text-white" : "btn-dark text-white-50"}`}
          >
            <i className="bi bi-people-fill me-2"></i> Faculty
          </button>
          <button
            onClick={() => setActiveTab("notices")}
            className={`btn text-start py-3 ${activeTab === "notices" ? "btn-info text-white" : "btn-dark text-white-50"}`}
          >
            <i className="bi bi-megaphone-fill me-2"></i> Notices
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`btn text-start py-3 ${activeTab === "media" ? "btn-info text-white" : "btn-dark text-white-50"}`}
          >
            <i className="bi bi-images me-2"></i> Media
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="btn btn-outline-danger mt-5"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-5 w-100 overflow-auto" style={{ maxHeight: "100vh" }}>
        {/* FACULTY SECTION */}
        {activeTab === "teachers" && (
          <>
            <div className="d-flex justify-content-between mb-4">
              <h2 className="fw-bold">Faculty Management</h2>
              <button
                onClick={addTeacher}
                className="btn btn-info text-white rounded-pill px-4"
              >
                + Add Teacher
              </button>
            </div>
            <div className="row g-3">
              {teachers.map((t) => (
                <div key={t.id} className="col-md-4">
                  <div className="card border-0 shadow-sm p-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={t.image}
                        width="50"
                        height="50"
                        className="rounded-circle object-fit-cover"
                        alt=""
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-0">{t.name}</h6>
                        <small className="text-info">{t.role}</small>
                      </div>
                      <button
                        onClick={() =>
                          setTeachers(teachers.filter((i) => i.id !== t.id))
                        }
                        className="btn btn-sm text-danger"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* NOTICES SECTION */}
        {activeTab === "notices" && (
          <>
            <div className="d-flex justify-content-between mb-4">
              <h2 className="fw-bold">Notice Board</h2>
              <button
                onClick={addNotice}
                className="btn btn-info text-white rounded-pill px-4"
              >
                + New Notice
              </button>
            </div>
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <span className="badge bg-dark">{n.tag}</span>
                      </td>
                      <td className="fw-semibold">{n.title}</td>
                      <td>{n.date}</td>
                      <td>
                        <button
                          onClick={() =>
                            setNotices(notices.filter((i) => i.id !== n.id))
                          }
                          className="btn btn-sm text-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* MEDIA SECTION */}
        {activeTab === "media" && (
          <>
            <div className="d-flex justify-content-between mb-4">
              <h2 className="fw-bold">Media Hub</h2>
              <button
                onClick={addMedia}
                className="btn btn-info text-white rounded-pill px-4"
              >
                + Add Media
              </button>
            </div>
            <div className="row g-3">
              {media.map((m) => (
                <div key={m.id} className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <img
                      src={
                        m.type === "video"
                          ? "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300"
                          : m.url
                      }
                      className="card-img-top"
                      style={{ height: "120px", objectFit: "cover" }}
                      alt=""
                    />
                    <div className="p-2">
                      <small className="fw-bold d-block text-truncate">
                        {m.title}
                      </small>
                      <button
                        onClick={() =>
                          setMedia(media.filter((i) => i.id !== m.id))
                        }
                        className="btn btn-sm text-danger w-100 mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
