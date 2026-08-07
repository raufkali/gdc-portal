import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { fetchDocument } from "../firebase/db"; // ← Import fetchDocument

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoPreloaded, setLogoPreloaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // ✅ Use fetchDocument with caching (same as HeroCarousel)
        const data = await fetchDocument("settings", "website", {
          cacheTTL: 5 * 60 * 1000, // 5 minutes
        });

        if (data) {
          setSettings(data);
          setError(null);

          // Preload logo if URL exists
          if (data.logoUrl) {
            preloadLogoImage(data.logoUrl);
          }
        } else {
          // Create default settings if doesn't exist
          const defaults = {
            brandName: "GDC Gulabad",
            logoUrl: "",
            tagline: "Excellence in Education",
            footerText: "Excellence in Education",
            footerCopyright: "© 2024 GDC Gulabad. All rights reserved.",
            contactPhone: "+92 123 4567890",
            contactEmail: "info@gdcgulabad.edu.pk",
            contactAddress: "Gulabad, District Chitral, KPK, Pakistan",
            facebook: "",
            twitter: "",
            instagram: "",
            youtube: "",
            linkedin: "",
            principalName: "Dr. Muhammad Ali",
            principalDesignation: "Principal, GDC Gulabad",
            principalImageUrl: "",
            principalMessage:
              "Welcome to GDC Gulabad. We are committed to providing quality education and fostering academic excellence.",
            vision: "To become a center of excellence in higher education...",
            mission:
              "To provide quality education through innovative teaching methodologies...",
            aims: "To offer diverse academic programs that meet the needs of the community...",
            whatWeOffer:
              "GDC Gulabad offers a wide range of undergraduate and graduate programs...",
          };

          const docRef = doc(db, "settings", "website");
          await setDoc(docRef, defaults);
          setSettings(defaults);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message);
        // Set fallback settings
        setSettings({
          brandName: "GDC Gulabad",
          contactPhone: "+92 123 4567890",
          contactEmail: "info@gdcgulabad.edu.pk",
          contactAddress: "Gulabad, District Chitral, KPK, Pakistan",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Preload logo image function
  const preloadLogoImage = (logoUrl) => {
    if (!logoUrl || logoPreloaded) return;

    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      setLogoPreloaded(true);
    };
    img.onerror = () => {
      console.warn("Logo preload failed");
    };
  };

  const updateSettings = async (newData) => {
    try {
      const docRef = doc(db, "settings", "website");
      await setDoc(docRef, newData, { merge: true });
      setSettings((prev) => ({ ...prev, ...newData }));

      if (newData.logoUrl && newData.logoUrl !== settings?.logoUrl) {
        preloadLogoImage(newData.logoUrl);
      }

      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, error, updateSettings, logoPreloaded }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
