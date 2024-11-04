import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext"; 

const InterfaceSettings: React.FC = () => {
  const {
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
  } = useAppContext();

  const [sliderValue, setSliderValue] = useState(generalSettingsParams.wavelength);
  let timeoutId: NodeJS.Timeout | undefined;

  const handleSliderChange = (value: number) => {
    setSliderValue(value);

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setWavelength(value);
      setScaleFactor(value > 800 ? 100 : 10);
    }, 300);
  };

  return (
    <>
      <div id="genSettings">
        <label>
          Длина волны:
          <input
            type="range"
            value={sliderValue}
            min={50}
            max={20000}
            step={1}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
          />
          <span>{sliderValue}</span>
        </label>
        <label>
          Масштабный коэффициент:
          <select
            value={generalSettingsParams.scaleFactor}
            onChange={(e) => setScaleFactor(Number(e.target.value))}
          >
            {[10, 100, 1000].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div id="settings">
        <label>
          Количество источников:
          <select
            value={sourceCount}
            onChange={(e) => onSourceCountChange(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Отметка источников:
          <input
            type="checkbox"
            checked={showSources}
            onChange={(e) => onShowSourcesChange(e.target.checked)}
          />
        </label>
        <button onClick={onToggleRunning}>
          {running ? "Пауза" : "Запуск"}
        </button>
        <div>
          <h3>Подсветить и включить/выключить источники:</h3>
          {Array.from({ length: sourceCount }, (_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <label>
                <input
                  type="checkbox"
                  checked={sourceSettings[i].isHighlighted}
                  onChange={() => onToggleHighlight(i)}
                />
                Источник {i + 1}
              </label>
              <button
                onClick={() => onToggleEnabled(i)}
                style={{ marginLeft: "10px" }}
              >
                {sourceSettings[i].isEnabled ? "Выкл" : "Вкл"}
              </button>
              <label style={{ marginLeft: "10px" }}>
                Начальная фаза:
                <input
                  type="number"
                  value={sourceSettings[i].phase}
                  onChange={(e) => {
                    const newPhase = parseFloat(e.target.value);
                    onUpdatePhase(i, newPhase);
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  min={0}
                  max={6.28}
                  step={0.1}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InterfaceSettings;
