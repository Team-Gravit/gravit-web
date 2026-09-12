---
id: 'MIG-025'
phase: 2
validated: '2026-09-13'
mode: 'migrate'
---

# MIG-025 검증 결과 — Phase 2 (요약 탭, 이슈 #227)

## 1. 자동 검증

| #   | 검사            | 명령                              | 결과            |
| --- | --------------- | --------------------------------- | --------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint` (eslint + steiger)    | ✅ No problems   |
| 2   | 타입            | `pnpm check-types`                | ✅              |
| 3   | 테스트          | `pnpm test`                       | ✅ 31 files/159  |
| 4   | 빌드            | `pnpm build`                      | ✅              |
| 5   | 포맷            | `prettier --check` (Phase 2 파일) | ✅ (svg/webp 제외) |
| 6   | generated 경계  | summary·history API를 `entities/user/api`에서만 참조 | ✅ |

## 2. 요구사항 ↔ 구현 대조

| #   | AC                                          | 구현 위치                                           | 상태 |
| --- | ------------------------------------------- | --------------------------------------------------- | ---- |
| 1   | `/my/summary`에 통계 카드 + 학습 히트맵 표시 | `pages/my/ui/summary-tab.tsx`                       | ✅   |
| 2   | 통계 4지표(학습률·완료레슨·학습시간·정답률) | `pages/my/ui/summary-card.tsx`                      | ✅   |
| 3   | 모바일 상위% 강조 블록 + 3지표              | `summary-card.tsx` (`md:hidden` 블록)               | ✅   |
| 4   | 연도별 히트맵 + 연도 Select + peak 안내     | `widgets/study-heatmap`                             | ✅   |
| 5   | 로딩 시 지연 스켈레톤                        | `summary-tab-skeleton.tsx` + `useDelayedFlag`       | ✅   |

## 3. 이전 검증

| 항목                                    | 결과                                                              |
| --------------------------------------- | ---------------------------------------------------------------- |
| plan-phase2 이전 매핑 전량 반영         | ✅ card·scroll·select(재구현)·calendar-heatmap·learning·어댑터   |
| 동작 동일성(기준선 S1~S6)               | ✅ 로딩·에러 렌더 안 함, 4지표, 히트맵, 연도조회, peak 유지        |
| 의도적 변경은 "고침" 판정분만           | ✅ 아래 §4                                                       |
| 남은 legacy 참조 없음                   | ✅ apps/web 내부 참조만                                          |

## 4. 시안 대조 재확인 (code ↔ Figma)

| 항목                     | 반영                                                        |
| ------------------------ | ----------------------------------------------------------- |
| elevation 토큰(카드=1)   | ✅ `shadow-elevation-1` (tokens.css 도입, 디자인시스템 정식) |
| 연도 Select(elevation-2) | ✅ Radix Select, `shadow-elevation-2` 드롭, Figma 스타일     |
| 히트맵 첫 색 gray-300    | ✅ `HEATMAP_COLOR_LEVELS[0] = bg-gray-300`                   |
| 카드 radius 12·패딩      | ✅ `rounded-12`, 히트맵 `px-8 py-7 gap-4`                    |
| 모바일 상위% main색      | ✅ `text-main` 24px                                          |
| 범례/​peak 모바일 타이포 | ✅ `text-caption1 md:text-heading2` / peak 반응형           |

보류(적용 안 함): `bg-0` 토큰(카드 배경은 `bg-white` — legacy와 동일, 토큰 도입 별도 판단).

## 5. Phase 2 중 발견·수정한 것

| 이슈                                   | 수정                                                          |
| -------------------------------------- | ------------------------------------------------------------- |
| 모바일 stat 불필요 border              | `first:border-none`이 hidden 항목 오인 → 항목별 border 명시   |
| heatmap dropdown 누락                  | `length>1` 조건 제거, 항상 표시(현재연도 fallback)            |
| 범례 타이포 미적용                     | `text-heading2` → `text-caption1 md:text-heading2`            |
| stat 스켈레톤 레이아웃 시프트          | 스켈레톤을 실제 카드 구조와 1:1 미러링                        |
| 모바일 dropdown chevron 큼             | `size-4 md:size-6` (legacy 16 / Figma 24)                     |
| Select 터치 재열림 버그                | open 제어 + close 직후 300ms 재-open 가드                     |
| study-heatmap FSD 위치                 | `pages/my/ui` → `widgets/study-heatmap` (독립 블록)           |
| 리그 배경 seam                         | 앱셸 `bg-bg-2` 블록색 → `fixed -z-20` 레이어(리그 `-z-10` 위) |

## 6. 기준 문서 갱신

| 대상                            | 갱신 내용                                              | 상태          |
| ------------------------------- | ------------------------------------------------------ | ------------- |
| `docs/design-system`(elevation) | elevation 토큰 5단계 도입 → stories `elevation.mdx` 반영 | ✅            |
| `docs/implementation-status.md` | MY.1.1 요약 탭 구현 반영                                | ⬜ 이동 시     |
| `docs/migration-status.md`      | 마이페이지 요약 탭 이전 반영                            | ⬜ 이동 시     |

> MIG-025 전체(P1~5) 미완이므로 work 폴더는 `in-progress` 유지. Phase 2(#227) 커밋·PR만 진행.
