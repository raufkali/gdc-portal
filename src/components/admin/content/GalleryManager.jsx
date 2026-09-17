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

const GalleryManager = () => {
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
      const snap = await getDocs(collection(db, "gallery"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching gallery:", error);
      showError("Error fetching gallery: " + error.message);
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
        folder || "gallery/",
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
    if (uploading || submitting) return;
    if (!formData.imageUrl) {
      showError("Please upload an image.");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "gallery", editing.id), formData);
        invalidateCache("gallery", editing.id);
        await logActivity(userProfile, "UPDATE", "gallery", editing.id, { caption: formData.caption });
        showSuccess("Image updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "gallery"), formData);
        invalidateCache("gallery", docRef.id);
        await logActivity(userProfile, "CREATE", "gallery", docRef.id, { caption: formData.caption });
        showSuccess("Image added successfully!");
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
      await deleteDoc(doc(db, "gallery", deletingId));
      invalidateCache("gallery", deletingId);
      await logActivity(userProfile, "DELETE", "gallery", deletingId);
      showSuccess("Image deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchItems();
    } catch (error) {
      showError("Error deleting: " + error.message);
    }
  };

  const fields = [
    {
      key: "caption",
      label: "Image Title",
      type: "text",
      required: false,
      placeholder: "Enter image title/caption...",
    },
    {
      key: "altText",
      label: "Alt Text (for accessibility)",
      type: "text",
      required: false,
      placeholder: "Describe the image...",
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      required: false,
      options: [
        "Campus",
        "Events",
        "Students",
        "Faculty",
        "Facilities",
        "Other",
      ],
    },
  ];

  const renderField = (field) => {
    const value = formData[field.key] || "";
    const onChange = (val) => setFormData({ ...formData, [field.key]: val });

    if (field.type === "select") {
      return (
        <select
          className="form-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderRadius: "10px" }}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
          onMouseEnter={(e) => {
            e.target.style.background = "#7A1523";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#A51C30";
          }}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Image
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
            <i className="bi bi-image"></i>
          </div>
          <p className="text-muted">
            No images in gallery. Click "Add Image" to upload one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
            return (
              <div key={item.id} className="col-md-4 col-sm-6">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "var(--card-bg)",
                    overflow: "hidden",
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      className="card-img-top"
                      alt={item.caption || "Gallery"}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: "0.9rem",
                      }}
                    >
                      <div className="text-center">
                        <i className="bi bi-image fs-2 d-block mb-1"></i>
                        <span>No Image</span>
                      </div>
                    </div>
                  )}
                  <div className="card-body">
                    {item.caption && (
                      <h6
                        className="fw-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {item.caption}
                      </h6>
                    )}
                    {item.category && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(165, 28, 48, 0.08)",
                          color: "#A51C30",
                          padding: "0.25rem 0.7rem",
                          borderRadius: "50px",
                          fontWeight: "500",
                          fontSize: "0.65rem",
                        }}
                      >
                        {item.category}
                      </span>
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
            );
          })}
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
                  {editing ? "Edit" : "Add"} Image
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
                      folder="gallery/"
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
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!uploading && !submitting) {
                          e.target.style.background = "#7A1523";
                        }
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
                      ) : submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
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
        title="Image"
      />
    </div>
  );
};

export default GalleryManager;
