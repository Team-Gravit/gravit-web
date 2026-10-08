---
id: 'MIG-025'
planned: '2026-09-11'
mode: 'migrate'
---

# MIG-025 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**
> work task 전체(Issue 1~4)의 계획이다. 체크리스트 항목마다 `Issue N`을 표시한다.
> 로직(Issue 1~3)은 Claude, 디자인·검증(Issue 4)은 Codex가 맡는다.

## 0. 모드 판정

`mode: migrate` — legacy `/main`(섹션 6개 + 헤더 + 탭바)이 `apps/web`에 없고 `_protected.main.tsx`가
`component: () => null`이다. `/` · OAuth 콜백 · 온보딩 완료가 전부 `/main`으로 보내므로 **기존 사용자가
로그인 직후 흰 화면을 본다.** 동작 변경 후보(유닛 상태 3종 · 티어 이름 · 미션 완료 비활성 · 좁은 화면
헤더)는 `spec.md` 시안 대조 게이트에서 **사용자가 「고침」으로 판정**했고 `checklist.md` 의도적 변경란에
기록한다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                                                         |
| --- | ----------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 목표와 비목표가 명확한가            | ✅  | 바꾼다: `/main` 빈 화면 → MAIN-01. 보존한다: 기준선 A~K와 동작 계약 C1~C9. 비목표 5건(`spec.md` Out of Scope): 게이트 · `/mains` · 목적지 화면 · 벨 · AI면접 |
| 2   | 반복 비용이나 확장 차단이 있는가    | ✅  | 로그인 직후 목적지가 흰 화면. 헤더·탭바는 이후 인증 화면 전부(learning · league · my)가 재사용한다                                                           |
| 3   | 보존할 동작의 기준선이 있는가       | ✅  | `spec.md` 기준선 A1~K(60여 항목, legacy 코드 직접 확인) · 동작 계약 C1~C9 · 확정 명세 AC-1~24                                                                |
| 4   | 자동 또는 수동 검증 방법이 있는가   | ✅  | §5-1. 순수 함수(다음 유닛 · 요일 상태 · 미션 목적지)와 RTL+MSW(섹션 독립성 · 요청 횟수 · href). 시각은 Issue 4에서 6축 대조                                  |
| 5   | 범위를 독립적으로 완료할 수 있는가  | ✅  | `MIG-005` 게이트에 의존하지 않는다 (`MIG-024`와 같은 방식으로 `_protected` 아래 배치만). 목적지 화면은 링크만 만든다. 이슈 4개로 단계 검증                   |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | ✅  | §5 리스크 7건. 생성물은 손대지 않는다(orval 재생성 불필요 — 6종 훅 전부 존재). 되돌리기는 이슈=브랜치 단위                                                   |

### 0-2. 자동 보류 신호 — 하나라도 해당하면 **중단**

- [x] **동작 변경이 같이 들어감 → 6건, 전부 사용자 판정(2026-09-11) 완료.** `FIX-`로 분리하지 않는다 —
      legacy 결함 보정이고 시안이 근거이며, 분리하면 「전부 진행 중」인 화면을 한 번 만들었다 지우게 된다.
      `checklist.md` 의도적 변경란에 기록한다: ① 유닛 상태 `status` 3종 (F6) ② 티어 `leagueName` (E4)
      ③ 연속 학습일이 `learning`을 안 부른다 (I1, 명세 변경) ④ 미션 완료 시 CTA 비활성 (J5)
      ⑤ 좁은 화면 상단 헤더 신설 (A5) ⑥ 404를 빈 상태로 (ADR-4) + 문구 3건(#9 · #12 · F10 조사)
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음. `issues.md` 4개, 각각 동작 보존 단위
- [ ] 자동 생성물을 직접 손봐야 함 — 해당 없음. `routeTree.gen.ts`는 **재생성**, orval은 재생성 불필요
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 — `format:check`는 `REF-003` 기존 실패.
      **`node_modules` 심링크가 옛 경로를 가리켜 lint·types가 깨지는 건 환경 문제** — `pnpm install`로 해소(진행 중)
- [ ] 범위 밖 문제가 섞임 — 해당 없음. 벨·AI면접·미션 유닛 목록은 Out of Scope로 뺐다

---

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                                              | 레이어                   | 기준선 · AC           | Issue |
| --- | ------------------------------------------------------------------------------------- | ------------------------ | --------------------- | :---: |
| 1   | 프로필 요약(닉네임 · 아바타 번호 · 레벨 · XP)을 조회한다                              | `[entities]`             | D1 · E2 · AC-7·9      |   1   |
| 2   | 리그 요약(티어 id · 이름 · LP)을 조회하고 id → 티어 이름·아이콘 키를 판정한다         | `[entities]`             | E3 · E5 · AC-3·9      |   1   |
| 3   | 로그아웃 버튼 — 세션·캐시를 비우고 완료를 알린다                                      | `[features]`             | B7 · C7 · AC-5·6      |   1   |
| 4   | 넓은 헤더: 로고 · 네비 4 · 아바타 · 로그아웃. 현재 경로 활성 표시                     | `[widgets]`              | B1~B6 · AC-2·4·5      |   1   |
| 5   | 좁은 헤더: 아바타 + LV · 티어 아이콘 + 이름                                           | `[widgets]`              | 시안 #3 · AC-3        |   1   |
| 6   | 하단 탭바 4개, 현재 경로 활성 표시                                                    | `[widgets]`              | C1~C3 · AC-3·4        |   1   |
| 7   | 히어로 인사말: 닉네임 로딩/실패를 조용히 처리                                         | `[widgets]`              | D2~D4 · AC-7·8        |   1   |
| 8   | 넓은/좁은 페이지를 조립하고 `/main`에 연결한다                                        | `[pages]` `[app]`        | A2~A6 · AC-1~3        |   1   |
| 9   | 카드 셸(제목 · 우측 액션 · 본문) · 상태(메시지 + 액션) · 게이지(aria) · 스켈레톤      | `[shared]`               | ADR-3 · AC-24         |   2   |
| 10  | 주간 기록 조회(404 → null) · 서버 KST 기준 요일 상태 변환                             | `[entities]`             | I4~I6 · AC-15·18      |   2   |
| 11  | 연속 학습일 위젯: 숫자 · 뱃지 7 · 「자세히 보기」 · 상태 4종                          | `[widgets]`              | I2~I8 · AC-19         |   2   |
| 12  | 미션 조회 · 목적지 판정 · 진행률 변환 · 완료 상태                                     | `[entities]`             | J3~J7 · AC-20~22      |   2   |
| 13  | 오늘의 미션 위젯: 넓은 CTA / 좁은 카드 링크 · 완료 시 비활성 · 에러 재시도            | `[widgets]`              | J6 · J8 · AC-21~23    |   2   |
| 14  | 최근 학습 조회(404 → null) · 유닛 상태 3종 · 순번 · 다음 유닛 · 챕터 진행률 변환      | `[entities]`             | F3~F8 · AC-11         |   3   |
| 15  | 칩(3 variant)                                                                         | `[shared]`               | 시안 #6 · AC-12       |   3   |
| 16  | 유닛 행 · 유닛 목록 · 추천 유닛 카드(표시 전용)                                       | `[entities]`             | F4 · G4 · AC-12·17    |   3   |
| 17  | 이어서 학습하기 위젯(넓은/좁은 헤더 링크 차이) · 최근 학습 카드 위젯                  | `[widgets]`              | F2 · H2 · AC-12~16    |   3   |
| 18  | 추천 유닛 조회 · 새 주제 시작하기 위젯                                                | `[entities]` `[widgets]` | G1~G7 · AC-17         |   3   |
| 19  | 티어 뱃지(아이콘 + `leagueName`) · 성장 현황 위젯(profile + league 묶음, 부분 재시도) | `[entities]` `[widgets]` | E1~E7 · AC-9·10       |   3   |
| 20  | 시안 맞춤 · 에셋 · 토큰 · Storybook · 검증 · 문서 승격                                | 전 레이어                | 시안 대조 ①② · AC-D/V |   4   |

### 1-1. 관리 포인트 식별

| 값                                                             | 상수 / 인라인                                       | 근거                                                                                             |
| -------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 네비 항목 4개 (레이블 · 경로)                                  | **상수** `widgets/header/model/nav-items.ts`        | 헤더·탭바 두 곳이 같은 표를 본다 (§3 「두 곳 이상」). 탭바는 아이콘만 더한다                     |
| 티어 15종 (id · 이름 · 아이콘 키)                              | **상수** `entities/league/model/tiers.ts`           | 도메인 식별자. 리그 화면도 쓴다                                                                  |
| 미션 타입 → 목적지                                             | **상수** `entities/mission/model/mission-route.ts`  | 도메인 정책값. `FOLLOW_NEW_FRIEND`만 `/my/friends/search`, 나머지 `/learning` (`docs/routes.md`) |
| 요일 레이블 「월~일」 · 응답 키 `MONDAY~SUNDAY`                | **상수** `entities/learning/model/weekly-streak.ts` | 순서가 계약(월 시작)                                                                             |
| 섹션 에러 문구 「{섹션}을 불러오지 못했어요.」 · 「다시 시도」 | 인라인(`CardStatus` 기본 prop)                      | 여러 곳이 쓰지만 컴포넌트가 소유한다. 섹션 이름만 prop                                           |
| 빈 상태 임시 문구 「아직 학습 기록이 없어요.」                 | 인라인 + 제거 조건 주석                             | 시안 확정 시 교체 (`spec.md` 확인 필요 C)                                                        |
| 히어로 부제 · 「LV」 · 「일 연속」 · 「완료 시 +」 등          | 인라인                                              | 한 컴포넌트 고유 문구                                                                            |
| `min-width: 768px`                                             | 기존 `WIDE_VIEWPORT_MIN_WIDTH_PX`                   | 재사용                                                                                           |

---

## 2. 영향 분석

`apps/web`에 이전 대상의 기존 사용처는 없다 (`rg -l "main-pages\|widgets/header" apps/web/src` 0건).
수정되는 기존 파일은 3개뿐이다.

| 구분 | 파일                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | **Issue 1** `entities/user/api/use-user-profile.ts` · `entities/league/{index,model/tiers,api/use-league-summary}.ts` · `features/auth-logout/ui/logout-button.tsx` · `widgets/header/{index,model/nav-items,ui/header-wide,ui/header-narrow}` · `widgets/bottom-tab-bar/{index,ui/bottom-tab-bar}` · `widgets/hero-greeting/{index,ui/hero-greeting}` · `pages/main/{index,ui/main-page,ui/main-page-wide,ui/main-page-narrow}` + 테스트<br>**Issue 2** `shared/ui/{card,progress-bar,skeleton}` · `entities/learning/{index,model/weekly-streak,api/use-weekly-record,ui/weekly-streak,ui/weekday-badge}` · `entities/mission/{index,model/mission,model/mission-route,api/use-daily-mission,ui/mission-card}` · `widgets/learning-streak` · `widgets/daily-mission`<br>**Issue 3** `shared/ui/chip` · `entities/learning/{model/unit-progress,model/chapter-progress,api/use-recent-learning,api/use-recommended-units,ui/unit-progress-item,ui/unit-progress-list,ui/unit-card}` · `entities/league/ui/tier-badge` · `widgets/{continue-learning,recommended-units,growth-summary}`<br>**Issue 4** stories · 에셋 · `docs/fe-implement-spec/main-01/` |
| 수정 | `app/routes/_protected.main.tsx` (컴포넌트 연결) · `entities/user/{index,api/index}.ts` (배럴) · `features/auth-logout/index.ts` (배럴) · **Issue 4** `app/styles/tokens.css` · `shared/ui/icon/assets/` + `icons.generated.ts`(재생성) · `docs/design-system/README.md` · `docs/{implementation,migration}-status.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 삭제 | 없음 (`apps/legacy-web`은 편집 금지)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

npm 의존성 추가: **없음.** `zod`는 들이지 않는다 (orval 타입이 필수 필드를 보장).

### 2-1. 이전 매핑

`spec.md` 「이전 매핑 (Migration Map)」이 정본이다. 여기 복사하지 않는다. 이슈별 담당 매핑은 `issues.md`.

---

## 3. 의존 관계 검증

| 지점                                                                                                     | 판정                                                                                                                             |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `widgets/header` → `features/auth-logout` (LogoutButton) + `entities/user` (useUser)                     | 하향. OK                                                                                                                         |
| `widgets/header-narrow` → `entities/user` + `entities/league`                                            | 하향. 두 entity를 widget이 조합한다 (entity끼리 import 없음). OK                                                                 |
| `widgets/growth-summary` → `entities/user` + `entities/league`                                           | 〃                                                                                                                               |
| `widgets/continue-learning` → `entities/learning` + `shared/ui/{card,chip,progress-bar,skeleton,button}` | 하향. OK                                                                                                                         |
| `entities/learning/ui/unit-card` → `Link` (`@tanstack/react-router`)                                     | 외부 패키지. entity UI가 라우팅을 **결정**하진 않는다 — 목적지 `chapterId/unitId`는 데이터에서 온다. 표시 전용 유지              |
| `entities/mission/ui/mission-card` → `Button`, `Link`                                                    | 〃. 목적지는 `getMissionRoute` 결과를 prop으로 받는다                                                                            |
| `widgets/header` 로그아웃 후 `navigate({ to: '/' })`                                                     | 위젯의 라우팅 결정 — ADR-5에서 예외로 명시(전역 계약 C7)                                                                         |
| `shared/ui/card/card-link`                                                                               | `shared`가 `@tanstack/react-router` `Link`를 쓴다. 외부 패키지라 규칙 위반 아님. 기존 `Button asChild` + `Link` 조합과 같은 성격 |
| `pages/main` → widgets 8개                                                                               | 하향. 페이지는 배치만                                                                                                            |
| `app/routes/_protected.main.tsx` → `pages/main`                                                          | 하향. OK                                                                                                                         |

FSD 위반 **없음**. cross-slice 위험 지점: `widgets/continue-learning`이 `recent-unit-card`까지 가지므로
`widgets/recommended-units`와 유닛 카드를 공유해야 한다 → 카드는 `entities/learning/ui/unit-card`에 둔다 (둘 다 하향).

---

## 4. 구현 계획 체크리스트

> **`shared → entities → features → widgets → pages → app` 순서.** 이슈 순서(1→2→3→4)와 레이어 순서가
> 교차하므로 **이슈 안에서** 레이어 순서를 지킨다. 각 항목은 테스트를 같이 만든다.

### Issue 1 — 골격

- [x] `[entities]` `user/api/use-user-profile.ts` — `useGetProfile` adapter, `select`로 `{ nickname, profileImageNumber, level: { level, currentXp, maxXp } }`. 배럴에 `useUserProfile` · `getUserProfileQueryKey` 추가. 프로필 수정 시 `/users`와 함께 무효화한다는 주석(ADR-2)
- [x] `[entities]` `league/model/tiers.ts` — 15종 표 + `getTierById(id)` (범위 밖 → 브론즈 3, E5). 테스트. `league/api/use-league-summary.ts` re-export (`useGetLeague as useLeagueSummary`, key). 배럴
- [x] `[features]` `auth-logout/ui/logout-button.tsx` — `useLogout({ onSuccess: onLoggedOut })`, `Button` 또는 plain button. 배럴 export. 테스트: 클릭 → 세션·캐시 비움 + `onLoggedOut` 1회
- [x] `[widgets]` `header/model/nav-items.ts` — `[{ to, label, icon, activeIcon }]` 4개. `ui/header-wide.tsx` — `GravitLogo` · `Link` × 4(`activeProps={{ 'aria-current': 'page' }}`) · `useUser` → `ProfileAvatar` / 스켈레톤 자리 · `LogoutButton` (항상, AC-5) · `useNavigate` → `/`. `ui/header-narrow.tsx` — `useUserProfile` + `useLeagueSummary` → 아바타 · 「LV {n}」 · 티어 아이콘 자리 · 이름. 로딩·실패는 각 항목 자리만 비운다
- [x] `[widgets]` `bottom-tab-bar/ui/bottom-tab-bar.tsx` — `nav-items`는 헤더 slice 소유라 **cross-slice**. → `nav-items`를 `shared/config/nav-items.ts`로 내린다 (레이블·경로만, 도메인 무관 전역 설정). 헤더·탭바 둘 다 거기서 읽는다. 활성: `Link`의 render-prop `isActive` → 채운 아이콘(Issue 4 전까지 같은 아이콘) + `aria-current`
- [x] `[widgets]` `hero-greeting/ui/hero-greeting.tsx` — `useUserProfile` → 「어서오세요, {nickname}님!」. 로딩: 닉네임 자리 스켈레톤(Issue 2의 `Skeleton` 전이라 `<span aria-busy>` 최소). 실패: 빈 자리 (AC-8). 배경 이미지는 Issue 4 (그 전까지 `SpaceBackground` 색만)
- [x] `[pages]` `main/ui/main-page.tsx` (`useIsWideViewport` 분기) · `main-page-wide.tsx` (HeaderWide + HeroGreeting + 2단 그리드 자리) · `main-page-narrow.tsx` (HeaderNarrow + HeroGreeting + 1단 자리 + BottomTabBar). 테스트: AC-1(요청 횟수) · AC-2 · AC-3 · AC-4 · AC-6
- [x] `[app]` `_protected.main.tsx` `component: MainPage` + 자리 라우트 `_protected.{learning,league,my}.tsx`(`component: () => null`, 타입 라우트 유지 — `docs/routes.md` §3). **라우트 트리 재생성** (`vite build`)
- [x] 증분 검사: `check-types` · `lint` · 변경 파일 `prettier --check` · 관련 테스트

### Issue 2 — 연속 학습일 · 미션 · 공통 셸

- [x] `[shared]` `ui/card/` — `Card`(`<section data-slot="card">`) · `CardHeader` · `CardTitle`(`h2`) · `CardLink`(`Link` 래퍼) · `CardStatus`(`role="status"` 또는 `role="alert"` + message + action). `ui/progress-bar/` — `ProgressBar`(`role="progressbar"` `aria-valuenow/min/max`, 0~100 clamp) · `LabeledProgressBar`. `ui/skeleton/` — `Skeleton`(`aria-hidden`, variant text/circular/block). 최소 클래스만. 배럴 + 기본 story 껍데기
- [x] `[entities]` `learning/model/weekly-streak.ts` — `WEEKDAYS` · `getWeekdayStreaks(record)` (`dayTiming` + `isCompleted` 변환, AC-18). `learning/api/use-weekly-record.ts` — `useQuery({ ...getGetWeeklyRecordQueryOptions(), queryFn: 404→null })` (ADR-4). `learning/ui/weekday-badge.tsx` · `weekly-streak.tsx` (표시 전용)
- [x] `[entities]` `mission/model/mission.ts` — `toMissionProgressPercent(rate)` (가정 0~1 ×100, 확인 필요 D 주석). `mission-route.ts` — `getMissionRoute(type)` (AC-20 테스트). `api/use-daily-mission.ts` re-export. `ui/mission-card.tsx` — props `{ mission, route, isWide, isLoading }`: 설명 · 「완료 시 +{xp} XP」 · `LabeledProgressBar` · 넓은 CTA(`Button asChild` `Link`, 완료면 `Button disabled` 「미션 완료」) / 좁은 카드 링크(완료면 링크 없음)
- [x] `[widgets]` `learning-streak/ui/learning-streak.tsx` — `useWeeklyRecord` → 4상태(pending/error/null/success). 「자세히 보기」→`/league` 항상. `daily-mission/ui/daily-mission.tsx` — `useDailyMission` → error면 `CardStatus` + `refetch`
- [x] `[pages]` 넓은: 우측 컬럼에 배치. 좁은: 상단 연속학습일 → [미션 | (최근학습 자리)] 배치. 테스트 AC-19 · 23 · 24
- [x] 증분 검사

### Issue 3 — 학습 섹션 · 성장 현황

- [x] `[shared]` `ui/chip/chip.tsx` — variant `filled | outlined | muted`, `<span data-slot="chip">`
- [x] `[entities]` `learning/model/unit-progress.ts` — `UnitProgress = { unitId, title, status, order }` · `toUnitProgressList(units)` (order = index+1, 확인 필요 A 주석) · `findNextUnit(units)` (AC-11 테스트). `chapter-progress.ts` — `toChapterProgressPercent(rate)` (가정 0~100). `api/use-recent-learning.ts` (404→null). `api/use-recommended-units.ts` re-export
- [x] `[entities]` `learning/ui/unit-progress-item.tsx` (「Unit {order 2자리}」 · title · `Chip` 3종 「학습 완료」「학습 중」「잠김」) · `unit-progress-list.tsx` · `unit-card.tsx` (title · 「Lesson {unitId 2자리}」 · `Link` to `/learning/$chapterId/$unitId` · `aria-label`; 행성·배경은 Issue 4). `league/ui/tier-badge.tsx` (아이콘 자리 + `leagueName`)
- [x] `[widgets]` `continue-learning/ui/continue-learning-card.tsx` — `useRecentLearning` → 헤더(좁은 화면만 「전체 학습화면 보기」, AC-14) · `LabeledProgressBar` · `UnitProgressList` · CTA 「{order}강 이어서 학습하기」 (`Button asChild` + `Link`, 없으면 미렌더). `recent-unit-card.tsx` — 같은 훅, 첫 유닛 `UnitCard`. `recommended-units/ui/recommended-units.tsx` — 「전체보기」→`/learning`, `UnitCard` 그리드. `growth-summary/ui/growth-summary.tsx` — `useUserProfile` + `useLeagueSummary`, 둘 중 실패면 `CardStatus`(실패한 쿼리만 refetch, AC-10)
- [x] `[pages]` 넓은: 좌측 컬럼 성장현황 → 이어학습 → 추천. 좁은: 최근학습 자리 채움 + 이어학습. 테스트 AC-12~17 · AC-1 완결(6종 각 1회)
- [x] 증분 검사

### Issue 4 — 디자인 · 검증 (Codex)

- [x] `[shared]` `tokens.css` 토큰 판정 반영(확인 필요 9·10) · `icon/assets/{home-fill,level-fill}.svg` + `pnpm generate:icons` · `shared/ui` 4종 cva + stories
- [x] `[entities]` 에셋 반입(티어 15 · 행성 8 · card-bg) · `tier-badge` · `unit-card` · `unit-progress-item` · `weekday-badge` · `mission-card` 시각
- [x] `[widgets]` 히어로 배경 2종 · 헤더 glass · 탭바 · 각 카드 레이아웃 수치
- [x] `[pages]` 넓은/좁은 그리드 · 여백. 스크린샷 ↔ Figma 6축 대조 → `checklist.md`
- [ ] (사용자) 검증: 네트워크 탭으로 확인 필요 A · B · D 판정 → `model/` 함수 수정. 신규 계정 404 확인(C)
- [x] `ai-validate` → `checklist.md` · 문서 승격(§6)

---

## 5. 리스크

| 리스크                                                               | 영향                                           | 대응                                                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `node_modules` 심링크가 옛 경로 (`project/gravit-web-v2/…`)          | lint · check-types · prettier 전부 실패        | `pnpm install` 완료 후 착수. 실패가 남으면 환경 원인인지 코드 원인인지 먼저 구분                           |
| `progressRate` 단위 미확정 (미션 0~1 / 챕터 0~100 가정)              | 게이지가 항상 0% 또는 100%                     | 변환 함수 하나(`toMissionProgressPercent` · `toChapterProgressPercent`)에 가정을 모은다. Issue 4에서 확정  |
| 「Unit NN」 · 「N강」 번호 규칙 미확정                               | 번호가 「Unit 37」처럼 나옴                    | `toUnitProgressList`의 `order` 계산 한 곳. legacy 개념노트가 index+1이라 그쪽을 기본값으로                 |
| `learning` · `weekly-record` 404 = 빈 상태 (명세 근거, 실측 전)      | 신규 계정이 에러 UI를 봄                       | ADR-4 adapter. 404 이외는 그대로 에러. Issue 4에서 신규 계정으로 실측                                      |
| 생성 MSW 핸들러의 `delay(600)`                                       | 테스트가 느려지고 `waitFor` 타임아웃           | 테스트는 `http.get` 직접 등록 (`oauth-callback-page.test.tsx` 방식). 생성 응답 mock 함수만 재사용          |
| `Button asChild` + `disabled` — 완료 미션 CTA                        | `asChild`와 `disabled`는 `<a>`에 성립하지 않음 | 완료면 `asChild` 없이 `<Button disabled>`, 미완료면 `<Button asChild><Link/></Button>` 분기 (함정 12 준수) |
| 헤더가 `/users`, 좁은 헤더·인사말이 `/main-pages/profile` — 캐시 2벌 | 프로필 수정 후 한쪽만 갱신                     | ADR-2. `entities/user/api` 배럴 주석 + 프로필 수정 `MIG-`에서 둘 다 무효화                                 |
| Tailwind가 런타임 문자열 클래스를 못 봄 (`md:` 조합)                 | 넓은/좁은 분기가 안 먹음                       | 화면 구조는 컴포넌트 분기(`useIsWideViewport`), 크기 차이만 리터럴 `md:` 클래스                            |

### 5-1. 동일성 확인 계획

| 방법        | 무엇을                                                                                                                                                                                                  | Issue |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---: |
| 자동 · 단위 | `getTierById` · `getWeekdayStatuses`(수·일요일) · `getMissionRoute` · `findNextUnit` · `toUnitProgressList` · 진행률 변환 2종                                                                           |  1~3  |
| 자동 · 통합 | 페이지 렌더(MSW): AC-1 요청 횟수(6종 각 1회, `learning` 중복 0) · AC-2/3 구조 · AC-4 `aria-current` · AC-6 로그아웃 이동 · AC-10/23 부분 재시도 · AC-12/16/17 href · AC-22 disabled · AC-24 `aria-busy` |  1~3  |
| 자동 · 통합 | 404 → 빈 상태 / 500 → 재시도 (AC-15) — `weekly-record` · `learning` 각각                                                                                                                                |  2·3  |
| 수동 스모크 | 로그인 → `/main` → 헤더 4개 이동 → 뒤로 → 로그아웃 → `/`. 좁은 화면(DevTools 360px)에서 탭바 이동                                                                                                       |   4   |
| 네트워크 탭 | 실제 응답: `unitId` 값(순번인지) · `unitTitle` vs `chapterTitle` · `progressRate` 범위 · 신규 계정 404                                                                                                  |   4   |
| 명시적 대조 | 기준선 B2/C1 목적지 4개 · D2 문구 · F10 문구 · J3 문구(「완료 시 +15 XP」) · 계약 C1~C9 표를 `checklist.md`에 하나씩                                                                                    |   4   |

---

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동 (Issue 4 끝난 뒤)
- [ ] `docs/implementation-status.md` MAIN-01 WEB·MOB 구현 열 갱신
- [ ] `docs/migration-status.md` §3 메인 행(기준선 ✅ · 대체 구현 ✅ · 동작 검증) · §4 「메인 위젯」 「Sidebar」(useUserInfo 폐기) 행 · §5 `/mains` · `widgets/main/model/hooks.ts` 폐기 추가 · §6 「`/main`과 `/mains`」 차단 항목 해소
- [ ] 확정 명세를 `docs/fe-implement-spec/main-01/main-01.md`로 승격 (+ PNG 2장)
- [ ] `docs/design-system/README.md` §4 토큰 판정 반영 (Issue 4)
- [ ] 새 규칙: 「404를 빈 상태로 다루는 adapter 패턴」이 재사용되면 `api-convention.md`에 추가 검토 (이번엔 spec ADR-4에만)
