import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

// Define the logical resolution for the game physics loop
export const VIRTUAL_WIDTH = 400;
export const VIRTUAL_HEIGHT = 800;

interface GameCanvasProps {
  children?: React.ReactNode;
  onScaleCalculated?: (scale: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ children, onScaleCalculated }) => {
  // This hook line creates setCanvasLayout. It must stay inside the component function.
  const [canvasLayout, setCanvasLayout] = useState({ scale: 1, translateX: 0, translateY: 0 });

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    
    const scaleX = width / VIRTUAL_WIDTH;
    const scaleY = height / VIRTUAL_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    const translateX = (width - VIRTUAL_WIDTH * scale) / 2;
    const translateY = (height - 800 * scale) / 2;

    // This updates the local layout state
    setCanvasLayout({ scale, translateX, translateY });

    // This sends the scale factor back up to the App layer
    if (onScaleCalculated) {
      onScaleCalculated(scale);
    }
  };

  return (
    <View style={styles.screenContainer} onLayout={handleContainerLayout}>
      <View
        style={[
          styles.canvas,
          {
            width: VIRTUAL_WIDTH,
            height: VIRTUAL_HEIGHT,
            transform: [
              { translateX: canvasLayout.translateX },
              { translateY: canvasLayout.translateY },
              { scale: canvasLayout.scale },
            ],
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark outer borders to frame the game board
  },
  canvas: {
    backgroundColor: '#f4f1ea', // Off-white, paper-like background color
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    // Minimalist aesthetic borders
    borderWidth: 2,
    borderColor: '#333333',
  },
});