import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import Footer from "../page/Footer";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- PROGRESS BAR LOGIC ---
  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };
    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  const sections = [
    { id: "introduction", title: "1. Introduction", icon: "bi-info-circle", content: "General overview of our commitment to data protection." },
    { id: "collection", title: "2. Data We Collect", icon: "bi-database", content: "Personal identifiers, academic history, and technical logs." },
    { id: "sharing", title: "3. Data Sharing", icon: "bi-share", content: "How we share data with educational boards and HEC." },
    { id: "rights", title: "4. Your Rights", icon: "bi-person-check", content: "Your right to access, correct, or delete your records." },
    { id: "retention", title: "5. Data Retention", icon: "bi-clock-history", content: "How long we keep student records after graduation." },
    { id: "cookies", title: "6. Cookies & Tracking", icon: "bi-browser-edge", content: "Technical details of how we use browser cookies." }
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("GDC GULABAD - OFFICIAL PRIVACY GOVERNANCE", 10, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Version 2.1 | Effective Date: Jan 2025", 10, 30);
    doc.text("------------------------------------------------------------", 10, 35);
    
    let yPos = 45;
    sections.forEach(s => {
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
      {/* Reading Progress Bar */}
      <div className="progress-container shadow-sm">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="bg-light min-vh-100">
        {/* --- PROFESSIONAL HERO --- */}
        <div className="policy-hero py-5 text-white">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <span className="badge bg-info mb-3 px-3 py-2 text-uppercase fw-bold">Legal Governance</span>
                <h1 className="display-4 fw-bold">Privacy & Data <span className="text-info">Protection</span></h1>
                <p className="lead opacity-75">Ensuring the digital safety of our students and faculty through rigorous compliance with educational data standards.</p>
              </div>
              <div className="col-lg-5 text-lg-end">
                <div className="bg-white p-3 rounded-4 shadow-lg d-inline-block text-dark text-start" style={{ maxWidth: "300px" }}>
                  <div className="small fw-bold mb-2 text-muted">Document Info:</div>
                  <div className="d-flex justify-content-between mb-1 small"><span>Version:</span> <span className="fw-bold">2.4.0</span></div>
                  <div className="d-flex justify-content-between mb-3 small"><span>Last Update:</span> <span className="fw-bold">Dec 31, 2025</span></div>
                  <button onClick={downloadPDF} className="btn btn-dark w-100 btn-sm rounded-3">Download Official PDF</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {/* --- ADVANCED SIDEBAR --- */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: "90px" }}>
                <div className="search-box mb-3">
                  <div className="input-group bg-white rounded-3 shadow-sm border overflow-hidden p-1">
                    <span className="input-group-text bg-white border-0"><i className="bi bi-search text-muted"></i></span>
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-none small" 
                      placeholder="Search policy..." 
                      onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                    />
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white border-bottom p-3 fw-bold small text-uppercase text-muted">Sections</div>
                  <div className="list-group list-group-flush">
                    {sections.map(s => (
                      <a 
                        key={s.id} 
                        href={`#${s.id}`} 
                        className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center gap-3 ${activeSection === s.id ? 'active-nav' : ''}`}
                        onClick={() => setActiveSection(s.id)}
                      >
                        <i className={`bi ${s.icon} fs-5`}></i>
                        <span className="small fw-bold">{s.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- POLICY BODY --- */}
            <div className="col-lg-9">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                
                {/* Introduction Section */}
                <section id="introduction" className="mb-5 border-bottom pb-4">
                  <h3 className="fw-bold text-dark mb-4"><i className="bi bi-shield-check text-info me-2"></i> 1. Scope of Policy</h3>
                  <p className="text-secondary mb-4">
                    Govt Degree College Gulabad (the "College") is committed to protecting the privacy and security of your personal data. This Policy outlines our practices concerning data collected through the <strong>Student Information System (SIS)</strong>, Admission Portals, and our official web domains.
                  </p>
                  <div className="alert alert-info border-0 rounded-4 p-4 d-flex gap-3">
                    <i className="bi bi-lightbulb-fill fs-3 text-info"></i>
                    <div>
                      <h6 className="fw-bold">Quick Summary</h6>
                      <p className="small mb-0 opacity-75">We never sell student data to third-party advertisers. All data is stored on secure government-encrypted servers for academic use only.</p>
                    </div>
                  </div>
                </section>

                {/* Data Collection Section */}
                <section id="collection" className="mb-5 border-bottom pb-4">
                  <h3 className="fw-bold text-dark mb-4">2. Categories of Data Collected</h3>
                  <table className="table table-bordered rounded-3 overflow-hidden border-light">
                    <thead className="bg-light">
                      <tr><th className="small text-uppercase p-3">Category</th><th className="small text-uppercase p-3">Specific Examples</th></tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-3 fw-bold small">Identifiers</td><td className="p-3 small text-muted">Full Name, CNIC Number, Roll No, IP Address</td></tr>
                      <tr><td className="p-3 fw-bold small">Academic Records</td><td className="p-3 small text-muted">Exam Grades, Attendance Percentages, Disciplinary History</td></tr>
                      <tr><td className="p-3 fw-bold small">Biometric Info</td><td className="p-3 small text-muted">Photographs for Student IDs and Portal Profiles</td></tr>
                    </tbody>
                  </table>
                </section>

                {/* Your Rights Section */}
                <section id="rights" className="mb-5 border-bottom pb-4">
                  <h3 className="fw-bold text-dark mb-4">3. Student Rights & Control</h3>
                  <div className="row g-3">
                    {["Access", "Rectification", "Erasure", "Portability"].map((right, idx) => (
                      <div className="col-md-6" key={idx}>
                        <div className="p-3 border rounded-4 bg-light-subtle h-100">
                          <h6 className="fw-bold mb-1 text-info">{right} Right</h6>
                          <p className="small text-muted mb-0">You have the authority to request a copy of your digital footprint on our SIS portal.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Cookies Section */}
                <section id="cookies" className="mb-4">
                  <h3 className="fw-bold text-dark mb-4">4. Cookies & Tracking Technology</h3>
                  <p className="text-secondary small">
                    Our website uses <strong>Essential Cookies</strong> to keep you logged into the student portal. We use <strong>Analytical Cookies</strong> (Google Analytics) to understand how students navigate our resources to improve the user interface.
                  </p>
                  
                </section>

              </div>

              {/* Version History Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mt-4 bg-white">
                <h6 className="fw-bold mb-3"><i className="bi bi-clock-history me-2"></i>Revision History</h6>
                <div className="d-flex gap-4 small text-muted border-top pt-3">
                  <div><span className="fw-bold text-dark">v2.4.0</span> (Current) - Added AI Data Privacy Clause</div>
                  <div><span className="fw-bold text-dark">v2.1.0</span> - Updated Admission Privacy Laws</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .progress-container { position: fixed; top: 0; left: 0; width: 100%; height: 5px; background: transparent; z-index: 10002; }
          .progress-bar { height: 100%; background: #0dcaf0; transition: width 0.1s; }
          .policy-hero { background: linear-gradient(135deg, #0a192f 0%, #112240 100%); }
          .active-nav { background: #0dcaf0 !important; color: white !important; }
          .list-group-item { transition: 0.3s; cursor: pointer; }
          .list-group-item:hover:not(.active-nav) { background: #f8f9fa; transform: translateX(5px); }
          section { scroll-margin-top: 100px; }
          .table td, .table th { vertical-align: middle; }
        `}</style>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;