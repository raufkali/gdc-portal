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
    { id: "banners", label: "Banners", icon: "bi-images", color: "primary" },
    { id: "programs", label: "Programs", icon: "bi-book", color: "success" },
    {
      id: "departments",
      label: "Departments",
      icon: "bi-building",
      color: "info",
    },
    {
      id: "activities",
      label: "Activities",
      icon: "bi-calendar-event",
      color: "warning",
    },
    { id: "gallery", label: "Gallery", icon: "bi-image", color: "secondary" },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: "bi-chat-quote",
      color: "danger",
    },
    { id: "faqs", label: "FAQs", icon: "bi-question-circle", color: "dark" },
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
      {/* Desktop Tabs */}
      <div className="d-none d-md-flex flex-wrap gap-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn btn-sm ${activeTab === tab.id ? `btn-${tab.color} text-white` : "btn-outline-secondary"}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              borderRadius: "50px",
              padding: "0.3rem 1rem",
              fontSize: "0.8rem",
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
            className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex align-items-center justify-content-between"
            type="button"
            id="contentDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              borderRadius: "12px",
              padding: "0.6rem 1rem",
              borderColor: "#e5e5e5",
              backgroundColor: "#fff",
            }}
          >
            <span>
              <i className={`bi ${info?.icon} me-2 text-${info?.color}`}></i>
              {info?.label}
            </span>
            <i className="bi bi-chevron-down"></i>
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
                      activeTab === tab.id
                        ? `var(--bs-${tab.color})`
                        : "transparent",
                    color: activeTab === tab.id ? "#fff" : "inherit",
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
