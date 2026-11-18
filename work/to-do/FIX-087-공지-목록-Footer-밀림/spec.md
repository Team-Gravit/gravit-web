---
id: 'FIX-087'
title: '데스크톱 공지 목록이 로딩 뒤 Footer가 밀려 CLS 0.41'
type: 'fix'
screen: '-'
priority: 'high'
created: '2026-11-19'
revised: '2026-11-19'
---

# FIX-087 — 데스크톱 공지 목록이 로딩 뒤 Footer가 밀려 CLS 0.41

## 배경 · 목표

실사용자 환경 측정(`performance/real-env/results/REPORT.md` §3-②)에서 데스크톱 공지 목록(`/settings/notice`)의 CLS가 **0.410(나쁨)** 으로 나왔다.
응답이 빨라도(지연 0) 생긴다. 측정한 모든 화면 · 프로필 가운데 가장 크다. 목록이 그려질 때 Footer가 움직이지 않게 한다.

## 재현

1. 데스크톱(1440×900)으로 `/settings/notice`를 연다
2. 로딩 중에는 Footer가 화면 가운데(y≈524)에 보인다
3. 목록이 그려지면 Footer가 y≈1936으로 밀려 내려간다 — layout-shift 0.41 한 번

측정 원본: `performance/real-env/results/diagnose-desktop-load-C.json` · `cls-probe/notice-desktop.txt`

## 원인 (측정 · 코드로 확인)

- `pages/notice/ui/notice-list.tsx` — `isPending`이고 스켈레톤 지연 전이면 `return null`이라 목록 자리가 0px이다
- `pages/notice/ui/notice-page.tsx` — 바깥 상자가 `min-h-full`인데 이 높이가 화면을 채우지 못해 Footer가 콘텐츠 바로 밑에 붙는다
- 공지 상세(`pages/notice-detail/ui/notice-detail-page.tsx`)는 `min-h-svh`라 Footer가 처음부터 화면 아래에 있고 CLS 0.03이다
- 스켈레톤 반짝임과 관계없다 — 동작 줄이기를 켜도 0.410

## 범위

- `pages/notice` (데스크톱 레이아웃의 높이 확보)
- 모바일은 Footer를 숨기므로(`hidden md:block`) 해당 없음

## Out of Scope

- Footer 위젯 자체 수정
- 다른 데스크톱 화면의 Footer 배치 정리(측정상 문제 없음)
- 스켈레톤 지연 표시(`useDelayedFlag`) 정책 변경

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given 데스크톱 프로필(1440×900, CPU 2배), 스텁 응답 지연 0
      When `/settings/notice`를 7회 연다
      Then CLS 가운데 값이 0.1 이하다 (`performance/real-env/scripts/diagnose.mjs`, `PROFILE=desktop`)
- [ ] **AC-2** (범위: 통합)
      Given 같은 조건, 스텁 응답 지연 600ms
      When 3회 연다
      Then CLS 가운데 값이 0.1 이하다

---

## Changelog

| 날짜       | 요약      | 사유                                        | 연관 항목                                |
| ---------- | --------- | ------------------------------------------- | ---------------------------------------- |
| 2026-11-19 | 항목 생성 | 실사용자 환경 Web Vitals 전면 검토에서 발견 | `performance/real-env/results/REPORT.md` |
