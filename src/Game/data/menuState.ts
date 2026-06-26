export type GameScreenState = 
  | 'START_MENU' 
  | 'SAVE_SLOTS' 
  | 'MAIN_GAME_MENU' 
  | 'IN_GAME';

export interface SaveSlotData {
  id: number;
  name: string | null;
  accuracy: number;        // Total continuous percentage accuracy
  handicap: string;        // "Reviewing" or a calculated value
  bestStrokes: number;     // Meta snapshot metric
  unlocks: string[];       // Upgraded balls, clubs, etc.
}