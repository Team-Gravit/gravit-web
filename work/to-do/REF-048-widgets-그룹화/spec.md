---
id: 'REF-048'
title: 'widgets 슬라이스 그룹화 (excessive-slicing 재활성화)'
type: 'refactor'
screen: '-'
priority: 'low'
created: '2026-10-05'
revised: '2026-10-05'
---

# REF-048 — widgets 슬라이스 그룹화

## 배경 · 목표

FEAT-047(알림 위젯 추가) 시점에 `widgets/` 최상위 ungrouped 슬라이스가 21개가 되어 steiger
`fsd/excessive-slicing`(임계 20) 을 넘겼다. 해당 규칙은 v0.7.0 에서 임계값이 하드코딩이라 옵션으로
올릴 수 없어 임시로 **껐다**(`apps/web/steiger.config.js`).

목표: 관련 위젯을 의미 그룹으로 묶어 ungrouped 수를 임계 이하로 낮추고, `excessive-slicing` 규칙을
다시 켠다. 동작 변경 없음(구조만).

## 범위

- `widgets/` 하위를 그룹 폴더로 재배치 (예: `learning/`, `main/`, `league/`, `social/`(기존))
- `@/widgets/*` import 경로 전면 갱신
- `steiger.config.js` 에서 `fsd/excessive-slicing` 'off' 제거(재활성화)

## Out of Scope

- 위젯 내부 구현 변경, 네이밍 변경(이동/재그룹만)

## 확인 필요

- 그룹 경계(어떤 위젯을 어느 그룹에) — 착수 시 ai-plan 에서 매핑표로 확정
