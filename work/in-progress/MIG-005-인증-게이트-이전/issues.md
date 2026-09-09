---
id: 'MIG-005'
---

# MIG-005 이슈 분해

> `refactor-planner` 산출물. 근거는 `spec.md`의 현행 동작 기준선 A~F, ADR-1~4, Migration Map.

## 동작 보존 단위 원칙

구조 변경이므로 판단 기준이 신규 기능과 다르다.

> **"이 이슈만 완료하면 기존 동작이 그대로 유지되는가?"**

레이어별 수평 분할(엔티티 이슈 → API 이슈 → 라우트 이슈)을 하지 않는다. 각 이슈는 계약 하나를
끝까지 옮기고 그 계약을 검증한다.

**슬라이스 배치** — `entities/auth`(세션·토큰) · `entities/user`(사용자 조회) ·
`features/auth-login` · `features/auth-logout`. 두 엔티티는 서로를 참조하지 않고, 합치는 판정은
`app`이 한다.

---

## Issue 1: [Feat] 세션 계약과 토큰 저장소를 구성한다

GitHub Issue: [#196](https://github.com/Team-Gravit/gravit-web/issues/196)

### 설명

`apps/web`에는 `configureAuth`(주입 지점)가 있지만 호출자가 없어 요청에 토큰이 붙지 않는다.
세션을 만드는 지점을 하나로 모으고, 부팅 시 저장소에서 복원해 주입한다. 이 이슈가 끝나면
저장된 토큰이 실제로 요청에 실린다.

### 구현 범위

- `entities/auth/model/auth-store.ts` — `accessToken` · `isRestored`
- `entities/auth/model/auth-storage.ts` — 저장소 읽기·쓰기·삭제 (키는 legacy와 동일)
- `entities/auth/model/session-contract.ts` — `setSession` · `getSessionToken` · `clearSession`,
  마지막에 `configureAuth` 주입
- `entities/auth/index.ts` 배럴 — 계약과 store 훅만 노출한다
- `shared/api/index.ts` 배럴 — `configureAuth` 등을 공개 API로 노출한다
- `app/auth/auth-provider.tsx` — 부팅 시 복원 후 `isRestored` 확정
- `src/main.tsx` — 프로바이더 연결
- `vitest.setup.ts` + `shared/api/mocks/server.ts` — 통합 AC 검증용 MSW 하네스
- OpenAPI 재생성 반영 커밋

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given 저장소에 `accessToken: 'tok_abc'`가 있다
When `getSessionToken()`을 호출한다
Then `'tok_abc'`를 반환한다

☐ **AC-2** (범위: 통합)
Given 저장소에 `accessToken: 'tok_abc'`가 있고 프로바이더 마운트가 끝났다
When 생성 API 훅으로 요청을 보낸다
Then 요청 헤더 `Authorization`이 `'Bearer tok_abc'`다

☐ **AC-3** (범위: 통합)
Given 저장소가 비어 있다
When 생성 API 훅으로 요청을 보낸다
Then 요청에 `Authorization` 헤더가 없고 요청은 서버로 나간다

☐ **AC-4** (범위: 단위)
Given 저장소와 store가 비어 있다
When `setSession({ accessToken: 'tok_new', refreshToken: 'ref_new' })`를 호출한다
Then 저장소의 `accessToken`과 `useAuthStore.getState().accessToken`이 모두 `'tok_new'`이고,
저장소의 `refreshToken`이 `'ref_new'`다

☐ **AC-5** (범위: 통합)
Given `accessToken: 'tok_abc'`로 요청을 보낸다
When 서버가 `401`을 반환한다
Then 저장소와 store의 `accessToken`이 모두 `null`이다

☐ **AC-6** (범위: 단위)
Given 앱 부팅 직후 복원이 끝나지 않았다
When `useAuthStore.getState().isRestored`를 읽는다
Then `false`이고, 복원이 끝난 뒤 다시 읽으면 `true`다

☐ **AC-7** (범위: 단위)
Given 저장소에 `refreshToken: 'ref_1'`이 있다
When `clearSession()`을 호출한다
Then 저장소의 `accessToken`과 `refreshToken`이 모두 `null`이다

### 의존성

없음

---

## Issue 2: [Feat] 만료된 액세스 토큰을 자동으로 재발급한다

GitHub Issue: [#197](https://github.com/Team-Gravit/gravit-web/issues/197)

### 설명

기준선 C3~C7의 갱신 흐름을 옮긴다. 401을 받으면 재발급 후 원요청을 한 번 재시도하고, 동시에
여러 401이 발생해도 재발급은 한 번만 나간다. 이 이슈가 끝나면 액세스 토큰 만료가 곧바로
로그아웃으로 이어지지 않는다.

### 구현 범위

- `shared/api/refresh-token.ts` — 재발급 호출, single-flight 큐
- `shared/api/axios-instance.ts` — 응답 인터셉터에 갱신·재시도 연결
- `apps/legacy-web`의 `features/auth/use-refresh-token.tsx`는 옮기지 않는다 (죽은 파일)

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given 토큰이 있는 요청이 `401`을 받는다
When 인터셉터가 응답을 처리한다
Then `POST /api/v1/auth/reissue`가 1회 호출되고 원요청이 1회 재시도된다

☐ **AC-2** (범위: 단위)
Given 재시도한 요청이 다시 `401`을 받는다
When 인터셉터가 응답을 처리한다
Then 재발급을 다시 호출하지 않고 에러를 호출부로 전파한다

☐ **AC-3** (범위: 단위)
Given 서로 다른 요청 3건이 동시에 `401`을 받는다
When 인터셉터가 응답을 처리한다
Then 재발급 요청은 1회만 나가고, 3건 모두 같은 새 토큰으로 재시도된다

☐ **AC-4** (범위: 단위)
Given 저장소에 `accessToken: 'tok_old'` · `refreshToken: 'ref_1'`이 있다
When 재발급이 `{ accessToken: 'tok_new' }`를 반환한다
Then 저장소의 `accessToken`은 `'tok_new'`, `refreshToken`은 `'ref_1'` 그대로다

☐ **AC-5** (범위: 단위)
Given 갱신 과정에서 `403`을 받는다
When 인터셉터가 실패를 처리한다
Then 저장소의 `accessToken`과 `refreshToken`이 지워지지 않는다

☐ **AC-6** (범위: 단위)
Given 갱신이 `500`으로 실패한다
When 인터셉터가 실패를 처리한다
Then 토큰이 지워지고 `notifyUnauthorized()`가 1회 호출된다

☐ **AC-7** (범위: 단위)
Given 재발급 요청 자체가 `401`을 받는다
When 인터셉터가 응답을 처리한다
Then 재발급을 다시 호출하지 않는다

### 의존성

Issue 1 완료 후 시작

---

## Issue 3: [Feat] 소셜 로그인과 로그아웃을 이전한다

GitHub Issue: 미등록

### 설명

기준선 D1·D3~D9와 E1을 옮긴다. 소셜 버튼에서 인가 URL을 받아 이동하고, 콜백에서 코드를
교환해 세션을 만든 뒤 온보딩 여부에 따라 목적지를 나눈다. 이 이슈가 끝나면 웹에서 로그인과
로그아웃이 동작한다.

### 구현 범위

- `features/auth-login/api/get-login-url.ts` · `model/use-oauth-login.ts` ·
  `api/use-oauth-callback.ts`
- `features/auth-logout/model/use-logout.ts`
- `pages/oauth-callback/ui/oauth-callback-page.tsx`
- `app/routes/login.oauth2.code.$provider.tsx` — 라우트 어댑터
- `app/routes/_protected.main.tsx` · `_protected.onboarding.tsx` — **이동 목적지 자리만** 만든다.
  화면 본체는 별도 작업이다
- `returnTo` 저장(D2)은 옮기지 않는다

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 로그인 화면에서 provider가 `'google'`이다
When 소셜 버튼을 클릭한다
Then `GET /api/v1/oauth/login-url/google`이 1회 호출되고 응답 URL로 이동한다

☐ **AC-2** (범위: 통합)
Given 콜백 경로에 `?code=abc123`이 있다
When 콜백 화면이 마운트되고 리렌더가 2회 더 일어난다
Then `POST /api/v1/oauth/google`이 `{ code: 'abc123' }`으로 **1회만** 호출된다

☐ **AC-3** (범위: 통합)
Given 콜백 응답이 `{ accessToken:'t1', refreshToken:'r1', isOnboarded:true }`다
When 콜백 처리가 끝난다
Then 저장소의 `accessToken`이 `'t1'`이고 `/main`으로 replace 이동한다

☐ **AC-4** (범위: 통합)
Given 콜백 응답의 `isOnboarded`가 `false`다
When 콜백 처리가 끝난다
Then `/onboarding`으로 replace 이동한다

☐ **AC-5** (범위: 통합)
Given 콜백이 에러코드 `USER_423`, message `'google_123'`으로 실패한다
When 콜백 처리가 끝난다
Then `/restore?providerId=google_123`으로 이동한다

☐ **AC-6** (범위: 통합)
Given `accessToken: 't1'`으로 로그인한 상태이고 Query 캐시에 항목이 1개 이상 있다
When 로그아웃을 실행한다
Then 저장소 토큰이 `null`이고 Query 캐시 항목이 `0`개이며 `/`로 replace 이동한다

☐ **AC-7** (범위: 단위)
Given `import.meta.env.DEV`가 `true`다
When 인가 URL 요청의 `dest`를 계산한다
Then `'local'`이다

### 의존성

Issue 1 완료 후 시작

---

## Issue 4: [Feat] 인증·온보딩 게이트를 라우트에 적용한다

GitHub Issue: 미등록

### 설명

기준선 B1~B3과 F1~F3을 라우트 게이트 하나로 옮긴다. 로그인 여부와 온보딩 완료 여부를 한 곳에서
판정해, 화면이 늘어도 분기가 복제되지 않게 한다. 이 이슈가 끝나면 미인증·미온보딩 접근이 막힌다.

### 구현 범위

- `entities/user/api/` — 생성 `useGetUser` 노출 (`isOnboarded` 판정 근거)
- `entities/user/index.ts` 배럴
- `app/routes/_protected.tsx` — `beforeLoad` 판정 + `pendingComponent`
- Issue 3에서 만든 목적지 라우트를 `_protected` 아래로 배치

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 저장소에 토큰이 없다
When `/main`으로 진입한다
Then `/`로 redirect되고 `/main`의 내용이 렌더되지 않는다

☐ **AC-2** (범위: 통합)
Given 토큰이 있고 사용자 조회가 `{ isOnboarded: false }`를 반환한다
When `/main`으로 진입한다
Then `/onboarding`으로 redirect된다

☐ **AC-3** (범위: 통합)
Given 토큰이 있고 사용자 조회가 `{ isOnboarded: true }`를 반환한다
When `/onboarding`으로 진입한다
Then `/main`으로 redirect된다

☐ **AC-4** (범위: 통합)
Given 토큰이 있고 사용자 조회가 `{ isOnboarded: true }`를 반환한다
When `/main`으로 진입한다
Then redirect 없이 `/main`의 내용이 렌더된다

☐ **AC-5** (범위: 통합)
Given 토큰이 있고 사용자 조회가 `500`으로 실패한다
When `/main`으로 진입한다
Then `/`로 redirect되지 않고, 재시도할 수 있는 화면이 렌더된다

☐ **AC-6** (범위: 통합)
Given 토큰이 있고 사용자 조회가 `401`로 실패한다
When `/main`으로 진입한다
Then 저장소 토큰이 `null`이 되고 `/`로 redirect된다

☐ **AC-7** (범위: 통합)
Given 사용자 조회 응답이 아직 도착하지 않았다
When `/main`으로 진입한다
Then 대기 화면이 렌더되고 `/main`의 내용이 렌더되지 않는다

☐ **AC-8** (범위: 통합)
Given 토큰이 있고 사용자 조회가 `{ isOnboarded: false }`를 반환한다
When `/onboarding`으로 진입한다
Then redirect 없이 `/onboarding`의 내용이 렌더된다

☐ **AC-9** (범위: 통합)
Given 게이트가 `{ isOnboarded: false }`를 한 번 읽은 뒤 서버 값이 `{ isOnboarded: true }`로 바뀌었다
When 생성 queryKey 팩토리로 사용자 조회를 무효화하고 `/main`으로 진입한다
Then `/onboarding`으로 redirect되지 않고 `/main`의 내용이 렌더된다

### 의존성

Issue 3 완료 후 시작 (목적지 라우트가 있어야 redirect 대상이 타입으로 성립한다)

### 후속 작업에 넘기는 계약

온보딩 제출 화면은 이 작업의 범위가 아니다. 다만 게이트가 서버 값을 읽으므로, **온보딩 제출이
성공하면 생성 queryKey 팩토리로 사용자 조회를 무효화해야 한다**는 계약이 생긴다. 무효화가 없으면
게이트가 이전 값을 보고 온보딩 화면으로 되돌린다. 온보딩 화면 이전 작업의 AC에 포함한다.

---

## Issue 5: [Feat] 네이티브와 세션을 주고받는 계약을 만든다

GitHub Issue: 미등록

### 설명

앱 WebView에서 세션이 이어지도록 웹 쪽 메시지 계약을 만든다. 웹이 세션을 소유하고 네이티브에
보관을 요청하며, 앱 재실행 시 네이티브가 보낸 토큰으로 복원한다. 네이티브 수신부는 별도 `NAT-`
작업이며, 수신부가 없어도 웹 동작은 바뀌지 않는다.

### 구현 범위

- `entities/auth/model/native-message.ts` — 메시지 4종 타입과 대기 상한 상수
- `entities/auth/model/native-bridge.ts` — `postMessage` 전송, 네이티브 컨텍스트 판별
- `entities/auth/model/session-contract.ts` — 전송 지점 연결
- `app/auth/auth-provider.tsx` — 수신·핸드셰이크 대기

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given `navigator.userAgent`에 `'GravitNative/1.0'`이 포함된다
When 네이티브 컨텍스트를 판별한다
Then `true`를 반환하고, 포함되지 않으면 `false`를 반환한다

☐ **AC-2** (범위: 통합)
Given 네이티브 컨텍스트다
When `setSession({ accessToken: 'tok_a', refreshToken: 'ref_a' })`를 호출한다
Then `{ type: 'AUTH_SIGNED_IN', payload: { token: 'tok_a' } }`가 1회 전송된다

☐ **AC-3** (범위: 통합)
Given 네이티브 컨텍스트다
When `clearSession()`을 호출한다
Then `{ type: 'AUTH_SIGNED_OUT' }`가 1회 전송된다

☐ **AC-4** (범위: 통합)
Given 네이티브 컨텍스트이고 저장소가 비어 있다
When 네이티브가 `{ type: 'AUTH_TOKEN', payload: { token: 'tok_b' } }`를 보낸다
Then store의 `accessToken`이 `'tok_b'`이고 `AUTH_SIGNED_IN`은 전송되지 않는다

☐ **AC-5** (범위: 통합)
Given 네이티브 컨텍스트이고 저장소가 비어 있으며 네이티브가 아무 메시지도 보내지 않는다
When 대기 상한이 지난다
Then `isRestored`가 `true`이고 store의 `accessToken`이 `null`이다

☐ **AC-6** (범위: 통합)
Given 네이티브 컨텍스트이고 저장소에 `accessToken: 'tok_c'`가 있다
When 프로바이더가 마운트된다
Then 대기 상한을 기다리지 않고 `isRestored`가 `true`가 된다

☐ **AC-7** (범위: 단위)
Given 브라우저 컨텍스트다
When `setSession({ accessToken: 'tok_a', refreshToken: 'ref_a' })`를 호출한다
Then `window.ReactNativeWebView.postMessage`가 호출되지 않는다

### 의존성

Issue 1 완료 후 시작

---

## 시퀀스

```
Issue 1 ─┬─ Issue 2  (토큰 갱신)
         ├─ Issue 3 ── Issue 4  (로그인 → 게이트)
         └─ Issue 5  (네이티브 계약)
```

Issue 2 · 3 · 5는 Issue 1 이후 병렬로 진행할 수 있다.

## 시퀀스 검토

- [x] 각 의존성이 실제 입력·계약 관계를 근거로 하나
      — Issue 4는 Issue 3이 만든 목적지 라우트가 없으면 redirect 대상이 타입으로 성립하지 않는다.
      Issue 2·5는 Issue 1의 세션 계약만 있으면 되고 서로 무관하다
- [x] 순환 의존성이 없고, 독립 이슈는 병렬로 진행할 수 있게 표시했나
- [x] 선행 이슈가 빠져 다음 이슈 구현이 불가능한 구간이 없나
- [x] `spec.md`의 Out of Scope 항목이 어떤 이슈에도 들어가 있지 않나
      — 온보딩·로그인 화면 본체, `/restore` 화면, `returnTo` 복귀, 네이티브 앱 구현은 어느
      이슈의 구현 범위에도 없다. Issue 3의 목적지 라우트는 **빈 자리**만 만든다
