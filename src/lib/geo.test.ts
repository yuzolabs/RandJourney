import { describe, it, expect } from 'vitest'
import { destinationPoint, haversineDistance } from './geo'

describe('destinationPoint', () => {
  it('東京駅から北へ10km', () => {
    const result = destinationPoint(35.6812, 139.7671, 0, 10)
    // 北方向: lat増加、lng変化なし
    expect(result.lat).toBeCloseTo(35.7712, 1) // ±0.01°
    expect(result.lng).toBeCloseTo(139.7671, 2)
  })

  it('東京駅から東へ100km（誤差0.5%以内）', () => {
    const result = destinationPoint(35.6812, 139.7671, 90, 100)
    const dist = haversineDistance(35.6812, 139.7671, result.lat, result.lng)
    expect(Math.abs(dist - 100) / 100).toBeLessThan(0.005) // 0.5%以内（Vincenty楕円体とHaversine球面の差を許容）
  })

  it('距離0kmで同一点が返る', () => {
    const result = destinationPoint(35.6812, 139.7671, 45, 0)
    expect(result.lat).toBeCloseTo(35.6812, 4)
    expect(result.lng).toBeCloseTo(139.7671, 4)
  })

  it('南半球のポイント（シドニー → 北100km）', () => {
    const result = destinationPoint(-33.8688, 151.2093, 0, 100)
    expect(result.lat).toBeGreaterThan(-33.8688) // latが増加（北方向）
    expect(result.lat).toBeCloseTo(-32.9688, 1)
  })

  it('往復テスト: 到達点からの距離が元の距離に一致', () => {
    const bearing = 135
    const distKm = 50
    const dest = destinationPoint(35.6812, 139.7671, bearing, distKm)
    const roundTrip = haversineDistance(35.6812, 139.7671, dest.lat, dest.lng)
    expect(Math.abs(roundTrip - distKm) / distKm).toBeLessThan(0.01) // 1%以内
  })
})

describe('haversineDistance', () => {
  it('東京駅 ↔ 大阪駅（約400km）', () => {
    // 東京駅: 35.6812, 139.7671
    // 大阪駅: 34.7024, 135.4959
    const dist = haversineDistance(35.6812, 139.7671, 34.7024, 135.4959)
    expect(dist).toBeGreaterThan(390)
    expect(dist).toBeLessThan(420)
  })

  it('同一点の距離は0', () => {
    const dist = haversineDistance(35.6812, 139.7671, 35.6812, 139.7671)
    expect(dist).toBeCloseTo(0, 5)
  })
})
