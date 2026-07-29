// ✅ Format date helper
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
};

// ✅ Slugify helper
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ✅ Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// ✅ Get image dimensions for responsive
export const getImageDimensions = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
};

// ✅ Check if image URL is valid
export const isValidImageUrl = (url) => {
  if (!url) return false;
  if (typeof url !== "string") return false;
  if (url.trim() === "") return false;
  return url.startsWith("http") || url.startsWith("data:image");
};

// ✅ Get file extension from URL
export const getFileExtension = (url) => {
  if (!url) return "";
  const parts = url.split(".");
  return parts[parts.length - 1].toLowerCase();
};

// ✅ Check if URL is a video
export const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi"];
  const ext = getFileExtension(url);
  return videoExtensions.includes(ext);
};

// ✅ Check if URL is an image
export const isImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "ico",
  ];
  const ext = getFileExtension(url);
  return imageExtensions.includes(ext);
};

export default {
  formatDate,
  slugify,
  truncateText,
  getImageDimensions,
  isValidImageUrl,
  getFileExtension,
  isVideoUrl,
  isImageUrl,
};
