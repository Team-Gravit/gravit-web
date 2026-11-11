---
id: 'FEAT-081'
planned: '2026-11-09'
mode: 'feature'
issue: 'https://github.com/Team-Gravit/gravit-web/issues/396'
branch: 'feat/#396/league-my-rank-scroll'
---

# FEAT-081 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: feature` — legacy에 없는 신규 동작(내 순위 센터링 + 양방향 스크롤)을 apps/web에 새로 만든다.

> FEAT는 보통 `feature-planner` 3단계를 먼저 밟지만, 요구사항·기술안을 대화에서 충분히 좁혔고
> 범위가 2슬라이스·~7파일로 작아 `ai-plan`으로 직행한다. 전면 ADR/이슈 분해가 필요하면 feature-planner로
> 승격한다.

### 0-2. 자동 보류 신호

- [ ] 동작 변경이 같이 들어감 — 없음(순수 신규)
- [ ] 한 단위로 완료·검증 불가 — 없음
- [x] **자동 생성물 직접 수정** — `shared/api/generated/`는 **건드리지 않는다.** 랭킹 행 타입은
      현재 `entities/league/model/types.ts`의 `LeagueRankRow`(소비 경계 정의)를 그대로 쓴다
- [x] **범위 밖 문제 존재** — `INFRA-024`(랭킹 스키마 보정)와 겹침. 분리 유지하고 현 타입 위에 올린다
- 그 외 보류 신호 없음. 단 `spec.md`의 **확인 필요 5건은 ⏸ 게이트에서 판정**받는다

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                           | 레이어       |
| --- | -------------------------------------------------- | ------------ |
| 1   | 앵커 페이지 계산(순수 함수) + `PAGE_SIZE` 상수     | `[entities]` |
| 2   | 내 티어 랭킹을 양방향 무한쿼리로 (앵커 기준 상/하) | `[entities]` |
| 3   | 센티넬을 상·하단 둘로 (이전/다음 페이지 트리거)    | `[shared]`   |
| 4   | 초기 센터링(`scrollIntoView` center, smooth)       | `[widgets]`  |
| 5   | prepend 스크롤 보정(`useLayoutEffect`)             | `[widgets]`  |
| 6   | 내 티어일 때만 센터링, 다른 티어는 기존 단방향     | `[widgets]`  |

> 게이트 판정: 시안 없음 / smooth 스크롤만 / **내 행 강조 안 함**. 강조 요구가 빠져
> `user-rank-row.tsx` 수정이 제거됐다. 내 행은 센터링 ref 대상일 뿐 시각은 동일.

### 1-1. 관리 포인트 식별

| 값                     | 상수 / 인라인 | 근거                                                                                |
| ---------------------- | ------------- | ----------------------------------------------------------------------------------- |
| `PAGE_SIZE`            | **상수**      | 앵커 계산의 도메인 값·drift 위험(확인 필요 4). `entities/league/model/constants.ts` |
| 선로딩 버퍼(±1)        | 인라인        | 레이아웃에 따라 조정될 구현 디테일. 화면 보고 ±2 필요 시 승격                       |
| smooth 스크롤 duration | 인라인        | 브라우저 기본값 사용                                                                |

## 2. 영향 분석

| 구분 | 파일                                                                                    |
| ---- | --------------------------------------------------------------------------------------- |
| 신규 | `entities/league/model/constants.ts` (PAGE_SIZE)                                        |
| 신규 | `entities/league/model/anchor.ts` + `anchor.test.ts` (`getAnchorPage`)                  |
| 신규 | `widgets/league-arena/lib/use-scroll-anchor.ts` (prepend 보정) — 단일 사용처라 위젯 lib |
| 수정 | `entities/league/api/use-my-league-ranking.ts` (양방향: rank 인자, prev param)          |
| 수정 | `entities/league/index.ts` (배럴: 상수·anchor 노출)                                     |
| 수정 | `shared/lib/use-infinite-scroll.ts` (이전 페이지 방향 지원 — 또는 옵션 추가)            |
| 수정 | `widgets/league-arena/ui/ranking-list.tsx` (상/하 센티넬·센터링·보정·내 행 ref)         |
| 수정 | `widgets/league-arena/ui/league-arena.tsx` (myRank 전달, isMyTier 분기)                 |
| 수정 | `widgets/league-arena/ui/league-arena.test.tsx` (양방향·센터링 반영)                    |

npm 의존성 추가: **없음.** (가상화 라이브러리는 이번 범위 아님 — 행 수가 커져 체감 저하가
측정되면 별도 작업으로 `@tanstack/react-virtual` 검토)

## 3. 의존 관계 검증

- `entities/league` 안에서 `model → api` 참조만. cross-slice 없음
- `widgets/league-arena`가 `entities/league`·`shared/lib` 참조 — 하향, 정상
- FSD 위반 **없음**

## 4. 구현 계획 체크리스트

> `shared → entities → widgets` 순서. 라우트 변경 없음 → **라우트 트리 재생성 불필요.**

- [ ] `[shared]` `use-infinite-scroll`에 이전 페이지 방향 지원 추가(옵션 또는 자매 훅). 기존 하단
      사용처(단방향) 동작은 보존
- [ ] `[entities]` `model/constants.ts`에 `PAGE_SIZE = 10` (서버 default 근거 주석)
- [ ] `[entities]` `model/anchor.ts`에 `getAnchorPage(rank)` 순수 함수 + `anchor.test.ts` 경계 테스트
      (AC-1: 1→0,10→0,11→1,92→9,100→9,101→10)
- [ ] `[entities]` `use-my-league-ranking`을 양방향으로: `rank` 인자 → `initialPageParam=getAnchorPage`,
      `getPreviousPageParam`(n>0?n-1:undefined)·`getNextPageParam` 유지. 배럴 갱신
- [ ] `[widgets]` `lib/use-scroll-anchor.ts`: prepend 시 `useLayoutEffect`로 `scrollTop` 보정
- [ ] `[widgets]` `ranking-list.tsx`: 상단 센티넬 추가(이전 페이지), 내 행 ref + 초기 1회 센터링,
      prepend 보정 연결. `isMyTier`가 아니면 상단 센티넬·센터링 비활성(기존 동작)
- [ ] `[widgets]` `league-arena.tsx`: `myRank`(profile.rank)와 `isMyTier`를 리스트에 전달
- [ ] `[widgets]` `league-arena.test.tsx` 갱신

## 5. 리스크

| 리스크                                                | 영향                                  | 대응                                                                |
| ----------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| page size 10 하드코딩 drift (확인 필요 4)             | 앵커가 틀어져 엉뚱한 등수에 센터링    | `PAGE_SIZE` 상수 1곳 + 주석. 백엔드 고정 확약 또는 응답에 size 요청 |
| `INFRA-024` 타입 미확정                               | `LeagueRankRow` 바뀌면 재작업         | 현 타입 위에 구현. 교체 지점 주석으로 표시                          |
| prepend 보정 ↔ `scrollbar-hide`/`useScaleToFit` 충돌 | 위로 스크롤 시 튐/점프                | `useLayoutEffect` 수동 보정 1차, 실기기 스모크로 확인               |
| 초기 다중 페이지 로딩 중 빈 상태 깜빡임               | 센터링 전 스켈레톤/빈 화면            | 앵커 로드 완료 전까지 기존 스켈레톤 유지, 로드 후 1회 센터링        |
| 내 티어/다른 티어 전환 시 상태 혼선                   | 다른 티어에서 센터링·prev가 잘못 동작 | `isMyTier`로 양방향·센터링 전부 가드(AC-4)                          |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] `docs/implementation-status.md`에 LG-01 동작 갱신
- [ ] 확정 명세를 `docs/fe-implement-spec/LG-01/`로 승격
- [ ] (해당 시) prepend 보정·양방향 무한스크롤 패턴을 `.claude/rules` 또는 `docs/conventions`에 메모
