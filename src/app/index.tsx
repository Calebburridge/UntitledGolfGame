import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameCanvas } from '../game/components/GameCanvas';
import { GridLines } from '../game/components/GridLines';
import { GameScreenState, SaveSlotData } from '../game/data/menuState';
import { GameplayScreen } from '../game/screens/GameplayScreen';
import { MainMenuScreen } from '../game/screens/MainMenuScreen';
import { SaveSlotsScreen } from '../game/screens/SaveSlotsScreen';
import { StartScreen } from '../game/screens/StartScreen';

export default function App() {
  const scaleRef = useRef<number>(1);
  const [screenState, setScreenState] = useState<GameScreenState>('START_MENU');
  
  const [saves, setSaves] = useState<SaveSlotData[]>([
    { id: 1, name: null, accuracy: 0, handicap: 'Reviewing', bestStrokes: 0, unlocks: [] },
    { id: 2, name: null, accuracy: 0, handicap: 'Reviewing', bestStrokes: 0, unlocks: [] },
    { id: 3, name: null, accuracy: 0, handicap: 'Reviewing', bestStrokes: 0, unlocks: [] },
  ]);
  const [activeSaveId, setActiveSaveId] = useState<number | null>(null);

  const handleScaleCalculated = (currentScale: number) => {
    scaleRef.current = currentScale;
  };

  const handleSelectSaveSlot = (slotId: number) => {
    setActiveSaveId(slotId);
    setScreenState('MAIN_GAME_MENU');
  };

  const handleRenameSaveSlot = (slotId: number, nameString: string) => {
    setSaves((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, name: nameString } : s))
    );
  };

  // Render the menus wrapped inside the blueprint graph-paper background frame layout
  if (screenState !== 'IN_GAME') {
    return (
      <View style={styles.container}>
        <GameCanvas onScaleCalculated={handleScaleCalculated}>
          <GridLines />
          {screenState === 'START_MENU' && (
            <StartScreen onNavigate={setScreenState} />
          )}
          {screenState === 'SAVE_SLOTS' && (
            <SaveSlotsScreen
              onNavigate={setScreenState}
              saveSlots={saves}
              onSelectSave={handleSelectSaveSlot}
              onRenameSave={handleRenameSaveSlot}
            />
          )}
          {screenState === 'MAIN_GAME_MENU' && (
            <MainMenuScreen onNavigate={setScreenState} />
          )}
        </GameCanvas>
      </View>
    );
  }

  // Render the fully self-contained active gameplay engine overlay matrix directly
  return (
    <View style={styles.container}>
      <GameplayScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});