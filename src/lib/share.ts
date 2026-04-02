import { buildXShareUrl, buildLineShareUrl } from './urls'

export function shareToX(text: string, url: string): void {
  globalThis.open(buildXShareUrl(text, url), '_blank', 'noopener,noreferrer')
}

export function shareToLine(url: string): void {
  globalThis.open(buildLineShareUrl(url), '_blank', 'noopener,noreferrer')
}

export async function shareNative(data: ShareData): Promise<void> {
  await navigator.share(data)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function canShareNative(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}
