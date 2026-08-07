const R2_WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;
const R2_UPLOAD_TOKEN = import.meta.env.VITE_R2_UPLOAD_TOKEN;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

// Cache configuration
const CACHE_CONFIG = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  cacheControl: "public, max-age=2592000, immutable",
};

export const uploadToR2WithProgress = (
  file,
  folder = "",
  onProgress = null,
) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
    const key = folder ? `${folder}${uniqueName}` : uniqueName;

    const url = `${R2_WORKER_URL}/${R2_BUCKET_NAME}/${key}`;

    const xhr = new XMLHttpRequest();
    xhr.timeout = 600000;

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        if (onProgress) onProgress(progress);
      }
    });

    xhr.open("PUT", url);
    xhr.setRequestHeader("Authorization", `Bearer ${R2_UPLOAD_TOKEN}`);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    // Add cache control headers on upload
    xhr.setRequestHeader("Cache-Control", CACHE_CONFIG.cacheControl);

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.url || `${R2_PUBLIC_URL}/${key}`,
            key: data.key || key,
            name: uniqueName,
          });
        } catch (e) {
          resolve({
            url: `${R2_PUBLIC_URL}/${key}`,
            key: key,
            name: uniqueName,
          });
        }
      } else {
        let errorMsg = `Upload failed with status ${xhr.status}`;
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.error) errorMsg = data.error;
        } catch (e) {}
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.ontimeout = () =>
      reject(new Error("Upload timed out after 10 minutes"));

    xhr.send(file);
  });
};

export const deleteFromR2 = async (key) => {
  const url = `${R2_WORKER_URL}/${R2_BUCKET_NAME}/${key}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${R2_UPLOAD_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status}`);
  }

  return true;
};

export const getR2FileUrl = (key, options = {}) => {
  const { width, height, quality, format } = options;
  let url = `${R2_PUBLIC_URL}/${key}`;

  // Add query params for image optimization
  const params = new URLSearchParams();
  if (width) params.append("w", width);
  if (height) params.append("h", height);
  if (quality) params.append("q", quality);
  if (format) params.append("f", format);

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
};

export const getKeyFromUrl = (url) => {
  return url.replace(`${R2_PUBLIC_URL}/`, "");
};

// Prefetch images (load in background)
export const prefetchImages = (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;

  imageUrls.forEach((url) => {
    try {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    } catch (error) {
      console.warn("Failed to prefetch image:", url, error);
    }
  });
};

// Preload critical images
export const preloadImages = (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;

  imageUrls.forEach((url) => {
    try {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    } catch (error) {
      console.warn("Failed to preload image:", url, error);
    }
  });
};

// Get image with cache-busting (force refresh)
export const getImageWithCacheBust = (url) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

// Get optimized image URL for different sizes
export const getResponsiveImageUrl = (key, sizes = {}) => {
  const { small, medium, large } = sizes;

  return {
    small: getR2FileUrl(key, { width: small || 300, quality: 80 }),
    medium: getR2FileUrl(key, { width: medium || 600, quality: 85 }),
    large: getR2FileUrl(key, { width: large || 900, quality: 90 }),
    original: getR2FileUrl(key),
  };
};

export default {
  uploadToR2WithProgress,
  deleteFromR2,
  getR2FileUrl,
  getKeyFromUrl,
  prefetchImages,
  preloadImages,
  getImageWithCacheBust,
  getResponsiveImageUrl,
  CACHE_CONFIG,
};
