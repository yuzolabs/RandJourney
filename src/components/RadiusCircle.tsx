import { useState, useEffect, useMemo } from 'react'
import { Circle, useMapEvents, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import styles from './RadiusCircle.module.css'

interface RadiusCircleProps {
  radiusKm: number
}

const defaultPathOptions = {
  fillOpacity: 0.1,
  weight: 2
}

export default function RadiusCircle({ radiusKm }: RadiusCircleProps) {
  const map = useMap()
  const [center, setCenter] = useState<LatLngExpression>(map.getCenter())
  const [isThrowing, setIsThrowing] = useState(false)

  const circleColor = useMemo(() => {
    if (radiusKm <= 10) return 'var(--color-success, #34C759)'
    if (radiusKm <= 50) return '#007AFF'
    if (radiusKm <= 100) return '#FF9500'
    return 'var(--color-danger, #FF3B30)'
  }, [radiusKm])

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setIsThrowing(customEvent.detail === 'throwing')
    }

    window.addEventListener('dart-throw-state', handleStateChange)
    return () => {
      window.removeEventListener('dart-throw-state', handleStateChange)
    }
  }, [])

  useMapEvents({
    moveend() {
      setCenter(map.getCenter())
    }
  })

  return (
    <Circle
      center={center}
      radius={radiusKm * 1000}
      pathOptions={{
        ...defaultPathOptions,
        color: circleColor,
        fillColor: circleColor,
        className: isThrowing ? styles.roulette : '',
      }}
    />
  )
}
