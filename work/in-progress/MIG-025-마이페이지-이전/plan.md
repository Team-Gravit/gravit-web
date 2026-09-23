---
id: 'MIG-025'
planned: '2026-09-12'
mode: 'migrate'
---

# MIG-025 구현 계획 — Phase 1 (레이아웃 + 공통 컴포넌트)

> `plan.md`·`checklist.md`는 작업 전체를 관리한다. 이 문서는 Phase 1(이슈 #225) 구현 계획이다.

## 0. 모드 판정

`mode: migrate` — legacy `pages/_authenticated/my`·`widgets/user`의 관찰 동작을 apps/web으로 이전. 동작 보존 + Figma 토큰 정합.

### 0-1. 착수 전 필수 게이트

| #   | 질문                     | 답  | 근거                                                                 |
| --- | ------------------------ | --- | -------------------------------------------------------------------- |
| 1   | 목표·비목표 명확         | 예  | 목표: 카드+탭+레이아웃 이전. 비목표: 탭 내용·편집/설정/알림 기능      |
| 2   | 반복 비용/확장 차단      | 예  | Phase 2~5가 이 레이아웃 위에 얹히므로 선행 필수                       |
| 3   | 기준선 존재              | 예  | spec 현행 동작 기준선 + AC + 통합 테스트로 고정 예정                  |
| 4   | 검증 방법               | 예  | lint/types/test/build + `/my`→summary 리다이렉트·탭 활성 통합 테스트 |
| 5   | 독립 완료 가능           | 예  | 탭 콘텐츠 없이도 레이아웃·카드·탭 이동 검증 가능                      |
| 6   | 위험·복구               | 예  | 라우트 트리 재생성 필요. `my.tsx` 교체 → 되돌리기는 git               |

### 0-2. 자동 보류 신호

- [x] 해당 없음. (라우트 트리는 재생성으로 처리, 직접 편집 아님)

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                       | 레이어       |
| --- | ---------------------------------------------- | ------------ |
| 1   | 탭 프리미티브(`Tabs`/`Tabs.Tab`)               | `[shared]`   |
| 2   | 배너 데이터 어댑터 `useMyPageBanner`           | `[entities]` |
| 3   | 프로필 카드, 섹션 탭, 레이아웃 컴포넌트        | `[pages]`    |
| 4   | 중첩 라우트(레이아웃 + 리다이렉트 + 4탭 스텁)  | `[app]`      |

## 2. 영향 분석

| 구분 | 파일 |
| ---- | ---- |
| 신규 | `shared/ui/tab/{tab,index}.tsx` · `entities/user/api`에 `useMyPageBanner` · `pages/my/ui/{my-page-layout,profile-card,my-page-tabs}.tsx` · `pages/my/ui/assets/profile-banner.webp` · `app/routes/_authenticated/_app-shell/my/{route,index,summary,learning,league,social}.tsx` |
| 수정 | `pages/my/index.ts`(배럴) · `entities/user/api/index.ts`·`entities/user/index.ts`(배럴) · `app/routeTree.gen.ts`(재생성) |
| 삭제 | `app/routes/_authenticated/_app-shell/my.tsx`(→ `my/`로 대체) · `pages/my/ui/my-page.tsx`(스텁 → 레이아웃으로 교체) |

npm 의존성 추가: 없음

### 2-1. 이전 매핑

| 현재 위치 (legacy)                              | 목표 위치 (apps/web)                         | 변경 종류 | import 영향 |
| ----------------------------------------------- | -------------------------------------------- | --------- | ----------- |
| `shared/ui/tab/tab.tsx`                         | `shared/ui/tab/tab.tsx`                      | 이동+토큰정정 | 신규        |
| `widgets/user/ui/user-tabs.tsx`                 | `pages/my/ui/my-page-tabs.tsx`               | 이동      | 레이아웃    |
| `widgets/user/ui/user-profile-card.tsx`         | `pages/my/ui/profile-card.tsx`               | 이동+분해 | 레이아웃    |
| `pages/_authenticated/my/_profile-layout/route` | `pages/my/ui/my-page-layout.tsx` + `app/routes/.../my/route.tsx` | 분해 | 라우트 |
| `pages/_authenticated/my/index.tsx`(redirect)   | `app/routes/.../my/index.tsx`                | 이동      | 라우트      |
| `useGetMyPageBanner`(직접호출)                  | `entities/user/api` 어댑터                   | 감쌈      | 페이지      |

## 3. 의존 관계 검증

- 카드가 `entities/user`(ProfileAvatar) 참조 → pages→entities 하향 ✓
- 레이아웃이 `entities/user`(useMyPageBanner)·`shared/ui/tab`·같은 slice UI 참조 ✓
- 라우트 어댑터는 `pages/my`만 참조(app→pages 하향) ✓
- FSD 위반: 없음

## 4. 구현 계획 체크리스트 (레이어 순서)

- [ ] `[shared]` `shared/ui/tab/` — legacy Tabs 이전, T1~T7 토큰/수치 정정, 배럴
- [ ] `[entities]` `entities/user/api`에 `useMyPageBanner` 어댑터 + 배럴 노출
- [ ] `[pages]` `pages/my/ui/profile-card.tsx` — 카드(P1~P11 반영, ProfileAvatar 재사용, 알림 아이콘 시각만)
- [ ] `[pages]` `pages/my/ui/my-page-tabs.tsx` — 4개 섹션 탭
- [ ] `[pages]` `pages/my/ui/my-page-layout.tsx` — 카드 + 탭 + `<Outlet/>`, 배럴 갱신
- [ ] `[app]` `my.tsx` 삭제 → `my/route.tsx`(레이아웃, headerVariant solid) + `my/index.tsx`(→summary) + 4탭 스텁
- [ ] 라우트 트리 재생성 → `check-types`

## 5. 리스크

| 리스크                          | 영향           | 대응                                            |
| ------------------------------- | -------------- | ----------------------------------------------- |
| `my.tsx`→`my/` 교체 시 라우트 꼬임 | 빌드 실패      | 트리 재생성 후 `check-types`로 확인             |
| 편집/설정/알림 액션 미연결      | 죽은 버튼 우려 | 시각만 렌더, 마커 주석으로 별도 항목 연결 명시  |
| 배너 이미지 web/mobile 상이      | 시안 미세차   | legacy 단일 webp 재사용(현행 동작), 필요시 후속 |

## 6. 완료 후 액션

- [ ] 작업 폴더 `in-progress/` → `done/` 이동
- [ ] `docs/implementation-status.md`에 my 레이아웃/공통 반영
- [ ] `docs/migration-status.md`에 카드/탭/레이아웃 이전 반영
- [ ] 확정 명세 `docs/fe-implement-spec/my/`로 승격
