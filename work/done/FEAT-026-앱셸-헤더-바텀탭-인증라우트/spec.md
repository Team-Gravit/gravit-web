---
id: 'FEAT-026'
title: '앱 셸 — 데스크톱 헤더 · 모바일 바텀탭 · 인증 라우트'
type: 'feature'
screen: 'app-shell'
priority: 'high'
created: '2026-09-11'
revised: '2026-09-11'
---

# FEAT-026 — 앱 셸 (헤더 · 바텀탭 · 인증 라우트)

## 배경 · 목표

리그 등 인증 전용 페이지에 **데스크톱 헤더 / 모바일 바텀탭** 크롬이 빠져 있고, 인증 가드도 없다.
앱 셸(네비게이션 크롬)과 인증 라우트 구조를 도입해 ① 토큰 없는 사용자를 로그인으로 redirect,
② 데스크톱/모바일에 맞는 네비게이션을 제공, ③ 페이지별 헤더 variant를 선언적으로 적용한다.
legacy-web의 header/bottom-tab-bar 동작을 기준으로 이전하되 web 토큰·컴포넌트로 재작성한다.

## 범위

- 라우트 구조 전환: `_protected` → `_authenticated`(가드) + `_app-shell`(셸) 디렉터리형
- 위젯 신설: `widgets/header`(variant), `widgets/bottom-tab-bar`
- 엔티티 신설: `entities/user`(헤더 유저 메뉴용 프로필 조회)
- 인증 가드: `_authenticated`의 `beforeLoad`에서 토큰 없으면 `/`(로그인)로 redirect
- 기존 인증 페이지(main·onboarding·league) 새 구조로 이동, nav 탭 stub(`/learning`·`/my`) 생성

## 확정 설계 결정 (사용자 승인 완료 2026-09-11)

- **라우트 트리**
  ```
  routes/
    index.tsx / terms / privacy / restore / login.oauth2…   (public)
    _authenticated/
      route.tsx                 ← 가드: beforeLoad(!getSessionToken() → redirect '/') + <Outlet/>
      _app-shell/
        route.tsx               ← 데스크톱 <Header variant/> (hidden md:block) + 모바일 <BottomTabBar/> (md:hidden)
                                   + 콘텐츠 패딩(헤더/탭 offset) + <Outlet/>
        league.tsx              ← staticData:{ headerVariant:'overlay' }  (URL 그대로 /league)
        main.tsx                ← staticData:{ headerVariant:'solid' }
        learning.tsx / my.tsx   ← nav 탭용 stub("준비 중")
      onboarding.tsx            ← 인증 필요하나 셸 없음(전체화면)
  ```
- **셸 유무 = 레이아웃 라우트 위치**(`_app-shell` 안=셸 / 밖=없음). staticData 플래그로 하지 않는다.
- **헤더 variant = `staticData.headerVariant`** (`'overlay' | 'solid'`, 기본 `'solid'`). `_app-shell/route.tsx`가 `useMatches().at(-1)?.staticData.headerVariant ?? 'solid'`로 읽어 헤더에 전달. 타입은 `declare module`로 `StaticDataRouteOption` 확장.
- **반응형은 CSS**: 헤더 `hidden md:block`, 바텀탭 `md:hidden`.
- **헤더 유저 메뉴 포함** — 우측 프로필(닉네임·프로필색). `entities/user`가 생성 API(`profileSummaryResponse`/`myPageResponse` 계열)를 감싸 제공.
- **nav 탭**: `/main /learning /league /my` 모두 바로 렌더(타입 안전 위해 `/learning`·`/my` stub 라우트 생성).
- **가드 redirect 목적지**: `/`(로그인). 기존 `index.tsx` 패턴과 동일.
- **URL 불변**: pathless 레이아웃이라 `/league` 등 경로 변화 없음.

## Out of Scope

- `/learning`·`/my` 페이지 실제 내용(이번엔 stub만)
- 모바일 "뒤로가기 헤더" 등 추가 크롬 종류(필요 시 별도 `_back-header-layout`)
- 로그인 후 원래 페이지 복귀(redirect search param) — 후속
- 헤더/바텀탭의 legacy 스타일 100% 복제가 아니라 web 토큰 기준 재작성 + 시안 확인은 후속 design-diff

## 용어 정의

| 용어 | 정의 |
| ---- | ---- |
| 앱 셸 | 헤더(데스크톱)·바텀탭(모바일) 네비게이션 크롬 |
| `_authenticated` | 인증 가드 pathless 레이아웃 |
| `_app-shell` | 셸(헤더/탭)을 렌더하는 pathless 레이아웃 |
| 헤더 variant | `overlay`(투명 글래스)·`solid`(흰 배경) |

---

## 기술 결정 (ADR)

### 헤더 variant 전달: `staticData` (loader/initialData 아님)

**Context** — 페이지마다 헤더 색(variant)이 다르고, 셸 레이아웃이 이를 알아야 렌더한다.

**Decision** — 각 페이지 라우트의 **`staticData.headerVariant`**에 선언하고, `_app-shell` 레이아웃이 `useMatches()`로 읽는다.

**Alternatives**

| 안 | 내용 | 거부 이유 |
| --- | ---- | --------- |
| loader/initialData | 비동기 로더로 variant 전달 | 정적 UI 설정을 async로 오용, 부모가 자식 loaderData를 자기 렌더에 못 씀, 보일러플레이트 |
| variant별 레이아웃 폴더(legacy) | `_overlay-header-layout`/`_fixed-header-layout` | 페이지가 도메인이 아닌 "헤더 종류"로 묶임, variant 변경 시 파일 이동 |

**Consequences** — 페이지를 도메인 기준으로 두고 variant는 1줄로 선언·변경. 단 각 셸 페이지가 staticData를 빠뜨리면 기본값(solid)로 fallback되므로, variant 규칙을 리뷰에서 확인해야 한다.

### 셸 유무: 레이아웃 라우트 위치 (staticData 플래그 아님)

**Decision** — `_app-shell` 안=셸, 밖=없음.

**Consequences** — 셸은 실제 DOM 래퍼(헤더 offset 패딩 등)이고 셸 페이지 간 이동 시 헤더가 리마운트되지 않아 유저 정보 재요청이 없다. 셸 종류가 늘면 레이아웃 라우트를 추가한다.

---

## 라우트 구조 규칙 (팀 공유용 — 추후 의사결정 기준)

> 이 섹션은 "앞으로 라우트를 어디에 어떻게 둘지"를 팀이 일관되게 판단하기 위한 규칙이다.
> Next.js App Router의 `(group)`/레이아웃, Remix/React Router의 레이아웃 라우트와 같은 개념이며,
> TanStack Router에서 pathless 레이아웃(`_layout/`)으로 구현한다.

### 1. 3층 축으로 라우트를 분류한다

| 축 | 무엇 | 수단 |
| --- | --- | --- |
| 인증 여부 | 토큰 필요/공개 | `_authenticated/`(가드) 안 vs 밖 |
| 크롬(셸) 종류 | 헤더+탭 / 없음 / 다른 크롬 | **레이아웃 라우트 폴더 위치** |
| 헤더 표면 | overlay / solid | `staticData.headerVariant` (상속) |

- **굵은 구분(크롬 유무·종류)은 위치(레이아웃 라우트)**, **가는 구분(헤더 색)은 staticData**. 축 크기에 수단을 맞춘다.
- `staticData.headerVariant`는 가장 깊은 매치부터 거슬러 올라가 첫 값을 쓰므로 **자식이 명시 안 하면 부모 값 상속**(기본 `solid`).

### 2. 현재 트리

```
routes/
  index.tsx (로그인) · terms · privacy · restore · login.oauth2...   # 공개
  _authenticated/                    # 인증 가드(beforeLoad: 토큰 없으면 '/')
    route.tsx
    _app-shell/                      # 헤더(데스크톱)+바텀탭(모바일)
      route.tsx                      # variant 상속 + 반응형 CSS + 콘텐츠 offset
      league(overlay) · main · learning · my (solid)
    onboarding/                      # 셸 없는 전체화면
      route · index · success
```

### 3. 새 페이지를 추가할 때 판단 순서

1. **공개 페이지** → `_authenticated/` 밖(`routes/` 최상위).
2. **인증 필요 + 헤더/탭 있음** → `_app-shell/` 안. 헤더 색만 다르면 `staticData.headerVariant`.
3. **인증 필요 + 크롬 없음(전체화면)** → `_app-shell/` 밖에 배치. onboarding이 그 예시.
   - **셸 페이지의 하위인데 그 하위만 전체화면**(예: `/learning/$unitId/$lessonId` 퀴즈 풀이):
     평면 파일명 opt-out(`learning_.$...`)은 **가독성이 나빠 지양**한다. 대신 **별도 레이아웃 그룹 폴더**
     (예: `_focus/`)를 형제로 만들고 그 안에 두되 `createFileRoute` 경로로 **URL은 유지**한다.
     (Next의 `(fullscreen)` 그룹, 대규모 프로젝트 정석)
4. **다른 크롬이 필요**(예: 모바일 back-header + 데스크톱 글로벌 헤더) →
   별도 그룹을 남발하지 않고 **셸이 반응형 + staticData로 헤더를 분기**하는 방향을 우선한다.
   (같은 URL에서 데스크톱=헤더/모바일=back-header는 라우트가 아니라 셸의 반응형 책임)
   - 필요 시 `staticData`에 `mobileHeader`(`'tab' | 'back'`)·`pageTitle` 등을 확장한다.
     legacy-web에 `pageTitle` 참고 구현이 있으나, **실사용 화면이 생기는 작업에서 함께 추가**한다(YAGNI).

### 4. 반응형은 CSS 우선

- 같은 요소가 보이고/숨는 수준(헤더 `hidden md:block`, 바텀탭 `md:hidden`)은 **CSS 미디어쿼리**.
- **레이아웃/트리 자체가 완전히 다른 경우에만** `useIsWideViewport` 같은 JS 훅을 쓴다(FOUC·리렌더 회피).

---

## 확인 필요 (해소됨)

- ~~헤더 유저 메뉴 데이터 소스~~ → **기존 `entities/user`의 `useUser`(UserResponse: nickname·profileImgNumber)·`ProfileAvatar` 재사용**. 신규 생성 불필요.
- ~~바텀탭 아이콘 에셋~~ → web 아이콘 세트에 없어 **legacy 8종(home/learning/level/my × outline·fill)을 `widgets/bottom-tab-bar/ui/assets/`에 colocate**. outline=회색·fill=그라디언트라 활성 시 아이콘 교체 + 라벨 색만 변경(legacy 방식).
- 바텀탭 높이 = `--bottom-tab-height` 토큰(**60px**, Figma 기준). 셸 콘텐츠 offset과 단일 소스로 일치.

## 확정 명세 · 검증 기준

> `ai-plan` 게이트 후 작성.

## 시안 대조 결과 (design-diff · 2026-09-12)

Out of Scope였던 헤더/바텀탭 시각 대조를 이어서 수행하고 이 작업에 합쳤다.
근거 노드: 데스크톱 GNB glass `10284:16695` · solid `10288:16712` · 모바일 tab-bar `8255:19745`.

**일치** — 헤더 바 지오메트리(`px-60/py-20`·`h-72`·`px-32`·`rounded-full`·glass border), 우측 클러스터
간격·아이콘·아바타, nav 폰트(Heading2 20/SB/1.25/-0.6), 텍스트색(solid #242424 / overlay #fff).
모바일 탭 구성 4개(홈/학습/리그/마이그래빗, AI면접 없음)·아이콘 24·라벨 12px·활성 채움 아이콘.

### 데스크톱 헤더

| #   | 항목          | 시안 (Figma)                       | 판정 · 반영                                                      |
| --- | ------------- | ---------------------------------- | --------------------------------------------------------------- |
| 1   | nav 항목 수   | 5개(홈/학습/**AI면접**/리그/마이)  | **유지** — AI면접 화면·라우트 없음. 라우트 생기는 작업에서 추가  |
| 2   | nav 간격      | `gap-80`                           | **고침** → `gap-20`                                             |
| 3   | 활성 표시     | 1.5px 하단 보더                    | **고침(변형)** — solid에도 overlay와 같은 underline 통일         |
| 4·5 | solid 표면    | `bg-1` + `blur-33` + border, 그림자 X | **고침** → `bg-bg-1 backdrop-blur-[66px]`(그림자 제거, 양쪽 66) |
| 6   | 로그아웃 글자 | Pretendard Medium 20px             | **고침** → `text-heading2 font-medium`                          |

### 모바일 tab-bar

| #   | 항목           | 시안 (Figma)                                    | 판정 · 반영                                        |
| --- | -------------- | ----------------------------------------------- | -------------------------------------------------- |
| 7   | 활성 라벨 색   | #9b00cf (brand/main/2)                          | **유지** — `text-main`                             |
| 8   | 비활성 라벨 색 | #625b71 (M3 잔재)                               | **고침** → `text-icon`(#6f6f6f)                    |
| 9   | 바 표면/구분선 | `bg-white` + drop-shadow, 보더 없음             | **고침** → 보더 제거 + `bg-white shadow-[0_4px_3.5px_rgba(0,0,0,0.1)]` |

### 미해소(잔여)

- **20px Medium 타이포 토큰 부재** — 로그아웃은 `text-heading2` + `font-medium`로 weight override.
- **overlay 로고 색** — 판정 범위 밖. 현행 overlay=mono/흰색 유지.
- 시안 원시값(#9b00cf·#625b71)을 신규 토큰으로 승격하지 않음.

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-09-11 | 초안: 앱 셸 라우트/헤더/바텀탭/유저 설계 확정 | 리그 이후 앱 셸 필요, 설계 리뷰 완료 | MIG-023(셸 Out of Scope에서 분리), legacy header/bottom-tab-bar |
| 2026-09-12 | 「라우트 구조 규칙」 섹션 추가(3층 축·판단 순서·전체화면/back-header·반응형 CSS). 확인 필요 3건 해소 기록 | 추후 라우트 배치 의사결정을 팀이 일관되게 판단하도록 기준 문서화 | GitHub #221 |
| 2026-09-12 | 헤더/바텀탭 시안 대조(9건) 수행·판정·반영을 이 작업에 통합(FIX-027 폴더 삭제) | 별도 작업으로 분리하지 않고 앱 셸 구현과 한 단위로 올리기 위함 | (구 FIX-027) |
