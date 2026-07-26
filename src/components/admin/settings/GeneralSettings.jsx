const GeneralSettings = ({ form, setForm }) => {
  return (
    <div>
      {/* Section Header */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(165, 28, 48, 0.08)",
            color: "#A51C30",
          }}
        >
          <i className="bi bi-house fs-4"></i>
        </div>
        <div>
          <h5 className="fw-bold mb-0">General Settings</h5>
          <p className="text-muted small mb-0">
            Configure your website's basic information and identity
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">
              Brand Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.brandName || ""}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              placeholder="GDC Gulabad"
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
              This appears in the navbar and footer.
            </small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">Tagline</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.tagline || ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Excellence in Education"
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
              Short tagline for your college.
            </small>
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label fw-semibold">Website URL</label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.websiteUrl || ""}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="https://gdcgulabad.edu.pk"
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
              Your college's official website URL.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
