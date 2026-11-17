---
id: 'FIX-086'
planned: '2026-11-18'
mode: 'fix'
---

# FIX-086 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: fix` — 다시 시도가 반응하지 않는 것처럼 보이는 결함. 구조 이전이 아니다.

## 1. 영향 분석

| 구분             | 파일                                                                                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 수정             | `shared/ui/pull-to-refresh/use-pull-to-refresh.ts` · `pull-to-refresh/index.ts` (값 2개 공개)                                                                                                                                                                                      |
| 수정             | `shared/ui/card/card-status.tsx`                                                                                                                                                                                                                                                   |
| 신규             | `shared/ui/card/card-status.test.tsx`                                                                                                                                                                                                                                              |
| 수정 (호출 13곳) | `concept-note-content` · `lesson-quiz-page` · `lesson-result-page` · `review-quiz-page` · `session-check-error` · `chapter-grid` · `continue-learning-card` · `daily-mission` · `growth-summary` · `learning-streak` · `recommended-unit-card` · `recommended-units` · `unit-list` |
| 수정             | `app/routes/_authenticated/route.tsx` (`SessionCheckError`에 Promise 전달)                                                                                                                                                                                                         |

## 2. 구현 체크리스트

- [ ] `[shared]` `MIN_REFRESH_DURATION_MS` · `PULL_TO_REFRESH_FAILURE_MESSAGE`를 pull-to-refresh 배럴에서 공개
- [ ] `[shared]` `CardRetryStatus`: `onRetry: () => Promise<unknown>`. 누르면 `isLoading` → 최소 600ms 대기 → 거부되면 토스트
- [ ] `[shared]` 테스트: 진행 중 `isLoading`, 거부되면 토스트 1회, 진행 중 중복 호출 없음
- [ ] `[widgets]` · `[pages]` 호출부를 `() => refetch({ throwOnError: true })`로 교체
- [ ] `[widgets]` `growth-summary`: 실패한 쿼리만 `Promise.all`로 다시 부름
- [ ] `[pages]` · `[app]` `session-check-error`: `onRetry`를 Promise로. 라우트는 `() => router.invalidate()`

## 3. 리스크

| 리스크                                               | 영향                                                              | 대응                        |
| ---------------------------------------------------- | ----------------------------------------------------------------- | --------------------------- |
| `session-check`는 실패해도 Promise가 거부되지 않는다 | 이 화면만 실패 토스트가 안 뜬다. 라우터가 에러 화면을 다시 그린다 | 진행 표시만 적용. PR에 명시 |
| 성공 후 컴포넌트가 사라진 뒤 상태 갱신               | React 19는 경고 없음                                              | 테스트로 확인               |
| 기존 테스트가 `onRetry` 동기 호출을 가정             | 일부 테스트 수정 필요                                             | 관련 테스트 실행            |

## 4. 확인 방법

- 자동: `card-status.test.tsx` 신규 + 호출부 기존 테스트 실행 · tsc · eslint
- 수동: 개발자 도구에서 API를 막고 [다시 시도] → 도는 표시 · 토스트. 막기를 풀고 다시 시도 → 내용 표시
