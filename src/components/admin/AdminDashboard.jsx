import { useState } from "react";
import ContentManager from "./ContentManager";
import SettingsManager from "./SettingsManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="container-fluid mt-5 pt-5">
      <h2>Admin Panel</h2>
      <ul className="nav nav-pills flex-column flex-sm-row mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            Content Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Website Settings
          </button>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === "content" && <ContentManager />}
        {activeTab === "settings" && <SettingsManager />}
      </div>
    </div>
  );
};
export default AdminDashboard;
