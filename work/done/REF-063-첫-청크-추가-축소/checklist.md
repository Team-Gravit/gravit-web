---
id: 'REF-063'
validated: '2026-10-29'
mode: 'refactor'
---

# REF-063 검증 결과

> `ai-validate` 산출물. 검증 대상: `perf/#312/entry-chunk-quiz-icons` (`develop` `06d5669e` 위로 rebase 후), PR #344

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                                     |
| --- | --------------- | -------------------------------------------------- | ---------------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅                                       |
| 2   | 타입            | `pnpm check-types`                                 | ✅                                       |
| 3   | 테스트          | `pnpm test`                                        | ✅ 110 파일 · 609개                      |
| 4   | 빌드            | `pnpm build`                                       | ✅                                       |
| 5   | 포맷            | `pnpm format:check`                                | ✅                                       |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 테스트 파일의 MSW 핸들러 1건만 (허용) |

1~5는 `pnpm verify` 한 번으로 확인했다 (2026-10-29, exit 0).

rebase 직후 첫 `pnpm verify`에서 `entities/problem/ui/problem-card.test.tsx`가 `Hook timed out in 10000ms`로 한 번 실패했다.
같은 파일 단독 실행과 전체 재실행에서는 통과했고, 이번 변경은 이 테스트가 쓰는 코드를 바꾸지 않는다.
기존 간헐 실패로 보고 이 작업에서 고치지 않는다 (`FIX-045` 테스트 간헐 실패 항목과 같은 계열인지는 확인하지 않았다).

## 2. 요구사항 ↔ 구현 대조

spec의 `결정` 절을 요구사항으로 대조한다.

| #   | 요구사항                                                                 | 구현 위치                                                                                                                                                                 | 상태 |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 1   | 라우트 설정이 퀴즈 코드를 첫 청크로 끌고 오지 않는다 — 세션 키 함수 이동 | `pages/review-quiz/model/session-key.ts` `toReviewQuizSessionKey` · `pages/review-quiz/index.ts` 공개 · `-review-quiz-route.ts` import 경로 유지                          | ✅   |
| 2   | `Icon`은 이름 대신 아이콘 컴포넌트를 받는다                              | `shared/ui/icon/icon.tsx` `icon: IconComponent` · `shared/ui/icon-button/icon-button.tsx`                                                                                 | ✅   |
| 3   | 아이콘마다 따로 내보내고 전체 목록은 Storybook 전용 파일로 분리          | `scripts/generate-icons.mjs` → `icons.generated.ts`(named export) · `icon-catalog.generated.ts`(`ICON_CATALOG`)                                                           | ✅   |
| 4   | 앱 코드는 전체 목록을 import하지 않는다                                  | `ICON_CATALOG` 사용처: `icon.stories.tsx` · `icon-button.stories.tsx` · `stories/Iconography.mdx`만 (`rg ICON_CATALOG apps/web/src`)                                      | ✅   |
| 5   | 새 생성물을 직접 편집하지 못한다                                         | `.claude/hooks/fsd-layer-check.mjs` `GENERATED`에 `icon-catalog.generated.ts` 추가                                                                                        | ✅   |
| 6   | 문서가 새 사용법을 따른다                                                | `CLAUDE.md` 함정 4·Tech Stack·명령 · `.claude/rules/import-convention.md` 예시 · `stories/Iconography.mdx`                                                                | ✅   |
| 7   | 첫 청크가 줄고 FCP·LCP가 나빠지지 않는다                                 | spec `결과` — 첫 청크 gzip 200,597 → 170,829 B(`4fb2c6b5` 기준). rebase 후 `06d5669e` 대비 679,799 → 518,842 B(gzip 217,525 → 171,401 B). FCP·LCP 3개 화면 모두 흔들림 안 | ✅   |

## 3. 이전 검증 <!-- MIG- / REF- 전용 -->

| 항목                                                         | 결과 | 근거                                                                                                                                                          |
| ------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plan.md` §3 이전 매핑이 **전량** 반영되었나                 | ✅   | Issue 1 매핑(`toReviewQuizSessionKey` → `model/session-key.ts`) 반영. Issue 2 사용처는 `check-types`가 남은 `name=`을 타입 에러로 잡는다 — 0건                |
| 동작 동일성 — 렌더 결과(SVG · `aria-*` · 크기 · 회전)가 같다 | ✅   | `pnpm test` 609개 통과(`-review-quiz-route.test.tsx` 포함). 사용처별 `name="x"` ↔ `icon={XIcon}` diff 대조 — 앱 코드는 전부 일치 (아래 「막혔던 지점」 참고) |
| 의도적으로 바꾼 것만 바뀌었나                                | ✅   | 아래 표                                                                                                                                                       |
| 남은 옛 API 참조가 없나                                      | ✅   | `rg -n "\bICONS\b\|IconName\b\|<Icon[^>]*\bname=" apps/web/src` — 생성물 외 0건                                                                               |

### 빌드 결과물 확인 (`develop` `06d5669e` 위 빌드, 2026-10-29)

| 확인                                             | 결과                                                 |
| ------------------------------------------------ | ---------------------------------------------------- |
| 첫 청크 `index-*.js` 크기                        | 518,842 B                                            |
| 퀴즈 표식(`option-result-list`)이 첫 청크에 없음 | 0건                                                  |
| 안 쓰는 아이콘 path가 첫 청크에 없음             | `bell-off` · `calendar-remove` · `bar-left` 모두 0건 |
| Storybook 전체 목록 개수                         | `ICON_CATALOG` 91개 = SVG 91개                       |

### 의도적으로 바꾼 것

| 항목                                                                           | 이유                                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `Icon` · `IconButton`의 prop `name` → `icon` (컴포넌트)                        | 이름 문자열로는 빌드가 사용 여부를 알 수 없어 90개가 모두 실렸다 |
| 생성 컴포넌트 이름에 `Icon` 접미사 (`timer.svg` → `TimerIcon`)                 | 같은 파일의 지역 이름(`HomeIcon` 등)·컴포넌트와 겹치지 않게      |
| `Iconography.mdx` 예시 `<Icon name="close" />` → `<Icon icon={CloseMdIcon} />` | 문서 예시만 바뀜. 앱 코드에서 `close`를 쓰는 곳은 없다           |

## 4. 시안 대조 재확인 <!-- FIX- / MIG- 전용 -->

해당 없음 — `REF-` 구조 변경이며 화면 모양을 바꾸지 않는다.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                                             | 상태 |
| ------------------------------- | ------------------------------------------------------------------------------------- | ---- |
| `docs/implementation-status.md` | 해당 없음 — 화면 구현·검증 상태 변화 없음                                             | ✅   |
| `docs/migration-status.md`      | 해당 없음 — `REF-`                                                                    | ✅   |
| 그 외 `docs/`                   | 해당 없음 — 아이콘 사용법은 `CLAUDE.md` · `import-convention.md` · Iconography에 반영 | ✅   |

## 미실시

- **수동 스모크** (`plan.md` §5 동일성 확인): Storybook `Foundations/Iconography` · `/main` 하단 탭 · 북마크 토글 · 비밀번호 보기 · 상단 막대 닫기/뒤로를 화면으로 보지 않았다. 자동 테스트와 사용처 diff 대조로 대신했다. PR #344 리뷰 때 확인을 권한다.
- **rebase 후 FCP·LCP 재측정**: 측정 도구(puppeteer) 설치본이 불완전해 다시 재지 않았다. spec의 측정은 rebase 전 `4fb2c6b5` 기준이다.

## 중간에 막혔던 지점 — 스킬에 반영할 것

- **rebase로 들어온 새 사용처**: 작업 중 `develop`에 공지사항·문제 신고·프로필 편집이 머지돼 옛 방식 사용처 7곳이 새로 생겼다(충돌 1곳 별도). 한 줄 `grep`(`<Icon[^>]*name=`)은 여러 줄에 걸친 props와 `IconButton icon="…"` 3곳을 놓쳤고, `check-types`가 잡았다.
  → prop 계약을 바꾸는 작업은 rebase 뒤 `grep`이 아니라 **`check-types`를 먼저** 돌려 남은 사용처를 찾는다.
- **사용처 diff 대조**: 이름 ↔ 컴포넌트 대조를 정규식으로 하면 삼항식(`backIcon === 'close' ? …`)·여러 줄 props·문서 예시가 어긋나 보인다. 어긋난 줄만 직접 읽어 확인했다.
- **`git worktree remove`**: Windows에서 `node_modules` 경로가 길어 폴더 삭제가 실패했다(`Filename too long`). 등록은 해제되므로 `rmdir /s /q "\\?\<경로>"`로 남은 폴더를 지웠다.
