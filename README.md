# Gravit Applications

Gravit의 신규 웹·네이티브 앱과 기존 웹 앱을 한 저장소에서 관리합니다.

## 디렉터리 구조

```text
apps/
├── native/       # Expo 네이티브 앱 (Turborepo workspace)
├── web/          # 신규 WebView용 웹 앱 (Turborepo workspace)
└── legacy-web/   # 기존 웹 앱 (독립 pnpm 프로젝트)
packages/
├── eslint-config/
└── typescript-config/
```

## Workspace 앱 실행

저장소 루트에서 실행합니다.

```sh
pnpm install
pnpm dev
```

루트의 pnpm workspace와 Turbo 작업에는 `apps/native`, `apps/web`, `packages/*`만 포함됩니다.

## Legacy 웹 실행

`legacy-web`은 상위 pnpm workspace와 Turbo 작업에서 제외되어 있습니다. 반드시 앱 디렉터리로 이동한 뒤 독립적으로 설치하고 실행합니다.

```sh
cd apps/legacy-web
pnpm install
pnpm dev
```

타입 검사와 production build도 같은 디렉터리에서 실행합니다.

```sh
pnpm check-types
pnpm build
```
