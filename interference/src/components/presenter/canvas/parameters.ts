export const CANVAS_WIDTH = 750;
export const CANVAS_HEIGHT = 420;

export const MOMENTS_COUNT = 100;
export const RADIUS = 5;
export const CENTER = [
  Math.floor(CANVAS_WIDTH / 2),
  Math.floor(CANVAS_HEIGHT / 2),
];

export const getScaleFactor = (

  scaleFactor: number
): number => scaleFactor;


export const getDT = (scaleFactor: number): number => (5 * scaleFactor) / 10;
