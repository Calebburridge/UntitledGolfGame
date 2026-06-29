import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameScreenState, SaveSlotData } from '../data/menuState';

interface CourseSelectScreenProps {
  onNavigate: (nextState: GameScreenState) => void;
  activeSave?: SaveSlotData;
}

const COURSES = [
  'Shady Sands Municipal Golf',
  'Free Flowing Golf Course',
  'New Port Golf Club',
  'Heritage Golfing',
  'Royal Greens Golf Club',
];
const DEFAULT_UNLOCKS = ['Shady Sands Municipal Golf'];

export const CourseSelectScreen: React.FC<CourseSelectScreenProps> = ({ onNavigate, activeSave }) => {
  const unlockedCourses = activeSave?.unlocks?.includes(DEFAULT_UNLOCKS[0])
    ? activeSave.unlocks
    : [...(activeSave?.unlocks ?? []), ...DEFAULT_UNLOCKS.filter((course) => !(activeSave?.unlocks ?? []).includes(course))];

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Choose a Course</Text>

      <View style={styles.courseList}>
        {COURSES.map((courseName) => {
          const isUnlocked = unlockedCourses.includes(courseName);
          return (
            <TouchableOpacity
              key={courseName}
              disabled={!isUnlocked}
              style={[styles.courseButton, !isUnlocked && styles.lockedCourseButton]}
              onPress={() => onNavigate('IN_GAME')}
            >
              <Text style={[styles.courseButtonText, !isUnlocked && styles.lockedCourseText]}>{courseName}</Text>
              {!isUnlocked && <Text style={styles.lockedHint}>Locked</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={[styles.backButton, styles.secondaryButton]} onPress={() => onNavigate('MAIN_GAME_MENU')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  courseList: {
    width: '100%',
    gap: 12,
  },
  courseButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  lockedCourseButton: {
    backgroundColor: '#c9c9c9',
    borderColor: '#777777',
    opacity: 0.8,
  },
  courseButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
  },
  lockedCourseText: {
    color: '#555555',
  },
  lockedHint: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: '#888888',
    borderRadius: 4,
    backgroundColor: '#f4f1ea',
  },
  secondaryButton: {
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
  },
});
