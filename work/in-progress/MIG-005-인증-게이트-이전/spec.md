---
id: MIG-005
title: 인증 게이트 · 토큰 관리 · OAuth 로그인 이전
type: migrate
screen: '-'
priority: high
created: 2026-08-31
revised: 2026-09-09
---

# MIG-005 — 인증 게이트 · 토큰 관리 · OAuth 로그인 이전

> **상태: 착수 판단 통과. Refactor Brief · ADR 작성 완료.**
> 2026-09-08~09 백엔드와 계약을 확정해 보류 사유 3건을 해소했다(§착수 판단).
> 다음 단계는 이전 매핑(Migration Map)과 실행 이슈 분해다.

## 배경 · 목표

2026-09-02 기준 route 정의 파일 49개 중 30개가 `_authenticated` 경로 아래에 있다.
즉 인증은 "화면 하나"가 아니라 **나머지 이전 작업 대부분의 전제조건**이다.

동시에 가장 위험한 영역이기도 하다. 그래서 이전과 기준선 작성을 **분리**한다.

- 지금: 기준선만 (코드 변경 0, 위험 0)
- 나중: 기준선을 근거로 이전 가능 여부를 재판정

## 착수 판단 — 현재 판정

| 질문                               | 판정 | 근거                                                                   |
| ---------------------------------- | ---- | ---------------------------------------------------------------------- |
| 목표와 비목표가 명확한가           | 충족 | 인증 게이트·토큰·OAuth만 이전하고 로그인 UI는 제외한다                 |
| 반복 비용이나 확장 차단이 있는가   | 충족 | 인증 경로 30개와 후속 화면 이전이 이 계약에 의존한다                   |
| 기준선이 있는가                    | 충족 | 아래 A~F에 관찰 가능한 legacy 동작을 기록했다                          |
| 검증 방법이 있는가                 | 충족 | 서버 계약이 확정돼 생성 MSW 핸들러로 콜백·재발급·조회를 가로챌 수 있다 |
| 범위를 독립적으로 완료할 수 있는가 | 충족 | 아래 ADR로 경계를 확정했고 실행 이슈로 분해 가능하다                   |
| 위험을 격리했는가                  | 충족 | ADR-1~4에 실패 시 복구 경로를 명시했다                                 |

**2026-09-09 재판정.** 이전 판정에서 미충족이던 세 항목은 백엔드 계약 확정으로 해소됐다.

- `UserResponse.isOnboarded`가 추가되고 온보딩 전에도 **200**으로 응답한다(§확인 필요 6·Q).
  판정 근거가 서버에 상시 존재하므로 검증 시나리오를 고정할 수 있다.
- 게이트·재발급·OAuth·네이티브 계약의 경계를 ADR로 나눴다.
- 남은 미확정은 `VITE_OAUTH_DEST` 환경별 값 하나이며, 구현 착수를 막지 않는다.

---

## 현행 동작 기준선

> legacy 코드를 읽고 **관찰 가능한 동작만** 기록한다. 옳고 그름은 판단하지 않는다.

### A. 토큰 저장

| #   | 동작                                                            | 확인한 위치                |
| --- | --------------------------------------------------------------- | -------------------------- |
| A1  | accessToken · refreshToken을 **localStorage**에 저장            | `shared/api/config.ts`     |
| A2  | 키 이름은 `'accessToken'` · `'refreshToken'`                    | `shared/config/storage.ts` |
| A3  | 갱신 성공 시 **accessToken만** 교체한다 (refreshToken은 그대로) | `refreshAccessToken()`     |

### B. 라우트 게이트

| #   | 동작                                                                    | 확인한 위치                      |
| --- | ----------------------------------------------------------------------- | -------------------------------- |
| B1  | `/_authenticated` 하위 진입 시 `beforeLoad`에서 accessToken 존재만 확인 | `pages/_authenticated/route.tsx` |
| B2  | accessToken이 없으면 `/`로 redirect                                     | 〃                               |
| B3  | **refreshToken은 게이트에서 보지 않는다** — access만 없으면 즉시 튕긴다 | 〃                               |

### C. HTTP 인터셉터

| #   | 동작                                                                                                  | 확인한 위치                  |
| --- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| C1  | axios 인스턴스가 **두 개**다 — `privateApiClient`(인증 필요) / `publicApiClient`(불필요)              | `shared/api/config.ts`       |
| C2  | private 요청 전, 토큰이 **둘 다 없으면** 요청을 보내지 않고 즉시 실패시키며 authFailureHandler 호출   | 요청 인터셉터                |
| C3  | private 응답이 401이고 아직 재시도 전이면 → 갱신 후 원요청을 **1회** 재시도                           | 응답 인터셉터                |
| C4  | 갱신 중 재요청이 **403**이면 토큰을 지우지 않고 그대로 둔다 (권한 문제이지 인증 문제가 아니라는 판단) | 〃                           |
| C5  | 그 외 갱신 실패는 토큰을 지우고 authFailureHandler 호출                                               | 〃                           |
| C6  | 갱신은 **single-flight**다. 동시 401이 여러 개면 큐에 쌓고 하나의 갱신 결과를 공유한다                | `isRefreshing`/`failedQueue` |
| C7  | 갱신 요청은 `POST /api/v1/auth/reissue` 에 `{ refreshToken }`, **publicApiClient**로 보낸다           | `refreshAccessToken()`       |
| C8  | authFailureHandler는 `main.tsx`에서 **주입**한다 (`setAuthFailureHandler`)                            | `main.tsx:13`                |

### D. OAuth 로그인

| #   | 동작                                                                                     | 확인한 위치              |
| --- | ---------------------------------------------------------------------------------------- | ------------------------ |
| D1  | 소셜 버튼 클릭 → provider별 인가 URL을 서버에서 받아 `window.location.href`로 이동       | `useOauthLogin.ts`       |
| D2  | 이동 직전 `localStorage.returnTo = window.location.pathname` 저장                        | 〃                       |
| D3  | 콜백 라우트는 `/login/oauth2/code/$provider`, 마운트 시 **1회만** 실행                   | `pages/login/oauth2/...` |
| D4  | 쿼리스트링의 `code`를 꺼내 `oauthLogin(provider, dest, { code })` 호출                   | 〃 + `usePostOAuth.ts`   |
| D5  | 성공 시 토큰 저장 후 **`isOnboarded`면 `/main`, 아니면 `/onboarding`** 으로 replace 이동 | `usePostOAuth.ts`        |
| D6  | 에러코드 `USER_423`이면 `/restore?providerId={message}` 로 이동 (탈퇴 계정 복구 흐름)    | 〃                       |
| D7  | 그 외 에러는 toast로 메시지 표시                                                         | 〃                       |
| D8  | `dest`는 개발 모드면 `'local'`, 아니면 `VITE_OAUTH_DEST`                                 | `getLoginUrl.ts` · 콜백  |
| D9  | provider는 `'google' \| 'kakao' \| 'naver'`                                              | `getLoginUrl.ts`         |

### E. 로그아웃

| #   | 동작                                                   | 확인한 위치               |
| --- | ------------------------------------------------------ | ------------------------- |
| E1  | 토큰 삭제 → `queryClient.clear()` → `/`로 replace 이동 | `features/auth/logout.ts` |

### F. 온보딩 재진입

| #   | 동작                                                                   | 확인한 위치                                 |
| --- | ---------------------------------------------------------------------- | ------------------------------------------- |
| F1  | 온보딩 화면은 사용자 조회가 끝날 때까지 아무것도 렌더하지 않는다       | `_authenticated/_onboarding/onboarding.tsx` |
| F2  | 사용자 정보가 이미 있으면 `/main`으로 이동해 온보딩 폼 재진입을 막는다 | 같은 파일의 `<Navigate to="/main" />`       |
| F3  | 사용자 정보가 없을 때만 닉네임·프로필 입력 폼을 렌더한다               | 같은 파일                                   |

---

## 기준선을 쓰면서 발견한 것

### 1. `returnTo`는 저장만 하고 **아무도 읽지 않는다**

`useOauthLogin`이 로그인 직전 경로를 `localStorage.returnTo`에 저장하지만,
저장소 전체에서 **읽는 코드가 한 곳도 없다.** 로그인 후에는 `isOnboarded` 여부로만
`/main` 또는 `/onboarding`으로 간다.

→ "원래 보던 화면으로 돌아가기"가 **의도된 기능인데 미완성**인지,
아니면 **버려진 코드**인지 판단이 필요하다. (`확인 필요` 1번)

### 2. `features/auth/use-refresh-token.tsx`는 **전체가 주석 처리된 죽은 파일**이다

파일 전체가 주석이고, 주석 안의 코드조차 `api.public..reissueToken(` 처럼 깨져 있다.
실제 갱신 로직은 `shared/api/config.ts`의 `refreshAccessToken()`에 있다.

→ 이전 대상이 아니다. **삭제 대상**이다.

### 3. `apps/web`에는 갱신 로직이 **아직 없다**

|                | legacy                                  | apps/web                            |
| -------------- | --------------------------------------- | ----------------------------------- |
| axios 인스턴스 | private / public **2개**                | `AXIOS_INSTANCE` **1개**            |
| 토큰 주입      | 요청 인터셉터                           | 요청 인터셉터 ✅ 동일               |
| 401 처리       | **갱신 + 재시도 + 큐**                  | `notifyUnauthorized()` 호출만       |
| 토큰 읽기      | `tokenManager`가 localStorage 직접 접근 | **`configureAuth`로 주입받음** (DI) |
| 주입 호출      | `main.tsx`에서 `setAuthFailureHandler`  | **아무도 호출하지 않음**            |

apps/web의 `configureAuth`는 legacy의 `setAuthFailureHandler`와 **같은 패턴을 더 낫게 만든 것**이다.
(shared가 저장소를 모르고 상위가 주입 — `fsd-shared.md` §3의 사례)
**다만 아직 아무도 호출하지 않아 실제로는 토큰이 붙지 않는다.**

### 4. public/private 분리를 유지할지 결정이 필요하다

legacy는 인스턴스 2개로 "인증 필요/불필요"를 나눴다. apps/web은 1개다.
orval 생성 코드는 전부 `customInstance` 하나를 지나가므로, 분리하려면 별도 설계가 필요하다.

→ **분리를 유지할지, 단일 인스턴스로 갈지**가 이전 설계의 첫 갈림길이다. (`확인 필요` 3번)

---

## 시안 대조 결과

**해당 없음** — 로그인 화면 UI는 별도 작업이다. 이 문서는 **인증 흐름(로직)**만 다룬다.

### 확인 필요 — 판정 결과 (2026-09-09)

| #   | 항목                      | 판정                                                                                                                                                            |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `returnTo` 미완성 기능    | **이전하지 않는다.** 저장만 하고 읽는 곳이 없는 죽은 코드다. 로그인 후 원래 화면 복귀가 필요하면 별도 `FEAT-`로 다룬다                                          |
| 2   | 403 특례(C4)              | **legacy 동작 그대로 보존.** C4b가 의도인지 사고인지는 미결이며, 변경은 별도 `FIX-`로 분리한다                                                                  |
| 3   | public/private 인스턴스   | **단일 인스턴스 유지.** 재발급 요청만 인터셉터를 우회한다 (ADR-3)                                                                                               |
| 4   | 게이트가 accessToken만 봄 | **보존.** legacy는 갱신 실패 시에만 토큰을 지우므로 만료된 토큰은 저장소에 남아 401→갱신 경로를 탄다. B3는 토큰이 아예 없을 때만 발동해 갱신 기회를 뺏지 않는다 |
| 5   | `VITE_OAUTH_DEST` 값      | **미확정.** `apps/web/.env.example`에 항목이 없다. legacy는 `import.meta.env.DEV ? 'local' : VITE_OAUTH_DEST`를 쓴다. 구현 착수 전 환경별 값을 확정한다         |
| 6   | 온보딩 1회 접근 계약      | **명시적 계약으로 간다.** `UserResponse.isOnboarded`가 추가됐고 온보딩 전에도 200으로 응답한다. 사용자 정보 존재 여부 추론을 쓰지 않는다                        |

#### 확정된 서버 계약 (2026-09-08~09 협의)

| 항목                                | 결과                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `UserResponse.isOnboarded: boolean` | **추가됨.** orval 재생성 반영 완료                                          |
| 온보딩 전 `GET /api/v1/users`       | **200.** `nickname`·`profileImgNumber`에는 서버 기본값이 들어온다           |
| `nickname` nullable 여부            | non-nullable 유지. 기본값이 오므로 **게이트는 닉네임을 판정에 쓰지 않는다** |
| 재발급 응답 형태                    | `ReissueResponse { accessToken }` 유지. `isOnboarded`·`role`은 넣지 않는다  |
| `/oauth/android` 경로명             | 플랫폼 중립 변경 요청함. iOS도 당분간 이 경로를 그대로 사용한다             |

> ⚠️ **파생 위험** — 이 변경이 운영 서버에 배포되면 `apps/legacy-web`의 온보딩이 깨진다.
> `onboarding.tsx`·`success.tsx` 두 곳이 "조회 성공 = 온보딩 완료"로 판정하는데,
> 이제 미온보딩 사용자에게도 200이 오기 때문이다. 2026-09-09 기준 dev 서버에만 반영돼 있다.
> 이 수정은 이 작업 범위 밖이므로 **별도 `FIX-` 항목으로 분리**한다.

---

## Refactor Brief

### 목적

인증 게이트·토큰 관리·OAuth 로그인을 `apps/web`으로 이전하면서, **웹과 네이티브가 하나의 세션
계약을 공유**하도록 경계를 정리한다. `apps/web`의 `configureAuth`는 이미 있으나 호출자가 없어
실제로는 토큰이 붙지 않는다(발견 3).

### 범위

| 대상                    | 내용                                                     | 보존할 계약 |
| ----------------------- | -------------------------------------------------------- | ----------- |
| 세션 저장·복원          | 토큰 저장, `configureAuth` 주입, 복원 시점               | A1~A3       |
| 인증 게이트             | 라우트 진입 판정, redirect 목적지                        | B1~B3       |
| 토큰 갱신               | 401 → 재발급 → 1회 재시도, single-flight 큐, 403 특례    | C2~C8       |
| OAuth 로그인 (웹)       | 인가 URL 조회 → 리다이렉트 → 콜백 1회 실행 → 목적지 분기 | D1·D3~D9    |
| 로그아웃                | 토큰 삭제 → 캐시 비움 → `/` 이동                         | E1          |
| 온보딩 게이트           | 미완료자만 진입, 완료자 재진입 차단                      | F1~F3       |
| 웹→네이티브 메시지 계약 | 토큰 보관·삭제 요청, 복원 수신, 핸드셰이크 대기          | 신규        |

### Out of Scope

- **네이티브 앱 구현** — SecureStore 보관, 메시지 수신, 네이티브 SDK OAuth. 별도 `NAT-`
- **로그인 화면 UI** — 소셜 버튼 디자인·배치. 별도 작업
- **`returnTo` 복귀 기능** — 죽은 코드이므로 이전하지 않는다 (확인 필요 1)
- **403 특례의 옳고 그름** — legacy 동작을 보존한다 (확인 필요 2)
- **`apps/legacy-web` 온보딩 수정** — 별도 `FIX-`
- **탈퇴 계정 복구 화면** — 콜백의 `USER_423` → `/restore` 이동(D6)은 이전하되, `/restore` 화면과 `PATCH /users/restore` 호출은 별도 작업

### 성공 기준

- 매핑표의 대상이 전량 반영되고, 각 실행 이슈의 동작 보존 AC를 통과한다
- `pnpm lint` · `check-types` · `test` · `build` 4종 통과
- 범위표에 적힌 계약이 테스트 또는 명시적 수동 검증으로 확인된다

---

## 기술 결정 (ADR)

### ADR-1. 세션 상태를 무엇이 소유하는가

**Context** — `isOnboarded`는 로그인 응답에만 있고 재조회가 불가능했다. 2026-09-09 백엔드가
`UserResponse`에 추가하고 온보딩 전에도 200으로 응답하도록 바꿔 **상시 재조회가 가능**해졌다.

| 안                                                 | 평가                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| A. 토큰·`isOnboarded` 모두 클라이언트 저장소       | 진입이 빠르지만 서버 데이터를 복제한다. 어긋나면 회수 장치가 없어 사용자가 빈 화면에 갇힌다 |
| **B. 토큰만 저장소, `isOnboarded`는 서버 조회** ✅ | 진실이 하나. 헤더·마이페이지가 어차피 사용자 정보를 조회하므로 요청이 늘지 않는다           |
| C. 토큰도 서버 세션(httpOnly 쿠키)                 | 서버가 Bearer 방식이라 계약 변경 규모가 크다. 이번 범위 밖                                  |

**Decision** — **B.** 세션 store는 `accessToken`과 `isRestored`만 갖는다. 온보딩 완료 여부는
`GET /api/v1/users`의 `isOnboarded`에서 파생하고 클라이언트에 저장하지 않는다. `nickname`은
온보딩 전에도 기본값이 오므로 **판정에 쓰지 않는다.**

세션 상태는 **네 가지**다. 온보딩 완료 여부는 별도 상태가 아니라 `authenticated` 안의 필드다.

```ts
type SessionState =
  | { status: 'loading' } // 저장소 읽기 + (네이티브면) 핸드셰이크 + 사용자 조회 중
  | { status: 'error'; retry: () => void } // 401 이외의 실패
  | { status: 'anonymous' } // 토큰 없음 또는 401
  | { status: 'authenticated'; accessToken: string; user: UserResponse };
```

**온보딩을 상태로 승격하지 않는 이유** — 세션 유효성과 사용자 속성은 다른 축이다. 상태로 쪼개면
"세션이 있는가"만 알면 되는 소비자(헤더의 로그아웃 버튼 등)가 두 변형을 모두 검사해야 하고,
`role` 같은 다른 플래그가 게이트에 추가될 때마다 상태가 곱으로 늘어난다. 필드로 두면 필드 하나가
는다.

가드의 분기는 이 네 상태에서 파생한다.

```
loading                                  → 스플래시
error                                    → 재시도 화면
anonymous                                → 로그인 화면
authenticated · user.isOnboarded false   → /onboarding 만 허용
authenticated · user.isOnboarded true    → 서비스 전체
```

**Consequences** — 앱 진입 시 사용자 조회 1회를 기다리는 구간이 생긴다. 기준선 F1이 이미 같은
동작이므로 회귀가 아니며, `staleTime`으로 화면 이동마다 반복되지 않게 한다. 대기는 `NAT-011`의
스플래시 안에서 흡수한다. `error`를 `anonymous`로 흡수하지 않는 것이 중요하다 — legacy는 조회
실패를 전부 미완료로 처리해 **장애 시 정상 사용자에게 온보딩 폼을 보여주는 결함**이 있다. 이
결함은 이전하지 않는다.

### ADR-2. 인증 게이트를 라우트에 어떻게 배치하는가

**Context** — 게이트 조건은 둘이다. 로그인 여부(B)와 온보딩 완료 여부(F). legacy는 전자만
라우트로 처리하고 후자는 컴포넌트 안 `<Navigate>`로 처리했다.

| 안                                                     | 평가                                                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| A. pathless layout 두 겹 (`_protected` + `_onboarded`) | 요구가 트리에 드러나지만 판정이 두 번이다. 온보딩 완료 직후 두 게이트 사이에서 상태가 어긋나면 다시 튕긴다 |
| **B. pathless layout 한 겹 + 경로 비교** ✅            | 판정이 한 번이라 그 창이 없다. 부모 `beforeLoad`가 자식 진입마다 실행되므로 화면이 늘어도 자동 적용된다    |
| C. legacy 방식 (컴포넌트 안 `<Navigate>`)              | 화면마다 분기가 복제된다. 인증 경로가 30개로 늘어나면 누락이 생긴다                                        |

**Decision** — **B.** `app/routes/_protected.tsx` 하나에서 두 조건을 판정한다. 이름은
`_authenticated`가 아니라 `_protected`를 쓴다 — 가드의 역할을 말하고, 게이트가 중첩될 때 플랫
파일명이 길어지지 않는다. `apps/web`에 해당 라우트가 아직 없어 rename이 아니라 신규 작명이다.

```
index.tsx / privacy.tsx / terms.tsx     공개
login.oauth2.code.$provider.tsx         OAuth 콜백
_protected.tsx                          ← 게이트 한 곳
  _protected.onboarding.tsx             /onboarding
  _protected.{main,learning,…}.tsx      서비스 화면
```

**Consequences** — 가드에 온보딩 경로 상수 하나가 등장한다. 온보딩 경로가 하나뿐이라 감당
가능하다. `beforeLoad`가 사용자 조회를 기다리므로 비동기가 되고, 대기 구간은 `pendingComponent`로
표현한다. 온보딩 경로가 여러 개로 늘어나면 A안을 다시 검토한다.

### ADR-3. HTTP 인스턴스를 분리할 것인가

**Context** — legacy는 `privateApiClient` / `publicApiClient` 둘을 두었다(C1). `apps/web`은
`AXIOS_INSTANCE` 하나이고, orval 생성 코드가 전부 `customInstance`를 지나간다.

| 안                             | 평가                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| A. legacy처럼 2개로 분리       | 생성 코드가 단일 mutator를 쓰므로 어느 엔드포인트가 어느 인스턴스인지 수동 관리해야 한다 |
| **B. 단일 + 재발급만 우회** ✅ | 생성물과 충돌하지 않는다. 재귀를 막아야 하는 요청은 재발급 하나뿐이다                    |

**Decision** — **B.** `customInstance` 하나를 유지하고 **재발급 요청만** 인터셉터를 타지 않는
최소 경로로 보낸다. 재발급이 401을 받아 다시 재발급을 시도하는 재귀를 막기 위해서다.

**Consequences** — "인증 불필요" 엔드포인트에도 토큰이 붙지만 서버가 무시하므로 무해하다.
토큰이 붙으면 실패하는 엔드포인트가 나타나면 그때 분리를 재검토한다.

### ADR-4. 네이티브와 세션을 주고받는 계약

**Context** — 이번 범위는 웹이 보내고 받는 계약까지다. 네이티브 구현은 `NAT-`로 분리한다.
네이티브 셸에는 이미 `userAgent="GravitNative/1.0"`이 있어 컨텍스트 판별 수단이 있다.

| 안                                          | 평가                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------ |
| **A. 웹이 세션을 소유, 네이티브는 보관** ✅ | 웹 로그인만으로 완결된다. 네이티브가 아직 듣지 않아도 무해해 단계적으로 붙일 수 있다 |
| B. 네이티브가 소유, 웹에 주입               | 네이티브 구현 전까지 웹이 동작하지 않아 이번 범위를 독립적으로 완료할 수 없다        |

**Decision** — **A.** 메시지는 네 종류다.

```
웹 → 네이티브    AUTH_SIGNED_IN { token }   보관 요청
                 AUTH_SIGNED_OUT            삭제 요청
네이티브 → 웹    AUTH_TOKEN { token }       복원
                 AUTH_NONE                  토큰 없음 확정
```

네이티브가 보낸 토큰으로 세션을 복원할 때는 `AUTH_SIGNED_IN`을 되돌려 보내지 않는다(왕복 방지).
네이티브가 둘 중 어느 것도 보내지 않을 때를 대비해 **핸드셰이크 대기 상한**을 둔다. 저장소에
토큰이 이미 있으면 대기하지 않으므로 로그인 사용자는 영향받지 않는다.

**Consequences** — 이번 작업이 끝나도 네이티브는 아무것도 하지 않으므로 앱에서는 웹 저장소만으로
동작한다. 의도된 중간 상태이며 `NAT-`가 수신부를 붙이면 완성된다. 계약을 웹 쪽에 먼저 고정해
두면 네이티브 작업이 계약을 다시 협상하지 않는다.

---

## Migration Map

`import 영향`은 2026-09-09 `apps/legacy-web/src` 실측값이다(`@generated` 제외). `apps/web`에는
아직 인증 코드가 없어 신규 파일의 영향은 0이다.

**슬라이스 이름** — `.claude/rules`가 `entities/auth`·`useAuthStore`를 명시하므로 그 어휘를 쓴다
(`fsd-shared.md` §3, `state-convention.md` §5, `fsd-pages.md` §7). 행동은 `fsd-features.md`의
`{대상}-{행동}` 규칙에 따라 `auth-login`·`auth-logout`이다.

### 단계 1 — 세션 계약과 저장소 (Issue #196)

| 현재 경로 (legacy)                               | 목표 경로 (apps/web)                      | 변경 종류    | import 영향  | 보존 계약 |
| ------------------------------------------------ | ----------------------------------------- | ------------ | ------------ | --------- |
| `shared/config/storage.ts` (`STORAGE_KEYS`)      | `entities/auth/model/auth-storage.ts`     | merge        | 2곳          | A2        |
| `shared/api/config.ts` — `tokenManager`          | `entities/auth/model/auth-store.ts` · 〃  | split        | **11곳**     | A1·A2     |
| `shared/api/config.ts` — `setAuthFailureHandler` | `shared/api/auth-token.ts` **이미 존재**  | 대응물 존재  | 호출자 0곳   | C8        |
| —                                                | `entities/auth/model/session-contract.ts` | new          | —            | A1·C8     |
| —                                                | `entities/auth/model/session.ts`          | new          | —            | ADR-1     |
| `main.tsx`의 `setAuthFailureHandler` 호출        | `app/auth/auth-provider.tsx`              | move+rewrite | apps/web 1곳 | C8        |

> `tokenManager` 11곳 중 5곳은 화면(`app/router.tsx` · `pages/index.tsx` · `entry-layout.tsx` ·
> `SettingBox.tsx` · `pages/__index.tsx`)에서 토큰을 직접 읽거나 지운다. `apps/web`에서는 이
> 접근이 전부 세션 계약을 거치게 한다 — 저장소를 직접 만지는 코드를 새로 만들지 않는다.

### 단계 2 — 토큰 갱신

| 현재 경로 (legacy)                                                             | 목표 경로 (apps/web)                                         | 변경 종류     | import 영향    | 보존 계약 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------- | -------------- | --------- |
| `shared/api/config.ts` — `refreshAccessToken` · `isRefreshing` · `failedQueue` | `shared/api/refresh-token.ts` + `axios-instance.ts` 인터셉터 | split+rewrite | 내부 전용      | C3~C7     |
| `shared/api/config.ts` — `privateApiClient` · `publicApiClient`                | **이전하지 않는다** (ADR-3)                                  | drop          | 배럴 경유 32곳 | C1 폐기   |
| `features/auth/use-refresh-token.tsx`                                          | **삭제**                                                     | delete        | 0곳            | —         |

> `use-refresh-token.tsx`는 전체가 주석이고 주석 속 코드도 깨져 있다(발견 2). 이전 대상이 아니다.

### 단계 3 — OAuth 로그인 · 로그아웃

| 현재 경로 (legacy)                      | 목표 경로 (apps/web)                                                   | 변경 종류    | import 영향 | 보존 계약 |
| --------------------------------------- | ---------------------------------------------------------------------- | ------------ | ----------- | --------- |
| `entities/login/api/getLoginUrl.ts`     | `features/auth-login/api/get-login-url.ts`                             | move         | 4곳         | D1·D8·D9  |
| `entities/login/model/useOauthLogin.ts` | `features/auth-login/model/use-oauth-login.ts`                         | move+rewrite | 〃          | D1        |
| `entities/login/model/usePostOAuth.ts`  | `features/auth-login/api/use-oauth-callback.ts`                        | move         | 〃          | D4~D7     |
| `pages/login/oauth2/code/$provider.tsx` | `app/routes/login.oauth2.code.$provider.tsx` + `pages/oauth-callback/` | split        | 1곳         | D3·D5     |
| `features/auth/logout.ts`               | `features/auth-logout/model/use-logout.ts`                             | move         | 2곳         | E1        |

> `useOauthLogin`의 `returnTo` 저장(D2)은 옮기지 않는다(확인 필요 1). 콜백의 `USER_423` →
> `/restore` 이동(D6)은 옮기되 `/restore` 화면 자체는 범위 밖이다.

### 단계 4 — 인증 게이트

| 현재 경로 (legacy)                                       | 목표 경로 (apps/web)                          | 변경 종류     | import 영향      | 보존 계약 |
| -------------------------------------------------------- | --------------------------------------------- | ------------- | ---------------- | --------- |
| `pages/_authenticated/route.tsx`                         | `app/routes/_protected.tsx`                   | move+rewrite  | 하위 라우트 30개 | B1~B3     |
| —                                                        | `entities/user/api/` (생성 `useGetUser` 노출) | new           | —                | F 판정    |
| `pages/_authenticated/_onboarding/onboarding.tsx`의 판정 | `app/routes/_protected.tsx`로 승격            | move (판정만) | 1곳              | F1~F3     |

> `GET /api/v1/users`는 `UserResponse`를 반환하므로 `entities/user`가 소유한다. `entities/auth`가
> 감싸면 한 slice에 두 도메인이 섞인다(`fsd-entities.md` §6). 두 엔티티는 서로를 참조할 수 없으므로
> 토큰과 사용자를 합치는 판정은 게이트(`app`)에서 한다 — app만 두 엔티티를 모두 참조할 수 있다.

> 온보딩 화면 본체(닉네임·프로필 폼)는 이 작업 범위가 아니다. 게이트가 참조할 라우트 자리만
> 만들고, 화면 이전은 별도 작업에서 한다.

### 단계 5 — 네이티브 메시지 계약

| 현재 경로 | 목표 경로 (apps/web)                    | 변경 종류 | import 영향 | 보존 계약 |
| --------- | --------------------------------------- | --------- | ----------- | --------- |
| —         | `entities/auth/model/native-message.ts` | new       | —           | ADR-4     |
| —         | `entities/auth/model/native-bridge.ts`  | new       | —           | ADR-4     |

> 메시지 타입을 `apps/native`와 공유할 공용 패키지는 아직 없다(`packages/`에 설정 패키지 3개뿐).
> 이번에는 `apps/web` 안에 두고, 공용 패키지 승격 여부는 수신부를 만드는 `NAT-`에서 판단한다.

### 이전하지 않는 것

| 대상                                                          | 사유                                   |
| ------------------------------------------------------------- | -------------------------------------- |
| `pages/restore.tsx` · `features/user/use-restore-account.tsx` | 복구 화면은 별도 작업 (Out of Scope)   |
| `features/onboarding/api/usePostOnboarding.ts`                | 온보딩 화면 본체와 함께 별도 작업      |
| `features/profile/*`                                          | 온보딩 폼 UI. 별도 작업                |
| `features/login/ui/social-login-button.tsx`                   | 로그인 화면 UI. 별도 작업              |
| `shared/api/config.ts`의 `Configuration` 2종                  | 구 생성 클라이언트용. orval이 대체했다 |

## 확정 명세 · 검증 기준

> 실행 이슈별 AC는 `issues.md`에 쓴다. 기준선 A~F 중 §Refactor Brief 범위표에 적힌 계약이
> 검증 기준의 원본이다.

## Changelog

| 날짜       | 요약                                          | 사유                                                                                              | 연관 항목 |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------- |
| 2026-08-31 | 현행 동작 기준선 26항목 + 발견 4건            | 인증 경로 다수의 전제조건이라 이전 전에 흐름을 문서로 고정                                        | -         |
| 2026-09-02 | 착수 게이트·라우트 수·온보딩 기준선 갱신      | 현재 규칙과 저장소 실측 결과를 반영                                                               | #186      |
| 2026-09-09 | 확인 필요 6건 판정 · Refactor Brief · ADR 4건 | 백엔드가 `UserResponse.isOnboarded`를 추가하고 온보딩 전 200 응답을 확정해 보류 사유 3건이 해소됨 | -         |
| 2026-09-09 | Issue 1(세션 계약·토큰 저장소) 구현 및 검증   | 검사 4종 통과, AC-1~7 대조 완료. Issue 2~5는 미착수                                               | #196      |
