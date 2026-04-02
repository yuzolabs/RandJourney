# Hooks Agent Instructions

## OVERVIEW

Core React 19 hooks for state management, geo-logic, and URL synchronization.

## STRUCTURE

- `useDartThrow.ts`: Animation and generation logic for random points.
- `useHistory.ts`: Management of generated points history.
- `useRadius.ts`: Radius state for point generation.
- `useUrlSharing.ts`: Parameter synchronization with browser URL.

## WHERE TO LOOK

- Point Generation: `useDartThrow.ts` for the main "dart" throwing logic.
- Persistence: `useUrlSharing.ts` and `useHistory.ts` for state retention.
- Tests: `*.test.ts` files co-located with their respective hooks.

## CONVENTIONS

- Exports: Always use named exports (`export function useHookName`).
- Naming: Standard React `use*` prefix.
- Tests: Every hook should have a corresponding `*.test.ts` file in this directory.
- Dependencies: Hooks leverage utilities from `src/lib/` for geo-calculations.
