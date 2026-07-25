// src/page/AdminPanel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

// Admin Components
import AdminLayout from "../components/admin/AdminLayout";
import AdminLogin from "../components/admin/AdminLogin";
import DashboardStats from "../components/admin/dashboard/DashboardStats";
import TeacherList from "../components/admin/teachers/TeacherList";
import TeacherForm from "../components/admin/teachers/TeacherForm";
import NoticeList from "../components/admin/notices/NoticeList";
import NoticeForm from "../components/admin/notices/NoticeForm";
import ResultList from "../components/admin/results/ResultList";
import ResultForm from "../components/admin/results/ResultForm";
import DepartmentList from "../components/admin/departments/DepartmentList";
import DepartmentForm from "../components/admin/departments/DepartmentForm";
import MediaList from "../components/admin/media/MediaList";
import MediaForm from "../components/admin/media/MediaForm";
import PrincipalForm from "../components/admin/principal/PrincipalForm";

// Toast System
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
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center text-white border-0 mb-2 bg-${t.variant === "error" ? "danger" : t.variant === "info" ? "info" : "success"}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => onDismiss(t.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const AdminPanel = () => {
  const { toasts, pushToast, dismissToast } = useToasts();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // UI State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Data State
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [results, setResults] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [media, setMedia] = useState([]);
  const [principal, setPrincipal] = useState(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Collections
  const fetchCollection = async (collectionName) => {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return items;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  };

  // Fetch All Data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        teachersData,
        noticesData,
        resultsData,
        departmentsData,
        mediaData,
      ] = await Promise.all([
        fetchCollection("faculty"),
        fetchCollection("announcements"),
        fetchCollection("results"),
        fetchCollection("departments"),
        fetchCollection("media"),
      ]);
      setTeachers(teachersData);
      setNotices(noticesData);
      setResults(resultsData);
      setDepartments(departmentsData);
      setMedia(mediaData);
    } catch (error) {
      pushToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Principal
  const fetchPrincipal = useCallback(async () => {
    try {
      const docRef = doc(db, "principal", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrincipal({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Error fetching principal:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      fetchPrincipal();
    }
  }, [isAuthenticated, fetchAllData, fetchPrincipal]);

  // Login Handler
  const handleLogin = async (email, password) => {
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await signOut(auth);
    pushToast("Logged out successfully");
  };

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const collectionMap = {
        teachers: "faculty",
        notices: "announcements",
        results: "results",
        departments: "departments",
        media: "media",
      };
      const colName = collectionMap[activeTab];
      if (!colName) return;
      await deleteDoc(doc(db, colName, id));
      pushToast(`${name} deleted successfully`);
      fetchAllData();
    } catch (error) {
      pushToast("Failed to delete", "error");
    }
  };

  // Form Submit Handler
  const handleFormSubmit = async (data) => {
    const collectionMap = {
      teachers: "faculty",
      notices: "announcements",
      results: "results",
      departments: "departments",
      media: "media",
    };
    const colName = collectionMap[activeTab];
    if (!colName) return;

    try {
      setLoading(true);
      if (editingItem) {
        await updateDoc(doc(db, colName, editingItem.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        pushToast("Updated successfully");
      } else {
        await addDoc(collection(db, colName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        pushToast("Added successfully");
      }
      setShowForm(false);
      setEditingItem(null);
      fetchAllData();
    } catch (error) {
      pushToast("Failed to save", "error");
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = [
    {
      key: "teachers",
      label: "Teachers",
      count: teachers.length,
      icon: "bi-people-fill",
      color: "#3b82f6",
    },
    {
      key: "notices",
      label: "Notices",
      count: notices.length,
      icon: "bi-megaphone-fill",
      color: "#ef4444",
    },
    {
      key: "results",
      label: "Results",
      count: results.length,
      icon: "bi-file-earmark-pdf-fill",
      color: "#059669",
    },
    {
      key: "departments",
      label: "Departments",
      count: departments.length,
      icon: "bi-building-fill",
      color: "#d97706",
    },
    {
      key: "media",
      label: "Media",
      count: media.length,
      icon: "bi-images",
      color: "#0891b2",
    },
  ];

  // Render Content
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats stats={stats} />;
      case "teachers":
        return (
          <TeacherList
            teachers={teachers}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          />
        );
      case "notices":
        return (
          <NoticeList
            notices={notices}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          />
        );
      case "results":
        return (
          <ResultList
            results={results}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          />
        );
      case "departments":
        return (
          <DepartmentList
            departments={departments}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          />
        );
      case "media":
        return (
          <MediaList
            media={media}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          />
        );
      case "principal":
        return (
          <PrincipalForm
            principal={principal}
            onUpdate={() => fetchPrincipal()}
            pushToast={pushToast}
          />
        );
      default:
        return <DashboardStats stats={stats} />;
    }
  };

  // Render Form
  const renderForm = () => {
    const commonProps = {
      onSubmit: handleFormSubmit,
      onCancel: () => {
        setShowForm(false);
        setEditingItem(null);
      },
      loading: loading,
      uploadProgress: uploadProgress,
      setUploadProgress: setUploadProgress,
    };

    switch (activeTab) {
      case "teachers":
        return <TeacherForm {...commonProps} initialData={editingItem} />;
      case "notices":
        return <NoticeForm {...commonProps} initialData={editingItem} />;
      case "results":
        return <ResultForm {...commonProps} />;
      case "departments":
        return <DepartmentForm {...commonProps} initialData={editingItem} />;
      case "media":
        return <MediaForm {...commonProps} initialData={editingItem} />;
      default:
        return null;
    }
  };

  // Toast Component
  const ToastStackComponent = () => {
    if (!toasts.length) return null;
    return (
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.variant}`}>
            <span>{t.message}</span>
            <button onClick={() => dismissToast(t.id)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
        <style>{`
          .toast-stack { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
          .toast-item { padding: 12px 16px; border-radius: 8px; color: #fff; font-size: 0.875rem; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease; }
          .toast-success { background: #059669; }
          .toast-error { background: #dc2626; }
          .toast-info { background: #2563eb; }
          .toast-item button { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; padding: 4px; }
          .toast-item button:hover { color: #fff; }
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
      </div>
    );
  };

  // Loading Screen
  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
        <style>{`
          .auth-loading { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; color: #fff; }
          .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #B98B33; border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .auth-loading p { margin-top: 16px; color: rgba(255,255,255,0.5); }
        `}</style>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <AdminLogin
          onLogin={handleLogin}
          loading={authLoading}
          error={authError}
        />
        <ToastStackComponent />
      </>
    );
  }

  // Main Admin Dashboard
  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AdminLayout>
      {showForm && renderForm()}
      <ToastStackComponent />
    </>
  );
};

export default AdminPanel;
