"use client";

import * as React from "react";

export const SettingsContext = React.createContext(null);

export default function SettingsProvider({ children }) {
  const [isSpellcheckEnabled, setIsSpellcheckEnabled] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedSetting = localStorage.getItem("spellcheckEnabled");
      if (savedSetting !== null) {
        setIsSpellcheckEnabled(JSON.parse(savedSetting));
      }
    } catch (error) {
      console.error("Could not read spellcheck setting from localStorage", error);
    }
  }, []);

  const toggleSpellcheck = () => {
    setIsSpellcheckEnabled(currentState => {
      const newState = !currentState;
      try {
        localStorage.setItem("spellcheckEnabled", JSON.stringify(newState));
      } catch (error)
      {
        console.error("Could not save spellcheck setting to localStorage", error);
      }
      return newState;
    });
  };

  return (
    <SettingsContext.Provider value={{ isSpellcheckEnabled, toggleSpellcheck }}>
      {children}
    </SettingsContext.Provider>
  );
}