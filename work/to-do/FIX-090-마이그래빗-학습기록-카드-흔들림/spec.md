---
id: 'FIX-090'
title: '마이그래빗 요약의 학습 기록 카드가 줄었다 커지며 흔들림'
type: 'fix'
screen: '-'
priority: 'medium'
created: '2026-11-19'
revised: '2026-11-19'
---

# FIX-090 — 마이그래빗 요약의 학습 기록 카드가 줄었다 커지며 흔들림

## 배경 · 목표

마이그래빗 요약 탭은 CLS가 0.006(좋음)이지만 눈으로 보면 흔들린다(`performance/real-env/results/REPORT.md` §3-③).
CLS는 밀리는 요소가 없으면 세지 않는데, 이 카드는 맨 아래라 수치에 안 잡힌다. **성능 지표가 아니라 화면 다듬기 작업이다.**

## 재현

모바일 웹 · 스텁 응답 600ms로 `/my/summary`를 열고 시간 순으로 찍는다(`performance/real-env/scripts/filmstrip.mjs`, 결과 `cls-probe/film_my_summary/`).

1. 0.9초: 학습 기록 카드 스켈레톤 약 270px
2. 1.5초: 요약이 와서 카드가 그려지지만 잔디가 없어 **약 105px로 줄어든다**
3. 2.4초: 잔디가 와서 약 290px로 다시 커진다

## 원인 (코드로 확인)

- `widgets/study-heatmap/ui/study-heatmap.tsx` — 학습 기록(`useMyPageLearningHistory`)을 기다리는 동안 로딩 상태를 그리지 않는다
- `pages/my/ui/summary-tab.tsx` — `StudyHeatmap`이 요약 응답 뒤에야 마운트돼 학습 기록 요청이 늦게 시작된다
  (요청 폭포: 요약 1.13초 → 기록 1.76초, `diagnose-mweb-load-delay600-A.json`의 `requests`)

## 범위

- `widgets/study-heatmap` 로딩 상태
- 학습 기록 요청 시작 시점 (요약과 함께 시작할 수 있는지)

## Out of Scope

- 잔디 표시 방식 · 연도 선택 동작 변경
- 데스크톱 레이아웃

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given 모바일 웹 · 스텁 응답 600ms
      When `/my/summary`를 시간 순으로 찍는다
      Then 학습 기록 카드 높이가 처음 그려진 뒤 끝까지 20px 넘게 줄어드는 순간이 없다
- [ ] **AC-2** (범위: 통합)
      Given 같은 조건
      When 요청 순서를 기록한다
      Then `/my-pages/learning/history` 요청이 `/my-pages/learning/summaries` 응답을 기다리지 않고 시작한다

---

## Changelog

| 날짜       | 요약      | 사유                                        | 연관 항목                                |
| ---------- | --------- | ------------------------------------------- | ---------------------------------------- |
| 2026-11-19 | 항목 생성 | 실사용자 환경 Web Vitals 전면 검토에서 발견 | `performance/real-env/results/REPORT.md` |
