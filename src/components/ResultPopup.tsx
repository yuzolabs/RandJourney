import { Popup } from 'react-leaflet'
import type { DartResult } from '../hooks/useDartThrow'
import { getShareUrl } from '../hooks/useUrlSharing'
import { buildGoogleMapsUrl, buildGeoUri } from '../lib/urls'
import ShareButtons from './ShareButtons'
import styles from './ResultPopup.module.css'

interface ResultPopupProps {
  result: DartResult
  onRethrow?: () => void
}

export default function ResultPopup({ result, onRethrow }: ResultPopupProps) {
  const isUnknown = result.prefecture === '' && result.city === ''

  return (
    <Popup minWidth={240} maxWidth={320} offset={[0, -16]}>
      <div className={styles.popupContainer}>
        <div className={styles.header}>
          {isUnknown ? (
            <h2 className={styles.title}>（不明な地点）</h2>
          ) : (
            <>
              <h2 className={styles.title}>{`${result.prefecture} ${result.city}`}</h2>
              {result.address && <p className={styles.address}>{result.address}</p>}
            </>
          )}
        </div>

        <hr className={styles.divider} />

        <div className={styles.links}>
          <a
            href={buildGoogleMapsUrl(result.lat, result.lng)}
            target="_blank"
            rel="noreferrer"
            className={styles.linkButton}
          >
            🗺️ Googleマップで開く
          </a>
          <a href={buildGeoUri(result.lat, result.lng)} className={styles.linkButton}>
            📱 この場所を開く
          </a>
        </div>

        {isUnknown && onRethrow && (
          <>
            <hr className={styles.divider} />
            <button onClick={onRethrow} className={styles.rethrowButton}>
              🔄 もう一度投げる
            </button>
          </>
        )}

        <hr className={styles.divider} />

        <div className={styles.shareSection}>
          <ShareButtons
            text={isUnknown ? '（不明な地点）' : `${result.prefecture} ${result.city}`}
            url={getShareUrl(result.lat, result.lng)}
          />
        </div>
      </div>
    </Popup>
  )
}
