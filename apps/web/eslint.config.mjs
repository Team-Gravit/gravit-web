import pluginQuery from '@tanstack/eslint-plugin-query';
import { reactInternalConfig } from '@repo/eslint-config/react-internal';

export default [
  {
    ignores: [
      'public/mockServiceWorker.js',
      'src/app/routeTree.gen.ts',
      'src/shared/api/generated/**',
    ],
  },
  ...reactInternalConfig,
  ...pluginQuery.configs['flat/recommended'],
];
