// todo - почистить проспсы в объекты
// в контекст все погрузить
import React, { useEffect, useState } from "react";
import Canvas from "./canvas/Canvas";
import InterfaceSettings from "./interfaceSettings/InterfaceSettings";
import { getScaleFactor, getDT } from "../presenter/canvas/parameters";

export interface SourceSettings {
  isEnabled: boolean;
  isHighlighted: boolean;
  phase: number;
}

export function Presenter() {
  const [running, setRunning] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [sourceCount, setSourceCount] = useState(2);
  const [sourceSettings, setSourceSettings] = useState<SourceSettings[]>(
    Array(sourceCount)
      .fill(null)
      .map(() => ({
        isEnabled: true,
        isHighlighted: false,
        phase: 0,
      }))
  );

  const [generalSettingsParams, setgeneralSettingsParams] = useState({
    wavelength: 550,
    scaleFactor: 10,
  });
  const [dt, setDt] = useState(getDT(generalSettingsParams.scaleFactor));

  const setWavelength = (wavelength: number) =>
    setgeneralSettingsParams((prev) => ({ ...prev, wavelength }));
  const setScaleFactor = (scaleFactor: number) =>
    setgeneralSettingsParams((prev) => ({ ...prev, scaleFactor }));

  const toggleEnabled = (index: number) => {
    const updatedSettings = [...sourceSettings];
    updatedSettings[index].isEnabled = !updatedSettings[index].isEnabled;
    setSourceSettings(updatedSettings);
  };

  const toggleHighlight = (index: number) => {
    const updatedSettings = [...sourceSettings];
    updatedSettings[index].isHighlighted =
      !updatedSettings[index].isHighlighted;
    setSourceSettings(updatedSettings);
  };
  const scaleFactor = getScaleFactor(
    // generalSettingsParams.wavelength,
    generalSettingsParams.scaleFactor
  );
  useEffect(() => {
    setDt(getDT(scaleFactor));
  }, [scaleFactor,generalSettingsParams]);

  const updatePhase = (index: number, newPhase: number) => {
    const updatedSettings = [...sourceSettings];
    updatedSettings[index].phase = newPhase;
    setSourceSettings(updatedSettings);
  };
  const updateSourceSettings = (newSourceCount: number) => {
    setSourceSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];

     
      if (newSourceCount > prevSettings.length) {
        for (let i = prevSettings.length; i < newSourceCount; i++) {
          updatedSettings.push({
            isEnabled: true,
            isHighlighted: false,
            phase: 0,
          });
        }
      } else if (newSourceCount < prevSettings.length) {
        updatedSettings.length = newSourceCount;
      }

      return updatedSettings;
    });
  };

  // прикол
  const targetDate = new Date("2024-10-26T13:00:00");
  const now = new Date();
  const differenceInMs = now.getTime() - targetDate.getTime();
  const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
  // ---

  return (
    <div>
      <h3>Стреляю в колено {hours} часов</h3>
      <Canvas
        showSources={showSources}
        running={running}
        sourceSettings={sourceSettings}
        scaleFactor={scaleFactor}
        dt={dt}
        wavelength={generalSettingsParams.wavelength}
      />
      <InterfaceSettings
        sourceCount={sourceCount}
        showSources={showSources}
        running={running}
        onSourceCountChange={(count) => {
          setSourceCount(count);
          updateSourceSettings(count);
        }}
        onShowSourcesChange={setShowSources}
        onToggleRunning={() => setRunning(!running)}
        onToggleHighlight={toggleHighlight}
        onToggleEnabled={toggleEnabled}
        onUpdatePhase={updatePhase}
        sourceSettings={sourceSettings}
        generalSettingsParams={generalSettingsParams} 
        setWavelength={setWavelength}
        setScaleFactor={setScaleFactor}
      />
    </div>
  );
}
function userEffect(arg0: () => number) {
  throw new Error("Function not implemented.");
}
