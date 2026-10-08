---
id: 'FEAT-047'
---

# FEAT-047 이슈 분해

> **GitHub Issue: [#266](https://github.com/Team-Gravit/gravit-web/issues/266) 하나로 관리한다.**
> 아래 Issue 1~4는 GitHub 이슈를 나누지 않고 **한 세션에서 순서대로 진행하는 구현 단계**다
> (사용자 결정). 각 단계는 독립 검증 가능한 수직 슬라이스지만 PR·이슈는 통합한다.

수직 슬라이스 4개. 각 단계는 완료 시 사용자에게 보여줄 동작이 있다.
공통 조립(actionType → 액션 노드)은 Issue 1의 단일 공유 렌더러에서 만들고 2·3·4가 공유·확장한다.

의존 그래프:

```
Issue 1 (entity + 데스크톱 팝오버 + 네비 액션)
   ├─→ Issue 2 (모바일 페이지)        # 1의 entity·항목·매핑 재사용
   ├─→ Issue 3 (FOLLOW 토글)          # 1의 액션 슬롯/매핑에 주입 → 두 표면에 반영
   └─→ Issue 4 (축하 + 피드 동기화)   # 〃
```

---

## Issue 1: [entities/notification + widgets/notification] 알림 조회·표시 + 데스크톱 팝오버 + 네비게이션 액션

GitHub Issue: 미등록

### 설명

데스크톱 유저가 헤더 벨을 눌러 최신 알림 목록을 보고, 이동형 알림(학습·공지·문의)에서 바로
해당 화면으로 이동한다. 알림 도메인(조회·표시·액션 매핑)의 토대를 세운다.

### 구현 범위

- `entities/notification/model/types.ts` — `NotificationResponse` 재사용 + 파생 타입, actionType 유니온
- `entities/notification/model/action.ts` — actionType → 액션 서술자(종류·카피·경로) 순수 매핑
- `entities/notification/api/use-inbox-query.ts` — `getInbox` 래핑
- `entities/notification/ui/notification-item.tsx` — 표시 전용(아바타/아이콘 + 헤드라인 + subText + timeAgo + `action` 슬롯)
- `widgets/notification/ui/notification-action.tsx` — **단일 공유 액션 렌더러**. 알림 1건 → actionType별 액션 노드(이동=`<Link>`, NONE=없음). Issue 3·4가 이 한 곳을 확장하면 팝오버·페이지 양쪽에 자동 전파. 데스크톱 팝오버와 모바일 페이지가 공유
- `widgets/notification/ui/notification-popover.tsx` — 벨 앵커 팝오버(직접 구현: `absolute right-0 top-full`, 외부클릭·Esc 닫기, 포커스 복귀) + 목록 조립 + actionType별 액션 노드(이동=`<Link>`, NONE=없음)
- `widgets/notification/lib/use-popover-dismiss.ts` — 외부클릭·Esc 처리(위젯 로컬, 단일 사용)
- `widgets/header/ui/header.tsx` — 벨 래퍼 `relative` + 벨을 팝오버 트리거로 연결
- 의존성 추가 없음 (ADR-1: 직접 구현)

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given `getActionDescriptor({ type:'INACTIVITY', actionType:'GO_TO_LEARNING' })`
When 호출
Then `{ kind:'link', label:'학습하러 가기', to:'/learning' }` 를 반환한다

☐ **AC-2** (범위: 단위)
Given `getActionDescriptor({ type:'NOTICE', actionType:'GO_TO_NOTICE' })` 와 `{ actionType:'GO_TO_INQUIRY' }`
When 각각 호출
Then `to`가 각각 `/settings/notice`, `/settings/inquiry` 이다

☐ **AC-3** (범위: 단위)
Given `getActionDescriptor({ type:'NOTICE', actionType:'NONE' })`
When 호출
Then `{ kind:'none' }` 를 반환한다(버튼 없음)

☐ **AC-4** (범위: 통합)
Given 인박스가 `[{ id:2, type:'INACTIVITY', message:'연속학습이 깨져요.', subText:'다음날까지 2시간 남았어요.', actionType:'GO_TO_LEARNING', timeAgo:'2시간 전', read:false }]`
When 헤더 벨을 클릭
Then 팝오버에 "연속학습이 깨져요.", "다음날까지 2시간 남았어요.", "2시간 전"과 href `/learning`인 "학습하러 가기"가 보인다

☐ **AC-5** (범위: 통합)
Given 팝오버가 열린 상태
When 팝오버 바깥을 클릭하거나 Esc를 누른다
Then 팝오버가 닫힌다(목록이 사라진다)

☐ **AC-6** (범위: 통합)
Given 인박스가 `[]`
When 벨을 클릭
Then 팝오버가 크래시 없이 열리고 알림 항목이 0개다 (빈 상태 비주얼은 사용자 소유 — Out of Scope)

### 의존성

없음

---

## Issue 2: [pages/notifications] 모바일 알림 페이지

GitHub Issue: 미등록

### 설명

모바일 유저가 상단바 벨로 `/notifications`에 진입해 날짜 그룹과 카드 목록으로 알림을 보고 이동
액션을 수행한다. Issue 1의 entity·항목·액션 매핑을 재사용한다.

### 구현 범위

- `app/routes/_authenticated/_app-shell/notifications.tsx` — 라우트 + 라우트 트리 재생성
- `pages/notifications/ui/notifications-page.tsx` — 뒤로가기 + "알림" 타이틀 + 날짜 그룹 헤더 + 카드 목록 (Issue 1의 `NotificationItem` + 공유 액션 렌더러 재사용)
- `entities/notification/lib/group-by-date.ts` — `createdAt` 기준 날짜 그룹화(순수 함수). 날짜 포맷은 `shared/lib/date.ts` 재사용 검토
- `pages/my/ui/profile-card.tsx` — **기존 모바일 알림 버튼**(`aria-label="알림"`, 설정 버튼 옆)을 `/notifications`로 연결

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 단위)
Given 알림 2건의 `createdAt`이 `2026-05-22T10:00:00` 과 `2026-05-22T09:00:00`
When `groupByDate(list)`
Then 그룹 1개(`'2026. 05. 22 (금)'`)에 항목 2개가 들어간다

☐ **AC-2** (범위: 단위)
Given `createdAt`이 `2026-05-22` 1건과 `2026-05-21` 1건
When `groupByDate(list)`
Then 그룹 2개가 최신 날짜 먼저 정렬되어 반환된다

☐ **AC-3** (범위: 통합)
Given 모바일 뷰포트에서 인박스가 `[{ id:2, type:'INACTIVITY', message:'연속학습이 깨져요.', actionType:'GO_TO_LEARNING', createdAt:'2026-05-22T10:00:00', timeAgo:'2시간 전', read:false }]`
When `/notifications` 렌더
Then "알림" 타이틀, 날짜 그룹 "2026. 05. 22 (금)", "연속학습이 깨져요." 카드, href `/learning` 액션이 존재한다

☐ **AC-4** (범위: 통합)
Given 모바일 뷰포트의 마이그래빗 `ProfileCard`
When 알림 버튼(`aria-label="알림"`)을 클릭
Then `/notifications`로 이동한다

### 의존성

Issue 1 완료 후 시작 (entity·항목·공유 액션 렌더러 재사용)

---

## Issue 3: [features/notification-follow] FOLLOW 맞팔로우 / 팔로우 취소 토글

GitHub Issue: 미등록

### 설명

FOLLOW 알림에서 맞팔로우하거나(이미 팔로우 중이면) 팔로우를 취소한다. 클릭 후 재조회 없이
버튼이 토글된다(FIX-044 패턴). 데스크톱 팝오버·모바일 페이지 양쪽에 반영된다.

### 구현 범위

- `features/notification-follow/api/use-follow-from-notification.ts` — 생성 `useFollow` 래핑(팔로잉 수 무효화)
- `features/notification-follow/api/use-unfollow-from-notification.ts` — 생성 `useUnfollow` 래핑(인박스 refetchType:'none')
- `features/notification-follow/ui/notification-follow-action.tsx` — actionType/로컬 상태로 맞팔로우↔팔로우취소 렌더
- **`shared/lib/use-session-follow-state.ts` 로 승격** — FIX-044의 `widgets/social/recommend-friends/model/use-session-follow-state.ts`(+test)를 `shared/lib`로 이동하고, `recommend-friends`의 import를 갱신(기존 동작 보존). 2번째 사용처이므로 공통화(ADR-3, 사용자 승인)
- Issue 1의 공유 액션 렌더러(`widgets/notification/ui/notification-action.tsx`)에 `FOLLOW_BACK`/(FOLLOW+`NONE`) → 이 액션 노드 연결 (한 곳만 고치면 팝오버·페이지 양쪽 반영)

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 인박스가 `[{ id:1, type:'FOLLOW', message:'김나영님이 친구신청을 보냈어요.', actionType:'FOLLOW_BACK', actor:{ profileId:5, nickname:'김나영', profileImgNumber:1 }, timeAgo:'2시간 전', read:false }]`
When "맞팔로우" 버튼을 클릭(팔로우 요청 성공)
Then 그 항목은 유지된 채 버튼이 "팔로우 취소"로 바뀐다

☐ **AC-2** (범위: 통합)
Given AC-1 직후("팔로우 취소" 상태)
When "팔로우 취소" 버튼을 클릭(언팔로우 성공)
Then 버튼이 다시 "맞팔로우"로 바뀌고, 인박스 refetch는 발생하지 않는다

☐ **AC-3** (범위: 통합)
Given 인박스가 `[{ id:1, type:'FOLLOW', actionType:'NONE', actor:{ profileId:5, nickname:'김나영', profileImgNumber:1 }, ... }]`
When 렌더
Then 그 항목의 버튼이 "팔로우 취소"로 표시된다(이미 팔로우 중)

### 의존성

Issue 1 완료 후 시작. 공유 액션 렌더러 한 곳만 확장하므로 팝오버(1)·페이지(2) 양쪽에 자동 반영된다.

---

## Issue 4: [features/notification-congratulate] FRIEND_ACTIVITY 축하 + 소셜 피드 동기화

GitHub Issue: 미등록

### 설명

FRIEND_ACTIVITY 알림에서 친구의 활동을 축하한다. 성공 시 알림함과 소셜 피드가 동일 feedId로
'축하 완료' 동기화된다(어느 쪽에서 눌러도 일치).

### 구현 범위

- `features/notification-congratulate/api/use-congratulate-from-notification.ts` — 생성 `useCongratulateFeed` 래핑. onSuccess에 인박스 캐시(targetId=feedId) `congratulated=true` + friend-feed 캐시 동일 feedId 갱신(둘 다 `setQueryData`, refetch 없음)
- `features/notification-congratulate/ui/notification-congratulate-action.tsx` — congratulated로 "축하하기"/"축하 완료" 렌더
- Issue 1의 공유 액션 렌더러(`widgets/notification/ui/notification-action.tsx`)에 `CONGRATULATE` → 이 액션 노드 연결 (한 곳만 고치면 팝오버·페이지 양쪽 반영)

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 인박스가 `[{ id:3, type:'FRIEND_ACTIVITY', message:'OO님의 활동', actionType:'CONGRATULATE', targetId:77, congratulated:false, timeAgo:'2시간 전', read:false }]`
When "축하하기" 버튼을 클릭(축하 성공)
Then 그 항목 버튼이 "축하 완료"로 바뀐다

☐ **AC-2** (범위: 통합)
Given 인박스에 `targetId:77`(congratulated:false) 항목이 있고, friend-feed 캐시에도 `feedId:77`(congratulated:false)이 로드돼 있다
When 알림함에서 feedId 77을 축하
Then friend-feed 캐시의 `feedId:77` 항목도 `congratulated:true`가 된다(피드 재진입 시 '축하 완료')

☐ **AC-3** (범위: 통합)
Given 인박스가 `[{ id:3, type:'FRIEND_ACTIVITY', actionType:'CONGRATULATE', targetId:77, congratulated:true, ... }]`
When 렌더
Then 그 항목이 "축하 완료"(비활성)로 표시된다

### 의존성

Issue 1 완료 후 시작. 공유 액션 렌더러 한 곳만 확장하므로 팝오버(1)·페이지(2) 양쪽에 자동 반영된다.

---

## 시퀀스 검토

- [x] 각 의존성이 실제 입력·계약 관계를 근거로 하나 — 2·3·4는 1의 entity + **공유 액션 렌더러**에 의존
- [x] 순환 의존성 없음, 1 완료 후 2·3·4 병렬 가능. 3·4는 공유 렌더러 한 곳만 확장 → 두 표면 자동 전파
- [x] 선행 이슈가 빠져 다음 이슈 구현이 불가능한 구간 없음
- [x] Out of Scope(Fallback UI·읽음·뱃지·페이지네이션·리그 전용 버튼·FCM) 가 어떤 이슈에도 없음
