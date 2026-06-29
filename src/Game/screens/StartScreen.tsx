import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameScreenState } from '../data/menuState';

interface StartScreenProps {
  onNavigate: (nextState: GameScreenState) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.developerText}>PaperBack Studios Presents:</Text>
      <Text style={styles.mainTitle}>Untitled Golf Game</Text>
      
      <TouchableOpacity style={styles.menuButton} onPress={() => onNavigate('SAVE_SLOTS')}>
        <Text style={styles.buttonText}>Start</Text>
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
  developerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 40,
  },
  menuButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
  },
});