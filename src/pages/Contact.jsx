import { useSettings } from "../contexts/SettingsContext";
import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        timestamp: new Date(),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <div className="row">
        <div className="col-md-6">
          <h4>Get in Touch</h4>
          <p>
            <strong>Phone:</strong> {settings?.contactPhone}
          </p>
          <p>
            <strong>Email:</strong> {settings?.contactEmail}
          </p>
          <p>
            <strong>Address:</strong> {settings?.contactAddress}
          </p>
          <div className="mt-3">
            {settings?.facebook && (
              <a
                href={settings.facebook}
                className="btn btn-outline-primary me-2"
              >
                Facebook
              </a>
            )}
            {settings?.twitter && (
              <a href={settings.twitter} className="btn btn-outline-info me-2">
                Twitter
              </a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} className="btn btn-outline-danger">
                Instagram
              </a>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              {submitted ? (
                <div className="alert alert-success">
                  Thank you! Your message has been sent.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
