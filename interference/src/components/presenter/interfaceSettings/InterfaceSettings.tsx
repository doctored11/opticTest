import React from "react";

interface InterfaceSettingsProps {
  sourceCount: number;
  showSources: boolean;
  running: boolean;
  onSourceCountChange: (count: number) => void;
  onShowSourcesChange: (show: boolean) => void;
  onToggleRunning: () => void;
}

const InterfaceSettings: React.FC<InterfaceSettingsProps> = ({
  sourceCount,
  showSources,
  running,
  onSourceCountChange,
  onShowSourcesChange,
  onToggleRunning,
}) => (
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
  </div>
);

export default InterfaceSettings;
