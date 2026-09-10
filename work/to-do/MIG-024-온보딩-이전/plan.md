---
id: 'MIG-024'
planned: '2026-09-10'
mode: 'migrate'
---

# MIG-024 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: migrate` — legacy `pages/_authenticated/_onboarding/`의 두 화면이 `apps/web`에 없다.
`/onboarding`은 `component: () => null`이라 **신규 가입자가 흰 화면에 갇힌다.** 없던 기능을
만드는 것이 아니라 legacy에 있는 화면을 옮긴다. 신규 동작 후보(중복 닉네임 안내, 제출 실패
알림)는 `spec.md`의 판정 결과에서 이미 범위 밖으로 갈라 두었다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                                                |
| --- | ----------------------------------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | ✅  | 바꾼다: `/onboarding`의 빈 화면 + 완료 화면 신설. 보존한다: 기준선 A~F와 동작 계약 C-1~C-5. 비목표 4건을 `spec.md` Out of Scope에 명시              |
| 2   | 반복 비용이나 확장 차단이 있는가    | ✅  | `FIX-022`로 콜백 404가 풀려 **이 경로가 실제로 도달된다.** 신규 가입자가 진행 불가 상태다. `MIG-005` Issue 4 게이트도 목적지 화면이 있어야 검증된다 |
| 3   | 보존할 동작의 기준선이 있는가       | ✅  | `spec.md` 현행 동작 기준선 A1~A9 · B1~B4 · C1~C7 · D1~D4 · E1~E3 · F1 (legacy 코드 직접 확인). 동작 계약 C-1~C-5                                    |
| 4   | 자동 또는 수동 검증 방법이 있는가   | ✅  | §5-1. 색 순환·닉네임 검증·제출 페이로드는 순수 함수와 RTL+MSW로 자동화. 글래스 카드·마스코트는 수동 스모크                                          |
| 5   | 범위를 독립적으로 완료할 수 있는가  | ✅  | `MIG-005` Issue 4(게이트)에 **의존하지 않는다.** 완료 화면 「홈으로」가 걸리던 `FIX-001`은 선행 작업으로 분리해 해소했다 (§6-0)                     |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | ✅  | §5 리스크 6건. 생성물은 재생성만 하고 손대지 않는다. 되돌리기는 브랜치 단위                                                                         |

### 0-2. 자동 보류 신호 — 하나라도 해당하면 **중단**

- [x] **범위 밖 문제가 섞임 → `FIX-001`(Button asChild)이 완료 화면의 「홈으로」를 막는다.**
      `<Button asChild><Link/></Button>`이 현재 깨져 있어(CLAUDE.md 함정 12) 링크를 CTA 모양으로
      쓸 수 없다. **작업 전체가 보류되지는 않는다** — 2026-09-10 판정으로 `FIX-001`을 **선행
      작업으로 분리**했다. 이 작업 안에서 고치지 않는다 (§6-0)
- [x] **동작 변경이 같이 들어감 → 2건.** 둘 다 legacy 결함 보정이며 `checklist.md`의 의도적
      변경란에 기록한다. 상세는 §3-2
  - 온보딩 성공 후 사용자 쿼리 캐시를 채운다 (안 하면 완료 화면이 `/onboarding`으로 튕긴다)
  - 프로필 색을 인덱스가 아니라 **1~19 번호 자체**로 다룬다 (C-1의 off-by-one 위험 제거)
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음. 화면 2개, 한 도메인
- [ ] 자동 생성물을 직접 손봐야 함 — 해당 없음. `routeTree.gen.ts`는 **재생성**한다.
      orval 재생성도 불필요 (`onboardUser` · `getUser` · `OnboardingRequest` 모두 이미 있다)
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 — 해당 없음.
      `format:check`는 `REF-003`로 기록된 기존 실패이고, 이번 신규 파일은 prettier를 맞춘다

---

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                 | 레이어       | 기준선   |
| --- | -------------------------------------------------------- | ------------ | -------- |
| 1   | 프로필 색 19종과 순환(다음/이전) 규칙을 제공한다         | `[entities]` | B2·B3    |
| 2   | 닉네임 규칙(2~8자 · 한글/영문/숫자)을 판정한다           | `[entities]` | C2·C7    |
| 3   | 색이 적용된 아바타 실루엣을 표시한다                     | `[entities]` | B1       |
| 4   | 좌우 화살표로 색을 넘기는 선택기를 표시한다 (controlled) | `[entities]` | B1·B3    |
| 5   | 닉네임 입력과 상태별 안내 문구를 표시한다 (controlled)   | `[entities]` | C1·C4~C6 |
| 6   | 입력 후 200ms 지연해 검증 상태를 만든다                  | `[features]` | C3       |
| 7   | 온보딩 정보를 등록하고 사용자 캐시를 채운다              | `[features]` | B4·D4    |
| 8   | 위 조각을 폼으로 조립하고 제출 버튼 활성 조건을 건다     | `[features]` | D1~D4    |
| 9   | 넓은 화면·좁은 화면 온보딩 화면을 각각 조립한다          | `[pages]`    | A6·A9    |
| 10  | 온보딩 이탈 시 세션을 지우고 `/`로 보낸다                | `[pages]`    | A8       |
| 11  | 넓은 화면·좁은 화면 완료 화면을 각각 조립한다            | `[pages]`    | E1~E3·A7 |
| 12  | 완료 화면에 사용자가 없으면 `/onboarding`으로 되돌린다   | `[pages]`    | A4       |
| 13  | `/onboarding` · `/onboarding/success` 라우트를 연결한다  | `[app]`      | A3·A5    |

### 1-1. 관리 포인트 식별

| 값                                            | 상수 / 인라인     | 근거                                                           |
| --------------------------------------------- | ----------------- | -------------------------------------------------------------- |
| 프로필 색 19종 팔레트                         | **상수**          | 도메인 식별자. 온보딩·프로필 수정·랭킹이 같은 표를 본다        |
| 닉네임 최소 2 · 최대 8 · 정규식               | **상수**          | 서버 제약(`OnboardingRequest`)과 짝을 이루는 비즈니스 제약값   |
| 안내 문구 5종 (`닉네임 설정` · 3개 상태 문구) | **상수**          | 기획이 바꾸는 사용자 노출 문구 (`constants-convention.md` §2)  |
| 디바운스 `200ms`                              | 인라인(모듈 상수) | 요구사항에 없는 내부 구현 디테일. 훅 파일 상단에 이름만 붙인다 |
| 카드 폭 630 · 아바타 150/178 등 레이아웃 수치 | 인라인            | 디자인 스펙이지 관리 포인트가 아니다                           |
| 「계정 생성 완료!」 등 완료 화면 본문         | 인라인            | 한 화면에서만 쓰는 고유 텍스트                                 |

`profilePhotoNumber` 범위 1~19는 팔레트 표에서 파생된다. 별도 상수를 만들지 않는다.

---

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규 | `entities/user/model/{profile-colors.ts, profile-colors.test.ts, nickname.ts, nickname.test.ts}`<br>`entities/user/ui/{profile-avatar.tsx, profile-color-picker.tsx, nickname-field.tsx}`<br>`entities/user/ui/assets/profile-avatar.svg`<br>`entities/user/index.ts`<br>`features/user-onboarding/model/{use-onboarding-form.ts, use-onboarding-form.test.tsx}`<br>`features/user-onboarding/api/use-onboard-user.ts`<br>`features/user-onboarding/ui/{onboarding-form.tsx, onboarding-form.test.tsx}`<br>`features/user-onboarding/index.ts`<br>`pages/onboarding/{index.ts, ui/onboarding-page.tsx, ui/onboarding-page-wide.tsx, ui/onboarding-page-narrow.tsx, ui/onboarding-page.test.tsx}`<br>`pages/onboarding-success/{index.ts, ui/onboarding-success-page.tsx, ui/onboarding-success-page-wide.tsx, ui/onboarding-success-page-narrow.tsx, ui/onboarding-success-page.test.tsx}`<br>`pages/onboarding-success/ui/assets/{mascot-celebrate.png, mascot-end.png}`<br>`app/routes/{_protected.onboarding.index.tsx, _protected.onboarding.success.tsx}` |
| 수정 | `app/routes/_protected.onboarding.tsx` (leaf → `Outlet` 레이아웃)<br>`app/routeTree.gen.ts` (**재생성**)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 삭제 | 없음                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

**실측** — `_protected/onboarding` 참조는 `oauth-callback-page.tsx` 1곳(`navigate to: '/onboarding'`)
뿐이고 **경로 문자열이 그대로라 수정이 필요 없다.** `entities/user` · `features/user-onboarding`은
신규 슬라이스라 기존 참조가 없다.

npm 의존성 추가: **없음.** legacy는 `zod`로 닉네임을 검증하지만 `apps/web`에 zod가 없다
(`package.json` 실측). 규칙 하나 때문에 런타임 의존성을 들이지 않는다 (§3-3 ADR-5).

### 2-1. 이전 매핑

| 현재 위치 (legacy)                                           | 목표 위치 (apps/web)                                        | 변경 종류               | import 영향 |
| ------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------- | ----------- |
| `shared/lib/ProfileColor.ts`                                 | `entities/user/model/profile-colors.ts`                     | 이동+개편               | 신규        |
| `shared/assets/icons/profile2.svg`                           | `entities/user/ui/assets/profile-avatar.svg`                | 이동                    | 신규        |
| `entities/user/ui/profile.tsx`                               | `entities/user/ui/profile-avatar.tsx`                       | 이동+rename             | 신규        |
| `features/profile/ui/profile-selector.tsx`                   | `entities/user/ui/profile-color-picker.tsx`                 | 이동+개편(→ controlled) | 신규        |
| `features/profile/ui/nickname-form.tsx` (표시부)             | `entities/user/ui/nickname-field.tsx`                       | 분해                    | 신규        |
| `features/profile/model/use-nickname-form.ts` (검증 규칙)    | `entities/user/model/nickname.ts`                           | 분해                    | 신규        |
| `features/profile/model/use-nickname-form.ts` (디바운스)     | `features/user-onboarding/model/use-onboarding-form.ts`     | 분해+병합               | 신규        |
| `features/profile/model/use-profile-form.ts`                 | `features/user-onboarding/model/use-onboarding-form.ts`     | 병합                    | 신규        |
| `features/onboarding/api/usePostOnboarding.ts`               | `features/user-onboarding/api/use-onboard-user.ts`          | 이동+개편               | 신규        |
| `pages/_authenticated/_onboarding/onboarding.tsx` (화면)     | `pages/onboarding/ui/onboarding-page-{wide,narrow}.tsx`     | 분해                    | 신규        |
| `pages/_authenticated/_onboarding/success.tsx` (화면)        | `pages/onboarding-success/ui/…-{wide,narrow}.tsx`           | 분해                    | 신규        |
| `shared/ui/layout/entry-layout.tsx`의 `OnboardingBackButton` | `pages/onboarding/ui/onboarding-page-narrow.tsx`            | 이동+개편               | 신규        |
| `shared/ui/layout/entry-layout.tsx`의 껍데기                 | 이미 있는 `SpaceBackground` · `PageHeader` 재사용           | 병합 완료               | —           |
| `shared/assets/_images/mascot-{celebrate,end}.png`           | `pages/onboarding-success/ui/assets/`                       | 이동                    | 신규        |
| `shared/assets/icons/buttons/{left,right}-gray-arrow.svg`    | **가져오지 않는다** — `chevron-left`·`chevron-right` 재사용 | —                       | —           |

**목표 위치 판정 근거**

- 프로필 색·닉네임 규칙·아바타는 **「사용자」라는 명사**에 속하고 프로필 수정 화면도 같은 것을
  쓴다 → `entities/user` (`fsd-entities.md` §1, ADR-1)
- 색 선택기와 닉네임 입력은 **표시만 하고 동작은 prop으로 받는다** → entity `ui/` (§3 표시 전용)
- 「사용자가 온보딩을 완료한다」는 행동이고 UI가 mutation을 안다 → `features/user-onboarding`
  (`fsd-features.md` §1·§3). 슬라이스 이름은 `{대상}-{행동}` 규칙
- 이탈 시 세션 삭제는 **이미 있는 `features/auth-logout`의 `useLogout`을 쓴다.**
  legacy처럼 레이아웃(`shared`)에 넣으면 상향 참조가 된다 — `MIG-018` §3이 예고한 지점이다
- 온보딩 화면과 완료 화면은 **다른 화면**이므로 slice를 나눈다. 서로 import 하지 않는다
- 에셋은 소비자 옆에 둔다 (`fsd-shared.md` §1, 선례 `shared/ui/layout/assets/`)

---

## 3. 의존 관계 검증

| 지점                                                    | 방향        | 판정                                                     |
| ------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `pages/onboarding` → `features/user-onboarding`         | 4 → 2 하향  | ✅                                                       |
| `pages/onboarding` → `features/auth-logout`             | 4 → 2 하향  | ✅                                                       |
| `pages/onboarding` → `shared/ui/{layout,button}`        | 4 → 0 하향  | ✅                                                       |
| `pages/onboarding-success` → `entities/user`            | 4 → 1 하향  | ✅                                                       |
| `features/user-onboarding` → `entities/user`            | 2 → 1 하향  | ✅                                                       |
| `features/user-onboarding/api` → `shared/api/generated` | 2 → 0 하향  | ✅ `api-convention.md` §3 도메인 경계 뒤에서 노출        |
| `entities/user/ui` → `shared/ui/icon-button`            | 1 → 0 하향  | ✅                                                       |
| `pages/onboarding` ↔ `pages/onboarding-success`        | cross-slice | ❌ **만들지 않는다.** 이동은 라우트 경로 문자열로만 한다 |

FSD 위반은 없다.

### 3-1. 화면 조합 방식

`MIG-018` §3-1의 판정을 그대로 따른다 — **뷰포트 JS 분기는 구조가 다른 화면에만** 쓰고,
크기·여백 차이는 `md:`로 처리한다.

| 화면   | 넓은 화면 (시안 확인)              | 좁은 화면 (시안 확인)                 | 구조가 다른가 |
| ------ | ---------------------------------- | ------------------------------------- | ------------- |
| 온보딩 | 우주 배경 + 워드마크 + 글래스 카드 | 흰 배경 + 상단바 + 하단 2버튼         | ✅ 분기       |
| 완료   | 우주 배경 + 워드마크 + 글래스 카드 | 흰 배경 + 상단바 없음 + 다른 마스코트 | ✅ 분기       |

두 화면 모두 `login-page.tsx`와 같은 삼항 형태를 쓴다. `useIsWideViewport`는 이미 있다.

폼 조립은 **`features/user-onboarding/ui/onboarding-form.tsx` 하나**가 맡고, 좌우 화면이 다른
부분만 prop으로 받는다. legacy의 `formId` + `<Button form="...">` 우회는 필요 없다 —
폼이 버튼을 직접 품는다.

```tsx
interface OnboardingFormProps {
  /** 등록에 성공했을 때. 이동 목적지는 화면이 정한다 (fsd-features.md §6) */
  onSuccess: () => void;
  /** 좁은 화면은 하단에 「이전」을 함께 둔다. 넓은 화면은 두지 않는다 */
  secondaryAction?: ReactNode;
  className?: string;
}
```

### 3-2. 의도적 변경 2건 — legacy 결함 보정

**① 온보딩 성공 후 사용자 쿼리 캐시를 채운다**

legacy는 `useOnboardUser`의 `onSuccess`에서 `/success`로 이동만 한다. 완료 화면은
`useGetUser()`를 다시 읽는데, **이 쿼리는 직전까지 「사용자 없음」이었다.** 무효화도 시딩도
없으므로 완료 화면이 사용자를 못 찾고 `/onboarding`으로 되돌릴 수 있다 —
**가입에 성공한 사용자가 폼으로 튕기는 경로**이고 동작 계약 `C-4`가 깨진다.

`onboardUser`의 응답 타입이 `UserResponse`(= `getUser`와 같다)이므로 생성 키 팩토리로 시딩한다.

```ts
// features/user-onboarding/api/use-onboard-user.ts
queryClient.setQueryData(getGetUserQueryKey(), user);
```

`api-convention.md` §2 — 키는 손으로 만들지 않고 `getGetUserQueryKey()`를 쓴다.

**② 프로필 색을 인덱스가 아니라 번호(1~19)로 다룬다**

legacy는 0-based 인덱스를 들고 다니다 제출 직전에 `colorIndex + 1`을 보낸다(B4). 이 `+1`이
동작 계약 `C-1`(서버 `@minimum 1`)의 유일한 방어선이고, 프로필 수정 화면은 서버가 준
`profileImgNumber`를 그대로 쓰는 탓에 **두 화면이 다른 단위를 쓴다.** 새 코드는 전 구간
1-based 번호로 통일한다. 관찰 가능한 동작은 같다 — 첫 진입 = 1번 색, 제출값 = 1.

### 3-3. 기술 결정 추가분

`spec.md`의 ADR-1~4는 확정된 것으로 두고, 계획 단계에서 새로 필요해진 것만 적는다.

**ADR-5. 닉네임 검증에 zod를 들이지 않는다**

`apps/web`에 zod가 없다(`package.json` 실측). legacy는 `z.string().min(2).max(8).regex(...)`
한 줄에 쓴다. 검증 대상이 문자열 하나이므로 길이 비교 + 정규식으로 같은 결과를 낸다.
스키마 라이브러리는 폼이 여러 필드·교차 검증을 갖게 될 때 별도 결정으로 다룬다.

```ts
// entities/user/model/nickname.ts
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 8;
/** 서버 계약(OnboardingRequest.pattern)과 같은 값이어야 한다. */
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+$/;
```

**ADR-6. 완료 화면 「홈으로」를 무엇으로 렌더할까** → **§6 게이트 질문 1**

---

## 4. 구현 계획 체크리스트

> `entities → features → pages → app` 순서. `shared`에 추가할 것은 없다.

**[entities]**

- [ ] `entities/user/model/profile-colors.ts` — 19색 표(1~19) · `getProfileColor(number)` ·
      `getNextProfileColorNumber` · `getPreviousProfileColorNumber` (순환, B3)
- [ ] `entities/user/model/profile-colors.test.ts` — 끝↔처음 순환, 범위 밖 입력 폴백
- [ ] `entities/user/model/nickname.ts` — 규칙 상수 + `isValidNickname` + `normalizeNickname`(trim, C7)
- [ ] `entities/user/model/nickname.test.ts` — 1자/9자/특수문자/공백/한영숫자 경계 (C2)
- [ ] `entities/user/ui/assets/profile-avatar.svg` — legacy `profile2.svg` 그대로. `currentColor` 유지
- [ ] `entities/user/ui/profile-avatar.tsx` — cva `size` 변형. 색은 `profileColorNumber` prop
- [ ] `entities/user/ui/profile-color-picker.tsx` — controlled(`value` · `onChange`).
      좌우는 `IconButton icon="chevron-left|right"` + `aria-label`. 순환은 model 함수 호출
- [ ] `entities/user/ui/nickname-field.tsx` — controlled(`value` · `status` · `onChange`).
      `status`는 `'default' | 'valid' | 'invalid'`. 안내 문구 3종과 테두리 색을 status로 가른다
- [ ] `entities/user/index.ts` — 배럴. 내부 파일을 전부 열지 않는다

**[features]**

- [ ] `features/user-onboarding/api/use-onboard-user.ts` — 생성 `useOnboardUser` 래핑 +
      성공 시 `setQueryData(getGetUserQueryKey(), user)` (§3-2 ①)
- [ ] `features/user-onboarding/model/use-onboarding-form.ts` — 색 번호 · 닉네임 · 200ms 디바운스 ·
      `status` · `canSubmit`(D2·D3) · `submit`(정규화 후 `{ nickname, profilePhotoNumber }`)
- [ ] `features/user-onboarding/model/use-onboarding-form.test.tsx` — 디바운스 전/후 status 전이,
      `canSubmit` 조건(색만 바꾸면 false), 제출 페이로드가 `profilePhotoNumber: 1`인지 (B4·C-1)
- [ ] `features/user-onboarding/ui/onboarding-form.tsx` — 위 조각 조립 + 「다음」(`size="cta"`,
      `isLoading`) + `secondaryAction` 슬롯 (§3-1)
- [ ] `features/user-onboarding/ui/onboarding-form.test.tsx` — MSW로 요청 1회 도달 · 성공 시
      `onSuccess` 호출 · 유효 전 버튼 비활성 (D1·D2·D4)
- [ ] `features/user-onboarding/index.ts` — 배럴

**[pages]**

- [ ] `pages/onboarding/ui/onboarding-page-wide.tsx` — `SpaceBackground` + 워드마크·태그라인 +
      글래스 카드(`glass-morphism-border` 유틸이 이미 이식돼 있다) + `OnboardingForm`
- [ ] `pages/onboarding/ui/onboarding-page-narrow.tsx` — 흰 배경 + `PageHeader title="로그인"`(A6) + `leftSlot`에 취소 chevron(A8·A9) + `secondaryAction`에 「이전」. 둘 다 `useLogout` 사용
- [ ] `pages/onboarding/ui/onboarding-page.tsx` — `useIsWideViewport` 삼항
- [ ] `pages/onboarding/ui/onboarding-page.test.tsx` — 좁은 화면에만 상단바·「이전」이 있는지,
      취소가 세션을 지우고 `/`로 보내는지 (A6·A8·A9)
- [ ] `pages/onboarding/index.ts`
- [ ] `pages/onboarding-success/ui/assets/mascot-{celebrate,end}.png` 반입
- [ ] `pages/onboarding-success/ui/onboarding-success-page-wide.tsx` — 우주 배경 + 글래스 카드 +
      `mascot-end` + 「홈으로」 (E1~E3)
- [ ] `pages/onboarding-success/ui/onboarding-success-page-narrow.tsx` — 흰 배경 + 상단바 없음(A7) + `mascot-celebrate` + 「홈으로」
- [ ] `pages/onboarding-success/ui/onboarding-success-page.tsx` — 뷰포트 삼항 + 사용자 가드(A1·A4)
- [ ] `pages/onboarding-success/ui/onboarding-success-page.test.tsx` — 사용자 없으면 `/onboarding`
      으로 되돌리는지, 「홈으로」가 `/main`인지 (A4·A5)
- [ ] `pages/onboarding-success/index.ts`

**[app]**

- [ ] `app/routes/_protected.onboarding.tsx` — `component: Outlet` 레이아웃으로 변경
      (`_protected.tsx`와 같은 형태)
- [ ] `app/routes/_protected.onboarding.index.tsx` — `component: OnboardingPage`
- [ ] `app/routes/_protected.onboarding.success.tsx` — `component: OnboardingSuccessPage`
- [ ] **라우트 트리 재생성** (`pnpm --filter @repo/web dev` 또는 `build`)
- [ ] 검증은 `ai-validate`로 넘긴다 — `lint` · `check-types` · `test` · `build` 4종 +
      신규 파일 `pnpm exec prettier --check`

---

## 5. 리스크

| 리스크                                                              | 영향                                                          | 대응                                                                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `FIX-001`이 끝나기 전에 완료 화면을 만들면 「홈으로」가 무너진다    | 버튼 스타일이 통째로 사라진다                                 | **선행 작업으로 분리 완료(§6-0).** `FIX-001`이 `done`이 된 뒤에야 `[pages]` 완료 화면 항목을 시작한다                           |
| 미온보딩 사용자에게 `GET /api/v1/users`가 무엇을 주는지 미확정      | 완료 화면 가드(A4)가 반대로 동작할 수 있다                    | 구현 중 MSW·실서버로 확인. 가드를 `!user`가 아니라 **`!user?.isOnboarded`**로 두어 두 응답 형태 모두 안전하게 처리              |
| 라우트 중첩 전환 (`onboarding.tsx` leaf → 레이아웃)                 | 트리 재생성 누락 시 `check-types` 실패, `/onboarding` 빈 화면 | 체크리스트에 재생성 단계 명시. 재생성 후 `/onboarding` 직접 진입 스모크                                                         |
| 마스코트 PNG 2장(152KB)이 양쪽 화면에서 모두 로드                   | 좁은 화면에서 불필요한 다운로드                               | legacy의 `<picture>` 대신 **뷰포트 분기 안에서만** import한다 (`MIG-018`의 배경 이미지와 같은 처리)                             |
| 글래스 카드 값이 `apps/web` 토큰과 어긋난다                         | 시안과 다른 카드가 나온다                                     | `glass-morphism-border` 유틸이 이미 이식돼 있다(실측). 배경 그라디언트 값만 Dev Mode에서 확인                                   |
| 넓은 화면 빈 값 상태의 안내 문구 색이 미확정 (`spec.md` 확인필요 3) | 시안 대조에서 되돌아온다                                      | 구현 착수 시 AOS `O.2` 프레임의 실제 토큰을 Dev Mode에서 확인해 적용. PNG에서 픽셀을 재지 않는다 (`design-source-policy.md` §3) |

> **해소된 리스크** — `spec.md`의 「초록색이 다르다」는 `FIX-007`이 이미 판정했다.
> Figma **칩** 기준으로 `#4CAF50`이 맞고 legacy의 `#00C30D`가 낡은 값이다.
> `apps/web`의 `--color-semantic-success`를 그대로 쓴다. 이 작업에서 토큰을 건드리지 않는다.

### 5-1. 동일성 확인 방법

| 기준선    | 방법        | 구체적 실행                                                                                           |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| B2·B3     | 자동 테스트 | `getPreviousProfileColorNumber(1) === 19` · `getNext(19) === 1`                                       |
| C2·C7     | 자동 테스트 | `ㄱ` false · `그래빗` true · `!!!` false · `  그래빗  ` → 정규화 후 `그래빗`                          |
| C3~C6     | 자동 테스트 | 타이핑 직후 status가 `default`, 200ms 경과 후 `valid`/`invalid`로 바뀌는지 (fake timers)              |
| D2·D3     | 자동 테스트 | 색만 바꾸면 「다음」이 계속 비활성, 닉네임이 유효해지면 활성                                          |
| B4·C-1    | 자동 테스트 | MSW로 요청 본문 가로채 `profilePhotoNumber: 1` 확인                                                   |
| A3·C-4    | 자동 테스트 | 제출 성공 시 `onSuccess`가 1회 호출되는지                                                             |
| A4·A5     | 자동 테스트 | 사용자 없음 → `/onboarding` 리다이렉트 / 「홈으로」의 목적지가 `/main`                                |
| A6·A7·A9  | 자동 테스트 | 좁은 화면 온보딩에만 상단바+chevron, 완료 화면엔 상단바 없음                                          |
| A8·C-5    | 자동 테스트 | 취소 클릭 → 세션 비워짐 + `/`로 이동                                                                  |
| C1·E1~E3  | 명시적 대조 | 문구 8종을 legacy 원문과 1:1 비교해 `checklist.md`에 표로 남긴다                                      |
| 시안      | 수동 스모크 | `pnpm --filter @repo/web dev` → `/onboarding`·`/onboarding/success`를 넓은/좁은 화면에서 Figma와 대조 |
| 전체 흐름 | 수동 스모크 | 로그인 → 콜백 → 온보딩 → 제출 → 완료 → 홈으로. 새로고침으로 완료 화면 유지 확인 (ADR-3)               |

---

## 6. ⏸ 승인 게이트 — 판정 결과 (2026-09-10)

| #   | 질문                       | 판정                                                                    |
| --- | -------------------------- | ----------------------------------------------------------------------- |
| 1   | 완료 화면 「홈으로」       | ✅ **A — `FIX-001`을 선행 작업으로 먼저 고친다.** 이후 `asChild` 사용   |
| 2   | 완료 화면 사용자 가드 (A4) | ✅ **완료 화면만 가드한다.** 온보딩 화면 재진입 차단(A2)은 `MIG-005` 몫 |

### 6-0. 선행 작업 순서 (판정 1의 결과)

`work-management.md` §3에 따라 `in-progress/`에는 하나만 둔다. 따라서 순서는 다음과 같다.

```
FIX-001 (Slottable) → done  ⇒  MIG-024 → in-progress → 구현
```

`FIX-001`이 끝나기 전에는 MIG-024의 `[pages]` 완료 화면 항목을 시작하지 않는다. 나머지
레이어(`entities` · `features`)는 `FIX-001`과 무관하므로 순서상 앞에 있다.

**MIG-024 쪽 영향** — 완료 화면 두 파일에서 아래 형태를 쓴다. `SIZE_CLASS` 복제가 없다.

```tsx
<Button asChild size="cta">
  <Link to="/main">홈으로</Link>
</Button>
```

### 6-1. 판정의 근거 (기록용)

**질문 1. 완료 화면 「홈으로」를 무엇으로 렌더할까 (`FIX-001` 관련)**

| 안                                                  | 결과                                                                                      | 비용                                                              |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **A. `FIX-001`을 선행 작업으로 먼저 고친다** (권장) | `<Button asChild><Link to="/main">`가 정상 동작. legacy `LinkButton`과 같은 앵커 시맨틱   | `Slottable` 적용 + 테스트. 별도 PR 1건                            |
| B. `Link` + `buttonVariants()` 직접 조합            | 같은 결과지만 `size="cta"` 클래스를 손으로 복제해야 한다 (`SIZE_CLASS`가 export되지 않음) | 값 중복 — 버튼 크기 값이 갈라진다                                 |
| C. `Button onClick={navigate}`                      | 지금 바로 가능                                                                            | 앵커가 아니게 된다(새 탭·가운데 클릭 불가). 의도적 변경 기록 필요 |

A를 권장한다. `FIX-001`은 `to-do`에 `priority: high`로 이미 특정돼 있고 수정 범위가 작으며,
앞으로 나올 모든 「링크를 CTA 모양으로」 화면이 같은 벽에 부딪힌다. `work-management.md` §7의
「파이프라인을 막는 항목만 승인받아 처리」 선례(`REF-002`)와 같은 성격이다.

**질문 2. 완료 화면의 사용자 가드(A4)를 이번에 포함할까**

`spec.md`는 게이트(`MIG-005` Issue 4)를 범위 밖으로 두면서 ADR-3에서는 A4를 「그대로 옮긴다」고
적어 서로 어긋났다. **A4만 포함**으로 판정됐다 — 없으면 `/onboarding/success`에 직접 들어온
사람에게 「계정 생성 완료!」가 거짓으로 보인다. 온보딩 화면 쪽 재진입 차단(A2)은 게이트 몫으로
남긴다. 이 비대칭은 의도된 것이며 `checklist.md`에 사유와 함께 남긴다.

---

## 7. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 `git mv`
- [ ] `docs/implementation-status.md`의 `O.2`~`O.5` 행 갱신 (구현·검증 열)
- [ ] **`docs/implementation-status.md` · `docs/fe-implement-spec/README.md`의 화면 ID 정정** —
      현재 문서의 `O.2.1`·`O.2.2`는 **현행 Figma에 없는 이름**이다(`spec.md` 시안 대조 결과).
      WEB `O.3`/`O.4`/`O.5` · AOS `O.2`~`O.5`로 맞춘다
- [ ] `docs/migration-status.md`의 「온보딩 | `/onboarding`, `/success`」 행 갱신.
      **경로가 `/onboarding/success`로 바뀐 사실**도 함께 적는다 (ADR-3)
- [ ] 확정 명세를 `docs/fe-implement-spec/o-3/`(WEB 기준 ID)로 승격
- [ ] `entities/user`가 첫 entity 슬라이스이므로 **위치 컨벤션 선례**를 `docs/conventions/` 또는
      `.claude/rules/fsd-entities.md`에 한 줄 남길지 판단
- [ ] `CLAUDE.md`의 「`features/`와 `entities/`는 아직 없다」 문장이 이미 낡았다 —
      갱신 대상으로 기록 (실측: `entities/auth` · `features/auth-login` · `features/auth-logout` 존재)
