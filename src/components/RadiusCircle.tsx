import { useState } from 'react'
import { Circle, useMapEvents, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

interface RadiusCircleProps {
  radiusKm: number
}

const pathOptions = {
  color: '#007AFF',
  fillColor: '#007AFF',
  fillOpacity: 0.1,
  weight: 2
}

export default function RadiusCircle({ radiusKm }: RadiusCircleProps) {
  const map = useMap()
  const [center, setCenter] = useState<LatLngExpression>(map.getCenter())

  useMapEvents({
    moveend() {
      setCenter(map.getCenter())
    }
  })

  return (
    <Circle
      center={center}
      radius={radiusKm * 1000}
      pathOptions={pathOptions}
    />
  )
}
