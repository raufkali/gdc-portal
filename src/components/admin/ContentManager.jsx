import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadToR2WithProgress } from "../../utils/cloudflare";

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  const collectionMap = {
    banners: "banners",
    programs: "programs",
    departments: "departments",
    activities: "activities",
    gallery: "gallery",
    testimonials: "testimonials",
    faqs: "faqs",
  };

  const fetchItems = async () => {
    const colName = collectionMap[activeTab];
    if (!colName) return;
    const snap = await getDocs(collection(db, colName));
    setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadToR2WithProgress(file, `${activeTab}/`);
      return result.url;
    } catch (error) {
      alert("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const colName = collectionMap[activeTab];
    if (editing) {
      await updateDoc(doc(db, colName, editing.id), formData);
    } else {
      await addDoc(collection(db, colName), formData);
    }
    setShowModal(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      await deleteDoc(doc(db, collectionMap[activeTab], id));
      fetchItems();
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setEditing(null);
          setFormData({});
          setShowModal(true);
        }}
      >
        Add New {activeTab.slice(0, -1)}
      </button>
      <div className="mb-3">
        <div className="btn-group" role="group">
          {Object.keys(collectionMap).map((key) => (
            <button
              key={key}
              className={`btn btn-outline-secondary ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Title / Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td>{idx + 1}</td>
              <td>{item.title || item.name || item.question}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditing(item);
                    setFormData(item);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal using Bootstrap classes */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Edit" : "Add"} {activeTab.slice(0, -1)}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setFormData({ ...formData, imageUrl: url });
                        }
                      }}
                    />
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="preview"
                        className="mt-2"
                        style={{ width: "100px" }}
                      />
                    )}
                  </div>
                  {/* Add other fields as needed */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Save"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContentManager;
