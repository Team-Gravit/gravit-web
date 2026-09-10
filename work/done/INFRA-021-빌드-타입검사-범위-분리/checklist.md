---
id: 'INFRA-021'
validated: '2026-09-10'
mode: 'infra'
---

# INFRA-021 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                    | 결과                   |
| --- | --------------- | --------------------------------------- | ---------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                             | ✅ No problems found   |
| 2   | 타입            | `pnpm check-types`                      | ✅ 앱 + 도구 설정 양쪽 |
| 3   | 테스트          | `pnpm test`                             | ✅ 16파일 **76건**     |
| 4   | 빌드            | `pnpm build`                            | ✅                     |
| 5   | 포맷            | `pnpm exec prettier --check <변경 4개>` | ✅                     |

## 2. 요구사항 ↔ 구현 대조

| #    | AC                                      | 결과                                                       |
| ---- | --------------------------------------- | ---------------------------------------------------------- |
| AC-1 | 빌드 tsconfig에서 도구 설정 제외        | ✅ `include: ["src", "vitest.setup.ts"]`                   |
| AC-2 | `check-types`의 검사 범위가 줄지 않는다 | ✅ `tsc --noEmit && tsc -p tsconfig.tooling.json --noEmit` |
| AC-3 | lint · test · build 통과                | ✅ (§1)                                                    |
| AC-4 | Vercel 빌드 성공                        | ⬜ **확인 불가 — Vercel에서만 검증된다**                   |

## 3. 범위를 두 번 잡았다

처음에는 `vitest.config.ts` · `vitest.setup.ts` · `.storybook`을 **모두** 빌드 tsconfig에서
뺐다. 그러자 테스트 파일 전체가 깨졌다.

```
src/shared/ui/button/button.test.tsx(23,22):
  error TS2339: Property 'toHaveAttribute' does not exist on type 'Assertion<HTMLElement>'.
  (외 20여 건)
```

`vitest.setup.ts`의 `import '@testing-library/jest-dom/vitest'`가 **전역 타입 증강**을 하고,
`src` 안의 테스트 파일들이 그걸 필요로 한다. 같은 프로젝트에 있어야 한다.

→ **`vite`를 직접 import하는 파일만** 분리하는 것으로 좁혔다.

| 파일                 | 어디로               | 이유                              |
| -------------------- | -------------------- | --------------------------------- |
| `vitest.config.ts`   | tooling              | `vitest/config` + vite 플러그인   |
| `.storybook/main.ts` | tooling              | `vite`의 `mergeConfig`            |
| `vitest.setup.ts`    | **앱 tsconfig 유지** | vite를 안 쓴다. matcher 증강 제공 |

**이게 이번 작업에서 배운 것이다** — "테스트 관련 파일"로 묶어서 자르면 안 되고,
**무엇을 import하는가**로 잘라야 한다.

## 4. `.storybook`도 함께 뺀 이유

사용자가 붙여준 Vercel 로그는 `vitest.config.ts` 부분이라 **그게 유일한 오류인지 모른다.**
`.storybook/main.ts`도 `vite`에서 `mergeConfig`를 import하므로 같은 충돌이 날 수 있다.

빌드를 한 번에 통과시키려고 선제적으로 포함했다. `check-types`가 여전히 검사하므로
타입 안전성은 잃지 않는다. Storybook 빌드 자체는 tsc를 쓰지 않아 영향이 없다.

## 5. 이건 근본 해결이 아니다

**중복 `vite` 타입 자체는 그대로 있다.** 이 작업은 그 충돌이 **프로덕션 배포를 막지 않게**
범위를 조정한 것이다.

- 나중에 PR 검사에 `check-types`를 넣으면 리눅스에서 다시 걸린다
- 근본 해결은 `INFRA-008`(Vite 5 → 8, Vitest 3 → 4)이다
- `.npmrc`의 `node-linker = hoisted`를 없애는 방향도 있으나 `apps/native`(Expo/Metro)가
  깨질 수 있어 별도 판단이 필요하다

## 6. 남은 확인

| 항목                         | 상태                                                |
| ---------------------------- | --------------------------------------------------- |
| Vercel 빌드 성공             | ⬜ PR 프리뷰로 확인                                 |
| `.storybook`도 원인이었는지  | ⬜ 로그 전체를 보면 확정된다                        |
| Vercel의 pnpm 버전           | ⬜ 레포는 `8.15.6` 고정. 다르면 레이아웃이 달라진다 |
| Storybook 배포 워크플로 영향 | ⬜ develop push 시 도는 유일한 CI다. 머지 후 확인   |
