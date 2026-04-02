import { describe, expect, it } from 'vitest'
import {
  buildAppShareUrl,
  buildGeoUri,
  buildGoogleMapsUrl,
  buildGsiMapUrl,
  buildLineShareUrl,
  buildXShareUrl,
} from './urls'

describe('urls', () => {
  it('buildGoogleMapsUrl builds Google Maps URL', () => {
    expect(buildGoogleMapsUrl(35.6812, 139.7671)).toBe('https://www.google.com/maps?q=35.6812,139.7671')
  })

  it('buildGsiMapUrl builds GSI map URL with zoom', () => {
    expect(buildGsiMapUrl(35.6812, 139.7671, 15)).toBe('https://maps.gsi.go.jp/#15/35.6812/139.7671/')
  })

  it('buildGsiMapUrl uses default zoom', () => {
    expect(buildGsiMapUrl(35.6812, 139.7671)).toBe('https://maps.gsi.go.jp/#15/35.6812/139.7671/')
  })

  it('buildGeoUri builds geo URI', () => {
    expect(buildGeoUri(35.6812, 139.7671)).toBe('geo:35.6812,139.7671')
  })

  it('buildXShareUrl encodes text and url', () => {
    expect(buildXShareUrl('テスト テキスト', 'https://example.com')).toBe(
      'https://x.com/intent/tweet?text=%E3%83%86%E3%82%B9%E3%83%88%20%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88&url=https%3A%2F%2Fexample.com',
    )
  })

  it('buildLineShareUrl encodes url', () => {
    expect(buildLineShareUrl('https://example.com/test')).toBe(
      'https://social-plugins.line.me/lineit/share?url=https%3A%2F%2Fexample.com%2Ftest',
    )
  })

  it('buildAppShareUrl builds app share URL', () => {
    expect(buildAppShareUrl(35.6812, 139.7671)).toBe('?ll=35.6812,139.7671')
  })

  it('coordinates are rounded to 6 digits', () => {
    expect(buildGoogleMapsUrl(35.681234567, 139.767123456)).toBe('https://www.google.com/maps?q=35.681235,139.767123')
  })

  it('special characters are encoded', () => {
    expect(buildXShareUrl('Hello & World', 'url')).toBe('https://x.com/intent/tweet?text=Hello%20%26%20World&url=url')
  })

  it('all builders return strings', () => {
    expect(typeof buildGoogleMapsUrl(35.6812, 139.7671)).toBe('string')
    expect(typeof buildGsiMapUrl(35.6812, 139.7671)).toBe('string')
    expect(typeof buildGeoUri(35.6812, 139.7671)).toBe('string')
    expect(typeof buildXShareUrl('a', 'b')).toBe('string')
    expect(typeof buildLineShareUrl('b')).toBe('string')
    expect(typeof buildAppShareUrl(35.6812, 139.7671)).toBe('string')
  })
})
