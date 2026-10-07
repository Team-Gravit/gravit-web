---
id: 'REF-049'
validated: '2026-10-05'
---

# REF-049 검증 체크리스트

## 자동 검사

| 검사                                          | 결과                                   |
| --------------------------------------------- | -------------------------------------- |
| `pnpm --filter @repo/web lint` (steiger 포함) | ✅ No problems found                   |
| `pnpm --filter @repo/web check-types`         | ✅ 오류 없음                           |
| `pnpm test`                                   | ✅ 75 파일 · 401 테스트 통과           |
| `pnpm build`                                  | ✅ 성공 · `routeTree.gen.ts` 변경 없음 |
| `prettier --check` (변경 파일)                | ✅                                     |

## 검증 기준 대조

- [x] **AC-1** 레슨 풀이 테스트 무수정 통과 — `pages/lesson-quiz` · `features/lesson-quiz` 9 파일 93 테스트. 테스트 파일 diff 없음
- [x] **AC-2** `pages/lesson-quiz/ui/` 에 남은 것: 문제 조회 · 로딩/실패 화면 · Provider · 일괄 제출 · 결과 이동 · 북마크 연결
- [x] **AC-3** 저장 키 — Provider 에 `sessionKey={lessonId}` 를 넘겨 `gravit.quiz-session.{lessonId}` 가 같다. 저장소 테스트(숫자 키)도 무수정 통과
- [x] **AC-4** 위 자동 검사

## 계획과 달라진 점

- `widgets/quiz-progress-panel` 을 `widgets/quiz-screen` 안으로 합쳤다. 위젯끼리는 import 할 수 없어
  (cross-slice, 훅 차단) 풀이 화면이 진행 패널을 쓰려면 같은 슬라이스여야 한다. 진행 패널을 쓰는 곳은 풀이 화면뿐이다
