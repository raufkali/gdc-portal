const EligibilityCriteria = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Eligibility Criteria</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h4>For Bachelor Programs (BA / B.Sc / B.Com)</h4>
          <ul>
            <li>Intermediate (FA / F.Sc / ICS) with at least 45% marks</li>
            <li>Minimum age: 18 years</li>
            <li>Local/Domicile certificate</li>
          </ul>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h4>For Master Programs (MA / M.Sc)</h4>
          <ul>
            <li>Bachelor degree in relevant subject with at least 45% marks</li>
            <li>No age limit</li>
            <li>Bachelor degree transcript</li>
          </ul>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4 bg-light">
          <h5 className="text-primary">Important Note</h5>
          <p className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Final eligibility is determined by the college admission committee.
            Contact the admission office for any queries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCriteria;
