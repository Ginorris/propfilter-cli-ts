import { EARTH_RADIUS_KM } from "../constants/filtersConfig";

/**
 * Converts degrees to radians.
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLonRad = toRadians(lon2 - lon1);

  const centralAngle = Math.acos(
    Math.sin(lat1Rad) * Math.sin(lat2Rad) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad),
  );

  return EARTH_RADIUS_KM * centralAngle;
}
