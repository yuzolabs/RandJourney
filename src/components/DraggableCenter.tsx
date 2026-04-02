import { useState, useMemo, useRef } from 'react'
import { Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import styles from './CenterCross.module.css'

export default function DraggableCenter() {
  const map = useMapEvents({
    move() {
      if (!isDragging.current) {
        setPosition(map.getCenter())
      }
    },
    click(e) {
      // Don't trigger if clicking on controls or markers - Leaflet handles this naturally 
      // as controls/markers stop event propagation.
      map.flyTo(e.latlng, map.getZoom())
    }
  })

  const [position, setPosition] = useState(map.getCenter())
  const isDragging = useRef(false)

  const crossIcon = useMemo(() => {
    return L.divIcon({
      className: styles.crossContainer,
      html: `
        <div class="${styles.cross}">
          <div class="${styles.horizontal}"></div>
          <div class="${styles.vertical}"></div>
        </div>
        <div class="${styles.centerDot}"></div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
  }, [])

  const eventHandlers = useMemo(
    () => ({
      dragstart() {
        isDragging.current = true
      },
      dragend(e: L.LeafletEvent) {
        isDragging.current = false
        const marker = e.target
        if (marker != null) {
          map.flyTo(marker.getLatLng(), map.getZoom())
        }
      },
    }),
    [map],
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={crossIcon}
      title="ドラッグで移動"
      alt="中心座標（ドラッグ可能）"
    />
  )
}
