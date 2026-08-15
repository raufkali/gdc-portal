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

const DepartmentsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Main image upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  // HOD image upload
  const [hodUploading, setHodUploading] = useState(false);
  const [hodUploadProgress, setHodUploadProgress] = useState(0);
  const [hodPreviewImage, setHodPreviewImage] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "departments"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ----- Main Image Upload -----
  const handleMainFileUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadToR2WithProgress(
        file,
        "departments/",
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

  const handleMainFileSelect = async (e) => {
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
    const url = await handleMainFileUpload(file);
    if (url) setFormData({ ...formData, imageUrl: url });
    e.target.value = "";
  };

  const removeMainImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setPreviewImage(null);
  };

  // ----- HOD Image Upload -----
  const handleHodFileUpload = async (file) => {
    if (!file) return null;
    setHodUploading(true);
    setHodUploadProgress(0);
    try {
      const result = await uploadToR2WithProgress(
        file,
        "departments/hod/",
        (progress) => setHodUploadProgress(progress),
      );
      if (result?.url) {
        setHodPreviewImage(result.url);
        setHodUploadProgress(100);
        setTimeout(() => setHodUploadProgress(0), 1000);
        return result.url;
      }
      return null;
    } catch (error) {
      console.error("HOD upload error:", error);
      alert("HOD image upload failed: " + error.message);
      return null;
    } finally {
      setHodUploading(false);
    }
  };

  const handleHodFileSelect = async (e) => {
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
    const url = await handleHodFileUpload(file);
    if (url) setFormData({ ...formData, hodImage: url });
    e.target.value = "";
  };

  const removeHodImage = () => {
    setFormData({ ...formData, hodImage: "" });
    setHodPreviewImage(null);
  };

  // ----- Submit / Delete -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDoc(doc(db, "departments", editing.id), formData);
        alert("Department updated successfully!");
      } else {
        await addDoc(collection(db, "departments"), formData);
        alert("Department added successfully!");
      }
      setShowModal(false);
      setFormData({});
      setPreviewImage(null);
      setHodPreviewImage(null);
      setEditing(null);
      await fetchItems();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "departments", deletingId));
      alert("Department deleted successfully!");
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  // ----- Form fields -----
  const fields = [
    {
      key: "name",
      label: "Department Name",
      type: "text",
      required: true,
      placeholder: "Enter department name",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "text",
      required: false,
      placeholder: "Enter subtitle",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Write department description...",
    },
    {
      key: "category",
      label: "Category",
      type: "text",
      required: false,
      placeholder: "e.g., Science, Arts",
    },
    {
      key: "headName",
      label: "Head of Department",
      type: "text",
      required: false,
      placeholder: "Dr. John Doe",
    },
    {
      key: "facultyCount",
      label: "Faculty Count",
      type: "number",
      required: false,
      placeholder: "10",
    },

    // NEW HOD fields
    {
      key: "hodMessage",
      label: "Message from HOD",
      type: "textarea",
      required: false,
      placeholder: "Write a short message from the Head of Department...",
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

  // ----- Helper to validate image URL -----
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
            setHodPreviewImage(null);
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
          <i className="bi bi-plus-circle me-1"></i> Add Department
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
            <i className="bi bi-building"></i>
          </div>
          <p className="text-muted">
            No departments found. Click "Add Department" to create one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
            const hodImageUrl = item.hodImage || null;
            return (
              <div key={item.id} className="col-md-6 col-lg-4">
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
                      alt={item.name}
                      style={{ height: "150px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div style="height:150px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999;font-size:0.9rem;">
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
                        height: "150px",
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
                      {item.name}
                    </h6>
                    {item.subtitle && (
                      <p className="small text-muted">{item.subtitle}</p>
                    )}
                    <p
                      className="small"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.description?.substring(0, 80)}...
                    </p>

                    {/* HOD info row */}
                    {(hodImageUrl || item.hodMessage) && (
                      <div
                        className="d-flex align-items-start gap-2 mt-2 pt-2 border-top"
                        style={{ borderColor: "rgba(165,28,48,0.15)" }}
                      >
                        {hodImageUrl && (
                          <img
                            src={hodImageUrl}
                            alt="HOD"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #A51C30",
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        {item.hodMessage && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-muted)",
                              lineHeight: "1.4",
                            }}
                          >
                            <span style={{ fontWeight: 600, color: "#A51C30" }}>
                              “
                            </span>
                            {item.hodMessage.substring(0, 60)}
                            {item.hodMessage.length > 60 && "..."}
                            <span style={{ fontWeight: 600, color: "#A51C30" }}>
                              ”
                            </span>
                            {item.headName && (
                              <div
                                style={{
                                  fontSize: "0.65rem",
                                  color: "#A51C30",
                                  fontWeight: 600,
                                  marginTop: "2px",
                                }}
                              >
                                — {item.headName}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="d-flex flex-wrap gap-1 mt-2">
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
                      {item.facultyCount && (
                        <span
                          className="badge"
                          style={{
                            background: "rgba(23, 162, 184, 0.1)",
                            color: "#17a2b8",
                            padding: "0.25rem 0.7rem",
                            borderRadius: "50px",
                            fontWeight: "500",
                            fontSize: "0.65rem",
                          }}
                        >
                          <i className="bi bi-people me-1"></i>
                          {item.facultyCount}
                        </span>
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
                          setPreviewImage(item.imageUrl || null);
                          setHodPreviewImage(item.hodImage || null);
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
                  {editing ? "Edit" : "Add"} Department
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Main Image Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Image (optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleMainFileSelect}
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
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={removeMainImage}
                          style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-x"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* HOD Image Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      HOD Image (optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleHodFileSelect}
                      disabled={hodUploading}
                      style={{ borderRadius: "10px" }}
                    />
                    {hodUploading && (
                      <div className="mt-1">
                        <div className="progress" style={{ height: "4px" }}>
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            style={{
                              width: `${hodUploadProgress}%`,
                              backgroundColor: "#A51C30",
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          {hodUploadProgress}% uploaded
                        </small>
                      </div>
                    )}
                    {(hodPreviewImage || formData.hodImage) && (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <img
                          src={hodPreviewImage || formData.hodImage}
                          alt="HOD preview"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #A51C30",
                          }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={removeHodImage}
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
                      disabled={uploading || hodUploading}
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
                      {uploading || hodUploading ? (
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
                        setHodPreviewImage(null);
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
        title="Department"
      />
    </div>
  );
};

export default DepartmentsManager;
