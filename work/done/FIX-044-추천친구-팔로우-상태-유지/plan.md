---
id: 'FIX-044'
planned: '2026-10-04'
mode: 'fix'
---

# FIX-044 구현 계획 — 추천 친구 팔로우 상태 유지 (즉시 제거 → 카드 유지·토글)

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.**
> 설계는 `spec.md`에서 이미 확정됐다(카드 유지·토글 + 모달 언팔로우 drift 방지). 이 문서는 그
> 설계를 레이어별 구현 순서로 옮긴다.

## 0. 모드 판정

`mode: fix` — 동작 정의(카드 유지·토글)와 다르게 "팔로우 시 즉시 제거"로 구현돼 있는 것을 바로잡는다.
구조 이전(`MIG-`)이 아니라 이미 `apps/web`에 있는 화면의 동작 수정이다. `MIG-`/`REF-` 전용
착수 게이트는 해당 없음.

### 0-2. 자동 보류 신호 점검

- [ ] 동작 변경 + 구조 변경 혼재 → **아니오.** 순수 동작 수정이다
- [ ] 한 단위로 완료·검증 불가 → **아니오.** 한 화면(마이 소셜 추천 섹션)에서 완결
- [ ] 자동 생성물 직접 수정 → **아니오.** orval/routeTree 안 건드린다
- [ ] 기존 검증 실패 원인 설명 불가 → **아니오.** 현재 동작(즉시 제거)을 코드로 확인함
- [ ] 범위 밖 문제 혼입 → **아니오.** 탈퇴(MIG-046) 작업은 분리해 스태시한다

보류 신호 없음.

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                              | 레이어       |
| --- | ------------------------------------------------------------------- | ------------ |
| 1   | 추천 팔로우 성공 시 카드를 제거하지 않는다(낙관적 filter 제거)        | `[features]` |
| 2   | 추천 카드 전용 언팔로우(로컬 토글, 추천 refetch 없음) 추가            | `[features]` |
| 3   | 모달 언팔로우 시 추천 키를 active 무효화(섹션 자가 치유)              | `[features]` |
| 4   | 세션 팔로우 상태(set) 보관 + `dataUpdatedAt` 변하면 리셋             | `[widgets]`  |
| 5   | 추천 카드가 상태에 따라 팔로우/언팔로우 버튼 토글 렌더               | `[widgets]`  |

### 설계 핵심 (spec 재확인)

- `features/follow/ui/follow-list-item.tsx`는 **per-card `useState(isFollowing)`** 로 토글한다.
  추천 섹션은 이 방식으로 **부족하다** — 모달에서 언팔로우하면 추천 카드는 그대로 mount 상태라
  per-card state가 stale된다. 그래서 **섹션 레벨 set + refetch 리셋**이 필요하다(AC-4·AC-5).
- 같은 unfollow 엔드포인트가 **출처에 따라 side-effect가 다르다**: 추천 카드 자신의 언팔로우는
  `refetchType:'none'`(로컬 set이 UI 처리), 모달 언팔로우는 추천 키 **active 무효화**(섹션이 모름).
  → 추천 전용 unfollow 훅을 `features/follow`의 것과 **별도로** 둔다.

## 2. 영향 분석

| 구분 | 파일                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------ |
| 신규 | `features/friend-recommend-follow/api/use-unfollow-recommended-user.ts`                           |
| 신규 | `features/friend-recommend-follow/ui/recommend-unfollow-button.tsx`                               |
| 신규 | `widgets/social/recommend-friends/model/use-session-follow-state.ts` (+ `.test.ts`)              |
| 수정 | `features/friend-recommend-follow/api/use-follow-recommended-user.ts` (낙관적 filter 제거)        |
| 수정 | `features/friend-recommend-follow/ui/recommend-follow-button.tsx` (팔로우 성공 콜백)              |
| 수정 | `features/friend-recommend-follow/index.ts` (언팔로우 버튼 export)                                |
| 수정 | `features/follow/api/use-unfollow-user.ts` (추천 키 active 무효화 추가)                           |
| 수정 | `widgets/social/recommend-friends/ui/social-recommend-friend-section.tsx` (set 보관·주입)         |
| 수정 | `widgets/social/recommend-friends/ui/recommend-friend-card.tsx` (상태별 버튼 토글)               |
| 삭제 | 없음                                                                                             |

npm 의존성 추가: 없음

## 3. 의존 관계 검증

- `features/friend-recommend-follow`가 `shared/api/generated`의 `useUnfollow`를 쓴다 → shared 참조, 정상.
- 추천 언팔 버튼을 `features/follow`에서 재사용하지 **않는다**(cross-slice 금지이기도 하고,
  refetch 정책이 달라야 하므로). 각 feature가 생성 훅을 각자 감싼다.
- `widgets/social/recommend-friends`가 `features/friend-recommend-follow`를 import → 하향, 정상.
- FSD 위반: **없음.**

## 4. 구현 계획 체크리스트

> `shared → entities → features → widgets` 순서. shared/entities 변경 없음.

- [ ] `[features]` `use-follow-recommended-user.ts`: 추천 목록 낙관적 `filter` 제거.
      `followingCount +1` 낙관 + 롤백은 유지. onSettled의 추천 `refetchType:'none'` 유지(stale 표시).
- [ ] `[features]` `use-unfollow-recommended-user.ts` 신규: `useUnfollow` 래핑. onSuccess에서
      `followingCount -1` + followings 목록 무효화 + 추천 키 **`refetchType:'none'`**. onSuccess 콜백 받기.
- [ ] `[features]` `recommend-follow-button.tsx`: 팔로우 성공 시 `onFollowed` 콜백 호출
      (`follow({ userId }, { onSuccess })`).
- [ ] `[features]` `recommend-unfollow-button.tsx` 신규: 모바일/데스크톱 2-variant(기존 팔로우 버튼과
      동일 레이아웃), 언팔로우 성공 시 `onUnfollowed` 콜백.
- [ ] `[features]` `index.ts`: `RecommendUnfollowButton` export 추가.
- [ ] `[features]` `use-unfollow-user.ts`(follow): onSuccess에 추천 키 **active 무효화** 추가
      (`invalidateQueries({ queryKey: getGetRecommendedUsersQueryKey() })`).
- [ ] `[widgets]` `use-session-follow-state.ts` 신규: `(dataUpdatedAt)` → `{ isFollowing, markFollowed,
      markUnfollowed }`. `dataUpdatedAt` 변경 시 set 리셋(렌더 중 이전 값 비교로 flash 없이). `.test.ts` 동봉.
- [ ] `[widgets]` `social-recommend-friend-section.tsx`: `dataUpdatedAt` 구독 + 훅 사용, 카드에
      `isFollowing`·`onFollowed`·`onUnfollowed` 주입.
- [ ] `[widgets]` `recommend-friend-card.tsx`: `isFollowing` 분기로 팔로우/언팔로우 버튼 토글.

## 5. 리스크

| 리스크                                           | 영향                                   | 대응                                                      |
| ------------------------------------------------ | -------------------------------------- | -------------------------------------------------------- |
| 추천 카드 언팔로우 버튼의 **시안 부재**          | 외형 임의 결정 위험                    | 기존 팔로우 버튼 레이아웃 + `stroke` variant 재사용, 아래 확인 필요에 기록. 시안 생기면 별도 대조 |
| `use-follow-user.ts`의 추천 캐시 filter와 혼동   | 모달/목록 팔로우가 추천에서 제거       | 이번 범위 밖 — **건드리지 않는다**(동작 유지). diff 최소화 |
| `dataUpdatedAt` 리셋이 AC-2(로컬 언팔)에서 오발동 | 추천 refetch 안 하므로 리셋 안 됨 — OK | 추천 카드 언팔은 `refetchType:'none'`이라 `dataUpdatedAt` 불변 → 리셋 안 됨(의도대로) |

### 동일성/검증 방법 (AC 대조)

| AC   | 검증 방법                                                                 |
| ---- | ------------------------------------------------------------------------ |
| AC-1 | 통합(RTL+MSW): 팔로우 클릭 → 카드 유지 + 버튼 "언팔로우"로 전환           |
| AC-2 | 통합: 언팔로우 클릭 → 카드 유지 + "팔로우" 복귀, 추천 refetch 미발생      |
| AC-3 | 통합: 모달 열고 아무 것도 안 함 → 닫아도 언팔로우 버튼 유지, refetch 없음 |
| AC-4 | 통합: 모달에서 언팔로우 → 추천 active refetch → 닫으면 "팔로우" 버튼      |
| AC-5 | 단위: `use-session-follow-state` — `dataUpdatedAt` 갱신 시 set 비워짐    |

## 6. 완료 후 액션

- [ ] 작업 폴더 `work/to-do/` → `work/in-progress/`로 `git mv` (승인 후)
- [ ] `checklist.md`는 `ai-validate`가 작성
- [ ] 화면 상태를 `docs/implementation-status.md`에 반영(해당 시)
- [ ] 임시 우회(로컬 set)의 제거 조건(서버 `isFollowing` 제공)을 코드 주석에 명시

## 확인 필요

- 추천 카드 **언팔로우 버튼의 시안**이 Figma에 있는가? 없으면 기존 팔로우 버튼과 동일 레이아웃 +
  `stroke` 계열로 구현하고(레이블: "팔로잉" 또는 "팔로우 취소"), 시안 확정 시 별도 대조한다.
