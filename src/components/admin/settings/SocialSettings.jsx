const SocialSettings = ({ form, setForm }) => {
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(108, 117, 125, 0.08)",
            color: "#6c757d",
          }}
        >
          <i className="bi bi-share fs-4"></i>
        </div>
        <div>
          <h5 className="fw-bold mb-0">Social Media Links</h5>
          <p className="text-muted small mb-0">
            Links appear in the footer and contact page
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">
              <i className="bi bi-facebook me-1 text-primary"></i> Facebook URL
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.facebook || ""}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="https://facebook.com/gdcgulabad"
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
            <label className="form-label fw-semibold">
              <i className="bi bi-twitter me-1 text-info"></i> Twitter / X URL
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.twitter || ""}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
              placeholder="https://twitter.com/gdcgulabad"
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
            <label className="form-label fw-semibold">
              <i className="bi bi-instagram me-1 text-danger"></i> Instagram URL
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.instagram || ""}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/gdcgulabad"
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
            <label className="form-label fw-semibold">
              <i className="bi bi-youtube me-1 text-danger"></i> YouTube URL
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.youtube || ""}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
              placeholder="https://youtube.com/gdcgulabad"
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
            <label className="form-label fw-semibold">
              <i className="bi bi-linkedin me-1 text-primary"></i> LinkedIn URL
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.linkedin || ""}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              placeholder="https://linkedin.com/company/gdcgulabad"
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
            <label className="form-label fw-semibold">
              <i className="bi bi-tiktok me-1"></i> TikTok URL
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              value={form.tiktok || ""}
              onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
              placeholder="https://tiktok.com/@gdcgulabad"
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
      </div>
    </div>
  );
};

export default SocialSettings;
