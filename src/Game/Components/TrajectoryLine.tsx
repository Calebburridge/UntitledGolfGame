import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TrajectoryLineProps {
  startX: number;
  startY: number;
  angle: number;
  power: number;
  maxDots?: number;
  maxDistance: number; // Added property
}

export const TrajectoryLine: React.FC<TrajectoryLineProps> = ({
  startX,
  startY,
  angle,
  power,
  maxDots = 12,
  maxDistance, // Use club specific value
}) => {
  if (power < 0.05) return null;

  const dots = [];
  const totalLength = power * maxDistance; // Multiplied directly by club baseline limit

  for (let i = 1; i <= maxDots; i++) {
    const distance = (totalLength / maxDots) * i;
    
    const dotX = startX + Math.cos(angle) * distance;
    const dotY = startY + Math.sin(angle) * distance; 

    const dotOpacity = 1 - (i / (maxDots + 1));

    dots.push(
      <View
        key={`dot-${i}`}
        style={[styles.dot, { left: dotX - 3, top: dotY - 3, opacity: dotOpacity }]}
      />
    );
  }

  return <>{dots}</>;
};

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333333', // Solid dark gray dots to match the lo-fi paper app design
  },
});