import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Footer from "../page/Footer"; 

const FeeStructure = () => {
  const [selectedDept, setSelectedDept] = useState(null);

  const feeData = [
    { 
      category: "Computing", 
      depts: ["Computer Science"], 
      total: "13,500", 
      details: { admission: "2,000", tuition: "8,500", lab: "2,000", library: "1,000" },
      icon: "bi-cpu"
    },
    { 
      category: "Natural Sciences", 
      depts: ["Physics", "Chemistry", "Botany", "Zoology"], 
      total: "12,500", 
      details: { admission: "2,000", tuition: "7,500", lab: "2,000", library: "1,000" },
      icon: "bi-microscope"
    },
    { 
      category: "Social Sciences", 
      depts: ["Political Science", "Economics", "History"], 
      total: "11,500", 
      details: { admission: "2,000", tuition: "7,500", lab: "1,000", library: "1,000" },
      icon: "bi-people"
    },
    { 
      category: "Languages & Arts", 
      depts: ["English", "Urdu", "Islamiyat"], 
      total: "11,000", 
      details: { admission: "2,000", tuition: "7,500", lab: "500", library: "1,000" },
      icon: "bi-translate"
    }
  ];

  // --- ENHANCED PDF GENERATION WITH ADVERTISEMENT & DETAILS ---
  const generateProspectus = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // PAGE 1: THE COVER & ADVERTISEMENT
    doc.setFillColor(10, 25, 47); // Dark Blue Background
    doc.rect(0, 0, pageWidth, 297, 'F');
    
    doc.setTextColor(0, 162, 255); // Info Blue
    doc.setFontSize(28);
    doc.text("GOVT DEGREE COLLEGE", pageWidth / 2, 80, { align: "center" });
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.text("GULABAD", pageWidth / 2, 100, { align: "center" });
    
    doc.setDrawColor(0, 162, 255);
    doc.line(70, 110, 140, 110);

    doc.setFontSize(14);
    doc.text("Shape Your Future with Excellence", pageWidth / 2, 130, { align: "center" });

    // ADVERTISEMENT CONTENT
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    const missionText = "Join GDC Gulabad, where we combine modern technology with traditional values. Our campus offers state-of-the-art labs, a digital library, and highly qualified faculty to ensure your success in the competitive world.";
    const splitMission = doc.splitTextToSize(missionText, 150);
    doc.text(splitMission, pageWidth / 2, 160, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.text("✓ 11 Professional BS Departments", 60, 200);
    doc.text("✓ Modern Computer Labs", 60, 210);
    doc.text("✓ Merit-Based Scholarships", 60, 220);
    doc.text("✓ Rich Extra-Curricular Culture", 60, 230);

    doc.setTextColor(0, 162, 255);
    doc.text("ADMISSIONS OPEN 2024-25", pageWidth / 2, 260, { align: "center" });

    // PAGE 2: FEE DETAILS
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("OFFICIAL FEE STRUCTURE", 20, 25);
    
    doc.setFontSize(10);
    doc.text("This document provides the standard semester fee for all BS disciplines.", 20, 32);

    const tableRows = feeData.map(item => [
        item.category,
        item.depts.join(", "),
        `Rs. ${item.total}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Faculty', 'Departments', 'Per Semester Total']],
      body: tableRows,
      headStyles: { fillColor: [10, 25, 47] },
      theme: 'grid'
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text("Important Instructions:", 20, finalY + 15);
    doc.setFontSize(10);
    doc.text("1. Admission fee is one-time only.", 20, finalY + 25);
    doc.text("2. Fees must be deposited in the designated bank branch.", 20, finalY + 32);
    doc.text("3. Scholarship holders must maintain a 3.0 CGPA.", 20, finalY + 39);

    // FOOTER
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Contact us: info@gdcgulabad.edu.pk | www.gdcgulabad.edu.pk", pageWidth / 2, 285, { align: "center" });

    doc.save("GDC_Gulabad_Prospectus_2024.pdf");
  };

  return (
    <>
      <div className="bg-white min-vh-100">
        {/* --- HERO SECTION --- */}
        <div className="position-relative py-5 d-flex align-items-center" style={{ background: "linear-gradient(rgba(10, 25, 47, 0.9), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat", minHeight: "350px" }}>
          <div className="container text-center text-white">
            <h6 className="text-info fw-bold text-uppercase mb-3" style={{letterSpacing: '3px'}}>Financial Transparency</h6>
            <h1 className="display-4 fw-bold mb-3">Fee & <span className="text-info">Prospectus</span></h1>
            <p className="lead mx-auto opacity-75" style={{ maxWidth: "700px" }}>Access detailed financial breakdowns and download our digital prospectus for the 2024-25 academic session.</p>
          </div>
        </div>

        {/* --- DEPARTMENT CARDS SECTION --- */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">BS Programs Details</h2>
            <div className="mx-auto bg-info" style={{height: '3px', width: '50px'}}></div>
          </div>
          <div className="row g-4">
            {feeData.map((item, i) => (
              <div key={i} className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift border-start border-info border-5">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                        <i className={`bi ${item.icon} text-info fs-3`}></i>
                      </div>
                      <h4 className="fw-bold mb-0">{item.category}</h4>
                    </div>
                    <div className="mb-4">
                      {item.depts.map((d, idx) => (
                        <span key={idx} className="badge bg-light text-dark border me-2 mb-2 p-2 px-3 fw-normal">{d}</span>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">Rs. {item.total} <small className="text-muted fw-normal" style={{fontSize: '0.8rem'}}>/ Sem</small></h5>
                      <button 
                        className="btn btn-dark rounded-pill px-4"
                        onClick={() => setSelectedDept(item)}
                        data-bs-toggle="modal" 
                        data-bs-target="#feeModal"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- MODAL --- */}
        <div className="modal fade" id="feeModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body p-4">
                <h4 className="fw-bold text-center mb-4">{selectedDept?.category} Breakdown</h4>
                <div className="d-flex justify-content-between mb-2"><span>Admission (One-time)</span><span className="fw-bold">Rs. {selectedDept?.details.admission}</span></div>
                <div className="d-flex justify-content-between mb-2"><span>Tuition Fee</span><span className="fw-bold">Rs. {selectedDept?.details.tuition}</span></div>
                <div className="d-flex justify-content-between mb-2"><span>Laboratory Fee</span><span className="fw-bold">Rs. {selectedDept?.details.lab}</span></div>
                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom"><span>Library & Sports</span><span className="fw-bold">Rs. {selectedDept?.details.library}</span></div>
                <div className="d-flex justify-content-between h5 fw-bold text-info"><span>Total Payable</span><span>Rs. {selectedDept?.total}</span></div>
              </div>
              <div className="modal-footer border-0">
                 <button className="btn btn-info text-white w-100 rounded-pill py-2 fw-bold" data-bs-dismiss="modal">I Understand</button>
              </div>
            </div>
          </div>
        </div>

        {/* --- CTA SECTION --- */}
        <div className="container py-5">
          <div className="p-5 rounded-5 bg-dark text-white text-center shadow-lg position-relative overflow-hidden">
             <div className="position-relative z-index-1">
                <h2 className="fw-bold mb-3">Download Prospectus</h2>
                <p className="mb-4 opacity-75 mx-auto" style={{maxWidth: '600px'}}>Get the complete digital prospectus including college profile, department details, and the full advertisement.</p>
                <button onClick={generateProspectus} className="btn btn-info btn-lg px-5 rounded-pill fw-bold text-white">
                    <i className="bi bi-file-pdf me-2"></i> Download Digital Prospectus
                </button>
             </div>
          </div>
        </div>

        <style>{`
          .hover-lift { transition: transform 0.3s ease; }
          .hover-lift:hover { transform: translateY(-5px); }
        `}</style>

        <Footer />
      </div>
    </>
  );
};

export default FeeStructure;