import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const DepartmentDetail = () => {
  const { slug } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("departments")
      .then((data) => {
        const found = data.find((d) => d.slug === slug || d.id === slug);
        setDept(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!dept)
    return (
      <div className="container py-5">
        <h2>Department not found</h2>
        <Link to="/departments">Back to Departments</Link>
      </div>
    );

  return (
    <div className="container py-5">
      <Link to="/departments" className="btn btn-outline-secondary mb-3">
        &larr; Back to Departments
      </Link>
      <div className="card shadow-sm">
        {dept.imageUrl && (
          <img
            src={dept.imageUrl}
            className="card-img-top"
            alt={dept.name}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}
        <div className="card-body">
          <h1>{dept.name}</h1>
          <p>{dept.description}</p>
          {dept.headName && (
            <p>
              <strong>Head:</strong> {dept.headName}
            </p>
          )}
          {dept.facultyCount && (
            <p>
              <strong>Faculty Count:</strong> {dept.facultyCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default DepartmentDetail;
