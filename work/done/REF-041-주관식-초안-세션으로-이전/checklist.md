---
id: 'REF-041'
validated: '2026-09-25'
mode: 'refactor'
scope: '전체'
---

# REF-041 검증 결과

> **FEAT-038 안에서 실행했다.** 별도 브랜치·PR을 만들지 않았고, 구현과 검증은
> `work/done/FEAT-038-레슨-문제-풀이/checklist.md`가 함께 다룬다. 이 문서는 REF-041의
> 목표가 실제로 달성됐는지만 대조한다.

## 1. 자동 검증

FEAT-038 최종 검증과 같은 실행이다 — `pnpm lint` ✅ · `pnpm check-types` ✅ ·
`pnpm test` ✅ 75 files · 386 tests · `pnpm build` ✅.

## 2. 목표 ↔ 구현 대조

| 목표                                     | 결과                                                     | 상태 |
| ---------------------------------------- | -------------------------------------------------------- | ---- |
| 초안을 풀이 세션 상태로 올린다           | `QuizSessionState.subjectiveAnswerDraft`                 | ✅   |
| `QUIZ_ANSWER_FORM_ID` 전역 계약을 없앤다 | `model/constants.ts`·`index.ts`에서 삭제                 | ✅   |
| `document.getElementById` 통로를 없앤다  | `lesson-quiz-page.tsx`에서 삭제                          | ✅   |
| 진행 판단을 한 곳에 모은다               | `getAdvanceAction`(계산) · `advance`(실행)               | ✅   |
| 입력 컴포넌트가 진행 여부를 모르게 한다  | `SubjectiveAnswer`는 `onAdvance`만 호출한다              | ✅   |
| 문제를 옮기면 초안이 남지 않는다         | `moveToProblem`이 비운다 · `quiz-session.test.ts`가 고정 | ✅   |

## 3. 동작 보존

구조 변경이지만 **동작이 한 가지 늘었다** — 마지막 문제를 풀지 않아도 제출된다. 이것은
REF-041의 범위가 아니라 FEAT-038이 R14로 확정한 명세이며, 같은 커밋에서 함께 구현했다.
`refactor-checklist.md` §2는 동작 변경과 구조 변경을 섞지 말라고 정하므로 이 선택의 사유를
남긴다.

**분리하지 않은 이유**: R14를 구현하려면 「제출할 초안이 있는가」를 footer가 알아야 하는데,
그 판단이 가능해지는 것이 곧 REF-041의 결과다. 구조를 먼저 옮기고 R14를 다음 커밋으로 미루면
중간 커밋이 「마지막 문제에서 버튼이 죽은」 상태로 남는다.

## 4. 기준 문서 갱신

해당 없음. 내부 구조 변경이라 화면 상태·토큰·규칙이 바뀌지 않았다. R14 신설은
FEAT-038 `spec.md`에 기록했다.

## 5. 남은 작업

없다.
