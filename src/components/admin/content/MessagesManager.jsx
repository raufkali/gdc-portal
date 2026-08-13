import { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import DeleteModal from "./Shared/DeleteModal";

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), { status: "read" });
      fetchMessages();
    } catch (error) {
      alert("Error updating message: " + error.message);
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), { status: "unread" });
      fetchMessages();
    } catch (error) {
      alert("Error updating message: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "contacts", deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      fetchMessages();
      alert(" Message deleted successfully!");
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchFilter =
      filter === "all" ||
      (filter === "unread" && msg.status !== "read") ||
      (filter === "read" && msg.status === "read");

    const matchSearch =
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter((m) => m.status !== "read").length;

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-envelope me-2" style={{ color: "#A51C30" }}></i>
          Messages
          {unreadCount > 0 && (
            <span
              className="badge ms-2"
              style={{
                background: "#dc3545",
                color: "#fff",
                padding: "0.25rem 0.6rem",
                borderRadius: "50px",
                fontSize: "0.7rem",
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </h4>
        <button
          className="btn rounded-pill px-4"
          onClick={fetchMessages}
          style={{
            background: "#A51C30",
            color: "#fff",
            fontSize: "0.85rem",
            border: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#7A1523";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#A51C30";
          }}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <div className="input-group" style={{ height: "40px" }}>
            <span className="input-group-text bg-transparent border-end-0">
              <i className="bi bi-search" style={{ color: "#A51C30" }}></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "0 50px 50px 0",
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                fontSize: "0.85rem",
                height: "40px",
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              borderRadius: "50px",
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
              fontSize: "0.85rem",
              height: "40px",
            }}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div className="col-md-5 text-md-end">
          <span className="text-muted small">
            <i className="bi bi-envelope me-1"></i>
            {filteredMessages.length} message
            {filteredMessages.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-inbox"></i>
          </div>
          <h5 className="text-muted">No messages found</h5>
          <p className="text-muted small">
            {searchTerm
              ? `No results match "${searchTerm}"`
              : "Messages from the contact form will appear here."}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="col-12">
              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "12px",
                  backgroundColor:
                    msg.status !== "read"
                      ? "rgba(165, 28, 48, 0.02)"
                      : "var(--card-bg)",
                  borderLeft:
                    msg.status !== "read"
                      ? "4px solid #A51C30"
                      : "4px solid transparent",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.04)";
                }}
              >
                <div className="card-body p-3 p-md-4">
                  <div className="row g-2">
                    <div className="col-12 col-md-8">
                      <div className="d-flex align-items-start gap-2 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "rgba(165, 28, 48, 0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                color: "#A51C30",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                              }}
                            >
                              {msg.name?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div>
                            <h6
                              className="fw-bold mb-0"
                              style={{
                                color:
                                  msg.status !== "read"
                                    ? "#A51C30"
                                    : "var(--color-text)",
                                fontSize: "0.95rem",
                              }}
                            >
                              {msg.name || "Anonymous"}
                              {msg.status !== "read" && (
                                <span
                                  className="badge ms-2"
                                  style={{
                                    background: "rgba(220, 53, 69, 0.1)",
                                    color: "#dc3545",
                                    fontSize: "0.55rem",
                                    fontWeight: "500",
                                    padding: "0.15rem 0.6rem",
                                    borderRadius: "50px",
                                  }}
                                >
                                  New
                                </span>
                              )}
                            </h6>
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <i className="bi bi-envelope me-1"></i>
                              {msg.email || "No email"}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 text-md-end">
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(msg.timestamp)}
                      </small>
                    </div>
                  </div>

                  <div className="mt-2">
                    <strong
                      style={{ fontSize: "0.9rem", color: "var(--color-text)" }}
                    >
                      Subject: {msg.subject || "No subject"}
                    </strong>
                    <p
                      className="mb-0 small"
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.85rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginTop: "0.25rem",
                      }}
                    >
                      {msg.message || "No message"}
                    </p>
                  </div>

                  <div
                    className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <button
                      className="btn btn-sm"
                      onClick={() => setSelectedMessage(msg)}
                      style={{
                        background: "rgba(165, 28, 48, 0.08)",
                        color: "#A51C30",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: "none",
                        padding: "0.2rem 1rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#A51C30";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(165, 28, 48, 0.08)";
                        e.target.style.color = "#A51C30";
                      }}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>

                    {msg.status !== "read" ? (
                      <button
                        className="btn btn-sm"
                        onClick={() => handleMarkAsRead(msg.id)}
                        style={{
                          background: "rgba(40, 167, 69, 0.08)",
                          color: "#28a745",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          border: "none",
                          padding: "0.2rem 1rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#28a745";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(40, 167, 69, 0.08)";
                          e.target.style.color = "#28a745";
                        }}
                      >
                        <i className="bi bi-check2-circle me-1"></i> Mark Read
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => handleMarkAsUnread(msg.id)}
                        style={{
                          background: "rgba(255, 193, 7, 0.08)",
                          color: "#d39e00",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          border: "none",
                          padding: "0.2rem 1rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#d39e00";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255, 193, 7, 0.08)";
                          e.target.style.color = "#d39e00";
                        }}
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>{" "}
                        Mark Unread
                      </button>
                    )}

                    <button
                      className="btn btn-sm"
                      onClick={() => confirmDelete(msg.id)}
                      style={{
                        background: "rgba(220, 53, 69, 0.08)",
                        color: "#dc3545",
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: "none",
                        padding: "0.2rem 1rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#dc3545";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(220, 53, 69, 0.08)";
                        e.target.style.color = "#dc3545";
                      }}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div
              className="modal-content shadow-lg border-0"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i
                    className="bi bi-envelope-paper me-2"
                    style={{ color: "#A51C30" }}
                  ></i>
                  Message from {selectedMessage.name || "Anonymous"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMessage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <small className="text-muted">From</small>
                    <p className="fw-semibold">
                      {selectedMessage.name || "Anonymous"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted">Email</small>
                    <p className="fw-semibold">
                      {selectedMessage.email || "No email"}
                    </p>
                  </div>
                  <div className="col-12">
                    <small className="text-muted">Subject</small>
                    <p className="fw-semibold">
                      {selectedMessage.subject || "No subject"}
                    </p>
                  </div>
                  <div className="col-12">
                    <small className="text-muted">Message</small>
                    <div
                      className="p-3 rounded-3"
                      style={{
                        background: "rgba(165, 28, 48, 0.04)",
                        borderRadius: "10px",
                        marginTop: "0.25rem",
                      }}
                    >
                      <p
                        className="mb-0"
                        style={{
                          whiteSpace: "pre-wrap",
                          color: "var(--color-text)",
                        }}
                      >
                        {selectedMessage.message || "No message"}
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <small className="text-muted">Received</small>
                    <p className="mb-0">
                      {formatDate(selectedMessage.timestamp)}
                    </p>
                  </div>
                  <div className="col-12">
                    <small className="text-muted">Status</small>
                    <p>
                      <span
                        className="badge"
                        style={{
                          background:
                            selectedMessage.status !== "read"
                              ? "rgba(220, 53, 69, 0.1)"
                              : "rgba(40, 167, 69, 0.1)",
                          color:
                            selectedMessage.status !== "read"
                              ? "#dc3545"
                              : "#28a745",
                          padding: "0.25rem 0.8rem",
                          borderRadius: "50px",
                          fontWeight: "500",
                        }}
                      >
                        {selectedMessage.status !== "read" ? "Unread" : "Read"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <div className="d-flex gap-2">
                  {selectedMessage.status !== "read" && (
                    <button
                      className="btn rounded-pill px-4"
                      onClick={() => {
                        handleMarkAsRead(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                      style={{
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#218838";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#28a745";
                      }}
                    >
                      <i className="bi bi-check2-circle me-1"></i> Mark as Read
                    </button>
                  )}
                  <button
                    className="btn rounded-pill px-4"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                    }}
                    style={{
                      background: "#A51C30",
                      color: "#fff",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#7A1523";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#A51C30";
                    }}
                  >
                    <i className="bi bi-reply me-1"></i> Reply via Email
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Message"
      />
    </div>
  );
};

export default MessagesManager;
