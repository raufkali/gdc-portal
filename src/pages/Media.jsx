import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

// ✅ Cache for media
let cachedMedia = null;
let cacheTimestamp = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const Media = () => {
  // ✅ Initialize with cached data if available
  const [media, setMedia] = useState(() => {
    if (
      cachedMedia &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedMedia;
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    return !(
      cachedMedia &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  const [fromCache, setFromCache] = useState(() => {
    return !!(
      cachedMedia &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    );
  });

  useEffect(() => {
    const fetchMedia = async () => {
      // ✅ If cache is valid, skip fetching
      if (
        cachedMedia &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_TTL
      ) {
        setMedia(cachedMedia);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("gallery", [
          { type: "orderBy", field: "uploadedAt", direction: "desc" },
        ]);

        cachedMedia = data;
        cacheTimestamp = Date.now();
        setMedia(data);
        setFromCache(false);
      } catch (error) {
        console.error("Error fetching media:", error);
        if (cachedMedia) {
          setMedia(cachedMedia);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Media & Gallery</h1>
      {fromCache && process.env.NODE_ENV === "development" && (
        <div className="text-center mb-3">
          <span
            style={{
              fontSize: "0.65rem",
              color: "#28a745",
              background: "rgba(40, 167, 69, 0.1)",
              padding: "0.15rem 0.8rem",
              borderRadius: "50px",
              display: "inline-block",
            }}
          >
            ⚡ Cached
          </span>
        </div>
      )}
      <div className="row">
        {media.map((item) => (
          <div key={item.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm h-100">
              <img
                src={item.imageUrl}
                className="card-img-top"
                alt={item.caption || "Media"}
                style={{ height: "250px", objectFit: "cover" }}
              />
              {item.caption && (
                <div className="card-body">
                  <p className="card-text">{item.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
