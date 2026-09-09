---
id: 'MIG-005'
planned: '2026-09-09'
mode: 'migrate'
---

# MIG-005 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**
> 실행 이슈 5개(`issues.md`) 전체의 구현 순서를 담는다. 이슈마다 이 파일을 덮어쓰지 않는다.

## 0. 모드 판정

`mode: migrate` — `apps/legacy-web`에 있는 인증 게이트·토큰 관리·OAuth 로그인을 `apps/web`으로
옮긴다. 동작 변경은 넣지 않는다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                          |
| --- | ----------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | 예  | `spec.md` Refactor Brief의 범위표 7항목과 Out of Scope 6항목                                                                  |
| 2   | 반복 비용이나 확장 차단이 있는가    | 예  | legacy 라우트 49개 중 30개가 인증 경로 아래다. 이 계약 없이는 후속 화면 이전을 시작할 수 없다                                 |
| 3   | 보존할 동작의 기준선이 있는가       | 예  | `spec.md` 기준선 A1~F3 (26항목). 각 이슈 AC가 이 항목을 참조한다                                                              |
| 4   | 자동 또는 수동 검증 방법이 있는가   | 예  | 생성 MSW 핸들러로 요청 도달·중복 호출·성공/실패 흐름을 검증한다. AC 37개 중 통합 23 · 단위 14. 아래 §5-1에 수동 검증도 적었다 |
| 5   | 범위를 독립적으로 완료할 수 있는가  | 예  | `issues.md`의 이슈 5개가 각각 동작 보존 단위다. 의존은 1→(2·3·5), 3→4 뿐이다                                                  |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | 예  | §5 리스크표. 인증·생성물·라우트 트리 경계를 각각 적었다                                                                       |

### 0-2. 자동 보류 신호 — 하나라도 해당하면 **중단**

- [ ] 동작 변경이 같이 들어감 → **해당 없음.** 403 특례(C4)·게이트 판정(B3)은 legacy 그대로 보존하고
      변경은 별도 `FIX-`로 뺐다 (`spec.md` 확인 필요 판정 2·4)
- [ ] 한 단위로 완료·검증할 수 없음 → **해당 없음.** 5개 이슈로 분해했다
- [ ] 자동 생성물을 직접 손봐야 함 → **해당 없음.** `routeTree.gen.ts`는 재생성으로만 갱신하고,
      `shared/api/generated/`는 읽기만 한다
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 → **해당 없음.** `format:check` 실패는
      `REF-003`의 기존 사유이고, 이번에 만드는 파일은 prettier를 통과시킨다
- [ ] 범위 밖 문제가 섞임 → **해당 없음.** legacy 온보딩 수정은 별도 `FIX-`로 분리한다 (§5 참고)

---

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                    | 레이어                 | 이슈 |
| --- | ------------------------------------------- | ---------------------- | ---- |
| 1   | 세션 계약 3함수와 토큰 저장소               | `[entities]`           | 1    |
| 2   | HTTP 계층에 세션 구현 주입                  | `[shared]` `[app]`     | 1    |
| 3   | 부팅 시 저장소 복원                         | `[app]`                | 1    |
| 4   | 401 → 재발급 → 1회 재시도, single-flight 큐 | `[shared]`             | 2    |
| 5   | 인가 URL 조회와 provider 이동               | `[features]`           | 3    |
| 6   | 콜백 코드 교환과 목적지 분기                | `[features]` `[pages]` | 3    |
| 7   | 로그아웃                                    | `[features]`           | 3    |
| 8   | 사용자 조회 (온보딩 판정 근거)              | `[entities]`           | 4    |
| 9   | 인증·온보딩 게이트                          | `[app]`                | 4    |
| 10  | 네이티브 메시지 계약과 핸드셰이크           | `[entities]` `[app]`   | 5    |

---

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | **Issue 1** `shared/api/index.ts` · `entities/auth/model/{auth-store,auth-storage,session-contract}.ts` · 같은 폴더 테스트 2 · `entities/auth/index.ts` · `app/auth/auth-provider.tsx`<br>**Issue 2** `shared/api/refresh-token.ts` + 테스트<br>**Issue 3** `features/auth-login/{api,model}/*` · `features/auth-logout/model/use-logout.ts` · `pages/oauth-callback/*` · `app/routes/login.oauth2.code.$provider.tsx` · `app/routes/_protected.{main,onboarding}.tsx`<br>**Issue 4** `entities/user/{api,index}.ts` · `app/routes/_protected.tsx`<br>**Issue 5** `entities/auth/model/{native-message,native-bridge}.ts` + 테스트 |
| 수정 | `src/main.tsx` (Issue 1) · `shared/api/axios-instance.ts` (Issue 2) · `vitest.setup.ts` (Issue 1) · `shared/api/mocks/browser.ts` (필요 시) · `app/routeTree.gen.ts` (**재생성**)                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 삭제 | 없음. `apps/web`에 대응물이 없다. legacy 파일 삭제는 폐기 조건 충족 후 별도 작업                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**npm 의존성 추가: 없음.** `zustand@5` · `@tanstack/react-query@5` · `@tanstack/react-router@1` ·
`axios@1` · `msw@2`가 모두 설치돼 있다.

### 2-1. 이전 매핑

정본은 `spec.md`의 Migration Map이다. 여기서는 실측 수치만 옮긴다.

| 현재 위치 (legacy)                                 | 목표 위치 (apps/web)                       | 변경 종류   | import 영향      |
| -------------------------------------------------- | ------------------------------------------ | ----------- | ---------------- |
| `shared/config/storage.ts`                         | `entities/auth/model/auth-storage.ts`      | 병합        | 2곳              |
| `shared/api/config.ts` — `tokenManager`            | `entities/auth/model/*` 3파일              | 분해        | **11곳**         |
| `shared/api/config.ts` — 갱신·큐                   | `shared/api/refresh-token.ts` + 인터셉터   | 분해+재작성 | 내부 전용        |
| `shared/api/config.ts` — private/public 클라이언트 | **이전하지 않음** (ADR-3)                  | 폐기        | 배럴 경유 32곳   |
| `entities/login/*` 3파일                           | `features/auth-login/*`                    | 이동        | 4곳              |
| `features/auth/logout.ts`                          | `features/auth-logout/model/use-logout.ts` | 이동        | 2곳              |
| `pages/login/oauth2/code/$provider.tsx`            | 라우트 어댑터 + `pages/oauth-callback/`    | 분해        | 1곳              |
| `pages/_authenticated/route.tsx`                   | `app/routes/_protected.tsx`                | 이동+재작성 | 하위 라우트 30개 |
| `features/auth/use-refresh-token.tsx`              | **삭제 대상** (주석뿐인 죽은 파일)         | 이전 안 함  | 0곳              |

---

## 3. 의존 관계 검증

FSD 위반이 생길 수 있는 지점 세 곳을 확인했다.

**① `shared`가 세션을 알아야 하는가** — 아니다. `shared/api/auth-token.ts`의 `configureAuth`가
이미 주입 지점이다. `entities/auth`가 부팅 시 구현을 넣는다 (`fsd-shared.md` §3의 사례 그대로).
상향 import 없음.

**② `entities/auth`가 `entities/user`를 부르는가** — 부르지 않는다. 그래서 세션 상태와 온보딩
여부를 합치는 판정은 `app/routes/_protected.tsx`에서 한다. `app`만 두 엔티티를 모두 참조할 수 있다.
합성 훅(`use-session.ts`)을 엔티티에 만들지 않는다.

**③ `features/auth-login`이 라우팅을 결정하는가** — 결정하지 않는다. 콜백 후 목적지는
`pages/oauth-callback`이 정하고, feature는 결과만 돌려준다 (`fsd-features.md` §6).

**배럴** — `shared/api`에 배럴이 없어 `configureAuth`를 파일 경로로 참조하게 된다.
Issue 1에서 `shared/api/index.ts`를 만들어 필요한 것만 노출한다. `generated/`는 배럴 없이
`entities`/`features`의 `api/` segment에서만 참조한다 (`api-convention.md` §3).

---

## 4. 구현 계획 체크리스트

> 레이어 순서는 `shared → entities → features → pages → app`.
> Issue 2 · 3 · 5는 Issue 1 이후 병렬 가능. Issue 4는 Issue 3 이후.

### Issue 1 — 세션 계약과 토큰 저장소 (#196)

- [ ] `[shared]` `shared/api/index.ts` 배럴 — `configureAuth` · `customInstance` · 타입만 노출
- [ ] `[entities]` `entities/auth/model/auth-storage.ts` — 저장소 읽기·쓰기·삭제, 키 상수
- [ ] `[entities]` `entities/auth/model/auth-store.ts` — `accessToken` · `isRestored` (selector 필수)
- [ ] `[entities]` `entities/auth/model/session-contract.ts` — 3함수 + `configureAuth` 주입
- [ ] `[entities]` `entities/auth/index.ts` 배럴 — 계약 3함수와 store 훅만 내보낸다
- [ ] `[entities]` 테스트 — `auth-storage.test.ts` · `session-contract.test.ts` (AC-1·4·6·7)
- [ ] `[app]` `app/auth/auth-provider.tsx` — 복원 후 `isRestored` 확정
- [ ] `[app]` `src/main.tsx`에 프로바이더 연결
- [ ] `[infra]` `vitest.setup.ts`에 `msw/node` 서버 추가 — AC-2·3·5와 이후 이슈 전부가 쓴다
- [ ] `[infra]` 통합 테스트 — 헤더 부착·미부착·401 정리 (AC-2·3·5)

### Issue 2 — 토큰 갱신

- [ ] `[shared]` `shared/api/refresh-token.ts` — 재발급 호출, single-flight 큐, 인터셉터 우회
- [ ] `[shared]` `shared/api/axios-instance.ts` 응답 인터셉터에 연결
- [ ] `[shared]` 테스트 — AC-1~7 전부 (단위)

### Issue 3 — OAuth 로그인 · 로그아웃

- [ ] `[features]` `features/auth-login/api/get-login-url.ts` (dest 계산 포함)
- [ ] `[features]` `features/auth-login/model/use-oauth-login.ts` (`returnTo` 제외)
- [ ] `[features]` `features/auth-login/api/use-oauth-callback.ts`
- [ ] `[features]` `features/auth-logout/model/use-logout.ts`
- [ ] `[features]` 각 slice `index.ts` 배럴
- [ ] `[pages]` `pages/oauth-callback/ui/oauth-callback-page.tsx` + 배럴 — 목적지 결정은 여기서
- [ ] `[app]` `app/routes/login.oauth2.code.$provider.tsx` 라우트 어댑터
- [ ] `[app]` `app/routes/_protected.{main,onboarding}.tsx` — **빈 자리 라우트만**
- [ ] `[app]` **라우트 트리 재생성** 후 `check-types`
- [ ] 테스트 — AC-1~7

### Issue 4 — 인증·온보딩 게이트

- [ ] `[entities]` `entities/user/api/index.ts` — 생성 `useGetUser` 선택적 re-export
- [ ] `[entities]` `entities/user/index.ts` 배럴
- [ ] `[app]` `app/routes/_protected.tsx` — `beforeLoad` 판정 + `pendingComponent`
- [ ] `[app]` **라우트 트리 재생성** 후 `check-types`
- [ ] 테스트 — AC-1~9 (redirect 4방향 + 에러 2종 + 대기 + 무효화)

### Issue 5 — 네이티브 메시지 계약

- [ ] `[entities]` `entities/auth/model/native-message.ts` — 메시지 4종 타입, 대기 상한 상수
- [ ] `[entities]` `entities/auth/model/native-bridge.ts` — 전송, 네이티브 컨텍스트 판별
- [ ] `[entities]` `session-contract.ts`에 전송 지점 연결
- [ ] `[app]` `app/auth/auth-provider.tsx`에 수신·핸드셰이크 대기
- [ ] 테스트 — AC-1~7

---

## 5. 리스크

| 리스크                                              | 영향                                               | 대응                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 세션 계약을 우회해 저장소를 직접 읽는 코드가 생긴다 | 진실이 둘이 되어 로그아웃이 일부 화면에 안 먹는다  | `entities/auth` 배럴에 계약 3함수와 store 훅만 노출한다. `auth-storage`는 slice 밖으로 내보내지 않는다   |
| 재발급과 401 인터셉터가 서로를 부른다               | 무한 요청                                          | 재발급 요청만 인터셉터를 우회한다 (ADR-3 · Issue 2 AC-7)                                                 |
| MSW 전역 서버 도입이 기존 테스트 21개에 영향        | 통과하던 테스트가 깨진다                           | `onUnhandledRequest` 정책을 명시하고 Issue 1에서 전체 테스트를 재실행한다                                |
| 라우트 트리 재생성 누락                             | `check-types` 실패, 원인 파악이 어렵다             | Issue 3·4 체크리스트에 재생성 단계를 넣었다                                                              |
| 게이트가 캐시된 `isOnboarded`를 본다                | 온보딩 직후 되돌아가는 경합                        | Issue 4 AC-9로 무효화 후 재판정을 검증한다. 제출 화면의 무효화 의무는 `issues.md`에 후속 계약으로 남겼다 |
| **legacy 온보딩이 서버 변경으로 깨진다**            | dev는 이미, prod 배포 시 신규 가입자가 온보딩 불가 | **이 작업 범위 밖.** 별도 `FIX-`로 분리한다. 아직 항목을 만들지 않았다                                   |
| `work/in-progress/`가 브랜치별로 갈린다             | 머지 후 in-progress가 둘이 되어 규칙 위반          | NAT-011이 `done`으로 가기 전에는 이동을 보류하거나, 머지 시점에 한쪽을 정리한다 (§6 참고)                |
| `VITE_OAUTH_DEST` 값 미확정                         | Issue 3에서 인가 URL의 `dest`를 정할 수 없다       | Issue 3 착수 전에 환경별 값을 확정한다. Issue 1·2·5는 막지 않는다                                        |

### 5-1. 동일성 확인 방법

| 방법        | 대상                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| 자동 테스트 | AC 37개 — 단위 14(계약·갱신·브릿지) · 통합 23(헤더 부착, 콜백 1회 호출, redirect 4방향, 에러 분기)        |
| 수동 스모크 | 로그인 → 새로고침 → 세션 유지 / 로그아웃 → 새로고침 → 로그인 화면 / 미온보딩 계정으로 `/main` 진입 → 차단 |
| 명시적 대조 | 기준선 A1~F3 각 항목을 `checklist.md`에서 이전 전후로 대조한다 (`ai-validate`)                            |
| 네이티브    | Issue 5는 수신부가 없으므로 **웹 단독 동작 무변화**만 확인한다. 앱 실기기 검증은 후속 `NAT-`              |

---

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동 (`git mv`)
- [ ] `docs/implementation-status.md`에 인증 흐름 구현 상태 반영
- [ ] `docs/migration-status.md`에 legacy 인증 대체 진행 상황 반영 — **생략 금지**
- [ ] `spec.md`의 확정 계약을 `docs/fe-implement-spec/`으로 승격
- [ ] 네이티브 메시지 계약을 `NAT-` 작업이 참조할 수 있게 문서화
- [ ] legacy 온보딩 수정을 별도 `FIX-` 항목으로 등록
