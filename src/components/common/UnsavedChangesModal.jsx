import React from "react";

const UnsavedChangesModal = ({
  isOpen,
  onContinueEditing,
  onDiscard,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1060,
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
        <div
          className="modal-content shadow-lg border-0"
          style={{
            borderRadius: "16px",
            backgroundColor: "var(--card-bg, #ffffff)",
            overflow: "hidden",
          }}
        >
          <div className="modal-body text-center p-4 p-md-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "68px",
                height: "68px",
                backgroundColor: "rgba(253, 126, 20, 0.12)",
                color: "#fd7e14",
              }}
            >
              <i className="bi bi-pencil-square fs-1"></i>
            </div>

            <h5
              className="fw-bold mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "var(--color-text, #333333)",
              }}
            >
              You Have Unsaved Changes
            </h5>
            <p
              className="text-muted small mb-4"
              style={{ lineHeight: "1.6", maxWidth: "320px", margin: "0 auto" }}
            >
              Leaving this page or closing the form will discard your unsaved edits. Are you sure you want to discard them?
            </p>

            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn px-3"
                onClick={onContinueEditing}
                style={{
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  borderColor: "var(--color-border, #E5E5E5)",
                  color: "var(--color-text, #333333)",
                  background: "transparent",
                }}
              >
                Continue Editing
              </button>
              <button
                type="button"
                className="btn px-4 text-white"
                onClick={onDiscard}
                style={{
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  backgroundColor: "#A51C30",
                  borderColor: "#A51C30",
                  boxShadow: "0 4px 12px rgba(165, 28, 48, 0.3)",
                }}
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
