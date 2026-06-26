import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Club, getAllClubsForProfile } from '../data/clubs';
import { GameScreenState, SaveSlotData } from '../data/menuState';

interface ClubBagScreenProps {
  onNavigate: (nextState: GameScreenState) => void;
  activeSave: SaveSlotData;
  onUpgradeClub: (clubId: string, cost: number) => void;
}

export const ClubBagScreen: React.FC<ClubBagScreenProps> = ({
  onNavigate,
  activeSave,
  onUpgradeClub,
}) => {
  const clubsInBag = getAllClubsForProfile(activeSave.clubLevels);

  const handleUpgradeClick = (club: Club) => {
    if (activeSave.cash >= club.upgradeCost) {
      onUpgradeClub(club.id, club.upgradeCost);
    }
  };

  return (
    <View style={styles.menuContainer}>
      {/* Wallet Status Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.bagTitle}>Golf Club Bag</Text>
        <Text style={styles.cashDisplay}>Cash: ${activeSave.cash}</Text>
      </View>

      <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
        {clubsInBag.map((club) => {
          const canAfford = activeSave.cash >= club.upgradeCost;
          
          return (
            <View key={club.id} style={styles.clubCard}>
              <View style={styles.infoCol}>
                <Text style={styles.clubName}>{club.name} <Text style={styles.lvlText}>LV.{club.level}</Text></Text>
                <Text style={styles.statLabel}>Max Range: {club.maxDistance}y</Text>
                <Text style={styles.statLabel}>Precision Dots: {club.maxDots}</Text>
              </View>
              
              <TouchableOpacity
                style={[styles.upgradeButton, !canAfford && styles.disabledButton]}
                onPress={() => handleUpgradeClick(club)}
              >
                <Text style={styles.upBtnText}>Upgrade</Text>
                <Text style={styles.costText}>${club.upgradeCost}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('MAIN_GAME_MENU')}>
        <Text style={styles.backBtnText}>Return to Hub</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderColor: '#333333',
    paddingBottom: 8,
    marginBottom: 15,
  },
  bagTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333333',
    textTransform: 'uppercase',
  },
  cashDisplay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006400',
  },
  listScroll: {
    flex: 1,
    marginBottom: 15,
  },
  clubCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoCol: {
    gap: 2,
  },
  clubName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  lvlText: {
    fontSize: 11,
    color: '#ff8c00',
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
  },
  upgradeButton: {
    backgroundColor: '#333333',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 85,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  upBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  costText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backBtn: {
    borderWidth: 2,
    borderColor: '#333333',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
  },
});