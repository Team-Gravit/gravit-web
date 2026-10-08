---
id: 'FEAT-044'
validated: '2026-09-26'
mode: 'feature' # feature | migrate | refactor | design-fix | fix | infra
---

# FEAT-044 검증 결과

> `ai-validate` 산출물. **생략 금지.**
> 실패 시 수정 후 재검증 **최대 3회**. 초과하면 보고하고 중단한다.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                                 |
| --- | --------------- | -------------------------------------------------- | ------------------------------------ |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅                                   |
| 2   | 타입            | `pnpm check-types`                                 | ✅                                   |
| 3   | 테스트          | `pnpm test`                                        | ✅ 75 files · 401 tests              |
| 4   | 빌드            | `pnpm build`                                       | ✅                                   |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>`   | ✅ `spec.md` 수정 후 재검사 통과     |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 생성 훅은 `features/` 에서만 사용 |

- 5: 최초 검사에서 `spec.md`(R21 표 행)가 실패해 `prettier --write`로 맞췄다.
  `*.svg`는 prettier 파서가 없어 검사 대상에서 제외했다.

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 (spec.md 규칙)                        | 구현 위치                                                                                                                                                          | 상태 |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| 1   | R15 가리기 버튼은 답을 제출하지 않는다         | `entities/problem/ui/option-choice-list.tsx` — 선택·가리기를 형제 버튼으로 분리. 테스트 `가리기를 눌러도 답이 제출되지 않는다`                                     | ✅   |
| 2   | R16 가린 선지는 선택 불가 · 다시 누르면 복귀   | `option-choice-list.tsx` `disabled={isHidden}` · `quizSessionReducer` `toggleHiddenOption`. 테스트 `가린 선지는 고를 수 없다` · `다시 누르면 가린 선지를 되돌린다` | ✅   |
| 3   | R17 풀이 세션에 보존 (문제 이동 · 새로고침)    | `QuizSessionState.hiddenOptionIdsByProblemId` · `quiz-session-context.tsx` 저장·복원. 테스트 `문제를 옮겼다 돌아와도 가린 선지가 남는다`                           | ⚠️   |
| 4   | R18 제출 후 가림이 풀린다                      | `quizSessionReducer` `submitAnswer` 가 해당 문제 항목 삭제. 테스트 `답을 제출하면 해당 문제의 가린 선지를 비운다`                                                  | ✅   |
| 5   | R19 북마크 낙관적 반영 + 성공·실패 토스트      | `features/problem-bookmark/api/use-toggle-problem-bookmark.ts`. 테스트 추가·삭제 성공 2건, 실패 롤백 2건                                                           | ✅   |
| 6   | R20 요청 중 버튼 비활성 · 재시도 없음          | `BookmarkToggle` `disabled={isPending}` · mutation `retry: false`. 테스트 `북마크 요청 중에는 상태를 먼저 바꾸고 버튼을 비활성화한다`                              | ✅   |
| 7   | R21 가리기 버튼 접근성 이름                    | `option-choice-list.tsx` `aria-label` `{n}번 선지 가리기 / 다시 보기` · `aria-pressed`                                                                             | ✅   |
| 8   | `isBookmarked` 초기 상태 반영                  | `entities/problem/model/problem.ts` `toProblem` 매핑. 테스트 `이미 북마크한 문제는 삭제 문구를 알린다`                                                             | ✅   |
| 9   | 유닛 상세 북마크 카드 새 글리프 (이슈 #256 AC) | `shared/ui/icon/assets/bookmark-fill.svg` 교체 — `pages/unit-detail/ui/unit-detail-page.tsx` 가 사용                                                               | ⚠️   |

- 3: 새로고침 복원은 `quiz-session-context.tsx` 에 구현돼 있으나 가린 선지를 복원하는 자동 테스트가 없다.
  수동 확인 필요 — 선지를 가린 뒤 새로고침하면 가림이 유지되는지.
- 9: 외형 변경이라 테스트 대상이 아니다 (`test-policy.md` §1). 화면에서 눈으로 확인 필요.

## 3. 이전 검증 <!-- MIG- / REF- 전용 -->

해당 없음 (`FEAT-`).

## 4. 시안 대조 재확인 <!-- FIX- / MIG- 전용 -->

해당 없음 (`FEAT-`). 가린 선지의 최종 시각 표현은 `spec.md` 확인 필요 2로 남아 있다.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                               | 상태 |
| ------------------------------- | ------------------------------------------------------- | ---- |
| `docs/implementation-status.md` | 레슨 문제 풀이 행에 FEAT-044(선지 가리기 · 북마크) 반영 | ✅   |
| `docs/migration-status.md`      | 해당 없음                                               | ✅   |
| 그 외 `docs/`                   | 해당 없음                                               | ✅   |

- `implementation-status.md` 는 `done/` 이동 시점(2026-09-26, PR #257 머지 후)에 갱신했다.
  §2의 ⚠️ 수동 확인 2건이 남아 있어 기능 검증은 `△`로 둔다.
