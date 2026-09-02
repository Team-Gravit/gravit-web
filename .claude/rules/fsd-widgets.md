# widgets 레이어 (3)

화면의 **독립적인 한 덩어리**. entities와 features를 조합해 "그 자리에 놓으면 동작하는" 블록을 만든다.

---

## 1. 무엇이 widget인가

**화면에서 잘라내도 의미가 유지되고, 다른 화면에 그대로 붙일 수 있는 덩어리.**

gravit 기준 후보: `header` · `bottom-tab-bar` · `sidebar` · `learning-summary` · `mission-list`

| 판단                                   | widget인가                         |
| -------------------------------------- | ---------------------------------- |
| 여러 화면에 같은 모양으로 등장한다     | ✅                                 |
| entities와 features를 여러 개 조합한다 | ✅                                 |
| 한 화면에서만 쓰이고 조합도 없다       | ❌ 그냥 `pages/{slice}/ui/`에 둔다 |
| 동작 하나만 한다                       | ❌ → `features`                    |

**한 곳에서만 쓴다고 무조건 위젯이 아닌 건 아니다.** 판단 기준은 재사용 횟수가 아니라
**독립성**이다 — 그 덩어리가 페이지의 나머지를 몰라도 되는가.

## 2. 이름에 `-widget`을 붙이지 않는다

```
widgets/header/          ✅
widgets/mission/         ✅
widgets/mission-widget/  ❌ 폴더가 이미 widgets/ 안이다
```

## 3. 구조

```
widgets/{slice}/
├── ui/        # 조합된 블록. 이 레이어의 핵심
├── model/     # 이 블록 안에서만 쓰는 상태 (열림/닫힘, 탭 선택 등)
├── api/       # 여러 엔티티를 함께 가져와야 할 때만
├── lib/
└── index.ts
```

대부분의 widget은 **`ui/`와 `index.ts`만** 있으면 된다.

## 4. 비즈니스 로직을 직접 갖지 않는다

widget은 **조립공**이지 로직의 주인이 아니다.

```tsx
// ✅ widgets/mission-list/ui/mission-list.tsx — 조합만 한다
export function MissionList() {
  const { data } = useMissionsQuery(); // entities/mission/api
  return (
    <section>
      {data?.map((m) => (
        <MissionCard key={m.id} mission={m}>
          {' '}
          {/* entities/mission/ui */}
          <ClaimRewardButton missionId={m.id} /> {/* features/mission-claim */}
        </MissionCard>
      ))}
    </section>
  );
}
```

```tsx
// ❌ 보상 지급 규칙을 위젯이 직접 계산한다
const reward = mission.type === 'daily' ? base * 2 : base;
```

계산은 `entities/mission/model/`로, 지급 행동은 `features/mission-claim`으로 내려간다.
**위젯 안의 `if`가 도메인 판단을 하고 있으면 잘못된 위치다.**

## 5. 무엇을 import 할 수 있나

| 대상                                     | 가능                      |
| ---------------------------------------- | ------------------------- |
| `shared/*` · `entities/*` · `features/*` | ✅                        |
| 다른 `widgets/*`                         | ❌ cross-slice, 훅이 차단 |
| `pages` / `app`                          | ❌ 상향, 훅이 차단        |

**위젯 안에 위젯이 필요하면** 그건 보통 페이지가 두 위젯을 나란히 놓아야 한다는 뜻이다.
정말 중첩이 필요하면 안쪽을 `entities`/`features`로 내리거나 `children`으로 주입받는다.

## 6. 페이지와의 경계

- **위젯은 자기 데이터를 스스로 가져와도 된다.** 그래야 페이지가 얇아진다
- **위젯은 자기 위치를 모른다.** 바깥 여백·그리드 배치는 페이지가 정한다
  (`className`으로 레이아웃만 받는 건 허용, `className-convention.md` 참고)
- **라우팅 결정은 페이지가 한다.** 위젯은 `onSelect` 같은 콜백으로 알린다
