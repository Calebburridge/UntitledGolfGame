import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameCanvas } from '../game/components/GameCanvas';
import { GridLines } from '../game/components/GridLines';
import { GameScreenState, SaveSlotData } from '../game/data/menuState';
import { ClubBagScreen } from '../game/screens/ClubBagScreen';
import { GameplayScreen } from '../game/screens/GameplayScreen';
import { MainMenuScreen } from '../game/screens/MainMenuScreen';
import { SaveSlotsScreen } from '../game/screens/SaveSlotsScreen';
import { StartScreen } from '../game/screens/StartScreen';

const STORAGE_KEY = '@untitled_golf_saves';

export default function App() {
  const scaleRef = useRef<number>(1);
  const [screenState, setScreenState] = useState<GameScreenState>('START_MENU');
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const [saves, setSaves] = useState<SaveSlotData[]>([
    { id: 1, name: null, accuracy: 0, handicap: 'Reviewing', bestStrokes: 0, unlocks: [], cash: 500, clubLevels: {} },
    { id: 2, name: null, accuracy: 0, handicap: 'Reviewing', bestStrokes: 0, unlocks: [], cash: 500, clubLevels: {} },
    { id: 3, name: null, accuracy: 0, handicap: 'Reviewing', bestStrokes: 0, unlocks: [], cash: 500, clubLevels: {} },
  ]);
  const [activeSaveId, setActiveSaveId] = useState<number | null>(null);

  const activeSave = saves.find(s => s.id === activeSaveId);

  useEffect(() => {
    const loadSavedProfiles = async () => {
      try {
        const rawData = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawData !== null) {
          setSaves(JSON.parse(rawData));
        }
      } catch (error) {
        console.error('Failed to load save states:', error);
      } finally {
        setHasLoaded(true);
      }
    };
    loadSavedProfiles();
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    const syncToDeviceStorage = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
      } catch (error) {
        console.error('Failed to write save states:', error);
      }
    };
    syncToDeviceStorage();
  }, [saves, hasLoaded]);

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

  const handleUpgradeClub = (clubId: string, cost: number) => {
    if (!activeSaveId) return;
    setSaves((prevSaves) =>
      prevSaves.map((slot) => {
        if (slot.id !== activeSaveId) return slot;
        const currentLvl = slot.clubLevels[clubId] || 1;
        return {
          ...slot,
          cash: slot.cash - cost,
          clubLevels: { ...slot.clubLevels, [clubId]: currentLvl + 1 },
        };
      })
    );
  };

  // --- RUNTIME EXPORT DIAGNOSTIC CHECK ---
  // This will print to your browser's Developer Console (F12) every time the app attempts to render
  console.log("=== RUNTIME EXPORT REPORT ===");
  console.log("GameCanvas:    ", GameCanvas);
  console.log("GridLines:     ", GridLines);
  console.log("StartScreen:   ", StartScreen);
  console.log("SaveSlotsScreen:", SaveSlotsScreen);
  console.log("MainMenuScreen: ", MainMenuScreen);
  console.log("GameplayScreen: ", GameplayScreen);
  console.log("ClubBagScreen:  ", ClubBagScreen);
  console.log("=============================");

  if (!hasLoaded) {
    return (
      <View style={[styles.container, styles.loadingCenter]}>
        <Text style={styles.loadingText}>Reading Scorecard...</Text>
      </View>
    );
  }

  if (screenState !== 'IN_GAME') {
    return (
      <View style={styles.container}>
        <GameCanvas onScaleCalculated={handleScaleCalculated}>
          <GridLines />
          {screenState === 'START_MENU' && <StartScreen onNavigate={setScreenState} />}
          {screenState === 'SAVE_SLOTS' && (
            <SaveSlotsScreen
              onNavigate={setScreenState}
              saveSlots={saves}
              onSelectSave={handleSelectSaveSlot}
              onRenameSave={handleRenameSaveSlot}
            />
          )}
          {screenState === 'MAIN_GAME_MENU' && <MainMenuScreen onNavigate={setScreenState} />}
          {screenState === 'CLUB_BAG' && activeSave && (
            <ClubBagScreen
              onNavigate={setScreenState}
              activeSave={activeSave}
              onUpgradeClub={handleUpgradeClub}
            />
          )}
        </GameCanvas>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GameplayScreen activeProfile={activeSave} onPayout={() => {}} onQuit={() => setScreenState('MAIN_GAME_MENU')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  loadingCenter: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f1ea' },
  loadingText: { fontSize: 14, fontWeight: 'bold', color: '#666666', textTransform: 'uppercase', letterSpacing: 1 },
});