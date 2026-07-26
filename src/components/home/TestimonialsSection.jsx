import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    fetchCollection("testimonials").then(setTestimonials);
  }, []);

  if (!testimonials.length) return null;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">What Students Say</h2>
        <div className="row">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {t.imageUrl && (
                    <img
                      src={t.imageUrl}
                      className="rounded-circle me-2"
                      width="50"
                      height="50"
                      alt={t.studentName}
                    />
                  )}
                  <blockquote className="blockquote">
                    <p className="mb-0">"{t.content}"</p>
                    <footer className="blockquote-footer mt-2">
                      <strong>{t.studentName}</strong>{" "}
                      {t.program && `- ${t.program}`}
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/testimonials" className="btn btn-primary">
            All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
};
export default TestimonialsSection;
