import { defineConfig } from 'orval';

export default defineConfig({
  gravitApi: {
    input: {
      target: 'https://grav-it-dev.inuappcenter.kr/v3/api-docs',
      override: {
        transformer: './openapi/normalize-openapi.mjs',
      },
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated/endpoints.ts',
      schemas: './src/shared/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      formatter: 'prettier',
      mock: {
        indexMockFiles: true,
        path: './src/shared/api/generated/mocks',
        generators: [
          {
            type: 'msw',
            delay: 600,
            // 일부 서버 example의 실제 값과 선언된 schema 타입이 달라 생성 코드가 깨진다.
            // 백엔드 명세가 수정되면 true로 되돌린다.
            useExamples: false,
          },
        ],
      },
      override: {
        mutator: {
          path: './src/shared/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
