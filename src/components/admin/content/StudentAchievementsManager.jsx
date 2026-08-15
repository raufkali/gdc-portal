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

const StudentAchievementsManager = () => {
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
      const snap = await getDocs(collection(db, "studentAchievements"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("🏆 Achievements fetched:", data.length);
      setItems(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
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
        "achievements/",
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
        await updateDoc(doc(db, "studentAchievements", editing.id), formData);
        alert("🏆 Achievement updated successfully!");
      } else {
        await addDoc(collection(db, "studentAchievements"), formData);
        alert("🏆 Achievement added successfully!");
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
      await deleteDoc(doc(db, "studentAchievements", deletingId));
      alert("🏆 Achievement deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const fields = [
    {
      key: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "e.g., International Debate Champion",
    },
    {
      key: "studentName",
      label: "Student Name",
      type: "text",
      required: true,
      placeholder: "Full name",
    },
    {
      key: "achievement",
      label: "Achievement Details",
      type: "text",
      required: true,
      placeholder: "e.g., First Prize in National Science Fair",
    },
    {
      key: "date",
      label: "Date (YYYY-MM-DD)",
      type: "text",
      required: false,
      placeholder: "2025-06-01",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "Write more about this achievement...",
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
          <i className="bi bi-plus-circle me-1"></i> Add Achievement
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
            <i className="bi bi-trophy"></i>
          </div>
          <p className="text-muted">
            No achievements yet. Click "Add Achievement" to record student
            success.
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
                    alt={item.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                ) : null}
                <div className="card-body">
                  <h6
                    className="fw-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {item.title}
                  </h6>
                  <p className="small text-muted">{item.studentName}</p>
                  <p className="small text-muted">{item.achievement}</p>
                  {item.date && (
                    <p className="small text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {item.date}
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

      {/* Modal (same as CollegeStars, reused) */}
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
                  {editing ? "Edit" : "Add"} Achievement
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
        title="Achievement"
      />
    </div>
  );
};

export default StudentAchievementsManager;
