const ContactSettings = ({ form, setForm }) => {
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(220, 53, 69, 0.08)",
            color: "#dc3545",
          }}
        >
          <i className="bi bi-envelope fs-4"></i>
        </div>
        <div>
          <h5 className="fw-bold mb-0">Contact Information</h5>
          <p className="text-muted small mb-0">
            Contact details displayed in the footer and contact page
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.contactPhone || ""}
              onChange={(e) =>
                setForm({ ...form, contactPhone: e.target.value })
              }
              placeholder="+92 123 4567890"
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
            <label className="form-label fw-semibold">WhatsApp Number</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.whatsapp || ""}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+92 123 4567890"
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
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={form.contactEmail || ""}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
              placeholder="info@gdcgulabad.edu.pk"
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
            <label className="form-label fw-semibold">Emergency Contact</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.emergencyContact || ""}
              onChange={(e) =>
                setForm({ ...form, emergencyContact: e.target.value })
              }
              placeholder="+92 123 4567890"
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
            <label className="form-label fw-semibold">Address</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.contactAddress || ""}
              onChange={(e) =>
                setForm({ ...form, contactAddress: e.target.value })
              }
              placeholder="Gulabad, District Chitral, KPK, Pakistan"
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
            <label className="form-label fw-semibold">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={form.mapEmbedUrl || ""}
              onChange={(e) =>
                setForm({ ...form, mapEmbedUrl: e.target.value })
              }
              placeholder="https://www.google.com/maps/embed?pb=..."
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
              Paste the Google Maps embed URL for the contact page.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSettings;
