import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const q = query(
        collection(db, "banners"),
        where("active", "==", true),
        orderBy("order"),
      );
      const snap = await getDocs(q);
      setBanners(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBanners();
  }, []);

  if (!banners.length) return null;

  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-aos="fade-in"
    >
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={banner.imageUrl}
              className="d-block w-100"
              alt={banner.title}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>{banner.title}</h3>
              <p>{banner.subtitle}</p>
              <a href="#programs" className="btn btn-primary">
                Explore Programs
              </a>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default HeroCarousel;
