import { useEffect, useState, useCallback } from "react";

/**
 * Hook to manage unsaved form changes warning
 */
export const useUnsavedChanges = (isDirty = false) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Prevent accidental browser tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const attemptAction = useCallback(
    (action) => {
      if (isDirty) {
        setPendingAction(() => action);
        setShowPrompt(true);
      } else {
        action();
      }
    },
    [isDirty]
  );

  const confirmDiscard = useCallback(() => {
    setShowPrompt(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const cancelDiscard = useCallback(() => {
    setShowPrompt(false);
    setPendingAction(null);
  }, []);

  return {
    showPrompt,
    attemptAction,
    confirmDiscard,
    cancelDiscard,
  };
};

export default useUnsavedChanges;
