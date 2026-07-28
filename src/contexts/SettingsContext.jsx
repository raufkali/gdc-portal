import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "website");

        // Try to get the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSettings(docSnap.data());
        } else {
          // Create default settings if document doesn't exist
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
          await setDoc(docRef, defaults);
          setSettings(defaults);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message);
        // Set fallback settings on error
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

  const updateSettings = async (newData) => {
    try {
      const docRef = doc(db, "settings", "website");
      await setDoc(docRef, newData, { merge: true });
      setSettings((prev) => ({ ...prev, ...newData }));
      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, error, updateSettings }}
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
