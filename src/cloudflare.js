// src/cloudflare.js
const R2_ENDPOINT = import.meta.env.VITE_R2_ENDPOINT;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

/**
 * Upload a file to Cloudflare R2 with progress tracking
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (e.g., 'media/', 'results/')
 * @param {Function} onProgress - Progress callback (receives percentage)
 * @returns {Promise<{url: string, key: string, name: string}>}
 */
export const uploadToR2WithProgress = (
  file,
  folder = "",
  onProgress = null,
) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
    const key = folder ? `${folder}${uniqueName}` : uniqueName;

    const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.open("PUT", url);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    xhr.onload = () => {
      if (xhr.status === 200) {
        const publicUrl = `${R2_PUBLIC_URL}/${key}`;
        resolve({
          url: publicUrl,
          key: key,
          name: uniqueName,
        });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.send(file);
  });
};

/**
 * Simple upload without progress tracking
 */
export const uploadToR2 = async (file, folder = "") => {
  const timestamp = Date.now();
  const uniqueName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
  const key = folder ? `${folder}${uniqueName}` : uniqueName;

  const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return {
    url: `${R2_PUBLIC_URL}/${key}`,
    key: key,
    name: uniqueName,
  };
};

/**
 * Delete a file from Cloudflare R2
 */
export const deleteFromR2 = async (key) => {
  const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status}`);
  }

  return true;
};

/**
 * Get a public URL for a file
 */
export const getR2FileUrl = (key) => {
  return `${R2_PUBLIC_URL}/${key}`;
};

/**
 * Extract key from public URL
 */
export const getKeyFromUrl = (url) => {
  return url.replace(`${R2_PUBLIC_URL}/`, "");
};
