import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TerrainType } from '../data/terrain';

interface TerrainGridProps {
  mapData: TerrainType[][];
}

const TILE_SIZE = 20;

export const TerrainGrid: React.FC<TerrainGridProps> = ({ mapData }) => {
  // Memoize the grid rendering so it doesn't recalculate unless the map data changes
  const renderedGrid = useMemo(() => {
    const tiles: React.ReactNode[] = [];

    mapData.forEach((row, rowIndex) => {
      row.forEach((tileType, colIndex) => {
        const tileStyles = [
          styles.tile,
          {
            left: colIndex * TILE_SIZE,
            top: rowIndex * TILE_SIZE,
          },
          styles[tileType],
        ];

        tiles.push(
          <View key={`tile-${rowIndex}-${colIndex}`} style={tileStyles}>
            {/* Draw custom sketched items for obstacles like trees */}
            {tileType === 'TREE_S' && <View style={styles.smallTreeCircle} />}
            {tileType === 'TREE_B' && (
              <View style={styles.bigTreeCircle}>
                <View style={styles.bigTreeInnerCircle} />
              </View>
            )}
          </View>
        );
      });
    });

    return tiles;
  }, [mapData]);

  return <View style={StyleSheet.absoluteFill}>{renderedGrid}</View>;
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  // Muted, hand-drawn paper tones for each terrain type
  TEE: {
    backgroundColor: '#b7d7a8',
    borderWidth: 1,
    borderColor: '#8fb67a',
    borderStyle: 'dashed',
  },
  ROUGH: {
    backgroundColor: '#f4efd9',
    borderWidth: 1,
    borderColor: '#e3d7b5',
  },
  BUNKER: {
    backgroundColor: '#f0ddbb',
    borderWidth: 1,
    borderColor: '#d8c59a',
  },
  FRINGE: {
    backgroundColor: '#cfe3b8',
    borderWidth: 1,
    borderColor: '#b4cc95',
  },
  GREEN: {
    backgroundColor: '#dce9cf',
    borderWidth: 1,
    borderColor: '#c0d1b0',
  },
  // Obstacle background bases (treated like rough underneath the branches)
  TREE_S: {
    backgroundColor: '#a97b53',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TREE_B: {
    backgroundColor: '#a97b53',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Hand-drawn concentric ring style elements for trees
  smallTreeCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#555555',
    backgroundColor: 'transparent',
  },
  bigTreeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#333333',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigTreeInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'dashed',
  },
});