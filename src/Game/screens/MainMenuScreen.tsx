import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameScreenState } from '../data/menuState';

interface MainMenuScreenProps {
  onNavigate: (nextState: GameScreenState) => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.mainTitleSmall}>Untitled Golf Game</Text>
      
      <TouchableOpacity style={styles.menuButton} onPress={() => onNavigate('COURSE_SELECT')}>
        <Text style={styles.buttonText}>Play Course</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => onNavigate('CLUB_BAG')}>
      <Text style={styles.buttonText}>Golf Club Bag</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => console.log('Options open')}>
        <Text style={styles.buttonText}>Options (Not built)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuButton, styles.backBtn]} onPress={() => onNavigate('SAVE_SLOTS')}>
        <Text style={styles.buttonText}>Change Slot</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitleSmall: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 35,
  },
  menuButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    borderColor: '#888888',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
  },
});