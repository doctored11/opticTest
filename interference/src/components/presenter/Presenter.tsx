//)
import React, { useEffect, useState } from "react";
import Canvas from "./canvas/Canvas";
import InterfaceSettings from "./interfaceSettings/InterfaceSettings";
import { getScaleFactor, getDT } from "../presenter/canvas/parameters";
import { AppProvider } from "../../context/AppContext";

export interface SourceSettings {
  isEnabled: boolean;
  isHighlighted: boolean;
  phase: number;
}

export function Presenter() {
  return (
    <AppProvider>
      <div>
        <h3>😭</h3>
        <Canvas />
        <InterfaceSettings />
      </div>
    </AppProvider>
  );
}