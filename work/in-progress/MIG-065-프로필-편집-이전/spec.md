---
id: 'MIG-065'
title: '프로필 편집 이전'
type: 'migrate'
screen: 'my/edit'
priority: 'medium'
created: '2026-10-25'
revised: '2026-10-25'
---

# MIG-065 — 프로필 편집 이전

## 배경 · 목표

legacy-web의 프로필 편집 기능(닉네임·프로필 색상 변경)을 `apps/web`으로 이전한다.
동작·외형은 보존하되, 하위 부품은 이미 `apps/web`에 온보딩용으로 이전된 `entities/user`
자산(`ProfileColorPicker`·`NicknameField`·`profile-colors`·`nickname` 모델)을 재사용한다.
legacy 파일을 그대로 복제하는 게 아니라, 기존 자산 위에 **편집 오케스트레이션과 껍데기**만 얹는다.

## 범위

- 신규 feature 슬라이스 `features/user-profile-edit`
- 모바일 전체화면 편집 페이지 + 라우트 (`/my/edit`)
- `entities/user`에 닉네임 검증 상태 공통 훅 추출 (온보딩과 공유)
- `pages/my/ui/profile-card.tsx`의 편집 버튼 onClick 연결

## Out of Scope

- 구버전 legacy `/user/edit` 페이지(`usePatchUserProfile`·raw 버튼) — Figma 이전 버전, dead
- profile-card **버튼 라벨** 교정 (데스크톱 "프로필 편집" vs legacy "프로필 수정") — 필요 시 별도 FIX
- 프로필 이미지(사진) 업로드 — 색상 번호 선택만 존재
- 닉네임 **중복 서버 검사** — legacy도 클라이언트 형식 검증만 한다
- 온보딩 폼의 동작 변경 — 공통 훅 추출 시 **동작 보존**(기존 테스트 green)만 보장

## 용어 정의 (Ubiquitous Language)

| 용어 | 정의 |
| ---- | ---- |
| colorNumber | 서버 `profilePhotoNumber`와 동일한 1~19 색상 번호 (1-based) |
| 닉네임 상태 | `default` / `checking` / `valid` / `invalid` (디바운스 후 판정) |
| 편집 가능 | 제출 가능 상태. `(닉네임 변경 && 유효) || 색상 변경` |

---

## 현행 동작 기준선 (legacy-web)

| #   | 동작 | 확인한 위치 (legacy 경로) |
| --- | ---- | ------------------------- |
| 1 | 마이페이지 카드에서 데스크톱은 「프로필 수정」→모달, 모바일은 「프로필 편집」→`/my/edit` 이동 | `widgets/user/ui/user-profile-card.tsx` |
| 2 | 데스크톱 모달: 헤더「프로필 수정」+ 피커 + 닉네임폼 + `돌아가기`(strokeGray)/`수정하기`(CTA), 성공 시 닫기 | `widgets/profile/ui/edit-profile-modal.tsx` |
| 3 | 모바일 페이지: `innerWidth>=769`이면 `/my`로 redirect, 바텀탭 없는 전체화면 | `pages/_authenticated/my/_blank-profile-layout/edit.tsx` |
| 4 | 초기 데이터는 `useGetMyPageBanner()`, `isPending‖!data`면 `null` | 동일 |
| 5 | `돌아가기`: `history.canGoBack()`이면 back, 아니면 `/my`로 navigate | 동일 |
| 6 | 색상: 좌/우 화살표로 19색 순환, 초기값 `profileImageNumber-1`(0-based로 저장) | `features/profile/ui/profile-selector.tsx` |
| 7 | 닉네임: `min2/max8`, `^[가-힣a-zA-Z0-9]+$`, 입력 멈춤 200ms 디바운스 | `features/profile/model/use-nickname-form.ts` |
| 8 | 제출 가능: 기존 닉네임 있으면 `(닉네임변경&&유효)‖색상변경`, 없으면 `닉네임유효` | `features/profile/model/use-profile-form.ts` |
| 9 | 제출 payload `{ nickname, profilePhotoNumber: colorIndex+1 }` | `edit-profile-modal.tsx` / `edit.tsx` |
| 10 | 성공 후 `getGetMyPageBannerQueryKey`·`getGetMainPageQueryKey` 무효화 (+헤더 프로필 TODO 미해결) | `features/profile/model/use-update-profile-mutation.ts` |

## 시안 대조 결과 (design-diff, Figma 6축)

파일 `hu4c6qCEMB62qHXk2v8Gsl` — 모바일 `13750-54231/54238/54237/54249`, 데스크톱 `13750-70774/70775/70782/70781`

| #   | 항목 | 현행(apps/web 자산) | 시안 | 판정 |
| --- | ---- | ---- | ---- | ---- |
| 1 | 색상 피커 | `ProfileColorPicker` (아바타 150/178, 좌우 화살표, `justify-between md:justify-center`) | 동일 | 유지 |
| 2 | 닉네임 필드 | `NicknameField` (라벨·placeholder·헬퍼·valid/invalid 상태) | 동일 | 유지 |
| 3 | 토큰 | rounded-12 / divider-1(#dcdcdc) / cta(#9b00cf) / Headline2(17) / Label1(14) | 동일 | 유지 |
| 4 | 상태 커버리지 | 온보딩이 default/checking/valid/invalid 모두 처리 | 시안은 기본 상태만 정의 | 유지 |
| 5 | 모달 헤더 | `apps/web Modal`에 헤더 슬롯 없음 | 타이틀「프로필 수정」+ X + divider | **신규 조립** |
| 6 | 버튼 행 | `Button` stroke/CTA 존재 | 「돌아가기」/「수정하기」 | **신규 조립** |
| 7 | 모바일 헤더 | `PageTitleBar` 존재(back + 타이틀) | back `<` +「프로필 수정」 | 재사용 |

### 확인 필요

- profile-card 데스크톱 버튼 라벨("프로필 편집")이 legacy("프로필 수정")와 다름 → 이번엔 onClick만, 라벨은 미변경
- 모바일 `/my/edit`는 notifications 패턴(전체화면 + 넓은 화면→`/my` redirect)으로 둔다

---

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 단위) `useNicknameStatus`
      Given `nickname='한준서'`로 입력 후 디바운스 경과
      When 상태를 읽으면
      Then `'valid'`를 반환한다. (입력 직후~디바운스 전엔 `'checking'`, 빈 값은 `'default'`, `'@#'`은 `'invalid'`)

- [ ] **AC-2** (범위: 단위) 편집 폼 제출 가능 판정
      Given 초기 `{ nickname: '한준서', colorNumber: 3 }`
      When 색상만 `4`로 바꾸면 `canSubmit === true`; 닉네임을 `'한'`으로만 바꾸면(무효) `canSubmit === false`;
      **색상을 `4`로 바꾸고 닉네임을 `'한'`(무효)으로 바꾸면 `canSubmit === false`** (legacy 이탈 — 아래 Changelog)

- [ ] **AC-3** (범위: 단위) 제출 payload
      Given 초기 색상 `3`에서 `5`로 변경, 닉네임 `'그래빗'`
      When `submit()` 호출
      Then mutation이 `{ nickname: '그래빗', profilePhotoNumber: 5 }`로 호출된다

- [ ] **AC-4** (범위: 통합) 성공 후 무효화
      Given 편집 저장 성공
      When 무효화가 실행되면
      Then `/api/v1/my-pages/banners` · `/api/v1/main-pages/profile` · `/api/v1/users` 3개 쿼리가 무효화된다

- [ ] **AC-5** (범위: 통합) 모바일 돌아가기
      Given 편집 페이지에서 변경 없이
      When 「돌아가기」를 누르면
      Then 이전 기록이 있으면 back, 없으면 `/my`로 이동한다

---

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-10-25 | 기준선·시안대조·결정 확정 | 이전 착수 | MIG-065 |
| 2026-10-26 | 모달 타이틀 폰트 `headline2`→`body1-normal` 교정 | 시안 타이틀 노드(70777) 실제 스펙이 `Body 1_Normal`(16·Regular). 색 `text-4`는 유지 | 리뷰 |
| 2026-10-26 | **제출 조건을 legacy에서 의도적으로 이탈**: `canSubmit = (닉변경‖색변경) && (닉네임 안 바꿨거나 바꿨으면 유효)` | legacy는 `(닉변경&&유효)‖색변경`이라 "색 변경 + 무효 닉네임"일 때 버튼이 활성(네이티브 검증이 제출만 차단). 활성 자체를 막도록 개선. 사용자 승인 | 리뷰, use-profile-edit-form |
