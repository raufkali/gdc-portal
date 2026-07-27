import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCollection("announcements", [
      { type: "orderBy", field: "date", direction: "desc" },
    ])
      .then(setAnnouncements)
      .finally(() => setLoading(false));
  }, []);

  // Filter announcements
  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Loader />;

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
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
            Stay Updated
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
            Latest <span style={{ color: "#A51C30" }}>Announcements</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Stay informed about important updates, events, and notices from GDC
            Gulabad
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="row justify-content-center mb-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="col-md-8 col-lg-6">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search" style={{ color: "#A51C30" }}></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search announcements..."
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
        </div>

        {/* Results Count */}
        {filteredAnnouncements.length > 0 && (
          <div
            className="text-center text-muted small mb-3"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <i className="bi bi-info-circle me-1"></i>
            Showing {filteredAnnouncements.length} announcement
            {filteredAnnouncements.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}

        {/* Announcements List */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-5" data-aos="fade-up">
            <div className="display-1 text-muted mb-4">
              <i className="bi bi-megaphone"></i>
            </div>
            <h4 className="text-muted">No announcements found</h4>
            <p className="text-muted small">
              {searchTerm
                ? `No results match "${searchTerm}". Try a different search term.`
                : "No announcements available at the moment. Please check back later."}
            </p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {filteredAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="mb-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className="card border-0 shadow-sm"
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      backgroundColor: "var(--card-bg)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 35px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 5px 15px rgba(0,0,0,0.05)";
                    }}
                  >
                    {/* Image if exists */}
                    {announcement.imageUrl && (
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="card-body p-4 p-lg-5">
                      {/* Category Badge */}
                      {announcement.category && (
                        <span
                          className="badge mb-2"
                          style={{
                            background: "rgba(165, 28, 48, 0.08)",
                            color: "#A51C30",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "50px",
                            fontWeight: "500",
                            fontSize: "0.7rem",
                          }}
                        >
                          {announcement.category}
                        </span>
                      )}

                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "clamp(1.3rem, 1.8vw, 1.8rem)",
                          fontWeight: "700",
                          color: "var(--color-text)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {announcement.title}
                      </h3>

                      <div className="d-flex flex-wrap gap-3 mb-3">
                        <small className="text-muted">
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatDate(announcement.date)}
                        </small>
                        {announcement.author && (
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>
                            {announcement.author}
                          </small>
                        )}
                      </div>

                      <p
                        style={{
                          color: "var(--color-text)",
                          fontSize: "0.95rem",
                          lineHeight: "1.8",
                          marginBottom: "1.2rem",
                        }}
                      >
                        {announcement.content?.substring(0, 250)}
                        {announcement.content?.length > 250 && "..."}
                      </p>

                      <Link
                        to={`/announcements/${announcement.slug || announcement.id}`}
                        className="btn"
                        style={{
                          background:
                            "linear-gradient(145deg, #A51C30, #7A1523)",
                          color: "#fff",
                          borderRadius: "50px",
                          padding: "0.4rem 1.5rem",
                          fontWeight: "500",
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          display: "inline-block",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 20px rgba(165, 28, 48, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe CTA */}
        <div
          className="text-center mt-5 pt-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              background: "var(--color-bg)",
              padding: "2.5rem 1rem",
            }}
          >
            <h5
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              Never Miss an <span style={{ color: "#A51C30" }}>Update</span>
            </h5>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.95rem",
                maxWidth: "500px",
                margin: "0 auto 1.2rem",
              }}
            >
              Subscribe to our notifications to stay informed about all college
              announcements.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link
                to="/contact"
                className="btn"
                style={{
                  background: "linear-gradient(145deg, #A51C30, #7A1523)",
                  color: "#fff",
                  padding: "0.6rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(165, 28, 48, 0.3)",
                  display: "inline-block",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 8px 30px rgba(165, 28, 48, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(165, 28, 48, 0.3)";
                }}
              >
                <i className="bi bi-bell me-2"></i>
                Get Notifications
              </Link>
              <Link
                to="/faq"
                className="btn btn-outline-secondary"
                style={{
                  padding: "0.6rem 2rem",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#A51C30";
                  e.target.style.color = "#A51C30";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.color = "var(--color-text)";
                }}
              >
                <i className="bi bi-question-circle me-2"></i>
                Visit FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
