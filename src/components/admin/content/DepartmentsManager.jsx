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
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { logActivity } from "../../../firebase/audit";
import { invalidateCache } from "../../../firebase/db";

const DepartmentsManager = () => {
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
  const [hodUploading, setHodUploading] = useState(false);
  const [mainImageKey, setMainImageKey] = useState(0);
  const [hodImageKey, setHodImageKey] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "departments"));
      let data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (isHOD) {
        data = data.filter((d) => d.id === departmentId);
      }
      setItems(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      showError("Error fetching departments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isHOD, departmentId]);

  const handleMainUpload = async (file, folder) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(
        file,
        folder || "departments/",
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

  const handleHodUpload = async (file, folder) => {
    setHodUploading(true);
    try {
      const result = await uploadToR2WithProgress(
        file,
        folder || "departments/hod/",
        () => {},
      );
      if (result?.url) {
        setFormData((prev) => ({ ...prev, hodImage: result.url }));
        return result.url;
      }
      return null;
    } catch (error) {
      console.error("HOD upload error:", error);
      showError("HOD image upload failed: " + error.message);
      return null;
    } finally {
      setHodUploading(false);
    }
  };

  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setMainImageKey((k) => k + 1);
  };

  const removeHodImage = () => {
    setFormData((prev) => ({ ...prev, hodImage: "" }));
    setHodImageKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isHOD && editing && editing.id !== departmentId) {
      showError("You can only modify your own department.");
      return;
    }
    if (isHOD && !editing) {
      showError("HOD is not authorized to create new departments.");
      return;
    }
    try {
      if (editing) {
        await updateDoc(doc(db, "departments", editing.id), formData);
        invalidateCache("departments", editing.id);
        await logActivity(userProfile, "UPDATE", "departments", editing.id, { name: formData.name });
        showSuccess("Department updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "departments"), formData);
        invalidateCache("departments", docRef.id);
        await logActivity(userProfile, "CREATE", "departments", docRef.id, { name: formData.name });
        showSuccess("Department added successfully!");
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
    if (isHOD) {
      showError("HOD is not authorized to delete departments.");
      return;
    }
    try {
      await deleteDoc(doc(db, "departments", deletingId));
      invalidateCache("departments", deletingId);
      await logActivity(userProfile, "DELETE", "departments", deletingId);
      showSuccess("Department deleted successfully!");
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
      {!isHOD && (
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
            <i className="bi bi-plus-circle me-1"></i> Add Department
          </button>
        </div>
      )}

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
                      {!isHOD && (
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
                      )}
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
                  <div className="mb-3">
                    <ImageUpload
                      key={`main-${editing?.id || "new"}-${mainImageKey}`}
                      onUpload={handleMainUpload}
                      existingImage={formData.imageUrl || null}
                      label="Image"
                      folder="departments/"
                    />
                    {formData.imageUrl && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={removeMainImage}
                        style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                      >
                        <i className="bi bi-x"></i> Remove image
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <ImageUpload
                      key={`hod-${editing?.id || "new"}-${hodImageKey}`}
                      onUpload={handleHodUpload}
                      existingImage={formData.hodImage || null}
                      label="HOD Image"
                      folder="departments/hod/"
                    />
                    {formData.hodImage && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={removeHodImage}
                        style={{ borderRadius: "50px", fontSize: "0.7rem" }}
                      >
                        <i className="bi bi-x"></i> Remove HOD image
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
        title="Department"
      />
    </div>
  );
};

export default DepartmentsManager;
