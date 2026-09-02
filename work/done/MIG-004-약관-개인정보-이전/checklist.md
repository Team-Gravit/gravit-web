---
id: MIG-004
validated: 2026-08-31
mode: migrate
---

# MIG-004 검증 결과

## 1. 자동 검증

| #   | 검사                | 명령                              | 결과 |
| --- | ------------------- | --------------------------------- | ---- |
| 1   | 타입                | `pnpm check-types`                | ✅   |
| 2   | 린트 + FSD 경계     | `pnpm lint` (steiger 위반 0건)    | ✅   |
| 3   | 포맷                | 변경 파일 `prettier --check`      | ✅   |
| 4   | 빌드                | `pnpm build`                      | ✅   |
| 5   | 테스트              | `pnpm test` — 19 passed / 5 files | ✅   |
| 6   | generated 직접 참조 | 없음                              | ✅   |

> ⚠️ `pnpm format:check` 전체는 여전히 실패한다. **REF-003**(기존 6개 파일)이 원인이며
> 이번 변경분과 무관하다. 이번에 만든 파일은 모두 포맷을 맞췄다.

### 중간에 막혔던 지점 — 스킬에 반영할 것

`check-types`가 **한 번 실패했다.** 라우트 파일을 추가해도 `routeTree.gen.ts`가
자동으로 갱신되지 않아 `'/terms'`가 `'/'` 타입에 할당 불가라고 나왔다.

```
src/app/routes/terms.tsx(5,38): error TS2345:
  Argument of type '"/terms"' is not assignable to parameter of type '"/"'.
```

`pnpm build`는 `tsc && vite build` 순서라 **tsc가 먼저 실패해 트리 생성에 도달하지 못한다.**
`pnpm --filter @repo/web exec vite build`로 tsc를 건너뛰고 트리를 먼저 생성해야 풀린다.

→ **`ai-orchestrate` / `ai-validate` 스킬에 "라우트 추가 후 트리 재생성" 단계를 넣어야 한다.**

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 (AC)                   | 구현 위치                                | 상태 |
| --- | ------------------------------- | ---------------------------------------- | ---- |
| 1   | `/terms` h1 + h2 13개           | `pages/terms/ui/terms-page.test.tsx`     | ✅   |
| 2   | `/privacy` h1 + h2 9개          | `pages/privacy/ui/privacy-page.test.tsx` | ✅   |
| 3   | 헤더 로고 링크 → `/`            | 두 페이지 테스트의 두 번째 케이스        | ✅   |
| 4   | Footer 링크 2개 + `mailto:` 1개 | `widgets/footer/ui/footer.test.tsx`      | ✅   |
| 5   | lint / check-types / build 통과 | 위 1절                                   | ✅   |

## 3. 이전 검증

| 항목                                             | 결과                                                       |
| ------------------------------------------------ | ---------------------------------------------------------- |
| 이전 매핑이 **전량** 반영되었나                  | ✅ 화면 2 · 위젯 1 · 에셋 3                                |
| 동작 동일성 — 현행 동작 기준선 11항목이 유지되나 | ✅ AC 테스트와 원문 섹션·문구·링크 직접 대조               |
| 의도적으로 바꾼 것만 바뀌었나                    | ✅ 구조·네이밍만. 본문 텍스트·클래스는 그대로              |
| 이전 후 남은 legacy 참조가 없나                  | ✅ `@/shared/assets`, `widgets/Footer` 참조 0건            |
| 구조 위반 3종 해소                               | ✅ PascalCase 폴더 → kebab / default → named / import 갱신 |

줄 수 차이는 조사 보조 정보로만 확인했으며 동작 보존의 근거로 사용하지 않았다. 약관·처리방침의
긴 본문은 legacy 원문과 새 파일의 제목, 조항/절, 링크를 직접 대조했다.

### 의도적으로 바꾼 것

| 항목                                                         | 이유                                                                                                                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `widgets/Footer/Footer.tsx` → `widgets/footer/ui/footer.tsx` | 폴더·파일 kebab-case, `ui/` 세그먼트                                                                                                                                                              |
| `export default Footer` → `export function Footer`           | named export 규칙                                                                                                                                                                                 |
| 로고 SVG → **`shared/ui/logo/` 신설**                        | `shared/assets/`는 REF-002에서 제거됨. `shared/ui/icon/`은 `width=height=size`로 정사각형을 강제해 가로로 긴 로고에 부적합하고, `logo-gr.svg`는 gradient 7개짜리 다색이라 아이콘 의미론에 안 맞음 |
| `logo-appcenter.png` → `widgets/footer/ui/assets/`           | 소비자가 Footer 하나뿐. `ui` 세그먼트 안이라 steiger 통과                                                                                                                                         |
| 라우트 정의를 `app/routes/`로 분리                           | `fsd-pages.md` 규칙                                                                                                                                                                               |

## 4. 시안 대조 재확인

**해당 없음** — Figma 시안이 존재하지 않는 화면이다 (`spec.md` 참고).
시안이 생기면 이 작업을 근거로 `FIX-` 항목을 새로 만든다.
