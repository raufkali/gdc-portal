import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection("departments")
      .then(setDepartments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Our Departments</h1>
      <div className="row">
        {departments.map((dept) => (
          <div key={dept.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {dept.imageUrl && (
                <img
                  src={dept.imageUrl}
                  className="card-img-top"
                  alt={dept.name}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{dept.name}</h5>
                <p className="card-text">
                  {dept.description?.substring(0, 100)}...
                </p>
                <Link
                  to={`/departments/${dept.slug || dept.id}`}
                  className="btn btn-primary"
                >
                  View Department
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Departments;
