import React, { useEffect } from "react";

const FeeStructure = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rows = [
    {
      program: "BS Computer Science",
      admission: "Rs. 3,500",
      semester: "Rs. 9,500",
      fund: "Rs. 1,200",
    },
    {
      program: "BS Mathematics",
      admission: "Rs. 3,000",
      semester: "Rs. 7,500",
      fund: "Rs. 1,200",
    },
    {
      program: "BS Physics / Chemistry",
      admission: "Rs. 3,200",
      semester: "Rs. 8,000",
      fund: "Rs. 1,200",
    },
    {
      program: "BS English / Urdu",
      admission: "Rs. 2,800",
      semester: "Rs. 6,800",
      fund: "Rs. 1,200",
    },
    {
      program: "BS Economics / Political Science",
      admission: "Rs. 2,800",
      semester: "Rs. 7,000",
      fund: "Rs. 1,200",
    },
  ];

  return (
    <div className="bg-white min-vh-100">
      <header className="fee-hero d-flex align-items-center text-center text-white">
        <div className="container">
          <span className="eyebrow eyebrow-light justify-content-center d-inline-flex mb-3">
            Admissions
          </span>
          <h1 className="display-4 fw-bold mb-3">Fee Structure</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: 700 }}>
            Approved per-semester fee schedule for all BS programs, as notified
            by the Higher Education Department, KP.
          </p>
        </div>
      </header>

      <div className="container py-5" style={{ marginTop: "-40px" }}>
        <div className="table-responsive rounded-4 shadow-sm bg-white overflow-hidden">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="table-header-row">
                <th className="p-3">Program</th>
                <th className="p-3">Admission Fee (one-time)</th>
                <th className="p-3">Tuition (per semester)</th>
                <th className="p-3">College Fund (per semester)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="p-3 fw-bold">{r.program}</td>
                  <td className="p-3">{r.admission}</td>
                  <td className="p-3">{r.semester}</td>
                  <td className="p-3">{r.fund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="alert-note mt-4 p-4 rounded-4">
          <i className="bi bi-info-circle-fill me-2 text-crimson"></i>
          Fee figures are indicative and subject to the latest HED notification.
          Need-based fee concessions are available through the ISAC committee —
          see our{" "}
          <a href="/faq" className="fw-bold">
            FAQs
          </a>{" "}
          for details.
        </div>
      </div>

      <style>{`
        .fee-hero { background: linear-gradient(rgba(30,27,24,0.88), rgba(30,27,24,0.88)), url('https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') center/cover no-repeat; min-height: 340px; }
        .table-header-row { background: var(--ink, #1E1B18); color: #fff; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
        .text-crimson { color: var(--crimson, #A51C30); }
        .alert-note { background: var(--crimson-tint, #FBEAEC); border: 1px solid rgba(165,28,48,0.15); color: var(--ink, #1E1B18); }
        .alert-note a { color: var(--crimson, #A51C30); }
      `}</style>
    </div>
  );
};

export default FeeStructure;
