import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getScaleFactor,
  getDT,
} from "../components/presenter/canvas/parameters";
import { SourceSettings } from "../components/presenter/Presenter";

interface AppContextProps {
  sourceCount: number;
  showSources: boolean;
  running: boolean;
  onSourceCountChange: (count: number) => void;
  onShowSourcesChange: (show: boolean) => void;
  onToggleRunning: () => void;
  onToggleHighlight: (index: number) => void;
  onToggleEnabled: (index: number) => void;
  onUpdatePhase: (index: number, phase: number) => void;
  sourceSettings: SourceSettings[];
  generalSettingsParams: { wavelength: number; scaleFactor: number };
  setWavelength: (value: number) => void;
  setScaleFactor: (value: number) => void;
  dt: number;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [running, setRunning] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [sourceCount, setSourceCount] = useState(2);
  const [sourceSettings, setSourceSettings] = useState<SourceSettings[]>(
    Array(2)
      .fill(null)
      .map(() => ({ isEnabled: true, isHighlighted: false, phase: 0 }))
  );

  const [generalSettingsParams, setGeneralSettingsParams] = useState({
    wavelength: 550,
    scaleFactor: 10,
  });

  const [dt, setDt] = useState(getDT(generalSettingsParams.scaleFactor));

  useEffect(() => {
    const newScaleFactor = getScaleFactor(generalSettingsParams.scaleFactor);
    setDt(getDT(newScaleFactor));
  }, [generalSettingsParams.scaleFactor, generalSettingsParams.wavelength]);

  const onToggleRunning = () => setRunning(!running);
  const onShowSourcesChange = (show: boolean) => setShowSources(show);
  const onSourceCountChange = (count: number) => {
    setSourceCount(count);
    updateSourceSettings(count);
  };

  const setWavelength = (wavelength: number) =>
    setGeneralSettingsParams((prev) => ({ ...prev, wavelength }));
  const setScaleFactor = (scaleFactor: number) =>
    setGeneralSettingsParams((prev) => ({ ...prev, scaleFactor }));

  const updateSourceSettings = (count: number) => {
    setSourceSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];
      if (count > prevSettings.length) {
        for (let i = prevSettings.length; i < count; i++) {
          updatedSettings.push({
            isEnabled: true,
            isHighlighted: false,
            phase: 0,
          });
        }
      } else if (count < prevSettings.length) {
        updatedSettings.length = count;
      }
      return updatedSettings;
    });
  };

  const onToggleEnabled = (index: number) => {
    setSourceSettings((prev) => {
      const updated = [...prev];
      updated[index].isEnabled = !updated[index].isEnabled;
      return updated;
    });
  };

  const onToggleHighlight = (index: number) => {
    setSourceSettings((prev) => {
      const updated = [...prev];
      updated[index].isHighlighted = !updated[index].isHighlighted;
      return updated;
    });
  };

  const onUpdatePhase = (index: number, newPhase: number) => {
    setSourceSettings((prev) => {
      const updated = [...prev];
      updated[index].phase = newPhase;
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        sourceCount,
        showSources,
        running,
        onSourceCountChange,
        onShowSourcesChange,
        onToggleRunning,
        onToggleHighlight,
        onToggleEnabled,
        onUpdatePhase,
        sourceSettings,
        generalSettingsParams,
        setWavelength,
        setScaleFactor,
        dt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
