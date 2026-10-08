# MIG-027 — 구현 계획

> `ai-plan` 2026-09-16. 입력은 `spec.md`의 현행 동작 기준선(23항목·계약 5)과 시안 대조 결과(판정 완료).

## 0. 작업 종류

**`MIG-`** — legacy `/learning`(LRN-01)에 있는 것을 `apps/web`으로 옮긴다. 신규 기능이 아니다.
번호 `027`은 `work/` 전체 최댓값 `FEAT-026` 다음이다.

### ⚠️ `refactor-planner`를 건너뛴 근거

`ai-plan` §0은 **파일 10개 초과 · 여러 슬라이스**면 `refactor-planner`를 먼저 밟으라고 한다.
이 작업은 파일 20개 · 슬라이스 4개로 그 기준에 걸린다. 그럼에도 건너뛴 이유는 다음과 같다.

- 파일 수의 절반이 배럴·테스트·스토리다. **실질 신규 모듈은 5개**(chapter 모델 · chapter 조회 훅 ·
  `ChapterCard` · `PageTitleBar` · `ChapterGrid`)이고 하나의 수직 슬라이스를 이룬다
- `refactor-planner`의 핵심 산출물은 **독립적으로 검증 가능한 동작 보존 단위 이슈**인데,
  화면 하나가 통째로 나가야 의미가 있어 쪼갤 접합면이 없다. 「챕터 카드만 먼저」는 검증할 수 없다
- ADR로 다룰 가치가 있는 결정 2건은 아래 §1에 직접 적었다

**판단이 다르면 이 계획을 승인하지 말고 `refactor-planner`로 돌려보내 주세요.**

---

## 1. 기술 결정

### ADR-1. 챕터는 새 slice가 아니라 `entities/learning`에 둔다

**Context** — 챕터는 서버에서 `chapter-api`로 따로 오고, legacy도 `entities/chapter`와
`entities/learning`을 분리해 뒀다. 새 slice `entities/chapter`를 만들 것인가?

**Decision** — **`entities/learning`에 넣는다.**

**Alternatives**

| 안                          | 내용                        | 거부 이유                                                                                                             |
| --------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `entities/chapter` 신설     | legacy 구조를 그대로 따른다 | 챕터·유닛·레슨은 한 계층 구조라 서로를 참조하게 된다. 같은 레이어의 다른 slice 참조는 **훅이 차단**한다 (cross-slice) |
| `entities/learning-content` | 챕터·유닛을 묶는 새 이름    | 기존 `entities/learning`과 의미가 겹쳐 두 slice 중 어디에 둘지 매번 헷갈린다                                          |

**Consequences** — `entities/learning`이 커진다(현재 ui 6개 → 7개). 다만 이미
`toChapterProgressPercent`·`UnitCard`(챕터명을 제목으로 쓴다)·`unit-progress`가 이 slice에 있어
챕터 개념이 이미 여기 산다. LRN-02(유닛 목록)를 만들 때 챕터↔유닛을 함께 다루게 되므로
지금 쪼개면 그때 cross-slice 위반이 난다. 반대로 나중에 이 slice가 감당이 안 되면
`refactor-checklist`를 거쳐 분리하는 편이 싸다.

### ADR-2. 화면별 차이는 `md:` 반응형이 아니라 cva `size` variant로 준다

**Context** — 챕터 카드가 WEB·MOB에서 8가지가 다르다 (radius 12/8 · padding 32/16·12 ·
제목 32/20px · 진행바 16px 단색/8px 그라데이션 · 퍼센트 heading2/label1 · 비율 273:283 / 1:1.05).

**Decision** — `ChapterCard`에 **cva `size: 'lg' | 'sm'`** 를 두고 페이지가 골라 넘긴다.
페이지는 `useIsWideViewport`로 이미 wide/narrow 트리를 나눈다 (`MainPage`와 같은 구조).

**Alternatives**

| 안                  | 내용                       | 거부 이유                                                                                        |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `md:` 반응형 클래스 | `UnitCard`가 쓰는 방식     | 8가지가 모두 갈리면 클래스 문자열이 두 배가 되고, 진행바처럼 **구조가 다른 것**은 표현이 안 된다 |
| 컴포넌트 2개로 분리 | `ChapterCardWide`/`Narrow` | 링크·접근성 이름·진행률 보정 같은 동일 로직이 복제된다                                           |

**Consequences** — 같은 slice의 `UnitCard`(반응형 클래스 방식)와 방식이 갈린다. 두 컴포넌트를
나중에 통일하려면 별도 `REF-`가 필요하다. 대신 `component-convention.md` §5의 「변형은 cva로」를
따르고, 진행바 채움처럼 클래스로 표현 못 하는 차이를 자연스럽게 담는다.

### ADR-3. 학습 URL을 단일 id로 평탄화한다 — `chapterId`/`unitId` 중복 제거

**Context** — `docs/routes.md`는 `/learning/$chapterId/$unitId`의 평탄화 여부를 「학습 화면을
구현하는 `MIG-`에서 확정한다」고 미뤄 뒀다. 이 URL은 id 두 개를 나란히 들고 있어
**서로 어긋난 조합(`/learning/3/21`에서 유닛 21이 챕터 3 소속이 아님)을 표현할 수 있다.**
어긋났을 때 무엇을 기준으로 판단할지가 정해져 있지 않다.

**서버 데이터 확인 (2026-09-16, `shared/api/generated` 전수)** — 학습 계층의 모든 엔드포인트가
**id 하나만** 받는다.

| 엔드포인트                                  | 파라미터   | 응답이 함께 주는 것                          |
| ------------------------------------------- | ---------- | -------------------------------------------- |
| `GET /api/v1/chapters`                      | 없음       | —                                            |
| `GET /api/v1/units/{chapterId}`             | chapterId  | `chapterSummaryResponse`                     |
| `GET /api/v1/lessons/{unitId}`              | **unitId** | **`chapterSummary` + `unitSummaryResponse`** |
| `GET /api/v1/problems/{lessonId}`           | lessonId   | `unitSummaryResponse`                        |
| `GET /api/v1/bookmarks/{unitId}`            | unitId     | —                                            |
| `GET /api/v1/wrong-answered-notes/{unitId}` | unitId     | —                                            |

**`chapterId`와 `unitId`를 함께 요구하는 엔드포인트가 하나도 없다.** 특히 유닛 상세(LRN-03)가 쓰는
`GET /api/v1/lessons/{unitId}`는 응답에 `chapterSummary`(chapterId + title)를 담아 주므로,
화면이 챕터 맥락(제목·상위 이동)을 그리는 데도 URL의 `chapterId`가 필요 없다.

**Decision** — **URL에 id를 하나만 둔다.** 리소스 이름을 붙여 어떤 id인지 드러낸다.

```
/learning                                   LRN-01  챕터 목록
/learning/chapters/$chapterId               LRN-02  유닛 목록
/learning/units/$unitId                     LRN-03  레슨 목록(유닛 상세)
/learning/units/$unitId/lessons/$lessonId   QUIZ-01~08
/learning/units/$unitId/bookmarks           북마크
/learning/units/$unitId/wrong-answers       오답 노트
```

**Alternatives**

| 안                                                 | 내용                                            | 거부 이유                                                                                                                                      |
| -------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 현행 유지 `/learning/$chapterId/$unitId`           | legacy와 같다                                   | 어긋난 조합을 표현할 수 있고, 그 판단 규칙을 화면마다 새로 만들어야 한다. `routes.md` §3의 「동적 세그먼트를 연달아 두지 않는다」에도 어긋난다 |
| `/learning/$chapterId` + `/learning/units/$unitId` | 챕터만 리소스 이름 없이 짧게                    | 같은 깊이에서 한쪽만 리소스 이름이 있어 `/learning/3`이 챕터인지 유닛인지 URL만으로 구분되지 않는다                                            |
| 어긋남을 런타임에 검증                             | 유닛 응답의 chapterId와 URL을 대조해 리다이렉트 | 쓰지도 않는 값을 지키려고 화면마다 검증·리다이렉트 코드를 넣게 된다. **문제를 없애는 대신 관리한다**                                           |

**Consequences** — `/learning/chapters/$chapterId`가 `/learning/$chapterId`보다 한 세그먼트 깊다.
대신 **어긋난 조합이 구조적으로 표현 불가능해져** 판단 규칙 자체가 필요 없어지고,
URL만 보고 무엇의 id인지 읽힌다. 유닛 상세는 `/learning/3/21/...`(5세그먼트) →
`/learning/units/21/...`(4세그먼트)로 오히려 얕아진다.

**진입점 의미** — 챕터 카드와 메인 「전체 학습화면 보기」는 챕터의 유닛 목록
`/learning/chapters/$chapterId`로 간다. 유닛 카드와 「N강 이어서 학습하기」는 해당 유닛의
레슨 목록 `/learning/units/$unitId`로 간다. 문구가 가리키는 리소스와 URL의 id를 일치시킨다.

**이번 작업에 포함되는 여파** — `MIG-025`에서 만든 `UnitCard`, `ContinueLearningCard`, 관련 테스트의
기존 `/learning/$chapterId/$unitId` 링크를 위 기준으로 함께 갱신한다. 이는 「전체 학습화면 보기」도
다음 유닛으로 보내던 `MIG-025` AC-14를 대체하는 사용자 판정이다(2026-09-16).
`/learning`은 **외부 계약이 아니다** (`routes.md` §1의 외부 계약 목록에 없고, 네이티브 셸은
루트 URL만 연다) — 바꿔도 안전하다.

---

---

## 2. 착수 판단 (`refactor-checklist.md` §1)

| 질문                               | 답과 근거                                                                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 목표와 비목표가 명확한가           | **바꾼다**: `/learning` 스텁 → 챕터 목록 화면. **보존한다**: 기준선 C1~C6·D1~D8의 조회·상태·이동 동작. **안 한다**: `/learning/chapters/$chapterId`와 `/learning/units/$unitId` 화면 본체 (`spec.md` Out of Scope) |
| 반복 비용이나 확장 차단이 있는가   | **있다.** 메인의 CTA 3곳과 바텀탭이 전부 `/learning`으로 보내는데 스텁이라 학습 시작 경로가 끊겨 있다. LRN-02 이후 화면도 이 화면이 없으면 진입점이 없다                                                           |
| 기준선이 있는가                    | **있다.** `spec.md` 현행 동작 기준선 23항목 + 동작 계약 5건(K1~K5) + 시안 대조 6축                                                                                                                                 |
| 검증 방법이 있는가                 | **있다.** MSW 기반 위젯 테스트(목록·빈·에러·재시도 요청 횟수) + 순수 함수 테스트 + `spec.md` 「동일성 확인 방법」의 수동 스모크 6항목. §6에 실행 계획으로 옮겼다                                                   |
| 범위를 독립적으로 완료할 수 있는가 | **있다.** 화면 하나가 단위다. 하위 목적지는 자리 라우트로 끊어 두고, 면접대비·잠금 상태는 범위 밖으로 명시했다                                                                                                     |
| 위험을 격리했는가                  | 라우트 트리 재생성(§4 마지막 단계)·공용 `ProgressBar` 변경(기존 사용처 4곳, §5)·생성물 미수정. 인증·토큰은 건드리지 않는다                                                                                         |

### 자동 보류 신호 (§2)

| 신호                                 | 해당 | 근거                                                                                                                |
| ------------------------------------ | :--: | ------------------------------------------------------------------------------------------------------------------- |
| 동작 변경과 구조 변경이 섞였다       |  △   | 탭 제거·색 통일은 **시안 대조로 승인된 명세 변경**이지 곁다리 개선이 아니다. 그 외 동작은 기준선대로 보존한다       |
| 한 단위로 완료·검증할 수 없다        |  ❌  | 화면 하나                                                                                                           |
| 자동 생성물을 직접 수정해야 한다     |  ❌  | `chapter-api`는 이미 생성돼 있다. **orval 재생성 불필요**                                                           |
| 기존 검증 실패의 원인을 설명 못 한다 |  ❌  | 착수 시점 `lint`·`check-types`·`build` 통과. `test`는 `recommended-units` 1건이 콜드 스타트 타임아웃으로 flaky (§5) |
| 범위 밖 문제를 발견했다              |  △   | flaky 테스트 → `INFRA-` 항목으로 분리 (§7). 이번에 고치지 않는다                                                    |

**보류 없음. 착수 가능.**

---

## 3. 영향 분석

### 파일

| 구분     | 파일                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **신규** | `entities/learning/model/chapter.ts` · `chapter.test.ts`<br>`entities/learning/api/use-chapters.ts`<br>`entities/learning/ui/chapter-card.tsx` · `chapter-card.stories.tsx`<br>`widgets/page-title-bar/ui/page-title-bar.tsx` · `index.ts`<br>`widgets/chapter-grid/ui/chapter-grid.tsx` · `chapter-grid.test.tsx` · `index.ts`<br>`pages/learning/ui/learning-page-wide.tsx` · `learning-page-narrow.tsx`<br>`app/routes/_authenticated/_app-shell/learning.chapters.$chapterId.index.tsx` · `learning.units.$unitId.index.tsx` |
| **수정** | `shared/ui/progress-bar/progress-bar.tsx` · `progress-bar.test.tsx` · `progress-bar.stories.tsx`<br>`entities/learning/api/index.ts` · `entities/learning/index.ts`<br>`pages/learning/ui/learning-page.tsx`<br>`app/routes/_authenticated/_app-shell/learning.index.tsx`                                                                                                                                                                                                                                                        |
| **생성** | `app/routeTree.gen.ts` (직접 편집 금지 — 재생성)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **삭제** | 없음                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### 기존 참조처 — 깨지지 않는지 실측

`rg -l "'/learning'"` 결과 15개 파일이 `/learning`을 참조한다. **URL은 그대로 두므로 전부 무사하다.**
`pages/learning`을 참조하는 코드는 라우트 파일 1개뿐이고, `LearningPage`의 export 이름을 유지한다.

`ProgressBar` 사용처는 4곳(`continue-learning-card` · `mission-card` · `growth-summary` ·
`labeled-progress-bar`)이다. **`fill` variant의 기본값을 현재 동작(`gradient`)으로 두어
기존 4곳이 변하지 않게 한다.**

### 이전 매핑표

| 현재 위치 (legacy)                                      | 목표 위치 (`apps/web/src/`)             | 변경 종류        | import 영향                             |
| ------------------------------------------------------- | --------------------------------------- | ---------------- | --------------------------------------- |
| `entities/chapter/chapter-card.tsx`                     | `entities/learning/ui/chapter-card.tsx` | 재작성 (ADR-1·2) | 없음 (신규)                             |
| `entities/learning/model/mappers.ts` `mapToChapter(s)`  | `entities/learning/model/chapter.ts`    | 재작성 (§5 R4)   | 없음                                    |
| `entities/learning/model/hooks.ts` `useFetchChapters`   | `entities/learning/api/use-chapters.ts` | 재작성           | 배럴 2개 수정                           |
| `entities/learning/api/query-keys.ts` `learningKeys`    | **옮기지 않는다**                       | 폐기             | orval `getGetAllChapterQueryKey`가 대체 |
| `shared/lib/planet/utils.ts` `getPlanetImage`           | `entities/learning/ui/planet-images.ts` | **이미 있다**    | 재사용                                  |
| `shared/ui/hero/hero-section.tsx` + `main-greeting.tsx` | `widgets/hero-greeting`                 | **이미 있다**    | 재사용                                  |
| `widgets/main-page/ui/main-section-error.tsx`           | `shared/ui/card` `CardRetryStatus`      | **이미 있다**    | 재사용                                  |
| `learning/index.tsx`의 인라인 `<header>`                | `widgets/page-title-bar`                | 승격 (신규)      | 없음                                    |
| `learning/index.tsx`의 탭 `<ul>`                        | **옮기지 않는다**                       | 제거 (S1·S2)     | —                                       |
| `learning/index.tsx`의 그리드 `<ul>`                    | `widgets/chapter-grid`                  | 재작성           | 없음                                    |
| `shared/ui/card/bg-card.tsx` · `tooltip/Tooltip.tsx`    | **옮기지 않는다**                       | 폐기 (§5 R5)     | —                                       |

목표 위치는 `fsd-entities.md`(도메인 명사·표시 전용) · `fsd-widgets.md`(독립 화면 덩어리) ·
`api-convention.md` §3(생성 API는 도메인 경계 뒤)을 기준으로 판정했다.

---

## 4. 구현 계획 체크리스트

레이어 의존 순서대로 진행한다.

### `[shared]`

- [ ] `progress-bar.tsx`에 cva `fill` variant 추가 — `gradient`(기본, 현재 동작) · `solid`(`bg-main`).
      높이는 기존대로 `className`으로 받는다. **기본값을 바꾸지 않아 기존 4곳이 무변경**
- [ ] `progress-bar.test.tsx`에 `fill="solid"` 케이스 추가 (variant 클래스 조합은 공개 계약 — `test-policy.md` §5 예외)
- [ ] `progress-bar.stories.tsx`에 solid 스토리 추가

### `[entities]` — `entities/learning`

- [ ] `model/chapter.ts` — `ChapterDetailResponse[]` → `Chapter[]`(`chapterId` · `title` ·
      `description` · `progressRate`) 순수 변환. 진행률은 `clampPercent`로 0~100 보정 (기준선 D3)
- [ ] `model/chapter.test.ts` — 빈 배열 / 음수·100 초과 보정 / 순서 보존(계약 K5)
- [ ] `api/use-chapters.ts` — `useGetAllChapter` 를 `select`로 감싼다 (`api-convention.md` §3).
      **queryKey는 `getGetAllChapterQueryKey` 팩토리 그대로**
- [ ] `ui/chapter-card.tsx` — cva `size: 'lg' | 'sm'`. 제목(`font-mbc`) · ⓘ · `ProgressBar` ·
      퍼센트 · 행성 · 딤 오버레이. 카드 전체가 `/learning/chapters/$chapterId` 링크, 이름 「{제목} 학습하기」(계약 K1)
- [ ] `ui/chapter-card.tsx`에 `ChapterCardSkeleton` 함께 (`UnitCardSkeleton` 형태를 따른다)
- [ ] `ui/chapter-card.stories.tsx` — lg · sm · 로딩
- [ ] `api/index.ts` · `index.ts` 배럴에 추가 (타입은 `export type`, `verbatimModuleSyntax`)

### `[widgets]`

- [ ] `widgets/page-title-bar` — 좁은 화면 상단 제목 바. `title` prop 하나. 높이 48px ·
      `bg-white` · 하단 `divider-1` 보더 · 제목 `text-label1 text-text-2` 중앙 정렬 (시안 P7·T12)
- [ ] `widgets/chapter-grid` — `useChapters()` 호출 + 로딩(스켈레톤 8장) / 빈 / 에러+재시도 /
      목록. `size` prop을 카드에 전달. 열 수와 gap은 `size`에 맞춰 준다
- [ ] `widgets/chapter-grid/ui/chapter-grid.test.tsx` — 아래 §6의 자동 테스트 4건

### `[pages]`

- [ ] `pages/learning/ui/learning-page-wide.tsx` — `HeroGreeting` → **68px 여백**(탭 행 자리, S2) →
      `ChapterGrid size="lg"` (`max-w-300` 중앙, 4열, `gap-6`). 배경 `bg-bg-2`
- [ ] `pages/learning/ui/learning-page-narrow.tsx` — `PageTitleBar title="학습"` →
      `ChapterGrid size="sm"` (2열, `gap-3`, `px-4`, `pt-5`). 배경 `bg-bg-1`
- [ ] `pages/learning/ui/learning-page.tsx` — `useIsWideViewport`로 분기 (`MainPage`와 동일 구조).
      **export 이름 `LearningPage` 유지**

### `[app]`

- [ ] `learning.index.tsx` — `staticData.headerVariant`를 `'solid'` → **`'overlay'`** (P1)
- [ ] `learning.chapters.$chapterId.index.tsx`와 `learning.units.$unitId.index.tsx` 자리 라우트 신설
      (`component: () => null`). 기존 `learning.$chapterId.$unitId.tsx`는 삭제한다
- [ ] **라우트 트리 재생성** — `pnpm --filter @repo/web dev` 또는 `build`로 `routeTree.gen.ts` 갱신.
      직접 편집하지 않는다

---

## 5. 리스크

| #   | 리스크                                                                       | 영향                                                         | 대응                                                                                                                                           |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | 공용 `ProgressBar` 변경이 기존 4개 화면에 번진다                             | 메인·미션·성장 현황 게이지가 조용히 바뀐다                   | `fill` 기본값을 현재 동작(`gradient`)으로 둔다. 기존 4곳은 prop을 안 넘기므로 무변경. 기존 테스트가 그대로 통과해야 한다                       |
| R2  | 라우트 트리 재생성을 빼먹는다                                                | 새 챕터·유닛 경로가 타입 라우트에 없어 링크가 타입 에러      | §4 마지막 단계로 명시. `check-types`가 잡는다                                                                                                  |
| R3  | 기존 이중 id 라우트나 참조를 남긴다                                          | 같은 화면에 두 URL 계약이 공존한다                           | `learning.$chapterId.$unitId.tsx`를 삭제하고 기존 참조를 `rg`로 전수 확인한다                                                                  |
| R4  | **legacy의 `mapToChapter` throw 동작을 옮기지 않는다** (기준선 C6)           | 응답 필드가 비면 legacy는 목록 전체 실패, 우리는 그대로 렌더 | **의도한 이탈이다.** `ChapterDetailResponse`가 세 필드를 non-null로 보장하고, 한 항목 때문에 목록 전체를 죽이는 게 더 나쁘다. `spec.md`에 기록 |
| R5  | ⓘ 설명 표시 — legacy는 커스텀 `Tooltip`을 쓰는데 `apps/web`에 Tooltip이 없다 | 기준선 D5(설명 표시)가 빠질 수 있다                          | **§7의 판단 필요 1.** 기본안은 `title` 속성 + `aria-label`로 설명을 노출하고 정식 Tooltip은 별도 작업                                          |
| R6  | 착수 시점 `pnpm test`가 1건 실패 (flaky)                                     | 검증 단계에서 새 실패와 구분이 안 된다                       | 기존 실패임을 여기 기록한다. `recommended-units.test.tsx` 첫 케이스, 재실행 2회 통과. §7의 `INFRA-` 항목으로 분리                              |
| R7  | 카드 그림자·딤이 토큰 없는 원시값이다                                        | shadow 토큰이 확정되면 찾아 고쳐야 한다                      | `Card`와 같은 방식으로 컴포넌트에 직접 적용하고 `TODO(design)` 주석을 남긴다 (`design-system/README.md` §3-3)                                  |

### 동일성을 무엇으로 확인하는가

`spec.md`의 「동일성 확인 방법」을 실행 계획으로 옮긴다.

| 방법        | 무엇을                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| 자동 테스트 | §6의 4건 (목록·빈·에러+재시도 요청 횟수·카드 href) + `chapter.ts` 순수 함수 3건                              |
| 라우트 진입 | `/learning`에서 카드 개수 = 응답 길이, 제목 순서 = 응답 순서 (계약 K5)                                       |
| 명시적 대조 | 같은 챕터에 대해 메인 「이어서 학습하기」 진행률과 학습 홈 카드 「{n}%」가 일치하는지 (계약 K2)              |
| 수동 스모크 | 카드 클릭 → 주소창이 `/learning/chapters/{chapterId}` · 좁은/넓은 화면 전환 · MSW 지연으로 스켈레톤 8장 확인 |

---

## 6. 작성할 자동 테스트

`test-policy.md` §1 기준 — 로직과 API 계약 흐름만. 시각 스타일은 테스트하지 않는다.

| 대상                    | 테스트                                                                    | 근거 항목    |
| ----------------------- | ------------------------------------------------------------------------- | ------------ |
| `chapter.ts`            | `[]`를 넘기면 `[]`를 반환한다                                             | C4           |
| `chapter.ts`            | 진행률이 `-10`·`150`이면 `0`·`100`으로 보정한다                           | D3           |
| `chapter.ts`            | 응답 순서를 그대로 유지한다                                               | 계약 K5      |
| `chapter-grid.test.tsx` | 챕터 2건을 주면 카드 2장이 뜨고 첫 카드 href가 `/learning/chapters/3`이다 | C3 · D6 · K1 |
| `chapter-grid.test.tsx` | 빈 배열이면 「챕터가 없습니다.」가 뜬다                                   | C4           |
| `chapter-grid.test.tsx` | 500이면 「챕터 목록을 불러오지 못했어요.」 + 「다시 시도」로 재요청한다   | C5 · 계약 K3 |
| `chapter-grid.test.tsx` | 조회 중에는 `aria-busy` 스켈레톤이 8장 뜬다                               | C2           |
| `progress-bar.test.tsx` | `fill="solid"`면 그라데이션 클래스가 붙지 않는다                          | R1           |

---

## 7. 판정 완료

1. **ⓘ 아이콘의 설명 표시 방식 (R5).** legacy는 커스텀 `Tooltip`으로 챕터 설명을 띄운다.
   `apps/web`에는 Tooltip이 없고, `component-convention.md` §3은 툴팁 같은 복합 위젯을
   직접 만들지 말고 검증된 headless primitive를 검토하라고 한다. 시안에는 툴팁 상태 프레임이 없다.
   - **판정 (2026-09-16): `title` 속성으로 노출한다.** ⓘ에 `aria-label`과 `title`을 붙여
     의존성 없이 기준선 D5의 관찰 가능한 동작(「올리면 설명이 보인다」)을 유지한다.
     스타일은 브라우저 기본이고 터치 기기에서는 뜨지 않는다 — 정식 Tooltip은 별도 작업으로 남긴다
   - 거부: Radix Tooltip 도입 (의존성 추가 · 시안에 툴팁 스타일 정의가 없어 모양을 임의로 정해야 한다)
   - 거부: ⓘ를 표시만 하기 (기준선 D5 후퇴 — 챕터 설명을 볼 방법이 사라진다)

### flaky 테스트 — 이번 작업에 포함한다

- **`recommended-units.test.tsx` 첫 케이스 콜드 스타트 flaky.** `findByRole` 기본 1000ms 타임아웃 대
  렌더 1776ms. 처음에는 `work-management.md` §7에 따라 별도 `INFRA-` 항목으로 분리하려 했으나
  **2026-09-16 사용자가 이번 작업에서 함께 고치기로 결정했다.**
  - 범위 밖 수정을 끼워 넣는 것이므로 **테스트 하네스 설정만 건드리고 제품 코드는 손대지 않는다.**
    그래야 검증에서 「무엇 때문에 깨졌는지」가 흐려지지 않는다
  - 같은 원인이 이번에 새로 만드는 `chapter-grid.test.tsx`에도 그대로 적용된다
    (MSW + Query 콜드 스타트). 공통 대응이 필요한 지점이다

---

## 8. 승인 후 절차

1. `work/to-do/MIG-027-학습-홈-이전` → `work/in-progress/`로 `git mv`
2. `ai-orchestrate`로 §4 체크리스트를 레이어 순서대로 구현
3. `ai-validate`로 검증 4종 + AC 대조 + 동작 동일성 확인, `checklist.md` 작성
4. `docs/implementation-status.md`(`L.1`) · `docs/migration-status.md` · `docs/routes.md`(LRN-01 확정) 갱신

---

## 9. 범위 추가 제안 — 행성 에셋 식별자

> 상태: 구현 완료. 행성 에셋이 25개로 늘어날 예정이므로 파일명만으로 고정 순서를 확인할 수 있게 한다.

### 변경

- `entities/learning/ui/assets/`의 기존 행성 8개를 `planet-{순서 2자리}-{행성명}.webp`로 변경한다.
  - `planet-01-mercury.webp`
  - `planet-02-venus.webp`
  - `planet-03-earth.webp`
  - `planet-04-mars.webp`
  - `planet-05-jupiter.webp`
  - `planet-06-saturn.webp`
  - `planet-07-uranus.webp`
  - `planet-08-neptune.webp`
- `entities/learning/ui/planet-images.ts`의 import 경로만 갱신한다.
- `PLANET_IMAGES`의 `chapterId → 이미지` 매핑과 화면 동작은 변경하지 않는다.

### 리스크와 검증

- 파일명 번호는 디자인에서 확정한 고정 순서를 뜻하며, 런타임 식별자는 계속 `chapterId`를 사용한다.
- 기존 파일명 참조가 남지 않았는지 `rg`로 확인한다.
- `check-types`와 변경 파일 Prettier 검사로 import 누락과 형식을 확인한다.
