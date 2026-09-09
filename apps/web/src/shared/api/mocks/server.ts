import { setupServer } from 'msw/node';

/**
 * 테스트에서 네트워크를 가로챈다.
 *
 * 핸들러를 미리 등록하지 않는다. 각 테스트가 `server.use(...)`로 필요한 것만 등록하고,
 * 등록하지 않은 요청은 `vitest.setup.ts`의 정책에 따라 실패한다.
 */
export const server = setupServer();
