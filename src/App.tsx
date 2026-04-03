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
import BottomSheet from './components/BottomSheet'
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
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
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
    const handler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handler)
    handler()
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    const { width, height } = windowSize
    if (width === 0 && height === 0) return
    const newIsDesktop = width >= 768 && !(width < 1024 && height < 600)
    
    setIsDesktop(prev => {
      if (prev !== newIsDesktop) {
        if (newIsDesktop) setIsControlExpanded(true)
        return newIsDesktop
      }
      return prev
    })
  }, [windowSize])

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
              {isDesktop ? (
                <div className={styles.controlPanel}>
                  <div className={`${styles.radiusControlWrapper} ${styles.radiusControlExpanded}`}>
                    <RadiusControl radius={radius} onRadiusChange={setRadius} />
                  </div>
                  <div className={styles.dartButtonContainer}>
                    <DartButton state={state} onThrow={throwDart} />
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.mobileActionRow}>
                    <div className={styles.dartButtonContainer}>
                      <DartButton state={state} onThrow={throwDart} />
                    </div>
                    <button
                      className={styles.settingsButton}
                      onClick={() => setIsControlExpanded(true)}
                      aria-label="設定を開く"
                      aria-expanded={isControlExpanded}
                    >
                      <span className={styles.settingsIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="4" y1="21" x2="4" y2="14"></line>
                          <line x1="4" y1="10" x2="4" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12" y2="3"></line>
                          <line x1="20" y1="21" x2="20" y2="16"></line>
                          <line x1="20" y1="12" x2="20" y2="3"></line>
                          <line x1="1" y1="14" x2="7" y2="14"></line>
                          <line x1="9" y1="8" x2="15" y2="8"></line>
                          <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                      </span>
                      <span className={styles.settingsLabel}>設定</span>
                    </button>
                  </div>
                  <BottomSheet
                    isOpen={isControlExpanded}
                    onClose={() => setIsControlExpanded(false)}
                  >
                    <RadiusControl radius={radius} onRadiusChange={setRadius} />
                  </BottomSheet>
                </>
              )}
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
