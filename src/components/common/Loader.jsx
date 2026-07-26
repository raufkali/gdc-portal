const Loader = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "50vh" }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default Loader; // ✅ this is essential
