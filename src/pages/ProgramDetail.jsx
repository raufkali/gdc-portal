import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("programs")
      .then((data) => {
        const found = data.find((p) => p.slug === slug || p.id === slug);
        setProgram(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!program)
    return (
      <div className="container py-5 mt-5">
        <h2>Program not found</h2>
        <Link to="/programs">Back to Programs</Link>
      </div>
    );

  return (
    <div className="container py-5 mt-5">
      <Link to="/programs" className="btn btn-outline-secondary mb-3">
        &larr; Back to Programs
      </Link>
      <div className="card shadow-sm">
        {program.imageUrl && (
          <img
            src={program.imageUrl}
            className="card-img-top"
            alt={program.title}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        <div className="card-body">
          <h1>{program.title}</h1>
          <p className="lead">{program.description}</p>
          {program.duration && (
            <p>
              <strong>Duration:</strong> {program.duration}
            </p>
          )}
          {program.eligibility && (
            <p>
              <strong>Eligibility:</strong> {program.eligibility}
            </p>
          )}
          {program.fee && (
            <p>
              <strong>Fee Structure:</strong> {program.fee}
            </p>
          )}
          {/* Add other custom fields as needed */}
        </div>
      </div>
    </div>
  );
};
export default ProgramDetail;
