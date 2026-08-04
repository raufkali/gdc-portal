import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollection } from "../firebase/db";
import Loader from "../components/common/Loader";

// ✅ Cache for program detail (by slug/id)
const cachedPrograms = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      // ✅ Check cache for this specific program
      const cacheKey = slug;
      if (
        cachedPrograms[cacheKey] &&
        cachedPrograms[cacheKey].timestamp &&
        Date.now() - cachedPrograms[cacheKey].timestamp < CACHE_TTL
      ) {
        setProgram(cachedPrograms[cacheKey].data);
        setFromCache(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCollection("programs");
        const found = data.find((p) => p.slug === slug || p.id === slug);

        if (found) {
          // ✅ Cache the found program
          cachedPrograms[cacheKey] = {
            data: found,
            timestamp: Date.now(),
          };
          setProgram(found);
          setFromCache(false);
        } else {
          setProgram(null);
        }
      } catch (error) {
        console.error("Error fetching program:", error);
        // ✅ Try to use stale cache if available
        if (cachedPrograms[cacheKey]) {
          setProgram(cachedPrograms[cacheKey].data);
          setFromCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
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
