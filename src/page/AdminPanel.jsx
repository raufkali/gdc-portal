import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// ==========================================
// CONFIG
// ==========================================
// Reads from environment first so the same build works across dev machines,
// staging, and production without hand-editing an IP address each time.
// Guarded with typeof checks because `process` only exists when the app is
// built with a bundler that injects it (e.g. Create React App / webpack) —
// referencing it directly crashes in Vite or a plain browser bundle.
// Falls back to a relative path so it also works when the frontend and API
// are served from the same origin (e.g. behind a reverse proxy).
// TODO: replace with your backend's actual address if it changes
// (e.g. your machine's LAN IP if testing from a phone, or your deployed API URL).
const API_BASE_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE_URL) ||
  "http://localhost:5000/api";

// Single axios instance so interceptors (auth header + 401 handling)
// apply everywhere instead of being re-implemented per call.
const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

const TABS = [
  { key: "teachers", label: "Faculty management" },
  { key: "notices", label: "Notice board" },
  { key: "results", label: "Result ledgers" },
  { key: "departments", label: "Department layouts" },
  { key: "media", label: "Media hub" },
];

// These must match whatever values your backend accepts/stores on the
// Result model — keep this list in sync with Notice/Faculty department names.
const RESULT_DEPARTMENTS = ["Computer Science", "Information Technology", "Software Engineering"];
const RESULT_SESSIONS = ["2022-2026", "2023-2027", "2024-2028"];
const RESULT_SEMESTERS = [
  "1st Semester", "2nd Semester", "3rd Semester", "4th Semester",
  "5th Semester", "6th Semester", "7th Semester", "8th Semester",
];

// The API base already ends in `/api` for JSON calls, but uploaded PDFs are
// served as static files from the server root (e.g. /uploads/xyz.pdf), not
// under /api — so we derive the plain host once and reuse it for file links.
const FILE_HOST_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const NOTICE_CATEGORIES = ["General", "Admission", "Exams", "Events", "Holidays"];
const MEDIA_CATEGORIES = ["campus", "events", "sports"];

const emptyTeacherForm = { name: "", dept: "", qualification: "", experience: "", email: "", url: "", bio: "", office: "" };
const emptyNoticeForm = { title: "", category: "General", details: "", extraDetails: "", fileUrl: "", imageUrl: "" };
const emptyMediaForm = { title: "", type: "image", category: "campus", date: "Recent", description: "", url: "" };
const emptyDeptForm = { name: "", hod: "", description: "", courses: "" };
const emptyPrincipalForm = { name: "", qualification: "", message: "", vision: "", mission: "", photo: "" };
const emptyResultForm = { title: "", department: RESULT_DEPARTMENTS[0], session: RESULT_SESSIONS[0], semester: RESULT_SEMESTERS[0], file: null };

// ==========================================
// TOAST SYSTEM (replaces blocking alert() calls)
// ==========================================
let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, variant = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
}

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1080, maxWidth: "360px" }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center text-white border-0 mb-2 bg-${
            t.variant === "error" ? "danger" : t.variant === "info" ? "info" : "success"
          }`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// CONFIRM DIALOG (replaces window.confirm)
// ==========================================
function ConfirmDialog({ config, onCancel, onConfirm }) {
  if (!config) return null;
  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1090 }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-body p-4">
            <h6 className="fw-bold mb-2">{config.title}</h6>
            <p className="text-muted small mb-4">{config.message}</p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light btn-sm px-3" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm px-3"
                onClick={onConfirm}
                disabled={config.busy}
              >
                {config.busy ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small inline spinner for buttons mid-request.
function Spinner() {
  return <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />;
}

// ==========================================
// BRAND STYLES — navy/gold academic palette, layered over Bootstrap
// so no existing logic or class structure has to change, just the look.
// ==========================================
function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Inter:wght@400;500;600&display=swap');
      .gdc-app { font-family: 'Inter', -apple-system, sans-serif; }
      .gdc-serif { font-family: 'Lora', Georgia, serif; }
      .gdc-bg-navy { background-color: #16213E !important; }
      .gdc-bg-app { background-color: #EEF1F6 !important; }
      .gdc-card { border-radius: 14px !important; }
      .gdc-hairline { height: 3px; width: 56px; background: linear-gradient(90deg, #B98B33, rgba(185,139,51,0)); border-radius: 2px; }
      .gdc-seal {
        width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 14px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Lora', serif; font-weight: 700; font-size: 22px; letter-spacing: 1px; color: #fff;
        background: radial-gradient(circle at 30% 30%, #d3ac5c, #8a6a22);
        box-shadow: 0 8px 20px rgba(0,0,0,0.35);
      }
      .gdc-btn-gold { background-color: #B98B33; border-color: #B98B33; color: #16213E; font-weight: 600; }
      .gdc-btn-gold:hover, .gdc-btn-gold:focus { background-color: #A67A29; border-color: #A67A29; color: #16213E; }
      .gdc-btn-gold:disabled { background-color: #cbb686; border-color: #cbb686; }
      .gdc-btn-outline-gold { background: transparent; border: 1px solid #B98B33; color: #B98B33; }
      .gdc-btn-outline-gold:hover { background: rgba(185,139,51,0.12); color: #B98B33; }
      .gdc-pill-toggle { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.75); }
      .gdc-nav-btn { border-radius: 8px !important; border: none !important; }
      .gdc-nav-btn.active { background: rgba(185,139,51,0.18) !important; border-left: 3px solid #B98B33 !important; font-weight: 600; }
      .gdc-glass-card { background: rgba(255,255,255,0.06); }
      .gdc-input-dark { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; }
      .gdc-input-dark::placeholder { color: rgba(255,255,255,0.5); }
      .gdc-input-dark:focus { background: rgba(255,255,255,0.12); border-color: #B98B33; color: #fff; box-shadow: 0 0 0 0.2rem rgba(185,139,51,0.25); }
    `}</style>
  );
}

const AdminPanel = () => {
  const { toasts, pushToast, dismissToast } = useToasts();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [activeTab, setActiveTab] = useState("teachers");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- LIVE BACKEND REPOSITORY DATA STATES ---
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [media, setMedia] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [submitBusy, setSubmitBusy] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [confirmConfig, setConfirmConfig] = useState(null);

  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);
  const [noticeForm, setNoticeForm] = useState(emptyNoticeForm);
  const [resultForm, setResultForm] = useState(emptyResultForm);
  const [mediaForm, setMediaForm] = useState(emptyMediaForm);
  const [deptForm, setDeptForm] = useState(emptyDeptForm);
  const [principalForm, setPrincipalForm] = useState(emptyPrincipalForm);

  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  // ==========================================
  // AXIOS INTERCEPTORS: attach token, auto-logout on 401
  // ==========================================
  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      const token = localStorage.getItem("adminToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const resId = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          setIsAuthenticated(false);
          pushToast("Your session expired. Please sign in again.", "error");
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [pushToast]);

  // Shortcut Listener (Ctrl+Shift+L) to reveal login/signup menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") setShowAuthForm(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAuthenticated(true);
  }, []);

  const endpointForTab = {
    teachers: "/faculty",
    notices: "/announcements",
    media: "/media",
    departments: "/departments",
    // Admin-only listing route — must exist on the backend alongside the
    // public /results/semester/:semester route that ExamResult.jsx calls.
    results: "/results",
  };

  const settersForTab = {
    teachers: setTeachers,
    notices: setNotices,
    media: setMedia,
    departments: setDepartments,
    results: setResults,
  };

  const fetchAllData = useCallback(async (silent = false) => {
    const endpoint = endpointForTab[activeTab];
    if (!endpoint) return;
    if (!silent) setIsLoadingData(true);
    setLoadError("");
    try {
      const res = await api.get(endpoint);
      if (!isMountedRef.current) return;
      // Some endpoints (results) wrap the array as { success, data },
      // matching the shape ExamResult.jsx already expects on the public site.
      const payload = Array.isArray(res.data) ? res.data : res.data?.data || [];
      settersForTab[activeTab](payload);
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err.response?.status !== 401) {
        setLoadError("Couldn't reach the server. Check your connection and try again.");
      }
    } finally {
      if (isMountedRef.current && !silent) setIsLoadingData(false);
    }
  }, [activeTab]);

  // --- LIVE DATA REFRESH ENGINE ---
  // Fetches immediately on tab switch, then polls in the background.
  // Pauses while the browser tab is hidden so it doesn't burn requests
  // or battery when nobody's looking at the screen, and resumes on focus.
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchAllData();

    let interval = null;
    const startPolling = () => {
      if (interval) return;
      interval = setInterval(() => fetchAllData(true), 8000);
    };
    const stopPolling = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };

    const handleVisibility = () => {
      if (document.hidden) stopPolling();
      else {
        fetchAllData(true);
        startPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isAuthenticated, activeTab, fetchAllData]);

  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      pushToast("That file is over 15MB. Compress it and try again.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaForm((prev) => ({ ...prev, url: reader.result }));
    };
    reader.onerror = () => pushToast("Couldn't read that file. Try a different one.", "error");
    reader.readAsDataURL(file);
  };

  // Validates the transcript file client-side before it ever leaves the
  // browser: PDF only, 15MB ceiling — mirrors the same two constraints
  // enforced again on the server (MIME sniff + multer file size limit).
  const handleResultFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      pushToast("Only PDF files are accepted for result ledgers.", "error");
      e.target.value = "";
      setResultForm((prev) => ({ ...prev, file: null }));
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      pushToast("That PDF is over 15MB. Compress it and try again.", "error");
      e.target.value = "";
      setResultForm((prev) => ({ ...prev, file: null }));
      return;
    }

    setResultForm((prev) => ({ ...prev, file }));
  };

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return pushToast("Fill in your name, email, and password to register.", "error");
    }
    setAuthBusy(true);
    try {
      await api.post("/auth/register", { name, email, password });
      pushToast("Registration successful. Sign in to continue.");
      setAuthView("login");
      setPassword("");
    } catch (err) {
      pushToast(err.response?.data?.message || "Registration failed. That email may already be in use.", "error");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return pushToast("Enter both your email and password.", "error");
    setAuthBusy(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        setIsAuthenticated(true);
        setShowAuthForm(false);
        pushToast("Signed in successfully.");
      }
    } catch (err) {
      pushToast(err.response?.data?.message || "Incorrect email or password.", "error");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setName("");
    pushToast("Signed out.", "info");
  };

  // ==========================================
  // SHARED SUBMIT VALIDATION HELPER
  // ==========================================
  const validate = (fields) => {
    const errors = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (!value || !String(value).trim()) errors[key] = "Required";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const closeModalAndReset = () => {
    setShowModal(false);
    setFormErrors({});
    setTeacherForm(emptyTeacherForm);
    setNoticeForm(emptyNoticeForm);
    setMediaForm(emptyMediaForm);
    setDeptForm(emptyDeptForm);
    setResultForm(emptyResultForm);
  };

  // ==========================================
  // POST / SUBMIT HANDLERS
  // ==========================================
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    const ok = validate({
      name: teacherForm.name,
      dept: teacherForm.dept,
      qualification: teacherForm.qualification,
      experience: teacherForm.experience,
      email: teacherForm.email,
    });
    if (!ok) return;

    setSubmitBusy(true);
    try {
      const payload = {
        ...teacherForm,
        url: teacherForm.url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
        bio: teacherForm.bio || "Dedicated educator serving GDC Gulabad.",
        office: teacherForm.office || "Main Block Assembly",
      };
      const res = await api.post("/faculty", payload);
      setTeachers((prev) => [...prev, res.data]);
      closeModalAndReset();
      pushToast("Faculty member added.");
    } catch (err) {
      pushToast(err.response?.data?.message || "Couldn't save that faculty record.", "error");
    } finally {
      setSubmitBusy(false);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    const ok = validate({ title: noticeForm.title, details: noticeForm.details });
    if (!ok) return;

    setSubmitBusy(true);
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      const payload = { ...noticeForm, date: todayStr };
      const res = await api.post("/announcements", payload);
      setNotices((prev) => [res.data, ...prev]);
      closeModalAndReset();
      pushToast("Notice published to the board.");
    } catch (err) {
      pushToast(err.response?.data?.message || "Couldn't publish that notice.", "error");
    } finally {
      setSubmitBusy(false);
    }
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    const ok = validate({ title: mediaForm.title, url: mediaForm.url, description: mediaForm.description });
    if (!ok) return;

    setSubmitBusy(true);
    try {
      const payload = { ...mediaForm, location: "Main Campus" };
      const res = await api.post("/media", payload);
      setMedia((prev) => [res.data, ...prev]);
      closeModalAndReset();
      pushToast("Media added to the gallery.");
    } catch (err) {
      pushToast(err.response?.data?.message || "Couldn't save that media item.", "error");
    } finally {
      setSubmitBusy(false);
    }
  };

  // Uploads use multipart/form-data (not JSON like the other tabs) because
  // a binary file is involved. Field names here must match what the backend
  // route expects: department / session / semester as text fields, and the
  // PDF itself under "resultPdf" (matching the multer.single("resultPdf")
  // controller shown earlier in this project).
  const handleResultSubmit = async (e) => {
    e.preventDefault();
    const ok = validate({
      title: resultForm.title,
      department: resultForm.department,
      session: resultForm.session,
      semester: resultForm.semester,
      file: resultForm.file,
    });
    if (!ok) return;

    setSubmitBusy(true);
    try {
      const body = new FormData();
      body.append("title", resultForm.title);
      body.append("department", resultForm.department);
      body.append("session", resultForm.session);
      body.append("semester", resultForm.semester);
      body.append("resultPdf", resultForm.file);

      const res = await api.post("/results/upload-pdf", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const saved = res.data?.data || res.data;
      setResults((prev) => [saved, ...prev]);
      closeModalAndReset();
      pushToast("Result ledger uploaded and published.");
    } catch (err) {
      if (err.response?.status === 409) {
        pushToast("A ledger for this department, session, and semester already exists.", "error");
      } else if (err.response?.status === 422) {
        pushToast(err.response?.data?.message || "That PDF couldn't be validated.", "error");
      } else {
        pushToast(err.response?.data?.message || "Couldn't upload that result ledger.", "error");
      }
    } finally {
      setSubmitBusy(false);
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    const ok = validate({ name: deptForm.name, hod: deptForm.hod, description: deptForm.description });
    if (!ok) return;

    setSubmitBusy(true);
    const coursesArray = deptForm.courses ? deptForm.courses.split(",").map((c) => c.trim()).filter(Boolean) : [];
    try {
      const payload = { ...deptForm, courses: coursesArray };
      const res = await api.post("/departments", payload);
      setDepartments((prev) => [...prev, res.data]);
      closeModalAndReset();
      pushToast("Department created.");
    } catch (err) {
      pushToast(err.response?.data?.message || "That department name may already exist.", "error");
    } finally {
      setSubmitBusy(false);
    }
  };

  const handlePrincipalSubmit = async (e) => {
    e.preventDefault();
    const ok = validate({
      message: principalForm.message,
      vision: principalForm.vision,
      mission: principalForm.mission,
      photo: principalForm.photo,
    });
    if (!ok) return;

    setSubmitBusy(true);
    try {
      await api.post("/principal", principalForm);
      setShowModal(false);
      setFormErrors({});
      pushToast("Principal's desk updated.");
    } catch (err) {
      pushToast(err.response?.data?.message || "Couldn't update the principal's profile.", "error");
    } finally {
      setSubmitBusy(false);
    }
  };

  // ==========================================
  // DELETE MECHANISMS (via ConfirmDialog, not window.confirm)
  // ==========================================
  const requestDelete = (entity, id, label) => {
    setConfirmConfig({
      entity,
      id,
      title: `Remove ${label}?`,
      message: "This can't be undone.",
      busy: false,
    });
  };

  const performDelete = async () => {
    if (!confirmConfig) return;
    const { entity, id } = confirmConfig;
    setConfirmConfig((prev) => ({ ...prev, busy: true }));

    const routes = {
      teacher: { url: `/faculty/${id}`, setter: setTeachers, key: "_id" },
      notice: { url: `/announcements/${id}`, setter: setNotices, key: "_id" },
      department: { url: `/departments/${id}`, setter: setDepartments, key: "_id" },
      media: { url: `/media/${id}`, setter: setMedia, key: "_id" },
      result: { url: `/results/${id}`, setter: setResults, key: "_id" },
    };
    const route = routes[entity];

    try {
      await api.delete(route.url);
      route.setter((prev) => prev.filter((item) => item[route.key] !== id));
      pushToast("Removed successfully.");
    } catch (err) {
      pushToast("Couldn't complete the removal. Try again.", "error");
    } finally {
      setConfirmConfig(null);
    }
  };

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 gdc-bg-navy gdc-app text-white text-center px-3">
        <BrandStyles />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
        <div className="w-100" style={{ maxWidth: "360px" }}>
          <div className="gdc-seal">GDC</div>
          <h1 className="gdc-serif fw-bold mb-1" style={{ fontSize: "1.5rem" }}>
            Govt. Degree College Gulabad
          </h1>
          <p
            className="text-white-50 mb-4"
            style={{ letterSpacing: "0.08em", fontSize: "0.75rem", textTransform: "uppercase" }}
          >
            Administration Portal
          </p>

          {!showAuthForm && (
            <p className="text-white-50 small">Press Ctrl + Shift + L to sign in</p>
          )}

          {showAuthForm && (
            <div className="card gdc-card gdc-glass-card text-white p-4 border-0 shadow-lg text-start">
              <div className="gdc-hairline mb-3" />

              <div className="d-flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className={`btn btn-sm rounded-pill px-3 flex-grow-1 ${
                    authView === "login" ? "gdc-btn-gold" : "gdc-pill-toggle"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setAuthView("register")}
                  className={`btn btn-sm rounded-pill px-3 flex-grow-1 ${
                    authView === "register" ? "gdc-btn-gold" : "gdc-pill-toggle"
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={authView === "login" ? handleLogin : handleRegister} noValidate>
                {authView === "register" && (
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control gdc-input-dark"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                )}
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control gdc-input-dark"
                    placeholder="Admin email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control gdc-input-dark"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={authView === "login" ? "current-password" : "new-password"}
                  />
                </div>

                <button className="btn gdc-btn-gold w-100 fw-bold mb-1" disabled={authBusy}>
                  {authBusy && <Spinner />}
                  {authView === "login" ? "Sign in" : "Register admin profile"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  const listForTab = { teachers, notices, media, departments, results };
  const currentList = listForTab[activeTab] || [];
  const filteredList = searchTerm
    ? currentList.filter((item) => {
        const haystack = [
          item.name, item.title, item.dept, item.hod, item.category,
          item.department, item.session, item.semester,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
      })
    : currentList;

  return (
    <div className="d-flex min-vh-100 gdc-bg-app gdc-app position-relative">
      <BrandStyles />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog
        config={confirmConfig}
        onCancel={() => setConfirmConfig(null)}
        onConfirm={performDelete}
      />

      {/* Mobile sidebar toggle */}
      <button
        className="btn gdc-bg-navy text-white d-md-none position-fixed"
        style={{ top: "12px", left: "12px", zIndex: 1070 }}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      {/* SIDEBAR NAVIGATION */}
      <div
        className={`gdc-bg-navy text-white p-4 d-flex flex-column justify-content-between position-fixed position-md-static h-100 ${
          sidebarOpen ? "" : "d-none d-md-flex"
        }`}
        style={{ width: "280px", minWidth: "280px", zIndex: 1060, top: 0, left: 0 }}
      >
        <div>
          <div className="gdc-seal" style={{ width: "44px", height: "44px", fontSize: "15px", margin: "0 0 10px" }}>
            GDC
          </div>
          <h4 className="gdc-serif fw-bold mb-1">GDC Admin</h4>
          <p className="text-white-50 small mb-4">Gulabad campus</p>
          <div className="d-grid gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearchTerm("");
                  setSidebarOpen(false);
                }}
                className={`btn text-start py-3 gdc-nav-btn ${
                  activeTab === tab.key ? "active text-white" : "text-white-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="d-grid gap-2">
          <button
            onClick={() => {
              setActiveTab("principal");
              setPrincipalForm(emptyPrincipalForm);
              setFormErrors({});
              setShowModal(true);
            }}
            className="btn gdc-btn-outline-gold text-start py-2"
          >
            Principal desk config
          </button>
          <button onClick={handleLogout} className="btn btn-danger mt-2">
            Log out
          </button>
        </div>
      </div>

      {/* DASHBOARD WORKSPACE */}
      <div className="p-4 p-md-5 w-100 overflow-auto" style={{ maxHeight: "100vh" }}>
        {["teachers", "notices", "results", "departments", "media"].includes(activeTab) && (
          <>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
              <div>
                <h2 className="gdc-serif fw-bold mb-1">{TABS.find((t) => t.key === activeTab)?.label}</h2>
                <div className="gdc-hairline" />
              </div>
              <div className="d-flex gap-2">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search…"
                  style={{ width: "200px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => {
                    setFormErrors({});
                    setShowModal(true);
                  }}
                  className="btn gdc-btn-gold rounded-pill px-4 text-nowrap"
                >
                  + Add
                </button>
              </div>
            </div>

            {isLoadingData && (
              <div className="text-center text-muted py-5">
                <div className="spinner-border mb-2" style={{ color: "#B98B33" }} role="status" />
                <div>Loading…</div>
              </div>
            )}

            {!isLoadingData && loadError && (
              <div className="alert alert-warning d-flex justify-content-between align-items-center">
                <span>{loadError}</span>
                <button className="btn btn-sm btn-outline-dark" onClick={() => fetchAllData()}>
                  Retry
                </button>
              </div>
            )}

            {!isLoadingData && !loadError && filteredList.length === 0 && (
              <div className="text-center text-muted py-5 border rounded bg-white">
                {searchTerm ? "Nothing matches your search." : "Nothing here yet — add the first one above."}
              </div>
            )}
          </>
        )}

        {/* FACULTY VIEW */}
        {activeTab === "teachers" && !isLoadingData && !loadError && filteredList.length > 0 && (
          <div className="row g-3">
            {filteredList.map((t) => (
              <div key={t._id} className="col-md-4">
                <div className="card gdc-card border-0 shadow-sm p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <img src={t.url} width="50" height="50" className="rounded-circle object-fit-cover flex-shrink-0" alt="" />
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="fw-bold mb-0 text-truncate">{t.name}</h6>
                      <small style={{ color: "#B98B33", fontWeight: 600 }}>{t.dept || "Faculty"}</small>
                    </div>
                    <button onClick={() => requestDelete("teacher", t._id, t.name)} className="btn btn-sm text-danger">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTICES VIEW */}
        {activeTab === "notices" && !isLoadingData && !loadError && filteredList.length > 0 && (
          <div className="card gdc-card border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((n) => (
                    <tr key={n._id}>
                      <td><span className="badge bg-dark">{n.category}</span></td>
                      <td className="fw-semibold">{n.title}</td>
                      <td>{n.date ? new Date(n.date).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <button
                          onClick={() => requestDelete("notice", n._id, n.title)}
                          className="btn btn-sm text-danger btn-link p-0"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RESULT LEDGERS VIEW */}
        {activeTab === "results" && !isLoadingData && !loadError && filteredList.length > 0 && (
          <div className="card gdc-card border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Department</th>
                    <th>Session</th>
                    <th>Semester</th>
                    <th>Uploaded</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((r) => (
                    <tr key={r._id}>
                      <td className="fw-semibold">{r.department}</td>
                      <td>{r.session}</td>
                      <td><span className="badge bg-secondary">{r.semester}</span></td>
                      <td>{r.updatedAt || r.uploadedAt ? new Date(r.updatedAt || r.uploadedAt).toLocaleDateString() : "N/A"}</td>
                      <td className="text-nowrap">
                        <a
                          href={`${FILE_HOST_URL}${r.pdfUrl || r.pdfPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm gdc-btn-outline-gold me-2"
                        >
                          View
                        </a>
                        <a
                          href={`${FILE_HOST_URL}${r.pdfUrl || r.pdfPath}`}
                          download
                          className="btn btn-sm gdc-btn-outline-gold me-2"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => requestDelete("result", r._id, `${r.department} · ${r.semester}`)}
                          className="btn btn-sm text-danger btn-link p-0"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEPARTMENTS VIEW */}
        {activeTab === "departments" && !isLoadingData && !loadError && filteredList.length > 0 && (
          <div className="row g-3">
            {filteredList.map((d) => (
              <div key={d._id} className="col-md-6">
                <div className="card gdc-card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between">
                      <h4 className="gdc-serif fw-bold mb-1" style={{ color: "#16213E" }}>{d.name}</h4>
                      <button onClick={() => requestDelete("department", d._id, d.name)} className="btn btn-sm text-danger btn-link p-0">
                        Delete
                      </button>
                    </div>
                    <p className="mb-2 text-dark"><strong>HOD:</strong> {d.hod}</p>
                    <small className="d-block text-muted mb-3">{d.description}</small>
                  </div>
                  <div>
                    {d.courses?.map((course, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">{course}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MEDIA VIEW */}
        {activeTab === "media" && !isLoadingData && !loadError && filteredList.length > 0 && (
          <div className="row g-3">
            {filteredList.map((m) => (
              <div key={m._id} className="col-md-3">
                <div className="card gdc-card border-0 shadow-sm h-100">
                  {m.url?.includes("data:video") || m.url?.endsWith(".mp4") ? (
                    <video src={m.url} style={{ height: "120px", objectFit: "cover" }} muted playsInline />
                  ) : (
                    <img src={m.url} className="card-img-top" style={{ height: "120px", objectFit: "cover" }} alt="" />
                  )}
                  <div className="p-2">
                    <small className="fw-bold d-block text-truncate">{m.title}</small>
                    <button
                      onClick={() => requestDelete("media", m._id, m.title)}
                      className="btn btn-sm btn-outline-danger w-100 mt-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
          DYNAMIC FORM MODAL
         ========================================== */}
      {showModal && (
        <div className="modal d-block show" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1075 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-2">
              <div className="modal-header border-0">
                <h5 className="text-dark fw-bold">
                  {activeTab === "teachers" && "Add faculty member"}
                  {activeTab === "notices" && "Create new campus notice"}
                  {activeTab === "results" && "Upload official exam result ledger"}
                  {activeTab === "departments" && "Map new academic department"}
                  {activeTab === "media" && "Add asset to media gallery"}
                  {activeTab === "principal" && "Modify principal desk settings"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModalAndReset} aria-label="Close" />
              </div>

              <div className="modal-body text-dark">
                {/* FACULTY FORM */}
                {activeTab === "teachers" && (
                  <form onSubmit={handleTeacherSubmit} noValidate>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                        placeholder="Teacher name"
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      />
                      {formErrors.name && <div className="invalid-feedback">Name is required.</div>}
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.dept ? "is-invalid" : ""}`}
                        placeholder="Department (e.g. Computer Science)"
                        value={teacherForm.dept}
                        onChange={(e) => setTeacherForm({ ...teacherForm, dept: e.target.value })}
                      />
                      {formErrors.dept && <div className="invalid-feedback">Department is required.</div>}
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.qualification ? "is-invalid" : ""}`}
                        placeholder="Qualification (e.g. MS Computer Science)"
                        value={teacherForm.qualification}
                        onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                      />
                      {formErrors.qualification && <div className="invalid-feedback">Qualification is required.</div>}
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.experience ? "is-invalid" : ""}`}
                        placeholder="Experience details"
                        value={teacherForm.experience}
                        onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                      />
                      {formErrors.experience && <div className="invalid-feedback">Experience is required.</div>}
                    </div>
                    <div className="mb-2">
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                        placeholder="Official email account"
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      />
                      {formErrors.email && <div className="invalid-feedback">Email is required.</div>}
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Photo link / URL (optional)"
                        value={teacherForm.url}
                        onChange={(e) => setTeacherForm({ ...teacherForm, url: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bio note (optional)"
                        value={teacherForm.bio}
                        onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Office location (optional)"
                        value={teacherForm.office}
                        onChange={(e) => setTeacherForm({ ...teacherForm, office: e.target.value })}
                      />
                    </div>
                    <button className="btn gdc-btn-gold w-100 fw-bold" disabled={submitBusy}>
                      {submitBusy && <Spinner />} Save faculty member
                    </button>
                  </form>
                )}

                {/* NOTICES FORM */}
                {activeTab === "notices" && (
                  <form onSubmit={handleNoticeSubmit} noValidate>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
                        placeholder="Notice heading title"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      />
                      {formErrors.title && <div className="invalid-feedback">Title is required.</div>}
                    </div>
                    <div className="mb-2">
                      <select
                        className="form-select"
                        value={noticeForm.category}
                        onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                      >
                        {NOTICE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <textarea
                        className={`form-control ${formErrors.details ? "is-invalid" : ""}`}
                        rows="3"
                        placeholder="Brief summary details…"
                        value={noticeForm.details}
                        onChange={(e) => setNoticeForm({ ...noticeForm, details: e.target.value })}
                      />
                      {formErrors.details && <div className="invalid-feedback">Details are required.</div>}
                    </div>
                    <div className="mb-2">
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Extra instructions (optional)"
                        value={noticeForm.extraDetails}
                        onChange={(e) => setNoticeForm({ ...noticeForm, extraDetails: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="File/document URL (optional)"
                        value={noticeForm.fileUrl}
                        onChange={(e) => setNoticeForm({ ...noticeForm, fileUrl: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Flyer/image preview URL (optional)"
                        value={noticeForm.imageUrl}
                        onChange={(e) => setNoticeForm({ ...noticeForm, imageUrl: e.target.value })}
                      />
                    </div>
                    <button className="btn gdc-btn-gold w-100 fw-bold" disabled={submitBusy}>
                      {submitBusy && <Spinner />} Publish notice
                    </button>
                  </form>
                )}

                {/* RESULT LEDGER UPLOAD FORM */}
                {activeTab === "results" && (
                  <form onSubmit={handleResultSubmit} noValidate>
                    <div className="d-flex align-items-center mb-3">
                      <div className="p-2 rounded-3 me-3" style={{ background: "rgba(185,139,51,0.12)", color: "#B98B33" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4.5 11a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4.5 6a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                      </div>
                      <h6 className="fw-bold text-dark mb-0">Publish an Official Exam Result Ledger</h6>
                    </div>
                    <p className="text-muted small mb-3">
                      Upload the department's transcript sheet as a single PDF. Students will be able to filter, view, and download it once published.
                    </p>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Ledger title</label>
                      <input
                        type="text"
                        className={`form-control rounded-3 ${formErrors.title ? "is-invalid" : ""}`}
                        placeholder="e.g. Computer Science Internal Marks Fall 2024-25"
                        value={resultForm.title}
                        onChange={(e) => setResultForm({ ...resultForm, title: e.target.value })}
                      />
                      {formErrors.title && <div className="invalid-feedback">A title is required.</div>}
                    </div>

                    {/* Filter parameters row — same 3-column layout as the public ExamResult viewer */}
                    <div className="row g-3 mb-3 bg-light p-3 rounded-3 mx-0">
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-secondary">Department</label>
                        <select
                          className="form-select rounded-3"
                          value={resultForm.department}
                          onChange={(e) => setResultForm({ ...resultForm, department: e.target.value })}
                        >
                          {RESULT_DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-secondary">Session Batch</label>
                        <select
                          className="form-select rounded-3"
                          value={resultForm.session}
                          onChange={(e) => setResultForm({ ...resultForm, session: e.target.value })}
                        >
                          {RESULT_SESSIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-secondary">Choose Semester</label>
                        <select
                          className="form-select rounded-3"
                          value={resultForm.semester}
                          onChange={(e) => setResultForm({ ...resultForm, semester: e.target.value })}
                        >
                          {RESULT_SEMESTERS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Transcript file (PDF, max 15MB)</label>
                      <input
                        type="file"
                        className={`form-control rounded-3 ${formErrors.file ? "is-invalid" : ""}`}
                        accept="application/pdf"
                        onChange={handleResultFileChange}
                      />
                      {formErrors.file && <div className="invalid-feedback d-block">A PDF file is required.</div>}
                      {resultForm.file && !formErrors.file && (
                        <div className="mt-2 small fw-bold d-flex align-items-center gap-2" style={{ color: "#0F6E56" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          {resultForm.file.name} ready to upload
                        </div>
                      )}
                    </div>

                    <button className="btn gdc-btn-gold w-100 fw-bold rounded-3" disabled={submitBusy}>
                      {submitBusy && <Spinner />} Upload and validate
                    </button>
                  </form>
                )}

                {/* DEPARTMENTS FORM */}
                {activeTab === "departments" && (
                  <form onSubmit={handleDeptSubmit} noValidate>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                        placeholder="Department name"
                        value={deptForm.name}
                        onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      />
                      {formErrors.name && <div className="invalid-feedback">Name is required.</div>}
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.hod ? "is-invalid" : ""}`}
                        placeholder="Head of department"
                        value={deptForm.hod}
                        onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })}
                      />
                      {formErrors.hod && <div className="invalid-feedback">HOD is required.</div>}
                    </div>
                    <div className="mb-2">
                      <textarea
                        className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                        rows="2"
                        placeholder="Short description"
                        value={deptForm.description}
                        onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                      />
                      {formErrors.description && <div className="invalid-feedback">Description is required.</div>}
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Programs, comma separated (e.g. BSCS, MCS)"
                        value={deptForm.courses}
                        onChange={(e) => setDeptForm({ ...deptForm, courses: e.target.value })}
                      />
                    </div>
                    <button className="btn gdc-btn-gold w-100 fw-bold" disabled={submitBusy}>
                      {submitBusy && <Spinner />} Create department
                    </button>
                  </form>
                )}

                {/* MEDIA FORM */}
                {activeTab === "media" && (
                  <form onSubmit={handleMediaSubmit} noValidate>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
                        placeholder="Media title"
                        value={mediaForm.title}
                        onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                      />
                      {formErrors.title && <div className="invalid-feedback">Title is required.</div>}
                    </div>
                    <div className="mb-2">
                      <select
                        className="form-select"
                        value={mediaForm.type}
                        onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value, url: "" })}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <select
                        className="form-select"
                        value={mediaForm.category}
                        onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                      >
                        {MEDIA_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Date label (e.g. June 2026)"
                        value={mediaForm.date}
                        onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label text-secondary small fw-bold mb-1">Select file</label>
                      <input
                        type="file"
                        className={`form-control ${formErrors.url ? "is-invalid" : ""}`}
                        accept={mediaForm.type === "image" ? "image/*" : "video/*"}
                        onChange={handleMediaFileChange}
                      />
                      {formErrors.url && <div className="invalid-feedback d-block">A file is required.</div>}
                      {mediaForm.url && !formErrors.url && (
                        <div className="mt-1 small text-success fw-bold">✓ File ready to upload</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                        placeholder="Brief description"
                        value={mediaForm.description}
                        onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                      />
                      {formErrors.description && <div className="invalid-feedback">Description is required.</div>}
                    </div>
                    <button className="btn gdc-btn-gold w-100 fw-bold" disabled={submitBusy}>
                      {submitBusy && <Spinner />} Upload media
                    </button>
                  </form>
                )}

                {/* PRINCIPAL FORM */}
                {activeTab === "principal" && (
                  <form onSubmit={handlePrincipalSubmit} noValidate>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Principal name"
                        value={principalForm.name}
                        onChange={(e) => setPrincipalForm({ ...principalForm, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Qualifications"
                        value={principalForm.qualification}
                        onChange={(e) => setPrincipalForm({ ...principalForm, qualification: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className={`form-control ${formErrors.photo ? "is-invalid" : ""}`}
                        placeholder="Portrait photo link"
                        value={principalForm.photo}
                        onChange={(e) => setPrincipalForm({ ...principalForm, photo: e.target.value })}
                      />
                      {formErrors.photo && <div className="invalid-feedback">Photo link is required.</div>}
                    </div>
                    <div className="mb-2">
                      <textarea
                        className={`form-control ${formErrors.message ? "is-invalid" : ""}`}
                        rows="2"
                        placeholder="Welcome desk message"
                        value={principalForm.message}
                        onChange={(e) => setPrincipalForm({ ...principalForm, message: e.target.value })}
                      />
                      {formErrors.message && <div className="invalid-feedback">Message is required.</div>}
                    </div>
                    <div className="mb-2">
                      <textarea
                        className={`form-control ${formErrors.vision ? "is-invalid" : ""}`}
                        rows="2"
                        placeholder="Institutional vision"
                        value={principalForm.vision}
                        onChange={(e) => setPrincipalForm({ ...principalForm, vision: e.target.value })}
                      />
                      {formErrors.vision && <div className="invalid-feedback">Vision is required.</div>}
                    </div>
                    <div className="mb-3">
                      <textarea
                        className={`form-control ${formErrors.mission ? "is-invalid" : ""}`}
                        rows="2"
                        placeholder="Institutional mission"
                        value={principalForm.mission}
                        onChange={(e) => setPrincipalForm({ ...principalForm, mission: e.target.value })}
                      />
                      {formErrors.mission && <div className="invalid-feedback">Mission is required.</div>}
                    </div>
                    <button className="btn gdc-btn-gold w-100 fw-bold" disabled={submitBusy}>
                      {submitBusy && <Spinner />} Save desk settings
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;