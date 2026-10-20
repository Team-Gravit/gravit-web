---
id: 'FEAT-062'
validated: '2026-10-20'
mode: 'feature'
---

# FEAT-062 검증 결과 — 1 · 2단계 (데이터 없음 · 있음)

> `ai-validate` 산출물. **생략 금지.**
> 실패 시 수정 후 재검증 **최대 3회**. 초과하면 보고하고 중단한다.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                                           |
| --- | --------------- | -------------------------------------------------- | ---------------------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ No problems found                           |
| 2   | 타입            | `pnpm check-types`                                 | ✅                                             |
| 3   | 테스트          | `pnpm test`                                        | ✅ 105 files · 597 tests                       |
| 4   | 빌드            | `pnpm build`                                       | ✅ (기존 라우트 테스트 파일명 경고 3건 — 무관) |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>`   | ✅                                             |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ `entities/interview`에서 re-export만 사용   |

빌드 경고는 기존 라우트 테스트 파일 3개(`onboarding` 2개와 학습 결과 1개)의 이름에서 발생한다.

## 2-1. 2단계 요구사항 ↔ 구현 대조

| #   | 요구사항 (spec.md 2단계)                                | 구현 위치                                              | 상태 |
| --- | ------------------------------------------------------- | ------------------------------------------------------ | ---- |
| 1   | 약한 분야 이름 · 정확도 문구 · 단계별 색 · 막대         | `WeakTopicItem` · `getAccuracyLevel`                   | ✅   |
| 2   | 응시 이력 차수 뱃지 · 모드 · 주제 요약과 날짜 · 점수 칩 | `RecentSessionItem` · `formatSessionSummary`           | ✅   |
| 3   | 점수 추이 점 배치(1 · 2 · 3개 이상)                     | `getTrendXRatios` (`widgets/interview-dashboard/lib`)  | ✅   |
| 4   | 처음엔 「현재」 말풍선, 점 클릭 시 해당 점수            | `ScoreTrendChart` — `interview-page.test.tsx`에서 확인 | ✅   |
| 5   | 웹 헤더 안내 문구(데이터 있을 때만)                     | `ScoreTrendCard` `headerAction`                        | ✅   |

수동 확인: 고정 목(DATA4)으로 1920 · 360 폭을 캡처해 `WEB-AI-HOME-01-DATA4` · 모바일 DATA와 대조했다.
spec의 「확인 필요 (2단계)」 A~G는 임시 기본값이며 사용자 판정 전이다.

## 2. 요구사항 ↔ 구현 대조 (1단계)

| #   | 요구사항 (spec.md 확정 명세)                      | 구현 위치                                                        | 상태 |
| --- | ------------------------------------------------- | ---------------------------------------------------------------- | ---- |
| 1   | 배너 문구 · 「새 세션 시작」 → 세션 설정 첫 단계  | `widgets/interview-dashboard/ui/interview-banner.tsx`            | ✅   |
| 2   | 누적 세션 `{n}회`                                 | `InterviewSummaryCard`                                           | ✅   |
| 3   | 완료 세션 0이면 평균 `- 점`                       | `getRecentAverageScore` (`entities/interview/model`) + 요약 카드 | ✅   |
| 4   | 약한 분야 빈 문구 (모바일 문구)                   | `WeakTopicsCard`                                                 | ✅   |
| 5   | 응시 이력 빈 문구                                 | `RecentSessionsCard`                                             | ✅   |
| 6   | 점수 추이 빈 문구 (1개 이상 기준)                 | `ScoreTrendCard`                                                 | ✅   |
| 7   | 빈 상태에서 「전체 보기」 숨김                    | 세 카드 모두 헤더 액션 없음 — `interview-page.test.tsx`에서 확인 | ✅   |
| 8   | 조회 중 스켈레톤 · 실패 시 카드별 다시 시도       | `DashboardSectionCard` · `InterviewSummaryCard`                  | ✅   |
| 9   | 웹 / 모바일 배치 (모바일은 응시 이력 → 약한 분야) | `pages/interview/ui/interview-page-{wide,narrow}.tsx`            | ✅   |

수동 확인: `VITE_ENABLE_API_MOCKING=true` dev 서버(`browser.ts`의 빈 대시보드 고정 목)에서 1920 · 360 폭을
헤드리스 Chrome으로 캡처해 `AI-HOME-01-EMPTY`와 나란히 대조했다. 구조 · 순서 · 문구 일치.

### 시안과의 알려진 차이

| 항목             | 시안                   | 구현                            | 사유                                       |
| ---------------- | ---------------------- | ------------------------------- | ------------------------------------------ |
| 모바일 배너 버튼 | 높이 32 · 13px Regular | `Button size="sm"` (36 · 14 SB) | 해당 크기 변형 없음. 가장 가까운 공용 크기 |
| 배너 설명 글자색 | `#C6C6C6` (gray/400)   | `text-text-2-w` (`#DCDCDC`)     | 어두운 배경용 정식 토큰 중 가장 가까운 값  |

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                          | 상태      |
| ------------------------------- | ---------------------------------- | --------- |
| `docs/implementation-status.md` | AI-HOME-01 부분 구현 상태 기록     | ✅        |
| `docs/migration-status.md`      | 해당 없음 (FEAT)                   | 해당 없음 |
| 그 외 `docs/`                   | 확정 명세는 전체 단계 완료 후 승격 | ⬜        |
