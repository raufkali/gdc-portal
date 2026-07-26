import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCollection } from "../../firebase/db";

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    fetchCollection("departments").then(setDepartments);
  }, []);

  if (!departments.length) return null;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Our Departments</h2>
        <div className="row">
          {departments.slice(0, 4).map((dept) => (
            <div key={dept.id} className="col-md-3 mb-4">
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
                  <Link
                    to={`/departments/${dept.slug || dept.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Department
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/departments" className="btn btn-primary">
            All Departments
          </Link>
        </div>
      </div>
    </section>
  );
};
export default DepartmentsSection;
