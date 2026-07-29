import { useState, useEffect, useRef } from "react";

// ✅ Memory cache for images with LRU-like behavior
const imageCache = new Map();
const MAX_CACHE_SIZE = 100; // Maximum images to cache in memory

// ✅ Track loading promises to prevent duplicate loads
const loadingPromises = new Map();

const CachedImage = ({
  src,
  alt,
  className,
  style,
  loading = "lazy",
  onLoad,
  onError,
  fallbackSrc = "https://via.placeholder.com/400x300?text=No+Image",
  width,
  height,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset state when src changes
    setHasError(false);
    setIsLoading(true);

    // Check if image is already in cache
    if (imageCache.has(src)) {
      setImageSrc(imageCache.get(src));
      setIsLoading(false);
      setHasError(false);
      if (onLoad) onLoad();
      return;
    }

    // If there's already a loading promise for this src, wait for it
    if (loadingPromises.has(src)) {
      loadingPromises.get(src).then(() => {
        if (isMounted.current) {
          if (imageCache.has(src)) {
            setImageSrc(imageCache.get(src));
            setIsLoading(false);
            setHasError(false);
            if (onLoad) onLoad();
          }
        }
      });
      return;
    }

    // Create loading promise
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Cache the image
        if (imageCache.size >= MAX_CACHE_SIZE) {
          // Remove oldest entry (first key)
          const firstKey = imageCache.keys().next().value;
          imageCache.delete(firstKey);
        }
        imageCache.set(src, src);
        if (isMounted.current) {
          setImageSrc(src);
          setIsLoading(false);
          setHasError(false);
          if (onLoad) onLoad();
        }
        resolve(src);
        loadingPromises.delete(src);
      };

      img.onerror = () => {
        if (isMounted.current) {
          setHasError(true);
          setIsLoading(false);
          if (onError) onError();
        }
        loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    loadingPromises.set(src, loadPromise);

    // Cleanup
    return () => {
      // If component unmounts, we don't need to do anything special
      // The promise will still resolve but we check isMounted
    };
  }, [src, onLoad, onError]);

  const displaySrc = hasError ? fallbackSrc : imageSrc || src;

  return (
    <img
      ref={imgRef}
      src={displaySrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: isLoading && !hasError ? 0.5 : 1,
        transition: "opacity 0.3s ease",
      }}
      loading={loading}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default CachedImage;
