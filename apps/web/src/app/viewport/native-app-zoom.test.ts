import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { lockNativeAppZoom } from './native-app-zoom';

const DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1.0';

const IOS_SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const ANDROID_CHROME_UA =
  'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36';

let meta: HTMLMetaElement;

beforeEach(() => {
  meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = DEFAULT_VIEWPORT;
  document.head.append(meta);
});

afterEach(() => {
  meta.remove();
});

describe('lockNativeAppZoom', () => {
  it.each([
    ['iOS 앱', `${IOS_SAFARI_UA} GravitNative/1.0`],
    ['Android 앱', `${ANDROID_CHROME_UA} GravitNative/1.0`],
  ])('%s 면 viewport 에 maximum-scale=1.0 을 더한다', (_, userAgent) => {
    lockNativeAppZoom(document, userAgent);

    expect(meta.content).toBe('width=device-width, initial-scale=1.0, maximum-scale=1.0');
  });

  it.each([
    ['iOS Safari', IOS_SAFARI_UA],
    ['Android Chrome', ANDROID_CHROME_UA],
  ])('%s 면 손가락 확대를 막지 않도록 viewport 를 바꾸지 않는다', (_, userAgent) => {
    lockNativeAppZoom(document, userAgent);

    expect(meta.content).toBe(DEFAULT_VIEWPORT);
  });
});
