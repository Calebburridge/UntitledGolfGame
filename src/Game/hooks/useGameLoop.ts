import { useEffect, useRef, useState } from 'react';
import { snapToGridCenter } from '../physics/gridUtils';

interface Position {
  x: number;
  y: number;
}

export const useGameLoop = (initialBallX: number, initialBallY: number) => {
  const [ball, setBall] = useState({ x: initialBallX, y: initialBallY, radius: 4 });
  const [divots, setDivots] = useState<Position[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  const velocityRef = useRef({ vx: 0, vy: 0 });
  const ballPosRef = useRef({ x: initialBallX, y: initialBallY });

  // Sync internal tracking reference if the ball position is manually reset
  useEffect(() => {
    if (!isMoving) {
      ballPosRef.current = { x: ball.x, y: ball.y };
    }
  }, [ball.x, ball.y, isMoving]);

  // Handle the launch sequence triggered by the aiming hook release
  const fireBall = (shotVector: { angle: number; power: number }) => {
    if (isMoving) return;

    // Drop a permanent divot scar at the launch position before moving
    setDivots((prev) => [...prev, { x: ball.x, y: ball.y }]);

    // Initial launch speed multiplier
    const launchSpeed = shotVector.power * 16;
    velocityRef.current = {
      vx: Math.cos(shotVector.angle) * launchSpeed,
      vy: Math.sin(shotVector.angle) * launchSpeed,
    };

    setIsMoving(true);
  };

  // Continuous frame updating loop
  useEffect(() => {
    if (!isMoving) return;

    let animationFrameId: number;

    const updatePhysics = () => {
      // Linear friction slowdown decay map factor
      velocityRef.current.vx *= 0.94;
      velocityRef.current.vy *= 0.94;

      ballPosRef.current.x += velocityRef.current.vx;
      ballPosRef.current.y += velocityRef.current.vy;

      // Outer boundary wall collisions
      if (ballPosRef.current.x < 4 || ballPosRef.current.x > 396) {
        velocityRef.current.vx *= -1;
        ballPosRef.current.x = Math.max(4, Math.min(396, ballPosRef.current.x));
      }
      if (ballPosRef.current.y < 4 || ballPosRef.current.y > 796) {
        velocityRef.current.vy *= -1;
        ballPosRef.current.y = Math.max(4, Math.min(796, ballPosRef.current.y));
      }

      const totalSpeed = Math.sqrt(
        velocityRef.current.vx * velocityRef.current.vx + 
        velocityRef.current.vy * velocityRef.current.vy
      );

      if (totalSpeed < 0.15) {
        setIsMoving(false);
        
        // Stop rolling and snap securely flush to the tile box matrix grid center
        setBall((prev) => ({
          ...prev,
          x: snapToGridCenter(ballPosRef.current.x),
          y: snapToGridCenter(ballPosRef.current.y),
        }));
      } else {
        // Continue tracking active position coordinates
        setBall((prev) => ({
          ...prev,
          x: ballPosRef.current.x,
          y: ballPosRef.current.y,
        }));
        
        animationFrameId = requestAnimationFrame(updatePhysics);
      }
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMoving]);

  return {
    ball,
    divots,
    isMoving,
    fireBall,
  };
};