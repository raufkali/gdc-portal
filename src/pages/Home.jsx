import { useEffect } from "react";
import HeroCarousel from "../components/home/HeroCarousel";
import PrincipalSection from "../components/home/PrincipalSection";
import ProgramsSection from "../components/home/ProgramsSection";
import DepartmentsSection from "../components/home/DepartmentsSection";
import ActivitiesSection from "../components/home/ActivitiesSection";
import VisionMissionAims from "../components/home/VisionMissionAims";
import GalleryPreview from "../components/home/GalleryPreview";
import TestimonialsSection from "../components/home/TestimonialsSection";
import FaqSection from "../components/home/FaqSection";
import { prefetchHomeData } from "../firebase/db";
import { preloadImages, prefetchImages } from "../utils/cloudflare";
// import RecentUpdatePopup from "../components/RecentUpdates";
const Home = () => {
  useEffect(() => {
    //  Prefetch all home data
    prefetchHomeData().then(() => {});

    //  Preload critical images (first 3 gallery images)
    const criticalImages = [
      // Add your critical image URLs here
    ];
    if (criticalImages.length > 0) {
      preloadImages(criticalImages);
    }

    //  Prefetch remaining images
    const remainingImages = [
      // Add your remaining image URLs here
    ];
    if (remainingImages.length > 0) {
      prefetchImages(remainingImages);
    }
  }, []);

  return (
    <>
      <HeroCarousel />
      <div data-aos="fade-up" data-aos-duration="600" data-aos-once="false">
        <PrincipalSection />
      </div>
      <div>
        <ProgramsSection />
      </div>
      <div>
        <DepartmentsSection />
      </div>
      <div>
        <ActivitiesSection />
      </div>
      <div>
        <VisionMissionAims />
      </div>
      <div>
        <GalleryPreview />
      </div>
      <div>
        <TestimonialsSection />
      </div>
      <div>
        <FaqSection />
      </div>
      {/* <RecentUpdatePopup /> */}
    </>
  );
};

export default Home;
