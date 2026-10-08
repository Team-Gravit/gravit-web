---
id: 'FIX-035'
validated: '2026-09-18'
mode: 'fix'
---

# FIX-035 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                     | 결과                    |
| --- | --------------- | ---------------------------------------- | ----------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                              | ✅ 2 tasks              |
| 2   | 웹 타입         | `pnpm --filter @repo/web check-types`    | ✅                      |
| 3   | 웹 테스트       | `pnpm --filter @repo/web test`           | ✅ 49 files / 232 tests |
| 4   | 웹 빌드         | `pnpm --filter @repo/web build`          | ✅                      |
| 5   | 포맷            | `pnpm exec prettier --check <변경 파일>` | ✅                      |
| 6   | generated 경계  | 생성 파일이나 참조 변경 없음             | ✅ 해당 없음            |

루트 `pnpm check-types`는 미추적 사용자 작업인 `apps/native/api/`의 기존 타입 오류 6건 때문에
실패했다. 웹 타입 검사는 통과했으며 FIX-035 변경과 관련 없는 native 파일은 수정하지 않았다.

빌드의 route test 파일 경고와 500kB 초과 chunk 경고는 기존 사항이다.

## 2. 요구사항 ↔ 구현 대조

| #   | 검증 기준                         | 구현·검증 위치                                                                       | 상태 |
| --- | --------------------------------- | ------------------------------------------------------------------------------------ | ---- |
| 1   | `ring-3`이 3px 두께를 생성한다    | 빌드 CSS의 `.focus-visible\:ring-3`이 `calc(3px + var(--tw-ring-offset-width))` 생성 | ✅   |
| 2   | `ring-purple-200` 색상을 유지한다 | 빌드 CSS가 `--tw-ring-color: var(--color-purple-200)` 생성                           | ✅   |
| 3   | 키보드 포커스 링이 표시된다       | focusable 요소의 `focus-visible:ring-3`·`ring-purple-200`과 위 두 빌드 규칙 대조     | ✅   |
| 4   | `--color-3` 선언·색상 사용이 없다 | `rg -n -- "--color-3" apps/web` 결과 없음                                            | ✅   |

로컬 브라우저 제공자가 없어 Tab 키 화면 캡처는 자동화하지 못했다. 대신 실제 프로덕션 빌드
CSS에서 focus-visible 선택자의 두께와 색상 선언을 직접 검증했다.

## 3. 시안 대조 재확인

해당 없음. 디자인 값을 바꾸지 않고 Tailwind 유틸리티 이름 충돌만 제거했다.

## 4. 기준 문서 갱신

| 대상                            | 갱신 내용                                  | 상태         |
| ------------------------------- | ------------------------------------------ | ------------ |
| `docs/implementation-status.md` | 화면 상태 변경 없음                        | ✅ 해당 없음 |
| `docs/migration-status.md`      | legacy 대체 상태 변경 없음                 | ✅ 해당 없음 |
| `docs/design-system/README.md`  | 정리 대상에서 `--color-3` 제거, 합계 51→50 | ✅           |

## 5. 중간에 막혔던 지점

Computer Use에 사용 가능한 브라우저 제공자가 없어 실제 화면에서 Tab 포커스를 캡처할 수 없었다.
빌드 CSS의 focus-visible 선택자와 포커스 가능한 사용처를 대조해 같은 계약을 검증했다.
