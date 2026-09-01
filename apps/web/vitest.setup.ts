// toBeInTheDocument 등 jest-dom matcher를 vitest의 expect에 등록합니다.
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 테스트 간 격리. 앞 테스트의 DOM이나 모킹이 다음 테스트에 새지 않게 합니다.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
