---
id: 'FEAT-038'
planned: '2026-09-19'
mode: 'feature'
---

# FEAT-038 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**
> 이슈 단위 범위와 AC는 `issues.md`가 정본이다. 이 문서는 **work task 전체의 구현 순서**를 정한다.

## 0. 모드 판정

`mode: feature` — legacy에 풀이 화면이 있지만 **이전하지 않는다.** 동작·디자인·서버 계약이
모두 새로 정의됐다(`spec.md` 배경). 없던 것을 만드는 작업이므로 `FEAT-`다.

선행 조건 충족 — `feature-planner` 1~3단계 완료(`spec.md`의 배경·범위·용어·ADR-1~4,
`issues.md`의 이슈 6종), `issue-reviewer` 필수 지적 5건 반영 완료.

착수 전 필수 게이트(§0-1)와 이전 매핑(§2-1)은 `MIG-`·`REF-` 전용이라 해당 없음.
**자동 보류 신호**는 아래 하나만 걸리고, 처리 방침을 §5에 적었다.

- [x] 범위 밖 문제가 섞임 → `FIX-037`과 겹치는 구간이 있다. **§5 리스크 3**에서 경계를 정했다

---

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                   | 레이어                             | 이슈 |
| --- | ------------------------------------------ | ---------------------------------- | ---- |
| 1   | 문제 목록 조회·변환                        | `[entities]`                       | 1    |
| 2   | 랜딩 로딩 화면 (제출 중·결과 pending 공용) | `[shared]`                         | 1    |
| 3   | 문제 카드 표시 (번호·발문·본문)            | `[entities]`                       | 1    |
| 4   | 상단바·타이머·닫기                         | `[shared]` `[pages]`               | 1    |
| 5   | 선지 표시 (미제출 / 제출 후)               | `[shared]` `[entities]`            | 2    |
| 6   | 풀이 세션 상태·객관식 채점                 | `[features]`                       | 2    |
| 7   | 주관식 입력·채점                           | `[shared]` `[features]`            | 3    |
| 8   | 문제 간 이동·진행 상태                     | `[features]` `[widgets]` `[pages]` | 4    |
| 9   | 정확도 계산·일괄 제출·결과 라우트          | `[features]` `[entities]` `[app]`  | 5    |
| 10  | 결과 화면 마감 (배경·XP·버튼)              | `[entities]` `[shared]` `[pages]`  | 6    |

### 1-1. 관리 포인트 식별

상수로 뽑을 값 vs 인라인. **애매하면 인라인이 기본값이다.**

| 값                                     | 상수 / 인라인 | 근거                                                                                                                                                          |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 닫기·`홈으로`·`이어서 학습하기` 목적지 | **상수**      | 확인 필요 5·14가 **「교체 지점을 한 곳에 모아 둔다」를 잠정 결정의 조건**으로 달았다. 답이 오면 한 곳만 고친다. `shared/config/`에 둔다 (`nav-items.ts` 선례) |
| `❌ 오답입니다!` · `👏🏻 정답입니다!`    | **상수**      | 객관식(D10·D12)과 주관식(D11·D12) 두 곳이 같은 문구를 쓴다. 한쪽만 바뀌면 화면이 어긋난다                                                                     |
| D1 로딩의 팁 문구                      | **상수**      | 기획이 바꿀 값이고 로딩·제출 중·결과 pending 세 곳이 쓴다                                                                                                     |
| `data-result` · `data-status` 값       | **상수**      | 표시(`entities`)와 검증(테스트) 양쪽의 계약이다. 문자열을 두 곳에 손으로 적지 않는다                                                                          |
| 타이머 표시 형식 `mm:ss`               | 인라인        | 포맷 함수 하나로 끝난다. 뽑을 관리 포인트가 아니다                                                                                                            |
| 레이아웃 수치 (간격·폭)                | 인라인        | `constants-convention.md` — 레이아웃 수치는 매직 넘버가 아니다                                                                                                |

> i18n이 아니다. 키를 추상화하지 않고 **값은 한국어 그대로** 둔다 (`i18n-policy.md`).

---

## 2. 영향 분석

### 신규

| 레이어     | 파일                                                                                  | 이슈 |
| ---------- | ------------------------------------------------------------------------------------- | ---- |
| `shared`   | `config/learning-routes.ts` — 목적지 상수                                             | 1    |
| `shared`   | `lib/use-elapsed-seconds.ts` (+test)                                                  | 1    |
| `shared`   | `ui/loading-screen/` — D1. 마스코트 에셋 포함                                         | 1    |
| `shared`   | `ui/radio/` (+test, stories)                                                          | 2    |
| `shared`   | `ui/accordion/` (+test, stories)                                                      | 2    |
| `shared`   | `ui/text-field/` (+test, stories)                                                     | 3    |
| `entities` | `problem/` — `index.ts` · `api/use-lesson-problems.ts` · `model/problem.ts` (+test)   | 1    |
| `entities` | `problem/ui/problem-card.tsx`                                                         | 1    |
| `entities` | `problem/ui/option-list.tsx` — 표시 전용. 행동을 모른다                               | 2    |
| `entities` | `learning/api/use-lesson-result.ts`                                                   | 5    |
| `features` | `lesson-quiz/model/quiz-session.ts` (+test) · `quiz-session-context.tsx`              | 2    |
| `features` | `lesson-quiz/model/grade-objective.ts` (+test)                                        | 2    |
| `features` | `lesson-quiz/ui/objective-solver.tsx`                                                 | 2    |
| `features` | `lesson-quiz/model/grade-subjective.ts` (+test) · `ui/subjective-answer.tsx`          | 3    |
| `features` | `lesson-quiz/model/progress.ts` (+test)                                               | 4    |
| `features` | `lesson-quiz/model/accuracy.ts` (+test) · `api/use-submit-lesson.ts`                  | 5    |
| `widgets`  | `quiz-progress-panel/`                                                                | 4    |
| `pages`    | `lesson-quiz/` — `index.ts` · `ui/lesson-quiz-page.tsx` (+test) · `ui/quiz-timer.tsx` | 1    |
| `pages`    | `lesson-result/` — `index.ts` · `ui/lesson-result-page.tsx` (+test)                   | 5    |
| `app`      | `routes/.../learning.lessons.$lessonId.result.$submissionId.tsx`                      | 5    |

### 수정

| 파일                                                      | 내용                                       | 이슈 |
| --------------------------------------------------------- | ------------------------------------------ | ---- |
| `app/routes/.../learning.lessons.$lessonId.tsx`           | `() => null` → 페이지 연결 + 파라미터 검증 | 1    |
| `entities/learning/index.ts`                              | `useLessonResult` 배럴 추가                | 5    |
| `entities/user/model/level.ts` · `entities/user/index.ts` | `toLevelProgress` 추가                     | 6    |
| `shared/ui/layout/space-background.tsx`                   | 결과용 variant — **에셋 도착 후 판단**     | 6    |
| `app/routeTree.gen.ts`                                    | **재생성** (직접 편집 금지)                | 5    |

### 삭제

없음.

### 실측 — 레슨 라우트 참조처

```
app/routes/_authenticated/_focus/learning.lessons.$lessonId.tsx
app/routeTree.gen.ts
pages/unit-detail/ui/unit-detail-page.tsx
pages/unit-detail/ui/unit-detail-page.test.tsx
```

유닛 상세가 `to="/learning/lessons/$lessonId"`로 링크를 걸어 둔 것이 전부다. **기존 화면을
고칠 일이 없다** — 빈 라우트를 채우는 작업이라 바깥 영향이 라우트 트리 재생성뿐이다.

npm 의존성 추가: **없음.** 라디오·아코디언·텍스트 필드를 직접 만든다 — `@radix-ui/react-dialog`와
`react-slot`만 쓰는 현재 구성에 프리미티브 라이브러리를 새로 들이지 않는다.

---

## 3. 의존 관계 검증

FSD 위반이 생기는 지점과 대안.

| 지점                                                        | 방향                       | 판정                                                           |
| ----------------------------------------------------------- | -------------------------- | -------------------------------------------------------------- |
| `widgets/quiz-progress-panel` → 세션                        | `widgets(3) → features(2)` | ✅ 하향. ADR-3이 이미 확인                                     |
| `pages/lesson-quiz` → `features`·`entities`                 | 하향                       | ✅                                                             |
| `pages/lesson-result` → `entities/learning`·`entities/user` | 하향                       | ✅ 페이지가 두 엔티티를 **조립**한다. 엔티티끼리는 서로 모른다 |
| `entities/problem/ui/option-list` → 정/오답 상태            | —                          | ✅ prop으로 받는다. `features`를 import하지 않는다             |
| `features/lesson-quiz` → `entities/problem`                 | 하향                       | ✅                                                             |

**cross-slice 위험 한 곳** — 목적지 상수를 `pages`에 두면 `lesson-quiz`와 `lesson-result`가
서로를 참조하게 된다(같은 레이어). 그래서 `shared/config/learning-routes.ts`로 내린다.

**`entities/problem`과 `entities/learning`을 잇지 않는다.** 결과 조회 훅은 `learning`에,
문제 조회 훅은 `problem`에 두고 둘을 아는 것은 `pages`뿐이다.

---

## 4. 구현 계획 체크리스트

**이슈 순서 = 의존 순서**이고, 각 이슈 안에서 `shared → entities → features → widgets → pages → app`을 지킨다.

### Issue 1 — 레슨에 들어가면 문제를 읽을 수 있다

- [x] `[shared]` `config/learning-routes.ts` — 닫기·결과 목적지 상수 (확인 필요 5·14의 교체 지점)
- [x] `[shared]` `lib/use-elapsed-seconds.ts` + 테스트
- [x] `[shared]` `ui/loading-screen/` — 마스코트·`로딩중...`·팁 문구
- [x] `[entities]` `problem/model/problem.ts` + 테스트 (AC-1·2)
- [x] `[entities]` `problem/api/use-lesson-problems.ts` — `enabled` 가드
- [x] `[entities]` `problem/ui/problem-card.tsx` — 북마크 아이콘은 **렌더하지 않는다**
- [x] `[entities]` `problem/index.ts` 배럴
- [x] `[pages]` `lesson-quiz/ui/quiz-timer.tsx` — 훅을 **이 컴포넌트 안에서만** 호출해 매초 리렌더를 가둔다
- [x] `[pages]` `lesson-quiz/ui/lesson-quiz-page.tsx` — 상단바·문제 카드·타이머·에러(`CardRetryStatus`)
- [x] `[app]` 라우트 component 연결 + **`lessonId` 파라미터 검증**(§5 리스크 3)
- [x] 검증: 변경 파일 대상 `lint` · `check-types` · 해당 테스트

### Issue 2 — 객관식 한 문제를 풀면 정/오답과 해설이 보인다

- [x] `[shared]` `ui/radio/` · `ui/accordion/`
- [x] `[entities]` `problem/ui/option-list.tsx` — `data-result` 계약. **표시 전용**
- [x] `[features]` `lesson-quiz/model/quiz-session.ts` — reducer 순수 함수 + `startedAt` 보관
- [x] `[features]` `lesson-quiz/model/grade-objective.ts`
- [x] `[features]` `lesson-quiz/model/quiz-session-context.tsx` — 시간은 넣지 않는다 (ADR-1)
- [x] `[features]` `lesson-quiz/ui/objective-solver.tsx` — 클릭→채점→기록 **연결만**
- [x] `[pages]` Provider 연결
- [x] 검증

### Issue 3 — 주관식 (Issue 4와 병렬)

- [x] `[shared]` `ui/text-field/` — 에러 상태 포함
- [x] `[features]` `grade-subjective.ts` + 테스트 (AC-1~4)
- [x] `[features]` `ui/subjective-answer.tsx`
- [x] 검증

### Issue 4 — 이동·진행 패널 (Issue 3과 병렬)

- [x] `[features]` `quiz-session.ts`에 `goToNext`·`goToPrevious`·`goTo` 추가
- [x] `[features]` `model/progress.ts` — `data-status` 값 계산
- [x] `[widgets]` `quiz-progress-panel/` — **조립만.** 위치·개폐 상태를 갖지 않는다 (ADR-4)
- [x] `[pages]` 넓은 화면 좌측 열 배치 · 좁은 화면은 렌더하지 않음 · 이동 버튼
- [x] 검증

### Issue 5 — 제출하고 결과를 본다

- [ ] `[features]` `model/accuracy.ts` + 테스트 (분모 = 전체 문제 수)
- [ ] `[features]` `api/use-submit-lesson.ts` — 제출 본문 조립 · 성공 시 결과 prefetch
- [ ] `[entities]` `learning/api/use-lesson-result.ts` + 배럴
- [ ] `[pages]` `lesson-result/` — 정답률·풀이 시간·에러 상태
- [ ] `[pages]` `lesson-quiz` — 제출 중 로딩 · 성공 시 `navigate({ replace: true })`
- [ ] `[app]` 결과 라우트 파일 추가 + 파라미터 검증
- [ ] `[app]` **라우트 트리 재생성** — `pnpm --filter @repo/web dev` 또는 `build`로 갱신
- [ ] 검증

### Issue 6 — 결과 화면 마감 (**배경 에셋 수령 후 시작**)

- [ ] `[entities]` `user/model/level.ts`에 `toLevelProgress` + 테스트 (분모 0 포함)
- [ ] `[shared]` 배경 처리 — `SpaceBackground` variant 추가 vs 결과 전용 (에셋 보고 판단)
- [ ] `[pages]` 결과 카드 · XP 막대 · 버튼 2종
- [ ] 검증

### 마지막

- [ ] 전체 검증 `lint` → `check-types` → `test` → `build` (`ai-validate`)
- [ ] 변경 파일 `pnpm exec prettier --check` (`format:check` 전체는 `REF-003` 때문에 실패한다)

---

## 5. 리스크

| #   | 리스크                                                                           | 영향                                                               | 대응                                                                                                                   |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **orval 재생성분이 커밋되지 않았다** (`accuracy`·`learningTime`·`minXp`·`maxXp`) | Issue 5·6이 없는 필드를 쓴다. 다른 브랜치에서 되돌아오면 타입 붕괴 | Issue 5 착수 **전에** 커밋 상태를 확인한다. 미커밋이면 사용자에게 커밋 여부를 묻는다. 생성 파일을 손으로 고치지 않는다 |
| 2   | **Context 리렌더** — 타이머가 매초 세션 구독자를 다시 그린다                     | 문제 영역이 초당 1회 리렌더                                        | 시간을 세션에 넣지 않는다. 표시는 `QuizTimer` 안에 가두고, 제출용 경과 시간은 세션의 `startedAt`에서 그 순간 계산한다  |
| 3   | **`FIX-037`과 범위가 겹친다**                                                    | 같은 문제를 두 작업이 건드리거나, 둘 다 안 건드린다                | 아래 별도 절                                                                                                           |
| 4   | 라우트 트리 재생성 누락                                                          | `check-types` 실패                                                 | Issue 5 체크리스트에 단계로 박아 뒀다                                                                                  |
| 5   | 프리미티브 3종을 직접 만든다 (라디오·아코디언·텍스트 필드)                       | 접근성 구현이 얕으면 키보드·스크린리더에서 깨진다                  | `component-convention.md`의 접근성 절을 따르고, 아코디언은 `button` + `aria-expanded` + `aria-controls`로 만든다       |
| 6   | 확인 필요 4(배경 에셋)가 안 오면 Issue 6이 시작되지 않는다                       | 결과 화면이 Issue 5 수준에서 멈춘다                                | Issue 5까지가 독립적으로 완결되게 잘라 뒀다. 에셋 대기가 앞 이슈를 막지 않는다                                         |

### 리스크 3 — `FIX-037`과의 경계

`FIX-037`(학습 라우트 파라미터 계약)이 `/learning/lessons/abc`를 **「미정 — 풀이 화면 본체가
아직 없다」**로 남겨 뒀다. 그 본체를 지금 만든다.

숫자가 아닌 파라미터가 들어오면 조회 훅의 `enabled`가 `false`가 되어 **로딩 화면이 영원히
남는다** — `FIX-037`이 기존 라우트에서 관찰한 바로 그 증상이다.

**경계를 이렇게 긋는다.**

- FEAT-038은 **자기가 새로 쓰는 두 라우트**(`$lessonId` · `$submissionId`)에서 파라미터를
  검증하고 `notFound()`를 던진다. `__root.tsx`에 `notFoundComponent`가 이미 걸려 있어 새 화면이
  필요 없다. **알면서 같은 결함을 새로 만들지 않는다**는 뜻이지 FIX-037을 흡수하는 게 아니다
- **기존 라우트 3종(`chapters` · `units` · `concept-note`)은 건드리지 않는다.** 그건 FIX-037의
  몫이고, 손대면 「무엇 때문에 깨졌는지」 구분이 안 된다 (`work-management.md` §7)
- FIX-038 완료 후 **FIX-037의 `spec.md` 범위에서 `_focus` 레슨 라우트 줄을 줄여야 한다** —
  완료 액션에 넣었다

### 검증 방법

`FEAT-`라 동일성 대조 대상은 없다. `issues.md`의 AC가 검증 기준이고, 아래로 확인한다.

| 방법        | 내용                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| 자동 테스트 | AC의 `단위` 20개 — 채점·reducer·정확도·진행 상태·레벨 진행률. 순수 함수라 싸다        |
| 자동 테스트 | AC의 `통합` — MSW가 이미 전역 설정돼 있다(`vitest.setup.ts`). 라우트 렌더로 검증      |
| 수동 스모크 | 유닛 상세 → 레슨 진입 → 객관식·주관식 섞어 풀기 → 건너뛰기 → 패널로 되돌아가기 → 제출 |
| 수동 스모크 | 결과 URL 새로고침 — **ADR-2가 별도 라우트를 고른 이유**라 반드시 눈으로 본다          |
| 명시적 대조 | 시안 D1~D19 중 이번 범위 항목. 어긋나면 고치지 말고 `design-diff`로 목록화            |

---

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 `git mv`
- [ ] `docs/implementation-status.md`에 레슨 풀이·결과 화면 상태 반영
- [ ] MIG 작업이 아니므로 `docs/migration-status.md`는 **건드리지 않는다**
- [ ] 확정 명세를 `docs/fe-implement-spec/{화면ID}/`로 승격 — 화면 ID를 사용자에게 확인
- [ ] `FIX-037` 범위에서 `_focus` 레슨 라우트 항목 제외 (리스크 3)
- [ ] `LEVEL_XP_TABLE` 정리를 새 작업으로 등록 (확인 필요 2의 남는 부채)
- [ ] 시안 갱신 요청 항목 전달 — D9·D10 (R9·R11과 어긋남), 확인 필요 13
- [ ] 새 규칙이 생기면 `.claude/rules/`·`docs/conventions/`에 반영
      — 후보: **세션성 상태의 `useReducer` + Context 패턴.** `state-convention.md`에 Context 항목이
      없다. 두 번째 사용처가 생기면 규칙으로 올린다
