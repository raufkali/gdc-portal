const ExamResult = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Exam Results</h1>
      <div className="card shadow-sm">
        <div className="card-body p-5">
          <div className="text-center py-5">
            <i className="bi bi-file-earmark-text display-1 text-muted"></i>
            <h3 className="mt-4">Results Coming Soon</h3>
            <p className="text-muted">
              Exam results will be published here as they become available.
            </p>
            <div className="alert alert-info mt-4">
              <i className="bi bi-info-circle me-2"></i>
              Please check back regularly for updates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
