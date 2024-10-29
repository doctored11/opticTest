import React, { useState } from "react";
import Canvas from "./canvas/Canvas";
import InterfaceSettings from "./interfaceSettings/InterfaceSettings";

export function Presenter() {
  const [running, setRunning] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [sourceCount, setSourceCount] = useState(2);
  const [highlightedSources, setHighlightedSources] = useState<boolean[]>(
    Array(sourceCount).fill(false)
  );

  const toggleHighlight = (index: number) => {
    const updatedHighlights = [...highlightedSources];
    updatedHighlights[index] = !updatedHighlights[index];
    setHighlightedSources(updatedHighlights);
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
        sourceCount={sourceCount}
        showSources={showSources}
        running={running}
        highlightedSources={highlightedSources} 
      />
      <InterfaceSettings
        sourceCount={sourceCount}
        showSources={showSources}
        running={running}
        onSourceCountChange={setSourceCount}
        onShowSourcesChange={setShowSources}
        onToggleRunning={() => setRunning(!running)}
        onToggleHighlight={toggleHighlight} 
      />
    </div>
  );
}
