---
id: 'MIG-023'
title: '리그 페이지 이전 (아레나 + 시즌 결과/시작 모달)'
type: 'migrate'
screen: 'league'
priority: 'medium'
created: '2026-09-10'
revised: '2026-09-10'
---

# MIG-023 — 리그 페이지 이전 (아레나 + 시즌 결과/시작 모달)

## 배경 · 목표

legacy-web의 리그 화면은 디자인 시스템이 적용되지 않은 채 색·크기가 전부 하드코딩되어 있다.
이 화면을 `apps/web`에 FSD 구조로 이전하면서 디자인 시스템(토큰·공용 컴포넌트)을 적용하고,
변경된 Figma 시안(아레나·시즌 결과·시즌 시작)에 맞춰 랭킹 카드와 모달을 재정비한다.
관찰 가능한 동작(진입·상태 분기·무한스크롤·타이머·티어 선택)은 보존한다.

## 범위

- 화면: 리그 아레나(`/league`), 시즌 결과 모달, 시즌 시작 모달
- **반응형**: 모바일(360px)·데스크톱(1920px) 대응. legacy에는 없던 요구.
- 레이어: `pages/league`, `widgets`(랭킹 리스트/티어 셀렉터), `entities/league`, `features/league`, `shared/ui`(progress-ring 등)
- Figma 시안
  - 데스크톱: LG.1 아레나 `12356-27331`, LG.2 결과 `12395-23839`, LG.3 시작 `12933-25548`
  - 모바일: 아레나 `12899-41294`, 결과 `12899-41553`, 시작 `12899-41991`
- 이전 대상 legacy 파일
  - `pages/_authenticated/_fixed-header-layout/league.tsx`
  - `features/league/TierSelector.tsx`, `features/league/SeasonEndModal.tsx`
  - `entities/league/ui/*` (`UserRankList`, `WaitingTab`, `LevelProgressCircle` 등), `entities/league/model/*`, `entities/league/api/*`, `entities/league/ranking/api/*`
  - `shared/lib/date.ts`(`getNextMonday`·`getRemainingTime`), `shared/lib/tiers.ts`, `shared/ui/progress-bar/progress-ring.tsx`

## Out of Scope

- 마이페이지 리그 히스토리/차트 화면(`pages/_authenticated/my/_profile-layout/league.tsx`, `widgets/user/league/*`) — 이번 3개 시안에 없음. 별도 작업.
- 리그 관련 백엔드 API 스펙 변경(신규 필드 추가) 자체 — FE는 확정된 계약을 소비한다. 계약이 없으면 `확인 필요`로 남긴다.
- 시즌명 주차(`Wxx`) 산출 로직을 FE에서 새로 구현하는 것 — 데이터 출처 확정 전까지 하지 않는다.
- 티어 셀렉터를 시안의 육각 메달 배지 형태로 재설계하는 것 — 해당 시안 요소는 플레이스홀더이며 legacy 형식을 유지한다.
- 결과·시작 모달의 티어 그래픽을 시안의 육각 메달로 교체하는 것 — **기존 티어 이미지(`shared/lib/tiers.ts`)를 그대로 쓰고, 주위에 떠다니는 star 장식만 추가**한다.

## 용어 정의 (Ubiquitous Language)

| 용어           | 정의                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| 아레나         | 리그 메인 화면(`/league`). 시즌명·타이머·티어 셀렉터·랭킹 리스트로 구성    |
| 티어           | 브론즈~다이아몬드 × 1/2/3 디비전, 총 15단계 (`shared/lib/tiers.ts`)        |
| 디비전         | 한 티어 등급 내 세부 단계(1/2/3)                                           |
| 시즌 결과 모달 | 지난 시즌 종료 시 노출되는 `시즌 종료!` 모달                               |
| 시즌 시작 모달 | 새 시즌 시작 시 노출되는 `시즌 시작!` 모달 (신규)                          |
| 대기 탭        | 월요일 시즌 전환 집계 중 노출되는 `WaitingTab`(`시즌 정보를 집계중이에요!`) |
| 메인 티어      | 본인이 현재 속한 티어. 이 티어 랭킹은 별도 API로 조회                      |

---

## 현행 동작 기준선 <!-- refactor-baseline 확정 전 초안. 코드 관찰 기준 -->

> legacy 코드에서 관찰 가능한 동작만 기록. 구조·구현 방식은 적지 않는다.

| #   | 동작                                                                                                                          | 확인한 위치 (legacy 경로)                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | 진입 시 `useUserLeagueProfile`·`useSeasonInfo` 로딩 중이면 `로딩중` 표시                                                     | `pages/.../league.tsx:101`                                                             |
| 2   | 조회 에러면 `에러 발생`, 데이터 없으면 `데이터 없음` 표시                                                                    | `pages/.../league.tsx:102-103`                                                         |
| 3   | 월요일 00:00~00:04 구간이면 대기 탭(`시즌 1 종료` / `시즌 정보를 집계중이에요!`)만 표시하고 본문 숨김                          | `pages/.../league.tsx:60-73,119-123`, `entities/league/ui/WaitingTab.tsx`              |
| 4   | `containsPopup && lastSeasonPopupDto && !modalChecked`이면 시즌 종료 모달 표시, `확인` 클릭 시 닫힘                           | `pages/.../league.tsx:125-132`, `features/league/SeasonEndModal.tsx`                   |
| 5   | 시즌명(`nowSeason`)을 상단에 표시                                                                                             | `pages/.../league.tsx:139-141`                                                         |
| 6   | 다음 월요일 0시까지 남은 시간을 매초 `HH시간 MM분 SS초`로 갱신 표시(만료 시 `00시간 00분 00초`)                               | `pages/.../league.tsx:46-55`, `shared/lib/date.ts:11-22`                               |
| 7   | 티어 셀렉터: 15개 티어를 가로 스크롤. 선택 티어 아이콘 1.35배·밝기 100%, 미선택 40%. 선택 티어만 이름·`LP min - max` 표시     | `features/league/TierSelector.tsx`, `shared/lib/tiers.ts`                              |
| 8   | 티어 선택 시 해당 버튼을 컨테이너 가운데로 smooth 스크롤                                                                      | `features/league/TierSelector.tsx:40-58`                                               |
| 9   | 선택 티어가 본인 메인 티어면 `useUserLeagueRanking`, 아니면 `useLeagueRanking(tierId)`로 랭킹 조회                            | `pages/.../league.tsx:36-40`                                                           |
| 10  | 랭킹 행: `순위 3자리(001)`, xp 진행 링 안 프로필, 닉네임, `LV`/`LP`. 본인 행은 핑크 테두리·흰 배경으로 강조                    | `entities/league/ui/UserRankList.tsx`, `entities/league/ui/LevelProgressCircle.tsx`    |
| 11  | 랭킹 리스트 하단 도달 시 다음 페이지 무한 조회, 더 없으면 `더 이상 유저가 없습니다.` 표시                                     | `pages/.../league.tsx:78-99,174`                                                       |

## 시안 대조 결과 <!-- 사용자 판정 반영본 (2026-09-10) -->

| #   | 항목                  | 현행                                                  | 시안                                                                             | 판정                            |
| --- | --------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------- |
| 1   | 타이머 포맷           | `HH시간 MM분 SS초`                                    | `999시간 88분 25초` (동일 포맷)                                                  | 유지 (변경 없음)                |
| 2   | 시즌명                | `nowSeason` 그대로                                     | `nowSeason` 그대로 (시안의 `2025-W41`·`그래빗 리그 시즌 1`은 플레이스홀더)        | 유지 (값 그대로 표시)           |
| 3   | 티어 셀렉터           | 15티어 일러스트 가로 스크롤                            | 육각 메달 배지 3개 + `마스터`                                                     | 유지 (시안 요소는 플레이스홀더) |
| 4   | 대기 탭               | 월요일 집계 중 `WaitingTab` 표시                      | 시안 없음                                                                         | 유지                            |
| 5   | 랭킹 카드 스타일      | 하드코딩 색/크기, `LevelProgressCircle`               | DS 토큰 카드, 프로필 진행 링                                                      | 고침 (공용 `progress-ring` 사용) |
| 6   | 랭킹 본인 행 강조     | `highlightUserId` 본인 행 상시 강조(핑크 테두리·흰 배경) | 본인 행 상시 강조 없음. 행 강조는 **hover 효과**                                  | 고침 (상시 강조 → hover)        |
| 7   | 리스트 끝 fallback    | `더 이상 유저가 없습니다.` 문구                        | 문구 없음                                                                         | 고침 (문구 제거)                |
| 8   | 시즌 결과 모달        | 흰 모달, `N등`, 나뭇잎 장식, 프로필 원, `확인`         | 흰 모달, `시즌 종료!`, 티어 이미지+star, `최종티어`/티어명, `최종 LP`·`최종 순위`, `다음으로` | 고침 (재설계)                   |
| 9   | 시즌 시작 모달        | 없음                                                  | 흰 모달, `시즌 시작!`, 티어 이미지+star, `시작 티어`/`이전 티어 → 새 티어`, `시작 LP`, `다음으로` | 추가 (신규)                     |
| 10  | 모달 티어 그래픽      | 티어 아이콘 / 프로필 원                                | 기존 티어 이미지 + 주위 떠다니는 star 장식                                        | 고침 (기존 이미지 + star 추가)  |
| 11  | 모달 노출 흐름        | 종료 모달만                                           | 시즌 종료 → 시즌 시작 순차 노출                                                   | 추가                            |
| 12  | 반응형                | 없음(데스크톱만)                                      | 모바일(360)·데스크톱(1920) 시안 각각 존재                                         | 추가                            |
| 13  | 색·타이포             | 하드코딩(`#FFC1FC`, `text-[35.58px]` 등)              | 디자인 시스템 토큰                                                                | 고침                            |

> 모달 배경은 데스크톱·모바일 모두 **화이트** 확정(고해상도 재확인, `12395-23880`).

### 확인 필요

없음 (아래 판정으로 모두 해소).

### 확정된 결정 (사용자 판정 완료)

- 시즌명: `CurrentSeasonDto.nowSeason` 값 그대로 사용.
- 시즌 시작 모달 데이터: `LastSeasonPopupDto.nextLeagueName`(새 티어)·`nextStartLp`(시작 LP)·`leagueName`(이전 티어) 사용.
- 시즌 결과 모달 데이터: `rank`(최종 순위)·`leagueName`(최종 티어).
- **최종 LP**: API 필드가 아직 없어 **임시 하드코딩 값으로 표시하고, 제거 조건 주석을 남긴다** (예: `// API가 최종 LP를 내려주면 이 하드코딩을 제거한다.`). 서버 응답 스키마 확정 시 교체.
- **모달 부제 문구: 모바일 시안 기준으로 통일**한다.
  - 결과 모달: `이번 시즌도 수고했어요.`
  - 시작 모달: `직전 티어 기준으로 시작 위치가 정해져요!`
- **반응형 breakpoint: Tailwind `md` 기준**으로 모바일↔데스크톱을 전환한다.
- 모달 구현: **공용 `shared/ui/modal`을 Radix Dialog(`@radix-ui/react-dialog`)로 신설**한다. 앱 전반 재사용 + 접근성(포커스 trap·Esc·스크롤 잠금·Portal)을 검증된 채로 확보하기 위함(`component-convention.md §3`). 결과/시작 모달은 이 위에 올린다.
- 모달 노출: `containsPopup`+`lastSeasonPopupDto` 기반, 시즌 종료 → 시작 순차.
- 모달 티어 그래픽: 기존 티어 이미지 + star 장식.
- 랭킹 본인 행: 상시 강조 없이 hover 효과. 리스트 끝 fallback 문구 없음.
- 티어 셀렉터·`WaitingTab`·xp 진행 링(공용 `progress-ring`): legacy 형식 유지.

---

## 확정 명세 · 검증 기준

> 위 `확인 필요` 판정 후 작성한다. (미작성)

---

## Changelog

| 날짜       | 요약                                                    | 사유                              | 연관 항목            |
| ---------- | ------------------------------------------------------- | --------------------------------- | -------------------- |
| 2026-09-10 | 초안 작성 (배경·범위·기준선 초안·시안 대조·확인 필요)   | 리그 이전 착수 전 조사 결과 문서화 | Figma LG.1/LG.2/LG.3 |
| 2026-09-10 | API 매핑 정정: web `LastSeasonPopupDto`에 `nextLeagueName`·`nextStartLp` 존재 확인, 시작 모달 구현 가능으로 갱신 | legacy 모델만 보고 오판했던 것 수정 | web `shared/api/generated/model/lastSeasonPopupDto.ts` |
| 2026-09-10 | 반응형 시안 3종 추가, 모달 티어=기존 이미지+star, 시즌명 그대로, 본인 행 hover·fallback 제거 반영. 확인 필요를 최종 LP·모달 부제 불일치·breakpoint 3건으로 정리 | 사용자 추가 판정 및 반응형 요구 | Figma 모바일 `12899-41294`/`41553`/`41991` |
| 2026-09-10 | 확인 필요 3건 판정 완료: 최종 LP 임시 하드코딩+제거 주석, 모달 부제 모바일 문구로 통일, breakpoint `md` 기준. 확인 필요 없음으로 전환 | 사용자 판정 완료, ai-plan 착수 준비 | — |
