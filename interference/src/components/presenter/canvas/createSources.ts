import { PointSource } from "../../../components/elements/PointSource";
import { CANVAS_WIDTH, CANVAS_HEIGHT, WAVELENGTH, MOMENTS_COUNT, RADIUS, SCALE_FACTOR, CENTER } from "./constants";

export function createSources(sourceCount: number): { sources: PointSource[], fields: number[][][] } {
  const sources = Array.from({ length: sourceCount }, (_, i) => {
    const spacing = CANVAS_HEIGHT / (sourceCount + 1);
    const x = CENTER[0];
    const y = Math.round(spacing * (i + 1));
    return new PointSource(x, y, WAVELENGTH, 0, MOMENTS_COUNT, RADIUS, sourceCount, SCALE_FACTOR, CANVAS_WIDTH, CANVAS_HEIGHT);
  });

  const fields = new Array(sourceCount).fill(null).map(() =>
    Array.from({ length: CANVAS_WIDTH }, () => Array(CANVAS_HEIGHT).fill(0))
  );

  return { sources, fields };
}
