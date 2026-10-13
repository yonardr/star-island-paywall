import type { Purchase } from '#shared/types/paywall'

export type HostEvent
  = | { type: 'close', reason: 'dismissed' | 'purchased' }
    | { type: 'purchase', purchase: Purchase, restored: boolean }

interface HostWindow {
  ReactNativeWebView?: { postMessage: (message: string) => void }
  webkit?: { messageHandlers?: { paywall?: { postMessage: (message: unknown) => void } } }
  PaywallBridge?: { postMessage: (message: string) => void }
}

/**
 * Tells the native shell what happened (close / purchase). Covers the common webview bridges:
 * React Native, WKWebView script message handler `paywall`, Android `addJavascriptInterface("PaywallBridge")`.
 * Inside an iframe the event goes to window.parent.
 * Returns false when there is no host at all (a regular browser tab), so the caller can react itself.
 */
export function notifyHost(event: HostEvent): boolean {
  const host = window as unknown as HostWindow
  const message = JSON.stringify(event)

  if (host.ReactNativeWebView) host.ReactNativeWebView.postMessage(message)
  else if (host.webkit?.messageHandlers?.paywall) host.webkit.messageHandlers.paywall.postMessage(event)
  else if (host.PaywallBridge) host.PaywallBridge.postMessage(message)
  else if (window.parent !== window) window.parent.postMessage(event, '*')
  else return false
  return true
}
