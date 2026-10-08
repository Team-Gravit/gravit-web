---
id: 'MIG-027'
validated: '2026-09-16'
mode: 'migrate'
---

# MIG-027 검증 결과

> `ai-validate` 산출물. **생략 금지.**
> 실패 시 수정 후 재검증 **최대 3회**. 초과하면 보고하고 중단한다.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                    |
| --- | --------------- | -------------------------------------------------- | ----------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ 2 tasks              |
| 2   | 타입            | `pnpm --filter @repo/web check-types`              | ✅                      |
| 3   | 테스트          | `pnpm test`                                        | ✅ 44 files / 214 tests |
| 4   | 빌드            | `pnpm build`                                       | ✅ 29.1s                |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>`   | ✅ 전량 통과            |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 참조 0건             |

**루트 `pnpm check-types`는 실패하지만 이번 작업 범위 밖이다.** 워크스페이스에 커밋되지 않은
`apps/native/api/`(`auth.ts`·`index.ts`)가 암묵 `any`와 선언 전 참조로 `TS7006`·`TS2552` 등 5건을
낸다. `@repo/web`만 검사하면 통과하며, 이 파일들은 PR #232의 변경 목록에 없다. 네이티브 쪽
진행 중 작업이므로 건드리지 않았다.

## 2. 요구사항 ↔ 구현 대조

> `구현 위치`에는 컴포넌트명 / 함수명 / 파일 경로처럼 **구현을 특정할 수 있는 정보**를 쓴다.
> "구현함" 같은 서술은 대조가 불가능하므로 쓰지 않는다.

| #    | 요구사항 (spec.md의 AC)                        | 구현 위치                                                                                                                        | 상태 |
| ---- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---- |
| AC-1 | 진행률 `-10`·`150`·`31.6` → `0`·`100`·`32`     | `entities/learning/model/chapter.ts` `toChapterList` · `chapter.test.ts`「범위 안으로 자른다」「소수점 진행률을 반올림한다」     | ✅   |
| AC-2 | 응답 `chapterId` 순서 보존 (K5)                | 동상 · `chapter.test.ts`「응답 순서를 그대로 유지한다」                                                                          | ✅   |
| AC-3 | 링크 2개 순서·`href`·접근 이름 (K1)            | `widgets/chapter-grid/ui/chapter-grid.tsx` · `chapter-grid.test.tsx`「응답 순서대로 카드를 그리고 각 카드가 그 챕터로 이동한다」 | ✅   |
| AC-4 | `aria-valuenow` = 표기 퍼센트 (K2)             | 동상 · `chapter-grid.test.tsx`「진행률을 게이지와 퍼센트 표기에 같은 값으로 반영한다」                                           | ✅   |
| AC-5 | ⓘ 접근 가능한 이름에 챕터 설명                 | `entities/learning/ui/chapter-card.tsx` · `chapter-grid.test.tsx`「챕터 설명을 ⓘ 의 접근 가능한 이름으로 노출한다」              | ✅   |
| AC-6 | 빈 배열 → `role="status"` 「챕터가 없습니다.」 | `chapter-grid.tsx` · `chapter-grid.test.tsx`「빈 배열이면 「챕터가 없습니다.」를 표시한다」                                      | ✅   |
| AC-7 | 500 → 「다시 시도」 재요청 2회 (K3)            | `chapter-grid.tsx` · `chapter-grid.test.tsx`「실패하면 「챕터 목록을 불러오지 못했어요.」 + 다시 시도로 재요청한다」             | ✅   |
| AC-8 | `fill` 기본 그라데이션 / `solid` 단색          | `shared/ui/progress-bar/progress-bar.tsx` · `progress-bar.test.tsx` 2건                                                          | ✅   |

## 3. 이전 검증 <!-- MIG- / REF- 전용 -->

| 항목                                                                 | 결과 |
| -------------------------------------------------------------------- | ---- |
| `plan.md` 2-1 이전 매핑이 **전량** 반영되었나                        | ✅   |
| 동작 동일성 — `spec.md`의 현행 동작 기준선이 그대로 유지되나         | ✅   |
| (의도적으로 바꾼 동작) 시안 대조에서 "고침"으로 판정된 것만 바뀌었나 | ✅   |
| 이전 후 남은 legacy 참조가 없나                                      | ✅   |

## 4. 시안 대조 재확인 <!-- FIX- / MIG- 전용 -->

| #   | spec.md에서 "고침"으로 판정한 항목      | 반영됨                                                                  |
| --- | --------------------------------------- | ----------------------------------------------------------------------- |
| T6  | 카드 제목 색 → 양쪽 `text-1-w`          | ✅ `chapter-card.tsx` `text-text-1-w`                                   |
| T8  | 진행바 채움 → WEB 단색 · MOB 그라데이션 | ✅ `chapter-card.tsx` `fill={cardSize === 'lg' ? 'solid' : 'gradient'}` |
| T9  | 퍼센트 글자 색 → 양쪽 `text-1-w`        | ✅ `chapter-card.tsx`                                                   |
| T10 | 카드 딤 상시 (hover 해제 없앰)          | ✅ `chapter-card.tsx` `bg-black/20` 상시                                |
| T11 | 카드 그림자 시안 값                     | ✅ `chapter-card.tsx` `shadow-[-4px_4px_4px_0_rgba(0,0,0,0.1)]`         |
| P1  | 라우트를 `overlay`로                    | ✅ `learning.index.tsx` `headerVariant: 'overlay'`                      |
| P3  | `ProgressBar` 채움 variant 추가         | ✅ `progress-bar.tsx` `fill`                                            |
| P7  | MOB 상단 타이틀바 공용 위젯 신설        | ✅ `widgets/page-title-bar` · `learning-page-narrow.tsx`에서 사용       |
| S1  | 「면접대비」 탭 제거                    | ✅ 탭 없음                                                              |
| S2  | 탭 행 제거 (WEB만 68px 여백)            | ✅ `learning-page-wide.tsx` 여백 + 사유 주석                            |
| S5  | 그리드 좁은 2열 · 넓은 4열              | ✅ `chapter-grid.tsx` 2 → 3(600px) → 4(1200px)                          |
| S8  | 카드 잠금·완료 상태 제거                | ✅ `chapter-card.tsx`에 `status` 없음                                   |

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                                | 상태 |
| ------------------------------- | ------------------------------------------------------------------------ | ---- |
| `docs/implementation-status.md` | `L.1` 학습 홈 — Web 구현·시안 대조·기능 검증                             | ✅   |
| `docs/migration-status.md`      | `/learning` 대체 완료 · 학습 하위 URL 평탄화 표기                        | ✅   |
| 그 외 `docs/`                   | `routes.md` 학습 URL 확정. **화면 명세 `fe-implement-spec/l-1/`은 분리** | ✅   |

> 화면 명세 승격은 `MIG-029`·`MIG-030`이 끝난 뒤 학습 영역을 함께 쓰기로 하고 별도 항목으로
> 분리했다 (2026-09-16 사용자 판정). `work/to-do/INFRA-031-학습-화면-명세-승격/` 참고.
