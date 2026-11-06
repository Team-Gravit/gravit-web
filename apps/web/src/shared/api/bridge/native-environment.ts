import { isNativeUserAgent } from '@repo/bridge-protocol';

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage(message: string): void };
  }
}

/** UA 마커만 확인한다. 실제 전송 객체의 유무는 `requestNative`에서 확인한다. */
export function isNativeApp(): boolean {
  return isNativeUserAgent(navigator.userAgent);
}
