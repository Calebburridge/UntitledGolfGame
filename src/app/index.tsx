import { CourseSelectScreen } from '@/game/screens/CourseSelectScreen';
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
const DEFAULT_UNLOCKS = ['Shady Sands Municipal Golf'];

const createDefaultSave = (id: number): SaveSlotData => ({
  id,
  name: null,
  accuracy: 0,
  handicap: 'Reviewing',
  bestStrokes: 0,
  unlocks: DEFAULT_UNLOCKS,
  cash: 500,
  clubLevels: {},
  completedCourses: [],
});

const normalizeSaveSlot = (slot: Partial<SaveSlotData> & { id: number }): SaveSlotData => {
  const unlocks = Array.isArray(slot.unlocks) ? slot.unlocks.filter(Boolean) : [];
  const normalizedUnlocks = unlocks.includes(DEFAULT_UNLOCKS[0])
    ? unlocks
    : [...unlocks, ...DEFAULT_UNLOCKS.filter((course) => !unlocks.includes(course))];

  return {
    ...createDefaultSave(slot.id),
    ...slot,
    name: slot.name ?? null,
    unlocks: normalizedUnlocks,
    completedCourses: slot.completedCourses ?? [],
    clubLevels: slot.clubLevels ?? {},
    cash: slot.cash ?? 500,
    accuracy: slot.accuracy ?? 0,
    handicap: slot.handicap ?? 'Reviewing',
    bestStrokes: slot.bestStrokes ?? 0,
  };
};

export default function App() {
  const scaleRef = useRef<number>(1);
  const [screenState, setScreenState] = useState<GameScreenState>('START_MENU');
  const [hasLoaded, setHasLoaded] = useState(false);

  const [saves, setSaves] = useState<SaveSlotData[]>([1, 2, 3].map(createDefaultSave));
  const [activeSaveId, setActiveSaveId] = useState<number | null>(null);

  const activeSave = saves.find(s => s.id === activeSaveId);

  useEffect(() => {
    const loadSavedProfiles = async () => {
      try {
        const rawData = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawData !== null) {
          const parsed = JSON.parse(rawData);
          const normalizedSaves = Array.isArray(parsed)
            ? parsed.map((slot: Partial<SaveSlotData> & { id: number }) => normalizeSaveSlot(slot))
            : [1, 2, 3].map(createDefaultSave);
          setSaves(normalizedSaves);
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

  const handleDeleteSaveSlot = (slotId: number) => {
    setSaves((prev) => prev.map((slot) => (slot.id === slotId ? createDefaultSave(slotId) : slot)));
    if (activeSaveId === slotId) {
      setActiveSaveId(null);
    }
  };

  const handleCourseComplete = (courseName: string, totalStrokes: number, totalPar: number) => {
    if (activeSaveId === null) return;

    setSaves((prev) =>
      prev.map((slot) => {
        if (slot.id !== activeSaveId) return slot;

        const completedCourses = slot.completedCourses ?? [];
        const nextCourseUnlock = courseName === 'Shady Sands Municipal Golf' ? 'Free Flowing Golf Course' : null;
        const unlocks = Array.isArray(slot.unlocks) ? slot.unlocks.filter(Boolean) : [];
        const updatedUnlocks = nextCourseUnlock && !unlocks.includes(nextCourseUnlock)
          ? [...unlocks, nextCourseUnlock]
          : unlocks;

        return {
          ...slot,
          completedCourses: completedCourses.includes(courseName) ? completedCourses : [...completedCourses, courseName],
          unlocks: updatedUnlocks,
          bestStrokes: slot.bestStrokes === 0 || totalStrokes < slot.bestStrokes ? totalStrokes : slot.bestStrokes,
        };
      })
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
              onDeleteSave={handleDeleteSaveSlot}
            />
          )}
          {screenState === 'MAIN_GAME_MENU' && <MainMenuScreen onNavigate={setScreenState} />}
          {screenState === 'COURSE_SELECT' && (
            <CourseSelectScreen onNavigate={setScreenState} activeSave={activeSave} />
          )}
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
      <GameplayScreen
        activeProfile={activeSave}
        onPayout={() => {}}
        onQuit={() => setScreenState('MAIN_GAME_MENU')}
        onCourseComplete={handleCourseComplete}
        courseName="Shady Sands Municipal Golf"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  loadingCenter: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f1ea' },
  loadingText: { fontSize: 14, fontWeight: 'bold', color: '#666666', textTransform: 'uppercase', letterSpacing: 1 },
});