---
id: 'NAT-025'
planned: '2026-09-12'
mode: 'feature'
---

# NAT-025 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**
>
> **2026-11-04 안내** — 아래 1차·2차 계획은 iOS 기준의 당시 기록이고 이전 이슈 번호를 쓴다 (대응은 `issues.md` 맨 위). `spec.md`의 범위 재정의가
> 확정되고 이슈를 다시 나눈 뒤 이 문서 끝에 다음 회차를 누적한다. 2차 계획의 "Android 제외"는 더는
> 유효하지 않다. 카카오 `extraMavenRepos`는 계획과 달리 `app.json`에 들어 있고, Android 지원에는 필요한 설정이다.

## 0. 모드 판정

`mode: feature` — legacy-web에 없는 기능이다. 앱 안에서 소셜 로그인이 WebView 인가 페이지로
가는 바람에 Google이 차단되고, 웹↔네이티브 요청–응답 통로 자체가 없다. `feature-planner`
3단계(ADR-1~4 · 이슈 4건)와 `issue-reviewer`(필수 0건, 권고 반영)를 거쳤다.

### 0-0. 이번 계획의 범위 — 1차 / 2차

**확인 필요 2**(앱 번들 ID · Kakao 네이티브 앱 키 · Google 클라이언트 ID 2종 · Naver 자격 증명)가
아직 비어 있다. SDK가 없어도 만들 수 있는 것과 없는 것을 가른다.

| 차수                | 포함                                                                                                                                             | 완료 판정                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **1차 (이 계획)**   | Issue 1 전체(계약 · web 전송 · native 디스패처 · `APP_INFO`) + Issue 2·3·4의 **web 파트**(`AUTH_LOGIN` 계약 · 교환 훅 · 버튼 분기 · 페이지 이동) | Issue 1 AC-1~11 · Issue 2 AC-1~8 · Issue 3 AC-1 · Issue 4 AC-1~2 |
| **2차 (별도 계획)** | Issue 2·3·4의 **native 파트** — SDK 의존성 3종 · `app.config.ts` · `auth-login` 핸들러 · 실기기 검증                                             | 나머지 수동 AC. 자격 증명 도착 후 `plan.md`에 회차 누적          |

1차가 끝나면 **앱에서 로그인 버튼을 누르면 native가 `UNSUPPORTED`를 돌려주고 웹이 기존 경로로
폴백한다** — 지금과 동작이 같으면서 브릿지 왕복(`APP_INFO`)은 살아 있는 상태다. 2차는 native
핸들러 하나를 갈아 끼우는 일이라 web은 건드리지 않는다.

### 0-1. 착수 전 필수 게이트

`MIG-` · `REF-` 전용 항목이다. 이 작업은 `feature-planner`의 게이트 3회(인터뷰 · ADR · 이슈)로
대신했다. 다만 **동작 보존 대상이 하나 있다** — 브라우저(앱 밖) 로그인 흐름은 바뀌지 않아야
하고, 기존 `social-login-button.test.tsx` · `login-page.test.tsx` · `oauth-callback-page.test.tsx`가
그 기준선이다 (Issue 2 AC-7·8).

### 0-2. 자동 보류 신호 — 하나라도 해당하면 **중단**

- [ ] 동작 변경이 같이 들어감 — 해당 없음. 앱 밖 동작은 보존, 앱 안 동작은 이 작업의 목적
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음. §0-0에서 자격 증명 의존 부분을 2차로 갈랐다
- [ ] 자동 생성물을 직접 손봐야 함 — 해당 없음. `oauthLogin1` · `oauthNaverLogin` · `LoginResponse` · `IdTokenRequest` · `AccessTokenRequest`가 이미 생성돼 있어 **orval 재생성 불필요.** 라우트 추가도 없어 `routeTree.gen.ts` 재생성 불필요
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 — `format:check`는 `REF-003`의 기존 실패. 신규 파일은 prettier를 맞춘다
- [x] **범위 밖 문제가 섞임 → 미추적 스케치 3개.** `shared/lib/use-bridge.ts` · `app/webview/webview-provider.tsx` · `apps/native/apis/use-apis.ts`는 커밋된 적 없는 실험 파일이다. ADR-1 B안으로 거부됐으므로 **1차 첫 단계에서 제거한다.** 별도 작업이 아니라 이 작업의 결정 결과다

---

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                                                                     | 레이어            | 이슈 · AC                  |
| --- | ------------------------------------------------------------------------------------------------------------ | ----------------- | -------------------------- |
| 1   | 요청/응답/이벤트 봉투 타입 · 에러 코드 · `APP_INFO`·`AUTH_LOGIN` 계약 · 봉투 파싱 순수 함수                  | `[packages]` 계약 | 1 AC-8                     |
| 2   | UA `GravitNative/`로 앱 환경 판별                                                                            | `[shared]`        | 1 AC-1                     |
| 3   | `id` 상관 요청 → Promise. 타임아웃 · `UNAVAILABLE` · 실패 봉투 → `BridgeError`. 모르는 메시지는 경고 후 무시 | `[shared]`        | 1 AC-2~7                   |
| 4   | 네이티브→웹 이벤트 구독·해제                                                                                 | `[shared]`        | 1 AC-9                     |
| 5   | `AUTH_LOGIN` 요청(120초) → provider별 Android 엔드포인트 교환 → `setSession`                                 | `[features]`      | 2 AC-1 · 3 AC-1 · 4 AC-1~2 |
| 6   | 로그인 결과 판정(`isOnboarded` → 목적지, `USER_423` → providerId)을 콜백·네이티브가 공유                     | `[features]`      | 2 AC-6·8                   |
| 7   | 버튼이 앱 환경이면 브릿지, 아니면 기존 경로. `CANCELLED` 무시 · `UNSUPPORTED` 폴백 · 그 외 잠금 해제         | `[features]`      | 2 AC-3~5·7                 |
| 8   | 로그인 페이지가 결과를 받아 `/onboarding` · `/main` · `/restore`로 이동                                      | `[pages]`         | 2 AC-2·6                   |
| 9   | 콜백 페이지가 같은 판정 함수를 쓴다 (동작 보존)                                                              | `[pages]`         | 2 AC-8                     |
| 10  | 네이티브 디스패처: 파싱 → 핸들러 → 성공/실패 봉투 회신. `kind` 없는 메시지는 기존 로그로                     | `[native]`        | 1 AC-10·11                 |
| 11  | `APP_INFO` 핸들러 (플랫폼 · 앱 버전)                                                                         | `[native]`        | 1 AC-10                    |
| 12  | `AUTH_LOGIN` 핸들러 자리 — 1차에서는 `UNSUPPORTED`를 돌려준다 (2차에서 SDK 분기로 교체)                      | `[native]`        | 2 AC-11                    |

### 1-1. 관리 포인트 식별

| 값                                       | 상수 / 인라인                          | 근거                                                                                                       |
| ---------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 에러 코드 5종                            | **상수** `BRIDGE_ERROR_CODES` (계약)   | web·native가 같은 문자열을 봐야 한다. 이슈에 명시                                                          |
| UA 마커 `GravitNative`                   | **상수** (계약 패키지)                 | native가 `applicationNameForUserAgent`에 쓰고 web이 판별에 쓴다. 두 앱이 같은 값을 봐야 하므로 계약에 둔다 |
| 브릿지 기본 타임아웃 10초                | **상수** `DEFAULT_BRIDGE_TIMEOUT_MS`   | `spec.md` 경계 조건표의 정책값. `requestNative` 파일 상단                                                  |
| 로그인 요청 타임아웃 120초               | **상수** `NATIVE_LOGIN_TIMEOUT_MS`     | 확인 필요 3으로 확정된 기획값. `request-native-login.ts` 상단                                              |
| `USER_423`                               | **상수** (features `login-outcome.ts`) | 기존 상수를 콜백 페이지에서 features로 옮긴다. 두 진입 경로가 공유                                         |
| 요청 `id` 생성 방식(`crypto.randomUUID`) | 인라인                                 | 구현 디테일                                                                                                |
| `console.warn` 문구                      | 인라인                                 | 개발자용. 사용자 노출 아님                                                                                 |

---

## 2. 영향 분석

실측 (`rg`, 2026-09-12):

- `readWithdrawnProviderId` · `USER_423` 사용처: `pages/oauth-callback/ui/oauth-callback-page.tsx` 1곳
- `SocialLoginButton` 사용처: `pages/login/ui/login-page-narrow.tsx` · `login-page-wide.tsx` 2곳
- `useOauthLogin` 사용처: `features/auth-login/ui/social-login-button.tsx` 1곳 (+ 배럴 export)
- `GravitNative` 사용처: `apps/native/app/index.tsx` 1곳 (web에는 아직 없음)
- `ReactNativeWebView` 타입 선언: 미추적 `shared/lib/use-bridge.ts`뿐

| 구분     | 파일                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **신규** | `packages/bridge-protocol/{package.json, tsconfig.json, src/index.ts, src/envelope.ts, src/error-codes.ts, src/contracts.ts, src/user-agent.ts, src/envelope.test.ts}` · `apps/web/src/shared/api/bridge/{index.ts, native-environment.ts, bridge-error.ts, native-message-channel.ts, request-native.ts, native-events.ts, native-environment.test.ts, request-native.test.ts, native-events.test.ts}` · `apps/web/src/features/auth-login/api/{request-native-login.ts, exchange-native-token.ts, use-native-login.ts, use-native-login.test.tsx}` · `apps/web/src/features/auth-login/model/{login-outcome.ts, login-outcome.test.ts}` · `apps/native/bridge/{create-bridge.ts, bridge-handler-error.ts, handlers/app-info.ts, handlers/auth-login.ts}` |
| **수정** | `apps/web/package.json` · `apps/native/package.json` (workspace 의존성) · `apps/web/src/shared/api/index.ts` · `apps/web/src/features/auth-login/index.ts` · `apps/web/src/features/auth-login/ui/social-login-button.tsx` · `social-login-button.test.tsx` · `apps/web/src/pages/login/ui/{login-page.tsx, login-page-narrow.tsx, login-page-wide.tsx, login-page.test.tsx}` · `apps/web/src/pages/oauth-callback/ui/oauth-callback-page.tsx` · `apps/native/app/index.tsx` · `pnpm-lock.yaml`                                                                                                                                                                                                                                                            |
| **삭제** | 미추적 스케치: `apps/web/src/shared/lib/use-bridge.ts` · `apps/web/src/app/webview/webview-provider.tsx` · `apps/native/apis/use-apis.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

npm 의존성 추가: **없음** (1차). `@repo/bridge-protocol`은 워크스페이스 패키지라 `pnpm install`로
링크만 된다. SDK 3종은 2차.

`packages/bridge-protocol`의 형태 — `packages/eslint-config`처럼 빌드 없는 just-in-time 패키지.

```jsonc
// package.json
{
  "name": "@repo/bridge-protocol",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" },
  "types": "./src/index.ts",
  "scripts": { "check-types": "tsc --noEmit", "test": "vitest run" },
}


// tsconfig.json — base.json + noEmit · verbatimModuleSyntax · lib: ["ESNext"] (DOM 없음: 환경 중립)
```

`lib`에 DOM을 넣지 않아 계약이 `window`·RN 어느 쪽도 참조할 수 없게 컴파일러가 막는다.
`turbo.json`은 `check-types`·`test`를 이미 워크스페이스 전체에 돌리므로 추가 등록이 없다.

---

## 3. 의존 관계 검증

| 참조                                                                      | 방향          | 판정                                                                                                                                                                        |
| ------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/api/bridge` → `@repo/bridge-protocol`                             | shared → npm  | ✅ 외부 패키지. **web에서 이 패키지를 import하는 곳은 `shared/api/bridge`뿐**이다 (ADR-2)                                                                                   |
| `features/auth-login/api` → `@/shared/api/bridge` · `@/entities/auth`     | 2 → 0 · 2 → 1 | ✅ 하향                                                                                                                                                                     |
| `features/auth-login/api` → `@/shared/api/generated/oauth2-0-android-api` | 2 → 0         | ✅ `api-convention.md` §3 — 생성물은 feature `api/`에서만 참조                                                                                                              |
| `features/auth-login/model/login-outcome` → `axios` (`isAxiosError`)      | 2 → npm       | ✅ 기존 콜백 페이지와 같은 방식                                                                                                                                             |
| `pages/login` · `pages/oauth-callback` → `@/features/auth-login`          | 4 → 2         | ✅ 배럴만                                                                                                                                                                   |
| `features` → 계약의 `AUTH_LOGIN.result` 타입                              | —             | ✅ **직접 import 없음.** `requestNative('AUTH_LOGIN', …)`의 반환 타입이 제네릭으로 흘러온다. `LoginProvider`는 계약의 `provider` 리터럴 유니온과 동일해 구조적으로 대입된다 |
| native `bridge/` → `@repo/bridge-protocol`                                | —             | ✅ native에는 FSD가 없다. `app/`(expo-router 라우트) 밖에 둔다                                                                                                              |

**훅 규칙 주의** — `SocialLoginButton`에서 `isNativeApp() ? useNativeLogin() : useOauthLogin()`은
조건부 훅이라 `react-hooks/rules-of-hooks`에 걸린다. **두 훅을 모두 호출**하고 `handleClick`에서
가른다. `isPending`은 둘의 OR. 둘 다 `useMutation`이라 비용은 없다.

FSD 위반: **없음.**

---

## 4. 구현 계획 체크리스트

> 계약 → `shared` → `features` → `pages` → native 순서. 앞 단계가 `check-types`를 통과해야 다음으로 간다.

### 4-0. 스케치 제거 · 패키지 골격

- [x] 미추적 스케치 3개 제거 (`git rm` 아님 — 커밋된 적 없다)
- [x] `[packages]` `bridge-protocol` 골격: `package.json` · `tsconfig.json` · `vitest.config.ts`(node 환경, jsdom 불필요)
- [x] `[packages]` `src/error-codes.ts` — `BRIDGE_ERROR_CODES` as const · `BridgeErrorCode`
- [x] `[packages]` `src/contracts.ts` — `BridgeContracts { APP_INFO; AUTH_LOGIN }` · `BridgeRequestType = keyof BridgeContracts` · `BridgeRequestPayload<T>` · `BridgeResult<T>` · `BridgeEvents`(이번엔 빈 맵 + `MIG-005`가 채운다는 주석)
- [x] `[packages]` `src/envelope.ts` — `BridgeRequest<T>` · `BridgeResponse` · `BridgeEvent` · `BridgeMessage` 유니온 · `parseBridgeMessage(raw: string): BridgeMessage | null` (JSON 실패·`kind` 없음·모르는 `kind` → `null`)
- [x] `[packages]` `src/user-agent.ts` — `NATIVE_USER_AGENT_MARKER = 'GravitNative'` · `isNativeUserAgent(userAgent: string)`
- [x] `[packages]` `src/index.ts` 배럴 · `envelope.test.ts` (Issue 1 AC-8 + `isNativeUserAgent` AC-1의 순수 부분)
- [x] `apps/web` · `apps/native` `package.json`에 `"@repo/bridge-protocol": "workspace:*"` → `pnpm install`
- [x] 증분 검사: `pnpm --filter @repo/bridge-protocol check-types test`

### 4-1. `[shared]` `apps/web/src/shared/api/bridge/`

- [x] `native-environment.ts` — `isNativeApp()`: `isNativeUserAgent(navigator.userAgent)`. `declare global { interface Window { ReactNativeWebView?: { postMessage(message: string): void } } }`
- [x] `bridge-error.ts` — `class BridgeError extends Error { readonly code: BridgeErrorCode }` · `isBridgeError(error, code?)`
- [x] `native-message-channel.ts` (내부, 배럴 미노출) — `window`의 캡처 단계에서 `message` 이벤트를 **한 번만** 구독하고(2026-11-05 `window`·`document` 양쪽 구독에서 변경) `parseBridgeMessage` 결과를 `kind`별 리스너로 넘긴다. 파싱 실패·모르는 `kind`는 `console.warn`. `resetNativeMessageChannelForTest()`
  - ⚠️ **경고 로그에 원문을 남기지 않는다** — 응답 본문에 SDK 토큰이 실릴 수 있다 (ADR-3 Consequences). `kind`·`id`·사유만 남긴다
- [x] `request-native.ts` — `requestNative<T extends BridgeRequestType>(type, payload, { timeoutMs = DEFAULT_BRIDGE_TIMEOUT_MS })`: `isNativeApp()` 아니면 `UNAVAILABLE` 즉시 reject → `crypto.randomUUID()` → pending `Map` 등록 + 타이머 → `postMessage(JSON)`. 응답: `ok` → resolve, 아니면 `BridgeError(error.code, error.message)`. 타임아웃·응답 중 먼저 온 쪽이 이기고 나머지는 무시. `resetBridgeForTest()`
- [x] `native-events.ts` — `subscribeNativeEvent(type, listener)` → 해제 함수
- [x] `index.ts` 배럴 (`isNativeApp` · `requestNative` · `subscribeNativeEvent` · `BridgeError` · `isBridgeError` · 테스트용 reset 2종) · `shared/api/index.ts`에서 선택적 re-export
- [x] 테스트: `native-environment.test.ts`(AC-1) · `request-native.test.ts`(AC-2~7, fake timer · `window.ReactNativeWebView` stub · `Object.defineProperty(navigator, 'userAgent')`) · `native-events.test.ts`(AC-9)
- [x] 증분 검사: `pnpm --filter @repo/web check-types` · `exec vitest run src/shared/api/bridge`

### 4-2. `[features]` `apps/web/src/features/auth-login/`

- [x] `model/login-outcome.ts` — `WITHDRAWN_ACCOUNT_ERROR` · `readWithdrawnProviderId(error: unknown)` (콜백 페이지에서 이동, 본문 동일) · `resolveLoginDestination({ isOnboarded }): '/main' | '/onboarding'`
- [x] `model/login-outcome.test.ts` — axios 423 · 비-axios · message 비문자열 · `isOnboarded` 양쪽
- [x] `api/request-native-login.ts` — `NATIVE_LOGIN_TIMEOUT_MS = 120_000` · `requestNativeLogin(provider)` = `requestNative('AUTH_LOGIN', { provider }, { timeoutMs })`
- [x] `api/exchange-native-token.ts` — `exchangeNativeToken(provider, { tokenType, token })`: `naver`면 `tokenType === 'accessToken'` 확인 후 `oauthNaverLogin({ accessToken })`, 아니면 `tokenType === 'idToken'` 확인 후 `oauthLogin1({ idToken }, { provider })`. 계약 위반 조합은 `BridgeError('NATIVE_ERROR')` throw (Issue 4 AC-2). `oauthLogin1`이라는 생성 이름은 이 파일 안에서만 보인다
- [x] `api/use-native-login.ts` — `useMutation({ mutationFn: provider → requestNativeLogin → exchangeNativeToken, retry: false, onSuccess: setSession })`. 반환 타입은 `LoginResponse`
- [x] `api/use-native-login.test.tsx` — Issue 2 AC-1 · Issue 3 AC-1 · Issue 4 AC-1~2. `requestNative`는 `vi.mock('@/shared/api/bridge')`가 아니라 **UA stub + `ReactNativeWebView` stub + 응답 이벤트 발송**으로 실제 전송 계층을 태운다 (모킹 경계가 native뿐이어야 통합 가치가 있다)
- [x] `ui/social-login-button.tsx` — props에 `onLoginSuccess?: (response: LoginResponse) => void` · `onLoginError?: (error: unknown) => void` 추가. 두 훅 호출. `handleClick`: `isNativeApp()`이면 `startNativeLogin(provider, { onSuccess: onLoginSuccess, onError })`, 아니면 기존. `onError`: `isBridgeError(e, 'CANCELLED')` → 무시, `isBridgeError(e, 'UNSUPPORTED')` → `startOauthLogin(provider)`, 그 외 → `onLoginError?.(e)`. `disabled = disabled || isOauthPending || isNativePending`. 기존 주석("성공하면 href 전환이라 pending이 안 풀린다")은 웹 경로에만 해당함을 명시
- [x] `ui/social-login-button.test.tsx` 갱신 — 기존 케이스 유지(AC-7) + 앱 환경 케이스: CANCELLED(AC-3) · UNSUPPORTED 폴백(AC-4) · TIMEOUT(AC-5) · 성공 시 `onLoginSuccess` 호출
- [x] `index.ts` 배럴 — `useNativeLogin` · `readWithdrawnProviderId` · `resolveLoginDestination` 추가
- [x] 증분 검사: `check-types` · `exec vitest run src/features/auth-login`

### 4-3. `[pages]`

- [x] `pages/oauth-callback/ui/oauth-callback-page.tsx` — 지역 `readWithdrawnProviderId` · `WITHDRAWN_ACCOUNT_ERROR` 삭제, `login-outcome` 사용. `isOnboarded` 삼항도 `resolveLoginDestination`으로. **기존 테스트 무수정 통과**가 조건 (AC-8)
- [x] `pages/login/ui/login-page.tsx` — `useNavigate` + `handleLoginSuccess`(`resolveLoginDestination` → `navigate({ replace: true })`) · `handleLoginError`(`readWithdrawnProviderId` → `/restore` + `search: { providerId }`, 아니면 아무것도 안 함 — 표시는 `FEAT-017`). 두 핸들러를 `LoginPageNarrow`·`LoginPageWide`에 props로
- [x] `login-page-narrow.tsx` · `login-page-wide.tsx` — `LoginPageVariantProps { onLoginSuccess; onLoginError }` 받아 `SocialLoginButton`에 전달
- [x] `login-page.test.tsx` 갱신 — 라우터에 `/onboarding` · `/main` · `/restore` 더미 라우트 추가. AC-2(두 분기) · AC-6(`/restore` + `providerId`) · AC-3·5는 버튼 테스트가 이미 커버하므로 페이지에서는 "라우터 위치 `/` 유지"만 확인
- [x] 증분 검사: `check-types` · `exec vitest run src/pages`

### 4-4. `[native]` `apps/native/`

- [x] `bridge/bridge-handler-error.ts` — `class BridgeHandlerError extends Error { code: BridgeErrorCode }`
- [x] `bridge/create-bridge.ts` — `createBridge({ handlers, postMessage, onUnhandled })` → `{ handleMessage(event: WebViewMessageEvent), emit(type, payload) }`. `parseBridgeMessage` → `null`이면 `onUnhandled(raw)`; `kind === 'request'`면 핸들러 조회 → 없으면 `UNSUPPORTED` 응답 → 있으면 `await` 후 `ok: true` / `BridgeHandlerError`면 그 code / 그 외 `NATIVE_ERROR`(`message`는 `String(error)`)
- [x] `bridge/handlers/app-info.ts` — `Platform.OS` · `Constants.expoConfig?.version ?? 'unknown'`
- [x] `bridge/handlers/auth-login.ts` — **1차: `throw new BridgeHandlerError('UNSUPPORTED')`** + "2차에서 SDK 분기로 교체한다"는 제거 조건 주석. 핸들러 맵에 키를 미리 두면 2차에서 디스패처를 안 건드린다
- [x] `app/index.tsx` — `applicationNameForUserAgent={`${NATIVE_USER_AGENT_MARKER}/${version}`}` · `onMessage={bridge.handleMessage}` · `postMessage: (json) => webViewRef.current?.postMessage(json)` · 기존 `console.log('[WebView] browser event', …)`는 `onUnhandled`로
- [x] 증분 검사: `pnpm --filter native check-types lint` (패키지 이름은 `apps/native/package.json` 확인)
- [ ] **수동 iOS** — dev client에서 AC-10(`APP_INFO` 왕복 · `NOPE` → `UNSUPPORTED`) · AC-11(에러 리포트 로그 유지) · Issue 2 AC-11(Google 버튼 → `UNSUPPORTED` → `accounts.google.com` 폴백)

### 4-4-1. 구현 중 계획과 달라진 점

- native `app/index.tsx`의 브릿지를 `useMemo`가 아니라 **모듈 스코프**에 뒀다. 렌더 안에서 ref를 읽는 클로저가 react-compiler 린트(`react-hooks/refs`)에 걸린다. WebView는 이 화면 하나라 인스턴스도 모듈 변수(`webView`)로 콜백 ref에서 받는다
- features가 `@/shared/api/bridge`가 아니라 **`@/shared/api`** 를 import한다. `shared/api`에 세그먼트 배럴이 있어 steiger `fsd/no-public-api-sidestep`이 하위 경로를 막는다. §3의 "web에서 계약 패키지를 import하는 곳은 `shared/api/bridge`뿐"은 그대로다
- 테스트용 앱 환경 stub을 `shared/api/mocks/native-bridge.ts`로 뽑았다 (`mocks/server.ts`와 같은 자리). UA·`ReactNativeWebView`·응답 발송을 4개 테스트 파일이 공유한다
- `pages/login/ui/login-page-variant-props.ts` 추가 — narrow/wide가 같은 props 타입(`Pick<SocialLoginButtonProps, …>`)을 쓴다
- `SocialLoginButton`의 `onSuccess`를 `(response) => onLoginSuccess?.(response)`로 감쌌다. mutation 콜백의 나머지 인자(variables · context)가 prop 계약 밖으로 새지 않게

### 4-5. 마무리

- [x] `pnpm lint` → `check-types` → `test` → `build` (루트). 변경 파일 `prettier --check`
- [x] `ai-validate` → `checklist.md` (1차, 2026-09-12)

---

## 5. 리스크

| 리스크                                                                                | 영향                                           | 대응                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| metro가 워크스페이스 심링크 `@repo/bridge-protocol`의 `.ts` 소스를 못 찾음            | native 번들 실패                               | `node-linker = hoisted`라 루트 `node_modules/@repo/bridge-protocol` 심링크로 놓인다. Expo 57 metro는 monorepo 루트를 자동 감지한다. §4-4 첫 실행에서 확인, 실패 시 `metro.config.js`에 `watchFolders`·`nodeModulesPaths` 추가 |
| Vite/vitest가 링크된 패키지의 `.ts`를 pre-bundle하려다 실패                           | web dev/test 실패                              | 워크스페이스 링크는 기본적으로 pre-bundle 대상이 아니다. 문제 시 `optimizeDeps.exclude`                                                                                                                                       |
| `crypto.randomUUID` 미지원 환경                                                       | 요청 생성 실패                                 | WKWebView(iOS 15.4+)·jsdom(Node 19+) 모두 지원. 지원 범위가 앱 최소 iOS보다 넓다                                                                                                                                              |
| **SDK 토큰이 로그에 남음**                                                            | 토큰 유출 (ADR-3)                              | 채널의 `console.warn`은 원문을 찍지 않는다. `BridgeError.message`에도 토큰이 들어가지 않는다(에러 봉투에만 message). 리뷰 항목                                                                                                |
| 페이지 리로드 중 도착한 늦은 응답                                                     | 모르는 `id`로 버려짐                           | 의도된 동작 (ADR-1). 로그인은 pending 잠금이 새 문서에서 풀려 있어 재시도 가능                                                                                                                                                |
| `SocialLoginButton`에 두 mutation이 공존해 `isPending` 판단 누락                      | 연타 방지(`FIX-019`) 깨짐                      | `disabled`에 두 pending을 OR. 버튼 테스트 AC-3·5가 `disabled` 복귀를 본다                                                                                                                                                     |
| `UNSUPPORTED` 폴백이 앱 안에서 Google을 WebView로 보냄 (1차 상태)                     | 1차 완료 시점에 Google 앱 로그인은 여전히 불가 | 현재와 같다 — 후퇴가 아니다. 2차(Issue 3)가 푼다. `docs/implementation-status.md`에 "앱 Google 로그인은 2차 대기"로 기록                                                                                                      |
| `login-page.tsx`가 `useNavigate`를 쓰면 기존 `login-page.test.tsx` 라우터 셋업이 부족 | 테스트 실패                                    | 더미 라우트 3개 추가 (§4-3). 기존 케이스는 그대로                                                                                                                                                                             |
| react-compiler가 모듈 스코프 `Map`·리스너 등록을 오해                                 | 없음                                           | 훅·컴포넌트 밖의 일반 모듈이라 컴파일 대상이 아니다                                                                                                                                                                           |
| `applicationNameForUserAgent`의 버전이 `app.json` `version`과 어긋남                  | 강제 업데이트 판별 시 혼선(미래)               | `Constants.expoConfig.version`에서 읽어 한 곳만 본다. 1차 AC-10이 `appVersion === app.json.version`을 확인                                                                                                                    |

### 5-1. 검증 방법

| 대상                                               | 방법         | 근거 AC                                           |
| -------------------------------------------------- | ------------ | ------------------------------------------------- |
| 봉투 파싱 · UA 판별                                | 자동(단위)   | 1 AC-1·8                                          |
| 전송 계층 (타임아웃 · 순서 · 무시 · 에러 코드)     | 자동(단위)   | 1 AC-2~7·9                                        |
| 교환 훅 (provider 분기 · 계약 위반 · `setSession`) | 자동(MSW)    | 2 AC-1 · 3 AC-1 · 4 AC-1~2                        |
| 버튼 분기 (취소 · 폴백 · 타임아웃 · 브라우저 보존) | 자동(RTL)    | 2 AC-3~5·7                                        |
| 페이지 이동 (`/onboarding` · `/main` · `/restore`) | 자동(RTL)    | 2 AC-2·6                                          |
| 콜백 페이지 동작 보존                              | 자동(기존)   | 2 AC-8 — 기존 테스트 무수정 통과                  |
| 네이티브 왕복 · 에러 리포트 유지 · Google 폴백     | **수동 iOS** | 1 AC-10·11 · 2 AC-11 — `checklist.md`에 실행 기록 |

---

## 6. 완료 후 액션

- [x] **1차 완료 시** 작업 폴더는 `in-progress/`에 **남긴다** — 2차(native SDK)가 같은 ID로 이어진다. `plan.md`에 `---` 아래 2차 계획을 누적
- [ ] 확인 필요 2가 도착하면 2차 `ai-plan` (SDK 의존성 · `app.config.ts` · 핸들러 3분기 · 실기기 검증)
- [ ] 2차까지 끝나면 `work/done/`으로 이동
- [x] `docs/implementation-status.md` — `ACC-01` 비고에 1차 상태(브릿지 왕복 ✅ · SDK 로그인 2차 대기) 반영
- [ ] `docs/design-system/` 변경 없음 (UI 변경 없음 — 버튼 시각 상태 그대로)
- [ ] 새 규칙 후보: "브릿지 메시지 추가 = 계약 한 줄 + native 핸들러 하나" · "web에서 `@repo/bridge-protocol`은 `shared/api/bridge`만 import" → 2차 완료 후 `.claude/rules/`에 `bridge-convention.md`로 승격할지 판단

---

# NAT-025 구현 계획 — 2차 (카카오 native)

> `ai-plan` 2회차 (2026-09-12). 1차 계획 §0-0의 "2차"를 **카카오만** 먼저 한다. Google·Naver native는
> 자격 증명(iOS 클라이언트 ID · 네이버 iOS 등록)이 아직 없어 3차로 미룬다.
> **사용자 승인 전에는 구현으로 넘어가지 않는다.**

## 0. 범위와 선행 조건

| 항목                        | 상태                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| 번들 ID                     | ✅ `kr.inuappcenter.gravit` (2026-09-12 확정). Apple Developer 등록은 출시 단계 — 지금은 문자열만 쓴다 |
| 카카오 네이티브 앱 키       | ✅ `apps/native/.env`의 `KAKAO_NATIVE_APP_KEY` (사용자가 넣음, gitignore)                              |
| 카카오 콘솔 iOS 플랫폼 등록 | 🔲 **사용자/관리자** — 번들 ID로 등록. 안 하면 SDK가 `Misconfigured`·`InvalidClient`로 실패한다        |
| 카카오 콘솔 OpenID Connect  | 🔲 **사용자/관리자** — 켜지 않으면 `login()` 응답에 `idToken`이 없다. 핸들러가 `NATIVE_ERROR`로 알린다 |
| 실기기·카카오톡             | 🔲 AC-9용. 무료 Apple ID로 개인 서명 가능                                                              |

콘솔 두 항목은 코드와 병행 가능하다 — 구현·시뮬레이터 빌드까지는 막지 않고, 검증(AC-9·10)에서 필요하다.

**범위**: `issues.md` Issue 2 native 파트 전부 + 1차에서 미룬 수동 AC 3건(Issue 1 AC-10·11, Issue 2 AC-11).
**비범위**: Google·Naver native(3차) · Android 카카오 설정(별도 `NAT-`) · Android `package` 변경.

### 0-1. 라이브러리 사실 확인 (2026-09-12, GitHub `mym0404/react-native-kakao` main)

- `@react-native-kakao/core` · `@react-native-kakao/user` **2.4.6**. `user`는 `core` 2.4.6 정확히 peer. peer `expo >= 47`
- Expo config plugin `@react-native-kakao/core` — `{ nativeAppKey, ios: { handleKakaoOpenUrl } }`. **plugin이 iOS를 다 채운다**: `CFBundleURLTypes`에 `kakao{키}` · `LSApplicationQueriesSchemes`에 `kakaokompassauth`·`kakaolink`·`kakaoplus` · `handleKakaoOpenUrl: true`면 AppDelegate `application(_:open:options:)`에 `RNCKakaoUserUtil.handleOpen(url)` 삽입 (Swift·ObjC 모두). 수동 Xcode 편집 없음
- Android용 `expo-build-properties`의 `extraMavenRepos`(devrepo.kakao.com)는 **Android 빌드에만** 필요. iOS-only인 이번엔 넣지 않는다 — 범위 밖 설정을 미리 넣지 않는다
- 초기화: `initializeKakaoSDK(nativeAppKey)` — 모든 카카오 API 호출 전에 1회
- 로그인: `login()` from `@react-native-kakao/user` → `KakaoLoginToken { accessToken, refreshToken, idToken?: string, … }`. 카카오톡 설치면 앱 전환, 아니면 계정 로그인 웹 시트로 자동 폴백
- 에러: `code`는 Kakao iOS SDK enum case 이름 그대로 (`RNCkakaoUtil.swift` `reject`). 사용자 취소 → `ClientFailed(.Cancelled)` = **`'Cancelled'`**; 계정 로그인 시트에서 동의 거부 → `AuthFailed(.AccessDenied)` = **`'AccessDenied'`**. 이 둘을 `CANCELLED`로 정규화한다. 그 외는 `NATIVE_ERROR`에 `code: message`

## 1. 요구사항 분해

| #   | 요구사항                                                                            | 위치                           | AC              |
| --- | ----------------------------------------------------------------------------------- | ------------------------------ | --------------- |
| 1   | 번들 ID `kr.inuappcenter.gravit` · 카카오 plugin(`nativeAppKey` env) · URL scheme   | `apps/native/app.config.ts`    | 콘솔 등록 전제  |
| 2   | 앱 부팅 시 카카오 SDK 초기화                                                        | `apps/native/app/_layout.tsx`  | —               |
| 3   | `AUTH_LOGIN { provider: 'kakao' }` → `login()` → `idToken` 회신. 취소는 `CANCELLED` | `apps/native/bridge/handlers/` | Issue 2 AC-9·10 |
| 4   | `google`·`naver`는 계속 `UNSUPPORTED` (웹 폴백)                                     | 〃                             | Issue 2 AC-11   |
| 5   | `.env.example`에 키 이름 등록                                                       | `apps/native/.env.example`     | —               |

### 1-1. 관리 포인트

| 값                             | 상수 / 인라인                                          | 근거                                                                |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------- |
| 번들 ID                        | `app.json` 리터럴                                      | 배포 식별자. 한 곳                                                  |
| `KAKAO_NATIVE_APP_KEY`         | env → `app.config.ts` → plugin + `extra`               | 비밀은 아니지만(Info.plist에 박힌다) 환경별로 달라질 수 있는 설정값 |
| 취소로 볼 카카오 에러 코드 2종 | **상수** `KAKAO_CANCEL_ERROR_CODES` (핸들러 파일 상단) | SDK 계약. 실기기 검증에서 틀리면 여기만 고친다                      |

## 2. 영향 분석

| 구분     | 파일                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **신규** | `apps/native/app.config.ts` · `apps/native/bridge/handlers/kakao-login.ts`                                                                                                                                                 |
| **수정** | `apps/native/package.json` (의존성 2) · `apps/native/app.json` (`ios.bundleIdentifier` 추가) · `apps/native/app/_layout.tsx` · `apps/native/bridge/handlers/auth-login.ts` · `apps/native/.env.example` · `pnpm-lock.yaml` |
| **삭제** | 없음                                                                                                                                                                                                                       |

npm 의존성 추가: `@react-native-kakao/core@2.4.6` · `@react-native-kakao/user@2.4.6` (native만). web 변경 **없음**.

`app.json`은 그대로 두고 `app.config.ts`가 `({ config }) => ({ ...config, plugins: [...config.plugins, kakao], extra })`로 **얹는다.** Expo CLI는 두 파일이 같이 있으면 `app.json`을 base로 넘겨준다. 정적 값은 JSON에, env를 읽어야 하는 것만 TS에 둔다 — diff가 작고 이후 Google·Naver plugin도 같은 자리에 추가한다.

**Expo CLI가 `app.config.ts` 평가 시 `.env`를 자동 로드한다** (SDK 49+). `EXPO_PUBLIC_` 접두사 없이 `process.env.KAKAO_NATIVE_APP_KEY`를 읽을 수 있다. 런타임 JS(`initializeKakaoSDK`)에는 `extra.kakaoNativeAppKey`로 넘겨 `Constants.expoConfig?.extra`에서 읽는다.

## 3. 의존 관계 검증

native에는 FSD가 없다. `bridge/handlers/kakao-login.ts` → `@react-native-kakao/user` · `../bridge-handler-error`. `auth-login.ts`가 provider로 분기해 kakao 핸들러를 부른다. web은 건드리지 않으므로 훅·steiger 대상 없음.

## 4. 구현 계획 체크리스트

- [x] `pnpm --filter @repo/native add @react-native-kakao/core@2.4.6 @react-native-kakao/user@2.4.6`
- [x] `app.json` — `ios.bundleIdentifier: 'kr.inuappcenter.gravit'` (Android `package`는 건드리지 않는다 — 별도 `NAT-`)
- [x] `app.config.ts` — env에서 `KAKAO_NATIVE_APP_KEY` 읽어 `['@react-native-kakao/core', { nativeAppKey, ios: { handleKakaoOpenUrl: true } }]` 추가 + `extra.kakaoNativeAppKey`. 키가 없으면 **throw** — 없이 빌드하면 plugin이 어차피 throw하고, 사유가 우리 문구로 나오는 게 낫다
- [x] `.env.example` — `KAKAO_NATIVE_APP_KEY=` 추가 (설명 주석)
- [x] `app/_layout.tsx` — 모듈 상단에서 `initializeKakaoSDK(extra.kakaoNativeAppKey)`. 값이 없으면 `console.warn` 후 건너뛴다 (dev에서 `.env` 빠뜨린 경우 앱은 뜨고 로그인만 `NATIVE_ERROR`)
- [x] `bridge/handlers/kakao-login.ts` — `loginWithKakao(): Promise<BridgeResult<'AUTH_LOGIN'>>`: `login()` → `idToken` 없으면 `BridgeHandlerError('NATIVE_ERROR', 'idToken 없음 — 콘솔 OpenID Connect 확인')` → `{ tokenType: 'idToken', token }`. catch: `code ∈ KAKAO_CANCEL_ERROR_CODES` → `BridgeHandlerError('CANCELLED')`, 그 외 `BridgeHandlerError('NATIVE_ERROR', '{code}: {message}')`. **토큰을 로그에 남기지 않는다**
- [x] `bridge/handlers/auth-login.ts` — `switch (provider)`: `kakao` → `loginWithKakao()`, `google`·`naver` → `UNSUPPORTED` (3차 교체 조건 주석 유지)
- [x] 증분 검사: `pnpm --filter @repo/native check-types lint` · `pnpm exec prettier --check`
- [ ] **시뮬레이터 빌드**: `pnpm --filter @repo/native ios` (CNG — `ios/`는 gitignore, prebuild 자동). 첫 빌드에서 **metro 워크스페이스 심링크 해석**(1차 리스크)도 같이 확인된다
- [ ] **수동 AC (시뮬레이터)** — Issue 1 AC-10(`APP_INFO` 왕복 · `NOPE`→`UNSUPPORTED`) · AC-11(에러 리포트 로그) · Issue 2 AC-10(계정 로그인 시트 → `/onboarding`|`/main`, 시트 닫기 → 버튼 풀림) · AC-11(Google → `UNSUPPORTED` → `accounts.google.com`)
- [ ] **수동 AC (실기기, 카카오톡)** — Issue 2 AC-9(카카오톡 전환 → 동의 → 복귀 · 뒤로 가기 → 버튼 풀림)
- [ ] 루트 `lint` → `check-types` → `test` → `build` (web 무변경이라 통과가 기대값) · `ai-validate` 2회차

### 4-1. 코드 단계 결과 (2026-09-12, Windows 세션)

- `expo config --type prebuild`: `bundleIdentifier` · 카카오 plugin(`nativeAppKey` 32자 · `handleKakaoOpenUrl: true`) · `extra.kakaoNativeAppKey` 확인
- `expo config --type introspect`: plugin이 `LSApplicationQueriesSchemes` 3종과 `kakao{키}` URL scheme을 Info.plist에 넣는 것 확인. AppDelegate 삽입은 실제 prebuild(Mac)에서 확인
- 루트 `lint` · `check-types` · `test` · `build` 통과 (web 무변경)
- 시뮬레이터 빌드·수동 AC는 **Mac에서 사용자 실행** — 이 세션은 Windows

## 5. 리스크

| 리스크                                                     | 영향                                            | 대응                                                                                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| RN 0.86(New Architecture 전용) + kakao 2.4.6 호환          | 빌드 실패                                       | 2.x는 New Arch 지원 명시. 첫 `run:ios`에서 확인. 실패 시 3차 전에 버전 재검토                                                               |
| 콘솔 iOS 미등록·OIDC 미활성 상태에서 검증                  | `Misconfigured`/`idToken` 없음 → `NATIVE_ERROR` | 핸들러 메시지에 원인 힌트(`code`)를 싣는다. 코드 결함이 아니라 설정 미완이므로 checklist에 "콘솔 대기"로 구분 기록                          |
| 취소 코드 매핑 오류 (`Cancelled`·`AccessDenied` 외 케이스) | 취소가 `NATIVE_ERROR`로 보임                    | 실기기·시뮬레이터에서 카카오톡 뒤로 가기 · 시트 닫기 · 동의 거부 세 경로를 모두 밟아 `code`를 기록. 누락은 상수에 추가                      |
| `extra`로 넘긴 앱 키가 번들에 들어감                       | 없음                                            | 네이티브 앱 키는 URL scheme으로 Info.plist에 이미 박히는 공개 식별자다. 비밀은 REST client-secret이고 그건 앱에 없다                        |
| dev client 재빌드 필요 — 네이티브 모듈 추가                | 기존 dev client로는 `login`이 없음              | `expo run:ios`로 새로 빌드. Expo Go 불가(ADR-4)                                                                                             |
| `app.config.ts`가 `.env`를 못 읽는 환경 (CI 등)            | 빌드 throw                                      | 의도된 동작. `.env.example`과 throw 문구로 안내                                                                                             |
| 카카오톡 → 앱 복귀 URL 처리 누락                           | 카카오톡 로그인 후 앱이 결과를 못 받음          | `handleKakaoOpenUrl: true`가 AppDelegate를 채운다. prebuild 후 `ios/…/AppDelegate.swift`에 `RNCKakaoUserUtil.handleOpen` 있는지 눈으로 확인 |

### 5-1. 검증 방법

자동 테스트는 없다 (native 러너 없음, `issues.md` 서두). 수동 AC를 `checklist.md` 2회차에 **실행 일시·기기·결과·관찰한 `code`** 로 남긴다.

| 대상                               | 방법                                 | AC                                  |
| ---------------------------------- | ------------------------------------ | ----------------------------------- |
| 브릿지 왕복 · 미지원 · 에러 리포트 | 시뮬레이터 + Safari 웹 인스펙터 콘솔 | Issue 1 AC-10·11                    |
| 카카오 계정 로그인 (시트)          | 시뮬레이터                           | Issue 2 AC-10                       |
| 카카오톡 앱 전환                   | 실기기                               | Issue 2 AC-9                        |
| Google 폴백 경로 생존              | 시뮬레이터                           | Issue 2 AC-11                       |
| 설정 오류 → `NATIVE_ERROR`         | 시뮬레이터, 키를 틀리게 넣고         | (Issue 3 AC-4 형식을 카카오에 준용) |

## 6. 완료 후 액션

- [ ] `checklist.md`에 2회차 누적 · `spec.md` 확정 명세 표의 2차 행 갱신
- [ ] `docs/implementation-status.md` `ACC-01` 비고 — 앱 카카오 로그인 ✅
- [ ] 3차(Google·Naver) 선행 조건을 `spec.md` 확인 필요 2에 남은 항목으로 정리: Google iOS 클라이언트 ID · 네이버 iOS URL scheme·앱 이름
- [ ] 폴더는 계속 `in-progress/` (3차까지)

---

# NAT-025 구현 계획 — 3회차 (Issue 1~5)

> `ai-plan` 3회차 (2026-11-04, 같은 날 승인). 현재 `issues.md` 번호를 쓴다. 체크 표시는 2026-11-05 기준이고 검증 근거는 `checklist.md`의 「AC 대조」에 있다.
> Issue 6~8은 서버 답변 전이라 이 계획에 넣지 않는다.

## 0. 이슈 검토 결과

`issue-reviewer` 결과 중 실행을 막는 항목이다. 승인되면 `issues.md`를 먼저 고친다.

| #   | 대상              | 문제                                                                                                                                                                     | 조치                                                                                                                    |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | Issue 1 → Issue 3 | **역방향 의존.** Issue 1 수동 검증에 빌드가 필요한데, Issue 3 몫인 카카오 설정이 `app.config.ts`에 있어 키가 없으면 실패한다. 이 작업 폴더에도 `apps/native/.env`가 없다 | 키가 없으면 경고 후 카카오 plugin을 빼고 계속 진행한다. 같은 동작을 Issue 1 AC로 추가한다                               |
| 2   | Issue 1 AC-10     | `requestNative`는 번들 내부 함수라 웹 콘솔에서 부를 수 없다. WebView 원격 디버깅도 꺼져 있다                                                                             | When을 `window.ReactNativeWebView.postMessage(봉투)`와 `message` 수신으로 바꾼다. 개발 빌드에 `webviewDebuggingEnabled` |
| 3   | Issue 2 AC-2      | Given의 "`WEB_URL`이 아닌 페이지"가 재현 값이 아니다                                                                                                                     | `https://example.com/`으로 고정한다                                                                                     |
| 4   | Issue 7 · 8       | AC가 Given-When-Then이 아니고 Issue 8은 수정 대상도 없다                                                                                                                 | 서버 답변 전까지 **보류**. 이번에 승인하지 않는다                                                                       |

권고 항목은 다음과 같다.

- Issue 2는 요청 주소 확인과 운영 HTTP 차단의 두 결과가 섞여 있다. 커밋을 나눈다
- Issue 3은 AC가 12개이고 iOS·Android를 함께 본다. Android를 먼저 끝내고 iOS는 Mac 검증으로 분리한다
- Issue 5의 네이버 취소 신호가 아직 "취소 메시지"로만 적혀 있다. 소스에서 확인해 AC에 값으로 적는다
- Issue 6 구현 범위에 native `auth-login.ts`의 `apple` 분기가 빠져 있다. 서버 답변 후 함께 고친다

금지어 없음. 순번 중복 없음. 순환 의존 없음. `issues.md`의 GitHub Issue는 모두 미등록으로 적혀 있다.

## 1. 선행 조건

| 항목                                   | 담당             | 막는 것                |
| -------------------------------------- | ---------------- | ---------------------- |
| Android Studio · 에뮬레이터 또는 기기  | 사용자 환경      | Issue 1~5 Android 검증 |
| Mac · Xcode                            | 사용자           | iOS 검증 전부          |
| 카카오 앱 키 · iOS·Android 등록 · OIDC | 콘솔 관리자      | Issue 3 수동 AC        |
| Google 클라이언트 · SHA-1 · 검증 `aud` | 콘솔 관리자·서버 | Issue 4 수동 AC        |
| 네이버 클라이언트 · 시크릿 · 앱 등록   | 콘솔 관리자      | Issue 5 수동 AC        |
| GitHub Issue 등록 · 브랜치 이름 변경   | 사용자 승인      | 커밋                   |

자격 증명이 없어도 코드와 자동 검증은 진행한다. 수동 AC는 미실행으로 기록한다.

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | `packages/bridge-protocol/src/bridge-origin.ts` · `bridge-origin.test.ts` · `apps/native/bridge/handlers/google-login.ts` · `naver-login.ts`                     |
| 수정 | `packages/bridge-protocol/src/index.ts` · `apps/native/bridge/create-bridge.ts` · `handlers/auth-login.ts` · `handlers/kakao-login.ts`                           |
| 수정 | `apps/native/app/index.tsx` · `app/_layout.tsx` · `app.json` · `app.config.ts` · `.env.example` · `package.json` · `pnpm-lock.yaml`                              |
| 수정 | `apps/web/src/features/auth-login/model/login-outcome.ts` · `ui/social-login-button.tsx` · `social-login-button.test.tsx` · `pages/login/ui/login-page.test.tsx` |

orval 재생성 · 라우트 트리 재생성 없음.

## 3. 구현 계획

### Issue 1 — 브릿지 왕복 수동 확인

- [x] `issues.md`에 §0의 필수 수정 반영
- [x] `app.config.ts` — 키가 없으면 경고 후 카카오 plugin과 `extra` 값을 뺀다. `EAS_BUILD_PROFILE`이 `production`이면 지금처럼 실패시킨다
- [x] `app/index.tsx` — `webviewDebuggingEnabled={__DEV__}`
- [x] Android dev build. Metro의 `@repo/bridge-protocol` 해석 확인. 키 없이 빌드되는지 확인 — Windows 로컬 빌드는 경로 길이로 실패해 EAS로 대체했다. 키 없이 EAS Android 빌드가 성공했고, Metro가 `@repo/bridge-protocol`을 읽는 것은 iOS 기기 번들로 확인했다
- [ ] 수동 Android: AC-10 · AC-11. iOS는 Mac에서 — 에뮬레이터에서 실행하다 PC 메모리 부족으로 중단했다. iOS에서는 AC-11만 확인했다

### Issue 2 — 요청 주소 확인 · 운영 HTTP 차단

- [x] `[packages]` `isAllowedBridgeOrigin` + 테스트 (AC-1). `URL`을 쓰므로 패키지 `lib` 설정에 맞춰 타입을 확인한다 (URL 객체 대신 정규식으로 구현 — 계약 패키지에 DOM 타입이 없다)
- [x] `[native]` `createBridge`에 허용 주소 옵션. `request`만 검사하고, 봉투가 아닌 에러 리포트 경로는 그대로 둔다. 경고에 메시지 원문을 넣지 않는다
- [x] `[native]` `app/index.tsx`가 `WEB_URL`을 넘긴다
- [x] 커밋 분리 지점
- [x] `[native]` `NSAllowsArbitraryLoads` · `usesCleartextTraffic`을 `app.json`에서 `app.config.ts`로 옮긴다. `EAS_BUILD_PROFILE`이 `preview` · `production`이면 끈다. 값이 없으면(로컬 개발) 켠다. EAS에서 이 값을 설정 단계에 읽을 수 있는지 문서로 확인한다
- [ ] 수동: AC-2~4 — AC-3(프로필별 설정)만 확인했다. AC-2·4는 미실행

### Issue 3 — 카카오

- [x] `[native]` 3.2.0으로 올리고 초기화·로그인 API, plugin 옵션, 취소 코드를 소스에서 확인해 `kakao-login.ts` · `_layout.tsx` · `app.config.ts`를 맞춘다
- [x] `[features]` `UNSUPPORTED` 토스트 — 문구 상수 추가, 웹 폴백 제거. 버튼 테스트의 폴백 케이스를 AC-4로 바꾼다
- [x] `[native]` `auth-login.ts` · `create-bridge.ts`의 "웹이 폴백" 주석 수정
- [ ] 수동 Android: AC-9~11. 그 뒤 iOS와 같은 사용자인지 AC-12 — iOS 실기기에서 카카오 로그인 성공(AC-9 일부). Android와 AC-12는 미실행

### Issue 4 — Google

- [x] `[native]` 17.0.0 설치, plugin · env, `google-login.ts`. Original API만 쓴다. 취소 코드 정규화
- [x] `[native]` `auth-login.ts` 분기
- [ ] 수동: AC-2~5. `aud` 일치 먼저 확인 — iOS 실기기에서 Google 로그인 성공. `aud`는 서버가 토큰을 받아 줘서 통과로 보고 직접 디코딩은 안 했다. Android와 AC-5는 미실행

### Issue 5 — 네이버

- [x] `[native]` 5.0.1 설치, plugin · env, `naver-login.ts`. Android 설정과 취소 신호를 소스에서 확인해 AC에 적는다
- [x] `[native]` `_layout.tsx` 초기화 · `auth-login.ts` 분기
- [ ] 수동: AC-3~6 — iOS 실기기에서 네이버 로그인 성공. 취소·앱 전환·시크릿 오류·Android는 미실행

### 마무리

- [x] 이슈마다 `pnpm verify` · `checklist.md` 회차 누적 (커밋 단위로 확인했다. 마지막 `pnpm verify`는 `problem-card.test.tsx`의 간헐 시간 초과로 한 번 실패했고 단독 실행과 빌드는 통과 — 이번 작업과 무관)
- [x] `docs/implementation-status.md`의 앱 로그인 상태 갱신 (2026-11-05)
- [ ] `docs/fe-implement-spec/o-1/o-1.md`에 앱 환경 동작 절 추가 — Android · Apple 확인 뒤 한 번에
- [x] `spec.md` 확정 명세 표 갱신

## 4. 커밋 · PR 순서

`FEAT-017` 변경이 NAT-025 파일과 섞여 있어 아래 순서로 나눠 커밋했다 (2026-11-05, 사용자가 직접 커밋). 섞인 파일은 중간 버전을 만들어 나눴다.

1. 브릿지 계약 패키지 · SDK 의존성 · 잠금 파일
2. 웹 브릿지 전송 계층
3. 앱 쪽 브릿지와 `APP_INFO`
4. 요청 주소 확인(Issue 2) · 운영 빌드 HTTP 차단
5. 앱 SDK 로그인 (카카오 · Google · 네이버)
6. EAS 빌드 설정 · 업로드 제외 목록
7. 웹 SDK 로그인 흐름
8. 로그인 실패 토스트(`FEAT-017`) 코드와 문서
9. 이 문서들

## 5. 리스크

| 리스크                                                     | 영향                             | 대응                                                                                          |
| ---------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| 카카오 키 없이 plugin을 빼면 Android 빌드가 실패할 수 있음 | Issue 1 검증이 키에 묶임         | 첫 빌드로 확인한다. 실패하면 키 도착 후 검증으로 기록한다                                     |
| 요청 주소 확인이 실제 앱 주소를 막음                       | 모든 로그인이 `TIMEOUT`으로 보임 | 개발 주소 재작성(`rewriteLocalDevCallback`)과 운영 주소를 수동으로 확인한다                   |
| 운영 빌드에 HTTP 주소가 남음                               | 화면·API 차단                    | Issue 2 AC-4                                                                                  |
| 네이버 시크릿이 앱에 들어감                                | 앱 파일에서 추출될 수 있음       | 네이버 SDK 방식의 제약인지 소스에서 확인한다. 저장소에는 넣지 않고 위험을 사용자에게 보고한다 |
| Google 유료 API를 잘못 import                              | 라이선스 위반                    | import 경로를 리뷰한다                                                                        |
| SDK 취소 코드 매핑 오류                                    | 취소에 실패 토스트가 뜸          | SDK별 실제 경로에서 코드를 기록하고 상수로 고정한다                                           |
| 토큰 로그 노출                                             | 유출                             | 핸들러와 브릿지 로그에 토큰·원문을 남기지 않는다. 리뷰 항목                                   |
| `problem-card.test.tsx`의 부하 시 시간 초과                | `pnpm verify` · CI가 간헐 실패   | 이번 범위 밖. 다시 나오면 항목으로 뽑는다                                                     |

## 6. 검증

| 대상                     | 방법                                          |
| ------------------------ | --------------------------------------------- |
| 주소 확인 순수 함수      | 자동 (Issue 2 AC-1)                           |
| `UNSUPPORTED` 토스트     | 자동 (Issue 3 AC-4)                           |
| 브릿지 · SDK · 빌드 설정 | 수동. 일시 · 기기 · 결과 · 관찰한 코드를 기록 |
| 전체                     | 이슈마다 `pnpm verify`                        |

---

# NAT-025 구현 계획 — 4회차 (Apple: Issue 6 웹 · Issue 7 iOS 앱)

> `ai-plan` 4회차 (2026-11-05, 같은 날 승인). 체크 표시는 2026-11-06 기준이고 근거는 `checklist.md`의 「Apple 로그인 검증」에 있다.
> Issue 8(Android)은 제외한다 (사용자 지시). 서버 API가 확정돼 Issue 6·7의 전제가 바뀌었다 — `issues.md`의 Issue 6·7(AC 포함)은 이 계획이 승인되면 고친다.

## 0. 서버 API 확정으로 달라진 점

| 항목         | 이전 가정                         | 확정 (생성 코드 확인, 2026-11-05)                                                              |
| ------------ | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| 웹 경로      | 다른 provider처럼 인가 URL로 이동 | **Apple JS SDK 팝업** → `authorizationCode` → `POST /api/v1/oauth/apple?dest=` (`appleLogin1`) |
| iOS 앱 경로  | identityToken · nonce 전달        | `authorizationCode`만 → `POST /api/v1/oauth/ios/apple` (`appleLogin`, `oauth2-0-ios-api`)      |
| 앱 권한 범위 | —                                 | `EMAIL` 필수                                                                                   |
| 웹 로컬 확인 | 가능                              | **불가.** Apple은 localhost를 받지 않는다. 배포(dev) 도메인에서만 확인한다                     |
| redirectURI  | —                                 | `{dest 도메인}/login/oauth2/code/apple` (Apple 콘솔 Service ID에 등록돼 있어야 함)             |

웹은 `login-url/{provider}`로 URL을 받아 이동하지 않으므로 `useOauthLogin`을 재사용하지 않는다.

## 1. 착수 전 확인할 것 (사용자 · 서버)

- [ ] **웹 Service ID(Apple JS SDK의 `clientId`)** 값과, 개발·운영 도메인에서 쓸 redirectURI가 Apple 콘솔에 등록됐는지
- [x] iOS 코드 교환 — 처음엔 400으로 실패했고 서버 쪽 확인 후 앱 수정 없이 성공했다. 서버가 실제로 무엇을 바꿨는지는 기록이 없다
- [x] Android 앱의 Apple 버튼 — 별도 처리하지 않는다. Expo Android를 배포하지 않는다 (§5 결정 1은 적용하지 않음)
- [x] 앱 ID의 Sign in with Apple — iOS 실기기에서 시트가 뜨고 로그인이 끝나 동작을 확인했다

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | `features/auth-login/api/request-apple-web-login.ts` · `.test.ts` (JS SDK 로드 + 팝업)                                                              |
| 신규 | `features/auth-login/api/use-apple-web-login.ts`                                                                                                    |
| 신규 | `apps/native/bridge/handlers/apple-login.ts`                                                                                                        |
| 수정 | `packages/bridge-protocol/src/contracts.ts` (`provider`에 `apple`, `tokenType`에 `authorizationCode`) · 계약 테스트                                 |
| 수정 | `features/auth-login/model/login-providers.ts` (+test) · `api/exchange-native-token.ts` (+test) · `ui/social-login-button.tsx` (+test) · `index.ts` |
| 수정 | `shared/config/env.ts` (`VITE_APPLE_CLIENT_ID`) · `.env.example`                                                                                    |
| 수정 | `apps/native/bridge/handlers/auth-login.ts` · `app.config.ts` · `package.json` (`expo-apple-authentication ~57.0.1`)                                |
| 수정 | `pages/login` 화면은 `LOGIN_PROVIDERS.map`을 쓰므로 코드 변경 없음. 테스트만 확인                                                                   |
| 생성 | `shared/api/generated/**` — 사용자가 `generate:api`로 만들었다. **Apple과 무관한 변경(면접 · QA · 시즌 팝업)이 섞여 있어 별도 커밋으로 나눈다**     |

`routeTree.gen.ts` 재생성 불필요. `/login/oauth2/code/$provider`는 `LOGIN_PROVIDERS`에 `apple`이 들어가면 같이 통과하지만 팝업 흐름은 이 라우트를 거치지 않는다.

## 3. 의존 관계 검증

`pages → features/auth-login → shared(api · config)`, `native → bridge-protocol`. 모두 하향이고 cross-slice 없음. 생성 훅은 `features/auth-login/api/`에서만 import한다 (`api-convention.md` §3).

## 4. 구현 계획

### Issue 7 — iOS 앱 (먼저 한다: 계약을 웹보다 앞서 정해야 한다)

- [x] `[packages]` `contracts.ts` — `provider`에 `'apple'`, `tokenType`에 `'authorizationCode'`. 계약 테스트 갱신
- [x] `[native]` `expo install expo-apple-authentication` (`~57.0.x`) · `app.config.ts`에 플러그인 등록 (키가 필요 없어 `readEnvGroup` 대상 아님)
- [x] `[native]` `apple-login.ts` — `signInAsync({ requestedScopes: [EMAIL, FULL_NAME] })` → `authorizationCode`가 없으면 `NATIVE_ERROR` · 취소 코드(`ERR_REQUEST_CANCELED`)는 `CANCELLED`. **Android이면 `UNSUPPORTED`** · 토큰 로그 금지
- [x] `[native]` `auth-login.ts` — `apple` 분기
- [x] `[features]` `exchange-native-token.ts` — `apple`이면 `tokenType === 'authorizationCode'` 확인 후 `appleLogin({ code })`. 아니면 요청 전에 `NATIVE_ERROR`. 생성 이름(`appleLogin`/`appleLogin1`)은 이 파일 안에서만 보인다
- [x] `[features]` `login-providers.ts`에 `apple` 추가 (테스트 갱신) · `social-login-button.tsx`에 `apple` 변형(검정 배경 · 흰 글자) · `apple.svg` (`currentColor`라 글자색을 따른다)
- [x] 증분: `check-types` · `vitest run src/features/auth-login src/pages/login` · native `check-types lint` — 통과 (web 62건 · bridge-protocol 24건 · native 타입)
- [x] **개발 빌드를 다시 만든다**
- [ ] 수동 iOS 실기기: 로그인 성공 확인 (2026-11-06). 시트 닫기 · 재로그인은 기록이 없다

### Issue 6 — 웹 (브라우저)

- [x] `[shared]` `env.ts` — `getAppleClientId()` (`VITE_APPLE_CLIENT_ID`) · `.env.example`
- [x] `[features]` `request-apple-web-login.ts` — Apple JS SDK(`appleid.cdn-apple.com`)를 한 번만 로드 → `AppleID.auth.init({ clientId, scope: 'name email', redirectURI: {origin}/login/oauth2/code/apple, usePopup: true })` → `signIn()` → `authorization.code`. 팝업 닫힘(`popup_closed_by_user`)은 `CANCELLED`와 같은 취급
- [x] `[features]` `use-apple-web-login.ts` — `appleLogin1({ code }, { dest })` → `setSession`. `retry: false`
- [x] `[features]` `social-login-button.tsx` — 브라우저에서 `apple`이면 위 훅, 그 외는 기존 `useOauthLogin`
- [x] 테스트: SDK를 모킹한 코드 수신 · 취소는 오류 콜백 호출 안 함 · 교환 실패 시 `onLoginError`
- [ ] 수동: **배포(dev) 도메인**에서 Apple 로그인 → `/onboarding` | `/main`

### 마무리

- [ ] `checklist.md` 회차 누적 (`pnpm verify`: 포맷·린트·타입·빌드 통과, 테스트는 `problem-card.test.tsx` 간헐 시간 초과 1건 — 단독 통과, 무관) · `issues.md` AC 표시
- [x] `docs/implementation-status.md` · `docs/fe-implement-spec/o-1/o-1.md`
- [x] 커밋 분리 (실제 순서): 생성 API → 계약 + iOS 앱 → 웹 팝업 흐름 → 웹 교환 + 버튼 → 로고 크기 · 중심선 → 문서

## 5. 결정이 필요한 것

1. **Android 앱의 Apple 버튼.** Issue 8을 하지 않으므로 Android 앱에서 눌렀을 때의 동작이 필요하다.
   - A. 버튼은 보이고 눌렀을 때 `UNSUPPORTED` 토스트(「앱을 업데이트 해주세요」). 문구가 사실과 다르다
   - **B(권장). Android 앱에서는 Apple 버튼을 숨긴다.** 웹이 `navigator.userAgent`의 `Android`로 판별한다. 앱 기능 사전 판별(ADR-5가 거부한 것)이 아니라 플랫폼 사실이고, 숨김 조건을 한 곳에 둔다. Issue 8 때 지운다
2. 웹 Apple 로그인은 **배포 도메인에서만** 확인된다. 로컬에서는 코드와 단위 테스트까지만 확인한다.

## 6. 리스크

| 리스크                             | 영향                   | 대응                                                     |
| ---------------------------------- | ---------------------- | -------------------------------------------------------- |
| iOS client_id가 번들 ID와 다름     | iOS 로그인이 전부 실패 | 서버에 사전 확인 (§1)                                    |
| 웹 redirectURI가 Apple 콘솔에 없음 | 팝업이 오류로 닫힘     | 배포 도메인 등록 확인 후 수동 검증                       |
| JS SDK 로드 실패 · 차단            | 버튼이 반응 없음       | 로드 실패를 오류로 올려 공통 토스트(`FEAT-017`)를 띄운다 |
| 앱 심사에서 버튼 문구 지적         | 심사 반려              | 「Apple로 계속하기」로 교체 (spec 확인 필요 8)           |
| 탈퇴 시 Apple 토큰 철회 미처리     | 심사 요구 위반         | 서버에 확인. 이번 범위 밖이면 별도 항목으로 기록         |
| `authorizationCode` 재사용         | 두 번째 교환 실패      | 일회용이고 수명이 짧다. `retry: false` (이미 적용)       |

## 7. 검증

| 대상                  | 방법                                              |
| --------------------- | ------------------------------------------------- |
| 계약 · 토큰 교환 분기 | 자동 (`exchange-native-token.test` · 계약 테스트) |
| 버튼 · 웹 SDK 흐름    | 자동 (SDK 모킹). 실제 팝업은 수동 (배포 도메인)   |
| iOS 시트              | 수동 (EAS 개발 빌드 실기기)                       |
| 전체                  | `pnpm verify`                                     |

### 4회차 구현 중 계획과 달라진 점 (2026-11-05)

- 앱 로그인 요청 권한을 `EMAIL`만으로 줄였다. 서버가 이름을 받지 않아 불필요한 정보를 요청하지 않는다.
- Android 앱의 Apple 버튼 숨김은 하지 않기로 했다 (§5 결정 1). Expo Android 빌드를 배포하지 않고, 핸들러가 Android에서 `UNSUPPORTED`를 돌려주는 것까지만 넣었다. Expo Android를 배포하게 되면 Issue 8과 함께 다룬다.
- 웹 팝업 취소는 앱과 같은 `BridgeError('CANCELLED')`로 던져 버튼의 취소 처리를 공유한다.

### 4회차 추가 변경 (2026-11-06)

- 로고 크기와 중심선을 고쳤다. 시안(`12898:23111`)은 Google · 카카오 20×20, 네이버 17×16인데 구현은 글자 크기를 따라 15px이었다. 로고를 상자에 맞춰 넣고, 좁은 화면에서는 40px 자리의 가운데에 둔다. Apple은 시안이 없어 22px로 맞췄다
- 아이콘 · 스플래시(`NAT-011`)는 이 작업과 함께 구현했으나 PR을 나누기 위해 별도로 보관했다

---

# NAT-025 구현 계획 — 5회차 (iOS 앱 Google · 카카오 · 네이버를 iOS 경로로)

> `ai-plan` 5회차 (2026-11-07). **사용자 승인 전에는 구현으로 넘어가지 않는다.**

## 0. 바뀐 전제

`spec.md`는 "iOS도 우선 Android 경로를 쓰고, 차이가 없으면 서버가 통합한다"였다. 차이가 생겨 서버가 경로를 나눴다.

| 항목             | 이전                                          | 지금 (dev API 문서 · 서버 답변, 2026-11-07)                                                                            |
| ---------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| iOS 경로         | `/oauth/android?provider=` · `/android/naver` | `POST /api/v1/oauth/ios?provider=`(google · kakao) · `POST /api/v1/oauth/ios/naver`. 요청 · 응답 형태는 Android와 같다 |
| 리프레시 토큰 칸 | 사용자당 1개                                  | WEB · ANDROID · IOS 3칸. 칸은 토큰의 `client` 클레임으로 정해져 재발급 · 로그아웃에 클라이언트가 보낼 값이 없다        |
| Google `aud`     | 확인 필요                                     | 플랫폼과 무관하게 `webClientId`. 앱 변경 없음                                                                          |
| 생성 함수 이름   | android `oauthLogin1` · `oauthNaverLogin`     | android `oauthLogin2` · `oauthNaverLogin1`, ios `oauthLogin1` · `oauthNaverLogin`. **이름이 아니라 파일로 고른다**     |

이미 ANDROID 칸에 저장된 iOS 세션은 그 칸으로 계속 재발급되고, 다음 로그인부터 IOS 칸에 들어간다. 강제 로그아웃은 없다.
운영 서버에는 iOS 경로가 아직 없다 (운영 API 문서 58개 경로). 운영 배포 전에 앱 심사용 빌드를 운영 서버로 보내지 않는다.

**범위**: 앱 웹뷰의 토큰 교환 경로 선택. **비범위**: 재생성으로 함께 깨진 웹 쿠키 계약 5건(`FEAT-080`) · native 코드 · Android 앱 동작(경로 그대로).

## 1. 기술 결정 — 웹이 기기 종류를 아는 방법

| 안                                  | 판단                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`APP_INFO` 브릿지 (선택)**        | native가 `Platform.OS`로 답한다. 1차부터 모든 빌드에 있어 재빌드가 없다. 로그인마다 브릿지 왕복이 한 번 는다              |
| `navigator.userAgent`의 `iPhone` 등 | 동기라 단순하다. iPad 웹뷰는 데스크톱 UA(`Macintosh`)를 보낼 수 있다(`supportsTablet: true`) → iPad가 ANDROID 칸으로 간다 |
| `AUTH_LOGIN` 응답에 `platform` 추가 | 계약과 native를 고쳐야 하고 개발 빌드를 다시 만들어야 한다                                                                |

- `APP_INFO`는 `AUTH_LOGIN` **전에** 부른다. 실패하면 SDK 화면을 띄우지 않고 기존 오류 처리(`onLoginError` → 공통 토스트)로 간다
- Apple은 기기와 무관하게 지금처럼 `/oauth/ios/apple`이다. native가 Android에서 `UNSUPPORTED`를 돌려준다
- 결과를 캐시하지 않는다. 측정 근거가 없다 (`refactor-checklist.md` §5)

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 수정 | `features/auth-login/api/request-native-login.ts` — `requestNativePlatform()` (`requestNative('APP_INFO', {})`의 `platform`)                                        |
| 수정 | `features/auth-login/api/exchange-native-token.ts` — `platform` 인자. `ios`면 ios 파일, `android`면 android 파일의 생성 함수                                        |
| 수정 | `features/auth-login/api/use-native-login.ts` — 기기 확인 → SDK 로그인 → 교환                                                                                       |
| 수정 | `shared/api/mocks/native-bridge.ts` — 스텁이 `APP_INFO`에 자동 응답하는 선택 옵션 (`{ platform }`). 기본은 지금처럼 응답하지 않아 `request-native.test.ts`는 그대로 |
| 수정 | `use-native-login.test.tsx` · `ui/social-login-button.test.tsx` · `pages/login/ui/login-page.test.tsx` — 엔드포인트 · 요청 순서                                     |
| 문서 | `spec.md` (범위 재정의 · 용어 「Android 엔드포인트」 · 확인 필요 1) · `checklist.md` 5회차 · `docs/fe-implement-spec/o-1/o-1.md` 앱 환경 절(있으면)                 |

orval 재생성은 사용자가 이미 했다. 라우트 트리 재생성 없음. FSD: `features/auth-login/api` → `shared/api`(생성물 · 브릿지) 하향만.

## 3. 구현 계획

- [x] `[shared]` `mocks/native-bridge.ts` — `installNativeBridgeStub({ platform })`이면 `APP_INFO` 요청에 바로 응답한다
- [x] `[features]` `request-native-login.ts` — `requestNativePlatform()`. 타임아웃은 브릿지 기본값(10초)
- [x] `[features]` `exchange-native-token.ts` — `exchangeNativeToken(provider, token, platform)`. 생성 함수를 `ios*` · `android*` 별칭으로 import해 번호 이름이 파일 밖으로 새지 않게 한다. 주석의 "iOS도 같은 엔드포인트" 문장을 지운다
- [x] `[features]` `use-native-login.ts` — `platform` → `requestNativeLogin` → `exchangeNativeToken`
- [x] `[features]` `use-native-login.test.tsx` — iOS: google · kakao → `/oauth/ios?provider=` · naver → `/oauth/ios/naver`, android 경로는 안 부름 / Android: 기존 경로 / `APP_INFO` 실패 → `AUTH_LOGIN`을 보내지 않음 / 계약 위반 케이스 유지
- [x] `[features]` `social-login-button.test.tsx` · `[pages]` `login-page.test.tsx` — 스텁에 `platform: 'ios'`, 엔드포인트를 ios로
- [x] 증분: `exec vitest run src/features/auth-login src/pages/login` · `lint:fsd` · 변경 파일 eslint · prettier. `check-types`는 `FEAT-080` 5건이 남아 실패가 기대값 — **이번 2건이 사라졌는지**로 판정한다 (2026-11-07: vitest 11파일 71건 통과 · steiger · eslint · prettier 통과 · `check-types`는 `FEAT-080` 5건만 남음)
- [ ] 수동 iOS 실기기(dev 서버): google · 카카오 · 네이버 로그인 → 재실행 유지 → 로그아웃. 개발 빌드 재생성 불필요(웹만 바뀐다) — 세 로그인 성공(2026-11-07). 재실행 유지 · 로그아웃은 기록 없음
- [x] `spec.md` 갱신 (범위 재정의 · 용어 · 경계 조건 · 확인 필요 1 · Changelog). `docs/`에는 Android 경로를 적은 곳이 없어 변경 없음
- [x] `checklist.md` 5회차 — `ai-validate` · `docs/implementation-status.md` 갱신 이력

### 5회차 구현 중 계획과 달라진 점

- 테스트 대역이 자동 응답한 `APP_INFO`는 `postMessage` 기록에서 뺐다. 기존 테스트의 "요청 1건" 단언을 그대로 두고, 횟수는 `readAppInfoRequestCount()`로 본다
- 생성 함수는 플랫폼별 표(`LOGIN_BY_PLATFORM`)로 묶었다. Apple은 기기와 무관하게 iOS 경로라 표에 넣지 않았다
- `issues.md`의 Issue 2~5 AC에 남은 `/oauth/android` 문구는 고치지 않았다. 이슈 문서는 `feature-planner` 소유라 사용자 판단을 받는다

## 4. 리스크

| 리스크                                        | 영향                             | 대응                                                                                    |
| --------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| 생성 함수를 이름만 보고 고름                  | iOS가 Android 칸으로 감 (조용함) | 테스트가 경로를 단언한다. import에 파일 기준 별칭                                       |
| `APP_INFO` 응답 지연                          | 로그인 시작이 늦어짐             | 브릿지 기본 타임아웃. 실기기에서 체감 확인                                              |
| 웹을 iOS 경로로 배포했는데 서버에 경로가 없음 | 앱 로그인 404                    | dev는 반영 확인. **운영 웹 배포는 서버 운영 배포 뒤**로 묶는다 (`FEAT-080`과 같은 조건) |
| `check-types`가 `FEAT-080` 때문에 계속 실패   | 이 작업만으로 `pnpm verify` 불가 | 이 작업의 완료 판정은 증분 검사. 커밋 · PR은 `FEAT-080`과 순서를 맞춘다                 |

## 5. 확인 필요

1. **브랜치 · GitHub 이슈.** `#390`은 머지됐다. 이 변경을 올릴 이슈와 브랜치(`develop`에서 분기)를 정한다
