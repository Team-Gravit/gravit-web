---
id: 'MIG-046'
validated: '2026-09-29'
mode: 'migrate'
---

# MIG-046 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                             | 결과 |
| --- | --------------- | ------------------------------------------------ | ---- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`                   | ✅   |
| 2   | 타입            | `pnpm --filter @repo/web check-types`            | ✅   |
| 3   | 테스트          | settings-page.test.tsx (5 passed)                | ✅   |
| 4   | 빌드            | `pnpm --filter @repo/web build`                  | ✅   |
| 5   | 포맷            | prettier --check (이번 변경 4파일)               | ✅   |
| 6   | generated 경계  | 생성 API 직접 참조 없음(이번 범위는 UI만)        | ✅   |

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 (spec.md AC)                          | 구현 위치                                                        | 상태 |
| --- | ---------------------------------------------- | --------------------------------------------------------------- | ---- |
| 1   | 탈퇴하기 클릭 → dialog 오픈, /settings 유지    | `settings-page.tsx` `setIsWithdrawOpen(true)` + `WithdrawConfirmModal` | ✅   |
| 2   | 그만두기 클릭 → dialog 닫힘                     | `withdraw-confirm-modal.tsx` `onOpenChange(false)`              | ✅   |
| 3   | onConfirm 미전달 시 계속하기 무동작            | `withdraw-confirm-modal.tsx` `onClick={onConfirm}` (optional)   | ✅   |

## 3. 이전 검증

| 항목                                                          | 결과 |
| ------------------------------------------------------------- | ---- |
| 동작 동일성 — legacy의 "설정→탈퇴하기→확인 모달" 진입 보존    | ✅ (확인 모달 오픈까지. 확정 플로우는 Out of Scope)             |
| 시안 대조 "고침" 항목만 변경                                  | ✅   |
| 남은 legacy 참조 없음                                         | ✅ (신규 슬라이스, legacy 미참조)                              |

## 4. 시안 대조 재확인

| #   | spec.md "고침" 항목                       | 반영 |
| --- | ----------------------------------------- | ---- |
| 1   | 패딩/배경/radius/그림자 반응형            | ✅   |
| 2   | 타이포(제목·설명)·색상 토큰 1:1           | ✅ (main #BA00FF·cta #9B00CF·text-1/2/4·divider-1 값 확인) |
| 3   | 버튼(size cta·default·stroke-secondary)   | ✅   |
| 4   | 마스코트 PNG @3x                          | ✅   |

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                          | 상태 |
| ------------------------------- | ------------------------------------------------- | ---- |
| `docs/implementation-status.md` | 후속(탈퇴 플로우 완결 시 일괄 반영 예정)          | 보류 |
| `docs/migration-status.md`      | 후속(legacy 탈퇴 전체 대체 완료 시 반영)          | 보류 |
| 그 외 `docs/`                   | 해당 없음                                          | —    |

> 이번은 탈퇴 이전의 1단계(확인 모달)라 legacy 대체가 완결되지 않았다. `docs/` 대장 승격은
> 후속 이슈(계속하기 API·확정 페이지 이전)까지 끝난 뒤 일괄로 한다.
