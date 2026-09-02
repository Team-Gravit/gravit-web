# pages 레이어 (4) + app 레이어 (5)

화면 하나 = slice 하나. 그리고 **라우팅은 pages가 아니라 `app/routes/`에 있다.**
이 분리가 gravit에서 가장 헷갈리는 지점이라 두 레이어를 함께 다룬다.

---

## 1. 라우트 파일과 화면은 다른 곳에 있다

```
app/routes/index.tsx          ← 라우트 정의 (TanStack Router 가 스캔)
        ↓ component
pages/home/ui/home-page.tsx   ← 실제 화면
```

```tsx
// app/routes/index.tsx — 얇게 유지한다
import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/home';

export const Route = createFileRoute('/')({
  component: HomePage,
});
```

**왜 나뉘어 있나** — 라우트 파일은 TanStack Router 플러그인이 스캔해 `routeTree.gen.ts`를
만드는 **설정 파일**에 가깝다. 화면 구현을 여기 넣으면 라우팅 구조와 UI가 한 파일에 섞인다.

**라우트 파일에 들어가도 되는 것**: `component`, `loader`, `beforeLoad`, `validateSearch`,
`errorComponent`, `pendingComponent` 같은 **라우트 설정**.
**들어가면 안 되는 것**: JSX 화면 구현, 도메인 로직.

## 2. 라우트 파일 이름 규칙 (TanStack Router)

`app/routes/` 안의 파일명이 곧 URL이다.

| 파일                   | 경로                                          |
| ---------------------- | --------------------------------------------- |
| `__root.tsx`           | 루트. 모든 라우트의 부모                      |
| `index.tsx`            | `/`                                           |
| `learning.tsx`         | `/learning`                                   |
| `learning.index.tsx`   | `/learning` (learning 레이아웃 아래)          |
| `learning.$unitId.tsx` | `/learning/:unitId`                           |
| `_authenticated.tsx`   | 경로 없는 레이아웃 (pathless)                 |
| `-helper.tsx`          | `-` 접두사는 라우트가 아님. 라우터가 무시한다 |

- **`Route`는 named export 필수.** 플러그인이 이 이름으로 찾는다
- **`createFileRoute('...')`의 경로 문자열은 플러그인이 저장 시 자동으로 고쳐 준다.**
  손으로 바꾸지 않는다 — 파일 위치와 어긋나면 다시 덮어써진다
- `routeTree.gen.ts`는 **자동 생성**이다. 직접 편집하면 훅이 차단한다
- 라우트를 추가·이동한 뒤에는 **트리를 재생성**해야 타입 검사가 통과한다 (`ai-orchestrate` §4)
- `autoCodeSplitting`이 켜져 있어 라우트 단위로 청크가 나뉜다
- `__root.tsx`의 context에 `queryClient`가 들어 있다 (`RouterContext`)

## 3. 라우트 값은 얇은 어댑터에서 페이지로 넘긴다

라우터가 `component`에 임의의 props를 채워주지는 않는다. 파라미터나 검색 조건이 필요한 화면은
라우트 파일에 얇은 어댑터를 두고 페이지에 props로 넘긴다.

```tsx
// app/routes/learning.$unitId.tsx
import { LearningPage } from '@/pages/learning';

export const Route = createFileRoute('/learning/$unitId')({
  component: LearningRoute,
});

function LearningRoute() {
  const { unitId } = Route.useParams();
  return <LearningPage unitId={unitId} />;
}
```

페이지가 `app/routes`의 `Route`를 import하면 `pages → app` 상향 참조가 된다. 따라서
`Route.useParams()` / `Route.useSearch()` / `Route.useLoaderData()`는 라우트 어댑터에서 호출한다.
라우트 값이 필요 없는 페이지는 지금처럼 `component: HomePage`로 직접 연결해도 된다.

## 4. pages 구조

```
pages/{slice}/
├── ui/{slice}-page.tsx   # 화면. 위젯과 피처를 배치한다
├── model/                # 이 화면에서만 쓰는 상태 (거의 필요 없다)
└── index.ts              # export { XxxPage } from './ui/xxx-page'
```

배럴은 페이지 컴포넌트 하나만 내보내면 된다.

```ts
// pages/home/index.ts
export { HomePage } from './ui/home-page';
```

## 5. 페이지는 얇다

페이지가 하는 일은 **배치와 결정**이다.

- 위젯·피처를 어떤 순서로 놓을지
- 화면 여백과 그리드
- 어디로 이동시킬지 (라우팅 결정은 페이지의 몫)
- 이 화면에서만 필요한 데이터 조회

페이지에 도메인 로직이나 긴 JSX가 쌓이면 **덩어리를 `widgets/`로 뽑는다.**

## 6. app 레이어 (5)

`app/`은 앱 셸이다. **모든 하위 레이어를 참조할 수 있는 유일한 레이어**다.

```
app/
├── routes/          # TanStack Router 라우트 정의
├── router/          # createRouter, 타입 등록
├── query/           # QueryClient, QueryProvider
├── providers/       # 전역 프로바이더
├── styles/          # tokens.css, base.css, 폰트
└── routeTree.gen.ts # 자동 생성 — 편집 금지
```

- 전역 1회 초기화(예: `configureAuth(...)` 주입, MSW 시작)는 여기서 한다
- **화면 구현은 두지 않는다.** app에 JSX가 쌓이면 `pages`로 내린다

## 7. 데이터는 아래에서 위로만 흐른다

페이지가 props를 못 받으므로, 앱 전역에서 채워야 하는 값(인증 상태, 반응형 정보)은
**`app/providers/`가 부트스트랩 시점에 스토어에 넣고 페이지는 읽기만 한다.**

```tsx
// app/providers/ — 채우는 쪽
useEffect(() => {
  configureAuth({ readAuthToken, onUnauthorized });
  // 저장소에서 복원해 스토어에 주입
}, []);

// pages/ — 읽는 쪽
const user = useAuthStore((s) => s.user);
```

**양방향 동기화를 만들지 않는다.** 페이지가 URL 파라미터를 스토어에 반영하는 건 괜찮지만,
스토어가 다시 페이지 상태를 되쓰는 순환을 만들면 어느 쪽이 진실인지 알 수 없게 된다.

## 8. 금지

- ❌ `routeTree.gen.ts` 편집 (훅이 차단)
- ❌ 라우트 파일에 화면 구현
- ❌ 페이지에서 `app/routes`의 `Route`를 import
- ❌ cross-slice import — `pages/home`이 `pages/not-found`를 직접 참조 (훅이 차단)
- ❌ 상향 import — `pages`가 `app`을 참조 (훅이 차단)
