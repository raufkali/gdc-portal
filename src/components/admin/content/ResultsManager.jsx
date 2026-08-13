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

const ResultsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "examResults"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const snap = await getDocs(collection(db, "departments"));
      const deptData = snap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDepartments(deptData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchDepartments();
  }, []);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(file, "examResults/");
      return result.url;
    } catch (error) {
      alert("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "examResults", editing.id), formData);
      } else {
        await addDoc(collection(db, "examResults"), formData);
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "examResults", deletingId));
      setShowDeleteModal(false);
      fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const fields = [
    {
      key: "title",
      label: "Result Title",
      type: "text",
      required: true,
      placeholder: "Enter result title",
    },
    { key: "department", label: "Department", type: "select", required: true },
    {
      key: "year",
      label: "Year",
      type: "text",
      required: true,
      placeholder: "e.g., 2024",
    },
    {
      key: "semester",
      label: "Semester",
      type: "text",
      required: false,
      placeholder: "e.g., Spring 2024",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "Additional details about the result...",
    },
    {
      key: "pdfUrl",
      label: "PDF URL",
      type: "text",
      required: true,
      placeholder: "https://example.com/result.pdf",
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
          required={field.required}
          style={{ borderRadius: "10px" }}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          className="form-control"
          rows="3"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder || ""}
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
        placeholder={field.placeholder || ""}
        style={{ borderRadius: "10px" }}
      />
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i
            className="bi bi-file-earmark-pdf me-2"
            style={{ color: "#A51C30" }}
          ></i>
          Exam Results
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
          <i className="bi bi-plus-circle"></i> Result
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
            <i className="bi bi-file-earmark-pdf"></i>
          </div>
          <h5 className="text-muted">No results found</h5>
          <p className="text-muted small">
            Click "Add Result" to create your first one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i
                      className="bi bi-file-earmark-pdf fs-3"
                      style={{ color: "#A51C30" }}
                    ></i>
                    <h6
                      className="fw-bold mb-0"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.title}
                    </h6>
                  </div>
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {item.department && (
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
                        {item.department}
                      </span>
                    )}
                    {item.year && (
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
                        {item.year}
                      </span>
                    )}
                    {item.semester && (
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
                        {item.semester}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p
                      className="small text-muted"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{
                        background: "rgba(165, 28, 48, 0.08)",
                        color: "#A51C30",
                        borderRadius: "50px",
                        fontSize: "0.7rem",
                        fontWeight: "500",
                        border: "none",
                        transition: "all 0.2s ease",
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
                      <i className="bi bi-eye me-1"></i> View PDF
                    </a>
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
                  <i
                    className="bi bi-file-earmark-pdf me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  {editing ? "Edit" : "Add"} Result
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div
                    className="alert"
                    style={{
                      borderRadius: "10px",
                      background: "rgba(165, 28, 48, 0.05)",
                      border: "1px solid rgba(165, 28, 48, 0.1)",
                      color: "#A51C30",
                    }}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Upload a PDF file and paste the URL in the PDF URL field.
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Upload PDF</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setFormData({ ...formData, pdfUrl: url });
                        }
                      }}
                      style={{ borderRadius: "10px" }}
                    />
                    {formData.pdfUrl && (
                      <div className="mt-2">
                        <a
                          href={formData.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#A51C30", textDecoration: "none" }}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.textDecoration = "none";
                          }}
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i>
                          PDF uploaded successfully
                        </a>
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
        title="Result"
      />
    </div>
  );
};

export default ResultsManager;
