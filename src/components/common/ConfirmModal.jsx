import React from "react";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onClose,
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === "danger";
  const primaryColor = isDanger ? "#A51C30" : "#0d6efd";

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
            {/* Icon */}
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "68px",
                height: "68px",
                backgroundColor: isDanger ? "rgba(165, 28, 48, 0.1)" : "rgba(13, 110, 253, 0.1)",
                color: primaryColor,
              }}
            >
              <i
                className={`bi ${
                  isDanger ? "bi-exclamation-triangle" : "bi-question-circle"
                } fs-1`}
              ></i>
            </div>

            <h5
              className="fw-bold mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "var(--color-text, #333333)",
              }}
            >
              {title}
            </h5>
            <p
              className="text-muted small mb-4"
              style={{ lineHeight: "1.6", maxWidth: "340px", margin: "0 auto" }}
            >
              {message}
            </p>

            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn px-4"
                onClick={onClose}
                disabled={isConfirming}
                style={{
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  borderColor: "var(--color-border, #E5E5E5)",
                  color: "var(--color-text, #333333)",
                  background: "transparent",
                }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className="btn px-4 text-white d-inline-flex align-items-center justify-content-center"
                onClick={onConfirm}
                disabled={isConfirming}
                style={{
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  boxShadow: `0 4px 12px ${isDanger ? "rgba(165, 28, 48, 0.3)" : "rgba(13, 110, 253, 0.3)"}`,
                }}
              >
                {isConfirming ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
