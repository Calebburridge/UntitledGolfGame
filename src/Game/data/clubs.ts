export interface Club {
  id: string;
  name: string;
  maxDistance: number;   // For UI scorecard tray display
  maxDots: number;       // Trajectory prediction length
  launchVelocity: number; // Horizontal velocity multiplier
  loft: number;          // Vertical arc altitude scaler (0.0 = completely flat putt)
  sweepSpeed: number;    // Minigame indicator slider velocity (higher = faster swing)
  maxAngleError: number; // Precision target penalty scale
  level: number;
  upgradeCost: number;
  isMaxLevel: boolean;
}

export const MAX_CLUB_LEVEL = 5;

export const CLUBS: Club[] = [
  { id: 'dr', name: 'Driver', maxDistance: 250, maxDots: 18, launchVelocity: 24.0, loft: 0.25, sweepSpeed: 2.4, maxAngleError: 0.50, level: 1, upgradeCost: 30, isMaxLevel: false },
  { id: '3w', name: '3-Wood', maxDistance: 210, maxDots: 15, launchVelocity: 19.5, loft: 0.28, sweepSpeed: 2.0, maxAngleError: 0.40, level: 1, upgradeCost: 30, isMaxLevel: false },
  { id: '5i', name: '5-Iron', maxDistance: 170, maxDots: 12, launchVelocity: 15.5, loft: 0.35, sweepSpeed: 1.6, maxAngleError: 0.30, level: 1, upgradeCost: 30, isMaxLevel: false },
  { id: '7i', name: '7-Iron', maxDistance: 140, maxDots: 10, launchVelocity: 12.0, loft: 0.42, sweepSpeed: 1.3, maxAngleError: 0.25, level: 1, upgradeCost: 30, isMaxLevel: false },
  { id: 'pw', name: 'P. Wedge', maxDistance: 100, maxDots: 8, launchVelocity: 9.5, loft: 0.52, sweepSpeed: 1.0, maxAngleError: 0.20, level: 1, upgradeCost: 30, isMaxLevel: false },
  { id: 'pt', name: 'Putter', maxDistance: 30, maxDots: 5, launchVelocity: 5.5, loft: 0.0, sweepSpeed: 0.6, maxAngleError: 0.05, level: 1, upgradeCost: 30, isMaxLevel: false },
];

const getLevelScale = (level: number, base: number, level1: number, level2: number, level3: number, level4: number, level5: number): number => {
  const normalizedLevel = Math.min(MAX_CLUB_LEVEL, Math.max(1, level));
  switch (normalizedLevel) {
    case 1: return base * level1;
    case 2: return base * level2;
    case 3: return base * level3;
    case 4: return base * level4;
    case 5: return base * level5;
    default: return base;
  }
};

export const getAllClubsForProfile = (clubLevels: Record<string, number>): Club[] => {
  return CLUBS.map(baseClub => {
    const level = Math.min(MAX_CLUB_LEVEL, Math.max(1, clubLevels[baseClub.id] || 1));
    const upgradeCost = level >= MAX_CLUB_LEVEL ? 0 : 30 + (level - 1) * 15;

    return {
      ...baseClub,
      level,
      upgradeCost,
      isMaxLevel: level >= MAX_CLUB_LEVEL,
      launchVelocity: getLevelScale(level, baseClub.launchVelocity, 0.86, 0.94, 1.0, 1.08, 1.16),
      maxDistance: Math.round(getLevelScale(level, baseClub.maxDistance, 0.82, 0.92, 1.0, 1.08, 1.16)),
      sweepSpeed: getLevelScale(level, baseClub.sweepSpeed, 1.16, 1.08, 1.0, 0.92, 0.84),
      maxAngleError: Math.max(0.02, getLevelScale(level, baseClub.maxAngleError, 1.28, 1.12, 1.0, 0.90, 0.80)),
    };
  });
};