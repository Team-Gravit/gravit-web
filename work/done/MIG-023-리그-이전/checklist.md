---
id: 'MIG-023'
validated: '2026-09-11'
mode: 'migrate'
---

# MIG-023 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                  | 결과 |
| --- | --------------- | ------------------------------------- | ---- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`        | ✅   |
| 2   | 타입            | `pnpm --filter @repo/web check-types` | ✅   |
| 3   | 테스트          | `vitest run` (147 passed)             | ✅   |
| 4   | 빌드            | `vite build`                          | ✅   |
| 5   | 포맷            | `prettier --check` (리그 변경 파일)   | ✅   |
| 6   | generated 경계  | 화면이 생성 경로 직접 참조 없음(조회는 `entities/league/api` 래핑) | ✅ |

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 | 구현 위치 | 상태 |
| --- | -------- | --------- | ---- |
| 1 | 아레나(시즌명·타이머·티어셀렉터·랭킹) | `widgets/league-arena/*`, `pages/league/ui/league-page.tsx` | ✅ |
| 2 | 티어 셀렉터(legacy 스크롤+반응형·모바일 전체폭/하단정렬/페이드·중앙정렬) | `widgets/league-arena/ui/tier-selector.tsx` | ✅ |
| 3 | 랭킹 행(모바일 글래스·데스크톱 2블록·hover 전환·LP/LV min-w) | `entities/league/ui/user-rank-row.tsx` | ✅ |
| 4 | 프로필 레벨 진행 링(데스크톱만) | `entities/league/ui/level-progress-avatar.tsx` | ✅ |
| 5 | 무한 스크롤(리스트 내부 스크롤·옵저버 root=컨테이너) | `widgets/league-arena/ui/ranking-list.tsx` | ✅ |
| 6 | 스켈레톤(지연 표시)·빈 상태 문구 | `ranking-row-skeleton.tsx`·`shared/lib/use-delayed-flag.ts`·`ranking-list.tsx` | ✅ |
| 7 | 시즌 결과/시작 모달(모바일 흰 카드/데스크톱 우주배경 글래스·finalLp) | `widgets/league-season-modal/*` | ✅ |
| 8 | 조회 API 5종(orval 래핑·queryKey 팩토리) | `entities/league/api/*` | ✅ |
| 9 | 배경(그라디언트+picture srcset+dim·뷰포트 고정) | `pages/league/ui/league-page.tsx` | ✅ |
| 10 | `/league` 라우트 | `app/routes/_protected.league.tsx` | ✅ |

> 확정 명세는 `spec.md`의 `확정된 결정` 기준. 로직성은 단위 테스트로 고정(date·level-table·modal),
> 시각/토큰은 Figma Dev Mode 대조로 반복 확인.

## 3. 이전 검증

| 항목 | 결과 |
| ---- | ---- |
| `plan.md` 2-1 이전 매핑 전량 반영 | ✅ (date/profile-color/level-table/tiers/api/ui 전부) |
| 동작 동일성 — 현행 동작 기준선 유지 | ✅ (아래 승인 변경 제외) |
| 승인된 변경만 반영(design-diff "고침"/신규) | ✅ 랭킹 hover·모달 재설계·시즌 시작 모달 신규·반응형·WaitingTab 제거·티어 셀렉터 시안 정렬 |

## 4. 파생 항목

| 항목 | 상태 |
| ---- | ---- |
| INFRA-024 (랭킹 응답 스키마 배열/slice) | `work/to-do` — normalizer 우회 중, 재생성 후 확정 정리 예정 |
| FIX-025 (WaitingTab 시즌번호 하드코딩) | 폐기 — WaitingTab 삭제로 무의미 |

## 5. 임시/후속

- `최종 LP` — 서버 `finalLp` 필드 추가 확인 후 실데이터 반영 완료(placeholder 제거).
- 모달 부제 문구 데스크톱↔모바일 상이 — 각 시안대로 breakpoint별 적용(사용자 확인).
