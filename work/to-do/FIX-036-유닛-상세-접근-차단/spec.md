---
id: 'FIX-036'
title: '풀 문제가 없는 북마크·오답노트로 들어가지 못하게 막는다'
type: 'fix'
screen: 'LRN-03'
priority: 'medium'
created: '2026-09-18'
revised: '2026-09-18'
---

# FIX-036 — 풀 문제가 없는 북마크·오답노트로 들어가지 못하게 막는다

## 배경 · 목표

`GET /api/v1/lessons/{unitId}` 는 `bookmarkAccessible` · `wrongAnsweredNoteAccessible` 로 해당
유닛에서 북마크·오답 문제를 풀 수 있는지를 알려준다. legacy 는 이 값을 모델까지만 옮기고
화면에서 읽지 않아(`entities/learning/model/mappers.ts`), 풀 문제가 0건이어도 카드를 눌러
빈 풀이 화면으로 들어가는 경로가 열려 있다.

`MIG-030` 은 이전 작업이라 legacy 동작을 그대로 옮겼고, 이 항목을 `확인 필요 3` 으로 남겼다
(`checklist.md` A7 — 카드 항상 활성). 이 작업에서 판정 결과를 반영한다.

**목표** — 접근할 수 없는 카드를 눌렀을 때 이동하지 않고 이유를 알린다.

## 범위

- `entities/learning/model/lesson.ts` — 두 플래그를 `UnitLessons` 로 옮긴다
- `pages/unit-detail/ui/unit-detail-page.tsx` — 차단 분기와 안내
- 화면 `LRN-03` (`/learning/units/$unitId`) 하나

## Out of Scope

- **toast 도입** — `FEAT-017` 이 맡는다. 이 작업은 alert 로 임시 대체한다
- **개념노트 카드** — API 에 접근 가능 여부 플래그가 없다. 항상 이동한다
- **목적지 화면 3종의 본체** (북마크·오답·레슨 풀이). 지금은 빈 라우트다
- 비활성 상태의 시각 표현. 시안에 비활성 프레임이 없어 스타일을 새로 만들지 않는다
  (`design-source-policy.md` §6)

## 용어 정의 (Ubiquitous Language)

| 용어          | 정의                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| 접근 가능     | 서버가 `bookmarkAccessible` · `wrongAnsweredNoteAccessible` 로 주는 값 |
| 바로가기 카드 | 유닛 상세 왼쪽 열의 개념노트 · 북마크 · 오답노트 카드 3종              |

---

## 확정 명세 · 검증 기준

카드의 외형은 접근 가능 여부와 무관하게 같다. 이동 여부와 안내만 다르다.

- [ ] **AC-1** (범위: 통합)
      Given `bookmarkAccessible: false` 인 응답
      When `북마크` 카드를 클릭하면
      Then `/learning/units/$unitId/bookmarked-problems` 로 이동하지 않고
      `아직 북마크한 문제가 없어요.` 안내가 뜬다

- [ ] **AC-2** (범위: 통합)
      Given `wrongAnsweredNoteAccessible: false` 인 응답
      When `오답노트` 카드를 클릭하면
      Then `/learning/units/$unitId/incorrect-problems` 로 이동하지 않고
      `아직 틀린 문제가 없어요.` 안내가 뜬다

- [ ] **AC-3** (범위: 통합)
      Given 두 플래그가 모두 `true` 인 응답
      When 각 카드를 클릭하면
      Then 각각 `bookmarked-problems` · `incorrect-problems` 로 이동한다

- [ ] **AC-4** (범위: 단위)
      Given `bookmarkAccessible: false` 인 응답
      When 유닛 상세를 렌더하면
      Then `북마크` 카드는 `link` role 이 아닌 `button` 으로 렌더된다

- [ ] **AC-5** (범위: 통합)
      Given 두 플래그 값과 무관하게
      When `개념노트` 카드를 클릭하면
      Then `/learning/units/$unitId/concept-note` 로 이동한다

### 임시 조치

안내는 `window.alert` 로 띄운다. `FEAT-017` 이 toast 를 도입하면 그때 교체한다 —
**교체 조건은 "toast 가 `shared` 에 존재하는 것" 하나다.**

---

## Changelog

| 날짜       | 요약      | 사유                                                                                     | 연관 항목                     |
| ---------- | --------- | ---------------------------------------------------------------------------------------- | ----------------------------- |
| 2026-09-18 | 최초 작성 | `MIG-030` 확인 필요 3 판정 — 플래그를 반영하되 시안에 없는 비활성 스타일은 만들지 않는다 | #237 · `MIG-030` · `FEAT-017` |
