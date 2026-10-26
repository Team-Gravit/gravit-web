import { afterEach, describe, expect, it } from 'vitest';

import type { router as appRouter } from '../router/router';
import { resolveBrowserTopColor, syncBrowserTopColor } from './browser-top-color';

type BrowserTopColorData = { browserTopColor?: string | null };

function createMatches(...staticData: BrowserTopColorData[]) {
  return staticData.map((data) => ({ staticData: data }));
}

/** 이동 완료를 테스트가 직접 일으키는 라우터. 쓰는 부분(`subscribe`·`state.matches`)만 흉내 낸다. */
function createFakeRouter() {
  let notifyResolved = () => {};
  const fakeRouter = {
    state: { matches: createMatches() },
    subscribe: (_event: string, listener: () => void) => {
      notifyResolved = listener;
      return () => {};
    },
  };

  function navigate(...staticData: BrowserTopColorData[]) {
    fakeRouter.state.matches = createMatches(...staticData);
    notifyResolved();
  }

  return { router: fakeRouter as unknown as typeof appRouter, navigate };
}

function getThemeColor() {
  return document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content;
}

describe('resolveBrowserTopColor', () => {
  it('아무 라우트도 지정하지 않으면 흰색을 반환한다', () => {
    expect(resolveBrowserTopColor(createMatches({}, {}))).toBe('#ffffff');
  });

  it('가장 깊은 라우트의 값을 쓰고, null도 지정한 값으로 본다', () => {
    expect(resolveBrowserTopColor(createMatches({ browserTopColor: '#17034e' }, {}))).toBe(
      '#17034e',
    );
    expect(
      resolveBrowserTopColor(
        createMatches({ browserTopColor: '#17034e' }, { browserTopColor: null }),
      ),
    ).toBeNull();
  });
});

describe('syncBrowserTopColor', () => {
  afterEach(() => {
    document.querySelector('meta[name="theme-color"]')?.remove();
    document.documentElement.style.backgroundColor = '';
  });

  it('이동이 끝나면 theme-color와 페이지 배경을 화면 색으로 맞춘다', () => {
    const { router, navigate } = createFakeRouter();
    syncBrowserTopColor(router, document);

    navigate({ browserTopColor: '#17034e' });
    expect(getThemeColor()).toBe('#17034e');
    expect(document.documentElement.style.backgroundColor).toBe('rgb(23, 3, 78)');

    navigate({});
    expect(getThemeColor()).toBe('#ffffff');
  });

  it('null인 화면으로 가면 theme-color와 페이지 배경을 지운다', () => {
    const { router, navigate } = createFakeRouter();
    syncBrowserTopColor(router, document);

    navigate({});
    navigate({ browserTopColor: null });

    expect(getThemeColor()).toBeUndefined();
    expect(document.documentElement.style.backgroundColor).toBe('');
  });
});
