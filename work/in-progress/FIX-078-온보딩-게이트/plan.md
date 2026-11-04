---
id: 'FIX-078'
planned: '2026-11-04'
mode: 'fix'
---

# FIX-078 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: fix` — 기능 추가가 아니라 의도한 접근 제어가 빠진 결함을 고친다. legacy에도 없는 게이트라 이전(`MIG-`)이 아니다.

`work/` 최댓값은 `FIX-077`이고 원격 브랜치에도 078 이상이 없다 (2026-11-04 확인).

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                    | 레이어    |
| --- | ------------------------------------------- | --------- |
| 1   | 경로와 `isOnboarded`로 목적지를 정하는 판정 | `[app]`   |
| 2   | `_authenticated` 진입 시 판정 수행          | `[app]`   |
| 3   | 대기 표시, 조회 실패 재시도 화면            | `[pages]` |
| 4   | 완료 화면 「홈으로」 `replace` 이동         | `[pages]` |
| 5   | 넓은 화면 온보딩 「이전」 버튼              | `[pages]` |

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | `apps/web/src/app/auth/onboarding-gate.ts` · `onboarding-gate.test.ts` · `apps/web/src/app/routes/_authenticated/route.test.tsx` · `apps/web/src/pages/session-check/` (`index.ts`, `ui/session-check-pending.tsx`, `ui/session-check-error.tsx`)                                                                                                                                                    |
| 수정 | `apps/web/src/app/routes/_authenticated/route.tsx` · `_authenticated/onboarding/index.tsx` · `_authenticated/onboarding/index.test.tsx` · `pages/onboarding/ui/onboarding-page{,-narrow,-wide}.tsx` · `onboarding-page.test.tsx` · `pages/onboarding-success/ui/onboarding-success-page-{narrow,wide}.tsx` · `onboarding-success-page.test.tsx` · `docs/fe-implement-spec/o-3/o-3.md` · `o-5/o-5.md` |
| 삭제 | 없음                                                                                                                                                                                                                                                                                                                                                                                                 |

npm 의존성 추가: 없음. orval 재생성: 없음. 라우트 추가 없음. 라우트 트리 재생성: 불필요.

### 판정 설계

`MIG-005` ADR-2의 안 B를 따른다. pathless 레이아웃 한 겹에서 한 번만 판정한다.

```ts
// app/auth/onboarding-gate.ts
export function getOnboardingRedirect(pathname: string, isOnboarded: boolean) {
  const isOnboardingForm = pathname.replace(/\/$/, '') === '/onboarding';
  if (!isOnboarded) return isOnboardingForm ? null : '/onboarding';
  return isOnboardingForm ? '/main' : null;
}
```

```ts
// _authenticated/route.tsx beforeLoad
if (!getSessionToken()) throw redirect({ to: '/' });

const user = await context.queryClient
  .query({ ...getUserQueryOptions({ query: { gcTime: Infinity } }), staleTime: 'static' })
  .catch((error) => {
    // 계정이 없으면 다시 시도해도 같으므로 세션을 지운다.
    if (isUserNotFoundError(error)) clearSession();
    // 재발급까지 거절되면 인터셉터가 세션을 지운다. 세션이 남아 있으면 판정 불가다.
    if (!getSessionToken()) throw redirect({ to: '/' });
    throw new UserCheckFailedError(error);
  });

const destination = getOnboardingRedirect(location.pathname, user.isOnboarded);
if (destination) throw redirect({ to: destination });
```

| 경로·상태                    | 결과                                             |
| ---------------------------- | ------------------------------------------------ |
| 미온보딩 + `/onboarding`     | 통과                                             |
| 미온보딩 + 그 외 전부        | `/onboarding` (`/onboarding/success` 포함)       |
| 완료 + `/onboarding`         | `/main`. 자식 가드에서 부모로 옮긴다             |
| 완료 + `/onboarding/success` | 통과. 이후 기존 `fromOnboarding` 가드가 판정한다 |
| 완료 + 그 외                 | 통과                                             |

**의도한 동작 변경 하나** — 지금 `/onboarding`은 조회 실패 시 폼을 연다. 앞으로는 재시도 화면을 보여준다.
장애 때 기존 사용자에게 온보딩 폼을 보여주는 결함이라 `MIG-005` ADR-1도 이전하지 않기로 한 동작이다.
`index.test.tsx`의 「사용자 조회가 실패해도 들여보낸다」 테스트는 이 판정을 승인받으면 새 명세(AC-9)로 대체한다.

## 3. 의존 관계 검증

없음. `app → pages` · `app → entities`는 하향이다. 새 화면 조각은 `shared/ui/card`, `shared/ui/spinner`만 쓴다.
재시도 문구는 `CardRetryStatus`가 이미 만드는 형식이라 새 문구를 짓지 않는다.

## 4. 구현 계획 체크리스트

- [x] 사전: `origin/develop`에서 작업 브랜치 생성 (#382), `pnpm install` (이 워크트리에 `apps/web/node_modules` 없음)
- [x] `[pages]` `session-check` 슬라이스: `SessionCheckPending`(`Spinner`), `SessionCheckError`(`CardRetryStatus`, `sectionName="사용자 정보"`)
- [x] `[pages]` 완료 화면 「홈으로」 `<Link to="/main" replace>` (narrow, wide) + AC-8 테스트
- [x] `[pages]` 취소 동작(`useLogout` + `/` 이동)을 `OnboardingPage`로 올려 narrow·wide에 전달, wide의 `OnboardingForm`에 `secondaryAction`으로 「이전」 연결 + AC-13 테스트. 시안에 뒤로 가기가 없다는 wide의 주석도 함께 수정
- [x] `[app]` `onboarding-gate.ts` + 판정표 단위 테스트
- [x] `[app]` `_authenticated/route.tsx`에 판정, `pendingComponent`, 표식 에러만 재시도 화면으로 그리는 `errorComponent` 연결
- [x] `[app]` `onboarding/index.tsx`의 자식 가드 제거, 테스트를 부모 게이트 기준으로 이관
- [x] `[app]` `route.test.tsx`: 실제 `routeTree` + 메모리 히스토리 + MSW로 AC-1~6, 9~12, 14 검증
- [x] `[app]` 게이트 쿼리에 `gcTime: Infinity`, `app/query/query-client.ts`에서 토큰이 사라지는 순간 `queryClient.clear()` + AC-15~18 테스트. `entities/auth`가 `app`을 참조할 수 없어 `app`에서 스토어를 구독한다
- [x] `[app]` `USER_4041`이면 세션을 지우고 `/`로 이동 + AC-19~21 테스트. `ensureQueryData` → `query`, 대기 표시 `text-cta`
- [x] 브라우저 확인: 응답 지연 시 대기 표시 렌더, 재시도 동작, 앱 재실행 경로
- [x] 문서: `o-3`의 게이트 설명과 「넓은 화면에는 취소 수단이 없다」, `o-5`의 확인 필요 항목 갱신

## 5. 리스크

| 리스크                                                                         | 영향                                                                | 대응                                                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 모든 인증 화면의 첫 렌더가 `/users` 응답을 기다린다                            | 메인 첫 화면이 왕복 한 번만큼 늦어짐. 최악 15초(요청 제한 시간)     | 대기 표시로 빈 화면 방지. 변경 전후 `/main` LCP를 번갈아 측정해 보고한다                                |
| `beforeLoad` 대기 중 `pendingComponent`가 뜨는지 코드로 확정하지 못함 (미설치) | 대기 표시 없이 빈 화면이 지속될 수 있음                             | 첫 단계에서 지연 응답으로 실측한다. 뜨지 않으면 멈추고 대안을 보고한다                                  |
| `_authenticated`의 `errorComponent`가 자식 화면의 에러까지 받을 수 있음        | 화면 렌더 에러에 「사용자 정보를 불러오지 못했어요.」가 잘못 표시됨 | `SessionCheckError` 표식일 때만 재시도 화면을 그린다. AC-14로 고정                                      |
| 제출 응답의 `isOnboarded`가 `true`가 아니면 완료 직후 온보딩으로 되돌아감      | 완료 화면 진입 실패                                                 | 응답 타입은 `UserResponse`로 확인. 실제 값은 dev 서버 수동 스모크로 확인                                |
| 넓은 화면 「이전」 버튼이 시안에 없음                                          | 유리 카드 위 표현이 디자인 의도와 다를 수 있음                      | 기존 variant로 구현하고 디자이너 확인을 PR에 명시                                                       |
| 인증 흐름 회귀                                                                 | 로그인 후 진입 전체에 영향                                          | 기존 `session-guard`, `use-logout`, OAuth 콜백 테스트 유지 + `pnpm verify`. 되돌리기는 커밋 단위 revert |
| 시안에 없는 재시도 화면                                                        | 시안 추가 시 불일치                                                 | 기존 컴포넌트 재사용, 시안 생기면 별도 대조                                                             |

**수동 스모크** (dev 서버, 미온보딩 계정 필요):

1. 로그인 → 온보딩 폼에서 앱·탭 종료 → 다시 열기 → `/onboarding`
2. `/main` 주소 입력 → `/onboarding`
3. 제출 → 완료 화면 → 「홈으로」 → 뒤로 가기 → 완료 화면이 안 보임
4. 온보딩 완료 계정으로 `/onboarding` 입력 → `/main`
5. 네트워크 차단 후 새로고침 → 재시도 화면 → 복구 후 「다시 시도」 → 화면 진입
6. 넓은 화면 온보딩에서 「이전」 → 로그인 화면, 다른 계정으로 로그인 가능

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] 화면 상태를 `docs/implementation-status.md`에 반영
- [ ] `docs/fe-implement-spec/o-3/o-3.md` · `o-5/o-5.md`에 확정 동작 승격
- [ ] `MIG-005`의 `issues.md` Issue 4에 분리 사실을 기록할지 사용자 확인
