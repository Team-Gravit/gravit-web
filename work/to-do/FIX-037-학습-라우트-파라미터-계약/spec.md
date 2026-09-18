---
id: 'FIX-037'
title: '학습 라우트의 잘못된 경로 파라미터를 404로 처리한다'
type: 'fix'
screen: '-'
priority: 'low'
created: '2026-09-18'
revised: '2026-09-18'
---

# FIX-037 — 학습 라우트의 잘못된 경로 파라미터를 404로 처리한다

## 배경 · 목표

학습 상세 라우트들은 경로 파라미터를 검증하지 않는다. 숫자가 아닌 값이 들어오면
`Number(...)`가 `NaN`이 되고, 조회 훅의 `enabled`가 `false`가 되어 쿼리가 영영 시작되지
않는다. TanStack Query 에서 비활성 쿼리는 `isPending`이 계속 `true`이므로 **화면이 스켈레톤
상태로 고정된다.**

| 경로                     | 현재 동작                               | 확인한 위치                         |
| ------------------------ | --------------------------------------- | ----------------------------------- |
| `/learning/chapters/abc` | 스켈레톤 영구 (`Number.isFinite` 가드)  | `use-units-in-chapter.ts`           |
| `/learning/units/abc`    | 스켈레톤 영구 (`Number.isInteger` 가드) | `use-unit-lessons.ts`               |
| `/learning/lessons/abc`  | 미정 — 풀이 화면 본체가 아직 없다       | `_focus/learning.lessons.$lessonId` |

없는 주소는 "데이터가 없는 유닛"이 아니라 **없는 페이지**다. `__root.tsx` 에
`notFoundComponent: NotFoundPage` 가 이미 걸려 있으므로 새 화면 없이 404 로 보낼 수 있다.

**목표** — 학습 상세 라우트가 유효한 식별자만 화면에 넘기고, 그 외에는 404 를 보여준다.

## 범위

- `app/routes/_authenticated/_app-shell/learning.chapters.$chapterId.index.tsx`
- `app/routes/_authenticated/_app-shell/learning.units.$unitId.index.tsx`
- `app/routes/_authenticated/_app-shell/learning.units.$unitId.concept-note.tsx`
- `app/routes/_authenticated/_focus/` 3종
- 위 라우트가 넘기는 값이 `number` 로 좁혀지면 화면·훅의 방어 코드도 함께 정리한다

## Out of Scope

- **zod 도입.** 검증 대상이 양의 정수 하나라 `Number.isInteger` 로 충분하다. search params
  검증이 필요해지는 시점에 라이브러리 도입을 별도로 판단한다
- 학습 외 라우트의 파라미터 (`$noticeId`, `$provider` 등)
- 404 화면(`NotFoundPage`)의 디자인

## 용어 정의 (Ubiquitous Language)

| 용어          | 정의                                                         |
| ------------- | ------------------------------------------------------------ |
| 유효한 식별자 | 1 이상의 정수. `Number.isInteger(value) && value > 0`        |
| 경로 파라미터 | `$chapterId` · `$unitId` · `$lessonId` 처럼 URL 에 박히는 값 |

---

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given `/learning/units/abc`
      When 주소로 직접 들어간다
      Then `NotFoundPage` 가 보이고 유닛 상세 스켈레톤이 보이지 않는다

- [ ] **AC-2** (범위: 통합)
      Given `/learning/chapters/abc`
      When 주소로 직접 들어간다
      Then `NotFoundPage` 가 보이고 챕터 화면 스켈레톤이 보이지 않는다

- [ ] **AC-3** (범위: 통합)
      Given `/learning/units/0` 과 `/learning/units/-1`
      When 주소로 직접 들어간다
      Then 두 경로 모두 `NotFoundPage` 가 보인다

- [ ] **AC-4** (범위: 통합)
      Given `/learning/units/21`
      When 주소로 직접 들어간다
      Then 유닛 상세가 정상 렌더되고 `useUnitLessons` 가 `21` 로 호출된다

### 참고 — 구현 형태

`params.parse` 로 숫자로 좁히고 `beforeLoad` 에서 `notFound()` 를 던진다. `notFound()` 는
`router-core` 가 "가장 가까운 `notFoundComponent` 를 띄우기 위해 loader 에서 던지는 것"으로
정의한 함수다.

## Changelog

| 날짜       | 요약      | 사유                                                                          | 연관 항목           |
| ---------- | --------- | ----------------------------------------------------------------------------- | ------------------- |
| 2026-09-18 | 최초 작성 | `MIG-030` 구현 중 발견. 유닛만 고치면 챕터와 동작이 갈려 3종을 한 번에 다룬다 | `MIG-030` `MIG-029` |
