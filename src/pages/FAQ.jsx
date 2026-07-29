import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchCollection("faqs", [{ type: "orderBy", field: "order" }])
      .then(setFaqs)
      .finally(() => setLoading(false));
  }, []);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(faqs.map((f) => f.category).filter(Boolean)),
  ];

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchSearch =
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <Loader />;

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
        paddingTop: "5rem",
      }}
    >
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#A51C30",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "inline-block",
              background: "rgba(165, 28, 48, 0.08)",
              padding: "0.4rem 1.5rem",
              borderRadius: "50px",
              marginBottom: "0.75rem",
            }}
          >
            Help Center
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: "700",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            Frequently Asked <span style={{ color: "#A51C30" }}>Questions</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Find answers to the most common questions about GDC Gulabad
          </p>
        </div>

        {/* Search & Filter */}
        <div className="row g-3 mb-5" data-aos="fade-up" data-aos-delay="100">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search" style={{ color: "#A51C30" }}></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: "0 50px 50px 0",
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text)",
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm rounded-pill px-3 ${
                    activeCategory === cat
                      ? "text-white"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor:
                      activeCategory === cat ? "#A51C30" : "transparent",
                    borderColor:
                      activeCategory === cat
                        ? "#A51C30"
                        : "var(--color-border)",
                    color:
                      activeCategory === cat ? "#fff" : "var(--color-text)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat) {
                      e.target.style.borderColor = "#A51C30";
                      e.target.style.color = "#A51C30";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat) {
                      e.target.style.borderColor = "var(--color-border)";
                      e.target.style.color = "var(--color-text)";
                    }
                  }}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredFaqs.length > 0 && (
          <div
            className="text-muted small mb-3"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <i className="bi bi-info-circle me-1"></i>
            Showing {filteredFaqs.length} question
            {filteredFaqs.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
            {activeCategory !== "All" && ` in ${activeCategory}`}
          </div>
        )}

        {/* FAQs Accordion */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-5" data-aos="fade-up">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-question-circle"></i>
            </div>
            <h4 className="text-muted">No questions found</h4>
            <p className="text-muted small">
              {searchTerm
                ? `No results match "${searchTerm}". Try a different search term.`
                : "No FAQs available in this category."}
            </p>
          </div>
        ) : (
          <div
            className="row justify-content-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="col-lg-10">
              <div className="accordion" id="faqAccordion">
                {filteredFaqs.map((faq, index) => (
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
                        {faq.category && (
                          <span
                            className="badge ms-2"
                            style={{
                              background: "rgba(165, 28, 48, 0.08)",
                              color: "#A51C30",
                              fontSize: "0.6rem",
                              fontWeight: "500",
                              padding: "0.2rem 0.6rem",
                            }}
                          >
                            {faq.category}
                          </span>
                        )}
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
            </div>
          </div>
        )}

        {/* Still Have Questions? */}
        <div
          className="text-center mt-5 pt-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #A51C30, #7A1523)",
              padding: "2.5rem 1rem",
              color: "#fff",
            }}
          >
            <h4
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 2vw, 2rem)",
                fontWeight: "700",
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              Still Have <span style={{ color: "#ffc107" }}>Questions</span>?
            </h4>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "1rem",
                maxWidth: "500px",
                margin: "0 auto 1.2rem",
              }}
            >
              Can't find what you're looking for? Reach out to us directly.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link
                to="/contact"
                className="btn"
                style={{
                  background: "#fff",
                  color: "#A51C30",
                  padding: "0.6rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <i className="bi bi-envelope me-2"></i>
                Contact Us
              </Link>
              <Link
                to="/eligibility-criteria"
                className="btn"
                style={{
                  background: "transparent",
                  color: "#fff",
                  padding: "0.6rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  border: "2px solid rgba(255,255,255,0.3)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.borderColor = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                <i className="bi bi-info-circle me-2"></i>
                Eligibility Criteria
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
