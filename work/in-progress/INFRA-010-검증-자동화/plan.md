---
id: 'INFRA-010'
planned: '2026-10-21'
mode: 'infra'
---

# INFRA-010 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: infra` — 제품 코드는 바꾸지 않고 검증 진입점 · 커밋 훅 · PR CI만 추가한다.
선행 조건 `REF-003`(`format:check` exit 0)을 먼저 끝낸다.

### 기준선 (2026-10-21, develop `d1e49ac0`, Windows 로컬)

| 검사           | 결과 | 시간 | 비고                         |
| -------------- | ---- | ---: | ---------------------------- |
| `lint`         | 통과 | 189s | eslint 경고 0 · steiger 통과 |
| `check-types`  | 통과 |  42s |                              |
| `test`         | 통과 | 288s |                              |
| `build`        | 통과 | 107s |                              |
| `format:check` | 실패 |    — | 25개 → `REF-003`에서 해결    |

husky는 설치된 적이 없다. 메인 체크아웃의 `.husky/_/`는 다른 프로젝트에서 복사된 런타임 폴더로,
자체 `.gitignore`로 커밋되지 않고 `core.hooksPath`도 없어 실행되지 않는다.

## 1. 요구사항 분해

| #   | 요구사항 (spec 범위)                                                            | 위치                                          | AC   |
| --- | ------------------------------------------------------------------------------- | --------------------------------------------- | ---- |
| 1   | `verify`: format:check → lint → check-types → test → build 순차, 실패 즉시 중단 | 루트 `package.json`                           | AC-1 |
| 2   | husky 설치 (`prepare` 스크립트)                                                 | 루트 `package.json` · `.husky/`               | —    |
| 3   | pre-commit: staged 파일만 prettier + eslint                                     | `.husky/pre-commit` · lint-staged 설정        | AC-2 |
| 4   | commit-msg: Conventional Commits 검사                                           | `.husky/commit-msg` · `commitlint.config.mjs` | AC-3 |
| 5   | PR 워크플로: `develop` · `main` 대상 PR에서 `pnpm verify`                       | `.github/workflows/verify.yml`                | AC-4 |
| 6   | 하네스 · git 문서 갱신                                                          | 아래 §2                                       | —    |

### 설계 판단

- **lint-staged는 루트 함수형 설정 하나로 둔다** (계획 당시엔 앱별 설정이었으나 구현 중 변경). 루트에 eslint
  설정이 없고 앱마다 `eslint.config.mjs`가 있다. 앱별 설정 파일은 cwd가 앱 폴더라 prettier가 루트
  `.prettierignore`를 못 읽는다. 그래서 prettier는 루트에서 전체 staged 파일에, eslint는 파일을 앱별로 나눠
  `pnpm --filter <앱> exec eslint`로 돌린다.
- **pre-commit에 steiger · 타입 검사 · 테스트를 넣지 않는다.** steiger와 tsc는 파일 단위로 못 돌고,
  전체 실행은 커밋마다 수 분이 걸린다. 전체 검증은 `verify`와 PR CI의 몫이다 (spec Out of Scope).
- **eslint는 `--max-warnings=0`.** 현재 경고가 0개라 바로 적용할 수 있다.
- **CI Node 버전은 Storybook 워크플로와 같은 24**, pnpm은 `packageManager`를 따른다.
- **`verify`는 turbo 한 번(`turbo run lint check-types test build`)이 아니라 순차 실행**으로 한다.
  spec이 정한 대로 실패 단계가 분명해야 한다. turbo 캐시는 단계별로 그대로 쓴다.

## 2. 영향 분석

| 구분 | 파일                                                                                                  |
| ---- | ----------------------------------------------------------------------------------------------------- |
| 신규 | `.husky/pre-commit` · `.husky/commit-msg` · `commitlint.config.mjs` · `lint-staged.config.mjs`(루트)  |
| 신규 | `.github/workflows/verify.yml`                                                                        |
| 수정 | 루트 `package.json` · `pnpm-lock.yaml`                                                                |
| 수정 | `CLAUDE.md`(Commands · 검사 층) · `.claude/rules/git-workflow.md` §3 · §5-4 · `docs/harness-guide.md` |

`ai-validate`와 `ai-quick`의 검증 안내는 `REF-003`에서 이미 갱신되어 이번 작업에서 수정하지 않는다.

npm 의존성 추가 (루트 devDependencies, 정확한 버전 고정): `husky` · `lint-staged` ·
`@commitlint/cli` · `@commitlint/config-conventional`

## 3. 의존 관계 검증

없음 — FSD 경계와 무관하다.

## 4. 구현 계획 체크리스트

- [x] `REF-003` 완료 확인 (`format:check` exit 0)
- [x] 루트 `verify` 스크립트 → 실행해 exit 0 (AC-1)
- [x] 의존성 4개 설치 · `prepare: husky`
- [x] lint-staged 설정 + `.husky/pre-commit` — 앱별 파일 3개 대신 루트 함수형 설정 1개로 바꿨다. 앱별 설정은 cwd가 앱 폴더라 루트 `.prettierignore`를 못 읽는다
- [x] `commitlint.config.mjs` + `.husky/commit-msg` — 루트 package.json에 `"type": "module"`이 없어 `.mjs`
- [x] 로컬 검증 — 커밋을 만들지 않고 `.husky/_/` 실행기를 직접 호출
  - 포맷이 깨진 파일 · eslint 오류 파일을 stage → 커밋 중단 (AC-2)
  - `feat(web) : 문구` · `수정` 메시지 → 커밋 중단, `feat(web): 문구` → 통과 (AC-3)
  - 포맷 오류가 있는 staged 파일에서 pre-commit이 커밋을 중단하는지
- [x] `.github/workflows/verify.yml` — PR(develop · main) 트리거, `pnpm install --frozen-lockfile` → `pnpm verify`
- [x] 문서 갱신 (§2 수정 목록)
- [x] PR #318에서 워크플로 정상 실행 통과, 임시 타입 오류 커밋의 `verify` check 실패 확인 후 해당 커밋 제거 (AC-4)

## 5. 리스크

| 리스크                                                               | 영향                                           | 대응                                                   |
| -------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| **팀원 커밋 형식** — 최근 300개 중 3개가 `feat(web) :`(콜론 앞 공백) | 팀원 커밋이 commit-msg에서 막힌다              | 확인 필요 1. PR 본문과 팀 공지로 형식 안내             |
| 팀원 로컬에 husky가 `pnpm install` 때 자동 설치됨                    | 다음 install부터 훅이 켜진다                   | `--no-verify` 우회는 막지 않는다. 공지에 포함          |
| PR CI 시간 (로컬 기준 약 10분)                                       | PR마다 대기                                    | pnpm · turbo 캐시. 길면 job 분리는 후속 작업           |
| Windows에서 husky 훅 실행 (Git Bash)                                 | 줄끝 CRLF면 훅이 안 돈다                       | `.husky/*`를 LF로 저장, `.gitattributes` 확인          |
| 진행 중 브랜치의 기존 포맷 문제                                      | 그 브랜치에서 커밋할 때 staged 파일이 고쳐진다 | 의도된 동작. 변경 파일만 대상이라 범위가 커지지 않는다 |

## 6. 완료 후 액션

- [ ] 작업 폴더를 `work/in-progress/` → `work/done/`으로 이동
- [x] `git-workflow.md`의 "PR 자동 검사 없음" · "husky 없음" 경고를 현행으로 교체
- [ ] 포트폴리오 하네스 문구 갱신 (p-6e 커밋 · PR 행, `local-docs/portfolio-figures/harness-v2.md`)

## 확인 필요 (승인 전에 답이 필요)

1. ~~팀원 합의~~ → **확정(2026-10-21): 공백 없는 `feat(web):`만 허용한다.** 팀원 안내는 #316 본문 · PR에 적는다.
2. **branch protection** → 워크플로가 PR에서 한 번 돈 뒤 사용자가 설정한다 (절차는 PR 때 안내).
3. ~~이슈 번호~~ → #315 (REF-003) · #316 (INFRA-010)
4. ~~PR 단위~~ → 2개. #315가 먼저 머지된다.
