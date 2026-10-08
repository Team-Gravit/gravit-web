---
id: 'INFRA-016'
title: '타입 인지 린트로 삼켜진 Promise를 잡을지 검토'
type: 'infra'
screen: '-'
priority: 'low'
created: '2026-09-09'
revised: '2026-09-09'
---

# INFRA-016 — 타입 인지 린트로 삼켜진 Promise를 잡을지 검토

## 배경 · 목표

`return`을 빠뜨린 `Promise.reject(err);`는 **에러를 조용히 삼킨다.** 실패한 약속만 만들어지고
코드는 계속 진행해, 호출부가 `undefined`를 성공으로 받는다. 스택도 로그도 남지 않아 원인 추적이
가장 어려운 형태의 버그다.

`MIG-005` Issue 2 리뷰에서 이 위험이 드러났고, 확인 결과 **현재 어떤 도구도 이를 잡지 않는다.**
`packages/eslint-config/base.js`가 `tseslint.configs.recommended`를 쓰는데,
`@typescript-eslint/no-floating-promises`는 타입 정보가 필요해 `recommendedTypeChecked`에만
들어 있기 때문이다.

당장은 `axios-instance.ts`를 `throw`로 통일해 이 함정을 피했지만, 그건 사람이 지키는 규율이다.
도구가 잡으면 idiom 선택과 무관하게 안전해진다.

**단, 타입 인지 린트는 공짜가 아니다.** `projectService` 설정이 필요하고 lint 실행 시간이 늘어난다.
이 작업의 목표는 "도입"이 아니라 **비용을 측정한 뒤 도입 여부를 결정**하는 것이다.

## 범위

- `packages/eslint-config/base.js` 또는 `react-internal.js` — 룰 활성화 방식 결정
- 타입 인지 린트에 필요한 `parserOptions.projectService` 설정
- 도입 전후 `pnpm lint` 실행 시간 측정과 기록
- 결정 결과를 `docs/conventions/` 또는 `code-quality.md`에 반영

## Out of Scope

- `apps/legacy-web` — pnpm 워크스페이스 밖이라 루트 lint 대상이 아니다
- 발견된 기존 위반을 이 작업에서 전부 수정하는 것 — 목록화까지만 하고 수정은 분리한다
- Prettier·steiger 등 다른 검사 도구 설정 변경
- `INFRA-010`의 verify 묶음·PR CI 구성 — 별도 항목이다

## 용어 정의 (Ubiquitous Language)

| 용어           | 정의                                                                       |
| -------------- | -------------------------------------------------------------------------- |
| 타입 인지 린트 | 타입 정보를 읽어 검사하는 ESLint 구성. `recommendedTypeChecked` 계열       |
| 삼켜진 Promise | 반환·await·catch 중 무엇도 하지 않아 결과와 실패가 사라지는 Promise 표현식 |
| 임계치         | lint 실행 시간이 이만큼 늘면 도입을 포기한다고 미리 정한 값                |

---

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given `apps/web/src`의 파일에 `Promise.reject(new Error('x'));`가 `return` 없이 한 줄로 있다
      When `pnpm --filter @repo/web lint`를 실행한다
      Then `@typescript-eslint/no-floating-promises` 위반이 출력되고 exit code가 0이 아니다

- [ ] **AC-2** (범위: 통합)
      Given 룰을 켠 현재 저장소 코드
      When `pnpm lint`를 실행한다
      Then 신규 위반 건수가 0이거나, 위반 파일 목록과 각각의 처리 방침이 이 작업의 `checklist.md`에 적혀 있다

- [ ] **AC-3** (범위: 통합)
      Given 룰 도입 전 상태와 도입 후 상태
      When 각각 `pnpm lint`를 3회 실행해 소요 시간을 잰다
      Then 두 상태의 평균 실행 시간이 초 단위로 `checklist.md`에 기록된다

- [ ] **AC-4** (범위: 단위)
      Given AC-3의 측정 결과
      When 사전에 정한 임계치와 비교한다
      Then 도입 또는 미도입 중 하나로 결론이 적히고, 미도입이면 대신 유지할 규율이 명시된다

## 구현 전 확인

- **임계치를 먼저 정한다.** 측정 후에 기준을 만들면 결론을 끼워 맞추게 된다
- `recommendedTypeChecked` 전체를 켤지, `no-floating-promises` 하나만 추가할지. 전체는 위반이
  대량 발생할 수 있어 이번 목적과 범위가 어긋난다
- `parserOptions.projectService`로 갈지 `project` 배열로 갈지. 모노레포에서 어느 tsconfig를 물릴지
- 적용 범위를 `apps/web`으로 한정할지, `base.js`에 넣어 `apps/native`까지 걸지
- `no-floating-promises` 외에 `no-misused-promises`도 같은 비용으로 얻을 수 있다. 함께 볼지

## Changelog

| 날짜       | 요약      | 사유                                                                | 연관 항목 |
| ---------- | --------- | ------------------------------------------------------------------- | --------- |
| 2026-09-09 | 최초 작성 | `MIG-005` Issue 2 리뷰에서 삼켜진 Promise를 잡는 도구가 없음을 확인 | `MIG-005` |
