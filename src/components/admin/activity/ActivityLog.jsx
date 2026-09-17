import { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useNotification } from "../../../contexts/NotificationContext";

const ActivityLog = () => {
  const { showError } = useNotification();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "activityLogs"),
        orderBy("timestamp", "desc"),
        limit(100)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setLogs(list);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      showError("Failed to fetch system activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const getActionBadgeColor = (action = "") => {
    if (action.includes("CREATE") || action.includes("SAVED") || action.includes("UPLOADED") || action.includes("ACTIVATED")) {
      return { bg: "rgba(40, 167, 69, 0.1)", color: "#28a745" };
    }
    if (action.includes("DELETE") || action.includes("DEACTIVATED")) {
      return { bg: "rgba(165, 28, 48, 0.1)", color: "#A51C30" };
    }
    if (action.includes("UPDATE") || action.includes("ROLE")) {
      return { bg: "rgba(13, 110, 253, 0.1)", color: "#0d6efd" };
    }
    return { bg: "rgba(108, 117, 125, 0.1)", color: "#6c757d" };
  };

  const filteredLogs = logs.filter((log) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !search ||
      log.actorEmail?.toLowerCase().includes(search) ||
      log.actorName?.toLowerCase().includes(search) ||
      log.details?.toLowerCase().includes(search) ||
      log.resourceType?.toLowerCase().includes(search);

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResource = resourceFilter === "all" || log.resourceType === resourceFilter;

    return matchesSearch && matchesAction && matchesResource;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "var(--color-text, #333333)" }}>
            <i className="bi bi-clock-history me-2" style={{ color: "#A51C30" }}></i>
            System Activity Log
          </h4>
          <p className="text-muted small mb-0">
            Immutable audit record of administrative operations and content updates
          </p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill px-3"
          onClick={fetchLogs}
          disabled={loading}
        >
          <i className={`bi bi-arrow-clockwise me-1 ${loading ? "spin" : ""}`}></i>
          Refresh Logs
        </button>
      </div>

      {/* Filters */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)" }}
      >
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text border-0" style={{ background: "var(--color-bg-alt, #f8f9fa)", color: "#A51C30" }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search actor, email, or action details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: "var(--color-bg-alt, #f8f9fa)", fontSize: "0.85rem" }}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                style={{ fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <option value="all">All Resources</option>
                <option value="users">Users</option>
                <option value="announcements">Announcements</option>
                <option value="departments">Departments</option>
                <option value="examResults">Results</option>
                <option value="downloads">Downloads</option>
                <option value="settings">Settings</option>
              </select>
            </div>

            <div className="col-6 col-md-4">
              <select
                className="form-select"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                style={{ fontSize: "0.82rem", borderRadius: "8px" }}
              >
                <option value="all">All Actions</option>
                <option value="USER_CREATED">User Created</option>
                <option value="USER_UPDATED">User Updated</option>
                <option value="USER_DEACTIVATED">User Deactivated</option>
                <option value="USER_ACTIVATED">User Reactivated</option>
                <option value="USER_DELETED">User Deleted</option>
                <option value="PASSWORD_RESET_SENT">Password Reset Sent</option>
                <option value="ANNOUNCEMENT_CREATED">Announcement Created</option>
                <option value="ANNOUNCEMENT_UPDATED">Announcement Updated</option>
                <option value="ANNOUNCEMENT_DELETED">Announcement Deleted</option>
                <option value="SETTINGS_UPDATED">Settings Updated</option>
                <option value="RESULT_UPLOADED">Result Uploaded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "10px", backgroundColor: "var(--card-bg, #ffffff)", overflow: "hidden" }}
      >
        <div className="card-body p-0">
          {loading ? (
            <div className="p-5 text-center">
              <div className="spinner-border" style={{ color: "#A51C30" }} role="status">
                <span className="visually-hidden">Loading logs...</span>
              </div>
              <p className="text-muted small mt-2">Retrieving system activity...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-clock-history display-4 d-block mb-3" style={{ opacity: 0.3 }}></i>
              <h6 className="fw-semibold">No Activity Logs Found</h6>
              <p className="small mb-0">No system events matched your current search and filter settings.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                <thead style={{ backgroundColor: "var(--color-bg-alt, #f8f9fa)" }}>
                  <tr>
                    <th className="ps-4 py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Timestamp</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Action</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Resource</th>
                    <th className="py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Actor</th>
                    <th className="pe-4 py-3 text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => {
                    const badge = getActionBadgeColor(log.action);
                    return (
                      <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border, #E5E5E5)" }}>
                        <td className="ps-4 py-3 text-muted" style={{ whiteSpace: "nowrap" }}>
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="py-3">
                          <span
                            className="badge py-1 px-2"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              borderRadius: "50px",
                              fontSize: "0.72rem",
                              fontWeight: "500",
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 text-capitalize fw-medium">
                          {log.resourceType || "—"}
                        </td>
                        <td className="py-3">
                          <div className="fw-semibold" style={{ color: "var(--color-text, #333333)" }}>
                            {log.actorName || "Unknown"}
                          </div>
                          <small className="text-muted">{log.actorEmail}</small>
                        </td>
                        <td className="pe-4 py-3 text-muted" style={{ maxWidth: "340px" }}>
                          {log.details || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
