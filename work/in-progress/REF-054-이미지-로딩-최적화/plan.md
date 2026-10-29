---
id: 'REF-054'
planned: '2026-10-29'
mode: 'refactor'
---

# REF-054 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.**
> 실행 이슈 8개(`issues.md` Issue 1 ~ 7 · 11, GitHub #350 ~ #356 · #360)를 다룬다. 체크리스트 항목마다 `Issue N`을 붙인다.
> Issue 8 ~ 10(시안 반영)은 2026-10-29 사용자 판정으로 FIX-073에 옮겼다.

## 0. 모드 판정

`mode: refactor` — 이미지 형식 · 크기 · 로딩 방식만 바꾸고 화면 모양 · 동작은 그대로 둔다.

### 0-1. 착수 전 필수 게이트 (`refactor-checklist.md` §1)

| #   | 질문                               | 답  | 근거                                                                                                                                                                                 |
| --- | ---------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 목표와 비목표가 명확한가           | 예  | 목표: 이미지를 표시 크기 기준 형식 · 해상도로 바꾸고 첫 화면 요청을 앞당긴다. 비목표: spec `Out of Scope`(아이콘 · 로고 · 마크다운 · preload · 리그 2배 원본 · 문구 · 레이아웃)      |
| 2   | 반복 비용이나 확장 차단이 있는가   | 예  | 리그 배경 PNG 1.8 MB · 4320px · 3840px 원본 · CSS 배경 4곳(우선순위 불가) · 1배 히어로. 전수 조사 수치(spec 현행 기준선)                                                             |
| 3   | 보존할 동작의 기준선이 있는가      | 예  | 보존 계약 C1 ~ C8(사용자 확인). 테스트: `league-page` · `result-background` · `result-hero` · `lesson-result-page` · `profile-card` · `onboarding-success-page` · `footer` · `modal` |
| 4   | 검증 방법이 있는가                 | 예  | 기존 테스트 + 이슈별 AC(RTL · 빌드 확인 · Lighthouse 실측 · 픽셀 비교). 측정 도구는 REF-072에서 만든 것을 그대로 쓴다(`local-docs/.../2026-10-29_345-login/tools/`)                  |
| 5   | 범위를 독립적으로 완료할 수 있는가 | 예  | 이슈마다 화면 하나 · 이미지 묶음 하나. 의존은 변환 도구(Issue 1)뿐                                                                                                                   |
| 6   | 위험을 격리했는가                  | 예  | 생성물 · 라우트 · 인증을 건드리지 않는다. 변환 도구는 Issue 1에서 Vite 5 동작을 먼저 확인하고, 실패하면 변환 스크립트로 전환한다(확인 필요 1의 ①)                                    |

### 0-2. 자동 보류 신호

- [ ] 동작 변경과 구조 변경이 섞임 — **해소.** 새 시안 반영(Issue 8 ~ 10)이 걸렸으나 2026-10-29 사용자 판정으로 FIX-073에 분리했다. 남은 이슈는 모양을 바꾸지 않는다
- [ ] 한 단위로 완료 · 검증할 수 없음 — 해당 없음 (이슈 11개로 나눔)
- [ ] 자동 생성물 직접 수정 — 해당 없음 (`routeTree.gen.ts` · `shared/api/generated/` · `icons.generated.ts` 변경 없음)
- [ ] 기존 검증 실패 원인 불명 — 해당 없음. `problem-card.test.tsx`의 hook timeout 간헐 실패는 원인과 범위를 알고 있다(REF-072 기록) — 이번 작업과 무관
- [ ] 범위 밖 문제 발견 — 아래 「발견」 참고. 이 작업에서 고치지 않는다

## 1. 영향 분석

현재 파일 목록은 2026-10-29 `rg -l`로 확인했다.

| 구분 | 파일                                                                                                                                     | 이슈   |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 수정 | `apps/web/package.json` · `vite.config.ts` · `vitest.config.ts` · `.storybook/main.ts` · `src/vite-env.d.ts`(이미지 import 타입)         | 1      |
| 수정 | `pages/league/ui/league-page.tsx` · `assets/league-bg-*`                                                                                 | 1      |
| 수정 | `pages/lesson-result/ui/result-background.tsx` · `result-hero.tsx` · `assets/`                                                           | 2      |
| 수정 | `widgets/quiz-screen/ui/quiz-loading-screen.tsx` · `assets/loading-mascot*`                                                              | 3      |
| 수정 | `pages/onboarding-success/ui/onboarding-success-page-{narrow,wide}.tsx` · `assets/` · `widgets/footer/ui/footer.tsx` · `assets/`         | 4      |
| 수정 | `entities/learning/ui/chapter-card.tsx` · `unit-card.tsx` · `widgets/chapter-grid/ui/chapter-grid.tsx` · `widgets/recommended-units/ui/` | 5      |
| 수정 | `entities/league/ui/assets/tier-icons/*.svg` (15개)                                                                                      | 6      |
| 수정 | `shared/ui/layout/space-background.tsx` · `assets/starfield.*`                                                                           | 7      |
| 수정 | `pages/my/ui/profile-card.tsx` · `assets/profile-banner.*`                                                                               | 11     |
| 신규 | 각 이슈의 테스트 추가분(AC가 요구하는 것만) · spec 측정 기록                                                                             | 1 ~ 11 |
| 삭제 | 교체된 원본 이미지(빌드 변환 원본으로 바뀌는 PNG 등). 원본은 변환 입력으로 남기고, 쓰이지 않게 된 파일만 지운다                          | 각     |

이전 매핑은 `spec.md` 「이전 매핑」 M1 ~ M14를 그대로 따른다(사용자 확정). 목표 위치는 모두 현재 슬라이스 안이며 새 슬라이스는 없다. M2 · M3 · M4 · M6 · M7(시안 반영)은 FIX-073 계획에서 다룬다.

### 발견 (범위 밖 · 고치지 않음)

- **같은 그라데이션 색이 이미 두 곳 더 있다.** `app/styles/utilities.css`의 `.bg-space-gradient`(292.58deg · 레슨 결과 화면 사용)와 `pages/league/ui/league-page.tsx`의 `BACKGROUND_GRADIENT`(197deg). 색 토큰 승격(확인 필요 4) 때 이 두 곳도 토큰을 쓰도록 바꿀지 정해야 한다 — 색만 바꾸고 각도 · 정지점은 그대로 두는 것은 동작 불변이다
- **Storybook은 앱 `vite.config.ts`를 그대로 쓰지 않고 플러그인을 다시 등록한다**(`.storybook/main.ts` `viteFinal`). 변환 도구도 같은 방식으로 등록해야 스토리가 깨지지 않는다 → Issue 1 범위에 포함

## 2. 구현 체크리스트

레이어는 `shared → entities → features → widgets → pages → app` 순서. 이슈 순서는 의존성(issues.md 시퀀스)을 따른다.

### Issue 1 (#350) — 변환 도구 · 리그 배경

- [x] `[repo]` `vite-imagetools@9.0.3` 개발 의존성 추가 (pnpm 8.15.6) — 설치 승인 필요
- [x] `[repo]` `vite.config.ts` · `vitest.config.ts` · `.storybook/main.ts`에 플러그인 등록. 기본값: 출력 형식 지정 없을 때 원본 유지
- [x] `[repo]` `src/vite-env.d.ts`에 쿼리 import 타입 선언 (`?…&as=picture` 등)
- [x] `[pages]` `league-page.tsx`: 데스크톱 배경을 avif → webp `<picture>`로, 모바일은 webp. 표시 크기 기준 너비(데스크톱 1280 · 1920, 모바일 360 · 720 — 모바일 원본이 360이라 업스케일하지 않는다)
- [x] 증분 검사: `league-page.test.tsx` · `check-types` · `lint:fsd`
- [x] AC-2: 빌드 결과물에서 avif · webp 크기 확인 → spec 기록 (avif 병행 결정 검증)
- [x] AC-3: 빌드 시간 `develop` 대비 3회 중앙값 — 증가 10초 이하. 넘거나 실패하면 멈추고 보고
- [x] Storybook 빌드 확인 (`pnpm --filter @repo/web build-storybook` 또는 해당 스크립트)
- [ ] 커밋 제안 2개: `chore(web): 빌드 시 이미지 변환 도구 도입 (#350)` · `perf(web): 리그 배경을 avif · webp로 변환 (#350)`

### Issue 2 (#351) — 레슨 결과

- [x] `[pages]` 데스크톱 배경 장식 4320 → 표시 2배 기준(1920 · 2880 · 3840) `srcset` · avif. 모바일 달 1595 → 1140 기준. 마스코트 크기 확인 → 달 800 · 1140 · 1595, 마스코트 · 모바일 배경은 그대로
- [x] `fetchPriority` · `decoding` · 페이드인(`markImageReadyAfterDecode`) 로직은 그대로
- [x] 기존 테스트 3개 통과 · AC-3 빌드 확인

### Issue 3 (#352) — 퀴즈 로딩 마스코트

- [ ] 애니메이션 webp를 변환 도구로 줄일 수 있는지 먼저 확인(sharp `animated`). 안 되면 수동 변환 후 결과만 커밋 — spec 기록
- [ ] `[widgets]` `quiz-loading-screen.tsx` 소스 교체. 모션 감소 `<source>` 유지
- [ ] AC-1(정지 프레임 `<source>`) 테스트 추가 · AC-2 프레임 수 확인

### Issue 4 (#353) — 남은 PNG

- [ ] `[widgets]` 푸터 로고 webp(높이 36px 기준 2배) · `[pages]` 온보딩 완료 마스코트 2개 webp(210 · 156px 기준 2배)
- [ ] 기존 테스트 통과 · AC-3 빌드 확인

### Issue 5 (#354) — 행성 지연 로딩

- [ ] `[entities]` `ChapterCard` · `UnitCard`에 행성 이미지 로딩 방식을 받는 prop 추가(기본: 지연 로딩), `decoding="async"`
- [ ] `[widgets]` `chapter-grid` 앞 4개 · `recommended-units` 앞 2개는 즉시 로딩으로 넘긴다
- [ ] `[pages]` 레슨 결과 행성은 변경 없음(AC-3 확인)
- [ ] AC-1 · AC-2 · AC-3 테스트 추가 · AC-4 `/learning` 실측

### Issue 6 (#355) — 티어 아이콘 SVG

- [ ] svgo 일회성 실행(설정 · 명령을 spec에 기록, 의존성 추가 없음) — 실행 도구 내려받기 승인 필요
- [ ] AC-1 15개 픽셀 비교 · AC-2 합계 243 KB 이하

### Issue 7 (#356) — starfield

- [ ] `[shared]` `SpaceBackground` starfield 변형을 `<img srcset>`(object-cover · object-top) + avif로. 기본 변형은 이 이슈에서 건드리지 않는다
- [ ] AC-1 테스트 추가 · AC-2 4개 화면 × 2폭 픽셀 비교

### Issue 11 (#360) — 마이 배너

- [ ] `[pages]` `profile-card.tsx` 배너를 `<img srcset>`(object-cover · center)로. 카드 최소 높이 · 상태 표시줄 뒤 확장(`box-content`) 유지
- [ ] AC-1 테스트 · AC-2 픽셀 비교

### 마무리

- [ ] 이슈마다: 변경 파일 prettier · 관련 테스트 · `check-types` · `lint:fsd` · 측정
- [ ] 전체: `pnpm verify` → `ai-validate` → `checklist.md`
- [ ] 기준 문서: 토큰을 바꾸면 `docs/design-system/README.md` · `src/stories/` Foundations

## 3. 리스크

| 리스크                                                          | 영향                           | 대응                                                                                         |
| --------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `vite-imagetools` 9.0.3이 Vite 5.4에서 동작하지 않는다          | Issue 1 이후 전부 막힘         | Issue 1에서 가장 먼저 확인. 실패하면 멈추고 변환 스크립트(①)로 전환 여부를 사용자에게 묻는다 |
| 테스트 · Storybook이 쿼리 import(`?w=…`)를 못 읽는다            | 테스트 · 스토리 실패           | `vitest.config.ts` · `.storybook/main.ts`에도 플러그인 등록 (Issue 1 체크리스트)             |
| avif 인코딩으로 빌드 · CI 시간이 늘어난다                       | PR 검사 지연                   | AC-3 상한 10초. 넘으면 큰 배경만 avif로 다시 줄이거나 webp만 쓴다                            |
| `<picture>`로 바꾸며 `fetchPriority` · 페이드인 동작이 달라진다 | C1 깨짐                        | 기존 테스트 3개(레슨 결과)가 잡는다. `<img>`의 속성 · 이벤트 핸들러는 그대로 옮긴다          |
| CSS 배경 → `<img>` 전환에서 위치 · 잘림이 달라진다              | 모양 변화(C8)                  | Issue 7 · 11은 같은 데이터 캡처 픽셀 비교(4/255)로 판정                                      |
| 첫 화면 행성에 지연 로딩이 걸린다                               | 첫 화면 이미지 늦게 뜸         | Issue 5 AC-1 · AC-2가 앞 4개 · 2개를 고정                                                    |
| 애니메이션 webp가 변환 중 정지 이미지가 된다                    | 퀴즈 로딩 마스코트가 안 움직임 | Issue 3 AC-2(프레임 수) · 수동 변환 대안                                                     |
| 패키지 · 실행 도구 내려받기                                     | 자동 권한에서 막힐 수 있다     | 설치 전에 사용자 승인                                                                        |

### 동일성 확인

| 방법                 | 내용                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| 자동 테스트          | 기존 8개 파일 + 이슈별 AC 테스트(`issues.md`)                                                           |
| 빌드 확인            | 이슈별 결과 파일 형식 · 크기 · 개수                                                                     |
| 측정                 | LCP: 기준 · 변경 빌드 번갈아 5회, `변경 ≤ 기준 + 흔들림`. 픽셀: 최대 4/255                              |
| 수동 스모크 (이슈별) | 리그 넓은 · 좁은 화면 전환 / 레슨 결과 페이드인 / 모션 감소 설정 / 마이그래빗 배너 / starfield 4개 화면 |

## 4. 진행 전 확인

1. ~~§0-2 분리 여부~~ — **분리 확정(2026-10-29)**. FIX-073
2. **`vite-imagetools@9.0.3` 설치 승인** — Issue 1 첫 단계. 패키지를 내려받는다
3. **`work/in-progress/`에 이미 12개 작업이 있다**(`work-management.md` §3은 하나만 허용). 승인되면 규칙대로 이 작업을 옮기되, 기존 12개 정리는 이 작업 범위 밖이다
4. 그라데이션 색 토큰의 기존 두 곳 적용 여부 — FIX-073 확인 필요 1로 옮겼다
