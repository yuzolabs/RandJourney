import { ChangeEvent } from 'react'
import styles from './RadiusControl.module.css'

interface RadiusControlProps {
  radius: number
  onRadiusChange: (v: number) => void
}

export default function RadiusControl({ radius, onRadiusChange }: RadiusControlProps) {
  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    onRadiusChange(parseInt(e.target.value, 10))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      onRadiusChange(value)
    }
  }

  return (
    <div className={styles.container} data-testid="radius-control">
      <div className={styles.header}>
        <input
          type="number"
          className={styles.numberInput}
          min={1}
          max={200}
          value={radius}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
        <span className={styles.label}>km</span>
      </div>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          className={styles.slider}
          min={1}
          max={200}
          step={1}
          value={radius}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  )
}
