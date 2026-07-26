import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("programs")
      .then(setPrograms)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Our Programs</h1>
      <div className="row">
        {programs.map((program) => (
          <div key={program.id} className="col-md-4 mb-4">
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
                  {program.description?.substring(0, 120)}...
                </p>
                <Link
                  to={`/programs/${program.slug || program.id}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Programs;
