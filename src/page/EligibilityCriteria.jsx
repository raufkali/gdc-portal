// src/page/EligibilityCriteria.jsx
import React, { useEffect } from "react";

const EligibilityCriteria = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const interRequirements = [
    "Passed Matriculation (SSC) from a recognized board.",
    "Minimum of 45% marks in relevant subjects.",
    "Age limit as per Higher Education Department (HED) regulations.",
    "Admissions strictly based on provincial merit policy.",
  ];

  const bsRequirements = [
    "Passed Intermediate (FA/FSc) from a recognized board.",
    "Minimum of 45% marks in the relevant discipline.",
    "Mathematics mandatory for BS Computer Science applicants.",
    "Merit-based selection as per University & HED guidelines.",
  ];

  return (
    <>
      {/* Hero */}
      <section className="eligibility-hero">
        <div className="container-custom">
          <div className="eligibility-hero-content">
            <span className="hero-badge">Admissions 2024-2025</span>
            <h1>
              Eligibility <span className="highlight">Criteria</span>
            </h1>
            <p>Detailed academic requirements for prospective students</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="eligibility-content">
        <div className="container-custom">
          <div className="eligibility-grid">
            {/* Intermediate */}
            <div className="eligibility-card">
              <div className="eligibility-header">
                <div className="eligibility-icon">
                  <i className="bi bi-mortarboard"></i>
                </div>
                <h3>Intermediate</h3>
                <p>FA / F.Sc Programs</p>
              </div>
              <ul>
                {interRequirements.map((item, i) => (
                  <li key={i}>
                    <i className="bi bi-check-circle-fill"></i> {item}
                  </li>
                ))}
              </ul>
              <div className="eligibility-docs">
                <h6>Documents Required</h6>
                <div className="doc-tags">
                  {[
                    "Matric Certificate",
                    "Character Cert.",
                    "Domicile",
                    "4 Photos",
                    "CNIC / Form-B",
                  ].map((doc, i) => (
                    <span key={i}>{doc}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* BS Programs */}
            <div className="eligibility-card">
              <div className="eligibility-header">
                <div className="eligibility-icon">
                  <i className="bi bi-award"></i>
                </div>
                <h3>BS Programs</h3>
                <p>4-Year Degree</p>
              </div>
              <ul>
                {bsRequirements.map((item, i) => (
                  <li key={i}>
                    <i className="bi bi-check-circle-fill"></i> {item}
                  </li>
                ))}
              </ul>
              <div className="eligibility-docs">
                <h6>Documents Required</h6>
                <div className="doc-tags">
                  {[
                    "Inter Certificate",
                    "Character Cert.",
                    "Domicile",
                    "4 Photos",
                    "Original CNIC",
                  ].map((doc, i) => (
                    <span key={i}>{doc}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Advisory */}
          <div className="eligibility-advisory">
            <i className="bi bi-info-circle"></i>
            <div>
              <h5>Admission Policy Advisory</h5>
              <p>
                The final merit list is generated based on the HED weighted
                formula. Meeting the 45% minimum threshold ensures eligibility
                for application, but does not guarantee selection in competitive
                disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .eligibility-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .eligibility-hero-content { max-width: 600px; }
        .eligibility-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; }
        .eligibility-hero-content h1 .highlight { color: #b8860b; }
        .eligibility-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .eligibility-content { padding: 60px 0; background: #f8f9fa; }
        .eligibility-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
        .eligibility-card { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .eligibility-header { text-align: center; margin-bottom: 20px; }
        .eligibility-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(184,134,11,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 1.5rem; color: #b8860b; }
        .eligibility-header h3 { margin: 0; }
        .eligibility-header p { color: #6c757d; font-size: 0.85rem; margin: 0; }
        .eligibility-card ul { list-style: none; padding: 0; margin: 0 0 20px; }
        .eligibility-card ul li { padding: 8px 0; display: flex; align-items: flex-start; gap: 10px; color: #444; font-size: 0.9rem; border-bottom: 1px solid #f8f9fa; }
        .eligibility-card ul li i { color: #b8860b; font-size: 1rem; margin-top: 2px; }
        .eligibility-docs { background: #f8f9fa; border-radius: 8px; padding: 16px 20px; }
        .eligibility-docs h6 { margin: 0 0 8px; font-size: 0.85rem; color: #0a1628; }
        .doc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .doc-tags span { padding: 4px 12px; background: #fff; border-radius: 20px; font-size: 0.75rem; color: #6c757d; border: 1px solid #e9ecef; }
        .eligibility-advisory { background: #fff; border-radius: 12px; padding: 24px 32px; display: flex; gap: 16px; align-items: flex-start; border-left: 4px solid #b8860b; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .eligibility-advisory i { font-size: 1.5rem; color: #b8860b; margin-top: 2px; }
        .eligibility-advisory h5 { margin: 0 0 4px; }
        .eligibility-advisory p { margin: 0; color: #6c757d; font-size: 0.9rem; }
        @media (max-width: 768px) {
          .eligibility-hero { padding: 100px 0 40px; }
          .eligibility-hero-content h1 { font-size: 2.2rem; }
          .eligibility-grid { grid-template-columns: 1fr; }
          .eligibility-advisory { flex-direction: column; }
        }
      `}</style>
    </>
  );
};

export default EligibilityCriteria;
