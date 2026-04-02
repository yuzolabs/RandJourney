import { afterEach, describe, expect, it, vi } from 'vitest'
import * as geocodingModule from './geocoding'

const GSI_API_BASE = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress'

function makeMockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

describe('reverseGeocode', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('正常レスポンス: muniCd "13101", lv01Nm "千代田区" → 正しいGeocodingResultを返す', async () => {
    vi.spyOn(geocodingModule._deps, 'sleep').mockResolvedValue()
    globalThis.fetch = vi.fn().mockResolvedValueOnce(
      makeMockResponse({ results: { muniCd: '13101', lv01Nm: '千代田区' } })
    ) as unknown as typeof fetch

    const result = await geocodingModule.reverseGeocode(35.6895, 139.6917)

    expect(result).toEqual({
      prefecture: '東京都',
      city: '千代田区',
      address: '千代田区',
    })
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${GSI_API_BASE}?lat=35.6895&lon=139.6917`),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
  })

  it('lv01Nm が "－"（U+FF0D）の場合 → address が "" として処理される', async () => {
    vi.spyOn(geocodingModule._deps, 'sleep').mockResolvedValue()
    globalThis.fetch = vi.fn().mockResolvedValueOnce(
      makeMockResponse({ results: { muniCd: '13101', lv01Nm: '\uFF0D' } })
    ) as unknown as typeof fetch

    const result = await geocodingModule.reverseGeocode(35.6895, 139.6917)

    expect(result).toEqual({
      prefecture: '東京都',
      city: '千代田区',
      address: '',
    })
  })

  it('muniCd が不明（"99999"）→ null を返す', async () => {
    vi.spyOn(geocodingModule._deps, 'sleep').mockResolvedValue()
    globalThis.fetch = vi.fn().mockResolvedValueOnce(
      makeMockResponse({ results: { muniCd: '99999', lv01Nm: '不明' } })
    ) as unknown as typeof fetch

    const result = await geocodingModule.reverseGeocode(0, 0)

    expect(result).toBeNull()
  })

  it('APIエラー（500）→ 3回リトライ後に null を返す（fetchが4回呼ばれる）', async () => {
    vi.spyOn(geocodingModule._deps, 'sleep').mockResolvedValue()
    globalThis.fetch = vi.fn().mockResolvedValue(makeMockResponse({}, 500)) as unknown as typeof fetch

    const result = await geocodingModule.reverseGeocode(35.6895, 139.6917)

    expect(result).toBeNull()
    expect(globalThis.fetch).toHaveBeenCalledTimes(4)
  })

  it('ネットワークエラー（fetchがreject）→ リトライ後に null を返す', async () => {
    vi.spyOn(geocodingModule._deps, 'sleep').mockResolvedValue()
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error')) as unknown as typeof fetch

    const result = await geocodingModule.reverseGeocode(35.6895, 139.6917)

    expect(result).toBeNull()
    expect(globalThis.fetch).toHaveBeenCalledTimes(4)
  })

  it('指数バックオフ: sleep が 100ms, 200ms, 400ms の順で呼ばれる', async () => {
    const sleepSpy = vi.spyOn(geocodingModule._deps, 'sleep').mockResolvedValue()
    globalThis.fetch = vi.fn().mockResolvedValue(makeMockResponse({}, 503)) as unknown as typeof fetch

    await geocodingModule.reverseGeocode(35.6895, 139.6917)

    expect(sleepSpy).toHaveBeenCalledTimes(3)
    expect(sleepSpy).toHaveBeenNthCalledWith(1, 100)
    expect(sleepSpy).toHaveBeenNthCalledWith(2, 200)
    expect(sleepSpy).toHaveBeenNthCalledWith(3, 400)
  })
})
