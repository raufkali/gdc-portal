import { useRef, useState } from "react";

const PrincipalSettings = ({
  form,
  setForm,
  handleImageUpload,
  uploading,
  uploadProgress,
}) => {
  const imageInputRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  const handleImageUploadWrapper = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please upload a file smaller than 5MB.");
        e.target.value = "";
        return;
      }

      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (PNG, JPG, WEBP).");
        e.target.value = "";
        return;
      }

      setImageError(false);
      await handleImageUpload(file, "principalImageUrl");
    }
  };

  const removeImage = () => {
    setForm({ ...form, principalImageUrl: "" });
    setImageError(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (typeof url !== "string") return false;
    if (url.trim() === "") return false;
    return url.startsWith("data:image") || url.startsWith("http");
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(23, 162, 184, 0.08)",
            color: "#17a2b8",
          }}
        >
          <i className="bi bi-person-badge fs-4"></i>
        </div>
        <div>
          <h5 className="fw-bold mb-0">Principal Information</h5>
          <p className="text-muted small mb-0">
            Information displayed in the "Message from the Principal" section
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">
              Principal Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.principalName || ""}
              onChange={(e) =>
                setForm({ ...form, principalName: e.target.value })
              }
              placeholder="Dr. Muhammad Ali"
              style={{
                borderRadius: "10px",
                borderColor: "#e5e5e5",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#A51C30";
                e.target.style.boxShadow = "0 0 0 3px rgba(165, 28, 48, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e5e5";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">Designation</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.principalDesignation || ""}
              onChange={(e) =>
                setForm({ ...form, principalDesignation: e.target.value })
              }
              placeholder="Principal, GDC Gulabad"
              style={{
                borderRadius: "10px",
                borderColor: "#e5e5e5",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#A51C30";
                e.target.style.boxShadow = "0 0 0 3px rgba(165, 28, 48, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e5e5";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label fw-semibold">Principal Image</label>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <input
                ref={imageInputRef}
                type="file"
                className="form-control"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUploadWrapper}
                disabled={uploading}
                style={{
                  borderRadius: "10px",
                  borderColor: "#e5e5e5",
                  flex: 1,
                }}
              />
              {uploading && (
                <div className="text-primary small">
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  Uploading {uploadProgress}%
                </div>
              )}
              {form.principalImageUrl &&
                isValidImageUrl(form.principalImageUrl) &&
                !uploading && (
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={form.principalImageUrl}
                      alt="principal"
                      className="border"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={removeImage}
                      style={{
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        padding: 0,
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                )}
              {imageError && form.principalImageUrl && !uploading && (
                <div className="text-danger small">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Failed to load image
                </div>
              )}
            </div>
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Upload the principal's photo (square image recommended).
            </small>
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label fw-semibold">Principal Message</label>
            <textarea
              className="form-control"
              rows="5"
              value={form.principalMessage || ""}
              onChange={(e) =>
                setForm({ ...form, principalMessage: e.target.value })
              }
              placeholder="Write a welcome message from the principal..."
              style={{
                borderRadius: "10px",
                borderColor: "#e5e5e5",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#A51C30";
                e.target.style.boxShadow = "0 0 0 3px rgba(165, 28, 48, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e5e5";
                e.target.style.boxShadow = "none";
              }}
            />
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              This message appears on the homepage.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalSettings;
