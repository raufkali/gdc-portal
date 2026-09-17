import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import LoadingModal from "../components/common/LoadingModal";

const NotificationContext = createContext();

/**
 * Converts Firebase error objects or codes into user-friendly messages
 */
export const formatFirebaseError = (error) => {
  if (!error) return "An unexpected error occurred. Please try again.";
  if (typeof error === "string") return error;

  const code = error.code || "";
  const message = error.message || "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/weak-password":
      return "The password is too weak. Please use at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact the administrator.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again in a few minutes.";
    case "permission-denied":
      return "Permission denied. You do not have authorization for this action.";
    case "unavailable":
      return "The service is temporarily unavailable. Please check your network connection.";
    case "storage/unauthorized":
      return "You do not have permission to upload or delete this file.";
    case "storage/quota-exceeded":
      return "Storage quota exceeded. Please contact system support.";
    case "storage/invalid-format":
      return "The selected file format is not supported.";
    default:
      if (message.includes("permission-denied") || message.includes("PERMISSION_DENIED")) {
        return "You do not have permission to perform this action.";
      }
      return message.replace(/^Firebase:\s*/i, "").replace(/\(auth\/[^)]+\)\.?/i, "").trim() || "Operation failed.";
  }
};

export const NotificationProvider = ({ children }) => {
  // Toast state
  const [toasts, setToasts] = useState([]);

  // Confirm modal state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger", // 'danger' | 'primary' | 'warning'
    onConfirm: null,
    onCancel: null,
    isConfirming: false,
  });

  // Loading modal state
  const [loadingState, setLoadingState] = useState({
    isOpen: false,
    message: "Processing...",
  });

  // Remove toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add toast
  const addToast = useCallback(
    ({ type = "info", title = "", message = "", duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 7);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message, title = "Success") => {
      addToast({ type: "success", title, message });
    },
    [addToast]
  );

  const showError = useCallback(
    (error, title = "Error") => {
      const friendlyMessage = formatFirebaseError(error);
      addToast({ type: "error", title, message: friendlyMessage, duration: 6000 });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, title = "Warning") => {
      addToast({ type: "warning", title, message, duration: 5000 });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, title = "Information") => {
      addToast({ type: "info", title, message });
    },
    [addToast]
  );

  // Show confirmation modal
  const showConfirm = useCallback(
    ({
      title = "Are you sure?",
      message = "This action cannot be undone.",
      confirmText = "Proceed",
      cancelText = "Cancel",
      variant = "danger",
      onConfirm = () => {},
    }) => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          isConfirming: false,
          onConfirm: async () => {
            setConfirmState((prev) => ({ ...prev, isConfirming: true }));
            try {
              await onConfirm();
              setConfirmState((prev) => ({ ...prev, isOpen: false, isConfirming: false }));
              resolve(true);
            } catch (err) {
              setConfirmState((prev) => ({ ...prev, isConfirming: false }));
              showError(err);
              resolve(false);
            }
          },
          onCancel: () => {
            setConfirmState((prev) => ({ ...prev, isOpen: false, isConfirming: false }));
            resolve(false);
          },
        });
      });
    },
    [showError]
  );

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false, isConfirming: false }));
  }, []);

  const showLoading = useCallback((message = "Processing...") => {
    setLoadingState({ isOpen: true, message });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({ isOpen: false, message: "" });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
        closeConfirm,
        showLoading,
        hideLoading,
        formatFirebaseError,
      }}
    >
      {children}
      <Toast toasts={toasts} onDismiss={removeToast} />
      <ConfirmModal {...confirmState} onClose={closeConfirm} />
      <LoadingModal {...loadingState} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
