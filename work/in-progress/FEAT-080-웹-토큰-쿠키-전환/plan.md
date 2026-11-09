---
id: 'FEAT-080'
planned: '2026-11-06'
mode: 'feature'
---

# FEAT-080 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.** 범위와 결정은 `spec.md`가 정본이다.

## 0. 판정

`mode: feature` — 인증 동작과 API 계약이 바뀌어 구조만 바꾸는 `REF-`가 아니다.

`feature-planner`의 단계별 게이트는 거치지 않았다. 요구사항과 기술 결정은 사용자와의 대화와 서버 PR 검토에서 나왔고,
`spec.md`에 ADR과 AC로 정리했다. 웹과 서버 계약이 한 번에 바뀌어야 해서 PR 하나로 내고, 검토 단위는 커밋으로 나눈다.

## 1. 선행 조건

- [x] FEAT-080용 GitHub 이슈 생성, 번호 확정 — #394
- [x] 작업 브랜치 — NAT-025 5회차 브랜치 `feat/#393/ios-oauth-path`에서 이어서 한다 (2026-11-08 사용자 결정)
- [x] 사용자가 `pnpm --filter @repo/web generate:api` 실행 — 커밋 `3b250561`

**PR을 NAT-025 5회차와 합친다.** 재생성 커밋이 웹 로그인 타입을 바꿔서, 이 작업 없이는 브랜치의 `check-types`가 5개
에러로 실패한다. 생성 API 변경과 그것을 쓰는 웹 · 앱 코드를 한 PR에 모아 `develop`이 깨진 상태로 머지되지 않게 한다.
PR 본문에 #393과 FEAT-080 이슈를 함께 연결한다.

재생성 결과는 아래와 같다 (커밋 `3b250561`에서 다시 확인).

| 구분 | 내용                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| 추가 | `loginUrlResponse` · `webAuthCodeRequest` · `webLoginResponse`, `logout` 함수 |
| 삭제 | `authorizeUrl200`                                                             |

인증 외 API의 함수 이름은 달라지지 않았다.

## 2. 영향 분석

| 구분 | 파일 (`apps/web/src/`)                                                                                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | `features/auth-login/model/oauth-state.ts`                                                                                                                                        |
| 수정 | `shared/api/` `axios-instance.ts` · `refresh-token.ts`                                                                                                                            |
| 수정 | `entities/auth/model/` `auth-storage.ts` · `session-contract.ts`, `entities/auth/index.ts`                                                                                        |
| 수정 | `features/auth-login/api/` `get-login-url.ts` · `use-oauth-callback.ts` · `use-apple-web-login.ts` · `request-apple-web-login.ts`, `features/auth-login/model/use-oauth-login.ts` |
| 수정 | `features/auth-login/ui/social-login-button.tsx`                                                                                                                                  |
| 수정 | `features/auth-logout/model/use-logout.ts`                                                                                                                                        |
| 수정 | `pages/oauth-callback/ui/oauth-callback-page.tsx`                                                                                                                                 |
| 수정 | `app/auth/auth-provider.tsx`, `app/routes/` `index.tsx` · `_authenticated/route.tsx` · `login.oauth2.code.$provider.tsx`                                                          |
| 문서 | `docs/fe-implement-spec/o-1/o-1.md`, `docs/implementation-status.md`                                                                                                              |
| 생성 | `shared/api/generated/**` (사용자 재생성)                                                                                                                                         |

테스트는 토큰을 `localStorage`로 준비하는 11개 파일을 함께 고친다. `app/auth/session-guard` · `app/query/query-client` ·
`_authenticated/route` · `auth-storage` · `session-contract` · `use-native-login` · `use-logout` · `logout-button` ·
`main-page` · `oauth-callback-page` · `onboarding-page` · `header` 테스트가 대상이다. 구현에 맞춰 조건을 바꾸되 기대 동작을
약하게 만들지 않는다.

`apps/native`, `use-native-login.ts`, `exchange-native-token.ts`의 동작은 바뀌지 않는다.

## 3. 구현 계획

### 커밋 1 — 쿠키 전송과 재발급

- [x] `[shared]` `axios-instance.ts` — 인스턴스에 `withCredentials: true`. 쿠키는 Path가 `/api/v1/auth`라 다른 API에 실리지 않는다
- [x] `[shared]` `refresh-token.ts` — refreshToken이 있으면 본문에 넣고(앱), 없으면 본문 없이 요청(웹). 없다고 미리 실패시키지 않는다. 서버가 401로 거절한다
- [x] `[shared]` 테스트 — AC-13, AC-19

### 커밋 2 — 세션 저장과 복원

- [x] `[entities]` `auth-storage.ts` — 세션 힌트 읽기 · 쓰기 · 삭제, 옛 토큰 삭제
- [x] `[entities]` `session-contract.ts`
  - `setSession`: 웹은 메모리 + 힌트, 앱은 기존처럼 두 토큰 저장
  - `getSessionToken`: 웹은 저장소를 읽지 않는다
  - `restoreSession`: `Promise`를 돌려주고 중복 호출을 합친다. 결과는 `restored` · `none` · `failed`. `failed`면 재시도할 수 있게 기억을 비운다
  - 앱은 기존처럼 저장소에서 복원한다
- [x] `[app]` `auth-provider.tsx` — 부팅 때 복원을 시작만 한다
- [x] `[app]` `index.tsx` · `_authenticated/route.tsx` — `beforeLoad`에서 복원 완료를 기다린 뒤 판단. `failed`면 `/`는 로그인 화면, 인증 경로는 기존 세션 확인 실패 화면
- [x] 테스트 — AC-7 ~ AC-12, AC-17, AC-18. 토큰 준비 방식 수정

### 커밋 3 — 로그인 state

- [x] `[features]` `oauth-state.ts` — 저장, 비교, 삭제. 10분 만료. 순수 함수로 두고 테스트한다
- [x] `[features]` `get-login-url.ts` · `use-oauth-login.ts` — `state` 저장 후 이동
- [x] `[app]` 콜백 라우트 `validateSearch`에 `state` 추가
- [x] `[pages]` `oauth-callback-page.tsx` — 교환 전에 비교, 실패 시 요청 없이 안내 후 이동
- [x] `[features]` `use-oauth-callback.ts` — `code` · `state` 전송, 응답에서 refreshToken 제거
- [x] `[features]` `request-apple-web-login.ts` · `use-apple-web-login.ts` — `login-url/apple`의 `state`를 SDK에 넣고 응답값 비교
- [x] `[features]` `social-login-button.tsx` — `onLoginSuccess`가 앱 응답(`LoginResponse`)과 웹 Apple 응답(`WebLoginResponse`)을 모두 받도록 타입을 좁힌다. 호출부는 `isOnboarded`만 쓴다
- [x] 테스트 — AC-1 ~ AC-6

### 커밋 4 — 로그아웃

- [x] `[features]` `use-logout.ts` — 세션 · 캐시를 먼저 지우고 이동한 뒤 API 호출. 웹은 쿠키, 앱은 본문 refreshToken. 재발급 재시도 대상에서 제외
- [x] 앱 경로는 저장 토큰을 지우기 전에 값을 읽어 둔다
- [x] 테스트 — AC-14 ~ AC-16. 탈퇴 확정 후 로그아웃 회귀 포함

### 커밋 5 — 문서

- [x] `o-1.md` 명세와 `implementation-status.md` 갱신
- [x] `checklist.md`, `pnpm verify`

## 4. 배포 순서

| 순서 | 작업                                    | 확인                                              |
| ---- | --------------------------------------- | ------------------------------------------------- |
| 1    | PR → `develop` → dev 배포               | AC-20 ~ AC-23                                     |
| 2    | `release/x.y.z` 준비, 웹 빌드 미리 확인 | Vercel 환경변수                                   |
| 3    | **서버 운영 배포**                      | 로그인 URL에 `state` 있음, `/oauth/ios` 경로 있음 |
| 4    | **바로 웹 운영 배포**                   | 운영 로그인, 쿠키, 새로고침                       |
| 5    | 앱 운영 빌드 → TestFlight               | AC-23, NAT-011 남은 AC                            |

3과 4 사이에는 옛 웹이 `state`를 보내지 않아 **새 로그인만 실패한다.** 이미 로그인한 사용자는 본문 재발급이 남아 있어
유지된다. 반대 순서면 새 웹이 옛 서버에서 쿠키를 받지 못해 새로고침 때 세션이 끊기므로 서버를 먼저 올린다. 사용자가 적은
시간에 짧게 진행하고, 서버 담당자와 시간을 맞춘다.

**되돌리기** — 웹만 되돌리면 옛 웹과 새 서버가 만나 새 로그인이 실패한다. 웹을 먼저 수정 배포하는 쪽을 우선하고, 안 되면
서버와 웹을 함께 이전 버전으로 되돌린다.

## 5. 리스크

| 리스크                             | 영향                                 | 대응                                                         |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| 복원 전 경로 판단                  | 로그인 사용자가 로그인 화면으로 튕김 | `beforeLoad`에서 기다림. AC-9                                |
| 부팅 재발급 지연                   | 첫 화면 지연                         | 전후 측정. 힌트로 비로그인 방문은 제외                       |
| Safari가 비동기 뒤 Apple 팝업 차단 | 브라우저 Apple 로그인 실패           | AC-22. 막히면 `state`를 버튼 표시 시점에 미리 받는다         |
| 쿠키 미전송 (도메인 조합)          | 새로고침마다 로그아웃                | 운영 API 주소 확인, dev에서 실제 확인                        |
| 로컬 개발 환경의 쿠키 차단         | 로컬 재발급 실패                     | `VITE_API_PROXY=true` 사용. Safari는 로컬 확인 대상에서 제외 |
| 앱 경로 회귀                       | 심사 빌드 로그인 실패                | AC-17 ~ AC-19 자동 테스트, AC-23 실기기                      |
| 세션 복원 중 재발급 충돌           | 요청 중복                            | 복원도 `refreshAccessToken`을 써서 한 번으로 합친다          |

## 6. 검증

| 대상              | 방법                                                  |
| ----------------- | ----------------------------------------------------- |
| state · 세션 분기 | 순수 함수와 훅 단위 테스트                            |
| API 흐름          | MSW: 요청 유무, 본문, 재발급 횟수, 실패 후 상태       |
| 쿠키 실제 동작    | dev 수동: 개발자 도구에서 속성, 저장소, 새로고침 확인 |
| 공격 시나리오     | AC-21 수동 재현, 녹화                                 |
| 전체              | `pnpm verify`                                         |

jsdom은 쿠키 전송을 재현하지 못한다. 쿠키 속성과 전송은 수동 항목으로 남긴다.

## 7. 포트폴리오 근거 수집

구현이 끝나고 검증된 내용만 `docs/portfolio-evidence.md`에 정리한다. 작업 중 아래 자료를 모은다.

- 전후 비교: 저장소 내용, 쿠키 속성 캡처
- 로그인 CSRF: AC-21 재현 전후 결과, 서버 계약에서 찾은 근거
- 첫 화면: 로그인 사용자 새로고침의 복원 시간 전후 측정
- 변경 범위: 세션 호출부 중 실제로 바뀐 파일 수
- 배포: 실제 진행한 순서와 결과

**범위 표현** — "XSS를 막았다"로 쓰지 않는다. 막는 것과 막지 못하는 것, 앱이 범위 밖이라는 점을 함께 적는다.

## 8. 계획과 달라진 점 (2026-11-08 구현)

| 항목                  | 계획                                            | 구현                                                                            | 이유                                                                                                                              |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 웹 세션 만들기        | `setSession`이 웹 · 앱을 나눈다                 | 앱은 `setSession`, 웹은 `setWebSession(accessToken)`                            | 웹 응답에는 refreshToken이 없다. 함수를 나누면 타입이 잘못된 호출을 막는다                                                        |
| 복원 결과 기억        | 결과를 기억하고 `failed`면 비운다               | 진행 중인 복원만 합치고 결과는 기억하지 않는다                                  | 매번 store · 힌트를 다시 보면 로그아웃 · 재로그인 뒤에도 따로 비울 상태가 없다. 힌트가 없으면 요청 없이 끝난다                    |
| 이미 로그인한 경우    | —                                               | store에 토큰이 있으면 바로 `restored`                                           | 같은 페이지에서 로그인한 뒤 라우트 이동 때 재발급을 다시 부르지 않는다                                                            |
| 재발급 거절 판정      | —                                               | `isRefreshRejected`를 `refresh-token.ts`로 옮겨 공개                            | 인터셉터와 부팅 복원이 같은 기준(4xx만 거절)을 써야 한다                                                                          |
| 로그아웃 API          | `use-logout.ts`에서 호출                        | `auth-logout/api/revoke-session.ts`로 분리                                      | 생성 API 호출은 `api/` segment에 둔다 (`api-convention.md` §3)                                                                    |
| 앱 refreshToken 읽기  | —                                               | `shared/api`의 `getRefreshToken()`                                              | 이미 주입된 함수가 웹이면 `null`을 돌려준다. 새 export가 필요 없다                                                                |
| Apple state 비교 위치 | `use-apple-web-login.ts`                        | `requestAppleWebCode(state)`가 비교                                             | SDK 응답을 읽는 곳에서 바로 거절한다                                                                                              |
| 성공 콜백 타입        | 타입을 좁힌다                                   | `LoginSuccess = Pick<LoginResponse, 'isOnboarded'>`를 `login-outcome.ts`에 둔다 | `resolveLoginDestination`과 같은 타입을 쓴다                                                                                      |
| 탈퇴 확정             | 회귀 테스트                                     | `account-deletion-page.tsx`가 확정 후 `restoreSession()`을 기다린 뒤 판단       | 메일 링크를 새 탭에서 열면 복원 전엔 메모리에 토큰이 없어 로그아웃을 건너뛸 수 있다. 화면 테스트 파일이 없어 수동 확인으로 남긴다 |
| 영향 파일             | `query-client` · `use-native-login` 테스트 수정 | 수정하지 않음                                                                   | 둘 다 저장소 토큰에 의존하지 않아 그대로 통과한다                                                                                 |
