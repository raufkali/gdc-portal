import React from "react";

const CollegeFaq = () => {
  const faqCategories = [
    {
      icon: "bi-mortarboard-fill",
      title: "Academic Excellence",
      questions: [
        { 
          q: "What are the graduation requirements?", 
          a: "Students must complete 130-140 credit hours with a minimum CGPA of 2.0 and a Final Year Project (FYP) as per HED regulations." 
        },
        { 
          q: "What is the mandatory attendance policy?", 
          a: "A minimum of 75% attendance in each subject is mandatory to be eligible for appearing in the final examinations." 
        },
        { 
          q: "How are internal assessment marks calculated?", 
          a: "20% of the total marks are reserved for internal assessment, including mid-term exams, assignments, and class participation." 
        }
      ]
    },
    {
      icon: "bi-shield-lock-fill",
      title: "Administrative Protocols",
      questions: [
        { 
          q: "Procedure for Degree Verification?", 
          a: "Submit a formal request to the Controller of Examinations with original transcripts and the required fee receipt from the college bank." 
        },
        { 
          q: "How to apply for a College Leaving Certificate (CLC)?", 
          a: "Submit a 'No Dues' certificate signed by the Librarian, Lab In-charge, and the Cashier to the Principal's office." 
        },
        { 
          q: "Can I change my subjects after admission?", 
          a: "Subject changes are allowed within 15 days of admission, subject to the approval of the Admission Committee and vacancy in the desired group." 
        }
      ]
    },
    {
      icon: "bi-wallet2",
      title: "Financial Aid & Grants",
      questions: [
        { 
          q: "How does 'Need-Based' scholarship work?", 
          a: "The ISAC committee evaluates applications based on household income, utility bills, and academic merit to provide fee concessions." 
        },
        { 
          q: "What is the 'Mora' Scholarship?", 
          a: "It is a Zakat-based financial assistance program for deserving Muslim students. Forms are available at the beginning of the academic year." 
        },
        { 
          q: "Are there rewards for position holders?", 
          a: "Yes, students securing top positions in university exams are eligible for merit-based cash prizes and special laptops through government schemes." 
        }
      ]
    }
  ];

  return (
    <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-5">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-5">
          <h6 className="text-info fw-bold text-uppercase mb-2" style={{ letterSpacing: "3px" }}>Help Center</h6>
          <h2 className="display-4 fw-bold text-dark">Institutional <span className="text-info">Guidelines</span></h2>
          <div className="mx-auto bg-info rounded-pill mt-3" style={{ height: '4px', width: '80px' }}></div>
        </div>

        {/* --- FAQ GRID --- */}
        <div className="row g-4 justify-content-center">
          {faqCategories.map((cat, catIdx) => (
            <div key={catIdx} className="col-lg-4 col-md-6">
              {/* --- CATEGORY CARD --- */}
              <div className="p-4 rounded-4 bg-white shadow-sm h-100 faq-card border-top border-info border-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="icon-circle me-3">
                    <i className={`bi ${cat.icon} fs-4 text-white`}></i>
                  </div>
                  <h5 className="fw-bold m-0 text-dark">{cat.title}</h5>
                </div>

                {/* --- ACCORDION --- */}
                <div className="accordion accordion-flush" id={`acc-${catIdx}`}>
                  {cat.questions.map((item, qIdx) => (
                    <div className="accordion-item border-0 mb-2" key={qIdx}>
                      <h2 className="accordion-header">
                        <button 
                          className="accordion-button collapsed px-0 py-3 fw-semibold bg-transparent shadow-none" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#q-${catIdx}-${qIdx}`}
                        >
                          {item.q}
                        </button>
                      </h2>
                      <div id={`q-${catIdx}-${qIdx}`} className="accordion-collapse collapse" data-bs-parent={`#acc-${catIdx}`}>
                        <div className="accordion-body px-0 text-secondary border-0 pt-0 small lh-lg">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .icon-circle {
          width: 50px;
          height: 50px;
          background: #00a2ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .faq-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .faq-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 162, 255, 0.1) !important;
        }

        .faq-card:hover .icon-circle {
          transform: rotate(15deg) scale(1.1);
        }

        .accordion-button:not(.collapsed) {
          color: #00a2ff !important;
        }

        .accordion-button::after {
          width: 1rem;
          height: 1rem;
          background-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default CollegeFaq;