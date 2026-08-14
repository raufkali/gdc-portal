import { useState, useEffect, useRef, useCallback } from "react";
import { fetchCollection } from "../../firebase/db";
import { Link } from "react-router-dom";

// ============================================================
// FALLBACK BANNERS
// ============================================================

const FALLBACK_BANNERS = [
  {
    id: "fallback-1",
    title: "Welcome to GDC Gulabad",
    subtitle: "Excellence in Education & Research",
    bgGradient: "linear-gradient(135deg, #A51C30 0%, #1A1A1A 100%)",
  },
  {
    id: "fallback-2",
    title: "Government Degree College",
    subtitle: "Inspiring Minds, Shaping Futures",
    bgGradient:
      "linear-gradient(135deg, #1A1A1A 0%, #A51C30 50%, #1A1A1A 100%)",
  },
  {
    id: "fallback-3",
    title: "Our Programs",
    subtitle: "Explore our diverse range of academic offerings",
    bgGradient: "linear-gradient(135deg, #A51C30 0%, #2C2C2C 100%)",
  },
  {
    id: "fallback-4",
    title: "Campus Life & Activities",
    subtitle: "Beyond the Classroom – Explore, Engage, Excel",
    bgGradient: "linear-gradient(135deg, #1A1A1A 0%, #A51C30 100%)",
  },
];

const CACHE_TTL = 5 * 60 * 1000;
const AUTOPLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

// ============================================================
// COMPONENT
// ============================================================

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  // Interaction state
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // ==========================================================
  // REFS
  // ==========================================================

  const heroRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mouseStartX = useRef(0);
  const dragOffset = useRef(0);
  const didSwipe = useRef(false);
  const autoplayRef = useRef(null);

  // ==========================================================
  // FETCH BANNERS
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchBanners = async () => {
      try {
        const data = await fetchCollection(
          "banners",
          [
            {
              type: "where",
              field: "active",
              operator: "==",
              value: true,
            },
          ],
          {
            cacheTTL: CACHE_TTL,
          },
        );

        if (!isMounted) return;

        const sorted = [...data].sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );

        if (sorted.length > 0) {
          setBanners(sorted);
          setUsingFallback(false);
        } else {
          setBanners(FALLBACK_BANNERS);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);

        if (isMounted) {
          setBanners(FALLBACK_BANNERS);
          setUsingFallback(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = useCallback((bannerId) => {
    setImageErrors((prev) => ({
      ...prev,
      [bannerId]: true,
    }));
  }, []);

  // ==========================================================
  // SLIDE HELPERS
  // ==========================================================

  const goToSlide = useCallback(
    (index) => {
      if (!banners.length) return;

      const total = banners.length;

      let nextIndex = index;

      if (index < 0) {
        nextIndex = total - 1;
      }

      if (index >= total) {
        nextIndex = 0;
      }

      setActiveIndex(nextIndex);
    },
    [banners.length],
  );

  const nextSlide = useCallback(() => {
    if (banners.length <= 1) return;

    setActiveIndex((current) => (current + 1) % banners.length);
  }, [banners.length]);

  const previousSlide = useCallback(() => {
    if (banners.length <= 1) return;

    setActiveIndex((current) =>
      current === 0 ? banners.length - 1 : current - 1,
    );
  }, [banners.length]);

  // ==========================================================
  // AUTOPLAY
  // ==========================================================

  const startAutoplay = useCallback(() => {
    if (banners.length <= 1) return;

    clearInterval(autoplayRef.current);

    autoplayRef.current = setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, AUTOPLAY_INTERVAL);
  }, [banners.length, nextSlide]);

  const stopAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  }, []);

  useEffect(() => {
    if (loading || banners.length <= 1 || isInteracting || isDragging) {
      stopAutoplay();
      return;
    }

    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [
    loading,
    banners.length,
    isInteracting,
    isDragging,
    startAutoplay,
    stopAutoplay,
  ]);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      clearInterval(autoplayRef.current);
    };
  }, []);

  // ==========================================================
  // TOUCH START
  // ==========================================================

  const handleTouchStart = (event) => {
    if (banners.length <= 1) return;

    const touch = event.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;

    dragOffset.current = 0;
    didSwipe.current = false;

    setIsInteracting(true);
  };

  // ==========================================================
  // TOUCH MOVE
  // ==========================================================

  const handleTouchMove = (event) => {
    if (banners.length <= 1) return;

    const touch = event.touches[0];

    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;

    /*
      If the user is primarily scrolling vertically,
      don't interfere with the page.
    */
    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    dragOffset.current = diffX;

    if (Math.abs(diffX) > 10) {
      didSwipe.current = true;
    }
  };

  // ==========================================================
  // TOUCH END
  // ==========================================================

  const handleTouchEnd = () => {
    if (banners.length <= 1) {
      setIsInteracting(false);
      return;
    }

    const distance = dragOffset.current;

    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    dragOffset.current = 0;

    /*
      Give React/browser a moment before allowing clicks.
      This prevents a swipe from accidentally clicking the CTA.
    */
    setTimeout(() => {
      didSwipe.current = false;
    }, 80);

    setIsInteracting(false);
  };

  // ==========================================================
  // MOUSE DRAG
  // ==========================================================

  const handleMouseDown = (event) => {
    if (banners.length <= 1) return;

    /*
      Only left mouse button.
    */
    if (event.button !== 0) return;

    mouseStartX.current = event.clientX;
    dragOffset.current = 0;
    didSwipe.current = false;

    setIsDragging(true);
    setIsInteracting(true);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const diffX = event.clientX - mouseStartX.current;

    dragOffset.current = diffX;

    if (Math.abs(diffX) > 10) {
      didSwipe.current = true;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const distance = dragOffset.current;

    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    setIsDragging(false);
    setIsInteracting(false);

    dragOffset.current = 0;

    setTimeout(() => {
      didSwipe.current = false;
    }, 80);
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;

    const distance = dragOffset.current;

    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    setIsDragging(false);
    setIsInteracting(false);

    dragOffset.current = 0;

    setTimeout(() => {
      didSwipe.current = false;
    }, 80);
  };

  // ==========================================================
  // KEYBOARD
  // ==========================================================

  const handleKeyDown = (event) => {
    if (banners.length <= 1) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
    }
  };

  // ==========================================================
  // PAUSE WHEN TAB IS HIDDEN
  // ==========================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (!isInteracting && !isDragging) {
        startAutoplay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isInteracting, isDragging, startAutoplay, stopAutoplay]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <>
        <style>{`
          .hero-loading {
            height: 100vh;

            background:
              radial-gradient(
                circle at 30% 50%,
                rgba(165, 28, 48, 0.18),
                transparent 45%
              ),
              #101010;

            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;
            overflow: hidden;
          }

          .hero-loading::before {
            content: "";

            position: absolute;

            width: 500px;
            height: 500px;

            border-radius: 50%;

            border:
              1px solid
              rgba(255,255,255,0.08);

            animation:
              loadingPulse
              2s
              ease-in-out
              infinite;
          }

          .hero-loader {
            width: 52px;
            height: 52px;

            border-radius: 50%;

            border:
              2px solid
              rgba(255,255,255,0.12);

            border-top-color: #A51C30;

            animation:
              heroSpin
              0.9s
              linear
              infinite;

            position: relative;
            z-index: 2;
          }

          @keyframes heroSpin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes loadingPulse {
            0%, 100% {
              transform: scale(0.8);
              opacity: 0.3;
            }

            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
          }
        `}</style>

        <div className="hero-loading">
          <div className="hero-loader" />
        </div>
      </>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (!banners || banners.length === 0) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <style>{`

        /* =====================================================
           HERO
        ===================================================== */

        .gdc-hero {
          --hero-red: #A51C30;
          --hero-red-dark: #7A1523;

          height: 100vh;

          position: relative;

          overflow: hidden;

          background: #111;

          isolation: isolate;

          /*
            IMPORTANT:
            Allows horizontal touch gestures while still
            allowing normal vertical page scrolling.
          */
          touch-action: pan-y;

          user-select: none;

          cursor: grab;
        }

        .gdc-hero.is-dragging {
          cursor: grabbing;
        }

        /* =====================================================
           TRACK
        ===================================================== */

        .gdc-hero-track {
          position: relative;

          width: 100%;
          height: 100%;

          overflow: hidden;
        }

        /* =====================================================
           SLIDE
        ===================================================== */

        .gdc-hero-slide {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          opacity: 0;

          visibility: hidden;

          transform: translateX(35px) scale(1.01);

          transition:
            opacity 0.7s ease,
            transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
            visibility 0.7s ease;

          pointer-events: none;

          overflow: hidden;

          background: #111;
        }

        .gdc-hero-slide.active {
          opacity: 1;

          visibility: visible;

          transform:
            translateX(0)
            scale(1);

          pointer-events: auto;

          z-index: 2;
        }

        /*
          Previous slide leaves toward the left.
        */

        .gdc-hero-slide.leaving {
          opacity: 0;

          transform:
            translateX(-35px)
            scale(0.99);

          visibility: visible;

          z-index: 1;
        }

        /* =====================================================
           IMAGE
        ===================================================== */

        .gdc-hero-image {
          position: absolute;

          inset: -3%;

          width: 106%;
          height: 106%;

          object-fit: cover;

          transform: scale(1.04);

          transition:
            transform 7s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.8s ease;

          filter: saturate(0.95);

          pointer-events: none;
        }

        .gdc-hero-slide.active .gdc-hero-image {
          transform: scale(1.11);
        }

        /* =====================================================
           FALLBACK
        ===================================================== */

        .gdc-hero-fallback {
          position: absolute;

          inset: 0;

          transform: scale(1.02);

          transition:
            transform 8s
            cubic-bezier(0.16, 1, 0.3, 1);

          pointer-events: none;
        }

        .gdc-hero-slide.active
          .gdc-hero-fallback {
          transform: scale(1.09);
        }

        /* =====================================================
           OVERLAY
        ===================================================== */

        .gdc-hero-overlay {
          position: absolute;

          inset: 0;

          z-index: 1;

          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.82) 0%,
              rgba(0, 0, 0, 0.58) 34%,
              rgba(0, 0, 0, 0.28) 68%,
              rgba(0, 0, 0, 0.20) 100%
            );

          pointer-events: none;
        }

        .gdc-hero-overlay::after {
          content: "";

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              0deg,
              rgba(0,0,0,0.55) 0%,
              transparent 28%,
              transparent 70%,
              rgba(0,0,0,0.18) 100%
            );
        }

        /* =====================================================
           RED GLOW
        ===================================================== */

        .gdc-hero-glow {
          position: absolute;

          width: 600px;
          height: 600px;

          left: -260px;
          top: 50%;

          transform:
            translateY(-50%);

          background:
            radial-gradient(
              circle,
              rgba(165, 28, 48, 0.20) 0%,
              rgba(165, 28, 48, 0.08) 35%,
              transparent 70%
            );

          filter: blur(20px);

          z-index: 1;

          pointer-events: none;
        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .gdc-hero-content {
          position: absolute;

          left: 0;
          top: 50%;

          width: 100%;
        
          transform:
            translateY(-50%);

          z-index: 3;

          pointer-events: none;
        }

        .gdc-hero-container {
          width:
            min(1200px, 100%);

          margin: 0 auto;

          padding-left: 7%;
          padding-right: 7%;
        }

        .gdc-hero-copy {
          max-width: 760px;

          pointer-events: auto;
        }

        /* =====================================================
           EYEBROW
        ===================================================== */

        .gdc-hero-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 20px;

          font-size: 0.78rem;

          font-weight: 700;

          letter-spacing: 0.22em;

          text-transform: uppercase;

          color:
            rgba(255,255,255,0.88);

          opacity: 0;

          transform:
            translateY(25px);

          transition:
            opacity 0.7s ease 0.1s,
            transform
              0.8s
              cubic-bezier(0.16, 1, 0.3, 1)
              0.1s;
        }

        .gdc-hero-eyebrow::before {
          content: "";

          width: 36px;
          height: 2px;

          background:
            var(--hero-red);

          box-shadow:
            0 0 12px
            rgba(165,28,48,0.8);
        }

        .gdc-hero-slide.active
          .gdc-hero-eyebrow {
          opacity: 1;

          transform:
            translateY(0);
        }

        /* =====================================================
           TITLE
        ===================================================== */

        .gdc-hero-title {
          margin:
            0 0 22px;

          max-width: 760px;

          color: #fff;

          font-family:
            "Playfair Display",
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              2.15rem,
              4.4vw,
              4.25rem
            );

          line-height: 1.04;

          letter-spacing: -0.025em;

          font-weight: 700;

          text-wrap: balance;

          overflow-wrap: anywhere;

          hyphens: auto;

          text-shadow:
            0 3px 25px
            rgba(0,0,0,0.5);

          opacity: 0;

          transform:
            translateY(45px)
            scale(0.98);

          filter: blur(5px);

          transition:
            opacity 0.85s ease 0.18s,
            transform
              1s
              cubic-bezier(0.16, 1, 0.3, 1)
              0.18s,
            filter 0.85s ease 0.18s;
        }

        .gdc-hero-slide.active
          .gdc-hero-title {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          filter: blur(0);
        }

        /* =====================================================
           SUBTITLE
        ===================================================== */

        .gdc-hero-subtitle {
          max-width: 620px;

          margin:
            0 0 30px;

          color:
            rgba(255,255,255,0.88);

          font-size:
            clamp(
              1rem,
              1.45vw,
              1.25rem
            );

          line-height: 1.65;

          font-weight: 350;

          text-wrap: pretty;

          overflow-wrap: anywhere;

          text-shadow:
            0 2px 14px
            rgba(0,0,0,0.6);

          opacity: 0;

          transform:
            translateY(30px);

          transition:
            opacity 0.8s ease 0.35s,
            transform
              0.9s
              cubic-bezier(0.16, 1, 0.3, 1)
              0.35s;
        }

        .gdc-hero-slide.active
          .gdc-hero-subtitle {
          opacity: 1;

          transform:
            translateY(0);
        }

        /* =====================================================
           CTA
        ===================================================== */

        .gdc-hero-actions {
          display: flex;

          align-items: center;

          gap: 18px;

          opacity: 0;

          transform:
            translateY(25px);

          transition:
            opacity 0.8s ease 0.5s,
            transform
              0.9s
              cubic-bezier(0.16, 1, 0.3, 1)
              0.5s;
        }

        .gdc-hero-slide.active
          .gdc-hero-actions {
          opacity: 1;

          transform:
            translateY(0);
        }

        .gdc-hero-cta {
          position: relative;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          min-height: 52px;

          padding:
            0.82rem
            1.55rem;

          border:
            1px solid
            rgba(255,255,255,0.12);

          border-radius: 100px;

          background:
            linear-gradient(
              135deg,
              #A51C30,
              #8c1829
            );

          color: #fff;

          font-size: 0.92rem;

          font-weight: 700;

          letter-spacing: 0.01em;

          text-decoration: none;

          box-shadow:
            0 12px 35px
            rgba(165,28,48,0.28);

          overflow: hidden;

          transition:
            transform 0.35s
              cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.35s ease,
            background 0.35s ease;
        }

        .gdc-hero-cta::before {
          content: "";

          position: absolute;

          top: 0;
          left: -120%;

          width: 80%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.28),
              transparent
            );

          transform:
            skewX(-20deg);

          transition:
            left 0.65s ease;
        }

        .gdc-hero-cta:hover {
          color: #fff;

          transform:
            translateY(-4px)
            scale(1.02);

          background:
            linear-gradient(
              135deg,
              #b8213a,
              #941a2c
            );

          box-shadow:
            0 18px 45px
            rgba(165,28,48,0.42);
        }

        .gdc-hero-cta:hover::before {
          left: 140%;
        }

        .gdc-hero-cta-arrow {
          display: inline-block;

          font-size: 1.15rem;

          transition:
            transform 0.3s ease;
        }

        .gdc-hero-cta:hover
          .gdc-hero-cta-arrow {
          transform:
            translateX(4px);
        }

        /* =====================================================
           COUNTER
        ===================================================== */

        .gdc-hero-counter {
          position: absolute;

          right: 7%;
          bottom: 34px;

          z-index: 10;

          display: flex;

          align-items: center;

          gap: 10px;

          color:
            rgba(255,255,255,0.75);

          font-size: 0.75rem;

          letter-spacing: 0.12em;

          pointer-events: none;
        }

        .gdc-hero-counter-current {
          color: #fff;

          font-size: 1rem;

          font-weight: 700;
        }

        .gdc-hero-counter-line {
          width: 42px;
          height: 1px;

          background:
            rgba(255,255,255,0.35);
        }

        /* =====================================================
           PROGRESS BAR
        ===================================================== */

        .gdc-hero-progress {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 100%;
          height: 3px;

          background:
            rgba(255,255,255,0.12);

          z-index: 20;

          pointer-events: none;
        }

        .gdc-hero-progress-fill {
          width: 100%;
          height: 100%;

          transform-origin:
            left center;

          background:
            linear-gradient(
              90deg,
              #A51C30,
              #d33a52
            );

          animation:
            heroProgress
            5s
            linear
            infinite;
        }

        .gdc-hero-progress-fill.paused {
          animation-play-state: paused;
        }

        @keyframes heroProgress {
          from {
            transform:
              scaleX(0);
          }

          to {
            transform:
              scaleX(1);
          }
        }

        /* =====================================================
           SIDE LABEL
        ===================================================== */

        .gdc-hero-side-label {
          position: absolute;

          right: -52px;
          top: 50%;

          z-index: 4;

          transform:
            translateY(-50%)
            rotate(90deg);

          color:
            rgba(255,255,255,0.38);

          font-size: 0.62rem;

          font-weight: 700;

          letter-spacing: 0.3em;

          text-transform: uppercase;

          pointer-events: none;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 991px) {

          .gdc-hero {
            height: 100vh;

          }

          .gdc-hero-container {
            padding-left: 6%;
            padding-right: 6%;
          }

          .gdc-hero-copy {
            max-width: 680px;
          }

          .gdc-hero-title {
            font-size:
              clamp(
                2.15rem,
                6vw,
                3.6rem
              );
          }

          .gdc-hero-overlay {
            background:
              linear-gradient(
                90deg,
                rgba(0,0,0,0.78),
                rgba(0,0,0,0.38)
              );
          }

          .gdc-hero-side-label {
            display: none;
          }

          .gdc-hero-counter {
            right: 6%;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767px) {

          .gdc-hero {
            height: 100vh;



            /*
              Very important for mobile:
              horizontal gesture is handled by the carousel,
              vertical gesture remains available for page scroll.
            */
            touch-action: pan-y;
          }

          .gdc-hero-container {
            padding-left: 24px;
            padding-right: 24px;
          }

          .gdc-hero-content {
            top: 52%;
          }

          .gdc-hero-copy {
            max-width: 100%;
          }

          .gdc-hero-eyebrow {
            margin-bottom: 15px;

            font-size: 0.68rem;

            letter-spacing: 0.16em;
          }

          .gdc-hero-eyebrow::before {
            width: 25px;
          }

          .gdc-hero-title {
            max-width: 100%;

            margin-bottom: 16px;

            font-size:
              clamp(
                2rem,
                9vw,
                2.9rem
              );

            line-height: 1.05;

            letter-spacing: -0.02em;
          }

          .gdc-hero-subtitle {
            max-width: 100%;

            margin-bottom: 24px;

            font-size: 0.98rem;

            line-height: 1.55;
          }

          .gdc-hero-actions {
            gap: 12px;
          }

          .gdc-hero-cta {
            min-height: 48px;

            padding:
              0.7rem
              1.25rem;

            font-size: 0.84rem;
          }

          /*
            We intentionally hide:
            - arrows
            - dots
            - indicators

            Swipe still works because it is handled
            directly by React touch events.
          */

          .gdc-hero-counter {
            right: 24px;

            bottom: 25px;

            font-size: 0.65rem;
          }

          .gdc-hero-counter-current {
            font-size: 0.82rem;
          }

          .gdc-hero-counter-line {
            width: 24px;
          }

          .gdc-hero-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,0.35) 0%,
                rgba(0,0,0,0.50) 40%,
                rgba(0,0,0,0.78) 100%
              );
          }

          .gdc-hero-glow {
            width: 400px;
            height: 400px;

            left: -250px;
          }
        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .gdc-hero {
            height: 100vh;
          }

          .gdc-hero-title {
            font-size:
              clamp(
                1.85rem,
                9vw,
                2.45rem
              );
          }

          .gdc-hero-subtitle {
            font-size: 0.9rem;
          }

          .gdc-hero-cta {
            width: auto;

            padding-left: 1.05rem;
            padding-right: 1.05rem;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .gdc-hero-slide,
          .gdc-hero *,
          .gdc-hero *::before,
          .gdc-hero *::after {

            transition-duration:
              0.01ms !important;
          }

          .gdc-hero-progress-fill {
            animation: none !important;
          }

          .gdc-hero-image,
          .gdc-hero-fallback {
            transform: none !important;
          }
        }

      `}</style>

      <div
        ref={heroRef}
        className={`gdc-hero ${isDragging ? "is-dragging" : ""}`}
        tabIndex="0"
        role="region"
        aria-label="GDC Gulabad featured banners"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* ====================================================
            SLIDES
        ==================================================== */}

        <div className="gdc-hero-track">
          {banners.map((banner, index) => {
            const isFallback = banner.bgGradient !== undefined;

            const hasImageError = imageErrors[banner.id];

            const isActive = index === activeIndex;

            const previousIndex =
              activeIndex === 0 ? banners.length - 1 : activeIndex - 1;

            const isLeaving =
              index === previousIndex && !isActive && isInteracting === false;

            return (
              <div
                key={banner.id}
                className={`
                  gdc-hero-slide
                  ${isActive ? "active" : ""}
                  ${isLeaving ? "leaving" : ""}
                `}
                aria-hidden={!isActive}
              >
                {/* ==================================================
                    BACKGROUND
                ================================================== */}

                {isFallback ? (
                  <div
                    className="gdc-hero-fallback"
                    style={{
                      background: banner.bgGradient,
                    }}
                  />
                ) : banner.imageUrl && !hasImageError ? (
                  <img
                    src={banner.imageUrl}
                    className="gdc-hero-image"
                    alt={banner.title || "GDC Gulabad banner"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                    fetchpriority={index === 0 ? "high" : "low"}
                    draggable={false}
                    onError={() => handleImageError(banner.id)}
                  />
                ) : (
                  <div
                    className="gdc-hero-fallback"
                    style={{
                      background: "linear-gradient(135deg, #A51C30, #1A1A1A)",
                    }}
                  />
                )}

                {/* ==================================================
                    OVERLAY
                ================================================== */}

                <div className="gdc-hero-overlay" />

                <div className="gdc-hero-glow" aria-hidden="true" />

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="gdc-hero-content">
                  <div className="gdc-hero-container">
                    <div className="gdc-hero-copy">
                      <div className="gdc-hero-eyebrow">GDC - Gulabad</div>

                      <h1 className="gdc-hero-title">{banner.title}</h1>

                      {banner.subtitle && (
                        <p className="gdc-hero-subtitle">{banner.subtitle}</p>
                      )}

                      <div className="gdc-hero-actions">
                        <Link
                          to="/programs"
                          className="gdc-hero-cta"
                          aria-label="Explore academic programs"
                          onClick={(event) => {
                            /*
                              Don't follow CTA if this interaction
                              was actually a swipe.
                            */
                            if (didSwipe.current) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <span>Explore Programs</span>

                          <span
                            className="gdc-hero-cta-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            COUNTER
            No indicators / dots / arrows
        ======================================================== */}

        {banners.length > 1 && (
          <div className="gdc-hero-counter" aria-hidden="true">
            <span className="gdc-hero-counter-current">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <span className="gdc-hero-counter-line" />

            <span>{String(banners.length).padStart(2, "0")}</span>
          </div>
        )}

        {/* ========================================================
            SIDE LABEL
        ======================================================== */}

        <div className="gdc-hero-side-label" aria-hidden="true">
          Excellence • Education • Future
        </div>

        {/* ========================================================
            PROGRESS
        ======================================================== */}

        {banners.length > 1 && (
          <div className="gdc-hero-progress">
            <div
              key={`${activeIndex}-${isInteracting}`}
              className={`gdc-hero-progress-fill ${
                isInteracting ? "paused" : ""
              }`}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HeroCarousel;
