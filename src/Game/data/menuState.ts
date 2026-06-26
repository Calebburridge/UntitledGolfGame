export type GameScreenState = 
  | 'START_MENU' 
  | 'SAVE_SLOTS' 
  | 'MAIN_GAME_MENU' 
  | 'CLUB_BAG' 
  | 'IN_GAME';

export interface SaveSlotData {
  id: number;
  name: string | null;
  accuracy: number;
  handicap: string;
  bestStrokes: number;
  unlocks: string[];
  cash: number;                        // Earned currency for shop upgrades
  clubLevels: Record<string, number>;  // e.g., { driver: 1, mid_iron: 2 }
}