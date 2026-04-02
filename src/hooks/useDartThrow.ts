import { useState, useCallback } from 'react'
import type L from 'leaflet'
import { generateRandomPoint } from '../lib/random-point'
import { reverseGeocode } from '../lib/geocoding'

export type DartState = 'idle' | 'throwing' | 'done' | 'error'

export interface DartResult {
  lat: number
  lng: number
  prefecture: string
  city: string
  address: string
}

interface UseDartThrowOptions {
  map: L.Map | null
  radiusKm: number
}

export function useDartThrow({ map, radiusKm }: UseDartThrowOptions) {
  const [state, setState] = useState<DartState>('idle')
  const [result, setResult] = useState<DartResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const throwDart = useCallback(async () => {
    if (!map || state === 'throwing') return

    setState('throwing')
    setError(null)

    try {
      const center = map.getCenter()
      const point = generateRandomPoint(center.lat, center.lng, radiusKm)

      map.flyTo([point.lat, point.lng], 15, { duration: 1.5 })

      const geo = await reverseGeocode(point.lat, point.lng)

      const dartResult: DartResult = {
        lat: point.lat,
        lng: point.lng,
        prefecture: geo?.prefecture ?? '',
        city: geo?.city ?? '',
        address: geo?.address ?? '',
      }

      setResult(dartResult)
      setState('done')
    } catch (_err) {
      setError('ダーツを投げられませんでした')
      setState('error')
    }
  }, [map, radiusKm, state])

  const reset = useCallback(() => {
    setState('idle')
    setResult(null)
    setError(null)
  }, [])

  return { state, result, error, throwDart, reset }
}
