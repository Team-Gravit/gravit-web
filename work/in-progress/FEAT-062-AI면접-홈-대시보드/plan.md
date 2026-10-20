---
id: 'FEAT-062'
planned: '2026-10-18'
mode: 'feature'
---

# FEAT-062 구현 계획 — 1단계: 데이터 없음 상태

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.**

## 0. 모드 판정

`mode: feature` — legacy-web에 없는 AI면접 홈을 새로 만든다.

- 선행: `feature-planner` 대신 GitHub Issue #310 (사용자가 이슈 기반 진행을 지정)
- `work/in-progress/`에 이미 6개 폴더가 있다(FEAT-055 등, 통합 브랜치 상태 그대로). 이 작업과 무관하므로
  건드리지 않고, 승인 시 이 폴더만 `in-progress/`로 옮긴다. 정리는 별도로 다룬다.

## 3. 영향 분석

| 구분 | 파일                                                                                      |
| ---- | ----------------------------------------------------------------------------------------- |
| 신규 | `entities/interview/api/index.ts` — 생성 조회 훅의 도메인 이름 노출                       |
| 신규 | `entities/interview/model/interview-dashboard.ts` (+ `.test.ts`) — 빈 상태 판정 순수 함수 |
| 신규 | `widgets/interview-dashboard/` — 배너 · 요약 카드 · 약한 분야 · 응시 이력 · 점수 추이     |
| 신규 | `widgets/interview-dashboard/ui/assets/*.webp` — Figma에서 내보낸 배너·캐릭터·아이콘      |
| 수정 | `entities/interview/index.ts` — public API 추가                                           |
| 수정 | `pages/interview/ui/interview-page.tsx` — 본문 교체, wide/narrow 분기                     |
| 신규 | `pages/interview/ui/interview-page-wide.tsx` · `interview-page-narrow.tsx`                |

라우트(`interview.index.tsx`)는 그대로다. 라우트 트리 재생성 불필요.

### 배치 근거

- **카드는 widget 하나(`interview-dashboard`)에 모은다.** 각 카드가 독립적으로 조회·상태를 처리하는
  덩어리이고, 같은 대시보드 응답을 쓰는 한 묶음이라 slice를 카드마다 나누지 않는다
- **빈 상태 판정은 entities model로.** 점수 추이 기준처럼 확인 필요인 판단을 위젯 `if`에 두지 않는다
- **공용 컴포넌트 재사용** — `Card` · `CardHeader` · `CardTitle` · `CardStatus` · `CardRetryStatus` ·
  `Button asChild + Link` · `Skeleton` · `useIsWideViewport`. 빈 상태 문구 타이포(웹 22 SB / 모바일 14 SB)와
  카드 제목(16 R / 13 R)이 `CardStatus`·`CardTitle`과 정확히 일치한다
- 카드 padding은 시안(웹 32 · 모바일 20/16)이 공용 `Card`(p-3 · md:p-5)와 달라 `className`으로 덮는다

## 4. 구현 계획 체크리스트

- [x] `[assets]` Figma에서 배너 배경(웹·모바일) · 캐릭터 · 달력 · 그래프 이미지 내보내기 → webp
- [x] `[entities]` `useInterviewDashboard()` — 생성 훅을 도메인 이름으로 re-export
- [x] `[entities]` `model/interview-dashboard.ts` — 완료 세션 유무 · 점수 추이 표시 기준 + 테스트
- [x] `[widgets]` `InterviewBanner` — 웹(가로 804 · 이미지 배경)과 모바일(풀폭 · 버튼 풀폭) 변형
- [x] `[widgets]` `InterviewSummaryCard` — 웹 세로 2단(아이콘 포함) / 모바일 가로 2열 + 구분선
- [x] `[widgets]` `WeakTopicsCard` · `RecentSessionsCard` · `ScoreTrendCard` — 빈·로딩·실패
- [x] `[pages]` wide: 배너+요약 → 약한 분야+응시 이력 → 점수 추이 / narrow: 모바일 시안 순서
- [x] `[pages]` 기존 「새 세션 시작」 진입 동작 유지 확인

## 5. 리스크

| 리스크                                     | 영향                    | 대응                                                     |
| ------------------------------------------ | ----------------------- | -------------------------------------------------------- |
| 「6문항」이 #298 문항 수와 어긋날 수 있음  | 배너 문구가 실제와 다름 | 문구를 상수 하나로 두고 spec에 연결 사실을 기록          |
| 배너 이미지가 여러 레이어(배경+그라디언트) | 내보낸 이미지 품질      | 텍스트·버튼을 숨긴 배너 프레임을 통째로 내보내 한 장으로 |
| 데이터가 있을 때의 본문이 아직 없음        | 1단계만 머지 시 빈 카드 | 2단계까지 같은 브랜치에서 마친 뒤 PR                     |
| `shadow` 토큰 미확정                       | —                       | 공용 `Card`의 기존 값을 그대로 쓴다. 새 값 추가 안 함    |

## 6. 검증

- 단위: `interview-dashboard.test.ts` — 완료 0 · 점수 추이 경계(기준-1 / 기준)
- 렌더: 빈 응답(MSW)에서 세 빈 문구 · `0회` · `- 점` 노출, 「새 세션 시작」 링크 href
- 수동: `pnpm --filter @repo/web dev`에서 폭 1920 / 360 각각 시안과 나란히 대조
- 마무리: `lint` → `check-types` → `test` → `build`, 변경 파일 `prettier --check`

---

# 2단계 계획 — 데이터 있음 (2026-10-18 사용자 지시로 착수)

모바일은 데이터 5개 시안만 있어 개수별 동작은 웹 DATA1~4를 따른다.

## 영향

| 구분 | 파일                                                                                         |
| ---- | -------------------------------------------------------------------------------------------- |
| 수정 | `entities/interview/model/interview-dashboard.ts` — 정확도 단계 · 응시 이력 요약 · 모드 라벨 |
| 신규 | `widgets/interview-dashboard/lib/score-trend-layout.ts` — 점 가로·세로 위치                  |
| 신규 | `widgets/interview-dashboard/ui/{weak-topic-item,recent-session-item,score-trend-chart}.tsx` |
| 수정 | 세 섹션 카드 — 본문 연결, 셸에 데이터 있을 때만 보이는 `headerAction`                        |
| 수정 | `shared/api/mocks/browser.ts` — 시안 검토 고정값을 DATA4로                                   |

### 공용 `LineChart`를 쓰지 않은 이유

`shared/ui/line-chart`는 점 1개를 왼쪽 끝에 두고, 툴팁이 호버에만 뜨며, Y축 라벨 여백을 전제한다.
면접 시안(1개 가운데 · 2개 1/4·3/4 · 처음부터 「현재」 말풍선 · 클릭 선택)을 맞추려면 shared 변경이 필요한데,
#270 운영 규칙상 shared 변경은 `develop`에 먼저 넣어야 한다. 그래서 위젯 안에 면접 전용 차트를 두고,
두 차트의 통합은 별도 `REF-` 후보로 남긴다.

## 체크리스트

- [x] `[entities]` 정확도 단계 · 응시 이력 요약 · 모드 라벨 + 테스트
- [x] `[widgets]` 점 배치 계산 + 테스트
- [x] `[widgets]` 약한 분야 항목 · 응시 이력 항목(`RankBadge` · `Chip` 재사용) · 점수 추이 차트
- [x] `[widgets]` 세 카드 본문 연결
- [x] `[pages]` 페이지 테스트에 데이터 상태 · 점 선택 추가
