---
id: 'FIX-044'
title: '추천 친구 팔로우 상태 유지 (즉시 제거 → 카드 유지·토글)'
type: 'fix'
screen: 'my-social'
priority: 'medium'
created: '2026-09-24'
revised: '2026-09-24'
---

# FIX-044 — 추천 친구 팔로우 상태 유지 (즉시 제거 → 카드 유지·토글)

## 배경 · 목표

추천 친구 섹션에서 팔로우하면 현재는 카드가 목록에서 **즉시 제거**된다
(`use-follow-recommended-user.ts`의 낙관적 filter). 그러나 동작 정의는 카드를 제거하지 않고
**언팔로우 버튼으로 상태만 토글**하는 것이다. 사용자가 확정: **카드 유지 + 토글로 간다.**

추천 응답(`RecommendUserResponse`)에는 `isFollowing`이 없어 팔로우 상태를 서버 데이터로
표현할 수 없다. 그래서 "팔로우했지만 카드에 남아있는 상태"는 **추천 위젯의 로컬 상태**로 들고
가야 한다. 문제는 데스크톱에서 팔로우/팔로잉이 **모달**이라, 추천 섹션에서 팔로우해 언팔로우
상태가 된 사용자를 그 카드가 아니라 **모달을 열어 언팔로우**하면 추천 섹션의 로컬 상태가 stale
된다(모바일은 별도 페이지라 재진입 시 refetch되어 self-heal).

목표: 추천 섹션이 카드를 유지·토글하면서도, 모달에서 언팔로우가 일어났을 때 어긋나지 않게 한다.

## 범위

- `apps/web/src/features/friend-recommend-follow/` — 팔로우 낙관 처리 변경(제거 → 유지), **언팔로우 추가**
- `apps/web/src/features/follow/api/use-unfollow-user.ts` — 모달 언팔로우 시 추천 키 무효화(active) 추가
- `apps/web/src/widgets/social/recommend-friends/` — 로컬 팔로우 상태(set) + 팔로우/언팔로우 버튼 렌더
- 필요 시 `apps/web/src/features/follow/api/use-follow-user.ts` — 추천 캐시 직접 제거 로직 정리

## Out of Scope

- 서버 API 변경 (`RecommendUserResponse`에 `isFollowing` 추가) — **요청하지 않는다.** 프론트에서 해결한다
- 모달이 열려 있는 동안의 **실시간** 상태 반영 — 모달이 추천 섹션을 덮으므로 불필요. 정합은 언팔로우 액션 시점에만 맞춘다
- 팔로워/팔로잉 목록 자체의 동작·정렬·무한스크롤 변경
- 추천 목록의 정렬·개수·문구 등 표시 스펙 변경

## 용어 정의 (Ubiquitous Language)

| 용어 | 정의 |
| ---- | ---- |
| 추천 섹션 | `widgets/social/recommend-friends`. 마이 소셜 탭의 추천 친구 블록 |
| 팔로우 모달 | `widgets/social/follow`의 `FollowModal`. 데스크톱에서 팔로워/팔로잉을 보여주는 오버레이 다이얼로그 |
| 로컬 set | 추천 위젯이 세션 동안 들고 있는 "이 세션에 팔로우한 userId" 집합. `dataUpdatedAt`이 바뀌면(=refetch) 비운다 |
| 카드 유지 | 팔로우해도 추천 목록에서 카드를 제거하지 않고 버튼만 팔로우↔언팔로우로 토글 |

---

## 설계 결정 (요약)

> 사용자와의 논의로 확정한 접근. 정식 ADR(3안 비교)은 규모상 생략하고, 검토한 대안과 채택 사유만 남긴다.

**핵심 지렛대** — `FollowModal`은 오버레이 다이얼로그라 열려 있는 동안 추천 섹션을 **가린다.**
따라서 두 화면의 **실시간 동기화가 필요 없고**, 상태를 바꾼 **언팔로우 액션 시점에만** 정합을
맞추면 된다.

**채택** — 공유 상태 컨테이너(store/context)를 두지 않는다.

1. 추천 팔로우 성공 → 카드 제거 대신 로컬 set에 추가 → 언팔로우 버튼 표시. 추천 쿼리는
   `refetchType: 'none'`으로 stale만 표시(remount 전까지 카드 유지).
2. **추천 카드 자체의 언팔로우** → 로컬 set에서 제거 → 팔로우 버튼으로 즉시 토글. 추천은
   `refetchType: 'none'`(로컬 set이 이미 UI를 처리하므로 서버 왕복 불필요).
3. **모달에서의 언팔로우** → 로컬 set이 알 수 없음 → `useUnfollowUser`가 추천 키를
   **active로 무효화**해 즉시 refetch → `dataUpdatedAt` 변화로 로컬 set 리셋 → 서버 기준으로 복귀.
   (모달이 가리고 있어 reflow가 보이지 않고, 닫으면 이미 fresh)

**검토한 대안과 거부 이유**

| 안 | 내용 | 거부 이유 |
| --- | ---- | --------- |
| 서버 `isFollowing` 추가 | 추천 응답에 필드 추가 후 캐시 동기화 | 초기값만 해결하고 in-session drift는 여전히 클라 몫. 외부(백엔드) 의존으로 가장 느림. refetch 시 목록 재정렬로 UX 저하 |
| 전역 Zustand store (`entities/follow`) | userId별 팔로우 상태를 양쪽 feature가 read/write | 상태의 올바른 수명은 "페이지 방문"인데 store는 app 수명 → reset 로직을 별도로 붙여 흉내내야 함 |
| page-scoped React Context | `entities/follow`에 정의, 소셜 페이지에서 provide | 실시간 동기화가 필요할 때만 가치. 모달이 섹션을 가리는 이 케이스엔 과함 + mobile(provider 없는 경로)에서 mutation write에 no-op fallback 필요 |
| 모달 open/close에 refetch | 모달 여닫을 때마다 추천 refetch | 언팔로우 안 해도 refetch되어 방금 팔로우한 카드가 사라짐 → "카드 유지" 약화 |

**Consequences (트레이드오프)**

- 로컬 set은 추천 응답에 `isFollowing`이 없어서 생기는 **임시 우회**다. 서버가 `isFollowing`을
  제공하면 로컬 set을 제거하고 캐시 기반으로 단순화할 수 있다(제거 조건).
- 같은 unfollow 엔드포인트가 **출처(추천 카드 vs 모달)에 따라 캐시 side-effect가 다르다.**
  추천 쪽은 자기 unfollow(refetch none), 모달 쪽은 `useUnfollowUser`(추천 active)로 배선이 갈린다.
- 모달에서 언팔로우 시 추천은 **active refetch**한다. 이때 추천 목록 순서가 바뀔 수 있으나
  모달이 가려 사용자에게 보이지 않는다.

### 확인 필요

- 없음 (동작 정의 = 카드 유지·토글, 사용자 확정)

---

## 확정 명세 · 검증 기준

> **2026-10-04 설계 수정** — 추천 카드 언팔로우는 기존 `UnFollowButton`(「팔로우 취소」)을 그대로
> 재사용하고, **모달 언팔로우 시 추천 목록 active refetch는 하지 않는다.** 모달에서 언팔로우한
> 사용자가 추천 섹션에 stale로 남을 수 있으나, 리로드·재진입 시 자연 refetch로 서버 기준 복귀한다
> (사용자 결정). AC-1·AC-4를 이에 맞게 수정.

- [ ] **AC-1** (범위: 통합)
      Given 추천 섹션에 `userId=1`이 팔로우 버튼으로 표시됨
      When `userId=1`의 팔로우 버튼을 클릭
      Then 카드가 목록에서 사라지지 않고, 해당 카드의 버튼이 "팔로우 취소"(UnFollowButton)로 바뀐다

- [ ] **AC-2** (범위: 통합)
      Given AC-1 직후(추천 섹션에서 `userId=1`이 언팔로우 버튼 상태)
      When 같은 카드의 "팔로우 취소" 버튼을 클릭
      Then 카드는 유지된 채 버튼이 다시 "팔로우"로 바뀌고, 추천 목록 refetch는 발생하지 않는다

- [ ] **AC-3** (범위: 통합)
      Given AC-1 직후 상태에서 팔로잉 모달을 열어 아무 언팔로우도 하지 않음
      When 모달을 닫는다
      Then 추천 섹션의 `userId=1`은 여전히 언팔로우 버튼 상태로 유지된다(추가 refetch 없음)

- [ ] **AC-4** (범위: 통합) — *수정됨*
      Given AC-1 직후 상태에서 팔로잉 모달을 연다
      When 모달 안에서 `userId=1`을 언팔로우
      Then 추천 섹션은 즉시 refetch되지 않으며 stale로 남는다. 리로드·재진입 시 추천 쿼리가
      갱신되어 `userId=1`은 서버 기준(팔로우 버튼)으로 표시된다

- [ ] **AC-5** (범위: 단위)
      Given 추천 섹션에서 `userId=1`을 팔로우해 언팔로우 버튼 상태
      When 추천 쿼리가 refetch되어 `dataUpdatedAt`이 갱신됨
      Then 로컬 팔로우 set이 비워지고, 버튼 상태는 서버가 반환한 추천 목록 기준으로 결정된다

---

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-09-24 | 작업 생성. 즉시 제거 → 카드 유지·토글로 전환하는 설계 확정 | 동작 정의(카드 유지) 준수 + 데스크톱 모달 언팔로우 drift 방지 | — |
| 2026-10-04 | 추천 카드 언팔로우를 기존 `UnFollowButton` 재사용으로 변경, 모달 언팔로우의 추천 active refetch 제거 | 전용 언팔 버튼/훅 불필요(외형은 기존 버튼). 모달 drift는 리로드·재진입 시 자연 refetch로 해소(사용자 결정) | AC-1·AC-4 |
