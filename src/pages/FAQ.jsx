import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("faqs", [{ type: "orderBy", field: "order" }])
      .then(setFaqs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Frequently Asked Questions</h1>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
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
      </div>
    </div>
  );
};

export default FAQ;
