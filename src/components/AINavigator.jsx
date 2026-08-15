import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCollection } from "../firebase/db";

/*
|--------------------------------------------------------------------------
| Static Navigation Destinations
|--------------------------------------------------------------------------
*/

const STATIC_NAVIGATION_ITEMS = [
  {
    id: "home",
    title: "Home",
    description: "Return to the GDC Gulabad homepage.",
    route: "/",
    icon: "bi-house-door",
    keywords: ["home", "homepage", "main page", "start", "gdc gulabad home"],
  },

  {
    id: "about",
    title: "About GDC Gulabad",
    description: "Learn about the college, administration and history.",
    route: "/about",
    icon: "bi-building",
    keywords: [
      "about",
      "about college",
      "college",
      "history",
      "administration",
      "principal",
      "principal message",
      "gdc gulabad",
    ],
  },

  {
    id: "programs",
    title: "Academic Programs",
    description: "Explore academic programs offered by the college.",
    route: "/programs",
    icon: "bi-mortarboard",
    keywords: [
      "program",
      "programs",
      "degree",
      "degrees",
      "courses",
      "academic programs",
      "study programs",
      "what can i study",
      "study",
    ],
  },

  {
    id: "departments",
    title: "Departments",
    description: "Explore all academic departments.",
    route: "/departments",
    icon: "bi-diagram-3",
    keywords: [
      "department",
      "departments",
      "academic department",
      "academic departments",
      "subjects",
      "faculty departments",
    ],
  },

  {
    id: "activities",
    title: "College Activities",
    description: "Explore activities, events and student life.",
    route: "/activities",
    icon: "bi-calendar-event",
    keywords: [
      "activity",
      "activities",
      "event",
      "events",
      "college activities",
      "student activities",
      "student life",
    ],
  },

  {
    id: "gallery",
    title: "Gallery",
    description: "View photos and moments from GDC Gulabad.",
    route: "/gallery",
    icon: "bi-images",
    keywords: [
      "gallery",
      "photos",
      "pictures",
      "images",
      "photographs",
      "college photos",
      "campus photos",
    ],
  },

  {
    id: "media",
    title: "Media",
    description: "Explore college media and featured content.",
    route: "/media",
    icon: "bi-play-btn",
    keywords: ["media", "video", "videos", "college media"],
  },

  {
    id: "testimonials",
    title: "Testimonials",
    description: "Read experiences and testimonials from students.",
    route: "/testimonials",
    icon: "bi-chat-quote",
    keywords: [
      "testimonial",
      "testimonials",
      "reviews",
      "student reviews",
      "student experience",
      "experiences",
    ],
  },

  {
    id: "announcements",
    title: "Announcements",
    description: "View the latest college announcements and notices.",
    route: "/announcements",
    icon: "bi-megaphone",
    keywords: [
      "announcement",
      "announcements",
      "notice",
      "notices",
      "notification",
      "notifications",
      "news",
      "college news",
      "updates",
      "latest updates",
    ],
  },

  {
    id: "eligibility",
    title: "Eligibility Criteria",
    description: "Check admission eligibility and requirements.",
    route: "/eligibility-criteria",
    icon: "bi-person-check",
    keywords: [
      "eligibility",
      "eligibility criteria",
      "admission eligibility",
      "requirements",
      "admission requirements",
      "who can apply",
      "qualification",
      "admission qualification",
    ],
  },

  {
    id: "fees",
    title: "Fee Structure",
    description: "View the college fee structure.",
    route: "/fee-structure",
    icon: "bi-cash-stack",
    keywords: [
      "fee",
      "fees",
      "fee structure",
      "fees structure",
      "tuition",
      "college fees",
      "cost",
      "how much",
    ],
  },

  {
    id: "results",
    title: "Examination Results",
    description: "Check examination and academic results.",
    route: "/exam-result",
    icon: "bi-bar-chart",
    keywords: [
      "result",
      "results",
      "exam result",
      "exam results",
      "examination result",
      "examination results",
      "marks",
      "grades",
      "marksheet",
      "result card",
    ],
  },

  {
    id: "privacy",
    title: "Privacy Policy",
    description: "Read the website privacy policy.",
    route: "/privacy-policy",
    icon: "bi-shield-check",
    keywords: ["privacy", "privacy policy", "data privacy"],
  },

  {
    id: "faq",
    title: "Frequently Asked Questions",
    description: "Find answers to common questions.",
    route: "/faq",
    icon: "bi-question-circle",
    keywords: [
      "faq",
      "frequently asked questions",
      "questions",
      "common questions",
      "help",
    ],
  },

  {
    id: "contact",
    title: "Contact GDC Gulabad",
    description: "Find college contact information and location.",
    route: "/contact",
    icon: "bi-telephone",
    keywords: [
      "contact",
      "contact us",
      "phone",
      "telephone",
      "email",
      "email address",
      "address",
      "location",
      "where is college",
      "where is gdc",
      "directions",
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

const AINavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const inputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Admin Route Protection
  |--------------------------------------------------------------------------
  |
  | The Navigation Assistant is a public-facing feature.
  |
  | It must NEVER appear inside:
  |
  | /admin
  | /admin/*
  |
  | This also prevents unnecessary department fetching while inside
  | the admin panel.
  |
  */

  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  /*
  |--------------------------------------------------------------------------
  | Fetch Departments
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
     * Do not fetch public navigation data inside the admin panel.
     */
    if (isAdminRoute) {
      setDepartments([]);
      setDepartmentsLoading(false);
      return;
    }

    const loadDepartments = async () => {
      setDepartmentsLoading(true);

      try {
        const data = await fetchCollection("departments");

        if (Array.isArray(data)) {
          setDepartments(data.filter((department) => department?.id));
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error(
          "Navigation Assistant: Failed to fetch departments:",
          error,
        );

        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    loadDepartments();
  }, [isAdminRoute]);

  /*
  |--------------------------------------------------------------------------
  | Department Navigation Items
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Your application uses:
  |
  | /departments/:id
  |
  | NOT:
  |
  | /departments/:name
  |
  */

  const departmentNavigationItems = useMemo(() => {
    return departments.map((department) => {
      const name = department.name || "Department";

      const normalizedName = name.toLowerCase().trim();

      return {
        id: `department-${department.id}`,

        title: name,

        description: `Explore the ${name} department.`,

        route: `/departments/${department.id}`,

        icon: "bi-mortarboard",

        keywords: [
          normalizedName,
          `${normalizedName} department`,
          `${normalizedName} program`,
          `${normalizedName} faculty`,
          `study ${normalizedName}`,
          `${normalizedName} course`,
        ],
      };
    });
  }, [departments]);

  /*
  |--------------------------------------------------------------------------
  | Complete Navigation Index
  |--------------------------------------------------------------------------
  */

  const navigationItems = useMemo(() => {
    return [...STATIC_NAVIGATION_ITEMS, ...departmentNavigationItems];
  }, [departmentNavigationItems]);

  /*
  |--------------------------------------------------------------------------
  | Normalize Text
  |--------------------------------------------------------------------------
  */

  const normalizeText = (text = "") => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/gi, " ")
      .replace(/\s+/g, " ");
  };

  /*
  |--------------------------------------------------------------------------
  | Search Engine
  |--------------------------------------------------------------------------
  */

  const findMatches = (searchQuery) => {
    const normalizedQuery = normalizeText(searchQuery);

    if (!normalizedQuery) {
      return [];
    }

    const queryWords = normalizedQuery.split(" ");

    return navigationItems
      .map((item) => {
        let score = 0;

        const normalizedTitle = normalizeText(item.title);

        const normalizedDescription = normalizeText(item.description);

        const normalizedKeywords = item.keywords.map(normalizeText);

        /*
        |--------------------------------------------------------------------------
        | Exact title
        |--------------------------------------------------------------------------
        */

        if (normalizedQuery === normalizedTitle) {
          score += 150;
        }

        /*
        |--------------------------------------------------------------------------
        | Title contains complete query
        |--------------------------------------------------------------------------
        */

        if (
          normalizedTitle.includes(normalizedQuery) &&
          normalizedQuery.length >= 3
        ) {
          score += 90;
        }

        /*
        |--------------------------------------------------------------------------
        | Description
        |--------------------------------------------------------------------------
        */

        if (normalizedDescription.includes(normalizedQuery)) {
          score += 30;
        }

        /*
        |--------------------------------------------------------------------------
        | Keyword matching
        |--------------------------------------------------------------------------
        */

        normalizedKeywords.forEach((keyword) => {
          if (!keyword) return;

          if (normalizedQuery === keyword) {
            score += 120;
          }

          if (normalizedQuery.includes(keyword) && keyword.length >= 3) {
            score += 60;
          }

          if (
            keyword.includes(normalizedQuery) &&
            normalizedQuery.length >= 3
          ) {
            score += 40;
          }
        });

        /*
        |--------------------------------------------------------------------------
        | Individual words
        |--------------------------------------------------------------------------
        */

        queryWords.forEach((word) => {
          if (word.length < 2) return;

          const titleWords = normalizedTitle.split(" ");

          if (titleWords.includes(word)) {
            score += 25;
          }

          normalizedKeywords.forEach((keyword) => {
            if (keyword.split(" ").includes(word)) {
              score += 12;
            }
          });
        });

        return {
          ...item,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  /*
  |--------------------------------------------------------------------------
  | Search Results
  |--------------------------------------------------------------------------
  */

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return findMatches(query);
  }, [query, navigationItems]);

  /*
  |--------------------------------------------------------------------------
  | Navigate
  |--------------------------------------------------------------------------
  */

  const handleNavigate = (item) => {
    if (!item?.route) return;

    setIsOpen(false);
    setQuery("");
    setHasSearched(false);

    navigate(item.route);
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Search
  |--------------------------------------------------------------------------
  */

  const handleSearch = (event) => {
    event?.preventDefault();

    if (!query.trim()) return;

    setHasSearched(true);

    const matches = findMatches(query);

    /*
     * Only automatically navigate when the result
     * is highly confident.
     */

    if (matches.length > 0 && matches[0].score >= 100) {
      handleNavigate(matches[0]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open Assistant
  |--------------------------------------------------------------------------
  */

  const openAssistant = () => {
    /*
     * Extra safety:
     * Never open the assistant on admin routes.
     */

    if (isAdminRoute) return;

    setIsOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Assistant
  |--------------------------------------------------------------------------
  */

  const closeAssistant = () => {
    setIsOpen(false);
    setQuery("");
    setHasSearched(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Automatically close when entering admin
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isAdminRoute && isOpen) {
      closeAssistant();
    }
  }, [isAdminRoute]);

  /*
  |--------------------------------------------------------------------------
  | Escape Key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAssistant();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Lock body scroll on mobile
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen || isAdminRoute) return;

    if (window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isAdminRoute]);

  /*
  |--------------------------------------------------------------------------
  | Suggested Searches
  |--------------------------------------------------------------------------
  */

  const suggestions = [
    {
      label: "Exam results",
      icon: "bi-bar-chart",
      query: "exam results",
    },
    {
      label: "Fee structure",
      icon: "bi-cash-stack",
      query: "fee structure",
    },
    {
      label: "Departments",
      icon: "bi-diagram-3",
      query: "departments",
    },
    {
      label: "Admission eligibility",
      icon: "bi-person-check",
      query: "eligibility criteria",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | Never render the Navigation Assistant inside the admin panel.
  |--------------------------------------------------------------------------
  */

  if (isAdminRoute) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <style>{`
        /* ============================================================
           Floating Navigation Assistant
        ============================================================ */

        .ai-nav-trigger {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 62px;
          height: 62px;
          border: none;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9998;
          box-shadow:
            0 12px 35px rgba(165, 28, 48, 0.30),
            0 4px 12px rgba(0, 0, 0, 0.10);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .ai-nav-trigger:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow:
            0 18px 45px rgba(165, 28, 48, 0.38),
            0 6px 15px rgba(0, 0, 0, 0.12);
        }

        .ai-nav-trigger i {
          font-size: 1.55rem;
        }

        .ai-nav-pulse {
          position: absolute;
          inset: -5px;
          border: 1px solid rgba(165, 28, 48, 0.30);
          border-radius: 50%;
          animation: aiNavPulse 2.4s infinite;
          pointer-events: none;
        }

        @keyframes aiNavPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }

          70% {
            transform: scale(1.25);
            opacity: 0;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        .ai-nav-tooltip {
          position: absolute;
          right: 74px;
          white-space: nowrap;
          background: #1a1a1a;
          color: #fff;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          opacity: 0;
          pointer-events: none;
          transform: translateX(8px);
          transition: all 0.25s ease;
        }

        .ai-nav-trigger:hover .ai-nav-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        /* ============================================================
           Backdrop
        ============================================================ */

        .ai-nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.40);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 9999;
          animation: aiBackdropIn 0.25s ease;
        }

        @keyframes aiBackdropIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        /* ============================================================
           Assistant Window
        ============================================================ */

        .ai-nav-window {
          position: fixed;
          right: 24px;
          bottom: 96px;
          width: min(440px, calc(100vw - 32px));
          max-height: min(680px, calc(100vh - 120px));
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          z-index: 10000;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.20),
            0 10px 30px rgba(0, 0, 0, 0.10);
          border: 1px solid rgba(0, 0, 0, 0.06);
          animation: aiWindowIn 0.3s cubic-bezier(
            0.22,
            1,
            0.36,
            1
          );
          display: flex;
          flex-direction: column;
        }

        @keyframes aiWindowIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ============================================================
           Header
        ============================================================ */

        .ai-nav-header {
          position: relative;
          padding: 22px 22px 20px;
          background:
            linear-gradient(
              135deg,
              var(--color-primary-dark),
              var(--color-primary)
            );
          color: #fff;
        }

        .ai-nav-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .ai-nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-nav-brand-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .ai-nav-title {
          margin: 0;
          font-size: 1.08rem;
          font-weight: 700;
          letter-spacing: -0.2px;
        }

        .ai-nav-subtitle {
          margin: 3px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.76rem;
          line-height: 1.4;
        }

        .ai-nav-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.10);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .ai-nav-close:hover {
          background: rgba(255, 255, 255, 0.20);
        }

        .ai-nav-helper-text {
          margin: 17px 0 0;
          font-size: 0.83rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.90);
        }

        /* ============================================================
           Search
        ============================================================ */

        .ai-nav-search-area {
          padding: 15px;
          background: #fff;
          border-bottom: 1px solid #eee;
        }

        .ai-nav-search {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 50px;
          padding: 0 13px;
          border: 1px solid #e4e4e4;
          border-radius: 13px;
          background: #fafafa;
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .ai-nav-search:focus-within {
          background: #fff;
          border-color: var(--color-primary);
          box-shadow:
            0 0 0 4px rgba(165, 28, 48, 0.08);
        }

        .ai-nav-search > i {
          color: #858585;
          font-size: 1rem;
        }

        .ai-nav-input {
          min-width: 0;
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: #222;
          font-family: var(--font-sans);
          font-size: 0.88rem;
        }

        .ai-nav-input::placeholder {
          color: #999;
        }

        .ai-nav-search-button {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border: none;
          border-radius: 9px;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .ai-nav-search-button:hover {
          background: var(--color-primary-dark);
          transform: scale(1.04);
        }

        /* ============================================================
           Content
        ============================================================ */

        .ai-nav-content {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 17px;
        }

        .ai-nav-section-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #777;
          font-size: 0.70rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        /* ============================================================
           Suggestions
        ============================================================ */

        .ai-nav-suggestions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .ai-nav-suggestion {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 10px;
          border: 1px solid #e9e9e9;
          border-radius: 11px;
          background: #fff;
          color: #333;
          text-align: left;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .ai-nav-suggestion:hover {
          border-color: rgba(165, 28, 48, 0.35);
          background: rgba(165, 28, 48, 0.035);
          transform: translateY(-1px);
        }

        .ai-nav-suggestion-icon {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          border-radius: 8px;
          background: rgba(165, 28, 48, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ============================================================
           Results
        ============================================================ */

        .ai-nav-results {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ai-nav-result {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e9e9e9;
          border-radius: 13px;
          background: #fff;
          text-align: left;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .ai-nav-result:hover {
          border-color: rgba(165, 28, 48, 0.25);
          background: rgba(165, 28, 48, 0.025);
          transform: translateY(-1px);
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
        }

        .ai-nav-result-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 11px;
          background: rgba(165, 28, 48, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .ai-nav-result-info {
          min-width: 0;
          flex: 1;
        }

        .ai-nav-result-title {
          margin: 0;
          color: #222;
          font-size: 0.84rem;
          font-weight: 700;
        }

        .ai-nav-result-description {
          margin: 3px 0 0;
          color: #777;
          font-size: 0.72rem;
          line-height: 1.4;
        }

        .ai-nav-result-arrow {
          color: #aaa;
          font-size: 0.9rem;
          transition: transform 0.2s ease;
        }

        .ai-nav-result:hover .ai-nav-result-arrow {
          color: var(--color-primary);
          transform: translateX(3px);
        }

        /* ============================================================
           Empty State
        ============================================================ */

        .ai-nav-empty {
          text-align: center;
          padding: 32px 15px;
        }

        .ai-nav-empty-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 12px;
          border-radius: 15px;
          background: #f6f6f6;
          color: #aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .ai-nav-empty h4 {
          margin: 0 0 5px;
          color: #333;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .ai-nav-empty p {
          margin: 0 auto;
          max-width: 280px;
          color: #888;
          font-size: 0.76rem;
          line-height: 1.5;
        }

        /* ============================================================
           Footer
        ============================================================ */

        .ai-nav-footer {
          padding: 10px 17px;
          border-top: 1px solid #eee;
          background: #fafafa;
          color: #999;
          text-align: center;
          font-size: 0.67rem;
        }

        .ai-nav-footer strong {
          color: var(--color-primary);
          font-weight: 700;
        }

        /* ============================================================
           Mobile
        ============================================================ */

        @media (max-width: 767px) {
          .ai-nav-trigger {
            right: 17px;
            bottom: 17px;
            width: 56px;
            height: 56px;
          }

          .ai-nav-tooltip {
            display: none;
          }

          .ai-nav-window {
            left: 10px;
            right: 10px;
            bottom: 10px;
            width: auto;
            max-height: calc(100vh - 20px);
            border-radius: 20px;
          }

          .ai-nav-header {
            padding: 19px 18px 17px;
          }

          .ai-nav-title {
            font-size: 1rem;
          }

          .ai-nav-helper-text {
            font-size: 0.78rem;
          }

          .ai-nav-content {
            padding: 14px;
          }

          .ai-nav-suggestions {
            grid-template-columns: 1fr 1fr;
          }

          .ai-nav-suggestion {
            padding: 10px 8px;
            font-size: 0.70rem;
          }
        }

        @media (max-width: 390px) {
          .ai-nav-suggestions {
            grid-template-columns: 1fr;
          }

          .ai-nav-window {
            left: 7px;
            right: 7px;
            bottom: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-nav-trigger,
          .ai-nav-window,
          .ai-nav-backdrop,
          .ai-nav-result,
          .ai-nav-suggestion {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ================================================================
          Floating Button
      ================================================================ */}

      {!isOpen && (
        <button
          type="button"
          className="ai-nav-trigger"
          onClick={openAssistant}
          aria-label="Open Navigation Assistant"
        >
          <span className="ai-nav-pulse" />

          <i className="bi bi-compass" />

          <span className="ai-nav-tooltip">Navigation Assistant</span>
        </button>
      )}

      {/* ================================================================
          Assistant
      ================================================================ */}

      {isOpen && (
        <>
          <div className="ai-nav-backdrop" onClick={closeAssistant} />

          <div
            className="ai-nav-window"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Assistant"
          >
            {/* ==========================================================
                Header
            ========================================================== */}

            <div className="ai-nav-header">
              <div className="ai-nav-header-top">
                <div className="ai-nav-brand">
                  <div className="ai-nav-brand-icon">
                    <i className="bi bi-compass" />
                  </div>

                  <div>
                    <h3 className="ai-nav-title text-white">
                      Navigation Assistant
                    </h3>

                    <p className="ai-nav-subtitle">GDC Gulabad</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="ai-nav-close"
                  onClick={closeAssistant}
                  aria-label="Close Navigation Assistant"
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <p className="ai-nav-helper-text">
                Tell me what you're looking for and I'll help you find the right
                page.
              </p>
            </div>

            {/* ==========================================================
                Search
            ========================================================== */}

            <div className="ai-nav-search-area">
              <form className="ai-nav-search" onSubmit={handleSearch}>
                <i className="bi bi-search" />

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setHasSearched(false);
                  }}
                  className="ai-nav-input"
                  placeholder="What are you looking for?"
                  autoComplete="off"
                  aria-label="Search website"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setHasSearched(false);
                      inputRef.current?.focus();
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#999",
                      cursor: "pointer",
                      padding: "3px",
                    }}
                    aria-label="Clear search"
                  >
                    <i className="bi bi-x-circle" />
                  </button>
                )}

                <button
                  type="submit"
                  className="ai-nav-search-button"
                  aria-label="Search"
                >
                  <i className="bi bi-arrow-right" />
                </button>
              </form>
            </div>

            {/* ==========================================================
                Content
            ========================================================== */}

            <div className="ai-nav-content">
              {!query.trim() ? (
                <>
                  <div className="ai-nav-section-label">
                    <span>Quick navigation</span>
                  </div>

                  <div className="ai-nav-suggestions">
                    {suggestions.map((suggestion) => (
                      <button
                        type="button"
                        key={suggestion.label}
                        className="ai-nav-suggestion"
                        onClick={() => {
                          setQuery(suggestion.query);
                          setHasSearched(false);

                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 50);
                        }}
                      >
                        <span className="ai-nav-suggestion-icon">
                          <i className={`bi ${suggestion.icon}`} />
                        </span>

                        <span>{suggestion.label}</span>
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: "25px",
                      padding: "14px",
                      borderRadius: "13px",
                      background: "rgba(165, 28, 48, 0.045)",
                      border: "1px solid rgba(165, 28, 48, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      <i
                        className="bi bi-lightbulb"
                        style={{
                          color: "var(--color-primary)",
                          marginTop: "1px",
                        }}
                      />

                      <div>
                        <div
                          style={{
                            color: "#444",
                            fontSize: "0.76rem",
                            fontWeight: "700",
                            marginBottom: "3px",
                          }}
                        >
                          Try asking naturally
                        </div>

                        <div
                          style={{
                            color: "#777",
                            fontSize: "0.72rem",
                            lineHeight: "1.5",
                          }}
                        >
                          “Where can I check my exam results?” or “Show me the
                          Chemistry department.”
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="ai-nav-section-label">
                    <span>
                      {results.length > 0
                        ? "Recommended pages"
                        : "Search results"}
                    </span>

                    {results.length > 0 && <span>{results.length} found</span>}
                  </div>

                  {results.length > 0 ? (
                    <div className="ai-nav-results">
                      {results.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className="ai-nav-result"
                          onClick={() => handleNavigate(item)}
                        >
                          <span className="ai-nav-result-icon">
                            <i className={`bi ${item.icon}`} />
                          </span>

                          <span className="ai-nav-result-info">
                            <span className="ai-nav-result-title">
                              {item.title}
                            </span>

                            <span className="ai-nav-result-description">
                              {item.description}
                            </span>
                          </span>

                          <i className="bi bi-chevron-right ai-nav-result-arrow" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="ai-nav-empty">
                      <div className="ai-nav-empty-icon">
                        <i className="bi bi-search" />
                      </div>

                      <h4>We couldn't find that page</h4>

                      <p>
                        Try searching for things like “results”, “fees”,
                        “departments”, “admission” or “contact”.
                      </p>
                    </div>
                  )}

                  {hasSearched && results.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setHasSearched(false);
                      }}
                      style={{
                        display: "block",
                        margin: "0 auto",
                        marginTop: "5px",
                        border: "none",
                        background: "transparent",
                        color: "var(--color-primary)",
                        fontSize: "0.76rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Browse quick navigation
                    </button>
                  )}
                </>
              )}
            </div>

            {/* ==========================================================
                Footer
            ========================================================== */}

            <div className="ai-nav-footer">
              <strong>Navigation Assistant</strong> • Find your way around GDC
              Gulabad
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AINavigator;
