import { useEffect, useState } from 'react'
import type L from 'leaflet'

const DEFAULT_ZOOM = 15

export function parseUrlParams(search: string): { lat: number; lng: number } | null {
  if (!search) return null

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const ll = params.get('ll')
  if (!ll) return null

  const parts = ll.split(',')
  if (parts.length !== 2) return null

  const lat = Number(parts[0])
  const lng = Number(parts[1])

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

export function getShareUrl(lat: number, lng: number): string {
  return `${window.location.origin}${window.location.pathname}?ll=${lat.toFixed(6)},${lng.toFixed(6)}`
}

export function useUrlSharing(map: L.Map | null): { lat: number; lng: number } | null {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const params = parseUrlParams(window.location.search)
    setLocation(params)
  }, [])

  useEffect(() => {
    if (!location || !map) return

    map.flyTo([location.lat, location.lng], DEFAULT_ZOOM)
  }, [location, map])

  return location
}
