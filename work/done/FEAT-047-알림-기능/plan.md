---
id: 'FEAT-047'
planned: '2026-10-05'
mode: 'feature'
---

# FEAT-047 구현 계획 — 알림 기능 (단일 세션, 4단계)

> `ai-plan` 산출물. 승인 전 구현 착수 금지. GitHub Issue [#266] 하나로 관리하고, 아래 Phase 1~4를
> 한 세션에서 레이어 순서로 진행한다. 설계·결정은 `spec.md`(ADR 3건)·`issues.md` 참조.

## 0. 모드 판정

`mode: feature` — legacy에 알림 화면이 없고(생성 API `getInbox`만 존재), 신규 기능이다.
`feature-planner` 3단계(요구사항·ADR·이슈) 완료됨. MIG/REF 착수 게이트는 해당 없음.

### 0-2. 자동 보류 신호 점검

- [ ] 동작+구조 혼재 → 아니오(순수 신규 기능). 단 `use-session-follow-state`의 `shared` 승격은
      **동작 보존 이동**(FIX-044 코드)이라 별도 동일성 확인 필요 — 아래 리스크에 명시.
- [ ] 한 단위로 검증 불가 → 아니오(4단계 각각 수직 슬라이스)
- [ ] 자동 생성물 직접 수정 → 아니오(routeTree는 재생성, orval 재생성 불필요)
- [ ] 범위 밖 문제 혼입 → 아니오(Fallback·읽음·뱃지·FCM는 Out of Scope)

보류 신호 없음.

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                         | 레이어       | Phase   |
| --- | -------------------------------------------------------------- | ------------ | ------- |
| 1   | 세션 팔로우 상태 훅 공유화                                      | `[shared]`   | 3(선행) |
| 2   | 알림 조회·파생 타입·actionType 매핑·날짜 그룹화·항목 표시 UI    | `[entities]` | 1·2     |
| 3   | FOLLOW 맞팔로우/팔로우취소 토글                                 | `[features]` | 3       |
| 4   | FRIEND_ACTIVITY 축하 + 인박스·피드 캐시 동기화                  | `[features]` | 4       |
| 5   | 데스크톱 팝오버 + 단일 공유 액션 렌더러                         | `[widgets]`  | 1       |
| 6   | 헤더 벨 트리거(슬롯 주입)                                       | `[widgets]`·`[app]` | 1 |
| 7   | 모바일 `/notifications` 페이지 + ProfileCard 벨 연결            | `[pages]`·`[app]`   | 2 |

### 1-1. 관리 포인트 (상수 추출)

| 값                       | 상수/인라인 | 근거                                               |
| ------------------------ | ----------- | -------------------------------------------------- |
| actionType→경로/카피 맵  | 상수        | 기획이 바꾸는 매핑(도메인 의미). `model/action.ts` |
| 버튼 카피("맞팔로우" 등) | 상수(맵 내) | actionType SoT, 재사용·관리 포인트                 |
| 레이아웃 수치(padding 등)| 인라인      | get_design_context로 토큰 반영(디자인 스펙)        |

## 2. 영향 분석

| 구분 | 파일 |
| ---- | ---- |
| 신규 | `entities/notification/{model/types.ts, model/action.ts(+test), api/use-inbox-query.ts, api/index.ts, lib/group-by-date.ts(+test), ui/notification-item.tsx, index.ts}` |
|      | `features/notification-follow/{api/use-follow-from-notification.ts, api/use-unfollow-from-notification.ts, ui/notification-follow-action.tsx, index.ts}` |
|      | `features/notification-congratulate/{api/use-congratulate-from-notification.ts, ui/notification-congratulate-action.tsx, index.ts}` |
|      | `widgets/notification/{ui/notification-popover.tsx, ui/notification-action.tsx, lib/use-popover-dismiss.ts, index.ts}` (+ 팝오버/페이지 통합 테스트) |
|      | `pages/notifications/{ui/notifications-page.tsx, index.ts}` + `app/routes/_authenticated/_app-shell/notifications.tsx` |
|      | `shared/lib/use-session-follow-state.ts` (+test) — **이동**(아래 삭제 참고) |
| 수정 | `widgets/header/ui/header.tsx` (벨 → `notificationSlot` prop) · `app/routes/_authenticated/_app-shell/route.tsx` (슬롯 주입) |
|      | `pages/my/ui/profile-card.tsx` (모바일 알림 버튼 → `/notifications`) |
|      | `widgets/social/recommend-friends/ui/social-recommend-friend-section.tsx` (훅 import 경로 변경) |
|      | `app/routeTree.gen.ts` (재생성) |
| 삭제 | `widgets/social/recommend-friends/model/use-session-follow-state.ts` (+test) — shared로 이동 |

npm 의존성 추가: **없음** (ADR-1 직접 구현). orval 재생성: **불필요**.

재사용: `getInbox`·`getGetInboxQueryKey`(notification-api), `useFollow`(social-api)·`useUnfollow`(friend-api),
`useCongratulateFeed`·`getFriendFeedQueryKey`, `ProfileAvatar`(entities/user), `Button`/`Icon`/`IconButton`,
`useIsWideViewport`, `shared/lib/date`, `Link`/`useNavigate`.

## 3. 의존 관계 검증 (FSD)

- ⚠️ **헤더 ↔ 알림 팝오버 = cross-slice widget 위반**: `widgets/header`가 `widgets/notification`을
  직접 import하면 훅이 차단한다. → **헤더에 `notificationSlot?: ReactNode` prop을 추가**하고,
  `app-shell` 라우트가 `<Header notificationSlot={<NotificationPopover/>} />`로 주입한다
  (`app → widgets` 허용, `fsd-widgets.md` §5 children 주입). 팝오버는 슬롯 내부 `relative` 래퍼에서
  `absolute`로 벨 아래 앵커.
- `entities/notification` → `shared`만. `features/notification-*` → `entities`+`shared`+생성 API(+`entities/friend-feed` 캐시키는 배럴 경유). cross-slice 아님.
- `widgets/notification` → `entities`+`features`+`shared`. `pages/notifications` → `widgets`+`entities`.
- `use-session-follow-state`를 `shared/lib`로 올리면 `features/notification-follow`·`widgets/social/recommend-friends` 양쪽이 하향 참조 — 위반 해소(현재는 widget에 있어 feature가 못 씀).
- 그 외 위반 없음.

## 4. 구현 계획 체크리스트

> `shared → entities → features → widgets → pages → app` 순서. Phase 태그는 검증 단위.

- [ ] `[shared]` (Phase 3 선행) `use-session-follow-state.ts`(+test)를 `widgets/social/recommend-friends/model`에서 `shared/lib`로 이동. recommend-friends import 갱신, 테스트 통과 확인(동작 보존)
- [ ] `[entities]` (Phase 1) `notification/model/types.ts` — `NotificationResponse` 재사용 + `ActionType` 유니온·파생 타입
- [ ] `[entities]` (Phase 1) `notification/model/action.ts`(+test) — `getActionDescriptor(noti)` 순수 매핑(kind/label/to)
- [ ] `[entities]` (Phase 1) `notification/api/use-inbox-query.ts` + `api/index.ts` — `getInbox` 래핑
- [ ] `[entities]` (Phase 1) `notification/ui/notification-item.tsx` — 표시 전용(아바타/아이콘+헤드라인+subText+timeAgo+`action` 슬롯)
- [ ] `[entities]` (Phase 2) `notification/lib/group-by-date.ts`(+test) — createdAt 날짜 그룹화(`shared/lib/date` 재사용)
- [ ] `[entities]` `notification/index.ts` 배럴
- [ ] `[features]` (Phase 3) `notification-follow` — `useFollow`/`useUnfollow` 래핑 2종 + `notification-follow-action.tsx`(세션 상태 토글) + 배럴
- [ ] `[features]` (Phase 4) `notification-congratulate` — `useCongratulateFeed` 래핑(인박스+friend-feed 캐시 `setQueryData`) + `notification-congratulate-action.tsx` + 배럴
- [ ] `[widgets]` (Phase 1) `notification/ui/notification-action.tsx` — 단일 공유 액션 렌더러(이동=`<Link>`, NONE=없음; Phase 3·4가 FOLLOW/CONGRATULATE 케이스 확장)
- [ ] `[widgets]` (Phase 1) `notification/lib/use-popover-dismiss.ts` — 외부클릭·Esc·포커스 복귀
- [ ] `[widgets]` (Phase 1) `notification/ui/notification-popover.tsx` — 벨 트리거 + 앵커 팝오버 + 목록 조립 + 배럴
- [ ] `[widgets]` (Phase 1) `header/ui/header.tsx` — 정적 벨 제거, `notificationSlot` prop 추가
- [ ] `[pages]` (Phase 2) `notifications/ui/notifications-page.tsx` + 배럴 — 뒤로가기+타이틀+날짜그룹+카드목록(공유 항목·액션 렌더러 재사용)
- [ ] `[pages]` (Phase 2) `my/ui/profile-card.tsx` — 모바일 알림 버튼 → `/notifications`
- [ ] `[app]` (Phase 1) `_app-shell/route.tsx` — 데스크톱 `Header`에 `<NotificationPopover/>` 슬롯 주입
- [ ] `[app]` (Phase 2) `routes/_authenticated/_app-shell/notifications.tsx` 추가 + **라우트 트리 재생성**(`pnpm --filter @repo/web exec vite build`) → `routeTree.gen.ts` 반영 확인

### Figma 작업 규칙 (구현 전체 적용)

각 UI 노드는 **get_design_context 4단계**: ①받기 ②작성 ③재호출 1:1 표(padding·gap·font-size·radius·color·shadow) ④불일치 수정 ⑤최종 diff 표. 근삿값 매핑 금지, 토큰 치환.
노드: 모바일 `13750-54846/54856/54866/54884/54875/54835`, 데스크톱 `13750-69839/69852/69860/69873/69837/69404`.

## 5. 리스크

| 리스크 | 영향 | 대응 |
| ------ | ---- | ---- |
| 헤더-팝오버 cross-slice | 훅 차단 | 슬롯 주입(§3). 헤더 테스트는 optional prop이라 영향 적음 |
| `use-session-follow-state` 이동이 FIX-044 동작 깨뜨림 | recommend 팔로우 토글 회귀 | 이동 후 recommend-friends 기존 테스트 + 해당 훅 테스트 green 확인 |
| 라우트 추가 후 트리 미재생성 | check-types 실패 | §4 마지막 단계에 vite build 명시 |
| 타입별 좌측 아이콘·버튼 카피 미확정 | 시안 불일치 | get_design_context로 확정, `확인 필요`에 기록 |
| 축하 동기화 feedId 매칭 | 인박스/피드 불일치 | targetId=feedId 전제로 양 캐시 setQueryData, 통합 테스트로 고정 |

### 검증 방법 (AC 대조)

| 방법 | 대상 |
| ---- | ---- |
| 자동(단위) | `getActionDescriptor` 매핑 · `group-by-date` · `use-session-follow-state`(이동) |
| 자동(통합, MSW) | 팝오버 벨→목록→네비·외부클릭/Esc 닫힘 / 페이지 렌더 / FOLLOW 토글·refetch 없음 / 축하 인박스·피드 동기화 / ProfileCard 벨→/notifications |
| Figma diff | 노드별 6속성 1:1 표 |
| 명령 | `pnpm lint` · `check-types` · `test` · `build` + 변경파일 prettier |

## 6. 완료 후 액션

- [ ] 작업 폴더 `to-do/` → `in-progress/` (승인 후), 완료 시 `done/`
- [ ] `checklist.md`는 `ai-validate`
- [ ] `docs/implementation-status.md`에 알림 화면(데스크톱/모바일) 추가
- [ ] 세션 팔로우 훅 shared 승격 사실을 FIX-044 관련 문서/주석에 반영(제거 조건 유지)
- [ ] 임시 우회(로컬 팔로우 상태)의 제거 조건(서버 토글 상태 제공) 주석 유지
