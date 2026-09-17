---
id: 'INFRA-024'
title: '리그 랭킹 응답 스키마 보정 (normalize-openapi)'
type: 'infra'
screen: '-'
priority: 'medium'
created: '2026-09-10'
revised: '2026-09-10'
---

# INFRA-024 — 리그 랭킹 응답 스키마 보정

## 배경 · 목표

리그 랭킹 엔드포인트 두 개의 OpenAPI success 스키마가 `LeagueRankRowDto[]`(배열)로 잘못
정의돼 있다. 그래서 orval 생성 타입이 배열이지만, **런타임은 `SliceResponseLeagueRankRowDto`
(`hasNextPage`·`contents`)를 반환**한다. (같은 엔드포인트의 error 스키마는 이미
`SliceResponseLeagueRankRowDto`로 돼 있어 불일치가 명확하다.)

- `GET /api/v1/ranking/leagues/{leagueId}/page/{pageNum}` (`getLeagueRanking`)
- `GET /api/v1/ranking/user-leagues/page/{pageNum}` (`getLeagueRankingByUser`)

현재 MIG-023에서 소비 경계(`entities/league/api/use-league-ranking.ts`,
`use-my-league-ranking.ts`)에서 `as unknown as Promise<SliceResponseLeagueRankRowDto>`로
캐스팅해 넘겼다. 이 캐스팅을 제거하고 타입을 정직하게 만드는 것이 목표다.

## 범위

- `apps/web/openapi/normalize-openapi.mjs`에 두 엔드포인트 success 스키마 보정 추가 (최소 범위, 사유 주석)
- `pnpm --filter @repo/web generate:api` 재생성 → 타입이 `SliceResponseLeagueRankRowDto`가 되는지 확인
- 두 소비 훅에서 캐스팅 제거

## Out of Scope

- 백엔드 명세 자체 수정(백엔드가 고치면 이 보정을 제거한다 — `api-convention.md §8`)
- 랭킹 UI·무한스크롤 로직 변경

## 2026-09-17 — 전제가 바뀌었다

`chore(web): Orval API 클라이언트 재생성 (#147)`(`06b47b6`)으로 백엔드 명세가 바뀌면서 **배열 문제는
사라졌지만 다른 문제가 생겼다.**

| 항목           | 이전                                                 | 지금                             |
| -------------- | ---------------------------------------------------- | -------------------------------- |
| success 스키마 | `LeagueRankRowDto[]` (배열 — 런타임과 불일치)        | `SliceResponse` ✅ 런타임과 일치 |
| 행 타입        | `LeagueRankRowDto`                                   | **없음** — `contents: unknown[]` |
| 생성 타입 2종  | `LeagueRankRowDto` · `SliceResponseLeagueRankRowDto` | **둘 다 삭제됨**                 |

즉 **래퍼는 고쳐졌고 원소 타입이 사라졌다.** 원래 목표였던 「normalize-openapi 보정 후
`SliceResponseLeagueRankRowDto`가 나오는지 확인」은 더는 성립하지 않는다.

소비 코드는 타입 검사를 되살리기 위해 행 타입을 **소비 경계에서 선언**해 두었다
(`entities/league/model/types.ts`의 `LeagueRankRow` · `LeagueRankSlice`). 이건 임시가 아니라
명세가 행 타입을 주지 않는 동안의 유일한 표현이다. **명세가 행 타입을 되찾으면 이 선언을 지우고
생성 타입으로 되돌린다.**

### 다시 정한 범위

- 백엔드에 `SliceResponse.contents`의 원소 타입(랭킹 행)을 명세에 넣어달라고 요청한다
- 넣어주면 재생성 후 `LeagueRankRow`·`LeagueRankSlice` 선언을 제거하고 생성 타입을 쓴다
- 넣어주지 않으면 `normalize-openapi.mjs`에서 두 엔드포인트의 `contents` 원소 타입을 보정한다
- `normalize-ranking-page.ts`의 배열 분기는 **예전 응답을 주는 서버가 없다고 확인되면** 제거한다

## 확인 필요

- 백엔드가 `SliceResponse.contents`의 원소 타입을 명세에 넣어줄 수 있는지

## Changelog

| 날짜       | 요약      | 사유                                                         | 연관 항목                                            |
| ---------- | --------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 2026-09-10 | 초안 작성 | MIG-023 이전 중 발견한 명세/타입 불일치                      | MIG-023, `entities/league/api/use-league-ranking.ts` |
| 2026-09-17 | 전제 갱신 | 명세 재생성으로 래퍼는 고쳐지고 행 타입이 사라짐 (`06b47b6`) | MIG-029 검증 중 발견                                 |
