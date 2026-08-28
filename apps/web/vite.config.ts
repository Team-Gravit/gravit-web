import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

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
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/app/routes',
        generatedRouteTree: './src/app/routeTree.gen.ts',
      }),
      react(),
    ],
  };
});
