await import('../test/setup')

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type L from 'leaflet'
import { getShareUrl, parseUrlParams, useUrlSharing } from './useUrlSharing'

describe('parseUrlParams', () => {
  it('valid query を座標に変換する', () => {
    expect(parseUrlParams('?ll=35.6812,139.7671')).toEqual({ lat: 35.6812, lng: 139.7671 })
  })

  it('無効な値は null を返す', () => {
    expect(parseUrlParams('?ll=invalid')).toBeNull()
  })

  it('空文字列は null を返す', () => {
    expect(parseUrlParams('')).toBeNull()
  })

  it('他のパラメータがあっても ll を解析する', () => {
    expect(parseUrlParams('?ll=35.6812,139.7671&other=param')).toEqual({ lat: 35.6812, lng: 139.7671 })
  })

  it('緯度範囲外は null を返す', () => {
    expect(parseUrlParams('?ll=91,0')).toBeNull()
  })
})

describe('getShareUrl', () => {
  it('origin と pathname を含む共有URLを返す', () => {
    const originalPath = window.location.pathname + window.location.search + window.location.hash
    expect(getShareUrl(35.6812, 139.7671)).toBe('http://localhost/?ll=35.681200,139.767100')
    window.history.pushState({}, '', originalPath)
  })
})

describe('useUrlSharing', () => {
  let originalPath: string

  beforeEach(() => {
    originalPath = window.location.pathname + window.location.search + window.location.hash
  })

  afterEach(() => {
    window.history.pushState({}, '', originalPath)
  })

  it('mount 時に map.flyTo を呼ぶ', () => {
    window.history.pushState({}, '', '/?ll=35.6812,139.7671')

    const flyTo = vi.fn()
    const map = { flyTo } as unknown as L.Map

    renderHook(() => useUrlSharing(map))

    expect(flyTo).toHaveBeenCalledWith([35.6812, 139.7671], 15)
  })

  it('map が null なら何もしない', () => {
    window.history.pushState({}, '', '/?ll=35.6812,139.7671')

    expect(() => renderHook(() => useUrlSharing(null))).not.toThrow()
  })
})
