import React from 'react';
import { StyleSheet, View } from 'react-native';

interface BallProps {
  x: number;
  y: number;
  radius: number;
}

export const Ball: React.FC<BallProps> = ({ x, y, radius }) => {
  return (
    <View
      style={[
        styles.ball,
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
  ball: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#333333',
  },
});