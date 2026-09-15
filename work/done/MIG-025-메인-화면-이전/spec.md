---
id: 'MIG-025'
title: '메인 화면 이전'
type: 'migrate'
screen: 'MAIN-01'
priority: 'high'
created: '2026-09-11'
revised: '2026-09-11'
---

# MIG-025 — 메인 화면 이전

## 배경 · 목표

`apps/web`의 `/main`은 **빈 화면**이다.

```tsx
// app/routes/_protected.main.tsx
component: () => null,
```

그런데 도달 경로는 전부 살아 있다. `/`는 세션이 있으면 `/main`으로 redirect하고, OAuth 콜백은
`isOnboarded`면 `/main`으로 보내며, 온보딩 완료 화면의 「홈으로」도 `/main`이다.
**즉 지금 기존 사용자는 로그인하자마자 흰 화면을 본다.**

legacy `/main`의 관찰 가능한 동작을 기준선으로 `apps/web`에 FSD 구조로 옮기고, Figma `MAIN-01`과
대조해 어긋난 부분을 맞춘다.

## 범위

| 대상                   | 내용                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| 히어로 · 인사말        | 배경 + 「어서오세요, {닉네임}님!」 + 부제                             |
| 성장 현황 (WEB)        | 레벨 · XP 게이지 / 리그 티어 · LP 게이지                              |
| 이어서 학습하기        | 최근 챕터 제목 · 진행률 · 유닛 목록 · CTA                             |
| 새 주제 시작하기 (WEB) | 추천 유닛 카드 그리드                                                 |
| 최근 학습 (MOB)        | 최근 챕터의 첫 유닛 카드 1장                                          |
| 연속 학습일            | N일 연속 + 요일 뱃지 7개                                              |
| 오늘의 미션            | 미션 설명 · 보상 XP · 진행률 · CTA                                    |
| 상단 헤더              | WEB: 로고 · 네비 · 프로필 · 로그아웃. MOB: 시안에만 있음 (§시안 대조) |
| 하단 탭바 (MOB)        | 홈 · 학습 · 리그 · 마이그래빗                                         |
| 라우트                 | `_protected.main.tsx`를 페이지에 연결                                 |

넓은 화면(WEB 시안)과 좁은 화면(MOB 시안) 양쪽을 구현한다. `MIG-018` · `MIG-024`와 같은 구조다.
헤더와 탭바는 인증 화면 전체가 공유하는 공용 위젯이지만 **이번 작업에 포함**한다(2026-09-11 사용자 결정).

## Out of Scope

- **인증·온보딩 게이트** — `MIG-005`. `_protected`의 `beforeLoad`는 그쪽 범위
- **`/mains`** — legacy의 구버전 메인. 어디서도 링크되지 않아(B7) 기준선으로 삼지 않고 폐기 대상으로
  기록한다(2026-09-11 사용자 결정)
- **이동 목적지 화면들** — `/learning`, `/learning/$chapterId/$unitId`, `/league`, `/my`,
  `/my/friends/search`(legacy `/user/addfriend`, `docs/routes.md`). 링크만 만들고 화면은 각자의 `MIG-`에서 만든다.
  여기 적힌 내부 URL은 현재 메인 화면에서 타입 안전하게 이동하기 위한 임시안이다.
  `/learning/$chapterId/$unitId`의 평탄화 여부를 포함한 URL 구조는 학습 화면을 구현하는 `MIG-`에서
  사용 흐름과 정보 구조를 평가한 뒤 확정한다
- **알림(벨) 기능** — 시안에만 있고 legacy에 없다. 알림 화면(`NOTI-01`)과 함께 `FEAT-`로 다룬다
- **AI면접 네비 항목** — 시안에만 있고 legacy 라우트가 없다

## 용어 정의

| 용어                  | 정의                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| 최근 챕터             | `GET /api/v1/main-pages/learning`의 `recentSolvedChapter*`. 마지막으로 푼 챕터 |
| 다음 유닛             | 최근 챕터의 유닛 중 완료되지 않은 첫 유닛. 「이어서 학습하기」 CTA의 목적지    |
| 추천 유닛             | `GET /api/v1/main-pages/units`가 주는 유닛. 「새 주제 시작하기」 카드          |
| 티어                  | `leagueId` 1~15에 대응하는 리그 등급 (브론즈 3 → … → 다이아몬드 1)             |
| 넓은 화면 / 좁은 화면 | `MIG-018`과 같은 `min-width: 768px` 기준 (`useIsWideViewport`)                 |

---

## 기술 결정 (ADR)

> `refactor-planner` 2026-09-11. 비교 기준: FSD 적합성 · import 영향 · 동작 보존성 · 테스트 용이성 · 점진 이전성.

### ADR-1. 메인 섹션의 소유 레이어 — 섹션마다 widget 하나

**Context** — 메인은 서로 독립적으로 조회·실패·재시도하는 섹션 6개(C2)의 조립이다. legacy는
`widgets/main-page/` 한 폴더에 섹션·카드·스켈레톤을 전부 넣었다.

**Decision** — **섹션 하나 = widget slice 하나.** 이름은 `main-`을 붙이지 않고 내용으로 짓는다
(`fsd-widgets` §2). 각 widget이 자기 데이터를 조회하고(§6) 로딩·에러·재시도를 스스로 처리한다.
페이지는 배치와 넓은/좁은 분기만 한다.

| 시안 섹션                   | widget                      | 조회                                              |
| --------------------------- | --------------------------- | ------------------------------------------------- |
| 히어로 인사말               | `widgets/hero-greeting`     | `useUserProfile`                                  |
| 성장 현황                   | `widgets/growth-summary`    | `useUserProfile` + `useLeagueSummary`             |
| 이어서 학습하기 · 최근 학습 | `widgets/continue-learning` | `useRecentLearning` (두 UI가 캐시 공유)           |
| 새 주제 시작하기            | `widgets/recommended-units` | `useRecommendedUnits`                             |
| 연속 학습일                 | `widgets/learning-streak`   | `useWeeklyRecord`                                 |
| 오늘의 미션                 | `widgets/daily-mission`     | `useDailyMission`                                 |
| 상단 헤더 (넓은/좁은)       | `widgets/header`            | `useUser` / `useUserProfile` + `useLeagueSummary` |
| 하단 탭바                   | `widgets/bottom-tab-bar`    | —                                                 |

**Alternatives**

| 안                                | 거부 이유                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| A. `pages/main/ui/`에 섹션 전부   | 섹션이 entities 여러 개를 조합하고 스스로 조회한다 — widget 정의 그 자체. 페이지가 700줄이 된다                                 |
| C. `widgets/main` 하나에 섹션 6개 | 한 슬라이스에 독립 책임 6개. 이슈를 섹션 단위로 쪼갤 수 없고, 다른 화면(마이페이지)이 연속 학습일을 재사용할 때 통째로 끌려온다 |

**Consequences** — widget 8개가 생긴다. 슬라이스 수가 늘어 배럴·폴더가 많아지지만 이슈를
섹션 단위로 쪼갤 수 있고(점진 이전성) 각 widget이 테스트 단위가 된다. 단점: 섹션 간 공통
셸(카드 헤더·에러·스켈레톤)을 widget끼리 공유할 수 없으므로 **`shared/ui`로 내려야 한다** (ADR-3).

### ADR-2. 프로필 조회 통일 — `/users`(정체) + `/main-pages/profile`(레벨) 2원화

**Context** — legacy는 헤더 `/users/my-page`, 인사말·성장현황 `/main-pages/profile` 두 엔드포인트를
쓴다(발견 6). `apps/web`에는 `useUser`(`/users`)가 이미 있고, `MIG-005` 게이트가 `isOnboarded` 판정에
`/users`를 쓴다. `/users`에는 `level`이 없고, `/main-pages/profile`에는 `isOnboarded`가 없다.

**Decision** — **헤더(넓은 화면)는 `useUser`**, **인사말·성장현황·좁은 화면 헤더(LV)는
`useUserProfile`**(`/main-pages/profile` adapter, `entities/user/api`). 메인 진입 시 요청 2종.
`/users`는 게이트가 이미 캐시하므로 실질 추가 요청은 `/main-pages/profile` 하나다.

**Alternatives**

| 안                                       | 거부 이유                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| A. 전부 `/main-pages/profile`            | 헤더는 모든 인증 화면에 있다. 화면마다 `main-pages` 엔드포인트를 부르게 되고, 게이트의 `/users`와 중복된다 |
| C. 전부 `/users`                         | `level` · `maxXp`가 없다. 성장 현황·좁은 헤더를 그릴 수 없다                                               |
| D. legacy 그대로 (`/users/my-page` 추가) | 세 번째 프로필 엔드포인트. 마이페이지 전용 응답(팔로워 수 등)을 헤더가 끌어온다                            |

**Consequences** — 닉네임·아바타가 두 캐시에 존재한다. 프로필 수정 후에는 **둘 다 무효화**해야 한다
(`api-convention` §4 ③ `invalidateResource('/api/v1/users')` + `getGetProfileQueryKey()`). 이 규칙을
`entities/user/api` 배럴 주석에 남긴다.

### ADR-3. 섹션 공통 UI(카드 셸 · 상태 · 스켈레톤 · 게이지 · 칩)는 `shared/ui`

**Context** — 카드 흰 배경·제목·우측 링크, 「불러오지 못했어요 / 다시 시도」, 스켈레톤, 게이지, 칩은
widget 6개가 전부 쓴다. widget 간 cross-slice가 금지라 공통은 아래로 내려야 한다.

**Decision** — 도메인 단어가 없는 것만 `shared/ui`에 둔다: `card`(Card · CardHeader · CardTitle ·
CardLink · CardStatus) · `chip` · `progress-bar`(ProgressBar · LabeledProgressBar) · `skeleton`.
도메인이 들어가는 표시 컴포넌트(유닛 행 · 요일 뱃지 · 티어 아이콘 · 추천 유닛 카드 · 미션 카드)는
각 `entities/{slice}/ui`에 둔다.

**Alternatives**

| 안                                  | 거부 이유                                   |
| ----------------------------------- | ------------------------------------------- |
| A. `widgets/main-shell` 공통 widget | widget이 widget을 import — cross-slice 금지 |
| B. 각 widget에 복제                 | 6벌. 시안 수정 시 한 벌만 고쳐진다          |

**Consequences** — `shared/ui`에 컴포넌트 4종이 새로 생기고 **전부 시안 대조가 필요한 디자인 작업**이다.
로직 작업(이 작업의 1차)과 분리해 Codex가 맡는다. 로직 단계에서는 최소 마크업으로 자리를 만들고
`data-slot` · aria 계약만 고정한다.

### ADR-4. 「학습 기록 없음」(404)은 에러가 아니라 빈 상태 — adapter가 `null`로 바꾼다

**Context** — 명세상 `/main-pages/learning` · `/weekly-record`는 기록이 없으면 404다. TanStack Query
기본값은 404도 에러로 보고 3회 재시도한다. UI가 status code를 뜯어보면 widget마다 같은 분기가 복제된다.

**Decision** — `entities/learning/api`의 `useRecentLearning` · `useWeeklyRecord`가 **queryFn에서 404를
잡아 `null`을 반환**한다. queryKey는 생성 팩토리를 그대로 쓴다. UI는 `data === null`이면 빈 상태,
`isError`면 재시도 UI다. 그 외 상태 코드는 그대로 던진다.

**Alternatives**

| 안                                       | 거부 이유                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| A. widget에서 `isAxiosError && 404` 분기 | 세 widget에 복제. 재시도 3회도 그대로 나간다                                           |
| B. `retry: false` + 에러 UI 통일         | 신규 가입자가 메인에서 「불러오지 못했어요」를 본다 — 빈 상태가 아니라 고장으로 읽힌다 |

**Consequences** — 생성 훅 `useGetLearning` 대신 `useQuery({ ...getGetLearningQueryOptions(), queryFn })`
형태가 되어 옵션 빌더에 결합한다. Orval 옵션 빌더 시그니처가 바뀌면 이 두 파일이 먼저 깨진다.
`null`과 `undefined`(로딩)를 구분해야 하므로 UI 분기 순서는 `isPending → isError → data === null → 성공`으로 고정한다.

### ADR-5. 헤더·탭바는 라우트 레이아웃이 아니라 페이지가 배치한다

**Context** — legacy는 헤더를 `_overlay-header-layout` 라우트에, 탭바를 페이지에 뒀다. `apps/web`에는
아직 인증 화면이 메인 하나뿐이고 헤더 variant(overlay/solid)는 화면마다 다르다.

**Decision** — `pages/main`이 `HeaderWide` / `HeaderNarrow` / `BottomTabBar`를 직접 배치한다. 라우트
레이아웃은 만들지 않는다. 인증 화면이 둘 이상 생기면 그때 `_protected` 하위 레이아웃 라우트로 올린다.

**Alternatives**

| 안                                            | 거부 이유                                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| A. `_protected._with-nav.tsx` 레이아웃 라우트 | 화면 하나를 위해 pathless 라우트 계층을 만든다. variant 전달 수단이 없다                  |
| B. 헤더가 `hidden md:block`으로 자체 분기     | 좁은 화면 헤더와 넓은 화면 헤더는 내용이 다르다. CSS 숨김이면 둘 다 마운트돼 요청이 두 배 |

**Consequences** — 다음 인증 화면(`MIG-` 학습 홈)에서 헤더 배치 코드가 한 번 중복된다. 그 시점에 레이아웃으로
승격한다. 로그아웃 목적지 `/`는 헤더 widget이 `navigate`로 정한다 — 위젯의 라우팅 결정이지만 전역 계약
C7이고 화면과 무관하므로 예외로 둔다.

### ADR-6. 유닛 번호 · 다음 유닛 · 요일 상태 · 미션 목적지는 순수 함수 (`model/`)

**Context** — 확인 필요 A·B·D는 구현 후 네트워크 응답을 보고 바꿀 수 있어야 한다. legacy는 이 계산이
JSX 안에 흩어져 있었다.

**Decision** — `entities/learning/model`: `toUnitProgress(response, index)` · `findNextUnit(units)` ·
`getWeekdayStatuses(record, today)` · `toChapterProgressPercent(rate)`. `entities/mission/model`:
`getMissionRoute(type)` · `toMissionProgressPercent(rate)`. 컴포넌트는 결과만 그린다. AC-11·18·20이
이 함수들의 테스트다.

**Consequences** — 응답 단위가 확정되면 함수 하나와 테스트 하나만 바뀐다. 단점: 함수가 작아 "과한 추출"로
보일 수 있다 — 확정 전 임시 가정을 한곳에 모으는 것이 목적이다.

---

## 이전 매핑 (Migration Map)

> 경로는 `apps/legacy-web/src/` → `apps/web/src/`. import 영향은 `grep -rl`로 legacy에서 실측한 수
> (stories 제외). `apps/web`에는 아직 사용처가 없다. **디자인**은 시안 대조가 필요한 시각 작업(Codex),
> **로직**은 이 작업의 1차 범위.

### shared

| 현재 경로                                                            | 목표 경로                                                             | 변경 종류                 | 영향 | 보존 AC  | 담당   |
| -------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------- | ---: | -------- | ------ |
| `shared/ui/card/card.tsx`                                            | `shared/ui/card/card.tsx`                                             | 재작성 (cva)              |   11 | AC-24    | 디자인 |
| `widgets/main-page/ui/section-status.tsx` · `main-section-error.tsx` | `shared/ui/card/card-status.tsx`                                      | 병합                      |    1 | AC-10·23 | 디자인 |
| `shared/ui/chip/chip.tsx`                                            | `shared/ui/chip/chip.tsx`                                             | 재작성 (cva)              |    3 | AC-12    | 디자인 |
| `shared/ui/progress-bar/{progress-bar,labeled-progress-bar}.tsx`     | `shared/ui/progress-bar/`                                             | 재작성 + aria             |  6+2 | AC-9     | 디자인 |
| `shared/ui/skeleton/skeleton.tsx`                                    | `shared/ui/skeleton/skeleton.tsx`                                     | 재작성                    |    8 | AC-24    | 디자인 |
| `shared/assets/_icons/button/{home,level}-fill-icon.svg`             | `shared/ui/icon/assets/{home-fill,level-fill}.svg` + `generate:icons` | 반입                      |    1 | AC-4     | 디자인 |
| `shared/ui/hero/hero-section.tsx` + 배경 2종                         | `widgets/hero-greeting/ui/`                                           | 이동 (메인 전용으로 축소) |    3 | AC-7     | 디자인 |

### entities

| 현재 경로                                                                                                     | 목표 경로                                                                        | 변경 종류                          |  영향 | 보존 AC  | 담당                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------- | ----: | -------- | ------------------- |
| `mainpage-api` `useGetProfile` (생성)                                                                         | `entities/user/api/use-user-profile.ts`                                          | adapter (select)                   |     7 | AC-7·9   | 로직                |
| `entities/sidebar/api/useUserInfo.ts`                                                                         | — (`entities/user` `useUser` 재사용, ADR-2)                                      | 폐기                               |     3 | AC-5     | 로직                |
| `shared/lib/tiers.ts` + 티어 SVG 15종                                                                         | `entities/league/model/tiers.ts` + `ui/assets/`                                  | 이동                               |     4 | AC-9     | 로직 + 디자인(에셋) |
| `entities/league/ui/{tier,tier-badge}.tsx`                                                                    | `entities/league/ui/tier-badge.tsx`                                              | 재작성 (`leagueName` 표시)         |     2 | AC-9     | 디자인              |
| `mainpage-api` `useGetLeague`                                                                                 | `entities/league/api/use-league-summary.ts`                                      | re-export                          |     — | AC-9·10  | 로직                |
| `entities/learning/model/schema.ts` (zod)                                                                     | `entities/learning/model/{unit-progress,weekly-streak,chapter-progress}.ts`      | 재작성 (zod 제거, `status` enum)   |     5 | AC-11·18 | 로직                |
| `mainpage-api` `useGetLearning` · `useGetWeeklyRecord` · `useGetUnits`                                        | `entities/learning/api/use-{recent-learning,weekly-record,recommended-units}.ts` | adapter (404→null, ADR-4)          |     — | AC-15·19 | 로직                |
| `entities/unit/{unit-list,unit-item,unit-status-chip}.tsx`                                                    | `entities/learning/ui/{unit-progress-list,unit-progress-item}.tsx`               | 재작성 (3상태 칩)                  |     1 | AC-12    | 디자인              |
| `shared/ui/weekly-streak/` + `shared/ui/badge/day-badge.tsx`                                                  | `entities/learning/ui/{weekly-streak,weekday-badge}.tsx`                         | 이동 (계산은 model로)              |     1 | AC-18·19 | 디자인              |
| `features/learning/ui/unit-card.tsx` + `shared/ui/card/bg-card.tsx` + 행성 8종 + `card-bg.webp`               | `entities/learning/ui/unit-card.tsx` + `ui/assets/`                              | 이동 (`lessonNum` deprecated 제거) | 2+2+3 | AC-16·17 | 디자인              |
| `entities/mission/model/schema.ts` · `lib/get-mission-url.ts` · `shared/config/constants` `MISSION_LABEL_MAP` | `entities/mission/model/{mission,mission-route}.ts`                              | 재작성 (zod 제거)                  |     2 | AC-20·21 | 로직                |
| `mainpage-api` `useGetMission`                                                                                | `entities/mission/api/use-daily-mission.ts`                                      | re-export                          |     — | AC-21    | 로직                |
| `entities/mission/mission-card.tsx`                                                                           | `entities/mission/ui/mission-card.tsx`                                           | 재작성 (완료 시 CTA 비활성)        |     1 | AC-21·22 | 디자인              |

### features

| 현재 경로                                                             | 목표 경로                                   | 변경 종류                 | 영향 | 보존 AC | 담당 |
| --------------------------------------------------------------------- | ------------------------------------------- | ------------------------- | ---: | ------- | ---- |
| `widgets/header/ui/header-content.tsx` `HeaderUserMenu` 로그아웃 버튼 | `features/auth-logout/ui/logout-button.tsx` | 추출 (`useLogout` 재사용) |    6 | AC-6    | 로직 |

### widgets

| 현재 경로                                                                                                    | 목표 경로                                                                    | 변경 종류                   | 영향 | 보존 AC    | 담당          |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------- | ---: | ---------- | ------------- |
| `widgets/header/` (`header.tsx` · `header-content.tsx` · `config/nav.ts`)                                    | `widgets/header/ui/{header-wide,header-narrow}.tsx` · `model/nav-items.ts`   | 재작성 (좁은 헤더 신규)     |    6 | AC-2·3·4·5 | 로직 + 디자인 |
| `widgets/bottom-tab-bar/bottom-tab-bar.tsx`                                                                  | `widgets/bottom-tab-bar/ui/bottom-tab-bar.tsx`                               | 이동 (아이콘을 `Icon`으로)  |    3 | AC-3·4     | 로직 + 디자인 |
| `widgets/main-page/main-greeting.tsx`                                                                        | `widgets/hero-greeting/ui/hero-greeting.tsx`                                 | 이동                        |    1 | AC-7·8     | 로직          |
| `widgets/main-page/{growth-section,user-progress-bar}.tsx` + `shared/ui/progress-card/`                      | `widgets/growth-summary/ui/growth-summary.tsx`                               | 병합                        |  1+1 | AC-9·10    | 로직 + 디자인 |
| `widgets/main-page/{continue-learning-section,unit-list-card,unit-list-scroll-area,recent-unit-section}.tsx` | `widgets/continue-learning/ui/{continue-learning-card,recent-unit-card}.tsx` | 병합                        |    1 | AC-12~16   | 로직 + 디자인 |
| `widgets/main-page/{recommended-units-section,recommended-units-list}.tsx`                                   | `widgets/recommended-units/ui/recommended-units.tsx`                         | 병합                        |    1 | AC-17      | 로직          |
| `widgets/main-page/streak-section.tsx` + `entities/learning/ui/learning-streak-body.tsx`                     | `widgets/learning-streak/ui/learning-streak.tsx`                             | 병합 (`learning` 조회 제거) |    1 | AC-19      | 로직          |
| `widgets/main-page/mission-section.tsx`                                                                      | `widgets/daily-mission/ui/daily-mission.tsx`                                 | 이동                        |    1 | AC-21~23   | 로직          |
| `widgets/main-page/model.ts` (뷰모델 변환)                                                                   | 각 entity `model/` 또는 adapter `select`                                     | 분산                        |    5 | —          | 로직          |
| `widgets/main-page/ui/section-card.tsx`                                                                      | — (`shared/ui/card` 조합으로 대체)                                           | 폐기                        |    0 | —          | —             |

### pages · app

| 현재 경로                                                                                                      | 목표 경로                                                       | 변경 종류     | 영향 | 보존 AC  | 담당 |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------- | ---: | -------- | ---- |
| `pages/_authenticated/_overlay-header-layout/main/{main,_components/main-desktop,_components/main-mobile}.tsx` | `pages/main/ui/{main-page,main-page-wide,main-page-narrow}.tsx` | 이동          |    1 | AC-1·2·3 | 로직 |
| `pages/_authenticated/_overlay-header-layout/main/route.tsx`                                                   | `app/routes/_protected.main.tsx` (`component: MainPage`)        | 연결          |    — | AC-1     | 로직 |
| `pages/_authenticated/_fixed-header-layout/mains.tsx` + `widgets/main/model/hooks.ts`                          | —                                                               | **폐기** (B8) |    0 | —        | —    |

### 이전하지 않는 것

- `zod` 스키마 파싱 — orval 타입이 필수 필드를 보장한다. 런타임 파싱은 넣지 않는다
- `Card.Link`의 옛 그림자와 `#CE4BFF` 등 하드코딩 색 — 현재 Figma 값과 정식 색 토큰으로 대체 (디자인)
- `MISSION_LABEL_MAP`의 레이블(「학습 페이지」) — 어디에도 표시되지 않는다

---

## 현행 동작 기준선

> `refactor-baseline` 2026-09-11. legacy `/main`
> (`pages/_authenticated/_overlay-header-layout/main/`)을 읽고 **관찰 가능한 동작만** 적었다.
> 경로는 `apps/legacy-web/src/` 기준.

### A. 진입 · 레이아웃

| #   | 동작                                                                                                         | 확인한 위치                                            |
| --- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| A1  | `/main`은 `_authenticated` 아래다. accessToken이 없으면 `/`로 redirect                                       | `pages/_authenticated/route.tsx`                       |
| A2  | 좁은 화면이면 모바일 레이아웃, 넓은 화면이면 데스크톱 레이아웃을 그린다 (`useResponsive().isMobile`)         | `main/main.tsx`                                        |
| A3  | 넓은 화면: 상단 고정 헤더(overlay) + 히어로 + 2단 본문(좌: 성장현황·이어학습·추천유닛 / 우: 연속학습일·미션) | `_overlay-header-layout/route.tsx`, `main-desktop.tsx` |
| A4  | 좁은 화면: 히어로 + 1단 본문(연속학습일 → [미션 \| 최근학습] 2열 → 이어학습) + 하단 고정 탭바                | `main-mobile.tsx`                                      |
| A5  | **좁은 화면에는 상단 헤더가 없다** (`hidden md:block`)                                                       | `_overlay-header-layout/route.tsx`                     |
| A6  | 넓은 화면에는 하단 탭바가 없다                                                                               | `main-desktop.tsx`                                     |
| A7  | 히어로 배경은 넓은/좁은 화면용 이미지 2종을 `<picture>`로 바꿔 쓴다                                          | `shared/ui/hero/hero-section.tsx`                      |

### B. 상단 헤더 (넓은 화면)

| #   | 동작                                                                                                     | 확인한 위치                                      |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| B1  | 좌: Gravit 로고 (링크 아님)                                                                              | `widgets/header/ui/header-content.tsx`           |
| B2  | 중앙 네비 4개: 홈 `/main` · 학습 `/learning` · 리그 `/league` · 마이그래빗 `/my`                         | `widgets/header/config/nav.ts`                   |
| B3  | 현재 경로와 일치하는 네비 항목에 밑줄 (overlay variant에서만)                                            | `HeaderNav` `activeProps`                        |
| B4  | 우: 프로필 아바타(색 = `profileImgNumber`) + 「로그아웃」 버튼                                           | `HeaderUserMenu`                                 |
| B5  | 프로필 정보는 `GET /api/v1/users/my-page`로 조회한다 (히어로 인사말과 **다른 엔드포인트**)               | `entities/sidebar/api/useUserInfo.ts`            |
| B6  | 로딩 중엔 아바타·「로그아웃」 자리에 스켈레톤. `profileImgNumber`가 0/없음이면 **우측 영역이 비어 있다** | `HeaderUserMenu` (`if (data?.profileImgNumber)`) |
| B7  | 「로그아웃」 클릭 → 토큰 삭제 → `/`로 이동 (`MIG-018` E1과 동일, `apps/web`에 이미 `useLogout` 있음)     | `features/auth/logout`                           |
| B8  | `/mains`는 어떤 네비·링크·redirect에서도 참조되지 않는다                                                 | `rg "/mains" apps/legacy-web/src` 0건            |

### C. 하단 탭바 (좁은 화면)

| #   | 동작                                                                             | 확인한 위치                                 |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------- |
| C1  | 탭 4개: 홈 `/main` · 학습 `/learning` · 리그 `/league` · 마이그래빗 `/my`        | `widgets/bottom-tab-bar/bottom-tab-bar.tsx` |
| C2  | 현재 경로와 일치하는 탭은 채운 아이콘 + 보라색 레이블, 나머지는 선 아이콘 + 회색 | 〃 (`isActive`)                             |
| C3  | 탭바 높이만큼 본문 하단 여백을 둔다 (68px)                                       | `main-mobile.tsx`, `BOTTOM_TAB_BAR_HEIGHT`  |

### D. 히어로 · 인사말

| #   | 동작                                                                            | 확인한 위치                           |
| --- | ------------------------------------------------------------------------------- | ------------------------------------- |
| D1  | `GET /api/v1/main-pages/profile`로 닉네임을 조회한다                            | `widgets/main-page/main-greeting.tsx` |
| D2  | 제목 「어서오세요, {닉네임}님!」 · 부제 「그래빗과 함께 CS 지식을 마스터해요!」 | 〃                                    |
| D3  | 로딩 중엔 닉네임 자리에 스켈레톤. 「어서오세요, 」는 항상 보인다                | 〃                                    |
| D4  | **조회 실패 시 아무것도 표시하지 않는다** — 「어서오세요, 」만 남는다           | 〃 (`isError` 분기 없음)              |

### E. 성장 현황 (넓은 화면 전용)

| #   | 동작                                                                                                                               | 확인한 위치                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| E1  | `GET /api/v1/main-pages/profile` + `GET /api/v1/main-pages/league` 두 요청을 하나의 카드로 묶는다                                  | `widgets/main-page/growth-section.tsx` |
| E2  | 좌: 아바타 · 닉네임 · 「LV {level}」 · 「{currentXp} / {maxXp} XP」 · 게이지(`currentXp/maxXp`)                                    | `user-progress-bar.tsx` `LevelCard`    |
| E3  | 우: 티어 아이콘(`leagueId` 1~15) · 티어 이름 · 「{currentLP} / {maxLP} LP」 · 게이지                                               | `TierCard`, `shared/lib/tiers.ts`      |
| E4  | **티어 이름은 항상 「브론즈 3」으로 표시된다** — `leagueName`을 받지만 쓰지 않는다                                                 | `entities/league/ui/tier-badge.tsx`    |
| E5  | `leagueId`가 1~15 밖이면 브론즈 3 아이콘으로 대체                                                                                  | `entities/league/lib/getTierIcon.ts`   |
| E6  | 둘 중 하나라도 로딩이면 카드 전체 스켈레톤                                                                                         | `growth-section.tsx`                   |
| E7  | 둘 중 하나라도 실패하면 카드 전체를 「성장 현황을 불러오지 못했어요. / 다시 시도」로 대체.<br>다시 시도는 **실패한 쿼리만** 재요청 | 〃, `ui/main-section-error.tsx`        |

### F. 이어서 학습하기

| #   | 동작                                                                                                                                                             | 확인한 위치                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| F1  | `GET /api/v1/main-pages/learning`을 조회한다                                                                                                                     | `widgets/main-page/continue-learning-section.tsx`            |
| F2  | 헤더 「이어서 학습하기」 + 우측 링크 「전체 학습화면 보기」 → `/learning/{chapterId}/{다음 유닛 id}`. 다음 유닛이 없으면 링크 없음                               | `unit-list-card.tsx`                                         |
| F3  | 챕터 제목 + 「{recentSolvedChapterProgressRate}%」 + 게이지 (값을 그대로 %로 쓴다)                                                                               | 〃, `labeled-progress-bar.tsx`                               |
| F4  | 유닛 목록(세로 스크롤 영역, 고정 높이). 각 행: 「Unit {id 2자리}」 \| 제목 \| 상태 칩                                                                            | `unit-list-scroll-area.tsx`, `entities/unit/unit-item.tsx`   |
| F5  | 상태 칩은 「완료」(outlined) / 「진행 중」(filled) 두 가지만 나온다. 「잠김」 분기는 코드에 있지만 도달하지 않는다                                               | `unit-list.tsx` (`isCompleted ? 'completed' : 'inProgress'`) |
| F6  | **모든 유닛이 「진행 중」으로 표시된다.** 응답의 `status`(NOT_STARTED/IN_PROGRESS/COMPLETED)를 읽지 않고 존재하지 않는 `isCompleted`를 기본값 `false`로 파싱한다 | `entities/learning/model/schema.ts` `unitProgressSchema`     |
| F7  | F6의 결과로 **다음 유닛은 항상 목록의 첫 유닛**이다                                                                                                              | `unit-list-card.tsx` `units.find((u) => !u.isCompleted)`     |
| F8  | 하단 CTA 「이어서 학습하기」 → `/learning/{chapterId}/{다음 유닛 id}`. 다음 유닛이 없으면 CTA 없음(자리는 유지)                                                  | `unit-list-card.tsx`                                         |
| F9  | 로딩: 헤더는 유지, 본문(제목·게이지·행 3개·CTA)을 스켈레톤으로                                                                                                   | `UnitListCardBodySkeleton`                                   |
| F10 | 실패: 카드 전체를 「이어 학습하기을 불러오지 못했어요. / 다시 시도」로 대체 (조사 「을」은 원문 그대로)                                                          | `continue-learning-section.tsx`                              |

### G. 새 주제 시작하기 (넓은 화면 전용)

| #   | 동작                                                                                                                                 | 확인한 위치                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| G1  | `GET /api/v1/main-pages/units`를 조회한다                                                                                            | `widgets/main-page/recommended-units-section.tsx` |
| G2  | 헤더 「새 주제 시작하기」 + 우측 링크 「전체 보기」 → `/learning`                                                                    | `recommended-units-list.tsx`                      |
| G3  | 응답 유닛 수만큼 카드를 2열 그리드로. 개수 제한 없음                                                                                 | 〃                                                |
| G4  | 카드: 제목 = **`chapterTitle`**(유닛 제목이 아니다) · 「Lesson {unitId 2자리}」 · 행성 이미지(`chapterId` 1~8) · 「학습하러 가기 →」 | `features/learning/ui/unit-card.tsx`              |
| G5  | 카드 클릭 → `/learning/{chapterId}/{unitId}`                                                                                         | 〃                                                |
| G6  | `chapterId`가 1~8 밖이면 행성 이미지가 깨진다 (`undefined` src)                                                                      | 〃, `shared/assets/images/planets/index.ts`       |
| G7  | 로딩: 카드 2장 스켈레톤. 실패: 「추천 유닛을 불러오지 못했어요. / 다시 시도」                                                        | `recommended-units-section.tsx`                   |

### H. 최근 학습 (좁은 화면 전용)

| #   | 동작                                                                                                  | 확인한 위치                                 |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| H1  | F1과 같은 `GET /api/v1/main-pages/learning` 응답을 쓴다 (캐시 공유, 추가 요청 없음)                   | `widgets/main-page/recent-unit-section.tsx` |
| H2  | 최근 챕터 유닛 목록의 **첫 유닛** 하나를 G4와 같은 카드로 표시. 상단에 작은 「새 주제 시작하기」 라벨 | 〃, `unit-card.tsx` (`block md:hidden`)     |
| H3  | 유닛이 0개면 카드를 그리지 않는다 (미션 옆 자리가 빈다)                                               | `recent-unit-section.tsx`                   |
| H4  | 실패: 「최근 학습을 불러오지 못했어요. / 다시 시도」                                                  | 〃                                          |

### I. 연속 학습일

| #   | 동작                                                                                                                  | 확인한 위치                                     |
| --- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| I1  | `GET /api/v1/main-pages/weekly-record` + `GET /api/v1/main-pages/learning` 두 요청을 묶는다                           | `widgets/main-page/streak-section.tsx`          |
| I2  | 헤더 「연속 학습일」 + 우측 링크 「자세히 보기」 → `/league` (모든 상태에서 항상 표시)                                | 〃                                              |
| I3  | 「{consecutiveSolvedDays}」 크게 + 「일 연속」                                                                        | `entities/learning/ui/learning-streak-body.tsx` |
| I4  | 요일 뱃지 월~일 7개. 오늘 = 채움 / 오늘 이전이고 기록 있음 = 테두리 / 그 외(미래·기록 없음) = 회색                    | `shared/ui/weekly-streak/weekly-streak.tsx`     |
| I5  | **오늘은 학습 여부와 무관하게 「오늘」 스타일**이다. 오늘 기록이 있어도 같은 모양                                     | 〃 `getDayStatus`                               |
| I6  | 「오늘」은 **클라이언트 로컬 시간** 기준 (`new Date().getDay()`), 월요일 시작                                         | 〃                                              |
| I7  | 로딩: 헤더 유지, 숫자·뱃지만 스켈레톤. 실패: 본문만 「학습 기록을 불러오지 못했어요. / 다시 시도」로 교체 (헤더 유지) | `streak-section.tsx`                            |
| I8  | 응답이 비어 있으면 「아직 학습 기록이 없어요. / 학습 시작하기(→ `/learning`)」. 200 응답에서는 도달하지 않는 분기     | 〃                                              |

### J. 오늘의 미션

| #   | 동작                                                                                                                                                               | 확인한 위치                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| J1  | `GET /api/v1/main-pages/mission`을 조회한다                                                                                                                        | `widgets/main-page/mission-section.tsx`   |
| J2  | 헤더 「오늘의 미션」. 우측 링크 없음                                                                                                                               | `entities/mission/mission-card.tsx`       |
| J3  | `missionDescription` (2줄 말줄임) + 「완료 시 + {awardXp}XP」                                                                                                      | 〃                                        |
| J4  | 「진행률」 + 「{progressRate × 100}%」 + 게이지. **F3과 달리 ×100 한다**                                                                                           | 〃 `MissionCardBody`                      |
| J5  | `isCompleted`는 받지만 **화면에 쓰지 않는다** (완료 상태 구분 없음)                                                                                                | 〃                                        |
| J6  | 넓은 화면: 하단 CTA 「도전하러 가기」. 좁은 화면: CTA 없이 **카드 전체가 링크**                                                                                    | 〃 (`hidden md:flex` / `md:hidden`)       |
| J7  | 목적지: `missionType`이 `FOLLOW_NEW_FRIEND`면 `/user/addfriend`(legacy) → 새 앱은 `/my/friends/search` (`docs/routes.md`), 그 외(알 수 없는 타입 포함) `/learning` | `entities/mission/lib/get-mission-url.ts` |
| J8  | 로딩: 헤더 유지, 본문 스켈레톤. 실패: 「오늘의 미션을 불러오지 못했어요. / 다시 시도」                                                                             | `mission-section.tsx`                     |

### K. 요청 정리

| 엔드포인트 (모두 GET, 인증 필요)   | 쓰는 곳                          | 넓은 | 좁은 |
| ---------------------------------- | -------------------------------- | :--: | :--: |
| `/api/v1/main-pages/profile`       | D 인사말 · E 성장현황            |  ✅  |  ✅  |
| `/api/v1/main-pages/league`        | E 성장현황                       |  ✅  |  —   |
| `/api/v1/main-pages/learning`      | F 이어학습 · H 최근학습 · I 연속 |  ✅  |  ✅  |
| `/api/v1/main-pages/units`         | G 추천유닛                       |  ✅  |  —   |
| `/api/v1/main-pages/weekly-record` | I 연속학습일                     |  ✅  |  ✅  |
| `/api/v1/main-pages/mission`       | J 미션                           |  ✅  |  ✅  |
| `/api/v1/users/my-page`            | B 헤더 프로필                    |  ✅  |  —   |

- 요청은 **전부 병렬**이다. 순서 의존이 없다
- 같은 엔드포인트를 여러 섹션이 부르면 Query 캐시를 공유해 한 번만 나간다
- 섹션마다 독립적으로 로딩·실패한다. 한 섹션이 실패해도 다른 섹션은 그려진다
- 이 화면에서 캐시를 무효화하는 동작은 없다 (mutation 없음)

## 동작 계약 (바뀌면 안 되는 것)

| #   | 계약                                                                                                 | 깨지면 무슨 일이 생기나                        |
| --- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| C1  | `/main`은 세션이 있어야 보이고, `/` · 콜백 · 온보딩 완료의 목적지다                                  | 로그인 직후 흰 화면 또는 404                   |
| C2  | 섹션 6개는 서로 독립적으로 로딩·실패한다. 한 요청 실패가 화면 전체를 막지 않는다                     | 미션 API 하나가 죽으면 메인 전체가 에러가 된다 |
| C3  | 실패한 섹션은 「다시 시도」로 그 섹션만 재요청할 수 있다                                             | 사용자가 새로고침 외에 복구 수단이 없다        |
| C4  | 「이어서 학습하기」 CTA와 「전체 학습화면 보기」는 다음 유닛 `/learning/{chapterId}/{unitId}`로 간다 | 학습 진입점이 끊긴다 — 메인의 핵심 동선        |
| C5  | 추천 유닛 카드 클릭 → `/learning/{chapterId}/{unitId}`, 미션 → J7 규칙, 연속 학습일 → `/league`      | 〃                                             |
| C6  | 헤더·탭바의 4개 목적지(`/main` `/learning` `/league` `/my`)와 활성 표시                              | 전역 네비가 깨진다                             |
| C7  | 「로그아웃」은 세션과 Query 캐시를 비우고 `/`로 보낸다 (`MIG-018` E1 재사용)                         | 다음 사용자가 이전 사용자 데이터를 본다        |
| C8  | 인사말 실패는 화면을 막지 않는다 (D4)                                                                | 프로필 조회 하나로 히어로가 에러 박스가 된다   |
| C9  | 요일 뱃지의 오늘 판정은 월요일 시작, 로컬 시간 기준 (I6)                                             | 일요일에 뱃지가 한 칸 어긋난다                 |

## 확인이 필요한 제약

| 항목                        | 내용                                                                                                                                                                | 이전 시 처리                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| API 계약 변경 (legacy 이후) | 현재 `WeeklyLearningRecordResponse`가 `consecutiveSolvedDays`와 요일별 `{ dayTiming, isCompleted }`를 함께 제공한다. `dayTiming`은 서버가 KST로 판정한다.           | 연속 학습일은 weekly-record **하나만** 조회하며, 클라이언트 로컬 시간으로 오늘을 계산하지 않는다. I1·I6·C9는 옛 명세와 legacy 동작의 기록이다. |
| `progressRate` 단위 미기재  | 명세에 설명이 없다. legacy는 미션 `progressRate`는 ×100(0~1 가정), 챕터 `recentSolvedChapterProgressRate`는 그대로(0~100 가정) 쓴다                                 | §확인 필요 3                                                                                                                                   |
| 행성 이미지 8종             | `chapterId` 1~8 ↔ 수성~해왕성 PNG. `apps/web`에 아직 없다                                                                                                          | 소비자 슬라이스에 에셋을 둔다 (`migration-status` §4 「Planet 유틸」)                                                                          |
| 티어 아이콘 15종            | `leagueId` 1~15 ↔ SVG. `apps/web`에 아직 없다                                                                                                                      | `entities/league`에 둔다. 리그 화면도 쓴다                                                                                                     |
| 히어로 배경 이미지 2종      | 넓은/좁은 화면용 PNG. `apps/web`의 `shared/ui/layout/space-background`와 같은 그림인지 확인 필요                                                                    | §확인 필요 4                                                                                                                                   |
| 호환 토큰 사용              | legacy는 `main-1` `main-2` `gray-*` `bg-main-gr`(그라데이션) `#FBF1FF` `#CE4BFF` `#625B71`을 쓴다. 새 화면에서는 호환 토큰을 쓰지 않는다(`design-source-policy` §8) | 시안 대조에서 정식 토큰으로 매핑. 게이지 그라데이션은 web `tokens.css`에 **없다**                                                              |

## 동일성 확인 방법

- **라우트 진입**: 세션 있는 상태로 `/main` → 히어로 「어서오세요, 」가 보이고 섹션 6개(넓은) / 5개(좁은)가 그려지는지
- **섹션 독립성** (MSW): `mission`만 500 → 미션 카드만 에러 UI, 나머지 5개는 정상 렌더. 「다시 시도」 클릭 → `mission` 요청이 **1회 더** 나가고 다른 엔드포인트는 안 나가는지
- **다음 유닛 계산**: 유닛 `[COMPLETED, IN_PROGRESS, NOT_STARTED]` → CTA href가 두 번째 유닛 id인지. 전부 `COMPLETED` → CTA 없음
- **요일 뱃지**: 오늘을 수요일로 고정(`vi.setSystemTime`), 월·화 `true` → 월·화 = 완료, 수 = 오늘, 목~일 = 대기
- **미션 목적지**: `FOLLOW_NEW_FRIEND` → `/my/friends/search`, `COMPLETE_LESSON_ONE` → `/learning`, 알 수 없는 타입 → `/learning`
- **네비**: `/main`에서 홈 항목만 활성, 로그아웃 클릭 → `/`
- **요청 수**: 넓은 화면 첫 진입에 GET 7종이 각 1회씩만 나가는지 (learning · profile 중복 없음)
- 기존 테스트: legacy에 없음. stories 2개(`chapters-section` · `unit-list-card`)는 문서일 뿐

## 기준선을 쓰면서 발견한 것

> 판단하지 않고 관찰만 적는다. 판정은 시안 대조 게이트에서 한다.

1. **유닛 상태가 전부 「진행 중」이다 (F6·F7).** 응답 필드가 `status` enum인데 legacy 스키마는
   `isCompleted`를 찾아 기본값 `false`로 채운다. 시안에는 학습 완료 / 학습 중 / 잠김 세 상태가 있다.
2. **티어 이름이 「브론즈 3」 고정이다 (E4).** `leagueName`이 응답에 있는데 안 쓴다.
3. **연속 학습일이 두 요청을 묶는다 (I1)** — 옛 명세 잔재. 현재 명세로는 weekly-record 하나로 충분하다.
   legacy 주석에도 "API 설계 수정 요청 상태"라고 적혀 있다.
4. **추천 유닛 카드 제목이 `chapterTitle`이다 (G4).** `unitTitle`을 받지만 안 쓴다. 시안 캡처도
   「자료구조 / Lesson 01」이라 어느 쪽이 의도인지 캡처만으로는 알 수 없다.
5. **진행률 단위가 섹션마다 다르다 (J4 vs F3).** 미션은 ×100, 챕터는 그대로.
6. **프로필을 두 엔드포인트에서 가져온다 (B5 vs D1).** 헤더는 `/users/my-page`, 인사말·성장현황은
   `/main-pages/profile`. 둘 다 `nickname` `profileImgNumber`를 준다. `apps/web`에는 이미
   `entities/user`의 `useUser`(`/users`)가 있어 세 번째 후보가 된다.
7. **미션 `isCompleted`를 안 쓴다 (J5).** 완료된 미션도 「도전하러 가기」가 그대로 보인다.
8. **인사말은 실패를 조용히 삼킨다 (D4).** 나머지 섹션은 전부 재시도 UI가 있다.
9. **좁은 화면에 헤더가 없다 (A5).** 시안 MOB에는 LV · 티어 · 벨이 있는 상단 헤더가 있다.
10. **에러 문구 조사 오류**: 「이어 학습하기**을** 불러오지 못했어요」(F10).
11. **`apps/web`에 이미 있는 대응물**: `useLogout`(C7) · `ProfileAvatar` · `getProfileColor` ·
    `useIsWideViewport` · `Logo` · `Button`. 헤더·탭바 아이콘은 `shared/ui/icon`에
    `home` `learning` `learning-fill` `level` `profile` `profile-fill` `bell`이 이미 있다.
    `home-fill` · `level-fill`은 없다.

## 시안 대조 결과

> `design-diff` 2026-09-11. Figma `MAIN-01-WEB`(`13750:65724`) · `MAIN-01-MOB`(`13750:50580`)을
> `get_design_context`로 읽고 기준선과 대조했다. 값의 근거는 Dev Mode 변수 바인딩이며 PNG에서
> 수치를 역산하지 않았다. **상태 프레임(로딩·에러·빈)은 시안에 없다** (MAIN 그룹 1화면 · WEB 1 · MOB 1).
>
> 판정 열: `고침` / `유지` / `나중`. 사용자 결정 1·2·4·5(2026-09-11)는 미리 반영했다.

### ③ 구조 · ⑤ 문구

| #   | 항목                              | 현행 (legacy)                                                        | 시안                                                                                                   | 판정                                                     |
| --- | --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | WEB 헤더 네비 항목                | 4개: 홈·학습·리그·마이그래빗 (B2)                                    | 5개: 홈·학습·**AI면접**·리그·마이그래빗                                                                | 나중 — AI면접 라우트가 없다 (Out of Scope)               |
| 2   | WEB 헤더 알림 벨                  | 없음                                                                 | 아바타 왼쪽에 벨 아이콘                                                                                | 나중 — 알림 `FEAT-` (Out of Scope)                       |
| 3   | MOB 상단 헤더                     | **없음** (A5)                                                        | 좌: 아바타 + 「LV 1」 · 티어 아이콘 + 「브론즈 3」 / 우: 벨. 히어로 위에 겹침                          | **고침** — 사용자 결정 5. 벨은 #2와 같이 나중            |
| 4   | WEB 「이어서 학습하기」 우측 링크 | 「전체 학습화면 보기」 있음 (F2)                                     | **없음** (제목만). MOB에는 있음                                                                        | 고침 — 시안대로 WEB 제거 (2026-09-11)                    |
| 5   | 이어학습 CTA 문구                 | 「이어서 학습하기」 (F8)                                             | 「**2강** 이어서 학습하기」 (WEB·MOB 동일)                                                             | 고침 — 목록 순번. 응답 확인 후 확정 (§확정 명세 A)       |
| 6   | 유닛 상태 칩                      | 「완료」(outlined) · 「진행 중」(filled) 2종. 잠김 도달 불가 (F5·F6) | 「학습 완료」(outlined main/2) · 「학습 중」(filled main/2) · 「잠김」(outlined divider/2, text/4) 3종 | **고침** — 사용자 결정 1. `status` enum 매핑 + 문구 변경 |
| 7   | 「학습 중」 행 테두리             | `#CE4BFF` 하드코딩                                                   | `brand/main/1`                                                                                         | 고침 — 토큰 `main`                                       |
| 8   | 잠김 행 텍스트 색                 | `gray-400`                                                           | WEB `text/3` · MOB `text/4` (시안끼리 다름)                                                            | 확인 필요 3                                              |
| 9   | 「새 주제 시작하기」 우측 링크    | 「전체 보기」 (G2)                                                   | 「전체보기」 (붙여씀)                                                                                  | 고침                                                     |
| 10  | 추천 유닛 카드 부제               | 「Lesson 01」 (G4)                                                   | WEB 「Lesson 01」 · MOB 「Lesson01」 (시안끼리 다름)                                                   | 유지 「Lesson 01」 (WEB 기준)                            |
| 11  | 추천 유닛 카드 제목               | `chapterTitle` (G4)                                                  | 「자료구조」 — 챕터명인지 유닛명인지 시안만으로 판별 불가                                              | 유지 `chapterTitle`. 응답 확인 후 확정 (§확정 명세 B)    |
| 12  | 미션 보상 문구                    | 「완료 시 + 15XP」 (J3, 공백 위치)                                   | 「완료 시 **+15 XP**」                                                                                 | 고침                                                     |
| 13  | WEB 미션 카드 본문                | 설명 · 보상 · 진행률 · CTA (J3·J4·J6)                                | 설명 · 보상 · 진행률 · **유닛 목록 4행** · CTA 「도전하러 가기」                                       | 나중 — API에 없으므로 제외. 백엔드 확인 후 별도 작업     |
| 14  | MOB 미션 카드                     | CTA 없이 카드 전체가 링크 (J6)                                       | CTA 없음. 링크 여부는 시안에 표현 없음                                                                 | 유지 (카드 전체 링크)                                    |
| 15  | 티어 이름                         | 「브론즈 3」 고정 (E4)                                               | 「브론즈 3」 — 예시값                                                                                  | **고침** — 사용자 결정 2. `leagueName` 표시              |
| 16  | WEB 성장 현황 구성                | 아바타·닉네임·LV·XP 게이지 / 티어·LP 게이지 (E2·E3)                  | 동일                                                                                                   | 유지                                                     |
| 17  | MOB 본문 순서                     | 연속학습일 → [미션 \| 최근학습] → 이어학습 (A4)                      | 동일                                                                                                   | 유지                                                     |
| 18  | WEB 본문 배치                     | 좌(성장·이어학습·추천) / 우(연속·미션) (A3)                          | 동일                                                                                                   | 유지                                                     |
| 19  | 히어로 인사말                     | 「어서오세요, {닉네임}님!」 + 부제 (D2)                              | 동일. WEB 글자색 `#f8f8f8`(=`bg-1`), MOB `color/gray/50`                                               | 유지. 색은 ① 참고                                        |
| 20  | 히어로 배경                       | 넓은/좁은 이미지 2종 (A7)                                            | 우주 배경 + 지구·구름 일러스트 (이미지 에셋)                                                           | 확인 필요 6                                              |
| 21  | 하단 탭바                         | 홈·학습·리그·마이그래빗, 활성=채운 아이콘+보라 (C1·C2)               | 동일 (`tab-bar/item`, 활성 `brand/main/2`, 비활성 `schemes/secondary`)                                 | 유지. 색은 ① 참고                                        |
| 22  | 요일 뱃지 상태 3종                | 완료 / 오늘 / 대기 (I4)                                              | 동일 3종 (`on` / `today` / 기본)                                                                       | 유지. 색은 ① 참고                                        |
| 23  | 헤더 로고                         | 링크 아님 (B1)                                                       | 표현 없음                                                                                              | 유지                                                     |

### ④ 상태 커버리지

| #   | 항목                    | 현행                                                      | 시안        | 판정                                                                      |
| --- | ----------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| 24  | 섹션별 로딩 스켈레톤    | 있음 (헤더 유지, 본문만 스켈레톤)                         | 프레임 없음 | 유지 — 시안 없음(2026-09-11 확인). 현행 동작을 그대로 옮긴다              |
| 25  | 섹션별 에러 + 다시 시도 | 있음 (E7·F10·G7·H4·I7·J8). 인사말만 없음 (D4)             | 프레임 없음 | 유지 — 〃. 문구 「{섹션}을 불러오지 못했어요.」는 조사 오류(F10)만 고친다 |
| 26  | 빈 상태                 | 연속학습일만 「아직 학습 기록이 없어요.」 (I8, 도달 불가) | 프레임 없음 | 고침 — 404를 빈 상태로. 문구는 임시 (§확정 명세 C)                        |
| 27  | 미션 완료 상태          | 구분 없음 (J5)                                            | 프레임 없음 | 고침 — CTA 비활성 + 「미션 완료」                                         |
| 28  | 헤더 프로필 미도착      | 우측 영역 빈 채로 (B6)                                    | 프레임 없음 | 고침 — 「로그아웃」은 프로필과 무관하게 항상 표시 (C7 계약)               |

### ① 토큰 — Figma 변수 ↔ `tokens.css`

| #   | Figma 변수 (시안에서 쓰인 곳)                                                                                     | `tokens.css`                                                          | 판정         |
| --- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------ |
| 29  | `brand/main/1` #ba00ff (게이지 수치, 「학습 중」 테두리, 오늘 뱃지)                                               | `--color-main` ✅ (`main-1`은 호환 토큰)                              | 유지 `main`  |
| 30  | `brand/main/2` #8100b3 (칩 「학습 완료」「학습 중」, 탭바 활성, `on` 뱃지 글자)                                   | **정식 별칭 없음.** 호환 `main-2`만 있다                              | 확인 필요 9  |
| 31  | `color/purple/50` #fbf2ff (게이지 트랙, `on` 뱃지 배경) · WEB은 raw `#fbf1ff`                                     | primitive만 있고 **별칭 없음** (`purple-100`부터)                     | 확인 필요 9  |
| 32  | `bg/0` white (카드 배경)                                                                                          | `bg-0` 없음. `bg-white` 또는 `text-1-w`                               | 확인 필요 9  |
| 33  | `bg/1` #f8f8f8 (유닛 행 배경) · `bg/2` (페이지) · `bg/3` (WEB 「자세히 보기」)                                    | `bg-1` `bg-2` `bg-3` ✅                                               | 유지         |
| 34  | `text/1`~`text/4` · `text/on-color-1` · `text/on-color-3`                                                         | `text-1`~`text-4` · `text-1-w` · `text-3-w` ✅                        | 유지         |
| 35  | `divider/2` (잠김 칩 테두리) · `cta/default` `cta/text` `cta/disabled` (CTA · 대기 뱃지 테두리) · `icon/on-color` | `divider-2` · `cta` `cta-text` `cta-disabled` · `icon-w` ✅           | 유지         |
| 36  | `color/gray/0` `color/gray/50` `color/gray/700` (MOB 인사말·헤더 글자, WEB 구분선)                                | `gray-*`는 `initial`로 비활성. 호환 재정의만 있다                     | 확인 필요 9  |
| 37  | `schemes/secondary` (탭바 비활성 레이블)                                                                          | 없음. legacy는 `#625B71` 하드코딩                                     | 확인 필요 9  |
| 38  | raw `#e6a1ff` (아바타 배경) · `#222124` `#494949` (MOB 연속일 숫자) · `#c6c6c6` (MOB 카드 부제)                   | `getProfileColor` 결과 · `black`/`gray-800` 호환 · `bg-4`/`divider-2` | 확인 필요 9  |
| 39  | 게이지 채움 그라데이션 (`main/gr` 스타일, 값 미노출)                                                              | 호환 `--background-image-main-gr` (45deg #8100b3→#d0f)                | 확인 필요 10 |
| 40  | 타이포 Display1 · Heading1 · Heading2 · Headline2 · Body1_Normal · Title1 · Title3                                | 17종 스케일에 모두 있음 ✅                                            | 유지         |

### ② 공용 컴포넌트 — 시안 컴포넌트 ↔ `shared/ui`

| #   | 시안 컴포넌트                                                            | `apps/web`                                                                                                                                    | 판정                                        |
| --- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 41  | `button-legacy` (cta/default, 「2강 이어서 학습하기」 「도전하러 가기」) | `Button` ✅                                                                                                                                   | 유지 `Button asChild` + `Link`              |
| 42  | `chip` / `chip/nav` (유닛 상태 3종)                                      | **없음**                                                                                                                                      | 신규 `shared/ui/chip` — 디자인 작업         |
| 43  | `W/이어서 학습하기 리스트` (유닛 행)                                     | 없음                                                                                                                                          | `entities/learning/ui` — 디자인 작업        |
| 44  | `연속학습` (요일 뱃지 `on`/`today`/기본)                                 | 없음                                                                                                                                          | `entities/learning/ui` — 디자인 작업        |
| 45  | 카드 셸 (흰 배경 · 제목 · 우측 링크)                                     | 없음                                                                                                                                          | 신규 `shared/ui/card` — 디자인 작업         |
| 46  | 게이지 (트랙 + 채움)                                                     | 없음                                                                                                                                          | 신규 `shared/ui/progress-bar` — 디자인 작업 |
| 47  | 스켈레톤                                                                 | 없음                                                                                                                                          | 신규 `shared/ui/skeleton` — 디자인 작업     |
| 48  | `W/gnb` (glass) · `tab-bar/item`                                         | 없음                                                                                                                                          | `widgets/header` · `widgets/bottom-tab-bar` |
| 49  | `nav/line/*` · `communication/line/bell` · 아바타                        | `shared/ui/icon`에 `home` `learning(-fill)` `level` `profile(-fill)` `bell` 있음. **`home-fill` `level-fill` 없음**. 아바타는 `ProfileAvatar` | 채운 아이콘 2종 반입 (`generate:icons`)     |
| 50  | 티어 아이콘 15종 · 행성 이미지 8종                                       | 없음                                                                                                                                          | 에셋 반입 — 디자인 작업                     |

### 확인 필요

1. **WEB 「전체 학습화면 보기」 링크** — 시안 WEB에는 없고 MOB에만 있다. WEB에서 지우면 CTA 하나만
   남는다 (같은 목적지라 경로가 끊기진 않는다). 시안대로 WEB은 제거하는가?
2. **「2강 이어서 학습하기」의 「2강」** — 다음 유닛의 `unitId`인가, 목록 내 순번인가? 유닛 id가 전역
   번호면 「37강」이 나온다. 「Unit 01」 표기도 같은 값(`unitId`)을 쓴다 (F4).
3. ~~잠김 행 텍스트 색~~ — **`text-4`로 통일 (2026-09-11)**. 칩과 같은 색이라 MOB 쪽을 따랐다.
4. **추천 유닛 카드 제목** — `chapterTitle`(현행) vs `unitTitle`. API가 둘 다 준다. Figma 텍스트
   레이어가 「자료구조」라 판별이 안 된다 → 디자이너 확인.
5. **WEB 미션 카드의 유닛 목록 4행** — `GET /main-pages/mission` 응답에 유닛 목록이 없다.
   (a) 시안이 예시 장식이라 빼는가, (b) 이어학습 목록을 재사용하는가, (c) 백엔드에 필드를 요청하는가?
6. ~~히어로 배경 에셋~~ — **해결 (2026-09-11)**: legacy `pcBannerImage.png` · `mobile-banner.png`가 시안과 같은
   일러스트다. webp로 변환해 `widgets/hero-greeting/ui/assets/`에 뒀다 (1.8MB → 13KB).
7. **빈 상태** — 신규 가입 직후 최근 챕터가 없으면 `/main-pages/learning`이 무엇을 주는가
   (200 + 빈 `units` / 404 / `recentSolvedChapterId: 0`)? 시안 프레임이 없어 문구를 임의로 만들 수 없다.
8. **미션 완료 상태** — `isCompleted: true`일 때 CTA·진행률 표시. 시안 프레임 없음.
9. ~~토큰 5건~~ — **판정 (2026-09-11, `checklist.md` §4)**: `brand/main/2`는 실제 값이 #9b00cf = `cta` ·
   `purple-50` 별칭 승격 · `bg/0` = `bg-white` · `gray/*` = `text-1-w`/`divider-1` 근사 · `schemes/secondary`는
   `text-3` 대체 후 **디자이너 확정 필요**.
10. ~~게이지 그라데이션~~ — **해결 (2026-09-11)**: Dev Mode 값 `#8100b3 → #dd00ff` 확인. 정식
    `--background-image-brand-gradient` 신설 (`bg-brand-gradient`).

---

## 확정 명세 · 검증 기준

> 시안 대조 게이트(2026-09-11) 판정 반영. **관찰 가능한 결과만** Given-When-Then으로 쓴다.
> 시각(색·간격·타이포)은 AC로 쓰지 않는다 — Storybook + Figma 대조의 영역이다 (`test-policy` §1).
>
> 게이트 판정 요약: #1 AI면접 나중 · #2 벨 나중 · #3 MOB 헤더 고침 · #4 WEB 「전체 학습화면 보기」 제거 ·
> #5 「N강」은 목록 순번(§확인 필요 A) · #6 유닛 상태 3종 고침 · #9 「전체보기」 · #11 `chapterTitle` 유지(§확인 필요 B) ·
> #12 「완료 시 +N XP」 · #13 미션 유닛 목록 제외(API에 없음) · #15 `leagueName` · #27 완료 미션은 CTA 비활성 ·
> #28 로그아웃 항상 표시 · 404는 빈 상태(§확인 필요 C)

### 라우트 · 레이아웃

- [ ] **AC-1** (통합)
      Given 세션 토큰이 있다
      When `/main`에 진입한다
      Then 히어로 「어서오세요, 」가 보이고 `GET /api/v1/main-pages/{profile,league,learning,units,weekly-record,mission}`이 **각 1회씩** 나간다 (넓은 화면). 좁은 화면은 `league` · `units`를 제외한 4종
- [ ] **AC-2** (통합)
      Given 넓은 화면(≥768px)
      When `/main`을 그린다
      Then 상단 헤더(로고 · 네비 4개 · 아바타 · 「로그아웃」) + 히어로 + 성장 현황 · 이어서 학습하기 · 새 주제 시작하기 · 연속 학습일 · 오늘의 미션 5개 섹션이 있고 하단 탭바는 없다
- [ ] **AC-3** (통합)
      Given 좁은 화면(<768px)
      When `/main`을 그린다
      Then 상단 헤더(아바타 + 「LV {level}」 · 티어 아이콘 + `leagueName`) + 히어로 + 연속 학습일 · 오늘의 미션 · 최근 학습 · 이어서 학습하기 4개 섹션 + 하단 탭바 4개가 있고 넓은 화면 헤더·성장 현황·새 주제 시작하기는 없다

### 헤더 · 탭바

- [ ] **AC-4** (단위)
      Given 현재 경로가 `/main`
      When 헤더 네비 / 하단 탭바를 그린다
      Then 「홈」만 활성(`aria-current="page"`)이고 각 항목의 href는 `/main` `/learning` `/league` `/my`
- [ ] **AC-5** (단위)
      Given 프로필 조회가 아직 끝나지 않았거나 실패했다
      When 넓은 화면 헤더를 그린다
      Then 「로그아웃」 버튼은 항상 있다 (아바타만 자리 표시)
- [ ] **AC-6** (통합)
      Given `/main`
      When 「로그아웃」을 클릭한다
      Then 세션이 지워지고 Query 캐시가 비워지고 `/`로 이동한다

### 인사말 · 성장 현황

- [ ] **AC-7** (단위)
      Given `profile` 응답 `{ nickname: '땅콩' }`
      When 인사말을 그린다
      Then 「어서오세요, 땅콩님!」 · 「그래빗과 함께 CS 지식을 마스터해요!」
- [ ] **AC-8** (단위)
      Given `profile` 요청이 실패했다
      When 인사말을 그린다
      Then 「어서오세요, 」와 부제는 보이고 에러 UI는 없다 (C8)
- [ ] **AC-9** (단위)
      Given `profile` `{ nickname: '땅콩', profileImgNumber: 3, userLevelDetailResponse: { level: 1, currentXp: 31, maxXp: 99 } }` · `league` `{ leagueId: 4, leagueName: '실버 3', currentLP: 31, maxLP: 99 }`
      When 성장 현황을 그린다
      Then 「땅콩」 「LV 1」 「31 / 99 XP」 · 「실버 3」 「31 / 99 LP」. 게이지 `aria-valuenow`는 각각 31(max 99)
- [ ] **AC-10** (단위)
      Given `league`만 실패
      When 성장 현황을 그린다
      Then 카드 전체가 「성장 현황을 불러오지 못했어요.」 + 「다시 시도」. 클릭 시 `league`만 1회 재요청 (`profile`은 안 나감)

### 이어서 학습하기 · 최근 학습

- [ ] **AC-11** (단위 — 순수 함수)
      Given `units: [{unitId: 11, status: 'COMPLETED'}, {unitId: 12, status: 'IN_PROGRESS'}, {unitId: 13, status: 'NOT_STARTED'}]`
      When 다음 유닛을 계산한다
      Then `unitId: 12`, 순번 2. 전부 `COMPLETED`면 `null`. `[]`면 `null`
- [ ] **AC-12** (단위)
      Given AC-11의 units · `recentSolvedChapterId: 7` · `recentSolvedChapterTitle: '자료구조'` · `recentSolvedChapterProgressRate: 10`
      When 이어서 학습하기를 그린다
      Then 「자료구조」 「10%」, 행 3개는 「Unit 01」「Unit 02」「Unit 03」 + 칩 「학습 완료」「학습 중」「잠김」, CTA 「2강 이어서 학습하기」의 href는 `/learning/7/12`
- [ ] **AC-13** (단위)
      Given 다음 유닛이 없다 (전부 완료)
      When 이어서 학습하기를 그린다
      Then CTA가 없다
- [ ] **AC-14** (단위)
      Given 넓은 화면
      When 이어서 학습하기 헤더를 그린다
      Then 우측 링크가 없다. 좁은 화면이면 「전체 학습화면 보기」(href = 다음 유닛 경로)가 있다
- [ ] **AC-15** (단위)
      Given `learning`이 **404**
      When 이어서 학습하기 / 최근 학습 / 연속 학습일을 그린다
      Then 「다시 시도」가 아니라 빈 상태를 그린다 (문구는 §확인 필요 C). 500이면 「다시 시도」
- [ ] **AC-16** (단위)
      Given AC-12의 데이터, 좁은 화면
      When 최근 학습 카드를 그린다
      Then 첫 유닛(`unitId: 11`) 카드 1장, href `/learning/7/11`

### 새 주제 시작하기

- [ ] **AC-17** (단위)
      Given `units` 응답 2건 `[{unitId: 21, unitTitle: '스택', chapterId: 3, chapterTitle: '자료구조'}, …]`
      When 새 주제 시작하기를 그린다
      Then 카드 2장, 첫 카드 제목 「자료구조」(`chapterTitle`, §확인 필요 B) · 「Lesson 21」 · href `/learning/3/21`. 우측 링크 「전체보기」 → `/learning`

### 연속 학습일

- [ ] **AC-18** (단위 — 순수 함수)
      Given `weekly-record`가 요일마다 서버 KST 기준 `dayTiming`과 `isCompleted`를 제공한다
      When 요일 상태를 변환한다
      Then `TODAY` = `today`, `FUTURE` = `upcoming`, `PAST`는 완료 여부에 따라 `completed` 또는 `uncompleted`다
- [ ] **AC-19** (단위)
      Given `weekly-record` `{ consecutiveSolvedDays: 5, … }`
      When 연속 학습일을 그린다
      Then 「5」 「일 연속」, 뱃지 7개, 「자세히 보기」 → `/league`. **`learning` 요청은 나가지 않는다** (weekly-record 하나만)

### 오늘의 미션

- [ ] **AC-20** (단위 — 순수 함수)
      Given `missionType`
      When 목적지를 계산한다
      Then `FOLLOW_NEW_FRIEND` → `/my/friends/search`, 그 외 전부 → `/learning`
- [ ] **AC-21** (단위)
      Given `mission` `{ missionDescription: '레슨 4개 완료하기', awardXp: 15, progressRate: 0.5, isCompleted: false, missionType: 'COMPLETE_LESSONS_TWO' }`
      When 미션을 그린다
      Then 「레슨 4개 완료하기」 「완료 시 +15 XP」 「진행률」 「50%」. 넓은 화면 CTA 「도전하러 가기」 href `/learning`. 좁은 화면은 CTA 없이 카드 링크 href `/learning`
      (`progressRate` 단위는 §확인 필요 D — 구현은 변환 함수 하나로 모은다)
- [ ] **AC-22** (단위)
      Given `isCompleted: true`
      When 미션을 그린다
      Then CTA가 **비활성**(`disabled`)이고 레이블은 「미션 완료」. 좁은 화면은 카드가 링크가 아니다

### 공통 — 섹션 독립성

- [ ] **AC-23** (통합 · MSW)
      Given `mission`만 500
      When `/main`을 그린다
      Then 미션 카드만 「오늘의 미션을 불러오지 못했어요.」 + 「다시 시도」, 나머지 섹션은 정상. 「다시 시도」 클릭 → `mission`만 1회 재요청
- [ ] **AC-24** (단위)
      Given 각 섹션 로딩 중
      When 그린다
      Then 카드 헤더 제목(「이어서 학습하기」 등)은 보이고 본문은 `aria-busy="true"`

### 확인 필요 (구현 후 네트워크 탭에서 확정)

- **A. 「Unit NN」 · 「N강」 번호** — 목록 순번(index+1)으로 구현한다. legacy 개념노트 화면이 같은 방식이다
  (`concept-note.tsx` `currentUnitIndex + 1`). 실제 `unitId`가 챕터 내 순번이면 그때 바꾼다. 변환은
  `entities/learning/model`의 함수 하나에 모은다.
- **B. 추천 유닛 카드 제목** — 시안대로 `chapterTitle`. 실제 응답에서 `unitTitle`이 의도에 맞으면 바꾼다.
  「Lesson NN」은 목록 맥락이 없어 `unitId`를 쓴다 (A와 다른 규칙이므로 응답 확인 필요).
- **C. 404 빈 상태 문구** — 명세상 `learning` · `weekly-record`는 학습 기록이 없으면 **404**다. 시안 프레임이
  없으므로 legacy I8 문구 「아직 학습 기록이 없어요.」 + 「학습 시작하기」(→ `/learning`)를 임시로 쓴다.
  **디자인 확정 시 교체.**
- **D. `progressRate` 단위** — 미션 0~1 / 챕터 0~100으로 가정(legacy와 동일). 네트워크 탭 확인 후 확정.
- **E. `profile` 404** — 유저 조회 실패. 인사말은 조용히(AC-8), 성장 현황은 에러 UI.

---

## Changelog

| 날짜       | 요약                                                                                         | 사유                                                                                                                                                               | 연관 항목                                          |
| ---------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 2026-09-11 | 작업 생성 · 현행 동작 기준선 작성                                                            | `/main`이 빈 화면. 로그인 직후 목적지라 우선순위 high                                                                                                              | —                                                  |
| 2026-09-11 | 범위에 헤더·탭바 포함, `/mains` 폐기                                                         | 사용자 결정                                                                                                                                                        | —                                                  |
| 2026-09-11 | 시안 대조 결과 작성 (50항목 · 확인 필요 10건)                                                | design-diff                                                                                                                                                        | —                                                  |
| 2026-09-11 | 시안 대조 게이트 판정 · 확정 명세 AC-1~24 작성                                               | 사용자 판정. 2·4·7은 OpenAPI 명세(`v3/api-docs`)로 보강: learning·weekly-record는 기록 없으면 404, 유닛 순번 필드 없음                                             | —                                                  |
| 2026-09-11 | Issue 1~4 구현·검증 완료. 토큰 판정(purple-50 · brand-gradient) · 에셋 반입 · `checklist.md` | ai-orchestrate · ai-validate. 실서버 응답 확인 A·B·C·D는 사용자 몫                                                                                                 | `checklist.md` · `docs/fe-implement-spec/main-01/` |
| 2026-09-11 | 현재 라우트 기준표 작성 — 미션 목적지 `/my/friends/search`, 네비 4개 유지                    | 외부 계약만 확정. 내부 URL은 각 화면 `MIG-`에서 재평가. `docs/routes.md` 신설                                                                                      | `docs/routes.md`                                   |
| 2026-09-11 | ADR 6건 · 이전 매핑 작성                                                                     | refactor-planner. 게이트 2·3                                                                                                                                       | —                                                  |
| 2026-09-11 | 기준선 확인 필요 1·2·4·5 판정                                                                | 유닛 status 3종 고침 · 티어 이름 표시 · 프로필 조회 통일(FSD에 맞게 재구성 허용) · 좁은 화면 헤더 이번에 구현. 3(progressRate 단위)은 구현 후 네트워크 탭에서 확인 | —                                                  |
