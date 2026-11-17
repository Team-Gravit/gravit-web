---
id: 'FIX-086'
title: '카드 다시 시도 버튼 진행 표시 · 실패 토스트'
type: 'fix'
screen: '-'
priority: 'medium'
created: '2026-11-18'
revised: '2026-11-18'
---

# FIX-086 — 카드 다시 시도 버튼 진행 표시 · 실패 토스트

GitHub Issue: #439

## 배경 · 목표

[다시 시도]를 눌러도 화면이 그대로라 버튼이 안 눌린 것처럼 보인다.
pull-to-refresh와 같게, 진행 중에는 표시를 하고 실패하면 토스트로 알린다.

## 확정 명세

- 진행 중: 버튼 `isLoading`, 최소 600ms (`MIN_REFRESH_DURATION_MS`와 같은 값)
- 진행 중에는 다시 누를 수 없다 (`isLoading`이 막는다)
- 실패: "새로고침에 실패했어요. 다시 시도해 주세요." 토스트 (`PULL_TO_REFRESH_FAILURE_MESSAGE`)
- 성공: 카드가 데이터로 바뀐다 (지금과 같음)
- `onRetry`는 Promise를 돌려준다. 거부되면 실패로 본다

## Out of Scope

- 요청 타임아웃 값 (#440)
- 빈 상태 · 새 에러 상태 추가 (#437 / FIX-085)
