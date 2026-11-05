---
id: 'NAT-025'
---

# NAT-025 이슈 분해

> `feature-planner` 3단계 산출물. 근거는 `spec.md`의 범위 · 경계 조건 · ADR-1~4.
>
> **2026-11-04 재분해 (구성·순서 사용자 확정)** — Android · Apple · 보안 범위를 반영하고 실행 순서대로 번호를 다시 매겼다.
> `plan.md` · `checklist.md`와 `spec.md`의 2026-09 기록은 이전 번호를 쓴다. 이전 → 현재: 1 → 1, 2 → 3, 3 → 4, 4 → 5, 신규 → 2·6·7·8.
> **AC 표시 (2026-11-05)** — ☑ 확인됨 · ◐ 일부만 확인(남은 부분은 `checklist.md`의 「AC 대조」) · ☐ 미확인 · ⊘ 더는 해당 없음.
> Issue 6·7은 서버 API 확정 후 AC를 다시 썼다 (2026-11-06). Issue 8은 Expo Android를 배포하지 않아 보류한다.

## 수직 슬라이싱 원칙

> **"이 이슈만 완료하면 사용자에게 보여줄 수 있는 동작이 있는가?"**

Issue 1은 브릿지 왕복 한 건(`APP_INFO`)이 앱에서 실제로 돌아오는 것까지, Issue 2는 외부 페이지의 요청을 막는 것까지,
Issue 3은 카카오로 앱에서 로그인이 끝나는 것까지다. Issue 4·5는 provider를 하나씩 더하고, Issue 6~8은 Apple을 플랫폼별로 더한다. 레이어별(계약 → 전송 →
핸들러)로 쪼개지 않는다.

**이슈 크기**: 반나절~하루.
**의존성**: Issue 1 → Issue 2 → Issue 3 → (Issue 4 ∥ Issue 5). Issue 6 → (Issue 7 ∥ Issue 8)은 서버 답변 후 시작한다.

**검증 범위 레이블** — `단위`·`통합`은 `apps/web`의 vitest로 자동화한다. `apps/native`에는 테스트
러너가 없다(`expo lint` · `tsc`만). 네이티브 쪽 AC는 `수동(iOS)` · `수동(Android)`으로 표시하고 체크리스트에서
실기기·시뮬레이터·에뮬레이터로 확인한다. iOS 빌드는 Mac이 필요하므로 Windows에서는 Android부터 확인한다. 카카오톡·네이버 앱 간 전환은 시뮬레이터에서 검증할 수 없다
(ADR-4 Consequences).

---

## Issue 1: [Feat] 웹↔네이티브 브릿지 왕복을 만든다 (`APP_INFO`)

GitHub Issue: 미등록

### 설명

웹이 네이티브에 요청을 보내고 `id`로 짝지어진 응답을 Promise로 받는다. 응답이 없으면 타임아웃,
네이티브가 모르는 요청이면 `UNSUPPORTED`, 앱 밖이면 `UNAVAILABLE`로 실패가 구분된다. 첫 메시지는
`APP_INFO`(플랫폼·앱 버전)로, 이후 강제 업데이트 안내 같은 곳에서 그대로 쓴다. 이 이슈가 끝나면
앱에서 웹을 열었을 때 네이티브 응답이 웹에 도착한다.

### 구현 범위

**계약 — `packages/bridge-protocol` (신규, `@repo/bridge-protocol`)**

- `package.json` · `tsconfig.json` — 빌드 없이 `src/index.ts`를 그대로 노출. `check-types`만 등록
- `src/envelope.ts` — `BridgeRequest` · `BridgeResponse` · `BridgeEvent` 타입, `parseBridgeMessage(raw): BridgeMessage | null` (깨진 JSON·봉투 아님 → `null`)
- `src/error-codes.ts` — `BRIDGE_ERROR_CODES` · `BridgeErrorCode` (`TIMEOUT` `CANCELLED` `UNAVAILABLE` `UNSUPPORTED` `NATIVE_ERROR`)
- `src/contracts.ts` — `BridgeContracts { APP_INFO: { request: Record<string, never>; result: { platform: 'ios' | 'android'; appVersion: string } } }`
- 루트 `pnpm-workspace.yaml`은 이미 `packages/*`를 포함한다. `apps/web`·`apps/native` `package.json`에 `"@repo/bridge-protocol": "workspace:*"`

**web — `apps/web/src/shared/api/bridge/`**

- `native-environment.ts` — `isNativeApp()`: `navigator.userAgent`에 `GravitNative/` 포함 여부. `window.ReactNativeWebView` 타입 선언도 여기
- `bridge-error.ts` — `BridgeError extends Error { code }` · `isBridgeError(error, code?)`
- `request-native.ts` — `requestNative(type, payload, { timeoutMs = 10_000 })`. pending `Map<id, …>`, `message` 이벤트를 `window`의 캡처 단계에서 구독(iOS `window`·Android `document` 모두 수신), `resetBridgeForTest()`
- `native-events.ts` — `subscribeNativeEvent(type, listener)` → 해제 함수. 수신부만 (`MIG-005`가 메시지를 정의한다). 이 이슈에서는 AC-9로 구독·해제만 고정한다
- `index.ts` 배럴 · `shared/api/index.ts`에서 노출
- **폐기**: `shared/lib/use-bridge.ts` · `app/webview/webview-provider.tsx` — 커밋된 적 없는 미추적 스케치라 삭제 커밋이 아니라 파일 제거만 한다
- 테스트: `request-native.test.ts` · `native-events.test.ts` · `native-environment.test.ts`

**native — `apps/native/bridge/`**

- `create-bridge.ts` — `createBridge(handlers)` → `{ handleMessage(event), emit(type, payload) }`. `kind`가 없는 메시지(기존 에러 리포트)는 `onUnhandled`로 넘긴다
- `bridge-handler-error.ts` — `BridgeHandlerError(code, message?)`
- `handlers/app-info.ts` — `expo-constants`에서 플랫폼·버전
- `app/index.tsx` — `onMessage={bridge.handleMessage}` 연결, 기존 콘솔 로그는 `onUnhandled`로 유지. 개발 빌드에서만 `webviewDebuggingEnabled`
- `app.config.ts` — 카카오 키가 없으면 경고 후 카카오 설정만 뺀다. 운영 빌드는 실패시킨다. 브릿지 확인이 카카오 자격 증명에 묶이지 않게 한다
- **폐기**: `apis/use-apis.ts` (미추적 스케치)

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given `navigator.userAgent`가 `'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) GravitNative/1.0'`이다
When `isNativeApp()`을 호출한다
Then `true`를 반환한다. UA가 `'Mozilla/5.0 (iPhone; …) Safari/604.1'`이면 `false`를 반환한다

☑ **AC-2** (범위: 단위)
Given `isNativeApp()`이 `true`이고 `window.ReactNativeWebView.postMessage`가 `vi.fn()`이다
When `requestNative('APP_INFO', {})`를 호출하고, `postMessage`에 전달된 JSON의 `id`를 읽어 `window`에 `{ kind: 'response', id, ok: true, result: { platform: 'ios', appVersion: '1.0.0' } }`를 `message` 이벤트로 보낸다
Then `postMessage`가 1회 호출되고 그 JSON은 `{ kind: 'request', type: 'APP_INFO', payload: {} }`와 문자열 `id`를 가지며, Promise는 `{ platform: 'ios', appVersion: '1.0.0' }`으로 resolve된다

☑ **AC-3** (범위: 단위)
Given AC-2와 같은 환경에서 응답을 보내지 않는다
When `requestNative('APP_INFO', {}, { timeoutMs: 50 })`를 호출하고 fake timer를 50ms 진행한다
Then `BridgeError`로 reject되고 `error.code === 'TIMEOUT'`이다. 이후 같은 `id`의 응답을 보내도 `unhandledrejection`이 발생하지 않는다

☑ **AC-4** (범위: 단위)
Given `isNativeApp()`이 `false`다
When `requestNative('APP_INFO', {})`를 호출한다
Then `error.code === 'UNAVAILABLE'`로 즉시 reject되고 `postMessage`는 호출되지 않는다

☑ **AC-5** (범위: 단위)
Given AC-2와 같은 환경이다
When 응답으로 `{ kind: 'response', id, ok: false, error: { code: 'UNSUPPORTED', message: 'unknown type' } }`를 보낸다
Then `error.code === 'UNSUPPORTED'`이고 `error.message === 'unknown type'`이다

☑ **AC-6** (범위: 단위)
Given `requestNative('APP_INFO', {})`를 두 번 연속 호출해 `id`가 `id1`·`id2`다
When `id2`의 응답 `{ appVersion: '2' }`를 먼저, `id1`의 응답 `{ appVersion: '1' }`를 나중에 보낸다
Then 첫 Promise는 `appVersion === '1'`, 두 번째는 `appVersion === '2'`로 resolve된다

☑ **AC-7** (범위: 단위)
Given `requestNative('APP_INFO', {})`가 대기 중이다
When `message` 이벤트로 `'not json'` · `'{"foo":1}'` · `{ kind: 'response', id: 'unknown', ok: true, result: {} }`를 차례로 보낸다
Then 셋 다 무시되어 Promise는 계속 대기 중이고 `console.warn`이 3회 호출된다

☑ **AC-8** (범위: 단위)
Given `parseBridgeMessage`에 `'{"kind":"event","type":"AUTH_TOKEN","payload":{"token":"t"}}'`를 넘긴다
When 파싱한다
Then `{ kind: 'event', type: 'AUTH_TOKEN', payload: { token: 't' } }`를 반환하고, `'{"type":"window.error"}'`(기존 에러 리포트 형식)는 `null`을 반환한다

☑ **AC-9** (범위: 단위)
Given `subscribeNativeEvent('AUTH_TOKEN', listener)`를 호출해 해제 함수 `unsubscribe`를 받았다
When `message` 이벤트로 `{ kind: 'event', type: 'AUTH_TOKEN', payload: { token: 't' } }`를 보낸 뒤, `unsubscribe()`를 부르고 같은 이벤트를 한 번 더 보낸다
Then `listener`는 `{ token: 't' }`로 정확히 1회 호출된다. `type`이 `'OTHER'`인 이벤트는 해제 전에도 호출을 일으키지 않는다

☐ **AC-10** (범위: 수동 iOS · 수동 Android)
Given iOS 시뮬레이터와 Android 에뮬레이터에서 각각 개발 빌드로 웹을 열고, 웹 인스펙터에서 `window`와 `document`에 `message` 리스너를 단다
When `window.ReactNativeWebView.postMessage(JSON.stringify({ kind: 'request', id: 't1', type: 'APP_INFO', payload: {} }))`를 실행한다
Then 응답은 `id === 't1'` · `ok === true`이고 `result.platform`이 각각 `'ios'` · `'android'`, `result.appVersion`이 `app.json`의 `version`과 같다. `id: 't2'` · `type: 'NOPE'`을 보내면 응답은 `ok === false` · `error.code === 'UNSUPPORTED'`다

◐ **AC-11** (범위: 수동 iOS · 수동 Android)
Given 웹이 로드된다
When `injectedJavaScriptBeforeContentLoaded`의 `DOMContentLoaded` 리포트가 도착한다
Then 기존처럼 `[WebView] browser event` 로그가 찍히고 브릿지 응답은 나가지 않는다

☑ **AC-12** (범위: 수동)
Given `KAKAO_NATIVE_APP_KEY`가 없다
When `apps/native`에서 `expo config --type prebuild`를 실행한다
Then `EAS_BUILD_PROFILE`이 없으면 설정이 출력되고 `plugins`에 `@react-native-kakao/core`가 0개이며 `[app.config]` 경고가 찍힌다. `EAS_BUILD_PROFILE=production`이면 `KAKAO_NATIVE_APP_KEY` 문구로 실패한다

### 의존성

없음

---

## Issue 2: [Security] 앱 웹 주소에서 온 브릿지 요청만 처리하고 운영 빌드의 HTTP를 끈다

GitHub Issue: 미등록

### 설명

WebView가 외부 페이지로 이동해도 그 페이지가 SDK 로그인을 시작하거나 토큰을 받지 못하게 한다. 운영 빌드에서는 HTTP 통신도 막는다. 토큰이 브릿지로 오가기 전에 끝낸다 (ADR-6).

### 구현 범위

- `packages/bridge-protocol` — `isAllowedBridgeOrigin(messageUrl, allowedUrl)` 순수 함수와 테스트
- `apps/native/bridge/create-bridge.ts` — 메시지의 `nativeEvent.url` 확인. 허용되지 않으면 핸들러를 부르지 않고 응답도 보내지 않으며 `console.warn`을 남긴다. 경고에 메시지 원문은 넣지 않는다
- `apps/native/app/index.tsx` — `WEB_URL`을 허용 주소로 전달
- `apps/native/app.json` · `app.config.ts` — `NSAllowsArbitraryLoads` · `usesCleartextTraffic`을 개발 빌드에서만 켠다. `eas.json`의 `development` · `preview` · `production` 프로필로 구분하는 방법은 구현 때 확인한다

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given 허용 주소가 `'https://dev.gravit.inuappcenter.kr/'`다
When `isAllowedBridgeOrigin`에 메시지 주소를 넘긴다
Then `'https://dev.gravit.inuappcenter.kr/main'`은 `true`, `'https://evil.example/'` · `'http://dev.gravit.inuappcenter.kr/'` · `'https://dev.gravit.inuappcenter.kr.evil.example/'` · `'not a url'`은 모두 `false`다

☐ **AC-2** (범위: 수동 Android · 수동 iOS)
Given 개발 빌드 앱에서 `https://example.com/`으로 이동한다
When 그 페이지에서 `AUTH_LOGIN` 봉투를 `window.ReactNativeWebView.postMessage`로 보낸다
Then SDK 화면이 뜨지 않고 응답 메시지가 0건이며 `[bridge]` 경고가 1회 찍힌다

☑ **AC-3** (범위: 수동)
Given `apps/native`에서 `production`과 `development` 프로필 환경으로 각각 `expo config --type prebuild`를 실행한다
When 결과의 `NSAllowsArbitraryLoads` · `usesCleartextTraffic`을 본다
Then `production`은 둘 다 `true`가 아니고 `development`는 둘 다 `true`다

☐ **AC-4** (범위: 수동 Android · 수동 iOS)
Given `production` 프로필 설정으로 빌드한 앱을 연다
When 로그인 화면을 불러오고 로그인 API를 호출한다
Then 화면과 API가 HTTPS로 응답하고 네트워크 차단 오류가 0건이다

### 의존성

Issue 1 완료 후 시작

---

## Issue 3: [Feat] 앱에서 카카오 SDK로 로그인한다 (iOS · Android)

GitHub Issue: 미등록

### 설명

앱 환경에서 「카카오로 시작하기」를 누르면 WebView 안에서 인가 페이지로 가는 대신 네이티브
카카오 SDK가 뜨고, 받은 `idToken`으로 웹이 백엔드에 로그인해 온보딩 또는 메인으로 이동한다.
사용자가 SDK 화면을 닫으면 버튼이 풀리고, 앱이 처리하지 못하는 provider면 토스트로 안내한다. 이 이슈가
끝나면 앱에서 로그인이 처음으로 된다.

### 구현 범위

**계약**

- `packages/bridge-protocol/src/contracts.ts` — `AUTH_LOGIN: { request: { provider: 'google' | 'kakao' | 'naver' }; result: { tokenType: 'idToken' | 'accessToken'; token: string } }`

**web**

- `features/auth-login/api/request-native-login.ts` — `requestNativeLogin(provider)`: `requestNative('AUTH_LOGIN', { provider }, { timeoutMs: 120_000 })`
- `features/auth-login/api/use-native-login.ts` — `useNativeLogin()`: 위 요청 → provider에 따라 `oauthLogin1`(google·kakao, `?provider=`) 또는 `oauthNaverLogin` 호출 → `setSession`. 생성 함수 이름 `oauthLogin1`은 operationId 충돌 산물이라 여기서 `exchangeNativeToken`으로 감싼다. `retry: false`
  - 위치 기준: 서버 mutation을 감싸는 훅은 `api/`에 둔다 (`use-oauth-callback.ts`와 같은 자리). 기존 `model/use-oauth-login.ts`는 이동하지 않는다 — 범위 밖
- `features/auth-login/model/login-outcome.ts` — `readWithdrawnProviderId(error)`를 `pages/oauth-callback`에서 이리로 옮기고, `resolveLoginDestination(response): '/onboarding' | '/main'`을 함께 둔다. 세 진입 경로(콜백·네이티브·향후 Android)가 같은 판정을 쓴다
- `features/auth-login/ui/social-login-button.tsx` — `isNativeApp()`이면 `useNativeLogin`, 아니면 기존 `useOauthLogin`. `CANCELLED`는 무시, `UNSUPPORTED`는 토스트 안내(웹 폴백 없음, ADR-5), 그 외는 pending 해제. 결과는 `onLoginSuccess(response)` · `onLoginError(error)` prop으로 위에 알린다 — 이동은 페이지가 정한다
- `pages/login/ui/login-page.tsx` — `onLoginSuccess`·`onLoginError` 핸들러를 **여기서 한 번만** 만들어 `LoginPageNarrow`·`LoginPageWide`에 props로 내린다. 두 시안 컴포넌트는 형제라 각자 붙이면 판정이 갈라진다. 핸들러 안의 판정은 `login-outcome`을 호출한다 (`isOnboarded` → `/onboarding` | `/main`, `USER_423` → `/restore`)
- `pages/oauth-callback/ui/oauth-callback-page.tsx` — 지역 `readWithdrawnProviderId`를 지우고 `login-outcome`을 쓴다
- 배럴 갱신 · 테스트: `use-native-login.test.tsx` · `social-login-button.test.tsx` 갱신 · `login-page.test.tsx` 갱신

**native**

- 의존성: `@react-native-kakao/core` · `@react-native-kakao/user` (3.2.0). 초기화·로그인 API, plugin 옵션, 취소 코드를 소스에서 다시 확인한다 (ADR-4 개정)
- `app.json` → `app.config.ts` — 번들 ID 확정값, kakao plugin에 `nativeAppKey`(env `KAKAO_NATIVE_APP_KEY`). `.env.example` 갱신
- `app/_layout.tsx` — `initializeKakaoSDK`
- `bridge/handlers/auth-login.ts` — provider 분기. `kakao`: `login()` → `idToken` (OIDC). 사용자 취소 → `BridgeHandlerError('CANCELLED')`, 그 외 → 기본 `NATIVE_ERROR`. `google`·`naver`는 이 이슈에서 `BridgeHandlerError('UNSUPPORTED')` — 웹이 토스트로 안내한다

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given `isNativeApp()`이 `true`, `requestNative`가 `{ tokenType: 'idToken', token: 'kakao_id_tok' }`으로 resolve하도록 모킹, MSW가 `POST /api/v1/oauth/android`에 `{ accessToken: 'at_1', refreshToken: 'rt_1', isOnboarded: false, role: 'USER' }`로 응답한다
When `useNativeLogin().mutateAsync('kakao')`를 호출한다
Then 요청 query `provider === 'kakao'`, body `{ idToken: 'kakao_id_tok' }`이고, 반환값 `isOnboarded === false`, `getSessionToken() === 'at_1'`이다

☑ **AC-2** (범위: 통합)
Given AC-1 환경에서 `LoginPage`를 라우터와 함께 렌더한다
When 「카카오로 시작하기」를 클릭한다
Then 라우터 위치가 `/onboarding`이다. MSW 응답이 `isOnboarded: true`면 `/main`이다

☑ **AC-3** (범위: 통합)
Given `requestNative`가 `BridgeError('CANCELLED')`로 reject한다
When 「카카오로 시작하기」를 클릭하고 reject가 끝난다
Then 버튼의 `disabled`가 `false`로 돌아오고, 라우터 위치는 `/`이며, `POST /api/v1/oauth/android` 요청은 0건이다

☑ **AC-4** (범위: 통합)
Given `requestNative`가 `BridgeError('UNSUPPORTED')`로 reject한다
When 「카카오로 시작하기」를 클릭하고 reject가 끝난다
Then 토스트 `'해당 로그인을 사용할 수 없습니다. 앱을 업데이트 해주세요.'`가 1회 표시되고, 버튼 `disabled === false`이며, `GET /api/v1/oauth/login-url/kakao` 요청은 0건이다. `CANCELLED` · `TIMEOUT` · `NATIVE_ERROR`에서는 이 토스트가 뜨지 않는다

☑ **AC-5** (범위: 통합)
Given `requestNative`가 `BridgeError('TIMEOUT')`로 reject한다
When 「카카오로 시작하기」를 클릭하고 reject가 끝난다
Then 버튼 `disabled === false`, 라우터 위치 `/`, `POST /api/v1/oauth/android` 0건이다

☑ **AC-6** (범위: 통합)
Given `requestNative`는 성공하고 MSW가 `POST /api/v1/oauth/android`에 `423 { error: 'USER_423', message: 'pid_9' }`로 응답한다
When 「카카오로 시작하기」를 클릭한다
Then 라우터 위치가 `/restore`이고 search `providerId === 'pid_9'`다

☑ **AC-7** (범위: 통합)
Given `navigator.userAgent`에 `GravitNative/`가 없다
When 「카카오로 시작하기」를 클릭한다
Then `window.ReactNativeWebView.postMessage`는 호출되지 않고 `GET /api/v1/oauth/login-url/kakao`가 1건 나간다 (기존 동작 그대로)

☑ **AC-8** (범위: 통합)
Given `pages/oauth-callback`이 `login-outcome`의 `readWithdrawnProviderId`를 쓰도록 바뀌었다
When 기존 `oauth-callback-page.test.tsx`를 실행한다
Then 기존 테스트가 모두 통과한다 (동작 보존)

◐ **AC-9** (범위: 수동 iOS · 수동 Android · 각 실기기, 카카오톡 설치)
Given 앱에서 로그인 화면을 연다
When 「카카오로 시작하기」→ 카카오톡 전환 → 동의
Then 앱으로 복귀해 라우트가 `/onboarding`(신규) 또는 `/main`(기존)이다. 카카오톡에서 뒤로 가기로 돌아오면 버튼의 `disabled`가 풀리고 라우트는 `/` 그대로다

☐ **AC-10** (범위: 수동 iOS · 시뮬레이터 / 수동 Android · 에뮬레이터, 카카오톡 미설치)
Given 시뮬레이터 또는 에뮬레이터에서 앱을 연다
When 「카카오로 시작하기」를 누른다
Then 카카오 계정 로그인 웹 시트가 뜨고 로그인하면 AC-9와 같은 결과다. 시트를 닫으면 버튼의 `disabled`가 풀리고 라우트는 `/` 그대로다

⊘ **AC-11** (범위: 수동 iOS · 수동 Android)
Given 앱에서 「Google로 시작하기」를 누른다 (이 이슈에서 native는 `UNSUPPORTED`)
When 응답이 온다
Then AC-4의 토스트가 뜨고 WebView 주소는 그대로이며 `accounts.google.com`으로 이동하지 않는다

☐ **AC-12** (범위: 수동)
Given 같은 카카오 계정으로 iOS와 Android에서 각각 로그인한다
When 두 기기에서 `GET /api/v1/users`를 호출한다
Then 응답의 `userId`가 같다 (확인 필요 1)

### 의존성

Issue 2 완료 후 시작. **확인 필요 2**(카카오 네이티브 앱 키 · iOS·Android 콘솔 등록 · OpenID Connect)가 없으면 native 검증을 할 수 없다

---

## Issue 4: [Feat] 앱에서 Google SDK로 로그인한다 (iOS · Android)

GitHub Issue: 미등록

### 설명

앱 환경에서 「Google로 시작하기」가 WebView 대신 네이티브 Google 로그인 시트를 띄운다. Google이
embedded WebView OAuth를 차단해 지금은 앱에서 Google 로그인이 아예 불가능하다 — 이 이슈가 그
경로를 연다.

### 구현 범위

**web** — 변경 없음. `useNativeLogin`이 `google`도 `oauthLogin1(?provider=google)`로 보낸다 (Issue 3에서 provider 분기 완성)

**native**

- 의존성: `@react-native-google-signin/google-signin` (17.0.0). 무료 "Original" API만 import한다 (`@react-native-google-signin/google-signin`의 `GoogleSignin` — universal 모듈 금지)
- `app.config.ts` — plugin에 `iosUrlScheme`(iOS 클라이언트 ID의 reversed scheme, env)
- `bridge/handlers/auth-login.ts` — `google`: `GoogleSignin.configure({ iosClientId, webClientId })` → `signIn()` → `idToken`. `statusCodes.SIGN_IN_CANCELLED` → `CANCELLED`
- `.env.example` — `GOOGLE_IOS_CLIENT_ID` · `GOOGLE_WEB_CLIENT_ID`
- Android — 콘솔에 패키지와 SHA-1 등록. 추가 설정은 17.0.0 문서에서 확인한다

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given `requestNative`가 `{ tokenType: 'idToken', token: 'g_id_tok' }`으로 resolve하고 MSW가 `POST /api/v1/oauth/android`에 200으로 응답한다
When `useNativeLogin().mutateAsync('google')`를 호출한다
Then 요청 query `provider === 'google'`, body `{ idToken: 'g_id_tok' }`이다

◐ **AC-2** (범위: 수동 iOS · 시뮬레이터 / 수동 Android · 에뮬레이터 또는 실기기)
Given 앱에서 로그인 화면을 연다
When 「Google로 시작하기」→ Google 계정 선택
Then 라우트가 `/onboarding` 또는 `/main`이다. 시트를 닫으면 버튼의 `disabled`가 풀리고 라우트는 `/` 그대로다

◐ **AC-3** (범위: 수동)
Given iOS와 Android에서 각각 백엔드에 전달된 `idToken`을 개발 환경에서 로컬로 디코딩한다 (토큰을 외부 사이트에 붙여 넣지 않는다)
When `aud`를 본다
Then 두 토큰의 `aud`가 모두 백엔드가 검증하는 클라이언트 ID와 일치한다 (확인 필요 2의 `webClientId`)

◐ **AC-4** (범위: 수동 iOS · 시뮬레이터)
Given `GOOGLE_IOS_CLIENT_ID`를 존재하지 않는 값으로 바꿔 빌드한다 (설정 오류 재현)
When 「Google로 시작하기」를 누른다
Then 웹 콘솔에 `BridgeError`의 `code === 'NATIVE_ERROR'`가 찍히고 버튼의 `disabled`가 풀린다. 앱은 죽지 않는다

☐ **AC-5** (범위: 수동)
Given 같은 Google 계정으로 iOS와 Android에서 각각 로그인한다
When 두 기기에서 `GET /api/v1/users`를 호출한다
Then 응답의 `userId`가 같다 (확인 필요 1)

### 의존성

Issue 3 완료 후 시작 (provider 분기·토스트·페이지 이동이 거기서 만들어진다). Issue 5와 병렬 가능

---

## Issue 5: [Feat] 앱에서 네이버 SDK로 로그인한다 (iOS · Android)

GitHub Issue: 미등록

### 설명

앱 환경에서 「네이버로 시작하기」가 네이버 앱 또는 네이버 로그인 시트로 이어진다. 네이버는
`idToken`이 없어 SDK `accessToken`을 `/oauth/android/naver`로 보낸다.

### 구현 범위

**web** — 변경 없음. `useNativeLogin`이 `naver`를 `oauthNaverLogin({ accessToken })`으로 보낸다 (Issue 3에서 완성)

**native**

- 의존성: `@react-native-seoul/naver-login` (5.0.1)
- `app.config.ts` — plugin에 `urlScheme`. `LSApplicationQueriesSchemes`(`naversearchapp` · `naversearchthirdlogin`)는 plugin이 채우면 그대로, 안 채우면 `ios.infoPlist`에 직접 넣는다 — 착수 시 plugin 소스에서 확인
- `app/_layout.tsx` — `NaverLogin.initialize({ consumerKey, consumerSecret, appName, serviceUrlSchemeIOS })`
- `bridge/handlers/auth-login.ts` — `naver`: `login()` → `successResponse.accessToken`. `isSuccess === false`이고 사용자 취소 메시지면 `CANCELLED`, 그 외 `NATIVE_ERROR`
- `.env.example` — `NAVER_CLIENT_ID` · `NAVER_CLIENT_SECRET` · `NAVER_URL_SCHEME`
- Android — 네이버 개발자센터에 패키지 등록. 필요한 빌드 설정은 5.0.1 문서와 plugin 소스에서 확인한다

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given `requestNative`가 `{ tokenType: 'accessToken', token: 'nv_at' }`으로 resolve하고 MSW가 `POST /api/v1/oauth/android/naver`에 200으로 응답한다
When `useNativeLogin().mutateAsync('naver')`를 호출한다
Then `POST /api/v1/oauth/android/naver` body가 `{ accessToken: 'nv_at' }`이고 `POST /api/v1/oauth/android`는 0건이다

☑ **AC-2** (범위: 단위)
Given `requestNative`가 `naver`에 `{ tokenType: 'idToken', token: 'x' }`(계약 위반)로 resolve한다
When `useNativeLogin().mutateAsync('naver')`를 호출한다
Then `BridgeError('NATIVE_ERROR')`로 reject되고 백엔드 요청은 0건이다

◐ **AC-3** (범위: 수동 iOS · 수동 Android · 각 실기기, 네이버 앱 설치)
Given 앱에서 로그인 화면을 연다
When 「네이버로 시작하기」→ 네이버 앱 전환 → 동의
Then 라우트가 `/onboarding` 또는 `/main`이다. 네이버 앱에서 취소하고 돌아오면 버튼의 `disabled`가 풀리고 라우트는 `/` 그대로다

☐ **AC-4** (범위: 수동 iOS · 시뮬레이터 / 수동 Android · 에뮬레이터, 네이버 앱 미설치)
Given 시뮬레이터 또는 에뮬레이터에서 앱을 연다
When 「네이버로 시작하기」를 누른다
Then 네이버 로그인 웹 시트가 뜨고 로그인하면 AC-3과 같은 결과다. 시트를 닫으면 버튼의 `disabled`가 풀린다

☐ **AC-5** (범위: 수동 iOS · 시뮬레이터 또는 수동 Android · 에뮬레이터)
Given `NAVER_CLIENT_SECRET`을 잘못된 값으로 바꿔 빌드한다 (설정 오류 재현)
When 「네이버로 시작하기」→ 로그인 시트에서 로그인한다
Then 웹 콘솔에 `BridgeError`의 `code === 'NATIVE_ERROR'`가 찍히고 버튼의 `disabled`가 풀린다. 앱은 죽지 않는다

☐ **AC-6** (범위: 수동)
Given 같은 네이버 계정으로 iOS와 Android에서 각각 로그인한다
When 두 기기에서 `GET /api/v1/users`를 호출한다
Then 응답의 `userId`가 같다 (확인 필요 1)

### 의존성

Issue 3 완료 후 시작. Issue 4와 병렬 가능

---

## Issue 6: [Feat] 브라우저에서 Apple로 로그인한다

GitHub Issue: 미등록

### 설명

로그인 화면에 검정 배경 · 흰 글자 「Apple로 시작하기」 버튼이 나타나고, 브라우저에서는 Apple JS SDK 팝업으로 로그인한다. 다른 provider와 달리 인가 페이지로 이동하지 않는다.

### 구현 범위

- `features/auth-login/api/request-apple-web-login.ts` · `use-apple-web-login.ts`
- `features/auth-login/model/login-providers.ts` · `ui/social-login-button.tsx` · `apple.svg`
- `shared/config/env.ts` — `VITE_APPLE_CLIENT_ID`

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 통합)
Given `LoginPage`를 렌더한다
When 버튼을 조회한다
Then 버튼이 Google · 카카오 · 네이버 · Apple 순서로 4개이고 마지막 문구가 「Apple로 시작하기」다

☑ **AC-2** (범위: 통합)
Given 브라우저 환경이고 Apple SDK의 `signIn`이 `{ authorization: { code: 'apple_web_code' } }`로 응답한다
When 「Apple로 시작하기」를 클릭한다
Then `POST /api/v1/oauth/apple` 본문이 `{ code: 'apple_web_code' }`이고 `onLoginSuccess`가 1회 호출되며, `GET /api/v1/oauth/login-url/apple`은 0회다

☑ **AC-3** (범위: 통합)
Given Apple SDK의 `signIn`이 `{ error: 'popup_closed_by_user' }`로 실패한다
When 「Apple로 시작하기」를 클릭한다
Then 버튼이 풀리고 `onLoginError`와 교환 요청은 0회다

☑ **AC-4** (범위: 통합)
Given 교환 요청이 500으로 실패한다
When 「Apple로 시작하기」를 클릭한다
Then `onLoginError`가 1회 호출된다

☐ **AC-5** (범위: 수동)
Given dev 배포 환경에 `VITE_APPLE_CLIENT_ID`가 있고 Return URL이 Services ID에 등록돼 있다
When 브라우저에서 Apple 계정으로 로그인한다
Then 라우트가 `/onboarding` 또는 `/main`이다

### 의존성

Issue 7의 계약 · 버튼과 같은 변경으로 나간다. AC-5는 dev 배포가 필요하다. Apple이 localhost를 받지 않는다

---

## Issue 7: [Feat] iOS 앱에서 Apple로 로그인한다

GitHub Issue: 미등록

### 설명

iOS 앱에서 네이티브 Apple 로그인 시트로 `authorizationCode`를 받아 웹이 서버와 교환한다.

### 구현 범위

- `expo-apple-authentication` · `apps/native/bridge/handlers/apple-login.ts` · `packages/bridge-protocol` 계약
- `features/auth-login/api/exchange-native-token.ts`

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 통합)
Given 앱 환경이고 `AUTH_LOGIN`이 `{ tokenType: 'authorizationCode', token: 'apple_code' }`로 응답한다
When `useNativeLogin`으로 `apple` 로그인을 실행한다
Then `POST /api/v1/oauth/ios/apple` 본문이 `{ code: 'apple_code' }`이고 `/oauth/android`는 0회이며 세션이 만들어진다

☑ **AC-2** (범위: 통합)
Given `AUTH_LOGIN`이 `apple`에 `idToken`으로 응답한다 (계약 위반)
When `useNativeLogin`으로 `apple` 로그인을 실행한다
Then `NATIVE_ERROR`로 실패하고 교환 요청은 0회다

◐ **AC-3** (범위: 수동)
Given iOS 개발 빌드 실기기
When Apple 계정으로 로그인한다
Then 라우트가 `/onboarding` 또는 `/main`이다

☐ **AC-4** (범위: 수동)
Given iOS 개발 빌드 실기기에 Apple 시트가 떠 있다
When 시트를 닫는다
Then 버튼이 풀리고 실패 토스트는 0회다

☐ **AC-5** (범위: 수동)
Given 탈퇴한 Apple 계정
When 탈퇴 처리를 마친다
Then Apple 토큰이 철회된다. 서버 처리 여부를 확인한 뒤 범위를 정한다

### 의존성

서버 `POST /api/v1/oauth/ios/apple`. 앱 ID의 Sign in with Apple 기능

---

## Issue 8: [Feat] Android 앱에서 Apple로 로그인한다

GitHub Issue: 미등록 · **상태: 보류 (2026-11-06 사용자 결정).** Android 앱은 다른 개발자가 따로 배포하고 Expo Android는 배포하지 않는다. 담당자가 이탈해 Expo Android를 배포하게 되면 다시 연다

### 설명

Android 앱에서 시스템 브라우저로 Apple 인가를 거쳐 앱으로 돌아와 로그인한다. WebView 안에서 진행하지 않는다.

### 구현 범위

방식이 정해지지 않았다 (**확인 필요 6**). 정해지면 복귀 경로 · 토큰 전달 · `originWhitelist` 별도 작업과의 관계를 함께 쓴다.

### 완료 조건 (Acceptance Criteria)

방식 확정 후 작성한다. 최소 포함 항목: 로그인 성공 이동 · 브라우저 닫기 취소 · 복귀 실패 · iOS와 같은 사용자 확인

### 의존성

Issue 6 완료 후 시작. **확인 필요 5·6** 답변 필요. Issue 7과 병렬 가능

---

## 시퀀스 검토

- [x] 각 의존성이 실제 입력·계약 관계를 근거로 하나 — 2는 1의 `createBridge`를, 3은 2의 요청 검사를, 4·5는 3의 provider 분기·토스트·페이지 이동을, 7·8은 6의 버튼·계약을 쓴다
- [x] 순환 의존성이 없고, 독립 이슈는 병렬로 진행할 수 있게 표시했나 — 4 ∥ 5 · 7 ∥ 8
- [x] 선행 이슈가 빠져 다음 이슈 구현이 불가능한 구간이 없나 — 외부 선행: **확인 필요 2**(자격 증명)가 3·4·5의 native 검증을, **확인 필요 5·6**(서버)이 6·7·8을 막는다
  - 실행 순서 (사용자 확정): Issue 1 수동 확인 → Issue 2 → Issue 3 → Issue 4 ∥ 5 → 서버 답변 후 Issue 6 → Issue 7 ∥ 8
- [x] `spec.md`의 Out of Scope 항목이 어떤 이슈에도 들어가 있지 않나 — 토큰 네이티브 보관(`subscribeNativeEvent`는 수신부 골격만, 메시지 없음) · 실패 사유 표시 · 쿠키 전환 · `originWhitelist` 모두 제외. `UNSUPPORTED` 토스트는 ADR-5의 범위다
