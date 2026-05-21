import { defineConfig } from 'orval';

export default defineConfig({
  gravit: {
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/@generated/gravit.ts',
      schemas: 'src/shared/api/@generated/model',
      client: 'react-query',
      mock: true,
      override: {
        mutator: {
          path: './src/shared/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: 'https://grav-it-dev.inuappcenter.kr/v3/api-docs',
      unsafeDisableValidation: true,
    },
  },
  gravitZod: {
    output: {
      target: 'src/shared/api/@generated/zod-schemas.ts',
      client: 'zod',
    },
    input: {
      target: 'https://grav-it-dev.inuappcenter.kr/v3/api-docs',
      unsafeDisableValidation: true,
    },
  },
});