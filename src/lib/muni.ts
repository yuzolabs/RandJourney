export type MuniEntry = { prefecture: string; city: string }

type MuniMap = Record<string, MuniEntry>

let cache: MuniMap | null = null

async function loadMunicipalityMap(): Promise<MuniMap> {
  if (cache) return cache
  const mod = await import('../data/muni.json')
  cache = mod.default as MuniMap
  return cache
}

export async function lookupMunicipality(muniCd: string): Promise<MuniEntry | null> {
  if (muniCd.length !== 5) return null
  const map = await loadMunicipalityMap()
  return map[muniCd] ?? null
}
