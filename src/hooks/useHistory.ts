import { useCallback, useState } from 'react'
import type { DartResult } from './useDartThrow'

export interface HistoryEntry {
  id: string
  lat: number
  lng: number
  prefecture: string
  city: string
  address: string
  timestamp: number
}

const STORAGE_KEY = 'randjourney-history'
const MAX_HISTORY = 50

function createHistoryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${String(Math.random()).slice(2)}`
}

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? '[]'
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function useHistory(): {
  history: HistoryEntry[]
  addEntry: (result: DartResult) => void
  removeEntry: (id: string) => void
  clearHistory: () => void
} {
  const [history, setHistory] = useState<HistoryEntry[]>(loadFromStorage)

  const addEntry = useCallback((result: DartResult) => {
    const entry: HistoryEntry = {
      id: createHistoryId(),
      lat: result.lat,
      lng: result.lng,
      prefecture: result.prefecture,
      city: result.city,
      address: result.address,
      timestamp: Date.now(),
    }
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    setHistory([])
  }, [])

  return { history, addEntry, removeEntry, clearHistory }
}

