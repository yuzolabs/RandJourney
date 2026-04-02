import { useState } from 'react'
import { useMap } from 'react-leaflet'
import styles from './GeolocationButton.module.css'

interface GeolocationButtonProps {
  onError?: (message: string) => void
}

export default function GeolocationButton({ onError }: GeolocationButtonProps) {
  const map = useMap()
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    if (!navigator.geolocation) {
      onError?.('位置情報がサポートされていません')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo([position.coords.latitude, position.coords.longitude], 13)
        setLoading(false)
      },
      (error) => {
        if (error.code === 1) {
          onError?.('位置情報の許可が必要です')
        } else {
          onError?.('位置情報を取得できませんでした')
        }
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={loading}
      aria-label="現在地を取得"
      data-testid="geolocation-button"
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.icon} aria-hidden="true">
          📍
        </span>
      )}
    </button>
  )
}
