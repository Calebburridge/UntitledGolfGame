export interface Club {
  id: string;
  name: string;
  maxDistance: number;      // Maximum length of the visual trajectory line
  launchVelocity: number;   // Speed multiplier fed into the physics engine
  maxDots: number;          // Number of predictive dots shown during aiming
  sweepSpeed: number;       // How fast the needle moves in the minigame
  maxAngleError: number;    // How wildly the ball slices/hooks if the timing is missed
}

export const CLUBS: Club[] = [
  {
    id: 'driver',
    name: 'Driver',
    maxDistance: 320,
    launchVelocity: 22,
    maxDots: 14,
    sweepSpeed: 3.2,
    maxAngleError: 0.9, // High risk, high reward
  },
  {
    id: 'long_iron',
    name: 'Long Iron',
    maxDistance: 260,
    launchVelocity: 18,
    maxDots: 12,
    sweepSpeed: 2.6,
    maxAngleError: 0.7,
  },
  {
    id: 'mid_iron',
    name: 'Mid Iron',
    maxDistance: 200,
    launchVelocity: 14,
    maxDots: 10,
    sweepSpeed: 2.1,
    maxAngleError: 0.5,
  },
  {
    id: 'short_iron',
    name: 'Short Iron',
    maxDistance: 150,
    launchVelocity: 11,
    maxDots: 9,
    sweepSpeed: 1.7,
    maxAngleError: 0.4,
  },
  {
    id: 'pitching_wedge',
    name: 'Pitching Wedge',
    maxDistance: 100,
    launchVelocity: 8,
    maxDots: 7,
    sweepSpeed: 1.4,
    maxAngleError: 0.3,
  },
  {
    id: 'sand_wedge',
    name: 'Sand Wedge',
    maxDistance: 70,
    launchVelocity: 6,
    maxDots: 6,
    sweepSpeed: 1.2,
    maxAngleError: 0.25, // Highly forgiving
  },
  {
    id: 'putter',
    name: 'Putter',
    maxDistance: 50,
    launchVelocity: 3.5,
    maxDots: 16,        // High visibility precision for close range finishing shots
    sweepSpeed: 0.9,    // Very slow, accurate alignment control
    maxAngleError: 0.08, // Putts remain almost perfectly straight
  },
];