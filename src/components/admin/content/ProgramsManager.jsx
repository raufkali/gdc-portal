import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../../../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import DeleteModal from "./Shared/DeleteModal";

const COLLECTION_NAME = "programs";
const BRAND_COLOR = "#A51C30";
const BRAND_HOVER = "#7A1523";

const INITIAL_FORM = {
  title: "",
  subtitle: "",
  category: "",
  description: "",
  duration: "",
  eligibility: "",
  fee: "",
};

const PROGRAM_FIELDS = [
  {
    key: "title",
    label: "Program Title",
    type: "text",
    required: true,
    placeholder: "Enter program title",
  },
  {
    key: "subtitle",
    label: "Subtitle",
    type: "text",
    required: false,
    placeholder: "Enter subtitle",
  },
  {
    key: "category",
    label: "Category",
    type: "text",
    required: false,
    placeholder: "Select or type a category",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Write program description...",
  },
  {
    key: "duration",
    label: "Duration",
    type: "text",
    required: false,
    placeholder: "e.g., 4 Years",
  },
  {
    key: "eligibility",
    label: "Eligibility",
    type: "textarea",
    required: false,
    placeholder: "e.g., FSc with 45% marks",
  },
  {
    key: "fee",
    label: "Fee Structure",
    type: "text",
    required: false,
    placeholder: "e.g., PKR 50,000/year",
  },
];

const ProgramsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  /**
   * Fetch all programs.
   *
   * Kept as a callback so it can safely be reused after
   * create/update/delete operations.
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));

      const programs = snapshot.docs.map((snapshotDoc) => ({
        id: snapshotDoc.id,
        ...snapshotDoc.data(),
      }));

      setItems(programs);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError("Unable to load programs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /**
   * Extract unique categories only when items change.
   */
  const categories = useMemo(() => {
    const uniqueCategories = new Set();

    items.forEach((item) => {
      const category = item.category?.trim();

      if (category) {
        uniqueCategories.add(category);
      }
    });

    return [...uniqueCategories].sort((a, b) => a.localeCompare(b));
  }, [items]);

  /**
   * Open add modal.
   */
  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...INITIAL_FORM });
    setError("");
    setShowModal(true);
  };

  /**
   * Open edit modal.
   */
  const handleEdit = (item) => {
    setEditing(item);
    setError("");

    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      category: item.category || "",
      description: item.description || "",
      duration: item.duration || "",
      eligibility: item.eligibility || "",
      fee: item.fee || "",
    });

    setShowModal(true);
  };

  /**
   * Close form modal.
   */
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditing(null);
    setFormData({ ...INITIAL_FORM });
    setError("");
  };

  /**
   * Handle form input.
   */
  const handleChange = (key, value) => {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /**
   * Normalize form values before saving.
   *
   * This prevents accidental whitespace from being stored
   * in Firestore.
   */
  const getCleanFormData = () => {
    return Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    );
  };

  /**
   * Save / update program.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");

    const cleanData = getCleanFormData();

    if (!cleanData.title) {
      setError("Program title is required.");
      return;
    }

    if (!cleanData.description) {
      setError("Program description is required.");
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await updateDoc(doc(db, COLLECTION_NAME, editing.id), cleanData);
      } else {
        await addDoc(collection(db, COLLECTION_NAME), cleanData);
      }

      closeModal();
      await fetchItems();
    } catch (err) {
      console.error("Error saving program:", err);

      setError(
        editing
          ? "Unable to update the program. Please try again."
          : "Unable to add the program. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Open delete confirmation.
   */
  const handleDeleteRequest = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  /**
   * Delete program.
   */
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, deletingId));

      setShowDeleteModal(false);
      setDeletingId(null);

      await fetchItems();
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Unable to delete the program. Please try again.");
    }
  };

  /**
   * Truncate description for cards.
   */
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";

    const cleanText = text.trim();

    if (cleanText.length <= maxLength) {
      return cleanText;
    }

    return `${cleanText.slice(0, maxLength).trim()}...`;
  };

  /**
   * Render form field.
   */
  const renderField = (field) => {
    const value = formData[field.key] || "";

    if (field.type === "textarea") {
      return (
        <textarea
          className="form-control"
          rows={field.key === "description" ? 4 : 3}
          value={value}
          onChange={(event) => handleChange(field.key, event.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          style={{
            borderRadius: "10px",
            resize: "vertical",
          }}
        />
      );
    }

    if (field.key === "category") {
      return (
        <>
          <input
            type="text"
            className="form-control"
            list="program-category-options"
            value={value}
            onChange={(event) => handleChange(field.key, event.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            autoComplete="off"
            style={{
              borderRadius: "10px",
            }}
          />

          <datalist id="program-category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </>
      );
    }

    return (
      <input
        type={field.type || "text"}
        className="form-control"
        value={value}
        onChange={(event) => handleChange(field.key, event.target.value)}
        required={field.required}
        placeholder={field.placeholder}
        style={{
          borderRadius: "10px",
        }}
      />
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn rounded-pill px-4"
          onClick={handleAdd}
          style={{
            background: BRAND_COLOR,
            color: "#fff",
            fontSize: "0.85rem",
            border: "none",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = BRAND_HOVER;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = BRAND_COLOR;
          }}
        >
          <i className="bi bi-plus-circle me-1" />
          Add Program
        </button>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-circle me-2" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div
          className="text-center py-5"
          role="status"
          aria-label="Loading programs"
        >
          <div
            className="spinner-border"
            style={{
              color: BRAND_COLOR,
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-5">
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-book" />
          </div>

          <h6 className="fw-semibold mb-2">No Programs Found</h6>

          <p className="text-muted mb-3">
            Add your first academic program to get started.
          </p>

          <button
            type="button"
            className="btn rounded-pill px-4"
            onClick={handleAdd}
            style={{
              background: BRAND_COLOR,
              color: "#fff",
              border: "none",
            }}
          >
            <i className="bi bi-plus-circle me-1" />
            Add Program
          </button>
        </div>
      ) : (
        /* Programs */
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "12px",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <div className="card-body pb-2">
                  {/* Title */}
                  <h6
                    className="fw-bold mb-1"
                    style={{
                      color: "var(--color-text)",
                    }}
                  >
                    {item.title || "Untitled Program"}
                  </h6>

                  {/* Subtitle */}
                  {item.subtitle && (
                    <p className="small text-muted mb-2">{item.subtitle}</p>
                  )}

                  {/* Category */}
                  {item.category && (
                    <span
                      className="badge me-1 mb-2"
                      style={{
                        background: "rgba(13, 110, 253, 0.1)",
                        color: "#0d6efd",
                        padding: "0.3rem 0.7rem",
                        borderRadius: "50px",
                        fontWeight: "500",
                        fontSize: "0.65rem",
                      }}
                    >
                      {item.category}
                    </span>
                  )}

                  {/* Description */}
                  <p
                    className="small mb-3"
                    style={{
                      color: "var(--color-text-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    {truncateText(item.description)}
                  </p>

                  {/* Metadata */}
                  <div className="d-flex flex-wrap gap-1">
                    {item.duration && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(165, 28, 48, 0.08)",
                          color: BRAND_COLOR,
                          padding: "0.3rem 0.7rem",
                          borderRadius: "50px",
                          fontWeight: "500",
                          fontSize: "0.65rem",
                        }}
                      >
                        <i className="bi bi-clock me-1" />
                        {item.duration}
                      </span>
                    )}

                    {item.fee && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(255, 193, 7, 0.12)",
                          color: "#b58100",
                          padding: "0.3rem 0.7rem",
                          borderRadius: "50px",
                          fontWeight: "500",
                          fontSize: "0.65rem",
                        }}
                      >
                        <i className="bi bi-cash-stack me-1" />
                        {item.fee}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1"
                      onClick={() => handleEdit(item)}
                      style={{
                        background: "rgba(165, 28, 48, 0.08)",
                        color: BRAND_COLOR,
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: "none",
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = BRAND_COLOR;
                        event.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                          "rgba(165, 28, 48, 0.08)";
                        event.currentTarget.style.color = BRAND_COLOR;
                      }}
                    >
                      <i className="bi bi-pencil me-1" />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm"
                      aria-label={`Delete ${item.title || "program"}`}
                      onClick={() => handleDeleteRequest(item.id)}
                      style={{
                        background: "rgba(220, 53, 69, 0.08)",
                        color: "#dc3545",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: "none",
                        width: "42px",
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = "#dc3545";
                        event.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                          "rgba(220, 53, 69, 0.08)";
                        event.currentTarget.style.color = "#dc3545";
                      }}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          role="dialog"
          aria-modal="true"
          aria-labelledby="program-modal-title"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div
              className="modal-content shadow-lg border-0"
              style={{
                borderRadius: "16px",
              }}
            >
              {/* Modal Header */}
              <div className="modal-header border-0">
                <h5 id="program-modal-title" className="modal-title fw-bold">
                  {editing ? "Edit Program" : "Add Program"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={saving}
                  aria-label="Close"
                />
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {PROGRAM_FIELDS.map((field) => (
                    <div className="mb-3" key={field.key}>
                      <label
                        htmlFor={`program-${field.key}`}
                        className="form-label fw-semibold"
                      >
                        {field.label}

                        {field.required && (
                          <span className="text-danger ms-1">*</span>
                        )}
                      </label>

                      <div id={`program-${field.key}`}>
                        {renderField(field)}
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="d-flex flex-wrap gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn px-4 rounded-pill"
                      disabled={saving}
                      style={{
                        background: BRAND_COLOR,
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-1" />
                          {editing ? "Update" : "Save"}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill"
                      onClick={closeModal}
                      disabled={saving}
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

      {/* Delete Confirmation */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => {
          if (!showDeleteModal) return;

          setShowDeleteModal(false);
          setDeletingId(null);
        }}
        onDelete={handleDelete}
        title="Program"
      />
    </div>
  );
};

export default ProgramsManager;
