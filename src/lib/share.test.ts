import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shareToX, shareToLine, shareNative, copyToClipboard, canShareNative } from './share'
import { buildXShareUrl, buildLineShareUrl } from './urls'

describe('shareToX', () => {
  let originalOpen: typeof window.open

  beforeEach(() => {
    originalOpen = globalThis.open
    globalThis.open = vi.fn()
  })

  afterEach(() => {
    globalThis.open = originalOpen
  })

  it('window.open を正しいXのURLで呼ぶ', () => {
    const text = 'テストテキスト'
    const url = 'https://example.com'
    shareToX(text, url)
    expect(globalThis.open).toHaveBeenCalledWith(
      buildXShareUrl(text, url),
      '_blank',
      'noopener,noreferrer'
    )
  })
})

describe('shareToLine', () => {
  let originalOpen: typeof window.open

  beforeEach(() => {
    originalOpen = globalThis.open
    globalThis.open = vi.fn()
  })

  afterEach(() => {
    globalThis.open = originalOpen
  })

  it('window.open を正しいLINEのURLで呼ぶ', () => {
    const url = 'https://example.com'
    shareToLine(url)
    expect(globalThis.open).toHaveBeenCalledWith(
      buildLineShareUrl(url),
      '_blank',
      'noopener,noreferrer'
    )
  })
})

describe('shareNative', () => {
  let originalNavigator: typeof globalThis.navigator

  beforeEach(() => {
    originalNavigator = globalThis.navigator
  })

  afterEach(() => {
    globalThis.navigator = originalNavigator
  })

  it('navigator.share が呼ばれる', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(globalThis, 'navigator', {
      value: { share: shareMock },
      configurable: true,
      writable: true,
    })

    const data = { title: 'テスト', text: 'テキスト', url: 'https://example.com' }
    await shareNative(data)
    expect(shareMock).toHaveBeenCalledWith(data)
  })
})

describe('copyToClipboard', () => {
  let originalNavigator: typeof globalThis.navigator

  beforeEach(() => {
    originalNavigator = globalThis.navigator
  })

  afterEach(() => {
    globalThis.navigator = originalNavigator
  })

  it('成功時: navigator.clipboard.writeText が呼ばれ true を返す', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(globalThis, 'navigator', {
      value: { clipboard: { writeText: writeTextMock } },
      configurable: true,
      writable: true,
    })

    const result = await copyToClipboard('コピーテキスト')
    expect(writeTextMock).toHaveBeenCalledWith('コピーテキスト')
    expect(result).toBe(true)
  })

  it('失敗時: 例外を捕捉して false を返す', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('permission denied'))
    Object.defineProperty(globalThis, 'navigator', {
      value: { clipboard: { writeText: writeTextMock } },
      configurable: true,
      writable: true,
    })

    const result = await copyToClipboard('コピーテキスト')
    expect(result).toBe(false)
  })
})

describe('canShareNative', () => {
  let originalNavigator: typeof globalThis.navigator

  beforeEach(() => {
    originalNavigator = globalThis.navigator
  })

  afterEach(() => {
    globalThis.navigator = originalNavigator
  })

  it('navigator.share が存在する場合 true を返す', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { share: vi.fn() },
      configurable: true,
      writable: true,
    })

    expect(canShareNative()).toBe(true)
  })

  it('navigator.share が存在しない場合 false を返す', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      configurable: true,
      writable: true,
    })

    expect(canShareNative()).toBe(false)
  })
})
