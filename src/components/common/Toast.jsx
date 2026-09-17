import React from "react";

const toastStyles = {
  success: {
    icon: "bi-check-circle-fill",
    iconColor: "#28a745",
    borderLeft: "4px solid #28a745",
    bg: "#ffffff",
  },
  error: {
    icon: "bi-exclamation-triangle-fill",
    iconColor: "#A51C30",
    borderLeft: "4px solid #A51C30",
    bg: "#ffffff",
  },
  warning: {
    icon: "bi-exclamation-circle-fill",
    iconColor: "#fd7e14",
    borderLeft: "4px solid #fd7e14",
    bg: "#ffffff",
  },
  info: {
    icon: "bi-info-circle-fill",
    iconColor: "#0d6efd",
    borderLeft: "4px solid #0d6efd",
    bg: "#ffffff",
  },
};

const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        width: "calc(100vw - 48px)",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const config = toastStyles[toast.type] || toastStyles.info;
        return (
          <div
            key={toast.id}
            className="shadow-lg animate__animated animate__fadeInDown"
            style={{
              backgroundColor: config.bg,
              borderLeft: config.borderLeft,
              borderRadius: "10px",
              padding: "12px 16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              pointerEvents: "auto",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderLeftWidth: "4px",
              transition: "all 0.3s ease",
            }}
          >
            <i
              className={`bi ${config.icon} fs-5 flex-shrink-0`}
              style={{ color: config.iconColor, marginTop: "1px" }}
            ></i>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              {toast.title && (
                <div
                  className="fw-bold mb-1"
                  style={{ fontSize: "0.88rem", color: "#1A1A1A" }}
                >
                  {toast.title}
                </div>
              )}
              <div
                className="text-muted"
                style={{ fontSize: "0.82rem", lineHeight: "1.4", wordBreak: "break-word" }}
              >
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn btn-sm text-muted p-0 flex-shrink-0"
              style={{
                border: "none",
                background: "transparent",
                lineHeight: 1,
                fontSize: "1.1rem",
              }}
              aria-label="Close"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
