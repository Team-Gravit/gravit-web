---
id: 'REF-050'
title: '풀이 엔진 이름 정리'
type: 'refactor'
screen: '-'
priority: 'low'
created: '2026-10-05'
revised: '2026-10-05'
---

# REF-050 — 풀이 엔진 이름 정리

## 배경 · 목표

`REF-049`(#267) · `MIG-048`(#268 · #269)에서 레슨 풀이 코드를 북마크·오답노트 풀이도 쓰게 됐다.
이름은 레슨 전용일 때 그대로라 읽는 사람이 「레슨에서만 쓰는 코드」로 오해한다 (2026-10-05 커밋 리뷰 중 실제로 혼동).
**이름만 바꾼다. 동작은 바꾸지 않는다.**

## 범위

| 지금                                                       | 바꿀 이름                     | 쓰임이 넓어진 이유                                              |
| ---------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| `features/lesson-quiz`                                     | `features/quiz-session`       | 세션 · 새로고침 저장 · 채점 · 단건 제출을 레슨·복습이 함께 쓴다 |
| `LessonProblems` · `toLessonProblems` (`entities/problem`) | `ProblemSet` · `toProblemSet` | 북마크 목록 · 오답 목록 응답도 같은 타입과 변환을 쓴다          |
| `QUIZ_SUBMIT_LABEL` (`'제출하기'`)                         | `LESSON_SUBMIT_LABEL`         | 레슨 일괄 제출에만 쓴다. 복습 풀이는 `QUIZ_FINISH_LABEL`        |

레슨 전용으로 남는 것(`useSubmitLesson` · `toSubmissionBody` · 정확도 계산)을 별도 슬라이스로 뺄지는 이 작업에서
판단만 하고, 옮기기로 하면 계획에 넣는다.

## 착수 조건

- `#269` 오답노트 풀이가 `develop` 에 머지된 뒤. 그 전에 바꾸면 #269 가 새로 쓰는 코드도 다시 고쳐야 한다

## Out of Scope

- 동작 · 문구 · 스타일 변경
- `widgets/quiz-screen` 의 `QuizLoadingScreen` — #267 에서 이미 바꿨다

## 확정 명세 · 검증 기준

- [ ] **AC-1** 기존 테스트가 import 경로 외에는 수정 없이 통과한다
- [ ] **AC-2** `rg "lesson-quiz|LessonProblems|toLessonProblems|QUIZ_SUBMIT_LABEL" apps/web/src` 결과가 레슨 페이지 이름(`pages/lesson-quiz`)뿐이다
- [ ] **AC-3** `pnpm lint` · `check-types` · `test` · `build` 통과

## Changelog

| 날짜       | 요약      | 사유                                                  | 연관 항목                       |
| ---------- | --------- | ----------------------------------------------------- | ------------------------------- |
| 2026-10-05 | 작업 생성 | 커밋 리뷰 중 `lesson-quiz` 가 복습 풀이에도 쓰여 혼동 | REF-049 · MIG-048 · #267 · #268 |
