---
id: 'REF-003'
planned: '2026-10-21'
mode: 'refactor'
---

# REF-003 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: refactor` — 포맷만 바꾸고 동작은 바꾸지 않는다. `INFRA-010`(커밋 시 포맷 검사)의 선행 조건이다.

### 현재 상태 (2026-10-21, develop `d1e49ac0`)

- spec의 원래 6개 파일은 PR #192(`style/#187/prettier`, `2663fc95`)로 이미 develop에 반영됐다.
- 그 뒤 **25개 파일이 새로 어긋났다.** 커밋 시 자동 검사가 없어 다시 쌓인 것이다.

| 묶음                | 개수 | 내용                                                                    |
| ------------------- | ---: | ----------------------------------------------------------------------- |
| `apps/web` 코드     |    2 | `infinite-selector.ts` 시그니처 · `entities/inquiry/index.ts` 긴 export |
| `CLAUDE.md`         |    1 | 인용문 줄바꿈 (아래 주의)                                               |
| `.claude/rules/`    |    1 | `fsd-pages.md` 표 칸 정렬                                               |
| `work/done/`        |   18 | 마크다운 표 칸 정렬                                                     |
| `work/in-progress/` |    3 | `MIG-043` 문서 3개 — 표 칸 정렬                                         |
| `work/to-do/`       |    1 | `FIX-036/spec.md`                                                       |

같은 시점의 lint · check-types · test · build는 모두 통과한다 (기준선).

> 계획 작성 시 실패 목록을 끝부분만 읽어 `work/done/` 20개 · 코드 1개로 적었다가, 구현 중 전체 목록을
> 확인해 위처럼 바로잡았다. 총 25개는 같다.
>
> **`CLAUDE.md` 주의** — `**…`apps/web/src/**`…**`처럼 굵은 글씨 안에 `**`가 든 코드가 있으면
prettier가 인용문 다음 줄의 `>`를 지운다. 굵은 범위를 `**레이어·컨벤션 규칙 11종\*\*`으로 줄여 해결했다.

### 0-1. 착수 전 필수 게이트

| #   | 질문                                | 답  | 근거                                                                                                  |
| --- | ----------------------------------- | --- | ----------------------------------------------------------------------------------------------------- |
| 1   | 목표와 비목표가 명확한가            | 예  | `pnpm format:check` exit 0. 로직·문서 내용은 바꾸지 않는다                                            |
| 2   | 반복 비용이나 확장 차단이 있는가    | 예  | `INFRA-010`의 pre-commit 포맷 검사를 켜면 기존 실패가 커밋을 막는다. 7주 만에 6개 → 25개로 재발       |
| 3   | 보존할 동작의 기준선이 있는가       | 예  | 바뀌는 코드는 공백뿐이다. 기존 테스트 전체 + 타입 검사가 기준선                                       |
| 4   | 자동 또는 수동 검증 방법이 있는가   | 예  | `format:check`, `format` 2회 idempotent, lint · check-types · test · build                            |
| 5   | 범위를 독립적으로 완료할 수 있는가  | 예  | 포맷 단독 커밋 하나. 다른 작업과 섞지 않는다                                                          |
| 6   | 위험과 실패 시 복구 방법을 정했는가 | 예  | 포맷 커밋 하나만 되돌리면 된다. 진행 중인 다른 브랜치와의 충돌은 공백 충돌이라 `pnpm format`으로 해소 |

### 0-2. 자동 보류 신호

- [x] 해당 없음 — 동작 변경 없음, 생성물 수정 없음, 기존 실패 원인 설명 가능(설정 기본값 + 검사 부재)

## 1. 요구사항 분해

| #   | 요구사항                                                                       | 위치                                       |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| 1   | 완료된 작업 기록은 포맷 검사에서 제외 (사용자 결정 A, `work-management.md` §5) | `.prettierignore`                          |
| 2   | `trailingComma: 'all'`을 명시해 prettier 버전이 바뀌어도 결과가 흔들리지 않게  | `packages/prettier-config`                 |
| 3   | 루트 prettier 버전을 현재 해석값 `3.5.3`으로 고정                              | 루트 `package.json` · lockfile             |
| 4   | 나머지 7개 파일 포맷 적용                                                      | 코드 2 · CLAUDE.md · rules 1 · work 문서 4 |

## 2. 영향 분석

| 구분 | 파일                                                                                                                                                                                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 수정 | `.prettierignore` · `packages/prettier-config/index.js` · `package.json` · `pnpm-lock.yaml`                                                                                                                 |
| 수정 | `apps/web/src/shared/lib/infinite-selector.ts` · `apps/web/src/entities/inquiry/index.ts` · `.claude/rules/fsd-pages.md` · `CLAUDE.md` · `work/in-progress/MIG-043-*/` 3개 · `work/to-do/FIX-036-*/spec.md` |
| 수정 | "format:check가 실패 중" 안내 갱신: `CLAUDE.md` · `git-workflow.md` · `ai-quick` · `ai-validate` · `docs/harness-guide.md` · `work/TEMPLATE/checklist.md`                                                   |

npm 의존성 추가: 없음 (prettier 버전 범위만 고정)

## 3. 의존 관계 검증

없음 — FSD 경계와 무관하다.

## 4. 구현 계획 체크리스트

- [x] `.prettierignore`에 `work/done` 추가
- [x] `prettier-config`에 `trailingComma: 'all'` 명시 → `format:check` 결과가 그대로인지 확인 (기본값과 같아야 한다)
- [x] 루트 `prettier`를 `3.5.3`으로 고정 → `pnpm install`로 lockfile 갱신
- [x] `pnpm format` → 변경 파일이 위 7개뿐인지 확인
- [x] `spec.md` Changelog에 재개 사유 기록, "현재 실패" 안내 문구 갱신 (§2 목록)
- [ ] 검증: `format:check` exit 0 · `format` 2회째 변경 0개 · lint · check-types · test · build

## 5. 리스크

| 리스크                                             | 영향                | 대응                                                        |
| -------------------------------------------------- | ------------------- | ----------------------------------------------------------- |
| 진행 중인 다른 브랜치(MIG-043 등)와 같은 문서 충돌 | rebase 때 공백 충돌 | 포맷만 바뀌므로 충돌 시 `pnpm format`으로 재생성. PR에 명시 |
| `work/done` 제외로 완료 문서 포맷이 계속 어긋남    | 읽기에는 영향 없음  | 의도된 결정(A). done은 동결 문서다                          |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [ ] `INFRA-010` 착수
