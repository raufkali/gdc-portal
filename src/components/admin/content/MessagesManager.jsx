import { useState, useEffect, useCallback } from "react";
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
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { logActivity } from "../../../firebase/audit";

const MessagesManager = () => {
  const { showSuccess, showError } = useNotification();
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ============================================================
  // FETCH MESSAGES
  // ============================================================

  const fetchMessages = useCallback(async () => {
    setLoading(true);

    try {
      const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));

      const snap = await getDocs(q);

      const data = snap.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ============================================================
  // MARK AS READ
  // ============================================================

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "read",
      });

      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, status: "read" } : message,
        ),
      );
      showSuccess("Message marked as read");
    } catch (error) {
      showError("Error updating message: " + error.message);
    }
  };

  // ============================================================
  // MARK AS UNREAD
  // ============================================================

  const handleMarkAsUnread = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "unread",
      });

      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, status: "unread" } : message,
        ),
      );
      showSuccess("Message marked as unread");
    } catch (error) {
      showError("Error updating message: " + error.message);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteDoc(doc(db, "contacts", deletingId));
      await logActivity(userProfile, "DELETE", "contacts", deletingId);

      setMessages((prev) =>
        prev.filter((message) => message.id !== deletingId),
      );

      if (selectedMessage?.id === deletingId) {
        setSelectedMessage(null);
      }

      setShowDeleteModal(false);
      setDeletingId(null);

      showSuccess("Message deleted successfully!");
    } catch (error) {
      showError("Error deleting: " + error.message);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

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
    } catch (error) {
      return "Invalid date";
    }
  };

  // ============================================================
  // FILTER MESSAGES
  // ============================================================

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredMessages = messages.filter((msg) => {
    const matchFilter =
      filter === "all" ||
      (filter === "unread" && msg.status !== "read") ||
      (filter === "read" && msg.status === "read");

    const matchSearch =
      !normalizedSearch ||
      msg.name?.toLowerCase().includes(normalizedSearch) ||
      msg.email?.toLowerCase().includes(normalizedSearch) ||
      msg.subject?.toLowerCase().includes(normalizedSearch) ||
      msg.message?.toLowerCase().includes(normalizedSearch);

    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter(
    (message) => message.status !== "read",
  ).length;

  // ============================================================
  // INITIAL
  // ============================================================

  return (
    <div className="messages-manager">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="messages-header">
        <div className="messages-title-wrapper">
          <h4 className="messages-title">
            <span className="messages-title-icon">
              <i className="bi bi-envelope"></i>
            </span>

            <span>Messages</span>

            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} unread</span>
            )}
          </h4>

          <p className="messages-subtitle">
            Manage and respond to messages received through the college contact
            form.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchMessages}
          disabled={loading}
        >
          <i
            className={`bi ${
              loading ? "bi-arrow-repeat refresh-spin" : "bi-arrow-clockwise"
            }`}
          ></i>

          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* ========================================================
          FILTER / SEARCH
      ======================================================== */}

      <div className="message-toolbar">
        {/* SEARCH */}

        <div className="search-wrapper">
          <div className="search-icon">
            <i className="bi bi-search"></i>
          </div>

          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="message-search"
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        {/* FILTER */}

        <div className="filter-wrapper">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="message-filter"
          >
            <option value="all">All Messages</option>

            <option value="unread">Unread ({unreadCount})</option>

            <option value="read">Read</option>
          </select>
        </div>

        {/* COUNT */}

        <div className="message-result-count">
          <i className="bi bi-envelope"></i>

          <span>
            {filteredMessages.length} message
            {filteredMessages.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      {loading ? (
        <div className="messages-loading">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading messages...</span>
          </div>

          <p>Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="messages-empty">
          <div className="empty-icon">
            <i className="bi bi-inbox"></i>
          </div>

          <h5>No messages found</h5>

          <p>
            {searchTerm
              ? `No results match "${searchTerm}"`
              : "Messages from the contact form will appear here."}
          </p>

          {searchTerm && (
            <button
              type="button"
              className="clear-filter-button"
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="messages-list">
          {filteredMessages.map((msg) => {
            const isUnread = msg.status !== "read";

            const initial = msg.name?.trim()?.charAt(0)?.toUpperCase() || "?";

            return (
              <div
                key={msg.id}
                className={`message-card ${
                  isUnread ? "message-card-unread" : ""
                }`}
              >
                <div className="message-card-body">
                  {/* ==================================================
                      TOP
                  ================================================== */}

                  <div className="message-top">
                    <div className="sender-info">
                      <div className="sender-avatar">{initial}</div>

                      <div className="sender-details">
                        <div className="sender-name-row">
                          <h6 className="sender-name">
                            {msg.name || "Anonymous"}
                          </h6>

                          {isUnread && <span className="new-badge">New</span>}
                        </div>

                        <a
                          href={msg.email ? `mailto:${msg.email}` : undefined}
                          className="sender-email"
                          onClick={(e) => {
                            if (!msg.email) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <i className="bi bi-envelope"></i>

                          <span>{msg.email || "No email"}</span>
                        </a>
                      </div>
                    </div>

                    {/* DATE */}

                    <div className="message-date">
                      <i className="bi bi-clock"></i>

                      <span>{formatDate(msg.timestamp)}</span>
                    </div>
                  </div>

                  {/* ==================================================
                      MESSAGE CONTENT
                  ================================================== */}

                  <div className="message-preview">
                    <h6 className="message-subject">
                      {msg.subject || "No subject"}
                    </h6>

                    <p className="message-text">
                      {msg.message || "No message"}
                    </p>
                  </div>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <div className="message-actions">
                    {/* VIEW */}

                    <button
                      type="button"
                      className="message-action message-action-view"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <i className="bi bi-eye"></i>
                      <span>View</span>
                    </button>

                    {/* READ / UNREAD */}

                    {isUnread ? (
                      <button
                        type="button"
                        className="message-action message-action-read"
                        onClick={() => handleMarkAsRead(msg.id)}
                      >
                        <i className="bi bi-check2-circle"></i>
                        <span>Mark Read</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="message-action message-action-unread"
                        onClick={() => handleMarkAsUnread(msg.id)}
                      >
                        <i className="bi bi-arrow-counterclockwise"></i>
                        <span>Mark Unread</span>
                      </button>
                    )}

                    {/* DELETE */}

                    <button
                      type="button"
                      className="message-action message-action-delete"
                      onClick={() => confirmDelete(msg.id)}
                    >
                      <i className="bi bi-trash"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================================
          VIEW MESSAGE MODAL
      ========================================================== */}

      {selectedMessage && (
        <div
          className="message-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div
            className="message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
          >
            {/* ======================================================
                MODAL HEADER
            ====================================================== */}

            <div className="message-modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-title-icon">
                  <i className="bi bi-envelope-paper"></i>
                </div>

                <div>
                  <h5 id="message-modal-title">Message Details</h5>

                  <span>From {selectedMessage.name || "Anonymous"}</span>
                </div>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* ======================================================
                MODAL BODY
            ====================================================== */}

            <div className="message-modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-label">From</span>

                  <strong>{selectedMessage.name || "Anonymous"}</strong>
                </div>

                <div className="modal-info-item">
                  <span className="modal-label">Email</span>

                  {selectedMessage.email ? (
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="modal-email"
                    >
                      {selectedMessage.email}
                    </a>
                  ) : (
                    <strong>No email</strong>
                  )}
                </div>

                <div className="modal-info-item modal-info-full">
                  <span className="modal-label">Subject</span>

                  <strong>{selectedMessage.subject || "No subject"}</strong>
                </div>
              </div>

              {/* MESSAGE */}

              <div className="modal-message-section">
                <span className="modal-label">Message</span>

                <div className="modal-message-box">
                  {selectedMessage.message || "No message"}
                </div>
              </div>

              {/* META */}

              <div className="modal-meta">
                <div>
                  <span className="modal-label">Received</span>

                  <span>{formatDate(selectedMessage.timestamp)}</span>
                </div>

                <div>
                  <span className="modal-label">Status</span>

                  <span
                    className={`status-badge ${
                      selectedMessage.status !== "read"
                        ? "status-unread"
                        : "status-read"
                    }`}
                  >
                    <i
                      className={`bi ${
                        selectedMessage.status !== "read"
                          ? "bi-envelope"
                          : "bi-check-circle"
                      }`}
                    ></i>

                    {selectedMessage.status !== "read" ? "Unread" : "Read"}
                  </span>
                </div>
              </div>
            </div>

            {/* ======================================================
                MODAL FOOTER
            ====================================================== */}

            <div className="message-modal-footer">
              <div className="modal-actions">
                {selectedMessage.status !== "read" && (
                  <button
                    type="button"
                    className="modal-button modal-button-read"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);

                      setSelectedMessage(null);
                    }}
                  >
                    <i className="bi bi-check2-circle"></i>
                    <span>Mark as Read</span>
                  </button>
                )}

                {selectedMessage.email && (
                  <button
                    type="button"
                    className="modal-button modal-button-reply"
                    onClick={() => {
                      const subject = encodeURIComponent(
                        `Re: ${selectedMessage.subject || "Your message"}`,
                      );

                      window.location.href = `mailto:${selectedMessage.email}?subject=${subject}`;
                    }}
                  >
                    <i className="bi bi-reply"></i>
                    <span>Reply via Email</span>
                  </button>
                )}

                <button
                  type="button"
                  className="modal-button modal-button-close"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          DELETE MODAL
      ========================================================== */}

      <DeleteModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
        onDelete={handleDelete}
        title="Message"
      />

      {/* ==========================================================
          STYLES
      ========================================================== */}

      <style>{`

        /* ========================================================
           ROOT
        ======================================================== */

        .messages-manager {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          color: var(--color-text);
        }

        /* ========================================================
           HEADER
        ======================================================== */

        .messages-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .messages-title-wrapper {
          min-width: 0;
        }

        .messages-title {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;

          margin: 0;

          color: var(--color-text);

          font-size: 1.35rem;
          font-weight: 700;
        }

        .messages-title-icon {
          width: 36px;
          height: 36px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 36px;

          border-radius: 10px;

          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;

          font-size: 1rem;
        }

        .unread-count {
          display: inline-flex;
          align-items: center;

          padding:
            4px
            10px;

          border-radius: 50px;

          background:
            rgba(220, 53, 69, 0.1);

          color: #dc3545;

          font-size: 0.65rem;
          font-weight: 600;

          white-space: nowrap;
        }

        .messages-subtitle {
          margin:
            6px
            0
            0
            45px;

          color:
            var(--color-text-muted);

          font-size: 0.78rem;
        }

        .refresh-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          flex-shrink: 0;

          min-height: 40px;

          padding:
            0.55rem
            1.1rem;

          border: none;
          border-radius: 50px;

          background: #A51C30;
          color: #fff;

          font-size: 0.8rem;
          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.25s ease,
            transform 0.2s ease,
            box-shadow 0.25s ease;
        }

        .refresh-button:hover:not(:disabled) {
          background: #7A1523;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px
            rgba(165, 28, 48, 0.2);
        }

        .refresh-button:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .refresh-spin {
          animation:
            message-refresh-spin
            1s linear infinite;
        }

        @keyframes message-refresh-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ========================================================
           TOOLBAR
        ======================================================== */

        .message-toolbar {
          display: grid;

          grid-template-columns:
            minmax(220px, 1fr)
            minmax(160px, 240px)
            auto;

          gap: 10px;

          align-items: center;

          margin-bottom: 18px;
        }

        .search-wrapper {
          position: relative;

          min-width: 0;

          height: 40px;
        }

        .search-icon {
          position: absolute;

          left: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #A51C30;

          pointer-events: none;

          z-index: 2;
        }

        .message-search {
          width: 100%;
          height: 40px;

          padding:
            0
            40px
            0
            40px;

          border:
            1px solid
            var(--color-border);

          border-radius: 50px;

          outline: none;

          background:
            var(--color-bg);

          color:
            var(--color-text);

          font-size: 0.82rem;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .message-search::placeholder {
          color:
            var(--color-text-muted);
        }

        .message-search:focus {
          border-color: #A51C30;

          box-shadow:
            0 0 0 3px
            rgba(165, 28, 48, 0.08);
        }

        .clear-search {
          position: absolute;

          right: 7px;
          top: 50%;

          transform:
            translateY(-50%);

          width: 28px;
          height: 28px;

          border: none;
          border-radius: 50%;

          background: #f1f1f1;

          color: #666;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }

        .filter-wrapper {
          min-width: 0;
        }

        .message-filter {
          width: 100%;
          height: 40px;

          padding:
            0
            38px
            0
            15px;

          border:
            1px solid
            var(--color-border);

          border-radius: 50px;

          outline: none;

          background:
            var(--color-bg);

          color:
            var(--color-text);

          font-size: 0.82rem;

          cursor: pointer;
        }

        .message-filter:focus {
          border-color: #A51C30;

          box-shadow:
            0 0 0 3px
            rgba(165, 28, 48, 0.08);
        }

        .message-result-count {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 6px;

          color:
            var(--color-text-muted);

          font-size: 0.72rem;

          white-space: nowrap;
        }

        .message-result-count i {
          color: #A51C30;
        }

        /* ========================================================
           LOADING
        ======================================================== */

        .messages-loading {
          min-height: 260px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          color:
            var(--color-text-muted);

          gap: 12px;
        }

        .messages-loading p {
          margin: 0;
          font-size: 0.8rem;
        }

        /* ========================================================
           EMPTY
        ======================================================== */

        .messages-empty {
          padding: 70px 20px;

          text-align: center;

          border:
            1px dashed
            var(--color-border);

          border-radius: 16px;

          background:
            rgba(255,255,255,0.6);
        }

        .empty-icon {
          width: 64px;
          height: 64px;

          margin: 0 auto 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(165, 28, 48, 0.06);

          color: #A51C30;

          font-size: 1.6rem;
        }

        .messages-empty h5 {
          margin-bottom: 6px;

          font-size: 1rem;
        }

        .messages-empty p {
          margin-bottom: 15px;

          color:
            var(--color-text-muted);

          font-size: 0.78rem;
        }

        .clear-filter-button {
          border: none;
          border-radius: 50px;

          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;

          padding:
            7px
            16px;

          font-size: 0.75rem;
          font-weight: 600;

          cursor: pointer;
        }

        /* ========================================================
           MESSAGE LIST
        ======================================================== */

        .messages-list {
          display: flex;
          flex-direction: column;

          gap: 12px;

          width: 100%;
          max-width: 100%;
        }

        /* ========================================================
           MESSAGE CARD
        ======================================================== */

        .message-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;

          overflow: hidden;

          border:
            1px solid
            var(--color-border);

          border-left:
            4px solid
            transparent;

          border-radius: 12px;

          background:
            var(--card-bg);

          box-shadow:
            0 2px 12px
            rgba(0, 0, 0, 0.04);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .message-card:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 12px 30px
            rgba(0, 0, 0, 0.08);
        }

        .message-card-unread {
          border-left-color:
            #A51C30;

          background:
            rgba(165, 28, 48, 0.015);
        }

        .message-card-body {
          padding:
            16px;
        }

        /* ========================================================
           MESSAGE TOP
        ======================================================== */

        .message-top {
          display: flex;

          align-items: flex-start;
          justify-content: space-between;

          gap: 15px;

          min-width: 0;
        }

        .sender-info {
          display: flex;

          align-items: center;

          gap: 10px;

          min-width: 0;
          flex: 1;
        }

        .sender-avatar {
          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;

          font-size: 0.9rem;
          font-weight: 700;
        }

        .sender-details {
          min-width: 0;
          max-width: 100%;
        }

        .sender-name-row {
          display: flex;
          align-items: center;

          flex-wrap: wrap;

          gap: 7px;

          min-width: 0;
        }

        .sender-name {
          min-width: 0;
          max-width: 100%;

          margin: 0;

          color:
            var(--color-text);

          font-size: 0.9rem;
          font-weight: 700;

          overflow-wrap: anywhere;
        }

        .message-card-unread
        .sender-name {
          color: #A51C30;
        }

        .new-badge {
          display: inline-flex;

          align-items: center;

          padding:
            2px
            8px;

          border-radius: 50px;

          background:
            rgba(220, 53, 69, 0.1);

          color: #dc3545;

          font-size: 0.55rem;
          font-weight: 600;

          white-space: nowrap;
        }

        .sender-email {
          display: flex;

          align-items: center;

          gap: 5px;

          max-width: 100%;

          margin-top: 2px;

          color:
            var(--color-text-muted);

          text-decoration: none;

          font-size: 0.7rem;
        }

        .sender-email:hover {
          color: #A51C30;
        }

        .sender-email span {
          min-width: 0;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .message-date {
          display: flex;
          align-items: center;

          gap: 5px;

          flex-shrink: 0;

          color:
            var(--color-text-muted);

          font-size: 0.65rem;

          text-align: right;
        }

        /* ========================================================
           PREVIEW
        ======================================================== */

        .message-preview {
          margin-top: 12px;

          min-width: 0;
        }

        .message-subject {
          margin: 0 0 4px;

          color:
            var(--color-text);

          font-size: 0.85rem;
          font-weight: 700;

          overflow-wrap: anywhere;
        }

        .message-text {
          margin: 0;

          color:
            var(--color-text-muted);

          font-size: 0.78rem;
          line-height: 1.5;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;

          overflow-wrap: anywhere;
        }

        /* ========================================================
           ACTIONS
        ======================================================== */

        .message-actions {
          display: flex;
          flex-wrap: wrap;

          gap: 7px;

          margin-top: 14px;
          padding-top: 12px;

          border-top:
            1px solid
            var(--color-border);
        }

        .message-action {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 5px;

          min-height: 30px;

          padding:
            5px
            12px;

          border: none;
          border-radius: 50px;

          font-size: 0.7rem;
          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .message-action-view {
          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;
        }

        .message-action-view:hover {
          background: #A51C30;
          color: white;
        }

        .message-action-read {
          background:
            rgba(40, 167, 69, 0.08);

          color: #28a745;
        }

        .message-action-read:hover {
          background: #28a745;
          color: white;
        }

        .message-action-unread {
          background:
            rgba(255, 193, 7, 0.1);

          color: #b48600;
        }

        .message-action-unread:hover {
          background: #d39e00;
          color: white;
        }

        .message-action-delete {
          background:
            rgba(220, 53, 69, 0.08);

          color: #dc3545;
        }

        .message-action-delete:hover {
          background: #dc3545;
          color: white;
        }

        /* ========================================================
           MODAL BACKDROP
        ======================================================== */

        .message-modal-backdrop {
          position: fixed;

          inset: 0;

          z-index: 2000;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          background:
            rgba(0, 0, 0, 0.6);

          backdrop-filter:
            blur(5px);

          -webkit-backdrop-filter:
            blur(5px);

          overflow-y: auto;
        }

        /* ========================================================
           MODAL
        ======================================================== */

        .message-modal {
          width: 100%;
          max-width: 720px;

          max-height:
            calc(100vh - 40px);

          display: flex;
          flex-direction: column;

          overflow: hidden;

          border-radius: 18px;

          background:
            var(--color-bg);

          box-shadow:
            0 30px 80px
            rgba(0, 0, 0, 0.25);

          animation:
            message-modal-in
            0.25s ease;
        }

        @keyframes message-modal-in {
          from {
            opacity: 0;
            transform:
              translateY(10px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .message-modal-header {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding:
            18px
            20px;

          border-bottom:
            1px solid
            var(--color-border);
        }

        .modal-title-wrapper {
          display: flex;

          align-items: center;

          gap: 12px;

          min-width: 0;
        }

        .modal-title-icon {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(165, 28, 48, 0.08);

          color: #A51C30;

          font-size: 1.1rem;
        }

        .modal-title-wrapper h5 {
          margin: 0;

          font-size: 1rem;
          font-weight: 700;

          overflow-wrap: anywhere;
        }

        .modal-title-wrapper span {
          display: block;

          margin-top: 2px;

          color:
            var(--color-text-muted);

          font-size: 0.7rem;

          overflow-wrap: anywhere;
        }

        .modal-close-button {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          border: none;
          border-radius: 50%;

          background: #f3f3f3;

          color: #555;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .modal-close-button:hover {
          background: #A51C30;
          color: white;
        }

        /* ========================================================
           MODAL BODY
        ======================================================== */

        .message-modal-body {
          padding: 20px;

          overflow-y: auto;

          min-height: 0;
        }

        .modal-info-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 15px;

          margin-bottom: 20px;
        }

        .modal-info-item {
          min-width: 0;

          padding:
            12px
            14px;

          border-radius: 10px;

          background:
            var(--color-bg-alt);
        }

        .modal-info-full {
          grid-column:
            1 / -1;
        }

        .modal-label {
          display: block;

          margin-bottom: 5px;

          color:
            var(--color-text-muted);

          font-size: 0.65rem;
          font-weight: 600;

          text-transform: uppercase;

          letter-spacing: 0.5px;
        }

        .modal-info-item strong {
          display: block;

          color:
            var(--color-text);

          font-size: 0.8rem;

          overflow-wrap: anywhere;
        }

        .modal-email {
          color: #A51C30;

          font-size: 0.8rem;

          text-decoration: none;

          overflow-wrap: anywhere;
        }

        .modal-email:hover {
          text-decoration: underline;
        }

        .modal-message-section {
          margin-bottom: 20px;
        }

        .modal-message-box {
          min-height: 100px;

          padding: 15px;

          border:
            1px solid
            rgba(165, 28, 48, 0.1);

          border-radius: 12px;

          background:
            rgba(165, 28, 48, 0.035);

          color:
            var(--color-text);

          font-size: 0.82rem;

          line-height: 1.65;

          white-space: pre-wrap;

          overflow-wrap: anywhere;
        }

        .modal-meta {
          display: flex;

          flex-wrap: wrap;

          justify-content: space-between;

          gap: 15px;

          padding-top: 15px;

          border-top:
            1px solid
            var(--color-border);
        }

        .modal-meta > div {
          min-width: 0;
        }

        .modal-meta > div > span:last-child {
          display: block;

          color:
            var(--color-text);

          font-size: 0.75rem;

          overflow-wrap: anywhere;
        }

        .status-badge {
          display: inline-flex !important;

          align-items: center;

          gap: 5px;

          padding:
            4px
            10px;

          border-radius: 50px;
        }

        .status-unread {
          background:
            rgba(220, 53, 69, 0.1);

          color: #dc3545 !important;
        }

        .status-read {
          background:
            rgba(40, 167, 69, 0.1);

          color: #28a745 !important;
        }

        /* ========================================================
           MODAL FOOTER
        ======================================================== */

        .message-modal-footer {
          padding:
            15px
            20px;

          border-top:
            1px solid
            var(--color-border);
        }

        .modal-actions {
          display: flex;

          flex-wrap: wrap;

          justify-content: flex-end;

          gap: 8px;
        }

        .modal-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 6px;

          min-height: 36px;

          padding:
            7px
            15px;

          border: none;
          border-radius: 50px;

          font-size: 0.75rem;
          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .modal-button-read {
          background: #28a745;
          color: white;
        }

        .modal-button-read:hover {
          background: #218838;
        }

        .modal-button-reply {
          background: #A51C30;
          color: white;
        }

        .modal-button-reply:hover {
          background: #7A1523;
        }

        .modal-button-close {
          border:
            1px solid
            var(--color-border);

          background:
            var(--color-bg);

          color:
            var(--color-text);
        }

        .modal-button-close:hover {
          background:
            var(--color-bg-alt);

          border-color:
            #aaa;
        }

        /* ========================================================
           TABLET
        ======================================================== */

        @media (max-width: 991.98px) {

          .message-toolbar {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(150px, 220px);
          }

          .message-result-count {
            grid-column:
              1 / -1;

            justify-content: flex-start;
          }
        }

        /* ========================================================
           MOBILE
        ======================================================== */

        @media (max-width: 767.98px) {

          .messages-header {
            flex-direction: column;

            align-items: stretch;

            gap: 12px;
          }

          .messages-title {
            font-size: 1.15rem;
          }

          .messages-title-icon {
            width: 32px;
            height: 32px;

            flex-basis: 32px;
          }

          .messages-subtitle {
            margin-left: 41px;

            font-size: 0.72rem;

            line-height: 1.5;
          }

          .refresh-button {
            width: 100%;
          }

          /* ---------------------------------------------
             Toolbar
          --------------------------------------------- */

          .message-toolbar {
            display: flex;
            flex-direction: column;

            align-items: stretch;

            width: 100%;

            gap: 8px;
          }

          .search-wrapper,
          .filter-wrapper {
            width: 100%;
          }

          .message-result-count {
            justify-content: flex-start;

            padding-left: 5px;

            margin-top: 2px;
          }

          /* ---------------------------------------------
             Cards
          --------------------------------------------- */

          .message-card-body {
            padding: 14px;
          }

          .message-top {
            flex-direction: column;

            align-items: stretch;

            gap: 10px;
          }

          .message-date {
            justify-content: flex-start;

            padding-left: 48px;

            text-align: left;
          }

          .sender-email span {
            max-width: calc(100vw - 100px);
          }

          .message-actions {
            gap: 6px;
          }

          .message-action {
            flex: 0 0 auto;

            padding:
              6px
              10px;

            font-size: 0.68rem;
          }

          /* ---------------------------------------------
             Modal
          --------------------------------------------- */

          .message-modal-backdrop {
            align-items: flex-end;

            padding: 0;
          }

          .message-modal {
            max-height:
              92vh;

            border-radius:
              18px
              18px
              0
              0;
          }

          .message-modal-header {
            padding:
              15px;
          }

          .message-modal-body {
            padding:
              15px;
          }

          .modal-info-grid {
            grid-template-columns:
              1fr;

            gap: 8px;
          }

          .modal-info-full {
            grid-column:
              auto;
          }

          .message-modal-footer {
            padding:
              12px
              15px;

            padding-bottom:
              calc(
                12px +
                env(safe-area-inset-bottom)
              );
          }

          .modal-actions {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 7px;
          }

          .modal-button {
            width: 100%;

            min-height: 38px;

            padding:
              7px
              10px;
          }

          .modal-button-close {
            grid-column:
              1 / -1;
          }
        }

        /* ========================================================
           SMALL PHONES
        ======================================================== */

        @media (max-width: 390px) {

          .messages-title {
            font-size: 1.05rem;
          }

          .messages-subtitle {
            margin-left: 0;
            margin-top: 7px;
          }

          .message-card-body {
            padding: 12px;
          }

          .sender-avatar {
            width: 34px;
            height: 34px;

            flex-basis: 34px;

            font-size: 0.8rem;
          }

          .sender-name {
            font-size: 0.82rem;
          }

          .sender-email {
            font-size: 0.65rem;
          }

          .message-date {
            padding-left: 44px;

            font-size: 0.6rem;
          }

          .message-action {
            flex: 1 1 auto;

            min-width: 0;

            padding:
              6px
              8px;
          }

          .message-action span {
            white-space: nowrap;
          }

          .message-modal-header {
            padding:
              13px;
          }

          .message-modal-body {
            padding:
              13px;
          }

          .modal-title-icon {
            width: 36px;
            height: 36px;

            flex-basis: 36px;

            font-size: 0.9rem;
          }

          .modal-title-wrapper h5 {
            font-size: 0.9rem;
          }

          .modal-title-wrapper span {
            font-size: 0.62rem;
          }

          .modal-message-box {
            font-size: 0.78rem;
          }
        }

        /* ========================================================
           ACCESSIBILITY
        ======================================================== */

        @media (prefers-reduced-motion: reduce) {

          .message-card,
          .refresh-button,
          .message-action,
          .modal-button {
            transition: none !important;
          }

          .refresh-spin {
            animation: none !important;
          }
        }

      `}</style>
    </div>
  );
};

export default MessagesManager;
