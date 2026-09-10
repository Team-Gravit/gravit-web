---
id: 'MIG-018'
planned: '2026-09-09'
mode: 'migrate'
---

# MIG-018 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: migrate` — legacy `pages/index.tsx`의 로그인 화면이 `apps/web`에 없다. 없던 기능을
만드는 것이 아니라 **legacy에 있는 화면을 옮긴다**. 신규 동작이 섞이는 항목(약관 링크)은
확인 필요 1로 분리해 두었다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                                                      |
| --- | ----------------------------------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | ✅  | 바꾼다: `/`의 화면. 보존한다: L1~L10의 관찰 동작. Out of Scope 6항목을 spec에 명시                                                                        |
| 2   | 반복 비용이나 확장 차단이 있는가    | ✅  | 화면이 없어 `useOauthLogin`에 호출부가 없다. MIG-005 Issue 4의 게이트가 미인증자를 `/`로 보내도 placeholder가 뜬다. `FEAT-017`도 이 화면 없이는 도달 불가 |
| 3   | 보존할 동작의 기준선이 있는가       | ✅  | `spec.md` 현행 동작 기준선 L1~L11 (legacy 코드 직접 확인)                                                                                                 |
| 4   | 자동 또는 수동 검증 방법이 있는가   | ✅  | §5-1의 동일성 확인 방법 6건. AC-1~6은 RTL + MSW로 자동화 가능                                                                                             |
| 5   | 범위를 독립적으로 완료할 수 있는가  | ✅  | MIG-005 Issue 4·5에 의존하지 않는다. `/`의 재진입 처리(L1)는 `_protected` 게이트와 대상 라우트가 다르다                                                   |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | ✅  | §5 리스크 표. 브랜치 `feat/#203/login-screen`은 커밋 0개라 되돌리기 지점이 명확하다                                                                       |

### 0-2. 자동 보류 신호 — 하나라도 해당하면 **중단**

- [x] 동작 변경이 같이 들어감 → **약관·개인정보 링크(확인 필요 1)가 여기 해당했다.**
      2026-09-09 「포함」으로 판정 — Figma가 SoT이고 링크 대상이 이미 존재한다. AC-7로 추가했고,
      `checklist.md`의 의도적 변경란에 기록한다. 나머지 동작 변경 후보 2건(연타 방지 · 768px 결함)은
      `FIX-019` · 의도적 변경 기록으로 각각 분리했다
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음 (화면 하나)
- [ ] 자동 생성물을 직접 손봐야 함 — 해당 없음. `routeTree.gen.ts`는 **재생성**한다
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 — 해당 없음. 현재 4종 통과(test 65건)
- [ ] 범위 밖 문제가 섞임 — 해당 없음

> 첫 항목 때문에 **작업 전체가 보류되지는 않는다.** 해당 항목만 분리해 두고 나머지를 진행한다.

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                        | 레이어       |
| --- | --------------------------------------------------------------- | ------------ |
| 1   | 뷰포트가 넓은 화면 조건을 만족하는지 판정한다                   | `[shared]`   |
| 2   | 심볼 로고를 렌더한다                                            | `[shared]`   |
| 3   | 진입 레이아웃(배경·상단바)을 제공한다                           | `[shared]`   |
| 4   | provider 3종 버튼을 렌더하고 클릭 시 인가 URL 조회를 시작한다   | `[features]` |
| 5   | 넓은 화면·좁은 화면 각각의 로그인 화면을 조립한다               | `[pages]`    |
| 6   | `/`에 로그인 화면을 연결하고 로그인 사용자를 `/main`으로 보낸다 | `[app]`      |
| 7   | 개인정보 처리방침 · 이용약관 링크를 화면에 둔다                 | `[pages]`    |

### 1-1. 관리 포인트 식별

| 값                                              | 상수 / 인라인 | 근거                                                                          |
| ----------------------------------------------- | ------------- | ----------------------------------------------------------------------------- |
| provider 3종 목록                               | **상수**      | 넓은 화면·좁은 화면 두 컴포넌트가 같은 목록을 쓴다. 렌더 순서도 여기서 나온다 |
| 버튼 문구 3종                                   | **상수**      | 기획이 바꿀 수 있는 사용자 노출 문구 (`constants-convention.md` §2)           |
| 카카오 `#FFE240` · 네이버 `#00B116`             | **상수**      | 토큰으로 올리지 않기로 한 값. 어디서 온 색인지 이름으로 밝혀야 한다           |
| 넓은 화면 기준 `768px`                          | **상수**      | 훅과 Tailwind `md`가 같은 값을 봐야 한다. 어긋나면 L11이 재발한다             |
| 제목·안내문 문구                                | 인라인        | 화면 고유 본문 텍스트. 한 곳에서만 쓴다                                       |
| 컨테이너 630×558 · 버튼 485×58 등 레이아웃 수치 | 인라인        | 디자인 스펙이지 관리 포인트가 아니다 (`constants-convention.md` 인라인 §1)    |

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | `shared/lib/use-is-wide-viewport.ts` (+`.test.ts`)<br>`shared/ui/logo/symbol.tsx`<br>`shared/ui/layout/{space-background.tsx, page-header.tsx, index.ts}` (+ 이미 있는 `assets/background.webp`)<br>`features/auth-login/ui/{social-login-button.tsx, social-login-button.test.tsx, index.ts?}`<br>`features/auth-login/model/login-providers.ts`<br>`pages/login/{index.ts, ui/login-page.tsx, ui/login-page-wide.tsx, ui/login-page-narrow.tsx, ui/login-page.test.tsx}` |
| 수정 | `shared/ui/logo/index.ts` (심볼 export 추가)<br>`features/auth-login/index.ts` (버튼 export 추가)<br>`app/routes/index.tsx` (`HomePage` → `LoginPage`, `beforeLoad` 추가)<br>`app/routeTree.gen.ts` (**재생성**)                                                                                                                                                                                                                                                           |
| 삭제 | `pages/home/index.ts` · `pages/home/ui/home-page.tsx` (스캐폴드)<br>`shared/ui/layouts/` 폴더명 → `layout`                                                                                                                                                                                                                                                                                                                                                                 |

`HomePage` 참조는 `app/routes/index.tsx` 한 곳뿐이다 (`grep` 실측). `GravitLogo` 참조 3곳
(`privacy-page` · `terms-page` · `footer`)은 **변경 없다** — 심볼을 별도 컴포넌트로 뺐기 때문이다.

npm 의존성 추가: **없음.** legacy는 `react-responsive`를 썼지만 `matchMedia` +
`useSyncExternalStore`로 충분하다.

### 2-1. 이전 매핑

| 현재 위치 (legacy)                                                  | 목표 위치 (apps/web)                                    | 변경 종류 | import 영향          |
| ------------------------------------------------------------------- | ------------------------------------------------------- | --------- | -------------------- |
| `pages/index.tsx`의 `RouteComponent`                                | `pages/login/ui/login-{wide,narrow}.tsx`                | 분해      | 신규                 |
| `pages/index.tsx`의 `beforeLoad`                                    | `app/routes/index.tsx`                                  | 이동      | 1곳(수정)            |
| `pages/index.tsx`의 `OAUTH_PROVIDERS`                               | `features/auth-login/model/login-providers.ts`          | 이동      | 신규                 |
| `features/login/ui/social-login-button.tsx`                         | `features/auth-login/ui/social-login-button.tsx`        | 이동+개편 | 신규                 |
| `shared/ui/button/button.variants.ts`의 `socialLoginButtonVariants` | `features/auth-login/ui/social-login-button.tsx` 안 cva | 이동      | shared로 올리지 않음 |
| `shared/ui/layout/entry-layout.tsx`                                 | `shared/ui/layout/{space-background,page-header}.tsx`   | 분해      | 신규                 |
| `shared/model/use-responsive.ts`                                    | `shared/lib/use-is-wide-viewport.ts`                    | 이동+개편 | 신규                 |
| `shared/assets/images/login-background.webp`                        | `shared/ui/layout/assets/background.webp`               | 이동 완료 | —                    |

**목표 위치 판정 근거**

- 소셜 버튼은 「사용자가 로그인한다」는 행동이고 UI가 mutation을 안다 → `features` (`fsd-features.md` §3)
- 진입 레이아웃은 도메인 단어가 없고 온보딩·리그가 함께 쓴다 → `shared/ui` (`fsd-shared.md` §4)
- `shared/model/`은 만들지 않는다 — shared에는 slice가 없다 (`state-convention.md` §8)
- 뷰포트 판정은 도메인 무관 훅 → `shared/lib` (`fsd-shared.md` §4)
- 폴더명은 기존 slice와 같이 단수형 `layout`

## 3. 의존 관계 검증

| 지점                                       | 방향                | 판정                                                                                                                                                                                               |
| ------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/login` → `features/auth-login`      | 4 → 2 하향          | ✅                                                                                                                                                                                                 |
| `pages/login` → `shared/ui/layout`, `logo` | 4 → 0 하향          | ✅                                                                                                                                                                                                 |
| `features/auth-login/ui` → `shared/ui`     | 2 → 0 하향          | ✅                                                                                                                                                                                                 |
| `shared/ui/layout` → 뒤로가기 시 세션 삭제 | **0 → 1 상향 위험** | ⚠️ legacy `EntryLayout`은 `tokenManager.clearTokens()`를 직접 부른다. 이번 범위(로그인)에는 뒤로가기 버튼이 없으므로 **레이아웃에 넣지 않는다.** 온보딩 이전 작업에서 `leftSlot` prop으로 주입한다 |
| `app/routes/index.tsx` → `entities/auth`   | 5 → 1 하향          | ✅                                                                                                                                                                                                 |

FSD 위반은 없다. 다만 `EntryLayout`을 legacy 그대로 옮기면 상향 참조가 생기므로 **뒤로가기
동작을 레이아웃 밖으로 뺀다**는 점이 이 계획의 전제다.

### 3-1. 컴포넌트 조합 방식 — 네이밍 · HOC 판정 (2026-09-09)

**네이밍** — `wide` / `narrow` 축을 유지하고, 이름에 명사를 붙인다.

| 후보                          | 판정 | 근거                                                                                       |
| ----------------------------- | ---- | ------------------------------------------------------------------------------------------ |
| `login-page-wide` / `-narrow` | ✅   | `spec.md` 용어 정의(넓은 화면·좁은 화면)와 같은 어휘. 형제 `login-page.tsx`와 짝이 맞는다  |
| `login-wide` / `login-narrow` | ❌   | 무엇이 wide인지 명사가 없다. `LoginPage`와 어휘가 어긋난다                                 |
| `login-desktop` / `-mobile`   | ❌   | 태블릿이 어디 속하는지 이름이 답하지 못한다                                                |
| `login-web` / `login-aos`     | ❌   | Figma 프레임 이름일 뿐이다. 좁은 화면의 실제 소비자는 네이티브 WebView라 플랫폼명이 틀린다 |

**HOC** — 도입하지 않는다. `LoginPage`에 삼항을 그대로 둔다.

| 근거          | 내용                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 사용처 1곳    | 온보딩·리그는 아직 이전 전이라 두 번째 사용처가 없다. 「반복됐다는 사실만으로 공통화하지 않는다」 (`refactor-checklist.md`) |
| 선례 0        | `apps/web`에 프로덕션 HOC가 하나도 없다(실측). 화면 하나 때문에 새 조합 패턴을 들이지 않는다                                |
| React 19 관례 | HOC는 훅 이전의 조합 수단이다. `displayName`·ref 전달·props 타입 배관 비용 대비 얻는 것이 3줄이다                           |
| 게이트 중복   | `withAuth` 성격은 TanStack Router `beforeLoad`가 담당한다(MIG-005 Issue 4). HOC를 만들면 게이트가 두 곳이 된다              |

```tsx
// pages/login/ui/login-page.tsx — 분기 지점이 한 곳에 보인다
export function LoginPage() {
  const isWide = useIsWideViewport();
  return isWide ? <LoginPageWide /> : <LoginPageNarrow />;
}
```

세 번째 화면에서 같은 분기가 필요해지면 그때 재판단한다. 그때도 HOC보다
`<ViewportSwitch wide={} narrow={} />` 형태가 먼저다 — HOC는 props 타입을 하나로 강제해서
한쪽에만 필요한 prop이 생기는 순간 깨진다.

> **뷰포트 JS 분기는 예외 수단이다.** 이 레포의 기본은 CSS(`md:`)이고 크기·여백 차이는
> Tailwind로 처리한다(`Button`의 `SIZE_CLASS_MD` 선례). JS로 가르는 것은 **구조 자체가 다른
> 화면**뿐이며, 이 작업에서는 `pages/login` 한 곳으로 제한한다.

## 4. 구현 계획 체크리스트

> `shared → features → pages → app` 순서. 아래를 먼저 만들어야 위가 import 할 수 있다.

- [ ] `[shared]` `shared/ui/layouts` → `shared/ui/layout` 폴더명 변경 (`git mv`, 에셋 포함)
- [ ] `[shared]` `use-is-wide-viewport.ts` — `matchMedia('(min-width: 768px)')` +
      `useSyncExternalStore`. 초기값을 동기로 읽어 첫 페인트 깜빡임을 없앤다. 테스트 동봉
- [ ] `[shared]` `logo/symbol.tsx` — `GravitSymbol`. `logo.tsx`의 `variant` 축은 건드리지 않는다
- [ ] `[shared]` `logo/index.ts`에 `GravitSymbol` · `GravitSymbolProps` 추가
- [ ] `[shared]` `layout/space-background.tsx` — 우주 배경면 · `children`
- [ ] `[shared]` `layout/page-header.tsx` — 상단바. 제목과 좌측 슬롯을 prop으로 받는다

> **계획과 달라진 점** — 계획은 `entry-layout.tsx` 하나가 배경과 상단바를 함께 갖고 뷰포트로
> 갈랐다. 그러면 `LoginPage`와 레이아웃 두 곳에서 같은 분기를 하게 되므로, 두 책임을 파일로
> 나누고 **레이아웃은 뷰포트를 모르게** 했다. 분기 지점은 §3-1대로 `LoginPage` 한 곳뿐이다.
>
> 이름은 `EntryBackdrop`으로 지었다가 **`SpaceBackground`로 고쳤다.** 이 배경을 리그 화면도
> 쓰므로 「진입(entry)」이 사용처를 좁게 말하고, `Backdrop`은 UI 용어로 모달 뒤 딤 레이어를
> 가리켜 나중에 진짜 backdrop이 생기면 충돌한다. 같은 이유로 **가운데 정렬을 컴포넌트에서
> 빼고** 화면이 `className`으로 정하게 했다 — 리그는 콘텐츠를 위에서부터 쌓는 화면이다.

- [ ] `[features]` `auth-login/model/login-providers.ts` — provider 3종 · 순서 · 문구 상수
- [ ] `[features]` `auth-login/ui/social-login-button.tsx` — cva 3변형 + 로고 이미지 + `useOauthLogin`
- [ ] `[features]` `auth-login/ui/social-login-button.test.tsx` — AC-2 (클릭 시 요청 1회)
- [ ] `[features]` `auth-login/index.ts` 배럴에 버튼·provider 목록 추가
- [ ] `[pages]` `login/ui/login-page-wide.tsx` — 워드마크 248×60 + 카드 630×558 + 버튼 485
- [ ] `[pages]` `login/ui/login-page-narrow.tsx` — 심볼 72 + 제목·안내문 + 버튼 328×48
- [ ] `[pages]` `login/ui/login-page.tsx` — 훅으로 둘 중 하나 렌더 (§3-1의 삼항 형태 그대로)
- [ ] `[pages]` 두 화면에 개인정보 처리방침 · 이용약관 링크 배치 (`Link to="/privacy"` · `"/terms"`)
- [ ] `[pages]` `login/ui/login-page.test.tsx` — AC-1 · AC-4 · AC-5 · AC-7
- [ ] `[pages]` `login/index.ts` 배럴
- [ ] `[app]` `routes/index.tsx` — `component: LoginPage` + `beforeLoad`에서 토큰 있으면 `/main` redirect (AC-3)
- [ ] `[app]` `pages/home` 스캐폴드 삭제
- [ ] `[app]` **라우트 트리 재생성** (`pnpm --filter @repo/web dev` 또는 build)
- [ ] 검증은 `ai-validate`로 넘긴다 — `lint` · `check-types` · `test` · `build` 4종

## 5. 리스크

| 리스크                                        | 영향                                | 대응                                                                                                            |
| --------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `matchMedia`가 jsdom에 없다                   | 훅을 쓰는 모든 테스트가 죽는다      | `vitest.setup.ts`에 stub을 두지 말고 **테스트 유틸로 명시 주입**. 기본 미정의 시 좁은 화면으로 폴백             |
| `768px` 경계 통일이 legacy와 1px 다르다 (L11) | 정확히 768px에서 렌더 결과가 바뀐다 | **통일로 판정됨.** `checklist.md`의 의도적 변경란에 기록하고, 훅과 클래스가 같은 값을 보도록 상수 하나로 묶는다 |
| 라우트 트리 재생성 누락                       | `check-types` 실패                  | 체크리스트에 단계로 명시함                                                                                      |
| 배경 이미지가 좁은 화면에서도 로드됨          | 모바일에서 298KB 낭비               | 넓은 화면 분기 안에서만 참조한다 (CSS `background-image`가 아니라 조건부 렌더)                                  |
| 구글 로고 브랜딩 규정                         | 색·크기 변경 시 규정 위반           | 원본 PNG 그대로, 흰/밝은 중립 배경 위에만 배치                                                                  |
| 브랜치 스택 3단 (`#196` → `#201` → `#203`)    | `#198` 머지 시 rebase 필요          | `git-workflow.md` §2-1의 `--force-with-lease` 절차. 이 작업 중에는 건드리지 않는다                              |

### 5-1. 동일성 확인 방법

| 기준선 | 방법        | 구체적 실행                                                                     |
| ------ | ----------- | ------------------------------------------------------------------------------- |
| L1     | 자동 테스트 | 토큰 `'t1'` 주입 후 `/` 진입 → 버튼 0개 · `/main` 이동 (AC-3)                   |
| L3·L4  | 자동 테스트 | `getAllByRole('button')`의 접근 가능한 이름이 순서대로 3개 (AC-1)               |
| L6     | 자동 테스트 | MSW로 인가 URL 요청 도달 1회 확인 (AC-2)                                        |
| L7·L8  | 자동 테스트 | `matchMedia` 주입값을 바꿔 각 분기의 문구 렌더 확인 (AC-4·AC-5)                 |
| L2·L5  | 명시적 대조 | 문구 6종과 `alt` 3종을 legacy 원문과 1:1 비교 — `checklist.md`에 표로 남긴다    |
| L9·L10 | 명시적 대조 | 확인 필요 1·2 판정 결과를 그대로 반영했는지 확인                                |
| 시안   | 수동 스모크 | `pnpm --filter @repo/web dev` → `/`를 넓은 화면·좁은 화면에서 열어 Figma와 대조 |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] `docs/implementation-status.md`의 `O.1` 행 갱신 (구현·검증 열)
- [ ] `docs/migration-status.md`의 `/` 행과 로그인 화면 행 갱신
- [ ] 확정 명세를 `docs/fe-implement-spec/O.1/`로 승격
- [ ] `GravitSymbol` 규격을 `docs/design-system/`에 반영
- [ ] `useIsWideViewport`의 `768px` 기준을 `docs/conventions/` 또는 `.claude/rules/`에 남길지 판단
