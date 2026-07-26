import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

const ProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  useEffect(() => {
    fetchCollection("programs").then(setPrograms);
  }, []);

  if (!programs.length) return null;
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">What We Offer</h2>
        <div className="row">
          {programs.slice(0, 4).map((program) => (
            <div key={program.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                {program.imageUrl && (
                  <img
                    src={program.imageUrl}
                    className="card-img-top"
                    alt={program.title}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{program.title}</h5>
                  <p className="card-text">
                    {program.description?.substring(0, 80)}...
                  </p>
                  <Link
                    to={`/programs/${program.slug || program.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/programs" className="btn btn-primary">
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ProgramsSection;
