import { db } from "./config";
import {
  collection,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// ============================================
// IN-MEMORY CACHE
// ============================================
const memoryCache = {
  data: {},
  timestamps: {},
  TTL: 5 * 60 * 1000, // 5 minutes default
};

// Check if cached data is still valid
const isCacheValid = (key) => {
  if (!memoryCache.timestamps[key]) return false;
  const age = Date.now() - memoryCache.timestamps[key];
  return age < memoryCache.TTL;
};

// Get data from cache
const getFromCache = (key) => {
  if (isCacheValid(key)) {
    return memoryCache.data[key];
  }
  return null;
};

// Set data in cache
const setInCache = (key, data, ttl = null) => {
  memoryCache.data[key] = data;
  memoryCache.timestamps[key] = Date.now();
  if (ttl) memoryCache.TTL = ttl;
};

// Clear cache
export const clearCache = (key = null) => {
  if (key) {
    delete memoryCache.data[key];
    delete memoryCache.timestamps[key];
  } else {
    memoryCache.data = {};
    memoryCache.timestamps = {};
  }
};

// Generate cache key from collection and conditions
const generateCacheKey = (collectionName, conditions = []) => {
  const conditionsStr = conditions
    .map((c) => `${c.field}_${c.operator}_${c.value}_${c.direction || ""}`)
    .join("|");
  return `${collectionName}_${conditionsStr}`;
};

// Build a Firestore query object from our condition shorthand
const buildQuery = (collectionName, conditions = []) => {
  let q = collection(db, collectionName);
  const constraints = [];

  conditions.forEach((c) => {
    if (c.type === "where") {
      constraints.push(where(c.field, c.operator, c.value));
    } else if (c.type === "orderBy") {
      constraints.push(orderBy(c.field, c.direction || "asc"));
    } else if (c.type === "limit") {
      constraints.push(limit(c.value));
    }
  });

  if (constraints.length) {
    q = query(q, ...constraints);
  }
  return q;
};

// Track in-flight requests so concurrent callers share one fetch
// instead of firing duplicate reads (fixes double-fetch on
// StrictMode / fast remounts / multiple components requesting
// the same collection at once).
const inFlightRequests = {};

// ============================================
// EXPORTED FUNCTIONS WITH CACHE
// ============================================

/**
 * Generic fetch-all with a 3-tier cache strategy:
 *   1. In-memory cache (instant, valid within TTL)
 *   2. IndexedDB persistence cache (near-instant, survives reloads)
 *      -> returned immediately, then silently refreshed from server
 *   3. Network (source of truth, used when no local cache exists yet)
 *
 * This is what actually fixes "slow every reload" - IndexedDB
 * persistence was enabled in config.js but never used as a
 * read-first source, so every reload was paying full network cost.
 */
export const fetchCollection = async (
  collectionName,
  conditions = [],
  options = {},
) => {
  const {
    forceRefresh = false,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    useLimit = false,
    limitCount = 0,
  } = options;

  // Apply useLimit/limitCount shorthand if caller didn't already add a limit condition
  let finalConditions = conditions;
  if (useLimit && limitCount > 0) {
    const hasLimit = conditions.some((c) => c.type === "limit");
    if (!hasLimit) {
      finalConditions = [...conditions, { type: "limit", value: limitCount }];
    }
  }

  const cacheKey = generateCacheKey(collectionName, finalConditions);

  // 1) In-memory cache — instant, no async work at all
  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // De-dupe concurrent requests for the same key
  if (!forceRefresh && inFlightRequests[cacheKey]) {
    return inFlightRequests[cacheKey];
  }

  const requestPromise = (async () => {
    const q = buildQuery(collectionName, finalConditions);

    // 2) Try local IndexedDB persistence cache first (fast, survives reloads)
    if (!forceRefresh) {
      try {
        const cacheSnap = await getDocsFromCache(q);
        if (!cacheSnap.empty) {
          const localData = cacheSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setInCache(cacheKey, localData, cacheTTL);

          // Refresh from server in the background; don't block the UI.
          getDocsFromServer(q)
            .then((serverSnap) => {
              const freshData = serverSnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              }));
              setInCache(cacheKey, freshData, cacheTTL);
            })
            .catch((err) => {
              // Background refresh failing is not fatal — we already
              // served data from local cache.
              console.warn(
                `Background refresh failed for ${collectionName}:`,
                err,
              );
            });

          return localData;
        }
      } catch (err) {
        // No local cache yet (e.g. very first load ever) — fall through
        // to a normal network fetch below.
      }
    }

    // 3) No usable local cache (or forceRefresh) — hit the network
    try {
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setInCache(cacheKey, data, cacheTTL);
      return data;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      // Return stale in-memory data if we have any, rather than failing outright
      const staleData = memoryCache.data[cacheKey];
      if (staleData) {
        return staleData;
      }
      throw error;
    }
  })();

  inFlightRequests[cacheKey] = requestPromise;
  try {
    return await requestPromise;
  } finally {
    delete inFlightRequests[cacheKey];
  }
};

// ============================================
// ✅ ENHANCED fetchDocument with IndexedDB persistence
// ============================================
export const fetchDocument = async (collectionName, id, options = {}) => {
  const { forceRefresh = false, cacheTTL = 5 * 60 * 1000 } = options;
  const cacheKey = `${collectionName}_doc_${id}`;

  // 1) In-memory cache
  if (!forceRefresh) {
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const docRef = doc(db, collectionName, id);

  // 2) IndexedDB persistent cache (fast, survives reloads)
  if (!forceRefresh) {
    try {
      const cacheSnap = await getDocFromCache(docRef);
      if (cacheSnap.exists()) {
        const data = { id: cacheSnap.id, ...cacheSnap.data() };
        setInCache(cacheKey, data, cacheTTL);

        // Refresh in background (no await – fire and forget)
        getDocFromServer(docRef)
          .then((serverSnap) => {
            if (serverSnap.exists()) {
              const freshData = { id: serverSnap.id, ...serverSnap.data() };
              setInCache(cacheKey, freshData, cacheTTL);
            }
          })
          .catch(() => {}); // ignore background errors

        return data;
      }
    } catch (err) {
      // No local cache yet – fall through to network
    }
  }

  // 3) Network fallback
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    const data = { id: snap.id, ...snap.data() };
    setInCache(cacheKey, data, cacheTTL);
    return data;
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${id}:`, error);
    // Return stale in-memory data if available
    const stale = memoryCache.data[cacheKey];
    if (stale) return stale;
    throw error;
  }
};

//  Add document with cache invalidation
export const addDocument = async (collectionName, data) => {
  try {
    const result = await addDoc(collection(db, collectionName), data);
    clearCacheForCollection(collectionName);
    return result;
  } catch (error) {
    console.error(`Error adding to ${collectionName}:`, error);
    throw error;
  }
};

//  Update document with cache invalidation
export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    clearCacheForCollection(collectionName);
    clearCacheForDocument(collectionName, id);
    return true;
  } catch (error) {
    console.error(`Error updating ${collectionName}/${id}:`, error);
    throw error;
  }
};

//  Delete document with cache invalidation
export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    clearCacheForCollection(collectionName);
    clearCacheForDocument(collectionName, id);
    return true;
  } catch (error) {
    console.error(`Error deleting ${collectionName}/${id}:`, error);
    throw error;
  }
};

// ============================================
// CACHE MANAGEMENT HELPERS
// ============================================

const clearCacheForCollection = (collectionName) => {
  const keys = Object.keys(memoryCache.data);
  keys.forEach((key) => {
    if (key.startsWith(collectionName)) {
      delete memoryCache.data[key];
      delete memoryCache.timestamps[key];
    }
  });
};

const clearCacheForDocument = (collectionName, id) => {
  const docKey = `${collectionName}_doc_${id}`;
  delete memoryCache.data[docKey];
  delete memoryCache.timestamps[docKey];
};

//  Prefetch collections with TTL
export const prefetchCollection = async (
  collectionName,
  conditions = [],
  options = {},
) => {
  const { cacheTTL = 10 * 60 * 1000 } = options; // 10 minutes for prefetch
  return fetchCollection(collectionName, conditions, {
    ...options,
    cacheTTL,
    forceRefresh: true,
  });
};

//  Get cache stats
export const getCacheStats = () => {
  const keys = Object.keys(memoryCache.data);
  const stats = {
    totalItems: keys.length,
    collections: {},
    memoryUsage: "N/A",
  };

  keys.forEach((key) => {
    const collectionName = key.split("_")[0];
    if (!stats.collections[collectionName]) {
      stats.collections[collectionName] = 0;
    }
    stats.collections[collectionName]++;
  });

  return stats;
};

//  Export cache control
export const cacheControl = {
  clear: clearCache,
  stats: getCacheStats,
  getCache: () => memoryCache.data,
};

// ============================================
// IMAGE URL CACHE
// ============================================
const imageUrlCache = new Map();

export const getCachedImageUrl = (imageId, imageUrl) => {
  if (imageUrlCache.has(imageId)) {
    return imageUrlCache.get(imageId);
  }
  imageUrlCache.set(imageId, imageUrl);
  return imageUrl;
};

export const clearImageCache = () => {
  imageUrlCache.clear();
};

// ============================================
// PREFETCH HOME DATA (Optimized)
// ============================================
export const prefetchHomeData = async () => {
  const collections = [
    {
      name: "banners",
      conditions: [
        { type: "where", field: "active", operator: "==", value: true },
        { type: "orderBy", field: "order", direction: "asc" },
      ],
      limit: 10,
    },
    {
      name: "programs",
      conditions: [{ type: "limit", value: 4 }],
    },
    {
      name: "departments",
      conditions: [{ type: "limit", value: 4 }],
    },
    {
      name: "activities",
      conditions: [
        { type: "orderBy", field: "date", direction: "desc" },
        { type: "limit", value: 3 },
      ],
    },
    {
      name: "gallery",
      conditions: [
        { type: "orderBy", field: "uploadedAt", direction: "desc" },
        { type: "limit", value: 6 },
      ],
    },
    {
      name: "testimonials",
      conditions: [{ type: "limit", value: 3 }],
    },
    {
      name: "faqs",
      conditions: [
        { type: "orderBy", field: "order", direction: "asc" },
        { type: "limit", value: 4 },
      ],
    },
  ];

  const promises = collections.map((col) =>
    fetchCollection(col.name, col.conditions, {
      cacheTTL: 10 * 60 * 1000, // 10 minutes
    }),
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Error prefetching home data:", error);
  }
};

// ============================================
// BATCH FETCH (Optimized)
// ============================================
export const batchFetchCollections = async (collections) => {
  const results = {};
  const promises = collections.map(
    async ({ name, conditions = [], options = {} }) => {
      const data = await fetchCollection(name, conditions, options);
      results[name] = data;
      return data;
    },
  );

  await Promise.all(promises);
  return results;
};

export default {
  fetchCollection,
  fetchDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  prefetchHomeData,
  prefetchCollection,
  batchFetchCollections,
  clearCache,
  cacheControl,
  getCacheStats,
  getCachedImageUrl,
  clearImageCache,
};
