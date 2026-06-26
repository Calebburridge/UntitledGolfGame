import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Club, CLUBS } from '../data/clubs';

interface ClubSelectorProps {
  currentClub: Club;
  onSelectClub: (club: Club) => void;
  disabled: boolean;
}

export const ClubSelector: React.FC<ClubSelectorProps> = ({ currentClub, onSelectClub, disabled }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CLUBS.map((club) => {
          const isSelected = club.id === currentClub.id;
          return (
            <TouchableOpacity
              key={club.id}
              disabled={disabled}
              onPress={() => onSelectClub(club)}
              style={[
                styles.clubButton,
                isSelected && styles.selectedButton,
                disabled && styles.disabledContainer
              ]}
            >
              <Text style={[styles.clubText, isSelected && styles.selectedText]}>
                {club.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f4f1ea',
    borderTopWidth: 2,
    borderColor: '#333333',
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  clubButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  selectedButton: {
    borderColor: '#333333',
    backgroundColor: '#333333',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  clubText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    textTransform: 'uppercase',
  },
  selectedText: {
    color: '#ffffff',
  },
});