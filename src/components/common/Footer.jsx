import { useSettings } from "../../contexts/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>{settings?.brandName || "GDC Gulabad"}</h5>
            <p>{settings?.footerText || "Excellence in Education"}</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/programs">Programs</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <p>{settings?.contactPhone}</p>
            <p>{settings?.contactEmail}</p>
            <p>{settings?.contactAddress}</p>
            <div className="social-icons">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook"></i>
                </a>
              )}
              {settings?.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-twitter"></i>
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <small>
              &copy; {new Date().getFullYear()} {settings?.brandName}. All
              rights reserved.
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
