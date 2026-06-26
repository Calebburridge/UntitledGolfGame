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
        // Skip default FAIRWAY tiles to let the graph paper show through perfectly
        if (tileType === 'FAIRWAY') return;

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
  // Muted architectural wash tones that match the paper aesthetic
  TEE: {
    backgroundColor: '#eae3d2',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
  },
  ROUGH: {
    backgroundColor: '#dbd5c5', // Darker graphite-smudged paper tone
  },
  BUNKER: {
    backgroundColor: '#f1ebd9', // Pale sand ink wash
    borderWidth: 1,
    borderColor: '#dcd1b3',
  },
  FRINGE: {
    backgroundColor: '#e6ebd5', // Very pale apron green
  },
  GREEN: {
    backgroundColor: '#daebd7', // Sharp crisp green ink ring target
    borderWidth: 1,
    borderColor: '#b2cbb0',
  },
  // Obstacle background bases (treated like rough underneath the branches)
  TREE_S: {
    backgroundColor: '#dbd5c5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TREE_B: {
    backgroundColor: '#dbd5c5',
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