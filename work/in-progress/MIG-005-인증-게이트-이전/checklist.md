---
id: 'MIG-005'
validated: '2026-09-09'
mode: 'migrate'
---

# MIG-005 검증 결과

> `ai-validate` 산출물.
>
> **범위: Issue 1(세션 계약과 토큰 저장소, GitHub #196)만.** Issue 2~5는 미구현이므로
> work task 전체는 완료가 아니다. 폴더는 `in-progress`에 남는다.

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
| 갱신·큐 → `shared/api/refresh-token.ts`            | 2    | ⬜ 미착수                                     |
| `entities/login/*` → `features/auth-login/*`       | 3    | ⬜ 미착수                                     |
| `features/auth/logout.ts` → `features/auth-logout` | 3    | ⬜ 미착수                                     |
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
