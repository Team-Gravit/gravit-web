---
id: REF-002
title: shared/assets 세그먼트가 steiger 규칙에 걸려 pnpm lint 가 상시 실패한다
type: refactor
screen: '-'
priority: high
created: 2026-08-30
revised: 2026-09-02
---

# REF-002 — shared/assets 세그먼트가 steiger 규칙에 걸려 pnpm lint 가 상시 실패한다

> **완료:** GitHub Issue #184, 커밋 `c978594`에서 아이콘 에셋을
> `shared/ui/icon/assets/`로 옮기고 생성 스크립트와 문서를 함께 갱신했다.

## 배경 · 목표

작업 발견 당시 `pnpm lint`가 아래 Steiger 오류로 실패했다.

```
┌ src\shared\assets
✘ This segment's name should describe the purpose of its contents, not what the contents are.
└ fsd/segments-by-purpose
```

ESLint 단독(`lint:eslint`)은 통과하고 **steiger 만 실패**한다.
`pnpm lint` = `eslint . && steiger ./src` 이므로 결과적으로 lint 태스크 전체가 실패한다.

하네스의 `ai-validate`가 `pnpm lint`를 검증 단계로 사용하므로 파이프라인을 막는 선행 문제로
처리했다.

## 현황

| 경로                                                     | 내용               | 파일 수      |
| -------------------------------------------------------- | ------------------ | ------------ |
| `apps/web/src/shared/assets/icons/`                      | 원본 SVG           | 작업 전 위치 |
| `apps/web/src/shared/assets/fonts/`                      | 폰트               | 작업 전 위치 |
| `apps/web/src/app/styles/fonts/PretendardVariable.woff2` | 실제 사용하는 폰트 | 1            |

참조 지점: `apps/web/src/shared/ui/icon/icons.generated.ts` 가 `@/shared/assets/icons/*.svg?react` 를 import.
→ **자동 생성 파일이다** (`pnpm generate:icons`, `scripts/generate-icons.mjs`). 경로를 바꾸면 생성 스크립트도 같이 고쳐야 한다.

## 범위

- `apps/web/src/shared/assets/` 재배치
- `scripts/generate-icons.mjs` 의 입력·출력 경로
- `apps/web/src/shared/ui/icon/icons.generated.ts` 재생성
- (선택) `steiger.config.js`

## Out of Scope

- 아이콘 자체의 추가·삭제·리네이밍
- `Icon` 컴포넌트 API 변경
- 폰트 교체

## 검토한 해결 방향

| #   | 방향                                                       | 장점                                       | 단점                                                                                                                                                            |
| --- | ---------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `shared/assets/icons/` → `shared/ui/icon/assets/` 로 이동  | 아이콘 컴포넌트와 원본을 같은 slice에 둔다 | 생성 스크립트 수정 필요                                                                                                                                         |
| 2   | `steiger.config.js` 에서 `fsd/segments-by-purpose` 를 끈다 | 즉시 해결                                  | **규칙을 끄면 앞으로 legacy 이전 때도 같은 위반을 못 잡는다.** 이미 `public-api`·`insignificant-slice` 두 개를 꺼둔 상태라 더 끄면 steiger 가 사실상 무력화된다 |
| 3   | 폰트는 `app/styles/fonts/` 로 통합 (중복 해소)             | 폰트가 두 곳에 있는 문제도 같이 정리       | 어느 쪽이 실사용인지 먼저 확인 필요                                                                                                                             |

**결정: 1.** 규칙을 끄지 않고 아이콘의 소유권을 `shared/ui/icon` slice로 모았다. 폰트는 이번
오류 해결에 필요하지 않아 범위에서 제외했다.

## 결정 기록

- 원본 SVG는 `shared/ui/icon/assets/`, 생성 레지스트리는 `shared/ui/icon/icons.generated.ts`에 둔다.
- 생성물은 직접 수정하지 않고 `pnpm generate:icons`로 갱신한다.
- 폰트 경로 정리는 이 작업에 섞지 않는다.

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 단위)
      Given 저장소 루트
      When `pnpm lint` 를 실행하면
      Then exit code 0 이고 steiger 에러가 0건이다
- [ ] **AC-2** (범위: 단위)
      Given 아이콘 경로 변경 후
      When `pnpm generate:icons` 를 실행하면
      Then `icons.generated.ts` 가 새 경로로 재생성되고 `pnpm build` 가 성공한다
- [ ] **AC-3** (범위: 통합)
      Given `<Icon name="bell" />`
      When 렌더하면
      Then 이전과 동일한 SVG 가 렌더된다 (동작 동일성)

## Changelog

| 날짜       | 요약                            | 사유                                          | 연관 커밋 |
| ---------- | ------------------------------- | --------------------------------------------- | --------- |
| 2026-08-30 | 최초 작성                       | Phase 0 스모크에서 `pnpm lint` 상시 실패 발견 | -         |
| 2026-09-02 | 완료 상태와 실제 목표 경로 반영 | #184 구현 결과와 백로그 상태를 일치시킴       | `c978594` |
