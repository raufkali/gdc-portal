import React from "react";

const LoadingModal = ({ isOpen, message = "Processing..." }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(3px)",
        zIndex: 1070,
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "340px" }}>
        <div
          className="modal-content shadow-lg border-0"
          style={{
            borderRadius: "16px",
            backgroundColor: "var(--card-bg, #ffffff)",
          }}
        >
          <div className="modal-body text-center p-4">
            <div
              className="spinner-border mb-3"
              role="status"
              style={{
                width: "3rem",
                height: "3rem",
                color: "#A51C30",
                borderWidth: "0.25em",
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h6
              className="fw-bold mb-1"
              style={{ color: "var(--color-text, #333333)" }}
            >
              {message}
            </h6>
            <p className="text-muted small mb-0">Please wait a moment...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
