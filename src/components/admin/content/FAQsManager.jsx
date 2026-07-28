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
import DeleteModal from "./Shared/DeleteModal";

const FAQsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "faqs"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDoc(doc(db, "faqs", editing.id), formData);
      } else {
        await addDoc(collection(db, "faqs"), formData);
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "faqs", deletingId));
      setShowDeleteModal(false);
      fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const fields = [
    { key: "question", label: "Question", type: "text", required: true },
    { key: "answer", label: "Answer", type: "textarea", required: true },
    { key: "order", label: "Order Number", type: "number", required: false },
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
      />
    );
  };

  return (
    <div>
      {/* Header - Only Add FAQ button, no title */}
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
          <i className="bi bi-plus-circle me-1"></i> Add FAQ
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
            <i className="bi bi-question-circle"></i>
          </div>
          <p className="text-muted">
            No FAQs found. Click "Add FAQ" to create one.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-md-6">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <div className="card-body">
                  <h6
                    className="fw-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    <i
                      className="bi bi-question-circle me-2"
                      style={{ color: "#A51C30" }}
                    ></i>
                    {item.question}
                  </h6>
                  <p
                    className="small"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.answer}
                  </p>
                  {item.order !== undefined && (
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Order: {item.order}
                    </small>
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
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content shadow-lg border-0"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {editing ? "Edit" : "Add"} FAQ
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
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
                      <i className="bi bi-check2 me-1"></i>
                      {editing ? "Update" : "Save"}
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
        title="FAQ"
      />
    </div>
  );
};

export default FAQsManager;
