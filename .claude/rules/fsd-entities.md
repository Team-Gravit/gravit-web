# entities 레이어 (1)

도메인 개념 하나 = slice 하나. "이 서비스에 무엇이 존재하는가"를 담는다.

---

## 1. 무엇이 entity인가

**명사이고, 서버 데이터 모델과 대응되며, 여러 기능에서 함께 쓰인다.**

gravit 기준 후보: `user` · `learning` · `quiz` · `mission` · `league` · `notice` · `auth`

| 판단                                               | entity인가       |
| -------------------------------------------------- | ---------------- |
| "사용자", "퀴즈", "미션" 처럼 서비스가 다루는 대상 | ✅               |
| "로그인하기", "답안 제출하기" 처럼 **행동**        | ❌ → `features`  |
| "사이드바", "헤더" 처럼 **화면 조각**              | ❌ → `widgets`   |
| "버튼", "스피너" 처럼 도메인 무관 UI               | ❌ → `shared/ui` |

## 2. 구조

```
entities/{slice}/
├── model/     # 타입, 도메인 로직, 상태(store)
├── api/       # 이 엔티티의 서버 통신 — 생성 API를 감싸는 훅, queryKey
├── ui/        # 이 엔티티를 표시하는 컴포넌트
├── lib/       # 이 엔티티에만 쓰이는 유틸
└── index.ts   # 배럴 — 외부는 이것만 본다
```

네 segment 전부를 만들 필요는 없다. **필요한 것만 만든다.**

## 3. `ui/`는 표시 전용이다

entity의 UI는 **받은 데이터를 그리기만 한다.** 무엇을 할지는 모른다.

```tsx
// ✅ entities/user/ui/user-card.tsx — 표시만 하고, 동작은 prop 으로 받는다
interface UserCardProps {
  user: User;
  onSelect?: (id: string) => void;
}

// ❌ 엔티티 UI 가 스스로 서버를 부르고 라우팅한다
function UserCard({ id }: { id: string }) {
  const { data } = useUserQuery(id);
  const navigate = useNavigate();
  return <div onClick={() => navigate({ to: '/profile' })}>…</div>;
}
```

**왜** — 같은 `UserCard`가 프로필 화면과 친구 목록에서 다르게 동작해야 한다.
동작을 안에 박으면 두 번째 사용처에서 복제하게 된다.

"클릭하면 무엇을 한다"는 `features`의 일이다.

## 4. `model/`

- **타입** — `model/types.ts`. 서버 응답 타입은 orval이 만들어 두므로 **다시 정의하지 않는다.**
  `shared/api/generated/model`의 타입을 재사용하고, 화면용 파생 타입만 여기에 둔다
- **도메인 로직** — 순수 함수. "퀴즈가 통과인가", "레벨이 몇인가" 같은 판단
- **상태** — Zustand store는 `model/{slice}-store.ts`. 상세는 `state-convention.md`

## 5. `api/`

- 생성 API는 이 slice의 `api/`와 루트 배럴 뒤에서 필요한 것만 노출한다. 변환·옵션·에러 정책을
  더할 때는 adapter로 감싸고, 추가 가치가 없으면 선택적으로 re-export한다
- **queryKey 파일을 만들지 않는다.** orval이 `getGetUserQueryKey()` 같은 팩토리를 이미 생성한다.
  손으로 키를 만들면 생성된 키와 달라져 무효화가 조용히 깨진다
- 상세는 `api-convention.md`

## 6. 금지

- ❌ **cross-slice import** — `entities/quiz`가 `entities/user`를 직접 참조 (훅이 차단)
  공통이 필요하면 `shared`로 내리거나, 조합은 `widgets`/`features`에서 한다
- ❌ **상향 import** — `features`/`widgets`/`pages`/`app` 참조 (훅이 차단)
- ❌ `api/`에서 store를 import — 데이터 흐름이 순환한다 (`state-convention.md`)
- ❌ 한 slice에 두 도메인을 섞기 — `entities/user-and-profile` 같은 이름이 나오면 쪼갠다

## 7. 배럴

외부에서 쓸 것만 내보낸다. 내부 구현을 전부 re-export 하지 않는다.

```ts
// entities/user/index.ts
export { UserCard, type UserCardProps } from './ui/user-card';
export { useUserQuery } from './api/use-user-query';
export type { User } from './model/types';
```
