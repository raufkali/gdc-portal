import { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { uploadToR2WithProgress } from "../../../utils/cloudflare";
import DeleteModal from "./Shared/DeleteModal";

const BannersManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);

  // ==========================================================
  // FETCH BANNERS
  // Sorts by "order" and also silently closes any gaps/duplicates
  // left behind by deletions, so order always ends up 0,1,2,3...
  // ==========================================================

  const fetchItems = async () => {
    setLoading(true);

    try {
      const snap = await getDocs(collection(db, "banners"));

      let list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Sort by existing order (missing order treated as 0)
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Re-sequence to 0,1,2,3... and push any changes to Firestore
      // in a single batch, so gaps from deleted banners disappear.
      const batch = writeBatch(db);
      let needsUpdate = false;

      list = list.map((item, index) => {
        const newOrder = index + 1;
        if (item.order !== newOrder) {
          needsUpdate = true;
          batch.update(doc(db, "banners", item.id), { order: newOrder });
          return { ...item, order: newOrder };
        }
        return item;
      });

      if (needsUpdate) {
        await batch.commit();
      }

      setItems(list);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ==========================================================
  // COMPRESS IMAGE BEFORE UPLOAD
  // Skips animated GIFs (compression would flatten them to a
  // single frame). Falls back to the original file if
  // compression fails for any reason, so upload never breaks.
  // ==========================================================

  const compressImage = async (file) => {
    if (file.type === "image/gif") {
      // Preserve animation - don't recompress GIFs
      return file;
    }

    const options = {
      maxWidthOrHeight: 1920,
      maxSizeMB: 0.5,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.82,
    };

    const compressedFile = await imageCompression(file, options);

    return new File([compressedFile], file.name.replace(/\.[^.]+$/, ".webp"), {
      type: "image/webp",
    });
  };

  // Upload banner image to R2
  const handleFileUpload = async (file) => {
    if (!file) return null;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToR2WithProgress(
        file,
        "banners/",
        (progress) => {
          setUploadProgress(progress);
        },
      );

      if (result && result.url) {
        setPreviewImage(result.url);
        setUploadProgress(100);

        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);

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

  // Handle image selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Maximum 25MB for the original file - compression happens
    // client-side afterwards, so raw phone/camera photos are fine.
    if (file.size > 25 * 1024 * 1024) {
      alert("File is too large. Please upload a file smaller than 25MB.");
      e.target.value = "";
      return;
    }

    // Allowed image types
    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, GIF).");
      e.target.value = "";
      return;
    }

    setCompressionInfo(null);
    setCompressing(true);

    let fileToUpload = file;

    try {
      const originalSizeKB = (file.size / 1024).toFixed(0);

      fileToUpload = await compressImage(file);

      const finalSizeKB = (fileToUpload.size / 1024).toFixed(0);

      if (fileToUpload !== file) {
        setCompressionInfo({
          before: originalSizeKB,
          after: finalSizeKB,
        });
      }
    } catch (error) {
      console.error("Compression failed, uploading original file:", error);
      // Fall back to the original file so the upload still works
      fileToUpload = file;
    } finally {
      setCompressing(false);
    }

    const url = await handleFileUpload(fileToUpload);

    if (url) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: url,
      }));
    }

    // Allow selecting the same file again
    e.target.value = "";
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));

    setPreviewImage(null);
    setUploadProgress(0);
    setCompressionInfo(null);
  };

  // Submit banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (submitting || uploading || compressing) return;

    setSubmitting(true);

    try {
      if (editing) {
        await updateDoc(doc(db, "banners", editing.id), formData);

        alert("Banner updated successfully!");
      } else {
        await addDoc(collection(db, "banners"), formData);

        alert("Banner added successfully!");
      }

      setShowModal(false);
      setFormData({});
      setPreviewImage(null);
      setUploadProgress(0);
      setCompressionInfo(null);
      setEditing(null);

      await fetchItems();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error saving: " + error.message);
    } finally {
      // Re-enable only after everything is finished
      setSubmitting(false);
    }
  };

  // Delete banner
  // fetchItems() re-sequences "order" for everyone left behind,
  // so deleting banner 3 out of 5 no longer leaves a gap.
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "banners", deletingId));

      alert("Banner deleted successfully!");

      setShowDeleteModal(false);
      setDeletingId(null);

      await fetchItems();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Error deleting: " + error.message);
    }
  };

  // Banner fields
  const fields = [
    {
      key: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "text",
      required: false,
    },
    {
      key: "order",
      label: "Order Number",
      type: "number",
      required: false,
    },
    {
      key: "active",
      label: "Active",
      type: "checkbox",
      required: false,
    },
  ];

  // Render form field
  const renderField = (field) => {
    const value = formData[field.key] || "";

    const onChange = (val) => {
      setFormData((prev) => ({
        ...prev,
        [field.key]: val,
      }));
    };

    // Checkbox
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

    // Number
    if (field.type === "number") {
      return (
        <input
          type="number"
          className="form-control"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          required={field.required}
          style={{
            borderRadius: "10px",
          }}
        />
      );
    }

    // Text
    return (
      <input
        type={field.type || "text"}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
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
          className="btn rounded-pill px-4"
          onClick={() => {
            setEditing(null);
            // Default new banners to the end of the current order
            setFormData({ order: items.length, active: true });
            setPreviewImage(null);
            setUploadProgress(0);
            setCompressionInfo(null);
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
          <i className="bi bi-plus-circle me-1"></i>
          Add Banner
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "#A51C30",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* Empty state */
        <div className="text-center py-5">
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-images"></i>
          </div>

          <p className="text-muted">
            No banners found. Click "Add Banner" to create one.
          </p>
        </div>
      ) : (
        /* Banner cards */
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
                {/* Image */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.title}
                    style={{
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {/* Card body */}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6
                      className="fw-bold mb-0"
                      style={{
                        color: "var(--color-text)",
                      }}
                    >
                      {item.title}
                    </h6>

                    <span
                      className="badge bg-light text-muted"
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: "500",
                      }}
                    >
                      #{(item.order ?? 0) + 1}
                    </span>
                  </div>

                  {item.subtitle && (
                    <p className="small text-muted mb-2">{item.subtitle}</p>
                  )}

                  <span
                    className="badge"
                    style={{
                      background: item.active
                        ? "rgba(40, 167, 69, 0.1)"
                        : "rgba(220, 53, 69, 0.1)",
                      color: item.active ? "#28a745" : "#dc3545",
                      padding: "0.25rem 0.7rem",
                      borderRadius: "50px",
                      fontWeight: "500",
                      fontSize: "0.65rem",
                    }}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Card footer */}
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex gap-2">
                    {/* Edit */}
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
                        setFormData({
                          ...item,
                        });
                        setPreviewImage(item.imageUrl || null);
                        setUploadProgress(0);
                        setCompressionInfo(null);
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
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>

                    {/* Delete */}
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
              style={{
                borderRadius: "16px",
              }}
            >
              {/* Modal header */}
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {editing ? "Edit" : "Add"} Banner
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* Modal body */}
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Banner Image Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Banner Image
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleFileSelect}
                      disabled={uploading || compressing}
                      style={{
                        borderRadius: "10px",
                      }}
                    />

                    {/* Compressing status */}
                    {compressing && (
                      <div className="mt-1 text-primary small">
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Optimizing image...
                      </div>
                    )}

                    {/* Upload progress */}
                    {uploading && (
                      <div className="mt-1">
                        <div
                          className="progress"
                          style={{
                            height: "4px",
                          }}
                        >
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

                    {/* Compression feedback */}
                    {compressionInfo && (
                      <small className="text-muted d-block mt-1">
                        Optimized: {compressionInfo.before} KB →{" "}
                        {compressionInfo.after} KB
                      </small>
                    )}

                    {/* Image preview */}
                    {(previewImage || formData.imageUrl) && (
                      <div className="mt-2">
                        <img
                          src={previewImage || formData.imageUrl}
                          alt="Banner preview"
                          style={{
                            width: "100%",
                            maxHeight: "180px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm mt-2 rounded-pill"
                          onClick={removeImage}
                          style={{
                            fontSize: "0.7rem",
                          }}
                        >
                          <i className="bi bi-x"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Other fields */}
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

                  {/* Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn px-4 rounded-pill"
                      disabled={uploading || compressing || submitting}
                      style={{
                        background: "#A51C30",
                        color: "#fff",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!uploading && !compressing) {
                          e.target.style.background = "#7A1523";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#A51C30";
                      }}
                    >
                      {compressing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Optimizing...
                        </>
                      ) : uploading ? (
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
                      onClick={() => {
                        setShowModal(false);
                        setPreviewImage(null);
                        setUploadProgress(0);
                        setCompressionInfo(null);
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

      {/* Delete modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Banner"
      />
    </div>
  );
};

export default BannersManager;
