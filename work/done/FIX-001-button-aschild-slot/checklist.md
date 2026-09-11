---
id: 'FIX-001'
validated: '2026-09-10'
mode: 'fix'
---

# FIX-001 검증 결과

> `ai-validate` 산출물. **생략 금지.**

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                                 |
| --- | --------------- | -------------------------------------------------- | ------------------------------------ |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ No problems found                 |
| 2   | 타입            | `pnpm check-types`                                 | ✅ 통과                              |
| 3   | 테스트          | `pnpm test`                                        | ✅ 16 files / **87 tests** (85 → 87) |
| 4   | 빌드            | `pnpm build`                                       | ✅ built in 15.93s                   |
| 5   | 포맷            | `pnpm exec prettier --check <변경 파일 4개>`       | ✅                                   |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 해당 없음 (`shared/ui`만 변경)    |

> `pnpm format:check` 전체는 `REF-003`의 기존 실패가 있어 변경 파일만 검사했다.

**타입 검사가 이번 작업의 주 검증 수단이다.** AC-3은 런타임 단언이 아니라 컴파일 결과로
확인한다. `@ts-expect-error` 는 에러가 **없으면** 실패하므로, 배타 계약이 풀리면
`check-types`가 즉시 깨진다.

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 (spec.md의 AC)                                        | 구현 위치                                                                        | 상태 |
| --- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---- |
| 1   | AC-1 `<a>`에 `data-slot`·`aria-disabled`·cva 클래스가 적용된다 | `button.tsx` `asChild` 분기 + `button.test.tsx` 「버튼 스타일과 aria-disabled…」 | ✅   |
| 2   | AC-2 아이콘과 레이블이 한 `<a>` 안에 들어가고 `<a>`는 하나다   | `button.tsx` `<Slottable>` + `button.test.tsx` 「startIcon 을 주면…」            | ✅   |
| 3   | AC-3 `asChild` + `isLoading` 은 타입 에러가 난다               | `button.tsx` `ButtonRenderProps` 유니온 + `button.test.tsx` `@ts-expect-error`   | ✅   |

## 3. 무엇을 어떻게 고쳤나

| 파일                 | 변경                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `button.tsx`         | `asChild` 분기를 분리하고 `<Slottable>{children}</Slottable>` 을 **Slot 의 직속 자식**으로 둔다 |
| 〃                   | `ButtonProps` 를 `asChild` 기준 배타 유니온으로 바꿔 `isLoading` 조합을 타입에서 막는다         |
| `button.test.tsx`    | `it.fails` → 정상 단언. `className`·`data-variant`까지 확인. AC-2·AC-3 테스트 추가              |
| `button.stories.tsx` | `Loading` 은 `isLoading` 을 story `args` 로 옮겨 인라인 판별자 충돌을 없앴다                    |
| 〃                   | `AsChildLink` 는 공통 args 를 흘려보내지 않는다 — `isLoading` 컨트롤이 이 story 에서 무의미하다 |
| `icon-button.tsx`    | `asChild` 를 props 에서 제외 (children 이 Icon 으로 고정돼 Slot 대상이 없다)                    |

**핵심 원인** — `React.Children.toArray` 는 **Fragment 를 펼치지 않는다.** 그래서 Slot 이
받은 자식이 `[Fragment]` 하나가 되어 병합 대상 엘리먼트를 찾지 못했다. `Slottable` 을 쓰되
Fragment 로 감싸지 않는 것이 함께 지켜져야 한다.

## 4. 파급 확인

| 확인                                       | 결과                                                             |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `asChild` 를 쓰는 다른 호출부              | Storybook 1곳뿐. 제품 코드 사용처 없음 (`rg` 실측)               |
| `isLoading` 을 쓰는 호출부가 깨지지 않는가 | `SocialLoginButton` 등 기존 사용처는 `asChild` 를 안 써서 무영향 |
| `IconButton` 이 `asChild` 를 지원했었는가  | 지원한 적 없다. 이번에 타입에서도 명시적으로 제외했다            |
| 기존 테스트 회귀                           | 없음. 87건 전부 통과                                             |

## 5. 기준 문서 갱신

| 대상                                        | 갱신 내용                                         | 상태      |
| ------------------------------------------- | ------------------------------------------------- | --------- |
| `docs/implementation-status.md`             | 화면 상태 변화 없음                               | 해당 없음 |
| `docs/migration-status.md`                  | 이전 항목이 아니다                                | 해당 없음 |
| `CLAUDE.md` 함정 12                         | 「깨져 있다」 → 「`isLoading` 과 배타」로 교체    | ✅        |
| `.claude/rules/component-convention.md` §11 | Fragment 함정과 배타 선언 근거를 예시와 함께 추가 | ✅        |

> 함정 12는 이 수정으로 사실이 아니게 되어 그대로 두면 다음 작업이 `asChild` 를 계속 피한다.
> 규칙 문서에는 「`Slottable` 을 썼는데도 안 되는」 경우를 남겼다 — 이번에 실제로 밟은 함정이다.
