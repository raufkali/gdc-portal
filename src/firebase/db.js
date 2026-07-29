import { db } from "./config";
import {
  collection,
  getDocs,
  getDoc,
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
  console.log("🗑️ Cache cleared:", key || "all");
};

// Generate cache key from collection and conditions
const generateCacheKey = (collectionName, conditions = []) => {
  const conditionsStr = conditions
    .map((c) => `${c.field}_${c.operator}_${c.value}_${c.direction || ""}`)
    .join("|");
  return `${collectionName}_${conditionsStr}`;
};

// ============================================
// EXPORTED FUNCTIONS WITH CACHE
// ============================================

// ✅ Generic fetch all documents with caching
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

  const cacheKey = generateCacheKey(collectionName, conditions);

  // Return cached data if valid and not forcing refresh
  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log(
        `📦 Cache hit: ${collectionName} (${cachedData.length} items)`,
      );
      return cachedData;
    }
  }

  console.log(`📡 Fetching from server: ${collectionName}`);

  try {
    // Build query
    let q = collection(db, collectionName);
    const constraints = [];

    if (conditions.length) {
      conditions.forEach((c) => {
        if (c.type === "where") {
          constraints.push(where(c.field, c.operator, c.value));
        } else if (c.type === "orderBy") {
          constraints.push(orderBy(c.field, c.direction || "asc"));
        } else if (c.type === "limit") {
          constraints.push(limit(c.value));
        }
      });
    }

    // Apply limit if specified and not already added
    if (useLimit && limitCount > 0) {
      const hasLimit = conditions.some((c) => c.type === "limit");
      if (!hasLimit) {
        constraints.push(limit(limitCount));
      }
    }

    if (constraints.length) {
      q = query(q, ...constraints);
    }

    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Cache the data
    setInCache(cacheKey, data, cacheTTL);
    console.log(`✅ Cached: ${collectionName} (${data.length} items)`);

    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}:`, error);
    // Return cached data if available (even if expired)
    const cachedData = memoryCache.data[cacheKey];
    if (cachedData) {
      console.log(`⚠️ Using stale cache for ${collectionName}`);
      return cachedData;
    }
    throw error;
  }
};

// ✅ Fetch single document with caching
export const fetchDocument = async (collectionName, id, options = {}) => {
  const { forceRefresh = false, cacheTTL = 5 * 60 * 1000 } = options;

  const cacheKey = `${collectionName}_doc_${id}`;

  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log(`📦 Cache hit: ${collectionName}/${id}`);
      return cachedData;
    }
  }

  console.log(`📡 Fetching from server: ${collectionName}/${id}`);

  try {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    const data = { id: snap.id, ...snap.data() };
    setInCache(cacheKey, data, cacheTTL);
    console.log(`✅ Cached: ${collectionName}/${id}`);

    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}/${id}:`, error);
    const cachedData = memoryCache.data[cacheKey];
    if (cachedData) {
      console.log(`⚠️ Using stale cache for ${collectionName}/${id}`);
      return cachedData;
    }
    throw error;
  }
};

// ✅ Add document with cache invalidation
export const addDocument = async (collectionName, data) => {
  try {
    const result = await addDoc(collection(db, collectionName), data);
    // Clear all cache for this collection
    clearCacheForCollection(collectionName);
    console.log(`📝 Added document to ${collectionName}, cache cleared`);
    return result;
  } catch (error) {
    console.error(`❌ Error adding to ${collectionName}:`, error);
    throw error;
  }
};

// ✅ Update document with cache invalidation
export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    // Clear cache for this collection and document
    clearCacheForCollection(collectionName);
    clearCacheForDocument(collectionName, id);
    console.log(`📝 Updated ${collectionName}/${id}, cache cleared`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${collectionName}/${id}:`, error);
    throw error;
  }
};

// ✅ Delete document with cache invalidation
export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    // Clear cache for this collection and document
    clearCacheForCollection(collectionName);
    clearCacheForDocument(collectionName, id);
    console.log(`🗑️ Deleted ${collectionName}/${id}, cache cleared`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting ${collectionName}/${id}:`, error);
    throw error;
  }
};

// ============================================
// CACHE MANAGEMENT HELPERS
// ============================================

// Clear cache for a specific collection
const clearCacheForCollection = (collectionName) => {
  const keys = Object.keys(memoryCache.data);
  keys.forEach((key) => {
    if (key.startsWith(collectionName)) {
      delete memoryCache.data[key];
      delete memoryCache.timestamps[key];
    }
  });
};

// Clear cache for a specific document
const clearCacheForDocument = (collectionName, id) => {
  const docKey = `${collectionName}_doc_${id}`;
  delete memoryCache.data[docKey];
  delete memoryCache.timestamps[docKey];
};

// ✅ Prefetch collections with TTL
export const prefetchCollection = async (
  collectionName,
  conditions = [],
  options = {},
) => {
  const { cacheTTL = 10 * 60 * 1000 } = options; // 10 minutes for prefetch
  console.log(`🔄 Prefetching: ${collectionName}`);
  return fetchCollection(collectionName, conditions, {
    ...options,
    cacheTTL,
    forceRefresh: true,
  });
};

// ✅ Get cache stats
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

// ✅ Export cache control
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

  // Cache the URL
  imageUrlCache.set(imageId, imageUrl);
  return imageUrl;
};

export const clearImageCache = () => {
  imageUrlCache.clear();
  console.log("🗑️ Image URL cache cleared");
};

// ============================================
// PREFETCH HOME DATA (Optimized)
// ============================================
export const prefetchHomeData = async () => {
  console.log("🚀 Prefetching home page data...");

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

  // Prefetch all collections in parallel
  const promises = collections.map((col) =>
    fetchCollection(col.name, col.conditions, {
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      forceRefresh: true,
    }),
  );

  try {
    await Promise.all(promises);
    console.log("✅ Home page data prefetched and cached");
  } catch (error) {
    console.error("❌ Error prefetching home data:", error);
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
