import { useState } from "react";

const ImageUpload = ({
  onUpload,
  existingImage,
  label = "Image",
  folder = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await onUpload(file, folder);
      if (url) {
        setPreview(url);
      }
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label} (optional)</label>
      <div className="d-flex align-items-center gap-3">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <div className="text-primary small">
            <span className="spinner-border spinner-border-sm me-1"></span>
            Uploading...
          </div>
        )}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="rounded"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
