---
id: REF-003
title: 커밋된 코드가 prettier 설정과 어긋나 pnpm format:check 가 실패한다
type: refactor
screen: '-'
priority: medium
created: 2026-08-30
revised: 2026-09-02
---

# REF-003 — 커밋된 코드가 prettier 설정과 어긋나 pnpm format:check 가 실패한다

## 배경 · 목표

`pnpm format:check` 가 커밋된 코드 6개 파일에서 실패한다. **내 변경과 무관한 기존 상태다.**
(REF-002 처리 과정에서 `docs/_reference` 와 내가 편집한 파일을 정리해 38개 → 6개로 줄인 뒤 남은 것)

```
[warn] .github/workflows/storybook.yml
[warn] apps/web/src/shared/ui/button/button.stories.tsx
[warn] apps/web/src/shared/ui/button/button.tsx
[warn] apps/web/src/shared/ui/icon-button/icon-button.tsx
[warn] apps/web/src/shared/ui/spinner/spinner.stories.tsx
[warn] apps/web/src/shared/ui/spinner/spinner.tsx
```

**왜 중요한가** — REF-002와 같은 이유다. 하네스의 `ai-validate` 가 `pnpm format:check` 를 검증 단계로 쓴다.
빨간 채로 두면 모든 작업이 검증에서 실패한다.

## 원인

`packages/prettier-config/index.js` 는 `printWidth` / `singleQuote` / `endOfLine` 만 지정한다.
`trailingComma` 를 지정하지 않으므로 **prettier 3 기본값인 `"all"`** 이 적용되는데,
커밋된 코드에는 함수 인자 뒤 trailing comma 가 없다. 즉 커밋 시점의 포맷터 설정이 지금과 달랐다.

예 (`spinner.tsx`):

```diff
-          BORDER_CLASS[size]
+          BORDER_CLASS[size],
```

루트에 설치된 prettier 는 **3.5.3** (`^3.2.5` 로 해석됨). `apps/legacy-web` 은 `3.8.3` 을 따로 고정하고 있다.

## 범위

- 위 6개 파일
- (선택) `packages/prettier-config/index.js` 에 `trailingComma` 를 명시할지 결정
- (선택) 루트 prettier 버전 고정 (`^3.2.5` → 정확한 버전)

## Out of Scope

- 로직 변경 (포맷만)
- `apps/legacy-web` (`.prettierignore` 로 이미 제외됨)

## ⚠️ 처리 시점 주의

동일 범위는 `style/#187/prettier` 브랜치의 커밋 `ff898b4`에서 이미 처리됐다. 현재 `develop`에는
아직 포함되지 않았으므로 이 브랜치에서 같은 포맷 변경을 중복 구현하지 않는다. #187의 반영 여부를
확인한 뒤, 반영되면 검증하고 이 작업을 완료 상태로 옮긴다.

## 해결 방향

| #   | 방향                                                    | 비고                                          |
| --- | ------------------------------------------------------- | --------------------------------------------- |
| 1   | `pnpm format` 한 번 실행 + `style:` 단독 커밋           | 가장 단순. 시점만 조심                        |
| 2   | 1 + `prettier-config` 에 `trailingComma` 명시           | 앞으로 버전이 올라가도 결과가 흔들리지 않는다 |
| 3   | 1 + 루트 prettier 버전 고정 + pre-commit 훅에 포맷 검사 | 재발 방지까지                                 |

**권고: 2 또는 3.** 지금 포맷만 맞춰도 설정이 느슨하면 같은 문제가 다시 생긴다.

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 단위)
      Given 저장소 루트
      When `pnpm format:check` 를 실행하면
      Then exit code 0 이다
- [ ] **AC-2** (범위: 단위)
      Given `pnpm format` 을 두 번 연속 실행하면
      When 두 번째 실행 후
      Then 변경 파일이 0개다 (idempotent)

## Changelog

| 날짜       | 요약                     | 사유                                             | 연관 항목 |
| ---------- | ------------------------ | ------------------------------------------------ | --------- |
| 2026-08-30 | 최초 작성                | REF-002 처리 중 발견                             | -         |
| 2026-09-02 | 중복 작업 방지 메모 추가 | 원격 #187 구현 커밋이 있으나 develop 미반영 상태 | `ff898b4` |
