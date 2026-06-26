export const TILE_SIZE = 20;

// Snaps any raw coordinate to the absolute center of its respective 20x20 tile square
export const snapToGridCenter = (coordinate: number): number => {
  return Math.floor(coordinate / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
};