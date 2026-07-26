import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import { formatDate } from "../utils/helpers";
import Loader from "../components/common/Loader";

const AnnouncementDetail = () => {
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("announcements")
      .then((data) => {
        const found = data.find((a) => a.slug === slug || a.id === slug);
        setAnnouncement(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!announcement)
    return (
      <div className="container py-5">
        <h2>Announcement not found</h2>
        <Link to="/announcements">Back to Announcements</Link>
      </div>
    );

  return (
    <div className="container py-5">
      <Link to="/announcements" className="btn btn-outline-secondary mb-3">
        &larr; Back to Announcements
      </Link>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1>{announcement.title}</h1>
          <small className="text-muted">{formatDate(announcement.date)}</small>
          <p className="lead mt-3">{announcement.content}</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
