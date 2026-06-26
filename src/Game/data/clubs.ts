export interface Club {
  id: string;
  name: string;
  maxDistance: number;      
  launchVelocity: number;   
  maxDots: number;          
  sweepSpeed: number;       
  maxAngleError: number;    
  level: number;           // Track active instance level
  upgradeCost: number;     // Cost to buy the NEXT level
}

// Baseline level 1 templates
const BASE_CLUBS = [
  { id: 'driver', name: 'Driver', maxDistance: 320, launchVelocity: 22, maxDots: 14, sweepSpeed: 3.2, maxAngleError: 0.9 },
  { id: 'long_iron', name: 'Long Iron', maxDistance: 260, launchVelocity: 18, maxDots: 12, sweepSpeed: 2.6, maxAngleError: 0.7 },
  { id: 'mid_iron', name: 'Mid Iron', maxDistance: 200, launchVelocity: 14, maxDots: 10, sweepSpeed: 2.1, maxAngleError: 0.5 },
  { id: 'short_iron', name: 'Short Iron', maxDistance: 150, launchVelocity: 11, maxDots: 9, sweepSpeed: 1.7, maxAngleError: 0.4 },
  { id: 'pitching_wedge', name: 'Pitching Wedge', maxDistance: 100, launchVelocity: 8, maxDots: 7, sweepSpeed: 1.4, maxAngleError: 0.3 },
  { id: 'sand_wedge', name: 'Sand Wedge', maxDistance: 70, launchVelocity: 6, maxDots: 6, sweepSpeed: 1.2, maxAngleError: 0.25 },
  { id: 'putter', name: 'Putter', maxDistance: 50, launchVelocity: 3.5, maxDots: 16, sweepSpeed: 0.9, maxAngleError: 0.08 },
];

// Generates an upgraded club profile dynamically based on its level record
export const getClubStatsForLevel = (id: string, level: number): Club => {
  const base = BASE_CLUBS.find(c => c.id === id) || BASE_CLUBS[2];
  
  // Progression balancing calculations:
  // Each level adds 5% power/distance, adds extra predictive dots, and slows the timing needle down by 4%
  const powerMultiplier = 1 + (level - 1) * 0.05;
  const speedReduction = Math.max(0.4, 1 - (level - 1) * 0.04);

  return {
    id: base.id,
    name: base.name,
    level,
    maxDistance: Math.round(base.maxDistance * powerMultiplier),
    launchVelocity: base.launchVelocity * powerMultiplier,
    maxDots: base.maxDots + (level - 1),
    sweepSpeed: base.sweepSpeed * speedReduction,
    maxAngleError: base.maxAngleError * speedReduction,
    upgradeCost: level * 150, // Cost scaling formula: Level 1->2 costs $150, 2->3 costs $300, etc.
  };
};

// Quick map builder to assemble a full bag array for menus
export const getAllClubsForProfile = (clubLevels: Record<string, number>): Club[] => {
  return BASE_CLUBS.map(c => getClubStatsForLevel(c.id, clubLevels[c.id] || 1));
};

export const CLUBS: Club[] = BASE_CLUBS.map(c => getClubStatsForLevel(c.id, 1));