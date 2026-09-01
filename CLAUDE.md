# Gravit Web v2

## Project Overview

Turborepo 모노레포. **Expo 네이티브 앱(셸)이 웹 화면을 WebView로 감싸는** 구조다.

| 앱                | 역할                           | 상태                                                             |
| ----------------- | ------------------------------ | ---------------------------------------------------------------- |
| `apps/web`        | 서비스 화면 (Vite + React SPA) | **신규 — 여기에 코드를 쓴다**                                    |
| `apps/legacy-web` | 직접 작성했던 구버전 웹        | **참조 전용 · 편집 금지** (`.claude/rules/legacy-web-policy.md`) |
| `apps/native`     | Expo 셸 + WebView              | 기능 추가 진행 중                                                |

현재 목표는 세 가지다. ① legacy-web의 동작을 기준으로 삼아 `apps/web`에 FSD 구조로 이전
② Figma 시안과 어긋난 부분을 찾아 맞춤 ③ native 기능 추가 후 출시.

## Commands

```bash
# 루트에서 (turbo)
pnpm dev            # 전체 dev 서버
pnpm build          # 전체 빌드
pnpm lint           # eslint + steiger (FSD 경계)
pnpm check-types    # tsc --noEmit
pnpm test           # vitest run
pnpm format         # prettier --write
pnpm format:check   # prettier --check
pnpm generate:icons # svg → shared/ui/icon/icons.generated.ts

# 특정 앱만
pnpm --filter @repo/web dev
pnpm --filter @repo/web lint:fsd        # steiger 단독
pnpm --filter @repo/web generate:api    # orval (OpenAPI → API 클라이언트 + MSW)
pnpm --filter @repo/web storybook
pnpm --filter @repo/web exec vitest run -t "테스트 이름"   # 단건 테스트
```

**패키지 매니저는 pnpm 8.15.6 고정.** `npm` / `yarn` 명령을 쓰지 않는다.
`pnpm ci`나 `pnpm verify` 같은 묶음 스크립트는 **없다.** 정식 작업을 마칠 때는
`lint` → `check-types` → `test` → `build`를 각각 실행한다. `format:check`는 기존 파일의
포맷 문제(`REF-003`)를 해결하기 전까지 변경한 파일만 `npx prettier --check <파일>`로 검사한다.

## Tech Stack

| 분류            | 사용 기술                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- |
| 빌드            | Vite 5 (`vite.config.ts`)                                                                 |
| UI              | React 19, Tailwind CSS v4, `class-variance-authority`, `tailwind-merge` + `clsx` → `cn()` |
| 라우팅          | TanStack Router (파일 기반, `src/app/routes/`)                                            |
| 서버 상태       | TanStack Query v5                                                                         |
| 클라이언트 상태 | Zustand v5                                                                                |
| API             | **orval** (OpenAPI → axios + Query 훅 + MSW 핸들러)                                       |
| 아이콘          | SVGR (`?react` suffix) + 생성된 `ICONS` 맵                                                |
| 문서            | Storybook 10 (**테스트가 아니라 컴포넌트 상태 문서**)                                     |
| 테스트          | Vitest 3 + jsdom + React Testing Library                                                  |
| 아키텍처 검사   | **steiger** (`@feature-sliced/steiger-plugin`)                                            |
| 네이티브        | Expo 57 + expo-router + react-native-webview                                              |

## FSD 아키텍처

목표는 **정통 FSD**다. 레이어 의존은 하향만 허용한다.

```
app(5) → pages(4) → widgets(3) → features(2) → entities(1) → shared(0)
```

`app`은 라우터·프로바이더 셸이라 모든 하위 레이어를 참조할 수 있어 가장 위에 둔다.
괄호 안 숫자는 훅(`fsd-layer-check.mjs`)이 쓰는 레이어 번호와 같다.

- **상향 import 금지** — 아래 레이어가 위 레이어를 import
- **cross-slice import 금지** — 같은 레이어의 다른 slice를 직접 import. 공통이 필요하면 아래 레이어로 내린다

`apps/web`의 현재 레이어: `app` / `pages` / `widgets` / `shared`.
`widgets/`는 `footer` 하나뿐이고(MIG-004), **`features/`와 `entities/`는 아직 없다** — 각 레이어의
첫 슬라이스를 만드는 사람이 위치 컨벤션을 정하게 된다.

규칙 상세는 `.claude/rules/`:

**레이어**

| 파일              | 범위                                                            |
| ----------------- | --------------------------------------------------------------- |
| `fsd-shared.md`   | 레이어 0. slice 없는 flat segment, 의존성 주입으로 상향 피하기  |
| `fsd-entities.md` | 레이어 1. 도메인 명사. `ui/`는 표시 전용                        |
| `fsd-features.md` | 레이어 2. 사용자 행동 하나. UI가 동작을 안다                    |
| `fsd-widgets.md`  | 레이어 3. 독립적인 화면 덩어리. 조립만 하고 로직은 안 갖는다    |
| `fsd-pages.md`    | 레이어 4·5. **라우트는 `app/routes/`, 화면은 `pages/`** 로 분리 |

**컨벤션**

| 파일                      | 범위                                              |
| ------------------------- | ------------------------------------------------- |
| `code-quality.md`         | **네이밍 · 표현 · 주석 · 함수.** 모든 코드에 적용 |
| `import-convention.md`    | 별칭 vs 상대경로, 배럴, 정렬, 훅이 차단하는 3가지 |
| `component-convention.md` | 파일 구조, named export, cva 변형, 접근성         |
| `state-convention.md`     | Zustand vs Query 선택, **selector 필수**          |
| `api-convention.md`       | orval + MSW. **queryKey는 생성 팩토리를 쓴다**    |
| `className-convention.md` | 조건부 className 함정, `cn()` 사용법, 토큰 클래스 |
| `constants-convention.md` | 상수로 뽑을지 인라인으로 둘지 판단                |

**정책**

| 파일                      | 범위                                                      |
| ------------------------- | --------------------------------------------------------- |
| `refactor-checklist.md`   | **구조 변경 착수 판단.** 사전 결정 5문항 + 자동 보류 신호 |
| `design-source-policy.md` | **Figma가 SoT.** MCP 생성 코드를 구현에 쓰지 않는다       |
| `i18n-policy.md`          | 한국어 단일 언어. i18n 제안 금지                          |
| `legacy-web-policy.md`    | `apps/legacy-web` 참조 전용 · 편집 금지                   |
| `work-management.md`      | `work/` 작업 폴더 · ID prefix · 상태 이동                 |
| `git-workflow.md`         | 브랜치 · 머지 · **PR 자동 검사가 없다는 사실**            |
| `test-policy.md`          | 무엇에 테스트를 쓰고 무엇에 안 쓰는가                     |

## 세 가지 검사 층

같은 규칙을 세 층에서 본다. 중복이 아니라 깊이 방어다.

| 층            | 수단                                | 시점          | 범위                  |
| ------------- | ----------------------------------- | ------------- | --------------------- |
| 소프트        | `.claude/rules/*.md`                | 작업 전       | 안내                  |
| **하드 차단** | `.claude/hooks/fsd-layer-check.mjs` | **편집 직전** | 새로 쓰는 import 구문 |
| 사후 전수     | `steiger ./src` (`pnpm lint`)       | 검증 단계     | 기존 코드 포함 전체   |

**훅(`PreToolUse`, matcher `Edit\|Write\|MultiEdit`)이 차단하는 것**

1. `apps/legacy-web` 편집 (참조 전용)
2. 자동 생성 파일 직접 수정 (orval / routeTree / icons)
3. FSD 위반 import — 상향 · cross-slice · 레이어를 넘는 상대경로

차단되면 사유가 반환된다. 우회하지 말고 **사유대로 고친다.**
`*.test.ts(x)`와 레이어 밖 파일(`main.tsx`, `stories/`)은 검사 대상이 아니다.

> 훅은 **새로 쓰는 내용만** 본다. 기존 파일에 이미 있는 위반은 못 잡으므로 steiger가 사후에 덮는다.
> steiger는 `shared`에서 `fsd/public-api`를, 전역에서 `fsd/insignificant-slice`를 **끄고 있어**
> 이 두 가지는 도구가 안 잡는다. 사람과 룰이 지켜야 한다.

## 작업 종류 (ID prefix)

작업 문서는 `work/{to-do,in-progress,done}/{ID}-{설명}/`에 둔다. 상세는 `work/README.md`.

| prefix   | 작업                       | 시작점                       |
| -------- | -------------------------- | ---------------------------- |
| `FEAT-`  | 신규 기능                  | 기획 → 이슈 분해             |
| `MIG-`   | legacy-web → apps/web 이전 | 현행 동작 기준선 → 시안 대조 |
| `REF-`   | 구조 리팩터                | 사전 결정 5문항              |
| `FIX-`   | 시안 대조 수정 / 버그      | 재현                         |
| `NAT-`   | native 기능                | `expo:*` 스킬                |
| `INFRA-` | 하네스 · 빌드 · CI         | —                            |

## Path Alias

`@/*` → 각 앱의 `src/*`. **앱마다 독립이다** (`apps/web`의 `@/`는 `apps/web/src/`).
다른 레이어는 `@/<layer>/<slice>`, 같은 slice 안은 상대 경로. type-only는 `import type`.

```ts
// ✅
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import type { IconName } from './icons.generated';

// ❌ 다른 레이어를 상대 경로로 거슬러 올라감
import { cn } from '../../../shared/lib/cn';
```

## Code Style

- **파일명 kebab-case** (`icon-button.tsx`, `query-client.ts`). 슬라이스마다 `index.ts` 배럴
- **named export만.** default export 금지
- 컴포넌트는 PascalCase, props 타입은 `{Component}Props`
- Boolean은 `is*` / `has*` 접두사, 이벤트 prop은 `on + 동사`
- Prettier: 2 spaces / single quote / `printWidth: 100` / LF
- 테스트는 대상과 **같은 폴더**에 `*.test.ts(x)`로 co-locate

## Important Notes (함정 목록)

1. **`apps/legacy-web`은 pnpm 워크스페이스에서 제외**돼 있다 (`!apps/legacy-web`). turbo가 lint/build/check-types를 돌리지 않으므로 **여기 코드를 고쳐도 CI가 안 잡는다.** 애초에 편집 금지다.
2. **`src/shared/api/generated/`는 orval 산출물** — 직접 수정 금지. `pnpm --filter @repo/web generate:api`로 재생성한다.
3. **`src/app/routeTree.gen.ts`는 TanStack Router 자동 생성** — 직접 편집 금지. dev/build 시 갱신된다.
4. **`src/shared/ui/icon/assets/`의 SVG를 추가·변경하면 `pnpm generate:icons`를 돌려야** `icons.generated.ts`에 반영된다. 생성 파일은 직접 수정하지 않는다.
5. **색상 토큰에 이름 체계가 두 개 섞여 있다.** 실제로 쓰는 건 하이픈 있는 쪽(`text-text-1` ~ `text-text-4`)이고, `--color-text1` / `--color-text2`(하이픈 없음)는 **아무데서도 안 쓰이는 죽은 토큰**이다. 새 코드에서 쓰지 않는다.
6. **`rounded-*`는 Tailwind 기본 스케일이 아니다.** `--radius-*: initial`로 기본값을 지우고 숫자 토큰(`rounded-8` = 8px)을 쓴다. `rounded-lg` 같은 t-shirt 이름은 없다.
7. **`cn()`은 커스텀 확장이 들어간 tailwind-merge다** (`shared/lib/cn.ts`). 타이포 토큰과 radius 토큰을 인식하도록 등록해 둔 것이라 **그냥 `twMerge`를 쓰면 클래스가 조용히 사라진다.** 반드시 `cn()`을 쓴다.
8. **`src/stories/`는 Foundations 문서가 사는 곳**이다 — `colors` · `typography` · `radius` · `Iconography` MDX 4종. 스캐폴드 잔재가 아니라 **디자인 토큰의 표시처**이므로 지우지 않는다. 토큰을 바꾸면 여기도 갱신한다. 단 **기능 코드는 얹지 않는다.**
9. **환경변수는 `VITE_` 접두사** (Vite). `import.meta.env.VITE_*`.
10. **native는 web을 WebView로 로드한다.** 웹 화면 변경이 앱 동작에 직결된다.
11. **`pnpm format:check`가 현재 실패한다** — 커밋된 6개 파일이 prettier 설정과 어긋나 있다 (`work/to-do/REF-003-*`). 새 코드 때문이 아니니 놀라지 않는다. 단, **네가 만든 파일은 반드시 포맷을 맞춘다.**
12. **`<Button asChild>`는 현재 깨져 있다** — Slot에 Fragment가 넘어가 className·aria-disabled가 유실된다 (`work/to-do/FIX-001-*`). 고치기 전까지 `asChild`를 새로 쓰지 않는다.

13. **제품 구현과 legacy 폐기를 구분한다.** 플랫폼별 화면 구현·검증은 `docs/implementation-status.md`, legacy 대체·폐기는 `docs/migration-status.md`에서 본다. legacy에는 이전 여부 표시를 남기지 않고, 폐기 조건이 모두 충족된 뒤 한 번에 제거한다.

14. **`verbatimModuleSyntax: true`가 켜져 있다.** 타입을 `type` 없이 import하면 `TS1484`로 **타입 검사가 실패한다.** `import type { X }` 또는 `import { type X }`를 쓴다.

## 도구는 여러 개, 규칙은 한 벌

Claude Code와 Codex를 같이 쓴다. **규칙·스킬·훅은 복사하지 않고 한 곳만 둔다.**

| 도구        | 진입 파일   | 설정                                       |
| ----------- | ----------- | ------------------------------------------ |
| Claude Code | `CLAUDE.md` | `.claude/settings.json`                    |
| Codex       | `AGENTS.md` | `.codex/config.toml` · `.codex/hooks.json` |

`AGENTS.md`는 **이 문서를 가리키는 포인터**다. 규칙을 거기 적지 않는다.
`.codex/hooks.json`도 `.claude/hooks/fsd-layer-check.mjs`를 그대로 가리킨다 — 훅은 한 벌이다.

> ⚠️ **도구별 사본을 만들지 않는다.** 예전에 `.agents/skills/`에 사본을 뒀다가
> 이틀 만에 8개 중 4개가 갈라지고 1개는 누락됐다. `.agents/`는 `.gitignore`에 있어
> 팀에 전달되지도 않았다. 새 도구가 붙으면 **진입 파일만 추가**하고 `.claude/`를 가리킨다.

## 커밋

- Conventional Commits + 한국어. 예: `feat(web): 공용 IconButton 구현 (#181)`
- scope: `web` `native` `repo` `legacy` 등
- 브랜치: `type/#이슈번호/설명` (예: `feat/#181/button`)
- **커밋과 push는 사용자가 요청할 때만 한다.** 임의로 커밋하지 않는다.

## Workflow Skills

`.claude/skills/`:

| Skill               | 용도                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| `ai-quick`          | 가벼운 요청 단축 경로. 계획 문서 없이 룰만 적용하고 변경 파일 한정으로 검증          |
| `feature-planner`   | **신규 기능 기획.** 인터뷰 → ADR(3안 비교) → 수직 슬라이스 이슈. ⏸ 게이트 3회       |
| `issue-reviewer`    | 이슈 품질 검토. 수직 슬라이싱 · AC 금지어 · 의존성 방향                              |
| `refactor-planner`  | **구조 변경 상류.** Brief + ADR + 이전 매핑 + **동작 보존 단위 이슈**. ⏸ 게이트 4회 |
| `refactor-baseline` | legacy 현행 동작을 문서로 고정. **읽기만 한다.** 이전과 분리해 단독 사용 가능        |
| `ai-plan`           | 종류 판정 + 착수 판단 + 이전 매핑 + 구현 계획. **⏸ 승인 게이트**                    |
| `ai-orchestrate`    | 승인된 계획을 코드로. 레이어 순서 + 라우트 트리 재생성                               |
| `ai-validate`       | 검사 + AC 대조 + 동작 동일성. `checklist.md`와 구현·폐기 대장 갱신                   |
| `design-diff`       | **시안 대조.** Figma ↔ 구현 6축 비교 → 판정 목록. ⏸ 게이트                         |

**이전 (`MIG-`) — legacy에 이미 있는 것**

```
refactor-baseline → design-diff → [GATE] → (규모 크면 refactor-planner →) ai-plan → [GATE] → ai-orchestrate → ai-validate
```

**구조 리팩터 (`REF-`) — apps/web 안에서 동작 불변**

```
(규모 크면 refactor-planner →) ai-plan → [GATE] → ai-orchestrate → ai-validate
```

기준선 문서는 필수가 아니다. 테스트가 동작을 고정하고 있으면 그게 기준선이다.

**신규 (`FEAT-` · `NAT-`) — legacy에 없는 것**

```
feature-planner → issue-reviewer → [GATE] → ai-plan → [GATE] → ai-orchestrate → ai-validate
```

가벼운 요청은 `ai-quick` 하나로 끝난다. 변경 파일이 5개를 넘거나 여러 슬라이스에 걸치면
`ai-quick`을 멈추고 위 흐름으로 승격한다.

> 아직 없는 것: `ai-deliver` · `ai-retrospect`.
> 겪어보지 않은 절차를 미리 쓰지 않는다.
