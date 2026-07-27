import { useState, useEffect, useRef } from "react";
import { db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadToR2WithProgress } from "../../../utils/cloudflare";
import DeleteModal from "./Shared/DeleteModal";

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "gallery"));
      setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(file, "gallery/");
      return result.url;
    } catch (error) {
      alert("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const urls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);

        const result = await uploadToR2WithProgress(file, "gallery/");
        if (result && result.url) {
          urls.push({ imageUrl: result.url, caption: "" });
        }
      }

      setImageUrls(urls);

      // Auto-save to Firestore
      for (const imgData of urls) {
        await addDoc(collection(db, "gallery"), imgData);
      }

      setImageUrls([]);
      alert(`✅ ${urls.length} images uploaded successfully!`);
      fetchItems();
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "gallery", deletingId));
      setShowDeleteModal(false);
      fetchItems();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-image me-2 text-secondary"></i>Gallery
        </h4>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleMultipleImageUpload(files);
              }
            }}
          />
          <button
            className="btn btn-secondary rounded-pill px-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <i className="bi bi-plus-circle me-1"></i>{" "}
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="mb-3">
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
          <small className="text-muted">Uploading images...</small>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">
            <i className="bi bi-image"></i>
          </div>
          <p className="text-muted">
            No images in gallery. Click "Upload Images" to add some.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.id} className="col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={item.imageUrl}
                  className="card-img-top"
                  alt={item.caption || "Gallery"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  {item.caption && (
                    <p className="small text-muted">{item.caption}</p>
                  )}
                </div>
                <div className="card-footer bg-transparent border-0 pt-0">
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => {
                      setDeletingId(item.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Image"
      />
    </div>
  );
};

export default GalleryManager;
