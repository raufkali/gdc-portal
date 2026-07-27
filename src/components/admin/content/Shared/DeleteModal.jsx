const DeleteModal = ({ show, onClose, onDelete, title = "Item" }) => {
  if (!show) return null;

  return (
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
              Are you sure you want to delete this {title.toLowerCase()}? This
              action cannot be undone.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button
                className="btn btn-danger rounded-pill px-4"
                onClick={onDelete}
              >
                <i className="bi bi-trash me-1"></i> Delete
              </button>
              <button
                className="btn btn-outline-secondary rounded-pill"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
