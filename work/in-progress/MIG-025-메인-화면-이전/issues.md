---
id: 'MIG-025'
---

# MIG-025 이슈 분해

> `refactor-planner` 2026-09-11. 기준은 **동작 보존 단위** — "이 이슈만 끝나도 사용자 동작이
> 그대로 유지되는가". AC 번호는 `spec.md` 「확정 명세」와 같다. 레이어별 수평 분할이 아니다.
>
> **로직 / 디자인 분담** — Issue 1~3은 로직(구조·조회·분기·테스트)이며 시각은 최소 마크업 +
> `data-slot` · aria 계약만 고정한다. Issue 4가 시안을 맞추고 검증한다 (Codex).

## 수직 슬라이싱 원칙

> **"이 이슈만 완료하면 사용자에게 보여줄 수 있는 동작이 있는가?"**

---

## Issue 1: [MIG] 메인 골격 — 라우트 · 넓은/좁은 페이지 · 헤더 · 탭바 · 히어로 인사말

GitHub Issue: 미등록

### 설명

`/main`이 빈 화면에서 벗어난다. 로그인한 사용자가 헤더(로그아웃 포함)·인사말·하단 탭바를 보고
다른 화면으로 이동할 수 있다. 섹션 5개는 자리만 있고 다음 이슈에서 채운다.

### 관련 결정

- 기준선: `spec.md` A1~A7 · B1~B7 · C1~C3 · D1~D4 / 동작 계약 C1 · C6 · C7 · C8
- ADR: ADR-2(프로필 2원화) · ADR-5(페이지가 배치) · 시안 대조 #3(좁은 헤더 신규) · #28(로그아웃 항상)

### 이 이슈가 담당하는 매핑

| 현재 경로                                                | 목표 경로                                                                  | 변경 종류 |
| -------------------------------------------------------- | -------------------------------------------------------------------------- | --------- |
| `mainpage-api` `useGetProfile`                           | `entities/user/api/use-user-profile.ts`                                    | adapter   |
| `shared/lib/tiers.ts`                                    | `entities/league/model/tiers.ts` (id → 이름, 아이콘 키)                    | 이동      |
| `mainpage-api` `useGetLeague`                            | `entities/league/api/use-league-summary.ts`                                | re-export |
| `widgets/header/ui/header-content.tsx` 로그아웃 버튼     | `features/auth-logout/ui/logout-button.tsx`                                | 추출      |
| `widgets/header/` · `config/nav.ts`                      | `widgets/header/ui/{header-wide,header-narrow}.tsx` · `model/nav-items.ts` | 재작성    |
| `widgets/bottom-tab-bar/bottom-tab-bar.tsx`              | `widgets/bottom-tab-bar/ui/bottom-tab-bar.tsx`                             | 이동      |
| `widgets/main-page/main-greeting.tsx` + `shared/ui/hero` | `widgets/hero-greeting/ui/hero-greeting.tsx`                               | 병합      |
| `main/{main,_components/*}.tsx`                          | `pages/main/ui/{main-page,main-page-wide,main-page-narrow}.tsx`            | 이동      |
| `main/route.tsx`                                         | `app/routes/_protected.main.tsx`                                           | 연결      |

### 구현 범위

`entities/user` `entities/league` `features/auth-logout` `widgets/header` `widgets/bottom-tab-bar`
`widgets/hero-greeting` `pages/main` `app/routes/_protected.main.tsx`.
아이콘 `home-fill` · `level-fill` 반입은 Issue 4 — 그 전까지 탭바 활성 아이콘은 선 아이콘으로 둔다.

### 완료 조건

☑ **AC-1** (통합) 세션 토큰이 있을 때 `/main` 진입 → 「어서오세요, 」가 보이고 넓은 화면 `profile` `users` 각 1회 ·
좁은 화면 `profile` `league` 각 1회 (`league`는 넓은 화면에서 Issue 3 성장 현황이 부른다)
☑ **AC-2** (통합) 넓은 화면 → 헤더(로고 · 네비 4 · 아바타 · 「로그아웃」) + 히어로, 탭바 없음
☑ **AC-3** (통합) 좁은 화면 → 헤더(아바타 + 「LV {level}」 · 티어 아이콘 + `leagueName`) + 히어로 + 탭바 4개, 넓은 헤더 없음
☑ **AC-4** (통합) `/main`에서 네비·탭바의 「홈」만 `aria-current="page"`, href는 `/main` `/learning` `/league` `/my`
☑ **AC-5** (통합) `useUser` 로딩/실패 중에도 「로그아웃」 버튼 존재
☑ **AC-6** (통합) 「로그아웃」 클릭 → 세션 삭제 · 캐시 clear · `/`로 이동
☑ **AC-7** (통합) `profile` `{ nickname: '땅콩' }` → 「어서오세요, 땅콩님!」 + 부제
☑ **AC-8** (통합) `profile` 실패 → 「어서오세요, 」와 부제만, 에러 UI 없음

### 의존성

없음 (`pnpm install` 완료 후)

---

## Issue 2: [MIG] 연속 학습일 + 오늘의 미션 + 섹션 공통 셸

GitHub Issue: 미등록

### 설명

오른쪽 컬럼(넓은) / 상단 두 카드(좁은)가 동작한다. 섹션 공통 셸(카드 · 상태 · 게이지 · 스켈레톤)의
**구조와 aria 계약**을 여기서 처음 정한다 — 이후 이슈가 같은 셸을 쓴다.

### 관련 결정

- 기준선: I1~I8 · J1~J8 / 동작 계약 C2 · C3 · C5 · C9
- ADR: ADR-1 · ADR-3 · ADR-4(weekly-record 404) · ADR-6 / 시안 대조 #12 · #22 · #27(완료 시 CTA 비활성)

### 이 이슈가 담당하는 매핑

| 현재 경로                                                                           | 목표 경로                                                                           | 변경 종류 |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| `shared/ui/card/card.tsx` · `main-page/ui/{section-status,main-section-error}.tsx`  | `shared/ui/card/{card,card-status}.tsx` (최소 마크업)                               | 병합      |
| `shared/ui/progress-bar/*` · `shared/ui/skeleton/*`                                 | `shared/ui/progress-bar/` · `shared/ui/skeleton/` (최소 마크업 + aria)              | 재작성    |
| `shared/ui/weekly-streak/` · `badge/day-badge.tsx` · `learning-streak-body.tsx`     | `entities/learning/model/weekly-streak.ts` + `ui/{weekly-streak,weekday-badge}.tsx` | 분리      |
| `mainpage-api` `useGetWeeklyRecord`                                                 | `entities/learning/api/use-weekly-record.ts` (404 → null)                           | adapter   |
| `widgets/main-page/streak-section.tsx`                                              | `widgets/learning-streak/ui/learning-streak.tsx` (`learning` 조회 제거)             | 병합      |
| `entities/mission/model/schema.ts` · `lib/get-mission-url.ts` · `MISSION_LABEL_MAP` | `entities/mission/model/{mission,mission-route}.ts`                                 | 재작성    |
| `mainpage-api` `useGetMission`                                                      | `entities/mission/api/use-daily-mission.ts`                                         | re-export |
| `entities/mission/mission-card.tsx`                                                 | `entities/mission/ui/mission-card.tsx`                                              | 재작성    |
| `widgets/main-page/mission-section.tsx`                                             | `widgets/daily-mission/ui/daily-mission.tsx`                                        | 이동      |

### 구현 범위

`shared/ui/{card,progress-bar,skeleton}` `entities/learning`(weekly만) `entities/mission`
`widgets/learning-streak` `widgets/daily-mission` + `pages/main` 배치.

### 완료 조건

☑ **AC-18** (단위) 오늘=수, 월·화·수 `true` → 월·화 `completed` · 수 `today` · 목~일 `upcoming`; 일요일 케이스
☑ **AC-19** (통합) `{ consecutiveSolvedDays: 5 }` → 「5」「일 연속」 · 뱃지 7 · 「자세히 보기」→`/league` · `learning` 요청 0회
☑ **AC-15(연속)** (통합) `weekly-record` 404 → 빈 상태(임시 문구), 500 → 「다시 시도」
☑ **AC-20** (단위) `FOLLOW_NEW_FRIEND`→`/my/friends/search`, 그 외·미지 타입→`/learning`
☑ **AC-21** (통합) 미션 응답 → 「레슨 4개 완료하기」「완료 시 +15 XP」「진행률」「50%」, 넓은 CTA href `/learning`, 좁은 카드 링크
☑ **AC-22** (통합) `isCompleted: true` → CTA `disabled` + 「미션 완료」, 좁은 화면 카드 링크 아님
☑ **AC-23** (통합·MSW) `mission`만 500 → 미션만 에러 UI, 「다시 시도」 → `mission`만 1회 재요청
☑ **AC-24** (통합) 로딩 중 카드 제목 표시 + 본문 `aria-busy="true"`

### 의존성

Issue 1 완료 후 시작 (페이지 골격에 배치)

---

## Issue 3: [MIG] 학습 섹션 — 이어서 학습하기 · 최근 학습 · 새 주제 시작하기 · 성장 현황

GitHub Issue: 미등록

### 설명

메인의 핵심 동선과 넓은 화면 왼쪽 컬럼이 채워진다. 최근 챕터의 유닛 목록과 「N강 이어서 학습하기」
CTA가 다음 유닛으로 가고, 유닛 상태가 API `status`대로 3종으로 나온다(legacy 결함 F6 수정). 추천 유닛
카드와 레벨·XP / 티어·LP 게이지가 동작하고 티어 이름이 `leagueName`으로 나온다(E4 수정).
전부 `entities/learning`·게이지를 공유하므로 한 이슈로 묶는다 (2026-09-11 사용자 결정).

### 관련 결정

- 기준선: E1~E7 · F1~F10 · G1~G7 · H1~H4 / 동작 계약 C2 · C3 · C4 · C5
- ADR: ADR-1 · ADR-2 · ADR-4(learning 404) · ADR-6(순번·다음 유닛) / 시안 대조 #4 · #5 · #6 · #7 · #9 · #10 · #15 · #16 / 확정 명세 확인 필요 A · B · C

### 이 이슈가 담당하는 매핑

| 현재 경로                                                                                            | 목표 경로                                                                    | 변경 종류 |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------- |
| `entities/learning/model/schema.ts` (unit 부분)                                                      | `entities/learning/model/{unit-progress,chapter-progress}.ts`                | 재작성    |
| `mainpage-api` `useGetLearning`                                                                      | `entities/learning/api/use-recent-learning.ts` (404 → null)                  | adapter   |
| `shared/ui/chip/chip.tsx`                                                                            | `shared/ui/chip/chip.tsx` (최소 마크업)                                      | 재작성    |
| `entities/unit/{unit-list,unit-item,unit-status-chip}.tsx`                                           | `entities/learning/ui/{unit-progress-list,unit-progress-item}.tsx`           | 재작성    |
| `features/learning/ui/unit-card.tsx` · `bg-card.tsx`                                                 | `entities/learning/ui/unit-card.tsx` (구조만; 행성·배경은 Issue 4)           | 이동      |
| `main-page/{continue-learning-section,unit-list-card,unit-list-scroll-area,recent-unit-section}.tsx` | `widgets/continue-learning/ui/{continue-learning-card,recent-unit-card}.tsx` | 병합      |
| `entities/league/ui/{tier,tier-badge}.tsx`                                                           | `entities/league/ui/tier-badge.tsx` (아이콘은 Issue 4)                       | 재작성    |
| `main-page/{growth-section,user-progress-bar}.tsx` · `progress-card/`                                | `widgets/growth-summary/ui/growth-summary.tsx`                               | 병합      |
| `mainpage-api` `useGetUnits`                                                                         | `entities/learning/api/use-recommended-units.ts`                             | re-export |
| `main-page/{recommended-units-section,recommended-units-list}.tsx`                                   | `widgets/recommended-units/ui/recommended-units.tsx`                         | 병합      |

### 구현 범위

`entities/learning`(unit·chapter·recommended) `entities/league/ui` `shared/ui/chip` `widgets/continue-learning`
`widgets/recommended-units` `widgets/growth-summary` + `pages/main` 배치.

### 완료 조건

☑ **AC-11** (단위) `[COMPLETED, IN_PROGRESS, NOT_STARTED]` → 다음 유닛 = 2번째(순번 2); 전부 완료 → `null`; `[]` → `null`
☑ **AC-12** (통합) 「자료구조」「10%」 · 행 「Unit 01/02/03」 + 칩 「학습 완료」「학습 중」「잠김」 · CTA 「2강 이어서 학습하기」 href `/learning/7/12`
☑ **AC-13** (통합) 전부 완료 → CTA 없음
☑ **AC-14** (통합) 넓은 화면 헤더 우측 링크 없음 / 좁은 화면 「전체 학습화면 보기」 href = 다음 유닛
☑ **AC-15(이어·최근)** (통합) `learning` 404 → 빈 상태, 500 → 「다시 시도」
☑ **AC-16** (통합) 좁은 화면 최근 학습 카드 = 첫 유닛, href `/learning/7/11`
☑ **AC-24** 로딩 계약 동일
☑ **AC-9** (통합) profile + league 응답 → 「땅콩」「LV 1」「31 / 99 XP」 · 「실버 3」「31 / 99 LP」, 게이지 `aria-valuenow` 31
☑ **AC-10** (통합) `league`만 실패 → 카드 전체 에러 UI, 「다시 시도」 → `league`만 재요청
☑ **AC-17** (통합) 추천 2건 → 카드 2장, 「자료구조」(`chapterTitle`) 「Lesson 21」 href `/learning/3/21`, 「전체보기」→`/learning`
☑ **AC-1(완결)** (통합·MSW) 넓은 화면 첫 진입에 6종 각 1회 (`learning`·`profile` 중복 없음)

### 의존성

Issue 2 완료 후 시작 (카드 셸 · 게이지 · 스켈레톤 계약 재사용)

---

## Issue 4: [디자인] 메인 화면 시안 맞춤 — shared/ui · 에셋 · 토큰 · 검증

GitHub Issue: 미등록

### 설명

Issue 1~3이 최소 마크업으로 만든 컴포넌트를 Figma `MAIN-01`에 맞춘다. **동작·aria·data-slot 계약은
바꾸지 않는다** — 테스트가 그대로 통과해야 한다.

### 관련 결정

- 시안 대조 ① 토큰 #29~40 · ② 컴포넌트 #41~50 / 확인 필요 3 · 6 · 9 · 10 (`spec.md` 시안 대조)
- `design-source-policy` §2(MCP 코드 미사용) · §6(미확정 토큰 하드코딩 금지) · `className-convention`

### 구현 범위

- `shared/ui/{card,chip,progress-bar,skeleton}` — cva variant, 토큰 클래스, Storybook stories
- `entities/learning/ui/{unit-progress-item,weekday-badge,unit-card}` · `entities/league/ui/tier-badge` · `entities/mission/ui/mission-card` 시각
- 에셋: 티어 SVG 15종(`entities/league/ui/assets`) · 행성 PNG 8종 + `card-bg`(`entities/learning/ui/assets`) · 히어로 배경 2종(`widgets/hero-greeting/ui/assets`) · `home-fill` `level-fill` → `shared/ui/icon/assets` + `generate:icons`
- 토큰: `main-2` · `purple-50` · `bg-0` · `gray-*` · `schemes/secondary` · `main-gr` 판정 → `tokens.css` + `docs/design-system/README.md` §4 갱신
- `widgets/header` (glass) · `widgets/bottom-tab-bar` · `widgets/hero-greeting` 시각

### 완료 조건

☑ **AC-D1** Issue 1~3의 테스트가 전부 통과한다 (계약 불변)
☑ **AC-D2** `pnpm lint` (steiger 포함) · `check-types` · `build` 통과, 변경 파일 `prettier --check` 통과
☑ **AC-D3** 새 코드에 호환 토큰(`main-1` `main-2` `gray-*`) · raw hex · `rounded-lg` 류 없음 (`grep`)
☑ **AC-D4** `shared/ui` 4종에 대표 상태 story 존재
☑ **AC-D5** 넓은/좁은 화면 스크린샷 ↔ Figma 6축 대조 결과가 `checklist.md`에 기록됨

### 검증 · 문서 승격 (이 이슈의 완료 조건에 포함)

- 네트워크 탭 확인 → 확정 명세 확인 필요 A(유닛 번호) · B(추천 카드 제목) · D(`progressRate` 단위) 판정 → 해당 `model/` 함수·테스트 수정
- 신규 가입 계정으로 404 빈 상태 확인 (C)
- `docs/implementation-status.md` MAIN-01 · `docs/migration-status.md` §3 메인 행 + §4 메인 위젯·Sidebar 행 + §5 `/mains` 폐기 + §6 차단 항목 해소
- `docs/fe-implement-spec/main-01/` 승격

☐ **AC-V1** `spec.md` 확인 필요 A·B·C·D가 판정과 근거(응답 캡처)로 닫힘
☑ **AC-V2** `checklist.md`에 AC-1~24 대조 결과
☑ **AC-V3** 대장 3종 갱신

### 의존성

Issue 3 완료 후 시작. 단 `shared/ui` 4종과 에셋·토큰은 Issue 2 머지 후 병렬 가능 (Codex, 별도 브랜치).

---

## 시퀀스 검토

```
Issue 1 ──▶ Issue 2 ──▶ Issue 3 ──▶ Issue 4(디자인·검증)
                 └──▶ (Issue 4의 shared/ui · 에셋 · 토큰은 여기서부터 병렬 가능)
```

GitHub Issue는 실행 이슈와 1:1로 4개 (2026-09-11 사용자 결정). 브랜치 스택 1 → 2 → 3, 4는 별도.

- [x] 각 의존성이 실제 입력·계약 관계를 근거로 하나 — 2→3은 카드 셸·게이지·스켈레톤 재사용
- [x] 순환 의존성 없음. 디자인(4)은 2 이후 부분 병렬
- [x] 선행 이슈가 빠져 구현 불가능한 구간 없음 — Issue 1은 `pnpm install`만 전제
- [x] Out of Scope(AI면접 · 벨 · 미션 유닛 목록 · 인증 게이트 · 목적지 화면)가 어떤 이슈에도 없음
