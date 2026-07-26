import { useSettings } from "../../contexts/SettingsContext";

const VisionMissionAims = () => {
  const { settings } = useSettings();
  if (!settings) return null;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-primary">Vision</h3>
                <p className="card-text">{settings.vision}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-primary">Mission</h3>
                <p className="card-text">{settings.mission}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-primary">Aims</h3>
                <p className="card-text">{settings.aims}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">What We Offer</h3>
              <p>{settings.whatWeOffer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default VisionMissionAims;
