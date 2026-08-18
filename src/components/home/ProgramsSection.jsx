import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

// ============================================================
// MODULE-LEVEL CACHE
// ============================================================

let cachedPrograms = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

// ============================================================
// THEME
// ============================================================

const BRAND = "#A51C30";
const BRAND_DARK = "#7A1523";

// ============================================================
// PROGRAM ICON SYSTEM
// ============================================================
//
// Icons are automatically selected from the program title
// and category.
//
// No icon/image field is required in Firebase.
//
// Bootstrap Icons are used throughout.
// ============================================================

const PROGRAM_ICON_RULES = [
  // ==========================================================
  // COMPUTER / TECHNOLOGY
  // ==========================================================

  {
    keywords: [
      "computer science",
      "computer sciences",
      "software engineering",
      "software development",
      "programming",
      "computing",
    ],
    icon: "bi-code-square",
    color: "#087EA4",
  },

  {
    keywords: [
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "ai",
    ],
    icon: "bi-cpu",
    color: "#6F42C1",
  },
  {
    keywords: [
      "environmental science",
      "environment",
      "ecology",
      "environmental studies",
      "conservation",
      "climate change",
      "sustainability",
    ],
    icon: "bi-tree",
    color: "#198754",
  },
  {
    keywords: [
      "data science",
      "data analytics",
      "analytics",
      "big data",
      "statistics",
    ],
    icon: "bi-bar-chart-line",
    color: "#198754",
  },

  {
    keywords: [
      "cyber security",
      "cybersecurity",
      "information security",
      "network security",
    ],
    icon: "bi-shield-lock",
    color: "#6C3483",
  },

  {
    keywords: ["information technology", "information systems", "it "],
    icon: "bi-pc-display",
    color: "#0B7285",
  },

  {
    keywords: ["blockchain", "cryptocurrency", "distributed ledger"],
    icon: "bi-boxes",
    color: "#E67700",
  },

  {
    keywords: ["web development", "web design", "application development"],
    icon: "bi-window-stack",
    color: "#0D6EFD",
  },

  // ==========================================================
  // ENGINEERING
  // ==========================================================

  {
    keywords: ["civil engineering"],
    icon: "bi-building",
    color: "#795548",
  },

  {
    keywords: [
      "electrical engineering",
      "electronics engineering",
      "electrical",
    ],
    icon: "bi-lightning-charge",
    color: "#F59F00",
  },

  {
    keywords: ["mechanical engineering", "mechanical"],
    icon: "bi-gear-wide-connected",
    color: "#495057",
  },

  {
    keywords: ["chemical engineering", "chemical"],
    icon: "bi-droplet-half",
    color: "#862E9C",
  },

  {
    keywords: ["engineering", "engineer"],
    icon: "bi-gear",
    color: "#E8590C",
  },

  {
    keywords: ["architecture", "architectural"],
    icon: "bi-buildings",
    color: "#795548",
  },

  // ==========================================================
  // BUSINESS / COMMERCE
  // ==========================================================

  {
    keywords: [
      "business administration",
      "business management",
      "business",
      "management",
      "commerce",
    ],
    icon: "bi-briefcase",
    color: "#146C94",
  },

  {
    keywords: ["accounting", "accountancy", "accounts"],
    icon: "bi-calculator",
    color: "#198754",
  },

  {
    keywords: ["finance", "financial", "banking"],
    icon: "bi-cash-stack",
    color: "#2B8A3E",
  },

  {
    keywords: ["economics", "economic"],
    icon: "bi-graph-up-arrow",
    color: "#087F5B",
  },

  {
    keywords: ["marketing", "digital marketing", "marketing management"],
    icon: "bi-megaphone",
    color: "#D9480F",
  },

  {
    keywords: ["entrepreneurship", "entrepreneur"],
    icon: "bi-lightbulb",
    color: "#F08C00",
  },

  // ==========================================================
  // MEDICAL / HEALTH
  // ==========================================================

  {
    keywords: ["nursing", "nursing sciences"],
    icon: "bi-heart-pulse",
    color: "#D6336C",
  },

  {
    keywords: [
      "medicine",
      "medical",
      "mbbs",
      "health sciences",
      "health science",
    ],
    icon: "bi-hospital",
    color: "#C92A2A",
  },

  {
    keywords: ["pharmacy", "pharmaceutical"],
    icon: "bi-capsule",
    color: "#2F9E44",
  },

  {
    keywords: ["dentistry", "dental"],
    icon: "bi-emoji-smile",
    color: "#0C8599",
  },

  {
    keywords: ["physiotherapy", "physical therapy", "rehabilitation"],
    icon: "bi-person-walking",
    color: "#20C997",
  },

  // ==========================================================
  // SCIENCE
  // ==========================================================

  {
    keywords: ["physics"],
    icon: "bi-atom",
    color: "#6741D9",
  },

  {
    keywords: ["chemistry", "chemical science"],
    icon: "bi-flask",
    color: "#E8590C",
  },

  {
    keywords: ["biology", "biological science", "life science"],
    icon: "bi-virus",
    color: "#2B8A3E",
  },

  {
    keywords: ["mathematics", "mathematics", "math"],
    icon: "bi-calculator",
    color: "#1864AB",
  },

  {
    keywords: ["environmental science", "environmental studies", "environment"],
    icon: "bi-leaf",
    color: "#2B8A3E",
  },

  {
    keywords: ["geology", "geological", "earth science"],
    icon: "bi-globe-americas",
    color: "#8D6E63",
  },

  {
    keywords: ["geography"],
    icon: "bi-globe2",
    color: "#087F5B",
  },

  // ==========================================================
  // AGRICULTURE
  // ==========================================================

  {
    keywords: [
      "agriculture",
      "agricultural",
      "horticulture",
      "forestry",
      "botany",
    ],
    icon: "bi-flower1",
    color: "#2B8A3E",
  },

  {
    keywords: [
      "animal science",
      "livestock",
      "veterinary",
      "veterinary medicine",
    ],
    icon: "bi-heart-pulse",
    color: "#A61E4D",
  },

  // ==========================================================
  // EDUCATION
  // ==========================================================

  {
    keywords: ["education", "educational", "teacher education", "teaching"],
    icon: "bi-mortarboard",
    color: "#0B7285",
  },

  {
    keywords: ["early childhood", "elementary education", "primary education"],
    icon: "bi-person-hearts",
    color: "#E64980",
  },

  // ==========================================================
  // ARTS / DESIGN
  // ==========================================================

  {
    keywords: ["graphic design", "graphic arts", "visual design"],
    icon: "bi-palette",
    color: "#E64980",
  },

  {
    keywords: ["fine arts", "arts", "art"],
    icon: "bi-brush",
    color: "#9C36B5",
  },

  {
    keywords: ["fashion design", "fashion", "textile design"],
    icon: "bi-scissors",
    color: "#D63384",
  },

  // ==========================================================
  // MEDIA / COMMUNICATION
  // ==========================================================

  {
    keywords: [
      "media studies",
      "mass communication",
      "communication",
      "journalism",
      "media",
    ],
    icon: "bi-megaphone",
    color: "#E8590C",
  },

  {
    keywords: ["film", "film studies", "cinema", "production"],
    icon: "bi-camera-reels",
    color: "#862E9C",
  },

  // ==========================================================
  // SOCIAL SCIENCES
  // ==========================================================

  {
    keywords: ["sociology", "social science", "social sciences"],
    icon: "bi-people",
    color: "#0C8599",
  },

  {
    keywords: ["psychology", "psychological"],
    icon: "bi-person-heart",
    color: "#D6336C",
  },

  {
    keywords: ["political science", "political", "politics"],
    icon: "bi-flag",
    color: "#364FC7",
  },

  {
    keywords: ["international relations", "international studies"],
    icon: "bi-globe",
    color: "#1971C2",
  },

  // ==========================================================
  // LAW
  // ==========================================================

  {
    keywords: ["law", "legal studies", "llb", "llm"],
    icon: "bi-bank",
    color: "#495057",
  },

  // ==========================================================
  // LANGUAGES / HUMANITIES
  // ==========================================================

  {
    keywords: ["english", "english literature", "literature"],
    icon: "bi-book",
    color: "#7950F2",
  },

  {
    keywords: ["urdu", "urdu literature"],
    icon: "bi-journal-richtext",
    color: "#087F5B",
  },

  {
    keywords: ["arabic", "arabic literature"],
    icon: "bi-translate",
    color: "#2B8A3E",
  },

  {
    keywords: ["islamic studies", "islamiyat", "islamic"],
    icon: "bi-book-half",
    color: "#087F5B",
  },

  {
    keywords: ["history", "historical studies"],
    icon: "bi-hourglass-split",
    color: "#8D6E63",
  },

  {
    keywords: ["philosophy"],
    icon: "bi-lightbulb",
    color: "#7048E8",
  },
];

// ============================================================
// DEFAULT ICON
// ============================================================

const DEFAULT_ICON = {
  icon: "bi-mortarboard-fill",
  color: BRAND,
};

// ============================================================
// GET PROGRAM ICON
// ============================================================

const getProgramIcon = (program) => {
  const title = String(program?.title || "").toLowerCase();
  const category = String(program?.category || "").toLowerCase();

  const searchableText = `${title} ${category}`;

  const matchedRule = PROGRAM_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) =>
      searchableText.includes(keyword.toLowerCase()),
    ),
  );

  return matchedRule || DEFAULT_ICON;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ProgramsSection = () => {
  const [programs, setPrograms] = useState(() => {
    if (
      cachedPrograms &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedPrograms;
    }

    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedPrograms &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  // ==========================================================
  // GROUP PROGRAMS BY CATEGORY
  // ==========================================================

  const groupedPrograms = useMemo(() => {
    const groups = {};

    programs.forEach((program) => {
      const category = program.category?.trim() || "Academic Programs";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(program);
    });

    return groups;
  }, [programs]);

  // ==========================================================
  // LIMIT PROGRAMS PER CATEGORY
  // ==========================================================

  const maxPerCategory = 4;

  const displayGroups = useMemo(() => {
    const result = {};

    for (const [category, items] of Object.entries(groupedPrograms)) {
      result[category] = items.slice(0, maxPerCategory);
    }

    return result;
  }, [groupedPrograms]);

  // ==========================================================
  // FETCH PROGRAMS
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      const cacheValid =
        cachedPrograms &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL;

      if (cacheValid) {
        if (isMounted) {
          setPrograms(cachedPrograms);
          setLoading(false);
        }

        return;
      }

      try {
        const data = await fetchCollection("programs", [], {
          cacheTTL: CACHE_TTL,
          forceRefresh: false,
        });

        if (!isMounted) return;

        cachedPrograms = data;
        cacheTimestamp = Date.now();

        setPrograms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching programs:", error);

        if (cachedPrograms && isMounted) {
          setPrograms(cachedPrograms);
        }

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section
        className="programs-section"
        aria-label="Loading academic programs"
      >
        <div className="container">
          <div className="programs-loading">
            <div
              className="spinner-border"
              role="status"
              style={{
                color: BRAND,
              }}
            >
              <span className="visually-hidden">Loading programs...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (!programs.length) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <section className="programs-section" aria-labelledby="programs-heading ">
        <div className="container">
          {/* ==================================================
              HEADER
          =================================================== */}

          <div className="text-center mb-5" data-aos="fade-up">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#fff",
                fontSize: "0.72rem",
                fontWeight: "700",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginBottom: "0.9rem",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "28px",
                  height: "2px",
                  background: "#fff",
                  display: "inline-block",
                  opacity: 0.7,
                }}
              />
              Academics
              <span
                aria-hidden="true"
                style={{
                  width: "28px",
                  height: "2px",
                  background: "#fff",
                  display: "inline-block",
                  opacity: 0.7,
                }}
              />
            </span>

            <h2
              id="programs-heading"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: "700",
                color: "#fff",
                lineHeight: "1.15",
                marginBottom: "0.8rem",
              }}
            >
              Academic Pathways
            </h2>

            <p
              style={{
                color: "var(--color-text-light)",
                fontSize: "0.98rem",
                maxWidth: "620px",
                margin: "0 auto",
                lineHeight: "1.7",
              }}
            >
              Explore the programs designed to build knowledge, skills, and
              opportunities for the future.
            </p>
          </div>

          {/* ==================================================
              PROGRAM GROUPS
          =================================================== */}

          {Object.entries(displayGroups).map(([category, items]) => (
            <div key={category} className="program-category">
              {/* Category heading */}
              <div className="program-category-heading" data-aos="fade-up">
                <span className="program-category-line" />

                <h3>{category}</h3>

                <span className="program-category-line" />
              </div>

              {/* =================================================
                    CARDS
                ================================================== */}

              <div className="row g-4">
                {items.map((program, index) => {
                  const iconData = getProgramIcon(program);

                  return (
                    <div
                      key={program.id}
                      className="col-12 col-sm-6 col-lg-4"
                      data-aos="fade-up"
                      data-aos-duration="500"
                      data-aos-delay={Math.min(index * 80, 240)}
                    >
                      <Link
                        to={`/programs/${program.slug || program.id}`}
                        className="program-card"
                        aria-label={`View details for ${program.title}`}
                      >
                        {/* =================================================
                              CARD TOP ACCENT
                          ================================================== */}

                        <div
                          className="program-card-accent"
                          style={{
                            backgroundColor: iconData.color,
                          }}
                        />

                        {/* =================================================
                              FLOATING ICON
                          ================================================== */}

                        <div
                          className="program-icon"
                          style={{
                            backgroundColor: iconData.color,
                            color: "#ffff",
                          }}
                          aria-hidden="true"
                        >
                          <i className={`bi ${iconData.icon}`} />
                        </div>

                        {/* =================================================
                              CARD CONTENT
                          ================================================== */}

                        <div className="program-card-body">
                          {/* Number */}
                          <div className="program-number">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          {/* Title */}
                          <h4 className="program-title">{program.title}</h4>

                          {/* Subtitle */}
                          {program.subtitle && (
                            <p className="program-subtitle">
                              {program.subtitle}
                            </p>
                          )}

                          {/* Description */}
                          {program.description && (
                            <p className="program-description">
                              {program.description}
                            </p>
                          )}

                          {/* =================================================
                                META INFORMATION
                            ================================================== */}

                          <div className="program-meta">
                            {program.duration && (
                              <div className="program-meta-item">
                                <i className="bi bi-clock" aria-hidden="true" />

                                <span>
                                  <strong>Duration:</strong> {program.duration}
                                </span>
                              </div>
                            )}

                            {program.category && (
                              <div className="program-meta-item">
                                <i
                                  className="bi bi-building"
                                  aria-hidden="true"
                                />

                                <span>
                                  <strong>Faculty:</strong> {program.category}
                                </span>
                              </div>
                            )}

                            {program.fee && (
                              <div className="program-meta-item">
                                <i
                                  className="bi bi-wallet2"
                                  aria-hidden="true"
                                />

                                <span>
                                  <strong>Fee:</strong> {program.fee}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* =================================================
                                VIEW DETAILS
                            ================================================== */}

                          <div className="program-details-button">
                            <span>View Details</span>

                            <i
                              className="bi bi-arrow-right"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ==================================================
              VIEW ALL
          =================================================== */}

          <div className="programs-footer" data-aos="fade-up">
            <Link to="/programs" className="programs-view-all">
              <span>View All Programs</span>

              <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          STYLES
      ======================================================= */}

      <style>{`
        /* ====================================================
           SECTION
        ==================================================== */

        .programs-section {
          position: relative;
          padding: 5rem 0 4.5rem;
          background: ${BRAND_DARK};
          overflow: hidden;
        }

        /* ====================================================
           HEADER
        ==================================================== */

        .programs-header {
          max-width: 700px;
          margin: 0 auto 4rem;
        }

        .programs-eyebrow {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          color: ${BRAND};
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .programs-eyebrow::before,
        .programs-eyebrow::after {
          content: "";
          width: 28px;
          height: 2px;
          background: ${BRAND};
          display: inline-block;
        }

        .programs-header h2 {
          margin: 0 0 0.65rem;
          color: var(--color-text, #1d1d1d);
          font-family:
            "Playfair Display",
            Georgia,
            serif;
          font-size:
            clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .programs-header p {
          max-width: 620px;
          margin: 0 auto;
          color:
            var(
              --color-text-muted,
              #6c757d
            );
          font-size: 0.95rem;
          line-height: 1.7;
        }

        /* ====================================================
           CATEGORY
        ==================================================== */

        .program-category {
          margin-bottom: 4rem;
        }

        .program-category:last-of-type {
          margin-bottom: 0;
        }

        .program-category-heading {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .program-category-heading h3 {
          flex-shrink: 0;
          margin: 0;
          color:
              #ffff;
          font-family:
            "Playfair Display",
            Georgia,
            serif;
          font-size: 1.45rem;
          font-weight: 700;
          text-align: center;
        }

        .program-category-line {
          width: 100%;
          height: 1px;
          background:
            rgb(255, 255, 255);
        }

        /* ====================================================
           PROGRAM CARD
        ==================================================== */

        .program-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 350px;
          padding-top: 5px;
          background:
            var(--card-bg, #f8f7f2);
          color: inherit;
          text-decoration: none;
          border:
            1px solid rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.07);
          overflow: visible;
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease;
        }

        .program-card:hover {
          color: inherit;
          text-decoration: none;
          transform: translateY(-7px);
          box-shadow:
            0 12px 30px
            rgba(0, 0, 0, 0.14);
        }

        /* ====================================================
           TOP ACCENT
        ==================================================== */

        .program-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          border-radius:
            10px 10px 0 0;
        }

        /* ====================================================
           FLOATING ICON
        ==================================================== */

        .program-icon {
          position: absolute;
          z-index: 3;
          top: -20px;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background: #ffffff;
          color:
            var(
              --program-icon-color,
              ${BRAND}
            );
          border:
            1px solid rgba(0, 0, 0, 0.07);
          border-radius: 10px;
          box-shadow:
            0 5px 15px
            rgba(0, 0, 0, 0.14);
          font-size: 1.35rem;
          transform:
            translateX(-50%);
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease;
        }

        .program-card:hover .program-icon {
          transform:
            translateX(-50%)
            translateY(-3px);
          box-shadow:
            0 8px 20px
            rgba(0, 0, 0, 0.18);
        }

        /* ====================================================
           CARD BODY
        ==================================================== */

        .program-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding:
            2.1rem 1.35rem 1.25rem;
        }

        /* ====================================================
           NUMBER
        ==================================================== */

        .program-number {
          align-self: flex-end;
          margin-bottom: 0.15rem;
          color:
            rgba(0, 0, 0, 0.22);
          font-family:
            "Playfair Display",
            Georgia,
            serif;
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1;
        }

        /* ====================================================
           TITLE
        ==================================================== */

        .program-title {
          margin: 0 0 0.4rem;
          color:
            var(
              --color-text,
              #1d1d1d
            );
          font-family:
            "Playfair Display",
            Georgia,
            serif;
          font-size: 1.08rem;
          font-weight: 700;
          line-height: 1.3;
        }

        /* ====================================================
           SUBTITLE
        ==================================================== */

        .program-subtitle {
          margin: 0 0 0.65rem;
          color: ${BRAND};
          font-size: 0.72rem;
          font-weight: 600;
          line-height: 1.45;
        }

        /* ====================================================
           DESCRIPTION
        ==================================================== */

        .program-description {
          display: -webkit-box;
          overflow: hidden;
          margin: 0 0 0.9rem;
          color:
            var(
              --color-text-muted,
              #6c757d
            );
          font-size: 0.75rem;
          line-height: 1.55;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        /* ====================================================
           META
        ==================================================== */

        .program-meta {
          display: flex;
          flex-direction: column;
          gap: 0.38rem;
          margin-top: auto;
          margin-bottom: 1rem;
          padding-top: 0.8rem;
          border-top:
            1px solid rgba(0, 0, 0, 0.09);
        }

        .program-meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #555;
          font-size: 0.69rem;
          line-height: 1.4;
        }

        .program-meta-item i {
          flex-shrink: 0;
          width: 14px;
          color: ${BRAND};
          font-size: 0.75rem;
          text-align: center;
        }

        .program-meta-item strong {
          color: #333;
          font-weight: 700;
        }

        /* ====================================================
           VIEW DETAILS BUTTON
        ==================================================== */

        .program-details-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          width: 100%;
          min-height: 36px;
          padding:
            0.45rem 1rem;
          background: ${BRAND};
          color: #ffffff;
          border-radius: 50px;
          font-size: 0.69rem;
          font-weight: 700;
          letter-spacing: 0.25px;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .program-details-button i {
          transition:
            transform 0.25s ease;
        }

        .program-card:hover
        .program-details-button {
          background: ${BRAND_DARK};
          box-shadow:
            0 4px 14px
            rgba(165, 28, 48, 0.25);
        }

        .program-card:hover
        .program-details-button i {
          transform:
            translateX(3px);
        }

        /* ====================================================
           FOOTER
        ==================================================== */

        .programs-footer {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .programs-view-all {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          min-height: 42px;
          padding:
            0.55rem 1.7rem;
          color: #fff;
          background: transparent;
          border:
            2px solid #ffff;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .programs-view-all:hover {
          color: #ffffff;
          background: ${BRAND};
          transform: translateY(-2px);
          box-shadow:
            0 6px 18px
            rgba(165, 28, 48, 0.2);
        }

        .programs-view-all i {
          transition:
            transform 0.25s ease;
        }

        .programs-view-all:hover i {
          transform:
            translateX(3px);
        }

        /* ====================================================
           LOADING
        ==================================================== */

        .programs-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 250px;
        }

        /* ====================================================
           TABLET
        ==================================================== */

        @media (max-width: 991.98px) {
          .programs-section {
            padding:
              4.5rem 0 4rem;
          }

          .program-category {
            margin-bottom: 3.5rem;
          }

          .program-card {
            min-height: 335px;
          }
        }

        /* ====================================================
           MOBILE
        ==================================================== */

        @media (max-width: 575.98px) {
          .programs-section {
            padding:
              3.5rem 0 3.5rem;
          }

          .programs-header {
            margin-bottom: 3.5rem;
          }

          .programs-header h2 {
            font-size: 1.85rem;
          }

          .programs-header p {
            font-size: 0.84rem;
          }

          .programs-eyebrow::before,
          .programs-eyebrow::after {
            width: 18px;
          }

          .program-category {
            margin-bottom: 3.25rem;
          }

          .program-category-heading {
            gap: 0.7rem;
            margin-bottom: 2.25rem;
          }

          .program-category-heading h3 {
            font-size: 1.2rem;
          }

          .program-card {
            min-height: 315px;
          }

          .program-card-body {
            padding:
              2rem 1.15rem 1.15rem;
          }

          .program-title {
            font-size: 1rem;
          }

          .program-description {
            font-size: 0.74rem;
          }

          .program-meta-item {
            font-size: 0.68rem;
          }
        }

        /* ====================================================
           REDUCED MOTION
        ==================================================== */

        @media (prefers-reduced-motion: reduce) {
          .program-card,
          .program-icon,
          .program-details-button,
          .program-details-button i,
          .programs-view-all,
          .programs-view-all i {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProgramsSection;
