import styles from './DartButton.module.css'
import type { DartState } from '../hooks/useDartThrow'

interface DartButtonProps {
  state: DartState
  onThrow: () => void
}

export default function DartButton({ state, onThrow }: DartButtonProps) {
  const isLoading = state === 'throwing'

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onThrow}
      disabled={isLoading}
      data-testid="dart-button"
      aria-label="ダーツを投げる"
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <>
          <span className={styles.icon} aria-hidden="true">🎯</span>
          <span className={styles.label}>ダーツを投げる</span>
        </>
      )}
    </button>
  )
}
