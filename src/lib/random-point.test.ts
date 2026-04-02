import { describe, expect, it } from "bun:test"
import { haversineDistance } from "./geo"
import { generateRandomPoint } from "./random-point"

describe("generateRandomPoint", () => {
  it("100回生成した全ポイントが指定半径内にある", () => {
    const centerLat = 35.6812
    const centerLon = 139.7671
    const radiusKm = 10

    for (let i = 0; i < 100; i++) {
      const point = generateRandomPoint(centerLat, centerLon, radiusKm)
      const distance = haversineDistance(centerLat, centerLon, point.lat, point.lng)
      const floatingPointTolerance = 0.05
      expect(distance).toBeLessThanOrEqual(radiusKm + floatingPointTolerance)
    }
  })

  it("分布の均一性: 半径50%以内に落ちるポイントの割合が約25%（面積比）", () => {
    const centerLat = 35.6812
    const centerLon = 139.7671
    const radiusKm = 10
    const samples = 1000
    let innerCount = 0

    for (let i = 0; i < samples; i++) {
      const point = generateRandomPoint(centerLat, centerLon, radiusKm)
      const distance = haversineDistance(centerLat, centerLon, point.lat, point.lng)
      if (distance <= radiusKm * 0.5) {
        innerCount++
      }
    }

    const ratio = innerCount / samples
    const theoreticalAreaRatio = 0.25
    const tolerance = 0.10
    expect(ratio).toBeGreaterThanOrEqual(theoreticalAreaRatio - tolerance)
    expect(ratio).toBeLessThanOrEqual(theoreticalAreaRatio + tolerance)
  })

  it("radiusKm=0 のとき中心点そのものが返る", () => {
    const centerLat = 35.6812
    const centerLon = 139.7671
    const point = generateRandomPoint(centerLat, centerLon, 0)
    expect(point.lat).toBeCloseTo(centerLat, 10)
    expect(point.lng).toBeCloseTo(centerLon, 10)
  })

  it("radiusKm=200 で生成成功（最大半径）", () => {
    const centerLat = 35.6812
    const centerLon = 139.7671
    const radiusKm = 200
    const point = generateRandomPoint(centerLat, centerLon, radiusKm)
    const distance = haversineDistance(centerLat, centerLon, point.lat, point.lng)
    expect(distance).toBeLessThanOrEqual(radiusKm + 0.1)
  })

  it("返り値の型が { lat: number, lng: number } であること", () => {
    const point = generateRandomPoint(35.6812, 139.7671, 10)
    expect(typeof point.lat).toBe("number")
    expect(typeof point.lng).toBe("number")
    expect(Object.keys(point)).toContain("lat")
    expect(Object.keys(point)).toContain("lng")
  })
})
