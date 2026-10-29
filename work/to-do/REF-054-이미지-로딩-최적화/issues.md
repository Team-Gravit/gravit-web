---
id: 'REF-054'
---

# REF-054 이슈 분해

> `refactor-planner` 산출물. 각 이슈는 **끝나도 기존 사용자 동작이 그대로 유지되는 단위**다.
> 보존 계약 C1 ~ C8 · 이전 매핑 M1 ~ M14는 `spec.md`에 있다.
> `[성능]`은 화면 모양이 바뀌지 않는 이슈, `[시안]`은 새 시안으로 모양이 바뀌는 이슈다. 둘은 섞지 않는다.
>
> **범위 레이블:** `단위` 순수 함수 · 훅 / `통합` RTL 렌더링 / `빌드` 빌드 결과물 확인 스크립트 / `측정` Lighthouse · 픽셀 비교 스크립트(REF-072 도구).
>
> **LCP 판정 기준(`측정`):** 같은 조건으로 기준 빌드 · 변경 빌드를 번갈아 5회 잰 중앙값을 비교한다. 「흔들림」은 같은 빌드를 다른 포트에 한 번 더 띄워 잰 중앙값 차이다. **변경 빌드 LCP ≤ 기준 LCP + 흔들림**이면 통과다.
>
> **시안 픽셀 비교(`측정`):** Figma에서 같은 영역을 2배로 내보낸 원본과, 같은 폭으로 렌더링한 화면을 픽셀 비교한다. 기준은 **최대 차이 4/255 이하**(장식 합성 검증 값).

**이슈 크기**: 반나절 ~ 하루. **의존성**: 실제 입력 · 계약 관계만 적는다.

---

## Issue 1: [성능] 리그 배경을 webp · avif로 바꾸고 빌드 변환 도입

GitHub Issue: [#350](https://github.com/Team-Gravit/gravit-web/issues/350)

### 설명

리그 화면 데스크톱 배경이 PNG 1.8 MB라 화면을 열 때마다 크게 받는다. 빌드 때 이미지를 변환하는 `vite-imagetools`를 이 화면에 처음 적용해, 도구가 Vite 5에서 동작하는지와 빌드 시간 · webp/avif 크기 차이를 함께 확인한다.

### 구현 범위

- `apps/web/package.json` · `vite.config.ts` (M1)
- `pages/league/ui/league-page.tsx` · `pages/league/ui/assets/` (M9)

### 관련 결정

- 기준선: `spec.md` 현행 기준선 §1 · 계약 C3 · C8
- ADR: 확인 필요 1(변환 방법) · 2(avif 병행)

### 이 이슈가 담당하는 매핑

| 현재                      | 목표                                          | 변경 종류 |
| ------------------------- | --------------------------------------------- | --------- |
| 이미지 변환 없음          | `vite-imagetools` 9.0.3 · import 규칙         | 도구 도입 |
| 리그 PNG 1,835 KB · 65 KB | avif → webp `<picture>` · 표시 크기 기준 크기 | 형식      |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 리그 화면
When 렌더링하면
Then 배경 `<picture>`에 `min-width: 768px` 조건의 데스크톱 소스가 있고, 어두운 덮개 요소가 1개 있다 (`league-page.test.tsx` 통과)

☐ **AC-2** (범위: 빌드)
Given 프로덕션 빌드
When 빌드 결과물의 리그 데스크톱 배경 파일을 확인하면
Then avif · webp 파일이 각각 있고 둘 다 1,835 KB보다 작다. 두 형식의 크기 차이를 spec에 기록한다

☐ **AC-3** (범위: 빌드)
Given `develop`과 이 이슈 빌드
When `pnpm --filter @repo/web build` 시간을 3회씩 재면
Then 중앙값 증가가 10초 이하다. 넘거나 Vite 5에서 빌드가 실패하면 확인 필요 1의 ①(변환 스크립트)로 바꾸고 멈춘다

### 의존성

없음

---

## Issue 2: [성능] 레슨 결과 이미지를 표시 크기에 맞게 줄이기

GitHub Issue: [#351](https://github.com/Team-Gravit/gravit-web/issues/351)

### 설명

레슨 결과 데스크톱 배경 장식이 4320px(410 KB), 모바일 달이 1595px로 표시 크기의 2배를 크게 넘는다. 크기만 맞추고 페이드인 순서는 그대로 둔다.

### 구현 범위

`pages/lesson-result/ui/result-background.tsx` · `result-hero.tsx` · `assets/` (M10)

### 관련 결정

- 기준선: 계약 C1 · C8 · 테스트 `result-background.test.tsx` · `result-hero.test.tsx` · `lesson-result-page.test.tsx`

### 이 이슈가 담당하는 매핑

| 현재                                          | 목표                                       | 변경 종류   |
| --------------------------------------------- | ------------------------------------------ | ----------- |
| 배경 장식 4320×3051 · 달 1595×1685 · 마스코트 | 표시 크기 2배 기준 `srcset` · 큰 배경 avif | 형식 · 크기 |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 배경 · 마스코트 이미지의 `load` 이벤트
When 레슨 결과 화면을 렌더링하면
Then 모든 이미지가 디코딩된 뒤에만 준비 신호가 1번 호출된다 (기존 테스트 통과)

☐ **AC-2** (범위: 통합)
Given 배경 이미지 `error` 이벤트
When 이미지를 불러오지 못하면
Then 준비 신호가 1번 호출된다 (기존 테스트 통과)

☐ **AC-3** (범위: 빌드)
Given 프로덕션 빌드
When 데스크톱 배경 장식 파일을 확인하면
Then 가장 큰 후보의 가로가 3840px 이하이고 410 KB보다 작다

### 의존성

Issue 1 (변환 도구)

---

## Issue 3: [성능] 퀴즈 로딩 마스코트 크기 줄이기

GitHub Issue: [#352](https://github.com/Team-Gravit/gravit-web/issues/352)

### 설명

퀴즈에 들어갈 때마다 받는 애니메이션 마스코트가 1080px(449 KB)이다. 표시 높이는 330 · 460px이라 2배 기준(약 920px)보다 크다.

### 구현 범위

`widgets/quiz-screen/ui/quiz-loading-screen.tsx` · `assets/` (M11)

### 관련 결정

- 기준선: 계약 C2 · 테스트 없음 → 모션 감소 환경 수동 확인

### 이 이슈가 담당하는 매핑

| 현재                             | 목표                            | 변경 종류 |
| -------------------------------- | ------------------------------- | --------- |
| 애니메이션 webp 1080×1089 449 KB | 2배 기준 축소 · 애니메이션 유지 | 크기      |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given `prefers-reduced-motion: reduce`
When 퀴즈 로딩 화면을 렌더링하면
Then `<picture>`에 그 조건의 정지 프레임 `<source>`가 1개 있다

☐ **AC-2** (범위: 빌드)
Given 프로덕션 빌드
When 로딩 마스코트 파일을 확인하면
Then 애니메이션 프레임 수가 원본과 같고 449 KB보다 작다. 빌드 변환이 애니메이션을 유지하지 못하면 수동 변환으로 바꾸고 spec에 기록한다

### 의존성

Issue 1 (변환 도구)

---

## Issue 4: [성능] 남은 PNG 이미지를 webp로

GitHub Issue: [#353](https://github.com/Team-Gravit/gravit-web/issues/353)

### 설명

온보딩 완료 마스코트 2개와 푸터 로고가 PNG이고 표시 크기보다 크다. 형식과 크기만 맞춘다.

### 구현 범위

`pages/onboarding-success/ui/` · `widgets/footer/ui/footer.tsx` (M12 중 이미지 형식)

### 관련 결정

- 기준선: 계약 C6 · C8 · 테스트 `onboarding-success-page.test.tsx` · `footer.test.tsx`

### 이 이슈가 담당하는 매핑

| 현재                                             | 목표                      | 변경 종류   |
| ------------------------------------------------ | ------------------------- | ----------- |
| 마스코트 PNG 837×707 · 561×707 · 로고 PNG 388×72 | webp · 표시 크기 2배 기준 | 형식 · 크기 |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 푸터
When 렌더링하면
Then 앱센터 로고 `<img>`의 대체 텍스트가 「앱센터 로고」다 (기존 테스트 통과)

☐ **AC-2** (범위: 통합)
Given 온보딩 완료 화면(좁은 · 넓은)
When 렌더링하면
Then 마스코트 `<img>`가 각각 1개이고 `alt`가 빈 문자열이다 (기존 테스트 통과)

☐ **AC-3** (범위: 빌드)
Given 프로덕션 빌드
When 세 이미지 파일을 확인하면
Then PNG가 없고 각각 원본(78 · 70 · 17 KB)보다 작다

### 의존성

Issue 1 (변환 도구)

---

## Issue 5: [성능] 첫 화면 밖 행성 이미지 지연 로딩

GitHub Issue: [#354](https://github.com/Team-Gravit/gravit-web/issues/354)

### 설명

행성 이미지 25개(합계 426 KB)가 화면 밖 카드에서도 바로 요청된다. 첫 화면 밖 카드만 나중에 받게 한다. 첫 화면 카드는 spec 전략 §1(첫 화면 이미지는 지연 로딩하지 않는다)에 따라 그대로 둔다.

### 구현 범위

`entities/learning/ui/chapter-card.tsx` · `unit-card.tsx` · `widgets/chapter-grid` · `widgets/recommended-units` (M8)

### 관련 결정

- 기준선: 계약 C1(레슨 결과 행성은 페이드인 대상이라 지연 로딩하지 않는다) · C5
- 첫 화면 기준: 챕터 그리드는 1200px 이상에서 한 줄 4개 · 좁은 화면에서 2열 → **앞 4개**는 지연 로딩하지 않는다. 추천 유닛은 2열 → **앞 2개**는 지연 로딩하지 않는다

### 이 이슈가 담당하는 매핑

| 현재                        | 목표                                                         | 변경 종류 |
| --------------------------- | ------------------------------------------------------------ | --------- |
| 카드 행성 `<img>` 속성 없음 | 첫 화면 밖 카드만 `loading="lazy"` · 전부 `decoding="async"` | 속성      |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 챕터 8개 `[{ id: 1 } … { id: 8 }]`
When 챕터 그리드를 렌더링하면
Then 1 ~ 4번째 카드의 행성 `<img>`에는 `loading` 속성이 없고, 5 ~ 8번째에는 `loading="lazy"`가 있다. 8개 모두 `decoding="async"` · `alt=""`다

☐ **AC-2** (범위: 통합)
Given 추천 유닛 4개
When 추천 유닛 목록을 렌더링하면
Then 1 ~ 2번째 카드의 행성 `<img>`에는 `loading` 속성이 없고, 3 ~ 4번째에는 `loading="lazy"`가 있다

☐ **AC-3** (범위: 통합)
Given 레슨 결과 화면
When 렌더링하면
Then 행성 `<img>`에 `loading="lazy"`가 없다 (C1의 준비 신호가 늦어지지 않게)

☐ **AC-4** (범위: 측정)
Given `/learning` 모바일 실측
When 기준 빌드와 번갈아 5회 재면
Then LCP ≤ 기준 LCP + 흔들림이다 (판정 기준은 문서 맨 위)

### 의존성

없음

---

## Issue 6: [성능] 리그 티어 아이콘 SVG 최적화

GitHub Issue: [#355](https://github.com/Team-Gravit/gravit-web/issues/355)

### 설명

티어 아이콘 SVG 15개가 합계 485 KB(하나에 최대 59 KB)다. 모양은 그대로 두고 경로와 그라데이션 정의를 정리해 줄인다.

방법: **svgo를 한 번 실행해 결과만 커밋한다.** 티어 아이콘은 거의 바뀌지 않아 빌드 단계나 의존성을 추가하지 않는다. 실행 명령과 svgo 설정은 spec에 기록해 다시 돌릴 수 있게 한다.

### 구현 범위

`entities/league/ui/assets/tier-icons/` (M13)

### 관련 결정

- 기준선: 계약 C6 · 테스트 없음 → 15개 렌더 비교

### 이 이슈가 담당하는 매핑

| 현재                      | 목표            | 변경 종류 |
| ------------------------- | --------------- | --------- |
| 티어 SVG 15개 합계 485 KB | SVG 최적화 결과 | 최적화    |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 측정)
Given 최적화 전후 SVG 15개
When 같은 크기(166×220)로 렌더링해 픽셀을 비교하면
Then 15개 모두 최대 차이 2/255 이하다

☐ **AC-2** (범위: 빌드)
Given 최적화 결과
When 15개 파일 크기를 합하면
Then 485 KB의 절반(243 KB) 이하다. 넘으면 줄어든 양과 남은 원인을 spec에 기록하고 사용자 판정을 받는다

### 의존성

없음

---

## Issue 7: [성능] starfield 배경을 `<img srcset>`으로

GitHub Issue: [#356](https://github.com/Team-Gravit/gravit-web/issues/356)

### 설명

개념 노트 · 학습 챕터 · 유닛 상세의 starfield 배경이 CSS 배경 3840px(289 KB)다. 크기를 고를 수 있게 `<img srcset>`으로 바꾼다. 화면 모양은 그대로다.

### 구현 범위

`shared/ui/layout/space-background.tsx` starfield 변형 (M5)

### 관련 결정

- 기준선: 계약 C7 · C8

### 이 이슈가 담당하는 매핑

| 현재                           | 목표                                            | 변경 종류   |
| ------------------------------ | ----------------------------------------------- | ----------- |
| CSS 배경 cover · top 3840×5122 | `<img srcset>` object-cover · object-top · avif | 형식 · 구조 |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given `<SpaceBackground variant="starfield" className="bg-bg-1">자식</SpaceBackground>`
When 렌더링하면
Then 자식이 그대로 보이고, 장식 `<img>`의 `alt`가 빈 문자열이며 `data-variant="starfield"`가 유지된다

☐ **AC-2** (범위: 측정)
Given starfield를 쓰는 4개 화면(개념 노트 · 학습 챕터 좁은 · 넓은 · 유닛 상세), 폭 412 · 1440px
When 변경 전후 화면을 같은 데이터로 캡처해 픽셀 비교하면
Then 배경 영역 최대 차이가 4/255 이하다 (크기 축소로 생기는 보간 차이 허용)

### 의존성

Issue 1 (변환 도구)

---

## Issue 8: [시안] 공용 우주 배경을 새 시안으로 (공용 캔버스 컴포넌트 신설)

GitHub Issue: [#357](https://github.com/Team-Gravit/gravit-web/issues/357)

### 설명

로그인 · 온보딩 · 온보딩 완료(넓은 화면) · 모달 배경을 새 시안(그라데이션 + 투명 장식)으로 바꾼다. 그라데이션이 먼저 보여 이미지가 늦어도 빈 화면이 없다. 이 이슈에서 「그라데이션 + 장식 캔버스」 공용 컴포넌트(ADR-1)를 처음 만들어 적용한다.

### 구현 범위

- `app/styles/tokens.css` · `docs/design-system/README.md` (M2)
- `shared/ui`의 공용 캔버스 컴포넌트 신설 (M3)
- `shared/ui/layout/space-background.tsx` 기본 변형 (M4)

### 관련 결정

- 기준선: 계약 C6 · C7 · C8
- ADR-1(B) · 확인 필요 4(색 토큰)

### 이 이슈가 담당하는 매핑

| 현재                                   | 목표                                         | 변경 종류            |
| -------------------------------------- | -------------------------------------------- | -------------------- |
| 그라데이션 색 하드코딩                 | 토큰 2개                                     | 토큰 추가            |
| 없음                                   | 공용 캔버스 컴포넌트                         | 신설                 |
| CSS 배경 `background.webp` 2560 298 KB | 그라데이션 + 장식 `<img srcset>` · 가로 맞춤 | **시안 반영** · 구조 |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given `<SpaceBackground className="flex items-center justify-center">자식</SpaceBackground>`
When 렌더링하면
Then 자식이 그대로 보이고, 바깥 상자에 그라데이션 배경이 있고, 장식 `<img>`의 `alt`가 빈 문자열이다

☐ **AC-2** (범위: 측정)
Given 로그인 데스크톱 화면 1440×900
When Figma 원본(같은 영역 2배)과 캡처를 픽셀 비교하면
Then 배경 영역(카드 바깥) 최대 차이가 4/255 이하다

☐ **AC-3** (범위: 측정)
Given 로그인 데스크톱 계산
When 기준 빌드와 번갈아 3회 재면
Then LCP ≤ 기준 LCP + 흔들림이다 (판정 기준은 문서 맨 위)

### 크기 판단

토큰 · 공용 컴포넌트 · `SpaceBackground` 교체 · 문서가 함께 있어 하루를 넘을 수 있다. 공용 컴포넌트를 처음 실제로 쓰는 곳이라 따로 떼면 「컴포넌트만 만든 이슈」가 되므로 함께 둔다.

### 의존성

Issue 1 (변환 도구). Issue 7과 같은 파일(`space-background.tsx`)을 고치므로 Issue 7 뒤에 머지한다 — 계약 의존이 아니라 충돌 회피용 순서다

---

## Issue 9: [시안] 메인 히어로를 새 시안으로

GitHub Issue: [#358](https://github.com/Team-Gravit/gravit-web/issues/358)

### 설명

메인 · 학습 화면 상단 히어로를 새 시안(그라데이션 + 투명 장식)으로 바꾼다. 모바일은 1배 이미지라 흐렸는데 2배 장식으로 선명해지고, 그라데이션이 먼저 보인다.

### 구현 범위

`widgets/hero-greeting/ui/hero-greeting.tsx` · `assets/` (M6)

### 관련 결정

- 기준선: 계약 C4 · C6 · C8 · spec §5-2(폭 대응)
- ADR-1(B)

### 이 이슈가 담당하는 매핑

| 현재                            | 목표                                                                  | 변경 종류            |
| ------------------------------- | --------------------------------------------------------------------- | -------------------- |
| `<picture>` 1배 webp 360 · 1920 | 공용 캔버스 · 모바일 475×304(오른쪽 아래) · 데스크톱 1920×274(오른쪽) | **시안 반영** · 구조 |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 프로필 조회 실패
When 히어로를 렌더링하면
Then 기본 인사말이 보인다

☐ **AC-2** (범위: 측정)
Given 화면 폭 360 · 412 · 475px, 히어로 높이 266px(상태 표시줄 0)
When 히어로 배경 영역을 캡처해 Figma 캔버스(475×304, 그라데이션 + 장식)의 같은 오른쪽 아래 영역과 픽셀 비교하면
Then 세 폭 모두 최대 차이가 4/255 이하다

☐ **AC-3** (범위: 측정)
Given 화면 폭 600px
When 히어로를 캡처하면
Then 배경 영역에 그라데이션 · 장식이 없는 픽셀(페이지 배경색 그대로인 픽셀)이 0개다

☐ **AC-4** (범위: 측정)
Given `/main` 모바일 실측
When 기준 빌드와 번갈아 5회 재면
Then LCP ≤ 기준 LCP + 흔들림이다. LCP 요소도 기록한다

### 의존성

Issue 8 (공용 캔버스 · 토큰)

---

## Issue 10: [시안] 학습 카드 배경을 새 시안으로

GitHub Issue: [#359](https://github.com/Team-Gravit/gravit-web/issues/359)

### 설명

챕터 카드 · 유닛 카드 배경을 새 시안(그라데이션 + 투명 장식)으로 바꾼다. `/learning` LCP 요소인 카드 배경이 CSS 배경이라 늦게 요청되던 것을, 그라데이션은 바로 보이고 장식은 `<img>`로 받게 한다.

### 구현 범위

`entities/learning/ui/chapter-card.tsx` · `unit-card.tsx` · `assets/` (M7)

### 관련 결정

- 기준선: 계약 C5 · C6 · C8 · spec §5-1(crop · 그라데이션 값)
- ADR-1(B)

### 이 이슈가 담당하는 매핑

| 현재                                         | 목표                             | 변경 종류            |
| -------------------------------------------- | -------------------------------- | -------------------- |
| CSS 배경 `unit-card-background.webp` 800×512 | 공용 캔버스 · 355:377 장식 cover | **시안 반영** · 구조 |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 챕터 `{ id: 1, title: "자료구조" }`
When 챕터 카드를 렌더링하면
Then 카드 전체가 챕터 상세 링크이고, 글자 대비 덮개(`bg-black/20`)와 행성 이미지가 있다

☐ **AC-2** (범위: 측정)
Given 챕터 카드(정사각형) · 유닛 카드(가로로 긴 `h-39`)
When 카드 배경을 캡처해 Figma 캔버스(355×377, 그라데이션 + 장식)를 같은 cover 규칙으로 잘라 만든 기준 이미지와 픽셀 비교하면
Then 두 카드 모두 최대 차이가 4/255 이하다 (덮개 · 행성 · 글자 영역 제외)

☐ **AC-3** (범위: 측정)
Given `/learning` 모바일 실측
When 기준 빌드와 번갈아 5회 재면
Then LCP ≤ 기준 LCP + 흔들림이다. LCP 요소도 기록한다

### 의존성

Issue 8 (공용 캔버스 · 토큰)

---

## Issue 11: [성능] 마이그래빗 프로필 배너를 `<img>`로

GitHub Issue: [#360](https://github.com/Team-Gravit/gravit-web/issues/360)

### 설명

마이그래빗 첫 화면 프로필 배너가 CSS 배경(1920×274)이라 화면 크기에 맞는 파일을 고를 수 없다. `<img srcset>`으로 바꿔 좁은 화면에서는 작은 파일을 받게 한다. 화면 모양은 그대로다.

### 구현 범위

`pages/my/ui/profile-card.tsx` · `assets/` (M12 중 배너)

### 관련 결정

- 기준선: 계약 C6 · C8 · 테스트 `profile-card.test.tsx`

### 이 이슈가 담당하는 매핑

| 현재                                    | 목표                                        | 변경 종류 |
| --------------------------------------- | ------------------------------------------- | --------- |
| 배너 CSS 배경 1920×274 (cover · center) | `<img srcset>` object-cover · object-center | 구조      |

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합)
Given 프로필 카드
When 렌더링하면
Then 배너 `<img>`가 1개이고 `alt`가 빈 문자열이며, 기존 테스트가 통과한다

☐ **AC-2** (범위: 측정)
Given 폭 412 · 1440px의 마이그래빗 화면
When 변경 전후를 같은 데이터로 캡처해 프로필 카드 영역을 픽셀 비교하면
Then 최대 차이가 4/255 이하다 (크기 축소로 생기는 보간 차이 허용)

### 의존성

Issue 1 (변환 도구)

---

## 시퀀스 검토

```text
Issue 1 ─┬─ Issue 2
         ├─ Issue 3
         ├─ Issue 4
         ├─ Issue 11
         └─ Issue 7 ── Issue 8 ─┬─ Issue 9
                                └─ Issue 10
Issue 5 (독립)
Issue 6 (독립)
```

- [x] 각 의존성이 실제 입력 · 계약 관계를 근거로 한다 (변환 도구 · 공용 캔버스 · 같은 파일)
- [x] 순환 의존성이 없고, 독립 이슈(5 · 6)는 병렬로 진행할 수 있다
- [x] Issue 8 → 7은 계약 의존이 아니라 같은 파일 충돌 회피용 머지 순서다
- [x] 선행 이슈가 빠져 다음 이슈 구현이 불가능한 구간이 없다
- [x] `spec.md`의 Out of Scope 항목(아이콘 · 로고 · 마크다운 · preload · 리그 2배 원본)이 어떤 이슈에도 없다
