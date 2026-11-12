---
id: 'INFRA-010'
validated: '2026-10-21'
mode: 'infra'
---

# INFRA-010 검증 결과

> `ai-validate` 산출물. **생략 금지.**
> 실패 시 수정 후 재검증 **최대 3회**. 초과하면 보고하고 중단한다.

## 1. 자동 검증

Windows 로컬, 브랜치 `chore/#316/verify` (#317 위). `pnpm verify` 한 번으로 실행, 572초.

| #   | 검사            | 명령                                               | 결과                            |
| --- | --------------- | -------------------------------------------------- | ------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅                              |
| 2   | 타입            | `pnpm check-types`                                 | ✅                              |
| 3   | 테스트          | `pnpm test`                                        | ✅ 563 테스트                   |
| 4   | 빌드            | `pnpm build`                                       | ✅                              |
| 5   | 포맷            | `pnpm format:check`                                | ✅ (문서 수정 후 재실행 통과)   |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | 해당 없음 — 제품 코드 변경 없음 |

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 (spec.md의 AC)                               | 구현 위치 · 확인 방법                                                                                                                                          | 상태 |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 1   | AC-1 `verify`가 5종을 실행하고 exit 0                 | 루트 `package.json` `verify` — `&&`로 이어 실패 단계에서 멈춤. 실행 결과 exit 0                                                                                | ✅   |
| 2   | AC-2 staged 파일의 포맷 · ESLint 오류가 커밋을 막는다 | `.husky/pre-commit` → `lint-staged.config.mjs`. 미사용 변수 파일 stage → exit 1. 포맷이 어긋난 파일 stage → exit 1                                             | ✅   |
| 3   | AC-3 Conventional Commits가 아니면 커밋을 막는다      | `.husky/commit-msg` → `commitlint.config.mjs`. `feat(web) : 문구` · `수정` → exit 1, `feat(web): 문구` · `fix(web,native): …` → exit 0                         | ✅   |
| 4   | AC-4 PR에서 검사가 실패하면 check가 실패로 표시된다   | PR #318: 정상 실행 `39562539424` 통과. 임시 타입 오류 커밋 실행 `39563584921`은 `check-types` exit 2로 `verify` check 실패. 임시 커밋 제거 후 정상 상태로 복구 | ✅   |

훅 확인은 커밋을 만들지 않고 `.husky/_/` 실행기를 직접 호출해 했다. lint-staged가 백업용으로 만든 stash는
실행 후 남지 않았다.

추가 확인:

- develop의 최근 커밋 60개 중 commitlint에 걸리는 것은 `feat(web) : Notification Fallback UI 추가` 1개다
- `work/done/` · `routeTree.gen.ts`처럼 무시 대상인 파일은 staged돼도 prettier가 건너뛴다

## 3. 이전 검증

해당 없음 — 구조 변경이 아니다.

## 4. 시안 대조 재확인

해당 없음.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                                                                | 상태 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ---- |
| `docs/implementation-status.md` | 해당 없음                                                                                                | ✅   |
| `docs/migration-status.md`      | 해당 없음                                                                                                | ✅   |
| 그 외 `docs/`                   | `docs/harness-guide.md` §7 · `CLAUDE.md`(Commands · 검사 층) · `.claude/rules/git-workflow.md` §3 · §5-4 | ✅   |

## 6. 남은 일

- [x] PR에서 워크플로 정상·실패 상태 확인 (AC-4)
- [ ] 사용자가 branch protection에서 `verify` check를 필수로 지정
