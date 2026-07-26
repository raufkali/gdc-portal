import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadToR2WithProgress } from "../../utils/cloudflare";

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const collectionMap = {
    banners: "banners",
    programs: "programs",
    departments: "departments",
    activities: "activities",
    gallery: "gallery",
    testimonials: "testimonials",
    faqs: "faqs",
  };

  // Collection icons and colors
  const collectionInfo = {
    banners: { icon: "bi-images", color: "primary", label: "Banners" },
    programs: { icon: "bi-book", color: "success", label: "Programs" },
    departments: { icon: "bi-building", color: "info", label: "Departments" },
    activities: {
      icon: "bi-calendar-event",
      color: "warning",
      label: "Activities",
    },
    gallery: { icon: "bi-image", color: "secondary", label: "Gallery" },
    testimonials: {
      icon: "bi-chat-quote",
      color: "danger",
      label: "Testimonials",
    },
    faqs: { icon: "bi-question-circle", color: "dark", label: "FAQs" },
  };

  const fetchItems = async () => {
    const colName = collectionMap[activeTab];
    if (!colName) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, colName));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(file, `${activeTab}/`);
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
    const colName = collectionMap[activeTab];
    try {
      if (editing) {
        await updateDoc(doc(db, colName, editing.id), formData);
      } else {
        await addDoc(collection(db, colName), formData);
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, collectionMap[activeTab], deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // Get fields based on active tab
  const getFields = () => {
    const commonFields = {
      banners: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text", required: false },
        {
          key: "order",
          label: "Order Number",
          type: "number",
          required: false,
        },
        { key: "active", label: "Active", type: "checkbox", required: false },
      ],
      programs: [
        { key: "title", label: "Program Title", type: "text", required: true },
        { key: "slug", label: "Slug (URL)", type: "text", required: true },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        { key: "duration", label: "Duration", type: "text", required: false },
        {
          key: "eligibility",
          label: "Eligibility",
          type: "textarea",
          required: false,
        },
        { key: "fee", label: "Fee Structure", type: "text", required: false },
      ],
      departments: [
        { key: "name", label: "Department Name", type: "text", required: true },
        { key: "slug", label: "Slug (URL)", type: "text", required: true },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        {
          key: "headName",
          label: "Head of Department",
          type: "text",
          required: false,
        },
        {
          key: "facultyCount",
          label: "Faculty Count",
          type: "number",
          required: false,
        },
      ],
      activities: [
        { key: "title", label: "Activity Title", type: "text", required: true },
        { key: "slug", label: "Slug (URL)", type: "text", required: true },
        { key: "content", label: "Content", type: "textarea", required: true },
        { key: "date", label: "Date", type: "date", required: false },
        { key: "author", label: "Author", type: "text", required: false },
      ],
      gallery: [
        { key: "caption", label: "Caption", type: "text", required: false },
      ],
      testimonials: [
        {
          key: "studentName",
          label: "Student Name",
          type: "text",
          required: true,
        },
        { key: "program", label: "Program", type: "text", required: false },
        {
          key: "content",
          label: "Testimonial",
          type: "textarea",
          required: true,
        },
        {
          key: "rating",
          label: "Rating (1-5)",
          type: "number",
          required: false,
        },
      ],
      faqs: [
        { key: "question", label: "Question", type: "text", required: true },
        { key: "answer", label: "Answer", type: "textarea", required: true },
        {
          key: "order",
          label: "Order Number",
          type: "number",
          required: false,
        },
      ],
    };
    return commonFields[activeTab] || [];
  };

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
    if (field.type === "checkbox") {
      return (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={value === true || value === "true"}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label className="form-check-label">Yes</label>
        </div>
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
    if (field.type === "date") {
      return (
        <input
          type="date"
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

  const fields = getFields();
  const info = collectionInfo[activeTab];

  // Filter items based on search
  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (item.title || item.name || item.question || "")
      .toLowerCase()
      .includes(searchLower);
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className={`bi ${info?.icon} me-2 text-${info?.color}`}></i>
          Manage {info?.label || activeTab}
        </h4>
        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={() => {
            setEditing(null);
            setFormData({});
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-1"></i> Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {Object.keys(collectionMap).map((key) => {
            const tabInfo = collectionInfo[key];
            return (
              <button
                key={key}
                className={`btn ${activeTab === key ? `btn-${tabInfo.color} text-white` : "btn-outline-secondary"}`}
                onClick={() => setActiveTab(key)}
                style={{ borderRadius: "50px" }}
              >
                <i className={`bi ${tabInfo.icon} me-1`}></i>
                {tabInfo.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-transparent border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder={`Search ${info?.label || activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">
            <i className="bi bi-inbox"></i>
          </div>
          <h5 className="text-muted">No items found</h5>
          <p className="text-muted small">
            {searchTerm
              ? "Try adjusting your search"
              : "Click 'Add New' to create your first item"}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredItems.map((item, idx) => (
            <div key={item.id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm border-0 hover-lift">
                {/* Image */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title || item.name || "Item"}
                    className="card-img-top"
                    style={{ height: "160px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="flex-grow-1">
                      <h6 className="card-title fw-bold mb-1">
                        {item.title || item.name || item.question || "Untitled"}
                      </h6>
                      {item.subtitle && (
                        <p className="card-text small text-muted mb-1">
                          {item.subtitle}
                        </p>
                      )}
                      {item.studentName && (
                        <p className="card-text small text-muted mb-1">
                          <i className="bi bi-person me-1"></i>
                          {item.studentName}
                        </p>
                      )}
                    </div>
                    {/* Status Badge */}
                    {item.active !== undefined && (
                      <span
                        className={`badge bg-${item.active ? "success" : "danger"} rounded-pill`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    )}
                    {item.rating && (
                      <span className="badge bg-warning rounded-pill">
                        <i className="bi bi-star-fill me-1"></i>
                        {item.rating}/5
                      </span>
                    )}
                  </div>

                  {/* Additional info */}
                  {item.order !== undefined && (
                    <small className="text-muted d-block mt-1">
                      <i className="bi bi-sort-numeric-down me-1"></i>
                      Order: {item.order}
                    </small>
                  )}
                  {item.date && (
                    <small className="text-muted d-block mt-1">
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(item.date).toLocaleDateString()}
                    </small>
                  )}
                  {item.duration && (
                    <small className="text-muted d-block mt-1">
                      <i className="bi bi-clock me-1"></i>
                      {item.duration}
                    </small>
                  )}
                </div>
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm flex-grow-1"
                      onClick={() => {
                        setEditing(item);
                        setFormData(item);
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmDelete(item.id)}
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

      {/* ===== ADD/EDIT MODAL ===== */}
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
                    className={`bi ${info?.icon} me-2 text-${info?.color}`}
                  ></i>
                  {editing ? "Edit" : "Add"} {info?.label}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Image upload field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Image (optional)
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="file"
                        className="form-control"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url)
                              setFormData({ ...formData, imageUrl: url });
                          }
                        }}
                      />
                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="preview"
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Dynamic fields */}
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
                      className="btn btn-primary px-4 rounded-pill"
                      disabled={uploading}
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

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {showDeleteModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div
              className="modal-content shadow-lg border-0"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-body text-center p-4">
                <div className="text-danger mb-3">
                  <i className="bi bi-exclamation-triangle display-4"></i>
                </div>
                <h5 className="fw-bold">Confirm Delete</h5>
                <p className="text-muted small">
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-danger rounded-pill px-4"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
