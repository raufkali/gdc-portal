import { useState, useEffect, useMemo, useRef } from "react";
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
    keywords: ["mathematics", "math"],
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
// DECK STACK GEOMETRY
//
// Cards behind the front card are aligned in a neat,
// orderly stack. Each deeper card simply scales down
// slightly and shifts down a little, so the peeking edges
// read as a clean, predictable deck in order.
// ============================================================

const getStackTransform = (stackPosition) => {
  const scale = 1 - stackPosition * 0.05;
  const translateY = stackPosition * 14;

  return `translate3d(0, ${translateY}px, 0) scale(${scale})`;
};

// ============================================================
// REVEAL ON SCROLL HOOK
//
// Observes an element and flips `revealed` to true the first
// time it enters the viewport. Used to stage the deck so the
// cards "come forward" with a small stagger instead of all
// snapping into place on mount.
// ============================================================

const useInView = (options) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    // If IntersectionObserver isn't available, just reveal.
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      });
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return [ref, revealed];
};

// ============================================================
// MOBILE PROGRAM CARD
// ============================================================

const MobileProgramCard = ({
  program,
  index,
  stackPosition,
  dragX,
  isDragging,
  isExiting,
  exitDirection,
  revealed,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  suppressClickRef,
}) => {
  const iconData = getProgramIcon(program);

  const isFront = stackPosition === 0;

  let transform = "";

  if (isFront) {
    if (isDragging) {
      // Gentle, proportional rotation while dragging.
      const rotation = dragX * 0.04;

      transform = `translate3d(${dragX}px, 0, 0) rotate(${rotation}deg)`;
    } else if (isExiting) {
      // Softer exit: less rotation, less vertical drift, so
      // the card glides away instead of snapping off-screen.
      const direction = exitDirection === "left" ? -1 : 1;

      transform = `translate3d(${direction * 115}vw, 10px, 0) rotate(${
        direction * 10
      }deg)`;
    } else {
      transform = "translate3d(0, 0, 0) rotate(0deg)";
    }
  } else {
    transform = getStackTransform(stackPosition);
  }

  // Keep three cards clearly visible (front + two behind);
  // anything deeper fades out so it can seamlessly become
  // the newly revealed card once the stack advances.
  const opacity = stackPosition > 2 ? 0 : 1;

  // Exiting cards fade slightly as they leave for a smoother
  // visual handoff to the card being revealed underneath.
  const cardOpacity = isExiting && isFront ? 0.35 : opacity;

  /*
    Scroll reveal staging:

    When the deck is still hidden (revealed === false), the
    cards sit pushed slightly forward / down and faded out.
    Once the observer flips `revealed` to true, each card
    transitions into its real position — with a per-card
    delay (stackPosition * 90ms) so the front card arrives
    first and the ones behind ease in after it. This is what
    makes the rest of the deck "come forward" smoothly.

    The reveal transform is only applied while not dragging
    and not exiting, so the swipe / exit animation is never
    fought by the entrance animation.
  */
  const isAnimatingDeck = isDragging || isExiting;

  const revealStyle =
    !revealed && !isAnimatingDeck
      ? {
          transform: `translate3d(0, ${28 + stackPosition * 10}px, 0) scale(${
            0.9 - stackPosition * 0.03
          })`,
          opacity: 0,
          transition:
            "transform 720ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms ease",
          transitionDelay: `${stackPosition * 90}ms`,
        }
      : null;

  return (
    <div
      className={`mobile-program-deck-card ${
        isFront ? "mobile-program-deck-card-front" : ""
      } ${isDragging && isFront ? "mobile-program-deck-card-dragging" : ""}`}
      style={{
        ...(revealStyle
          ? revealStyle
          : {
              transform,
              opacity: cardOpacity,
              transition:
                isDragging && isFront
                  ? "none"
                  : isExiting && isFront
                    ? "transform 620ms cubic-bezier(0.22, 0.61, 0.24, 1), opacity 560ms ease"
                    : "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
            }),
        zIndex: 20 - stackPosition,
        pointerEvents: isFront ? "auto" : "none",
      }}
      onPointerDown={isFront ? onPointerDown : undefined}
      onPointerMove={isFront ? onPointerMove : undefined}
      onPointerUp={isFront ? onPointerUp : undefined}
      onPointerCancel={isFront ? onPointerCancel : undefined}
    >
      <Link
        to={`/programs/${program.slug || program.id}`}
        className="mobile-program-card-link"
        onClick={(event) => {
          if (suppressClickRef.current) {
            event.preventDefault();
            event.stopPropagation();

            suppressClickRef.current = false;
          }
        }}
      >
        {/* Accent */}
        <div
          className="mobile-program-card-accent"
          style={{
            backgroundColor: iconData.color,
          }}
        />

        {/* Icon */}
        <div
          className="mobile-program-card-icon"
          style={{
            backgroundColor: iconData.color,
          }}
          aria-hidden="true"
        >
          <i className={`bi ${iconData.icon}`} />
        </div>

        {/* Content */}
        <div className="mobile-program-card-body">
          <div className="mobile-program-card-top">
            <span className="mobile-program-card-label">Academic Program</span>

            <span className="mobile-program-card-number">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h4 className="mobile-program-card-title">{program.title}</h4>

          {program.subtitle && (
            <p className="mobile-program-card-subtitle">{program.subtitle}</p>
          )}

          {program.description && (
            <p className="mobile-program-card-description">
              {program.description}
            </p>
          )}

          <div className="mobile-program-card-meta">
            {program.duration && (
              <div className="mobile-program-card-meta-item">
                <i className="bi bi-clock" aria-hidden="true" />

                <span>
                  <strong>Duration:</strong> {program.duration}
                </span>
              </div>
            )}

            {program.category && (
              <div className="mobile-program-card-meta-item">
                <i className="bi bi-building" aria-hidden="true" />

                <span>
                  <strong>Faculty:</strong> {program.category}
                </span>
              </div>
            )}

            {program.fee && (
              <div className="mobile-program-card-meta-item">
                <i className="bi bi-wallet2" aria-hidden="true" />

                <span>
                  <strong>Fee:</strong> {program.fee}
                </span>
              </div>
            )}
          </div>

          <div className="mobile-program-card-details">
            <span>View Details</span>

            <i className="bi bi-arrow-right" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </div>
  );
};

// ============================================================
// MOBILE PROGRAM DECK
// ============================================================

const MobileProgramDeck = ({ items, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [dragX, setDragX] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [isExiting, setIsExiting] = useState(false);

  const [exitDirection, setExitDirection] = useState(null);

  const pointerStartX = useRef(0);

  const pointerStartY = useRef(0);

  const pointerId = useRef(null);

  const suppressClickRef = useRef(false);

  const animationTimerRef = useRef(null);

  const DRAG_THRESHOLD = 80;

  // Must match the exit transition duration in the card so
  // the index swap happens right as the flying card clears.
  const EXIT_DURATION = 30;

  // Scroll reveal for the whole deck stage. `rootMargin`
  // makes the deck start animating slightly *before* it
  // fully scrolls into view, so the motion feels natural
  // rather than triggered right at the edge.
  const [deckRef, deckRevealed] = useInView({
    threshold: 0.18,
    rootMargin: "0px 0px -60px 0px",
  });

  const getWrappedIndex = (index) => {
    if (!items.length) return 0;

    return ((index % items.length) + items.length) % items.length;
  };

  const getCardAtOffset = (offset) => {
    return items[getWrappedIndex(currentIndex + offset)];
  };

  const advanceToNext = (direction) => {
    if (!items.length) return;

    setExitDirection(direction);
    setIsExiting(true);

    suppressClickRef.current = true;

    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }

    animationTimerRef.current = setTimeout(() => {
      setCurrentIndex((previous) => getWrappedIndex(previous + 1));

      setDragX(0);
      setIsExiting(false);
      setExitDirection(null);
      setIsDragging(false);
    }, EXIT_DURATION);
  };

  const resetDrag = () => {
    setDragX(0);
    setIsDragging(false);
  };

  const handlePointerDown = (event) => {
    if (isExiting) return;

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    pointerId.current = event.pointerId;

    pointerStartX.current = event.clientX;

    pointerStartY.current = event.clientY;

    setIsDragging(true);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is not supported in every environment.
    }
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;

    if (pointerId.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - pointerStartX.current;

    const deltaY = event.clientY - pointerStartY.current;

    /*
      If the user is scrolling vertically, don't fight
      against the browser's normal page scrolling.
    */
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
      setIsDragging(false);
      setDragX(0);
      return;
    }

    /*
      Small resistance when dragging beyond a comfortable
      range makes the deck feel physical.
    */
    const resistance = Math.abs(deltaX) > 180 ? 0.72 : 1;

    setDragX(deltaX * resistance);

    if (Math.abs(deltaX) > 8) {
      suppressClickRef.current = true;
    }
  };

  const handlePointerUp = (event) => {
    if (!isDragging) return;

    if (pointerId.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - pointerStartX.current;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore unsupported pointer capture.
    }

    pointerId.current = null;

    if (Math.abs(deltaX) >= DRAG_THRESHOLD) {
      // Either direction just moves to the next card — the
      // fly-off direction simply mirrors the swipe.
      advanceToNext(deltaX < 0 ? "left" : "right");

      return;
    }

    /*
      Not enough movement — spring the card back to its
      original position.
    */
    setDragX(0);

    setTimeout(() => {
      setIsDragging(false);
    }, 320);
  };

  const handlePointerCancel = () => {
    pointerId.current = null;
    resetDrag();
  };

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    /*
      Reset a category's deck if its Firebase contents
      change significantly.
    */
    setCurrentIndex(0);
    setDragX(0);
    setIsExiting(false);
    setExitDirection(null);
    setIsDragging(false);
  }, [category, items.length]);

  if (!items.length) {
    return null;
  }

  /*
    Render the current card plus several cards behind it.

    Offset:
      0 → current/front
      1 → next
      2 → next + 1
      3 → hidden buffer (fades in as the stack advances)
  */
  const visibleCards = [0, 1, 2, 3]
    .map((offset) => ({
      program: getCardAtOffset(offset),
      offset,
    }))
    .filter((entry) => entry.program);

  return (
    <div
      ref={deckRef}
      className="mobile-program-deck"
      aria-label={`${category} programs`}
    >
      {/* ==================================================
          DECK
      =================================================== */}

      <div className="mobile-program-deck-stage">
        {visibleCards.map(({ program, offset }) => (
          <MobileProgramCard
            key={`${program.id}-${offset}`}
            program={program}
            index={getWrappedIndex(currentIndex + offset)}
            stackPosition={offset}
            dragX={dragX}
            isDragging={isDragging}
            isExiting={isExiting}
            exitDirection={exitDirection}
            revealed={deckRevealed}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            suppressClickRef={suppressClickRef}
          />
        ))}
      </div>

      {/* ==================================================
          DECK CONTROLS / HINT
      =================================================== */}

      {items.length > 1 && (
        <div className="mobile-program-deck-hint mt-5 pt-3">
          <span>
            <i className="bi bi-arrow-left" />
            <i className="bi bi-arrow-right" />
            Swipe for next
          </span>
        </div>
      )}
    </div>
  );
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
      <section className="programs-section" aria-labelledby="programs-heading">
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
                    DESKTOP GRID
                ================================================== */}

              <div className="program-desktop-grid row g-4">
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
                        {/* CARD TOP ACCENT */}

                        <div
                          className="program-card-accent"
                          style={{
                            backgroundColor: iconData.color,
                          }}
                        />

                        {/* FLOATING ICON */}

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

                        {/* CARD CONTENT */}

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

                          {/* META */}

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

                          {/* VIEW DETAILS */}

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

              {/* =================================================
                    MOBILE DECK
                ================================================== */}

              <div className="program-mobile-deck-wrapper">
                <MobileProgramDeck items={items} category={category} />
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
          color:
            var(
              --color-text,
              #1d1d1d
            );
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
          color: #ffff;
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
          background: rgb(255, 255, 255);
        }

        /* ====================================================
           DESKTOP PROGRAM GRID
        ==================================================== */

        .program-desktop-grid {
          display: flex;
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
            var(
              --card-bg,
              #f8f7f2
            );
          color: inherit;
          text-decoration: none;
          border:
            1px solid
            rgba(0, 0, 0, 0.08);
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
            1px solid
            rgba(0, 0, 0, 0.07);
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
            1px solid
            rgba(0, 0, 0, 0.09);
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
          transform:
            translateY(-2px);
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
           MOBILE DECK IS HIDDEN BY DEFAULT
        ==================================================== */

        .program-mobile-deck-wrapper {
          display: none;
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
           MOBILE — DECK OF CARDS EFFECT ONLY LIVES HERE
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
            margin-bottom: 4.2rem;
          }

          .program-category-heading {
            gap: 0.7rem;
            margin-bottom: 2.5rem;
          }

          .program-category-heading h3 {
            font-size: 1.2rem;
          }

          /* ==================================================
             HIDE NORMAL GRID
          =================================================== */

          .program-desktop-grid {
            display: none !important;
          }

          /* ==================================================
             SHOW DECK
          =================================================== */

          .program-mobile-deck-wrapper {
            display: block;
            width: 100%;
          }

          .mobile-program-deck {
            position: relative;
            width: 100%;
            padding:
              0 0 0.75rem;
          }

          /*
            This is the physical area in which the deck lives.
            Extra top/side padding gives the stacked cards
            behind the front one room to peek out without
            being clipped.
          */

          .mobile-program-deck-stage {
            position: relative;
            width: 100%;
            height: 430px;
            padding: 14px 10px 0;
            touch-action: pan-y;
            user-select: none;
            -webkit-user-select: none;
          }

          /*
            Every card is absolutely positioned so that
            cards can sit behind each other.
          */

          .mobile-program-deck-card {
            position: absolute;
            top: 14px;
            left: 10px;
            right: 10px;
            bottom: 0;
            will-change:
              transform,
              opacity;
            transform-origin:
              center bottom;
          }

          .mobile-program-deck-card-front {
            cursor: grab;
          }

          .mobile-program-deck-card-front:active {
            cursor: grabbing;
          }

          .mobile-program-deck-card-dragging {
            cursor: grabbing;
          }

          /*
            The actual card.
          */

          .mobile-program-card-link {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            color: inherit;
            text-decoration: none;
            background:
              var(
                --card-bg,
                #f8f7f2
              );
            border:
              1px solid
              rgba(0, 0, 0, 0.08);
            border-radius: 18px;
            box-shadow:
              0 16px 35px
              rgba(0, 0, 0, 0.22),
              0 4px 10px
              rgba(0, 0, 0, 0.10);
          }

          .mobile-program-card-link:hover {
            color: inherit;
            text-decoration: none;
          }

          /*
            Slightly stronger shadow on the front card so it
            visibly lifts off the cards stacked behind it.
          */

          .mobile-program-deck-card-front
          .mobile-program-card-link {
            box-shadow:
              0 20px 45px
              rgba(0, 0, 0, 0.28),
              0 6px 14px
              rgba(0, 0, 0, 0.14);
          }

          /*
            Cards further back get a flatter, softer shadow —
            reinforces the sense of depth in the stack.
          */

          .mobile-program-deck-card:not(.mobile-program-deck-card-front)
          .mobile-program-card-link {
            box-shadow:
              0 8px 18px
              rgba(0, 0, 0, 0.18);
          }

          /* ==================================================
             ACCENT
          =================================================== */

          .mobile-program-card-accent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            z-index: 2;
          }

          /* ==================================================
             ICON
          =================================================== */

          .mobile-program-card-icon {
            position: absolute;
            top: 24px;
            left: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 54px;
            height: 54px;
            color: #fff;
            border-radius: 14px;
            box-shadow:
              0 7px 18px
              rgba(0, 0, 0, 0.16);
            font-size: 1.4rem;
          }

          /* ==================================================
             BODY
          =================================================== */

          .mobile-program-card-body {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            padding:
              1.65rem 1.25rem 1.2rem;
          }

          /* ==================================================
             TOP
          =================================================== */

          .mobile-program-card-top {
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            min-height: 48px;
            margin-bottom: 0.9rem;
          }

          .mobile-program-card-label {
            display: none;
          }

          .mobile-program-card-number {
            color:
              rgba(0, 0, 0, 0.2);
            font-family:
              "Playfair Display",
              Georgia,
              serif;
            font-size: 0.9rem;
            font-weight: 700;
          }

          /* ==================================================
             TITLE
          =================================================== */

          .mobile-program-card-title {
            margin: 0 0 0.45rem;
            padding-right: 0.25rem;
            color:
              var(
                --color-text,
                #1d1d1d
              );
            font-family:
              "Playfair Display",
              Georgia,
              serif;
            font-size: 1.35rem;
            font-weight: 700;
            line-height: 1.25;
          }

          /* ==================================================
             SUBTITLE
          =================================================== */

          .mobile-program-card-subtitle {
            margin:
              0 0 0.75rem;
            color: ${BRAND};
            font-size: 0.76rem;
            font-weight: 700;
            line-height: 1.45;
          }

          /* ==================================================
             DESCRIPTION
          =================================================== */

          .mobile-program-card-description {
            display: -webkit-box;
            overflow: hidden;
            margin:
              0 0 0.9rem;
            color:
              var(
                --color-text-muted,
                #6c757d
              );
            font-size: 0.76rem;
            line-height: 1.6;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }

          /* ==================================================
             META
          =================================================== */

          .mobile-program-card-meta {
            display: flex;
            flex-direction: column;
            gap: 0.42rem;
            margin-top: auto;
            margin-bottom: 0.9rem;
            padding-top: 0.8rem;
            border-top:
              1px solid
              rgba(0, 0, 0, 0.09);
          }

          .mobile-program-card-meta-item {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            color: #555;
            font-size: 0.69rem;
            line-height: 1.35;
          }

          .mobile-program-card-meta-item i {
            flex-shrink: 0;
            width: 15px;
            color: ${BRAND};
            font-size: 0.76rem;
            text-align: center;
          }

          .mobile-program-card-meta-item strong {
            color: #333;
            font-weight: 700;
          }

          /* ==================================================
             DETAILS
          =================================================== */

          .mobile-program-card-details {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            min-height: 40px;
            padding:
              0.55rem 1rem;
            color: #fff;
            background: ${BRAND};
            border-radius: 50px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }

          .mobile-program-card-details i {
            transition:
              transform 0.2s ease;
          }

          .mobile-program-card-link:active
          .mobile-program-card-details i {
            transform:
              translateX(3px);
          }

          /* ==================================================
             SWIPE HINT
          =================================================== */

          .mobile-program-deck-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.65rem;
            margin-top: 1.05rem;
            color:
              rgba(255, 255, 255, 0.68);
            font-size: 0.62rem;
            font-weight: 600;
            letter-spacing: 1.2px;
            text-transform: uppercase;
          }

          .mobile-program-deck-hint span {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }

          .mobile-program-deck-hint i {
            font-size: 0.7rem;
          }

          /* ==================================================
             SMALL PHONES
          =================================================== */

          @media (max-width: 380px) {

            .mobile-program-deck-stage {
              height: 415px;
            }

            .mobile-program-card-icon {
              top: 20px;
              left: 20px;
              width: 50px;
              height: 50px;
              border-radius: 13px;
              font-size: 1.25rem;
            }

            .mobile-program-card-body {
              padding:
                1.45rem 1rem 1rem;
            }

            .mobile-program-card-title {
              font-size: 1.2rem;
            }

            .mobile-program-card-description {
              font-size: 0.73rem;
              -webkit-line-clamp: 3;
            }

            .mobile-program-card-meta-item {
              font-size: 0.65rem;
            }
          }
        }

        /* ====================================================
           REDUCED MOTION
        ==================================================== */

        @media (prefers-reduced-motion: reduce) {

          .mobile-program-deck-card,
          .mobile-program-card-details i,
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
