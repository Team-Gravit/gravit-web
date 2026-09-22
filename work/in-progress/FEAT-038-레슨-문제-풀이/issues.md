---
id: 'FEAT-038'
---

# FEAT-038 이슈 분해

> `feature-planner` 3단계 산출물. 근거는 `spec.md`의 확정된 규칙(R1~R11)·시안(D1~D19)·ADR-1~4다.
> 규칙·시안 번호를 그대로 인용하므로 둘을 함께 읽는다.

## 슬라이싱 방침

ADR-3이 남긴 문제 — **`shared/ui` 프리미티브 3종(라디오·텍스트 필드·아코디언)이 없어서
레이어 순서대로 만들면 첫 이슈가 화면을 못 낸다.** 그래서 프리미티브를 독립 이슈로 두지 않고
**그것을 처음 쓰는 이슈 안에 넣는다.** 라디오·아코디언은 Issue 2, 텍스트 필드는 Issue 3이다.

| 이슈 | 끝나면 사용자가 할 수 있는 것                    |
| ---- | ------------------------------------------------ |
| 1    | 레슨에 들어가 문제를 읽는다                      |
| 2    | 객관식 한 문제를 풀고 정/오답과 해설을 본다      |
| 3    | 주관식 한 문제를 풀고 정답과 해설을 본다         |
| 4    | 문제 사이를 오가고 진행 상태를 본다              |
| 5    | 레슨을 끝내고 결과(정답률·풀이 시간)를 본다      |
| 6    | 시안대로 마감된 결과 화면에서 다음 행동을 고른다 |

> **GitHub Issue 연결 (2026-09-20)** — 실행 이슈 6개를 GitHub Issue **2개**에 나눠 걸었다.
> `work-management.md`의 1:1 규칙과 다르므로 사유를 남긴다: 1~4는 이미 한 흐름으로 구현이
> 끝나 PR 하나로 나가고, 5~6은 배경 에셋을 기다린다. 이 저장소는 PR 자동 검사가 없어
> (`git-workflow.md` §3) 리뷰를 전부 사람이 하므로 PR을 둘로 나누는 편이 읽기 쉽다.
>
> | GitHub Issue                                                                       | 실행 이슈 | 브랜치                  |
> | ---------------------------------------------------------------------------------- | --------- | ----------------------- |
> | [#239](https://github.com/Team-Gravit/gravit-web/issues/239) 레슨 문제 풀이 화면   | 1~4       | `feat/#239/lesson-quiz` |
> | [#240](https://github.com/Team-Gravit/gravit-web/issues/240) 레슨 제출과 결과 화면 | 5~6       | 미생성                  |

---

## Issue 1: [학습] 레슨에 들어가면 문제를 읽을 수 있다

GitHub Issue: [#239](https://github.com/Team-Gravit/gravit-web/issues/239)

### 설명

유닛 상세에서 레슨을 눌러도 지금은 빈 화면이다(`component: () => null`). 문제 목록을 받아 첫
문제의 발문과 본문을 보여주고, 상단바·타이머·로딩 화면을 세운다. 이 이슈가 끝나면 **레슨이
처음으로 무언가를 보여준다.**

### 구현 범위

| 레이어     | 파일                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| `shared`   | `ui/loading-screen/` — D1 랜딩 로딩(마스코트·`로딩중...`·팁 1줄). **신규**     |
| `entities` | `problem/model/problem.ts` — `toLessonProblems` 변환                           |
| `entities` | `problem/api/use-lesson-problems.ts` — `useGetAllProblemInLesson` 래핑         |
| `entities` | `problem/ui/problem-card.tsx` — 문제 번호·발문·본문 (D4)                       |
| `pages`    | `lesson-quiz/ui/lesson-quiz-page.tsx` — 상단바(D2) + 문제 카드 + 타이머 칩(D3) |
| `app`      | `routes/_authenticated/_focus/learning.lessons.$lessonId.tsx` — component 연결 |

`shared/ui/loading-screen`은 Issue 5의 제출 중 표시와 결과 라우트 pending도 쓴다(ADR-2).
신고 버튼(D2)·북마크(D4)는 Out of Scope이므로 **렌더하지 않는다.**

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given `{ unitSummaryResponse: { unitId: 3, displayOrder: 1, title: '연결리스트', description: '' }, problems: [문제 2개], totalProblems: 2 }`
When `toLessonProblems(response)`
Then `unitSummary.unitId === 3` · `unitSummary.title === '연결리스트'` · `problems.length === 2` · `totalProblems === 2`

☑ **AC-2** (범위: 단위)
Given 문제 10개를 담은 응답
When `toLessonProblems(response)`
Then 첫 문제의 `displayNumber === '01'`, 10번째 문제의 `displayNumber === '10'`

> **AC-1·2 수정 (2026-09-19, 구현 중).** 처음에는 `toLessonProblems`가 `unitLabel: 'Unit01'`을
> 반환하도록 썼는데, `Unit__` 표기를 만드는 `toUnitLabel`·`formatUnitNumber`가
> `entities/learning`에 있다. `entities/problem`이 그걸 부르면 **cross-slice import**라 훅이
> 막는다. 복사하면 같은 표기 규칙이 두 곳에 생기고, `shared`로 내리면 `entities/learning`의
> 사용처 4곳을 건드려 이번 범위를 넘는다.
> 그래서 변환은 `unitSummary`를 그대로 넘기고 **라벨 조립은 두 엔티티를 함께 아는 `pages`가**
> 한다 (`plan.md` §3의 「엔티티끼리는 서로 모른다」). 대신 `displayNumber`(문제 번호 `01`, D4)가
> 실제 파생값이라 AC-2를 그쪽으로 옮겼다. `Unit01 - 연결리스트` 표기는 AC-4가 그대로 검증한다.

☑ **AC-3** (범위: 통합)
Given `GET /api/v1/problems/7`이 아직 응답하지 않음
When `/learning/lessons/7`을 렌더
Then `로딩중...` 텍스트가 1개 있고, 발문 텍스트는 0개다

☑ **AC-4** (범위: 통합)
Given 응답의 첫 문제가 `{ problemId: 101, problemType: 'OBJECTIVE', instruction: '다음 중 옳은 것은?', content: '연결리스트 맨 앞 삽입의 시간복잡도는?' }`
When 응답이 도착
Then 상단바에 `Unit01 - 연결리스트`, 문제 번호 `01`, `다음 중 옳은 것은?`, `연결리스트 맨 앞 삽입의 시간복잡도는?`이 각각 1개씩 있다

☑ **AC-5** (범위: 통합)
Given 응답이 도착한 직후
When 가짜 타이머로 7초를 진행
Then 타이머 칩 텍스트가 `00:07`이다

☑ **AC-6** (범위: 통합)
Given 응답이 도착한 직후
When 가짜 타이머로 65초를 진행
Then 타이머 칩 텍스트가 `01:05`다

☑ **AC-7** (범위: 통합)
Given `unitSummaryResponse.unitId === 3`인 응답이 도착
When 상단바의 닫기(X) 버튼을 클릭
Then `/learning/units/3`으로 이동하고, 뒤로가기해도 풀이 화면으로 돌아오지 않는다 (`replace` — 확인 필요 14)

☑ **AC-8** (범위: 통합)
Given `GET /api/v1/problems/7`이 500으로 실패
When `/learning/lessons/7`을 렌더
Then `문제를 불러오지 못했어요.` 문구와 `다시 시도` 버튼이 각각 1개다 (`CardRetryStatus` 재사용)

### 의존성

없음

---

## Issue 2: [학습] 객관식 한 문제를 풀면 정/오답과 해설이 보인다

GitHub Issue: [#239](https://github.com/Team-Gravit/gravit-web/issues/239)

### 설명

선지를 누르면 그 자리에서 채점되고(R1), 정답 선지가 열린 아코디언으로 바뀐다(R9). 이 이슈가
**이 작업의 핵심**이고, 풀이 세션 상태(ADR-1)가 여기서 태어난다.

### 구현 범위

| 레이어     | 파일                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `shared`   | `ui/radio/` — 미제출 선지용 라디오. Figma `14273-36105`. **신규**      |
| `shared`   | `ui/accordion/` — 제출 후 선지용. **신규**                             |
| `features` | `lesson-quiz/model/quiz-session.ts` — reducer·상태 전이 **순수 함수**  |
| `features` | `lesson-quiz/model/quiz-session-context.tsx` — Context + Provider      |
| `features` | `lesson-quiz/model/grade-objective.ts` — 객관식 채점                   |
| `features` | `lesson-quiz/ui/objective-solver.tsx` — 클릭→채점→세션 기록 **연결**만 |
| `pages`    | `lesson-quiz/ui/lesson-quiz-page.tsx` — Provider 연결                  |

**선지 표시는 `entities/problem/ui/option-list.tsx`에 둔다** — 정/오답 상태와 열림 여부를
prop으로 받고 행동을 모른다. ADR-3이 「전부 features」를 거부한 이유가 이것이다: 북마크·오답
풀이 화면(Out of Scope)이 나중에 같은 표시를 쓰는데 `features`에 있으면 cross-slice import가
된다. 클릭을 채점과 세션에 잇는 일만 `features`가 한다.

**색과 열림은 `data-*` 속성으로 표현한다.** 클래스 문자열 단언은 `test-policy.md` §5가 막고,
이 저장소는 이미 `data-slot`·`data-tone`(`CardStatus`)·`data-fill`(`ProgressBar`) 패턴을 쓴다.
선지는 `data-result="correct" | "incorrect" | "neutral"`을 갖는다.

타이머는 **세션 Context에 넣지 않는다** (ADR-1의 매초 리렌더 경고).

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given 선지 `[{ optionId: 10, isAnswer: true }, { optionId: 11, isAnswer: false }]`
When `gradeObjective(options, 11)`
Then `false`를 반환한다

☑ **AC-2** (범위: 단위)
Given 초기 세션과 `{ type: 'submitAnswer', problemId: 101, answer: { kind: 'objective', selectedOptionId: 10, isCorrect: true } }`
When reducer를 호출
Then `answersByProblemId[101] === { kind: 'objective', selectedOptionId: 10, isCorrect: true }`이고 `Object.keys(answersByProblemId).length === 1`이다

☑ **AC-3** (범위: 단위)
Given `answersByProblemId[101]`이 이미 `{ kind: 'objective', selectedOptionId: 10, isCorrect: true }`인 세션
When 같은 `problemId`로 `submitAnswer` 액션을 다시 호출 (`selectedOptionId: 11`)
Then `answersByProblemId[101].selectedOptionId === 10`으로 유지된다 (R3 — 제출은 되돌릴 수 없다)

☑ **AC-4** (범위: 통합)
Given 선지 2개 `10: 'O(1)'(정답)` · `11: 'O(n)'`가 미제출 상태
When `O(n)`을 한 번 클릭
Then `❌ 오답입니다!` 문구가 1개 나타난다 (R1 — 클릭 한 번으로 채점된다)

☑ **AC-5** (범위: 통합)
Given 선지 2개가 미제출 상태
When `O(n)`을 클릭
Then 열려 있는 선지는 `O(1)` 하나이고 그 본문에 `O(1)`의 `explanation` 텍스트가 있다. `O(n)`의 `explanation` 텍스트는 화면에 없다 (R9)

☑ **AC-6** (범위: 통합)
Given 선지 2개가 미제출 상태
When `O(n)`을 클릭
Then `O(n)`이 `data-result="incorrect"`, `O(1)`이 `data-result="correct"`를 갖는다 — `data-result="neutral"`이 아닌 선지가 2개다 (R11)

☑ **AC-7** (범위: 통합)
Given 선지 2개가 미제출 상태
When 정답인 `O(1)`을 클릭
Then `👏🏻 정답입니다!` 문구가 1개, 열린 선지가 `O(1)` 하나, `data-result="correct"`인 선지가 1개이고 `data-result="incorrect"`인 선지는 0개다 (R11)

☑ **AC-8** (범위: 통합)
Given `O(n)`을 클릭해 오답을 제출한 상태
When `O(n)` 선지의 헤더를 클릭
Then `O(n)`의 `explanation` 텍스트가 화면에 나타난다 (접힘일 뿐 잠기지 않는다)

☑ **AC-9** (범위: 통합)
Given `O(n)`을 클릭해 오답을 제출한 상태
When 다른 선지 `O(1)`을 클릭해 답을 바꾸려 시도
Then `❌ 오답입니다!` 문구가 그대로 1개이고 `data-result="incorrect"`인 선지가 여전히 `O(n)` 하나다 (R3)

### 의존성

Issue 1 완료 후 시작

---

## Issue 3: [학습] 주관식 문제를 풀면 정답과 해설이 보인다

GitHub Issue: [#239](https://github.com/Team-Gravit/gravit-web/issues/239)

### 설명

주관식은 `다음 문제`로 제출한 뒤 정답과 해설을 보고 한 번 더 눌러 이동한다(R2). 채점 규칙
(앞뒤 공백 제거 + 대소문자 무시 완전 일치, 확인 필요 6)이 여기서 코드가 된다.

### 구현 범위

| 레이어     | 파일                                                            |
| ---------- | --------------------------------------------------------------- |
| `shared`   | `ui/text-field/` — Figma `9270-13564`. 에러 상태 포함. **신규** |
| `features` | `lesson-quiz/model/grade-subjective.ts` — 주관식 채점           |
| `features` | `lesson-quiz/ui/subjective-answer.tsx` — 입력·제출 후 표시(D11) |

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given `contents: ['DFS', '깊이 우선 탐색']`
When `gradeSubjective(contents, '  dfs  ')`
Then `true`를 반환한다 (앞뒤 공백 제거 + 대소문자 무시)

☑ **AC-2** (범위: 단위)
Given `contents: ['투 포인터']`
When `gradeSubjective(contents, '투포인터')`
Then `false`를 반환한다 (띄어쓰기는 무시하지 않는다 — 확인 필요 6)

☑ **AC-3** (범위: 단위)
Given `contents: ['스택 오버플로']`
When `gradeSubjective(contents, '스택')`
Then `false`를 반환한다 (부분 일치를 정답으로 보지 않는다)

☑ **AC-4** (범위: 단위)
Given `contents: ['DFS']`
When `gradeSubjective(contents, '   ')`
Then `false`를 반환한다

☑ **AC-5** (범위: 통합)
Given 주관식 문제의 `answerResponse: { contents: ['DFS'], explanation: '깊이를 우선한다' }`
When 입력창에 `BFS`를 넣고 `다음 문제`를 클릭
Then `❌ 정답: DFS` 문구가 1개이고 `깊이를 우선한다`가 1개다 (D11)

☑ **AC-6** (범위: 통합)
Given 같은 문제
When 입력창에 `dfs`를 넣고 `다음 문제`를 클릭
Then `👏🏻 정답입니다!` 문구가 1개다 (D12)

☑ **AC-7** (범위: 통합)
Given 주관식 문제 `{ contents: ['DFS'] }`, 입력창이 빈 상태
When `다음 문제`를 클릭
Then 다음 문제의 발문이 보이고 `❌ 정답: DFS`와 `👏🏻 정답입니다!`가 모두 화면에 없다 (기록되지 않았다 — R2·R4)

> **AC-7 수정 (2026-09-22, 구현 중).** 답을 입력하면 제출 결과를 확인한 뒤 이동하고,
> 빈 입력이면 기록 없이 바로 이동하도록 분기를 확정했다.

### 의존성

Issue 2 완료 후 시작 (세션 Context를 쓴다). Issue 4와 병렬 가능

---

## Issue 4: [학습] 문제 사이를 오가고 진행 상태를 볼 수 있다

GitHub Issue: [#239](https://github.com/Team-Gravit/gravit-web/issues/239)

### 설명

`이전/다음` 버튼(D8)과 진행 패널(D6)로 문제를 오간다. 제출하지 않고 넘어간 문제는 미완료가
되고(R4), 패널에서 그 문제로 돌아갈 수 있다(R5). 좁은 화면에서는 패널을 숨긴다(R8).

### 구현 범위

| 레이어     | 파일                                                                             |
| ---------- | -------------------------------------------------------------------------------- |
| `features` | `lesson-quiz/model/quiz-session.ts` — `goToNext`·`goToPrevious`·`goTo` 액션 추가 |
| `features` | `lesson-quiz/model/progress.ts` — 문제별 상태(현재·완료·미완료) 계산             |
| `widgets`  | `quiz-progress-panel/` — 진행률·번호 그리드·범례 3종. **조립만** (ADR-4)         |
| `pages`    | `lesson-quiz/ui/lesson-quiz-page.tsx` — 넓은 화면 좌측 열 배치·이동 버튼         |

ADR-4대로 패널은 **자기 위치와 개폐 상태를 갖지 않는다.** 배치는 페이지가 한다.
문제별 상태는 선지와 같은 방식으로 `data-status="current" | "completed" | "incomplete"`로 드러낸다.

### 완료 조건 (Acceptance Criteria)

☑ **AC-1** (범위: 단위)
Given 문제 3개(`problemId` 101·102·103), `answersByProblemId = { 101: { kind: 'objective', selectedOptionId: 10, isCorrect: true } }`, `currentProblemIndex = 1`
When `toProblemProgressStatuses(problems, answersByProblemId, currentProblemIndex)`
Then `['completed', 'current', 'incomplete']`를 반환한다

☑ **AC-2** (범위: 단위)
Given `currentProblemIndex = 0`인 세션
When `goToPrevious` 액션
Then `currentProblemIndex === 0`으로 유지된다 (첫 문제에서 더 뒤로 가지 않는다)

☑ **AC-3** (범위: 단위)
Given 문제 3개, `currentProblemIndex = 2`인 세션
When `goTo` 액션으로 `problemIndex: 0`
Then `currentProblemIndex === 0`이고 `answersByProblemId`는 변하지 않는다

☑ **AC-4** (범위: 통합)
Given 문제 3개, 1번을 제출하지 않은 상태
When `다음 문제`를 클릭
Then 2번 문제의 발문이 화면에 있고, 진행 패널의 1번 항목이 `data-status="incomplete"`를 갖는다 (R4)

☑ **AC-5** (범위: 통합)
Given 문제 3개, 1번을 제출하지 않고 `다음 문제`로 2번에 와 있는 상태
When 진행 패널의 1번 항목을 클릭
Then 1번 문제의 발문이 화면에 있고 선지가 미제출 상태다 (R5 — 돌아가서 풀 수 있다)

☑ **AC-6** (범위: 통합)
Given 문제 10개
When 그중 2개를 제출
Then 진행률 텍스트가 `2/10`이다 (D6)

☑ **AC-7** (범위: 통합)
Given 뷰포트 너비가 넓은 화면 기준 미만
When 풀이 화면을 렌더
Then 진행 패널이 렌더되지 않고 `이전`·`다음` 버튼이 각각 1개다 (R8·D8)

### 의존성

Issue 2 완료 후 시작. Issue 3과 병렬 가능

---

## Issue 5: [학습] 레슨을 끝내면 제출하고 결과를 볼 수 있다

GitHub Issue: [#240](https://github.com/Team-Gravit/gravit-web/issues/240)

### 설명

마지막 문제에서 제출하면 답과 집계를 한 번에 보내고(일괄 제출), 결과 라우트로 이동해 정답률과
풀이 시간을 본다. ADR-2의 라우트 분리가 여기서 실현된다.

### 구현 범위

| 레이어     | 파일                                                                                  |
| ---------- | ------------------------------------------------------------------------------------- |
| `features` | `lesson-quiz/model/accuracy.ts` — 정확도 계산 (R6)                                    |
| `features` | `lesson-quiz/api/use-submit-lesson.ts` — `useSaveLessonSubmission` 래핑·결과 prefetch |
| `entities` | `learning/api/use-lesson-result.ts` — `useGetLessonResult` 래핑                       |
| `pages`    | `lesson-result/ui/lesson-result-page.tsx` — 정답률·풀이 시간·에러 상태                |
| `app`      | `routes/.../learning.lessons.$lessonId.result.$submissionId.tsx` — **신규 라우트**    |

라우트를 추가하므로 `routeTree.gen.ts` 재생성이 필요하다 (직접 편집 금지).

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given 문제 10개 중 정답 3개, 오답 2개, 미완료 5개
When `toAccuracy(problems, answersByProblemId)`
Then `30`을 반환한다 (R6 — 분모는 전체 문제 수)

☐ **AC-2** (범위: 단위)
Given 문제 3개 중 정답 2개 (`2/3 = 66.6…`)
When `toAccuracy(problems, answersByProblemId)`
Then `67`을 반환한다 (정수로 반올림)

☐ **AC-3** (범위: 단위)
Given `lessonId: 7`, 경과 80초, 정확도 30, `answersByProblemId = { 101: { kind: 'objective', selectedOptionId: 10, isCorrect: true } }`
When 제출 본문을 만듦
Then `lessonSubmissionSaveRequest === { lessonId: 7, learningTime: 80, accuracy: 30 }`이고 `problemSubmissionSaveRequests.length === 1`이며 그 첫 항목이 `{ problemId: 101, isCorrect: true, selectedOptionId: 10 }`이다

☐ **AC-4** (범위: 통합)
Given 마지막 문제를 제출한 상태에서 `POST /api/v1/lessons/results`가 아직 응답하지 않음
When `학습 완료`를 클릭
Then `로딩중...` 텍스트가 1개 있고 문제 발문은 화면에 없다 (제출 중은 풀이 라우트가 갖는다 — ADR-2)

☐ **AC-5** (범위: 통합)
Given `lessonId: 7`의 마지막 문제를 제출한 상태, `POST`가 `{ lessonSubmissionId: 345, isLevelUp: false, isLeaguePromoted: false }`를 반환
When `학습 완료`를 클릭
Then `/learning/lessons/7/result/345`로 이동하고, 뒤로가기 기록에 `/learning/lessons/7`이 남지 않는다 (`replace`)

☐ **AC-6** (범위: 통합)
Given 문제 3개를 모두 제출한 상태, `POST`가 500으로 실패
When `학습 완료`를 클릭
Then 현재 문제의 발문이 화면에 그대로 있고, 재시도 수단이 1개이며, 진행 패널의 `data-status="completed"` 항목이 3개로 유지된다 (풀이 화면에 남고 답을 잃지 않는다 — ADR-2)

☐ **AC-7** (범위: 통합)
Given `GET /api/v1/lessons/results/345`가 `{ accuracy: 15, learningTime: 196, ... }`을 반환
When `/learning/lessons/7/result/345`를 렌더
Then `15%`와 `03:16`이 각각 1개씩 있다 (D17)

☐ **AC-8** (범위: 통합)
Given `GET /api/v1/lessons/results/999`가 404로 실패
When `/learning/lessons/7/result/999`로 직접 진입
Then 결과를 불러오지 못했다는 문구가 1개 있다 (ADR-2가 예고한 직접 진입 경로)

### 의존성

Issue 4 완료 후 시작

---

## Issue 6: [학습] 결과 화면을 시안대로 마감한다

GitHub Issue: [#240](https://github.com/Team-Gravit/gravit-web/issues/240)

### 설명

Issue 5가 세운 결과 화면에 배경·카드·XP 막대·다음 행동 버튼을 채운다(D14~D18). 배경 에셋이
필요해 **에셋 도착 후 시작**한다 (확인 필요 4).

### 구현 범위

| 레이어     | 파일                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| `entities` | `user/model/level.ts` — `toLevelProgress(userLevelResponse)` 추가              |
| `shared`   | `ui/layout/space-background.tsx` — 결과용 variant 추가 여부 판단 (확인 필요 4) |
| `pages`    | `lesson-result/ui/` — 결과 카드(D15) · XP 막대(D16) · 버튼 2종(D18)            |

XP 막대는 **서버의 `minXp`·`maxXp`로 그린다.** `getLevelInfo`/`LEVEL_XP_TABLE`은 쓰지 않는다
(확인 필요 2). 레벨업·리그 승급·리그 이름은 **표시하지 않는다** (D19).

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given `{ currentLevel: 13, nextLevel: 14, xp: 789, minXp: 700, maxXp: 900 }`
When `toLevelProgress(userLevel)`
Then `{ percent: 45, currentXp: 789, nextLevel: 14 }`를 반환한다 — `(789-700)/(900-700) = 44.5 → 45`

☐ **AC-2** (범위: 단위)
Given 최고 레벨 `{ currentLevel: 30, nextLevel: 30, xp: 5000, minXp: 5000, maxXp: 5000 }`
When `toLevelProgress(userLevel)`
Then `percent === 100`이고 예외를 던지지 않는다 (분모 0 — 확인 필요 2의 경고)

☐ **AC-3** (범위: 통합)
Given 결과 응답의 `unitSummaryResponse.title === '연결리스트'`
When `/learning/lessons/7/result/345`를 렌더
Then `지구 정복에 더 가까워졌어요!`와 `연결리스트 학습 완료`가 각각 1개다 (D15)

☐ **AC-4** (범위: 통합)
Given 결과 응답의 `userLevelResponse`가 `{ xp: 789, nextLevel: 14, minXp: 700, maxXp: 900 }`
When 결과 화면을 렌더
Then `789XP`와 `LV14까지`가 각각 1개이고 진행 막대의 `aria-valuenow`가 `45`다 (D16)

☐ **AC-5** (범위: 통합)
Given 결과 응답의 `leagueName: '브론즈'`
When 결과 화면을 렌더
Then `브론즈` 텍스트가 화면에 없다 (D19 — API는 주지만 시안에 없다)

☐ **AC-6** (범위: 통합)
Given `unitSummaryResponse.unitId === 3`
When `홈으로`를 클릭
Then `/main`으로 이동한다 (확인 필요 5의 잠정 결정)

☐ **AC-7** (범위: 통합)
Given 같은 상태
When `이어서 학습하기`를 클릭
Then `/learning/units/3`으로 이동한다 (확인 필요 5의 잠정 결정)

### 의존성

Issue 5 완료 후 시작 + **배경 에셋 수령** (확인 필요 4)

---

## 시퀀스 검토

- [x] 각 의존성이 실제 입력·계약 관계를 근거로 하나
      — 2는 1의 문제 조회·표시가 있어야 선지를 붙일 수 있다. 3·4는 2가 만드는 세션 Context를
      쓴다. 5는 4의 이동이 있어야 마지막 문제에 도달한다. 6은 5가 세운 결과 라우트에 얹는다
- [x] 순환 의존성이 없고, 독립 이슈는 병렬로 진행할 수 있게 표시했나 — 3과 4가 병렬이다
- [x] 역방향 의존이 없나 — `issue-reviewer` 검토에서 **Issue 3 AC-7이 Issue 4의 진행 패널을
      필요로 하는 숨은 역방향 의존**이 드러나 `단위`로 내렸다. Issue 5 AC-6은 선행 이슈(4)의
      산출물이므로 통합으로 남긴다
- [x] 선행 이슈가 빠져 다음 이슈 구현이 불가능한 구간이 없나
      — `shared/ui` 프리미티브 3종을 쓰는 이슈 안에 포함시켜 빈 구간을 없앴다
- [x] `spec.md`의 Out of Scope 항목이 어떤 이슈에도 들어가 있지 않나
      — 신고·북마크·선지 가리기는 Issue 1·2의 구현 범위에서 **렌더하지 않는다**고 명시했다.
      북마크·오답 풀이 화면, 재진입 복원, 개념노트는 어느 이슈에도 없다

### 아직 막혀 있는 것

| 이슈 | 막는 것                             | 확인 필요 |
| ---- | ----------------------------------- | --------- |
| 6    | 결과 화면 배경 에셋 (D14)           | 4         |
| 1·6  | 닫기·결과 버튼 목적지               | 14 · 5    |
| 2    | `오답입니다!` 라벨 위치 · 시안 갱신 | 13        |

잠정 결정이 있어 **구현은 막히지 않는다.** 모두 교체 지점을 한 곳에 모아 두는 조건이다.
