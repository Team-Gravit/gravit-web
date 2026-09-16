---
id: 'MIG-030'
validated: '2026-09-16'
mode: 'migrate'
---

# MIG-030 검증 결과

기준 `develop` 631bcbb · 브랜치 `feat/mig-030/unit-detail`

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                       |
| --- | --------------- | -------------------------------------------------- | -------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ eslint · steiger 무문제 |
| 2   | 타입            | `pnpm check-types`                                 | ✅                         |
| 3   | 테스트          | `pnpm --filter @repo/web exec vitest run`          | ✅ 48파일 / 231건          |
| 4   | 빌드            | `pnpm build`                                       | ✅                         |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일 19개>` | ✅                         |
| 6   | generated 경계  | `pages`/`widgets`의 생성 경로 직접 참조            | ✅ 0건                     |

**전체 `pnpm format:check`는 돌리지 않았다.** 커밋된 파일 때문에 이미 실패 중이고(`REF-003`),
이번 변경과 무관하다. 변경 파일만 명시적으로 넘겨 검사했다.

### 검사 중 잡힌 것 — 스켈레톤의 빈 `h1`

좁은 화면 테스트가 `findByRole('heading', { level: 1 })`로 **스켈레톤의 빈 `h1`을 먼저 잡아**
실패했다. 원인은 자리표시 단계에서 `PageTitleBar`에 빈 제목을 넘긴 것이었다.

챕터명을 모르는 동안 이름 없는 heading을 두는 것은 자리표시로서도 값이 없으므로, 스켈레톤은
상단 바 자리만 비워 두고 제목은 데이터가 도착한 뒤 그린다. **테스트가 구현의 접근성 결함을
찾아낸 사례다.**

## 2. 요구사항 ↔ 구현 대조

| #     | 요구사항 (spec.md의 AC)               | 구현 위치                                                                  | 상태 |
| ----- | ------------------------------------- | -------------------------------------------------------------------------- | ---- |
| AC-1  | 레슨 행 → `/learning/lessons/{id}`    | `unit-detail-page.test.tsx` 「레슨 행을 누르면 … (K2)」                    | ✅   |
| AC-2  | 목적지 3종 카드 경로                  | 〃 「목적지 3종 카드가 이 유닛의 경로를 가리킨다」                         | ✅   |
| AC-3  | 챕터 항목 → `/learning/chapters/{id}` | 〃 「경로 표시의 챕터 항목이 … (K5)」                                      | ✅   |
| AC-4  | 칩 문구 `학습 전` / `학습 완료`       | 〃 「isSolved 에 따라 칩 문구가 … (K4)」 · `LessonItem`의 `STATUS_CHIP`    | ✅   |
| AC-5  | 레슨 0건 빈 목록                      | `lesson.test.ts` 「레슨이 없으면 …」 + `unit-detail-page.test.tsx`         | ✅   |
| AC-6  | 좁은 화면 `h1` 1개 · 경로 표시 없음   | 〃 「좁은 화면에서는 경로 표시가 없고 …」 · `PageHeading`의 `headingLevel` | ✅   |
| AC-7  | 조회 실패 시 빈 화면                  | 〃 「조회에 실패하면 화면을 그리지 않는다」                                | ✅   |
| AC-8  | `unitLabel` = 유닛명                  | `lesson.test.ts` 「서버가 순번을 주지 않으므로 …」 · `toUnitLabel`         | ✅   |
| AC-9  | 풀이 3종에 셸 없음 (K1)               | `app/routes/_authenticated/_focus/` — 셸 밖 레이아웃 그룹. **수동 확인**   | ✅   |
| AC-10 | 칩·아이콘·배경 시각 확인              | 1920×1080 · 360×740 스크린샷으로 확인. **수동**                            | ✅   |

AC-9는 라우트 트리(`routeTree.gen.ts`)에서 세 라우트가 `_focus` 아래에 붙은 것으로 확인했다.
구조가 강제하므로 화면별로 빠뜨릴 수 없다.

## 3. 이전 검증

| 항목                                        | 결과                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `plan.md`의 이전 매핑이 **전량** 반영되었나 | ✅ 7행 전부 (아래 표)                                                                     |
| 동작 동일성 — 기준선이 그대로 유지되나      | ✅ A1~A11 · B1~B3 · C1~C4 (아래)                                                          |
| 의도적으로 바꾼 것만 바뀌었나               | ✅ 시안 판정 「고침」 항목 + 아래 3건                                                     |
| 이전 후 남은 legacy 참조가 없나             | ✅ `format-unit-index` · `summary-header` · `bread-crumb` · legacy 레이아웃 이름 검색 0건 |

### 이전 매핑 대조

| legacy                                        | 목표                                        | 결과                                |
| --------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| `learning/$chapterId/$unitId/index.tsx`       | `pages/unit-detail/ui/unit-detail-page.tsx` | ✅                                  |
| `entities/learning/ui/lesson/lesson-item.tsx` | `entities/learning/ui/lesson-item.tsx`      | ✅ 링크를 제거하고 표시 전용으로    |
| `entities/learning/ui/summary-header.tsx`     | `shared/ui/page-heading`                    | ✅ 대체 (MIG-028 산출물)            |
| `shared/ui/bread-crumb/`                      | `shared/ui/breadcrumb`                      | ✅ 대체                             |
| `shared/ui/chip/chip.tsx`                     | `shared/ui/chip`                            | ✅ 대체 — variant 3종이 이미 있었다 |
| `shared/lib/format-unit-index.ts`             | 보류 (`toUnitLabel`이 자리를 잡는다)        | ✅ 확인 필요 1로 남김               |
| `$unitId/index.tsx`의 `UnitActionCard`        | `pages/unit-detail/ui/` 비-export           | ✅ `ShortcutCard`                   |

### 기준선 대조

| 기준선                                  | 결과                                                       |
| --------------------------------------- | ---------------------------------------------------------- |
| A1 경로 표시 3단 · 넓은 화면 전용       | ✅ AC-3 · AC-6                                             |
| A2·A3 제목 `Unit{NN}`                   | ⚠️ **의도적 변경** — 유닛명 사용 (확인 필요 1의 잠정 결정) |
| A4 제목 아래 설명                       | ✅                                                         |
| A5·A6 카드 3종과 문구                   | ✅ AC-2 · 문구 6종 그대로                                  |
| A7 카드 항상 활성                       | ✅ 분기를 넣지 않았다 (확인 필요 3 미판정)                 |
| A8·A9 레슨 행 구성과 칩                 | ✅ AC-4                                                    |
| A10 레슨 0건 안내 없음                  | ✅ AC-5                                                    |
| A11 좁은 화면 상단 바에 챕터명          | ✅ AC-6                                                    |
| B1 `GET /api/v1/lessons/{unitId}`       | ✅ `useUnitLessons`                                        |
| B2 `GET /api/v1/units/{chapterId}` 추가 | ⚠️ **의도적 변경** — 부르지 않는다 (아래)                  |
| B3 실패 시 빈 화면                      | ✅ AC-7                                                    |
| C1~C4 목적지 경로                       | ⚠️ **의도적 변경** — 단일 ID 로 재작성 (아래)              |

### 의도적으로 바꾼 것

| 항목                                      | 이유                                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 경로에서 `chapterId` 제거                 | `develop`이 `유닛 학습 경로를 단일 ID로 통일`로 이미 바꿨다. `lessons/{unitId}` 응답이 `chapterSummary`를 함께 주어 챕터명·복귀 링크를 유닛 하나로 만든다 |
| `GET /api/v1/units/{chapterId}` 호출 제거 | legacy는 유닛 순번과 챕터명 때문에 불렀다. 챕터명은 레슨 응답에 있고 순번은 보류 상태라 부를 이유가 없다. **요청이 2건에서 1건으로 줄었다**               |
| 제목에 유닛명 사용                        | 시안은 `Unit01`이지만 순번 데이터가 없다. `unitId`를 순번 자리에 쓰면 틀린 숫자가 표시되므로 확실한 값을 쓴다 (`toUnitLabel`에 교체 조건 기록)            |

## 4. 시안 대조 재확인

| #      | 「고침」 판정 항목                          | 반영됨                                                            |
| ------ | ------------------------------------------- | ----------------------------------------------------------------- |
| D2     | `학습 전` 칩 — 흰 바탕 · `divider-2` 테두리 | ✅ `Chip variant="muted"`                                         |
| D4     | `학습 완료` 칩 — **외곽선형**               | ✅ `Chip variant="outlined"` (legacy의 채움형과 반대)             |
| D5     | 칩 pill 형태                                | ✅ 기존 `Chip`이 `rounded-full`                                   |
| D20    | 개념노트 아이콘 48px                        | ✅ `md:size-12`                                                   |
| D21    | 카드 설명 `text-4`                          | ✅                                                                |
| D22    | 문제 리스트 카드 padding 32 · gap 16        | ✅ `md:p-8` · `gap-4`                                             |
| D23    | `문제 리스트` 라벨 16px Regular `text-4`    | ✅                                                                |
| D24    | 레슨 행 높이 74px                           | ✅ `md:h-18.5`                                                    |
| D25    | chevron 20px                                | ✅ `size={20}`                                                    |
| S4     | 로딩 스켈레톤                               | ✅ `UnitDetailSkeleton` · `LessonItemSkeleton`                    |
| (추가) | 배경 별·행성 레이어                         | ✅ `SpaceBackground variant="starfield"` — **대조에서 빠졌던 축** |

### 대조에서 빠졌던 축 — 배경

`design-diff` 6축에 **배경이 없어서** 대조 목록에 오르지 않았다. 화면을 직접 띄워 보고서야
시안의 별·행성 레이어가 구현에 없다는 것을 발견했다.

학습 홈(`MIG-027`)도 같은 상태였으므로 이 화면만의 누락이 아니다. 공용 배경으로 만들어
공용 배경(`SpaceBackground` 의 `starfield` variant)으로 만들어 `MIG-029` 도 쓸 수 있게 했다.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                          | 상태 |
| ------------------------------- | ------------------------------------------------------------------ | ---- |
| `docs/implementation-status.md` | `LRN-03` ↔ `L.*` 매핑 미확정이라 화면 행을 연결하지 못했다        | ⚠️   |
| `docs/migration-status.md`      | 유닛 상세 이전 상태                                                | ⬜   |
| `docs/design-system/README.md`  | `SpaceBackground` `starfield` variant · `--color-3` 분류 정정 필요 | ⬜   |

**화면 ID를 추측해 연결하지 않는다.** Figma 프레임 이름은 `LRN-03`인데 대장은 `L.1`~`L.10`이고,
`docs/design-system/README.md` §2의 페이지 노드도 현재 파일과 다르다.
`INFRA-031-학습-화면-명세-승격`에서 함께 정리한다.

## 6. 중간에 막혔던 지점 — 스킬에 반영할 것

### ① 낡은 워크트리로 계획 전체를 버렸다

`develop`이 `origin/develop`보다 **44커밋 뒤처진** 상태에서 기준선·시안 대조·ADR 4건을 모두
작성했다. 그 사이 `entities/learning`·`_app-shell`·`Breadcrumb`·`PageHeading`·`Chip`이 이미
들어와 있었고, 작업 ID(`MIG-026`)와 URL 계약(`chapterId` 유지)도 전부 틀렸다.

**→ `ai-plan` §0 또는 `refactor-baseline` §0에 원격 대조 단계를 넣어야 한다.**

```bash
git fetch origin && git rev-list --left-right --count HEAD...origin/develop
```

조사 대상이 `apps/web`의 현재 상태인 작업(`MIG-`·`REF-`)은 **낡은 트리에서 조사하면 산출물이
통째로 무효가 된다.** 파일 하나 읽기 전에 확인해야 한다.

### ② 같은 파일을 다른 워크트리가 동시에 고치고 있었다

`MIG-029`가 `gravit-web-v2`에서 `page-heading.tsx`·`entities/learning` 배럴을 커밋 없이
수정 중이었다. 배럴은 줄 추가만 하고 기존 줄을 건드리지 않아 충돌을 피했지만,
`page-heading.tsx`는 양쪽이 같은 관심사(`h1` 중복)를 건드렸다.

**→ `ai-plan` §3 영향 분석에 `git worktree list` + 각 워크트리의 `git status` 확인을 넣는다.**
여러 워크트리를 쓰는 저장소에서는 "내 트리에 없는 변경"이 실제 위험이다.

### ③ 시안 대조 6축에 배경이 없다

`design-diff` §3의 6축(토큰·공용 컴포넌트·구조·상태·문구·수치)으로는 **배경 레이어를 못 잡는다.**
구조 축이 "요소 존재"를 보지만 배경 프레임은 요소로 세지 않았다.

**→ ③ 구조 축에 "배경·장식 레이어"를 명시하거나, 화면을 실제로 띄워 보는 단계를 추가한다.**
이번엔 `run` 스킬로 띄워 보고서야 발견했다.

### ④ dev 서버 포트를 확인하지 않아 잘못된 화면을 봤다

옆 워크트리가 5173을 쓰고 있어 내 서버는 5174로 떴는데, 5173에 붙어 MSW가 꺼진 화면을 보고
"목이 안 붙는다"고 오판했다. 서비스워커 등록 수(`getRegistrations().length`)를 보고서야 알았다.

**→ dev 서버를 띄우면 출력에서 실제 포트를 확인하고, MSW가 필요한 검증은
`navigator.serviceWorker.getRegistrations()`로 먼저 확인한다.**

### ⑤ Playwright 없이 스크린샷을 찍었다

Playwright·cwebp·sharp가 모두 없었으나 Node 24의 전역 `WebSocket`으로 Chrome DevTools
Protocol에 직접 붙어 ① 두 폭 스크린샷 ② PNG→WebP 변환(953KB → 268KB)을 처리했다.
설치가 필요 없고 스크립트가 60줄이다.

**→ `run` 스킬의 browser-driven 패턴에 "Playwright가 없을 때 CDP 직접 연결" 항목을 넣을 만하다.**
