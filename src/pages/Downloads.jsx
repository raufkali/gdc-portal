import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedDownloads = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

const Downloads = () => {
  const [downloads, setDownloads] = useState(() => {
    if (
      cachedDownloads &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedDownloads;
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    return !(
      cachedDownloads &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDownloads = async () => {
      if (
        cachedDownloads &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setDownloads(cachedDownloads);
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDocs(collection(db, "downloads"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (isMounted) {
          cachedDownloads = data;
          cacheTimestamp = Date.now();
          setDownloads(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);
        if (cachedDownloads && isMounted) {
          setDownloads(cachedDownloads);
          setLoading(false);
        } else if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDownloads();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-5 mt-5 text-center">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#A51C30" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!downloads.length) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="display-1 text-muted mb-4">
          <i className="bi bi-download"></i>
        </div>
        <h2
          className="fw-bold"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text)",
          }}
        >
          No Downloads Available
        </h2>
        <p className="text-muted">
          Please check back later for important documents.
        </p>
      </div>
    );
  }

  return (
    <div
      className="py-5 mt-5"
      style={{ backgroundColor: "var(--color-bg-alt)", minHeight: "70vh" }}
    >
      <div className="container">
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
            Resources
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
            <span style={{ color: "#A51C30" }}>Downloads</span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Access important forms, syllabi, and other official documents.
          </p>
        </div>

        <div className="row g-4">
          {downloads.map((file, index) => {
            const isPdf =
              file.fileType === "pdf" ||
              file.fileUrl?.toLowerCase().endsWith(".pdf");
            return (
              <div
                key={file.id}
                className="col-md-6 col-lg-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "var(--card-bg)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.08)";
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "12px",
                          background: isPdf
                            ? "rgba(220, 53, 69, 0.1)"
                            : "rgba(40, 167, 69, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className={
                            isPdf ? "bi bi-file-pdf" : "bi bi-file-image"
                          }
                          style={{
                            fontSize: "1.8rem",
                            color: isPdf ? "#dc3545" : "#28a745",
                          }}
                        ></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5
                          className="fw-bold mb-1"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "1.1rem",
                            color: "var(--color-text)",
                          }}
                        >
                          {file.title}
                        </h5>
                        {file.category && (
                          <span
                            className="badge"
                            style={{
                              background: "rgba(165, 28, 48, 0.08)",
                              color: "#A51C30",
                              fontSize: "0.65rem",
                              padding: "0.25rem 0.7rem",
                              borderRadius: "50px",
                              fontWeight: "500",
                            }}
                          >
                            {file.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {file.description && (
                      <p
                        className="card-text small mt-2"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {file.description}
                      </p>
                    )}
                    {file.date && (
                      <p className="small text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(file.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
                    {file.fileUrl && (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn w-100"
                        style={{
                          background:
                            "linear-gradient(145deg, #A51C30, #7A1523)",
                          color: "#fff",
                          borderRadius: "50px",
                          padding: "0.4rem 1rem",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          border: "none",
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 25px rgba(165, 28, 48, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <i
                          className={isPdf ? "bi bi-download" : "bi bi-eye"}
                        ></i>
                        {isPdf ? "Download PDF" : "View Image"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Downloads;
