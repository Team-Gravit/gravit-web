---
id: 'REF-049'
title: '풀이 화면 공용화'
type: 'refactor'
screen: '-'
priority: 'medium'
created: '2026-10-05'
revised: '2026-10-05'
---

# REF-049 — 풀이 화면 공용화

## 배경 · 목표

레슨 풀이 화면이 `pages/lesson-quiz` 안에 있어 북마크·오답노트 풀이(`MIG-048`)가 같은 틀을 쓸 수 없다
(page 사이 cross-slice). 화면을 `widgets/quiz-screen` 으로 꺼내 레슨 전용 부분만 page 에 남긴다.
**레슨 풀이의 사용자 동작은 바꾸지 않는다.** GitHub Issue #267.

## 범위

- `pages/lesson-quiz/ui/` 의 풀이 화면 · 상단바 · 타이머 · 로딩 화면 → `widgets/quiz-screen`
- `features/lesson-quiz` 세션 저장 키를 레슨 ID 에서 `number | string` 키로 넓힌다. 레슨은 같은 저장 키 값을 쓴다
- `AdvanceAction` 의 `'submitLesson'` → `'finish'`

## Out of Scope

- 복습 풀이 화면 · 단건 제출 · 제외 버튼 (`MIG-048`)
- 레슨 풀이의 동작 · 문구 · 스타일 변경

## 용어 정의 (Ubiquitous Language)

| 용어      | 정의                                                          |
| --------- | ------------------------------------------------------------- |
| 풀이 화면 | 상단바 · 진행 패널 · 타이머 · 문제 카드 · 하단 이동 버튼 묶음 |
| 끝내기    | 마지막 문제에서 다음 버튼을 누를 때의 동작. 레슨은 일괄 제출  |

---

## 현행 동작 기준선

기준선은 기존 자동 테스트다. 별도 문서 기준선을 두지 않는다.

| 대상                      | 테스트                                           |
| ------------------------- | ------------------------------------------------ |
| 레슨 풀이 화면 전체 흐름  | `pages/lesson-quiz/ui/lesson-quiz-page.test.tsx` |
| 세션 · 저장 · 채점 · 제출 | `features/lesson-quiz/**/*.test.ts(x)`           |
| 진행 패널                 | `widgets/quiz-progress-panel` (있으면)           |

## 확정 명세 · 검증 기준

- [x] **AC-1** 위 테스트가 **수정 없이** 통과한다
- [x] **AC-2** `pages/lesson-quiz/ui/` 에 레슨 전용 코드(문제 조회 · 일괄 제출 · 결과 이동 · 북마크 연결)만 남는다
- [x] **AC-3** 새로고침 저장 키가 `gravit.quiz-session.{lessonId}` 로 같다 (기존 저장본 복원 호환)
- [x] **AC-4** `pnpm lint`(steiger 포함) · `check-types` · `test` · `build` 통과

---

## Changelog

| 날짜       | 요약      | 사유                                         | 연관 항목      |
| ---------- | --------- | -------------------------------------------- | -------------- |
| 2026-10-05 | 작업 생성 | MIG-048 이 레슨 풀이 틀을 쓰기로 판정됨 (P3) | #267 · MIG-048 |
