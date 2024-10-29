import React, { useState } from "react";

interface InterfaceSettingsProps {
  sourceCount: number;
  showSources: boolean;
  running: boolean;
  onSourceCountChange: (count: number) => void;
  onShowSourcesChange: (show: boolean) => void;
  onToggleRunning: () => void;
  onToggleHighlight: (index: number) => void;
}

const InterfaceSettings: React.FC<InterfaceSettingsProps> = ({
  sourceCount,
  showSources,
  running,
  onSourceCountChange,
  onShowSourcesChange,
  onToggleRunning,
  onToggleHighlight,
}) => {
// подумать мб в контекст
  const [highlightedSources, setHighlightedSources] = useState<boolean[]>(
    Array(sourceCount).fill(false)
  );

  const handleHighlightToggle = (index: number) => {
    const updatedHighlights = [...highlightedSources];
    updatedHighlights[index] = !updatedHighlights[index];
    setHighlightedSources(updatedHighlights);
    onToggleHighlight(index); 
  };

  return (
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
      <button onClick={() => onToggleRunning()}>
        {running ? "Пауза" : "Запуск"}
      </button>
      <div>
        <h3>Подсветить источники:</h3>
        {Array.from({ length: sourceCount }, (_, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                checked={highlightedSources[i]}
                onChange={() => handleHighlightToggle(i)}
              />
              Источник {i + 1}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterfaceSettings;
