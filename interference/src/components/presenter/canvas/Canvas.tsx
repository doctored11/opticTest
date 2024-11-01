import React, { useEffect, useRef } from "react";
import { createSources } from "./createSources";
import { animateCanvas } from "./animateCanvas";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./parameters";

import { PointSource } from "../../elements/PointSource";
import { SourceSettings } from "../Presenter";

interface CanvasProps {
  showSources: boolean;
  running: boolean;
  sourceSettings: SourceSettings[];
  scaleFactor: number;
  dt: number;
  wavelength: number;
}

const Canvas: React.FC<CanvasProps> = ({
  showSources,
  running,
  sourceSettings,
  scaleFactor,
  dt,
  wavelength,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const amplitudeCanvasRef = useRef<HTMLCanvasElement>(null); 

  const sourcesRef = useRef<PointSource[]>([]);
  const fieldsRef = useRef<number[][][]>([]);

  const tRef = useRef(0);
  const animationRef = useRef<number | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const amplitudeCanvas = amplitudeCanvasRef.current;
    if (!canvas || !amplitudeCanvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    amplitudeCanvas.width = CANVAS_WIDTH;
    amplitudeCanvas.height = CANVAS_HEIGHT;
  }, []);

  useEffect(() => {
    const { sources, fields } = createSources(sourceSettings, wavelength, scaleFactor);
    sourcesRef.current = sources;
    fieldsRef.current = fields;
  }, [sourceSettings.length, ...sourceSettings.map((el) => el.phase),wavelength,scaleFactor]);

  useEffect(() => {
    function animate() {
      animateCanvas(
        canvasRef,
        amplitudeCanvasRef,
        sourcesRef.current,
        fieldsRef.current,
        tRef,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        showSources,
        dt,
        sourceSettings
      );

      if (running) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    if (running && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [running, showSources, sourceSettings,dt]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <canvas ref={amplitudeCanvasRef}></canvas>{" "}
      
    </div>
  );
};

export default Canvas;
