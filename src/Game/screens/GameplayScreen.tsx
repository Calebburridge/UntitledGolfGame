import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ball } from '../components/Ball';
import { Divot } from '../components/Divot';
import { GameCanvas } from '../components/GameCanvas';
import { GameControls } from '../components/GameControls';
import { GridLines } from '../components/GridLines';
import { Hole } from '../components/Hole';
import { TerrainGrid } from '../components/TerrainGrid';
import { TimingMinigame } from '../components/TimingMinigame';
import { TrajectoryLine } from '../components/TrajectoryLine';
import { Club, getAllClubsForProfile } from '../data/clubs';
import { SaveSlotData } from '../data/menuState';
import { hole1Definition } from '../data/ShadySandsMunicipalGolf/SSHole1';
import { useAimAndPower } from '../hooks/useAimAndPower';
import { useGameLoop } from '../hooks/useGameLoop';

interface GameplayScreenProps {
  activeProfile: SaveSlotData | undefined;
  onPayout: (amount: number) => void;
  onQuit: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({ 
  activeProfile, 
  onPayout, 
  onQuit 
}) => {
  const scaleRef = useRef<number>(1);
  const activeHole = hole1Definition;
  const hole = { x: activeHole.holeX, y: activeHole.holeY, radius: 5 };

  // Generate scaled dynamic club array mapping straight from save file criteria
  const userInventory = getAllClubsForProfile(activeProfile?.clubLevels || {});

  const [strokes, setStrokes] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);

  // Score review and payout state hooks
  const [isHoleComplete, setIsHoleComplete] = useState(false);
  const [hasRewarded, setHasRewarded] = useState(false);

  // Set the default starting equipment using your upgraded array index parameters
  const [currentClub, setCurrentClub] = useState<Club>(userInventory[2]); // Dynamic Mid Iron
  const [pendingShot, setPendingShot] = useState<{ angle: number; power: number } | null>(null);

  const { ball, divots, isMoving, fireBall } = useGameLoop(
    activeHole.ballStartX, 
    activeHole.ballStartY, 
    activeHole.mapData 
  );
  const { isAiming, aimVector, startAim, updateAim, endAim } = useAimAndPower(scaleRef.current);

  const handleScaleCalculated = (currentScale: number) => {
    scaleRef.current = currentScale;
  };

  // MONITOR BALL PROXIMITY TO CUP DROP ZONE ON EVERY FRAME COORD UPDATE
  useEffect(() => {
    if (isHoleComplete) return;

    const dx = ball.x - hole.x;
    const dy = ball.y - hole.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Generous 15px window prevents collision tunneling at high ball velocities
    if (distance < 15) {
      setIsHoleComplete(true);
    }
  }, [ball.x, ball.y, hole.x, hole.y, isHoleComplete]);

  // CALCULATE SCORE STRINGS AND BALANCE REWARDS UPON COMPLETION
  const scoreStats = useMemo(() => {
    if (!isHoleComplete) return { term: '', reward: 0 };
    
    if (strokes === 1) return { term: 'Hole-In-One!', reward: 500 };
    
    const diff = strokes - activeHole.par;
    switch (diff) {
      case -2: return { term: 'Eagle!', reward: 300 };
      case -1: return { term: 'Birdie!', reward: 150 };
      case 0: return { term: 'Par!', reward: 75 };
      case 1: return { term: 'Bogey', reward: 40 };
      case 2: return { term: 'Double Bogey', reward: 20 };
      default: return diff < 0 ? { term: 'Under Par!', reward: 200 } : { term: 'Tragic Score', reward: 10 };
    }
  }, [isHoleComplete, strokes, activeHole.par]);

  // EMIT WALLET CHANGE UPSTREAM EXACTLY ONCE WHEN FLAG TRIGGER IS TRIPPED
  useEffect(() => {
    if (isHoleComplete && !hasRewarded) {
      onPayout(scoreStats.reward);
      setHasRewarded(true);
    }
  }, [isHoleComplete, hasRewarded, scoreStats.reward, onPayout]);

  const handleMinigameStopped = (angleErrorOffset: number) => {
    if (!pendingShot) return;

    setStrokes((prev) => prev + 1);
    setTotalStrokes((prev) => prev + 1);

    const finalAngle = pendingShot.angle + angleErrorOffset;
    const adjustedPower = pendingShot.power * currentClub.launchVelocity;

    // Pass the dedicated club loft setting downstream to control arc dimensions natively
    fireBall({ angle: finalAngle, power: adjustedPower, loft: currentClub.loft });
    setPendingShot(null);
  };

  return (
    <View
      style={styles.gestureOverlay}
      onStartShouldSetResponder={() => !isMoving && !pendingShot && !isHoleComplete}
      onMoveShouldSetResponder={() => !isMoving && !pendingShot && !isHoleComplete}
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

        {!isHoleComplete && <Hole x={hole.x} y={hole.y} radius={hole.radius} />}
        
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

        {/* Capped 30% visual size increase max (Base 4 * 1.3 = 5.2 max) */}
        {!isHoleComplete && <Ball x={ball.x} y={ball.y} radius={Math.min(5.2, 4 + ball.z * 0.05)} />}
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
        par={activeHole.par}
        totalStrokes={totalStrokes}
        holeNumber={activeHole.holeNumber}
        disabled={isMoving || !!pendingShot || isHoleComplete}
        customInventory={userInventory}
      />

      {/* LO-FI SCORE SUMMARY CARD OVERLAY OVER CANVAS BLUEPRINT */}
      {isHoleComplete && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.cardHeader}>Hole {activeHole.holeNumber} Clear</Text>
            <Text style={styles.scoreTitle}>{scoreStats.term}</Text>
            
            <View style={styles.statsTable}>
              <Text style={styles.tableText}>Strokes Taken: {strokes}</Text>
              <Text style={styles.tableText}>Hole Baseline Par: {activeHole.par}</Text>
              <Text style={styles.rewardText}>Payout Earned: +${scoreStats.reward} Cash</Text>
            </View>

            <TouchableOpacity 
              style={styles.popButton} 
              onPress={() => Alert.alert('In Development', 'Course progression paths are unlocking soon!')}
            >
              <Text style={styles.popButtonText}>Next Hole</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.popButton, styles.quitBtn]} onPress={onQuit}>
              <Text style={styles.quitButtonText}>Quit to Hub</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gestureOverlay: {
    flex: 1,
  },
  popupOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  popupCard: {
    width: 280,
    backgroundColor: '#f4f1ea',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 20,
    alignItems: 'center',
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333333',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  statsTable: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dddddd',
    paddingVertical: 10,
    marginBottom: 15,
    gap: 4,
  },
  tableText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  rewardText: {
    fontSize: 12,
    color: '#006400',
    fontWeight: 'bold',
    marginTop: 2,
  },
  popButton: {
    width: '100%',
    backgroundColor: '#333333',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  quitBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#333333',
    marginBottom: 0,
  },
  popButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  quitButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#333333',
  },
});