const WGS84_A = 6378.137
const WGS84_F = 1 / 298.257223563
const WGS84_B = WGS84_A * (1 - WGS84_F)

const toRad = (deg: number): number => (deg * Math.PI) / 180
const toDeg = (rad: number): number => (rad * 180) / Math.PI

export function destinationPoint(
  lat: number,
  lng: number,
  bearing: number,
  distanceKm: number,
): { lat: number; lng: number } {
  if (distanceKm === 0) {
    return { lat, lng }
  }

  const φ1 = toRad(lat)
  const λ1 = toRad(lng)
  const α1 = toRad(bearing)
  const s = distanceKm

  const a = WGS84_A
  const b = WGS84_B
  const f = WGS84_F

  const sinα1 = Math.sin(α1)
  const cosα1 = Math.cos(α1)

  const tanU1 = (1 - f) * Math.tan(φ1)
  const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1)
  const sinU1 = tanU1 * cosU1

  const σ1 = Math.atan2(tanU1, cosα1)
  const sinα = cosU1 * sinα1
  const cos2α = 1 - sinα * sinα
  const u2 = (cos2α * (a * a - b * b)) / (b * b)
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
  const B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))

  let σ = s / (b * A)
  let σPrev: number
  let sinσ: number
  let cosσ: number
  let cos2σM: number

  let iterations = 0
  do {
    cos2σM = Math.cos(2 * σ1 + σ)
    sinσ = Math.sin(σ)
    cosσ = Math.cos(σ)
    const Δσ =
      B *
      sinσ *
      (cos2σM +
        (B / 4) *
          (cosσ * (-1 + 2 * cos2σM * cos2σM) -
            (B / 6) * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)))
    σPrev = σ
    σ = s / (b * A) + Δσ
    iterations++
  } while (Math.abs(σ - σPrev) > 1e-12 && iterations < 200)

  sinσ = Math.sin(σ)
  cosσ = Math.cos(σ)
  cos2σM = Math.cos(2 * σ1 + σ)

  const φ2 = Math.atan2(
    sinU1 * cosσ + cosU1 * sinσ * cosα1,
    (1 - f) * Math.sqrt(sinα * sinα + (sinU1 * sinσ - cosU1 * cosσ * cosα1) ** 2),
  )

  const λ = Math.atan2(sinσ * sinα1, cosU1 * cosσ - sinU1 * sinσ * cosα1)
  const C = (f / 16) * cos2α * (4 + f * (4 - 3 * cos2α))
  const L =
    λ -
    (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)))

  const λ2 = λ1 + L

  return {
    lat: toDeg(φ2),
    lng: toDeg(λ2),
  }
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
