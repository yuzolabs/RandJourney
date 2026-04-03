import { useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, TileLayer } from 'react-leaflet'
import styles from './MapView.module.css'

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const GSI_TILE_URL = 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
const GSI_ATTRIBUTION =
  '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'

const TOKYO_CENTER: [number, number] = [35.6812, 139.7671]
const DEFAULT_ZOOM = 10

interface MapViewProps {
  className?: string
  children?: React.ReactNode
  onMapCreated?: (map: L.Map) => void
}

export default function MapView({ className, children, onMapCreated }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)

  return (
    <MapContainer
      center={TOKYO_CENTER}
      zoom={DEFAULT_ZOOM}
      maxZoom={18}
      minZoom={5}
      zoomControl={false}
      ref={(map) => {
        mapRef.current = map
        if (map && onMapCreated) {
          onMapCreated(map)
        }
      }}
      className={`${styles.mapContainer}${className ? ` ${className}` : ''}`}
    >
      <TileLayer url={GSI_TILE_URL} attribution={GSI_ATTRIBUTION} />
      {children}
    </MapContainer>
  )
}
