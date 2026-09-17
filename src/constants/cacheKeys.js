/**
 * GDC Portal - Centralized Cache and Event Constants
 */

export const CACHE_KEYS = {
  SETTINGS: "settings_doc_website",
  DEPARTMENTS: "departments",
  ANNOUNCEMENTS: "announcements",
  EXAM_RESULTS: "examResults",
  BANNERS: "banners",
  PROGRAMS: "programs",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  ACTIVITIES: "activities",
  COLLEGE_STARS: "collegeStars",
  STUDENT_ACHIEVEMENTS: "studentAchievements",
  STUDENT_ACTIVITIES: "studentActivities",
  DOWNLOADS: "downloads",
  MESSAGES: "contacts",
  FAQS: "faqs",
  USERS: "users",
  ACTIVITY_LOGS: "activityLogs",
};

export const CACHE_EVENTS = {
  CHANNEL_NAME: "gdc_portal_cache_sync",
  INVALIDATE: "GDC_CACHE_INVALIDATE",
  LOCAL_STORAGE_KEY: "gdc_cache_invalidation_timestamp",
};
