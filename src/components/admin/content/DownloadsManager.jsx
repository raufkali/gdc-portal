import { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadToR2WithProgress } from "../../../utils/cloudflare";
import DeleteModal from "./Shared/DeleteModal";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { logActivity } from "../../../firebase/audit";
import { invalidateCache } from "../../../firebase/db";

const DownloadsManager = () => {
  const { showSuccess, showError } = useNotification();
  const { userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({ fileType: "pdf" }); // default type
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "downloads"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      showError("Error fetching downloads: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    setUploadProgress(0);

    // Determine folder based on file type
    const folder =
      formData.fileType === "pdf" ? "downloads/pdf/" : "downloads/images/";

    try {
      const result = await uploadToR2WithProgress(file, folder, (progress) =>
        setUploadProgress(progress),
      );
      if (result?.url) {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        return result.url;
      }
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      showError("File upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("File is too large. Please upload a file smaller than 20MB.");
      e.target.value = "";
      return;
    }

    // Validate based on selected fileType
    const isPdf = formData.fileType === "pdf";
    const isValid = isPdf
      ? file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      : file.type.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);

    if (!isValid) {
      showError(
        isPdf
          ? "Please upload a valid PDF file."
          : "Please upload a valid image file (JPG, PNG, GIF, WEBP).",
      );
      e.target.value = "";
      return;
    }

    const url = await handleFileUpload(file);
    if (url) setFormData({ ...formData, fileUrl: url });
    e.target.value = "";
  };

  const removeFile = () => {
    setFormData({ ...formData, fileUrl: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "downloads", editing.id), formData);
        invalidateCache("downloads", editing.id);
        await logActivity(userProfile, "UPDATE", "downloads", editing.id, { title: formData.title });
        showSuccess("Download updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "downloads"), formData);
        invalidateCache("downloads", docRef.id);
        await logActivity(userProfile, "CREATE", "downloads", docRef.id, { title: formData.title });
        showSuccess("Download added successfully!");
      }
      setShowModal(false);
      setFormData({ fileType: "pdf" });
      setEditing(null);
      await fetchItems();
    } catch (error) {
      showError("Error saving: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "downloads", deletingId));
      invalidateCache("downloads", deletingId);
      await logActivity(userProfile, "DELETE", "downloads", deletingId);
      showSuccess("Download deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchItems();
    } catch (error) {
      showError("Error deleting: " + error.message);
    }
  };

  const fields = [
    {
      key: "title",
      label: "File Title",
      type: "text",
      required: true,
      placeholder: "e.g., Admission Form 2025",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "Brief description of the file...",
    },
    {
      key: "category",
      label: "Category",
      type: "text",
      required: false,
      placeholder: "e.g., Admission, Syllabus, Forms",
    },
    {
      key: "date",
      label: "Date",
      type: "date", // now a proper date picker
      required: false,
    },
  ];

  const renderField = (field) => {
    const value = formData[field.key] || "";
    const onChange = (val) => setFormData({ ...formData, [field.key]: val });

    if (field.type === "textarea") {
      return (
        <textarea
          className="form-control"
          rows="3"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          style={{ borderRadius: "10px", resize: "vertical" }}
        />
      );
    }
    if (field.type === "date") {
      return (
        <input
          type="date"
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          style={{ borderRadius: "10px" }}
        />
      );
    }
    return (
      <input
        type={field.type || "text"}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        placeholder={field.placeholder}
        style={{ borderRadius: "10px" }}
      />
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn rounded-pill px-4"
          onClick={() => {
            setEditing(null);
            setFormData({ fileType: "pdf" });
            setShowModal(true);
          }}
          style={{
            background: "#A51C30",
            color: "#fff",
            fontSize: "0.85rem",
            border: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#7A1523")}
          onMouseLeave={(e) => (e.target.style.background = "#A51C30")}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Download
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-download"></i>
          </div>
          <p className="text-muted">
            No downloads yet. Click "Add Download" to upload a file.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const isPdf =
              item.fileType === "pdf" ||
              item.fileUrl?.toLowerCase().endsWith(".pdf");
            return (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-start gap-2">
                      {/* File Type Icon */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          background: isPdf
                            ? "rgba(220, 53, 69, 0.1)"
                            : "rgba(40, 167, 69, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className={
                            isPdf ? "bi bi-file-pdf" : "bi bi-file-image"
                          }
                          style={{
                            fontSize: "1.4rem",
                            color: isPdf ? "#dc3545" : "#28a745",
                          }}
                        ></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6
                          className="fw-bold mb-1"
                          style={{ color: "var(--color-text)" }}
                        >
                          {item.title}
                        </h6>
                        {item.category && (
                          <span
                            className="badge"
                            style={{
                              background: "rgba(165,28,48,0.08)",
                              color: "#A51C30",
                              fontSize: "0.65rem",
                            }}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p
                        className="small mt-2"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {item.description.substring(0, 80)}...
                      </p>
                    )}
                    {item.date && (
                      <p className="small text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0">
                    <div className="d-flex gap-2">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm flex-grow-1"
                          style={{
                            background: "rgba(165,28,48,0.08)",
                            color: "#A51C30",
                            borderRadius: "50px",
                            fontSize: "0.75rem",
                            border: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#A51C30";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "rgba(165,28,48,0.08)";
                            e.target.style.color = "#A51C30";
                          }}
                        >
                          <i
                            className={`bi ${isPdf ? "bi-download" : "bi-eye"} me-1`}
                          ></i>
                          {isPdf ? "Download" : "View"}
                        </a>
                      )}
                      <button
                        className="btn btn-sm"
                        style={{
                          background: "rgba(165,28,48,0.08)",
                          color: "#A51C30",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          border: "none",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => {
                          setEditing(item);
                          setFormData(item);
                          setShowModal(true);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#A51C30";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(165,28,48,0.08)";
                          e.target.style.color = "#A51C30";
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: "rgba(220,53,69,0.08)",
                          color: "#dc3545",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          border: "none",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => {
                          setDeletingId(item.id);
                          setShowDeleteModal(true);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#dc3545";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(220,53,69,0.08)";
                          e.target.style.color = "#dc3545";
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div
              className="modal-content shadow-lg border-0"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {editing ? "Edit" : "Add"} Download
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* File Type Selection */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      File Type *
                    </label>
                    <select
                      className="form-select"
                      value={formData.fileType || "pdf"}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          fileType: e.target.value,
                          fileUrl: "",
                        });
                      }}
                      style={{ borderRadius: "10px" }}
                      required
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="image">Image</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {formData.fileType === "pdf"
                        ? "Upload PDF"
                        : "Upload Image"}
                      {!editing && <span className="text-danger ms-1">*</span>}
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept={
                        formData.fileType === "pdf"
                          ? ".pdf,application/pdf"
                          : "image/*"
                      }
                      onChange={handleFileSelect}
                      disabled={uploading}
                      style={{ borderRadius: "10px" }}
                    />
                    {uploading && (
                      <div className="mt-1">
                        <div className="progress" style={{ height: "4px" }}>
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            style={{
                              width: `${uploadProgress}%`,
                              backgroundColor: "#A51C30",
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          {uploadProgress}% uploaded
                        </small>
                      </div>
                    )}
                    {formData.fileUrl && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <span className="text-success">
                          <i
                            className={`bi ${formData.fileType === "pdf" ? "bi-file-pdf" : "bi-file-image"} me-1`}
                          ></i>
                          File uploaded
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={removeFile}
                          style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-x"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {fields.map((field) => (
                    <div className="mb-3" key={field.key}>
                      <label className="form-label fw-semibold">
                        {field.label}
                        {field.required && (
                          <span className="text-danger ms-1">*</span>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn px-4 rounded-pill"
                      disabled={
                        uploading ||
                        submitting ||
                        (!editing && !formData.fileUrl)
                      }
                      style={{
                        background: "#A51C30",
                        color: "#fff",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#7A1523")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#A51C30")
                      }
                    >
                      {uploading || submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          {uploading ? "Uploading..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-1"></i>
                          {editing ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Download"
      />
    </div>
  );
};

export default DownloadsManager;
