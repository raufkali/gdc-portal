import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Testimonials = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const students = [
    {
      id: 1,
      name: "Zubair Ahmad",
      dept: "BS Physics (Alumni)",
      text: "The faculty at GDC Gulabad is incredibly supportive. The hands-on experience in the Physics lab helped me secure a scholarship for my Masters.",
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY", // Replace with real student video
      rating: 5,
      color: "#0dcaf0"
    },
    {
      id: 2,
      name: "Ayesha Khan",
      dept: "BS Economics",
      text: "GDC Gulabad provides a competitive yet friendly environment. The library resources and digital labs are top-notch for research-based studies.",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
      rating: 5,
      color: "#6610f2"
    },
    {
      id: 3,
      name: "Muhammad Ali",
      dept: "BS Computer Science",
      text: "Starting my journey here was the best decision. The IT department prepared me for the tech industry with modern programming curriculum.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
      rating: 5,
      color: "#fd7e14"
    }
  ];

  return (
    <section className="testimonials-advanced py-5">
      <div className="container py-5">
        <div className="text-center mb-5">
          <span className="badge rounded-pill bg-info-subtle text-info px-3 py-2 mb-3 fw-bold text-uppercase tracking-wider">Student Voices</span>
          <h2 className="display-5 fw-bold text-dark">Success <span className="text-info">Stories</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Real experiences from students who have shaped their futures at Govt Degree College Gulabad.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {students.map((student) => (
            <div className="col-lg-4 col-md-6" key={student.id}>
              <div className="testimonial-card shadow-lg p-4 rounded-5 bg-white h-100 position-relative border-0">
                <div className="quote-icon position-absolute top-0 end-0 m-4 opacity-10">
                  <i className="bi bi-quote fs-1"></i>
                </div>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="position-relative">
                    <img src={student.img} className="rounded-circle border border-3 shadow-sm" style={{ width: "70px", height: "70px", objectFit: "cover", borderColor: student.color }} alt={student.name} />
                    <button 
                      className="btn btn-sm btn-info rounded-circle position-absolute bottom-0 end-0 p-1 shadow animate-pulse"
                      onClick={() => setSelectedVideo(student.videoUrl)}
                    >
                      <i className="bi bi-play-fill text-white"></i>
                    </button>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-bold">{student.name}</h6>
                    <small className="text-muted">{student.dept}</small>
                  </div>
                </div>

                <div className="star-rating mb-3">
                  {[...Array(student.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning me-1 small"></i>
                  ))}
                </div>

                <p className="text-secondary mb-0 fw-medium lh-lg">
                   "{student.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="video-modal-overlay d-flex align-items-center justify-content-center p-3" onClick={() => setSelectedVideo(null)}>
          <div className="position-relative bg-black rounded-4 overflow-hidden shadow-2xl w-100" style={{ maxWidth: "800px" }}>
            <button className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 z-3" onClick={() => setSelectedVideo(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="ratio ratio-16x9">
              <iframe src={selectedVideo} title="Student Story" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .testimonials-advanced { background: #f8fafc; overflow: hidden; }
        .testimonial-card { 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            cursor: default;
            border-bottom: 5px solid transparent !important;
        }
        .testimonial-card:hover { 
            transform: translateY(-12px); 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
            border-bottom: 5px solid #0dcaf0 !important;
        }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(13, 202, 240, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(13, 202, 240, 0); }
          100% { box-shadow: 0 0 0 0 rgba(13, 202, 240, 0); }
        }
        .video-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 25, 47, 0.9);
            z-index: 10000;
            backdrop-filter: blur(8px);
        }
        .tracking-wider { letter-spacing: 0.1rem; }
      `}</style>
    </section>
  );
};

export default Testimonials;