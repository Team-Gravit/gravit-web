---
id: 'FIX-044'
validated: '2026-10-04'
mode: 'fix'
---

# FIX-044 검증 결과

> `ai-validate` 산출물.

## 1. 자동 검증

| #   | 검사            | 명령                                             | 결과                    |
| --- | --------------- | ------------------------------------------------ | ----------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                      | ✅ No problems found    |
| 2   | 타입            | `pnpm check-types`                               | ✅ 통과                 |
| 3   | 테스트          | `pnpm test`                                      | ✅ 76파일 / 405+ 통과   |
| 4   | 빌드            | `pnpm build`                                     | ✅ 통과                 |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>` | ✅ All matched files OK |
| 6   | generated 경계  | `pages`/`widgets` 생성 경로 직접 참조 없음       | ✅ (없음)               |

신규 테스트: `use-session-follow-state.test.ts`(4) + `social-recommend-friend-section.test.tsx`(2) = 6 통과.

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항 (spec.md의 AC)                                         | 구현 위치                                                                                      | 상태 |
| ---- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---- |
| AC-1 | 팔로우 시 카드 유지 + 버튼 "팔로우 취소"로 전환                 | `social-recommend-friend-section.test.tsx` AC-1 / `recommend-friend-card.tsx` isFollowing 분기 | ✅   |
| AC-2 | 추천 카드 언팔로우 시 카드 유지 + "팔로우" 복귀, refetch 없음   | `social-recommend-friend-section.test.tsx` AC-2 / `use-unfollow-user.ts`(추천 무효화 없음)     | ✅   |
| AC-3 | 모달 열고 아무 것도 안 하면 추천 상태 유지                      | `use-unfollow-user.ts`가 추천 키를 전혀 건드리지 않음 → 추가 refetch 없음                       | ✅   |
| AC-4 | (수정) 모달 언팔로우는 즉시 반영 안 함, 재진입/리로드 시 갱신   | `use-unfollow-user.ts`에 추천 active 무효화 **없음** + 기본 refetchOnMount로 재진입 시 갱신     | ✅   |
| AC-5 | 추천 `dataUpdatedAt` 갱신 시 로컬 set 리셋                      | `use-session-follow-state.test.ts` "dataUpdatedAt 이 바뀌면 … 비워진다"                        | ✅   |

## 3. 이전 검증 — 해당 없음 (FIX 작업)

## 4. 시안 대조 재확인

| #   | 항목                     | 반영됨                                                                       |
| --- | ------------------------ | --------------------------------------------------------------------------- |
| 1   | 추천 카드 언팔로우 외형  | 시안 없음. 기존 `UnFollowButton`(「팔로우 취소」) 재사용으로 앱 내 일관성 확보 |

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                    | 상태      |
| ------------------------------- | ----------------------------------------------------------- | --------- |
| `docs/implementation-status.md` | 해당 없음 — my-social 별도 행이 없고(MIG-025 P5에 묶임), 신규 화면/마이그레이션 단계가 아닌 기존 화면 동작 수정이라 상태 행 변화 없음 | — |
| `docs/migration-status.md`      | 해당 없음 (FIX)                                             | — |
| 그 외 `docs/`                   | 해당 없음                                                   | — |

## 중간에 막혔던 지점 — 스킬에 반영할 것

1. **`react-hooks/refs` — 렌더 중 ref 변경 금지.** `dataUpdatedAt` 비교로 상태를 리셋할 때 `useRef`를
   렌더 중 쓰면 lint가 막는다(`eslint`는 통과해도 steiger 전 단계 react-hooks 룰에서 에러). React 공식
   "렌더 중 상태 조정" 패턴은 **이전 값을 `useState`로** 들고 비교해야 한다. → ai-orchestrate에 메모.
2. **Radix `ScrollArea` 렌더 테스트는 `ResizeObserver` stub 필요.** jsdom에 없어 컴포넌트가 크래시하고
   CatchBoundary로 잡혀 화면이 비어 타임아웃난다. 전역 setup에 없으므로 테스트 파일 `beforeAll`에서
   `vi.stubGlobal('ResizeObserver', …)` 한다. ScrollArea를 쓰는 위젯 테스트가 늘면 전역 setup 승격 검토.

## 범위 밖 관찰 (고치지 않음)

- `use-follow-user.ts`(모달/목록 팔로우)는 여전히 추천 캐시에서 팔로우한 사용자를 `setQueryData` filter로
  제거한다. FIX-044 범위 밖이라 유지.
