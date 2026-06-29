import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GameScreenState, SaveSlotData } from '../data/menuState';

interface SaveSlotsScreenProps {
  onNavigate: (nextState: GameScreenState) => void;
  saveSlots: SaveSlotData[];
  onSelectSave: (slotId: number) => void;
  onRenameSave: (slotId: number, name: string) => void;
  onDeleteSave: (slotId: number) => void;
}

export const SaveSlotsScreen: React.FC<SaveSlotsScreenProps> = ({
  onNavigate,
  saveSlots,
  onSelectSave,
  onRenameSave,
  onDeleteSave,
}) => {
  const [namingSlot, setNamingSlot] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');

  const handleSaveClick = (slot: SaveSlotData) => {
    if (slot.name === null) {
      setNamingSlot(slot.id);
      setTempName(`Golfer ${slot.id}`);
    } else {
      onSelectSave(slot.id);
    }
  };

  const submitName = (slotId: number) => {
    if (tempName.trim()) {
      onRenameSave(slotId, tempName.trim());
      setNamingSlot(null);
      onSelectSave(slotId);
    }
  };

  const confirmDelete = (slot: SaveSlotData) => {
    const message = `Delete ${slot.name ?? `slot ${slot.id}`}?`;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      const shouldDelete = window.confirm(message);
      if (shouldDelete) {
        onDeleteSave(slot.id);
      }
      return;
    }

    Alert.alert(
      'Delete profile?',
      message,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => onDeleteSave(slot.id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuSubtitle}>Select Profile</Text>
      
      {saveSlots.map((slot) => (
        <View key={slot.id} style={styles.saveSlotBox}>
          {namingSlot === slot.id ? (
            <View style={styles.namingRow}>
              <TextInput
                style={styles.textInput}
                value={tempName}
                onChangeText={setTempName}
                maxLength={12}
                autoFocus
              />
              <TouchableOpacity style={styles.inlineButton} onPress={() => submitName(slot.id)}>
                <Text style={styles.inlineButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.slotClickArea} onPress={() => handleSaveClick(slot)}>
                {slot.name === null ? (
                  <Text style={styles.emptySlotText}>[ Slot {slot.id} - Empty ]</Text>
                ) : (
                  <View style={styles.saveStatsColumn}>
                    <Text style={styles.profileName}>{slot.name}</Text>
                    <Text style={styles.statLabel}>Handicap: {slot.handicap}</Text>
                    <Text style={styles.statLabel}>Avg Accuracy: {slot.accuracy}%</Text>
                  </View>
                )}
              </TouchableOpacity>
              {slot.name !== null && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(slot)}
                  hitSlop={8}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                >
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      ))}

      <TouchableOpacity style={[styles.menuButton, styles.backBtn]} onPress={() => onNavigate('START_MENU')}>
        <Text style={styles.buttonText}>Back</Text>
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
  menuSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
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
  saveSlotBox: {
    width: '100%',
    height: 70,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  slotClickArea: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: '100%',
    paddingRight: 70,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5e6e6',
    borderLeftWidth: 1,
    borderLeftColor: '#d9b3b3',
    zIndex: 2,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptySlotText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999999',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  saveStatsColumn: {
    gap: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
  },
  namingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 13,
    backgroundColor: '#f9f9f9',
    color: '#333333',
  },
  inlineButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
  },
  inlineButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});