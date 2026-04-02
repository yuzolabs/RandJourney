import { useState, useCallback, useEffect, useRef } from 'react'
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
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimerRef = useRef<number | null>(null)
  const animationDeadlineRef = useRef<number | null>(null)
  const autoResetTimerRef = useRef<number | null>(null)

  const cancelAutoReset = useCallback(() => {
    if (autoResetTimerRef.current !== null) {
      window.clearTimeout(autoResetTimerRef.current)
      autoResetTimerRef.current = null
    }
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
  }, [])

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current)
      }
      cancelAutoReset()
    }
  }, [cancelAutoReset])

  const throwDart = useCallback(async () => {
    if (!map || state === 'throwing') return

    clearResult()
    setState('throwing')
    setError(null)

    try {
      const center = map.getCenter()
      const point = generateRandomPoint(center.lat, center.lng, radiusKm)

      setIsAnimating(true)
      animationDeadlineRef.current = Date.now() + 1500 + 200
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current)
      }
      animationTimerRef.current = window.setTimeout(() => {
        if (animationDeadlineRef.current !== null && Date.now() >= animationDeadlineRef.current) {
          setIsAnimating(false)
          animationDeadlineRef.current = null
        }
        animationTimerRef.current = null
      }, 1500 + 200)

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
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current)
        animationTimerRef.current = null
      }
      animationDeadlineRef.current = null
      setIsAnimating(false)
      setError('ダーツを投げられませんでした')
      setState('error')
    }
  }, [map, radiusKm, state, clearResult])

  const reset = useCallback(() => {
    cancelAutoReset()
    setState('idle')
    setError(null)
  }, [cancelAutoReset])

  useEffect(() => {
    if (state !== 'done') {
      cancelAutoReset()
      return
    }

    cancelAutoReset()
    autoResetTimerRef.current = window.setTimeout(() => {
      autoResetTimerRef.current = null
      reset()
    }, 5000)

    return cancelAutoReset
  }, [state, cancelAutoReset, reset])

  return { state, result, error, isAnimating, throwDart, reset, cancelAutoReset }
}
