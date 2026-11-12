---
id: 'FEAT-080'
validated: '2026-11-08'
mode: 'feature'
---

# FEAT-080 검증 결과

> `ai-validate` 산출물. **생략 금지.**
> 실패 시 수정 후 재검증 **최대 3회**. 초과하면 보고하고 중단한다.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과             |
| --- | --------------- | -------------------------------------------------- | ---------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅               |
| 2   | 타입            | `pnpm check-types`                                 | ✅               |
| 3   | 테스트          | `pnpm test`                                        | ✅ 124 파일 통과 |
| 4   | 빌드            | `pnpm build`                                       | ✅               |
| 5   | 포맷            | `pnpm format:check`                                | ✅               |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ `rg` 결과 0건 |

`pnpm verify` 1회로 전부 통과했다 (2026-11-08, exit 0).
NAT-025 5회차의 API 재생성(`3b250561`)이 남긴 타입 에러 5개는 이 작업으로 모두 사라졌다.
테스트 로그의 처리기 없는 요청 경고는 `GET /api/v1/inquiries/1` 1건만 남았다. 이 작업 전부터 있던 것이고 범위 밖이다.

## 2. 요구사항 ↔ 구현 대조

### 로그인과 state

| #    | 요구사항                                              | 구현 위치                                                                                                                          | 상태 |
| ---- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---- |
| AC-1 | state와 제공자를 저장한 뒤 인가 페이지로 이동         | `useOauthLogin` → `savePendingOauthState` · `use-oauth-login.test.tsx`                                                             | ✅   |
| AC-2 | 같으면 `code` · `state`로 요청, 저장값 삭제           | `OauthCallbackPage` → `consumePendingOauthState`, `useOauthCallback` · `oauth-callback-page.test.tsx` 「세션을 만들고 /main」      | ✅   |
| AC-3 | 다르거나 없으면 요청 없이 실패 안내 후 `/`            | `OauthCallbackPage` · `oauth-callback-page.test.tsx` 「state 확인」 5건                                                            | ✅   |
| AC-4 | 10분 넘게 지나면 AC-3과 같다                          | `isPendingStateMatched` (`OAUTH_STATE_TTL_MS`) · `oauth-state.test.ts`, 콜백 페이지 테스트                                         | ✅   |
| AC-5 | 제공자가 다르면 AC-3과 같다                           | `isPendingStateMatched` · `oauth-state.test.ts`, 콜백 페이지 테스트                                                                | ✅   |
| AC-6 | Apple 팝업 응답 `state` 비교, `code` · `state`로 요청 | `requestAppleWebCode(state)` · `useAppleWebLogin` · `request-apple-web-login.test.ts`, `social-login-button.test.tsx` 「AC-6」 2건 | ✅   |

### 세션

| #     | 요구사항                                        | 구현 위치                                                                                           | 상태 |
| ----- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---- |
| AC-7  | 저장소에 토큰 없음, 힌트 있음                   | `setWebSession` · `session-contract.test.ts`, `oauth-callback-page.test.tsx` 「AC-7」               | ✅   |
| AC-8  | 힌트 없으면 재발급 없이 로그인 화면             | `restoreWebSession` · `session-contract.test.ts`, `_authenticated/route.test.tsx` 「AC-8」          | ✅   |
| AC-9  | 힌트 · 쿠키로 재발급, 경로 판단은 복원 뒤       | `restoreSession` + 두 라우트 `beforeLoad` · `session-contract.test.ts`, `route.test.tsx` 「AC-9」   | ✅   |
| AC-10 | 재발급 4xx면 힌트 삭제, 로그아웃 상태           | `restoreWebSession` (`isRefreshRejected`) · `session-contract.test.ts`                              | ✅   |
| AC-11 | 5xx · 네트워크면 힌트 유지, 세션 확인 실패 화면 | `restoreWebSession` `failed` → `_authenticated` `UserCheckFailedError` · `route.test.tsx` 「AC-11」 | ✅   |
| AC-12 | 옛 토큰 삭제, 재발급 없이 로그아웃 상태         | `restoreWebSession` (`hasStoredTokens`) · `session-contract.test.ts`                                | ✅   |
| AC-13 | 동시 401에 재발급 1회, 본문에 토큰 없음         | `refreshAccessToken` · `axios-instance.test.ts` 「본문 없이 재발급하고, 동시 401 3건에도 1회」      | ✅   |

### 로그아웃

| #     | 요구사항                                     | 구현 위치                                                                | 상태 |
| ----- | -------------------------------------------- | ------------------------------------------------------------------------ | ---- |
| AC-14 | 세션 · 캐시 · 힌트 삭제, `/auth/logout` 호출 | `useLogout` → `revokeSession` · `use-logout.test.tsx` 「AC-14」          | ✅   |
| AC-15 | API 실패 후 새로고침해도 로그아웃 상태       | `clearSession`이 힌트를 먼저 지움 · `use-logout.test.tsx` 「AC-15」      | ✅   |
| AC-16 | 앱은 본문 refreshToken으로 호출, 저장 삭제   | `useLogout` (`getRefreshToken` 선읽기) · `use-logout.test.tsx` 「AC-16」 | ✅   |

### 앱 경로 회귀

| #     | 요구사항                          | 구현 위치                                                                                | 상태 |
| ----- | --------------------------------- | ---------------------------------------------------------------------------------------- | ---- |
| AC-17 | 두 토큰 기존처럼 저장, state 없음 | `setNativeSession` · `session-contract.test.ts` 「앱 경로」, `use-native-login.test.tsx` | ✅   |
| AC-18 | 재실행 시 네트워크 없이 복원      | `restoreStoredSession` · `session-contract.test.ts` 「AC-18」                            | ✅   |
| AC-19 | 401이면 본문 refreshToken 재발급  | `requestReissue` · `axios-instance.test.ts` 「본문에 refreshToken 을 담아」              | ✅   |

### 배포 전 실제 환경 (수동)

| #     | 환경   | 확인                                                      | 상태 |
| ----- | ------ | --------------------------------------------------------- | ---- |
| AC-20 | dev 웹 | 네 로그인 후 쿠키 속성과 새로고침 유지                    | ✅   |
| AC-8  | dev 웹 | 처음 온 브라우저는 재발급 요청 없이 로그인 화면           | ✅   |
| AC-21 | dev 웹 | 다른 브라우저에서 받은 콜백 링크로는 로그인되지 않음      | ✅   |
| AC-22 | Safari | Apple 팝업이 차단되지 않음, 새로고침 유지                 | ✅   |
| AC-23 | iOS 앱 | SDK 로그인, 재실행 유지, 로그아웃                         | ✅   |
| —     | dev 웹 | 로그인한 탭에서 탈퇴 메일 링크를 열고 확정하면 `/`로 이동 | 미확인 |

jsdom은 쿠키 전송을 재현하지 못해 쿠키 속성 · 전송은 수동 항목으로 남긴다. 로컬은 `VITE_API_PROXY=true`로 확인한다.

**2026-11-09 dev 확인 기록** — PR #395 머지 커밋 `9f86fe97`이 Vercel에 배포되지 않아 처음엔 dev 웹이 예전 코드였다
(번들에 `hasSession` · `pendingOauthState` 없음). 재배포 후 번들에서 세 표식을 확인하고 아래를 headless Chrome으로 확인했다.

- AC-8: 저장소가 빈 브라우저로 `/` 진입 → 로그인 화면, `/api/v1/` 요청 0건
- AC-21: 저장된 state가 없는 브라우저로 `/login/oauth2/code/google?code=…&state=…`(가짜 값) 진입 → 실패 토스트 후 `/`,
  `/api/v1/` 요청 0건. 웹이 막는 조건은 "보관한 state 없음"이라 실제 공격자 code여도 같은 경로로 막힌다
- AC-20 (사용자 확인): dev 웹 로그인 후 새로고침에서 `/auth/reissue`가 성공해 세션 유지. `refreshToken` 쿠키의
  HttpOnly · Secure 체크 확인. 다른 제공자 로그인 성공, 로그아웃하면 `hasSession` 삭제.
  쿠키는 API 주소(`grav-it-dev.inuappcenter.kr`)에 저장돼 웹 주소의 Application 탭에는 보이지 않는다 — 요청의 Cookies 탭으로 본다
- AC-22 · AC-23 (사용자 확인, 2026-11-10): Safari Apple 팝업 로그인과 새로고침 유지, iOS 개발 빌드 로그인 · 재실행 유지 · 로그아웃 성공
- 탈퇴 확정 화면: 실제 계정이 삭제되는 확인이라 테스트 계정이 준비될 때까지 미확인으로 둔다. 코드는 `restoreSession()`을 기다린 뒤 판단한다
- dev 서버 계약(서버 측 확인): 로그인 URL 응답에 `state`, CORS `Allow-Credentials: true` · 허용 출처 dev 웹, 쿠키 `SameSite=None`

## 3. 이전 검증

해당 없음 (`FEAT-`).

## 4. 시안 대조 재확인

해당 없음. 화면 변화가 없다.

## 5. 기준 문서 갱신

| 대상                                | 갱신 내용                                                       | 상태 |
| ----------------------------------- | --------------------------------------------------------------- | ---- |
| `docs/implementation-status.md`     | `O.1` 기능 검증 🚧 → ✅ (dev · Safari · iOS 확인), 갱신 이력 | ✅   |
| `docs/migration-status.md`          | 해당 없음                                                       | —    |
| `docs/fe-implement-spec/o-1/o-1.md` | F01 · F03 수정, F08 로그인 요청 확인 신설, 검증 기준 2줄        | ✅   |

## 6. 중간에 막혔던 지점 — 스킬에 반영할 것

- **콜백 테스트의 기본값 함정.** `renderCallback(code, state = STATE)`에 `undefined`를 넘기면 기본값이 들어가 「state 없음」
  경우가 성공 경로로 바뀌었고, 5초 시간 초과로만 드러났다. 「값 없음」을 표현해야 하는 테스트 인자는 `null`로 받는다.
- **fire-and-forget 요청과 MSW.** 로그아웃 API를 기다리지 않게 바꾸자, 로그아웃을 누르는 다른 화면 테스트 3개가 처리기 없는
  요청 경고를 냈다. 테스트는 통과해서 실패로 드러나지 않는다. 새 요청을 추가하면 전체 테스트 로그에서
  `without a matching request handler`를 검색한다.
- **메모리 토큰과 공개 라우트.** 인증 게이트 밖의 화면(`account-deletion-page`)은 복원을 기다리지 않아, 동기 저장소 읽기에
  기대던 판단이 조용히 바뀐다. 웹 토큰 위치를 바꾸는 작업은 `getSessionToken()` 호출부를 모두 확인한다.
