import React, { useEffect, useRef } from "react";
import { createSources } from "./createSources";
import { animateCanvas } from "./animateCanvas";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./parameters";
import { useAppContext } from "../../../context/AppContext";
import { PointSource } from "../../elements/PointSource";

const Canvas: React.FC = () => {
  const {
    showSources,
    running,
    sourceSettings,
    generalSettingsParams,
    dt,
  } = useAppContext(); 

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
    const { sources, fields } = createSources(
      sourceSettings,
      generalSettingsParams.wavelength,
      generalSettingsParams.scaleFactor
    );
    sourcesRef.current = sources;
    fieldsRef.current = fields;
  }, [
    sourceSettings.length,
    ...sourceSettings.map((el) => el.phase),
    generalSettingsParams.wavelength,
    generalSettingsParams.scaleFactor,
  ]);

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
  }, [running, showSources, sourceSettings, dt]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <canvas ref={amplitudeCanvasRef}></canvas>
    </div>
  );
};

export default Canvas;
