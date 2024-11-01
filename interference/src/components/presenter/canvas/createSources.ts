import { PointSource } from "../../../components/elements/PointSource";
import { CANVAS_WIDTH, CANVAS_HEIGHT, MOMENTS_COUNT, RADIUS, CENTER } from "./parameters";
import { SourceSettings } from "../Presenter";

export function createSources(
  sourceSettings: SourceSettings[],
  wavelength: number,
  scaleFactor: number
): { sources: PointSource[]; fields: number[][][] } {
  const sources = sourceSettings.map((setting, i) => {
    const spacing = CANVAS_HEIGHT / (sourceSettings.length + 1);
    const x = CENTER[0];
    const y = Math.round(spacing * (i + 1));
    return new PointSource(
      x,
      y,
      wavelength,
      setting.phase,  
      MOMENTS_COUNT,
      RADIUS,
      sourceSettings.length,
      scaleFactor,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
  });

  const fields = sourceSettings.map(() =>
    Array.from({ length: CANVAS_WIDTH }, () => Array(CANVAS_HEIGHT).fill(0))
  );

  return { sources, fields };
}
