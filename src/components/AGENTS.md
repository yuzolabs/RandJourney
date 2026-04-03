# Components Agent Instructions

## OVERVIEW

UI components for RandJourney using React + CSS Modules + Leaflet.

## STRUCTURE

- `src/components/`: 15 functional components with co-located styles.
- Pattern: `[Name].tsx` paired with `[Name].module.css`.

## COMPONENTS LIST

1. **CenterCross**: Map center indicator.
2. **DartButton**: Trigger for random point generation.
3. **DartMarker**: Leaflet marker for the generated point.
4. **DraggableCenter**: Logic for dragging the map center.
5. **ErrorBoundary**: Global React error boundary.
6. **FirstTimeHint**: UI guide for new users.
7. **GeolocationButton**: Center map on user location.
8. **HistoryPanel**: List of previous generation results.
9. **MapView**: Core Leaflet map container.
10. **RadiusCircle**: Visual representation of the search radius.
11. **RadiusControl**: Slider/input for adjusting radius.
12. **ResultCard**: Detailed info for the generated point.
13. **ResultPopup**: Leaflet popup attached to DartMarker.
14. **ShareButtons**: Social sharing and URL copy actions.
15. **Toast**: Notification system for app events.

## WHERE TO LOOK

- Core UI: `MapView.tsx`, `CenterCross.tsx`.
- Controls: `DartButton.tsx`, `RadiusControl.tsx`.
- Feedback: `ResultCard.tsx`, `Toast.tsx`.

## CONVENTIONS

- **Imports**: `import styles from './[Name].module.css';`.
- **Styling**: Class names via `styles.className`. No global selectors.
- **Variables**: Use tokens from `src/styles/tokens.css` via `var(--token-name)`.
- **Leaflet**: Use `react-leaflet` hooks (`useMap`, etc.) within components.
- **Exports**: Named exports preferred for consistency.

## ANTI-PATTERNS

- Do not define styles in TSX files.
- Avoid passing raw Leaflet map instances; use the `useMap` hook.
