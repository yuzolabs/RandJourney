# AGENTS.md (lib)

## OVERVIEW

Core utility modules for geodesic math, geocoding, and data handling.

## STRUCTURE

- `geo.ts`: Geodesic calculations (destinationPoint, haversineDistance).
- `geocoding.ts`: Reverse geocoding logic and API integration.
- `muni.ts`: Municipality data loader for `muni.json`.
- `random-point.ts`: Logic for generating random coordinates.
- `share.ts`: Web Share API and clipboard integration.
- `urls.ts`: External map service URL builders (Google Maps, GSI).

## WHERE TO LOOK

- Geodesy: `geo.ts` is the source of truth for distance/bearing math.
- Data Loading: `muni.ts` handles the mapping of code to municipality names.
- Testing: All logic is verified in co-located `*.test.ts` files.

## CONVENTIONS

- Pure Functions: Maintain idempotency; avoid side effects in `geo`, `random-point`, and `urls`.
- Named Exports: Do not use default exports.
- Co-location: Tests (`*.test.ts`) must stay in the same directory as source.
- Dependencies: Keep external library usage minimal (e.g., native fetch for `geocoding.ts`).
