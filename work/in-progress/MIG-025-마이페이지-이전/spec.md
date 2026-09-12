---
id: 'MIG-025'
title: '마이페이지 이전'
type: 'migrate'
screen: 'my'
priority: 'medium'
created: '2026-09-12'
revised: '2026-09-12'
---

# MIG-025 — 마이페이지 이전

## 배경 · 목표

legacy-web의 마이페이지를 `apps/web`으로 FSD 구조에 맞춰 이전한다. 마이페이지는 요약·학습·리그·소셜
4개 탭으로 구성되며, 전 탭이 공유하는 **프로필 카드 + 섹션 탭 + 레이아웃**을 먼저 설계·이전한 뒤
탭을 하나씩 옮긴다.

## 범위

5단계로 나눠 진행한다.

1. **레이아웃 구조 + 공통 컴포넌트** (이 단계) — 프로필 레이아웃 라우트, ProfileCard, 섹션 탭, 탭 프리미티브
2. 요약 탭
3. 학습 탭
4. 리그 탭
5. 소셜 탭

### Phase 1 상세 범위

- 라우트: `_app-shell/my` 를 중첩 레이아웃으로 재구성(`route.tsx` + `index.tsx` 리다이렉트 + 4개 탭 자리)
- 공통 컴포넌트: 프로필 배너 카드, 마이페이지 섹션 탭
- `shared/ui/tab` 프리미티브 이전

## Out of Scope

- 각 탭(요약/학습/리그/소셜)의 실제 내용 — Phase 2~5
- 프로필 편집 모달·편집 페이지, 설정 페이지 (별도 판단 — 아래 확인 필요)
- 다국어(i18n) — 정책상 도입하지 않음

## 용어 정의

| 용어         | 정의                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| 프로필 카드  | 마이페이지 상단 배너(아바타·닉네임·핸들·레벨/리그/연속학습 라벨·액션)   |
| 섹션 탭      | 요약/학습/리그/소셜 4개 링크 탭                                         |
| 프로필 레이아웃 | 카드 + 탭 + 하위 탭 콘텐츠(`Outlet`)를 감싸는 레이아웃 라우트          |

---

## 현행 동작 기준선 (Phase 1)

| #   | 동작                                                                                                                | 확인한 위치 (legacy)                              |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | `/my/` 진입 시 `/my/summary`로 리다이렉트                                                                          | `pages/_authenticated/my/index.tsx`               |
| 2   | 프로필 레이아웃: 데스크톱만 solid 헤더, 모바일 바텀탭. 카드→탭→Outlet 순, 데스크톱 상단 여백 `HEADER_HEIGHT+40`     | `.../my/_profile-layout/route.tsx`                |
| 3   | 카드 데이터는 `useGetMyPageBanner()` (있을 때만 렌더)                                                               | 〃                                                |
| 4   | 카드: 배너 배경 + 오버레이(모바일 black/40·데스크톱 좌측 그라데이션), 아바타(색), 닉네임, `@handle`                 | `widgets/user/ui/user-profile-card.tsx`           |
| 5   | 카드 라벨: `LV.{level}` / `{currentLeague}` / `{consecutiveSolvedDays}일 연속 학습중`(데스크톱만)                   | 〃                                                |
| 6   | 카드 액션: 프로필 수정(데스크톱→모달, 모바일→`/my/edit`), 설정 링크(`/settings`)                                   | 〃                                                |
| 7   | 섹션 탭 4개: 요약`/my/summary`·학습`/my/learning`·리그`/my/league`·소셜`/my/social`, 활성 정확 매칭               | `widgets/user/ui/user-tabs.tsx`                   |
| 8   | 탭 프리미티브: 컴파운드 `Tabs`/`Tabs.Tab`, 활성 `primitive-purple-700` 배경, 링크/버튼 판별 유니온                 | `shared/ui/tab/tab.tsx`                           |

## apps/web 현재 상태 (재사용 대상)

- **앱셸 존재**: `_authenticated/_app-shell/route.tsx` 가 헤더·바텀탭·스크롤 컨테이너(헤더 offset)를 이미 제공
  → legacy `PageLayout`/`Header`/`BottomTab` 재구현 불필요. my 레이아웃은 **셸 안에 카드+탭만** 추가한다.
- `_app-shell/my.tsx` — `MyPage` 스텁(`headerVariant: 'solid'`). 중첩 라우트로 교체 필요.
- `entities/user` — `ProfileAvatar`, `getProfileColor`, 레벨/닉네임 유틸, `useUser` 존재.
- 아이콘 시스템에 `settings` 아이콘 존재.
- 탭 프리미티브 없음 → legacy `shared/ui/tab` 이전 필요.

## 시안 대조 결과 (design-diff)

> Figma fileKey `hu4c6qCEMB62qHXk2v8Gsl`. 노드 라벨과 실제가 바뀌어 있어 컴포넌트 state(W/M)로 판별.
> 섹션탭 W=`13750-68436`, M=`13750-54260` / 카드 W=`13750-68435`, M=`13750-54490`.
> 토큰 매핑: `bg/1`→`bg-bg-1`, `brand/Main/2`·`cta/default`(#9b00cf)→`bg-cta`, `text/3`→`text-text-3`,
> `text/on-color-1`→`text-text-1-w`, `gray/400`(#c6c6c6)→`text-semantic-info`, `gray/50`(#fbfbfb)→`cta-text`,
> `cta/secondary-default`(#dcdcdc)→Button `secondary`.

### 섹션 탭

| #   | 항목                | 현행(legacy Tabs)              | 시안(Figma)                  | 판정                       |
| --- | ------------------- | ------------------------------ | ---------------------------- | -------------------------- |
| T1  | 컨테이너 배경       | `bg-text-1-w`(흰색)            | `bg/1` #f8f8f8               | 고침 → `bg-bg-1`           |
| T2  | 컨테이너 radius     | `rounded-lg md:rounded-xl`(없는 토큰) | 8 / 12                | 고침 → `rounded-8 md:rounded-12` |
| T3  | 활성 배경           | `bg-[var(--primitive-purple-700)]`(primitive) | #9b00cf     | 고침 → `bg-cta` (동색 정식토큰) |
| T4  | 탭 세로 패딩        | `py-2.5`(10) md:`py-4`(16)     | 8 / 16                      | 고침 → `py-2 md:py-4`      |
| T5  | 탭 radius           | `rounded-sm md:rounded-lg`(없는 토큰) | 4 / 8                 | 고침 → `rounded-4 md:rounded-8` |
| T6  | 탭 가로 패딩        | 없음                          | px 10 (양쪽)                | 고침 → `px-2.5`            |
| T7  | 모바일 탭 높이      | 없음(내용 높이)               | h 36                        | 고침 → `h-9 md:h-auto`     |
| T8  | 컨테이너 그림자     | 없음                          | drop-shadow 0 4 16 /0.02    | **확인 필요**(§6 shadow 토큰 미정) |
| T9  | 타이포              | `text-label1 md:text-heading2` | Label1(14)/Heading2(20)     | 유지(일치)                 |
| T10 | 활성/비활성 문자색  | `text-text-1-w` / `text-text-3` | white / #6d6d6d            | 유지(일치)                 |

### 프로필 카드

| #   | 항목                  | 현행(legacy)                       | 시안(Figma)                     | 판정                          |
| --- | --------------------- | ---------------------------------- | ------------------------------- | ----------------------------- |
| P1  | 데스크톱 닉네임       | `md:display2`(36)                 | Display1(40)                    | 고침 → `md:text-display1`     |
| P2  | 모바일 핸들 타이포    | `body2-normal text-sm`(14)        | Label2(13)                      | 고침 → `text-label2`          |
| P3  | 데스크톱 편집버튼 문구 | "프로필 수정"                     | "프로필 편집"                   | 고침 → "프로필 편집"          |
| P4  | 데스크톱 라벨 radius  | `rounded-lg`(없는 토큰)           | 8                               | 고침 → `rounded-8`            |
| P5  | 모바일 우상단 알림 아이콘 | 없음                           | notification-button(size 24)    | 고침 → `Icon name="bell" size={24}` 시각만(동작 보류) |
| P6  | 카드 radius(데스크톱) | `md:rounded-xl`(없는 토큰)        | 12                              | 고침 → `md:rounded-12`        |
| P7  | 아바타                | `profile2.svg`+`getProfileColor`  | 색원+로고, 70/140               | 고침 → `entities/user` `ProfileAvatar` 재사용 |
| P8  | 핸들/라벨 색          | `semantic-info` / `cta-text`      | gray/400 / gray/50              | 유지(일치)                    |
| P9  | 모바일 편집버튼       | `variant secondary`               | #dcdcdc bg / #6d6d6d text       | 유지(일치, Button `secondary`) |
| P10 | 데스크톱 오버레이     | `bg-linear-to-l` #1D0027 계열     | to-r transparent→#1D0027/60 @77% | 고침 → 시안 방향/스톱        |
| P11 | 데스크톱 카드 패딩    | `md:p-8`(32) / `md:rounded-xl`    | p 32 / rounded 12               | 유지(패딩 일치, radius는 P6)  |

### 확인 필요

- **P5 모바일 알림 아이콘**: (판정됨 2026-09-12) 시각만 렌더(`Icon name="bell"`), 클릭 동작은 알림 기능 신설 시 연결.
- **T8 탭 그림자**: (판정됨) `design-source-policy §6`상 shadow 토큰 미확정 → 보류(적용 안 함).
- **설정·편집·알림 액션**: Phase 1은 시각 요소만. `/settings`·`/my/edit`·알림 라우트 미존재 → 링크 대신 마커 처리, 별도 항목에서 연결.
- **display1 letter-spacing 부호**: (해소됨 2026-09-12) `tokens.css`의 `--text-display1--letter-spacing`를 `0.6px`→`-0.6px`로 수정(사용자 직접). Figma(-0.6)·다른 타이포와 일치. `text-display1` 그대로 사용.

### 결정 (GATE 1, 2026-09-12)

- **컴포넌트 배치**: ProfileCard·섹션 탭은 마이페이지 전용이므로 `pages/my/ui/`에 co-locate. 탭 프리미티브만 `shared/ui/tab`. (fsd-widgets §1)
- **편집·설정 범위**: 프로필 편집 모달·편집 페이지·설정 페이지는 **별도 MIG 항목**으로 분리. Phase 1은 카드 시각 + 탭 + 레이아웃까지만. 카드의 편집/설정 액션은 대상 라우트가 아직 없으므로 연결을 보류(마커)하고, 시각 요소는 시안대로 렌더한다.

### 확인 필요

- design-diff 단계에서 채운다.

---

## 확정 명세 · 검증 기준

> design-diff + GATE 이후 작성.

## Changelog

| 날짜       | 요약                          | 사유          | 연관 항목 |
| ---------- | ----------------------------- | ------------- | --------- |
| 2026-09-12 | 작업 생성 · Phase 1 기준선 기록 | 마이페이지 이전 착수 | MIG-025   |
| 2026-09-12 | 앱셸 캔버스 배경 `bg-bg-2` 소유로 이전 | 고정 헤더 뒤 영역에 배경이 없어 흰/회색 seam 발생(각 페이지가 배경을 따로 칠하던 구조). 셸이 캔버스 배경을 소유하도록 고침. my-layout 중복 배경 제거. 리그는 자체 full-bleed 배경이라 영향 없음 | `_app-shell/route.tsx`, `my-page-layout.tsx` |
