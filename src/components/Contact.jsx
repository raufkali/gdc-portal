import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../page/Footer"; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  // Always scroll to top when visiting this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lat = 34.71;
  const lng = 72.03;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}. Your message has been sent!`);
  };

  return (
    <>
      <div className="bg-light-smooth min-vh-100">
        
        {/* --- HERO SECTION --- */}
        <div className="contact-hero d-flex align-items-center text-center">
          <div className="container text-white">
            <span className="badge bg-info-subtle text-info px-3 py-1 rounded-pill mb-3 mt-4 fw-bold text-uppercase tracking-wider">
              Available for Support
            </span>
            <h1 className="display-4 fw-bold mb-3 animate-slide-down">
              Let’s <span className="text-info-gradient">Connect</span>
            </h1>
            <p className="lead mx-auto opacity-75 mb-0" style={{ maxWidth: "700px" }}>
              Have questions about admissions or campus life? Our team is dedicated to providing you with the assistance you need.
            </p>
          </div>
        </div>

        {/* --- MAIN CONTENT SECTION --- */}
        <div className="container pb-5 mt-5 position-relative" style={{ zIndex: 5 }}>
          <div className="row g-4">
            
            {/* 1. CONTACT INFO CARDS (Sidebar) */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4">
                
                {/* Information Card Component */}
                {[
                  {
                    icon: "bi-geo-alt-fill",
                    title: "Our Location",
                    text: "Gulabad, Tehsil Adenzai, Dir Lower, KP, Pakistan.",
                    btn: "Get Directions",
                    link: `https://www.google.com/maps?q=${lat},${lng}`,
                    color: "info"
                  },
                  {
                    icon: "bi-telephone-fill",
                    title: "Direct Contact",
                    text: "+92 945 123456",
                    subtext: "info@gdcgulabad.edu.pk",
                    color: "primary"
                  },
                  {
                    icon: "bi-clock-fill",
                    title: "Office Timing",
                    text: "Mon - Sat: 08:30 AM - 02:30 PM",
                    subtext: "Closed on Sundays & Holidays",
                    color: "warning"
                  }
                ].map((item, index) => (
                  <div className="info-glass-card p-4 rounded-4 shadow-sm border-0" key={index}>
                    <div className="d-flex align-items-center mb-3">
                      <div className={`icon-box bg-${item.color} shadow-sm me-3`}>
                        <i className={`bi ${item.icon} text-white`}></i>
                      </div>
                      <h5 className="fw-bold mb-0 text-navy">{item.title}</h5>
                    </div>
                    <p className="text-secondary small mb-2">{item.text}</p>
                    {item.subtext && <p className="text-muted extra-small mb-0">{item.subtext}</p>}
                    {item.btn && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-info p-0 mt-2 fw-bold text-decoration-none">
                        {item.btn} <i className="bi bi-arrow-right ms-1"></i>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. CONTACT FORM */}
            <div className="col-lg-8">
              <div className="form-glass-card p-4 p-md-5 rounded-4 shadow-lg border-0 bg-white">
                <div className="mb-4">
                  <h3 className="fw-bold text-navy">Send a Message</h3>
                  <div className="divider-sm bg-info"></div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-navy small">FULL NAME</label>
                      <input type="text" className="form-control modern-input" placeholder="e.g. Ahmad Ali" required 
                             onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-navy small">EMAIL ADDRESS</label>
                      <input type="email" className="form-control modern-input" placeholder="name@email.com" required 
                             onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-navy small">SUBJECT</label>
                      <select className="form-select modern-input" onChange={(e) => setFormData({...formData, subject: e.target.value})}>
                        <option>General Inquiry</option>
                        <option>Admission Help</option>
                        <option>Technical Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-navy small">MESSAGE</label>
                      <textarea className="form-control modern-input" rows="5" placeholder="How can we assist you?" required
                                onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn-attractive-contact">
                        <span>Send Message</span>
                        <i className="bi bi-send-fill"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 3. GOOGLE MAP SECTION */}
          <div className="mt-5 rounded-4 overflow-hidden border-0 shadow-xl map-container">
            <iframe 
              title="College Map"
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`} 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <Footer />
      </div>

      <style>{`
        .bg-light-smooth { background-color: #f8fafc; }
        .text-navy { color: #0f172a; }
        .text-info-gradient {
          background: linear-gradient(90deg, #0dcaf0, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-hero {
          background: linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), 
                      url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80') center/cover;
          minHeight: 450px;
          padding-top: 80px;
          padding-bottom: 120px;
        }

        .mt-n5 { margin-top: -100px !important; }

        .info-glass-card {
          background: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .info-glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }

        .icon-box {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .modern-input {
          padding: 12px 18px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          transition: all 0.3s ease;
        }
        .modern-input:focus {
          border-color: #0dcaf0;
          background: white;
          box-shadow: 0 0 0 4px rgba(13, 202, 240, 0.1);
        }

        .divider-sm {
          width: 50px;
          height: 4px;
          border-radius: 2px;
          margin-top: 8px;
        }

        .btn-attractive-contact {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.4s ease;
          width: fit-content;
        }
        .btn-attractive-contact:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.3);
          background: #0dcaf0;
        }

        .map-container {
          filter: grayscale(0.2) contrast(1.1);
          transition: filter 0.5s ease;
        }
        .map-container:hover {
          filter: grayscale(0);
        }

        .animate-slide-down {
          animation: slideDown 0.8s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 991px) {
          .mt-n5 { margin-top: -50px !important; }
          .btn-attractive-contact { width: 100%; justify-content: center; }
        }
      `}</style>
    </>
  );
};

export default Contact;