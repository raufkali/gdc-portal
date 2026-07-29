import { useState, useEffect, useRef } from "react";
import { fetchCollection, clearCache } from "../firebase/db";

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

  const fetchData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        // Clear cache and force refresh
        clearCache(`${collectionName}_${JSON.stringify(conditions)}`);
      }

      setLoading(true);
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
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData(false);

    return () => {
      isMounted.current = false;
    };
  }, [collectionName, JSON.stringify(conditions)]);

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
