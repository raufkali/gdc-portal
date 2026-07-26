const AboutSettings = ({ form, setForm }) => {
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(255, 193, 7, 0.08)",
            color: "#ffc107",
          }}
        >
          <i className="bi bi-info-circle fs-4"></i>
        </div>
        <div>
          <h5 className="fw-bold mb-0">About Section</h5>
          <p className="text-muted small mb-0">
            Vision, Mission, Aims, and "What We Offer" content
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label fw-semibold">Vision</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.vision || ""}
              onChange={(e) => setForm({ ...form, vision: e.target.value })}
              placeholder="Our vision for the college..."
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
            <label className="form-label fw-semibold">Mission</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.mission || ""}
              onChange={(e) => setForm({ ...form, mission: e.target.value })}
              placeholder="Our mission statement..."
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
            <label className="form-label fw-semibold">Aims & Objectives</label>
            <textarea
              className="form-control"
              rows="4"
              value={form.aims || ""}
              onChange={(e) => setForm({ ...form, aims: e.target.value })}
              placeholder="Our aims and objectives..."
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
            <label className="form-label fw-semibold">What We Offer</label>
            <textarea
              className="form-control"
              rows="4"
              value={form.whatWeOffer || ""}
              onChange={(e) =>
                setForm({ ...form, whatWeOffer: e.target.value })
              }
              placeholder="What we offer to students..."
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

export default AboutSettings;
