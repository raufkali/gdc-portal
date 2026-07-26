import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("gallery", [
      { type: "orderBy", field: "uploadedAt", direction: "desc" },
    ])
      .then(setMedia)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Media & Gallery</h1>
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
