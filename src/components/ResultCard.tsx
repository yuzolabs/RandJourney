import { useEffect, useState } from 'react'
import type { DartResult } from '../hooks/useDartThrow'
import styles from './ResultCard.module.css'

interface ResultCardProps {
  result: DartResult | null
  onClose?: () => void
}

export default function ResultCard({ result, onClose }: ResultCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (result) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [result, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible || !result) return null

  const isUnknown = result.prefecture === '' && result.city === ''

  return (
    <div className={styles.cardContainer}>
      <div className={styles.content}>
        <div className={styles.icon}>🎯</div>
        <div className={styles.textDetails}>
          {isUnknown ? (
            <h3 className={styles.title}>（不明な地点）</h3>
          ) : (
            <>
              <h3 className={styles.title}>{`${result.prefecture} ${result.city}`}</h3>
              {result.address && <p className={styles.address}>{result.address}</p>}
            </>
          )}
        </div>
        <button className={styles.closeButton} onClick={handleClose} aria-label="閉じる">
          ✕
        </button>
      </div>
    </div>
  )
}
