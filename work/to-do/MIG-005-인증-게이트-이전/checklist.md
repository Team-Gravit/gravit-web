---
id: 'MIG-005'
validated: '2026-09-09'
mode: 'migrate'
---

# MIG-005 검증 결과

> `ai-validate` 산출물.
>
> **범위: Issue 1(#196) · Issue 2(#197) · Issue 3(#201).**
> Issue 4·5는 미구현이므로 work task 전체는 완료가 아니다. 폴더는 `in-progress`에 남는다.
>
> 이슈별로 절을 나눠 누적한다. 앞 이슈의 기록은 덮어쓰지 않는다.

# Issue 1 검증 결과 — 세션 계약과 토큰 저장소

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                      |
| --- | --------------- | -------------------------------------------------- | ------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ No problems found      |
| 2   | 타입            | `pnpm check-types`                                 | ✅                        |
| 3   | 테스트          | `pnpm test`                                        | ✅ 8 files / **38 tests** |
| 4   | 빌드            | `pnpm build`                                       | ✅                        |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일 15개>` | ✅                        |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 참조 0건               |

테스트는 기존 21개 + 이번 신규 17개다. 라우트를 추가하지 않아 트리 재생성은 불필요했다.

`pnpm format:check` 전체는 실행하지 않았다. 커밋된 6개 파일 때문에 이미 실패 중이며
(`REF-003`), 이번 작업과 무관하다.

### 재검증 이력 — 1회

steiger가 2건을 잡아 수정 후 재검증했다. 상세는 §6.

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항 (issues.md Issue 1)                              | 구현 위치                                                                                                                                    | 상태 |
| ---- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| AC-1 | 저장소에 토큰이 있으면 `getSessionToken()`이 그 값을 반환 | `entities/auth/model/session-contract.ts` · `session-contract.test.ts` "복원 전에도 그 값을 반환한다"                                        | ✅   |
| AC-2 | 요청 헤더가 `Bearer tok_abc`                              | `shared/api/axios-instance.ts` 요청 인터셉터 · `axios-instance.test.ts` "Bearer 로 싣는다"                                                   | ✅   |
| AC-3 | 토큰이 없으면 헤더 없이 전송                              | `axios-instance.test.ts` "헤더 없이 요청이 전송된다"                                                                                         | ✅   |
| AC-4 | `setSession({...})` 후 저장소·store 동기화                | `session-contract.ts: setSession` · `session-contract.test.ts` "저장소와 store 에 함께 반영한다"                                             | ✅   |
| AC-5 | 401이면 저장소·store의 accessToken이 `null`               | `axios-instance.test.ts` "401 이면 onUnauthorized 를 1회 호출" + `session-contract.test.ts` "notifyUnauthorized 를 호출하면 세션이 비워진다" | ✅   |
| AC-6 | 복원 전 `isRestored=false`, 후 `true`                     | `session-contract.ts: restoreSession` · `session-contract.test.ts` describe('restoreSession') 3건                                            | ✅   |
| AC-7 | `clearSession()`이 두 키를 모두 제거                      | `auth-storage.ts: clearStoredTokens` · `auth-storage.test.ts` "두 키를 모두 제거한다"                                                        | ✅   |

**AC-2·AC-5의 검증 방식** — 한 테스트로 끝까지 잇지 않고 두 조각으로 나눴다.
`shared`가 주입된 구현을 실제로 쓰는지(`axios-instance.test.ts`)와 계약이 그 구현을
주입하는지(`session-contract.test.ts`의 `getAuthToken`·`notifyUnauthorized` 확인)를 각각 고정했다.
`shared` 레이어 테스트가 `entities`를 import하면 레이어 방향이 뒤집히기 때문이다.

## 3. 이전 검증

| 항목                                                  | 결과                                                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `plan.md` 2-1 이전 매핑이 **전량** 반영되었나         | ⚠️ **Issue 1 해당분만.** 아래 표 참고                                                           |
| 동작 동일성 — `spec.md`의 현행 동작 기준선이 유지되나 | ✅ A1·A2·A3·C8 (Issue 1 범위)                                                                   |
| 의도적으로 바꾼 것만 바뀌었나                         | ✅ §3-2에 3건 기록                                                                              |
| 이전 후 남은 legacy 참조가 없나                       | ✅ `tokenManager` · `setAuthFailureHandler` · `entities/login` · `_authenticated` 검색 결과 0건 |

### 3-1. 매핑 반영 상태

| 매핑                                               | 이슈 | 상태                                          |
| -------------------------------------------------- | ---- | --------------------------------------------- |
| `shared/config/storage.ts` → `auth-storage.ts`     | 1    | ✅ 키 이름 `accessToken`·`refreshToken` 보존  |
| `shared/api/config.ts` `tokenManager` → 3파일      | 1    | ✅ 읽기·쓰기·삭제·복원으로 분해               |
| `setAuthFailureHandler` → `configureAuth` 주입     | 1    | ✅ `session-contract.ts` 모듈 최상위에서 호출 |
| `main.tsx` 주입 호출 → `app/auth/auth-provider`    | 1    | ✅                                            |
| 갱신·큐 → `shared/api/refresh-token.ts`            | 2    | ✅ single-flight 재작성 (Issue 2 §3)          |
| `entities/login/*` → `features/auth-login/*`       | 3    | ✅ 3파일로 분해 (Issue 3 §3)                  |
| `features/auth/logout.ts` → `features/auth-logout` | 3    | ✅ 이동 완료                                  |
| `pages/_authenticated/route.tsx` → `_protected`    | 4    | ⬜ 미착수                                     |
| 네이티브 메시지 계약                               | 5    | ⬜ 미착수                                     |

### 3-2. 의도적으로 바꾼 것

| 항목                                                          | 이유                                                                                                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| legacy의 `typeof window !== 'undefined'` 가드를 옮기지 않았다 | SSR이 없는 브라우저 전용 SPA이고 테스트도 jsdom이라 관찰 가능한 동작 차이가 없다                                                          |
| `setSession`이 문자열 2개가 아니라 객체를 받는다              | 같은 타입 인자를 나열하면 호출부에서 어느 쪽인지 읽히지 않는다 (`code-quality.md` §4). `issues.md`의 AC 문구 3곳을 이 시그니처로 갱신했다 |
| 계획의 `app/providers/` 대신 `app/auth/`를 썼다               | steiger `fsd/segments-by-purpose`가 `providers`를 차단한다. 기존 `app/query/`·`app/router/`와 같은 방식을 따랐다 (§6 참고)                |

legacy의 `tokenManager.refreshToken` · `getIsRefreshing`은 Issue 2 범위이므로 이번에 옮기지 않았다.

## 4. 시안 대조 재확인

**해당 없음.** 이 작업은 인증 흐름(로직)만 다루며 화면 UI가 없다. `spec.md`의 시안 대조 결과도
`해당 없음`으로 기록돼 있다.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                             | 상태                 |
| ------------------------------- | --------------------------------------------------------------------- | -------------------- |
| `docs/implementation-status.md` | 사용자 화면 변화가 없다                                               | 해당 없음            |
| `docs/migration-status.md`      | legacy 인증 대체가 **아직 완료되지 않았다** (Issue 2~5 남음)          | ⬜ work task 완료 시 |
| 그 외 `docs/`                   | 세션 계약·네이티브 메시지 계약은 Issue 5까지 끝난 뒤 한 번에 승격한다 | ⬜ work task 완료 시 |

> 기준 문서 갱신과 `done/` 이동은 **work task 전체가 끝난 뒤** 한다. Issue 1만으로 legacy를
> 대체했다고 적으면 대장이 실제보다 앞서간다.

## 6. 중간에 막혔던 지점 — 스킬에 반영할 것

### ① `app/providers/` 세그먼트를 steiger가 막는다

`fsd-pages.md` §6이 app 레이어 구조로 `providers/ # 전역 프로바이더`를 명시하는데,
steiger의 `fsd/segments-by-purpose`가 그 이름을 거부한다.

```
┌ src\app\providers
✘ This segment's name should describe the purpose of its contents, not what the contents are.
└ fsd/segments-by-purpose
```

기존 `app/query/`·`app/router/`와 같은 방식으로 `app/auth/`에 두어 통과시켰다.

→ **`.claude/rules/fsd-pages.md` §6의 예시에서 `providers/`를 빼거나 대체 이름으로 고쳐야 한다.**
규칙 문서와 도구가 갈라진 상태로 두면 다음 사람이 같은 자리에서 막힌다.

### ② 테스트가 `shared`의 내부 파일을 import하면 steiger가 막는다

`session-contract.test.ts`가 `@/shared/api/auth-token`을 직접 참조하자
`fsd/no-public-api-sidestep`에 걸렸다. FSD 훅은 `*.test.ts(x)`를 검사 대상에서 빼지만
**steiger는 테스트 파일도 본다.** 훅을 통과했다고 안심하면 검증 단계에서 다시 막힌다.

`shared/api/index.ts` 배럴에 `getAuthToken`·`notifyUnauthorized`를 노출해 해결했다.

→ `ai-orchestrate`에 "테스트 파일도 배럴을 통해 import한다"를 명시하면 한 번에 통과한다.

### ③ MSW 노드 서버가 하네스에 없었다

`msw@2`가 설치돼 있고 `mocks/browser.ts`도 있지만, `vitest.setup.ts`에는 `msw/node` 서버가
연결돼 있지 않았다. 통합 AC를 검증할 수단이 없어 이번에 추가했다
(`shared/api/mocks/server.ts` + setup의 listen/reset/close).

`onUnhandledRequest: 'error'`로 두어 등록하지 않은 요청이 실제 서버로 새는 것을 막았고,
기존 테스트 21개에 영향이 없음을 확인했다.

### ④ `shared/api`에 배럴이 없었다

`configureAuth`를 파일 경로로 참조해야 해서 이번에 `shared/api/index.ts`를 만들었다.
`generated/`는 배럴이 없는 것이 정상이지만(`api-convention.md` §3의 예외), 손으로 쓴 shared
모듈에는 배럴이 필요하다.

---

# Issue 2 검증 결과 — 만료된 액세스 토큰 자동 재발급

## 1. 자동 검증

| #   | 검사            | 명령                                              | 결과                      |
| --- | --------------- | ------------------------------------------------- | ------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`                    | ✅ No problems found      |
| 2   | 타입            | `pnpm --filter @repo/web check-types`             | ✅                        |
| 3   | 테스트          | `pnpm --filter @repo/web exec vitest run`         | ✅ 8 files / **46 tests** |
| 4   | 빌드            | `pnpm --filter @repo/web build`                   | ✅ built in 12.65s        |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일 7개>` | ✅                        |
| 6   | generated 경계  | `rg "shared/api/generated" pages widgets`         | ✅ 참조 0건               |

테스트는 Issue 1의 38개 + 이번 신규 8개다. 라우트를 추가하지 않아 트리 재생성은 불필요했다.

`session-contract.test.ts` 1건이 포맷에 걸려 `prettier --write`로 고친 뒤 재확인했다.
`pnpm format:check` 전체는 `REF-003`의 기존 실패가 있어 실행하지 않았다.

### 재검증 이력 — 1회

재시도 요청의 `Authorization` 헤더 때문에 테스트 2건이 실패해 수정 후 재검증했다. 상세는 §5.

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항 (issues.md Issue 2)                | 구현 위치                                                                                                                                                   | 상태 |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| AC-1 | 재발급 1회 + 원요청 1회 재시도              | `axios-instance.ts` 응답 인터셉터 · `axios-instance.test.ts` "401 이면 재발급 후 원요청을 새 토큰으로 1회 재시도한다"                                       | ✅   |
| AC-2 | 재시도도 401이면 재발급 재호출 없이 전파    | `isRetried` 플래그 · 〃 "재시도한 요청이 다시 401 이면 재발급을 다시 호출하지 않고 에러를 전파한다"                                                         | ✅   |
| AC-3 | 동시 401 3건에도 재발급 1회, 같은 새 토큰   | `refresh-token.ts: pendingRefresh` · 〃 "동시에 401 이 3건이어도 재발급은 1회만 나가고 모두 같은 토큰으로 재시도된다"                                       | ✅   |
| AC-4 | accessToken만 교체, refreshToken 유지       | `session-contract.ts: applyRefreshedToken` · `session-contract.test.ts` "notifyTokenRefreshed 를 호출하면 accessToken 만 교체하고 refreshToken 은 유지한다" | ✅   |
| AC-5 | 403이면 토큰을 지우지 않음                  | `axios-instance.ts` catch의 403 분기 · `axios-instance.test.ts` "재시도한 요청이 403 이면 onUnauthorized 를 호출하지 않는다"                                | ✅   |
| AC-6 | 500 실패면 토큰 삭제 + `notifyUnauthorized` | 〃 "재발급이 500 으로 실패하면 onUnauthorized 를 1회 호출한다"                                                                                              | ✅   |
| AC-7 | 재발급 요청 자체의 401은 재귀하지 않음      | `skipAuthRefresh` 플래그 · 〃 "재발급 요청 자체가 401 을 받아도 재발급을 다시 호출하지 않는다"                                                              | ✅   |

**AC-4의 검증 방식** — Issue 1과 같은 이유로 두 조각으로 나눴다. `shared`가 새 토큰을
`notifyTokenRefreshed`로 알리는지(`axios-instance.test.ts`의 `onTokenRefreshed` 단언)와,
계약이 그 알림을 받아 저장소에 반영하는지(`session-contract.test.ts`)를 각각 고정했다.
`shared` 레이어 테스트가 `entities`를 import하면 레이어 방향이 뒤집히기 때문이다.

## 3. 이전 검증

### 3-1. 기준선 대조 (C3~C7)

| #   | 기준선                                           | 결과                                                             |
| --- | ------------------------------------------------ | ---------------------------------------------------------------- |
| C3  | 401 & 재시도 전이면 갱신 후 **1회** 재시도       | ✅ `isRetried` 플래그로 제한. AC-1·AC-2                          |
| C4  | 갱신 중 **재요청**이 403이면 토큰을 지우지 않음  | ✅ AC-5. 단 재발급 호출 자체의 403은 아래 §3-2 참고              |
| C5  | 그 외 갱신 실패는 토큰 삭제 + 핸들러 호출        | ✅ `notifyUnauthorized()`가 주입된 `clearSession`을 부른다. AC-6 |
| C6  | 갱신은 single-flight                             | ✅ `pendingRefresh` 단일 Promise 공유. AC-3                      |
| C7  | `POST /api/v1/auth/reissue`에 `{ refreshToken }` | ⚠️ 경로·본문 동일. 전송 수단만 ADR-3에 따라 변경 (§3-2)          |

### 3-2. 의도적으로 바꾼 것

| 항목                                                            | 이유                                                                                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `publicApiClient` 대신 단일 인스턴스 + `skipAuthRefresh` 플래그 | ADR-3의 승인된 결정. 인스턴스를 둘로 나누지 않고 재발급 요청만 인터셉터를 우회한다                                                                            |
| `isRefreshing` + `failedQueue` + `processQueue` → Promise 하나  | 큐를 직접 굴리지 않아도 같은 약속을 공유하면 single-flight가 성립한다. 대기자에게 결과를 배달하는 코드가 사라진다                                             |
| `configureAuth`에 `readRefreshToken`·`onTokenRefreshed` 추가    | `shared`가 `entities/auth`의 저장소를 직접 못 읽는다. `plan.md` 영향 파일에는 없었지만 레이어 규칙상 다른 방법이 없다 (§5-② 참고)                             |
| 재시도 요청에서 요청 인터셉터가 토큰을 다시 붙이지 않는다       | 재발급으로 방금 받은 토큰이 이겨야 한다. legacy는 store가 이미 갱신돼 있어 우연히 같은 결과였다 (§5-① 참고)                                                   |
| **재발급 호출 자체가 403일 때 토큰을 유지한다**                 | legacy는 내부 catch에서 이미 지운 뒤 핸들러만 건너뛰어 "토큰은 지워지고 이동은 안 되는" 어중간한 상태가 된다. C4 문구에 맞춰 유지로 통일했다. **미판정 항목** |

### 3-3. 남은 legacy 참조

`tokenManager` · `failedQueue` · `isRefreshing` · `processQueue` · `privateApiClient` ·
`publicApiClient` · `setAuthFailureHandler` 검색 결과 **0건**.

`apps/legacy-web`의 `features/auth/use-refresh-token.tsx`는 계획대로 이전하지 않았다
(전체가 주석인 죽은 파일, `spec.md` 발견 2).

## 4. 시안 대조 재확인

**해당 없음.** 화면 UI가 없는 로직 이전이다.

## 5. 중간에 막혔던 지점 — 스킬에 반영할 것

### ① 재시도 요청이 요청 인터셉터를 다시 탄다

갱신 후 `config.headers.set('Authorization', 새토큰)`을 해도, 재시도가 요청 인터셉터를
다시 통과하면서 `getAuthToken()`의 **옛 토큰으로 덮어썼다.** 테스트 2건이 여기서 실패했다.

legacy도 같은 구조인데 문제가 없었던 것은 그 시점에 store가 이미 새 토큰으로 갱신돼 있어
덮어써도 값이 같았기 때문이다. 즉 **우연히 맞은 것**이지 설계된 동작이 아니다.

`isRetried`면 요청 인터셉터가 토큰 부착을 건너뛰도록 바꿔 재발급 결과가 이기게 했다.

→ **`ai-orchestrate`에 "인터셉터에서 재시도하면 그 요청이 인터셉터를 다시 탄다"를 넣으면
한 번에 통과한다.** 플래그로 재진입을 제어하는 것이 이 패턴의 핵심이다.

### ② `shared`가 저장소를 읽어야 하는 요구는 계획 단계에서 드러나지 않았다

`plan.md`의 Issue 2 영향 파일은 `refresh-token.ts`와 `axios-instance.ts` 둘뿐이었다.
그런데 재발급은 `refreshToken`을 읽고 새 `accessToken`을 저장해야 하고, 저장소는
`entities/auth`에 있다. `shared → entities`는 상향이라 **주입 계약(`configureAuth`) 확장이
필수**였고, 이는 Issue 1이 만든 파일 2개를 다시 건드리는 일이었다.

→ **`ai-plan`·`refactor-planner`가 영향 분석에서 "이 단계가 주입 지점을 넓히는가"를 묻게
해야 한다.** 의존성 주입 구조에서는 하위 레이어의 요구가 곧 계약 변경이다.

### ③ MSW 핸들러 URL은 baseURL에 걸린다

테스트가 절대 URL로 호출을 고정해도, **재발급은 코드가 `baseURL`을 거쳐 보낸다.**
경로만 적은 핸들러로는 잡히지 않아 와일드카드가 필요했다.

앱 코드가 스스로 만드는 요청을 가로챌 때는 경로 와일드카드를 쓴다.

### ④ 생성 API를 확인하지 않고 요청 함수를 손으로 썼다

재발급을 `AXIOS_INSTANCE.post('/api/v1/auth/reissue')`로 직접 구현하고 `ReissueResponse`를
다시 선언했다. 그러나 orval이 `authtoken-api/authtoken-api.ts`에 `reissueToken`을 이미
생성해 두었고, 응답 타입도 `model/reissueResponse.ts`에 있다.
`api-convention.md` §2가 금지하는 두 가지를 그대로 범했다.

사용자 지적으로 발견해 생성 함수로 교체했다. 인터셉터 우회도 생성 함수의 두 번째 인자로
그대로 넘길 수 있었다 — `reissueToken({ refreshToken }, { skipAuthRefresh: true })`.
`customInstance`가 `{...config, ...options}`로 병합하기 때문이다.

→ **새 HTTP 호출을 쓰기 전에 `rg <경로명> shared/api/generated/`를 먼저 돌린다.**
인터셉터나 플래그 같은 특수 사정이 있어도 생성 함수를 포기할 이유가 되지 않는다.

## 6. 기준 문서 갱신

| 대상                            | 갱신 내용                                                | 상태                 |
| ------------------------------- | -------------------------------------------------------- | -------------------- |
| `docs/implementation-status.md` | 사용자 화면 변화가 없다                                  | 해당 없음            |
| `docs/migration-status.md`      | legacy 인증 대체가 아직 완료되지 않았다 (Issue 3~5 남음) | ⬜ work task 완료 시 |
| 그 외 `docs/`                   | 세션·재발급 계약은 Issue 5까지 끝난 뒤 한 번에 승격한다  | ⬜ work task 완료 시 |

## 7. 후속으로 뽑을 항목

| 항목                                                        | 성격      | 상태           |
| ----------------------------------------------------------- | --------- | -------------- |
| **E1의 「`/`로 replace 이동」 검증 — 로그아웃 UI 작업에서** | 검증 이월 | 미등록         |
| 재발급 호출 자체가 403을 받을 때의 세션 처리 (§3-2 마지막)  | 판정 필요 | 미등록         |
| 생성 API 우회를 훅에서 차단 (§5-④)                          | `INFRA-`  | ✅ `INFRA-014` |
| 계획 단계에서 생성 API 함수를 특정 (§5-④)                   | `INFRA-`  | ✅ `INFRA-015` |
| 타입 인지 린트로 삼켜진 Promise 차단 검토                   | `INFRA-`  | ✅ `INFRA-016` |
| legacy 온보딩이 서버 변경으로 깨지는 문제 (`plan.md` §5)    | `FIX-`    | 미등록         |

---

# Issue 3 검증 결과 — 소셜 로그인과 로그아웃 이전

GitHub Issue: [#201](https://github.com/Team-Gravit/gravit-web/issues/201)

## 1. 자동 검증

| #   | 검사            | 명령                                      | 결과                       |
| --- | --------------- | ----------------------------------------- | -------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`            | ✅ No problems found       |
| 2   | 타입            | `pnpm --filter @repo/web check-types`     | ✅                         |
| 3   | 테스트          | `pnpm --filter @repo/web exec vitest run` | ✅ 13 files / **65 tests** |
| 4   | 빌드            | `pnpm --filter @repo/web build`           | ✅ built in 10.45s         |
| 5   | 포맷            | `pnpm exec prettier --check <변경 파일>`  | ✅                         |
| 6   | generated 경계  | `rg "shared/api/generated" pages widgets` | ✅ 참조 0건                |

테스트는 Issue 1·2의 46개 + 이번 신규 11개다. 라우트를 5개 추가해
`vite build`로 트리를 재생성한 뒤 `check-types`가 통과했다.

### 재검증 이력 — 5회

| 회차 | 실패                                               | 원인                                                           |
| ---- | -------------------------------------------------- | -------------------------------------------------------------- |
| 1    | 콜백 리렌더 테스트 1건                             | `rerender`에 React 엘리먼트가 아니라 DOM 노드를 넘겼다         |
| 2    | steiger 3건 (`fsd/no-public-api-sidestep`)         | 테스트가 `@/shared/api/mocks/server`를 직접 참조 (§5-①)        |
| 3    | eslint·check-types 각 1건                          | 쓰지 않는 `vi` import                                          |
| 4    | `get-login-url` 3건이 전체 실행에서만 5초 타임아웃 | 모듈 평가 시점 env 읽기 때문에 모듈 그래프를 3번 재로드 (§5-⑤) |
| 5    | 로그아웃 store 단언이 무력함을 발견                | 준비 단계에서 store 를 채우지 않았다 (§5-⑥)                    |

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항 (issues.md Issue 3)          | 구현 위치                                                                                                                             | 상태 |
| ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| AC-1 | 인가 URL 1회 조회 후 그 주소로 이동   | `features/auth-login/model/use-oauth-login.ts` · `use-oauth-login.test.tsx` "provider 의 인가 URL 을 1회 조회하고 그 주소로 이동한다" | ✅   |
| AC-2 | 리렌더 2회에도 코드 교환 1회          | `pages/oauth-callback` `hasExchanged` ref · `oauth-callback-page.test.tsx` "리렌더가 2회 더 일어나도 코드 교환은 1회만 호출된다"      | ✅   |
| AC-3 | 토큰 저장 후 `/main` replace          | `features/auth-login/api/use-oauth-callback.ts: onSuccess` · 〃 "isOnboarded 가 true 면 토큰을 저장하고 /main 으로 이동한다"          | ✅   |
| AC-4 | 미온보딩이면 `/onboarding` replace    | 〃 "isOnboarded 가 false 면 /onboarding 으로 이동한다"                                                                                | ✅   |
| AC-5 | `USER_423`이면 `/restore?providerId=` | `oauth-callback-page.tsx: WITHDRAWN_ACCOUNT_ERROR` · 〃 "USER_423 이면 /restore 로 providerId 를 실어 이동한다" (replace 확인 포함)   | ✅   |
| AC-6 | 토큰·캐시 비우고 완료를 알림          | `features/auth-logout/model/use-logout.ts` · `use-logout.test.tsx` "저장소 토큰과 Query 캐시를 비운 뒤 onSuccess 를 호출한다"         | ✅   |
| AC-7 | `dest` 쿼리 파라미터 전달             | `shared/config/env.ts: getOauthDest` · `get-login-url.test.ts` "VITE_OAUTH_DEST 가 'dev' 면 요청의 dest 쿼리 파라미터가 'dev' 다"     | ✅   |

부가 검증 4건을 함께 넣었다 — 요청 본문의 인가 코드, `code` 없을 때 미호출,
`dest`가 `'local'`인 경우, 응답 `loginUrl` 반환.

## 3. 이전 검증

### 3-1. 기준선 대조 (D·E)

| #   | 기준선                                        | 결과                                                                  |
| --- | --------------------------------------------- | --------------------------------------------------------------------- |
| D1  | 인가 URL을 받아 `window.location.href`로 이동 | ✅ AC-1                                                               |
| D2  | `returnTo` 저장                               | ⬜ **이전하지 않는다** (범위 밖). `rg returnTo` 결과 0건              |
| D3  | 콜백 경로, 마운트 시 1회 실행                 | ✅ AC-2. legacy보다 강해졌다 (§3-2)                                   |
| D4  | `code`를 꺼내 코드 교환 호출                  | ✅ 요청 본문 검증                                                     |
| D5  | `isOnboarded`로 `/main`·`/onboarding` replace | ✅ AC-3·AC-4                                                          |
| D6  | `USER_423` → `/restore?providerId={message}`  | ✅ AC-5                                                               |
| D7  | 그 외 에러는 toast로 표시                     | ❌ **미구현.** `apps/web`에 toast가 없다 (§6)                         |
| D8  | `dest`는 개발 모드면 `local`, 아니면 env      | ⚠️ **의도적으로 바꿈** (§3-2)                                         |
| D9  | provider는 `google \| kakao \| naver`         | ✅ `LoginProvider` 유니온                                             |
| E1  | 토큰 삭제 → 캐시 비움 → `/` replace           | ⚠️ 삭제·비움은 ✅. **이동은 호출부로 넘겼고 이 이슈에서 미검증** (§6) |

### 3-2. 의도적으로 바꾼 것

| 항목                                               | 이유                                                                                                                                                                                            |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D8 — `dest`를 `VITE_OAUTH_DEST`만 읽는다**       | 사용자 확정. legacy는 같은 판정을 `MODE`와 `VITE_ENVIRONMENT` 두 기준으로 해서 갈려 있었다. 배포가 브랜치로 갈리고 빌드 명령이 같아 `MODE`로는 dev·prod를 구분할 수 없다                        |
| 콜백 1회 실행을 `useRef` 가드로 막는다             | legacy는 `useEffect(..., [])` + eslint-disable인데, StrictMode의 이중 렌더에서는 실제로 두 번 실행된다. AC-2가 요구하는 1회를 보장하려면 가드가 필요하다                                        |
| 목적지 결정을 `pages/oauth-callback`으로 옮겼다    | legacy는 mutation 훅이 직접 이동한다. `fsd-features.md` §6에 따라 feature는 결과만 돌려주고 화면이 목적지를 정한다                                                                              |
| 라우트 어댑터에서 `code`를 `validateSearch`로 받음 | legacy는 `useLocation`에서 `URLSearchParams`로 직접 파싱한다. 라우터가 제공하는 검증 지점을 쓰면 타입이 붙는다                                                                                  |
| `_protected.tsx`를 통과용으로 먼저 만들었다        | `_protected.main`·`_protected.onboarding`의 부모가 없으면 라우트 트리가 생성되지 않는다. 게이트 판정은 Issue 4가 이 파일에 넣는다                                                               |
| 코드 교환에 orval 생성 **뮤테이션 훅**을 쓴다      | 처음에는 생성 함수만 쓰고 `useMutation` 을 직접 감쌌다. `api-convention.md` §2 가 생성 훅도 손으로 쓰지 말라고 한다. `dest` 를 화면에 노출하지 않도록 변수 형태만 바꿔주는 얇은 어댑터를 씌웠다 |
| `provider` 를 `beforeLoad` 에서 검증한다           | 경로 세그먼트는 검증되지 않은 문자열인데 `as LoginProvider` 로 단언만 했다. 지원하지 않는 provider 면 요청 없이 `/` 로 돌려보낸다                                                               |
| **모든 종료 상태에서 반드시 이동한다**             | legacy 는 실패 시 `return null` 로 끝나 빈 화면에 갇혔다. 동의 거부·네트워크 실패·5xx 모두 `/` 로 되돌린다                                                                                      |
| `/restore` 이동도 `replace` 를 쓴다                | legacy 는 여기만 `replace` 가 없다. 없으면 뒤로 가기가 콜백 경로로 돌아가 소모된 코드로 재교환을 시도하고 결국 `/` 로 튕긴다                                                                    |
| `OAUTH_DEST` 상수를 `getOauthDest()` 함수로        | 모듈 평가 시점에 읽으면 값을 바꿔 검증할 때 모듈 그래프를 통째로 재로드해야 한다 (§5-⑤). 빌드 시 값이 고정되므로 제품 동작은 같다                                                               |

`useLogout`은 이동 목적지를 `onSuccess` 콜백으로 호출부에 넘긴다 (`fsd-features.md` §6).

검증 편의를 이유로 훅이 직접 이동하게 만들 뻔했고, 그 근거가 "legacy도 그렇게 한다"였다.
`legacy-web-policy.md`와 `refactor-checklist.md` §4가 legacy의 **구조**를 근거로 삼는 것을
금지한다. 보존 대상은 「로그아웃하면 토큰이 지워지고 첫 화면으로 간다」는 동작이지 그 호출
위치가 아니다. 목적지는 네이티브 셸에서 갈릴 수 있다.

검증하지 못하는 부분은 숨기지 않고 범위에서 함께 제외했다 (`test-policy.md` §6). AC-6 문구를
이 이슈가 실제로 보장하는 범위로 줄이고, 「`/`로 이동」 검증은 로그아웃 UI 작업으로 넘겼다.

### 3-3. 남은 legacy 참조

`entities/login` · `usePostOAuth` · `returnTo` 검색 결과 **0건**.

## 4. 시안 대조 재확인

**해당 없음.** 이 이슈가 만든 화면은 렌더할 내용이 없는 콜백 처리 화면과 자리 라우트뿐이다.
`/main` · `/onboarding` · `/restore`의 화면 본체는 별도 작업이며 그때 시안과 대조한다.

## 5. 중간에 막혔던 지점 — 스킬에 반영할 것

### ① steiger가 테스트 파일의 하네스 import를 막는다

`checklist.md` Issue 1 §6-②가 예고한 자리에서 다시 막혔다. 테스트가
`@/shared/api/mocks/server`를 참조하자 `fsd/no-public-api-sidestep`이 3건 걸렸다.

이번에는 배럴로 해결할 수 없었다. `server`를 `shared/api/index.ts`로 올리면
**`msw/node`가 브라우저 번들 그래프에 딸려 들어온다.** `shared/api/mocks/index.ts`를 따로
만들어도 steiger는 `@/shared/api`보다 깊은 경로를 전부 우회로 판정한다.

**`steiger.config.js`의 `ignores`에 `*.test.ts(x)`를 추가**해 해결했다. FSD 훅이 이미 테스트
파일을 검사 대상에서 제외하므로 두 층의 기준이 같아진다.

→ 이 결정은 사용자 승인을 받았다. Issue 1의 §6-② 지적이 이번에 실제 변경으로 이어졌다.

### ② `window.location`을 대체하면 요청이 나가지 않았다

`window.location.href` 대입을 검증하려면 location을 가짜 객체로 바꿔야 하는데, 그러면
**검증 대상인 요청 자체가 실패했다**(`requestCount`가 0).

원인은 테스트에 `VITE_API_BASE_URL`이 없어 요청이 상대 URL이었던 것이다. 상대 URL 해석에
`window.location`이 필요한데 그걸 바꿔버린 셈이다.

`vitest.config.ts`의 `test.env`에 baseURL을 넣어 요청을 절대 URL로 만들어 해결했다.
가짜 location의 `href` 초기값도 빈 문자열이면 `Invalid base URL`로 터지므로 실제 주소로 둔다.

→ **`ai-orchestrate`에 "테스트 환경에 baseURL을 준다"를 넣을 만하다.** 이 설정이 없으면
요청이 `localhost` 상대 경로로 나가 환경에 따라 흔들린다.

### ③ `rerender`에는 React 엘리먼트를 넘긴다

리렌더 횟수를 확인하려고 `view.rerender(view.container.firstChild)`를 썼다가 트리가 통째로
언마운트됐다. `render`에 넘긴 엘리먼트를 보관했다가 그대로 다시 넘겨야 한다.

### ④ 생성 코드와 feature 훅의 이름이 겹친다

orval이 `oauth2-0-api.ts`에 `useOauthLogin`을 생성해 두었는데, 이는 **콜백 코드 교환**
(`POST /oauth/{provider}`) 훅이다. 이번에 만든 `features/auth-login`의 `useOauthLogin`은
**로그인 시작**(인가 URL 조회)이다. 같은 이름이 서로 다른 뜻을 가리킨다.

지금은 생성 훅을 아무도 import하지 않아 충돌이 없지만, 자동 완성에서 잘못 고를 여지가 있다.
생성물 이름은 바꿀 수 없으므로 feature 쪽 이름을 재검토할 수 있다.

### ⑤ 모듈 평가 시점에 env 를 읽으면 테스트가 느려진다

`export const OAUTH_DEST = import.meta.env.VITE_OAUTH_DEST` 형태는 값이 로드 시 고정된다.
값을 바꿔 검증하려면 `vi.resetModules()` + 동적 import 로 **생성 API·axios·인터셉터까지 그래프
전체를 다시 불러와야** 했고, 단독 실행 1.3초가 13개 파일 병렬 실행에서는 5초 타임아웃을 넘겼다.

`getOauthDest()` 함수로 바꿔 호출 시점에 읽게 하니 `vi.stubEnv` 한 줄로 끝났다. 빌드 시 값이
고정되므로 제품 동작은 완전히 같다.

→ **`shared/config` 의 환경값은 함수로 노출한다.** 상수로 두면 그 값에 의존하는 모든 테스트가
모듈 재로드를 강요당한다.

### ⑥ 단언이 실제로 실패할 수 있는지 확인한다

로그아웃 테스트가 `expect(useAuthStore.getState().accessToken).toBeNull()` 로 "지워졌는지" 를
확인하는데, `beforeEach` 가 store 를 `null` 로 초기화해서 **지우지 않아도 통과하는 단언**이었다.
초기화 값과 기대 값이 같아 눈으로는 구분되지 않는다.

이번 작업에서 같은 방법으로 두 건을 잡았다. **구현을 잠깐 망가뜨려 테스트가 빨간불이 되는지
확인하는 것**이 가장 싼 검증이다.

| 확인                    | 망가뜨린 것                | 결과                          |
| ----------------------- | -------------------------- | ----------------------------- |
| `/restore` 의 `replace` | `replace: true` 제거       | `expected 2 to be 1` ✅       |
| 로그아웃의 store 삭제   | `clearSession()` 주석 처리 | `expected 't1' to be null` ✅ |

→ **`test-policy.md` 에 「지웠다·비웠다를 검증하려면 지우기 전에 값을 채운다」와 「단언의 힘을
한 번 확인한다」를 넣을 만하다.** 지금 규칙은 무엇을 테스트할지는 정하지만 테스트가 실제로
작동하는지는 다루지 않는다.

## 6. 후속으로 뽑을 항목

| 항목                                                        | 성격        | 상태          |
| ----------------------------------------------------------- | ----------- | ------------- |
| **D7 — 콜백 실패 시 사용자에게 알리기 (toast 부재)**        | 기준선 누락 | ✅ `FEAT-017` |
| **E1의 「`/`로 replace 이동」 검증 — 로그아웃 UI 작업에서** | 검증 이월   | 미등록        |
| 재발급 호출 자체가 403을 받을 때의 세션 처리 (Issue 2)      | 판정 필요   | 미등록        |
| `useOauthLogin` 이름이 생성 훅과 겹침 (§5-④)                | 검토        | 미등록        |

**D7이 가장 시급하다.** 지금은 `USER_423`이 아닌 콜백 에러가 화면에 아무 표시 없이 무시된다.
사용자는 로그인 버튼을 눌렀는데 아무 일도 일어나지 않는 것으로 본다.

## 7. 기준 문서 갱신

| 대상                            | 갱신 내용                                                     | 상태                 |
| ------------------------------- | ------------------------------------------------------------- | -------------------- |
| `docs/implementation-status.md` | 화면 본체가 없어 사용자 화면 변화가 없다                      | 해당 없음            |
| `docs/migration-status.md`      | legacy 인증 대체가 아직 완료되지 않았다 (Issue 4·5 남음)      | ⬜ work task 완료 시 |
| 그 외 `docs/`                   | 세션·재발급·OAuth 계약은 Issue 5까지 끝난 뒤 한 번에 승격한다 | ⬜ work task 완료 시 |
