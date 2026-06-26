import { useState } from "react";

interface TouchPoint {
  x: number;
  y: number;
}

export const useAimAndPower = (canvasScale: number, maxPullDistance = 120) => {
  const [isAiming, setIsAiming] = useState(false);
  const [startPoint, setStartPoint] = useState<TouchPoint | null>(null);
  const [currentPoint, setCurrentPoint] = useState<TouchPoint | null>(null);

  const [aimVector, setAimVector] = useState({
    angle: 0,       // Angle in radians
    power: 0,       // 0 to 1 percentage value
    distanceX: 0,   // Virtual X distance pulled
    distanceY: 0,   // Virtual Y distance pulled
  });

  // Convert raw screen pixels into our 400x800 virtual coordinate scale
  const getVirtualTouchLocation = (screenX: number, screenY: number, pageX: number, pageY: number) => {
    // If the event doesn't provide relative canvas coordinates, fall back to global touch offsets
    const touchX = screenX ?? pageX;
    const touchY = screenY ?? pageY;
    return {
      x: touchX / canvasScale,
      y: touchY / canvasScale,
    };
  };

  const startAim = (screenX: number, screenY: number, pageX: number, pageY: number) => {
    const pt = getVirtualTouchLocation(screenX, screenY, pageX, pageY);
    setIsAiming(true);
    setStartPoint(pt);
    setCurrentPoint(pt);
    setAimVector({ angle: 0, power: 0, distanceX: 0, distanceY: 0 });
  };

  const updateAim = (screenX: number, screenY: number, pageX: number, pageY: number) => {
    if (!startPoint) return;
    const pt = getVirtualTouchLocation(screenX, screenY, pageX, pageY);
    setCurrentPoint(pt);

    // Vector calculations between where the pull started and where the thumb currently is
    const dx = pt.x - startPoint.x;
    const dy = pt.y - startPoint.y;
    const pullDistance = Math.sqrt(dx * dx + dy * dy);

    // Slingshot logic: invert the angle so pulling backward aims forward
    const launchAngle = Math.atan2(-dy, -dx);
    
    // Cap the power at our maximum allowed drag radius
    const cappedDistance = Math.min(pullDistance, maxPullDistance);
    const calculatedPower = cappedDistance / maxPullDistance;

    setAimVector({
      angle: launchAngle,
      power: calculatedPower,
      distanceX: dx,
      distanceY: dy,
    });
  };

  const endAim = () => {
    const finalVector = { ...aimVector };
    setIsAiming(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setAimVector({ angle: 0, power: 0, distanceX: 0, distanceY: 0 });
    
    return finalVector; // Return the final values to trigger the shot/minigame loop
  };

  return {
    isAiming,
    aimVector,
    startPoint,
    currentPoint,
    startAim,
    updateAim,
    endAim,
  };
};