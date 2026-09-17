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
import CollegeStarsSection from "../components/home/CollegeStarsSection";
import StudentActivitiesSection from "../components/home/StudentActivitiesSection";
import StudentAchievements from "./StudentAchievements";
import { prefetchHomeData } from "../firebase/db";
import { preloadImages, prefetchImages } from "../utils/cloudflare";
import StudentAchievementsSection from "../components/home/StudentAchievementsSection";

const Home = () => {
  useEffect(() => {
    prefetchHomeData().catch(() => {});

    const criticalImages = [];
    if (criticalImages.length > 0) {
      preloadImages(criticalImages);
    }

    const remainingImages = [];
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
        <CollegeStarsSection />
      </div>
      <div>
        <StudentActivitiesSection />
      </div>
      <div>
        <GalleryPreview />
      </div>
      <div>
        <VisionMissionAims />
      </div>
      <div>
        <StudentAchievementsSection />
      </div>
      <div>
        <TestimonialsSection />
      </div>
      <div>
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
