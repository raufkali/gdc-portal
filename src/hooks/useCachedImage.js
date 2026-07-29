import { useState, useEffect } from "react";
import { getCachedImageUrl } from "../firebase/db";

export const useCachedImage = (imageId, imageUrl) => {
  const [cachedUrl, setCachedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const url = getCachedImageUrl(imageId, imageUrl);
      setCachedUrl(url);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [imageId, imageUrl]);

  return { cachedUrl, loading, error };
};

export default useCachedImage;
