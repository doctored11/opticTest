
import { PointSource } from "./PointSource";

export class Calculator {
  static calculateIntensity(
    sources: PointSource[],
    x: number,
    y: number,
    t: number
  ): number {
    let totalAmplitude = 0;
    const dimmingFactor = 1/(2*sources.length); 

    sources.forEach((source) => {
      if (source.isEnabled) {
        const amplitude = source.getAmplitudeAtPoint(x, y, t);
        totalAmplitude += amplitude;
      }
    });

   
    const intensity = totalAmplitude * totalAmplitude * dimmingFactor;

    const maxIntensity = 1; 
    return Math.min(((intensity ) / maxIntensity) * 255, 255);
  }
  static calculateAmplitude(
    sources: PointSource[],
    x: number,
    y: number,
    t: number
  ): number {
    const dimmingFactor = 1/(2*sources.length);
    let totalAmplitude = 0;

    sources.forEach((source) => {
      if (source.isEnabled) {
        const amplitude = source.getAmplitudeAtPoint(x, y, t);
        totalAmplitude += amplitude * dimmingFactor;
      }
    });

    
    return ((totalAmplitude + 1) / 2) * 255;
  }
}
