---
id: 'MIG-066'
planned: '2026-10-26'
mode: 'migrate'
---

# MIG-066 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**
> 이슈 #331 · 브랜치 `feat/#331/lesson-quit-modal` (`origin/develop` `cd6f7ef7`)

## 0. 모드 판정

`mode: migrate` — legacy `features/quiz/ui/modal/lesson-quit-modal.tsx`가 있고 `apps/web`에 없다.
변경 파일이 6개 · 슬라이스 2개(`widgets/quiz-screen`, `pages/lesson-quiz`)라 `refactor-planner` 없이 진행한다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                  |
| --- | ----------------------------------- | --- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | 예  | 목표: 레슨 X → 그만두기 모달. 비목표: 북마크 · 오답 모달, 타이머 멈춤(FIX-067), 버튼 variant 승격, 공통 레이아웃 추출 |
| 2   | 반복 비용이나 확장 차단이 있는가    | 예  | 지금은 X를 실수로 누르면 확인 없이 푼 내역을 잃는다 (spec 계약 C1)                                                    |
| 3   | 보존할 동작의 기준선이 있는가       | 예  | spec 「현행 동작 기준선」 A~E · 동작 계약 C1~C4 · 확정 명세 AC-1~8                                                    |
| 4   | 자동 또는 수동 검증 방법이 있는가   | 예  | AC-1~7은 `lesson-quiz-page.test.tsx` · `-review-quiz-route.test.tsx`(기존 하네스). AC-8은 Storybook · 실기기 대조     |
| 5   | 범위를 독립적으로 완료할 수 있는가  | 예  | 서버 · 생성물 변경 없음. 챕터 이름은 기존 API(`useUnitLessons`)로 얻는다                                              |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | 예  | 라우트 · 인증 · 생성물을 건드리지 않는다. 문제가 생기면 `quitConfirm` prop을 빼면 지금의 X 동작으로 돌아간다          |

### 0-2. 자동 보류 신호

- [ ] 동작 변경이 같이 들어감 — **해당 없음.** 모달 추가 · 챕터 이름 표시는 MIG 범위의 승인된 판정(spec 확인 필요 #1 · 시안 대조 고침)이다
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음
- [ ] 자동 생성물을 직접 손봐야 함 — 해당 없음 (라우트 추가 없음, API 재생성 없음)
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 — 해당 없음
- [ ] 범위 밖 문제가 섞임 — 타이머 멈춤은 `FIX-067`로 이미 분리했다

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                                | 레이어      |
| --- | ----------------------------------------------------------------------- | ----------- |
| 1   | 그만두기 모달 UI (마스코트 · 제목 · 챕터 이름 본문 · 버튼 두 개)        | `[widgets]` |
| 2   | X를 누르면 떠나지 않고 모달을 연다 (`quitConfirm`이 있을 때만)          | `[widgets]` |
| 3   | 「그만두기」는 지금의 X와 같은 링크 동작 (뒤로가기 또는 유닛 상세 교체) | `[widgets]` |
| 4   | 레슨 풀이만 `quitConfirm`을 넘기고 챕터 이름을 조회한다                 | `[pages]`   |

## 2. 영향 분석

| 구분   | 파일 (`apps/web/src`)                                                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 신규   | `widgets/quiz-screen/ui/quiz-quit-modal.tsx` · `widgets/quiz-screen/ui/assets/quit-mascot.webp` · `widgets/quiz-screen/ui/quiz-quit-modal.stories.tsx`                                      |
| 수정   | `widgets/quiz-screen/ui/quiz-top-bar.tsx` · `widgets/quiz-screen/ui/quiz-screen.tsx` · `widgets/quiz-screen/index.ts` · `pages/lesson-quiz/ui/lesson-quiz-page.tsx`                         |
| 테스트 | `pages/lesson-quiz/ui/lesson-quiz-page.test.tsx` (기존 X 테스트 2건 갱신 + AC 추가) · `app/routes/_authenticated/_focus/-review-quiz-route.test.tsx` (AC-7, 기존 X 테스트 그대로 통과 확인) |
| 삭제   | 없음                                                                                                                                                                                        |

npm 의존성 추가: 없음. 에셋은 legacy `shared/assets/_images/mascot-sad.png`(600×680)를 webp로 변환해 넣는다
(legacy 파일은 읽기만 한다).

### 2-1. 이전 매핑

| 현재 위치 (legacy)                                          | 목표 위치 (`apps/web/src`)                       | 변경 종류 | import 영향                    |
| ----------------------------------------------------------- | ------------------------------------------------ | --------- | ------------------------------ |
| `features/quiz/ui/modal/lesson-quit-modal.tsx`              | `widgets/quiz-screen/ui/quiz-quit-modal.tsx`     | 이전      | `quiz-screen.tsx` 1곳 (비공개) |
| `features/quiz/model/use-lesson-modal-store.tsx`의 `'quit'` | `QuizScreen` 안의 `useState` (열림 상태)         | 대체      | 없음 — 전역 스토어 이전 안 함  |
| `widgets/learning-widget/QuizHeader.tsx`의 `onHandleQuit`   | `QuizTopBar`의 `onCloseRequest`                  | 대체      | `quiz-screen.tsx` 1곳          |
| `shared/assets/_images/mascot-sad.png`                      | `widgets/quiz-screen/ui/assets/quit-mascot.webp` | 변환 복사 | 모달 1곳                       |

**위치 판정 근거**

- 모달이 `widgets/quiz-screen` 안에 있는 이유: 닫기 링크의 목적지(`QUIZ_EXIT_ROUTE`)와 뒤로가기 처리(`useHistoryBackClick`)를
  상단바와 「그만두기」가 똑같이 써야 한다. 같은 슬라이스에 두면 목적지 상수를 한 곳에만 둔다.
  `features/`에 두면 목적지를 다시 적거나 shared로 올려야 한다
- 열림 상태는 한 화면 안에서 끝나므로 `useState`다 (`state-convention.md` §1). legacy 전역 스토어는 옮기지 않는다
- 공개 API에 모달 컴포넌트는 내보내지 않는다. `QuizScreenProps`에 `quitConfirm?: { chapterTitle?: string }`만 추가한다
- 챕터 이름 조회는 페이지가 한다 (`useUnitLessons`는 `entities/learning`). 위젯은 이름만 받는다

## 3. 의존 관계 검증

없음. 위젯은 `shared/ui/{modal,button}` · `shared/lib/use-history-back-click`만 새로 쓰고,
페이지는 이미 쓰는 `@/entities/learning`에서 `useUnitLessons`를 더 가져온다.

## 4. 구현 계획 체크리스트

> `shared → entities → features → widgets → pages` 순서. shared · entities · features 변경은 없다.

- [ ] `[widgets]` 에셋: legacy `mascot-sad.png` → `ui/assets/quit-mascot.webp` (원본 비율 유지)
- [ ] `[widgets]` `quiz-quit-modal.tsx` (비공개)
  - props: `open` · `onOpenChange` · `unitId` · `chapterTitle?`
  - 탈퇴 모달과 같은 레이아웃 클래스: `p-4 md:max-w-[630px] md:bg-bg-1 md:p-8 md:shadow-elevation-1`,
    모바일 `bg-bg-0 rounded-8` · 데스크톱 `md:rounded-12` (대조 #1 · #3 · #4)
  - 마스코트 `alt=""`, 너비 150 / 데스크톱 211, `width`/`height` 원본 비율 (대조 #8 · #17)
  - `ModalTitle` "지금까지 푼 내역이 / 모두 사라져요!", `ModalDescription` "{챕터} 학습 출제가 중단됩니다. / 정말 학습을 그만두시나요?"
    — 챕터 이름이 없으면 "학습 출제가 중단됩니다." (AC-2 · AC-3)
  - 「그만두기」: `<Button asChild variant="stroke-secondary" size="cta" className="flex-1 bg-bg-0 text-main"><Link to={QUIZ_EXIT_ROUTE} params replace onClick={useHistoryBackClick()}>` — 상단바 X와 같은 이동 (AC-5 · AC-6)
  - 「계속하기」: `variant="default" size="cta"`, `onOpenChange(false)` (AC-4)
- [ ] `[widgets]` `quiz-top-bar.tsx`: `onCloseRequest?: () => void` 추가. 있으면 보조 키 없는 기본 클릭을 `preventDefault` 하고 호출한다.
      없으면 지금 동작 그대로 (AC-7). `QUIZ_EXIT_ROUTE`를 모달과 같이 쓰도록 같은 슬라이스 안에서 공유한다
- [ ] `[widgets]` `quiz-screen.tsx`: `quitConfirm?: QuizQuitConfirm` prop, 열림 `useState`, 상단바에 `onCloseRequest` 연결, 모달 배치
- [ ] `[widgets]` `index.ts`: `type QuizQuitConfirm` 내보내기
- [ ] `[widgets]` `quiz-quit-modal.stories.tsx`: 챕터 이름 있음 · 없음 두 상태 (AC-8 대조용 문서)
- [ ] `[pages]` `lesson-quiz-page.tsx`: `useUnitLessons(unitId)`로 `chapterTitle`을 읽어 `quitConfirm={{ chapterTitle }}` 전달.
      응답 전 · 실패면 `undefined`
- [ ] 테스트 (`lesson-quiz-page.test.tsx`)
  - 기존 「닫기는 기록을 남기지 않아…」는 X → 「그만두기」로 바꾼다 (승인된 동작 변경: X가 바로 떠나지 않는다)
  - AC-1 X → 대화상자 · 경로 그대로 / AC-2 챕터 이름 / AC-3 레슨 목록 실패 시 이름 빠짐
  - AC-4 「계속하기」 · Esc · 바깥 클릭 → 닫히고 문제 그대로 / AC-5 이전 기록으로 / AC-6 직접 진입 → 유닛 상세 교체
- [ ] 테스트 (`-review-quiz-route.test.tsx`): 기존 X 테스트가 수정 없이 통과하는지 확인하고, 대화상자가 없다는 단언을 하나 더한다 (AC-7)
- [ ] 증분 검사: 단위마다 `pnpm --filter @repo/web check-types`

## 5. 리스크

| 리스크                                                                 | 영향                                         | 대응                                                                                |
| ---------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------- |
| 「그만두기」 링크가 모달 Portal 안에 있어 `useCanGoBack`이 다르게 동작 | 직접 진입에서 뒤로가기로 앱 밖에 나감        | 같은 라우터 컨텍스트라 동작이 같다. AC-5 · AC-6 테스트로 두 경로를 모두 고정한다    |
| 페이지가 유닛 레슨 목록을 새로 요청                                    | 직접 진입 시 요청 1건 추가                   | 유닛 상세에서 들어오면 캐시를 쓴다. 실패해도 모달은 열린다 (AC-3)                   |
| `onLeave` 저장본 삭제가 「그만두기」에서 안 돌 수 있음                 | 다시 들어오면 그만둔 풀이가 복원됨 (계약 C4) | 같은 라우트 이탈이라 `onLeave`가 돈다. 수동 스모크로 확인                           |
| 모달이 열린 동안 타이머가 흐름                                         | legacy와 학습 시간이 다름                    | 승인된 "나중" (FIX-067). 이번에는 바꾸지 않는다                                     |
| `stroke-secondary` + 클래스 덮어쓰기                                   | 버튼 상태색이 섞일 수 있음                   | 탈퇴 모달과 같은 조합이라 이미 검증된 모양이다. Storybook에서 hover · 비활성을 본다 |

### 동일성 확인 방법

| 방법        | 내용                                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| 자동 테스트 | AC-1~7 (위 체크리스트)                                                                                                 |
| 수동 스모크 | 유닛 상세 → 레슨 → 2문제 풀기 → X → 계속하기 → 같은 문제 · 답 / X → 그만두기 → 유닛 상세 → 같은 레슨 재진입 시 1번부터 |
| 수동 스모크 | 레슨 주소 직접 입력 → X → 그만두기 → 유닛 상세, 뒤로가기로 풀이에 돌아오지 않음                                        |
| 명시적 대조 | Storybook 모달 ↔ Figma `15603:48922` · `15603:49079` (배경 · 모서리 · 그림자 · 마스코트 비율)                         |
| 실기기      | iOS 앱에서 모달 버튼이 하단 안전 영역과 겹치지 않는지 (가운데 정렬이라 예상상 문제 없음)                               |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] `docs/implementation-status.md` 레슨 풀이 항목에 그만두기 모달 반영
- [ ] `docs/migration-status.md`에 legacy `lesson-quit-modal` 대체 완료 반영
- [ ] 확정 명세 승격: 레슨 풀이 화면 명세가 `docs/fe-implement-spec/`에 있으면 그만두기 모달 절 추가
- [ ] 새 규칙 없음
