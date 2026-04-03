import { destinationPoint, haversineDistance } from "./geo"

export type GeoPoint = { lat: number; lng: number }

export function generateRandomPoint(
  centerLat: number,
  centerLon: number,
  radiusKm: number,
): GeoPoint {
  if (radiusKm === 0) {
    return destinationPoint(centerLat, centerLon, 0, 0)
  }

  const distance = radiusKm * Math.sqrt(Math.random())
  const bearing = Math.random() * 360

  return destinationPoint(centerLat, centerLon, bearing, distance)
}

export { haversineDistance }
