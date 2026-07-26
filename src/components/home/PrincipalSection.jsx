import { useSettings } from "../../contexts/SettingsContext";

const PrincipalSection = () => {
  const { settings } = useSettings();
  if (!settings) return null;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center">
            {settings.principalImageUrl && (
              <img
                src={settings.principalImageUrl}
                alt={settings.principalName}
                className="img-fluid rounded-circle shadow"
                style={{ maxWidth: "250px" }}
              />
            )}
          </div>
          <div className="col-md-8">
            <h2>Message from the Principal</h2>
            <h4 className="text-primary">{settings.principalName}</h4>
            <p className="lead">
              {settings.principalMessage || "Welcome to our college."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PrincipalSection;
