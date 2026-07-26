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

      {/* Sections with fast AOS (no delay) */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-once="true">
        <PrincipalSection />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="100"
      >
        <ProgramsSection />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="200"
      >
        <DepartmentsSection />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="100"
      >
        <ActivitiesSection />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="150"
      >
        <VisionMissionAims />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="100"
      >
        <GalleryPreview />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="100"
      >
        <TestimonialsSection />
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-once="true"
        data-aos-delay="50"
      >
        <FaqSection />
      </div>
    </>
  );
};

export default Home;
