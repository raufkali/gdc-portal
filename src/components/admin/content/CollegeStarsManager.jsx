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
import ImageUpload from "./Shared/ImageUpload";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { logActivity } from "../../../firebase/audit";
import { invalidateCache } from "../../../firebase/db";

const CollegeStarsManager = () => {
  const { showSuccess, showError } = useNotification();
  const { userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "collegeStars"));
      let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
      });
      setItems(data);
    } catch (error) {
      console.error("Error fetching college stars:", error);
      showError("Error fetching college stars: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = async (file, folder) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(
        file,
        folder || "college-stars/",
        () => {},
      );
      if (result?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        return result.url;
      }
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      showError("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setImageKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "collegeStars", editing.id), formData);
        invalidateCache("collegeStars", editing.id);
        await logActivity(userProfile, "UPDATE", "collegeStars", editing.id, { name: formData.name });
        showSuccess("College star updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "collegeStars"), formData);
        invalidateCache("collegeStars", docRef.id);
        await logActivity(userProfile, "CREATE", "collegeStars", docRef.id, { name: formData.name });
        showSuccess("College star added successfully!");
      }
      setShowModal(false);
      setFormData({});
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
      await deleteDoc(doc(db, "collegeStars", deletingId));
      invalidateCache("collegeStars", deletingId);
      await logActivity(userProfile, "DELETE", "collegeStars", deletingId);
      showSuccess("College star deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchItems();
    } catch (error) {
      showError("Error deleting: " + error.message);
    }
  };

  const fields = [
    {
      key: "name",
      label: "Student Name",
      type: "text",
      required: true,
      placeholder: "Enter student name",
    },
    {
      key: "batch",
      label: "Batch / Year",
      type: "text",
      required: true,
      placeholder: "e.g., 2020-2024",
    },
    {
      key: "achievement",
      label: "Achievement",
      type: "text",
      required: true,
      placeholder: "e.g., Gold Medalist",
    },
    {
      key: "date",
      label: "Date of Recognition",
      type: "date",
      required: false,
    },
    {
      key: "description",
      label: "Brief Description",
      type: "textarea",
      required: false,
      placeholder: "Write about their success...",
    },
    {
      key: "link",
      label: "External Link (optional)",
      type: "text",
      required: false,
      placeholder: "https://...",
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

  const getImageUrl = (item) => {
    if (!item.imageUrl) return null;
    try {
      new URL(item.imageUrl);
      return item.imageUrl;
    } catch {
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn rounded-pill px-4"
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
          onMouseEnter={(e) => (e.target.style.background = "#7A1523")}
          onMouseLeave={(e) => (e.target.style.background = "#A51C30")}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Star
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
            <i className="bi bi-star"></i>
          </div>
          <p className="text-muted">
            No college stars yet. Click "Add Star" to feature a student.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      height: "180px",
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                    }}
                  >
                    <div className="text-center">
                      <i className="bi bi-image fs-2 d-block mb-1"></i>
                      <span>No Image</span>
                    </div>
                  </div>
                )}
                <div className="card-body">
                  <h6
                    className="fw-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {item.name}
                  </h6>
                  <p className="small text-muted">{item.batch}</p>
                  <p className="small text-muted">{item.achievement}</p>
                  {item.date && (
                    <p className="small text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {formatDate(item.date)}
                    </p>
                  )}
                  {item.description && (
                    <p
                      className="small"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.description.substring(0, 80)}...
                    </p>
                  )}
                </div>
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm flex-grow-1"
                      style={{
                        background: "rgba(165,28,48,0.08)",
                        color: "#A51C30",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        border: "none",
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
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "rgba(220,53,69,0.08)",
                        color: "#dc3545",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        border: "none",
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
          ))}
        </div>
      )}

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
                  {editing ? "Edit" : "Add"} College Star
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <ImageUpload
                      key={`${editing?.id || "new"}-${imageKey}`}
                      onUpload={handleUpload}
                      existingImage={formData.imageUrl || null}
                      label="Image"
                      folder="college-stars/"
                    />
                    {formData.imageUrl && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={removeImage}
                        style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                      >
                        <i className="bi bi-x"></i> Remove image
                      </button>
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
                      disabled={uploading || submitting}
                      style={{
                        background: "#A51C30",
                        color: "#fff",
                        border: "none",
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
        title="College Star"
      />
    </div>
  );
};

export default CollegeStarsManager;
