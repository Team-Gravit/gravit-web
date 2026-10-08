---
id: 'MIG-024'
validated: '2026-09-10'
mode: 'migrate'
---

# MIG-024 검증 결과

> `ai-validate` 산출물. **생략 금지.**

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                                    |
| --- | --------------- | -------------------------------------------------- | --------------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ No problems found (eslint + steiger) |
| 2   | 타입            | `pnpm check-types`                                 | ✅ 2 tasks 통과                         |
| 3   | 테스트          | `pnpm test`                                        | ✅ 22 files / **134 tests** (87 → 134)  |
| 4   | 빌드            | `pnpm build`                                       | ✅ 통과                                 |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 28개 파일>` | ✅                                      |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 0건                                  |

`pnpm format:check` 전체는 `REF-003`의 기존 실패가 있어 돌리지 않았다. 변경 파일 목록을
명시적으로 넘겨 검사했다.

**재검증 1회.** 라우트 3개를 추가한 뒤 `check-types`가 실패했다 — 원인과 조치는 §6.

## 2. 요구사항 ↔ 구현 대조

`spec.md`의 「동일성 확인 방법」과 기준선 항목을 대조한다.

| #   | 확인 항목                    | 기준선   | 구현 위치                                                                   | 상태 |
| --- | ---------------------------- | -------- | --------------------------------------------------------------------------- | ---- |
| 1   | 색 19가지 · 첫 진입 1번      | B2       | `entities/user/model/profile-colors.test.ts` 「색은 19가지이고…」           | ✅   |
| 2   | 끝↔처음 순환                | B3       | 〃 「마지막에서 다음을…」 · 「처음에서 이전을…」                            | ✅   |
| 3   | 닉네임 2~8자 · 한/영/숫자    | C2       | `entities/user/model/nickname.test.ts` (경계 5종 + 위반 5종)                | ✅   |
| 4   | 제출 시 앞뒤 공백 제거       | C7 · C-3 | 〃 `normalizeNickname` · `use-onboarding-form.test.tsx` 제출 페이로드       | ✅   |
| 5   | 입력 후 지연 판정 (300ms)    | C3       | `use-onboarding-form.test.tsx` 「입력 직후에는 판정을 미루고…」             | ✅   |
| 6   | 빈 값·입력 전 안내 2줄       | C4       | `onboarding-form.test.tsx` 「입력 전에는 「다음」이 비활성이고…」           | ✅   |
| 7   | 유효 시 초록 문구            | C5       | 〃 「규칙에 맞는 닉네임을 넣으면…」                                         | ✅   |
| 8   | 무효 시 빨강 문구            | C6       | 〃 「규칙에 어긋난 닉네임을 넣으면…」                                       | ✅   |
| 9   | 유효 전까지 「다음」 비활성  | D2 · D1  | 〃 (같은 두 테스트가 버튼 상태까지 단언)                                    | ✅   |
| 10  | 색만 바꾸면 계속 비활성      | D3       | `use-onboarding-form.test.tsx` 「색만 바꾸고 닉네임을 넣지 않으면…」        | ✅   |
| 11  | `profilePhotoNumber: 1` 전송 | B4 · C-1 | 〃 「첫 색을 그대로 두고 제출하면…」 (MSW 로 요청 본문 확인)                | ✅   |
| 12  | 제출 성공 시 완료 화면으로   | A3 · C-4 | 〃 「제출에 성공하면 onSuccess 를…」 + `onboarding-page-*.tsx` 의 navigate  | ✅   |
| 13  | 완료 화면 문구 2종           | E1       | `onboarding-success-page.test.tsx` 「온보딩을 마친 사용자에게…」            | ✅   |
| 14  | 「홈으로」 목적지 `/main`    | A5 · E3  | 〃 (`href` 단언)                                                            | ✅   |
| 15  | 사용자 없으면 `/onboarding`  | A4       | 〃 「사용자 정보를 찾을 수 없으면…」 · 「온보딩을 마치지 않은 사용자도…」   | ✅   |
| 16  | 조회 중에는 그리지 않는다    | A1       | `onboarding-success-page.tsx` 의 `isPending` 가드                           | ✅   |
| 17  | 좁은 화면 상단바 「로그인」  | A6       | `onboarding-page.test.tsx` 「좁은 화면이면 「로그인」 상단바와…」           | ✅   |
| 18  | 완료 화면에는 상단바 없음    | A7       | `onboarding-success-page.test.tsx` 「완료 화면에는 상단바가 없다」          | ✅   |
| 19  | 이탈 시 토큰 삭제 후 `/`     | A8 · C-5 | `onboarding-page.test.tsx` 「좁은 화면에서 온보딩을 취소하면…」             | ✅   |
| 20  | 취소는 온보딩 화면에만       | A9       | 〃 「넓은 화면이면 상단바와 「이전」이 없고…」 + 완료 화면 상단바 없음      | ✅   |
| 21  | 마스코트가 폭에 따라 2종     | E2       | `onboarding-success-page-{wide,narrow}.tsx` 의 서로 다른 import             | ✅   |
| 22  | 제출 중 로딩 표시            | D4       | `onboarding-form.tsx` `isLoading={isSubmitting}` (동작은 `button.test.tsx`) | ✅   |
| 23  | 제출 실패 시 알리지 않는다   | F1       | `use-onboard-user.ts` 에 `onError` 없음                                     | ✅   |
| 24  | 레이블·플레이스홀더 원문     | C1       | §2-1 문구 대조표                                                            | ✅   |

### 2-1. 문구 1:1 대조

legacy 원문과 새 코드의 문자열을 직접 비교했다.

| 문구                                  | legacy 위치         | 새 위치                      | 동일 |
| ------------------------------------- | ------------------- | ---------------------------- | ---- |
| `닉네임 설정`                         | `nickname-form.tsx` | `nickname-field.tsx` `LABEL` | ✅   |
| `닉네임을 입력해주세요.`              | 〃 (기본 prop)      | 〃 `PLACEHOLDER`             | ✅   |
| `사용 가능한 닉네임이에요.`           | 〃                  | 〃 `VALID_MESSAGE`           | ✅   |
| `사용할 수 없는 닉네임이에요.`        | 〃                  | 〃 `INVALID_MESSAGE`         | ✅   |
| `*글자수 2~8자`                       | 〃                  | 〃 `HELPER_MESSAGES[0]`      | ✅   |
| `*공백, 특수문자 제외`                | 〃                  | 〃 `HELPER_MESSAGES[1]`      | ✅   |
| `다음`                                | `onboarding.tsx`    | `onboarding-form.tsx`        | ✅   |
| `로그인` (상단바)                     | `entry-layout.tsx`  | `onboarding-page-narrow.tsx` | ✅   |
| `계정 생성 완료!`                     | `success.tsx`       | `onboarding-success-page-*`  | ✅   |
| `그래빗의 일원이 된 걸 환영해요!`     | 〃                  | 〃                           | ✅   |
| `홈으로`                              | 〃                  | 〃                           | ✅   |
| `그래빗과 함께 CS 지식을 마스터해요!` | `entry-layout.tsx`  | `onboarding-page-wide.tsx`   | ✅   |

`이전` 은 legacy에 없다 — 시안(AOS)에 있어 판정으로 추가한 문구다 (§3-1 참고).

## 3. 이전 검증

| 항목                                     | 결과                                                              |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `plan.md` §2-1 이전 매핑이 전량 반영됐나 | ✅ 16행 전부. 아래 표 참고                                        |
| 동작 동일성 — 기준선이 유지되나          | ✅ A1·A3~A9 · B1~B4 · C1~C7 · D1~D4 · E1~E3 · F1 (§2에 근거 표시) |
| 의도적으로 바꾼 것만 바뀌었나            | ✅ §3-1의 8건. 그 외 변경 없음                                    |
| 남은 legacy 참조가 없나                  | ✅ `colorIndex` · `ProfileColor` · `profile2` · `EntryLayout` 0건 |

**범위 밖으로 남긴 기준선** — A2(온보딩 화면 재진입 차단)는 `MIG-005` Issue 4의 게이트 몫이다.
`spec.md` Out of Scope와 `plan.md` §6 질문 2의 판정에 따른 것이다.

### 이전 매핑 대조

| 계획한 이동                                                                               | 결과                                  | 확인 |
| ----------------------------------------------------------------------------------------- | ------------------------------------- | ---- |
| `shared/lib/ProfileColor.ts` → `entities/user/model/profile-colors.ts`                    | 1-based 로 개편해 이전                | ✅   |
| `shared/assets/icons/profile2.svg` → `entities/user/ui/assets/profile-avatar.svg`         | 그대로 복사                           | ✅   |
| `entities/user/ui/profile.tsx` → `ui/profile-avatar.tsx`                                  | cva 대신 `className` (§3-1 ②)         | ✅   |
| `features/profile/ui/profile-selector.tsx` → `ui/profile-color-picker.tsx`                | controlled 로 개편                    | ✅   |
| `features/profile/ui/nickname-form.tsx` → `ui/nickname-field.tsx`                         | 표시부만 분리                         | ✅   |
| `use-nickname-form.ts`(규칙) → `model/nickname.ts`                                        | zod 제거 (ADR-5)                      | ✅   |
| `use-nickname-form.ts`(디바운스) + `use-profile-form.ts` → `model/use-onboarding-form.ts` | 병합                                  | ✅   |
| `features/onboarding/api/usePostOnboarding.ts` → `api/use-onboard-user.ts`                | 캐시 시딩 추가 (§3-1 ①)               | ✅   |
| `_onboarding/onboarding.tsx` → `pages/onboarding/ui/*`                                    | wide·narrow 로 분해                   | ✅   |
| `_onboarding/success.tsx` → `pages/onboarding-success/ui/*`                               | 〃                                    | ✅   |
| `entry-layout.tsx`의 `OnboardingBackButton` → 좁은 화면 페이지                            | `useLogout` 재사용으로 상향 참조 제거 | ✅   |
| `entry-layout.tsx`의 껍데기 → `SpaceBackground`·`PageHeader`                              | 기존 것 재사용, 신규 생성 없음        | ✅   |
| 마스코트 2종 → `pages/onboarding-success/ui/assets/`                                      | 그대로 복사                           | ✅   |
| 화살표 SVG → **가져옴**                                                                   | ADR-4 를 뒤집었다. §3-1 ⑩             | ✅   |

**계획에 없었던 추가** — `entities/user/api/index.ts`. 완료 화면이 사용자 조회를 해야 하는데
`api-convention.md` §3이 화면의 생성 경로 직접 참조를 금지한다. 변환 없이 이름만 좁혀
re-export 했다 (같은 절의 「추가 정책이 없다면 선택적으로 re-export」).

### 3-1. 의도적으로 바꾼 것

| #   | 항목                                                    | 이유                                                                                                                                                       |
| --- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ①   | 성공 시 사용자 조회 캐시를 채운다                       | legacy 결함. 무효화도 시딩도 없어 **가입 성공자가 완료 화면에서 입력 화면으로 튕길 수 있다.** 계약 C-4 보존                                                |
| ②   | 프로필 색을 1-based 번호로 통일                         | legacy 는 인덱스를 들고 다니다 전송 직전 `+1` 하나로 계약 C-1 을 지킨다. 전 구간 번호로 바꿔 off-by-one 여지 제거                                          |
| ③   | 완료 화면 경로 `/success` → `/onboarding/success`       | ADR-3. `_protected` 아래로 넣으면서 온보딩 흐름 아래에 둔다                                                                                                |
| ④   | 좁은 화면에 하단 「이전」 추가                          | 시안(AOS)에 있다. `spec.md` 판정 결과 #2 「시안대로 간다」                                                                                                 |
| ⑤   | 좌우 화살표·취소 버튼에 접근 가능한 이름                | legacy 에는 없다. `component-convention.md` §7 이 아이콘 전용 버튼에 요구한다                                                                              |
| ⑥   | 좁은 화면 완료 마스코트를 가운데 정렬                   | legacy 는 `mr-auto` 로 왼쪽에 붙인다. AOS `O.5` 시안은 가운데다. Figma 가 SoT                                                                              |
| ⑦   | 카드 그림자를 옮기지 않음                               | legacy 값 `drop-shadow-[0_4px_32px_0,rgba(0,0,0,2.4)]` 은 쉼표·알파 2.4 로 문법이 깨져 있다. 새 shadow 는 `design-source-policy.md` §6 이 막는다           |
| ⑧   | `rounded-xl`·`rounded-lg` → `rounded-12`·`rounded-8`    | `apps/web` 은 `--radius-*: initial` 로 t-shirt 이름을 지웠다. 숫자 토큰만 있다                                                                             |
| ⑨   | 디바운스 200ms → **300ms**                              | 한 글자마다 판정이 번갈아 뜨는 체감을 줄인다. legacy 값에서 벗어나므로 기록해 둔다                                                                         |
| ⑩   | 전용 화살표 SVG 반입 (**ADR-4 뒤집음**)                 | 생성 `chevron-*` 이 시안의 화살표와 굵기·형태가 다르다                                                                                                     |
| ⑪   | 완료 화면으로 `replace` 이동                            | push 면 뒤로 가기가 제출 끝난 폼으로 돌아오고, 그 화면의 「이전」이 멀쩡한 계정을 로그아웃시킨다. legacy 는 A2 가드로 막던 구멍이다                        |
| ⑫   | 공백만 입력한 값의 안내가 바뀌었다                      | `'   '` 은 legacy 가 규칙 안내를 보여줬으나 지금은 「사용할 수 없는 닉네임이에요.」가 뜬다 (기준선 C4)                                                     |
| ⑬   | `--color-semantic-success` 를 `#00C30D` 로 되돌림       | **`FIX-007` 의 판정(`#4CAF50`)과 어긋난다.** 그 문서에 근거를 남겨야 한다                                                                                  |
| ⑭   | 낮은 뷰포트에서 **여백만** 줄이는 `short:` variant 도입 | 시안이 높이 1080 에서 그려져 세로 768 노트북에서 스크롤이 생겼다. §3-2                                                                                     |
| ⑮   | `/onboarding` 에 진입 가드를 넣었다                     | 기준선 A2 를 결국 이번 범위에 포함했다. 막지 않으면 가입을 마친 사람이 빈 폼을 다시 보고, 좁은 화면의 「이전」이 멀쩡한 계정의 세션을 지운다               |
| ⑯   | `/onboarding/success` 를 **흐름 통과권**으로 지킨다     | `isOnboarded` 로 지키면 범위가 너무 넓어 오래 전 가입자도 완료 화면을 다시 본다. 「방금 이 흐름에서 제출했는가」는 서버 값이 아니라 라우터 state 로 넘긴다 |
| ⑰   | 두 가드를 컴포넌트가 아니라 라우트 `beforeLoad` 에 뒀다 | 렌더 후 `<Navigate>` 로 되돌리면 빈 화면이 한 번 깜빡인다                                                                                                  |

`NicknameFieldStatus` 에 `checking` 을 넣은 것은 **변경이 아니라 보존**이다. legacy 는 디바운스
디바운스 동안 안내 2줄이 사라지고 아무것도 보이지 않는다(세 조건이 모두 false 인 구간). 3상태로
만들면 그 동작이 바뀐다.

### 3-2. 넓은 화면 세로 공간 (§3-1 ⑭)

넓은 화면 시안은 **높이 1080** 에서 그려졌다. 그 여백을 그대로 쓰면 세로가 낮은 노트북에서
넘쳐 스크롤이 생긴다. 토큰 값으로 합산해 확인했다.

| 화면           | 조정 전 | 1920x1080 (~940) | 1440x900 (~780) | 1366x768 (~650) |
| -------------- | ------: | ---------------- | --------------- | --------------- |
| 온보딩 (넓은)  |   759px | 여유             | 통과            | **109px 초과**  |
| 계정 생성 완료 |   785px | 여유             | 통과            | **135px 초과**  |

**단위 문제가 아니다.** Tailwind v4 의 `--spacing` 기본값이 `0.25rem` 이고 이 레포는 재정의하지
않아 여백은 이미 rem 이다. 임의 px 값을 rem 으로 바꿔도 렌더 결과는 한 픽셀도 달라지지 않는다.
총 높이가 뷰포트보다 큰 것이 원인이다.

**해결 — 높이 기준 variant 를 만들어 여백에만 붙였다.**

```css
/* app/styles/index.css */
@custom-variant short (@media (max-height: 779px));
```

너비가 아니라 **높이**로 가른다. 로고·아바타·입력·CTA 처럼 시안이 정한 크기는 그대로 두고
spacing 만 줄인다. spacing 은 Figma 공통 토큰이 없어 원래 우리 판단 영역이다
(`design-source-policy.md` §6).

| 대상                     | 낮은 화면   | 800px 이상       |  절약 |
| ------------------------ | ----------- | ---------------- | ----: |
| 배경 상하 여백           | `py-10`     | `short:py-6`     |  32px |
| 로고 높이                | `h-[90px]`  | `short:h-16`     |  26px |
| 카드 위 간격             | `mt-8`      | `short:mt-5`     |  12px |
| 카드 안쪽 여백           | `p-8`       | `short:p-6`      |  16px |
| 폼 상단 여백             | `md:pt-13`  | `short:md:pt-6`  |  28px |
| 완료 화면 본문 최소 높이 | `min-h-100` | `short:min-h-75` | 100px |

조정 후 온보딩 **645px** · 완료 화면 **599px** 로 세로 768 노트북에서도 스크롤이 없다.
빌드 산출물에서 6개 유틸이 모두 생성되고 `short:md:pt-6` 이
`@media(max-height:779px){@media(min-width:768px){…}}` 로 중첩되는 것과, 5쌍 모두
`short:` 가 기본값 뒤에 와서 캐스케이드에서 이기는 것을 확인했다.

**좁은 화면은 건드리지 않았다.** 모바일은 원래 스크롤이 자연스럽고 시안도 그 전제다.

> **다른 화면도 같은 문제를 가질 수 있다.** 로그인·리그도 같은 우주 배경 카드를 쓴다.
> `tall:` 은 공용 variant 이므로 그 화면들을 이전할 때 같은 방식으로 맞춘다.

## 4. 시안 대조 재확인

| #   | `spec.md` 판정               | 반영 결과                                                      | 상태 |
| --- | ---------------------------- | -------------------------------------------------------------- | ---- |
| 0   | 오류 문구 조건별 2문구       | 형식 오류 문구만 구현. 중복 문구는 #1 에 따라 제외             | ✅   |
| 1   | 중복 닉네임 상태 제외        | 구현하지 않음. 전용 에러 코드 확보 후 별도 작업                | ✅   |
| 2   | 좁은 화면 chevron + 「이전」 | 둘 다 있고 같은 동작(취소). 넓은 화면에는 없음                 | ✅   |
| 3   | 넓은 화면 빈 값 안내 문구 색 | **미해결.** 아래 참고                                          | ⚠️   |
| 4   | 상단바 제목 「로그인」       | 그대로 이전                                                    | ✅   |
| 5   | 제출 실패 알림 없음          | legacy 그대로                                                  | ✅   |
| —   | 초록 토큰 불일치             | `FIX-007` 이 Figma 칩 기준 `#4CAF50` 로 이미 판정. 그대로 사용 | ✅   |

### ⚠️ 남은 시안 확인 1건

`spec.md` 확인 필요 3 — 「넓은 화면 빈 값 상태의 안내 문구 색을 Dev Mode 에서 확인해 적용」을
**수행하지 못했다.** 이 세션에서 Figma MCP 인증이 없어 노드 값을 읽을 수 없었고,
`design-source-policy.md` §3 이 PNG 픽셀 역산을 금지한다.

현재 값은 legacy 를 그대로 유지한 상태다.

| 화면      | 안내 문구 색       | 근거          |
| --------- | ------------------ | ------------- |
| 좁은 화면 | `text-text-4`      | legacy · 시안 |
| 넓은 화면 | `md:text-text-1-w` | legacy        |

지시는 「AOS 를 참고」였으나 AOS 값(회색)을 반투명 카드에 그대로 쓰면 대비가 떨어질 수 있어
임의로 바꾸지 않았다. **Dev Mode 확인 후 별도로 판정한다.**

## 5. 기준 문서 갱신

| 대상                               | 갱신 내용                                              | 상태      |
| ---------------------------------- | ------------------------------------------------------ | --------- |
| `docs/implementation-status.md`    | `O.2`~`O.5` 행 갱신 + **없는 ID `O.2.1`·`O.2.2` 제거** | ✅        |
| `docs/migration-status.md`         | 온보딩 행 갱신 + 경로 변경 명시                        | ✅        |
| `docs/fe-implement-spec/README.md` | 화면 ID 표기 정정                                      | ✅        |
| `docs/fe-implement-spec/o-3/`      | 온보딩 확정 명세 승격                                  | ✅        |
| `docs/fe-implement-spec/o-5/`      | 계정 생성 완료 확정 명세 승격                          | ✅        |
| `docs/design-system/`              | 새로 정한 토큰·컴포넌트 규격 없음                      | 해당 없음 |

## 6. 중간에 막혔던 지점 — 스킬에 반영할 것

**① 라우트를 leaf 에서 레이아웃으로 바꿀 때도 트리 재생성이 필요하다**

`_protected.onboarding.tsx` 를 `Outlet` 레이아웃으로 바꾸고 자식 2개를 추가하자
`check-types` 가 이렇게 실패했다.

```
error TS2322: Type '"/onboarding/success"' is not assignable to type
  '"." | ".." | "/" | "/privacy" | ... | "/onboarding"'
```

`ai-orchestrate` §4 가 이미 다루는 함정이라 `pnpm --filter @repo/web exec vite build` 로 해결했다.
다만 §4 는 「라우트를 **추가**했으면」이라고만 적혀 있다. **기존 leaf 라우트를 부모로 승격하는
경우**도 같은 처리가 필요하다는 것을 덧붙이면 좋겠다.

**② `Slottable` 은 Fragment 안에 있으면 소용없다** (`FIX-001` 에서 겪음)

`React.Children.toArray` 가 Fragment 를 펼치지 않아 Slot 이 병합 대상을 못 찾는다.
`component-convention.md` §11 에 예시와 함께 반영했다.

**③ props 타입을 배타 유니온으로 좁히면 spread 호출부가 먼저 깨진다**

`ButtonProps` 를 유니온으로 바꾸자 `{...args}` + 인라인 판별자 조합을 쓰던 Storybook 2곳과
`Omit<ComponentProps<typeof Button>, ...>` 로 props 를 파생하던 `IconButton` 이 실패했다.
`Omit` 은 유니온에 분배되지 않아 판별이 무너진다. **공용 컴포넌트의 props 를 유니온으로 바꿀
때는 파생 타입을 쓰는 호출부를 먼저 세어 보는 것**이 안전하다.

**④ 기준선 표에 없는 상태가 코드에 있을 수 있다**

`spec.md` 기준선은 닉네임 안내를 3상태(C4·C5·C6)로 적었지만, legacy 코드에는 디바운스 중
아무것도 보이지 않는 **네 번째 구간**이 있었다. 세 플래그가 동시에 false 가 되는 조합이라
표에 드러나지 않는다. `refactor-baseline` 이 조건식을 옮길 때 **분기의 합집합이 전체를
덮는지** 확인하는 항목을 두면 좋겠다.

**⑤ `app/routes/` 에 셸 리다이렉트로 파일을 쓰면 안 된다**

`cat > apps/web/src/app/routes/....tsx << 'EOF'` 로 라우트 파일을 쓰다가 **내용이 통째로
날아갔다.** TanStack Router 워처가 먼저 반응해 기본 스캐폴드로 덮어썼다.

```tsx
// 내가 쓴 내용이 이렇게 바뀌어 있었다
export const Route = createFileRoute('/_protected/onboarding/success')({
  component: RouteComponent,
});
function RouteComponent() {
  return <div>Hello "/_protected/onboarding/success"!</div>;
}
```

`cat >` 가 파일을 **먼저 비우기 때문에**, 그 순간 워처가 「빈 라우트 파일 = 새로 만든 것」으로
보고 템플릿을 써넣는다. **타입 검사도 빌드도 통과한다** — 유효한 라우트이기 때문이다.
테스트가 `beforeLoad is not a function` 으로 죽고 나서야 알았다.

dev 서버가 떠 있으면 언제든 재현된다. `ai-orchestrate` 에 「라우트 파일은 편집 도구로 쓴다」를
넣는 것이 좋겠다.

**⑥ `redirect()` 의 목적지는 `error.to` 가 아니다**

가드를 테스트하려고 `redirect` 를 잡아 목적지를 확인하는데, `AnyRedirect` 에는 `to` 가 없다.
실제 구조는 `{ options: { to, statusCode } }` 라 **`error.options.to`** 를 봐야 한다.
타입 에러로도 드러나지만 런타임에서는 조용히 `undefined` 가 나온다.

**⑦ Tailwind 는 정의되지 않은 variant 를 조용히 버린다**

`short:` 를 쓰는 코드만 커밋하고 `@custom-variant` 정의를 빠뜨린 상태로 빌드해 봤더니
**에러 없이 규칙이 0건 생성**됐다. lint·타입·빌드 모두 통과한다. 커스텀 variant 는
**정의와 첫 사용처를 같은 커밋에** 두어야 한다.

## 7. 남은 일

| 항목                                   | 성격                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------- |
| 넓은 화면 안내 문구 색 (§4)            | Figma Dev Mode 확인 후 판정                                               |
| `FIX-007` 초록 토큰 판정 갱신 (§3-1 ⑬) | 되돌린 근거를 그 문서에 남겨야 한다                                       |
| 완료 화면 진입 통과권                  | 「방금 제출함」을 흐름 상태로 넘기는 건 legacy 에 없던 동작이라 별도 작업 |
| 수동 스모크 — 시안 대조 · 전체 흐름    | 사용자 확인 필요. `기능 검증` 열이 여기 달렸다                            |
| 색 변경을 스크린리더에 알리는 수단     | legacy 에도 없다. 문구가 제품 결정이라 새 항목 후보                       |
