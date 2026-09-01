# 상태 규칙 (Zustand + TanStack Query)

---

## 1. 먼저 — 이게 정말 클라이언트 상태인가

가장 흔한 실수는 **서버 데이터를 스토어에 복사하는 것**이다.

| 성격                                          | 도구                       |
| --------------------------------------------- | -------------------------- |
| 서버에서 온 데이터 (사용자, 퀴즈 목록, 미션)  | **TanStack Query**         |
| URL로 표현되는 것 (현재 탭, 필터, 페이지)     | **라우터의 search params** |
| 한 컴포넌트 안에서만 쓰는 것                  | `useState`                 |
| 폼 입력값                                     | 폼 상태 / `useState`       |
| **여러 화면이 공유하는 순수 클라이언트 상태** | **Zustand**                |

서버 데이터를 Zustand에 넣으면 캐시·무효화·재요청을 직접 구현하게 된다. Query가 이미 한다.

중첩 객체 갱신이 번거롭다는 이유만으로 미들웨어를 추가하지 않는다. 상태 구조를 평탄하게 만들 수
있는지 먼저 보고, 반복되는 복잡한 갱신이 실제로 확인될 때 도입을 결정한다.

Zustand는 다음 조건을 모두 만족할 때 선택한다.

- 서로 떨어진 여러 컴포넌트나 라우트가 같은 상태를 읽고 바꾼다
- URL·서버 캐시·폼 상태 중 어느 것도 진실의 원천이 아니다
- 상태의 수명과 초기화 시점을 명확히 설명할 수 있다

예를 들어 저장 전 초안을 여러 라우트에서 이어서 편집해야 하고 URL이나 서버에 둘 수 없다면
feature store가 후보가 된다. 한 화면 안에서 끝나는 입력에는 해당하지 않는다.

## 2. 위치와 이름

| 범위                 | 위치                                                  |
| -------------------- | ----------------------------------------------------- |
| 도메인에 속함        | `entities/{slice}/model/{slice}-store.ts`             |
| 한 상호작용 안에서만 | `features/{slice}/model/{slice}-store.ts`             |
| 위젯 내부 UI 상태    | `widgets/{slice}/model/`                              |
| 도메인 무관 전역     | `shared/model/`을 만들지 말고 `app/`에서 프로바이더로 |

| 항목       | 규칙                                         | 예                               |
| ---------- | -------------------------------------------- | -------------------------------- |
| 파일명     | kebab-case                                   | `draft-store.ts`                 |
| 스토어 훅  | `use{Slice}Store`                            | `useDraftStore`                  |
| State 타입 | `{Slice}State`                               | `DraftState`                     |
| 액션       | `set{속성}` · `reset{속성}` · `{동사}{대상}` | `setTitle` · `reset` · `addStep` |

- 스토어 하나는 응집된 상태 전이 책임 하나만 갖는다. 같은 slice라도 책임이 독립적이면 분리할 수 있다
- **스토어 파일에 React 컴포넌트를 쓰지 않는다**
- **`any` state 금지.** 모든 state에 명시적 인터페이스를 붙인다

```ts
// features/multi-step-draft/model/draft-store.ts
import { create } from 'zustand';

interface DraftState {
  step: number;
  title: string;
  setTitle: (value: string) => void;
  next: () => void;
  reset: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  step: 0,
  title: '',
  setTitle: (title) => set({ title }),
  next: () => set((s) => ({ step: s.step + 1 })),
  reset: () => set({ step: 0, title: '' }),
}));
```

## 3. ⚠️ selector 없이 구독하지 않는다

**이게 이 문서에서 가장 중요한 규칙이다.**

```ts
// ❌ 스토어의 어떤 값이 바뀌어도 이 컴포넌트가 리렌더된다
const store = useDraftStore();

// ✅ 쓰는 값만 구독한다
const step = useDraftStore((s) => s.step);
const next = useDraftStore((s) => s.next);
```

전체 구독은 에러가 안 나고 **성능만 조용히 나빠진다.** 리뷰에서도 잘 안 보인다.

여러 값이 필요하면 **각각 따로 구독**한다. 객체를 만들어 반환하면 매번 새 참조라
같은 문제가 생긴다(`useShallow` 없이는).

```ts
// ❌ 매 렌더 새 객체 → 항상 리렌더
const { step, title } = useDraftStore((s) => ({ step: s.step, title: s.title }));

// ✅ 따로 구독
const step = useDraftStore((s) => s.step);
const title = useDraftStore((s) => s.title);

// ✅ 여러 개를 꼭 묶어야 하면 useShallow 로 얕은 비교
import { useShallow } from 'zustand/react/shallow';

const { step, title } = useDraftStore(useShallow((s) => ({ step: s.step, title: s.title })));
```

**기본은 따로 구독**이다. 여러 값을 하나의 선택 결과로 다뤄야 할 때만 `useShallow`를 쓴다.

## 4. 액션은 스토어 안에 둔다

상태를 바깥에서 조립하지 말고 **의미 있는 액션**으로 노출한다.

```ts
// ❌ 호출부가 상태 전이 규칙을 안다
setStep(step + 1);

// ✅ 규칙은 스토어가 안다
next();
```

액션은 함수 참조가 안정적이라 selector로 꺼내도 리렌더를 유발하지 않는다.

## 5. React 밖에서 접근할 때는 `getState()` / `setState()`

인터셉터·유틸처럼 컴포넌트가 아닌 곳에서는 훅을 부를 수 없다.

```ts
const token = useAuthStore.getState().accessToken;
useAuthStore.setState({ accessToken: null });
```

> ⚠️ **`shared/`에서는 이 방법도 쓰지 않는다.** `shared`가 `entities`의 스토어를 참조하면
> 상향 import이고 훅이 차단한다. `shared`는 `configureAuth` 같은 **주입**으로 받는다
> (`fsd-shared.md` §3). `getState()`는 **같은 레이어이거나 위 레이어**에서 쓰는 방법이다.

## 6. `api/`에서 store를 import하지 않는다

```
❌ entities/user/api/use-user.ts  →  entities/user/model/user-store.ts
```

데이터 흐름이 순환하고, API 훅을 테스트할 때 스토어까지 끌려온다.
**필요한 값은 인자로 받는다.** 스토어와 API를 잇는 건 컴포넌트나 상위 훅의 일이다.

## 7. 서버 상태(TanStack Query) 쪽 규칙

- `QueryClient`는 `app/query/query-client.ts` 하나. 컴포넌트에서 새로 만들지 않는다
- **queryKey는 orval 생성 팩토리를 쓴다.** 손으로 만들지 않는다 (`api-convention.md`)
- 생성 훅을 화면에서 직접 부르지 않고 `entities`/`features`의 `api/`에서 감싼다
- `staleTime` 같은 옵션은 그 래퍼에 둔다. 화면마다 다르게 주지 않는다

## 8. 금지 요약

- ❌ 서버 데이터를 Zustand에 복사
- ❌ selector 없는 전체 구독
- ❌ selector가 매번 새 객체를 반환
- ❌ `api/`에서 store import
- ❌ `shared/model/` 생성 — shared에는 slice가 없다 (`fsd-shared.md`)
- ❌ 한 스토어에 서로 독립적인 상태 전이 책임을 혼합
