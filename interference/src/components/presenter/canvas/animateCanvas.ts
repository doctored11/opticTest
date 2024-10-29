import { PointSource } from "../../../components/elements/PointSource";

export function animateCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  sources: PointSource[],
  fields: number[][][],
  tRef: React.MutableRefObject<number>,
  width: number,
  height: number,
  showSources: boolean,
  dt: number,
  highlightedSources: boolean[]
) {
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  let index = 0;

  sources.forEach((source, i) => source.createField(fields[i], tRef.current));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < sources.length; i++) {
        const intensity = Math.min(fields[i][x][y], 255);
        const [sourceR, sourceG, sourceB] = sources[i].color;
        r += sourceR * (intensity / 255);
        g += sourceG * (intensity / 255);
        b += sourceB * (intensity / 255);
      }

      pixels[index] = Math.min(r, 255);
      pixels[index + 1] = Math.min(g, 255);
      pixels[index + 2] = Math.min(b, 255);
      pixels[index + 3] = 255;
      index += 4;
    }
  }

  sources.forEach((source, i) => {
    source.createField(fields[i], tRef.current);

    if (showSources) {
      source.draw(imageData, highlightedSources[i]); 
    }
  });
  context.putImageData(imageData, 0, 0);
  tRef.current += dt;
}
