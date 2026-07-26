import { useSettings } from "../contexts/SettingsContext";
import Loader from "../components/common/Loader";

const About = () => {
  const { settings, loading } = useSettings();
  if (loading) return <Loader />;
  if (!settings) return <div>No settings found.</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">About Us</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">Vision</h3>
              <p>{settings.vision}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">Mission</h3>
              <p>{settings.mission}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">Aims</h3>
              <p>{settings.aims}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">What We Offer</h3>
              <p>{settings.whatWeOffer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
