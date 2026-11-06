/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// vite-imagetools 쿼리 import. 변환 지시어는 쿼리 끝에 출력 형태(as=srcset)나 형식을 둔다.
declare module '*&as=srcset' {
  const srcset: string;
  export default srcset;
}
declare module '*format=webp' {
  const url: string;
  export default url;
}
declare module '*format=avif' {
  const url: string;
  export default url;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** OAuth 리다이렉트 목적지. `local` · `dev` · `prod` 중 하나. */
  readonly VITE_OAUTH_DEST: string;
  /** 웹 Apple 로그인의 Services ID. 서버가 코드 교환에 쓰는 값과 같아야 한다. */
  readonly VITE_APPLE_CLIENT_ID?: string;
  readonly VITE_ENABLE_API_MOCKING?: string;
  readonly VITE_USE_HTTPS?: string;
  /** `true`면 dev 서버의 `/api` 프록시를 거친다. 빌드에서는 무시된다. */
  readonly VITE_API_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
