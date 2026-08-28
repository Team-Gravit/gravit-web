import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

function getAbsolutePath(packageName: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${packageName}/package.json`)));
}

const storybookDirectory = dirname(fileURLToPath(import.meta.url));

// GitHub Pages project site는 /<repo>/ 하위 경로로 서빙되므로 배포 빌드에만 base를 적용합니다.
const GITHUB_PAGES_BASE = '/gravit-web/';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-a11y'), getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (viteConfig, { configType }) =>
    mergeConfig(viteConfig, {
      base: configType === 'PRODUCTION' ? GITHUB_PAGES_BASE : '/',
      resolve: {
        alias: {
          '@': resolve(storybookDirectory, '../src'),
        },
      },
      plugins: [tailwindcss()],
    }),
};

export default config;
