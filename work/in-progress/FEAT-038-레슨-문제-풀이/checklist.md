---
id: 'FEAT-038'
validated: '2026-09-22'
mode: 'feature'
scope: 'Issue 1-4'
---

# FEAT-038 중간 검증 결과

> Issue 1~4의 커밋 전 검증이다. Issue 5·6이 남아 있으므로 작업 완료 처리와 기준 문서 갱신은 하지 않는다.

## 1. 자동 검증

| #   | 검사            | 명령                                                      | 결과                    |
| --- | --------------- | --------------------------------------------------------- | ----------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                               | ✅                      |
| 2   | 타입            | `pnpm check-types`                                        | ✅                      |
| 3   | 테스트          | `pnpm test`                                               | ✅ 58 files · 302 tests |
| 4   | 빌드            | `pnpm build`                                              | ✅                      |
| 5   | 포맷            | 변경 파일 대상 `pnpm exec prettier --check ...`           | ✅                      |
| 6   | generated 경계  | `pages`·`widgets`의 `shared/api/generated` 직접 참조 검색 | ✅ 참조 없음            |

테스트의 `Window.scrollTo` 미구현 출력과 빌드의 라우트 테스트 파일·청크 크기 경고는 기존 경고이며,
검사는 모두 종료 코드 0으로 끝났다.

## 2. 요구사항 ↔ 구현 대조

### Issue 1 — 문제 조회와 풀이 화면

| AC  | 요구사항                         | 구현 위치                                               | 상태 |
| --- | -------------------------------- | ------------------------------------------------------- | ---- |
| 1   | 객관식 응답을 화면 모델로 변환   | `entities/problem/model/problem.test.ts`                | ✅   |
| 2   | 주관식 응답을 화면 모델로 변환   | `entities/problem/model/problem.test.ts`                | ✅   |
| 3   | 조회 중 로딩 화면 표시           | `lesson-quiz-page.test.tsx`의 `응답을 기다리는 동안...` | ✅   |
| 4   | 유닛·문제 번호·발문·본문 표시    | `lesson-quiz-page.test.tsx`의 `응답이 도착하면...`      | ✅   |
| 5   | 7초를 `00:07`로 표시             | `lesson-quiz-page.test.tsx`의 `7초가 지나면...`         | ✅   |
| 6   | 65초를 `01:05`로 표시            | `lesson-quiz-page.test.tsx`의 `65초가 지나면...`        | ✅   |
| 7   | 닫을 때 유닛 상세로 replace 이동 | `lesson-quiz-page.test.tsx`의 닫기 링크·뒤로가기 테스트 | ✅   |
| 8   | 조회 실패 시 재시도 제공         | `lesson-quiz-page.test.tsx`의 `조회가 실패하면...`      | ✅   |

### Issue 2 — 객관식 풀이

| AC  | 요구사항                                    | 구현 위치                                                    | 상태 |
| --- | ------------------------------------------- | ------------------------------------------------------------ | ---- |
| 1   | 고른 선지의 정답 여부 계산                  | `grade-objective.test.ts`                                    | ✅   |
| 2   | 첫 답안을 problemId로 기록                  | `quiz-session.test.ts`의 `submitAnswer 하면...`              | ✅   |
| 3   | 중복 제출 시 첫 답안 유지                   | `quiz-session.test.ts`의 `이미 제출한 문제에...`             | ✅   |
| 4   | 선지 클릭 한 번으로 채점                    | `lesson-quiz-page.test.tsx`의 `선지를 한 번 클릭하면...`     | ✅   |
| 5   | 오답 제출 후 정답 해설만 기본으로 열림      | `lesson-quiz-page.test.tsx`의 `오답을 고르면 정답 선지만...` | ✅   |
| 6   | 고른 오답과 정답에 결과 상태 표시           | `lesson-quiz-page.test.tsx`의 `오답을 고르면 고른 오답과...` | ✅   |
| 7   | 정답 제출 시 성공 문구와 정답 상태 표시     | `lesson-quiz-page.test.tsx`의 `정답을 고르면...`             | ✅   |
| 8   | 접힌 오답 해설을 다시 열 수 있음            | `lesson-quiz-page.test.tsx`의 `접힌 오답 선지를...`          | ✅   |
| 9   | 제출 후 다른 선지를 눌러도 답이 바뀌지 않음 | `lesson-quiz-page.test.tsx`의 `제출 후 다른 선지를...`       | ✅   |

### Issue 3 — 주관식 풀이

| AC  | 요구사항                                 | 구현 위치                                                  | 상태 |
| --- | ---------------------------------------- | ---------------------------------------------------------- | ---- |
| 1   | 앞뒤 공백과 대소문자를 무시              | `grade-subjective.test.ts`                                 | ✅   |
| 2   | 내부 띄어쓰기는 구분                     | `grade-subjective.test.ts`                                 | ✅   |
| 3   | 부분 일치를 오답으로 판정                | `grade-subjective.test.ts`                                 | ✅   |
| 4   | 공백 입력을 오답으로 판정                | `grade-subjective.test.ts`                                 | ✅   |
| 5   | 오답 제출 후 정답과 해설 표시            | `lesson-quiz-page.test.tsx`의 `틀린 답을 제출하면...`      | ✅   |
| 6   | 대소문자만 다른 답을 정답으로 표시       | `lesson-quiz-page.test.tsx`의 `대소문자만 다른 답을...`    | ✅   |
| 7   | 빈 입력은 기록하지 않고 다음 문제로 이동 | `lesson-quiz-page.test.tsx`의 `빈 입력에서 다음 문제를...` | ✅   |

추가 회귀 검증: `주관식이 연속되어도 이전 문제의 입력을 다음 문제에 남기지 않는다`.

### Issue 4 — 이동과 진행 패널

| AC  | 요구사항                                   | 구현 위치                                                 | 상태 |
| --- | ------------------------------------------ | --------------------------------------------------------- | ---- |
| 1   | 현재·완료·미완료 상태 계산                 | `progress.test.ts`                                        | ✅   |
| 2   | 첫 문제에서 이전 이동 차단                 | `quiz-session.test.ts`의 `첫 문제에서 goToPrevious...`    | ✅   |
| 3   | 특정 문제로 이동해도 답안 유지             | `quiz-session.test.ts`의 `goTo 하면...`                   | ✅   |
| 4   | 건너간 문제를 미완료로 표시                | `lesson-quiz-page.test.tsx`의 `제출하지 않고 다음으로...` | ✅   |
| 5   | 진행 패널에서 미완료 문제로 복귀           | `lesson-quiz-page.test.tsx`의 `진행 패널에서...`          | ✅   |
| 6   | 제출 수를 전체 문제 수와 함께 표시         | `lesson-quiz-page.test.tsx`의 `10문제 중 2개를...`        | ✅   |
| 7   | 좁은 화면에서 패널을 숨기고 이동 버튼 표시 | `lesson-quiz-page.test.tsx`의 `좁은 화면에서는...`        | ✅   |

## 3. 이전 검증

해당 없음. 신규 기능 작업이다.

## 4. 시안 대조 재확인

해당 없음. 이번 검증은 승인된 Issue 1~4 구현과 자동화된 동작 계약을 대상으로 한다.

## 5. 기준 문서 갱신

| 대상                            | 상태                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `docs/implementation-status.md` | 보류 — FEAT-038 Issue 5·6 완료 후 갱신                                   |
| `docs/migration-status.md`      | 해당 없음                                                                |
| 작업 명세                       | `spec.md`·`issues.md`에 주관식 제출 후 해설 확인 흐름과 최종 네이밍 반영 |

## 6. 중간에 막혔던 지점

- React 19 타입에서 `FormEvent`가 deprecated되어 제출 핸들러를 `SubmitEvent`로 변경했다.
- 연속된 주관식 문제는 같은 `SubjectiveAnswer` 인스턴스를 재사용해 입력값이 남았다.
  `ProblemSolver`에 `problemId` key를 주어 문제별 상호작용 상태의 수명을 분리했다.

## 7. 남은 작업

- Issue 5: 레슨 일괄 제출과 결과 조회
- Issue 6: 결과 화면 마감
