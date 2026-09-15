---
id: 'MIG-025'
validated: '2026-09-11'
mode: 'migrate'
---

# MIG-025 검증 결과

> `ai-validate` 산출물. Issue 1~4 전체. 재검증 횟수: 1회 (Issue 3 도중 페이지 테스트에 미등록 MSW 핸들러 추가).

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                                                          |
| --- | --------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ eslint · steiger 「No problems found」                     |
| 2   | 타입            | `pnpm check-types`                                 | ✅ 0 errors                                                   |
| 3   | 테스트          | `pnpm test`                                        | ✅ 38 파일 197개 (신규 24 파일·73개). 3회 연속 통과           |
| 4   | 빌드            | `pnpm build`                                       | ✅                                                            |
| 5   | 포맷            | `pnpm exec prettier --check <변경 파일 46개>`      | ✅ (`tokens.css` 주석 길이로 1회 실패 → 주석 줄바꿈으로 해결) |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 0건 (`shared/api/mocks/browser.ts`는 shared 안이라 허용)   |

`pnpm format:check` 전체는 `REF-003` 기존 사유로 실패한다. 이번 변경 파일은 전부 통과.

## 2. 요구사항 ↔ 구현 대조

| AC    | 요구사항                                                   | 구현 위치                                                                                                                  | 상태 |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---- |
| AC-1  | 진입 시 main-pages 6종 + users 각 1회, 중복 없음           | `pages/main/ui/main-page.test.tsx` 「main-pages 6종 + users」 · 「좁은 화면은 users·units 를 부르지 않고」                 | ✅   |
| AC-2  | 넓은 화면 헤더·히어로, 탭바 없음                           | `main-page.test.tsx` AC-2                                                                                                  | ✅   |
| AC-3  | 좁은 화면 LV·티어 헤더 + 탭바 4, 넓은 헤더 없음            | `main-page.test.tsx` AC-3                                                                                                  | ✅   |
| AC-4  | 「홈」만 `aria-current="page"`                             | `main-page.test.tsx` AC-4 ×2 (네비·탭바)                                                                                   | ✅   |
| AC-5  | users 실패에도 「로그아웃」 존재                           | `main-page.test.tsx` AC-5 · `widgets/header/ui/header.tsx`                                                                 | ✅   |
| AC-6  | 로그아웃 → 세션·캐시 clear → `/`                           | `main-page.test.tsx` AC-6 · `features/auth-logout/ui/logout-button.test.tsx`                                               | ✅   |
| AC-7  | 「어서오세요, 땅콩님!」 + 부제                             | `main-page.test.tsx` AC-7 · `widgets/hero-greeting`                                                                        | ✅   |
| AC-8  | profile 실패 시 히어로에 에러 UI 없음                      | `main-page.test.tsx` AC-8 (히어로 범위로 한정 — 성장 현황은 E7대로 에러 UI)                                                | ✅   |
| AC-9  | 레벨·XP / 티어·LP 게이지 값                                | `widgets/growth-summary/ui/growth-summary.test.tsx` AC-9                                                                   | ✅   |
| AC-10 | league만 실패 → 카드 전체 에러, 재시도는 league만          | `growth-summary.test.tsx` AC-10                                                                                            | ✅   |
| AC-11 | 다음 유닛 계산 (순번 2 / null / [])                        | `entities/learning/model/unit-progress.test.ts`                                                                            | ✅   |
| AC-12 | 챕터·진행률·행 3(순번+칩 3종)·「2강 이어서 학습하기」      | `widgets/continue-learning/ui/continue-learning-card.test.tsx` AC-12                                                       | ✅   |
| AC-13 | 전부 완료 → CTA 없음                                       | `continue-learning-card.test.tsx` AC-13                                                                                    | ✅   |
| AC-14 | 「전체 학습화면 보기」가 다음 유닛으로 이동                | `continue-learning-card.test.tsx` AC-14                                                                                    | ✅   |
| AC-15 | 404 → 빈 상태 / 500 → 재시도                               | `continue-learning-card.test.tsx` · `widgets/learning-streak/ui/learning-streak.test.tsx` · `shared/api/not-found.test.ts` | ✅   |
| AC-16 | 최근 학습 카드 = 첫 유닛, `/learning/7/11`                 | `continue-learning-card.test.tsx` RecentUnitCard                                                                           | ✅   |
| AC-17 | 추천 카드 2장 · `chapterTitle` · Lesson 21 · 「전체보기」  | `widgets/recommended-units/ui/recommended-units.test.tsx`                                                                  | ✅   |
| AC-18 | 요일 상태 (수요일 · 일요일 케이스)                         | `entities/learning/model/weekly-streak.test.ts`                                                                            | ✅   |
| AC-19 | 「5」「일 연속」 · 뱃지 7 · 「자세히 보기」 · learning 0회 | `learning-streak.test.tsx` AC-19                                                                                           | ✅   |
| AC-20 | 미션 목적지                                                | `entities/mission/model/mission.test.ts` · `widgets/daily-mission/ui/daily-mission.test.tsx`                               | ✅   |
| AC-21 | 미션 문구·진행률·CTA/카드 링크                             | `daily-mission.test.tsx` AC-21 ×2                                                                                          | ✅   |
| AC-22 | 완료 → CTA disabled 「미션 완료」 / 카드 링크 없음         | `daily-mission.test.tsx` AC-22 ×2                                                                                          | ✅   |
| AC-23 | mission만 500 → 미션만 에러, 재시도 1회                    | `daily-mission.test.tsx` AC-23                                                                                             | ✅   |
| AC-24 | 로딩 중 제목 표시 + 본문 `aria-busy`                       | `learning-streak` · `daily-mission` · `continue-learning-card` 테스트 AC-24                                                | ✅   |

### 확정 명세 확인 필요 (실서버 응답 확인 전)

| 항목                        | 현재 구현                              | 확인 방법                                           | 상태           |
| --------------------------- | -------------------------------------- | --------------------------------------------------- | -------------- |
| A. 「Unit NN」·「N강」 번호 | 목록 순번 (`toUnitProgressList` order) | 네트워크 탭 `/main-pages/learning` `units[].unitId` | ⬜ 사용자 확인 |
| B. 추천 카드 제목           | `chapterTitle`                         | `/main-pages/units` `unitTitle` vs `chapterTitle`   | ⬜ 사용자 확인 |
| C. 404 빈 상태 문구         | 「아직 학습 기록이 없어요.」 (임시)    | 신규 계정 진입. 시안 확정 시 교체                   | ⬜ 시안 대기   |
| D. `progressRate` 단위      | 미션 ×100 / 챕터 그대로                | 네트워크 탭 두 응답의 값 범위                       | ⬜ 사용자 확인 |

넷 다 함수 하나(`toUnitProgressList` · `RecommendedUnits` 한 줄 · `toMissionProgressPercent` · `toChapterProgressPercent`)에 모여 있다.

## 3. 이전 검증

| 항목                                      | 결과                                                                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec.md` 이전 매핑이 **전량** 반영되었나 | ✅ shared 7 · entities 13 · features 1 · widgets 10 · pages/app 3 — 전부 대응 파일 존재. 폐기 3건(`/mains` · `useUserInfo` · `section-card`)은 만들지 않음 |
| 동작 동일성 — 기준선 A~K가 유지되나       | ✅ 아래 「의도적으로 바꾼 것」 외 전부 유지. C1~C9 계약은 AC 테스트로 고정                                                                                 |
| 의도적으로 바꾼 동작만 바뀌었나           | ✅ 아래 표 8건. 전부 시안 대조 게이트에서 사용자 판정                                                                                                      |
| 이전 후 남은 legacy 참조가 없나           | ✅ `rg` 로 `widgets/main-page` · `entities/sidebar` · `shared/ui/hero` · `@generated` 검색 — `apps/web/src` 0건                                            |

### 의도적으로 바꾼 것

| #   | 항목                                                                                      | 기준선       | 이유                                                                |
| --- | ----------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| 1   | 유닛 상태 3종 (「학습 완료」「학습 중」「잠김」)                                          | F5·F6        | legacy가 `status` enum을 안 읽던 결함. 시안 #6 고침 (사용자 판정 1) |
| 2   | 다음 유닛 = 완료되지 않은 첫 유닛                                                         | F7           | 1의 결과. legacy는 항상 첫 유닛이었다                               |
| 3   | 티어 이름 `leagueName` 표시                                                               | E4           | 「브론즈 3」 고정 결함. 시안 #15 (사용자 판정 2)                    |
| 4   | 연속 학습일이 `learning`을 부르지 않음                                                    | I1           | 명세 변경 — `consecutiveSolvedDays`가 weekly-record로 이동          |
| 5   | 미션 완료 시 CTA 비활성 「미션 완료」 / 카드 링크 없음                                    | J5           | 시안 #27 (사용자 판정 8)                                            |
| 6   | 좁은 화면 상단 헤더 (아바타·LV·티어) 신설                                                 | A5           | 시안 #3 (사용자 판정 5). 벨은 제외                                  |
| 7   | 404를 빈 상태로 (재시도 없음)                                                             | —            | 명세상 기록 없음 = 404. ADR-4                                       |
| 8   | 문구 — 「완료 시 +15 XP」 · 「전체보기」 · 「이어서 학습하기를」 · 「전체 학습화면 보기」 | J3·G2·F10·F2 | 시안 #12·#9·F10 조사. 헤더 링크는 두 레이아웃에 표시                |
| 9   | 헤더 「로그아웃」 항상 표시                                                               | B6           | 시안 #28. 프로필 실패로 로그아웃 수단이 사라지지 않게               |
| 10  | 프로필 조회를 `/users` + `/main-pages/profile`로 (my-page 제거)                           | B5           | ADR-2                                                               |
| 11  | 미션 목적지 `/user/addfriend` → `/my/friends/search`                                      | J7           | `docs/routes.md`                                                    |
| 12  | 범위 밖 챕터 행성 이미지 없음 (깨진 이미지 대신)                                          | G6           | `undefined` src 방지                                                |

## 4. 시안 대조 재확인

Figma `MAIN-01-WEB`(`13750:65724`) · `MAIN-01-MOB`(`13750:50580`). MSW 목 데이터로 1920×1080 · 360×740 스크린샷을 찍어 6축 대조했다.

| #   | 「고침」 판정 항목           | 반영됨 | 비고                                           |
| --- | ---------------------------- | ------ | ---------------------------------------------- |
| 3   | 좁은 화면 상단 헤더          | ✅     | 아바타·티어 아이콘을 흰 20% 원 안에            |
| 4   | 「전체 학습화면 보기」       | ✅     | 사용자 판정에 따라 두 레이아웃에 표시          |
| 6   | 유닛 상태 칩 3종 + 문구      | ✅     | `Chip` outlined/filled/muted                   |
| 7   | 「학습 중」 행 테두리 `main` | ✅     |                                                |
| 9   | 「전체보기」                 | ✅     |                                                |
| 12  | 「완료 시 +15 XP」           | ✅     |                                                |
| 15  | 티어 이름                    | ✅     | 아이콘 15종 반입 (`entities/league/ui/assets`) |
| 28  | 로그아웃 항상                | ✅     |                                                |

### 토큰 판정 (시안 대조 ① #29~40)

| Figma                                         | 결정                                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `brand/main/2` (#9b00cf)                      | Alias Token 페이지 값이 **#9b00cf = `cta`** 다. 호환 `main-2`(#8100b3)와 다르다 → `cta` 사용                          |
| `color/purple/50` (#fbf2ff)                   | primitive만 있어 **`--color-purple-50` 별칭 승격** (`tokens.css` ALIAS - Purple)                                      |
| `bg/0`                                        | `bg-white`                                                                                                            |
| `color/gray/0` `gray/50`                      | `text-1-w`(#fff) / `cta-text`(#fbfbfb). 히어로 글자 #f8f8f8은 `text-1-w`로 (어두운 배경 위 차이 없음)                 |
| `color/gray/700` (성장 구분선)                | `divider-1`. 별칭 없음 — 미세 차이 기록                                                                               |
| `schemes/secondary` (탭바 비활성)             | 토큰 없음 → `text-3`. **디자이너 확정 필요**                                                                          |
| `main/gr` 그라데이션                          | Dev Mode 값 `#8100b3 → #dd00ff` 확인 → **`--background-image-brand-gradient`** 신설. 호환 `main-gr`는 그대로 (미사용) |
| 카드 그림자 `0 4px 32px 0 #00000006` · 테두리 | 그림자는 `Card`에 직접 적용 후 토큰 확정 대기 · 미확정 테두리는 넣지 않음                                             |

### 시각 차이 — 남은 것

- 추천 유닛 카드의 행성이 시안보다 약간 크다 (시안 ~170px, 구현 `md:w-1/2`=184px). 토큰 없는 수치라 유지
- 연한 카드 테두리 없음 (위 표)
- 벨 아이콘 · AI면접 네비 없음 (Out of Scope)
- 로딩·에러·빈 상태는 시안 프레임이 없어 현행 동작 그대로 (문구 임시)

## 5. 기준 문서 갱신

| 대상                              | 갱신 내용                                                                                    | 상태 |
| --------------------------------- | -------------------------------------------------------------------------------------------- | ---- |
| `docs/implementation-status.md`   | MAIN-01 (현 브랜치 표기 `M.1.1`) Web 구현 ✅ · 시안 대조 ✅ · 기능 검증 🚧(실서버 확인 대기) | ✅   |
| `docs/migration-status.md`        | §3 메인 행 기준선·대체 ✅ / §4 메인 위젯 · Sidebar / §5 `/mains` 폐기 / §6 차단 항목 해소    | ✅   |
| `docs/design-system/README.md`    | §3 purple-50 별칭 · brand-gradient / §4 `main-gr` 대체 / 아이콘 89종                         | ✅   |
| `docs/fe-implement-spec/main-01/` | 확정 명세 승격                                                                               | ✅   |
| `docs/routes.md`                  | 신설 (라우트 검토)                                                                           | ✅   |

### 중간에 막혔던 지점 — 스킬에 반영할 것

1. **`node_modules` 심링크가 옛 경로를 가리켰다.** 레포를 `gravit-workspace/` 아래로 옮긴 뒤 `pnpm install`을 안 해서
   `@repo/typescript-config`가 깨져 check-types·vitest·vite build 전부 실패했다. → `ai-plan` 착수 게이트에
   「환경 검사: `pnpm --filter @repo/web check-types` 한 번」을 넣으면 코드 원인과 구분된다.
2. **자리 라우트를 `x.tsx`로 두면 하위 경로가 갇힌다.** `_protected.my.tsx`(null 컴포넌트)가 있으면
   `/my/friends/search`가 그 안에서 렌더돼 안 보인다. → `x.index.tsx`로 둔다 (`docs/routes.md` §3에 기록).
3. **Bash heredoc가 긴 파일에서 간헐적으로 깨졌다** (`unexpected EOF`). Write 도구로 우회. 원인 미확인.
4. **`ComponentProps<typeof Link>`로 감싼 링크는 `params` 타입을 잃는다.** `createLink()`로 감싸야
   `to`·`params` 라우트 타입이 유지된다 (`shared/ui/card/card-link.tsx`).
5. **페이지에 위젯을 추가할 때마다 페이지 테스트의 MSW 핸들러도 늘려야 한다.** 미등록 요청은
   `onUnhandledRequest: 'error'`로 실패한다. 이번엔 `sectionHandlers()`로 묶었다.
6. **`prettier --write "src/**/\*.tsx"` 같은 glob은 REF-003 대상 파일까지 건드릴 수 있다.\*\* 변경 파일 목록을 명시해서 돌린다 (이번엔 운 좋게 tsx 6개가 대상이 아니었다).
