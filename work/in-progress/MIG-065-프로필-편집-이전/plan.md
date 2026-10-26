---
id: 'MIG-065'
planned: '2026-10-25'
mode: 'migrate'
---

# MIG-065 구현 계획

## 0. 모드 판정

`mode: migrate` — legacy에 존재하는 프로필 편집 기능을 apps/web으로 이전. 동작 보존이 목표.

### 0-1. 착수 전 필수 게이트

| #   | 질문 | 답 | 근거 |
| --- | ---- | --- | ---- |
| 1 | 목표와 비목표가 명확한가 | O | 닉네임·색상 편집 이전. 사진 업로드/중복검사/라벨교정 제외 |
| 2 | 반복 비용이나 확장 차단이 있는가 | O | 현재 apps/web 카드에 편집 진입이 placeholder로 비어 있어 기능 미완 |
| 3 | 보존할 동작의 기준선이 있는가 | O | spec.md 기준선 10항목 + AC 5개 |
| 4 | 자동 또는 수동 검증 방법이 있는가 | O | 훅 단위 테스트(상태·payload) + 통합(무효화·돌아가기) |
| 5 | 범위를 독립적으로 완료할 수 있는가 | O | 단일 GitHub Issue. 카드 onClick까지 포함해 수직 완결 |
| 6 | 위험과 실패 시 복구 방법을 정했는가 | O | 공통 훅 추출 시 온보딩 테스트로 회귀 감지. 라우트 재생성 후 타입검사 |

### 0-2. 자동 보류 신호

- [x] 동작 변경이 같이 들어감 → **부분 해당**: `useNicknameStatus` 추출로 온보딩 코드가 바뀜. 단 **동작 보존**(기존 테스트 green)이라 리팩터 범위로 허용. 사용자 승인됨
- [ ] 한 단위로 완료·검증 불가 — 아님
- [ ] 자동 생성물 직접 수정 — 아님 (routeTree는 **재생성**으로 갱신)
- [ ] 기존 검증 실패 원인 불명 — 아님
- [ ] 범위 밖 문제 섞임 — 라벨 교정은 Out of Scope로 분리

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항 | 레이어 |
| --- | -------- | ------ |
| 1 | 닉네임 검증 상태 공통 훅(`useNicknameStatus`) 추출 | `[entities]` |
| 2 | 온보딩 폼이 공통 훅을 쓰도록 변경 (동작 보존) | `[features]` |
| 3 | 프로필 업데이트 mutation 래퍼 + 3키 무효화 | `[features]` |
| 4 | 편집 폼 상태 훅(초기값·변경감지·canSubmit·submit) | `[features]` |
| 5 | 편집 폼 UI (피커+필드+버튼, onCancel/onSuccess 콜백) | `[features]` |
| 6 | 데스크톱 편집 모달 (헤더+폼) | `[features]` |
| 7 | 모바일 전체화면 편집 페이지 (PageTitleBar+폼) | `[pages]` |
| 8 | `/my/edit` 라우트 (전체화면 + 넓은화면 redirect) | `[app]` |
| 9 | profile-card 편집 버튼 onClick 연결 (모달 열기 / `/my/edit` 이동) | `[pages]` |

## 2. 영향 분석

| 구분 | 파일 |
| ---- | ---- |
| 신규 | `entities/user/model/use-nickname-status.ts` (+test) |
| 신규 | `features/user-profile-edit/api/use-update-profile.ts` |
| 신규 | `features/user-profile-edit/model/use-profile-edit-form.ts` (+test) |
| 신규 | `features/user-profile-edit/ui/profile-edit-form.tsx` |
| 신규 | `features/user-profile-edit/ui/edit-profile-modal.tsx` |
| 신규 | `features/user-profile-edit/index.ts` |
| 신규 | `pages/my/edit/ui/profile-edit-page.tsx` + `index.ts` |
| 신규 | `app/routes/_authenticated/my.edit.tsx` |
| 수정 | `entities/user/index.ts` (배럴에 `useNicknameStatus` 추가) |
| 수정 | `features/user-onboarding/model/use-onboarding-form.ts` (공통 훅 사용) |
| 수정 | `pages/my/ui/profile-card.tsx` (편집 버튼 onClick, placeholder 제거) |
| 재생성 | `app/routeTree.gen.ts` (라우트 추가 후 `pnpm --filter @repo/web dev`/build) |

npm 의존성 추가: 없음

### 2-1. 이전 매핑

| 현재 위치 (legacy) | 목표 위치 (apps/web) | 변경 종류 | import 영향 |
| --------- | --------- | --------------------- | ----------- |
| `features/profile/model/use-nickname-form.ts` | `entities/user/model/use-nickname-status.ts` + 온보딩 기존 로직 | 분해/병합 (디바운스+판정만 공통화) | 온보딩 1곳 |
| `features/profile/ui/profile-selector.tsx` | (이미 존재) `entities/user` `ProfileColorPicker` | 재사용 | — |
| `features/profile/ui/nickname-form.tsx` | (이미 존재) `entities/user` `NicknameField` | 재사용 | — |
| `features/profile/model/use-profile-form.ts` | `features/user-profile-edit/model/use-profile-edit-form.ts` | 이동+개명 | — |
| `features/profile/model/use-update-profile-mutation.ts` | `features/user-profile-edit/api/use-update-profile.ts` | 이동 (무효화 3키로 확장) | — |
| `widgets/profile/ui/edit-profile-modal.tsx` | `features/user-profile-edit/ui/edit-profile-modal.tsx` | 이동+재조립 (apps/web Modal 기반) | — |
| `pages/.../my/_blank-profile-layout/edit.tsx` | `pages/my/edit/ui/profile-edit-page.tsx` + `app/routes/.../my.edit.tsx` | 이동+분리(라우트/화면) | — |

## 3. 의존 관계 검증

- `features/user-profile-edit`는 `shared`·`entities/user`만 참조 → 하향, 적법
- 온보딩과 편집은 **서로 import하지 않는다**. 공유분은 `entities/user`에만 둠 (cross-slice 회피)
- 편집 폼 UI는 라우팅을 모른다 — `onCancel`/`onSuccess` 콜백으로 상위(모달/페이지)가 결정
- 무효화 키: 생성 팩토리만 사용(`getGetMyPageBannerQueryKey`·`getGetProfileQueryKey`·`getGetUserQueryKey`). 손으로 키를 만들지 않음
- FSD 위반: 없음

## 4. 구현 계획 체크리스트

> 순서: `entities → features → pages → app`

- [ ] `[entities]` `use-nickname-status.ts` 추출 + 테스트. 배럴 export
- [ ] `[features-onboarding]` `useOnboardingForm`이 `useNicknameStatus` 사용하도록 교체, 온보딩 테스트 green 확인
- [ ] `[features]` `api/use-update-profile.ts` — 생성 `useUpdateProfile` 래핑, 3키 무효화, `onSuccess` 콜백
- [ ] `[features]` `model/use-profile-edit-form.ts` — 초기값·변경감지·canSubmit·submit + 테스트
- [ ] `[features]` `ui/profile-edit-form.tsx` — ProfileColorPicker + NicknameField + 돌아가기/수정하기
- [ ] `[features]` `ui/edit-profile-modal.tsx` — Modal + 헤더(타이틀+X+divider) + 폼
- [ ] `[features]` `index.ts` 배럴
- [ ] `[pages]` `pages/my/edit/ui/profile-edit-page.tsx` — PageTitleBar + ProfileEditForm, 돌아가기 핸들링
- [ ] `[app]` `my.edit.tsx` 라우트 — 넓은 화면 redirect, 라우트 트리 재생성
- [ ] `[pages]` `profile-card.tsx` — `useIsWideViewport`로 분기: 데스크톱 모달 open / 모바일 `/my/edit` navigate, placeholder 제거

## 5. 리스크

| 리스크 | 영향 | 대응 |
| ------ | ---- | ---- |
| 공통 훅 추출로 온보딩 회귀 | 온보딩 닉네임 검증 깨짐 | 기존 `use-onboarding-form.test.tsx` green 유지, 동작 1:1 확인 |
| `/my/edit` 라우트가 app-shell `/my`와 충돌 | 라우팅 깨짐 | notifications 선례(`_authenticated` 직속, 셸 밖) 그대로, 재생성 후 타입검사 |
| 무효화 키 prefix 상이 (my-pages/main-pages/users 분리) | 헤더/배너 중 일부만 갱신 | predicate 대신 생성 키 3개 명시 무효화 |
| 모달 헤더가 apps/web Modal에 슬롯 없음 | 조립 필요 | children으로 타이틀+X+divider 직접 구성 (withdraw-modal 선례) |

## 6. 완료 후 액션

- [ ] 작업 폴더 `in-progress/` → `done/` 이동 (`git mv`)
- [ ] `docs/implementation-status.md`에 `my/edit` 반영
- [ ] `docs/migration-status.md`에 프로필 편집 이전 반영 (생략 금지)
- [ ] 확정 명세를 `docs/fe-implement-spec/my-edit/`로 승격 (해당 시)
