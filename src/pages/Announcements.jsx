import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("announcements", [
      { type: "orderBy", field: "date", direction: "desc" },
    ])
      .then(setAnnouncements)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Announcements</h1>
      <div className="row">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="col-md-8 offset-md-2 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3>{announcement.title}</h3>
                <small className="text-muted">
                  {formatDate(announcement.date)}
                </small>
                <p className="mt-2">
                  {announcement.content?.substring(0, 200)}...
                </p>
                <Link
                  to={`/announcements/${announcement.slug || announcement.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
