---
id: 'REF-069'
title: 'IconButton 색 · 반응형 크기 변형 검토'
type: 'refactor'
screen: '-'
priority: 'low'
created: '2026-10-26'
revised: '2026-10-26'
---

# REF-069 — IconButton 색 · 반응형 크기 변형 검토

## 배경 · 목표

아이콘만 있는 버튼이 공용 `IconButton`과 raw `button` + `Icon` 두 방식으로 갈려 있다.
`IconButton`은 아이콘 크기가 숫자 하나(`iconSize`)이고 `ghost` 색이 `text-text-2`로 고정돼,
시안이 요구하는 「모바일 24px · 웹 32px」과 `icon/default`(`text-icon`) 색을 표현할 수 없다.
그래서 풀이 화면의 북마크 · 신고 버튼은 같은 클래스를 각자 다시 쓰고 있다.

`IconButton`에 필요한 변형을 추가해 아이콘 버튼을 하나로 모을 수 있는지 판단하고,
모은다면 화면 동작과 외형을 바꾸지 않고 옮긴다.

## 현황

| 위치 (`apps/web/src/`)                                                                                                                    | 방식                  | 아이콘 크기                                       | 색                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------- | ------------------------------------- |
| `features/problem-bookmark/ui/bookmark-toggle.tsx`                                                                                        | raw `button` + `Icon` | `size-6 md:size-8`                                | `text-icon` · 켜짐 `text-icon-accent` |
| `features/problem-report/ui/problem-report-button.tsx`                                                                                    | raw `button` + `Icon` | `size-6 md:size-8`                                | `text-icon`                           |
| `features/problem-report/ui/problem-report-modal.tsx` (닫기)                                                                              | `IconButton`          | 24 고정                                           | `text-text-2` (시안은 `text-1`)       |
| `widgets/quiz-screen/ui/quiz-top-bar.tsx` (풀이 닫기)                                                                                     | `Link` + `Icon`       | `size-6 md:size-8` (MIG-068에서 신고 버튼과 맞춤) | `text-icon`                           |
| `shared/ui/layout/document-layout.tsx` · `widgets/notification/ui/notification-popover.tsx` · `widgets/social/follow/ui/follow-modal.tsx` | `IconButton`          | 확인 필요                                         | `ghost`                               |

조사 범위: `<IconButton` 사용처와 `md:size-8` 아이콘 검색 (2026-10-26). 그 밖의 raw 아이콘 버튼은 착수 시 다시 찾는다.

## 범위 (안)

- `shared/ui/icon-button`에 아이콘 색 변형과 화면 크기별 아이콘 크기 추가 검토
- 위 표의 버튼을 `IconButton`으로 옮길지 판단
- 북마크처럼 상태(`aria-pressed`)에 따라 아이콘 · 색이 바뀌는 경우를 어떻게 받을지

## Out of Scope

- 신고 모달 닫기 색(`text-2` → `text-1`) — 시안 차이라 `FIX-`로 따로 다룬다

## 확인 필요

1. 링크(`Link`)인 아이콘 버튼도 `IconButton asChild`로 받을지
2. 변형 이름 — 시안의 `icon/default` · `icon/brand` 등 아이콘 색 체계를 그대로 따를지

## Changelog

| 날짜       | 요약      | 사유                                                                        | 연관 항목                             |
| ---------- | --------- | --------------------------------------------------------------------------- | ------------------------------------- |
| 2026-10-26 | 항목 생성 | MIG-068 신고 버튼이 `IconButton`으로 시안을 표현하지 못해 raw 버튼으로 구현 | MIG-068 · `problem-report-button.tsx` |
