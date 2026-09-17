import { useState, useEffect } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { uploadToR2WithProgress } from "../../utils/cloudflare";
import {
  GeneralSettings,
  BrandingSettings,
  PrincipalSettings,
  ContactSettings,
  SocialSettings,
} from "./settings";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import { logActivity } from "../../firebase/audit";

const SettingsManager = () => {
  const { showSuccess, showError } = useNotification();
  const { userProfile } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadError(null);
    try {
      await updateSettings(form);
      await logActivity(userProfile, "UPDATE", "settings", "global_settings", { section: activeSection });
      showSuccess("Settings updated successfully!");
    } catch (error) {
      showError("Error updating settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, field) => {
    if (!file) {
      showError("No file selected");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      console.log(`📤 Uploading ${file.name} to settings/ folder...`);
      console.log(`📁 File size: ${(file.size / 1024).toFixed(2)} KB`);
      console.log(`📁 File type: ${file.type}`);

      const result = await uploadToR2WithProgress(
        file,
        "settings/",
        (progress) => {
          setUploadProgress(progress);
          console.log(`Upload progress: ${progress}%`);
        },
      );

      console.log(" Upload successful:", result);

      if (result && result.url) {
        setForm({ ...form, [field]: result.url });
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setUploadError(err.message || "Upload failed");

      let errorMessage = "Upload failed: ";
      if (err.message.includes("ERR_NAME_NOT_RESOLVED")) {
        errorMessage +=
          "Cannot reach the upload server. Please check your internet connection.";
      } else if (err.message.includes("status 403")) {
        errorMessage += "Permission denied. Check your upload token.";
      } else if (err.message.includes("status 404")) {
        errorMessage += "Upload endpoint not found. Check your worker URL.";
      } else {
        errorMessage += err.message || "Unknown error";
      }

      showError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (!form) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          role="status"
          style={{ width: "3rem", height: "3rem", color: "#A51C30" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Section configuration with icons and colors - ALL CRIMSON
  const sections = [
    { id: "general", label: "General", icon: "bi-house" },
    { id: "branding", label: "Branding", icon: "bi-palette" },
    { id: "principal", label: "Principal", icon: "bi-person-badge" },
    { id: "contact", label: "Contact", icon: "bi-envelope" },
    { id: "social", label: "Social", icon: "bi-share" },
  ];

  const renderSection = () => {
    const props = {
      form,
      setForm,
      handleImageUpload,
      uploading,
      uploadProgress,
      uploadError,
    };
    switch (activeSection) {
      case "general":
        return <GeneralSettings {...props} />;
      case "branding":
        return <BrandingSettings {...props} />;
      case "principal":
        return <PrincipalSettings {...props} />;
      case "contact":
        return <ContactSettings {...props} />;
      case "social":
        return <SocialSettings {...props} />;
      default:
        return null;
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="fw-bold mb-0">
          <i
            className={`bi ${currentSection?.icon} me-2`}
            style={{ color: "#A51C30" }}
          ></i>
          {currentSection?.label}
        </h5>
        <span
          className="badge rounded-pill px-2 py-1"
          style={{
            fontSize: "10px",
            background: "rgba(40, 167, 69, 0.1)",
            color: "#28a745",
          }}
        >
          <i className="bi bi-circle-fill me-1" style={{ fontSize: "6px" }}></i>
          Live
        </span>
        {uploading && (
          <span
            className="badge rounded-pill px-2 py-1"
            style={{
              fontSize: "10px",
              background: "rgba(165, 28, 48, 0.1)",
              color: "#A51C30",
            }}
          >
            <span
              className="spinner-border spinner-border-sm me-1"
              style={{ width: "10px", height: "10px" }}
            ></span>
            {uploadProgress}%
          </span>
        )}
      </div>

      {/* Section Tabs - ALL CRIMSON */}
      <div
        className="d-none d-md-flex flex-wrap gap-1 mb-4"
        style={{
          border: "2px solid #A51C30",
          borderRadius: "20px",
        }}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            className={`btn ${activeSection === section.id ? "text-white" : "btn-outline-secondary"}`}
            onClick={() => setActiveSection(section.id)}
            style={{
              borderRadius: "50px",
              padding: "0.4rem 1.2rem",
              fontSize: "0.85rem",
              background:
                activeSection === section.id ? "#A51C30" : "transparent",
              borderColor:
                activeSection === section.id
                  ? "#A51C30"
                  : "var(--color-border)",
              color:
                activeSection === section.id ? "#fff" : "var(--color-text)",
              transition: "all 0.2s ease",
              transform:
                activeSection === section.id ? "scale(1,1.2)" : "scale(1,1)",
            }}
            onMouseEnter={(e) => {
              if (activeSection !== section.id) {
                e.target.style.borderColor = "#A51C30";
                e.target.style.color = "#A51C30";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.id) {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.color = "var(--color-text)";
              }
            }}
          >
            <i className={`bi ${section.icon} me-1`}></i>
            {section.label}
          </button>
        ))}
      </div>

      {/* Mobile Dropdown - ALL CRIMSON */}
      <div className="d-md-none mb-4">
        <div className="dropdown w-100">
          <button
            className="btn dropdown-toggle w-100 text-start d-flex align-items-center justify-content-between"
            type="button"
            id="settingsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              borderRadius: "12px",
              padding: "0.7rem 1.2rem",
              borderColor: "#e5e5e5",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
            }}
          >
            <span>
              <i
                className={`bi ${currentSection?.icon} me-2`}
                style={{ color: "#A51C30" }}
              ></i>
              {currentSection?.label}
            </span>
          </button>
          <ul
            className="dropdown-menu w-100"
            aria-labelledby="settingsDropdown"
            style={{
              borderRadius: "12px",
              padding: "0.5rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              border: "none",
              marginTop: "4px",
              backgroundColor: "var(--color-bg)",
            }}
          >
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`dropdown-item d-flex align-items-center gap-2 rounded ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    backgroundColor:
                      activeSection === section.id ? "#A51C30" : "transparent",
                    color:
                      activeSection === section.id
                        ? "#fff"
                        : "var(--color-text)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== section.id) {
                      e.target.style.backgroundColor =
                        "rgba(165, 28, 48, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== section.id) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <i className={`bi ${section.icon}`}></i>
                  {section.label}
                  {activeSection === section.id && (
                    <i className="bi bi-check2 ms-auto"></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">{renderSection()}</div>
        </div>

        {/* Save Buttons - ALL CRIMSON */}
        <div className="d-flex flex-wrap gap-2 mt-4">
          <button
            type="submit"
            className="btn px-4 rounded-pill"
            disabled={uploading || saving}
            style={{
              background: "#A51C30",
              color: "#fff",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#7A1523";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#A51C30";
            }}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Uploading {uploadProgress}%...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-2"></i>
                Save All
              </>
            )}
          </button>
          <button
            type="reset"
            className="btn btn-outline-secondary rounded-pill"
            onClick={() => setForm(settings)}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
