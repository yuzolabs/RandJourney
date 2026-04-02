import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { DartResult } from './useDartThrow'
import { useHistory } from './useHistory'

if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value },
      removeItem: (key: string) => { delete store[key] },
      clear: () => { Object.keys(store).forEach((k) => { delete store[k] }) },
    },
    writable: true,
  })
}

const mockDartResult: DartResult = {
  lat: 35.6812,
  lng: 139.7671,
  prefecture: '東京都',
  city: '千代田区',
  address: '東京都千代田区1-1',
  centerLat: 35.68,
  centerLng: 139.76,
  radiusKm: 10,
}

const mockDartResult2: DartResult = {
  lat: 34.6937,
  lng: 135.5023,
  prefecture: '大阪府',
  city: '大阪市',
  address: '大阪府大阪市1-1',
  centerLat: 34.69,
  centerLng: 135.50,
  radiusKm: 10,
}

const STORAGE_KEY = 'randjourney-history'

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('addEntry → history に追加される', () => {
    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toHaveLength(0)

    act(() => {
      result.current.addEntry(mockDartResult)
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].lat).toBe(35.6812)
    expect(result.current.history[0].lng).toBe(139.7671)
    expect(result.current.history[0].prefecture).toBe('東京都')
    expect(result.current.history[0].city).toBe('千代田区')
    expect(result.current.history[0].address).toBe('東京都千代田区1-1')
    expect(result.current.history[0].id).toBeTruthy()
    expect(result.current.history[0].timestamp).toBeTruthy()
  })

  it('removeEntry → 対象が削除される', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addEntry(mockDartResult)
      result.current.addEntry(mockDartResult2)
    })

    expect(result.current.history).toHaveLength(2)

    const idToRemove = result.current.history[0].id

    act(() => {
      result.current.removeEntry(idToRemove)
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history.find((e: { id: string }) => e.id === idToRemove)).toBeUndefined()
  })

  it('clearHistory → 全削除される', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addEntry(mockDartResult)
      result.current.addEntry(mockDartResult2)
    })

    expect(result.current.history).toHaveLength(2)

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.history).toHaveLength(0)
  })

  it('初期化時に localStorage から復元される', () => {
    const existingEntries = [
      {
        id: 'test-id-1',
        lat: 35.6812,
        lng: 139.7671,
        prefecture: '東京都',
        city: '千代田区',
        address: '東京都千代田区1-1',
        timestamp: Date.now(),
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries))

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].id).toBe('test-id-1')
    expect(result.current.history[0].prefecture).toBe('東京都')
  })

  it('localStorage が破損（invalid JSON）の場合 → 空配列で初期化（エラーなし）', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{{')

    expect(() => {
      renderHook(() => useHistory())
    }).not.toThrow()

    const { result } = renderHook(() => useHistory())
    expect(result.current.history).toHaveLength(0)
  })

  it('最大50件を超えると古いものが削除される', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      for (let i = 0; i < 51; i++) {
        result.current.addEntry({
          ...mockDartResult,
          lat: i,
        })
      }
    })

    expect(result.current.history).toHaveLength(50)
    expect(result.current.history.find((e: { lat: number }) => e.lat === 0)).toBeUndefined()
    expect(result.current.history.find((e: { lat: number }) => e.lat === 50)).toBeDefined()
  })

  it('history 変更時に localStorage に保存される', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addEntry(mockDartResult)
    })

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].prefecture).toBe('東京都')
  })
})
