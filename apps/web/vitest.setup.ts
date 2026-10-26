import '@testing-library/jest-dom/vitest';

import { cleanup, configure } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './src/shared/api/mocks/server';

// MSW·Query·라우터의 콜드 스타트가 findBy* 기본 제한인 1초를 넘겨 발생하는 오탐을 막는다.
// 성공한 쿼리는 즉시 반환되므로 제한을 늘려도 정상 테스트를 지연시키지 않는다.
configure({ asyncUtilTimeout: 5000 });

// jsdom 은 HTMLMediaElement.play/pause 를 구현하지 않아 실제 브라우저와 달리 undefined 를 반환한다.
// 오디오 언락 경로가 play().catch(...) 를 호출하므로 resolved Promise 를 돌려주는 스텁을 둔다.
// vi.fn 대신 plain 함수로 둬서 afterEach 의 vi.restoreAllMocks() 에 리셋되지 않게 한다.
HTMLMediaElement.prototype.play = () => Promise.resolve();
HTMLMediaElement.prototype.pause = () => {};

// 등록되지 않은 요청은 실제 네트워크로 흘리지 않고 즉시 실패시켜 테스트를 격리한다.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  server.resetHandlers();
});

afterAll(() => server.close());
