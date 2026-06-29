import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Club, CLUBS } from '../data/clubs';

interface GameControlsProps {
  currentClub: Club;
  onSelectClub: (club: Club) => void;
  strokes: number;
  par: number;
  totalStrokes: number;
  holeNumber: number;
  disabled: boolean;
  customInventory?: Club[]; // Added dynamic inventory property array parameter
  onExitCourse?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentClub,
  onSelectClub,
  strokes,
  par,
  totalStrokes,
  holeNumber,
  disabled,
  customInventory,
  onExitCourse,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const availableClubs: Club[] = customInventory || CLUBS;

  const handleClubPress = (club: Club) => {
    onSelectClub(club);
    setIsMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Absolute Club Selection Dropup Menu List */}
      {isMenuOpen && !disabled && (
        <View style={styles.dropupMenu}>
          {availableClubs.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={[
                styles.menuItem,
                club.id === currentClub.id && styles.activeMenuItem,
              ]}
              onPress={() => handleClubPress(club)}
            >
              <Text style={[
                styles.menuItemText,
                club.id === currentClub.id && styles.activeItemText
              ]}>
                {club.name} ({club.maxDistance}y)
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main Scorecard Row Segment */}
      <View style={styles.scorecardSection}>
        <View style={styles.scoreTextRow}>
          <Text style={styles.holeText}>Hole {holeNumber}</Text>
          <Text style={styles.strokeText}>Strokes: {strokes} / {par}</Text>
          <View style={styles.totalBlock}>
            <Text style={styles.totalText}>Total: {totalStrokes}</Text>
            <TouchableOpacity
              disabled={disabled}
              onPress={onExitCourse}
              style={[styles.exitButton, disabled && styles.disabledButton]}
            >
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Toggle Button Column */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          style={[styles.clubButton, disabled && styles.disabledButton]}
        >
          <Text style={styles.buttonLabel}>Club</Text>
          <Text style={styles.activeClubName}>{currentClub.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f4f1ea',
    borderTopWidth: 2,
    borderColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  scorecardSection: {
    flex: 1,
    paddingRight: 20,
  },
  scoreTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  totalBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  buttonSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  holeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  strokeText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exitButton: {
    backgroundColor: '#f4f1ea',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    minWidth: 56,
  },
  exitButtonText: {
    fontSize: 9,
    color: '#333333',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  clubButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonLabel: {
    fontSize: 8,
    color: '#888888',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  activeClubName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  dropupMenu: {
    position: 'absolute',
    bottom: '100%',
    right: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 4,
    width: 160,
    marginBottom: 4,
    zIndex: 200,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  activeMenuItem: {
    backgroundColor: '#333333',
  },
  menuItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },
  activeItemText: {
    color: '#ffffff',
  },
});