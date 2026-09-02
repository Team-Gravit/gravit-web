# features 레이어 (2)

**사용자가 하는 일** 하나 = slice 하나. entities가 명사라면 features는 동사다.

---

## 1. 무엇이 feature인가

**"사용자가 ~한다"로 문장이 되고, 그것만으로 완결된 가치가 있다.**

| 이름                            | feature인가                    |
| ------------------------------- | ------------------------------ |
| `quiz-submit` (답안 제출한다)   | ✅                             |
| `auth-login` (로그인한다)       | ✅                             |
| `friend-follow` (팔로우한다)    | ✅                             |
| `mission-claim` (보상을 받는다) | ✅                             |
| `button`                        | ❌ UI 프리미티브 → `shared/ui` |
| `user`                          | ❌ 명사 → `entities`           |
| `my-page`                       | ❌ 화면 → `pages` / `widgets`  |

**슬라이스 이름은 `{대상}-{행동}`을 기본으로 한다.** 관련된 것끼리 사전순으로 모인다.

## 2. 구조

```
features/{slice}/
├── model/     # 이 상호작용의 상태와 로직 (폼 상태, 검증, 단계 관리)
├── api/       # 이 행동이 부르는 mutation / query 훅
├── ui/        # 이 행동을 트리거하는 컴포넌트
├── lib/
└── index.ts
```

## 3. features의 UI는 동작을 안다

entities UI와 정확히 반대다. **feature UI는 스스로 무엇을 할지 안다.**

```tsx
// ✅ features/friend-follow/ui/follow-button.tsx
export function FollowButton({ userId }: FollowButtonProps) {
  const { mutate, isPending } = useFollowMutation();

  return (
    <Button onClick={() => mutate(userId)} isLoading={isPending}>
      팔로우
    </Button>
  );
}
```

표시용 조각(`shared/ui/button`)과 도메인 표현(`entities/user/ui/user-card`)을 **조합해서**
동작을 붙이는 게 이 레이어의 역할이다.

## 4. 무엇을 import 할 수 있나

| 대상                        | 가능                          |
| --------------------------- | ----------------------------- |
| `shared/*`                  | ✅                            |
| `entities/*`                | ✅                            |
| 다른 `features/*`           | ❌ **cross-slice, 훅이 차단** |
| `widgets` / `pages` / `app` | ❌ 상향, 훅이 차단            |

**두 feature가 서로를 필요로 하면** 둘 중 하나다.

1. 사실 한 feature다 → 합친다
2. 공통 부분이 아래로 내려가야 한다 → `entities` 또는 `shared`로 추출
3. 조합이 필요한 것이다 → 둘 다 쓰는 `widgets`를 만든다

## 5. 크기 판단

한 feature가 커지는 건 정상이다. 하지만 아래면 쪼갠다.

- `ui/`에 서로 무관한 컴포넌트가 여러 개 (한 화면의 서로 다른 영역)
- 이름에 `and` / `-and-`가 들어감
- 이 feature의 절반만 쓰는 사용처가 생김

반대로 **feature 하나가 파일 두 개뿐이어도 괜찮다.** 억지로 합치지 않는다.

## 6. 금지

- ❌ cross-slice import (훅이 차단)
- ❌ 상향 import (훅이 차단)
- ❌ 라우팅 결정을 feature 안에 박기 — 이동 후 목적지는 화면마다 다르다.
  `onSuccess` 콜백으로 받거나 상위(`widgets`/`pages`)가 처리한다
- ❌ 서버 응답 타입을 다시 선언 — orval 생성 타입을 쓴다
