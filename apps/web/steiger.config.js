import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  {
    // 테스트 파일은 FSD 훅도 검사 대상에서 제외한다. 두 층의 기준을 맞춘다.
    // 테스트는 MSW 서버처럼 앱이 쓰지 않는 하네스 모듈을 참조해야 하는데, 그것을 공개 API로
    // 올리면 msw/node 가 브라우저 번들 그래프에 딸려 들어온다.
    ignores: ['./src/shared/api/generated/**', '**/*.test.ts', '**/*.test.tsx'],
  },
  ...fsd.configs.recommended,
  {
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },
  {
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
]);
