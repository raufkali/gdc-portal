import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

const GalleryPreview = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchCollection("gallery", [
      { type: "orderBy", field: "uploadedAt", direction: "desc" },
    ]).then(setImages);
  }, []);

  if (!images.length) return null;
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Media Gallery</h2>
        <div className="row">
          {images.slice(0, 6).map((img) => (
            <div key={img.id} className="col-md-4 col-sm-6 mb-3">
              <img
                src={img.imageUrl}
                className="img-fluid rounded shadow"
                alt={img.caption || "Gallery"}
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/gallery" className="btn btn-primary">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};
export default GalleryPreview;
