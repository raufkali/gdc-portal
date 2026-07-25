// src/page/PrivacyPolicy.jsx
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: "bi-info-circle",
      content: "General overview of our commitment to data protection.",
    },
    {
      id: "collection",
      title: "2. Data We Collect",
      icon: "bi-database",
      content: "Personal identifiers, academic history, and technical logs.",
    },
    {
      id: "sharing",
      title: "3. Data Sharing",
      icon: "bi-share",
      content: "How we share data with educational boards and HEC.",
    },
    {
      id: "rights",
      title: "4. Your Rights",
      icon: "bi-person-check",
      content: "Your right to access, correct, or delete your records.",
    },
    {
      id: "retention",
      title: "5. Data Retention",
      icon: "bi-clock-history",
      content: "How long we keep student records after graduation.",
    },
    {
      id: "cookies",
      title: "6. Cookies & Tracking",
      icon: "bi-browser-edge",
      content: "Technical details of how we use browser cookies.",
    },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("GDC GULABAD - OFFICIAL PRIVACY GOVERNANCE", 10, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Version 2.1 | Effective Date: Jan 2025", 10, 30);
    doc.text(
      "------------------------------------------------------------",
      10,
      35,
    );
    let yPos = 45;
    sections.forEach((s) => {
      doc.setFont("helvetica", "bold");
      doc.text(s.title, 10, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(s.content, 10, yPos + 7, { maxWidth: 180 });
      yPos += 25;
    });
    doc.save("GDC_Privacy_Governance.pdf");
  };

  return (
    <>
      {/* Hero */}
      <section className="privacy-hero">
        <div className="container-custom">
          <div className="privacy-hero-content">
            <span className="hero-badge">Legal</span>
            <h1>
              Privacy & <span className="highlight">Data Protection</span>
            </h1>
            <p>Ensuring the digital safety of our students and faculty.</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="privacy-content">
        <div className="container-custom">
          <div className="privacy-grid">
            {/* Sidebar */}
            <div className="privacy-sidebar">
              <div className="privacy-sidebar-card">
                <h6>Sections</h6>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`privacy-nav ${activeSection === s.id ? "active" : ""}`}
                    onClick={() => setActiveSection(s.id)}
                  >
                    <i className={`bi ${s.icon}`}></i> {s.title}
                  </a>
                ))}
              </div>
              <button
                className="btn-gdc btn-gdc-primary"
                onClick={downloadPDF}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <i className="bi bi-file-pdf"></i> Download PDF
              </button>
            </div>

            {/* Body */}
            <div className="privacy-body">
              {sections.map((s) => (
                <div key={s.id} id={s.id} className="privacy-section">
                  <h3>
                    <i className={`bi ${s.icon} text-gold`}></i> {s.title}
                  </h3>
                  <p>{s.content}</p>
                  {s.id === "introduction" && (
                    <div className="privacy-alert">
                      <i className="bi bi-lightbulb"></i>
                      <div>
                        <h6>Quick Summary</h6>
                        <p>
                          We never sell student data to third-party advertisers.
                          All data is stored on secure government-encrypted
                          servers for academic use only.
                        </p>
                      </div>
                    </div>
                  )}
                  {s.id === "collection" && (
                    <div className="privacy-table-wrapper">
                      <table className="privacy-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Specific Examples</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Identifiers</td>
                            <td>Full Name, CNIC Number, Roll No, IP Address</td>
                          </tr>
                          <tr>
                            <td>Academic Records</td>
                            <td>Exam Grades, Attendance Percentages</td>
                          </tr>
                          <tr>
                            <td>Biometric Info</td>
                            <td>Photographs for Student IDs</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {s.id === "rights" && (
                    <div className="rights-grid">
                      {[
                        "Access",
                        "Rectification",
                        "Erasure",
                        "Portability",
                      ].map((right, i) => (
                        <div key={i} className="right-item">
                          <h6>{right} Right</h6>
                          <p>
                            You have the authority to request a copy of your
                            digital footprint.
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .privacy-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .privacy-hero-content { max-width: 600px; }
        .privacy-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; }
        .privacy-hero-content h1 .highlight { color: #b8860b; }
        .privacy-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .privacy-content { padding: 60px 0; background: #f8f9fa; }
        .privacy-grid { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }
        .privacy-sidebar { position: sticky; top: 100px; height: fit-content; }
        .privacy-sidebar-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 16px; }
        .privacy-sidebar-card h6 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #6c757d; margin-bottom: 12px; }
        .privacy-nav { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; color: #0a1628; text-decoration: none; font-size: 0.9rem; transition: all 0.2s; }
        .privacy-nav:hover { background: #f8f9fa; }
        .privacy-nav.active { background: rgba(184,134,11,0.08); color: #b8860b; font-weight: 600; }
        .privacy-nav i { font-size: 1.1rem; }
        .privacy-body { background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .privacy-section { margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #f8f9fa; scroll-margin-top: 100px; }
        .privacy-section:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .privacy-section h3 { font-size: 1.3rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .privacy-section h3 i { font-size: 1.2rem; }
        .privacy-section p { color: #555; line-height: 1.8; }
        .text-gold { color: #b8860b; }
        .privacy-alert { background: #f8f9fa; border-radius: 12px; padding: 20px; display: flex; gap: 16px; margin-top: 16px; border-left: 4px solid #b8860b; }
        .privacy-alert i { font-size: 1.5rem; color: #b8860b; }
        .privacy-alert h6 { margin: 0 0 4px; }
        .privacy-alert p { margin: 0; color: #6c757d; font-size: 0.9rem; }
        .privacy-table-wrapper { overflow-x: auto; margin-top: 16px; }
        .privacy-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .privacy-table th { background: #f8f9fa; padding: 12px 16px; text-align: left; font-weight: 600; color: #0a1628; border-bottom: 2px solid #e9ecef; }
        .privacy-table td { padding: 10px 16px; border-bottom: 1px solid #f8f9fa; color: #555; }
        .rights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .right-item { padding: 16px; background: #f8f9fa; border-radius: 8px; }
        .right-item h6 { margin: 0 0 4px; font-size: 0.9rem; color: #b8860b; }
        .right-item p { margin: 0; font-size: 0.85rem; color: #6c757d; }
        @media (max-width: 768px) {
          .privacy-hero { padding: 100px 0 40px; }
          .privacy-hero-content h1 { font-size: 2.2rem; }
          .privacy-grid { grid-template-columns: 1fr; }
          .privacy-sidebar { position: static; }
          .rights-grid { grid-template-columns: 1fr; }
          .privacy-body { padding: 24px; }
        }
      `}</style>
    </>
  );
};

export default PrivacyPolicy;
