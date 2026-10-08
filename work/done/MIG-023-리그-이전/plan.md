---
id: 'MIG-023'
planned: '2026-09-10'
mode: 'migrate'
---

# MIG-023 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: migrate` — legacy-web의 리그 화면을 `apps/web`으로 이전한다. 단, 변경된 시안에 맞춰
랭킹 카드·모달을 재정비하고 반응형·시즌 시작 모달을 추가하므로 **동작 보존(이전) + 승인된 명세 변경**이 함께 있다.
명세 변경분은 `spec.md`의 `확정된 결정`으로 이미 사용자 판정을 받았다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답    | 근거                                                                                                                              |
| --- | ----------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | 예    | 리그 아레나+결과/시작 모달을 web에 이전·DS 적용. 마이페이지 리그 히스토리·앱 셸(헤더/탭바)은 Out of Scope (`spec.md`)             |
| 2   | 반복 비용이나 확장 차단이 있는가    | 예    | league는 web 첫 도메인 엔티티. 지금 이전해야 마이페이지 리그·시즌 기능이 이 위에 쌓인다                                          |
| 3   | 보존할 동작의 기준선이 있는가       | 예    | `spec.md` 현행 동작 기준선 11항목 + 확정 결정. 로직성 항목은 이번에 테스트로 고정                                                |
| 4   | 자동 또는 수동 검증 방법이 있는가   | 예    | 순수 함수(date·level·tier) 단위 테스트 + 라우트 진입 스모크 + 시안 대조. §5-1 참조                                              |
| 5   | 범위를 독립적으로 완료할 수 있는가  | 조건부 | 규모가 커서(6레이어·25+파일) **수직 슬라이스 5단계**로 쪼갠다. 각 단계가 독립 검증 가능 (§4)                                    |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | 예    | 신규 의존성(Radix Dialog)·라우트 트리·MSW를 §5 리스크에 격리. 자동 생성물은 재생성 명령으로만 갱신                              |

### 0-2. 자동 보류 신호

- [x] 동작 변경이 같이 들어감 → **분리 완료**: 명세 변경분은 `spec.md`에서 사용자 승인됨. 순수 이전과 승인된 변경만 있고, 미승인 개선은 없다.
- [x] 한 단위로 완료·검증할 수 없음 → **5개 수직 슬라이스로 분해** (§4). 각 단계 독립 검증.
- [ ] 자동 생성물 직접 수정 → 없음. `routeTree.gen.ts`는 재생성, `generated/`는 건드리지 않음
- [ ] 기존 검증 실패 원인 설명 불가 → 해당 없음
- [ ] 범위 밖 문제 섞임 → 앱 셸(헤더/하단 탭바)은 Out of Scope로 분리

> **규모 참고**: 이 작업은 파일 10개·다중 슬라이스를 초과한다. 정식 흐름상 `refactor-planner`로
> GitHub 이슈를 쪼갤 수 있으나, 한 화면 계열로 응집도가 높아 본 `plan.md`가 5개 수직 슬라이스를
> 의존 순서대로 담는다. 팀 이슈 분리가 필요하면 승인 시 `refactor-planner`를 먼저 돌린다.

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                              | 레이어                          |
| --- | ------------------------------------------------------------------- | ------------------------------- |
| 1   | 남은시간 계산·다음 월요일·xp→레벨·프로필색 순수 유틸                  | `[shared]`                      |
| 2   | 진행 링·모달 공용 UI 프리미티브                                       | `[shared]`                      |
| 3   | league 엔티티: 티어 데이터/아이콘, 조회 훅, 표시 UI(행·대기탭·아바타) | `[entities]`                    |
| 4   | 시즌 헤더+타이머, 티어 셀렉터, 무한스크롤 랭킹 리스트 조립            | `[widgets]`                     |
| 5   | 시즌 결과→시작 순차 모달 조립                                         | `[widgets]`                     |
| 6   | 리그 화면 배치(로딩/에러/대기탭 분기·배경·반응형)                     | `[pages]`                       |
| 7   | `/league` 라우트 등록 + 트리 재생성                                   | `[app]`                         |

## 2. 영향 분석

`rg` 결과: `apps/web`에는 아직 league **화면 코드가 없다**(생성 API·목만 존재). 기존 파일 수정은
라우트 트리 재생성뿐. 대부분 신규.

| 구분 | 파일 |
| ---- | ---- |
| 신규 | §2-1 매핑표의 목표 위치 전체 |
| 수정 | `apps/web/src/app/routeTree.gen.ts` (자동 재생성), `apps/web/package.json` (Radix Dialog 추가 시) |
| 삭제 | 없음 (legacy는 폐기 조건 충족 후 별도 작업, `legacy-web-policy.md`) |

**npm 의존성 추가**: `@radix-ui/react-dialog` (모달 프리미티브, §5 리스크에서 승인 대상) — 또는 미승인 시 대안.

### 2-1. 이전 매핑

| 현재 위치 (legacy)                                             | 목표 위치 (web)                                              | 변경 종류      | import 영향 |
| ------------------------------------------------------------- | ----------------------------------------------------------- | -------------- | ----------- |
| `shared/lib/date.ts` (`getNextMonday`,`getRemainingTime`)     | `shared/lib/date.ts`                                         | 이동           | 신규 소비   |
| `shared/lib/ProfileColor.ts`                                  | `shared/lib/profile-color.ts`                               | 이동/rename    | 신규 소비   |
| `shared/lib/levelTable.ts` (`getLevelInfo`)                   | `shared/lib/level-table.ts`                                 | 이동/rename    | 신규 소비   |
| `shared/ui/progress-bar/progress-ring.tsx`                    | `shared/ui/progress-ring/`                                  | 이동/rename    | 신규 소비   |
| (신규)                                                        | `shared/ui/modal/`                                          | 신규           | —           |
| `shared/lib/tiers.ts` + `shared/assets/icons/tiers/*.svg`(15) | `entities/league/model/tiers.tsx` + 인접 `assets/`          | 이동(도메인화) | 배럴 노출   |
| `entities/league/lib/getTierIcon.ts`                          | `entities/league/lib/get-tier-icon.ts`                      | 이동/rename    | —           |
| `entities/league/model/types.ts`,`mappers.ts`                | `entities/league/model/`                                     | 이동·정리      | —           |
| `entities/league/api/useSeasonInfo.ts` (`enterHome`)         | `entities/league/api/use-league-home.ts` → `useEnterHome`   | 재작성(orval)  | —           |
| `entities/league/api/useLeagueInfo.ts` (`getLeague`)         | `entities/league/api/use-league-info.ts` → `useGetLeague1`  | 재작성(orval)  | —           |
| `.../ranking/api/useUserLeagueProfile.ts`                    | `entities/league/api/use-my-league-profile.ts` → `useGetMyLeagueWithProfile` | 재작성 | — |
| `.../ranking/api/useLeagueRanking.ts`                        | `entities/league/api/use-league-ranking.ts` → `useGetLeagueRanking` | 재작성(infinite) | — |
| `.../ranking/api/useUserLeagueRanking.ts`                    | `entities/league/api/use-my-league-ranking.ts` → `useGetLeagueRankingByUser` | 재작성(infinite) | — |
| `entities/league/ui/UserRankList.tsx`                         | `entities/league/ui/user-rank-row.tsx` (행 단위로 분해)     | 분해·재설계    | widget이 조립 |
| `entities/league/ui/LevelProgressCircle.tsx`                 | `entities/league/ui/level-progress-avatar.tsx`              | 이동, progress-ring 사용 | — |
| `entities/league/ui/WaitingTab.tsx` + mascot                 | `entities/league/ui/waiting-tab.tsx` + 인접 `assets/`       | 이동·DS 적용   | —           |
| `features/league/TierSelector.tsx`                           | `widgets/league-arena/ui/tier-selector.tsx`                 | 이동(위젯화)   | —           |
| `features/league/SeasonEndModal.tsx`                         | `widgets/league-season-modal/ui/season-result-modal.tsx`    | 재설계         | —           |
| (신규)                                                       | `widgets/league-season-modal/ui/season-start-modal.tsx`     | 신규           | —           |
| (신규 오케스트레이션)                                        | `widgets/league-season-modal/ui/league-season-modal.tsx`    | 신규(순차)     | —           |
| (신규)                                                       | `widgets/league-arena/ui/{league-arena,season-timer,ranking-list}.tsx` + `model/use-remaining-time.ts` | 신규 | — |
| `shared/assets/images/bg-dark.png`                           | `pages/league/` 인접 asset                                  | 이동           | —           |
| `pages/_authenticated/_fixed-header-layout/league.tsx`      | `pages/league/ui/league-page.tsx` + `index.ts`             | 재작성         | 라우트가 소비 |
| (신규)                                                       | `app/routes/_protected.league.tsx`                          | 신규           | 트리 재생성 |

## 3. 의존 관계 검증

- 티어 데이터(`tiers`)를 **entities/league**로 내려, 티어 셀렉터(widget)와 결과/시작 모달(widget)이
  같은 소스를 참조 → cross-slice 없이 하향 참조로 해결.
- `progress-ring`·`modal`은 도메인 무관 → **shared/ui**. entities/widgets가 하향 참조.
- `level-progress-avatar`(entities)는 `getLevelInfo`(shared/lib) + `progress-ring`(shared/ui) 조합 → 하향만.
- 랭킹 조회 훅은 entities/league/api에 두고, **조립·무한스크롤·선택 상태는 widget**이 담당(조회와 표시 분리, `api-convention.md`).
- **FSD 위반: 없음.** 모든 참조가 하향.

## 4. 구현 계획 체크리스트

> `shared → entities → widgets → pages → app` 순서. 5개 수직 슬라이스로 묶되, 공용 인프라(슬라이스 0)를 먼저 깐다.

### 슬라이스 0 — 공용 인프라 `[shared]`
- [ ] `[shared]` `shared/lib/date.ts` 이전 + 단위 테스트(`getRemainingTime` 경계: 만료 시 `00시간 00분 00초`)
- [ ] `[shared]` `shared/lib/profile-color.ts` 이전 (`PROFILE_COLORS`,`getProfileColor`)
- [ ] `[shared]` `shared/lib/level-table.ts` 이전 + 단위 테스트(`getLevelInfo` xp→level/progress 경계)
- [ ] `[shared]` `shared/ui/progress-ring/` 이전 (value 0–100, `cn()` 적용) + 배럴
- [ ] `[shared]` `shared/ui/modal/` 신규 (Radix Dialog 기반: focus·Esc·scroll-lock·backdrop, 토큰/cva) + 배럴 + 키보드/포커스 테스트

### 슬라이스 1 — league 엔티티 `[entities]`
- [ ] `[entities]` `entities/league/model/tiers.tsx` + 티어 SVG 15종 인접 이전, `lib/get-tier-icon.ts`
- [ ] `[entities]` `entities/league/model/types.ts`·`mappers.ts` (orval 타입 재사용, 화면용 파생만)
- [ ] `[entities]` `entities/league/api/*` 5종 (orval 훅 래핑, queryKey는 생성 팩토리; 랭킹 2종은 infinite, `enabled` 가드)
- [ ] `[entities]` `entities/league/ui/level-progress-avatar.tsx` (progress-ring + getLevelInfo + 프로필색)
- [ ] `[entities]` `entities/league/ui/user-rank-row.tsx` (표시 전용, **hover 강조**, `001` 3자리)
- [ ] `[entities]` `entities/league/ui/waiting-tab.tsx` + mascot 이전, DS 토큰
- [ ] `[entities]` `entities/league/index.ts` 배럴

### 슬라이스 2 — 아레나 위젯 `[widgets]`
- [ ] `[widgets]` `widgets/league-arena/model/use-remaining-time.ts` (매초 갱신, `getNextMonday` 기준)
- [ ] `[widgets]` `widgets/league-arena/ui/season-timer.tsx` (시즌명 `nowSeason` 그대로 + 타이머 pill, `timer` 아이콘)
- [ ] `[widgets]` `widgets/league-arena/ui/tier-selector.tsx` (15티어 스크롤·선택 확대·가운데 스크롤 유지)
- [ ] `[widgets]` `widgets/league-arena/ui/ranking-list.tsx` (IntersectionObserver 무한스크롤, **끝 fallback 문구 없음**)
- [ ] `[widgets]` `widgets/league-arena/ui/league-arena.tsx` (selectedTierId 상태·본인 메인티어 분기·조립) + 배럴

### 슬라이스 3 — 시즌 모달 위젯 `[widgets]`
- [ ] `[widgets]` `widgets/league-season-modal/ui/season-result-modal.tsx` (티어 이미지+star, `최종티어`/`이번 시즌도 수고했어요.`/`최종 LP`·`최종 순위`/`다음으로`. **최종 LP는 임시 하드코딩 + 제거 조건 주석**)
- [ ] `[widgets]` `widgets/league-season-modal/ui/season-start-modal.tsx` (티어 이미지+star, `시작 티어`/`직전 티어 기준으로 시작 위치가 정해져요!`/`이전 티어 → 새 티어`/`시작 LP`)
- [ ] `[widgets]` `widgets/league-season-modal/ui/league-season-modal.tsx` (종료→시작 순차, `containsPopup`+`lastSeasonPopupDto` 판정) + 배럴

### 슬라이스 4 — 페이지 + 라우트 `[pages]` `[app]`
- [ ] `[pages]` `pages/league/ui/league-page.tsx` (로딩/에러/데이터없음·대기탭 분기·bg-dark·**md 기준 반응형** 레이아웃) + `index.ts`
- [ ] `[app]` `app/routes/_protected.league.tsx` 신규 (`component: LeaguePage`)
- [ ] `[app]` **라우트 트리 재생성** (`pnpm --filter @repo/web dev` 또는 build로 `routeTree.gen.ts` 갱신)

## 5. 리스크

| 리스크 | 영향 | 대응 |
| ------ | ---- | ---- |
| 모달 프리미티브 신규 의존성(`@radix-ui/react-dialog`) | 번들·유지보수 | `component-convention.md` §3가 dialog에 primitive 권장. tree-shakeable·소형. **승인 대상**. 미승인 시 최소 접근성 모달 자체 구현으로 대체 |
| 라우트 트리 미재생성 | 타입검사·라우팅 실패 | §4 마지막 단계에 재생성 명시. 검증 전 필수 |
| `customInstance`는 본문 반환 | `res.data` 이중 접근 시 오류 | 래퍼에서 `res.data` 재접근 금지 (`api-convention.md`) |
| 최종 LP 미제공 | 결과 모달 값 부재 | 임시 하드코딩 + 제거 조건 주석. API 확정 시 교체 |
| MSW 목 시나리오 | dev 표시 확인 | 생성 목(`generated/mocks/league-*`)에서 필요한 것만 `browser.ts` 등록 |
| 앱 셸(헤더/하단 탭바) 부재 | 시안과 크롬 차이 | Out of Scope. `_protected` 하위에 콘텐츠만 마운트, 셸은 별도 작업. 시안 대조 시 제외 |
| 티어 이미지 성능(15 SVG) | 초기 로드 | SVGR import. 측정 전 최적화 안 함(`refactor-checklist.md`) |

### 5-1. 동일성 / 명세 확인 방법

| 방법        | 대상                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| 자동 테스트 | `getRemainingTime`·`getNextMonday`·`getLevelInfo` 경계, `modal` 키보드/포커스         |
| 라우트 진입 | `/league` 진입 → 로딩/에러/데이터없음/대기탭 분기, 시즌명·타이머 표시                  |
| 수동 스모크 | 티어 선택 → 랭킹 전환, 무한스크롤 추가 로드, 본인 메인티어 분기                        |
| 명시적 대조 | 시안(데스크톱/모바일) ↔ 구현 6축 대조 (`design-diff` 재실행), 확정 문구·필드 1:1 확인 |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] `docs/implementation-status.md`에 리그 화면(데스크톱/모바일) 반영
- [ ] `docs/migration-status.md`에 legacy 리그 대체 사실 반영 (폐기 조건 갱신)
- [ ] 확정 명세를 `docs/fe-implement-spec/league/`로 승격
- [ ] progress-ring·modal 규격이 새로 정해졌으면 `docs/design-system/`에 반영
