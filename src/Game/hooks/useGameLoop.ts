import { useCallback, useEffect, useRef, useState } from 'react';
import { TerrainType } from '../data/terrain';

interface BallState {
  x: number;
  y: number;
  z: number; // Vertical height altitude tracking
  radius: number;
}

interface DivotState {
  x: number;
  y: number;
}

const TILE_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 800;
const GRAVITY = 0.06; // Tuned low gravity anchor for smooth notebook arc panning

export const useGameLoop = (startX: number, startY: number, mapData: TerrainType[][]) => {
  const [ball, setBall] = useState<BallState>({ x: startX, y: startY, z: 0, radius: 4 });
  const [divots, setDivots] = useState<DivotState[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  // Core physics vector reference properties
  const vxRef = useRef(0);
  const vyRef = useRef(0);
  const vzRef = useRef(0); // Vertical lift velocity vector
  const positionRef = useRef({ x: startX, y: startY, z: 0 });

  const fireBall = useCallback((shot: { angle: number; power: number }) => {
    // Drop a divot mark at the launch point
    setDivots((prev) => [...prev, { x: positionRef.current.x, y: positionRef.current.y }]);

    // Adjusted to 0.33 to achieve 75% of the previous maximum driver range
    const rawSpeed = shot.power * 0.33; 

    // Translate launch vectors into 3D space directions
    vxRef.current = Math.cos(shot.angle) * rawSpeed;
    vyRef.current = Math.sin(shot.angle) * rawSpeed;
    
    // Balanced lift vector creates proportional altitude arcs per club range
    vzRef.current = rawSpeed * 0.22; 
    
    setIsMoving(true);
  }, []);

  useEffect(() => {
    if (!isMoving) return;

    let animationFrameId: number;

    const updatePhysicsStep = () => {
      let curX = positionRef.current.x;
      let curY = positionRef.current.y;
      let curZ = positionRef.current.z;
      
      let vx = vxRef.current;
      let vy = vyRef.current;
      let vz = vzRef.current;

      // 1. Apply Future Coordinate Steps
      let nextX = curX + vx;
      let nextY = curY + vy;
      let nextZ = curZ + vz;

      const isAirborne = nextZ > 0;

      // 2. Continuous Gravity Pull (Only matters if airborne)
      if (isAirborne) {
        vz -= GRAVITY;
      } else {
        vz = 0;
        nextZ = 0;
      }

      // 3. Map Edge Boundary Bounce Cushions
      if (nextX < 6 || nextX > CANVAS_WIDTH - 6) {
        vx = -vx * 0.4;
        nextX = curX + vx;
      }
      if (nextY < 6 || nextY > CANVAS_HEIGHT - 6) {
        vy = -vy * 0.4;
        nextY = curY + vy;
      }

      // 4. Grid Coordinate Translation
      const col = Math.floor(nextX / TILE_SIZE);
      const row = Math.floor(nextY / TILE_SIZE);
      const currentTerrain: TerrainType = mapData[row]?.[col] || 'ROUGH';

      // 5. Hazard Objects Interceptions (Trees)
      if (currentTerrain === 'TREE_B' || currentTerrain === 'TREE_S') {
        const treeCenterX = col * TILE_SIZE + TILE_SIZE / 2;
        const treeCenterY = row * TILE_SIZE + TILE_SIZE / 2;
        
        const dx = nextX - treeCenterX;
        const dy = nextY - treeCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 12) {
          if (currentTerrain === 'TREE_B') {
            // LARGE TREES: High solid canopy. Will block ball even if airborne!
            vx = -vx * 0.5;
            vy = -vy * 0.5;
            vz = -0.3; // Smush downward velocity vector on collision
            nextX = curX + vx;
            nextY = curY + vy;
          } else if (!isAirborne) {
            // SMALL TREES: Low brush. Airborne shots fly right over them! Ground rolls choke.
            vx *= 0.3;
            vy *= 0.3;
            const currentAngle = Math.atan2(vy, vx);
            const deflection = (Math.random() - 0.5) * 0.4;
            const speed = Math.sqrt(vx * vx + vy * vy);
            vx = Math.cos(currentAngle + deflection) * speed;
            vy = Math.sin(currentAngle + deflection) * speed;
          }
        }
      }

      // 6. Dynamic Friction & Landing Logic
      if (isAirborne) {
        // AIRBORNE PHASE: Minor air friction drag (flies freely over hazards)
        vx *= 0.996;
        vy *= 0.996;
      } else {
        // GROUND PHASE: Check if ball just impacted from the sky or is rolling out
        if (curZ > 0) {
          // BALL JUST LANDED: Process impact elastic bounce dampenings based on terrain stiffness
          let bounceRetention = 0.4; // Fairway standard bounce kick
          if (currentTerrain === 'GREEN') bounceRetention = 0.45;  // Firm hard greens bounce more
          if (currentTerrain === 'ROUGH') bounceRetention = 0.15;  // Heavy grass swallows bounce
          if (currentTerrain === 'BUNKER') bounceRetention = 0.02; // Soft sand kills bounce completely

          vz = -vzRef.current * bounceRetention; // Invert vertical vector upwards
          
          // If the upward rebound velocity is tiny, force the ball to settle down into a flat roll
          if (vz < 0.4) {
            vz = 0;
            nextZ = 0;
          }
        }

        // Apply rolling ground friction coefficients
        let groundFriction = 0.965; // Fairway baseline rollout speed depletion
        if (currentTerrain === 'GREEN') groundFriction = 0.982;  // Slick putting rollout
        if (currentTerrain === 'FRINGE') groundFriction = 0.94;
        if (currentTerrain === 'ROUGH') groundFriction = 0.84;   // Heavy rollout choking
        if (currentTerrain === 'BUNKER') groundFriction = 0.55;  // Instant sand trap braking
        if (currentTerrain === 'TEE') groundFriction = 0.965;

        vx *= groundFriction;
        vy *= groundFriction;
      }

      // 7. Absolute Halt Dead-Stop Checks
      const rollingSpeed = Math.sqrt(vx * vx + vy * vy);
      if (rollingSpeed < 0.15 && nextZ === 0) {
        vx = 0;
        vy = 0;
        vz = 0;
        setIsMoving(false);
      }

      // Commit vectors back to engine properties tracking structures
      vxRef.current = vx;
      vyRef.current = vy;
      vzRef.current = vz;
      positionRef.current = { x: nextX, y: nextY, z: nextZ };
      
      setBall({ x: nextX, y: nextY, z: nextZ, radius: 4 });

      if (vx !== 0 || vy !== 0 || vz !== 0) {
        animationFrameId = requestAnimationFrame(updatePhysicsStep);
      }
    };

    animationFrameId = requestAnimationFrame(updatePhysicsStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMoving, mapData]);

  return { ball, divots, isMoving, fireBall };
};