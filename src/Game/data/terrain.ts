export type TerrainType = 
  | 'TEE' 
  | 'FAIRWAY' 
  | 'ROUGH' 
  | 'BUNKER' 
  | 'FRINGE' 
  | 'GREEN' 
  | 'TREE_S' 
  | 'TREE_B';

// Central map dictionary accessed by all course layouts
export const MAP_LEGEND: Record<string, TerrainType> = {
  'T': 'TEE',
  'Y': 'TEE',
  't': 'TEE',
  'y': 'TEE',
  'F': 'FAIRWAY',
  'R': 'ROUGH',
  'B': 'BUNKER',
  'g': 'FRINGE',
  'G': 'GREEN',
  'H': 'GREEN',
  'S': 'TREE_S',
  'X': 'TREE_B',
};

// Global utility that translates text layout matrices into data grid objects
export const parseMapLayout = (layout: string[]): TerrainType[][] => {
  return layout.map(row => 
    row.split('').map(char => MAP_LEGEND[char] || 'ROUGH')
  );
};

export const findTilePosition = (layout: string[], marker: string, tileSize = 20) => {
  for (const [rowIndex, row] of layout.entries()) {
    const colIndex = row.indexOf(marker);
    if (colIndex !== -1) {
      return {
        x: colIndex * tileSize + tileSize / 2,
        y: rowIndex * tileSize + tileSize / 2,
      };
    }
  }

  return null;
};

export interface HoleDefinition {
  holeNumber: number;
  par: number;
  ballStartX: number; // Pixel position on the 400x800 grid matrix
  ballStartY: number;
  holeX: number;
  holeY: number;
  mapData: TerrainType[][];
}