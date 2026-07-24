import React, { useState, useEffect } from "react";

const StatsBar = () => {
  const stats = [
    { id: 1, label: "Active Students", target: 1200, suffix: "+", icon: "bi-people" },
    { id: 2, label: "Expert Faculty", target: 45, suffix: "+", icon: "bi-mortarboard" },
    { id: 3, label: "BS Programs", target: 12, suffix: "", icon: "bi-journal-check" },
    { id: 4, label: "Total Alumni", target: 5000, suffix: "+", icon: "bi-award" },
  ];

  return (
    <section className="py-5" style={{ 
      background: "linear-gradient(135deg, #0a192f 0%, #112240 100%)", // Deep Navy Gradient
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative background circle */}
      <div style={{
        position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px",
        background: "rgba(0, 162, 255, 0.05)", borderRadius: "50%"
      }}></div>

      <div className="container position-relative">
        <div className="row g-4">
          {stats.map((stat) => (
            <div key={stat.id} className="col-6 col-md-3">
              <div className="text-center p-4 h-100 stat-card">
                <div className="icon-box mb-3 mx-auto shadow-sm">
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <h2 className="display-5 fw-bold text-white mb-1">
                  <CountUp end={stat.target} />{stat.suffix}
                </h2>
                <p className="text-info fw-bold small text-uppercase mb-0" style={{ letterSpacing: "2px" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stat-card {
          transition: transform 0.3s ease;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .stat-card:last-child { border-right: none; }
        .stat-card:hover { transform: translateY(-5px); }
        
        .icon-box {
          width: 60px; height: 60px;
          background: rgba(0, 162, 255, 0.1);
          border: 1px solid rgba(0, 162, 255, 0.3);
          border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          color: #00a2ff; font-size: 1.8rem;
          transition: 0.3s;
        }
        .stat-card:hover .icon-box {
          background: #00a2ff;
          color: white;
          box-shadow: 0 0 20px rgba(0, 162, 255, 0.4);
        }
        
        @media (max-width: 768px) {
          .stat-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .stat-card:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
};

const CountUp = ({ end }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count}</span>;
};

export default StatsBar;