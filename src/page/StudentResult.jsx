import React, { useState } from "react";

const StudentResult = () => {
  const [search, setSearch] = useState({ rollNo: "", dept: "", semester: "" });
  const [foundResult, setFoundResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const departments = ["Computer Science", "Physics", "Chemistry", "Mathematics", "English", "Botany", "Zoology", "Economics", "Political Science", "History", "Urdu"];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

  const handleSearch = () => {
    setHasSearched(true);
    const allData = JSON.parse(localStorage.getItem("gdc_results") || "{}");
    
    // Digging through the nested object: Dept -> Semester -> Courses
    const deptData = allData[search.dept];
    if (deptData && deptData[search.semester]) {
      const semesterData = deptData[search.semester];
      let studentRecords = [];

      // Look through all courses in that semester
      Object.keys(semesterData).forEach(courseName => {
        const student = semesterData[courseName].find(s => s.rollNo === search.rollNo);
        if (student) {
          studentRecords.push({ courseName, ...student });
        }
      });

      setFoundResult(studentRecords.length > 0 ? studentRecords : null);
    } else {
      setFoundResult(null);
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: "80vh", background: "#f8f9fa" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* SEARCH BOX */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h3 className="fw-bold text-center mb-4">Check Internal Marks (Mid-Term)</h3>
            <div className="row g-3">
              <div className="col-md-4">
                <select className="form-select shadow-none" onChange={(e) => setSearch({ ...search, dept: e.target.value })}>
                  <option value="">Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select shadow-none" onChange={(e) => setSearch({ ...search, semester: e.target.value })}>
                  <option value="">Semester</option>
                  {semesters.map(s => <option key={s} value={s}>{s} Semester</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <input type="text" className="form-control shadow-none" placeholder="Roll Number" onChange={(e) => setSearch({ ...search, rollNo: e.target.value })} />
              </div>
              <div className="col-12">
                <button className="btn btn-primary w-100 fw-bold py-2 rounded-3" onClick={handleSearch}>
                  <i className="bi bi-search me-2"></i> Find My Results
                </button>
              </div>
            </div>
          </div>

          {/* RESULT DISPLAY */}
          {hasSearched && foundResult && (
            <div className="fade-in">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="bg-dark text-white p-4 text-center">
                  <h4 className="mb-1">{foundResult[0].name}</h4>
                  <p className="mb-0 opacity-75">Roll No: {search.rollNo} | {search.dept}</p>
                </div>
                
                <div className="p-4">
                  <table className="table table-hover border-top">
                    <thead className="table-light">
                      <tr>
                        <th>Subject/Course</th>
                        <th className="text-center">Attn (7)</th>
                        <th className="text-center">Mid (20)</th>
                        <th className="text-center">Pres (7)</th>
                        <th className="text-center">Assgn (6)</th>
                        <th className="text-center fw-bold">Total (40)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foundResult.map((res, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{res.courseName}</td>
                          <td className="text-center">{res.attendance}</td>
                          <td className="text-center">{res.midPaper}</td>
                          <td className="text-center">{res.presentation}</td>
                          <td className="text-center">{res.assignment}</td>
                          <td className="text-center fw-bold text-primary">{res.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="alert alert-info small mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    These are internal marks only. Final 60 marks are conducted by the University.
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
                  <i className="bi bi-printer me-2"></i> Print Result
                </button>
              </div>
            </div>
          )}

          {/* NOT FOUND STATE */}
          {hasSearched && !foundResult && (
            <div className="text-center p-5 bg-white rounded-4 shadow-sm">
              <i className="bi bi-exclamaion-triangle text-warning display-1"></i>
              <h4 className="mt-3">No Result Found</h4>
              <p className="text-muted">Please check your Roll Number, Department, and Semester again.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        th { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default StudentResult;