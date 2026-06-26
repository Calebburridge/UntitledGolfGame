import React from 'react';
import { StyleSheet, View } from 'react-native';

const VIRTUAL_WIDTH = 400;
const VIRTUAL_HEIGHT = 800;
const TILE_SIZE = 20;

export const GridLines: React.FC = () => {
  const verticalLines = [];
  const horizontalLines = [];

  // Calculate columns (400 / 20 = 20 columns)
  const totalColumns = VIRTUAL_WIDTH / TILE_SIZE;
  for (let i = 1; i < totalColumns; i++) {
    verticalLines.push(
      <View
        key={`v-${i}`}
        style={[styles.verticalLine, { left: i * TILE_SIZE }]}
      />
    );
  }

  // Calculate rows (800 / 20 = 40 rows)
  const totalRows = VIRTUAL_HEIGHT / TILE_SIZE;
  for (let i = 1; i < totalRows; i++) {
    horizontalLines.push(
      <View
        key={`h-${i}`}
        style={[styles.horizontalLine, { top: i * TILE_SIZE }]}
      />
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {verticalLines}
      {horizontalLines}
    </View>
  );
};

const styles = StyleSheet.create({
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#e5e0d8', // Faint ink color that sits subtly in the background
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e5e0d8',
  },
});