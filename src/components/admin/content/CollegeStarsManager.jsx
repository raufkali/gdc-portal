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

const CollegeStarsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "collegeStars"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("🌟 College Stars fetched:", data.length);
      setItems(data);
    } catch (error) {
      console.error("Error fetching college stars:", error);
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
    try {
      const result = await uploadToR2WithProgress(
        file,
        "college-stars/",
        (progress) => setUploadProgress(progress),
      );
      if (result?.url) {
        setPreviewImage(result.url);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        return result.url;
      }
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert("File is too large. Please upload a file smaller than 5MB.");
      e.target.value = "";
      return;
    }
    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, GIF).");
      e.target.value = "";
      return;
    }
    const url = await handleFileUpload(file);
    if (url) setFormData({ ...formData, imageUrl: url });
    e.target.value = "";
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "collegeStars", editing.id), formData);
        alert("⭐ College star updated successfully!");
      } else {
        await addDoc(collection(db, "collegeStars"), formData);
        alert("⭐ College star added successfully!");
      }
      setShowModal(false);
      setFormData({});
      setPreviewImage(null);
      setEditing(null);
      await fetchItems();
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "collegeStars", deletingId));
      alert("⭐ College star deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
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
            setPreviewImage(null);
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
                        setPreviewImage(item.imageUrl || null);
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
                    <label className="form-label fw-semibold">
                      Image (optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
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
                    {(previewImage || formData.imageUrl) && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <img
                          src={previewImage || formData.imageUrl}
                          alt="preview"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={removeImage}
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
                      disabled={uploading || submitting}
                      style={{
                        background: "#A51C30",
                        color: "#fff",
                        border: "none",
                      }}
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
                      onClick={() => {
                        setShowModal(false);
                        setPreviewImage(null);
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
        title="College Star"
      />
    </div>
  );
};

export default CollegeStarsManager;
