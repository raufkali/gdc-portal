import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("testimonials")
      .then(setTestimonials)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Student Testimonials</h1>
      <div className="row">
        {testimonials.map((t) => (
          <div key={t.id} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                {t.imageUrl && (
                  <img
                    src={t.imageUrl}
                    className="rounded-circle float-start me-3"
                    width="60"
                    height="60"
                    alt={t.studentName}
                  />
                )}
                <blockquote className="blockquote">
                  <p className="mb-0">"{t.content}"</p>
                  <footer className="blockquote-footer mt-2">
                    <strong>{t.studentName}</strong>{" "}
                    {t.program && `- ${t.program}`}
                    {t.rating && (
                      <span className="ms-2 text-warning">
                        {"★".repeat(t.rating)}
                      </span>
                    )}
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Testimonials;
