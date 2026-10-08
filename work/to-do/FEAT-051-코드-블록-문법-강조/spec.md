---
id: 'FEAT-051'
title: '코드 블록 문법 강조'
type: 'feature'
screen: '-'
priority: 'medium'
created: '2026-09-26'
revised: '2026-10-08'
---

# FEAT-051 — 코드 블록 문법 강조

GitHub Issue: 미등록

> **상태 메모** — 구현과 자동 검증은 MIG-046 과 같은 브랜치(`feat/#261/concept-note`)에서 진행했다.
> `in-progress/` 에 MIG-046 이 수동 확인 대기로 남아 있어 이 폴더는 `to-do/` 에 둔다
> (`work-management.md` §3). MIG-046 이 `done/` 으로 가면 이 폴더를 옮긴다.

## 배경 · 목표

`shared/ui/markdown` 의 코드 블록이 밋밋하고, 모바일 개념노트 시트에서는 본문 상자(`bg-2`)와 같은 색이라
경계가 보이지 않는다. legacy 에는 없던 동작이라 MIG-046 에서 떼어 신규 작업으로 다룬다.
학습 문제 본문도 같은 렌더러를 쓸 예정이라 공용 모듈에서 해결한다.

## 범위

- 코드 블록 머리 — 언어명 · 복사 버튼 (Codex 구현, 이 작업으로 이관)
- Prism(refractor) 문법 강조 — 노트 원본이 쓰는 언어
- GitHub Light 색 · 배경 · 테두리 (코드 전용 잠정 토큰)
- 인라인 `code` 표면을 코드 블록과 같은 배경·테두리로
- Tailwind 기본 고정폭 글꼴

## Out of Scope

- 줄 번호 · 줄 강조
- 다크 테마

## 기술 결정 (ADR)

### 문법 강조 라이브러리

**Context** — react-markdown 파이프라인에 붙일 강조기가 필요하다. 노트가 쓰는 언어는 21종
(python · swift · java · kotlin · sql · tsx · typescript · javascript · vue · http · html · bash · json ·
yaml · xml · css · properties · nginx · graphql · dockerfile).

**Decision** — Prism(refractor/core) + 직접 만든 rehype 플러그인. 필요한 언어만 등록한다.

**Alternatives** — 2026-09-26 esbuild 로 react 를 외부로 두고 측정 (min+gzip).

| 안                              | 크기                           | 거부 이유                                                       |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------- |
| Shiki (core + JS 엔진)          | 기본 53KB + 언어별, 21종 207KB | 비동기라 색이 늦게 들어온다. vue(57KB) · html(38KB) 문법이 크다 |
| highlight.js (rehype-highlight) | 55KB                           | Prism 대비 두 배 크고 tsx · vue 가 없다                         |
| **Prism (refractor)**           | **25KB** (20종)                | 채택                                                            |

**Consequences** — 정규식 기반이라 Shiki(TextMate)보다 복잡한 문법에서 정확도가 낮을 수 있다.
Vue 문법이 없어 SFC 를 마크업으로 강조한다 (노트 17블록). 색은 우리 CSS 가 입히므로 테마를 직접 관리한다.

### 색

**Decision** — GitHub Light 글자색 · 배경(`#F6F8FA`) · 테두리(`#D0D7DE`) 그대로 (사용자 결정).
비교안(보라 단색 × 흰 배경 / 연회색 / GitHub 배경)을 보고 골랐다.

**Consequences** — Figma 에 없는 색이라 `code-*` 잠정 토큰 11개를 추가했다 (`docs/design-system/README.md` §3-7).

### 코드 글꼴

**Context** — 노트에 한글 주석과 ASCII 도식이 있어 영문·한글의 글자폭이 다르면 열이 틀어진다.

**Decision** — 별도 웹폰트 없이 Tailwind 기본 `font-mono` 스택을 적용한다 (2026-10-08 사용자 결정).
`->` 등이 하나의 문자처럼 바뀌지 않게 리가처는 끈다.

**Alternatives**

| 안                                      | 거부 이유                                                     |
| --------------------------------------- | ------------------------------------------------------------- |
| D2Coding WOFF2 자체 호스팅 (Codex 초안) | 1.49MB 한 파일을 코드가 하나만 나와도 통째로 받는다           |
| 나눔고딕코딩 `@fontsource`              | 한글 정렬은 안정적이지만 글꼴 조각과 네트워크 요청이 추가된다 |

**Consequences** — 글꼴 다운로드가 없어지는 대신 한글 글리프는 운영체제별 대체 글꼴을 사용할 수 있다.

## 확정 명세 · 검증 기준

- [x] **AC-1** (범위: 단위)
      Given 언어가 지정된 긴 코드 블록
      When 마크다운을 렌더링하고 복사 버튼을 누른다
      Then 언어명이 보이고 원문이 클립보드에 복사되며 코드 블록 밖의 너비를 밀어내지 않는다
- [x] **AC-2** (범위: 단위)
      Given ` ```python ` 블록 `def push(x): return "a"  # 끝`
      When 렌더링한다
      Then `def` 는 `.token.keyword`, `"a"` 는 `.token.string`, `# 끝` 은 `.token.comment` 이고 원문 글자는 그대로다
- [x] **AC-3** (범위: 단위)
      Given ` ```vue ` 블록
      When 렌더링한다
      Then 마크업 태그가 `.token.tag` 로 나뉜다
- [x] **AC-4** (범위: 단위)
      Given 언어 없는 블록 · 등록되지 않은 언어 블록 · 인라인 `code`
      When 렌더링한다
      Then `.token` 이 하나도 없고 원문이 보인다
- [ ] **AC-5** (범위: 수동)
      Given 모바일 개념노트 시트 · 웹 개념노트 카드
      When 코드가 있는 노트를 연다
      Then 코드 블록 경계가 두 곳 모두에서 보이고 키워드 · 문자열 · 주석이 서로 다른 색이다
- [ ] **AC-6** (범위: 수동)
      Given 한글 주석과 ASCII 도식이 든 코드 블록
      When 넓은 화면과 좁은 화면에서 렌더링한다
      Then 운영체제 기본 고정폭 글꼴로 읽을 수 있고 `->` 문자가 합쳐지지 않는다

## Changelog

| 날짜       | 요약                                     | 사유                                                                | 연관 항목 |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------- | --------- |
| 2026-09-26 | 작업 생성 · Prism + GitHub Light 로 구현 | 코드 블록이 밋밋하고 모바일에서 경계가 안 보인다. MIG-046 에서 분리 | MIG-046   |
| 2026-09-26 | D2Coding 로 코드 글꼴 변경               | 한글 주석·ASCII 도식의 열을 유지한다                                | MIG-046   |
| 2026-09-26 | 코드 글꼴을 나눔고딕코딩으로 교체        | 사용자 요청. D2Coding 은 한 파일 1.49MB                             | —         |
| 2026-10-08 | 코드 글꼴을 Tailwind 기본값으로 변경     | 별도 웹폰트 대신 `font-mono`를 사용한다                             | —         |
