export interface Club {
  id: string;
  name: string;
  maxDistance: number;   // For UI scorecard tray display
  maxDots: number;       // Trajectory prediction length
  launchVelocity: number; // Horizontal velocity multiplier
  loft: number;          // Vertical arc altitude scaler (0.0 = completely flat putt)
  sweepSpeed: number;    // Minigame indicator slider velocity (higher = faster swing)
  maxAngleError: number; // Precision target penalty scale
}

export const CLUBS: Club[] = [
  { id: 'dr', name: 'Driver', maxDistance: 250, maxDots: 18, launchVelocity: 24.0, loft: 0.25, sweepSpeed: 2.4, maxAngleError: 0.50 },
  { id: '3w', name: '3-Wood', maxDistance: 210, maxDots: 15, launchVelocity: 19.5, loft: 0.28, sweepSpeed: 2.0, maxAngleError: 0.40 },
  { id: '5i', name: '5-Iron', maxDistance: 170, maxDots: 12, launchVelocity: 15.5, loft: 0.35, sweepSpeed: 1.6, maxAngleError: 0.30 },
  { id: '7i', name: '7-Iron', maxDistance: 140, maxDots: 10, launchVelocity: 12.0, loft: 0.42, sweepSpeed: 1.3, maxAngleError: 0.25 },
  { id: 'pw', name: 'P. Wedge', maxDistance: 100, maxDots: 8, launchVelocity: 9.5, loft: 0.52, sweepSpeed: 1.0, maxAngleError: 0.20 },
  { id: 'pt', name: 'Putter', maxDistance: 30, maxDots: 5, launchVelocity: 5.5, loft: 0.0, sweepSpeed: 0.6, maxAngleError: 0.05 },
];

export const getAllClubsForProfile = (clubLevels: Record<string, number>): Club[] => {
  return CLUBS.map(baseClub => {
    const level = clubLevels[baseClub.id] || 1;
    const upgradeBonus = (level - 1) * 0.06; // 6% stat bonus bump per level upgrade
    return {
      ...baseClub,
      launchVelocity: baseClub.launchVelocity * (1 + upgradeBonus),
      maxDistance: Math.round(baseClub.maxDistance * (1 + upgradeBonus)),
      maxAngleError: Math.max(0.02, baseClub.maxAngleError * (1 - (level - 1) * 0.04)),
    };
  });
};