import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import remarkGfm from 'remark-gfm';
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
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    {
      // MDX 기본 파서는 CommonMark 라 표, 취소선 등 GFM 문법을 인식하지 못합니다.
      name: getAbsolutePath('@storybook/addon-docs'),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
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
      // 앱 vite.config.ts 와 동일한 플러그인을 유지해야 아이콘이 Storybook 에서도 렌더됩니다.
      plugins: [svgr(), tailwindcss()],
    }),
};

export default config;
