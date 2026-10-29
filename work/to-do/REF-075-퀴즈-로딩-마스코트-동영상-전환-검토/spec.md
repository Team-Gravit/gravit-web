---
id: 'REF-075'
title: '퀴즈 로딩 마스코트를 동영상으로 바꿀지 검토'
type: 'refactor'
screen: '-'
priority: 'low'
created: '2026-10-29'
revised: '2026-10-29'
---

# REF-075 — 퀴즈 로딩 마스코트를 동영상으로 바꿀지 검토

GitHub Issue: 미등록

## 배경 · 목표

퀴즈 로딩 화면(`widgets/quiz-screen/ui/quiz-loading-screen.tsx`)의 애니메이션 마스코트는 webp 449 KB다. REF-054 #352에서 크기를 줄이려 했지만 이미 프레임 차이 최적화가 된 파일이라 다시 인코딩하면 오히려 커졌다. 동영상으로 바꾸면 크게 줄지만 구조가 바뀐다.

| 형식                     | 크기   |
| ------------------------ | ------ |
| 현재 애니메이션 webp     | 449 KB |
| webm (VP9, 배경색 칠함)  | 41 KB  |
| mp4 (H.264, 배경색 칠함) | 136 KB |

목표: **먼저 측정하고**, 첫 퀴즈 진입이 이 파일 때문에 느려질 때만 동영상으로 바꾼다.

## 진행 조건 — 측정 먼저

- 느린 4G · CPU 4배 조건에서 첫 퀴즈 진입(캐시 없음) 시
  - 로딩 화면이 떠 있는 시간
  - 마스코트 요청이 퀴즈 데이터 · JS 요청을 늦추는지
- 파일 이름에 해시가 붙어 두 번째 진입부터는 캐시를 쓴다. 영향은 첫 진입에만 있다
- 측정에서 차이가 없으면 이 작업은 하지 않고 닫는다

## 바꿀 경우 확인할 것

- `<img>` → `<video autoplay muted loop playsinline>` 전환
- 앱(WebView) 자동 재생: `apps/native`의 WebView 설정(`mediaPlaybackRequiresUserAction` · `allowsInlineMediaPlayback`) 확인 — native 변경이 필요하면 범위가 커진다
- iOS는 투명 webm을 지원하지 않는다 → 퀴즈 화면 배경색을 영상에 칠한다. 배경색이 바뀌면 영상을 다시 만들어야 한다
- 모션 감소 설정: 지금은 `<picture><source media="(prefers-reduced-motion: reduce)">`로 정지 프레임을 보여준다. `<video>`에서는 다른 방식이 필요하다
- 측정 파일과 시험 인코딩: `local-docs/performance/evidence/2026-10-29_ref054-image-inventory/quiz-mascot-352/`

## Changelog

| 날짜       | 요약                                | 사유                                | 연관 항목 |
| ---------- | ----------------------------------- | ----------------------------------- | --------- |
| 2026-10-29 | 작업 생성 (형식별 크기 · 진행 조건) | REF-054 #352에서 분리 · 사용자 판정 | #352      |
