---
id: 'REF-041'
title: '주관식 답 초안을 풀이 세션으로 올린다'
type: 'refactor'
screen: 'LEARN-QUIZ'
priority: 'medium'
created: '2026-09-22'
revised: '2026-09-22'
---

# REF-041 — 주관식 답 초안을 풀이 세션으로 올린다

## 배경 · 목표

주관식 답 초안(`draft`)이 `features/lesson-quiz/ui/subjective-answer.tsx` 의 `useState` 에 있다.
그런데 **그 값을 제출해야 하는 버튼은 형제 컴포넌트인 footer 에 있다.**

```
ProblemCard ─ SubjectiveAnswer ─ <form id="quiz-answer-form"> ─ draft (useState)
QuizFooter  ─ 다음 버튼  ──────── 이 draft 를 제출해야 한다
```

React 트리로 이어져 있지 않으므로 둘을 잇는 통로가 **DOM 의 form id** 하나뿐이다. 그래서
`QUIZ_ANSWER_FORM_ID` 를 전역 계약으로 export 하고, 페이지가 `document.getElementById` 로 폼을
찾아 `requestSubmit()` 을 호출한다.

이 통로가 실제로 결함을 만들었다 — FIX 없이 넘어간 것이 아니라 **FEAT-038 에서 버그로 터졌다.**
버튼이 `type="button"` ↔ `type="submit"` 을 오가는 구조였고, 클릭 전파 도중 바뀐 `type` 이 같은
클릭의 기본 동작으로 반영되어 주관식 문제가 통째로 건너뛰어졌다. 버튼을 항상 `type="button"`
으로 고정해 해결했지만(`fix(web): 객관식에서 다음을 누르면 주관식 문제를 건너뛰는 문제 수정`),
**통로 자체는 그대로 남아 있다.**

**목표** — `draft` 를 세션 상태로 올리고, feature 가 「다음으로 진행」 동작 하나를 노출한다.
페이지는 그 동작을 호출만 한다.
**비목표** — 채점 규칙·문구·이동 규칙을 바꾸는 것. **동작은 그대로 보존한다.**

## 범위

| 대상                                                  | 내용                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `features/lesson-quiz/model/quiz-session.ts`          | `draft` 상태 + `setDraft` 액션. **이동 시 초기화**         |
| `features/lesson-quiz/model/quiz-session-context.tsx` | `draft` · `setDraft` · `submitOrAdvance(problem)` 노출     |
| `features/lesson-quiz/ui/subjective-answer.tsx`       | 로컬 `useState` → 세션 구독                                |
| `pages/lesson-quiz/ui/lesson-quiz-page.tsx`           | `QuizFooter` 에서 `shouldSubmitAnswer` · `handleNext` 제거 |
| `features/lesson-quiz/model/constants.ts`             | `QUIZ_ANSWER_FORM_ID` 의 공개 여부 재검토                  |

목표 형태는 페이지가 분기를 갖지 않는 것이다.

```tsx
<Button type="button" onClick={() => submitOrAdvance(problem)}>
  {labels.next}
</Button>
```

### 왜 페이지에서 분기가 사라져야 하는가

현재 `QuizFooter` 는 `problem.type === 'subjective' && !isAnswerSubmitted` 로 **무엇을 할지**
판단한다. 이건 「사용자가 답을 제출한다」는 행동 규칙이므로 `fsd-features.md` §3 에 따라 features
의 몫이다. `fsd-pages.md` §5 는 페이지의 일을 **배치와 결정(라우팅)** 으로 한정한다.

### `<form>` 은 남긴다

텍스트 필드에서 Enter 로 제출하는 경로는 `<form>` 의 암묵적 제출이 담당한다. 폼을 없애지 말고,
`onSubmit` 이 `submitOrAdvance` 를 호출하게 해 **버튼과 Enter 가 같은 한 동작으로 모이게** 한다.

## ⚠️ `key={problemId}` 의존을 함께 걷어낸다

지금 초안 초기화는 `pages/lesson-quiz/ui/lesson-quiz-page.tsx` 의
`<ProblemSolver key={currentProblem.problemId} …>` 리마운트에 의존한다. `key` 가 없으면 이전 문제의
입력이 다음 문제에 남는다(테스트 `주관식이 연속되어도 이전 문제의 입력을 다음 문제에 남기지 않는다`
가 이를 고정한다).

`draft` 가 세션으로 올라가면 **리듀서의 이동 처리에서 명시적으로 비운다.** 암묵적 리마운트 의존이
사라지고 초기화 시점이 테스트 가능해진다.

단 `key` 를 **제거하지는 않는다** — 제출 후 아코디언 열림 상태 등 다른 지역 상태도 같은 `key` 에
기대고 있는지 먼저 확인한다.

## Out of Scope

- 객관식 채점·표시 규칙
- 일괄 제출과 결과 화면 (Issue 5·6 / #240)
- `draft` 를 Zustand 로 옮기는 것 — 레슨 하나의 수명 안에서만 살아 있으므로 세션 리듀서가 맞다
  (`state-convention.md` §1)

## 확정된 규칙

| #   | 규칙                                                                              |
| --- | --------------------------------------------------------------------------------- |
| R1  | 페이지는 「다음」 이 무엇을 하는지 판단하지 않는다. feature 의 동작 하나를 부른다 |
| R2  | 초안 초기화는 리듀서의 이동 처리에서 명시적으로 한다. 리마운트에 기대지 않는다    |
| R3  | 버튼과 Enter 는 같은 동작으로 모인다. 경로마다 다른 분기를 두지 않는다            |
| R4  | 동작을 보존한다. 기존 테스트가 기준선이며 통과한 채로 끝낸다                      |

## 검증

기준선은 `pages/lesson-quiz/ui/lesson-quiz-page.test.tsx` 의 기존 케이스다. 특히 아래는
이번 구조 변경으로 **깨지면 안 된다.**

- `빈 입력에서 다음 문제를 누르면 답을 기록하지 않고 다음 문제로 이동한다`
- `주관식이 연속되어도 이전 문제의 입력을 다음 문제에 남기지 않는다`
- `제출한 답은 읽기 전용으로 남는다`
- `객관식을 제출하고 다음으로 가면 주관식 문제를 건너뛰지 않는다`

`다음 버튼은 문제 유형이 바뀌어도 폼 제출 버튼이 되지 않는다` 는 이 작업 후 **의미가 바뀐다.**
버튼이 애초에 폼과 무관해지므로, 남길지 `submitOrAdvance` 호출 검증으로 대체할지 판단한다.

## 확인 필요

1. **`QUIZ_ANSWER_FORM_ID` 를 계속 export 할 것인가.** 페이지가 더는 쓰지 않으면 feature 내부
   상수로 내릴 수 있다. Issue 5·6 의 일괄 제출이 이 id 를 쓸 계획인지 확인한 뒤 정한다.

## Changelog

| 날짜       | 요약      | 사유                                                                                                         | 연관 항목 |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------ | --------- |
| 2026-09-22 | 작업 생성 | FEAT-038 에서 주관식 건너뛰기 버그로 통로의 위험이 드러남. 버그는 최소 수정으로 막고 구조 변경을 분리해 기록 | FEAT-038  |
