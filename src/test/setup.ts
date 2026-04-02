import '@testing-library/jest-dom'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' })
const { window } = dom

globalThis.window = window as unknown as Window & typeof globalThis.window
globalThis.document = window.document
globalThis.navigator = window.navigator

for (const key of Object.getOwnPropertyNames(window)) {
  if (key in globalThis) continue
  const descriptor = Object.getOwnPropertyDescriptor(window, key)
  if (descriptor) Object.defineProperty(globalThis, key, descriptor)
}
