// src/page/CollegeFaq.jsx
import React from "react";

const CollegeFaq = () => {
  const faqCategories = [
    {
      icon: "bi-mortarboard-fill",
      title: "Academic Excellence",
      questions: [
        {
          q: "What are the graduation requirements?",
          a: "Students must complete 130-140 credit hours with a minimum CGPA of 2.0 and a Final Year Project (FYP) as per HED regulations.",
        },
        {
          q: "What is the mandatory attendance policy?",
          a: "A minimum of 75% attendance in each subject is mandatory to be eligible for appearing in the final examinations.",
        },
        {
          q: "How are internal assessment marks calculated?",
          a: "20% of the total marks are reserved for internal assessment, including mid-term exams, assignments, and class participation.",
        },
      ],
    },
    {
      icon: "bi-shield-lock-fill",
      title: "Administrative Protocols",
      questions: [
        {
          q: "Procedure for Degree Verification?",
          a: "Submit a formal request to the Controller of Examinations with original transcripts and the required fee receipt.",
        },
        {
          q: "How to apply for a College Leaving Certificate (CLC)?",
          a: "Submit a 'No Dues' certificate signed by the Librarian, Lab In-charge, and the Cashier to the Principal's office.",
        },
        {
          q: "Can I change my subjects after admission?",
          a: "Subject changes are allowed within 15 days of admission, subject to the approval of the Admission Committee.",
        },
      ],
    },
    {
      icon: "bi-wallet2",
      title: "Financial Aid & Grants",
      questions: [
        {
          q: "How does 'Need-Based' scholarship work?",
          a: "The ISAC committee evaluates applications based on household income, utility bills, and academic merit to provide fee concessions.",
        },
        {
          q: "What is the 'Mora' Scholarship?",
          a: "It is a Zakat-based financial assistance program for deserving Muslim students. Forms are available at the beginning of the academic year.",
        },
        {
          q: "Are there rewards for position holders?",
          a: "Yes, students securing top positions in university exams are eligible for merit-based cash prizes and special laptops.",
        },
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="faq-hero">
        <div className="container-custom">
          <div className="faq-hero-content">
            <span className="hero-badge">Help Center</span>
            <h1>
              Institutional <span className="highlight">Guidelines</span>
            </h1>
            <p>Find answers to frequently asked questions</p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="faq-content">
        <div className="container-custom">
          <div className="faq-grid">
            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx} className="faq-category">
                <div className="faq-category-header">
                  <div className="faq-category-icon">
                    <i className={`bi ${cat.icon}`}></i>
                  </div>
                  <h4>{cat.title}</h4>
                </div>
                <div className="faq-list">
                  {cat.questions.map((item, qIdx) => (
                    <details key={qIdx} className="faq-item">
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .faq-hero {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
          color: #fff;
        }
        .faq-hero-content { max-width: 600px; }
        .faq-hero-content h1 { font-size: 3rem; color: #fff; margin: 16px 0; }
        .faq-hero-content h1 .highlight { color: #b8860b; }
        .faq-hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); }
        .faq-content { padding: 60px 0; background: #f8f9fa; }
        .faq-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .faq-category { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border-top: 4px solid #b8860b; }
        .faq-category-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .faq-category-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(184,134,11,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #b8860b; }
        .faq-category-header h4 { margin: 0; font-size: 1rem; }
        .faq-list { display: flex; flex-direction: column; gap: 8px; }
        .faq-item { border-bottom: 1px solid #f8f9fa; padding: 8px 0; }
        .faq-item:last-child { border-bottom: none; }
        .faq-item summary { cursor: pointer; font-weight: 600; color: #0a1628; padding: 4px 0; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after { content: "+"; font-size: 1.2rem; color: #b8860b; transition: transform 0.2s; }
        .faq-item[open] summary::after { content: "−"; }
        .faq-item p { margin: 8px 0 0; color: #6c757d; font-size: 0.9rem; line-height: 1.6; padding-right: 8px; }
        @media (max-width: 768px) {
          .faq-hero { padding: 100px 0 40px; }
          .faq-hero-content h1 { font-size: 2.2rem; }
          .faq-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default CollegeFaq;
