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
  'F': 'FAIRWAY',
  'R': 'ROUGH',
  'B': 'BUNKER',
  'g': 'FRINGE',
  'G': 'GREEN',
  'S': 'TREE_S',
  'X': 'TREE_B',
};

// Global utility that translates text layout matrices into data grid objects
export const parseMapLayout = (layout: string[]): TerrainType[][] => {
  return layout.map(row => 
    row.split('').map(char => MAP_LEGEND[char] || 'ROUGH')
  );
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