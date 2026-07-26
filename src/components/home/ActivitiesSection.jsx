import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";
import { formatDate } from "../../utils/helpers";

const ActivitiesSection = () => {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    fetchCollection("activities", [
      { type: "orderBy", field: "date", direction: "desc" },
    ]).then(setActivities);
  }, []);

  if (!activities.length) return null;
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Recent Activities</h2>
        <div className="row">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    className="card-img-top"
                    alt={activity.title}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{activity.title}</h5>
                  <small className="text-muted">
                    {formatDate(activity.date)}
                  </small>
                  <p className="card-text mt-2">
                    {activity.content?.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/activities/${activity.slug || activity.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/activities" className="btn btn-primary">
            All Activities
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ActivitiesSection;
