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
          // 기기(WebView)에서는 브라우저 인스펙터를 붙이기 어렵다. 프록시를 지나는 요청의 응답 상태를
          // 이 터미널에 남겨 실패한 호출을 찾는다.
          configure: (proxy) => {
            // 브라우저는 same-origin이라도 POST에 `Origin`을 붙인다. LAN IP origin이 그대로 백엔드에
            // 가면 CORS 허용 목록에 없어 403(Invalid CORS request)이 난다. 프록시가 보내는 요청은
            // 서버 간 요청이므로 Origin을 떼어 CORS 판정 대상에서 제외한다.
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(`[api-proxy] ${req.method} ${req.url} → ${proxyRes.statusCode}`);
            });
            proxy.on('error', (error, req) => {
              console.error(`[api-proxy] ${req.method} ${req.url} → ${error.message}`);
            });
          },
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
