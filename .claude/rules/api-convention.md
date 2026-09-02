# API 규칙 (orval + TanStack Query + MSW)

API 클라이언트는 **손으로 쓰지 않는다.** OpenAPI 문서에서 orval이 생성한다.
설정은 `apps/web/orval.config.ts`에 둔다.

---

## 1. 흐름

```
백엔드 OpenAPI
  → openapi/normalize-openapi.mjs   (명세의 비표준 필드만 보정)
  → orval
  → src/shared/api/generated/       ← 절대 직접 수정하지 않는다
       ├── {tag}-api/{tag}-api.ts   API 함수 · Query/Mutation 훅 · queryKey 팩토리
       ├── model/                   요청·응답 타입
       └── mocks/                   MSW 핸들러
  → customInstance (shared/api/axios-instance.ts)
       baseURL · timeout · Authorization · 401 처리
```

재생성: `pnpm --filter @repo/web generate:api`

> `clean: true`라 재생성 시 `generated/`가 **통째로 지워진다.**
> 그 안에 수동 파일을 두면 사라진다. 훅이 이 디렉터리 편집을 차단한다.

## 2. orval이 이미 만들어 주는 것 — 다시 만들지 않는다

| 생성물              | 예                                                              | 손으로 쓰면 안 되는 이유          |
| ------------------- | --------------------------------------------------------------- | --------------------------------- |
| 요청 함수           | `getUser()`, `onboardUser()`                                    | 명세와 어긋난다                   |
| Query 훅            | `useGetUser()`                                                  | 옵션 타입까지 맞춰져 있다         |
| Mutation 훅         | `useOnboardUser()`                                              | 〃                                |
| **queryKey 팩토리** | `getGetUserQueryKey()`                                          | **키가 흩어지면 무효화가 깨진다** |
| 옵션 빌더           | `getGetUserQueryOptions()`                                      | prefetch·suspense에 쓴다          |
| 타입                | `GetUserQueryResult`, `OnboardUserMutationBody`, `ErrorType<E>` | 응답 타입 재선언 금지             |

**⚠️ queryKey를 손으로 만들지 않는다.**

```ts
// ❌ 생성된 키와 달라져서 invalidate 가 안 먹는다
queryClient.invalidateQueries({ queryKey: ['user'] });

// ✅ 생성된 팩토리를 쓴다
import { getGetUserQueryKey } from '@/shared/api/generated/user-api/user-api';
queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() });
```

> 다른 프로젝트에서 흔한 `api/query-keys.ts`는 여기서 **만들지 않는다.** orval이 소유한다.

## 3. 생성 코드는 도메인 경계 뒤에서 노출한다

생성 훅은 `shared/api/generated/`에 있다. FSD 의존 방향상 상위 레이어가 `shared`를 import하는 것은
허용되지만, `pages`와 `widgets`가 생성 경로에 직접 결합하면 Orval의 파일명·함수명 변경이 화면 전체로
퍼진다. 생성물은 다음 도메인 경계 뒤에서 노출한다.

- **엔티티 데이터 조회** → `entities/{slice}/api/`
- **사용자 행동(mutation)** → `features/{slice}/api/`

### 값이 있는 adapter는 훅으로 감싼다

응답을 도메인 모델로 변환하거나 Query 옵션·에러 정책을 통일한다면 adapter 훅을 만든다.

```ts
// entities/user/api/use-user.ts
import { useGetUser } from '@/shared/api/generated/user-api/user-api';

export function useUser() {
  return useGetUser({
    query: {
      select: ({ userId, nickname, profileImgNumber }) => ({
        id: userId,
        nickname,
        profileImageNumber: profileImgNumber,
      }),
    },
  });
}
```

`customInstance`는 Axios 응답 객체가 아니라 응답 본문을 반환한다. 따라서 `select`에서
`response.data`를 다시 읽지 않는다.

### 추가 정책이 없다면 선택적으로 re-export한다

변환·옵션·에러 처리가 전혀 없다면 전달만 하는 함수를 만들지 않는다. 대신 slice의 `api/`와 루트
배럴에서 필요한 생성 API만 선택적으로 re-export한다. `export *`로 생성물 전체를 공개하지 않는다.

```ts
// entities/user/api/index.ts
export {
  getGetUserQueryKey as getUserQueryKey,
  useGetUser as useUser,
} from '@/shared/api/generated/user-api/user-api';

// entities/user/index.ts
export { getUserQueryKey, useUser } from './api';
export { UserCard } from './ui/user-card';
```

이 경우에도 queryKey를 새로 만드는 것이 아니다. Orval 팩토리를 도메인 이름으로 제한해 공개할
뿐이다.

### 조회와 표시는 분리한다

`entities/user/ui/user-card.tsx`처럼 entity UI는 데이터를 props로 받아 표시한다. 같은 slice의 API를
import하는 것이 FSD 방향 위반은 아니지만, 조회까지 맡기면 재사용 가능한 표시 컴포넌트가 서버 상태와
결합한다. 조회 훅은 `features`·`widgets`·`pages`처럼 조합을 담당하는 상위 레이어에서 호출한다.

```tsx
// widgets/profile-summary/ui/profile-summary.tsx
import { UserCard, useUser } from '@/entities/user';

export function ProfileSummary() {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  return <UserCard user={user} />;
}
```

```tsx
// entities/user/ui/user-card.tsx
interface UserCardProps {
  user: { nickname: string };
}

export function UserCard({ user }: UserCardProps) {
  return <article>{user.nickname}</article>;
}
```

`useFetchUserData`처럼 구현 방식(`Fetch`)과 포괄어(`Data`)를 이름에 넣지 않는다. 도메인 경계에서는
`useUser` 또는 구분이 필요할 때 `useUserQuery`처럼 의미를 드러낸다.

## 4. mutation 후 무효화 — 생성 키의 형태를 알고 써야 한다

성공 후 어떤 쿼리를 무효화할지는 **feature가 결정**한다.
그런데 orval 키는 **URL 문자열 하나가 배열 요소 하나**라, 무엇을 묶을 수 있는지가 형태에 달렸다.

| 종류          | 생성되는 키                                         |
| ------------- | --------------------------------------------------- |
| 파라미터 없음 | `['/api/v1/users']`                                 |
| path param    | `['/api/v1/units/3']` ← **id가 문자열 안에 박힌다** |
| query param   | `['/api/v1/friends/search', { keyword: 'a' }]`      |

TanStack Query의 매칭은 **배열 요소 단위 prefix 비교**이고, 문자열 요소는 부분 일치가 아니라
**정확히 일치**해야 한다. 그래서 아래처럼 갈린다. (실제로 확인한 결과다)

**① query param 계열 — 팩토리를 인자 없이 부르면 그게 family key다**

```ts
// '/api/v1/friends/search' 로 시작하는 모든 검색 결과가 무효화된다
queryClient.invalidateQueries({ queryKey: getSearchQueryKey() });
```

**② path param 형제 — 묶을 수 없다**

```ts
// ❌ 0건 매칭. '/api/v1/units/3' 과 '/api/v1/units/4' 는 공통 prefix 요소가 없다
queryClient.invalidateQueries({ queryKey: ['/api/v1/units'] });

// ✅ 하나씩 지정하거나, 아래 ③의 predicate 를 쓴다
queryClient.invalidateQueries({ queryKey: getGetAllUnitInChapterQueryKey(chapterId) });
```

**③ 리소스 계열 — `predicate`로 묶는다**

`/api/v1/users`, `/api/v1/users/my-page`, `/api/v1/users/main-page`는 **서로 다른 문자열**이라
`getGetUserQueryKey()` 하나로는 첫 번째만 무효화된다. 프로필을 고쳤으면 셋 다 갱신해야 한다.

```ts
/** 해당 리소스 경로와 그 하위 엔드포인트를 모두 무효화한다. */
function invalidateResource(queryClient: QueryClient, prefix: string) {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const url = String(query.queryKey[0]);
      // '/users' 가 '/users-archive' 를 잘못 잡지 않도록 경계를 확인한다
      return url === prefix || url.startsWith(`${prefix}/`);
    },
  });
}

invalidateResource(queryClient, '/api/v1/users');
```

**무엇을 고를까**

- 무효화 대상이 **2~3개면 그냥 키를 나열한다.** 가장 정직하고 추적이 쉽다
- 하위 엔드포인트가 많거나 앞으로 늘어날 리소스면 `predicate`
- **어느 경우에도 키를 손으로 만들지 않는다.** 생성 팩토리를 호출하거나 `predicate`로 거른다

> 계층형 키 팩토리(`['user', 'detail', id]`)를 직접 만들면 묶기는 쉬워지지만,
> **생성 키와 갈라져 개별 쿼리 무효화가 조용히 깨진다.** 그 위험이 더 크다.

## 5. Query 옵션 — 기본값이 이미 합리적이다

- **`staleTime` · `gcTime`은 도메인 의미가 분명할 때만** 조정한다. 기본값으로 충분한 경우가 많다.
  "혹시 몰라서" 늘리면 사용자가 옛 데이터를 보게 된다
- **`enabled` 가드로 불필요한 요청을 막는다.** 파라미터가 아직 없는데 호출되는 훅이 흔한 낭비다

  ```ts
  useGetUnit(unitId, { query: { enabled: Boolean(unitId) } });
  ```

- 무효화 시 **정확히 그 쿼리만** 지워야 하면 `exact: true`.
  기본은 prefix 매칭이라 의도보다 넓게 지워질 수 있다 (§4의 키 형태 참고)
- 옵션은 **`entities`/`features`의 래퍼에 둔다.** 화면마다 다르게 주지 않는다

## 6. 에러 처리

- **401은 인터셉터가 처리한다.** `axios-instance.ts`가 `notifyUnauthorized()`를 부르고,
  실제 로그아웃 동작은 상위가 `configureAuth(...)`로 주입한다. 화면마다 401을 다루지 않는다
- 그 외 에러는 화면에서 다룬다. 타입은 `ErrorType<ErrorResponse>`
- 에러 문구를 임의로 지어내지 않는다. 명세에 없으면 `확인 필요`로 남긴다

## 7. MSW

- 핸들러는 orval이 생성한다 (`generated/mocks/`)
- **무엇을 등록할지는 `shared/api/mocks/browser.ts`가 고른다.** 필요한 시나리오만 명시적으로 등록한다
- 켜는 법: `VITE_ENABLE_API_MOCKING=true`. 등록 안 된 요청은 실제 서버로 나간다(`bypass`)
- `public/mockServiceWorker.js`는 MSW CLI 산출물이다. 직접 수정하지 않고 CLI로 재생성한다

  ```bash
  pnpm --filter @repo/web exec msw init public --save
  ```

- 테스트에서 네트워크를 가로챌 때도 생성 핸들러를 쓴다. 응답 본문보다 **요청 도달·중복 호출·성공/실패 흐름**을 검증한다 (`test-policy.md`)

## 8. 명세가 이상할 때

`openapi/normalize-openapi.mjs`는 **알려진 결함 하나만** 보정한다 (BearerAuth의 `name`/`in` 제거).

- `unsafeDisableValidation`은 쓰지 않는다. 다른 명세 오류를 계속 발견할 수 있어야 한다
- 새 결함을 만나면 transformer에 **최소 범위로** 추가하고, 사유를 주석에 남긴다
- 백엔드가 고치면 그 보정을 **제거한다**. `useExamples: false`도 같은 성격의 임시 조치다

## 9. 재생성 후 검증

```bash
pnpm --filter @repo/web generate:api
pnpm --filter @repo/web check-types
pnpm --filter @repo/web lint
pnpm --filter @repo/web build
```

생성물 diff가 큰 경우 **명세가 바뀐 것**이므로, 무엇이 바뀌었는지 확인하고 영향 범위를 보고한다.
