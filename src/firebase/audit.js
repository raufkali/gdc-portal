import { db, auth } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Record an action to the activityLogs Firestore collection
 */
export const logActivity = async ({
  action,
  resourceType,
  resourceId = null,
  details = "",
  user = null,
}) => {
  try {
    const currentUser = user || auth.currentUser;
    const logData = {
      action,
      resourceType,
      resourceId,
      details,
      actorUid: currentUser?.uid || "system",
      actorEmail: currentUser?.email || "anonymous",
      actorName: currentUser?.displayName || currentUser?.email?.split("@")[0] || "User",
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "activityLogs"), logData);
  } catch (err) {
    // Non-blocking: audit log failure should never crash core operations
    console.warn("Activity logging failed:", err);
  }
};

export const AUDIT_ACTIONS = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_ROLE_CHANGED: "USER_ROLE_CHANGED",
  USER_DEACTIVATED: "USER_DEACTIVATED",
  USER_ACTIVATED: "USER_ACTIVATED",
  USER_DELETED: "USER_DELETED",
  PASSWORD_RESET_SENT: "PASSWORD_RESET_SENT",

  SETTINGS_UPDATED: "SETTINGS_UPDATED",

  ANNOUNCEMENT_CREATED: "ANNOUNCEMENT_CREATED",
  ANNOUNCEMENT_UPDATED: "ANNOUNCEMENT_UPDATED",
  ANNOUNCEMENT_DELETED: "ANNOUNCEMENT_DELETED",

  DEPARTMENT_CREATED: "DEPARTMENT_CREATED",
  DEPARTMENT_UPDATED: "DEPARTMENT_UPDATED",
  DEPARTMENT_DELETED: "DEPARTMENT_DELETED",

  RESULT_UPLOADED: "RESULT_UPLOADED",
  RESULT_DELETED: "RESULT_DELETED",

  DOWNLOAD_UPLOADED: "DOWNLOAD_UPLOADED",
  DOWNLOAD_DELETED: "DOWNLOAD_DELETED",

  COLLEGE_STAR_SAVED: "COLLEGE_STAR_SAVED",
  STUDENT_ACHIEVEMENT_SAVED: "STUDENT_ACHIEVEMENT_SAVED",
  STUDENT_ACTIVITY_SAVED: "STUDENT_ACTIVITY_SAVED",
};

export default {
  logActivity,
  AUDIT_ACTIONS,
};
