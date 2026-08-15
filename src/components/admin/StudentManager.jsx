import { useState } from "react";
import {
  CollegeStarsManager,
  StudentAchievementsManager,
  StudentActivitiesManager,
} from "./content";

const StudentManager = () => {
  const [activeTab, setActiveTab] = useState("college-stars");

  const tabs = [
    { id: "college-stars", label: "College Stars", icon: "bi-star" },
    { id: "achievements", label: "Achievements", icon: "bi-trophy" },
    { id: "activities", label: "Student Activities", icon: "bi-people" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "college-stars":
        return <CollegeStarsManager />;
      case "achievements":
        return <StudentAchievementsManager />;
      case "activities":
        return <StudentActivitiesManager />;
      default:
        return <CollegeStarsManager />;
    }
  };

  const info = tabs.find((t) => t.id === activeTab);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i
            className={`bi ${info?.icon} me-2`}
            style={{ color: "#A51C30" }}
          ></i>
          Manage {info?.label || activeTab}
        </h4>
      </div>

      {/* Desktop Tabs */}
      <div
        className="d-none d-md-flex flex-wrap gap-1 mb-4"
        style={{ border: "2px solid #A51C30", borderRadius: "20px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn btn-sm ${activeTab === tab.id ? "text-white" : "btn-outline-secondary"}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              borderRadius: "50px",
              padding: "0.3rem 1rem",
              fontSize: "0.8rem",
              background: activeTab === tab.id ? "#A51C30" : "transparent",
              borderColor:
                activeTab === tab.id ? "#A51C30" : "var(--color-border)",
              color: activeTab === tab.id ? "#fff" : "var(--color-text)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.borderColor = "#A51C30";
                e.target.style.color = "#A51C30";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.color = "var(--color-text)";
              }
            }}
          >
            <i className={`bi ${tab.icon} me-1`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="d-md-none mb-4">
        <div className="dropdown w-100">
          <button
            className="btn dropdown-toggle w-100 text-start d-flex align-items-center justify-content-between"
            type="button"
            id="studentDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              borderRadius: "12px",
              padding: "0.6rem 1rem",
              borderColor: "#e5e5e5",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
            }}
          >
            <span>
              <i
                className={`bi ${info?.icon} me-2`}
                style={{ color: "#A51C30" }}
              ></i>
              {info?.label}
            </span>
          </button>
          <ul
            className="dropdown-menu w-100"
            aria-labelledby="studentDropdown"
            style={{
              borderRadius: "12px",
              padding: "0.5rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              border: "none",
              marginTop: "4px",
              backgroundColor: "var(--color-bg)",
            }}
          >
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`dropdown-item d-flex align-items-center gap-2 rounded ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    backgroundColor:
                      activeTab === tab.id ? "#A51C30" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "var(--color-text)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.backgroundColor =
                        "rgba(165, 28, 48, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  {tab.label}
                  {activeTab === tab.id && (
                    <i className="bi bi-check2 ms-auto"></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default StudentManager;
