import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  {
    ignores: ['./src/shared/api/generated/**'],
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
