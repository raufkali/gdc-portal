import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../page/Footer"; 

const OnlineAdmission = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { step: "01", title: "Create Account", desc: "Register on the HED portal using your CNIC or Form-B number.", icon: "bi-person-plus-fill" },
    { step: "02", title: "Personal Profile", desc: "Enter your personal details accurately as per your official documents.", icon: "bi-file-earmark-person" },
    { step: "03", title: "Academic Profile", desc: "Provide your Matric/Intermediate marks and school/college history.", icon: "bi-mortarboard-fill" },
    { step: "04", title: "College Selection", desc: "Select GDC Gulabad and choose your desired program (BS or Inter).", icon: "bi-building-check" },
    { step: "05", title: "Fee Payment", desc: "Pay the processing fee via JazzCash to activate your application.", icon: "bi-wallet2" },
    { step: "06", title: "Stay Updated", desc: "Check the 'Alerts' tab regularly for merit list updates.", icon: "bi-bell-fill" },
  ];

  return (
    <div className="bg-white min-vh-100">
  {/* --- HERO SECTION WITH RELIABLE CAMPUS BACKGROUND --- */}
<div 
  className="position-relative py-5 d-flex align-items-center justify-content-center" 
  style={{ 
    // New high-quality architectural image
    background: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') center/cover no-repeat fixed",
    minHeight: "500px"
  }}
>
  <div className="container text-center text-white position-relative" style={{ zIndex: 2 }}>
    <span className="badge bg-info text-dark px-3 py-2 rounded-pill mb-3 fw-bold shadow-sm" style={{ letterSpacing: "2px" }}>
      OFFICIAL ADMISSION GATEWAY
    </span>
    <h1 className="display-2 fw-bold mb-4">Secure Your <span className="text-info">Future</span></h1>
    <p className="lead mx-auto opacity-90 mb-0" style={{ maxWidth: "800px", lineHeight: "1.8", color: "#e2e8f0" }}>
      Welcome to the Govt. Degree College Gulabad online portal. 
      Join a legacy of excellence and begin your academic journey with us today.
    </p>
  </div>
</div>

      {/* --- PROCEDURE SECTION --- */}
      <div className="container py-5 mt-n5 position-relative" style={{ zIndex: 5 }}>
        <div className="row justify-content-center">
          <div className="col-lg-11">
            
            {/* Step Cards Grid */}
            <div className="row g-4 mb-5">
              {steps.map((item, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="step-card h-100 p-4 rounded-4 bg-white border-0 shadow-sm transition-base">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="step-count text-info fw-black display-5 opacity-25">{item.step}</div>
                      <div className="icon-box bg-info-subtle p-3 rounded-circle">
                        <i className={`bi ${item.icon} text-info fs-3`}></i>
                      </div>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                    <p className="text-muted small lh-lg mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Assistance Section */}
            <div className="row g-4 align-items-stretch mb-5">
              <div className="col-md-7">
                <div className="p-4 rounded-4 bg-light border-start border-info border-5 h-100 shadow-sm">
                  <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                    <i className="bi bi-info-circle-fill text-info me-2"></i>
                    Important Guidelines
                  </h5>
                  <ul className="list-unstyled mb-0">
                    {["Scan documents in high resolution", "Double check CNIC/B-Form numbers", "Keep the JazzCash Transaction ID safe", "Use a personal active mobile number"].map((text, i) => (
                      <li key={i} className="mb-3 d-flex align-items-start text-secondary">
                        <i className="bi bi-check2-square text-info me-2 mt-1"></i>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-md-5">
                <div className="p-4 rounded-4 text-white h-100 shadow-lg d-flex flex-column justify-content-center border-bottom border-info border-5" style={{ backgroundColor: "#0f172a" }}>
                  <h6 className="text-info fw-bold text-uppercase mb-3">Admission Helpdesk</h6>
                  <p className="small opacity-75 mb-4">Our dedicated staff is ready to assist you through every step of the process.</p>
                  <div className="d-flex align-items-center">
                    <div className="bg-info text-white rounded-circle p-3 me-3 shadow-sm">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                      <span className="d-block small text-info opacity-75">Contact Number</span>
                      <span className="fw-bold fs-4">0945-123456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="portal-banner p-5 rounded-5 text-white text-center shadow-2xl overflow-hidden position-relative" style={{ backgroundColor: "#1e293b" }}>
              <div className="position-relative" style={{ zIndex: 2 }}>
                <h2 className="display-6 fw-bold mb-3">Ready to Apply?</h2>
                <p className="opacity-75 mb-5 mx-auto" style={{ maxWidth: "600px" }}>
                  The application window is currently open. Click the button below to visit the official HED portal and submit your details.
                </p>
                <a
                  href="https://admission.hed.gkp.pk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-info btn-lg px-5 py-3 rounded-pill fw-bold text-white shadow-lg transition-base hover-grow"
                >
                  Apply now <i className="bi bi-arrow-up-right-circle ms-2"></i>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .transition-base { transition: all 0.3s ease; }
        .step-card { border: 1px solid rgba(0,0,0,0.05) !important; }
        .step-card:hover { 
          transform: translateY(-10px); 
          box-shadow: 0 15px 30px rgba(13, 202, 240, 0.15) !important;
          border-color: rgba(13, 202, 240, 0.3) !important;
        }
        .mt-n5 { margin-top: -80px; }
        .fw-black { font-weight: 900; }
        .hover-grow:hover { transform: scale(1.05); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        
        @media (max-width: 768px) {
          .mt-n5 { margin-top: 0; }
          .display-2 { font-size: 2.5rem; }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default OnlineAdmission;