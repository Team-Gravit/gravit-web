import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

// vite.config.ts를 그대로 재사용하지 않습니다.
// dev 서버 설정(HTTPS 인증서 읽기)과 라우트 트리 생성 플러그인은 테스트에 불필요하고,
// 인증서 파일이 없는 환경에서 설정 로드 자체가 실패합니다.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // shared/ui/icon 이 '...svg?react' 형태에 의존하므로 테스트에서도 필요합니다.
    svgr(),
    react(),
  ],
  test: {
    environment: 'jsdom',
    // 요청을 절대 URL로 만듭니다. 비워 두면 상대 URL이 되어 해석에 window.location이 필요하고,
    // location을 대체하는 테스트에서 요청이 나가지 않습니다.
    env: {
      VITE_API_BASE_URL: 'https://api.test.local',
      VITE_OAUTH_DEST: 'local',
    },
    // describe/it/expect 를 명시적으로 import 합니다. 어떤 러너의 API인지 파일만 보고 알 수 있습니다.
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'storybook-static/**', 'src/shared/api/generated/**'],
    // 테스트는 클래스 이름만 확인하므로 CSS를 처리하지 않습니다.
    css: false,
  },
});
