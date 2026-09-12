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

## 확인 필요

- 백엔드가 스펙을 곧 고칠 계획인지. 고친다면 normalize 보정 대신 대기 후 재생성만 하면 된다.

## Changelog

| 날짜       | 요약      | 사유                                  | 연관 항목                                    |
| ---------- | --------- | ------------------------------------- | -------------------------------------------- |
| 2026-09-10 | 초안 작성 | MIG-023 이전 중 발견한 명세/타입 불일치 | MIG-023, `entities/league/api/use-league-ranking.ts` |
