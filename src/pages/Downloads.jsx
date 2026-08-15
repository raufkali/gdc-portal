import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

let cachedDownloads = null;
let cacheTimestamp = null;

const CACHE_TTL = 5 * 60 * 1000;

const Downloads = () => {
  const [downloads, setDownloads] = useState(() => {
    if (
      cachedDownloads &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedDownloads;
    }

    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedDownloads &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  /*
  |--------------------------------------------------------------------------
  | Fetch Downloads
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    const fetchDownloads = async () => {
      if (
        cachedDownloads &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        if (isMounted) {
          setDownloads(cachedDownloads);
          setLoading(false);
        }

        return;
      }

      try {
        const snap = await getDocs(collection(db, "downloads"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        data.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;

          return new Date(b.date) - new Date(a.date);
        });

        cachedDownloads = data;
        cacheTimestamp = Date.now();

        if (isMounted) {
          setDownloads(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);

        if (isMounted) {
          if (cachedDownloads) {
            setDownloads(cachedDownloads);
          }

          setLoading(false);
        }
      }
    };

    fetchDownloads();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        downloads.map((item) => item.category?.trim()).filter(Boolean),
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [downloads]);

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredDownloads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return downloads.filter((file) => {
      const matchesCategory =
        activeCategory === "All" || file.category?.trim() === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        file.title?.toLowerCase().includes(query) ||
        file.description?.toLowerCase().includes(query) ||
        file.category?.toLowerCase().includes(query)
      );
    });
  }, [downloads, search, activeCategory]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const isPdfFile = (file) => {
    return (
      file.fileType?.toLowerCase() === "pdf" ||
      file.fileUrl?.toLowerCase().split("?")[0].endsWith(".pdf")
    );
  };

  const getFileType = (file) => {
    if (isPdfFile(file)) return "PDF";

    if (
      file.fileType?.toLowerCase().includes("word") ||
      file.fileType?.toLowerCase().includes("doc")
    ) {
      return "DOC";
    }

    if (
      file.fileType?.toLowerCase().includes("excel") ||
      file.fileType?.toLowerCase().includes("sheet")
    ) {
      return "XLS";
    }

    if (
      file.fileType?.toLowerCase().includes("image") ||
      file.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
    ) {
      return "IMG";
    }

    return "FILE";
  };

  const getFileIcon = (file) => {
    const type = getFileType(file);

    switch (type) {
      case "PDF":
        return "bi-file-earmark-pdf-fill";

      case "DOC":
        return "bi-file-earmark-word-fill";

      case "XLS":
        return "bi-file-earmark-excel-fill";

      case "IMG":
        return "bi-file-earmark-image-fill";

      default:
        return "bi-file-earmark-text-fill";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="downloads-loading"
        style={{
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="downloads-loading-inner">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#A51C30" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <p>Loading resources...</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (!downloads.length) {
    return (
      <div
        className="downloads-page"
        style={{
          backgroundColor: "var(--color-bg-alt)",
        }}
      >
        <div className="container">
          <div className="downloads-empty">
            <div className="downloads-empty-icon">
              <i className="bi bi-folder2-open"></i>
            </div>

            <span className="downloads-empty-label">Resources</span>

            <h1>No Downloads Available</h1>

            <p>
              Important forms, documents, and other resources will appear here
              when available.
            </p>
          </div>
        </div>

        <DownloadStyles />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main Page
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="downloads-page"
      style={{
        backgroundColor: "var(--color-bg-alt)",
      }}
    >
      <div className="container">
        {/* ================================================================
            HERO
        ================================================================= */}

        <header className="downloads-hero">
          <div className="downloads-eyebrow">
            <span className="eyebrow-dot"></span>
            Student Resources
          </div>

          <h1>
            Documents &<span> Downloads</span>
          </h1>

          <p>
            Access official college forms, academic resources, syllabi, notices,
            and important documents in one place.
          </p>
        </header>

        {/* ================================================================
            SEARCH + STATS
        ================================================================= */}

        <div className="downloads-toolbar">
          <div className="downloads-search">
            <i className="bi bi-search"></i>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              aria-label="Search documents"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          <div className="downloads-count">
            <strong>{filteredDownloads.length}</strong>

            <span>
              {filteredDownloads.length === 1 ? " document" : " documents"}
            </span>
          </div>
        </div>

        {/* ================================================================
            CATEGORY FILTER
        ================================================================= */}

        {categories.length > 1 && (
          <div className="download-categories">
            <div className="category-scroll">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}

                  {category !== "All" && (
                    <span>
                      {
                        downloads.filter(
                          (item) => item.category?.trim() === category,
                        ).length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            RESULTS
        ================================================================= */}

        {filteredDownloads.length > 0 ? (
          <section className="downloads-list">
            {filteredDownloads.map((file, index) => {
              const pdf = isPdfFile(file);
              const type = getFileType(file);

              return (
                <article
                  key={file.id}
                  className="download-item"
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 60, 400)}
                >
                  {/* ------------------------------------------------------
                      FILE ICON
                  ------------------------------------------------------- */}

                  <div className={`download-file-icon ${type.toLowerCase()}`}>
                    <i className={getFileIcon(file)}></i>

                    <span>{type}</span>
                  </div>

                  {/* ------------------------------------------------------
                      CONTENT
                  ------------------------------------------------------- */}

                  <div className="download-content">
                    <div className="download-meta">
                      {file.category && (
                        <span className="download-category">
                          {file.category}
                        </span>
                      )}

                      {file.date && (
                        <span className="download-date">
                          <i className="bi bi-calendar3"></i>
                          {formatDate(file.date)}
                        </span>
                      )}
                    </div>

                    <h2>{file.title}</h2>

                    {file.description && <p>{file.description}</p>}
                  </div>

                  {/* ------------------------------------------------------
                      ACTION
                  ------------------------------------------------------- */}

                  {file.fileUrl && (
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-action"
                      aria-label={
                        pdf ? `Download ${file.title}` : `View ${file.title}`
                      }
                    >
                      <span className="action-text">
                        {pdf ? "Download" : "View"}
                      </span>

                      <span className="action-icon">
                        <i
                          className={
                            pdf ? "bi bi-arrow-down" : "bi bi-arrow-up-right"
                          }
                        ></i>
                      </span>
                    </a>
                  )}
                </article>
              );
            })}
          </section>
        ) : (
          /* ==============================================================
             NO SEARCH RESULTS
          ============================================================== */

          <div className="download-no-results">
            <div>
              <i className="bi bi-search"></i>
            </div>

            <h2>No documents found</h2>

            <p>Try another search term or select a different category.</p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ================================================================
            FOOTER NOTE
        ================================================================= */}

        {filteredDownloads.length > 0 && (
          <div className="downloads-footer-note">
            <i className="bi bi-info-circle"></i>

            <span>
              Documents are provided by Government Degree College Gulabad.
              Please check the document itself for official dates and
              instructions.
            </span>
          </div>
        )}
      </div>

      <DownloadStyles />
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const DownloadStyles = () => (
  <style>{`

    /* ================================================================
       PAGE
    ================================================================= */

    .downloads-page {
      min-height: 75vh;
      padding:
        7rem 0 5rem;
    }


    /* ================================================================
       LOADING
    ================================================================= */

    .downloads-loading {
      min-height: 75vh;

      display: flex;
      align-items: center;
      justify-content: center;

      padding-top: 5rem;
    }

    .downloads-loading-inner {
      text-align: center;
    }

    .downloads-loading-inner p {
      margin-top: 1rem;
      margin-bottom: 0;

      color: var(--color-text-muted);

      font-size: 0.85rem;
    }


    /* ================================================================
       HERO
    ================================================================= */

    .downloads-hero {
      max-width: 800px;

      margin:
        0 auto 3rem;

      text-align: center;
    }

    .downloads-eyebrow {
      display: inline-flex;

      align-items: center;
      gap: 0.5rem;

      padding:
        0.45rem 1rem;

      border-radius: 50px;

      background:
        rgba(165, 28, 48, 0.07);

      color: #A51C30;

      font-size: 0.72rem;

      font-weight: 700;

      letter-spacing: 1.8px;

      text-transform: uppercase;
    }

    .eyebrow-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #A51C30;
    }

    .downloads-hero h1 {
      margin:
        1rem 0 0;

      color:
        var(--color-text);

      font-family:
        'Playfair Display',
        Georgia,
        serif;

      font-size:
        clamp(2.5rem, 6vw, 4.5rem);

      line-height: 1.05;

      font-weight: 700;

      letter-spacing: -1.5px;
    }

    .downloads-hero h1 span {
      color: #A51C30;
    }

    .downloads-hero p {
      max-width: 650px;

      margin:
        1.25rem auto 0;

      color:
        var(--color-text-muted);

      font-size:
        clamp(0.92rem, 2vw, 1.08rem);

      line-height: 1.7;
    }


    /* ================================================================
       TOOLBAR
    ================================================================= */

    .downloads-toolbar {
      max-width: 950px;

      margin:
        0 auto 1rem;

      display: flex;

      align-items: center;

      gap: 1rem;
    }

    .downloads-search {
      flex: 1;

      min-width: 0;

      height: 52px;

      display: flex;
      align-items: center;

      padding:
        0 0.45rem 0 1.1rem;

      background:
        var(--card-bg);

      border:
        1px solid
        var(
          --border-color,
          rgba(0, 0, 0, 0.08)
        );

      border-radius: 12px;

      box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.025);

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    .downloads-search:focus-within {
      border-color:
        rgba(165, 28, 48, 0.4);

      box-shadow:
        0 8px 25px
        rgba(165, 28, 48, 0.08);
    }

    .downloads-search > i {
      flex-shrink: 0;

      color: #A51C30;

      margin-right:
        0.7rem;
    }

    .downloads-search input {
      width: 100%;
      min-width: 0;

      border: none;
      outline: none;

      background: transparent;

      color:
        var(--color-text);

      font-size: 0.88rem;
    }

    .downloads-search input::placeholder {
      color:
        var(--color-text-muted);
    }

    .downloads-search button {
      flex-shrink: 0;

      width: 34px;
      height: 34px;

      border: none;
      border-radius: 8px;

      background:
        rgba(165, 28, 48, 0.07);

      color: #A51C30;

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
    }

    .downloads-count {
      height: 52px;

      flex-shrink: 0;

      display: flex;
      align-items: center;

      padding:
        0 1.1rem;

      border-radius: 12px;

      background:
        rgba(165, 28, 48, 0.06);

      color:
        var(--color-text-muted);

      font-size: 0.75rem;

      white-space: nowrap;
    }

    .downloads-count strong {
      color: #A51C30;

      font-size: 1rem;

      margin-right: 0.25rem;
    }


    /* ================================================================
       CATEGORIES
    ================================================================= */

    .download-categories {
      max-width: 950px;

      margin:
        0 auto 1.5rem;
    }

    .category-scroll {
      display: flex;

      gap: 0.5rem;

      overflow-x: auto;

      padding:
        0.25rem 0;

      scrollbar-width: none;
    }

    .category-scroll::-webkit-scrollbar {
      display: none;
    }

    .category-scroll button {
      flex-shrink: 0;

      border:
        1px solid
        var(
          --border-color,
          rgba(0, 0, 0, 0.08)
        );

      background:
        var(--card-bg);

      color:
        var(--color-text-muted);

      padding:
        0.55rem 0.9rem;

      border-radius: 8px;

      font-size: 0.73rem;

      font-weight: 600;

      cursor: pointer;

      transition:
        all 0.2s ease;
    }

    .category-scroll button:hover {
      border-color:
        rgba(165, 28, 48, 0.3);

      color: #A51C30;
    }

    .category-scroll button.active {
      background: #A51C30;

      border-color: #A51C30;

      color: #fff;
    }

    .category-scroll button span {
      margin-left: 0.4rem;

      opacity: 0.7;
    }


    /* ================================================================
       DOCUMENT LIST
    ================================================================= */

    .downloads-list {
      max-width: 950px;

      margin: 0 auto;
    }

    .download-item {
      position: relative;

      display: grid;

      grid-template-columns:
        72px minmax(0, 1fr) auto;

      align-items: center;

      gap: 1.35rem;

      padding:
        1.35rem 1.25rem;

      background:
        var(--card-bg);

      border:
        1px solid
        var(
          --border-color,
          rgba(0, 0, 0, 0.07)
        );

      border-radius: 14px;

      margin-bottom: 0.75rem;

      box-shadow:
        0 3px 15px
        rgba(0, 0, 0, 0.025);

      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;
    }

    .download-item:hover {
      transform:
        translateY(-3px);

      border-color:
        rgba(165, 28, 48, 0.16);

      box-shadow:
        0 12px 30px
        rgba(0, 0, 0, 0.07);
    }


    /* ================================================================
       FILE ICON
    ================================================================= */

    .download-file-icon {
      width: 72px;
      height: 78px;

      flex-shrink: 0;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      gap: 2px;

      border-radius: 10px;

      background:
        rgba(165, 28, 48, 0.07);

      color: #A51C30;
    }

    .download-file-icon i {
      font-size: 1.9rem;
    }

    .download-file-icon span {
      font-size: 0.55rem;

      font-weight: 800;

      letter-spacing: 0.8px;
    }

    .download-file-icon.pdf {
      background:
        rgba(220, 53, 69, 0.08);

      color: #dc3545;
    }

    .download-file-icon.doc {
      background:
        rgba(13, 110, 253, 0.08);

      color: #0d6efd;
    }

    .download-file-icon.xls {
      background:
        rgba(25, 135, 84, 0.08);

      color: #198754;
    }

    .download-file-icon.img {
      background:
        rgba(111, 66, 193, 0.08);

      color: #6f42c1;
    }


    /* ================================================================
       CONTENT
    ================================================================= */

    .download-content {
      min-width: 0;
    }

    .download-meta {
      display: flex;

      align-items: center;

      flex-wrap: wrap;

      gap: 0.7rem;

      margin-bottom: 0.35rem;
    }

    .download-category {
      color: #A51C30;

      font-size: 0.63rem;

      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.8px;
    }

    .download-date {
      display: inline-flex;

      align-items: center;

      gap: 4px;

      color:
        var(--color-text-muted);

      font-size: 0.66rem;
    }

    .download-content h2 {
      margin: 0;

      color:
        var(--color-text);

      font-family:
        'Playfair Display',
        Georgia,
        serif;

      font-size: 1.12rem;

      font-weight: 700;

      line-height: 1.35;

      overflow-wrap: anywhere;
    }

    .download-content p {
      max-width: 650px;

      margin:
        0.4rem 0 0;

      color:
        var(--color-text-muted);

      font-size: 0.78rem;

      line-height: 1.6;

      display: -webkit-box;

      -webkit-line-clamp: 2;

      -webkit-box-orient: vertical;

      overflow: hidden;

      overflow-wrap: anywhere;
    }


    /* ================================================================
       ACTION
    ================================================================= */

    .download-action {
      display: inline-flex;

      align-items: center;

      gap: 0.55rem;

      text-decoration: none;

      color: #A51C30;

      font-size: 0.74rem;

      font-weight: 700;

      white-space: nowrap;

      transition:
        color 0.2s ease;
    }

    .download-action:hover {
      color: #7A1523;
    }

    .action-icon {
      width: 36px;
      height: 36px;

      display: flex;

      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        rgba(165, 28, 48, 0.08);

      transition:
        all 0.25s ease;
    }

    .download-action:hover
    .action-icon {
      background: #A51C30;

      color: #fff;

      transform:
        translate(2px, -2px);
    }


    /* ================================================================
       FOOTER NOTE
    ================================================================= */

    .downloads-footer-note {
      max-width: 950px;

      margin:
        2rem auto 0;

      padding:
        0.9rem 1rem;

      display: flex;

      align-items: flex-start;

      gap: 0.65rem;

      border-top:
        1px solid
        var(
          --border-color,
          rgba(0, 0, 0, 0.08)
        );

      color:
        var(--color-text-muted);

      font-size: 0.68rem;

      line-height: 1.6;
    }

    .downloads-footer-note i {
      color: #A51C30;

      margin-top: 2px;
    }


    /* ================================================================
       EMPTY
    ================================================================= */

    .downloads-empty {
      min-height: 65vh;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      text-align: center;
    }

    .downloads-empty-icon {
      width: 80px;
      height: 80px;

      display: flex;

      align-items: center;
      justify-content: center;

      border-radius: 20px;

      background:
        rgba(165, 28, 48, 0.08);

      color: #A51C30;

      font-size: 2rem;

      margin-bottom: 1.25rem;
    }

    .downloads-empty-label {
      color: #A51C30;

      font-size: 0.7rem;

      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 2px;
    }

    .downloads-empty h1 {
      margin:
        0.5rem 0;

      color:
        var(--color-text);

      font-family:
        'Playfair Display',
        Georgia,
        serif;

      font-size:
        clamp(2rem, 5vw, 3rem);

      font-weight: 700;
    }

    .downloads-empty p {
      max-width: 500px;

      color:
        var(--color-text-muted);

      font-size: 0.9rem;

      line-height: 1.7;
    }


    /* ================================================================
       NO RESULTS
    ================================================================= */

    .download-no-results {
      max-width: 500px;

      margin:
        3rem auto;

      padding:
        3rem 1rem;

      text-align: center;
    }

    .download-no-results > div {
      width: 65px;
      height: 65px;

      display: flex;

      align-items: center;
      justify-content: center;

      margin: 0 auto 1rem;

      border-radius: 50%;

      background:
        rgba(165, 28, 48, 0.08);

      color: #A51C30;

      font-size: 1.4rem;
    }

    .download-no-results h2 {
      margin: 0;

      color:
        var(--color-text);

      font-family:
        'Playfair Display',
        Georgia,
        serif;

      font-size: 1.5rem;
    }

    .download-no-results p {
      margin:
        0.5rem 0 1.25rem;

      color:
        var(--color-text-muted);

      font-size: 0.8rem;
    }

    .download-no-results button {
      border: none;

      background:
        #A51C30;

      color: #fff;

      padding:
        0.55rem 1.2rem;

      border-radius: 50px;

      font-size: 0.75rem;

      font-weight: 600;

      cursor: pointer;
    }


    /* ================================================================
       TABLET
    ================================================================= */

    @media (max-width: 767.98px) {

      .downloads-page {
        padding:
          6rem 0 3.5rem;
      }

      .downloads-hero {
        margin-bottom: 2rem;
      }

      .downloads-hero h1 {
        font-size: 2.7rem;
      }

      .downloads-toolbar {
        align-items: stretch;
      }

      .downloads-count {
        display: none;
      }

      .download-item {
        grid-template-columns:
          58px minmax(0, 1fr) auto;

        gap: 0.9rem;

        padding:
          1rem;
      }

      .download-file-icon {
        width: 58px;
        height: 65px;
      }

      .download-file-icon i {
        font-size: 1.5rem;
      }

      .download-content h2 {
        font-size: 0.98rem;
      }

      .download-content p {
        font-size: 0.73rem;
      }

      .action-text {
        display: none;
      }

      .action-icon {
        width: 34px;
        height: 34px;
      }

      .downloads-footer-note {
        font-size: 0.65rem;
      }
    }


    /* ================================================================
       SMALL MOBILE
    ================================================================= */

    @media (max-width: 450px) {

      .downloads-page {
        padding-top: 5.5rem;
      }

      .downloads-hero h1 {
        font-size: 2.3rem;
      }

      .downloads-hero p {
        font-size: 0.82rem;
      }

      .download-item {
        grid-template-columns:
          52px minmax(0, 1fr) 34px;

        gap: 0.7rem;

        padding:
          0.85rem;
      }

      .download-file-icon {
        width: 52px;
        height: 60px;
      }

      .download-file-icon i {
        font-size: 1.35rem;
      }

      .download-file-icon span {
        font-size: 0.5rem;
      }

      .download-meta {
        gap: 0.4rem;
      }

      .download-category {
        font-size: 0.56rem;
      }

      .download-date {
        font-size: 0.58rem;
      }

      .download-content h2 {
        font-size: 0.88rem;
      }

      .download-content p {
        font-size: 0.68rem;

        -webkit-line-clamp: 2;
      }

      .download-action {
        align-self: center;
      }

      .action-icon {
        width: 31px;
        height: 31px;

        font-size: 0.7rem;
      }
    }

  `}</style>
);

export default Downloads;
