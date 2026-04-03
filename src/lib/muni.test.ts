import { describe, expect, it } from 'vitest'
import { lookupMunicipality } from './muni'

describe('lookupMunicipality', () => {
  it('01101 で札幌市中央区を返す', async () => {
    expect(await lookupMunicipality('01101')).toEqual({ prefecture: '北海道', city: '札幌市中央区' })
  })

  it('13101 で千代田区を返す', async () => {
    expect(await lookupMunicipality('13101')).toEqual({ prefecture: '東京都', city: '千代田区' })
  })

  it('存在しないコードは null', async () => {
    expect(await lookupMunicipality('99999')).toBeNull()
  })

  it('空文字列は null', async () => {
    expect(await lookupMunicipality('')).toBeNull()
  })

  it('前ゼロ欠落の 1101 は null', async () => {
    expect(await lookupMunicipality('1101')).toBeNull()
  })
})
