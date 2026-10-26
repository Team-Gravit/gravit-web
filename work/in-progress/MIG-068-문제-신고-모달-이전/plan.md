---
id: 'MIG-068'
planned: '2026-10-26'
mode: 'migrate'
---

# MIG-068 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**
> GitHub 이슈 · 브랜치는 아직 없다. 착수 전에 이슈를 만들고 `origin/develop`에서
> `feat/#{이슈}/problem-report`를 딴다 (현재 브랜치 `feat/#331/lesson-quit-modal`은 PR #332 대기 중).

## 0. 모드 판정

`mode: migrate` — legacy `features/quiz/ui/modal/report-modal.tsx` · `report-result-modal.tsx`가 있고 `apps/web`에 없다.
새 feature 슬라이스 1개 + 위젯 1곳 수정이다. 파일은 테스트 · 스토리 · 에셋을 포함해 약 12개지만
한 슬라이스 안에 모이고 실행 이슈로 나눌 단위가 없어 `refactor-planner` 없이 진행한다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                                                   |
| --- | ----------------------------------- | --- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | 예  | 목표: 세 풀이 화면의 신고 버튼 → 작성 모달 → 성공 모달. 비목표: 타이머 멈춤(`FIX-067`), 공용 체크박스 · 모달 머리 승격, 신고 목록 화면 |
| 2   | 반복 비용이나 확장 차단이 있는가    | 예  | `apps/web`에서는 문제 오류를 알릴 경로가 없다. `FEAT-038` · `FEAT-044` · `MIG-048`이 매번 범위 밖으로 미뤘다                           |
| 3   | 보존할 동작의 기준선이 있는가       | 예  | spec 「현행 동작 기준선」 A~F · 동작 계약 K1~K5 · 확정 명세 AC-1~12                                                                    |
| 4   | 자동 또는 수동 검증 방법이 있는가   | 예  | AC-3 · 4는 폼 훅 단위 테스트, AC-1 · 2 · 5~11은 MSW 통합 테스트, AC-12는 Storybook · Figma 대조                                        |
| 5   | 범위를 독립적으로 완료할 수 있는가  | 예  | 서버 · 생성물 · 라우트 변경 없음. 생성된 `useSubmitProblemReport`를 그대로 쓴다                                                        |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | 예  | 인증 · 라우트 · 생성물을 건드리지 않는다. 위젯에서 신고 버튼 한 줄을 빼면 지금 상태로 돌아간다. 풀이 상태와 연결이 없다 (K4)           |

### 0-2. 자동 보류 신호

- [ ] 동작 변경이 같이 들어감 — **해당 없음.** 열 때마다 비움 · 실패 토스트 · 로딩 · 시안 반영은 spec에서 판정받은 MIG 범위다
- [ ] 한 단위로 완료·검증할 수 없음 — 해당 없음
- [ ] 자동 생성물을 직접 손봐야 함 — 해당 없음. `report-api.ts`는 이미 생성돼 있다
- [ ] 기존 검증 실패의 원인·영향 범위를 설명할 수 없음 — 해당 없음. 직전 `pnpm verify`의 시간 초과 2건(`problem-card.test.tsx` · `-concept-note-route.test.tsx`)은 단독 실행 시 통과, 부하로 인한 것으로 PR #332에 기록
- [ ] 범위 밖 문제가 섞임 — 타이머 멈춤은 `FIX-067`로 분리했다

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                                        | 레이어       | AC          |
| --- | ------------------------------------------------------------------------------- | ------------ | ----------- |
| 1   | 신고 유형 4개(문구 · API 값 · 순서)와 폼 상태(선택 · 내용 · 제출 가능 · 비우기) | `[features]` | AC-3 · 4    |
| 2   | 신고 제출 API 훅 — 성공/실패 콜백                                               | `[features]` | AC-6 · 7    |
| 3   | 작성 모달 UI (머리 · 유형 4줄 · 신고 사유 입력칸 · 버튼 두 개)                  | `[features]` | AC-2 · 5    |
| 4   | 성공 모달 UI (체크 아이콘 · 제목 · 설명 3줄 · 확인)                             | `[features]` | AC-8        |
| 5   | 신고 버튼 — 모달 열림 · 비우기 · 성공 전환 · 실패 토스트를 묶는다               | `[features]` | AC-2 · 8~11 |
| 6   | 세 풀이 화면의 상단바 오른쪽에 신고 버튼 배치                                   | `[widgets]`  | AC-1        |

## 2. 영향 분석

| 구분 | 파일 (`apps/web/src/`)                                                                                                  |
| ---- | ----------------------------------------------------------------------------------------------------------------------- |
| 신규 | `features/problem-report/index.ts`                                                                                      |
| 신규 | `features/problem-report/model/report-type.ts` — 유형 4개 (문구 · `reportType`)                                         |
| 신규 | `features/problem-report/model/use-report-form.ts` + `.test.ts`                                                         |
| 신규 | `features/problem-report/model/constants.ts` — 버튼 이름 · 실패 문구                                                    |
| 신규 | `features/problem-report/api/use-submit-problem-report.ts`                                                              |
| 신규 | `features/problem-report/ui/problem-report-button.tsx` + `.test.tsx`                                                    |
| 신규 | `features/problem-report/ui/problem-report-modal.tsx`                                                                   |
| 신규 | `features/problem-report/ui/problem-report-success-modal.tsx`                                                           |
| 신규 | `features/problem-report/ui/assets/report-success-check.svg` — Figma `15603:48911`에서 내보냄                           |
| 신규 | `features/problem-report/ui/problem-report.stories.tsx`                                                                 |
| 수정 | `widgets/quiz-screen/ui/quiz-top-bar.tsx` — 오른쪽 액션 자리(`trailingAction`) · `quiz-screen.tsx` — 신고 버튼을 넘긴다 |
| 수정 | `pages/lesson-quiz/ui/lesson-quiz-page.test.tsx` · `app/routes/…/-review-quiz-route.test.tsx` — AC-1 확인 1건씩         |
| 삭제 | 없음                                                                                                                    |

npm 의존성 추가: 없음. 라우트 추가 없음. API 재생성 없음.

조사: `rg -l "renderProblemAction"` → `widgets/quiz-screen/ui/quiz-screen.tsx` · `pages/lesson-quiz` · `pages/review-quiz`.
세 풀이 화면이 모두 `QuizScreen`을 쓰므로 위젯 한 곳에 넣으면 세 화면에 들어간다.

### 2-1. 이전 매핑

| 현재 위치 (legacy `src/`)                                         | 목표 위치 (`apps/web/src/`)                                           | 변경 종류 | import 영향                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | --------- | --------------------------------- |
| `features/quiz/ui/modal/report-modal.tsx`                         | `features/problem-report/ui/problem-report-modal.tsx`                 | 재작성    | 슬라이스 내부만                   |
| 같은 파일의 `OPTIONS` · `isValid` · 폼 상태                       | `features/problem-report/model/report-type.ts` · `use-report-form.ts` | 분해      | 슬라이스 내부만                   |
| `features/quiz/ui/modal/report-result-modal.tsx`                  | `features/problem-report/ui/problem-report-success-modal.tsx`         | 재작성    | 슬라이스 내부만                   |
| `features/quiz/ui/modal/ReportButton.tsx`                         | `features/problem-report/ui/problem-report-button.tsx`                | 재작성    | `widgets/quiz-screen` 1곳         |
| `features/quiz/model/use-lesson-modal-store.tsx` (전역 모달 상태) | 버튼 컴포넌트의 지역 상태                                             | 대체      | 없음 — 전역 store를 옮기지 않는다 |
| `entities/learning/ui/problem-header.tsx`의 버튼 배치             | `widgets/quiz-screen`의 상단바 오른쪽                                 | 대체      | 위젯 1곳                          |

**배치 근거**

- 「문제를 신고한다」는 사용자 행동 하나 → `features/problem-report` (`fsd-features.md`). 이웃 `problem-bookmark`와 같은 형태
- 유형 · 폼 규칙은 이 행동에만 쓰여 `entities`로 내리지 않는다
- 체크박스 · 모달 머리(제목 + X + 구분선)는 지금 이 슬라이스만 쓴다 → 공용으로 승격하지 않고 슬라이스 안에 둔다 (`refactor-checklist.md` 공통화 판단). 공용화는 두 번째 사용처가 생길 때 판단
- 열림 · 비우기 상태는 버튼 하나의 수명이라 Zustand가 아니라 지역 상태 (`state-convention.md`). legacy 전역 store는 옮기지 않는다
- 유형 선택은 하나만 고르므로 의미상 **라디오 그룹**으로 만든다 (`role="radiogroup"`). 모양만 시안의 체크박스

## 3. 의존 관계 검증

없음. `widgets/quiz-screen → features/problem-report → shared` 하향만 생긴다.
`features/problem-report`는 다른 feature를 import하지 않는다. 생성 API는 슬라이스 `api/`에서만 감싼다.

## 4. 구현 계획 체크리스트

- [ ] `[features]` `model/report-type.ts` — 유형 4개 (문구 · `TYPO_ERROR` · `CONTENT_ERROR` · `ANSWER_ERROR` · `OTHER_ERROR`) (K1)
- [ ] `[features]` `model/use-report-form.ts` — 선택 유형 · 내용 · `canSubmit`(유형 있고 공백 아닌 글자 1개 이상) · `reset` + 단위 테스트 (AC-3 · 4)
- [ ] `[features]` `model/constants.ts` — "문제 신고" · "신고에 실패했어요. 다시 시도해 주세요."
- [ ] `[features]` `api/use-submit-problem-report.ts` — 생성 훅을 감싸 `onSuccess` · `onError`를 받는다. 본문은 입력 그대로 (AC-6)
- [ ] `[features]` `ui/assets/report-success-check.svg` — Figma `15603:48911` SVG 내보내기
- [ ] `[features]` `ui/problem-report-modal.tsx` — 공용 `Modal` · `ModalTitle`, 유형 라디오 4줄, `FloatingTextArea`(라벨 "신고 사유"), `Button` `stroke-neutral` · `default` `size="cta"`, 「제출하기」 `isLoading`
- [ ] `[features]` `ui/problem-report-success-modal.tsx` — 체크 아이콘 · 제목(좁은 화면 2줄) · 설명 3줄 · 「확인」
- [ ] `[features]` `ui/problem-report-button.tsx` — `siren` 아이콘 버튼. 열 때 `reset`, 성공 → 작성 닫고 성공 열기, 실패 → 모달 유지 + `toast(…, { position: 'noneTabBottom' })` (AC-8 · 9 · 10)
- [ ] `[features]` `index.ts` — `ProblemReportButton`만 내보낸다
- [ ] `[features]` `ui/problem-report-button.test.tsx` — MSW로 AC-2 · 5~11
- [ ] `[features]` `ui/problem-report.stories.tsx` — 작성(빈 · 입력됨) · 성공 (AC-12)
- [ ] `[widgets]` `quiz-top-bar.tsx`에 오른쪽 액션 자리를 두고, `quiz-screen.tsx`가 현재 문제의 `<ProblemReportButton>`을 넘긴다
- [ ] `[pages]` 레슨 · 북마크 · 오답 풀이 테스트에 「문제 신고」 버튼 존재 확인 1건씩 (AC-1)
- [ ] 증분 검사: `pnpm --filter @repo/web lint` · `check-types` · 변경 테스트

## 5. 리스크

| 리스크                                                     | 영향                                       | 대응                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `FloatingTextArea` `area` 크기는 데스크톱 높이 400         | 웹 시안(최소 130)보다 크게 보인다          | 이 사용처에서 `md:` 높이만 className으로 덮는다. 공용 variant는 바꾸지 않는다                  |
| 공용 `Modal` 기본 패딩(`px-4 pt-9 pb-5`) · `max-w-[600px]` | 시안 머리 · 폭(630)과 다르다               | 그만두기 모달처럼 className으로 덮는다. 머리는 슬라이스 안에서 만든다                          |
| 작성 → 성공 모달 전환 시 포커스 · 스크롤 잠금              | 두 Radix 대화상자가 겹치면 포커스가 꼬인다 | 작성 모달을 닫은 뒤 성공 모달을 연다 (동시에 열지 않는다). 통합 테스트에서 대화상자 1개만 확인 |
| 모달 위 토스트 노출                                        | 실패 안내가 모달 뒤에 가려진다             | 토스트 포털이 모달보다 늦게 붙어 위에 온다 (확인함). AC-9에서 토스트 존재 확인                 |
| 모달이 열린 동안 타이머가 흐른다                           | legacy와 다르다 (F1)                       | `FIX-067`에서 그만두기 모달과 함께 처리 (판정 6)                                               |
| `reportType` 4개 값은 OpenAPI가 `string`으로만 보장        | 오타가 나면 서버가 거부 · 오분류           | `report-type.ts`를 단일 출처로 두고 AC-6에서 본문 값을 확인                                    |

### 동일성 확인 방법

| 방법        | 내용                                                                                    |
| ----------- | --------------------------------------------------------------------------------------- |
| 자동 테스트 | AC-3 · 4 (폼 훅), AC-1 · 2 · 5~11 (MSW 통합) — 계약 K1~K5를 모두 덮는다                 |
| 명시적 대조 | 유형 문구 4개 · 성공 문구 · 요청 본문 키를 legacy 기준선(B2 · C3 · C4 · E2 · E3)과 비교 |
| 시각 대조   | Storybook을 Figma 4프레임과 비교 (AC-12, 사용자 확인)                                   |
| 수동 스모크 | dev에서 레슨 풀이 → 신고 → 성공 모달 → 확인 → 같은 문제 · 답 유지                       |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] `docs/implementation-status.md`에 신고 기능 반영
- [ ] `docs/migration-status.md`에 legacy 신고 모달 대체 완료 반영
- [ ] 확정 명세를 `docs/fe-implement-spec/`로 승격 (풀이 화면 명세에 추가)
- [ ] Figma 링크를 `docs/design-system/README.md` §2에 기록 (없으면)
