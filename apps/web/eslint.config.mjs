// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import pluginQuery from '@tanstack/eslint-plugin-query';
import { reactInternalConfig } from '@repo/eslint-config/react-internal';

export default [
  {
    ignores: [
      'storybook-static/**',
      'public/mockServiceWorker.js',
      'src/app/routeTree.gen.ts',
      'src/shared/api/generated/**',
    ],
  },
  ...reactInternalConfig,
  ...pluginQuery.configs['flat/recommended'],
  ...storybook.configs['flat/recommended'],
];
