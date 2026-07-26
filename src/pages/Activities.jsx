import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("activities", [
      { type: "orderBy", field: "date", direction: "desc" },
    ])
      .then(setActivities)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Recent Activities</h1>
      <div className="row">
        {activities.map((activity) => (
          <div key={activity.id} className="col-md-8 offset-md-2 mb-4">
            <div className="card shadow-sm">
              {activity.imageUrl && (
                <img
                  src={activity.imageUrl}
                  className="card-img-top"
                  alt={activity.title}
                />
              )}
              <div className="card-body">
                <h3>{activity.title}</h3>
                <small className="text-muted">
                  {formatDate(activity.date)}
                </small>
                <p className="mt-2">{activity.content}</p>
                {activity.author && (
                  <footer className="blockquote-footer mt-2">
                    {activity.author}
                  </footer>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Activities;
