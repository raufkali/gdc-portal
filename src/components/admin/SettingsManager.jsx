import { useState, useEffect } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { uploadToR2WithProgress } from "../../utils/cloudflare";

const SettingsManager = () => {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(form);
    alert("Settings updated!");
  };

  const handleImageUpload = async (file, field) => {
    setUploading(true);
    try {
      const url = await uploadToR2WithProgress(file, "settings/");
      setForm({ ...form, [field]: url });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!form) return <div>Loading settings...</div>;

  return (
    <div className="container">
      <h3>Website Settings</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Brand Name</label>
              <input
                type="text"
                className="form-control"
                value={form.brandName || ""}
                onChange={(e) =>
                  setForm({ ...form, brandName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Logo</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  handleImageUpload(e.target.files[0], "logoUrl")
                }
              />
              {form.logoUrl && (
                <img
                  src={form.logoUrl}
                  alt="logo"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Principal Name</label>
              <input
                type="text"
                className="form-control"
                value={form.principalName || ""}
                onChange={(e) =>
                  setForm({ ...form, principalName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Principal Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  handleImageUpload(e.target.files[0], "principalImageUrl")
                }
              />
              {form.principalImageUrl && (
                <img
                  src={form.principalImageUrl}
                  alt="principal"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Principal Message</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.principalMessage || ""}
                onChange={(e) =>
                  setForm({ ...form, principalMessage: e.target.value })
                }
              ></textarea>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Vision</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.vision || ""}
                onChange={(e) => setForm({ ...form, vision: e.target.value })}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Mission</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.mission || ""}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Aims</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.aims || ""}
                onChange={(e) => setForm({ ...form, aims: e.target.value })}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">What We Offer</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.whatWeOffer || ""}
                onChange={(e) =>
                  setForm({ ...form, whatWeOffer: e.target.value })
                }
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={form.contactPhone || ""}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-control"
                value={form.contactEmail || ""}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={form.contactAddress || ""}
                onChange={(e) =>
                  setForm({ ...form, contactAddress: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Facebook URL</label>
              <input
                type="text"
                className="form-control"
                value={form.facebook || ""}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Twitter URL</label>
              <input
                type="text"
                className="form-control"
                value={form.twitter || ""}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Instagram URL</label>
              <input
                type="text"
                className="form-control"
                value={form.instagram || ""}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Footer Text</label>
              <input
                type="text"
                className="form-control"
                value={form.footerText || ""}
                onChange={(e) =>
                  setForm({ ...form, footerText: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default SettingsManager;
