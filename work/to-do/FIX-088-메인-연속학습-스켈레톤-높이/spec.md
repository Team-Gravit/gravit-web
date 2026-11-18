---
id: 'FIX-088'
title: '메인 연속 학습 카드 스켈레톤이 실제보다 9px 커서 아래 카드가 밀림'
type: 'fix'
screen: '-'
priority: 'high'
created: '2026-11-19'
revised: '2026-11-19'
---

# FIX-088 — 메인 연속 학습 카드 스켈레톤이 실제보다 9px 커서 아래 카드가 밀림

## 배경 · 목표

실사용자 환경 측정(`performance/real-env/results/REPORT.md` §3-①)에서 응답이 늦을 때(스텁 600ms) 모바일 메인의 CLS가 **iOS 0.347 · 모바일 웹 0.361(나쁨)** 이다.
실제로 움직이는 거리는 7~9px인데, 그 안의 스켈레톤 반짝임 때문에 Chrome이 큰 값으로 센다(`REF-089`).
움직임 자체를 없애면 반짝임이 점수를 키울 일도 없다.

## 재현

1. 모바일(412×915, CPU 4배) · 스텁 응답 600ms로 `/main`을 연다
2. 응답이 오면 연속 학습 카드(`LearningStreak`)가 147px → 138px로 줄어든다
3. 그 아래 「오늘의 미션 · 추천」 줄과 「이어서 학습하기」 카드가 7~9px 올라온다 — layout-shift 0.12 + 0.24

측정 원본: `performance/real-env/results/diagnose-{ios,mweb}-load-delay600-A.json` · `cls-probe/main-mweb-delay600*.txt`

## 원인 (측정으로 확인)

- `widgets/learning-streak/ui/learning-streak.tsx`의 `LearningStreakBodySkeleton`이 실제 내용보다 약 9px 높다
- 「이어서 학습하기」 스켈레톤(338px)도 실제(310px)보다 크지만 맨 아래라 밀리는 요소가 없다
- 텍스트 스켈레톤 높이 차이는 `FIX-032`(텍스트 자리표시가 4px 높음)와 원인이 겹칠 수 있다. 먼저 확인한다

## 범위

- `widgets/learning-streak` 스켈레톤 높이
- 필요하면 `widgets/continue-learning` 스켈레톤 높이

## Out of Scope

- 공용 `Skeleton`의 wave 애니메이션 변경 (`REF-089`)
- 데스크톱 메인 레이아웃 (CLS 0.049로 좋음)

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given 모바일 웹 프로필(`PROFILE=mweb`), 스텁 응답 600ms
      When `/main`을 3회 연다
      Then CLS 가운데 값이 0.1 이하다
- [ ] **AC-2** (범위: 통합)
      Given 같은 조건
      When `cls-probe.mjs`로 연속 학습 카드 높이를 기록한다
      Then 스켈레톤 높이와 내용 높이의 차이가 1px 이하다

---

## Changelog

| 날짜       | 요약      | 사유                                        | 연관 항목                                |
| ---------- | --------- | ------------------------------------------- | ---------------------------------------- |
| 2026-11-19 | 항목 생성 | 실사용자 환경 Web Vitals 전면 검토에서 발견 | `performance/real-env/results/REPORT.md` |
