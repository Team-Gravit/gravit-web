---
id: 'REF-089'
title: '스켈레톤 반짝임이 작은 이동의 CLS를 크게 부풀림 — 공용 컴포넌트 검토'
type: 'refactor'
screen: '-'
priority: 'medium'
created: '2026-11-19'
revised: '2026-11-19'
---

# REF-089 — 스켈레톤 반짝임이 작은 이동의 CLS를 크게 부풀림 — 공용 컴포넌트 검토

## 배경 · 목표

메인(`FIX-088`)에서 7~9px 이동이 CLS 0.36으로 잡혔다. 같은 조건에서 동작 줄이기(`prefers-reduced-motion`)로 반짝임을 끄면 **0.007**이다(`performance/real-env/results/REPORT.md` §3-①).
Chrome이 움직인 블록 안의 반짝임 `::after`(`shared/ui/skeleton`의 `animation: wave`)를 큰 이동으로 함께 센다.
같은 영향이 `inquiry`(0.038~0.045), 데스크톱 `main`(0.049)에도 작게 있다. Chrome 사용자(모바일 웹 · 데스크톱)의 실측 CLS와 CrUX에 그대로 들어간다.

## 착수 조건

**`FIX-088`을 먼저 끝내고 다시 잰다.** 스켈레톤 높이가 맞으면 이동이 없어 wave가 점수를 키울 일도 없다.
그 뒤에도 0.1 가까운 화면이 남을 때만 착수한다. 공용 컴포넌트라 모든 스켈레톤에 영향이 간다.

## 범위

- `shared/ui/skeleton/skeleton.tsx`의 `wave` 변형 · `app/styles/tokens.css`의 `skeletonWave`

## Out of Scope

- 반짝임을 없애는 디자인 결정 (시안 확인 필요 — 바꿔야 하면 `확인 필요`로 올린다)
- 개별 화면의 스켈레톤 높이 맞추기 (각 `FIX-`)

## 확인 필요

- 반짝임의 이동 방식을 바꿔도 시안(Figma)의 표현과 같은지

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given 스켈레톤 높이를 일부러 9px 다르게 둔 확인용 화면, 모바일 웹 프로필
      When 반짝임을 켠 상태와 끈 상태로 각 3회 잰다
      Then 두 CLS 차이가 0.01 이하다

---

## Changelog

| 날짜       | 요약      | 사유                                        | 연관 항목                                |
| ---------- | --------- | ------------------------------------------- | ---------------------------------------- |
| 2026-11-19 | 항목 생성 | 실사용자 환경 Web Vitals 전면 검토에서 발견 | `performance/real-env/results/REPORT.md` |
