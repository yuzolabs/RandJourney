import { useEffect } from 'react'
import styles from './DartButton.module.css'
import type { DartState } from '../hooks/useDartThrow'

interface DartButtonProps {
  state: DartState
  onThrow: () => void
}

export default function DartButton({ state, onThrow }: DartButtonProps) {
  const isLoading = state === 'throwing'
  const isDone = state === 'done'

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const event = new CustomEvent('dart-throw-state', { detail: state })
      window.dispatchEvent(event)
    } catch {
    }
  }, [state])

  return (
    <button
      type="button"
      className={`${styles.button} ${isLoading ? styles.throwing : ''} ${isDone ? styles.done : ''}`}
      onClick={onThrow}
      disabled={isLoading}
      data-testid="dart-button"
      aria-label="ダーツを投げる"
    >
      {isLoading ? (
        <>
          <span className={`${styles.icon} ${styles.dice}`} aria-hidden="true">🎲</span>
          <span className={styles.label}>抽選中...</span>
        </>
      ) : isDone ? (
        <>
          <span className={`${styles.icon} ${styles.success}`} aria-hidden="true">🎯</span>
          <span className={styles.label}>到着！</span>
        </>
      ) : (
        <>
          <span className={styles.icon} aria-hidden="true">🎯</span>
          <span className={styles.label}>ダーツを投げる</span>
        </>
      )}
    </button>
  )
}
