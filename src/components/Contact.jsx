// src/components/Contact.jsx
import React, { useState, useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}. Your message has been sent!`);
  };

  return (
    <>
      {/* Hero */}
      <section className="contact-hero">
        <div className="container-custom">
          <div className="contact-hero-content">
            <span className="hero-badge">Get in Touch</span>
            <h1>
              Let's <span className="highlight">Connect</span>
            </h1>
            <p>
              Have questions about admissions or campus life? Our team is here
              to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="contact-main">
        <div className="container-custom">
          <div className="contact-grid">
            {/* Info Cards */}
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <h5>Our Location</h5>
                <p>Gulabad, Tehsil Adenzai, Dir Lower, KP, Pakistan</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions →
                </a>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-telephone"></i>
                </div>
                <h5>Call Us</h5>
                <p>+92 945 123456</p>
                <p style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  info@gdcgulabad.edu.pk
                </p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-clock"></i>
                </div>
                <h5>Office Hours</h5>
                <p>Mon - Sat: 08:30 AM - 02:30 PM</p>
                <p style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  Closed on Sundays & Holidays
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrapper">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                >
                  <option>General Inquiry</option>
                  <option>Admission Help</option>
                  <option>Technical Issue</option>
                  <option>Other</option>
                </select>
                <textarea
                  rows="5"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
                <button type="submit" className="btn-gdc btn-gdc-primary">
                  Send Message <i className="bi bi-send"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="contact-map">
        <div className="container-custom">
          <iframe
            title="College Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.0!2d72.03!3d34.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQyJzM2LjAiTiA3MsKwMDEnNDguMCJF!5e0!3m2!1sen!2s!4v1700000000000"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "16px" }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </section>

      <style>{`
        .contact-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .contact-hero-content { max-width: 600px; }
        .contact-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; }
        .contact-hero-content h1 .highlight { color: #b8860b; }
        .contact-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .contact-main { padding: 80px 0; background: #f8f9fa; }
        .contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; }
        .contact-info { display: flex; flex-direction: column; gap: 16px; }
        .contact-card { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .contact-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(184,134,11,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #b8860b; margin-bottom: 12px; }
        .contact-card h5 { margin: 0 0 4px; }
        .contact-card p { color: #6c757d; margin: 0; font-size: 0.9rem; }
        .contact-card a { color: #b8860b; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
        .contact-form-wrapper { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .contact-form-wrapper h3 { font-size: 1.5rem; margin-bottom: 24px; }
        .contact-form-wrapper .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .contact-form-wrapper input, .contact-form-wrapper select, .contact-form-wrapper textarea {
          width: 100%; padding: 12px 16px; border: 1px solid #e9ecef; border-radius: 8px; font-size: 0.95rem; transition: all 0.2s;
        }
        .contact-form-wrapper input:focus, .contact-form-wrapper select:focus, .contact-form-wrapper textarea:focus {
          outline: none; border-color: #b8860b; box-shadow: 0 0 0 3px rgba(184,134,11,0.1);
        }
        .contact-form-wrapper textarea { resize: vertical; font-family: inherit; }
        .contact-form-wrapper button { margin-top: 12px; }
        .contact-map { padding: 80px 0; background: #fff; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-hero { padding: 100px 0 40px; }
          .contact-hero-content h1 { font-size: 2.2rem; }
          .contact-form-wrapper .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default Contact;
