import { afterEach, describe, expect, it, vi } from 'vitest';

import type { router as appRouter } from '../router/router';
import {
  SWIPE_BACK_MESSAGE_TYPE,
  resolveSwipeBackEnabled,
  syncNativeSwipeBack,
} from './native-swipe-back';

type SwipeBackData = { swipeBack?: boolean };

function createMatches(...staticData: SwipeBackData[]) {
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

  function navigate(...staticData: SwipeBackData[]) {
    fakeRouter.state.matches = createMatches(...staticData);
    notifyResolved();
  }

  return { router: fakeRouter as unknown as typeof appRouter, navigate };
}

describe('resolveSwipeBackEnabled', () => {
  it('아무 라우트도 지정하지 않으면 허용한다', () => {
    expect(resolveSwipeBackEnabled(createMatches({}, {}))).toBe(true);
  });

  it('가장 깊은 라우트의 값을 쓰고, 없으면 부모 값을 상속한다', () => {
    expect(resolveSwipeBackEnabled(createMatches({ swipeBack: false }, {}))).toBe(false);
    expect(resolveSwipeBackEnabled(createMatches({ swipeBack: false }, { swipeBack: true }))).toBe(
      true,
    );
  });
});

describe('syncNativeSwipeBack', () => {
  afterEach(() => {
    delete window.ReactNativeWebView;
  });

  it('이동이 끝날 때 허용 여부가 바뀌었을 때만 native 에 알린다', () => {
    const postMessage = vi.fn();
    window.ReactNativeWebView = { postMessage };
    const { router, navigate } = createFakeRouter();

    syncNativeSwipeBack(router);
    navigate({});
    navigate({ swipeBack: false });
    navigate({ swipeBack: false });
    navigate({});

    expect(postMessage.mock.calls.map(([message]) => JSON.parse(message))).toEqual([
      { type: SWIPE_BACK_MESSAGE_TYPE, enabled: true },
      { type: SWIPE_BACK_MESSAGE_TYPE, enabled: false },
      { type: SWIPE_BACK_MESSAGE_TYPE, enabled: true },
    ]);
  });

  it('브라우저처럼 ReactNativeWebView 가 없으면 이동을 구독하지 않는다', () => {
    const { router } = createFakeRouter();
    const subscribe = vi.spyOn(router, 'subscribe');

    syncNativeSwipeBack(router);

    expect(subscribe).not.toHaveBeenCalled();
  });
});
