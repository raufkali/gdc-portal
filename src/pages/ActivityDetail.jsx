import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

const ActivityDetail = () => {
  const { slug } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("activities")
      .then((data) => {
        const found = data.find((a) => a.slug === slug || a.id === slug);
        setActivity(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!activity)
    return (
      <div className="container py-5">
        <h2>Activity not found</h2>
        <Link to="/activities">Back to Activities</Link>
      </div>
    );

  return (
    <div className="container py-5">
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
