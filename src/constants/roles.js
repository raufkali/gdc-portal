/**
 * GDC Portal - Role-Based Access Control (RBAC) Constants
 */

export const ROLES = {
  ADMIN: "admin",
  CONTENT_MANAGER: "content_manager",
  STUDENT_AFFAIRS_MANAGER: "student_affairs_manager",
  PRINCIPAL: "principal",
  HOD: "hod",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.CONTENT_MANAGER]: "Content Manager",
  [ROLES.STUDENT_AFFAIRS_MANAGER]: "Student Affairs Manager",
  [ROLES.PRINCIPAL]: "Principal",
  [ROLES.HOD]: "Head of Department (HOD)",
};

export const ROLE_BADGE_COLORS = {
  [ROLES.ADMIN]: { bg: "rgba(165, 28, 48, 0.12)", color: "#A51C30", border: "#A51C30" },
  [ROLES.CONTENT_MANAGER]: { bg: "rgba(13, 110, 253, 0.12)", color: "#0d6efd", border: "#0d6efd" },
  [ROLES.STUDENT_AFFAIRS_MANAGER]: { bg: "rgba(25, 135, 84, 0.12)", color: "#198754", border: "#198754" },
  [ROLES.PRINCIPAL]: { bg: "rgba(111, 66, 193, 0.12)", color: "#6f42c1", border: "#6f42c1" },
  [ROLES.HOD]: { bg: "rgba(253, 126, 20, 0.12)", color: "#fd7e14", border: "#fd7e14" },
};

export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: "manage_users",
  CREATE_USERS: "create_users",
  EDIT_USERS: "edit_users",
  DEACTIVATE_USERS: "deactivate_users",
  DELETE_USERS: "delete_users",

  // Site Content & Settings
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_BANNERS: "manage_banners",
  MANAGE_PROGRAMS: "manage_programs",
  MANAGE_ALL_DEPARTMENTS: "manage_all_departments",
  MANAGE_OWN_DEPARTMENT: "manage_own_department",
  MANAGE_GALLERY: "manage_gallery",
  MANAGE_TESTIMONIALS: "manage_testimonials",
  MANAGE_FAQS: "manage_faqs",
  MANAGE_ACTIVITIES: "manage_activities",
  MANAGE_DOWNLOADS: "manage_downloads",

  // Announcements
  MANAGE_ALL_ANNOUNCEMENTS: "manage_all_announcements",
  MANAGE_OWN_ANNOUNCEMENTS: "manage_own_announcements",

  // Results
  MANAGE_ALL_RESULTS: "manage_all_results",
  MANAGE_OWN_RESULTS: "manage_own_results",

  // Student Affairs
  MANAGE_COLLEGE_STARS: "manage_college_stars",
  MANAGE_STUDENT_ACHIEVEMENTS: "manage_student_achievements",
  MANAGE_STUDENT_ACTIVITIES: "manage_student_activities",

  // Messages & Audit
  VIEW_MESSAGES: "view_messages",
  VIEW_AUDIT_LOGS: "view_audit_logs",
};

// Map of permissions granted to each role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DEACTIVATE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_BANNERS,
    PERMISSIONS.MANAGE_PROGRAMS,
    PERMISSIONS.MANAGE_ALL_DEPARTMENTS,
    PERMISSIONS.MANAGE_OWN_DEPARTMENT,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MANAGE_TESTIMONIALS,
    PERMISSIONS.MANAGE_FAQS,
    PERMISSIONS.MANAGE_ACTIVITIES,
    PERMISSIONS.MANAGE_DOWNLOADS,
    PERMISSIONS.MANAGE_ALL_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_OWN_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_ALL_RESULTS,
    PERMISSIONS.MANAGE_OWN_RESULTS,
    PERMISSIONS.MANAGE_COLLEGE_STARS,
    PERMISSIONS.MANAGE_STUDENT_ACHIEVEMENTS,
    PERMISSIONS.MANAGE_STUDENT_ACTIVITIES,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],

  [ROLES.CONTENT_MANAGER]: [
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_BANNERS,
    PERMISSIONS.MANAGE_PROGRAMS,
    PERMISSIONS.MANAGE_ALL_DEPARTMENTS,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MANAGE_TESTIMONIALS,
    PERMISSIONS.MANAGE_FAQS,
    PERMISSIONS.MANAGE_ACTIVITIES,
    PERMISSIONS.MANAGE_DOWNLOADS,
    PERMISSIONS.MANAGE_ALL_ANNOUNCEMENTS,
    PERMISSIONS.VIEW_MESSAGES,
  ],

  [ROLES.STUDENT_AFFAIRS_MANAGER]: [
    PERMISSIONS.MANAGE_COLLEGE_STARS,
    PERMISSIONS.MANAGE_STUDENT_ACHIEVEMENTS,
    PERMISSIONS.MANAGE_STUDENT_ACTIVITIES,
  ],

  [ROLES.PRINCIPAL]: [
    PERMISSIONS.MANAGE_ALL_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_OWN_ANNOUNCEMENTS,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_DOWNLOADS,
  ],

  [ROLES.HOD]: [
    PERMISSIONS.MANAGE_OWN_DEPARTMENT,
    PERMISSIONS.MANAGE_OWN_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_OWN_RESULTS,
    PERMISSIONS.VIEW_MESSAGES,
  ],
};

/**
 * Check whether a role has a given permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const USER_STATUS = {
  ACTIVE: "active",
  DEACTIVATED: "deactivated",
};
