export class PointSource {
  x: number;
  y: number;
  wavelength: number;
  phase: number;
  radius: number;
  S: number[];
  D: number[][];
  scaleFactor: number;
  spreadWidth: number;
  spreadHeight: number;
  expansionRate: number;
  maxRadius: number;
  color: [number, number, number];

  constructor(
    x: number,
    y: number,
    wavelength: number,
    phase: number,
    momentsCount: number,
    radius: number,
    sourcesCount: number,
    scaleFactor: number,
    spreadWidth: number = 600,
    spreadHeight: number = 600,
    expansionRate: number = 1
  ) {
    this.x = x;
    this.y = y;
    this.wavelength = wavelength;
    this.phase = phase;
    this.radius = radius;
    this.scaleFactor = scaleFactor;
    this.spreadWidth = spreadWidth;
    this.spreadHeight = spreadHeight;
    this.expansionRate = expansionRate;
    const periodInPixels = wavelength * scaleFactor;
    this.D = this.calculatePixelsPhase(periodInPixels);
    this.S = Array.from({ length: momentsCount }, (_, i) =>
      Math.floor(
        (255.0 * (Math.sin((2 * Math.PI * i) / momentsCount) + 1)) /
          (2 * sourcesCount)
      )
    );
    this.maxRadius = 0;
    this.color = this.getColorForWavelength(wavelength);
  }

  distance(a: [number, number], b: [number, number]): number {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  }

  calculatePixelsPhase(periodInPixels: number) {
    return Array.from({ length: this.spreadWidth }, (_, x) =>
      Array.from({ length: this.spreadHeight }, (_, y) =>
        Math.round(
          ((this.distance([x, y], [this.x, this.y]) % periodInPixels) /
            periodInPixels) *
            100
        )
      )
    );
  }

  createField(f: number[][], t: number) {
    const MaxI = 100;
    const periodInPixels = this.wavelength * this.scaleFactor;
    const shift = Math.floor(((t % periodInPixels) / periodInPixels) * 100);
    const phaseAdd = Math.floor((this.phase / periodInPixels) * 100);
    this.maxRadius += this.expansionRate;

    for (let x = 0; x < this.spreadWidth; x++) {
      for (let y = 0; y < this.spreadHeight; y++) {
        const dist = this.distance([x, y], [this.x, this.y]);

        if (dist <= this.maxRadius) {
          let moment = this.D[x][y] - shift + phaseAdd;
          moment = moment >= 0 ? moment : moment + MaxI;
          moment = moment < MaxI ? moment : moment - MaxI;
          const intensity = this.S[moment];

          f[x][y] = intensity;
        } else {
          f[x][y] = 0;
        }
      }
    }
  }

  getColorForWavelength(wavelength: number): [number, number, number] {
    if (wavelength < 370 || wavelength > 750) {
      return [255, 255, 255];
    }

    const interpolateColor = (
      start: [number, number, number],
      end: [number, number, number],
      factor: number
    ): [number, number, number] => {
      return [
        Math.round(start[0] + factor * (end[0] - start[0])),
        Math.round(start[1] + factor * (end[1] - start[1])),
        Math.round(start[2] + factor * (end[2] - start[2])),
      ];
    };

    const waveLengthRanges: {
      [key: string]: {
        min: number;
        max: number;
        target: number;
        color: [number, number, number];
      };
    } = {
      purple: { min: 370, max: 430, target: 370, color: [148, 0, 211] },
      blue: { min: 430, max: 500, target: 460, color: [0, 0, 255] },
      green: { min: 500, max: 570, target: 555, color: [0, 255, 0] },
      yellow: { min: 570, max: 590, target: 580, color: [255, 255, 0] },
      orange: { min: 590, max: 620, target: 600, color: [255, 165, 0] },
      red: { min: 620, max: 750, target: 750, color: [255, 0, 0] },
    };

    const rangesArray = Object.values(waveLengthRanges);

    for (let i = 0; i < rangesArray.length; i++) {
      const range = rangesArray[i];

      if (wavelength >= range.min && wavelength <= range.max) {
        const nextRange = rangesArray[i + 1];
        const previousRange = rangesArray[i - 1];

        if (wavelength <= range.target && previousRange) {
          const factor =
            (wavelength - previousRange.target) /
            (range.target - previousRange.target);
          return interpolateColor(previousRange.color, range.color, factor);
        }

        if (wavelength > range.target && nextRange) {
          const factor =
            (wavelength - range.target) / (nextRange.target - range.target);
          return interpolateColor(range.color, nextRange.color, factor);
        }

        return range.color;
      }
    }

    return [255, 255, 255];
  }

  draw(imageData: ImageData, isSelect = false) {
    const pixels = imageData.data;

    
    const verticalStripWidth = 5;
    for (let i = -verticalStripWidth; i <= verticalStripWidth; i ++) {
      const dx = this.x + i;
      const dy = this.y;
      if (dx >= 0 && dx < imageData.width && dy >= 0 && dy < imageData.height) {
        const idx = 4 * (dy * imageData.width + dx);
        pixels[idx] = 255; 
        pixels[idx + 1] = 0; 
        pixels[idx + 2] = 0; 
        pixels[idx + 3] = 255; 
      }
    }

    if (isSelect) {
      const horizontalStripWidth = 5;
      for (let i = -horizontalStripWidth; i <= horizontalStripWidth; i ++) {
        const dx = this.x;
        const dy = this.y + i;
        if (
          dx >= 0 &&
          dx < imageData.width &&
          dy >= 0 &&
          dy < imageData.height
        ) {
          const idx = 4 * (dy * imageData.width + dx);
          pixels[idx] = 0; 
          pixels[idx + 1] = 255; 
          pixels[idx + 2] = 0; 
          pixels[idx + 3] = 255; 
        }
      }
    }
  }
}
