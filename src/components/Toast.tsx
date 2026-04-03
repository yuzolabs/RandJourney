import { useEffect, useRef } from 'react'
import styles from './Toast.module.css'

export interface ToastProps {
  message: string | null
  onDismiss: () => void
}

const TOAST_DURATION_MS = 3000

export default function Toast({ message, onDismiss }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!message) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      onDismiss()
    }, TOAST_DURATION_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      className={styles.toast}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.dismissButton}
        onClick={onDismiss}
        aria-label="通知を閉じる"
      >
        ✕
      </button>
    </div>
  )
}
