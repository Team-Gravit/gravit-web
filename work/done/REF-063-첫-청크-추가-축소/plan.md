# REF-063 구현 계획 — 첫 청크 추가 축소

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

- 작성: 2026-10-24
- 브랜치: `perf/#312/entry-chunk-quiz-icons` (워크트리 `gravit-entry-chunk`, `develop` `4fb2c6b5`에서 분기)
- GitHub Issue: #312

## 0. 종류 · 범위

`mode: refactor` — 화면 동작·문구·아이콘 모양은 바꾸지 않고, 모듈 위치와 `Icon`의 prop 형태만 바꾼다.

| 실행 단위 | 내용                                                                    | 커밋 |
| --------- | ----------------------------------------------------------------------- | ---- |
| Issue 1   | 퀴즈 경로 — `toReviewQuizSessionKey`를 페이지 파일 밖으로 옮긴다        | 1    |
| Issue 2   | 아이콘 — 이름 문자열 대신 아이콘 컴포넌트를 넘겨 쓰는 아이콘만 번들한다 | 2    |

두 단위는 서로 의존하지 않는다. 각 커밋 뒤에 따로 측정해 무엇이 얼마나 줄었는지 나눈다.

### `refactor-planner` 생략 판단

Issue 2가 파일 10개를 넘고 여러 슬라이스에 걸쳐 `refactor-planner` 대상이다. 다음 이유로 생략을 제안한다 — **승인 시 함께 확인받는다.**

- 결정이 이미 끝났다 (§1). ADR로 비교할 남은 안이 없다
- 사용처 수정은 `name="x"` → `icon={XIcon}` 치환 하나다. 슬라이스마다 판단이 다르지 않다
- 단위가 둘뿐이라 이슈 분해 산출물(`issues.md`)이 이 표 이상을 담지 않는다

## 1. 결정 (2026-10-24 사용자)

1. **아이콘은 아이콘별 import** — `Icon`은 유지하고 `name: IconName` 대신 `icon: IconComponent`를 받는다.
   생성 스크립트가 `BellIcon` 같은 named export를 만들고, 전체 목록은 stories 전용 파일로 분리한다.
   기각: SVG 72개 삭제(디자인 시스템 결정) · 스프라이트(받는 양 그대로, 첫 화면 아이콘 지연) · 사용 아이콘만 생성(숨은 재생성 단계)
2. **퀴즈 경로는 함수 이동** — `toReviewQuizSessionKey`를 `pages/review-quiz/model/`로 옮기고 같은 `index.ts`로 공개한다.
   기각: `sideEffects` 선언(단독 −0.5KB, 함수 이동과 합쳐도 추가 −5KB인데 빌드에서만 드러나는 위험) · 지연 로딩(원인이 파일 위치라 불필요)

### 실험 근거 (2026-10-24, `develop` `4fb2c6b5`, 커밋 안 함)

| 시도                      | 첫 청크 `index-*.js` | gzip      | 퀴즈 코드 |
| ------------------------- | -------------------- | --------- | --------- |
| 현행                      | 629,881 B            | 200,597 B | 있음      |
| `sideEffects`만           | 629,347 B            | 200,479 B | 있음      |
| 함수 이동만               | 592,034 B            | 188,893 B | 일부 남음 |
| `sideEffects` + 함수 이동 | 586,843 B            | 187,331 B | 없음      |

「함수 이동만」에서 일부 남은 퀴즈 코드는 Issue 1 구현 뒤 번들 지도로 출처를 확인한다 (§5 리스크 1).

## 2. 착수 전 필수 게이트 (`refactor-checklist.md` §1)

| #   | 질문                               | 답  | 근거                                                                                                                                                                                     |
| --- | ---------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가           | 예  | 목표: 첫 청크에서 퀴즈 코드와 안 쓰는 아이콘을 뺀다. 비목표: 아이콘 모양·이름·세트, axios·로고·tailwind-merge, 라우트 데이터 미리 요청(REF-062)                                          |
| 2   | 반복 비용이나 확장 차단이 있는가   | 예  | 모든 화면의 첫 방문이 안 쓰는 코드를 받는다. 아이콘은 SVG를 추가할수록 첫 청크가 계속 커진다 (지금 90개 중 18개 사용)                                                                    |
| 3   | 보존할 동작의 기준선이 있는가      | 예  | Issue 1: `-review-quiz-route.test.tsx`의 떠날 때 다시 받기(AC-9 · AC-9-1 · AC-15). Issue 2: 아이콘을 쓰는 화면의 기존 컴포넌트·페이지 테스트 + `Icon`의 접근성 기본값(아래 §6 수동 확인) |
| 4   | 검증 방법이 있는가                 | 예  | `pnpm verify` · 빌드 결과물 검색 · 녹화 응답 재생 측정(`C:\tmp\gfont-tool`) · Storybook Iconography 개수                                                                                 |
| 5   | 범위를 독립적으로 완료할 수 있는가 | 예  | Issue 1·2가 서로 의존하지 않아 커밋별로 빌드·테스트가 통과한다                                                                                                                           |
| 6   | 위험을 격리했는가                  | 예  | 생성물 `icons.generated.ts`는 스크립트로만 재생성한다. 인증·토큰·라우트 트리는 건드리지 않는다. 되돌리기는 커밋 단위 revert                                                              |

### 자동 보류 신호

- [ ] 동작 변경과 구조 변경이 섞임 — **해당 없음.** `Icon` prop 이름이 바뀌지만 렌더 결과(SVG · `aria-*` · 크기 · 회전)는 같다
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음
- [ ] 자동 생성물 직접 수정 — **해당 없음.** 생성 스크립트를 고치고 `pnpm generate:icons`로 만든다
- [ ] 기존 검증 실패의 원인을 설명할 수 없음 — 해당 없음 (`develop`에서 `pnpm verify` 통과, 2026-10-24)
- [ ] 범위 밖 문제 발견 — 발견 시 `work/to-do/`에 새 항목

## 3. 영향 분석

### Issue 1 — 퀴즈 경로

| 구분 | 파일                                                                  |
| ---- | --------------------------------------------------------------------- |
| 신규 | `apps/web/src/pages/review-quiz/model/session-key.ts`                 |
| 수정 | `apps/web/src/pages/review-quiz/ui/review-quiz-page.tsx` · `index.ts` |

`-review-quiz-route.ts`는 `@/pages/review-quiz`에서 그대로 가져오므로 수정하지 않는다.

| 현재 위치                                                               | 목표 위치                                | 변경 종류 | import 영향                                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| `pages/review-quiz/ui/review-quiz-page.tsx` 의 `toReviewQuizSessionKey` | `pages/review-quiz/model/session-key.ts` | 이동      | 슬라이스 밖은 없음 (배럴 경로 유지). 페이지 파일은 `../model/session-key` 상대 경로 |

### Issue 2 — 아이콘

`rg -l "<Icon\b|IconName|ICONS\b"` (2026-10-24) 기준.

| 구분            | 파일                                                                                                                                                                                                                                                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 생성 스크립트   | `scripts/generate-icons.mjs`                                                                                                                                                                                                                                                                                                |
| 생성물 (재생성) | `shared/ui/icon/icons.generated.ts` · **신규** `shared/ui/icon/icon-catalog.generated.ts`                                                                                                                                                                                                                                   |
| shared/ui/icon  | `icon.tsx` · `index.ts` · `icon.stories.tsx`                                                                                                                                                                                                                                                                                |
| shared/ui 기타  | `icon-button/icon-button.tsx` · `icon-button/icon-button.stories.tsx` · `button/button.stories.tsx` · `accordion/accordion.tsx` · `breadcrumb/breadcrumb.tsx` · `layout/document-layout.tsx` · `pagination/pagination.tsx` · `select/floating-select.tsx` · `select/select.tsx`                                             |
| entities        | `learning/ui/chapter-card.tsx` · `learning/ui/unit-list-item.tsx` · `problem/ui/option-choice-list.tsx`                                                                                                                                                                                                                     |
| features        | `friend-recommend-follow/ui/recommend-follow-button.tsx` · `problem-bookmark/ui/bookmark-toggle.tsx` · `wrong-answer-exclude/ui/exclude-wrong-answer-button.tsx`                                                                                                                                                            |
| widgets         | `bottom-tab-bar/ui/bottom-tab-bar.tsx` · `hero-greeting/ui/hero-profile-summary.tsx` · `league-arena/ui/season-timer.tsx` · `notification/ui/notification-popover.tsx` · `page-title-bar/ui/page-title-bar.tsx` · `quiz-screen/ui/quiz-timer.tsx` · `quiz-screen/ui/quiz-top-bar.tsx` · `social/follow/ui/follow-modal.tsx` |
| pages           | `inquiry/ui/inquiry-list-item.tsx` · `my/ui/profile-card.tsx` · `onboarding/ui/onboarding-page-narrow.tsx` · `settings/ui/settings-page.tsx` · `unit-detail/ui/unit-detail-page.tsx`                                                                                                                                        |
| 문서            | `src/stories/Iconography.mdx` · `CLAUDE.md` (기술 스택 표 · Path Alias 예시) · `.claude/rules/import-convention.md` (예시)                                                                                                                                                                                                  |

- `widgets/bottom-tab-bar/model/nav.ts`는 탭 SVG를 **자기 슬라이스에서 직접** import한다. `ICONS`를 쓰지 않아 수정하지 않는다
- 이름을 조건으로 고르는 곳 3곳(`bookmark-toggle` · `option-choice-list` · `page-title-bar`)은 컴포넌트를 조건으로 고른다
- `IconButton`을 쓰는 곳 3곳(`document-layout` · `notification-popover` · `follow-modal`)은 `icon="x"` → `icon={XIcon}`

| 현재                                                            | 목표                                                                                                          | 변경 종류      |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------- |
| `icons.generated.ts`: SVG 90개 import + `ICONS` 맵 + `IconName` | 아이콘마다 `export { default as BellIcon } from './assets/bell.svg?react'`                                    | 생성 형식 변경 |
| (없음)                                                          | `icon-catalog.generated.ts`: 이름 → 컴포넌트 전체 맵. **배럴로 공개하지 않는다** — stories · Iconography 전용 | 신규 생성물    |
| `Icon({ name })`                                                | `Icon({ icon })`, `IconComponent` 타입 공개                                                                   | prop 변경      |
| `index.ts`: `Icon` · `ICONS` · `IconName`                       | `Icon` · `IconComponent` · 아이콘 named export 전체                                                           | 공개 API 변경  |
| `IconButton({ icon: IconName })`                                | `IconButton({ icon: IconComponent })`                                                                         | prop 타입 변경 |

전체 맵을 배럴에 두지 않는 이유: 앱 코드가 배럴을 가져올 때 맵이 함께 평가되면 90개가 다시 첫 청크로 들어올 수 있다.

## 4. 구현 체크리스트

### Issue 1 — 퀴즈 경로 (커밋 1)

- [ ] `[pages]` `review-quiz/model/session-key.ts`에 `toReviewQuizSessionKey` 이동 · 페이지 파일은 거기서 가져온다 · `index.ts` 경로 수정
- [ ] 증분 검사: `-review-quiz-route.test.tsx` · `review-quiz` 관련 테스트 · `pnpm --filter @repo/web lint:fsd`
- [ ] 빌드 → 첫 청크 크기 기록, 남은 퀴즈 코드의 출처를 번들 지도로 확인 (§5 리스크 1)
- [ ] 커밋 1 제안: `perf(web): 북마크·오답 풀이 세션 키를 페이지 파일 밖으로 분리 (#312)`

### Issue 2 — 아이콘 (커밋 2)

- [ ] `[shared]` `generate-icons.mjs`: named export 형식 + `icon-catalog.generated.ts` 생성 → `pnpm generate:icons`
- [ ] `[shared]` `icon.tsx` · `index.ts` · `icon.stories.tsx` — `icon` prop, `IconComponent` 타입
- [ ] `[shared]` `icon-button.tsx` · stories, shared/ui 사용처 7개 파일
- [ ] `[entities]` 3개 파일
- [ ] `[features]` 3개 파일
- [ ] `[widgets]` 7개 파일
- [ ] `[pages]` 5개 파일
- [ ] 문서: `Iconography.mdx` (목록을 catalog에서 · 사용법 표의 `name` → `icon`) · `CLAUDE.md` · `import-convention.md` 예시
- [ ] 증분 검사: `pnpm check-types` (남은 `name=` 사용처를 타입 에러로 찾는다) · `lint:fsd`
- [ ] 빌드 → 첫 청크 크기 기록, 안 쓰는 아이콘이 첫 청크에 없는지 결과물 검색
- [ ] 커밋 2 제안: `perf(web): 아이콘을 이름 대신 컴포넌트로 받아 쓰는 아이콘만 번들 (#312)`

### 마무리

- [ ] `pnpm verify`
- [ ] 측정 (§6) → `spec.md` 결과 기록
- [ ] `ai-validate` → `checklist.md`

라우트를 추가·변경하지 않으므로 라우트 트리 재생성은 없다.

## 5. 리스크

| #   | 리스크                                                                   | 영향                                 | 대응                                                                                                    |
| --- | ------------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1   | 함수 이동 뒤에도 퀴즈 코드 일부가 남는다 (실험에서 확인)                 | Issue 1 효과가 실험보다 작을 수 있다 | 번들 지도로 출처를 찾는다. 다른 import 경로면 **이 작업에서 고치지 않고** 새 항목으로 뽑을지 확인받는다 |
| 2   | `index.ts`가 아이콘 90개를 named re-export — 배럴을 가져오면 다 들어올까 | Issue 2 효과 없음                    | 실험(§1)에서 부수 효과 없는 re-export는 버려졌다. 빌드 결과물 검색으로 확인. 안 되면 멈추고 보고        |
| 3   | 아이콘 이름 → 컴포넌트 이름 변환 실수 (`close-md` → `CloseMdIcon`)       | 다른 아이콘이 그려진다               | 이름은 스크립트가 만든다. 치환 후 사용처별 원래 이름 ↔ 새 컴포넌트를 diff로 대조                       |
| 4   | 생성물 직접 수정이 훅에 막힌다                                           | —                                    | 스크립트 수정 → 재생성만 한다                                                                           |
| 5   | 새 이름이 기존 지역 이름과 겹친다 (예: 같은 파일의 `HomeIcon`)           | 타입·린트 에러                       | `check-types`로 확인. `nav.ts`는 `shared/ui/icon`을 import하지 않아 겹치지 않는다                       |
| 6   | Storybook 아이콘 목록이 줄거나 사라진다                                  | 디자인 시스템 문서 손상              | Iconography가 catalog 전체를 보여 주는지 개수(90)로 확인                                                |

### 동일성 확인

| 방법        | 내용                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| 자동 테스트 | `pnpm test` 전체 — 특히 `-review-quiz-route.test.tsx`(떠날 때 저장본 삭제·다시 받기)와 아이콘을 쓰는 화면 테스트          |
| 명시적 대조 | 사용처별 `name="원래 이름"` ↔ `icon={새 컴포넌트}` diff 대조 (리스크 3)                                                  |
| 빌드 검색   | 첫 청크에 퀴즈 표식(`option-result-list`) 없음 · 안 쓰는 아이콘의 고유 path 문자열 없음                                   |
| 수동 스모크 | Storybook `Foundations/Iconography` 90개 · `/main` 하단 탭 · 북마크 토글 · 비밀번호 보기(눈 아이콘) · 상단 막대 닫기/뒤로 |

## 6. 측정

REF-064와 같은 조건 (녹화 응답 재생 · CPU 4x · Fast 4G · 412×823 · 캐시 끔 · 번갈아 5회).

| 포트 | 빌드                        |
| ---- | --------------------------- |
| 5174 | 현행 `develop` `4fb2c6b5`   |
| 5175 | 커밋 1 (퀴즈 경로)          |
| 5176 | 커밋 2 (퀴즈 경로 + 아이콘) |
| 5177 | 커밋 2 재측정 — 흔들림 기준 |

- 대상: `/main` · `/learning` · `/learning/units/11/concept-note` — FCP · LCP
- 첫 청크 크기(원본 · gzip)는 빌드마다 기록
- 판정: FCP · LCP가 현행보다 흔들림 이상 나빠지지 않는다. 개선 여부는 흔들림과 비교해 적고, 흔들림 안이면 「차이 없음」으로 적는다
- 도구 `C:\tmp\gfont-tool\font-replay.mjs`의 `BUILDS`만 바꿔 쓴다

## 7. 진행 전 확인

- `work/in-progress/`에 이미 6개 작업이 있다 (`work-management.md` §3 위반 상태). 승인되면 규칙대로 `in-progress/`로 옮기되, 기존 6개 정리는 이 작업 범위 밖이다
