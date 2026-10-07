---
id: 'MIG-048'
validated: '2026-10-05'
---

# MIG-048 검증 체크리스트

## Issue A — 북마크 풀이 (#268)

### 자동 검사

| 검사               | 결과                                                |
| ------------------ | --------------------------------------------------- |
| `pnpm lint`        | ✅ steiger 포함 문제 없음                           |
| `pnpm check-types` | ✅                                                  |
| `pnpm test`        | ✅ 76 파일 · 413 테스트. 기존 테스트 파일 수정 없음 |
| `pnpm build`       | ✅ `routeTree.gen.ts` 변경 없음                     |
| 변경 파일 prettier | ✅                                                  |

### 검증 기준 대조 — `app/routes/_authenticated/_focus/-review-quiz-route.test.tsx`

- [x] AC-1 진입 시 목록 1회 요청 · 1번 문제 · 진행률 `0/3`
- [x] AC-2 객관식 단건 제출 본문 `{ problemId, isCorrect, selectedOptionId }`
- [x] AC-3 주관식 단건 제출 본문 `{ problemId, isCorrect, submittedContent }`
- [x] AC-4 이전 문제로 돌아오면 해설 유지 · 단건 제출 1회
- [x] AC-5 `완료` → 유닛 상세 · 레슨 제출 0회
- [x] AC-6 단건 제출 실패 → 토스트 · 해설 없음 · 다시 고를 수 있음 · 진행률 그대로
- [x] AC-6-1 응답 대기 중 해설 없음 · 선지 잠금
- [x] AC-7 닫기 → 확인 없이 유닛 상세
- [x] AC-8 풀이 중 북마크 해제 → 문제 유지
- [x] AC-9 이탈 후 재진입 → 목록 재요청
- [x] AC-9-1 북마크 해제 후 이탈 → 유닛 상세 재요청. 무효화 두 곳을 빼면 실패하는 것을 확인했다
- [x] AC-10 제외 버튼 없음
- [x] AC-16 레슨 풀이 테스트 무수정 통과

### 동작 계약

| #   | 확인                                                                                              |
| --- | ------------------------------------------------------------------------------------------------- |
| K1  | ✅ AC-2 · AC-3                                                                                    |
| K2  | ✅ AC-5                                                                                           |
| K4  | ✅ AC-5 · AC-9 · AC-9-1 — 목록과 유닛 상세 모두 무효화. 처음 구현은 목록만 무효화해 절반만 지켰다 |
| K5  | ✅ AC-16                                                                                          |
| K3  | Issue B                                                                                           |

### 수동 확인 (대기)

- [ ] 실제 계정: 유닛 상세 → 북마크 → 해제 → 다음/이전 → 문제 유지 → 닫기 → 재진입 시 빠졌는지
- [ ] 개발자 도구: 단건 제출 본문에 `selectedOptionId` / `submittedContent`
- [ ] 좁은 화면(앱 WebView)에서 이전/다음 · 완료 버튼 배치

### 계획과 달라진 점

- **단건 제출 훅 위치** — 계획은 새 슬라이스 `features/problem-submission`. 본문 조립(`toProblemSubmission`)과 답 타입이
  `features/lesson-quiz` 에 있어 다른 feature 에 두면 cross-slice 가 된다. `features/lesson-quiz/api/use-submit-problem-result.ts` 에 뒀다
- **목록 조회 훅** — 계획은 두 훅. `kind` 를 받는 `useReviewProblems` 하나로 했다 (page 가 `kind` 로 분기하므로 훅을 조건부로 부를 수 없다). 키는 생성 팩토리를 쓴다
- **빈 목록 문구** — 시안·명세에 없다. 유닛 상세가 진입을 막을 때 쓰는 기존 문구(`아직 북마크한 문제가 없어요.` · `아직 틀린 문제가 없어요.`)를 그대로 썼다
- `OptionChoiceList` 에 `isSubmitting` prop 을 더했다 (AC-6-1 선지 잠금)

### 유닛 상세 갱신 (2026-10-05 추가)

- 북마크 토글 성공 시 `GET /api/v1/lessons/{unitId}` 무효화 — 레슨 풀이에도 적용된다 (`BookmarkToggle` 이 `unitId` 를 받는다)
- 복습 풀이 `onLeave` 에서 같은 키 무효화 — 단건 제출로 `wrongAnsweredNoteAccessible` 이 바뀔 수 있다
- `setQueryData` 가 아닌 이유: `bookmarkAccessible` 은 유닛 전체 북마크 수의 집계라, 해제가 마지막이었는지 화면에서 알 수 없다
- 테스트 QueryClient 의 `staleTime` 을 앱과 같은 60초로 맞췄다. 0 이면 돌아오기만 해도 다시 받아 무효화 누락을 잡지 못한다

## Issue B — 오답노트 풀이 (#269)

### 자동 검사

| 검사               | 결과                            |
| ------------------ | ------------------------------- |
| `pnpm lint`        | ✅                              |
| `pnpm check-types` | ✅                              |
| `pnpm test`        | ✅ 84 파일 · 454 테스트         |
| `pnpm build`       | ✅ `routeTree.gen.ts` 변경 없음 |

### 검증 기준 대조 — `-review-quiz-route.test.tsx` 「오답노트 풀이」 8개

- [x] AC-11 넓은 화면·좁은 화면 모두 정답 선지 해설 안에 1개 (하단 버튼 줄에는 없음) · 주관식 맞힘에도 보임 — 2026-10-07 배치 통일 반영
- [x] AC-12 `DELETE /api/v1/wrong-answered-notes` `{ problemId }` 1회 · 성공 토스트 · 버튼만 사라지고 해설 유지 · 다시 돌아와도 버튼 없음
- [x] AC-13 틀리면 버튼 없음 — 「맞혔을 때만」 조건을 빼면 실패하는 것 확인
- [x] AC-14 실패 토스트 · 버튼 남고 다시 누를 수 있음
- [x] AC-15 떠난 뒤 재진입 시 오답 목록 재요청 · 유닛 상세 재요청

### 동작 계약

| #   | 확인             |
| --- | ---------------- |
| K3  | ✅ AC-11 · AC-13 |

### 수동 확인 (대기)

- [ ] 실제 계정: 오답 문제를 맞히고 제외 → 닫기 → 유닛 상세 오답노트 진입 가능 여부 갱신
- [ ] 앱 WebView 좁은 화면: 해설 안 제외 버튼 배치

### 계획과 달라진 점

- 「맞혔을 때만」 판단은 page(`review-quiz-page.tsx`)가 하고, 위젯(`renderResultAction`)이 정답 해설 안(entities `correctAction` 슬롯)에 넘긴다
- **배치 변경 (2026-10-07)** — 처음에는 넓은 화면을 하단 버튼 줄 맨 앞에 뒀다. 태블릿 폭에서 가려져 디자이너와 모바일 배치(해설 안, `sm` 버튼)로 통일했다. 하단 슬롯(`startAction`)은 제거
- 제외한 문제 ID 는 풀이 화면에 있는 동안만 기억한다 (P8 — 문제는 계속 풀 수 있고 목록은 떠날 때 다시 받는다)
