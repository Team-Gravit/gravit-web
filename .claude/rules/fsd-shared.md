# shared 레이어 (0)

도메인을 모르는 공용 기반. **가장 아래**라 모든 레이어가 참조할 수 있고, 자신은 아무 레이어도 참조할 수 없다.

---

## 1. slice가 없다. segment가 바로 온다

shared는 다른 레이어와 달리 **slice를 두지 않는다.** `shared/` 바로 밑이 segment다.

```
shared/
├── api/      # HTTP 클라이언트, 생성된 API, 인증 토큰 브릿지, MSW
├── ui/       # 도메인 무관 UI 프리미티브 (button, icon, spinner …)
├── lib/      # 순수 유틸 (cn 등)
├── config/   # 상수, 환경값
└── model/    # ❌ 두지 않는다 — model은 slice가 있는 레이어의 것이다
```

**segment 이름은 "무엇이 들어 있나"가 아니라 "무슨 목적인가"로 짓는다.**
`assets/`, `types/`, `helpers/`, `utils/` 같은 이름은 steiger의 `fsd/segments-by-purpose`에 걸린다.

> 에셋은 그것을 쓰는 곳 옆에 둔다. SVG는 소비자인 `shared/ui/icon/` 안에 있다.

## 2. 무엇을 import 할 수 있나

| 대상                                                  | 가능                 |
| ----------------------------------------------------- | -------------------- |
| 외부 npm 패키지                                       | ✅                   |
| 같은 segment 안 (상대 경로)                           | ✅                   |
| 다른 segment (`@/shared/...`)                         | ✅                   |
| `entities` / `features` / `widgets` / `pages` / `app` | ❌ **훅이 차단한다** |

## 3. 상위가 필요할 때 — 의존성을 주입받는다

shared가 상위 레이어의 것을 필요로 하는 상황은 **거의 항상 설계가 뒤집힌 신호**다.
올라가지 말고, **상위가 내려주게** 한다.

실제 사례가 `shared/api/auth-token.ts`에 있다. HTTP 인터셉터는 토큰이 필요하지만,
토큰을 **어디에 어떻게 저장하는지**는 세션 계층(상위)의 관심사다.

```ts
// shared/api/auth-token.ts — shared 는 "읽는 방법"만 알고 "저장소"는 모른다
let readAuthToken: AuthTokenReader = () => null;

export function configureAuth(config: {
  readAuthToken: AuthTokenReader;
  onUnauthorized: UnauthorizedHandler;
}): void { ... }
```

상위 레이어(`app` 또는 `entities/auth`)가 앱 부팅 시 `configureAuth(...)`를 호출해 구현을 주입한다.
shared는 상위를 import하지 않고도 상위의 동작을 쓸 수 있다.

**이 패턴을 쓸 때가 언제인가** — shared 안에서 "여기서 로그인 상태를 알아야 하는데"
"여기서 라우터로 이동시켜야 하는데" 같은 충동이 들 때. 그때 콜백을 주입받는 구조로 바꾼다.

## 4. segment별 규칙

### `shared/ui/`

- 도메인 단어가 들어가면 shared가 아니다. `UserCard`는 `entities/user/ui/`로 간다
- 슬라이스 폴더 + `index.ts` 배럴. `shared/ui/spinner/{spinner.tsx, index.ts}`
- 배럴은 컴포넌트와 props 타입을 함께 내보낸다

  ```ts
  export { Spinner, type SpinnerProps } from './spinner';
  ```

- 스타일 변형은 cva `variants`로. 호출부에서 시각 상태를 override 하지 않는다 (`className-convention.md`)

### `shared/api/`

- `axios-instance.ts`의 `customInstance`가 모든 생성 API의 단일 통로다. baseURL·타임아웃·토큰·401 처리가 여기 모인다
- `generated/`는 orval 산출물. **직접 수정 금지** (훅이 차단)
- 상세는 `api-convention.md`

### `shared/lib/`

- 순수 함수 위주. React에 의존하는 훅을 둘 거면 그게 정말 도메인 무관인지 먼저 따진다
- 하위 폴더를 만들 때도 기술 이름보다 역할과 목적이 드러나는 이름을 쓴다

### `shared/config/`

- 상수와 환경값. 환경변수는 `VITE_` 접두사이며 `import.meta.env`에서 읽는다
- 무엇을 상수로 뽑을지는 `constants-convention.md`

## 5. steiger가 안 잡는 것

`steiger.config.js`에서 `shared`의 `fsd/public-api`를 **꺼놨다.**
즉 `shared/ui/button/index.ts`를 우회해 `shared/ui/button/button.tsx`를 직접 import해도 도구가 경고하지 않는다.

**그래도 배럴을 통해 import한다.** 내부 파일 경로는 언제든 바뀔 수 있는 구현 세부사항이다.

```ts
import { Button } from '@/shared/ui/button'; // ✅
import { Button } from '@/shared/ui/button/button'; // ❌ 도구는 통과시키지만 쓰지 않는다
```
