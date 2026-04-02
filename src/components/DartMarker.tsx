import L from 'leaflet'
import { Marker } from 'react-leaflet'
import ResultPopup from './ResultPopup'
import type { DartResult } from '../hooks/useDartThrow'

interface DartMarkerProps {
  lat: number
  lng: number
  result?: DartResult
  onRethrow?: () => void
}

export default function DartMarker({ lat, lng, result, onRethrow }: DartMarkerProps) {
  const icon = L.divIcon({
    html: '<span style="font-size:32px;line-height:1">🎯</span>',
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

  return (
    <Marker position={[lat, lng]} icon={icon}>
      {result && <ResultPopup result={result} onRethrow={onRethrow} />}
    </Marker>
  )
}
