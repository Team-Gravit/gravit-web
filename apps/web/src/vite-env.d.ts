/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** OAuth 리다이렉트 목적지. `local` · `dev` · `prod` 중 하나. */
  readonly VITE_OAUTH_DEST: string;
  readonly VITE_ENABLE_API_MOCKING?: string;
  readonly VITE_USE_HTTPS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
