import { afterEach, describe, expect, it, vi } from 'vitest';

import type { router as appRouter } from '../router/router';
import {
  STATUS_BAR_STYLE_MESSAGE_TYPE,
  resolveStatusBarStyle,
  syncNativeStatusBarStyle,
} from './native-status-bar';

type StatusBarStyleData = { statusBarStyle?: 'light' | 'dark' };

function createMatches(...staticData: StatusBarStyleData[]) {
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

  function navigate(...staticData: StatusBarStyleData[]) {
    fakeRouter.state.matches = createMatches(...staticData);
    notifyResolved();
  }

  return { router: fakeRouter as unknown as typeof appRouter, navigate };
}

describe('resolveStatusBarStyle', () => {
  it('아무 라우트도 지정하지 않으면 dark 를 반환한다', () => {
    expect(resolveStatusBarStyle(createMatches({}, {}))).toBe('dark');
  });

  it('가장 깊은 라우트의 값을 쓰고, 없으면 부모 값을 상속한다', () => {
    expect(resolveStatusBarStyle(createMatches({ statusBarStyle: 'light' }, {}))).toBe('light');
    expect(
      resolveStatusBarStyle(createMatches({ statusBarStyle: 'light' }, { statusBarStyle: 'dark' })),
    ).toBe('dark');
  });
});

describe('syncNativeStatusBarStyle', () => {
  afterEach(() => {
    delete window.ReactNativeWebView;
  });

  it('이동이 끝날 때 글자색이 바뀌었을 때만 native 에 알린다', () => {
    const postMessage = vi.fn();
    window.ReactNativeWebView = { postMessage };
    const { router, navigate } = createFakeRouter();

    syncNativeStatusBarStyle(router);
    navigate({ statusBarStyle: 'light' });
    navigate({ statusBarStyle: 'light' });
    navigate({});

    expect(postMessage.mock.calls.map(([message]) => JSON.parse(message))).toEqual([
      { type: STATUS_BAR_STYLE_MESSAGE_TYPE, style: 'light' },
      { type: STATUS_BAR_STYLE_MESSAGE_TYPE, style: 'dark' },
    ]);
  });

  it('브라우저처럼 ReactNativeWebView 가 없으면 이동을 구독하지 않는다', () => {
    const { router } = createFakeRouter();
    const subscribe = vi.spyOn(router, 'subscribe');

    syncNativeStatusBarStyle(router);

    expect(subscribe).not.toHaveBeenCalled();
  });
});
