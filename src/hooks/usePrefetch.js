import { useEffect } from "react";
import { prefetchHomeData } from "../firebase/db";
import { preloadImages, prefetchImages } from "../utils/cloudflare";

export const usePrefetch = (options = {}) => {
  const {
    prefetchOnHover = true,
    prefetchImages: prefetchImagesEnabled = true,
  } = options;

  useEffect(() => {
    // Prefetch home data
    prefetchHomeData().then(() => {
      console.log(" Home data prefetched");
    });

    // Prefetch images on hover
    if (prefetchOnHover) {
      const prefetchOnHoverHandler = (e) => {
        const link = e.target.closest("a[href]");
        if (link && link.href) {
          const url = new URL(link.href);
          if (url.pathname === "/") {
            // Prefetch images for home page
            // This would be dynamic based on your images
          }
        }
      };

      document.addEventListener("mouseenter", prefetchOnHoverHandler, true);

      return () => {
        document.removeEventListener(
          "mouseenter",
          prefetchOnHoverHandler,
          true,
        );
      };
    }
  }, [prefetchOnHover]);

  return {
    preloadImages,
    prefetchImages,
  };
};

export default usePrefetch;
