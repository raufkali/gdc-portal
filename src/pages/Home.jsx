import HeroCarousel from "../components/home/HeroCarousel";
import PrincipalSection from "../components/home/PrincipalSection";
import ProgramsSection from "../components/home/ProgramsSection";
import DepartmentsSection from "../components/home/DepartmentsSection";
import ActivitiesSection from "../components/home/ActivitiesSection";
import VisionMissionAims from "../components/home/VisionMissionAims";
import GalleryPreview from "../components/home/GalleryPreview";
import TestimonialsSection from "../components/home/TestimonialsSection";
import FaqSection from "../components/home/FaqSection";

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <div data-aos="fade-up">
        <PrincipalSection />
      </div>
      <div data-aos="fade-up">
        <ProgramsSection />
      </div>
      <div data-aos="fade-up">
        <DepartmentsSection />
      </div>
      <div data-aos="fade-up">
        <ActivitiesSection />
      </div>
      <div data-aos="fade-up">
        <VisionMissionAims />
      </div>
      <div data-aos="fade-up">
        <GalleryPreview />
      </div>
      <div data-aos="fade-up">
        <TestimonialsSection />
      </div>
      <div data-aos="fade-up">
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
