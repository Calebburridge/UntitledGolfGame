import React from 'react';
import { StyleSheet, View } from 'react-native';

interface HoleProps {
  x: number;
  y: number;
  radius: number;
}

export const Hole: React.FC<HoleProps> = ({ x, y, radius }) => {
  return (
    <View
      style={[
        styles.hole,
        {
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  hole: {
    position: 'absolute',
    backgroundColor: '#333333', // Solid minimalist dark circle
  },
});