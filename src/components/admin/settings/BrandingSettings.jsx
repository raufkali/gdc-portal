import { useRef, useState } from "react";

const BrandingSettings = ({
  form,
  setForm,
  handleImageUpload,
  uploading,
  uploadProgress,
}) => {
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const [logoError, setLogoError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("File is too large. Please upload a file smaller than 5MB.");
        e.target.value = "";
        return;
      }

      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/svg+xml",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (PNG, JPG, SVG, WEBP).");
        e.target.value = "";
        return;
      }

      setLogoError(false);
      await handleImageUpload(file, "logoUrl");
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("File is too large. Please upload a file smaller than 1MB.");
        e.target.value = "";
        return;
      }

      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/svg+xml",
        "image/x-icon",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (PNG, JPG, SVG, ICO).");
        e.target.value = "";
        return;
      }

      setFaviconError(false);
      await handleImageUpload(file, "faviconUrl");
    }
  };

  const removeLogo = () => {
    setForm({ ...form, logoUrl: "" });
    setLogoError(false);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const removeFavicon = () => {
    setForm({ ...form, faviconUrl: "" });
    setFaviconError(false);
    if (faviconInputRef.current) {
      faviconInputRef.current.value = "";
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
        <div>
          <h5 className="fw-bold mb-0">Branding & Identity</h5>
          <p className="text-muted small mb-0">
            Upload your college logo & Fav Icons.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Logo Upload */}
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">Logo</label>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <input
                ref={logoInputRef}
                type="file"
                className="form-control"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
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
              {form.logoUrl && isValidImageUrl(form.logoUrl) && !uploading && (
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="border rounded p-1"
                    style={{ borderRadius: "8px" }}
                  >
                    <img
                      src={form.logoUrl}
                      alt="logo"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                      onError={() => setLogoError(true)}
                      onLoad={() => setLogoError(false)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={removeLogo}
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
              {logoError && form.logoUrl && !uploading && (
                <div className="text-danger small">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Failed to load image
                </div>
              )}
            </div>
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Upload your college logo (PNG, JPG, SVG). Recommended size:
              200x200px.
            </small>
          </div>
        </div>

        {/* Favicon Upload */}
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">Favicon</label>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <input
                ref={faviconInputRef}
                type="file"
                className="form-control"
                accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                onChange={handleFaviconUpload}
                disabled={uploading}
                style={{
                  borderRadius: "10px",
                  borderColor: "#e5e5e5",
                  flex: 1,
                }}
              />
              {form.faviconUrl &&
                isValidImageUrl(form.faviconUrl) &&
                !uploading && (
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="border rounded p-1"
                      style={{ borderRadius: "8px" }}
                    >
                      <img
                        src={form.faviconUrl}
                        alt="favicon"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "contain",
                        }}
                        onError={() => setFaviconError(true)}
                        onLoad={() => setFaviconError(false)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={removeFavicon}
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
              {faviconError && form.faviconUrl && !uploading && (
                <div className="text-danger small">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Failed to load image
                </div>
              )}
            </div>
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Upload your favicon (ICO, PNG, SVG). Recommended size: 32x32px.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
