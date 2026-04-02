import { useCallback, useState } from 'react'
import { canShareNative, copyToClipboard, shareNative, shareToX } from '../lib/share'
import styles from './ShareButtons.module.css'

interface ShareButtonsProps {
  text: string
  url: string
}

const extractLocationName = (text: string): string => {
  if (text === '（不明な地点）') return 'この場所'

  return text.replace(/\s+/g, '')
}

export default function ShareButtons({ text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  const handleNativeShare = useCallback(async () => {
    await shareNative({ title: text, url })
  }, [text, url])

  return (
    <div className={styles.shareButtons}>
      <button
        type="button"
        className={styles.shareButton}
        onClick={() => {
          const locationName = extractLocationName(text)
          const shareText = `あなたは${locationName}にいってらっしゃーい\n`
          shareToX(shareText, url)
        }}
        aria-label="Xで共有"
      >
        <span className={styles.shareIcon}>𝕏</span>
        <span className={styles.shareLabel}>Xで共有</span>
      </button>

      <button
        type="button"
        className={`${styles.shareButton} ${copied ? styles.copied : ''}`}
        onClick={handleCopy}
        aria-label="URLをコピー"
      >
        <span className={styles.shareIcon}>{copied ? '✓' : '📋'}</span>
        <span className={styles.shareLabel}>{copied ? 'コピーしました' : 'URLをコピー'}</span>
      </button>

      {canShareNative() && (
        <button
          type="button"
          className={styles.shareButton}
          onClick={handleNativeShare}
          aria-label="共有"
        >
          <span className={styles.shareIcon}>📤</span>
          <span className={styles.shareLabel}>共有</span>
        </button>
      )}
    </div>
  )
}
