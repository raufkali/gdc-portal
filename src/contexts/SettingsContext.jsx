import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "website");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        // create default settings if missing
        const defaults = { brandName: "GDC Gulabad" /* ... */ };
        await setDoc(docRef, defaults);
        setSettings(defaults);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newData) => {
    const docRef = doc(db, "settings", "website");
    await setDoc(docRef, newData, { merge: true });
    setSettings((prev) => ({ ...prev, ...newData }));
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
