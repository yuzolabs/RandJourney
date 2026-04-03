const DEFAULT_GSI_ZOOM = 15

function formatCoord(coord: number): string {
  return String(parseFloat(coord.toFixed(6)))
}

export function buildGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${formatCoord(lat)},${formatCoord(lng)}`
}

export function buildGsiMapUrl(lat: number, lng: number, zoom: number = DEFAULT_GSI_ZOOM): string {
  return `https://maps.gsi.go.jp/#${zoom}/${formatCoord(lat)}/${formatCoord(lng)}/`
}

export function buildGeoUri(lat: number, lng: number): string {
  return `geo:${formatCoord(lat)},${formatCoord(lng)}`
}

export function buildXShareUrl(text: string, url: string): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

export function buildLineShareUrl(url: string): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
}

export function buildAppShareUrl(lat: number, lng: number): string {
  return `?ll=${formatCoord(lat)},${formatCoord(lng)}`
}
