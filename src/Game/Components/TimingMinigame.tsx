import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

interface TimingMinigameProps {
  onStop: (accuracyModifier: number) => void;
  sweepSpeed: number;
  maxAngleError: number;
  level: number;
}

interface RGB { r: number; g: number; b: number; }

const COLOR_STOPS = [
  { pct: 0, hex: '#8b0000' },   // Dark Red (Absolute Edge)
  { pct: 15, hex: '#ff0000' },  // Red 
  { pct: 25, hex: '#8b4500' },  // Dark Orange 
  { pct: 33, hex: '#ff8c00' },  // Orange 
  { pct: 40, hex: '#ffd700' },  // Light Orange 
  { pct: 45, hex: '#006400' },  // Dark Green 
  { pct: 48, hex: '#00ff00' },  // Green 
  { pct: 50, hex: '#004d00' },  // Deep Dark Green (Perfect Center)
  { pct: 52, hex: '#00ff00' },  
  { pct: 55, hex: '#006400' },  
  { pct: 60, hex: '#ffd700' },  
  { pct: 67, hex: '#ff8c00' },  
  { pct: 75, hex: '#8b4500' },  
  { pct: 85, hex: '#ff0000' },  
  { pct: 100, hex: '#8b0000' }, 
];

const parseHex = (hex: string): RGB => {
  const num = parseInt(hex.replace('#', ''), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const lerpColor = (color1: RGB, color2: RGB, factor: number): string => {
  const r = Math.round(color1.r + (color2.r - color1.r) * factor);
  const g = Math.round(color1.g + (color2.g - color1.g) * factor);
  const b = Math.round(color1.b + (color2.b - color1.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};

const getColorForPercent = (p: number): string => {
  let lower = COLOR_STOPS[0];
  let upper = COLOR_STOPS[COLOR_STOPS.length - 1];
  
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (p >= COLOR_STOPS[i].pct && p <= COLOR_STOPS[i+1].pct) {
      lower = COLOR_STOPS[i];
      upper = COLOR_STOPS[i+1];
      break;
    }
  }
  
  const range = upper.pct - lower.pct;
  const factor = range === 0 ? 0 : (p - lower.pct) / range;
  
  return lerpColor(parseHex(lower.hex), parseHex(upper.hex), factor);
};

export const TimingMinigame: React.FC<TimingMinigameProps> = ({ onStop, sweepSpeed, maxAngleError, level }) => {
  const [cursorPos, setCursorPos] = useState(0);
  const directionRef = useRef(1);
  const animationRef = useRef<number | null>(null);
  const isStoppedRef = useRef(false);

  // Apply your preferred 5% speed reduction globally to all incoming club speeds
  const adjustedSpeed = sweepSpeed * 0.95;

  const gradientTrack = useMemo(() => {
    const slices = [];
    for (let i = 0; i <= 100; i++) {
      slices.push(
        <View 
          key={`slice-${i}`} 
          style={{ flex: 1, height: '100%', backgroundColor: getColorForPercent(i) }} 
        />
      );
    }
    return slices;
  }, []);

  useEffect(() => {
    const loop = () => {
      if (isStoppedRef.current) return;

      setCursorPos((prev) => {
        let next = prev + directionRef.current * adjustedSpeed;
        
        if (next >= 100) {
          next = 100;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [adjustedSpeed]);

  const handleTap = () => {
    if (isStoppedRef.current) return;
    isStoppedRef.current = true;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const distanceFromCenter = Math.abs(cursorPos - 50);
    const errorRatio = distanceFromCenter / 50;
    const forgivenessFactor = level >= 5 ? 0.55 : level === 4 ? 0.8 : 1;
    const angleError = errorRatio * maxAngleError * forgivenessFactor;
    const sideSign = cursorPos < 50 ? -1 : 1;
    const finalAngleOffset = angleError * sideSign;

    const accuracyScore = (100 - (errorRatio * 100)).toFixed(1);
    console.log(`Stopped at: ${cursorPos.toFixed(1)}% | Shot Accuracy: ${accuracyScore}% Score`);

    onStop(finalAngleOffset);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.overlayContainer}>
        <View style={styles.minigameBox}>
          <Text style={styles.titleText}>Timing Click</Text>
          
          <View style={styles.barTrack}>
            {gradientTrack}
            <View style={[styles.cursor, { left: `${cursorPos}%` }]} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  minigameBox: {
    width: 340,
    backgroundColor: '#f4f1ea',
    padding: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  barTrack: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
    overflow: 'hidden',
  },
  cursor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#333333',
    marginLeft: -2,
  },
});