import L from 'leaflet'
import { Marker } from 'react-leaflet'
import { useMemo, useRef, useEffect } from 'react'
import ResultPopup from './ResultPopup'
import type { DartResult } from '../hooks/useDartThrow'
import styles from './DartMarker.module.css'

interface DartMarkerProps {
  lat: number
  lng: number
  result?: DartResult
  onRethrow?: () => void
}

export default function DartMarker({ lat, lng, result, onRethrow }: DartMarkerProps) {
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    if (result && markerRef.current) {
      markerRef.current.openPopup()
    }
  }, [result])

  const icon = useMemo(() => {
    return L.divIcon({
      html: `
        <div class="${styles.markerContainer}">
          <span class="${styles.dartIcon}">🎯</span>
          <div class="${styles.ripple}"></div>
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })
  }, [])

  return (
    <Marker position={[lat, lng]} icon={icon} ref={markerRef}>
      {result && <ResultPopup result={result} onRethrow={onRethrow} />}
    </Marker>
  )
}
