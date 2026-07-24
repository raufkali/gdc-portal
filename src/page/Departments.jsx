import React, { useState } from "react";

const Departments = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const depts = [
    { 
        id: 1, 
        category: "Science", 
        name: "Computer Science", 
        icon: "bi-laptop", 
        desc: "Digital Innovation", 
        programs: "BS, ADP", 
        strength: 85,
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
    },
    { 
        id: 2, 
        category: "Science", 
        name: "Zoology", 
        icon: "bi-bug", 
        desc: "Life Sciences", 
        programs: "BS", 
        strength: 70,
        image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80"
    },
    { 
        id: 3, 
        category: "Science", 
        name: "Physics", 
        icon: "bi-lightning-charge", 
        desc: "Physical Laws", 
        programs: "BS", 
        strength: 65,
        image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80"
    },
    { 
        id: 4, 
        category: "Science", 
        name: "Botany", 
        icon: "bi-flower1", 
        desc: "Plant Biology", 
        programs: "BS", 
        strength: 75,
        image: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=600&q=80"
    },
  { 
    id: 5, 
    category: "Science", 
    name: "Chemistry", 
    icon: "bi-flask", // Changed to a flask icon for better visual relevance
    desc: "Molecular Science", 
    programs: "BS", 
    strength: 80,
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80"
},
    { 
        id: 6, 
        category: "Arts", 
        name: "English", 
        icon: "bi-translate", 
        desc: "Global Language", 
        programs: "BS, ADP", 
        strength: 90,
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80"
    },
    { 
        id: 7, 
        category: "Science", 
        name: "Mathematics", 
        icon: "bi-calculator", 
        desc: "Logic & Numbers", 
        programs: "BS", 
        strength: 60,
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80"
    },
    { 
        id: 8, 
        category: "Arts", 
        name: "Political Science", 
        icon: "bi-bank", 
        desc: "State & Policy", 
        programs: "BS", 
        strength: 55,
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=600&q=80"
    },
  ];

  const filteredDepts = activeCategory === "All" 
    ? depts 
    : depts.filter(d => d.category === activeCategory);

  return (
    <section className="py-5" style={{ background: "#F8FAFC" }}>
      <div className="container">
        {/* Header with Filter */}
        <div className="d-md-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: "#1E293B", fontSize: "2.2rem" }}>Academic Departments</h2>
            <p className="text-muted mb-0">Discover excellence across various disciplines.</p>
          </div>
          
          <div className="mt-3 mt-md-0 p-1 bg-white rounded-pill shadow-sm border d-inline-flex">
            {["All", "Science", "Arts"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm rounded-pill px-4 transition-all ${
                  activeCategory === cat ? "btn-primary shadow-sm" : "btn-light border-0 text-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {filteredDepts.map((dept) => (
            <div key={dept.id} className="col-12 col-sm-6 col-lg-3">
              <div className="dept-card-premium overflow-hidden h-100 bg-white shadow-sm border">
                
                {/* Image Header */}
                <div className="position-relative" style={{ height: "160px" }}>
                    <img 
                        src={dept.image} 
                        alt={dept.name} 
                        className="w-100 h-100 object-fit-cover transition-img"
                    />
                    <div className="image-overlay"></div>
                    <span className="badge-soft position-absolute top-0 end-0 m-3">{dept.category}</span>
                    <div className="premium-icon-floating">
                        <i className={`bi ${dept.icon}`}></i>
                    </div>
                </div>

                <div className="p-4 pt-5">
                    {/* Title & Desc */}
                    <h5 className="fw-bold mb-2" style={{ color: "#0F172A" }}>{dept.name}</h5>
                    <p className="text-muted small mb-4">{dept.desc}</p>

                    {/* Capacity Indicator */}
                    <div className="mb-4">
                       <div className="d-flex justify-content-between mb-1">
                          <span className="x-small fw-bold text-muted text-uppercase">Enrollment</span>
                          <span className="x-small fw-bold text-primary">{dept.strength}%</span>
                       </div>
                       <div className="progress" style={{ height: '4px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${dept.strength}%`, borderRadius: '2px' }}
                          ></div>
                       </div>
                    </div>

                    {/* Programs Tag & Link */}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                       <span className="text-muted x-small">Programs: <strong>{dept.programs}</strong></span>
                       <button className="btn-circle-link"><i className="bi bi-arrow-right"></i></button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .transition-img { transition: transform 0.5s ease; }
        
        .dept-card-premium {
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: 1px solid #E2E8F0 !important;
        }

        .dept-card-premium:hover {
          transform: translateY(-8px);
          border-color: #3B82F6 !important;
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1) !important;
        }

        .dept-card-premium:hover .transition-img {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0));
        }

        .premium-icon-floating {
          position: absolute;
          bottom: -25px;
          left: 25px;
          width: 50px;
          height: 50px;
          background: #3B82F6;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
          z-index: 2;
        }

        .badge-soft {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          color: #1E293B;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-uppercase;
        }

        .btn-circle-link {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          background: white;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
        }

        .dept-card-premium:hover .btn-circle-link {
          background: #3B82F6;
          color: white;
          border-color: #3B82F6;
        }

        .x-small { font-size: 0.7rem; }
        .progress { background-color: #F1F5F9; }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </section>
  );
};

export default Departments;