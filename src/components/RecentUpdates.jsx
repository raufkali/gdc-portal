import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db"; // adjust path as needed
import { formatDate } from "../utils/helpers"; // adjust path
import Loader from "../components/common/Loader"; // if you want a loader inside popup

// ── Cache ──
let cachedAnnouncements = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const RecentUpdatePopup = () => {
  const [announcements, setAnnouncements] = useState(() => {
    if (
      cachedAnnouncements &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedAnnouncements;
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    return !(
      cachedAnnouncements &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });
  const [visible, setVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isHomePage = window.location.pathname === "/";

  // ── Fetch announcements (only if not cached) ──
  useEffect(() => {
    if (!isHomePage) return;

    const fetchData = async () => {
      // Use cache if valid
      if (
        cachedAnnouncements &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setAnnouncements(cachedAnnouncements);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("announcements", [
          { type: "orderBy", field: "date", direction: "desc" },
        ]);
        cachedAnnouncements = data;
        cacheTimestamp = Date.now();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        if (cachedAnnouncements) {
          setAnnouncements(cachedAnnouncements);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isHomePage]);

  // ── Show popup after a short delay ──
  useEffect(() => {
    if (!isHomePage) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      const alreadyShown = localStorage.getItem("gdc_recent_update_popup_seen");
      if (!alreadyShown && !loading) {
        setVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isHomePage, loading]);

  // ── Handlers ──
  const closePopup = () => {
    if (dontShowAgain) {
      localStorage.setItem("gdc_recent_update_popup_seen", "true");
    }
    setVisible(false);
  };

  const handleViewAll = () => {
    localStorage.setItem("gdc_recent_update_popup_seen", "true");
    setVisible(false);
  };

  // ── Take only the latest 3 announcements ──
  const recent = announcements.slice(0, 3);

  // ── Helper: check if announcement is "new" (within 48h) ──
  const isNew = (dateString) => {
    if (!dateString) return false;
    const postDate = new Date(dateString);
    const now = new Date();
    const diff = (now - postDate) / (1000 * 60 * 60 * 24); // days
    return diff <= 2;
  };

  if (!visible || !isHomePage || loading) return null;

  // ── Render ──
  return (
    <>
      {/* Overlay */}
      <div className="uni-overlay" />

      {/* Popup */}
      <div
        className="uni-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <div className="uni-popup-inner">
          {/* Close button */}
          <button
            type="button"
            className="uni-close"
            onClick={closePopup}
            aria-label="Close notifications"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          {/* Header */}
          <div className="uni-header">
            <div className="uni-badge">
              <span className="uni-badge-dot"></span>
              Recent Updates
            </div>

            <div className="uni-bell-wrapper">
              <div className="uni-bell-ring"></div>
              <div className="uni-bell-icon">
                <i className="bi bi-bell-fill"></i>
              </div>
            </div>

            <h3 id="popup-title">
              <span>GDC Gulabad</span> Notifications
            </h3>
            <p className="uni-subtitle">
              Latest announcements from the college
            </p>
          </div>

          {/* Notification list */}
          <div className="uni-notification-list">
            {recent.length === 0 ? (
              <div className="uni-empty-state">
                <i className="bi bi-inbox"></i>
                <p>No recent announcements</p>
              </div>
            ) : (
              recent.map((item) => (
                <div key={item.id} className="uni-notification-item">
                  <div className="uni-notification-icon">
                    {isNew(item.date) ? (
                      <i
                        className="bi bi-star-fill"
                        style={{ color: "#F5B81B" }}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-bell"
                        style={{ color: "#9CA3AF" }}
                      ></i>
                    )}
                  </div>
                  <div className="uni-notification-content">
                    <div className="uni-notification-title">
                      <span>{item.title}</span>
                      {isNew(item.date) && (
                        <span className="uni-new-badge">New</span>
                      )}
                    </div>
                    <p className="uni-notification-desc">
                      {item.content?.substring(0, 100)}
                      {item.content?.length > 100 ? "..." : ""}
                    </p>
                    <span className="uni-notification-date">
                      <i className="bi bi-clock"></i> {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="uni-footer">
            <Link
              to="/announcements"
              className="uni-cta"
              onClick={handleViewAll}
            >
              <span>View All Announcements</span>
              <i className="bi bi-arrow-right"></i>
            </Link>

            <label className="uni-checkbox">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span className="uni-checkbox-custom">
                <i className="bi bi-check"></i>
              </span>
              <span>Don't show this again</span>
            </label>
          </div>

          {/* Decorative stars (yellow) */}
          <span className="uni-star star1">✦</span>
          <span className="uni-star star2">✧</span>
          <span className="uni-star star3">✦</span>
          <span className="uni-star star4">✧</span>
        </div>

        {/* Bottom gradient line */}
        <div className="uni-bottom-line"></div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* ── Overlay ── */
        .uni-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: overlayFade 0.3s ease;
        }

        /* ── Popup ── */
        .uni-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 9999;
          transform: translate(-50%, -50%);
          width: min(92vw, 480px);
          max-height: 90vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.18), 0 10px 30px rgba(165, 28, 48, 0.08);
          border: 1px solid rgba(165, 28, 48, 0.06);
          animation: popIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          padding: 0;
        }

        .uni-popup-inner {
          padding: 28px 28px 18px;
          position: relative;
        }

        /* top bar */
        .uni-popup::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #7A1523, #A51C30, #F5B81B, #A51C30, #7A1523);
          background-size: 200% 100%;
          animation: barMove 5s linear infinite;
          border-radius: 24px 24px 0 0;
          pointer-events: none;
        }

        /* ── Close ── */
        .uni-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: transparent;
          color: #9CA3AF;
          font-size: 1.1rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.25s;
          z-index: 5;
        }
        .uni-close:hover {
          background: #A51C30;
          color: #fff;
          transform: rotate(90deg);
        }

        /* ── Header ── */
        .uni-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .uni-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(165, 28, 48, 0.08);
          color: #A51C30;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          padding: 5px 14px 5px 12px;
          border-radius: 50px;
          margin-bottom: 10px;
        }
        .uni-badge-dot {
          width: 7px;
          height: 7px;
          background: #F5B81B;
          border-radius: 50%;
          animation: pulseDot 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }

        .uni-bell-wrapper {
          position: relative;
          width: 70px;
          height: 70px;
          margin: 0 auto 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .uni-bell-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #A51C30, #7A1523);
          color: #fff;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(165, 28, 48, 0.25);
          animation: bellFloat 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }
        .uni-bell-icon i {
          animation: bellShake 3.5s ease-in-out infinite;
        }
        .uni-bell-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(245, 184, 27, 0.3);
          animation: ringPulse 2.4s ease-out infinite;
        }

        .uni-header h3 {
          margin: 0;
          font-size: clamp(1.4rem, 4vw, 1.8rem);
          font-weight: 700;
          color: #1F2937;
        }
        .uni-header h3 span {
          color: #A51C30;
        }
        .uni-subtitle {
          color: #6B7280;
          font-size: 0.85rem;
          margin: 4px 0 0;
        }

        /* ── Notification list ── */
        .uni-notification-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 4px;
          margin: 16px 0 14px;
        }
        .uni-notification-list::-webkit-scrollbar {
          width: 4px;
        }
        .uni-notification-list::-webkit-scrollbar-thumb {
          background: #A51C30;
          border-radius: 10px;
        }
        .uni-notification-list::-webkit-scrollbar-track {
          background: #F3F4F6;
        }

        .uni-notification-item {
          display: flex;
          gap: 12px;
          padding: 12px 14px;
          background: #F9FAFB;
          border-radius: 14px;
          border: 1px solid #F3F4F6;
          transition: background 0.2s, border-color 0.2s;
        }
        .uni-notification-item:hover {
          background: rgba(165, 28, 48, 0.02);
          border-color: rgba(165, 28, 48, 0.12);
        }

        .uni-notification-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(165, 28, 48, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #A51C30;
        }

        .uni-notification-content {
          flex: 1;
          min-width: 0;
        }
        .uni-notification-title {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .uni-notification-title span:first-child {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1F2937;
        }
        .uni-new-badge {
          background: #F5B81B;
          color: #1F2937;
          font-size: 0.55rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .uni-notification-desc {
          font-size: 0.8rem;
          color: #6B7280;
          margin: 3px 0 4px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .uni-notification-date {
          font-size: 0.65rem;
          color: #9CA3AF;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .uni-notification-date i {
          font-size: 0.6rem;
        }

        .uni-empty-state {
          text-align: center;
          padding: 30px 0;
          color: #9CA3AF;
        }
        .uni-empty-state i {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 8px;
        }
        .uni-empty-state p {
          margin: 0;
          font-size: 0.9rem;
        }

        /* ── Footer ── */
        .uni-footer {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .uni-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px 18px;
          background: linear-gradient(135deg, #A51C30, #7A1523);
          color: #fff !important;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 8px 20px rgba(165, 28, 48, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .uni-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(165, 28, 48, 0.3);
          color: #fff !important;
        }
        .uni-cta i {
          transition: transform 0.2s;
        }
        .uni-cta:hover i {
          transform: translateX(4px);
        }

        .uni-checkbox {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          color: #6B7280;
          cursor: pointer;
          user-select: none;
        }
        .uni-checkbox input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .uni-checkbox-custom {
          width: 16px;
          height: 16px;
          border: 1.5px solid #D1D5DB;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.6rem;
          transition: background 0.2s, border-color 0.2s;
        }
        .uni-checkbox input:checked + .uni-checkbox-custom {
          background: #A51C30;
          border-color: #A51C30;
        }

        /* ── Decorative stars ── */
        .uni-star {
          position: absolute;
          color: #F5B81B;
          opacity: 0.25;
          pointer-events: none;
          z-index: 1;
        }
        .star1 {
          top: 70px;
          left: 20px;
          font-size: 16px;
          animation: starFloat 3s ease-in-out infinite;
        }
        .star2 {
          top: 130px;
          right: 22px;
          font-size: 12px;
          animation: starFloat 3.7s ease-in-out infinite 0.4s;
        }
        .star3 {
          bottom: 100px;
          left: 16px;
          font-size: 11px;
          animation: starFloat 4s ease-in-out infinite 0.7s;
        }
        .star4 {
          bottom: 60px;
          right: 18px;
          font-size: 17px;
          animation: starFloat 3.5s ease-in-out infinite 0.2s;
        }

        /* ── Bottom line ── */
        .uni-bottom-line {
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #7A1523, #A51C30, #F5B81B, #A51C30, #7A1523);
          background-size: 200% 100%;
          animation: barMove 4s linear infinite;
          border-radius: 0 0 24px 24px;
        }

        /* ── Animations ── */
        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -46%) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 184, 27, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(245, 184, 27, 0); }
        }
        @keyframes bellFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes bellShake {
          0%, 80%, 100% { transform: rotate(0); }
          84% { transform: rotate(8deg); }
          88% { transform: rotate(-8deg); }
          92% { transform: rotate(5deg); }
          96% { transform: rotate(-3deg); }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.7; }
          70%, 100% { transform: scale(1.25); opacity: 0; }
        }
        @keyframes starFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(15deg); }
        }
        @keyframes barMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* ── Responsive ── */
        @media (max-width: 576px) {
          .uni-popup {
            width: calc(100vw - 24px);
            border-radius: 20px;
          }
          .uni-popup-inner {
            padding: 20px 18px 16px;
          }
          .uni-close {
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            font-size: 0.9rem;
          }
          .uni-bell-wrapper {
            width: 60px;
            height: 60px;
          }
          .uni-bell-icon {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }
          .uni-header h3 {
            font-size: 1.3rem;
          }
          .uni-notification-item {
            padding: 10px 12px;
          }
          .uni-notification-title span:first-child {
            font-size: 0.8rem;
          }
          .uni-notification-desc {
            font-size: 0.75rem;
          }
          .uni-cta {
            font-size: 0.8rem;
            padding: 10px 14px;
          }
          .star1 { top: 60px; left: 12px; font-size: 14px; }
          .star2 { top: 110px; right: 14px; font-size: 10px; }
          .star3 { bottom: 90px; left: 10px; font-size: 10px; }
          .star4 { bottom: 50px; right: 12px; font-size: 14px; }
        }

        @media (max-height: 650px) {
          .uni-notification-list {
            max-height: 200px;
          }
          .uni-bell-wrapper {
            width: 50px;
            height: 50px;
            margin-bottom: 4px;
          }
          .uni-bell-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
          .uni-header {
            margin-bottom: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .uni-popup, .uni-overlay, .uni-bell-icon, .uni-bell-icon i,
          .uni-bell-ring, .uni-star, .uni-badge-dot, .uni-bottom-line {
            animation: none !important;
          }
          .uni-cta, .uni-close, .uni-notification-item {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default RecentUpdatePopup;
