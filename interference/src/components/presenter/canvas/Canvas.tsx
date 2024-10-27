import React, { useEffect, useRef } from "react";
import { createSources } from "./createSources";
import { animateCanvas } from "./animateCanvas";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DT } from "./constants";
import { PointSource } from "../../elements/PointSource";

interface CanvasProps {
  sourceCount: number;
  showSources: boolean;
  running: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  sourceCount,
  showSources,
  running,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sourcesRef = useRef<PointSource[]>([]);
  const fieldsRef = useRef<number[][][]>([]);

  const tRef = useRef(0);
  const animationRef = useRef<number | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }, []);

  useEffect(() => {
    const { sources, fields } = createSources(sourceCount);
    sourcesRef.current = sources;
    fieldsRef.current = fields;
  }, [sourceCount]);

  useEffect(() => {
    function animate() {
      animateCanvas(
        canvasRef,
        sourcesRef.current,
        fieldsRef.current,
        tRef,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        showSources,
        DT
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
  }, [running, showSources]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
