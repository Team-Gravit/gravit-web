# MIG-030 구현 계획

기준 `develop` 631bcbb · 작성 2026-09-16 · 근거는 같은 폴더의 `spec.md`

## 1. 작업 종류

`MIG-` — legacy 의 유닛 상세 화면을 `apps/web` 으로 옮긴다. 라우트 스텁이 이미 있고
(`component: () => null`) 그 자리를 채운다.

## 2. 착수 판단

`.claude/rules/refactor-checklist.md` §1 의 필수 게이트.

| 질문                               | 답과 근거                                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 목표와 비목표가 명확한가           | **예.** 유닛 상세 화면 본체 + 목적지 4종의 경로 계약을 만든다. 풀이 화면과 개념노트의 **내부는 만들지 않는다** (`spec.md` Out of Scope)                                            |
| 반복 비용이나 확장 차단이 있는가   | **예.** `MIG-027`·`MIG-029` 가 만든 유닛 카드의 목적지가 지금 `component: () => null` 이다. **학습 진입 경로가 막다른 길**이라 메인·학습 홈에서 유닛을 눌러도 아무것도 안 나온다   |
| 기준선이 있는가                    | **예.** `spec.md` 의 A1~A11 · B1~B3 · C1~C4, 동작 계약 K1~K5                                                                                                                       |
| 검증 방법이 있는가                 | **예.** `spec.md` 동일성 확인 방법 6항목. 라우트 테스트 선례가 있다 — `continue-learning-card.test.tsx` 의 `extraPaths` 로 링크 href 를 단언한다                                   |
| 범위를 독립적으로 완료할 수 있는가 | **예.** 목적지 4종은 빈 라우트라 각각 후속 작업이 내용만 채운다. 이 작업만으로 유닛 상세가 동작한다                                                                                |
| 위험을 격리했는가                  | **부분.** 생성물은 수정하지 않는다(라우트 트리는 재생성). 인증은 `_authenticated` 가 이미 처리한다. **다만 좁은 화면 `h1` 중복은 `MIG-029` 와 공유하는 결정이다** — 아래 리스크 R1 |

### 자동 보류 신호 (§2)

| 신호                             | 해당 여부                                                                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 동작 변경과 구조 변경이 섞였나   | **섞였지만 구분해 기록했다.** 시안 판정으로 "고침"인 항목(D2·D4·D5·D20~D25)은 **승인된 명세 변경**이고, 나머지는 동작 보존이다. 검증에서 둘을 나눠 확인한다 (§5) |
| 한 단위로 완료·검증할 수 없나    | 아니오                                                                                                                                                           |
| 자동 생성물을 직접 수정해야 하나 | 아니오. `routeTree.gen.ts` 는 재생성한다                                                                                                                         |
| 기존 검증 실패의 원인을 모르나   | 아니오. `prettier --check` 의 기존 실패는 `REF-003` 이 추적 중이며 이번 변경과 무관하다                                                                          |
| 범위 밖 문제를 발견했나          | **예 2건.** `UnitCard` 가 `unitId` 를 순번으로 표시하는 것(`spec.md` 확인 필요 1)과 `--color-3` 분류 오류(확인 필요 5). **이번에 고치지 않는다**                 |

→ **보류 없음. 착수 가능.**

## 3. 영향 분석

### 이미 있어서 만들지 않는 것

실측 결과 **`shared` 에 새로 만들 것이 없다.**

| 필요한 것         | 위치                     | 확인                                                           |
| ----------------- | ------------------------ | -------------------------------------------------------------- |
| 상태 칩 3 variant | `shared/ui/chip`         | `filled` · `outlined` · `muted` 가 시안 3종과 정확히 대응한다  |
| 경로 표시         | `shared/ui/breadcrumb`   | `BreadcrumbItem` 이 라우트 패턴 + params 를 받아 타입 검사된다 |
| 제목·설명         | `shared/ui/page-heading` | `MIG-028` 산출물                                               |
| 좁은 화면 상단 바 | `widgets/page-title-bar` | `backTo` · `rightSlot` 지원                                    |
| 로딩 자리표시     | `shared/ui/skeleton`     | `textSize` variant 로 글줄 높이를 맞춘다                       |

`Chip` 주석이 이미 `brand/main/2(=cta)` 라고 적고 있어 `spec.md` D11 의 토큰 판정과 일치한다.

### 신규 · 수정

| 구분   | 파일                                                                                         |
| ------ | -------------------------------------------------------------------------------------------- |
| 신규   | `entities/learning/model/lesson.ts` (+`lesson.test.ts`)                                      |
| 신규   | `entities/learning/api/use-unit-lessons.ts`                                                  |
| 신규   | `entities/learning/ui/lesson-item.tsx`                                                       |
| 신규   | `pages/unit-detail/ui/unit-detail-page.tsx` · `index.ts`                                     |
| 신규   | `app/routes/_authenticated/_focus/route.tsx`                                                 |
| 신규   | `app/routes/_authenticated/_focus/learning.lessons.$lessonId.tsx`                            |
| 신규   | `app/routes/_authenticated/_focus/learning.units.$unitId.bookmarked-problems.tsx`            |
| 신규   | `app/routes/_authenticated/_focus/learning.units.$unitId.incorrect-problems.tsx`             |
| 신규   | `app/routes/_authenticated/_app-shell/learning.units.$unitId.concept-note.tsx`               |
| 수정   | `entities/learning/api/index.ts` · `entities/learning/index.ts` (배럴)                       |
| 수정   | `app/routes/_authenticated/_app-shell/learning.units.$unitId.index.tsx` (스텁 → 페이지 연결) |
| 재생성 | `app/routeTree.gen.ts`                                                                       |
| 삭제   | 없음                                                                                         |

**`/learning/units/$unitId` 를 참조하는 곳은 5개 파일** (`rg` 실측) — `entities/learning/ui/unit-card.tsx`,
`widgets/continue-learning/ui/continue-learning-card.tsx`, 그리고 테스트 3개.
경로를 바꾸지 않으므로 **이 파일들은 건드리지 않는다.**

### 이전 매핑

| legacy 현재 위치                                  | 목표 위치                                      | 변경 종류 |
| ------------------------------------------------- | ---------------------------------------------- | --------- |
| `pages/.../learning/$chapterId/$unitId/index.tsx` | `pages/unit-detail/ui/unit-detail-page.tsx`    | 재작성    |
| `entities/learning/ui/lesson/lesson-item.tsx`     | `entities/learning/ui/lesson-item.tsx`         | 재작성    |
| `entities/learning/ui/summary-header.tsx`         | — (`shared/ui/page-heading` 이 대체)           | 대체됨    |
| `shared/ui/bread-crumb/`                          | — (`shared/ui/breadcrumb` 이 대체)             | 대체됨    |
| `shared/ui/chip/chip.tsx`                         | — (`shared/ui/chip` 이 대체)                   | 대체됨    |
| `shared/lib/format-unit-index.ts`                 | — (순번 보류. `toUnitLabel` 이 자리를 잡는다)  | 보류      |
| `$unitId/index.tsx` 의 `UnitActionCard`           | `pages/unit-detail/ui/` 비-export 서브컴포넌트 | 재작성    |

**legacy 의 `LessonItem` 은 안에 `<Link>` 를 들고 있다.** `fsd-entities.md` §3 이 엔티티 UI 의
라우팅을 금하므로, 행 내용만 그리고 `<Link>` 는 페이지가 감싼다.

## 4. 구현 계획

레이어 순서대로 진행한다. `shared` 는 변경이 없으므로 `entities` 부터 시작한다.

- [ ] `[entities]` `model/lesson.ts` — `LessonSummaryResponse[]` → 화면 모델 변환.
      `isSolved` → 칩 상태(`completed` / `notStarted`) 매핑과 `toUnitLabel()` 을 여기 둔다.
      `toUnitLabel` 에 **제거 조건 주석**을 단다 (서버가 챕터 내 순번 필드를 주면 교체)
- [ ] `[entities]` `model/lesson.test.ts` — 빈 목록 · `isSolved` 양쪽 분기
- [ ] `[entities]` `api/use-unit-lessons.ts` — `useGetAllLessonInUnit` 을 `select` 로 감싼다.
      `use-chapters.ts` 와 같은 형태
- [ ] `[entities]` `ui/lesson-item.tsx` — 레슨 제목 · `{n}문제` · 상태 칩. **링크를 갖지 않는다**
- [ ] `[entities]` 배럴 2개 갱신 (`api/index.ts` · `index.ts`)
- [ ] `[pages]` `pages/unit-detail/` — `PageTitleBar`(좁은 화면) · `PageHeading` · 이동 카드 3장 ·
      문제 리스트를 배치한다. 반응형은 **CSS(`md:`)** 로 한다 — 두 폭의 DOM 순서가 같다
      (`fsd-pages.md` §6-1 "반응형은 CSS 우선")
- [ ] `[pages]` 로딩은 `Skeleton` 으로 레슨 행 자리표시. 시안에 프레임이 없으므로
      **새 디자인을 만들지 않고** 확정 수치(높이 74px · radius 8 · 간격 12px)만 쓴다
- [ ] `[app]` `_focus/route.tsx` 신설 — `Outlet` 만. K1 을 구조로 강제한다
- [ ] `[app]` 빈 라우트 4종 추가 (`spec.md` 라우트 계약표). 주석에 **어느 작업이 채울지** 남긴다
- [ ] `[app]` `learning.units.$unitId.index.tsx` 스텁을 `UnitDetailPage` 로 연결
- [ ] `[app]` **라우트 트리 재생성** 후 `check-types`
- [ ] `[검증]` `pnpm lint` → `check-types` → `test` → `build` 순서로 실행
- [ ] `[검증]` 변경한 파일만 `pnpm exec prettier --check <파일...>` (`REF-003` 기존 실패와 구분)

## 5. 리스크

| #   | 리스크                                                                                                                                       | 영향                                                                            | 대응                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| R1  | **좁은 화면 `h1` 중복.** `PageTitleBar` 와 `PageHeading` 이 둘 다 `<h1>` 을 낸다. 시안은 둘 다 요구한다 (상단 바 = 챕터명, 본문 = 유닛 제목) | 접근성 위반. 고치려면 **`MIG-029` 와 공유하는 shared 컴포넌트**를 건드려야 한다 | `MIG-028` 이 "조립하는 작업에서 판단"으로 미룬 건이다. **`MIG-029` 와 합의 전에는 shared 를 고치지 않는다.** 아래 확인 필요 |
| R2  | `MIG-029` 가 같은 시각 다른 워크트리에서 진행 중                                                                                             | `entities/learning` 배럴과 shared 컴포넌트에서 충돌 가능                        | 배럴은 **추가만** 하고 기존 줄을 건드리지 않는다. shared 는 수정하지 않는다                                                 |
| R3  | 라우트 트리 재생성 누락                                                                                                                      | `check-types` 실패                                                              | 체크리스트에 명시적 단계로 넣었다                                                                                           |
| R4  | 유닛 순번 잠정 처리가 시안과 다르다 (`Unit01` 대신 유닛명)                                                                                   | `design-diff` 가 계속 이 항목을 잡는다                                          | `spec.md` 확인 필요 1 에 잠정 결정과 교체 지점(`toUnitLabel`)을 기록했다                                                    |
| R5  | 빈 라우트 4종이 아무것도 안 그린다                                                                                                           | 사용자가 카드를 눌렀는데 빈 화면을 본다                                         | 현재 유닛 상세 스텁과 같은 상태다. 주석에 채울 작업을 남긴다. **더 나쁘게 만들지는 않는다**                                 |

### 동일성 확인 방법

**동작 보존**과 **승인된 명세 변경**을 나눠서 확인한다.

| 축                   | 방법                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| 동작 보존 (K1)       | 풀이 3종 URL 에 직접 들어가 헤더·하단 탭바가 **보이지 않는지** 확인                                         |
| 동작 보존 (K2·K5)    | 자동 테스트 — 레슨 행의 `href` 가 `/learning/lessons/{id}`, 경로 표시 챕터 항목이 `/learning/chapters/{id}` |
| 동작 보존 (K4)       | 자동 테스트 — `isSolved` true/false 각각의 칩 문구                                                          |
| 명세 변경 (D2·D4·D5) | 칩 variant 가 `outlined`(완료) · `muted`(학습 전)인지 — legacy 와 **반대로** 바뀐 것이 의도대로인지 확인    |
| 명세 변경 (D20~D25)  | 시안 수치 6건을 Storybook 또는 화면에서 육안 대조                                                           |
| 반응형               | 좁은 폭에서 경로 표시가 사라지고 북마크·오답이 가로 2열이 되는지                                            |

자동 테스트는 `continue-learning-card.test.tsx` 의 `extraPaths` 패턴을 따른다.

## 6. 착수 전 결정 — 좁은 화면 `h1` 중복 (R1)

**결정 (2026-09-16 · 사용자 승인)** — 이번에 결정하고 `MIG-029` 에 전달한다.

`shared/ui/page-heading` 에 **제목 태그 수준을 고르는 prop** 을 추가한다. 좁은 화면에서는
`PageTitleBar` 가 `h1` 을 갖고 본문 `PageHeading` 은 `h2` 가 된다. 넓은 화면에는 상단 바가 없으므로
`PageHeading` 이 그대로 `h1` 이다.

**왜 이쪽인가** — 시안이 상단 바(챕터명)와 본문 제목(유닛)을 둘 다 요구한다. 어느 하나를 빼면
시안과 달라지고, 뺀 쪽을 나중에 되살릴 때 또 같은 결정을 해야 한다. 지금 한 번 정하는 게 싸다.

**전달 의무** — `shared` 를 건드리므로 `MIG-029` 가 같은 컴포넌트를 쓴다.
구현 후 `MIG-029` 담당에게 prop 추가 사실과 사용법을 알린다. `page-heading.tsx` 의 JSDoc
("`PageTitleBar` 와 동시에 렌더링하지 않습니다")도 함께 갱신한다 — 이제 동시 렌더링이 전제다.

**충돌 최소화** — `PageHeading` 의 기존 시그니처를 바꾸지 않고 **선택적 prop 만 추가**한다.
기본값은 현재 동작(`h1`)이라 `learning-page-narrow.tsx` 등 기존 사용처는 영향을 받지 않는다.
