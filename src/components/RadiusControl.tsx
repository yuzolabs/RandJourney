import React, { ChangeEvent } from 'react'
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

  const min = 1
  const max = 200
  const percentage = ((radius - min) / (max - min)) * 100

  return (
    <div className={styles.container} data-testid="radius-control">
      <div className={styles.header}>
        <input
          type="number"
          className={styles.numberInput}
          min={min}
          max={max}
          value={radius}
          onChange={handleInputChange}
          onBlur={handleInputChange}
          aria-label="距離（km）を入力"
        />
        <span className={styles.label}>km</span>
      </div>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          step={1}
          value={radius}
          onChange={handleSliderChange}
          aria-label="距離を選択"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={radius}
          style={{ '--progress': `${percentage}%` } as React.CSSProperties}
        />
      </div>
      <div className={styles.presetsContainer}>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`${styles.presetChip} ${radius === preset ? styles.presetChipActive : ''}`}
            onClick={() => onRadiusChange(preset)}
            aria-label={`${preset}キロメートル`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  )
}
