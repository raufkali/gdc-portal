import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="text-center py-5">
        <h1 className="display-1 text-muted">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
