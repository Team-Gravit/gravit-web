import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import storybook from 'eslint-plugin-storybook';
import pluginRouter from '@tanstack/eslint-plugin-router';
import unusedImports from 'eslint-plugin-unused-imports';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

export default tseslint.config(
  // storybook
  storybook.configs['flat/recommended'],
  // tanstack router
  ...pluginRouter.configs['flat/recommended'],
  [
    globalIgnores(['dist', 'src/shared/api/@generated/**']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite,
        react.configs.flat.recommended,
        react.configs.flat['jsx-runtime'],
        eslintPluginPrettierRecommended, // 항상 마지막 — prettier 충돌 규칙 비활성화
      ],
      plugins: {
        'unused-imports': unusedImports,
        'simple-import-sort': simpleImportSort,
        'better-tailwindcss': betterTailwindcss,
        '@tanstack/query': tanstackQuery,
      },
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      settings: {
        react: {
          version: 'detect',
        },
        // eslint-plugin-better-tailwindcss
        'better-tailwindcss': {
          // Tailwind v4 CSS 진입점 — 커스텀 토큰 인식에 필요
          entryPoint: 'src/app/styles/index.css',
        },
      },
      rules: {
        // 미사용 import 자동 제거
        'unused-imports/no-unused-imports': 'error',
        // 미사용 변수 — TS ESLint 기본 규칙 대신 이걸로 교체 (언더스코어 예외 처리)
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],

        // prettier-plugin-tailwindcss가 정렬을 담당하므로 중복 비활성화
        'better-tailwindcss/sort-classes': 'off',
        // 충돌 클래스 감지 (e.g. flex + hidden 동시 적용)
        'better-tailwindcss/no-conflicting-classes': 'error',
        // 같은 클래스 중복 적용 감지
        'better-tailwindcss/no-duplicate-classes': 'warn',

        // eslint-plugin-simple-import-sort
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',

        // @tanstack/eslint-plugin-query (flat config 미지원 → 수동 변환)
        '@tanstack/query/exhaustive-deps': 'error',
      },
    },
  ],
);
