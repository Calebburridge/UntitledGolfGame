import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DivotProps {
  x: number;
  y: number;
}

export const Divot: React.FC<DivotProps> = ({ x, y }) => {
  return (
    <View
      style={[
        styles.divot,
        {
          left: x - 4,
          top: y - 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divot: {
    position: 'absolute',
    width: 8,
    height: 4,
    backgroundColor: '#c4be6a', // Faint earthy/gray tone to represent the paper tearing/divot mark
    borderRadius: 2,
    transform: [{ rotate: '-15deg' }], // Slight organic rotation to feel hand-drawn
  },
});