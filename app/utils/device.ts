const STORAGE_KEY = 'star-island:device-id'

export function randomId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  // randomUUID needs a secure context; webviews loading over plain http fall back to an RFC 4122 v4 by hand
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/**
 * Device identifier the purchase is bound to.
 * The host app can pass its own id via `?deviceId=`; otherwise the page creates one and keeps it in localStorage.
 */
export function getDeviceId(): string {
  const fromHost = new URLSearchParams(window.location.search).get('deviceId')
  if (fromHost) return fromHost

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return stored
  }
  catch {
    // storage can be disabled inside a webview — a per-session id is still fine for a test purchase
  }

  const id = randomId()
  try {
    localStorage.setItem(STORAGE_KEY, id)
  }
  catch {}
  return id
}
