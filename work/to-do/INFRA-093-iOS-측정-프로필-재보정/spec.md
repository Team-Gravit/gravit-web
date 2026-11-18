---
id: 'INFRA-093'
title: 'iOS 측정 프로필(CPU 1.5배)이 실기기보다 빠름 — 배수 재보정 · LTE · 터치 INP 확인'
type: 'infra'
screen: '-'
priority: 'low'
created: '2026-11-19'
revised: '2026-11-19'
---

# INFRA-093 — iOS 측정 프로필(CPU 1.5배)이 실기기보다 빠름 — 배수 재보정 · LTE · 터치 INP 확인

## 배경 · 목표

실사용자 환경 측정의 `ios` 프로필은 맥 Chrome CPU 1.5배로 iPhone 14를 흉내 냈다. 실기기 확인 결과 **iPhone 14 Safari가 맥 Chrome 6배보다도 느렸다**(`performance/real-env/results/REPORT.md` §2 실기기 확인).

| 항목                    | iPhone 14 Safari | Chrome 1.5배 | Chrome 6배 |
| ----------------------- | ---------------: | -----------: | ---------: |
| 메인 FCP                |            217ms |         76ms |      180ms |
| 메인 클릭 → 다음 그리기 |             29ms |          4ms |       18ms |

보정해도 이번 판정(전 화면 좋음)은 바뀌지 않았다. 다만 다음 측정부터는 `ios` 수치를 그대로 믿기 어렵다.

## 범위

- `performance/real-env/scripts/diagnose.mjs`의 `PROFILES.ios.cpu` 재결정과 근거(`performance/real-env/README.md` §2)
- 실기기 확인 보강:
  - iPhone 개발자 설정 Network Link Conditioner로 LTE 조건에서 재기
  - Safari 26 Event Timing으로 사람이 직접 누르는 INP 재기
  - 앱 WebView(개발 빌드, `isInspectable`)에서 재기

도구: `performance/real-env/device/`

## Out of Scope

- 앱 코드 변경
- 실사용자 측정(RUM) 도입 — 필요하면 별도 `FEAT-`

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 수동)
      Given iPhone 14와 맥 Chrome에서 같은 `device-server.cjs` 순서
      When 메인 · 학습을 각 5회 연다
      Then 새 배수에서 Chrome의 「클릭 → 다음 그리기」 가운데 값이 iPhone 값의 ±30% 안이다

---

## Changelog

| 날짜       | 요약      | 사유                                        | 연관 항목                                |
| ---------- | --------- | ------------------------------------------- | ---------------------------------------- |
| 2026-11-19 | 항목 생성 | 실사용자 환경 Web Vitals 전면 검토에서 발견 | `performance/real-env/results/REPORT.md` |
