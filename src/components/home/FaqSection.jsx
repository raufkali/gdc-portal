import { useState, useEffect } from "react";
import { fetchCollection } from "../../firebase/db";

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    fetchCollection("faqs", [{ type: "orderBy", field: "order" }]).then(
      setFaqs,
    );
  }, []);

  if (!faqs.length) return null;
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="accordion-item">
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FaqSection;
