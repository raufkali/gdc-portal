import { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageUpload = ({
  onUpload,
  existingImage,
  label = "Image",
  folder = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage || null);
  const [compressionInfo, setCompressionInfo] = useState(null);

  const compressImage = async (file) => {
    const options = {
      maxWidthOrHeight: 1920,
      maxSizeMB: 0.5,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.82,
    };

    const compressedFile = await imageCompression(file, options);

    // browser-image-compression keeps the original filename/extension;
    // rename so it's clearly a .webp file when it reaches Storage
    const renamedFile = new File(
      [compressedFile],
      file.name.replace(/\.[^.]+$/, ".webp"),
      { type: "image/webp" },
    );

    return renamedFile;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setCompressionInfo(null);

    try {
      const originalSizeKB = (file.size / 1024).toFixed(0);

      const compressedFile = await compressImage(file);

      const compressedSizeKB = (compressedFile.size / 1024).toFixed(0);

      setCompressionInfo({
        before: originalSizeKB,
        after: compressedSizeKB,
      });

      const url = await onUpload(compressedFile, folder);

      if (url) {
        setPreview(url);
      }
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
      // reset the input so selecting the same file again re-triggers onChange
      e.target.value = "";
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
            Compressing & uploading...
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
      {compressionInfo && (
        <div className="text-muted small mt-1">
          Compressed: {compressionInfo.before} KB → {compressionInfo.after} KB
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
