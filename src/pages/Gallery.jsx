import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("gallery", [
      { type: "orderBy", field: "uploadedAt", direction: "desc" },
    ])
      .then(setImages)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Media Gallery</h1>
      <div className="row">
        {images.map((img) => (
          <div key={img.id} className="col-md-4 col-sm-6 mb-3">
            <img
              src={img.imageUrl}
              className="img-fluid rounded shadow"
              alt={img.caption || "Gallery"}
            />
            {img.caption && (
              <p className="text-center mt-1 small">{img.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Gallery;
