---
id: INFRA-010
title: 검증 묶음 명령과 커밋·PR 자동 검사 도입
type: infra
screen: '-'
priority: medium
created: 2026-09-01
revised: 2026-09-02
---

# INFRA-010 — 검증 묶음 명령과 커밋·PR 자동 검사 도입

## 배경 · 목표

현재 lint·타입 검사·테스트·빌드를 사람이 각각 실행하고 있으며, PR에서 이를 자동으로 검사하는
워크플로가 없다. 다른 프로젝트에서 가져온 Husky 파일도 의존성과 설치 설정이 없어 아직 작동하지
않는다. 로컬에서는 빠른 검사만 수행하고, 전체 검증은 명시적인 묶음 명령과 PR CI에서 동일하게
실행되도록 구성한다.

## 선행 조건

- `REF-003`을 완료해 `pnpm format:check`가 exit code 0으로 끝나야 한다

## 범위

- 루트 `package.json`에 전체 검증 묶음 스크립트 추가
- Husky·lint-staged·commitlint 의존성과 설치 설정 추가
- staged 파일을 대상으로 하는 pre-commit 포맷·린트 검사
- commit-msg의 Conventional Commits 검사
- PR에서 전체 검증을 실행하는 GitHub Actions 워크플로
- 관련 하네스·Git workflow 문서 갱신

## Out of Scope

- 자동 커밋·push·PR 생성
- pre-commit에서 전체 테스트나 전체 빌드 실행
- Storybook 배포 워크플로 변경
- `REF-003`의 기존 포맷 불일치 수정

## 용어 정의 (Ubiquitous Language)

| 용어      | 정의                                                               |
| --------- | ------------------------------------------------------------------ |
| `verify`  | format:check·lint·check-types·test·build를 모두 실행하는 묶음 명령 |
| 빠른 검사 | staged 파일만 대상으로 커밋 전에 실행하는 Prettier·ESLint 검사     |
| 전체 검증 | 저장소 전체를 대상으로 PR에서 실행하는 `verify`                    |

## 구현 방향

- 루트 `verify`는 `format:check → lint → check-types → test → build`를 순차 실행한다. 실패한
  단계에서 즉시 중단되어 원인이 분명하고, 로컬과 CI가 같은 진입점을 사용한다
- pre-commit은 staged 파일의 Prettier·ESLint만 실행해 커밋 지연을 제한한다
- commit-msg는 `commitlint.config.js`를 사용한다
- PR CI는 로컬과 같은 묶음 명령을 호출해 검사 목록이 갈라지지 않게 한다
- 가져온 `.husky/` 파일을 그대로 신뢰하지 않고 현재 Husky 버전의 설치 방식으로 다시 검증한다
- PR 워크플로는 `develop`과 `main` 대상 PR에서 실행한다
- lint-staged의 formatter 수정 결과는 같은 staged 파일에 다시 반영한다. 범위 밖 파일은 stage하지 않는다

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given 저장소의 모든 검사가 통과하는 상태
      When 루트 검증 묶음 명령을 실행하면
      Then format:check·lint·check-types·test·build가 모두 실행되고 exit code 0이다
- [ ] **AC-2** (범위: 통합)
      Given staged 파일에 포맷 또는 ESLint 오류가 있다
      When 커밋을 시도하면
      Then pre-commit 훅이 non-zero exit code로 커밋을 중단한다
- [ ] **AC-3** (범위: 통합)
      Given Conventional Commits 형식이 아닌 커밋 메시지가 있다
      When 커밋을 시도하면
      Then commit-msg 훅이 non-zero exit code로 커밋을 중단한다
- [ ] **AC-4** (범위: 통합)
      Given PR 브랜치에서 전체 검증 중 하나가 실패한다
      When PR 검증 워크플로가 실행되면
      Then 해당 check가 실패 상태로 표시된다

## 구현 전 확인

- GitHub branch protection에서 `verify` check를 필수로 지정할 권한과 적용 시점
- CI의 Node·pnpm 버전을 `package.json`의 `engines`·`packageManager`와 어떻게 동기화할지

## Changelog

| 날짜       | 요약                                | 사유                                    | 연관 항목 |
| ---------- | ----------------------------------- | --------------------------------------- | --------- |
| 2026-09-01 | 최초 작성                           | 검증 자동화 계획을 운영 가이드에서 분리 | -         |
| 2026-09-02 | 실행 순서·PR 대상·staging 정책 확정 | 로컬과 CI의 동작 차이를 제거            | #186      |
