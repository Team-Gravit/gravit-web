import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  {
    ignores: ['**/dist/**', '**/build/**', '**/.expo/**', '**/.turbo/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      // `import.meta.env.DEV` 같은 Vite 내장값은 process env가 아니라 turbo.json에 선언할 대상이 아니다.
      'turbo/no-undeclared-env-vars': ['warn', { allowList: ['^(DEV|PROD|MODE|SSR|BASE_URL)$'] }],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  eslintConfigPrettier,
];
