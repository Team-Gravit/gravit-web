---
id: 'MIG-046'
title: '탈퇴 플로우 전체 이전'
type: 'migrate'
screen: '설정/탈퇴'
priority: 'medium'
created: '2026-09-29'
revised: '2026-09-29'
---

# MIG-046 — 탈퇴 플로우 전체 이전

## 배경 · 목표

legacy-web의 **탈퇴 플로우 전체**를 `apps/web`으로 이전한다. 디자인 시스템(토큰·`shared/ui`)에 맞춰
새로 구현하며, 여러 단계로 나눠 진행한다. 이 작업공간(브랜치 `feat/#263/withdraw`)에서 전 단계를
이어서 다룬다. **첫 단계는 탈퇴 확인 모달 이전이다.**

## 범위

`apps/web`의 탈퇴 관련 화면·기능 전체. GitHub Issue [#263](https://github.com/Team-Gravit/gravit-web/issues/263).

### 단계 (Phases)

| Phase | 내용                                                                                         | 상태                     |
| ----- | -------------------------------------------------------------------------------------------- | ------------------------ |
| 1     | 탈퇴 확인 모달 이전 (`features/user-withdraw`) + 설정 「탈퇴하기」 오픈 연결                 | ✅ 완료                  |
| 2     | 「계속하기」 → 인증 메일 발송(`request`) + 발송 안내 모달 + confirm 페이지(`/withdraw`) 이전 | ✅ 완료                  |
| 3     | 탈퇴 결과 성공/실패 화면 구현 (현재 placeholder) — 공용 StatusLayout + Figma                 | 예정(placeholder 배치됨) |
| 4     | legacy 탈퇴 폐기 반영 (`docs/migration-status.md`·`implementation-status.md`)                | 예정                     |

### Phase 2 산출물 (2026-10-01)

- `features/user-withdraw/api/use-withdraw.ts` — `useRequestWithdrawal`(dest=`getOauthDest()`) · `useConfirmWithdrawal` (생성 훅 `useRequest`/`useConfirm` 래핑)
- `features/user-withdraw/ui/withdraw-email-sent-modal.tsx` — 메일 발송 안내 모달(legacy `SuccessNotificationModal` 문구 이전)
- `withdraw-confirm-modal.tsx` — 「계속하기」가 `request` 발사(fire-and-forget, legacy 보존) 후 `onContinue`
- `pages/withdraw/` — confirm 화면 + 결과 placeholder. 성공 시 **토큰 보유(로그인)면 로그아웃→'/'**, 비로그인은 성공 placeholder
- `app/routes/withdraw.tsx` — **공개 라우트**(`_authenticated` 밖), `mailAuthCode` search

> 각 Phase는 독립 검증(lint·types·test·build) 후 다음 단계로 진행한다.

## Out of Scope (작업 전체 기준)

- 탈퇴 정책·문구 자체의 변경 (legacy/시안 기준 그대로 이전)
- 설정 목록 항목 자체의 시안 대조 (별도 작업)
- native(앱) 측 탈퇴 관련 처리

## 용어 정의 (Ubiquitous Language)

| 용어      | 정의                                                           |
| --------- | -------------------------------------------------------------- |
| 탈퇴 요청 | 로그인 사용자에게 인증 메일을 발송하는 1단계 (`request`)       |
| 탈퇴 확정 | 메일 인증 코드로 계정 삭제를 확정하는 2단계 (`confirm`)        |
| 확인 모달 | 설정에서 「탈퇴하기」를 눌렀을 때 뜨는 "정말로..." 재확인 모달 |

---

## 현행 동작 기준선

> legacy-web 관찰 기준. 탈퇴 플로우 전반.

| #   | 동작                                                                                       | 확인한 위치 (legacy 경로)                                                                   |
| --- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 1   | 설정에서 「탈퇴하기」를 누르면 확인 모달이 열린다                                          | `widgets/setting-box/SettingBox.tsx`, `features/user/delete-user/ui/delete-user-button.tsx` |
| 2   | 확인 모달은 제목 2줄 + 설명 + [확정/취소] 2버튼 구조                                       | `shared/ui/modal/ConfirmModal` 사용부                                                       |
| 3   | 확정 시 인증 메일 발송(`request`) 후 성공 안내 모달 표시                                   | `features/user/delete-user/api/useWithdraw.tsx` (`useSendWithdrawEmail`)                    |
| 4   | 메일 링크로 `/user/me/delete?mailAuthCode=…` 진입 → 「탈퇴 확정하기」 → `confirm`으로 삭제 | `pages/user.me.delete.page.tsx`, `useConfirmWithdraw`                                       |
| 5   | 확정 결과에 따라 성공/실패 페이지를 보여준다                                               | `widgets/withdraw/ui/{WithdrawSuccessPage,WithdrawFailedPage}.tsx`                          |
| 6   | `request`는 JWT 필요·`dest` 파라미터, `confirm`은 JWT 불필요·`mailAuthCode` 파라미터       | `shared/api/@generated/docs/UserDeletionAPIApi.md`                                          |
| 7   | 신규 리팩터본 `setting-box.tsx`의 「탈퇴하기」는 `onClick={() => {}}`로 미연결(TODO)       | `widgets/setting-box/setting-box.tsx`                                                       |

## 시안 대조 결과 (Phase 1 — 확인 모달)

> Figma Dev Mode 기준. 모바일 `14748-27060`, 데스크톱 `14748-26979`.

| #   | 항목             | 구현                                              | 시안                                            | 판정            |
| --- | ---------------- | ------------------------------------------------- | ----------------------------------------------- | --------------- |
| 1   | 모달 패딩        | `p-4` / `md:p-8`                                  | 16 / 32                                         | 고침            |
| 2   | 모달 배경        | `bg-white(bg-0)` / `md:bg-bg-1`                   | bg/0 / bg/1(#f8f8f8)                            | 고침            |
| 3   | 모달 radius      | `rounded-8` / `md:rounded-12`                     | 8 / 12                                          | 고침            |
| 4   | 그림자(데스크톱) | `md:shadow-elevation-1`                           | elevation/1 (토큰 값 정확 일치)                 | 고침            |
| 5   | 제목             | `text-heading1` · `text-text-1`/`md:text-text-2`  | xl 22 SB · text/1(모바일)·text/2(데스크톱)      | 고침            |
| 6   | 설명             | `text-label2`/`md:text-headline1` · `text-text-4` | 2xs 13 R / md 18 SB · text/4(#a8a8a8)           | 고침            |
| 7   | 버튼 크기        | Button `size="cta"` (48 / md 54, 17 SB)           | 48 / 54, md-2 17 SB                             | 고침            |
| 8   | 계속하기 버튼    | Button `variant="default"`                        | cta/default #9b00cf · cta/text #fbfbfb          | 고침            |
| 9   | 그만두기 버튼    | `stroke-secondary` + `bg-bg-0 text-main`          | divider-1 테두리 · bg/0 · brand/main/1(#ba00ff) | 고침(확인 필요) |
| 10  | 마스코트         | Figma export PNG @3x 단일 에셋(150 / md 211px)    | 슬픈 토끼 + 빗줄기 일러스트                     | 고침            |

### 확인 필요

- **⚠️ `/withdraw` 경로 ↔ 백엔드 메일 링크** — confirm 메일 링크 path는 **백엔드가 생성**한다(`dest`는 환경만 지정). 프론트 라우트를 `/withdraw`로 잡았으나 **백엔드가 같은 path로 링크를 만드는지 확인 필요**. 다르면 경로를 맞춰야 한다(legacy는 `/user/me/delete`였음).
- **메일 발송 안내 모달 아이콘** — legacy는 CheckIcon 포함. 지금은 문구만 이전(아이콘 생략). Figma 확정 시 추가.
- **탈퇴 확정 버튼 색** — legacy는 red(파괴적). apps/web Button에 danger variant가 없어 `default`(cta) 사용. Phase 3에서 결과 화면과 함께 확정.
- **request 실패 피드백 없음** — legacy 보존(fire-and-forget: 실패해도 "메일 보냈어요"). 개선(에러 처리)은 제안만.
- **「그만두기」 버튼 스타일** — 시안 조합(`divider-1 테두리 + bg/0 + main 텍스트`)에 정확히 대응하는
  Button variant가 없어 `stroke-secondary` 기반에 배경·텍스트만 className으로 맞췄다. 재사용 시
  **Button variant 승격** 검토 필요. (Figma 컴포넌트명이 `button-legacy`라 성급한 추가는 보류)
- **데스크톱 모달 폭 630px** — 시안 프레임(`프로필수정_정사각형` 630×600) 값 그대로 적용. 의도 확인 필요.

---

## 확정 명세 · 검증 기준

### Phase 1 (완료)

- [x] **AC-1** (통합) Given 설정 화면 / When 「탈퇴하기」 클릭 / Then `role="dialog"` 모달이 나타나고 「그만두기」·「계속하기」가 보이며 경로는 `/settings` 유지
- [x] **AC-2** (통합) Given 확인 모달 열린 상태 / When 「그만두기」 클릭 / Then `role="dialog"`가 사라진다
- [x] **AC-3** (명세) Given `onConfirm` 미전달 / When 「계속하기」 클릭 / Then 아무 동작도 하지 않는다 (Phase 2에서 연동)

### Phase 2~4

각 단계 착수 시 작성한다.

---

## Changelog

| 날짜       | 요약                                                                                                                    | 사유                                             | 연관 항목                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| 2026-09-29 | 작업 생성 · Phase 1(탈퇴 확인 모달) 구현 + 설정 오픈 연결                                                               | legacy 탈퇴 플로우 이전 착수                     | [#263](https://github.com/Team-Gravit/gravit-web/issues/263) |
| 2026-09-29 | 범위를 탈퇴 플로우 전체로 확장, 단계(Phase) 구조로 재구성                                                               | 모달만이 아닌 전 단계를 한 작업공간에서 진행     | [#263](https://github.com/Team-Gravit/gravit-web/issues/263) |
| 2026-10-01 | Phase 2 — request/confirm 연동 · 발송 안내 모달 · `/withdraw` confirm 페이지 이전 · 성공 시 로그아웃 · 결과 placeholder | legacy 탈퇴 후 플로우 이전(동작 보존, UI 미수정) | [#263](https://github.com/Team-Gravit/gravit-web/issues/263) |
