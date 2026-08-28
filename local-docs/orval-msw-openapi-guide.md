# Orval · OpenAPI · MSW 설정 가이드

이 문서는 Gravit Web의 API 코드 생성과 개발용 Mock 흐름을 설명한다.

## 전체 흐름

```text
Gravit 백엔드 OpenAPI
        ↓
openapi/normalize-openapi.mjs
명세의 비표준 필드만 보정
        ↓
orval.config.ts
        ├─ Axios 기반 API 함수
        ├─ TanStack Query options와 hooks
        ├─ 요청·응답 model
        └─ MSW handlers
        ↓
src/shared/api/generated/
```

생성된 API 함수는 Orval 기본 인스턴스가 아니라
`src/shared/api/axios-instance.ts`의 `customInstance`를 호출한다. 따라서 base URL, timeout,
Bearer 토큰과 401 처리가 모든 생성 API에 동일하게 적용된다.

## Orval 설정

설정 파일은 `apps/web/orval.config.ts`다.

### 입력

`input.target`은 Gravit 백엔드의 OpenAPI 문서 주소다. `input.override.transformer`는 문서를
검증하고 코드를 생성하기 전에 `normalize-openapi.mjs`를 실행한다.

### 출력

- `mode: 'tags-split'`: OpenAPI tag별로 API 파일을 분리한다.
- `target`: 생성 API 함수의 출력 기준 경로다.
- `schemas`: 요청·응답 model의 출력 경로다.
- `client: 'react-query'`: TanStack Query options와 hooks를 생성한다.
- `httpClient: 'axios'`: Axios 요청 형태로 API 함수를 생성한다.
- `clean: true`: 재생성 전에 기존 generated 결과를 지운다.
- `formatter: 'prettier'`: 생성 결과를 Prettier로 정리한다.

`clean: true`이므로 `src/shared/api/generated/`에는 수동 작성 파일을 두지 않는다.

### Axios mutator

`output.override.mutator`는 생성 API가 호출할 공통 함수를 지정한다.

```text
생성된 Query hook
        ↓
customInstance
        ↓
Axios baseURL · timeout · Authorization · 401 처리
```

### MSW 생성

- `indexMockFiles: true`: API별 mock을 다시 export하는 `index.msw.ts`를 생성한다.
- `path`: MSW handler 출력 위치다.
- `delay: 600`: 개발 중 로딩 상태를 볼 수 있도록 응답을 지연한다.
- `useExamples: false`: OpenAPI example 대신 schema 기반 faker 값을 사용한다.

현재 `useExamples`가 `false`인 이유는 일부 서버 example 값과 schema 타입이 다르기 때문이다.
예를 들어 CS 노트 응답 schema는 `ArrayBuffer`지만 example은 문자열이라, example을 그대로
사용하면 생성 mock의 타입 검사가 실패한다. 백엔드 명세가 수정되면 `true` 복원을 검토한다.

## OpenAPI 보정 파일

`apps/web/openapi/normalize-openapi.mjs`는 백엔드 OpenAPI의 Bearer 인증 정의만 보정한다.

현재 `type: 'http'`인 `BearerAuth`에 `apiKey` 전용 필드인 `name`과 `in`이 함께 내려온다.
최신 Orval은 이를 잘못된 명세로 판단하므로 transformer가 두 필드만 제거한다.

전체 검증을 끄는 `unsafeDisableValidation`은 사용하지 않는다. 다른 명세 오류는 계속 발견할 수
있어야 하기 때문이다. 백엔드가 BearerAuth 정의를 수정하면 transformer와 해당 설정을 제거한다.

## MSW worker

`apps/web/public/mockServiceWorker.js`는 Orval 생성물이 아니라 MSW CLI가 생성한 공식 Service
Worker 파일이다.

```powershell
pnpm --filter web exec msw init public --save
```

이 파일은 브라우저 요청을 가로채는 실행기이며, 실제 응답 내용은 포함하지 않는다. 실제 handler는
`src/shared/api/generated/mocks/`에 있고, `src/shared/api/mocks/browser.ts`가 앱에서 등록할
handler를 선택한다. 현재는 다음 로그인 구현을 고려해 OAuth handler만 등록한다.

`mockServiceWorker.js`는 직접 수정하지 않는다. MSW 버전을 올릴 때 CLI로 다시 생성한다.

## 실제 서버와 Mock 전환

기본 환경변수는 실제 서버를 사용하도록 설정한다.

```dotenv
VITE_API_BASE_URL=https://grav-it-dev.inuappcenter.kr
VITE_ENABLE_API_MOCKING=false
```

개발용 OAuth mock을 사용할 때만 다음과 같이 변경한다.

```dotenv
VITE_ENABLE_API_MOCKING=true
```

등록된 handler가 없는 요청은 `onUnhandledRequest: 'bypass'` 설정에 따라 실제 네트워크로 전달된다.

## 재생성과 검증

```powershell
pnpm --filter web generate:api
pnpm --filter web check-types
pnpm --filter web lint
pnpm --filter web build
```

OpenAPI가 변경되면 생성 파일을 직접 수정하지 않고 `generate:api`를 다시 실행한다.
