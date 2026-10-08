---
id: 'MIG-042'
title: '환경설정 화면 이전'
type: 'migrate'
screen: 'SETTING-01'
priority: 'medium'
created: '2026-09-23'
revised: '2026-09-23'
---

# MIG-042 — 환경설정 화면 이전

## 배경 · 목표

legacy-web의 환경설정 화면(`/settings`)을 `apps/web`으로 FSD 구조에 맞춰 이전한다.
신규 기능 추가 없이 현행 동작과 Figma 시안 정합을 유지하는 것이 목표다. legacy 구현이 이미
토큰 대부분에서 시안과 정합하므로, 아이콘·항목 높이 등 소수 차이만 시안에 맞춰 조정한다.

## 범위

- `pages/settings/` 신설 (배치·라우팅 결정)
- 설정 목록 UI 이전 — 계정정보/기타 섹션, 링크·버튼 항목
- `app/routes/`에 `/settings` 라우트 신설 (모바일 `PageTitleBar`, 데스크톱 `widgets/header` solid, 앱 바텀탭 없음)
- 로그아웃: 기존 `features/auth-logout` 재사용
- 없는 링크 대상(공지사항·문의하기)은 스텁 라우트로 연결

## Out of Scope

- 공지사항·문의하기 화면 본체 구현 (스텁 라우트만)
- 탈퇴 플로우 구현 (버튼은 두되 동작 없음, legacy 현행과 동일)
- 마케팅/이벤트 알림 등 시안에 없는 항목 (미사용 구파일 `SettingBox.tsx`의 잔재)
- 설정 화면의 데스크톱/모바일 헤더 컴포넌트 자체 신규 개발 (기존 것 재사용)

## 용어 정의 (Ubiquitous Language)

| 용어 | 정의 |
| ---- | ---- |
| 설정 목록 항목 | 계정정보·기타 섹션 안의 한 줄. `link`(이동) 또는 `button`(동작) 두 종류 |
| 스텁 라우트 | 화면 본체 없이 `component: () => null`로 링크 대상만 확보한 라우트 (`friends.search` 패턴) |

---

## 현행 동작 기준선

> legacy `widgets/setting-box/setting-box.tsx`(신, 현재 `/settings` 라우트가 사용) 기준.
> 구파일 `SettingBox.tsx`는 미사용이라 기준선에서 제외.

| #   | 동작 | 확인한 위치 (legacy 경로) |
| --- | ---- | ------------------------- |
| 1 | `/settings` 진입 시 계정정보·기타 두 섹션 카드 표시 | `pages/_authenticated/settings/index.tsx`, `widgets/setting-box/setting-box.tsx` |
| 2 | 계정정보: 내 정보(→/my), 공지사항(→/user/notice), 개인정보 처리 방침(→/user/privacy) 링크 | `setting-box.tsx` `ACCOUNT_INFORMATION_PATHS` |
| 3 | 기타: 문의하기(→/settings/inquiry/new) 링크, 로그아웃(버튼), 탈퇴하기(버튼) | `setting-box.tsx` |
| 4 | 로그아웃 클릭 시 `useLogout()` 실행 | `features/auth/logout` |
| 5 | 탈퇴하기 클릭 시 동작 없음(빈 onClick), 라벨은 `text-text-4`로 흐리게 | `setting-box.tsx` L56-62 |
| 6 | 모바일: 뒤로가기 헤더 + "환경설정" 제목, 앱 바텀탭 없음 / 데스크톱: solid 헤더 | `settings/route.tsx` |
| 7 | 각 항목 우측에 오른쪽 화살표 아이콘 | `setting-box.tsx` `RightArrowIcon` |

## 시안 대조 결과

> Figma Dev Mode 기준. 데스크톱 node 13750-68304 / 모바일 node 13750-55029.
> legacy 구현이 토큰 대부분 정합. 아래는 **차이가 있는 항목만** 기록.

| #   | 항목 | 현행(legacy) | 시안(Figma) | 판정 |
| --- | ---- | ---- | ---- | ---- |
| D1 | 화살표 아이콘 | `ic-right-arrow.svg` (직접 import) | `chevron-right` (꺾쇠) | 고침 — web `<Icon name="chevron-right" />` |
| D2 | 항목 높이 | `py-[14px] md:py-5` (높이 미고정) | 모바일 h-44 / 데스크톱 h-74, py-8 | 고침 — 시안 값 반영 |
| D3 | 모바일 카드 패딩 | `p-4` (균등 16) | pt-16 **pb-8** px-16 (비대칭) | 고침 — pb만 8 |
| D4 | 데스크톱 섹션 제목 weight | body 계열 (400) | Medium (500) | 확인 필요 — 전용 토큰 없음, 미세차 |

**정합 확인된 항목** (조치 불필요): 배경 `bg-2`, 카드 radius `rounded-8 md:rounded-12`,
카드 gap `gap-3 md:gap-4`, 카드 사이 간격 `mb-3 md:mb-6`, 데스크톱 카드 패딩 `md:px-8 md:py-7`,
라벨 타이포 `text-label1 md:text-heading2`, 라벨 색 `text-text-1`(탈퇴 `text-text-4`),
섹션 제목 색 `text-text-3 md:text-text-4`, 데스크톱 항목 구분선 `divider-1`(마지막 제외),
모바일 항목 구분선 없음.

### 확인 필요

- **D4** 데스크톱 섹션 제목 폰트 weight: 시안 Medium(500) vs web `body1-normal`(400). 전용 토큰
  없음. 시안-토큰 불일치이므로 임의 하드코딩하지 않고 판정 대기. (무시 가능 수준 — 미세차)
- **없는 링크 대상 처리** → 사용자 판정 완료: **스텁 라우트 생성** (공지사항·문의하기)
- **`/settings` 라우트 셸** → 사용자 판정 완료: **모바일 `PageTitleBar` + 데스크톱 `header` solid**, 앱 바텀탭 없음

---

## 확정 명세 · 검증 기준

> ai-plan 단계에서 이전 매핑과 함께 구체화한다.

- [x] **AC-1** (범위: 통합)
      Given 인증된 사용자가 `/settings`에 진입
      When 화면이 렌더되면
      Then 계정정보 섹션에 "내 정보"·"개인정보 처리 방침" 2개 항목, 기타 섹션에 "문의하기"·"로그아웃"·"탈퇴하기" 3개 항목이 보인다
      (공지사항은 화면 미비로 보류 — `settings-page.tsx` TODO)

- [x] **AC-2** (범위: 통합)
      Given `/settings`에서 "로그아웃" 버튼
      When 클릭하면
      Then `useLogout`이 실행되어 세션·캐시가 비워지고 로그인 화면(`/`)으로 이동한다

- [x] **AC-3** (범위: 통합)
      Given `/settings`에서 "개인정보 처리 방침" 항목
      When 클릭하면
      Then `/privacy`로 이동한다

- [x] **AC-4** (범위: 단위)
      Given "탈퇴하기" 항목
      When 렌더되면
      Then 라벨이 `text-text-4`로 표시되고 클릭해도 이동·동작이 없다

---

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-09-23 | 작업 생성, 시안 대조·기준선·이전 결정 기록 | 환경설정 화면 이전 착수 | #252 |
| 2026-09-23 | 구현·검증 완료. 공지사항 항목 보류(화면 미비), AC-1 계정정보 2항목으로 조정 | 공지사항 대상 화면이 아직 없어 링크를 걸 수 없음. 사용자 판단으로 코드 내 TODO 보류 | #252, `settings-page.tsx` |
