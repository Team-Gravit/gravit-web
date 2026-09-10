---
id: 'INFRA-014'
title: '생성 API를 우회한 직접 HTTP 호출을 훅에서 차단'
type: 'infra'
screen: '-'
priority: 'medium'
created: '2026-09-09'
revised: '2026-09-09'
---

# INFRA-014 — 생성 API를 우회한 직접 HTTP 호출을 훅에서 차단

## 배경 · 목표

`api-convention.md` §2는 요청 함수를 손으로 쓰지 못하게 하고 응답 타입 재선언도 금지한다.
그러나 이 규칙은 **소프트 층에만 있어 어떤 도구도 잡지 않는다.** 훅은 생성 파일을 *수정*하는
것만 막고, steiger는 orval을 모른다.

`MIG-005` Issue 2에서 실제로 발생했다. orval이 `authtoken-api.ts`에 `reissueToken`을 이미
생성해 뒀는데도 `AXIOS_INSTANCE.post('/api/v1/auth/reissue', ...)`를 손으로 쓰고
`ReissueResponse`를 재선언했다. **lint·check-types·test·build 4종이 전부 통과했고**, 사용자가
코드를 읽다가 발견했다. 명세가 바뀌면 조용히 어긋나는 코드였다.

편집 직전에 차단해 같은 실수가 반복되지 않게 한다.

## 범위

- `.claude/hooks/fsd-layer-check.mjs` — 기존 훅에 검사 항목 추가 (또는 같은 진입점에서 호출하는
  별도 검사 모듈로 분리)
- 차단 사유 문구 — 생성 함수를 어떻게 찾는지 안내를 포함한다
- `CLAUDE.md`의 「훅이 차단하는 것」 목록과 `api-convention.md`에 이 검사 명시

## Out of Scope

- 기존 코드 전수 검사 — 훅은 새로 쓰는 내용만 본다. 사후 검사는 별도로 판단한다
- `orval.config.ts` · `openapi/normalize-openapi.mjs` 등 생성 설정 변경
- 생성물이 없는 외부 서비스 호출 차단 (Figma·분석 도구 등)
- URL 이외의 우회 형태(생성 타입 재선언 등) 검출 — 이번에는 URL만 본다
- `.codex/hooks.json` 별도 수정 — 같은 훅 파일을 가리키므로 자동 적용된다

## 용어 정의 (Ubiquitous Language)

| 용어              | 정의                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| 생성 API          | `src/shared/api/generated/` 아래 orval 산출물의 요청 함수·훅·타입        |
| 직접 HTTP 호출    | 생성 API를 거치지 않고 axios 등으로 엔드포인트 경로를 직접 지정하는 호출 |
| 엔드포인트 리터럴 | 소스에 문자열로 박힌 API 경로. 예: `'/api/v1/auth/reissue'`              |

---

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given `apps/web/src/shared/api/refresh-token.ts`에 `'/api/v1/auth/reissue'` 문자열이 없다
      When 그 파일에 해당 문자열을 포함한 내용을 Write/Edit로 쓴다
      Then 훅이 편집을 차단하고, 사유에 `shared/api/generated/`에서 생성 함수를 찾으라는 안내가 포함된다

- [ ] **AC-2** (범위: 통합)
      Given `apps/web/src/shared/api/axios-instance.test.ts`를 편집한다
      When 내용에 `'*/api/v1/auth/reissue'` 문자열이 포함된다
      Then 차단하지 않는다 (MSW 핸들러가 경로를 지정해야 하므로 `*.test.ts(x)`는 검사 대상이 아니다)

- [ ] **AC-3** (범위: 통합)
      Given `apps/web/src/shared/api/generated/authtoken-api/authtoken-api.ts`
      When 그 파일을 편집한다
      Then 기존 「자동 생성 파일 수정 금지」 사유 하나만 반환되고 이 검사의 사유가 중복되지 않는다

- [ ] **AC-4** (범위: 통합)
      Given 엔드포인트 리터럴이 이미 있는 기존 파일
      When 그 리터럴과 무관한 다른 줄만 수정한다
      Then 차단하지 않는다

## 구현 전 확인

- 어떤 패턴을 엔드포인트 리터럴로 볼 것인가. `MIG-005` 시점의 실측으로는 생성 코드의 경로가
  모두 `/api/v{숫자}/`로 시작한다. 이 전제가 계속 유효한지 확인한다
- `apps/native`처럼 `apps/web` 밖에서도 검사할지. 생성 API는 web 전용이므로 범위를 web으로
  좁힐지 결정한다
- 오탐이 났을 때 우회 수단을 둘지. 두지 않는 쪽이 기본이며, 필요하면 사유를 남기는 방식을 정한다

## Changelog

| 날짜       | 요약      | 사유                                                                  | 연관 항목 |
| ---------- | --------- | --------------------------------------------------------------------- | --------- |
| 2026-09-09 | 최초 작성 | `MIG-005` Issue 2에서 생성 API를 우회한 구현이 4종 검사를 모두 통과함 | `MIG-005` |
