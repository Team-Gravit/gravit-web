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

## ⚠️ 작업 지침 (사용자 원 지시 — 모든 Phase에 적용, 요약·변형 금지)

> 이 섹션은 사용자가 작업 착수 시 준 표준 지시다. Phase 3·4·5도 동일하게 따른다.
> compact로 대화가 요약돼도 이 파일이 기준이다.

**이전 원칙**

- legacy-web의 마이페이지를 `apps/web`으로 **그대로** 옮긴다. 한 섹션씩 차례대로.
- 섹션 이전 전에 **공통 요소(profile-card·레이아웃 구조·섹션 탭 등) 설계부터 검토**하고 옮긴다.
- **잘 설계돼 있으면(리팩터링·rules 위배 없이 탄탄하면) 아무런 수정·추가 없이 파일만 옮긴다.**
  모든 코드 수정·추가는 **신규 web 파일로 이동한 뒤** 작업한다.
- 설계가 잘 돼 있어도 **Figma 시안과 다르면**(margin·padding·gap·타이포 토큰·색상 토큰 등)
  **그 부분은 수정한다.**

**이전 시 항상 보는 4가지 관점**

1. 컴포넌트가 적절하게 분리되어 있나
2. 클린 아키텍처 관점에서 잘 설계됐나 (단일 책임 원칙 등)
3. FSD 구조에 위배되지 않게 구축됐나 — 이전 과정에서 rules를 지켜 탄탄하게 설계됐나
4. 유지보수성 및 추상화가 잘 되어 있나

**Figma 시안 대조·검토 프로세스 (엄수)**

- 시안 node를 **함부로 스킵하거나 대충 읽어 대조·검토하지 않는다.**
- 절차:
  1. `get_design_context`로 노드 데이터를 받는다
  2. 대조·검토 또는 코드 작업을 한다
  3. 작업이 끝나면 `get_design_context`를 **다시 호출**해서 각 하위 요소의
     **padding · gap · font-size · border-radius · color · shadow** 값을 **내가 쓴 코드와 1:1 표로 비교**한다
  4. 불일치 값은 그대로 코드 수정
- 참고: https://heedymy.tistory.com/87

**Figma 노드 링크 (Phase별)**

- 공통 ProfileCard: web `13750-68435` / mobile `13750-54490`
- 공통 섹션 탭: web `13750-54260` / mobile `13750-68436`
- 요약: web `13750-68430` / mobile `13750-54255`
- 학습: web `13750-68877` / mobile `13784-18845` · Fallback web `13784-35365` / mobile `13750-54662`
- 리그: web `13750-69138` / mobile `13750-54729` · Fallback web `13750-69887` / mobile `13750-54932`
- 소셜: web `13750-69197` / mobile `13750-54789` · 팔로우/팔로잉 모달(web) `13750-69348` / 페이지(mobile) `13750-54965`
- fileKey: `hu4c6qCEMB62qHXk2v8Gsl`

---

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

### Phase 2 상세 범위 (요약 탭)

한 브랜치·PR로 진행(#227). SummaryCard와 StudyHeatmap을 나누지 않는다.

- **shared/ui 프리미티브 이전**: `card`, `scroll`(radix-scroll-area), `calendar-heatmap`(9파일)
- **연도 Dropdown**: `@radix-ui/react-select` 기반 신규 구현(legacy floating-ui dropdown 미이전 — ADR 참고)
- **entities/learning 신설**: `lib/transform-learning-history`
- **어댑터**: `useMyPageSummary`, `useMyPageLearningHistory`
- **pages/my**: `summary-card`, `study-heatmap`, 요약 탭 조립
- **라우트**: `my/summary.tsx` 스텁 → 실제

#### Phase 2 현행 동작 기준선 (legacy)

| #   | 동작                                                                                           | 위치 (legacy)                                    |
| --- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| S1  | `useGetMyPageSummary()` 로딩·에러면 아무것도 렌더 안 함, 성공 시 SummaryCard + StudyHeatmap    | `.../my/_profile-layout/summary.tsx`             |
| S2  | SummaryCard: 학습률 상위%·완료레슨(완료/전체)·총 학습시간h·평균 정답률% 4지표                  | `widgets/my-page/summary/summary-card.tsx`       |
| S3  | SummaryCard 모바일: 상단에 왕관+상위N%+"전체 학습 순위" 블록, 지표는 3개(학습률 상위 숨김)      | 〃                                               |
| S4  | StudyHeatmap: 연도 dropdown(옵션 2개↑일 때만) + 캘린더 히트맵 + 색상 범례 + "주로 N시에 학습"  | `widgets/my-page/summary/study-heatmap.tsx`      |
| S5  | 히트맵: 연초~오늘 일별 solvedLessonCount → 5단계 색, 가로 스크롤, 월/주 라벨                    | `shared/ui/calendar-heatmap/*`                   |
| S6  | 연도 변경 시 `useGetMyPageLearningHistory({year})` 재조회                                       | study-heatmap.tsx                                |

### Phase 2 시안 대조 결과 (design-diff, 2026-09-12)

> 요약 web `13750-68430` / mobile `13750-54255`. 토큰: `bg/0`→`bg-0`(white), `bg/1`→`bg-1`(#f8f8f8),
> `bg/2`→`bg-2`, `bg/3`·`divider/1`→`#dcdcdc`, `text/1`→`text-1`, `text/3`→`text-3`, `text/4`·`on-color-3`→`text-4`(#a8a8a8),
> `brand/Main/1`→`main`(#ba00ff), purple 200/300/500/700, Title1(32) Title3(24) Heading2/lg(20) Body1/sm(16) 3xs(12).

#### SummaryCard (통계 4지표)

| #   | 항목                | 현행(legacy)                    | 시안                              | 판정                          |
| --- | ------------------- | ------------------------------- | --------------------------------- | ----------------------------- |
| C1  | 카드 컨테이너       | `Card`(bg-white rounded-lg/xl)  | bg-white `rounded-12` border `rgba(251,241,255,0.6)` shadow elevation | 고침 → rounded-12, 보더/shadow |
| C2  | 데스크톱 패딩       | `md:p-5`                        | `py-32`(px는 지표 flex)           | 고침 → py-8(32)               |
| C3  | 지표 값 타이포      | `md:text-title1`                | Title1 32px Bold #242424          | 유지(title1)                  |
| C4  | 지표 라벨           | `text-text-4`                   | 16px #a8a8a8 (text-4)             | 유지                          |
| C5  | 완료레슨 서브값     | `md:text-title3 text-text-4`    | 24px #a8a8a8                      | 유지(title3)                  |
| C6  | 지표 구분선         | `border-l border-gray-300`      | 세로 divider #dcdcdc h-71         | 유지(divider-1)               |
| C7  | 모바일 상위% 블록   | 왕관+상위N%+전체 학습 순위      | 왕관40 / "상위 4%" 24px **main #ba00ff** / "전체 학습 순위" 12px text-4 | 고침 → main색·크기 정정 |
| C8  | 모바일 카드 배경    | `bg-purple-50`(왕관칸)          | 왕관 배경 확인 필요                | 확인 필요                     |

#### StudyHeatmap (학습 기록)

| #   | 항목                | 현행(legacy)                        | 시안                                    | 판정                          |
| --- | ------------------- | ----------------------------------- | --------------------------------------- | ----------------------------- |
| H1  | 카드                | `Card md:px-8 md:py-7 gap-4`        | bg-white `rounded-12` `px-32 py-28 gap-16` shadow elevation/1 | 고침 → gap-16, shadow |
| H2  | 헤더 "학습 기록"    | `text-body1-reading text-text-4`   | web 16px / mobile "학습기록" 13px, #a8a8a8 | 유지(text-4)               |
| H3  | 연도 select         | floating-ui Dropdown                | `w-150 border #dcdcdc rounded-4 px-12 py-8` 값16px #242424 + chevron24 | **재구현(Radix Select)** ADR-1 |
| H4  | select 드롭 목록    | `rounded-xl` 아이템 `min-h-14`      | `bg-0 rounded-12 shadow elev/2 px-6 py-8` 아이템 `p-16 border-b divider-1` | 고침 → 시안값 |
| H5  | 구분선              | `bg-divider-1 h-[1px]`             | line #dcdcdc                            | 유지                          |
| H6  | **히트맵 셀 색**    | `[bg-1, p200, p300, p500, p700]`   | `[gray-300(#dcdcdc), p200, p300, p500, p700]` | **고침 → 첫 단계 bg-1→gray-300** |
| H7  | 히트맵 셀           | `size 12/16 gap 4/4.5 rounded`     | web size-16 gap-5 rounded-4             | 대체로 일치(gap 미세)         |
| H8  | 월 라벨             | 상단 월 라벨                        | `px-53` 1~12월 16px #a8a8a8             | 유지                          |
| H9  | 요일 라벨           | MON/WED/Fri                         | gap-18 16px #a8a8a8                     | 유지                          |
| H10 | 범례                | 적음/많음 + 5색                     | web "적음/많음" **20px SB #6d6d6d** 셀16 gap8 / mobile 12px | 고침 → 크기 |
| H11 | peak 안내           | `rounded-sm/lg border-bg-3 caption1`| `border #dcdcdc rounded-8 px-24 py-16` web 16px / mobile `rounded-4 p-12` 12px #6d6d6d | 고침 → rounded/패딩 |

### 확인 필요 (Phase 2 시안)

- **C8 모바일 왕관 배경**: legacy `bg-purple-50`. 시안에서 왕관 아이콘 배경색 미확정(에셋 이미지) → 구현 시 시안 재확인.
- **H1 카드 shadow(elevation)**: (판정됨 2026-09-12) 디자인 시스템 `13284-5409`에 elevation 5단계가 정식 정의됨.
  `tokens.css`에 `--shadow-elevation-1~4` + `effect/glass-modal` 도입하고 **역할별 레벨 고정**으로 적용한다.
  - `elevation-1`(`0 1px 2px -1px #0000000f, 0 1px 3px 0 #0000001a`) = **카드·리스트·배너** → SummaryCard·히트맵 카드
  - `elevation-2`(`0 2px 4px -2px #0000000f, 0 4px 8px -2px #0000001a`) = **드롭다운·셀렉트** → 연도 Select 목록
  - elevation-3=모달, 4=긴급, glass-modal=축하모달 (이번 미사용, 토큰만 정의)
  - Don't: raw 그림자 하드코딩 금지, 한 화면 2층까지. `docs/design-system`·stories에 반영.
- **H6 히트맵 첫 색**: legacy가 `bg-1`(#f8f8f8)인데 시안은 `gray-300`(#dcdcdc). "학습 없음" 칸이 더 진해짐 →
  시안 기준으로 `gray-300`. (SoT=Figma)

### API 스키마 차이 (해소됨 2026-09-12)

- legacy는 `useGetMyPageSummary()`가 `{ learningSummary, years }`를 반환했으나, 현재 apps/web
  OpenAPI에서는 필드 위치가 다르다 — **임의 결정 사안 아님, 위치만 이동**:
  - `GET /api/v1/my-pages/learning/summaries` → `LearningSummaryResponse`(flat 5필드) = SummaryCard 데이터
  - `GET /api/v1/my-pages/learning/history?year=` → `LearningHistoryResponse { dailySolvedCounts, peakLearningHour, years }`
    = StudyHeatmap 데이터. **연도 목록 `years`는 여기 있다.**
- 따라서 SummaryCard는 `useMyPageSummary`, StudyHeatmap은 `useMyPageLearningHistory`를 각각 쓰고,
  연도 dropdown은 history 응답의 `years`로 채운다.

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

### 결정 (Phase 5 소셜, 2026-09-23) — 토스트: sonner 대신 직접 구현

축하 한도(`SOCIAL_4001`) 안내용 공용 토스트가 필요했고(`unit-detail`에 공용 토스트 대기 alert(FEAT-017)도 있음), **sonner 도입 대신 `shared/ui/toast`에 직접 구현**하기로 결정.

구현: `toast-store.ts`(Zustand 단일 토스트) · `toast.ts`(`toast(message, {position,duration})`, 컴포넌트 밖 호출) · `toaster.tsx`(포털·`aria-live`·enter/exit·자동소멸) · `<Toaster/>`는 `main.tsx`에 1회 마운트.

근거:

1. sonner의 핵심 가치(다중 스택·스와이프·promise/loading·다방향 위치·hover 정지)를 우리 요구(단일·스택 없음·상태색/아이콘 없음)에서 **안 씀**
2. 우리가 필요한 부분(컴포넌트 밖 호출·자동소멸·`aria-live`·enter/exit)은 store+포털 ~100줄. sonner를 써도 커스텀 렌더러는 어차피 직접 짜야 함
3. 시안이 다크 필 + 우리 토큰(`bg-text-1`·`rounded-6/8`·`text-headline1`)이라 sonner 기본 테마를 대량 override하며 싸우게 됨. 직접 구현은 `cn()`·cva·토큰 규칙을 처음부터 지킴
4. `component-convention.md` §3: 완성형 UI 라이브러리를 컴포넌트 하나 때문에 추가하지 않는다. 토스트는 비상호작용 알림이라 접근성 난이도가 `aria-live` 하나
5. FEAT-017 대기 수요 — 투기적 컴포넌트가 아니라 공유 인프라

**재검토 신호**: 다중 스택·스와이프·promise/loading·다방향 위치+상태색(error/success/info)이 실수요가 되면 그때 sonner 재검토(지금은 YAGNI).

### 결정 (Phase 5 소셜, 2026-09-23) — 추천 팔로우 버튼: shared Button 2개로 반응형 분기

추천 친구 팔로우 버튼(`features/friend-recommend-follow/ui/recommend-follow-button.tsx`)이 브레이크포인트마다 **다른 종류**의 버튼이라(모바일: cta 채움·아이콘 없음 = `default` / 데스크톱: 흰 배경·cta 테두리·add 아이콘 = `stroke-default`), **shared Button 2개를 `md:hidden`·`hidden md:flex`로 분기**해 렌더한다. 둘 다 같은 mutation(`useFollowRecommendedUser`, 1회 호출)을 공유한다.

왜 1개로 안 되나:

- variant 는 cva 정적 클래스라 `md:` 를 런타임에 못 붙임(`component-convention.md` §5). JS 뷰포트 분기는 CSS로 되는 걸 JS로 끌고 오고 FOUC 위험(`fsd-pages.md` 반응형 CSS 우선)
- `variant` + className 으로 색을 override 하면 cva 가 소유한 hover/active/disabled 시각 상태와 충돌(`className-convention.md` §5 금지)
- native `<button>` 은 공용 컴포넌트 회피 + 아이콘·disabled·포커스 링 재구현 ([[feedback-prefer-shared-button-over-native]])

비용은 마크업 약간의 중복. `display:none` 쪽은 스크린리더가 무시해 접근성 문제 없음.

**재검토 신호**: "채움↔테두리+아이콘"처럼 반응형으로 갈리는 버튼이 더 나오면 Button 에 반응형 variant 정식 지원을 검토(지금 하나 때문에 미리 만들지 않음).

**미세차 유지**: 데스크톱 버튼 테두리·글자색은 `stroke-default`의 `main`(#BA00FF)이고 Figma 는 `cta`(#9b00cf) — 공용 variant 재사용 원칙에 따라 유지. 정확히 맞추려면 Button 에 cta 계열 stroke variant 추가 필요(별도 판단).

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
| 2026-09-23 | 토스트 sonner 대신 직접 구현 결정 | Phase 5 축하 한도 안내용 공용 토스트. 단일 토스트 요구 + 다크 필 시안이라 라이브러리 override 비용이 큼. 상세는 「결정 (Phase 5 소셜)」 | `shared/ui/toast/*`, `main.tsx` |
| 2026-09-23 | 추천 팔로우 버튼 shared Button 2개로 반응형 분기 | 모바일(채운 CTA)·데스크톱(테두리+아이콘)이 다른 variant라 단일 Button으로 표현 불가. cva override·JS 뷰포트 분기 회피. 상세는 「결정 (Phase 5 소셜)」 | `features/friend-recommend-follow/ui/recommend-follow-button.tsx` |
| 2026-09-23 | Phase 5 소셜 탭 구현 완료 | 팔로우/팔로잉(조회·모달·`/friends`·팔로우/언팔), 친구 활동 피드(무한스크롤·축하·한도 토스트), 추천 친구(즉시 제거 팔로우). 소셜 3섹션 Figma 대조 완료. 공용 토스트 신규(`shared/ui/toast`). 팔로우 시 추천 캐시 setQueryData 제거로 동기화 | `entities/{follow,friend-feed,friend-recommendation}`, `features/{follow,friend-feed-congratulate,friend-recommend-follow}`, `widgets/social/*`, `pages/friends`, `pages/my/ui/social-tab.tsx`, `shared/ui/toast` |
| 2026-09-23 | 부수: 페이지 시맨틱 태그 · 리그 헤더 여백 · tier-icon 번들 최적화 | my/league/friends `<main>`, 탭 패널 `<section>`. 리그 overlay 헤더 콘텐츠 겹침 → pt 보정. tier-icon 15개 SVG를 `?react`→`?url`(`<img>`)로 전환해 516KB JS 청크 제거 | `pages/my/*`, `pages/league`, `pages/friends`, `entities/league/ui/tier-icon.tsx` |
