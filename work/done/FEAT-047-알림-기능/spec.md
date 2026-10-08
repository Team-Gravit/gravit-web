---
id: 'FEAT-047'
title: '알림 기능 (알림 인박스: 데스크톱 팝오버 + 모바일 페이지)'
type: 'feature'
screen: 'notification'
priority: 'medium'
created: '2026-10-05'
revised: '2026-10-05'
---

# FEAT-047 — 알림 기능 (알림 인박스)

## 배경 · 목표

로그인 유저가 팔로우 요청·친구 활동·연속학습·공지·문의 답변·리그 등 자신에게 발생한 알림을
한곳에서 확인하고, 알림 종류에 맞는 액션(맞팔로우·축하·이동)을 바로 수행하게 한다.
**데스크톱은 헤더 벨 아래 팝오버**, **모바일은 `/notifications` 페이지**로 렌더한다
(팔로우/팔로잉이 데스크톱=모달, 모바일=페이지인 것과 같은 반응형 분기).

백엔드 계약은 이미 존재한다: `GET /api/v1/notifications`(orval `getInbox`) → `NotificationResponse[]`.
최근 30일 이내 최신 30건, 페이지네이션 없음.

## 범위

- `entities/notification/` 신설 — 파생 타입, `getInbox` 래핑 조회 훅, 알림 항목 표시 UI(표시 전용)
- `features/notification-follow/` 신설 — FOLLOW 알림의 맞팔로우/팔로우 취소 토글
- `features/notification-congratulate/` 신설 — FRIEND_ACTIVITY 알림의 축하 + 소셜 피드 동기화
- `widgets/notification/` 신설 — 데스크톱 팝오버(헤더 벨 트리거)
- `pages/notifications/` 신설 + `app/routes/.../notifications` 라우트 — 모바일 페이지
- `widgets/header` 수정 — 벨을 팝오버 트리거로 연결
- 모바일 진입점(상단바 벨) 연결

### 액션 매핑 (actionType → 버튼) — **계약은 actionType이 SoT**

| actionType       | 버튼           | 동작                           |
| ---------------- | -------------- | ------------------------------ |
| `NONE`           | (FOLLOW 타입) "팔로우 취소" / (그 외) 버튼 없음 | FOLLOW면 언팔로우 토글 |
| `FOLLOW_BACK`    | "맞팔로우"     | 팔로우 → "팔로우 취소"로 토글   |
| `CONGRATULATE`   | "축하하기" / "축하 완료"(congratulated=true) | 피드 축하 |
| `GO_TO_LEARNING` | "학습하러 가기" | `/learning` 이동               |
| `GO_TO_NOTICE`   | "공지 보러가기" | `/settings/notice` 이동        |
| `GO_TO_INQUIRY`  | "문의 보러가기" | `/settings/inquiry` 이동       |

> **actionType에 없는 버튼은 렌더하지 않는다** (사용자 결정). 시안의 "리그 가기"는 대응 actionType이
> 없어 무시한다. 리그 승급 알림은 서버가 주는 actionType(예: `GO_TO_LEARNING`/`NONE`)대로 처리한다.

## Out of Scope

- **빈 상태 / Fallback UI** — **사용자가 직접 구현한다(HOLD)**. 이 작업은 데이터 경로(0건에도
  크래시 없이 항목 0개)만 처리하고, 빈 상태 비주얼·문구는 만들지 않는다.
- **읽음 처리 / 안읽음 벨 뱃지** — 알림 API에 읽음 처리·안읽음 카운트 엔드포인트가 없다.
  백엔드 지원이 생기면 별도 FEAT로 다룬다. (`read` 필드는 받지만 변경 수단이 없다)
- **페이지네이션 / 무한스크롤** — 서버가 최신 30건 단일 목록만 반환(계약상 없음)
- **actionType에 없는 액션 버튼** (리그 전용 "리그 가기" 등) — 렌더하지 않는다
- **알림 실시간 수신(FCM/푸시)** — native 셸·FCM 토큰은 이 작업 범위 밖
- **알림 설정/구독 토글** — 시안·계약 없음
- 서버 API 변경(orval 재생성) — 기존 `getInbox`로 충분

## 용어 정의 (Ubiquitous Language)

| 용어            | 정의                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| 알림 인박스     | `GET /api/v1/notifications` 응답(`NotificationResponse[]`). 최근 30일·최신 30건            |
| 액션 타입       | `actionType` 필드. 어떤 액션 버튼을 렌더할지 결정하는 **계약상 SoT**                       |
| actor           | FOLLOW 알림의 상대 유저(`NotificationActor`: profileId·nickname·profileImgNumber)          |
| congratulated   | FRIEND_ACTIVITY 알림에서만 값 있음(targetId=feedId). true면 소셜 피드와 동일 '축하 완료'   |
| 데스크톱 팝오버 | 헤더 벨 아래 앵커되는 알림 목록 오버레이. `widgets/notification`                           |
| 모바일 알림 페이지 | `/notifications` 라우트. 뒤로가기 + "알림" 타이틀 + 날짜 그룹 + 카드 목록                |
| 세션 팔로우 상태 | FOLLOW 토글을 클릭 후 유지하는 로컬 상태(FIX-044 패턴). 인박스 재조회 시 리셋             |

---

## 기술 결정 (ADR)

### ADR-1. 데스크톱 팝오버 구현 수단

**Context** — 데스크톱 알림은 **헤더 벨(고정 `z-50` 바 안의 고정 요소) 바로 아래**에 앵커되는
팝오버다. 앵커가 화면에 고정돼 있어 floating-ui류의 충돌 계산·동적 재배치가 필요 없다. 단일
사용처이며, `shared/ui`에 popover 프리미티브가 없다.

**Decision** — **직접 구현한다**(의존성 추가 없음). 벨 래퍼에 `relative`, 팝오버에
`absolute right-0 top-full`로 배치한다(Portal 불필요 — 헤더 stacking context 상속). 외부 클릭 닫기와
Esc 닫기, 닫힐 때 트리거(벨)로 포커스 복귀만 직접 처리한다. 단일 사용처이므로 `shared/ui` 프리미티브로
일반화하지 않고 `widgets/notification` 안에 둔다(두 번째 사용처가 생기면 승격).

**Alternatives**

| 안                        | 내용                               | 거부 이유                                                                 |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `@radix-ui/react-popover` | Radix 팝오버 도입                  | 앵커가 고정이라 Radix의 충돌·재배치 이점이 거의 없는데 단일 사용처에 런타임 의존성을 추가함 |
| 기존 `Modal` 재사용       | 중앙 Dialog로 데스크톱도 처리      | 시안의 "벨 아래 앵커" 위치와 불일치 — 화면 중앙에 뜸                      |

**Consequences** — 외부 클릭·Esc·포커스 복귀를 직접 구현·유지해야 한다(작은 로컬 훅). **알림 목록
항목은 링크·버튼이라 열렸을 때 Tab 순회가 팝오버를 벗어날 수 있다(완전한 focus-trap은 범위에서
제외) — 접근성 상한으로 명시하고, 필요해지면 보강한다.** Esc·외부 클릭·포커스 복귀는 보장한다.
모바일은 팝오버를 쓰지 않으므로 셸만 분기(목록·항목·액션은 공유).

### ADR-2. 알림 도메인 배치 + 액션 조립

**Context** — 알림 항목은 타입마다 액션이 다르다(맞팔로우/축하/이동/없음). entity UI는 표시
전용이어야 하고(`fsd-entities.md` §3), 라우팅·mutation은 상위가 가진다(`fsd-widgets.md` §6).

**Decision** — `entities/notification`은 **표시 전용** `NotificationItem`(아바타/아이콘 + 헤드라인 +
subText + timeAgo + `action` 슬롯)과 조회 훅·파생 타입만 갖는다. actionType → 액션 노드 매핑은
데스크톱 팝오버(widget)와 모바일 페이지(page)가 **공유 조립 함수/컴포넌트**로 수행하고, 각 액션은
feature(맞팔로우·축하) 또는 `<Link>`(이동)로 주입한다.

**Alternatives**

| 안                                  | 내용                                   | 거부 이유                                                  |
| ----------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| entity가 actionType 보고 직접 렌더  | NotificationItem 안에서 버튼·라우팅     | entity가 동작·라우팅을 알게 됨(§3 위반), 재사용성 저하     |
| 타입별 항목 컴포넌트 N개            | FollowNotiItem·CongratsNotiItem …      | 표시 레이아웃이 동일한데 중복. 공통 항목 + 액션 슬롯이 단순 |

**Consequences** — 액션 조립 로직이 widget/page 두 곳에 필요 → 공유 함수로 뽑아 중복을 막는다.
항목 UI와 액션이 분리돼 테스트가 쉬워지는 대신, "슬롯에 무엇을 넣을지"를 상위가 항상 결정해야 한다.

### ADR-3. 액션 후 클라이언트 상태(FOLLOW 토글 · 축하 동기화)

**Context** — 서버는 액션 직후의 바뀐 상태를 알려주지 않는다(인박스 재조회 전까지). FOLLOW는
`FOLLOW_BACK`↔`NONE`로 초기 상태만 주고(클릭 후 토글은 클라 몫), 축하는 소셜 피드와 **동일 feedId로
동기화**되어야 한다(알림함/피드 어디서 눌러도 '축하 완료'). FIX-044에서 같은 문제를 다뤘다.

**Decision** —
1. **FOLLOW 토글**: 알림 표면이 세션 로컬 팔로우 상태를 들고, 초기값은 actionType(FOLLOW_BACK=미팔로우,
   NONE=팔로우중)에서 파생. 맞팔로우/팔로우취소 클릭 시 로컬 토글, 인박스 재조회(dataUpdatedAt 변경)
   시 리셋. FIX-044의 `use-session-follow-state`를 **`shared/lib`로 승격**해 공유한다(2번째 사용처).
2. **축하 동기화**: 알림 축하 훅이 성공 시 **인박스 캐시의 해당 항목**(targetId=feedId)의
   `congratulated=true`와 **friend-feed 캐시의 동일 feedId** 항목을 함께 `setQueryData`로 갱신
   (refetch 없이). `useCongratulate`(피드)와 대칭.

**Alternatives**

| 안                          | 내용                               | 거부 이유                                                       |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| 전역 Zustand 공유 상태      | 팔로우/축하 상태를 app 수명 store  | 수명이 "인박스 세션"인데 store는 app 수명 → 리셋 로직 별도 필요 |
| 액션 후 active refetch      | 인박스·피드를 즉시 재조회          | 목록 reflow·불필요 왕복. FIX-044에서 이미 거부한 접근          |

**Consequences** — 알림 축하 훅이 두 캐시(인박스·피드)를 알아야 하는 약한 결합이 생긴다. feedId
매칭 로직이 피드 축하 훅과 유사해 중복 가능(공통화는 반복이 확인되면). 로컬 팔로우 상태는 서버가
토글 상태를 안 주는 데서 오는 임시 우회다(서버 제공 시 제거).

---

## 시안

Figma (New Gravit, fileKey `hu4c6qCEMB62qHXk2v8Gsl`):

- 모바일: `13750-54846` `13750-54856` `13750-54866` `13750-54884` `13750-54875` `13750-54835`
- 데스크톱: `13750-69839` `13750-69852` `13750-69860` `13750-69873` `13750-69837` `13750-69404`

> 구현(ai-orchestrate) 시 **반드시 노드별 `get_design_context` 4단계**(받기 → 작성 → 재호출 1:1 표
> 대조 → 불일치 수정 → 최종 diff 표)로 padding·gap·font-size·radius·color·shadow를 토큰으로 반영한다.
> 근삿값 매핑 금지.

### 확인 필요

- **버튼 카피 확정**: `GO_TO_NOTICE`="공지 보러가기", `GO_TO_INQUIRY`="문의 보러가기"로 제안.
  시안 일부 카드가 "학습하러 가기"로 표기돼 있으나 actionType SoT 원칙상 actionType별 카피를 쓴다.
  구현 시 `get_design_context`로 정확한 카피를 재확인한다.
- **알림 아이콘/아바타 규칙**: FOLLOW는 actor 아바타, 비-FOLLOW 타입의 좌측 아이콘(연속학습·공지·리그
  등)은 타입별 아이콘이 필요한지 시안에서 확정(get_design_context).
- **리그 승급 알림의 실제 actionType**: 백엔드가 어떤 값을 주는지 미확정. actionType대로 처리하되
  확인되면 기록.

### 결정된 것 (리뷰 후속)

- **빈 상태/Fallback UI**: 사용자 직접 구현(HOLD). → Out of Scope.
- **모바일 진입점**: 마이그래빗 `ProfileCard`의 모바일 **알림 버튼**(설정 버튼 옆, 이미 존재하는
  `aria-label="알림"` 벨)을 `/notifications`로 연결한다. (`pages/my/ui/profile-card.tsx`)
- **세션 팔로우 상태 훅**: `shared/lib`로 승격한다(FIX-044의 `use-session-follow-state` 2번째 사용처).

---

## 확정 명세 · 검증 기준

> 이슈별 AC는 `issues.md`에 둔다. 아래는 work task 전체의 핵심 계약.

- [x] **AC-공통-1** (범위: 단위) actionType 매핑: `FOLLOW_BACK`→맞팔로우, `CONGRATULATE`→축하,
      `GO_TO_LEARNING/NOTICE/INQUIRY`→해당 경로, FOLLOW+`NONE`→팔로우취소, 그 외 `NONE`→버튼 없음
- [x] **AC-공통-2** (범위: 통합) 데스크톱 벨 클릭 → 팝오버에 알림 목록 표시, 외부 클릭/ESC로 닫힘
- [x] **AC-공통-3** (범위: 통합) 모바일 `/notifications` 진입 → 날짜 그룹 + 카드 목록 표시
- [x] **AC-공통-4** (범위: 통합) 빈 목록(`[]`)이어도 크래시 없이 항목 0개를 렌더한다(빈 상태 비주얼은 사용자 소유 — Out of Scope)

---

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-10-05 | 작업 생성. 요구사항·ADR 3건 확정 | 알림 인박스 신규 기능. 데스크톱 팝오버/모바일 페이지 반응형, actionType SoT, FOLLOW 토글·축하 동기화 | — |
| 2026-10-05 | 결정: FOLLOW 이미 팔로우 중=시안 따라 "팔로우 취소" 토글 / 읽음·뱃지 범위 제외 / actionType 없는 버튼 무시 | spec↔시안 충돌 해소(사용자 판정) | — |
| 2026-10-05 | ADR-1 직접 구현으로 변경(의존성 0) | 벨 고정 앵커라 Radix 이점 없음, 단일 사용처 | ADR-1 |
| 2026-10-05 | 리뷰 후속 결정: Fallback UI 사용자 소유(HOLD) / 모바일 진입점=ProfileCard 알림 버튼 / 세션 팔로우 훅 shared 승격 | issue-reviewer 권고 반영 | Issue 1·2·3 |
| 2026-10-07 | 구현·검증 완료(4단계). 데스크톱 `/notifications` 접근은 `friends.tsx` 방식으로 차단(모바일 전용) | ai-orchestrate/ai-validate. 알림은 모바일 페이지·데스크톱 팝오버로 분리 | #266, checklist.md |
| 2026-10-07 | **ADR-3 변경**: FOLLOW 토글을 세션 로컬 set → 인박스 캐시 직접 갱신(setQueryData)으로 전환 | 초기 상태 혼재 + 로컬 state만으론 팝오버 재오픈·재진입 시 stale. 축하와 동일 캐시 패턴으로 통일 | ADR-3, checklist.md |
