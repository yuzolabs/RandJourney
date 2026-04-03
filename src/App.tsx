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
  const { state, result, isAnimating, throwDart, rethrowDart, reset, cancelAutoReset } = useDartThrow({ map, radiusKm: radius })
  const { history, addEntry, removeEntry, clearHistory } = useHistory()
  const sharedLocation = useUrlSharing(map)

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isControlExpanded, setIsControlExpanded] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [displayResult, setDisplayResult] = useState<
    | {
        lat: number
        lng: number
        prefecture: string
        city: string
        address: string
        centerLat: number
        centerLng: number
        radiusKm: number
      }
    | undefined
  >(undefined)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mql.matches)
    if (mql.matches) setIsControlExpanded(true)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      if (e.matches) setIsControlExpanded(true)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const lastHistoryLengthRef = useRef(0)
  useEffect(() => {
    if (isDesktop && history.length > lastHistoryLengthRef.current) {
      setIsHistoryOpen(true)
    }
    lastHistoryLengthRef.current = history.length
  }, [history.length, isDesktop])

  const lastResultRef = useRef(result)
  useEffect(() => {
    if (result && result !== lastResultRef.current) {
      addEntry(result)
      lastResultRef.current = result
      if (!isDesktop) {
        setIsControlExpanded(false)
      }
    }
  }, [result, addEntry, isDesktop])

  useEffect(() => {
    if (!sharedLocation) {
      setDisplayResult(undefined)
      return
    }

    reverseGeocode(sharedLocation.lat, sharedLocation.lng).then((geo) => {
      if (geo) {
        setDisplayResult({
          lat: sharedLocation.lat,
          lng: sharedLocation.lng,
          prefecture: geo.prefecture,
          city: geo.city,
          address: geo.address,
          centerLat: 0,
          centerLng: 0,
          radiusKm: 0,
        })
      } else {
        setDisplayResult({
          lat: sharedLocation.lat,
          lng: sharedLocation.lng,
          prefecture: '',
          city: '',
          address: '',
          centerLat: 0,
          centerLng: 0,
          radiusKm: 0,
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
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              aria-label={isHistoryOpen ? "履歴を閉じる" : "履歴を開く"}
              aria-expanded={isHistoryOpen}
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
              {displayResult && (
                <DartMarker
                  lat={displayResult.lat}
                  lng={displayResult.lng}
                  result={displayResult}
                />
              )}
              {result && (
                <DartMarker
                  lat={result.lat}
                  lng={result.lng}
                  result={result}
                  onRethrow={rethrowDart}
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

            <div
              className={`${styles.bottomControls} ${isHistoryOpen && isDesktop ? styles.bottomControlsWithHistory : ''}`}
            >
              <div className={styles.controlPanel}>
                {!isDesktop && (
                  <button
                    className={styles.controlToggle}
                    onClick={() => setIsControlExpanded((v) => !v)}
                    aria-label={isControlExpanded ? "設定を閉じる" : "設定を開く"}
                    aria-expanded={isControlExpanded}
                  >
                    <span className={`${styles.controlToggleIcon} ${isControlExpanded ? styles.controlToggleIconExpanded : ''}`}>⚙️</span>
                  </button>
                )}
                <div
                  className={`${styles.radiusControlWrapper} ${isControlExpanded || isDesktop ? styles.radiusControlExpanded : styles.radiusControlCollapsed}`}
                >
                  <RadiusControl radius={radius} onRadiusChange={setRadius} />
                </div>
                <div className={styles.dartButtonContainer}>
                  <DartButton state={state} onThrow={throwDart} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <HistoryPanel
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onRemoveEntry={removeEntry}
          onClearHistory={clearHistory}
          onSelectEntry={(entry) => {
            if (map) {
              map.flyTo([entry.lat, entry.lng], 15)
              setDisplayResult({
                lat: entry.lat,
                lng: entry.lng,
                prefecture: entry.prefecture,
                city: entry.city,
                address: entry.address,
                centerLat: 0,
                centerLng: 0,
                radiusKm: 0,
              })
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
