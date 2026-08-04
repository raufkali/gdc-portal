import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

//  Cache for FAQs
let cachedFaqs = null;
let cacheTimestamp = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const FaqSection = () => {
  const [faqs, setFaqs] = useState(() => {
    if (
      cachedFaqs &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedFaqs;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedFaqs &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedFaqs &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    const fetchFaqs = async () => {
      if (
        cachedFaqs &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setFaqs(cachedFaqs);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("faqs", [
          { type: "orderBy", field: "order" },
        ]);
        cachedFaqs = data;
        cacheTimestamp = Date.now();
        setFaqs(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        if (cachedFaqs) {
          setFaqs(cachedFaqs);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section
        className="py-5"
        style={{ backgroundColor: "var(--color-bg-alt)" }}
      >
        <div className="container">
          <div className="text-center py-5">
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#A51C30" }}
            >
              <span className="visually-hidden">Loading FAQs...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!faqs.length) return null;

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          backgroundColor: "rgba(165, 28, 48, 0.02)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          backgroundColor: "rgba(165, 28, 48, 0.02)",
          pointerEvents: "none",
        }}
      />

      <div className="container position-relative">
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.3rem 1.2rem",
              borderRadius: "50px",
              marginBottom: "0.5rem",
            }}
          >
            Got Questions?
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.25rem",
            }}
          >
            Frequently Asked <span style={{ color: "#A51C30" }}>Questions</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Find answers to the most common questions about GDC Gulabad
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="accordion-item"
                  style={{
                    border: "none",
                    marginBottom: "0.75rem",
                    borderRadius: "12px !important",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded={index === 0 ? "true" : "false"}
                      aria-controls={`collapse${index}`}
                      style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--color-text)",
                        fontWeight: "600",
                        fontSize: "1rem",
                        padding: "1.2rem 1.5rem",
                        border: "none",
                        boxShadow: "none",
                        borderRadius: "12px",
                      }}
                    >
                      <i
                        className="bi bi-question-circle me-2"
                        style={{ color: "#A51C30" }}
                      ></i>
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div
                      className="accordion-body"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--color-text)",
                        padding: "0 1.5rem 1.2rem 1.5rem",
                        fontSize: "0.95rem",
                        lineHeight: "1.8",
                        borderTop: "1px solid var(--color-border)",
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {faqs.length > 3 && (
              <div className="text-center mt-4">
                <Link
                  to="/faq"
                  className="btn"
                  style={{
                    background: "transparent",
                    color: "#A51C30",
                    padding: "0.5rem 2rem",
                    borderRadius: "50px",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    border: "2px solid #A51C30",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#A51C30";
                    e.target.style.color = "#fff";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(165, 28, 48, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#A51C30";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <i className="bi bi-arrow-right me-2"></i> View All FAQs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
