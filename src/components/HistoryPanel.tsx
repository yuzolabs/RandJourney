import type { HistoryEntry } from '../hooks/useHistory'
import styles from './HistoryPanel.module.css'

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  onSelectEntry: (entry: HistoryEntry) => void
  history: HistoryEntry[]
  onRemoveEntry: (id: string) => void
  onClearHistory: () => void
}

export function HistoryPanel({ isOpen, onClose, onSelectEntry, history, onRemoveEntry, onClearHistory }: HistoryPanelProps) {

  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp)

  function handleSelectEntry(entry: HistoryEntry) {
    onSelectEntry(entry)
  }

  return (
    <aside
      className={`${styles.panel} ${isOpen ? styles.open : ''}`}
      aria-label="ダーツ履歴"
      aria-hidden={!isOpen}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>履歴</h2>
        <div className={styles.headerActions}>
          {history.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={onClearHistory}
            >
              すべて削除
            </button>
          )}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {sortedHistory.length === 0 ? (
          <p className={styles.emptyMessage}>まだダーツを投げていません 🎯</p>
        ) : (
          <ul className={styles.list}>
            {sortedHistory.map((entry, index) => {
              const placeName =
                entry.prefecture || entry.city
                  ? [entry.prefecture, entry.city].filter(Boolean).join(' ')
                  : '不明な地点'
              const dateString = new Date(entry.timestamp).toLocaleString('ja-JP')

              return (
                <li key={entry.id} className={styles.item}>
                  <button
                    type="button"
                    className={styles.itemButton}
                    onClick={() => handleSelectEntry(entry)}
                  >
                    <span className={styles.placeName}>{placeName}</span>
                    <span className={styles.timestamp}>{dateString}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onRemoveEntry(entry.id)}
                    aria-label={`${placeName}を削除`}
                    data-testid={`history-delete-${index}`}
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
