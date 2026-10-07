---
id: 'MIG-046'
validated: '2026-10-07'
mode: 'migrate'
---

# MIG-046 검증 결과

## 1. 자동 검증

| 검사            | 명령                                                                   | 결과                    |
| --------------- | ---------------------------------------------------------------------- | ----------------------- |
| 린트 + FSD 경계 | `pnpm lint`                                                            | ✅                      |
| 타입            | `pnpm check-types`                                                     | ✅                      |
| 테스트          | `pnpm test`                                                            | ✅ 93 files · 502 tests |
| 빌드            | `pnpm build`                                                           | ✅                      |
| 포맷            | `pnpm exec prettier --check <변경 파일>`                               | ✅                      |
| generated 경계  | `rg -n "shared/api/generated" apps/web/src/pages apps/web/src/widgets` | ✅ 직접 참조 없음       |

빌드의 라우트 테스트 파일 경고 3건과 번들 크기 경고는 기존 항목이다. 이번 라우트 테스트는 `-` 접두로 스캔에서 제외된다.

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항                               | 구현 위치 · 근거                                     | 상태 |
| --- | -------------------------------------- | ---------------------------------------------------- | ---- |
| 1   | AC-1 카드 → URL · 요청 1회             | `-concept-note-route.test.tsx` 좁은 화면 진입 테스트 | ✅   |
| 2   | AC-2 첫 제목 분리                      | `entities/concept-note/model/concept-note.test.ts`   | ✅   |
| 3   | AC-3 제목이 아니면 원문 유지           | `entities/concept-note/model/concept-note.test.ts`   | ✅   |
| 4   | AC-4 노트 문법 렌더링                  | `shared/ui/markdown/markdown.test.tsx`               | ✅   |
| 5   | AC-5 위험 HTML 정화                    | `shared/ui/markdown/markdown.test.tsx`               | ✅   |
| 6   | AC-6 넓은 화면 카드                    | `-concept-note-route.test.tsx` 넓은 화면 테스트      | ✅   |
| 7   | AC-7 모바일 전체 페이지 · 하단 탭 숨김 | `ConceptNotePage` · 라우트 `hideBottomTabBar`        | ✅   |
| 8   | AC-8 모바일 닫기 링크                  | `-concept-note-route.test.tsx` 닫기 링크 테스트      | ✅   |
| 9   | AC-9 두 화면 폭의 페이지 렌더링        | `-concept-note-route.test.tsx` 좁은·넓은 화면 테스트 | ✅   |
| 10  | AC-10 실패 · 재시도                    | `-concept-note-route.test.tsx` 재시도 테스트         | ✅   |
| 11  | AC-11 빈 노트                          | `-concept-note-route.test.tsx` 빈 상태 테스트        | ✅   |
| 12  | AC-12 실제 노트                        | dev API 수동 확인                                    | ⬜   |
| 13  | AC-13 Android WebView                  | 닫기 · 하드웨어 뒤로가기 · 하단 탭                   | ⬜   |
| 14  | AC-14 CJK 강조 문법                    | `shared/ui/markdown/markdown.test.tsx`               | ✅   |
| 15  | AC-15 모바일 줄바꿈 · 코드 가로 스크롤 | 실기기 수동 확인                                     | ⬜   |

## 3. 이전 검증

| 항목                | 결과                                                       |
| ------------------- | ---------------------------------------------------------- |
| 이전 매핑 전량 반영 | ✅ 바텀시트 계획은 최종 페이지 결정으로 대체               |
| 동작 계약 K1~K4     | ✅ AC-1 · AC-4 · AC-5 · AC-10으로 확인                     |
| 남은 legacy 참조    | ✅ `studynote` · `Banner2` · deprecated API 경로 참조 없음 |

### 의도적으로 바꾼 것

| 항목                                     | 이유                     |
| ---------------------------------------- | ------------------------ |
| 배너 → 우주 배경 + 유닛 상세 머리        | 시안 W1                  |
| 첫 제목을 부제로 분리하고 본문에서 제거  | 시안 W8                  |
| 모바일을 하단 탭 없는 전체 페이지로 표시 | 2026-10-07 사용자 결정   |
| 로딩·실패·빈 상태를 공용 상태 UI로 표시  | 확정 상태 명세           |
| `/cs-notes/units/{unitId}` 사용          | deprecated 경로 대체     |
| HTML을 `<br>`·`img` 허용 목록으로 제한   | 실제 노트 문법 전수 조사 |

## 4. 시안 대조 재확인

넓은 화면 W1~W8은 반영했다. 모바일 M1~M8의 바텀시트 표현은 2026-10-07 사용자 결정으로
전체 페이지로 대체했으며, 닫기 상단바와 하단 탭 숨김을 적용했다.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                | 상태 |
| ------------------------------- | ---------------------------------------- | ---- |
| `docs/implementation-status.md` | 개념노트 Web 구현 · 수동 검증 대기       | ✅   |
| `docs/migration-status.md`      | 기준선·대체 구현 완료, 동작 검증 진행 중 | ✅   |

`done/` 이동은 보류한다. AC-12 · AC-13 · AC-15 수동 검증이 남아 있다.

## 중간에 막혔던 지점 — 스킬에 반영할 것

- `react-markdown` 요소 컴포넌트의 `node` prop은 `_` 접두로 버려도 ESLint가 허용하지 않는다. 복사본에서 제거하는 헬퍼로 해결했다.
- Windows 샌드박스에서 pnpm이 Node 버전 확인 중 `EPERM`으로 막혀 검증 명령을 권한 승인 후 다시 실행했다.
- 초기 바텀시트 계획 뒤 모바일 표현이 전체 페이지로 바뀌었다. 최종 검증에서 `spec.md`·`plan.md`·`checklist.md`를 함께 대조해야 한다.
