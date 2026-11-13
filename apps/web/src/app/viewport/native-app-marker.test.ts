import { afterEach, describe, expect, it } from 'vitest';

import { markNativeApp } from './native-app-marker';

const IOS_SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

afterEach(() => {
  delete document.documentElement.dataset.nativeApp;
});

describe('markNativeApp', () => {
  it('앱 UA 면 html 에 data-native-app 을 단다', () => {
    markNativeApp(document, `${IOS_SAFARI_UA} GravitNative/1.0.0`);

    expect(document.documentElement).toHaveAttribute('data-native-app');
  });

  it('브라우저 UA 면 표시를 달지 않는다', () => {
    markNativeApp(document, IOS_SAFARI_UA);

    expect(document.documentElement).not.toHaveAttribute('data-native-app');
  });
});
