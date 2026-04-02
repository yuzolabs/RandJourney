import { useState } from 'react'

const MIN_RADIUS = 1
const MAX_RADIUS = 200
const DEFAULT_RADIUS = 50

export function useRadius() {
  const [radius, setRadiusState] = useState(DEFAULT_RADIUS)
  
  const setRadius = (value: number) => {
    setRadiusState(Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, value)))
  }
  
  return { radius, setRadius, MIN_RADIUS, MAX_RADIUS }
}
