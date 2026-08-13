import { useState } from "react";
import {
  BannersManager,
  ProgramsManager,
  DepartmentsManager,
  ActivitiesManager,
  GalleryManager,
  TestimonialsManager,
  FAQsManager,
} from "./content";

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("banners");

  const tabs = [
    { id: "banners", label: "Banners", icon: "bi-images" },
    { id: "programs", label: "Programs", icon: "bi-book" },
    { id: "departments", label: "Departments", icon: "bi-building" },
    { id: "activities", label: "Activities", icon: "bi-calendar-event" },
    { id: "gallery", label: "Gallery", icon: "bi-image" },
    { id: "testimonials", label: "Testimonials", icon: "bi-chat-quote" },
    { id: "faqs", label: "FAQs", icon: "bi-question-circle" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "banners":
        return <BannersManager />;
      case "programs":
        return <ProgramsManager />;
      case "departments":
        return <DepartmentsManager />;
      case "activities":
        return <ActivitiesManager />;
      case "gallery":
        return <GalleryManager />;
      case "testimonials":
        return <TestimonialsManager />;
      case "faqs":
        return <FAQsManager />;
      default:
        return <BannersManager />;
    }
  };

  const info = tabs.find((t) => t.id === activeTab);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i
            className={`bi ${info?.icon} me-2`}
            style={{ color: "#A51C30" }}
          ></i>
          Manage {info?.label || activeTab}
        </h4>
      </div>

      {/* Desktop Tabs - All crimson theme */}
      <div
        className="d-none  d-md-flex flex-wrap gap-1 mb-4"
        style={{
          border: "2px solid #A51C30",
          borderRadius: "20px",
        }}
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
              transform: activeTab === tab.id ? "scale(1,1.2)" : "scale(1,1)",
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

      {/* Mobile Dropdown - All crimson theme */}
      <div className="d-md-none mb-4">
        <div className="dropdown w-100">
          <button
            className="btn dropdown-toggle w-100 text-start d-flex align-items-center justify-content-between"
            type="button"
            id="contentDropdown"
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
            aria-labelledby="contentDropdown"
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

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default ContentManager;
