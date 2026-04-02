import { lookupMunicipality } from './muni'

export type GeocodingResult = {
  prefecture: string
  city: string
  address: string
}

const GSI_API_BASE = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress'
const TIMEOUT_MS = 5000
const MAX_RETRIES = 3

export const _deps = {
  sleep: (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms)),
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await _deps.sleep(100 * Math.pow(2, attempt - 1))
    }
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      if (response.ok) {
        return response
      }
      if (attempt === retries) {
        return response
      }
    } catch (err) {
      clearTimeout(timeoutId)
      if (attempt === retries) {
        throw err
      }
    }
  }
  throw new Error('Unreachable')
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
  const url = `${GSI_API_BASE}?lat=${lat}&lon=${lng}`
  try {
    const response = await fetchWithRetry(url)
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { results?: { muniCd?: string; lv01Nm?: string } }
    const muniCd = data?.results?.muniCd
    const lv01Nm = data?.results?.lv01Nm
    if (!muniCd) {
      return null
    }
    const entry = await lookupMunicipality(muniCd)
    if (!entry) {
      return null
    }
    const address = lv01Nm === '\uFF0D' ? '' : (lv01Nm ?? '')
    return {
      prefecture: entry.prefecture,
      city: entry.city,
      address,
    }
  } catch {
    return null
  }
}
