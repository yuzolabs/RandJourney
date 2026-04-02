import { useState, useEffect } from 'react'
import styles from './FirstTimeHint.module.css'

export default function FirstTimeHint() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenMapHint')
    if (!hasSeenHint) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        localStorage.setItem('hasSeenMapHint', 'true')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className={styles.hintOverlay} onClick={() => {
      setIsVisible(false)
      localStorage.setItem('hasSeenMapHint', 'true')
    }}>
      <div className={styles.hintContent}>
        <p>👆 ドラッグで中心を移動できます</p>
        <p>🗺️ 地図をタップして中心を設定</p>
      </div>
    </div>
  )
}
