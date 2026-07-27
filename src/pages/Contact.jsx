import { useSettings } from "../contexts/SettingsContext";
import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
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
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    {
      key: "facebook",
      label: "Facebook",
      icon: "bi-facebook",
      color: "#1877f2",
    },
    { key: "twitter", label: "Twitter", icon: "bi-twitter", color: "#1da1f2" },
    {
      key: "instagram",
      label: "Instagram",
      icon: "bi-instagram",
      color: "#e4405f",
    },
    { key: "youtube", label: "YouTube", icon: "bi-youtube", color: "#ff0000" },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: "bi-linkedin",
      color: "#0a66c2",
    },
  ];

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.4rem 1.5rem",
              borderRadius: "50px",
              marginBottom: "0.75rem",
            }}
          >
            Get in Touch
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            Contact <span style={{ color: "#A51C30" }}>Us</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Have questions or feedback? Reach out to us and we'll get back to
            you promptly
          </p>
        </div>

        <div className="row g-4">
          {/* Contact Info */}
          <div className="col-lg-4" data-aos="fade-right" data-aos-delay="100">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "16px",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="card-body p-4 p-lg-5">
                <h5
                  className="fw-bold mb-4"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "var(--color-text)",
                  }}
                >
                  <i
                    className="bi bi-info-circle me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Contact Information
                </h5>

                {/* Phone */}
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(165, 28, 48, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="bi bi-telephone fs-5"
                      style={{ color: "#A51C30" }}
                    ></i>
                  </div>
                  <div>
                    <h6
                      className="fw-bold mb-0"
                      style={{ color: "var(--color-text)" }}
                    >
                      Phone
                    </h6>
                    <p
                      className="mb-0"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {settings?.contactPhone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(40, 167, 69, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="bi bi-envelope fs-5"
                      style={{ color: "#28a745" }}
                    ></i>
                  </div>
                  <div>
                    <h6
                      className="fw-bold mb-0"
                      style={{ color: "var(--color-text)" }}
                    >
                      Email
                    </h6>
                    <p
                      className="mb-0"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {settings?.contactEmail || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(255, 193, 7, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="bi bi-geo-alt fs-5"
                      style={{ color: "#ffc107" }}
                    ></i>
                  </div>
                  <div>
                    <h6
                      className="fw-bold mb-0"
                      style={{ color: "var(--color-text)" }}
                    >
                      Address
                    </h6>
                    <p
                      className="mb-0"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {settings?.contactAddress || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="d-flex align-items-start gap-3">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(23, 162, 184, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className="bi bi-clock fs-5"
                      style={{ color: "#17a2b8" }}
                    ></i>
                  </div>
                  <div>
                    <h6
                      className="fw-bold mb-0"
                      style={{ color: "var(--color-text)" }}
                    >
                      Office Hours
                    </h6>
                    <p
                      className="mb-0"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Mon-Fri: 8:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>

                {/* Social Media */}
                <hr
                  className="my-4"
                  style={{ borderColor: "var(--color-border)" }}
                />
                <h6
                  className="fw-bold mb-3"
                  style={{ color: "var(--color-text)" }}
                >
                  <i
                    className="bi bi-share me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Connect With Us
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {socialLinks.map((social) => {
                    const url = settings?.[social.key];
                    if (!url) return null;
                    return (
                      <a
                        key={social.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.04)",
                          color: social.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          transition: "all 0.3s ease",
                          border: "none",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = social.color;
                          e.target.style.color = "#fff";
                          e.target.style.transform = "translateY(-3px)";
                          e.target.style.boxShadow = `0 8px 25px ${social.color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(0,0,0,0.04)";
                          e.target.style.color = social.color;
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <i className={`bi ${social.icon}`}></i>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8" data-aos="fade-left" data-aos-delay="200">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "16px",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="card-body p-4 p-lg-5">
                <h5
                  className="fw-bold mb-4"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "var(--color-text)",
                  }}
                >
                  <i
                    className="bi bi-envelope-paper me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Send Us a Message
                </h5>

                {submitted ? (
                  <div className="text-center py-4">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "rgba(40, 167, 69, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                      }}
                    >
                      <i
                        className="bi bi-check-circle-fill display-4"
                        style={{ color: "#28a745" }}
                      ></i>
                    </div>
                    <h4
                      className="fw-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      Message Sent!
                    </h4>
                    <p className="text-muted">
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>
                    <button
                      className="btn"
                      style={{
                        background: "#A51C30",
                        color: "#fff",
                        borderRadius: "50px",
                        padding: "0.5rem 2rem",
                        fontWeight: "500",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => setSubmitted(false)}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#7A1523";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#A51C30";
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label
                          className="form-label fw-semibold"
                          style={{ color: "var(--color-text)" }}
                        >
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                          style={{
                            borderRadius: "10px",
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)",
                            padding: "0.7rem 1rem",
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          className="form-label fw-semibold"
                          style={{ color: "var(--color-text)" }}
                        >
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          required
                          style={{
                            borderRadius: "10px",
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)",
                            padding: "0.7rem 1rem",
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label
                          className="form-label fw-semibold"
                          style={{ color: "var(--color-text)" }}
                        >
                          Subject <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter the subject"
                          value={form.subject}
                          onChange={(e) =>
                            setForm({ ...form, subject: e.target.value })
                          }
                          required
                          style={{
                            borderRadius: "10px",
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)",
                            padding: "0.7rem 1rem",
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label
                          className="form-label fw-semibold"
                          style={{ color: "var(--color-text)" }}
                        >
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows="5"
                          placeholder="Write your message here..."
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                          required
                          style={{
                            borderRadius: "10px",
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)",
                            padding: "0.7rem 1rem",
                            resize: "vertical",
                          }}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn w-100"
                          disabled={loading}
                          style={{
                            background:
                              "linear-gradient(145deg, #A51C30, #7A1523)",
                            color: "#fff",
                            borderRadius: "50px",
                            padding: "0.7rem 2rem",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            border: "none",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 8px 25px rgba(165, 28, 48, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 4px 15px rgba(165, 28, 48, 0.3)";
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-2"></i>
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-5 pt-3" data-aos="fade-up" data-aos-delay="300">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              background: "var(--color-bg)",
              padding: "1.5rem",
            }}
          >
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                to="/about"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#A51C30";
                  e.target.style.color = "#A51C30";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-info-circle me-2"></i>
                About Us
              </Link>
              <Link
                to="/programs"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#A51C30";
                  e.target.style.color = "#A51C30";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-book me-2"></i>
                Our Programs
              </Link>
              <Link
                to="/faq"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#A51C30";
                  e.target.style.color = "#A51C30";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-question-circle me-2"></i>
                FAQ
              </Link>
              <Link
                to="/eligibility-criteria"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50px",
                  padding: "0.4rem 1.5rem",
                  fontWeight: "500",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#A51C30";
                  e.target.style.color = "#A51C30";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-check-circle me-2"></i>
                Eligibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
