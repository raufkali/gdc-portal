const R2_WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;
const R2_UPLOAD_TOKEN = import.meta.env.VITE_R2_UPLOAD_TOKEN;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

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

export const getR2FileUrl = (key) => {
  return `${R2_PUBLIC_URL}/${key}`;
};

export const getKeyFromUrl = (url) => {
  return url.replace(`${R2_PUBLIC_URL}/`, "");
};
