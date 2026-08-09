import { useState, useEffect, useRef } from "react";
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

// ============================================================
// COMPONENT
// ============================================================

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselRef = useRef(null);
  const contentRefs = useRef([]);
  const imageRefs = useRef([]);
  const progressRef = useRef(null);

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
  // SLIDE EVENT LISTENER
  // ==========================================================

  useEffect(() => {
    const carouselElement = document.getElementById("heroCarousel");

    if (!carouselElement) return;

    const handleSlide = (event) => {
      const newIndex = event.to;

      setActiveIndex(newIndex);

      // Reset progress animation
      if (progressRef.current) {
        progressRef.current.style.animation = "none";

        // Force browser reflow
        void progressRef.current.offsetHeight;

        if (!isPaused) {
          progressRef.current.style.animation =
            "heroProgress 5s linear forwards";
        }
      }
    };

    carouselElement.addEventListener("slid.bs.carousel", handleSlide);

    return () => {
      carouselElement.removeEventListener("slid.bs.carousel", handleSlide);
    };
  }, [isPaused]);

  // ==========================================================
  // HANDLE IMAGE ERRORS
  // ==========================================================

  const handleImageError = (bannerId) => {
    setImageErrors((prev) => ({
      ...prev,
      [bannerId]: true,
    }));
  };

  // ==========================================================
  // PAUSE / RESUME
  // ==========================================================

  const handleMouseEnter = () => {
    setIsPaused(true);

    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);

    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "running";
    }
  };

  // ==========================================================
  // KEYBOARD NAVIGATION
  // ==========================================================

  const handleKeyDown = (event) => {
    if (!carouselRef.current || banners.length <= 1) return;

    const carousel = window.bootstrap?.Carousel;

    if (!carousel) return;

    const instance =
      carousel.getInstance(carouselRef.current) ||
      new carousel(carouselRef.current);

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      instance.prev();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      instance.next();
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <>
        <style>{`
          .hero-loading {
            height: 85vh;
            min-height: 500px;
            max-height: 800px;
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
            border: 1px solid rgba(255,255,255,0.08);
            animation: loadingPulse 2s ease-in-out infinite;
          }

          .hero-loader {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.12);
            border-top-color: #A51C30;
            animation: heroSpin 0.9s linear infinite;
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
  // EMPTY STATE
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

        /* ====================================================
           HERO ROOT
        ==================================================== */

        .gdc-hero {
          --hero-red: #A51C30;
          --hero-red-dark: #7A1523;

          height: 85vh;
          min-height: 560px;
          max-height: 850px;

          position: relative;
          overflow: hidden;

          background: #111;

          isolation: isolate;
        }

        /* ====================================================
           SLIDES
        ==================================================== */

        .gdc-hero .carousel-inner,
        .gdc-hero .carousel-item {
          height: 100%;
          width: 100%;
        }

        .gdc-hero .carousel-item {
          position: relative;
          overflow: hidden;
          background: #111;
        }

        /* ====================================================
           IMAGE
        ==================================================== */

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
        }

        .gdc-hero .carousel-item.active .gdc-hero-image {
          transform: scale(1.11);
        }

        /* ====================================================
           IMAGE FALLBACK
        ==================================================== */

        .gdc-hero-fallback {
          position: absolute;
          inset: 0;

          transform: scale(1.02);

          transition:
            transform 8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gdc-hero .carousel-item.active .gdc-hero-fallback {
          transform: scale(1.09);
        }

        /* ====================================================
           OVERLAYS
        ==================================================== */

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

        /* ====================================================
           DECORATIVE LIGHT
        ==================================================== */

        .gdc-hero-glow {
          position: absolute;

          width: 600px;
          height: 600px;

          left: -260px;
          top: 50%;

          transform: translateY(-50%);

          background: radial-gradient(
            circle,
            rgba(165, 28, 48, 0.20) 0%,
            rgba(165, 28, 48, 0.08) 35%,
            transparent 70%
          );

          filter: blur(20px);

          z-index: 1;

          pointer-events: none;
        }

        /* ====================================================
           CONTENT WRAPPER
        ==================================================== */

        .gdc-hero-content {
          position: absolute;

          left: 0;
          top: 50%;

          width: 100%;

          transform: translateY(-50%);

          z-index: 3;

          pointer-events: none;
        }

        .gdc-hero-container {
          width: min(1200px, 100%);

          margin: 0 auto;

          padding-left: 7%;
          padding-right: 7%;
        }

        .gdc-hero-copy {
          max-width: 760px;

          pointer-events: auto;
        }

        /* ====================================================
           EYEBROW
        ==================================================== */

        .gdc-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 20px;

          font-size: 0.78rem;
          font-weight: 700;

          letter-spacing: 0.22em;
          text-transform: uppercase;

          color: rgba(255,255,255,0.88);

          opacity: 0;
          transform: translateY(25px);

          transition:
            opacity 0.7s ease 0.1s,
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
        }

        .gdc-hero-eyebrow::before {
          content: "";

          width: 36px;
          height: 2px;

          background: var(--hero-red);

          box-shadow:
            0 0 12px rgba(165,28,48,0.8);
        }

        .gdc-hero .carousel-item.active .gdc-hero-eyebrow {
          opacity: 1;
          transform: translateY(0);
        }

        /* ====================================================
           TITLE
        ==================================================== */

        .gdc-hero-title {
          margin: 0 0 22px;

          max-width: 760px;

          color: #fff;

          font-family:
            "Playfair Display",
            Georgia,
            "Times New Roman",
            serif;

          /*
            Clamp is intentionally controlled.

            Previously:
            clamp(2rem, 5vw, 4rem)

            This can become uncomfortable with long titles.

            This version has a lower responsive growth rate.
          */

          font-size: clamp(
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
            0 3px 25px rgba(0,0,0,0.5);

          opacity: 0;

          transform:
            translateY(45px)
            scale(0.98);

          filter: blur(5px);

          transition:
            opacity 0.85s ease 0.18s,
            transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.18s,
            filter 0.85s ease 0.18s;
        }

        .gdc-hero .carousel-item.active .gdc-hero-title {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          filter: blur(0);
        }

        /* ====================================================
           SUBTITLE
        ==================================================== */

        .gdc-hero-subtitle {
          max-width: 620px;

          margin: 0 0 30px;

          color: rgba(255,255,255,0.88);

          font-size: clamp(
            1rem,
            1.45vw,
            1.25rem
          );

          line-height: 1.65;

          font-weight: 350;

          text-wrap: pretty;

          overflow-wrap: anywhere;

          text-shadow:
            0 2px 14px rgba(0,0,0,0.6);

          opacity: 0;

          transform: translateY(30px);

          transition:
            opacity 0.8s ease 0.35s,
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;
        }

        .gdc-hero .carousel-item.active .gdc-hero-subtitle {
          opacity: 1;
          transform: translateY(0);
        }

        /* ====================================================
           CTA
        ==================================================== */

        .gdc-hero-actions {
          display: flex;
          align-items: center;
          gap: 18px;

          opacity: 0;

          transform: translateY(25px);

          transition:
            opacity 0.8s ease 0.5s,
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
        }

        .gdc-hero .carousel-item.active .gdc-hero-actions {
          opacity: 1;
          transform: translateY(0);
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

          border: 1px solid rgba(255,255,255,0.12);

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
            0 12px 35px rgba(165,28,48,0.28);

          overflow: hidden;

          transition:
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
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

          transform: skewX(-20deg);

          transition: left 0.65s ease;
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
            0 18px 45px rgba(165,28,48,0.42);
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

        .gdc-hero-cta:hover .gdc-hero-cta-arrow {
          transform: translateX(4px);
        }

        /* ====================================================
           SLIDE NUMBER
        ==================================================== */

        .gdc-hero-counter {
          position: absolute;

          right: 7%;
          bottom: 34px;

          z-index: 5;

          display: flex;
          align-items: center;
          gap: 10px;

          color: rgba(255,255,255,0.75);

          font-size: 0.75rem;

          letter-spacing: 0.12em;
        }

        .gdc-hero-counter-current {
          color: #fff;

          font-size: 1rem;

          font-weight: 700;
        }

        .gdc-hero-counter-line {
          width: 42px;
          height: 1px;

          background: rgba(255,255,255,0.35);
        }

        /* ====================================================
           INDICATORS
        ==================================================== */

        .gdc-hero .carousel-indicators {
          position: absolute;

          left: 7%;
          right: auto;

          bottom: 32px;

          width: auto;

          margin: 0;

          display: flex;
          align-items: center;

          gap: 8px;

          z-index: 10;
        }

        .gdc-hero .carousel-indicators button {
          width: 28px;
          height: 3px;

          margin: 0;

          padding: 0;

          border: 0;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.35);

          opacity: 1;

          transition:
            width 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.3s ease,
            opacity 0.3s ease;

          cursor: pointer;
        }

        .gdc-hero .carousel-indicators button:hover {
          background: rgba(255,255,255,0.7);
        }

        .gdc-hero .carousel-indicators button.active {
          width: 58px;

          background: #A51C30;

          box-shadow:
            0 0 12px rgba(165,28,48,0.55);
        }

        /* ====================================================
           PROGRESS BAR
        ==================================================== */

        .gdc-hero-progress {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 100%;
          height: 2px;

          background:
            rgba(255,255,255,0.12);

          z-index: 20;
        }

        .gdc-hero-progress-fill {
          width: 100%;
          height: 100%;

          transform-origin: left center;

          background:
            linear-gradient(
              90deg,
              #A51C30,
              #d33a52
            );

          animation:
            heroProgress 5s linear forwards;
        }

        @keyframes heroProgress {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        /* ====================================================
           SIDE DECORATION
        ==================================================== */

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

        /* ====================================================
           CONTROLS
        ==================================================== */

        .gdc-hero .carousel-control-prev,
        .gdc-hero .carousel-control-next {
          z-index: 8;

          width: 60px;

          opacity: 0;

          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        }

        .gdc-hero:hover .carousel-control-prev,
        .gdc-hero:hover .carousel-control-next {
          opacity: 0.75;
        }

        .gdc-hero .carousel-control-prev {
          transform: translateX(-8px);
        }

        .gdc-hero .carousel-control-next {
          transform: translateX(8px);
        }

        .gdc-hero:hover .carousel-control-prev,
        .gdc-hero:hover .carousel-control-next {
          transform: translateX(0);
        }

        .gdc-hero .carousel-control-prev:hover,
        .gdc-hero .carousel-control-next:hover {
          opacity: 1;
        }

        .gdc-hero .carousel-control-prev-icon,
        .gdc-hero .carousel-control-next-icon {
          width: 42px;
          height: 42px;

          padding: 10px;

          border-radius: 50%;

          background-color:
            rgba(0,0,0,0.32);

          background-size: 45%;

          backdrop-filter: blur(8px);

          border: 1px solid
            rgba(255,255,255,0.15);

          transition:
            transform 0.3s ease,
            background-color 0.3s ease;
        }

        .gdc-hero .carousel-control-prev:hover
          .carousel-control-prev-icon,
        .gdc-hero .carousel-control-next:hover
          .carousel-control-next-icon {
          transform: scale(1.08);

          background-color:
            rgba(165,28,48,0.75);
        }

        /* ====================================================
           PAUSED STATE
        ==================================================== */

        .gdc-hero.is-paused
          .gdc-hero-image,
        .gdc-hero.is-paused
          .gdc-hero-fallback {
          transition: none;
        }

        .gdc-hero.is-paused
          .gdc-hero-progress-fill {
          animation-play-state: paused;
        }

        /* ====================================================
           TABLET
        ==================================================== */

        @media (max-width: 991px) {

          .gdc-hero {
            height: 78vh;
            min-height: 520px;
          }

          .gdc-hero-container {
            padding-left: 6%;
            padding-right: 6%;
          }

          .gdc-hero-copy {
            max-width: 680px;
          }

          .gdc-hero-title {
            font-size: clamp(
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

          .gdc-hero .carousel-indicators {
            left: 6%;
          }
        }

        /* ====================================================
           MOBILE
        ==================================================== */

        @media (max-width: 767px) {

          .gdc-hero {
            height: 78vh;
            min-height: 540px;
            max-height: 760px;
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

          .gdc-hero .carousel-control-prev,
          .gdc-hero .carousel-control-next {
            display: none;
          }

          .gdc-hero .carousel-indicators {
            left: 24px;

            bottom: 25px;

            gap: 6px;
          }

          .gdc-hero .carousel-indicators button {
            width: 20px;
            height: 3px;
          }

          .gdc-hero .carousel-indicators button.active {
            width: 42px;
          }

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

        /* ====================================================
           SMALL MOBILE
        ==================================================== */

        @media (max-width: 420px) {

          .gdc-hero {
            min-height: 500px;
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

        /* ====================================================
           REDUCED MOTION
        ==================================================== */

        @media (prefers-reduced-motion: reduce) {

          .gdc-hero *,
          .gdc-hero *::before,
          .gdc-hero *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .gdc-hero-image,
          .gdc-hero-fallback {
            transform: none !important;
          }
        }

      `}</style>

      <div
        id="heroCarousel"
        ref={carouselRef}
        className={`gdc-hero carousel slide ${isPaused ? "is-paused" : ""}`}
        data-bs-ride="carousel"
        data-bs-interval="5000"
        data-bs-pause="false"
        tabIndex="0"
        role="region"
        aria-label="GDC Gulabad featured banners"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {/* ====================================================
            SLIDES
        ==================================================== */}

        <div className="carousel-inner">
          {banners.map((banner, index) => {
            const isFallback = banner.bgGradient !== undefined;

            const hasImageError = imageErrors[banner.id];

            return (
              <div
                key={banner.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
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
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    src={banner.imageUrl}
                    className="gdc-hero-image"
                    alt={banner.title || "GDC Gulabad banner"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                    fetchpriority={index === 0 ? "high" : "low"}
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

                <div className="gdc-hero-glow" />

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="gdc-hero-content">
                  <div className="gdc-hero-container">
                    <div
                      ref={(el) => {
                        contentRefs.current[index] = el;
                      }}
                      className="gdc-hero-copy"
                    >
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
            PREVIOUS
        ======================================================== */}

        {banners.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
              aria-label="Previous banner"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
            </button>

            {/* ==================================================
                NEXT
            ================================================== */}

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
              aria-label="Next banner"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
            </button>
          </>
        )}

        {/* ========================================================
            INDICATORS
        ======================================================== */}

        {banners.length > 1 && (
          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to={index}
                className={index === activeIndex ? "active" : ""}
                aria-current={index === activeIndex ? "true" : undefined}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* ========================================================
            COUNTER
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
            <div ref={progressRef} className="gdc-hero-progress-fill" />
          </div>
        )}
      </div>
    </>
  );
};

export default HeroCarousel;
