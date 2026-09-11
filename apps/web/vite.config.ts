import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  // 현재 실행 모드
  const env = loadEnv(mode, process.cwd());
  // VITE_USE_HTTPS가 문자열 'true'인 경우에만 HTTPS를 활성화
  const useHttps = env.VITE_USE_HTTPS === 'true';

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Vite 개발 서버의 실행 방식
    server: {
      // 같은 네트워크의 다른 기기 접속 허용
      host: true,
      port: 5173,
      // WebView가 LAN IP(`http://<host>:5173`) origin으로 접속하면 백엔드 CORS에 걸린다.
      // `VITE_API_PROXY=true`면 요청이 same-origin 상대 경로로 나오고 여기서 백엔드로 넘긴다.
      // 생성 API 경로가 `/api/v1/...`로 시작하므로 경로 재작성은 하지 않는다.
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
      allowedHosts: mode === 'development' ? true : [],
      // 인증서 설정 조건부 적용
      ...(useHttps
        ? {
            https: {
              // 개인 키
              key: fs.readFileSync(path.resolve(os.homedir(), '.cert/localhost-key.pem')),
              // 인증서
              cert: fs.readFileSync(path.resolve(os.homedir(), '.cert/localhost-cert.pem')),
            },
          }
        : {}),
    },
    // React 프로젝트를 Vite에서 실행할 수 있도록 React 플러그인을 등록합니다.
    plugins: [
      // '...svg?react' 를 React 컴포넌트로 변환합니다. shared/ui/icon 이 이 형태에 의존합니다.
      svgr(),
      tailwindcss(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/app/routes',
        generatedRouteTree: './src/app/routeTree.gen.ts',
      }),
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
    ],
  };
});
