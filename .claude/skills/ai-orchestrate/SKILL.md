---
name: ai-orchestrate
description: >
  `ai-plan`이 승인받은 계획을 실제 코드로 옮긴다. 레이어 의존 순서대로 만들고,
  라우트를 추가했으면 라우트 트리를 재생성한다.

  "계획대로 진행해줘", "승인했어 만들어줘", "이제 옮겨줘" 같은 요청이나
  `ai-plan`의 게이트를 통과한 직후에 사용한다.

  계획에 없는 것을 만들지 않는다. 구현 중에는 증분 검사를 하고, 전체 검증은 `ai-validate`가 한다.
---

# ai-orchestrate

## 0. 전제

- `work/in-progress/{ID}/plan.md`가 있고 **사용자 승인을 받았다**
- 없으면 `ai-plan`으로 돌려보낸다

---

## 1. 레이어 순서를 지킨다

```
shared → entities → features → widgets → pages → app
```

아래를 먼저 만들어야 위가 참조할 수 있다. 이 순서를 어기면 중간 단계마다 빌드가 깨져
"지금 깨진 게 내 실수인지 순서 탓인지" 구분이 안 된다.

각 레이어 안에서는 **에셋 → 구현 → 배럴** 순서.

### ⚠️ 매핑 단위마다 green을 유지한다

전부 옮긴 뒤 한꺼번에 검사하지 않는다. **이전 매핑 한 줄을 끝낼 때마다** 타입체크가 통과하는지 본다.

```bash
pnpm --filter @repo/web check-types
```

한 번에 다 옮기고 나서 에러 30개를 보면 **어느 이동이 원인인지 알 수 없다.**
단위마다 확인하면 방금 한 것이 범인이다.

**import 갱신은 그 단위 안에서 끝낸다.** 파일을 옮기고 import 사이트를 나중에 고치겠다고
미루면, 중간 상태가 깨진 채로 다음 이동이 쌓인다. **옮긴 파일 + 그것을 참조하는 모든 곳**이
한 묶음이다.

라우트를 건드린 단위라면 타입체크 전에 트리를 재생성해야 한다 (§4).

## 2. 구현 규칙 적용

변경 대상에 맞는 `.claude/rules/` 문서를 읽고 적용한다.

- FSD 위치·public API: `fsd-*.md`
- import·배럴: `import-convention.md`
- 컴포넌트·타입: `component-convention.md`
- className·토큰: `className-convention.md`
- 생성물: `api-convention.md`와 `CLAUDE.md`의 생성 파일 정책

규칙을 이 스킬에 다시 요약하지 않는다. 충돌하면 `.claude/rules/`가 정본이다.

### 인접한 비표준 코드를 만났을 때

옮기다 보면 계획에 없는 지저분한 코드가 옆에 있다.
**계획 범위 안의 가벼운 정리까지만** 허용한다 (import 정렬, 명백한 오타).
본질적인 리팩터는 `work/to-do/`에 새 항목으로 뽑는다 (`refactor-checklist.md`).

## 3. `MIG-`는 승인된 범위만 변경한다

MIG의 기본 목표는 legacy의 확정 동작을 보존하며 `apps/web`으로 이전하는 것이다.

### MIG에 포함할 수 있는 변경

- 승인된 Migration Map에 명시된 파일·폴더·export·import 변경
- 해당 화면을 FSD에 배치하기 위해 필요한 국소 라우트·레이어 분리
- legacy에는 있었지만 `apps/web`에서 빠진 동작을 복원하는 보존 AC
- `design-diff`에서 사용자가 `고침`으로 승인하고 계획에 포함한 차이
- 확정 AC 중 회귀 위험이 큰 로직을 고정하는 테스트

### 별도 작업으로 분리할 변경

- 여러 화면에 영향을 주는 라우트·인증 구조 재설계 → `REF-`
- legacy와 확정 명세에 없던 신규 제품 동작 → `FEAT-`
- 이번 이전과 독립적으로 고칠 수 있는 버그·시안 차이 → `FIX-`
- 계획에 없는 인접 코드 정리·성능 최적화

### 추가 승인 없이 변경하지 않는 것

- 화면 문구·조건 분기·에러 처리
- 판정이 끝나지 않은 UI 값
- `나중` 또는 별도 작업으로 분리한 개선 항목

테스트 추가 자체는 동작 변경이 아니다. 확정 AC를 검증하는 테스트는 MIG에 포함할 수 있지만,
테스트를 근거로 명세에 없는 동작을 새로 구현하지 않는다. 테스트와 구현이 어긋나면 어느 쪽이
확정 계약인지 확인하고, 제품 결정이 필요하면 멈춰 사용자 판정을 받는다.

**"이왕 옮기는 김에" 개선하지 않는다.** 근거와 승인 없는 변경은 범위 밖이다.

### 긴 본문은 누락 여부를 별도로 대조한다

약관처럼 긴 고정 문구를 다시 타이핑하면 누락 위험이 크다. 안전하게 내용을 옮긴 뒤 구조 변경을
작게 적용하고, 원본과 새 파일의 문구·섹션·링크를 직접 대조한다.

```bash
# 변환 후 남은 옛 참조 스캔
rg -n "createFileRoute|@/shared/assets|widgets/Footer" <새 파일>
```

줄 수는 조사 힌트일 뿐 동작 보존의 증거로 쓰지 않는다 (`refactor-checklist.md`). 자동 변환을
사용했다면 결과를 전문으로 확인하고 타입 검사와 계약별 검증을 수행한다.

---

## 4. ⚠️ 라우트를 추가했으면 트리를 재생성한다

**가장 자주 걸리는 함정이다.**

`app/routes/`에 파일을 추가해도 `routeTree.gen.ts`는 자동으로 갱신되지 않는다.
그래서 타입 검사가 이렇게 실패한다.

```
src/app/routes/terms.tsx(5,38): error TS2345:
  Argument of type '"/terms"' is not assignable to parameter of type '"/"'.
```

**`pnpm build`로는 못 푼다.** `tsc && vite build` 순서라 tsc가 먼저 죽어
트리를 만드는 vite 단계에 도달하지 못한다. tsc를 건너뛰고 트리를 먼저 만들어야 한다.

```bash
pnpm --filter @repo/web exec vite build
```

그 다음 `check-types`가 통과한다. 생성 확인:

```bash
rg -n "<새 라우트명>" apps/web/src/app/routeTree.gen.ts
```

`routeTree.gen.ts`는 **직접 편집하지 않는다.** 훅이 차단한다.

---

## 5. 명세가 확정됐으면 테스트를 붙인다

`spec.md`의 `확정 명세 · 검증 기준`에 AC가 있으면, **로직성인 것만** 테스트로 고정한다
(`test-policy.md`). 시각 스타일은 테스트하지 않는다.

### 라우터를 쓰는 컴포넌트 테스트

`<Link>`를 쓰는 컴포넌트는 라우터 컨텍스트가 필요하다. 앱의 실제 `routeTree`를 끌어오면
앱 전체가 딸려오므로 **최소 트리**를 만든다.

```tsx
const rootRoute = createRootRoute();
const routes = ['/', '/terms'].map((path) =>
  createRoute({ getParentRoute: () => rootRoute, path, component: Target }),
);
const router = createRouter({
  routeTree: rootRoute.addChildren(routes),
  history: createMemoryHistory({ initialEntries: ['/'] }),
});

await router.load(); // ⚠️ 이걸 빼면 첫 렌더가 비어 있다
render(<RouterProvider router={router as never} />);
```

> `router.load()`를 기다리지 않으면 `<body><div /></body>`만 나오고
> "요소를 찾을 수 없다"로 실패한다. 원인이 안 보이는 실패라 특히 주의한다.
> 쿼리는 `findBy*`(비동기)를 쓴다.

---

## 6. 보고 형식

레이어별로 무엇을 했는지 적는다.

```
✅ [shared] 로고 슬라이스 신설
   - 생성: shared/ui/logo/{logo.tsx, index.ts, assets/}
   - export: GravitLogo, GravitLogoProps

✅ [widgets] Footer 이전
   - Old: legacy widgets/Footer/Footer.tsx → New: widgets/footer/ui/footer.tsx
   - default export → named export

✅ [app] 라우트 등록 + 트리 재생성
```

**커밋하지 않는다.** 검증은 `ai-validate`, 커밋은 사용자가 요청할 때.

---

## 하지 않는 것

- ❌ 계획에 없는 것 만들기 — 범위 밖 문제를 발견하면 `work/to-do/`에 새 항목으로 뽑는다
- ❌ 레이어 순서 무시
- ❌ `apps/legacy-web` 편집 (훅이 차단)
- ❌ 생성 파일 직접 수정 (훅이 차단)
- ❌ 라우트 추가 후 트리 재생성 건너뛰기
- ❌ 긴 파일을 손으로 다시 타이핑하기
- ❌ 커밋
