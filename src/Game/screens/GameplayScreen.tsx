import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ball } from '../components/Ball';
import { Divot } from '../components/Divot';
import { GameCanvas } from '../components/GameCanvas';
import { GameControls } from '../components/GameControls';
import { GridLines } from '../components/GridLines';
import { Hole } from '../components/Hole';
import { TerrainGrid } from '../components/TerrainGrid';
import { TimingMinigame } from '../components/TimingMinigame';
import { TrajectoryLine } from '../components/TrajectoryLine';
import { CLUBS, Club } from '../data/clubs';
import { hole1Definition } from '../data/ShadySandsMunicipalGolf/hole1'; // Named Import Update
import { useAimAndPower } from '../hooks/useAimAndPower';
import { useGameLoop } from '../hooks/useGameLoop';

export const GameplayScreen: React.FC = () => {
  const scaleRef = useRef<number>(1);
  
  // Dynamic layout metadata extraction mapping straight from the active definition object
  const activeHole = hole1Definition;
  const hole = { x: activeHole.holeX, y: activeHole.holeY, radius: 5 };

  const [strokes, setStrokes] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);

  const [currentClub, setCurrentClub] = useState<Club>(CLUBS[2]);
  const [pendingShot, setPendingShot] = useState<{ angle: number; power: number } | null>(null);

  // Initialize your state tracker directly from the dynamic configuration data parameters
  const { ball, divots, isMoving, fireBall } = useGameLoop(activeHole.ballStartX, activeHole.ballStartY);
  const { isAiming, aimVector, startAim, updateAim, endAim } = useAimAndPower(scaleRef.current);

  const handleScaleCalculated = (currentScale: number) => {
    scaleRef.current = currentScale;
  };

  const handleMinigameStopped = (angleErrorOffset: number) => {
    if (!pendingShot) return;

    setStrokes((prev) => prev + 1);
    setTotalStrokes((prev) => prev + 1);

    const finalAngle = pendingShot.angle + angleErrorOffset;
    const adjustedPower = pendingShot.power * (currentClub.launchVelocity / 16);

    fireBall({ angle: finalAngle, power: adjustedPower });
    setPendingShot(null);
  };

  return (
    <View
      style={styles.gestureOverlay}
      onStartShouldSetResponder={() => !isMoving && !pendingShot}
      onMoveShouldSetResponder={() => !isMoving && !pendingShot}
      onResponderGrant={(e) => {
        const { locationX, locationY, pageX, pageY } = e.nativeEvent;
        startAim(locationX, locationY, pageX, pageY);
      }}
      onResponderMove={(e) => {
        const { locationX, locationY, pageX, pageY } = e.nativeEvent;
        updateAim(locationX, locationY, pageX, pageY);
      }}
      onResponderRelease={() => {
        const shotVector = endAim();
        if (shotVector.power > 0.05) {
          setPendingShot({ angle: shotVector.angle, power: shotVector.power });
        }
      }}
    >
      <GameCanvas onScaleCalculated={handleScaleCalculated}>
        <GridLines />
        <TerrainGrid mapData={activeHole.mapData} />
        
        {divots.map((dv, index) => (
          <Divot key={`divot-${index}`} x={dv.x} y={dv.y} />
        ))}

        <Hole x={hole.x} y={hole.y} radius={hole.radius} />
        
        {isAiming && (
          <TrajectoryLine 
            startX={ball.x} 
            startY={ball.y} 
            angle={aimVector.angle} 
            power={aimVector.power} 
            maxDots={currentClub.maxDots}
            maxDistance={currentClub.maxDistance}
          />
        )}

        <Ball x={ball.x} y={ball.y} radius={ball.radius} />
      </GameCanvas>

      {pendingShot && (
        <TimingMinigame 
          onStop={handleMinigameStopped} 
          sweepSpeed={currentClub.sweepSpeed}
          maxAngleError={currentClub.maxAngleError}
        />
      )}

      <GameControls
        currentClub={currentClub}
        onSelectClub={setCurrentClub}
        strokes={strokes}
        par={activeHole.par}               // Read directly from config data package
        totalStrokes={totalStrokes}
        holeNumber={activeHole.holeNumber} // Read directly from config data package
        disabled={isMoving || !!pendingShot}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gestureOverlay: {
    flex: 1,
  },
});