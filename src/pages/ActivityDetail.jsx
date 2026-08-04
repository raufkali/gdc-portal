import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

//  Cache for activity detail (by slug/id)
const cachedActivities = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const ActivityDetail = () => {
  const { slug } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      //  Check cache for this specific activity
      const cacheKey = slug;
      if (
        cachedActivities[cacheKey] &&
        cachedActivities[cacheKey].timestamp &&
        Date.now() - cachedActivities[cacheKey].timestamp < CACHE_TTL
      ) {
        setActivity(cachedActivities[cacheKey].data);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("activities");
        const found = data.find((a) => a.slug === slug || a.id === slug);

        if (found) {
          //  Cache the found activity
          cachedActivities[cacheKey] = {
            data: found,
            timestamp: Date.now(),
          };
          setActivity(found);
          setFromCache(false);
        } else {
          setActivity(null);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
        //  Try to use stale cache if available
        if (cachedActivities[cacheKey]) {
          setActivity(cachedActivities[cacheKey].data);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [slug]);

  if (loading) return <Loader />;
  if (!activity)
    return (
      <div className="container py-5 mt-5">
        <h2>Activity not found</h2>
        <Link to="/activities">Back to Activities</Link>
      </div>
    );

  return (
    <div className="container py-5 mt-5">
      <Link to="/activities" className="btn btn-outline-secondary mb-3">
        &larr; Back to Activities
      </Link>
      <div className="card shadow-sm">
        {activity.imageUrl && (
          <img
            src={activity.imageUrl}
            className="card-img-top"
            alt={activity.title}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        <div className="card-body">
          <h1>{activity.title}</h1>
          <small className="text-muted">{formatDate(activity.date)}</small>
          <p className="lead mt-3">{activity.content}</p>
          {activity.author && (
            <footer className="blockquote-footer">{activity.author}</footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
