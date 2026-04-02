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

  const presets = [1, 5, 10, 25, 50, 100, 200]

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
      <div className={styles.presetsContainer}>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`${styles.presetChip} ${radius === preset ? styles.presetChipActive : ''}`}
            onClick={() => onRadiusChange(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  )
}
