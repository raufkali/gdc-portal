import { useState, useEffect, useRef, useCallback } from "react";
import { fetchCollection, clearCache, subscribeToCacheInvalidation } from "../firebase/db";

export const useCachedData = (
  collectionName,
  conditions = [],
  options = {},
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);

  const fetchData = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await fetchCollection(collectionName, conditions, {
        ...options,
        forceRefresh: refresh,
      });

      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      if (isMounted.current) {
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [collectionName, JSON.stringify(conditions)]);

  useEffect(() => {
    isMounted.current = true;
    fetchData(false);

    // Automatically re-fetch when collection data is modified anywhere
    const unsubscribe = subscribeToCacheInvalidation((event) => {
      if (
        event.collectionName === collectionName ||
        !event.collectionName
      ) {
        if (isMounted.current) {
          fetchData(true);
        }
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [fetchData, collectionName]);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh: () => fetchData(true),
    setData,
  };
};

export default useCachedData;
