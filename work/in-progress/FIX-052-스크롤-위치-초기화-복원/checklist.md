---
id: 'FIX-052'
validated: '2026-10-08'
mode: 'fix'
---

# FIX-052 검증 결과

## 1. 자동 검증

| 검사            | 명령                                         | 결과                    |
| --------------- | -------------------------------------------- | ----------------------- |
| 린트 + FSD 경계 | `pnpm lint`                                  | ✅                      |
| 타입            | `pnpm check-types`                           | ✅                      |
| 테스트          | `pnpm test`                                  | ✅ 93 files · 503 tests |
| 빌드            | `pnpm build`                                 | ✅                      |
| 포맷            | `pnpm exec prettier --check <변경 파일>`     | ✅                      |
| generated 경계  | `pages`·`widgets`의 generated 직접 참조 검색 | ✅ 없음                 |

첫 테스트·빌드는 다른 브랜치에서 제거된 나눔고딕코딩 패키지가 `node_modules`에 없는 환경 문제로
실패했다. `pnpm install --frozen-lockfile`로 현재 lockfile 상태를 복구한 뒤 재실행해 통과했다.

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항                     | 구현 위치                                           | 상태 |
| ---- | ---------------------------- | --------------------------------------------------- | ---- |
| AC-1 | 새 화면은 맨 위에서 시작     | `router.ts` `scrollToTopSelectors` · 수동 확인      | ⬜   |
| AC-2 | 뒤로가기로 이전 위치 복원    | `router.ts` `scrollRestoration` · 수동 확인         | ⬜   |
| AC-3 | 새로고침 후 기록 이동 복원   | TanStack Router sessionStorage · 수동 확인          | ⬜   |
| AC-4 | 친구 탭 전환 시 맨 위        | `friends-page.tsx` 임시 `scrollTo` 제거 · 수동 확인 | ⬜   |
| AC-5 | 설정 하위 화면 이동 시 맨 위 | `settings/route.tsx` 복원 ID · 수동 확인            | ⬜   |
| AC-6 | 넓은 화면에서도 동일         | 앱 셸 공통 스크롤 상자 · 수동 확인                  | ⬜   |
| AC-7 | 자동 검사 통과               | 위 자동 검증 표                                     | ✅   |

## 3. 시안 대조 재확인

해당 없음. 화면 시각 요소가 아닌 탐색 시 스크롤 동작 수정이다.

## 4. 기준 문서 갱신

| 대상                            | 결과                                           |
| ------------------------------- | ---------------------------------------------- |
| `docs/implementation-status.md` | 해당 없음 — 화면 구현 상태 변화 없음           |
| `docs/migration-status.md`      | 해당 없음 — legacy 이전 작업 아님              |
| 그 외 `docs/`                   | 해당 없음 — FIX-052 작업 문서에 동작 계약 기록 |

수동 AC-1~6이 남아 있어 작업 폴더는 `in-progress`에 유지한다.

## 중간에 막혔던 지점 — 스킬에 반영할 것

- 여러 워크트리가 루트 `node_modules`를 공유하는 환경에서는 다른 브랜치의 패키지 제거가 현재 브랜치 검증에 영향을 줄 수 있다. 검증 전 현재 lockfile 기준 설치 상태를 확인한다.
