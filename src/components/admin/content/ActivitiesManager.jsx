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
// 👇 adjust the path if ImageUpload lives somewhere else
import ImageUpload from "./Shared/ImageUpload";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { logActivity } from "../../../firebase/audit";
import { invalidateCache } from "../../../firebase/db";

const ActivitiesManager = () => {
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
  // used to force-remount <ImageUpload /> when the image is removed
  const [imageKey, setImageKey] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "activities"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching activities:", error);
      showError("Error fetching activities: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ Called by <ImageUpload /> AFTER it has compressed the file.
  // `file` is already a compressed .webp
  const handleUpload = async (file, folder) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(
        file,
        folder || "activities/",
        () => {}, // ImageUpload handles its own spinner; progress not needed here
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
    setImageKey((k) => k + 1); // remount ImageUpload so its preview clears
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDoc(doc(db, "activities", editing.id), formData);
        invalidateCache("activities", editing.id);
        await logActivity(userProfile, "UPDATE", "activities", editing.id, { title: formData.title });
        showSuccess("Activity updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "activities"), formData);
        invalidateCache("activities", docRef.id);
        await logActivity(userProfile, "CREATE", "activities", docRef.id, { title: formData.title });
        showSuccess("Activity added successfully!");
      }

      setShowModal(false);
      setFormData({});
      setEditing(null);

      await fetchItems();
    } catch (error) {
      showError("Error saving: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "activities", deletingId));
      invalidateCache("activities", deletingId);
      await logActivity(userProfile, "DELETE", "activities", deletingId);
      showSuccess("Activity deleted successfully!");
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
      label: "Activity Title",
      type: "text",
      required: true,
      placeholder: "Enter activity title",
    },
    {
      key: "content",
      label: "Content",
      type: "textarea",
      required: true,
      placeholder: "Write activity content...",
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

  // Get image URL for display
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
      {/* Header */}
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
          <i className="bi bi-plus-circle me-1"></i> Add Activity
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
            <i className="bi bi-calendar-event"></i>
          </div>
          <p className="text-muted">
            No activities found. Click "Add Activity" to create one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
            return (
              <div key={item.id} className="col-md-6">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      className="card-img-top"
                      alt={item.title}
                      style={{ height: "160px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div style="height:160px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999;font-size:0.9rem;">
                            <div className="text-center">
                              <i className="bi bi-image fs-2 d-block mb-1"></i>
                              <span>No Image</span>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "160px",
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
                    <h6
                      className="fw-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.title}
                    </h6>
                    <p
                      className="small"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.content?.substring(0, 100)}...
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {item.date && (
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(item.date).toLocaleDateString()}
                        </small>
                      )}
                      {item.author && (
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-person me-1"></i>
                          {item.author}
                        </small>
                      )}
                    </div>
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
                  {editing ? "Edit" : "Add"} Activity
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* ✅ Image upload (compression handled inside ImageUpload) */}
                  <div className="mb-3">
                    <ImageUpload
                      key={`${editing?.id || "new"}-${imageKey}`}
                      onUpload={handleUpload}
                      existingImage={formData.imageUrl || null}
                      label="Image"
                      folder="activities/"
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
                      onClick={() => {
                        setShowModal(false);
                      }}
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
        title="Activity"
      />
    </div>
  );
};

export default ActivitiesManager;
