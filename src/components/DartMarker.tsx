import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

interface DartMarkerProps {
  lat: number
  lng: number
}

export default function DartMarker({ lat, lng }: DartMarkerProps) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (markerRef.current) {
      map.removeLayer(markerRef.current)
    }

    const icon = L.divIcon({
      html: '<span style="font-size:32px;line-height:1">🎯</span>',
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    const marker = L.marker([lat, lng], { icon })
    marker.addTo(map)
    markerRef.current = marker

    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
    }
  }, [map, lat, lng])

  return null
}
