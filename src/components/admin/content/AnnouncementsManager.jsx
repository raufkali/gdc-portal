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
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { logActivity } from "../../../firebase/audit";
import { invalidateCache } from "../../../firebase/db";

const AnnouncementsManager = () => {
  const { isHOD, departmentId, userProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "announcements"));
      let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (isHOD && departmentId) {
        data = data.filter((d) => d.departmentId === departmentId);
      }
      setItems(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      showError("Error fetching announcements: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isHOD, departmentId]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadToR2WithProgress(
        file,
        "announcements/",
        (progress) => {
          setUploadProgress(progress);
        },
      );
      return result.url;
    } catch (error) {
      showError("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dateObj = new Date();
      if (formData.date) {
        dateObj = new Date(formData.date);
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date();
        }
      }

      const data = {
        title: formData.title || "",
        content: formData.content || "",
        author: formData.author || (isHOD ? userProfile?.displayName || "HOD" : ""),
        category: formData.category || "",
        imageUrl: formData.imageUrl || "",
        fileUrl: formData.fileUrl || "",
        date: dateObj,
        updatedAt: new Date(),
      };

      if (isHOD && departmentId) {
        data.departmentId = departmentId;
      } else if (formData.departmentId) {
        data.departmentId = formData.departmentId;
      }

      if (editing) {
        if (isHOD && editing.departmentId && editing.departmentId !== departmentId) {
          showError("You can only modify announcements from your own department.");
          return;
        }
        await updateDoc(doc(db, "announcements", editing.id), data);
        invalidateCache("announcements", editing.id);
        await logActivity(userProfile, "UPDATE", "announcements", editing.id, { title: data.title });
        showSuccess("Announcement updated successfully!");
      } else {
        data.createdAt = new Date();
        const docRef = await addDoc(collection(db, "announcements"), data);
        invalidateCache("announcements", docRef.id);
        await logActivity(userProfile, "CREATE", "announcements", docRef.id, { title: data.title });
        showSuccess("Announcement added successfully!");
      }
      setShowModal(false);
      setFormData({});
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
      showError("Error saving: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (isHOD && departmentId) {
        const itemToDelete = items.find((i) => i.id === deletingId);
        if (itemToDelete && itemToDelete.departmentId && itemToDelete.departmentId !== departmentId) {
          showError("You cannot delete announcements from other departments.");
          return;
        }
      }
      await deleteDoc(doc(db, "announcements", deletingId));
      invalidateCache("announcements", deletingId);
      await logActivity(userProfile, "DELETE", "announcements", deletingId);
      showSuccess("Announcement deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      showError("Error deleting: " + error.message);
    }
  };

  const handleFileUploadWrapper = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showError("File is too large. Please upload a file smaller than 20MB.");
      e.target.value = "";
      return;
    }

    const url = await handleFileUpload(file);
    if (url) {
      if (file.type.startsWith("image/")) {
        setFormData({ ...formData, imageUrl: url });
      } else {
        setFormData({ ...formData, fileUrl: url });
      }
    }
    e.target.value = "";
  };

  const removeFile = (type) => {
    if (type === "image") {
      setFormData({ ...formData, imageUrl: "" });
    } else {
      setFormData({ ...formData, fileUrl: "" });
    }
  };

  const formatDisplayDate = (date) => {
    if (!date) return "No date";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleDateString();
    } catch (e) {
      return "Invalid date";
    }
  };

  // Get file icon based on file extension
  const getFileIcon = (url) => {
    if (!url) return "bi-file-earmark";
    if (url.endsWith(".pdf")) return "bi-file-earmark-pdf";
    if (url.match(/\.(doc|docx)$/i)) return "bi-file-earmark-word";
    if (url.match(/\.(xls|xlsx)$/i)) return "bi-file-earmark-excel";
    if (url.match(/\.(ppt|pptx)$/i)) return "bi-file-earmark-ppt";
    if (url.match(/\.(zip|rar|7z)$/i)) return "bi-file-earmark-zip";
    return "bi-file-earmark";
  };

  const getFileColor = (url) => {
    if (!url) return "#6c757d";
    if (url.endsWith(".pdf")) return "#dc3545";
    if (url.match(/\.(doc|docx)$/i)) return "#007bff";
    if (url.match(/\.(xls|xlsx)$/i)) return "#28a745";
    if (url.match(/\.(ppt|pptx)$/i)) return "#fd7e14";
    if (url.match(/\.(zip|rar|7z)$/i)) return "#6c757d";
    return "#6c757d";
  };

  const getFileLabel = (url) => {
    if (!url) return "File";
    const ext = url.split(".").pop()?.toUpperCase() || "FILE";
    return ext;
  };

  const fields = [
    {
      key: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter announcement title",
    },
    {
      key: "content",
      label: "Content",
      type: "textarea",
      required: true,
      placeholder: "Write the announcement content...",
    },
    {
      key: "category",
      label: "Category",
      type: "text",
      required: false,
      placeholder: "e.g., Admissions, Events, Results",
    },
    {
      key: "author",
      label: "Author",
      type: "text",
      required: false,
      placeholder: "e.g., Admin Office",
    },
    { key: "date", label: "Date", type: "date", required: false },
  ];

  const renderField = (field) => {
    const value = formData[field.key] || "";
    const onChange = (val) => setFormData({ ...formData, [field.key]: val });

    if (field.type === "textarea") {
      return (
        <textarea
          className="form-control"
          rows="4"
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

  const handleEdit = (item) => {
    let dateValue = "";
    if (item.date) {
      try {
        const d = item.date.toDate ? item.date.toDate() : new Date(item.date);
        if (!isNaN(d.getTime())) {
          dateValue = d.toISOString().split("T")[0];
        }
      } catch (e) {
        dateValue = "";
      }
    }

    setEditing(item);
    setFormData({
      ...item,
      date: dateValue,
    });
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-megaphone me-2" style={{ color: "#A51C30" }}></i>
          Announcements
        </h4>
        <button
          className="btn rounded-pill px-4 ms-auto mt-2"
          onClick={() => {
            setEditing(null);
            setFormData({});
            setShowModal(true);
          }}
          style={{
            background: "#A51C30",
            color: "#fff",
            fontSize: "0.85rem",
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
          <i className="bi bi-plus-circle"></i> Announcement
        </button>
      </div>

      {/* Content */}
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
            <i className="bi bi-megaphone"></i>
          </div>
          <h5 className="text-muted">No announcements found</h5>
          <p className="text-muted small">
            Click "Add Announcement" to create your first one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                {/* Show Image if exists */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: "140px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {/* Show PDF/File Icon if fileUrl exists and no image */}
                {!item.imageUrl && item.fileUrl && (
                  <div
                    style={{
                      height: "140px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(165, 28, 48, 0.04)",
                      borderBottom: "1px solid rgba(165, 28, 48, 0.08)",
                    }}
                  >
                    <i
                      className={`bi ${getFileIcon(item.fileUrl)}`}
                      style={{
                        fontSize: "3.5rem",
                        color: getFileColor(item.fileUrl),
                      }}
                    ></i>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: getFileColor(item.fileUrl),
                        fontWeight: "600",
                        marginTop: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {getFileLabel(item.fileUrl)}
                    </span>
                  </div>
                )}

                <div className="card-body">
                  <div className="d-flex flex-wrap gap-1 mb-1">
                    {item.category && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(165, 28, 48, 0.08)",
                          color: "#A51C30",
                          fontSize: "0.6rem",
                          fontWeight: "500",
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                    {item.fileUrl && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(220, 53, 69, 0.08)",
                          color: "#dc3545",
                          fontSize: "0.6rem",
                          fontWeight: "500",
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf me-1"></i>
                        PDF
                      </span>
                    )}
                  </div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ fontSize: "0.95rem", color: "var(--color-text)" }}
                  >
                    {item.title}
                  </h6>
                  <p
                    className="small text-muted mb-2"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {item.content?.substring(0, 80)}...
                  </p>
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.7rem" }}
                  >
                    <i className="bi bi-calendar me-1"></i>
                    {formatDisplayDate(item.date)}
                  </small>
                  {item.author && (
                    <small
                      className="text-muted d-block"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <i className="bi bi-person me-1"></i>
                      {item.author}
                    </small>
                  )}
                </div>
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm flex-grow-1"
                      style={{
                        background: "rgba(165, 28, 48, 0.08)",
                        color: "#A51C30",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: "none",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleEdit(item)}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#A51C30";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(165, 28, 48, 0.08)";
                        e.target.style.color = "#A51C30";
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "rgba(220, 53, 69, 0.08)",
                        color: "#dc3545",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
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
                        e.target.style.background = "rgba(220, 53, 69, 0.08)";
                        e.target.style.color = "#dc3545";
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            style={{ maxWidth: "600px" }}
          >
            <div
              className="modal-content shadow-lg border-0"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i
                    className="bi bi-megaphone me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  {editing ? "Edit" : "Add"} Announcement
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Image Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileUploadWrapper}
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
                    {formData.imageUrl && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <img
                          src={formData.imageUrl}
                          alt="preview"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFile("image")}
                          style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-x"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Attachment (PDF, etc.)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                      onChange={handleFileUploadWrapper}
                      disabled={uploading}
                      style={{ borderRadius: "10px" }}
                    />
                    {formData.fileUrl && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-pdf fs-4 text-danger"></i>
                        <a
                          href={formData.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary small"
                          style={{ fontSize: "0.8rem" }}
                        >
                          View uploaded file
                        </a>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFile("file")}
                          style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-x"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fields */}
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
                      disabled={uploading}
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
                      {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Uploading...
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
        title="Announcement"
      />
    </div>
  );
};

export default AnnouncementsManager;
