import { useState, useRef, useEffect } from 'react'
import type L from 'leaflet'
import MapView from './components/MapView'
import DartButton from './components/DartButton'
import DartMarker from './components/DartMarker'
import RadiusControl from './components/RadiusControl'
import RadiusCircle from './components/RadiusCircle'
import DraggableCenter from './components/DraggableCenter';
import FirstTimeHint from './components/FirstTimeHint'
import GeolocationButton from './components/GeolocationButton'
import { HistoryPanel } from './components/HistoryPanel'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'
import ResultCard from './components/ResultCard'
import { useDartThrow } from './hooks/useDartThrow'
import { useUrlSharing } from './hooks/useUrlSharing'
import { useRadius } from './hooks/useRadius'
import { useHistory } from './hooks/useHistory'
import { reverseGeocode } from './lib/geocoding'
import styles from './App.module.css'
import './styles/tokens.css'

export default function App() {
  const [map, setMap] = useState<L.Map | null>(null)
  const { radius, setRadius } = useRadius()
  const { state, result, isAnimating, throwDart, reset, cancelAutoReset } = useDartThrow({ map, radiusKm: radius })
  const { history, addEntry, removeEntry, clearHistory } = useHistory()
  const sharedLocation = useUrlSharing(map)

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [sharedResult, setSharedResult] = useState<
    | {
        lat: number
        lng: number
        prefecture: string
        city: string
        address: string
      }
    | undefined
  >(undefined)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const lastResultRef = useRef(result)
  useEffect(() => {
    if (result && result !== lastResultRef.current) {
      addEntry(result)
      lastResultRef.current = result
    }
  }, [result, addEntry])

  useEffect(() => {
    if (!sharedLocation) {
      setSharedResult(undefined)
      return
    }

    reverseGeocode(sharedLocation.lat, sharedLocation.lng).then((geo) => {
      if (geo) {
        setSharedResult({
          lat: sharedLocation.lat,
          lng: sharedLocation.lng,
          prefecture: geo.prefecture,
          city: geo.city,
          address: geo.address,
        })
      } else {
        setSharedResult({
          lat: sharedLocation.lat,
          lng: sharedLocation.lng,
          prefecture: '',
          city: '',
          address: '',
        })
      }
    })
  }, [sharedLocation])

  useEffect(() => {
    if (state === 'error') {
      setToastMessage('ダーツを投げられませんでした。もう一度試してください。')
    }
  }, [state])

  return (
    <ErrorBoundary>
      <div className={styles.appWrapper}>
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        <ResultCard result={result} />
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>🎯</span>
              RandJourney
            </h1>
            <button
              className={styles.historyToggle}
              onClick={() => setIsHistoryOpen(true)}
              aria-label="履歴を開く"
              aria-expanded={isHistoryOpen || isDesktop}
            >
              🕐
            </button>
          </header>

          <div className={styles.mapArea}>
            {!map && (
              <div className={styles.mapLoading}>
                <span>🗾</span>
                <p>地図を読み込み中...</p>
              </div>
            )}
            <MapView onMapCreated={setMap}>
              {sharedResult && (
                <DartMarker
                  lat={sharedResult.lat}
                  lng={sharedResult.lng}
                  result={sharedResult}
                />
              )}
              {result && (
                <DartMarker
                  lat={result.lat}
                  lng={result.lng}
                  result={result}
                  onRethrow={reset}
                />
              )}
              <DraggableCenter
                onCenterChange={() => {
                  if (isAnimating) {
                    return
                  }
                  cancelAutoReset()
                  if (state === 'done') {
                    reset()
                  }
                }}
              />
              <RadiusCircle radiusKm={radius} />
              <div className={styles.geoButtonWrapper}>
                <GeolocationButton onError={setToastMessage} />
              </div>
            </MapView>

            <FirstTimeHint />

            <div className={styles.bottomControls}>
              <div className={styles.radiusControlWrapper}>
                <RadiusControl radius={radius} onRadiusChange={setRadius} />
              </div>
              <div className={styles.dartButtonWrapper}>
                <DartButton state={state} onThrow={throwDart} />
              </div>
            </div>
          </div>
        </div>

        <HistoryPanel
          isOpen={isHistoryOpen || isDesktop}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onRemoveEntry={removeEntry}
          onClearHistory={clearHistory}
          onSelectEntry={(entry) => {
            if (map) {
              map.flyTo([entry.lat, entry.lng], 15)
              if (!isDesktop) {
                setIsHistoryOpen(false)
              }
            }
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
