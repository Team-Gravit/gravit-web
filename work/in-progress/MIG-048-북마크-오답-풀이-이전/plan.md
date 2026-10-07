---
id: 'MIG-048'
planned: '2026-10-05'
mode: 'migrate'
---

# MIG-048 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: migrate` — legacy-web 에 있는 북마크·오답노트 풀이를 `apps/web` 으로 옮긴다. 화면 틀은 시안 판정(P3)에
따라 legacy 가 아니라 `apps/web` 레슨 풀이를 따른다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                              |
| --- | ----------------------------------- | --- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | 예  | 두 빈 라우트에 레슨 풀이와 같은 틀의 복습 풀이를 붙인다. 신고·진입 차단(FIX-036)·레슨 동작 변경은 비목표 (`spec.md` Out of Scope) |
| 2   | 반복 비용이나 확장 차단이 있는가    | 예  | 풀이 화면이 `pages/lesson-quiz` 안에 있어 다른 page 가 쓸 수 없다. 복사하면 같은 화면 세 벌을 따로 고쳐야 한다                    |
| 3   | 보존할 동작의 기준선이 있는가       | 예  | `spec.md` 현행 동작 기준선 A~F · 동작 계약 K1~K5 · 판정 P1~P12 · AC-1~16                                                          |
| 4   | 자동 또는 수동 검증 방법이 있는가   | 예  | 레슨 풀이 기존 테스트(회귀) + MSW 통합 테스트(AC) + §5 수동 스모크                                                                |
| 5   | 범위를 독립적으로 완료할 수 있는가  | 예  | **단, §0-2 의 분리 후에.** 선행 REF → A(북마크) → B(오답노트) 순으로 각각 머지 가능                                               |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | 예  | §5. 각 단계가 별도 브랜치·PR 이라 되돌리기 단위가 분명하다. 생성물·라우트 트리 변경 없음                                          |

### 0-2. 자동 보류 신호

| 신호                              |  해당  | 처리                                                                                                                                                                |
| --------------------------------- | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 동작 변경과 구조 변경이 섞여 있다 | **예** | 레슨 풀이 화면을 공용으로 꺼내는 일은 **레슨 동작을 바꾸지 않는 구조 변경**이다. 복습 풀이 추가(동작 변경)와 한 PR 에 섞지 않고 **선행 REF 작업으로 분리**한다 (§1) |
| 한 단위로 완료·검증할 수 없다     | 아니오 | REF · A · B 세 단위로 나눴다                                                                                                                                        |
| 자동 생성물을 직접 고쳐야 한다    | 아니오 | 네 API 모두 생성돼 있다. 라우트 파일은 이미 있어 트리도 바뀌지 않는다                                                                                               |
| 기존 실패의 원인을 설명할 수 없다 | 아니오 | 알려진 간헐 실패는 `FIX-045` 로 기록돼 있다. 이번 범위의 파일과 무관하다                                                                                            |
| 범위 밖 문제를 새로 발견했다      | 아니오 | —                                                                                                                                                                   |

> 이 계획은 선행 REF 가 끝났다고 전제하고 A · B 를 쓴다. REF 의 내용은 §1 에 요약하고, 승인되면
> `work/to-do/REF-049-풀이-화면-공용화/` 를 따로 만든다 (번호는 사용자 확정 필요).

---

## 1. 선행 작업 — REF-049 풀이 화면 공용화 (동작 불변)

**목표** — 레슨 풀이 화면을 복습 풀이도 쓸 수 있게 아래 레이어로 꺼낸다. **레슨 풀이의 사용자 동작은 그대로다.**
기준선은 기존 테스트다 (`pages/lesson-quiz/ui/lesson-quiz-page.test.tsx` · `features/lesson-quiz/**/*.test.ts`).

| 현재 위치                                                                                                          | 목표 위치                                | 변경 종류                                                                                           | import 영향             |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------- |
| `pages/lesson-quiz/ui/lesson-quiz-page.tsx` 의 `QuizScreen` · `QuizFooter` · `SubmittingOverlay` · `ProblemSolver` | `widgets/quiz-screen/ui/quiz-screen.tsx` | 이동 + props 화 — 제목·나가기 경로·마지막 버튼 문구·마지막 동작·하단 왼쪽 슬롯·북마크 슬롯을 받는다 | `pages/lesson-quiz` 1곳 |
| `pages/lesson-quiz/ui/quiz-top-bar.tsx` · `quiz-timer.tsx` · `loading-screen.tsx`                                  | `widgets/quiz-screen/ui/`                | 이동                                                                                                | 같음                    |
| `features/lesson-quiz/model/quiz-session-context.tsx` `lessonId`                                                   | 같은 파일 `sessionKey: string`           | 저장 키를 레슨 ID 에서 문자열 키로 넓힌다. 레슨은 지금과 **같은 키 문자열**을 만든다                | 라우트 `onLeave` · page |
| `features/lesson-quiz/model/quiz-session-storage.ts`                                                               | 같은 파일                                | 키 인자 타입만 바꾼다. 기존 `gravit.quiz-session.{lessonId}` 값은 유지 (새로고침 복원 호환)         | 같음                    |
| `features/lesson-quiz/model/quiz-session-context.tsx` `AdvanceAction` `'submitLesson'`                             | `'finish'`                               | 이름만. 「마지막 문제의 동작」은 화면이 정한다                                                      | page · 테스트           |

**검증** — 기존 레슨 테스트를 **수정 없이** 통과 (이름 바뀐 `AdvanceAction` 을 직접 단언하는 테스트가 있으면 그 줄만).
`pnpm lint` 의 steiger 가 widget → page 역참조 없음을 확인한다.

---

## 2. 영향 분석 (A · B)

`rg -l` 실측 (2026-10-05) — 레슨 풀이 관련 모듈을 import 하는 곳은 `pages/lesson-quiz` 와 레슨 라우트 2곳뿐이다.

| 구분 | 파일                                                                                                                                                                               | 이슈  |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 신규 | `entities/problem/api/use-review-problems.ts` — 북마크·오답 목록 조회 (`toLessonProblems` 재사용, 응답 모양이 같다)                                                                | A·B   |
| 신규 | `features/problem-submission/` — 단건 제출 mutation + 실패 토스트 (`saveProblemSubmission`)                                                                                        | A     |
| 신규 | `features/wrong-answer-exclude/` — 제외 mutation · `오답노트에서 제외` 버튼 · 토스트                                                                                               | B     |
| 신규 | `pages/review-quiz/` — `kind: 'bookmark' \| 'wrongAnswer'` 를 받는 page 하나                                                                                                       | A·B   |
| 신규 | `app/routes/_authenticated/_focus/-review-quiz-leave.ts` — 풀이 이탈 시 목록 캐시 무효화 (라우트 `onLeave` 가 호출)                                                                | A·B   |
| 수정 | `shared/ui/button/button.tsx` + stories — `stroke-error` variant (P10)                                                                                                             | B     |
| 수정 | `features/lesson-quiz/model/quiz-session-context.tsx` — **선택적** 제출 함수 주입. 주면 응답 성공 뒤에 답을 기록하고 그동안 `pendingProblemId` 로 잠근다 (P6). 안 주면 지금과 같다 | A     |
| 수정 | `features/lesson-quiz/ui/objective-solver.tsx` · `subjective-answer.tsx` — 제출 중이면 입력 잠금                                                                                   | A     |
| 수정 | `features/problem-bookmark/api/use-toggle-problem-bookmark.ts` — 낙관적 갱신 대상을 `lessonId` 고정에서 **queryKey 인자**로 넓힌다                                                 | A     |
| 수정 | `entities/problem/ui/option-result-list.tsx` · `answer-result.tsx` — 정답 해설 안에 넣을 `action` 슬롯 (좁은 화면 제외 버튼, P1)                                                   | B     |
| 수정 | `widgets/quiz-screen/ui/quiz-screen.tsx` — 하단 왼쪽 슬롯·해설 슬롯 연결                                                                                                           | B     |
| 수정 | `_focus/learning.units.$unitId.bookmarked-problems.tsx` · `…incorrect-problems.tsx` — `component: () => null` 을 page 로 교체 + `onLeave`                                          | A · B |
| 삭제 | 없음                                                                                                                                                                               |       |

> 라우트 파일은 이미 있다 (`MIG-030`). 경로가 바뀌지 않으므로 **라우트 트리 재생성 대상이 아니다.** 그래도
> `pnpm build` 가 트리를 다시 쓰면 diff 가 없는지 확인한다.

### 이전 매핑 (legacy → apps/web)

| legacy                                                                                | apps/web                                                                    | 비고                                                       |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `pages/…/bookmarked-problems.tsx` · `incorrect-problems.tsx`                          | `app/routes/_authenticated/_focus/learning.units.$unitId.*.tsx` (이미 있음) | 라우트 어댑터만                                            |
| `widgets/learning-widget/ui/BookmarkQuizComponent.tsx` · `IncorrectQuizComponent.tsx` | `pages/review-quiz/ui/review-quiz-page.tsx`                                 | 두 화면을 `kind` 로 구분하는 page 하나                     |
| `widgets/learning-widget/quiz/BaseQuizComponent.tsx` · `AnswerInteraction.tsx`        | `widgets/quiz-screen` (REF-049)                                             | 레슨 풀이 틀로 대체 (P3)                                   |
| `widgets/learning-widget/quiz/incorrect/*`                                            | 없음 — `widgets/quiz-screen` 슬롯 + `features/wrong-answer-exclude`         | 별도 해설 화면을 만들지 않는다                             |
| `entities/learning/model/use-fetch-{bookmarked,incorrect}-problems`                   | `entities/problem/api/use-review-problems.ts`                               | `refetchOnMount: 'always'` 는 이탈 시 무효화(P7·P8)로 대체 |
| `features/quiz/api/use-remove-incorrect-problem.tsx` · `RemoveFromMistakeListBtn.tsx` | `features/wrong-answer-exclude/`                                            | 낙관적 캐시 플래그는 옮기지 않는다 (기준선 발견 4)         |
| `features/learning/api/use-toggle-bookmark.tsx`                                       | `features/problem-bookmark` (기존) 확장                                     |                                                            |
| `features/quiz/model/quiz-session-store.ts` (STREAM)                                  | `features/lesson-quiz` 세션 + 제출 함수 주입                                | Zustand 스토어를 옮기지 않는다                             |

---

## 3. 구현 계획 체크리스트

### Issue A — 북마크 풀이 (선행: REF-049 머지)

- [x] `[entities]` `use-review-problems.ts` — `useBookmarkedProblems(unitId)` · `useWrongAnsweredProblems(unitId)`. 생성 훅 + `select: toLessonProblems`. 풀이 중 목록이 바뀌지 않도록 `refetchOnWindowFocus: false` · `staleTime: Infinity` (무효화는 이탈 때만, P7·P8). 배럴에 노출
- [x] `[features]` `problem-submission` — `useSubmitProblemResult({ onError })`: `saveProblemSubmission` 에 `{ problemId, isCorrect, selectedOptionId | submittedContent }` (P5). 실패 시 토스트 `답안을 저장하지 못했어요. 다시 시도해 주세요.` (P11). 테스트: 본문 형태 · 실패 토스트 (AC-2 · AC-3 · AC-6 의 단위 부분)
- [x] `[features]` `lesson-quiz` 세션 — Provider 에 선택 prop `submitAnswerRemotely?: (input) => Promise<void>`. 주면: 제출 시 `pendingProblemId` 설정 → 성공하면 `submitAnswer` 기록 → 실패하면 기록하지 않고 잠금만 푼다. reducer 테스트에 pending 전이 추가. **안 주면 지금과 같다** (레슨 회귀 AC-16)
- [x] `[features]` `objective-solver` · `subjective-answer` — `pendingProblemId === problem.problemId` 이면 선택·입력 잠금 (AC-6-1)
- [x] `[features]` `problem-bookmark` — `useToggleProblemBookmark({ problemsQueryKey })`. 레슨은 기존 키를 그대로 넘긴다. 목록에서 문제를 빼지 않고 `isBookmarked` 만 뒤집는다 (AC-8)
- [x] `[widgets]` `quiz-screen` — 마지막 버튼 문구·동작 props 를 복습 풀이에 맞게 쓸 수 있는지 확인. 복습은 `완료` → 유닛 상세 `replace` 이동 (P4 · AC-5). X 는 지금처럼 확인 없이 유닛 상세 (AC-7)
- [x] `[pages]` `review-quiz` — `ReviewQuizPage({ unitId, kind })`. 로딩·실패·빈 목록은 레슨 풀이와 같은 상태 화면 (S6). 세션 키 `review:{kind}:{unitId}`. 단건 제출 함수를 세션에 주입
- [x] `[app]` `…bookmarked-problems.tsx` — `beforeLoad` 로 `unitId` 검증(레슨 라우트와 같은 방식), `component` 연결, `onLeave` 에서 북마크 목록 무효화 + 세션 저장본 삭제 (AC-9)
- [x] `[app]` `pnpm build` 후 `routeTree.gen.ts` diff 없음 확인
- [x] 테스트 — 통합: AC-1 · 2 · 3 · 4 · 5 · 6 · 6-1 · 7 · 8 · 9 · 10. 회귀: AC-16

### Issue B — 오답노트 풀이 (선행: A 머지)

- [ ] `[shared]` `Button` `stroke-error` variant — `border-semantic-error bg-bg-0 text-semantic-error` + hover·disabled. story 추가 (P10)
- [ ] `[entities]` `OptionResultList` · `AnswerResult` — 정답을 맞혔을 때 해설 줄에 넣는 `correctAction?: ReactNode` 슬롯. 슬롯이 없으면 지금과 같다
- [ ] `[features]` `wrong-answer-exclude` — `useExcludeWrongAnswer()` (`deleteWrongAnsweredProblem`, `retry: false`). 성공 토스트 `오답노트에서 제외했어요.` · 실패 토스트 `오답노트에서 제외하지 못했어요.` (P11). `ExcludeWrongAnswerButton({ problemId, size })` — 성공하면 렌더하지 않는다 (P8). 제외한 문제 ID 는 page 세션 동안만 기억한다
- [ ] `[widgets]` `quiz-screen` — 하단 왼쪽 슬롯(넓은 화면) · 해설 슬롯(좁은 화면) 연결. 「현재 문제를 맞혔을 때만」 조건은 page 가 정한다
- [ ] `[pages]` `review-quiz` — `kind: 'wrongAnswer'` 분기: 목록 훅 교체, 맞힌 문제에 제외 버튼 (넓은 화면 하단 왼쪽, 좁은 화면 정답 해설 안 — P1 · AC-11)
- [ ] `[app]` `…incorrect-problems.tsx` — `beforeLoad` · `component` · `onLeave` 에서 오답 목록 무효화 + 저장본 삭제 (AC-15)
- [ ] 테스트 — 통합: AC-11 · 12 · 13 · 14 · 15. `Button` variant 는 기존 button 테스트 방식에 맞춘다

---

## 4. 결정한 설계 (근거)

| 결정                                          | 근거                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| page 하나(`review-quiz`)에 `kind`             | 두 화면 차이가 목록 API · 제외 버튼 · 무효화 키뿐이다. page 둘이면 cross-slice 로 공통을 나눌 수 없어 widget 이 더 커진다 |
| 단건 제출을 **세션 Provider 에 주입**         | 응답 뒤에 기록해야 진행률·해설이 서버와 어긋나지 않는다 (P6). 화면마다 기록 시점을 따로 짜면 레슨과 갈라진다              |
| 세션 저장(새로고침 복원)을 복습 풀이에도 쓴다 | P3 「진행 방식은 레슨과 같다」. 키 `review:{kind}:{unitId}`, 이탈 시 삭제는 레슨과 같은 `onLeave`                         |
| 목록 무효화는 라우트 `onLeave`                | P12 — X · `완료` · 뒤로가기 모두 지나가고 새로고침은 지나가지 않는 유일한 지점. 레슨 저장본 삭제가 이미 같은 방식이다     |
| 풀이 중 목록 자동 재조회를 끈다               | 창 포커스 재조회로 해제한 북마크·제외한 문제가 목록에서 빠지면 세션 키가 바뀌어 **풀이가 처음부터 다시 시작된다**         |

---

## 5. 리스크

| 리스크                                            | 영향                                       | 대응                                                                            |
| ------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| REF-049 에서 레슨 풀이 회귀                       | 출시된 화면이 깨진다 (K5)                  | 기존 테스트 무수정 통과를 완료 조건으로. REF 를 별도 PR 로 먼저 머지            |
| 새로고침 후 목록이 달라짐 (북마크 해제·제외 반영) | 저장본과 문제 ID 가 달라 세션이 초기화된다 | 레슨 저장소가 이미 「ID 구성이 다르면 버린다」로 처리한다. 수동 스모크로 확인만 |
| 단건 제출 대기 지연                               | 답마다 잠깐 멈춘다                         | 잠금 동안 선지 비활성으로 이중 제출 방지 (AC-6-1). 체감이 나쁘면 별도 작업      |
| 복습 풀이가 진행률·XP 를 레슨으로 기록            | 점수 중복 (K2)                             | AC-5 가 `POST /api/v1/lessons/results` 0회를 단언                               |
| `stroke-error` 가 기존 variant 와 다른 상태 규칙  | hover·disabled 가 어긋난다                 | `stroke-default` 와 같은 구조로 색만 바꾼다. story 로 확인                      |
| 생성물 · 토큰                                     | —                                          | orval 재생성 없음. 새 토큰 없음 (8개 모두 기존 토큰)                            |

### 동일성 확인

| 방법        | 내용                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| 자동 테스트 | AC-1~16 (MSW 통합). 레슨 풀이 기존 테스트 무수정 통과                                                   |
| 라우트 진입 | `/learning/units/{id}/bookmarked-problems` · `incorrect-problems` 직접 진입 → 1번 문제 · 진행률 `0/N`   |
| 수동 스모크 | 실제 계정: 유닛 상세 → 오답노트 → 맞히고 제외 → `완료` → 유닛 상세 오답노트 진입 가능 여부가 갱신되는지 |
| 수동 스모크 | 북마크 풀이에서 해제 → 다음 문제 → 이전 문제로 돌아와도 문제가 남는지 → 나간 뒤 재진입 시 빠졌는지      |
| 명시적 대조 | 단건 제출 요청 본문을 개발자 도구에서 확인 (객관식 `selectedOptionId` · 주관식 `submittedContent`)      |

---

## 6. 승인 후 진행 순서

1. REF-049 작업 폴더 생성 → 브랜치 `refactor/#{이슈}/quiz-screen` (develop 기준) → 구현·검증·PR
2. MIG-048 폴더를 `in-progress/` 로 `git mv` → 브랜치 `feat/#{A}/bookmark-quiz` → Issue A
3. A 머지 후 `feat/#{B}/wrong-answer-quiz` → Issue B
