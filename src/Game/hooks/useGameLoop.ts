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
const GRAVITY = 0.06; // Low gravity constant maps beautifully to the pixel canvas coordinate scale

export const useGameLoop = (startX: number, startY: number, mapData: TerrainType[][]) => {
  const [ball, setBall] = useState<BallState>({ x: startX, y: startY, z: 0, radius: 4 });
  const [divots, setDivots] = useState<DivotState[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  // Core physics vector reference properties
  const vxRef = useRef(0);
  const vyRef = useRef(0);
  const vzRef = useRef(0); // Vertical lift velocity vector
  const positionRef = useRef({ x: startX, y: startY, z: 0 });

  const fireBall = useCallback((shot: { angle: number; power: number; loft: number }) => {
    // Drop a divot mark at the launch point
    setDivots((prev) => [...prev, { x: positionRef.current.x, y: positionRef.current.y }]);

    // Adjusted from 0.38 to 0.19 to bring max driver range to 40% canvas height
    const rawSpeed = shot.power * 0.19; 

    // Translate launch vectors into 3D space directions
    vxRef.current = Math.cos(shot.angle) * rawSpeed;
    vyRef.current = Math.sin(shot.angle) * rawSpeed;
    
    // Vertical lift vector scales directly with individual equipment loft configurations
    vzRef.current = rawSpeed * shot.loft; 
    
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
          const impactAngle = Math.atan2(dy, dx);
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);

          if (currentTerrain === 'TREE_B') {
            // LARGE TREES: Bounce outward from the tree instead of lingering inside the cell.
            const normalX = dx / Math.max(distance, 1);
            const normalY = dy / Math.max(distance, 1);
            const dot = vx * normalX + vy * normalY;
            const bounceSpeed = Math.max(0.8, currentSpeed * 0.75);

            if (dot < 0) {
              vx = vx - 2 * dot * normalX;
              vy = vy - 2 * dot * normalY;
            } else {
              vx = -normalX * bounceSpeed;
              vy = -normalY * bounceSpeed;
            }

            const bounceScale = Math.max(1, bounceSpeed / Math.max(currentSpeed, 1));
            vx *= bounceScale;
            vy *= bounceScale;
            vz = -0.2;
            nextX = treeCenterX + normalX * 8;
            nextY = treeCenterY + normalY * 8;
          } else if (!isAirborne) {
            // SMALL TREES: Slow down a lot and nudge the direction slightly.
            const deflection = (Math.random() - 0.5) * 0.25;
            const currentAngle = Math.atan2(vy, vx);
            const reducedSpeed = Math.max(0.2, currentSpeed * 0.25);
            vx = Math.cos(currentAngle + deflection) * reducedSpeed;
            vy = Math.sin(currentAngle + deflection) * reducedSpeed;
          }
        }
      }

      // 6. Dynamic Friction & Landing Logic
      if (isAirborne) {
        // AIRBORNE PHASE: Balanced air drag resistance to allow controlled deep drives
        vx *= 0.994;
        vy *= 0.994;
      } else {
        // GROUND PHASE: Check if ball just impacted from the sky or is rolling out
        if (curZ > 0) {
          // BALL JUST LANDED: Process bounce friction based on terrain stiffness
          let bounceRetention = 0.4; 
          if (currentTerrain === 'GREEN') bounceRetention = 0.45;  
          if (currentTerrain === 'ROUGH') bounceRetention = 0.15;  
          if (currentTerrain === 'BUNKER') bounceRetention = 0.02; 

          vz = -vzRef.current * bounceRetention; 
          
          if (vz < 0.4) {
            vz = 0;
            nextZ = 0;
          }
        }

        // Apply rolling ground friction coefficients
        let groundFriction = 0.965; 
        if (currentTerrain === 'GREEN') groundFriction = 0.982;  
        if (currentTerrain === 'FRINGE') groundFriction = 0.94;
        if (currentTerrain === 'ROUGH') groundFriction = 0.84;   
        if (currentTerrain === 'BUNKER') groundFriction = 0.55;  
        if (currentTerrain === 'TEE') groundFriction = 0.965;

        vx *= groundFriction;
        vy *= groundFriction;
      }

      // 7. Absolute Halt Dead-Stop Checks
      const rollingSpeed = Math.sqrt(vx * vx + vy * vy);
      if (rollingSpeed < 0.15 && nextZ === 0) {
        const snappedX = Math.round((nextX - TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        const snappedY = Math.round((nextY - TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

        const clampedX = Math.max(TILE_SIZE / 2, Math.min(CANVAS_WIDTH - TILE_SIZE / 2, snappedX));
        const clampedY = Math.max(TILE_SIZE / 2, Math.min(CANVAS_HEIGHT - TILE_SIZE / 2, snappedY));

        vx = 0;
        vy = 0;
        vz = 0;
        nextX = clampedX;
        nextY = clampedY;
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