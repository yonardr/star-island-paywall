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
 * Opened in a regular browser, the event just goes to window.parent (useful when embedded in an iframe).
 */
export function notifyHost(event: HostEvent): void {
  const host = window as unknown as HostWindow
  const message = JSON.stringify(event)

  if (host.ReactNativeWebView) host.ReactNativeWebView.postMessage(message)
  else if (host.webkit?.messageHandlers?.paywall) host.webkit.messageHandlers.paywall.postMessage(event)
  else if (host.PaywallBridge) host.PaywallBridge.postMessage(message)
  else if (window.parent !== window) window.parent.postMessage(event, '*')
}
