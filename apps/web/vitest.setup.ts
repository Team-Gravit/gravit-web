// toBeInTheDocument 등 jest-dom matcher를 vitest의 expect에 등록합니다.
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './src/shared/api/mocks/server';

// 테스트 실행 전 요청 가로채기를 시작한다.
// 이 때등록된 핸들러가 없는 요청은 오류로 처리해 실제 서버로 넘어가지 않도록한다.
// 실제 서버로 새어 나가면 테스트가 환경에 따라 흔들릴 수 있다.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 테스트 간 격리를 위한 코드
// 각 테스트가 끝나면 해당 테스트의 DOM이나 모킹이 다음 테스트에 영향을 주지 않도록 정리한다.
afterEach(() => {
  cleanup(); // react testing library로 렌더링한 화면
  vi.restoreAllMocks(); // vi.spyOn()등으로 대체한 원본 구현
  server.resetHandlers(); // 각 테스트가 server.use()로 추가한 요청 처리 규칙
});

afterAll(() => server.close());
