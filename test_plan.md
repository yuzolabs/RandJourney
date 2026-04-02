1. DartButton.tsx:
- Use `useEffect` to dispatch custom event `dart-throw-state` with detail `state`
- Render depending on `state` ('idle', 'throwing', 'done', 'error')
- Add dice rotation CSS in `DartButton.module.css`

2. RadiusCircle.tsx:
- Listen to `dart-throw-state` on window to set local `isThrowing` state
- Apply CSS class to Leaflet Circle `pathOptions={{ className: isThrowing ? styles.roulette : '' }}`
- Create `RadiusCircle.module.css` with roulette animation
