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

const TestimonialsManager = () => {
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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "testimonials"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
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
        "testimonials/",
        (progress) => {
          setUploadProgress(progress);
        },
      );

      if (result && result.url) {
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

    if (file.size > 5 * 1024 * 1024) {
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
    if (url) {
      setFormData({ ...formData, imageUrl: url });
    }
    e.target.value = "";
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDoc(doc(db, "testimonials", editing.id), formData);
        alert("✅ Testimonial updated successfully!");
      } else {
        await addDoc(collection(db, "testimonials"), formData);
        alert("✅ Testimonial added successfully!");
      }

      setShowModal(false);
      setFormData({});
      setPreviewImage(null);
      setEditing(null);

      await fetchItems();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "testimonials", deletingId));
      alert("✅ Testimonial deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);

      await fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const fields = [
    {
      key: "studentName",
      label: "Student Name",
      type: "text",
      required: true,
      placeholder: "Enter student name",
    },
    {
      key: "program",
      label: "Program",
      type: "text",
      required: false,
      placeholder: "e.g., BS Computer Science",
    },
    {
      key: "content",
      label: "Testimonial",
      type: "textarea",
      required: true,
      placeholder: "Write the testimonial...",
    },
    {
      key: "rating",
      label: "Rating (1-5)",
      type: "number",
      required: false,
      placeholder: "5",
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
    if (field.type === "number") {
      return (
        <input
          type="number"
          className="form-control"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          required={field.required}
          min="1"
          max="5"
          placeholder={field.placeholder}
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

  // Render stars for rating display
  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <span style={{ color: "#ffc107", fontSize: "0.85rem" }}>
        {"★".repeat(Math.floor(rating))}
        {rating % 1 !== 0 && "☆"}
      </span>
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
          onMouseEnter={(e) => {
            e.target.style.background = "#7A1523";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#A51C30";
          }}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Testimonial
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
            <i className="bi bi-chat-quote"></i>
          </div>
          <p className="text-muted">
            No testimonials found. Click "Add Testimonial" to create one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
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
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          className="rounded-circle"
                          alt={item.studentName}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            border: "2px solid rgba(165, 28, 48, 0.1)",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: "rgba(165, 28, 48, 0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#A51C30",
                            fontWeight: "600",
                            fontSize: "1.2rem",
                            flexShrink: 0,
                          }}
                        >
                          {item.studentName?.charAt(0) || "S"}
                        </div>
                      )}
                      <div>
                        <h6
                          className="fw-bold"
                          style={{ color: "var(--color-text)" }}
                        >
                          {item.studentName}
                        </h6>
                        {item.program && (
                          <small
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {item.program}
                          </small>
                        )}
                      </div>
                      {item.rating && (
                        <span className="ms-auto">
                          {renderStars(item.rating)}
                        </span>
                      )}
                    </div>
                    <p
                      className="small mt-2"
                      style={{
                        color: "var(--color-text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      "{item.content}"
                    </p>
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
                          setPreviewImage(item.imageUrl || null);
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
                  {editing ? "Edit" : "Add"} Testimonial
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
                    <label className="form-label fw-semibold">
                      Student Image (optional)
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
                          onError={(e) => {
                            e.target.style.display = "none";
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
        title="Testimonial"
      />
    </div>
  );
};

export default TestimonialsManager;
