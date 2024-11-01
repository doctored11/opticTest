import { Calculator } from "../../../components/elements/Calculator";
import { PointSource } from "../../../components/elements/PointSource";
import { SourceSettings } from "../Presenter";

export function animateCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  amplitudeCanvasRef: React.RefObject<HTMLCanvasElement>,
  sources: PointSource[],
  fields: number[][][],
  tRef: React.MutableRefObject<number>,
  width: number,
  height: number,
  showSources: boolean,
  dt: number,
  sourceSettings: SourceSettings[]
) {
  const canvas = canvasRef.current;
  const amplitudeCanvas = amplitudeCanvasRef.current;
  const context = canvas?.getContext("2d");
  const amplitudeContext = amplitudeCanvas?.getContext("2d");
  if (!canvas || !context || !amplitudeCanvas || !amplitudeContext) return;

  const imageData = context.getImageData(0, 0, width, height);
  const amplitudeImageData = amplitudeContext.getImageData(0, 0, width, height);

  const pixels = imageData.data;
  const amplitudePixels = amplitudeImageData.data;

  let index = 0;

  sources.forEach((source, i) => {
    if (sourceSettings[i].isEnabled) {
      source.switchOn();
      source.maxRadius += source.expansionRate;
    } else {
      source.switchOff();
    }
  });

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 128; 
    pixels[i + 1] = 128; 
    pixels[i + 2] = 128; 
    pixels[i + 3] = 255; 

    amplitudePixels[i] = 128;
    amplitudePixels[i + 1] = 128; 
    amplitudePixels[i + 2] = 128; 
    amplitudePixels[i + 3] = 255; 
  }

  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const intensity = Calculator.calculateIntensity(
        sources,
        x,
        y,
        tRef.current
      );
      const clampedIntensity = Math.min(255, Math.max(0, intensity));
      const [sourceR, sourceG, sourceB] = sources[0].color;

      pixels[index] = sourceR *(clampedIntensity/255);
      pixels[index + 1] = sourceG *(clampedIntensity/255);
      pixels[index + 2] = sourceB *(clampedIntensity/255);
      pixels[index + 3] = 255;

      const amplitude = Calculator.calculateAmplitude(
        sources,
        x,
        y,
        tRef.current
      );
      const clampedAmplitude = Math.min(255, Math.max(0, amplitude));
      amplitudePixels[index] = clampedAmplitude;
      amplitudePixels[index + 1] = clampedAmplitude;
      amplitudePixels[index + 2] = clampedAmplitude;
      amplitudePixels[index + 3] = 255;

      index += 4;
    }
  }

  sources.forEach((source, i) => {
    if (showSources) {
      source.draw(imageData, sourceSettings[i].isHighlighted);
      source.draw(amplitudeImageData, sourceSettings[i].isHighlighted);
    }
  });

  context.putImageData(imageData, 0, 0);
  amplitudeContext.putImageData(amplitudeImageData, 0, 0);

  tRef.current += dt;
}
