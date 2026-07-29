import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

// ✅ Cache for announcement detail (by slug/id)
const cachedAnnouncements = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const AnnouncementDetail = () => {
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      // ✅ Check cache for this specific announcement
      const cacheKey = slug;
      if (
        cachedAnnouncements[cacheKey] &&
        cachedAnnouncements[cacheKey].timestamp &&
        Date.now() - cachedAnnouncements[cacheKey].timestamp < CACHE_TTL
      ) {
        console.log(`📦 Announcement "${slug}" from cache`);
        setAnnouncement(cachedAnnouncements[cacheKey].data);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        console.log(`📡 Fetching announcement "${slug}" from server`);
        const data = await fetchCollection("announcements");
        const found = data.find((a) => a.slug === slug || a.id === slug);

        if (found) {
          // ✅ Cache the found announcement
          cachedAnnouncements[cacheKey] = {
            data: found,
            timestamp: Date.now(),
          };
          setAnnouncement(found);
          setFromCache(false);
        } else {
          setAnnouncement(null);
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        // ✅ Try to use stale cache if available
        if (cachedAnnouncements[cacheKey]) {
          setAnnouncement(cachedAnnouncements[cacheKey].data);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  // Improved Share function with multiple fallbacks
  const handleShare = async () => {
    const shareData = {
      title: announcement.title,
      text: `${announcement.title}\n\n${announcement.content?.substring(0, 150)}...`,
      url: window.location.href,
    };

    // 1. Try Native Share API (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
        return;
      }
    }

    // 2. Try Clipboard API (HTTPS or localhost)
    try {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        return;
      }
    } catch (err) {
      console.log("Clipboard API failed, trying fallback...");
    }

    // 3. Final Fallback: Create temporary input element
    try {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.width = "1px";
      textArea.style.height = "1px";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        return;
      }
    } catch (err) {
      console.error("All copy methods failed:", err);
    }

    // If all fails, show error
    setShareError(true);
    setTimeout(() => setShareError(false), 3000);
  };

  const getFileIcon = (url) => {
    if (!url) return "bi-file-earmark";
    if (url.endsWith(".pdf")) return "bi-file-earmark-pdf";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
      return "bi-file-earmark-image";
    return "bi-file-earmark";
  };

  const getFileColor = (url) => {
    if (!url) return "#6c757d";
    if (url.endsWith(".pdf")) return "#dc3545";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return "#28a745";
    return "#6c757d";
  };

  const getFileLabel = (url) => {
    if (!url) return "File";
    const ext = url.split(".").pop()?.toUpperCase() || "FILE";
    return ext;
  };

  if (loading) return <Loader />;

  if (!announcement) {
    return (
      <div
        className="py-5 mt-5"
        style={{
          backgroundColor: "var(--color-bg-alt)",
          minHeight: "100vh",
        }}
      >
        <div className="container text-center py-5">
          <div className="display-4 text-muted mb-4">
            <i className="bi bi-megaphone"></i>
          </div>
          <h3 className="mb-3">Announcement not found</h3>
          <p className="text-muted mb-4">
            The announcement you're looking for doesn't exist.
          </p>
          <Link
            to="/announcements"
            className="btn"
            style={{
              background: "linear-gradient(145deg, #A51C30, #7A1523)",
              color: "#fff",
              borderRadius: "50px",
              padding: "0.5rem 1.8rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "all 0.3s ease",
              fontSize: "0.9rem",
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  const hasImage =
    announcement.imageUrl && !announcement.imageUrl.includes("undefined");
  const hasFile =
    announcement.fileUrl && !announcement.fileUrl.includes("undefined");
  const isImageFile =
    hasFile && announcement.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

  return (
    <div
      className="py-5 mt-5"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Back Button */}
            <Link
              to="/announcements"
              className="btn btn-outline-secondary btn-sm mb-3"
              style={{
                borderRadius: "50px",
                padding: "0.2rem 1rem",
                fontSize: "0.75rem",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
                transition: "all 0.3s ease",
                textDecoration: "none",
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
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </Link>

            {/* Share Success Toast */}
            {shareSuccess && (
              <div
                style={{
                  position: "fixed",
                  top: "80px",
                  right: "20px",
                  zIndex: 9999,
                  background: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  animation: "slideIn 0.3s ease",
                }}
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                Link copied!
              </div>
            )}

            {/* Share Error Toast */}
            {shareError && (
              <div
                style={{
                  position: "fixed",
                  top: "80px",
                  right: "20px",
                  zIndex: 9999,
                  background: "#dc3545",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  boxShadow: "0 8px 25px rgba(220, 53, 69, 0.3)",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                Could not copy. Please copy the URL manually.
              </div>
            )}

            {/* Main Card */}
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "var(--card-bg)",
                height: "auto",
              }}
            >
              {/* Image Header */}
              {hasImage && (
                <div style={{ position: "relative", background: "#1A1A1A" }}>
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {announcement.category && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        color: "#fff",
                        padding: "0.15rem 0.7rem",
                        borderRadius: "50px",
                        fontSize: "0.6rem",
                        fontWeight: "500",
                      }}
                    >
                      {announcement.category}
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(165, 28, 48, 0.9)",
                      color: "#fff",
                      padding: "0.15rem 0.7rem",
                      borderRadius: "50px",
                      fontSize: "0.6rem",
                      fontWeight: "500",
                    }}
                  >
                    <i className="bi bi-calendar3 me-1"></i>
                    {formatDate(announcement.date)}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="card-body p-3 p-md-4">
                {!hasImage && (
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {announcement.category && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(165, 28, 48, 0.08)",
                          color: "#A51C30",
                          padding: "0.15rem 0.6rem",
                          borderRadius: "50px",
                          fontSize: "0.6rem",
                          fontWeight: "500",
                        }}
                      >
                        {announcement.category}
                      </span>
                    )}
                    <span
                      className="badge"
                      style={{
                        background: "rgba(108, 117, 125, 0.08)",
                        color: "#6c757d",
                        padding: "0.15rem 0.6rem",
                        borderRadius: "50px",
                        fontSize: "0.6rem",
                        fontWeight: "500",
                      }}
                    >
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatDate(announcement.date)}
                    </span>
                  </div>
                )}

                <h1
                  className="fw-bold mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                    color: "var(--color-text)",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {announcement.title}
                </h1>

                {announcement.author && (
                  <div
                    className="d-flex align-items-center gap-2 mb-2 pb-2"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #A51C30, #7A1523)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "0.6rem",
                        flexShrink: 0,
                      }}
                    >
                      {announcement.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div
                        className="fw-semibold"
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text)",
                        }}
                      >
                        {announcement.author}
                      </div>
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.55rem" }}
                      >
                        <i className="bi bi-clock me-1"></i>
                        Posted on {formatDate(announcement.date)}
                      </small>
                    </div>
                  </div>
                )}

                <div
                  className="mb-3"
                  style={{
                    fontSize: "clamp(0.85rem, 0.9vw, 0.95rem)",
                    lineHeight: "1.8",
                    color: "var(--color-text)",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {announcement.content}
                </div>

                {hasFile && (
                  <div
                    className="p-2 rounded-3"
                    style={{
                      background: "rgba(165, 28, 48, 0.04)",
                      border: "1px solid rgba(165, 28, 48, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: `${getFileColor(announcement.fileUrl)}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className={`bi ${getFileIcon(announcement.fileUrl)}`}
                          style={{
                            fontSize: "1rem",
                            color: getFileColor(announcement.fileUrl),
                          }}
                        ></i>
                      </div>
                      <div className="flex-grow-1" style={{ minWidth: "70px" }}>
                        <div
                          className="fw-semibold"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--color-text)",
                          }}
                        >
                          {isImageFile ? "Image" : "Document"}
                        </div>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.55rem" }}
                        >
                          {getFileLabel(announcement.fileUrl)} file
                        </small>
                      </div>
                      <div className="d-flex gap-1 flex-wrap">
                        {isImageFile && (
                          <a
                            href={announcement.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm"
                            style={{
                              background: "#A51C30",
                              color: "#fff",
                              borderRadius: "50px",
                              padding: "0.1rem 0.5rem",
                              fontSize: "0.55rem",
                              textDecoration: "none",
                              transition: "all 0.2s ease",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#7A1523";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#A51C30";
                            }}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </a>
                        )}
                        <a
                          href={announcement.fileUrl}
                          download
                          className="btn btn-sm btn-outline-secondary"
                          style={{
                            borderRadius: "50px",
                            padding: "0.1rem 0.5rem",
                            fontSize: "0.55rem",
                            fontWeight: "500",
                            textDecoration: "none",
                            borderColor: "var(--color-border)",
                            color: "var(--color-text)",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
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
                          <i className="bi bi-download me-1"></i>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="card-footer bg-transparent px-3 px-md-4 py-2"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-bg-alt)",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                  <button
                    onClick={handleShare}
                    className="btn btn-sm btn-outline-secondary"
                    style={{
                      borderRadius: "50px",
                      padding: "0.1rem 0.6rem",
                      fontSize: "0.6rem",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
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
                    <i className="bi bi-share me-1"></i>
                    Share
                  </button>
                  <small className="text-muted" style={{ fontSize: "0.55rem" }}>
                    <i className="bi bi-clock me-1"></i>
                    Updated:{" "}
                    {formatDate(announcement.updatedAt || announcement.date)}
                  </small>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-3 text-center">
              <Link
                to="/announcements"
                className="btn btn-outline-secondary btn-sm"
                style={{
                  borderRadius: "50px",
                  padding: "0.2rem 1rem",
                  fontSize: "0.7rem",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
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
                <i className="bi bi-arrow-left me-1"></i>
                All Announcements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
