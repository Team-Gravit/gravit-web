---
id: 'FIX-032'
title: 'Skeleton 텍스트 자리표시가 실제 텍스트보다 4px 높다'
type: 'fix'
screen: '-'
priority: 'medium'
created: '2026-09-17'
revised: '2026-09-17'
---

# FIX-032 — Skeleton 텍스트 자리표시 높이 불일치

## 배경

`MIG-030` 검증 중 스켈레톤과 실제 화면의 요소 위치를 재다가 발견했다.
같은 폰트·같은 크기·같은 `line-height`인데 높이가 다르다.

| 대상                                             | 높이     |
| ------------------------------------------------ | -------- |
| `Skeleton` text 변형 (`text-label2`)             | **19px** |
| 실제 `<p className="text-label2">` 한국어 텍스트 | **15px** |

둘 다 `font-family: Pretendard` · `font-size: 13px` · `line-height: normal` 로 계산된다.

## 재현

1. `text-label1` · `text-label2` · `text-caption1` · `text-caption2` 중 하나를 쓰는
   `Skeleton` 과 같은 클래스의 실제 텍스트를 나란히 둔다
2. 두 요소의 `getBoundingClientRect().height` 를 비교한다
3. 스켈레톤이 4px 높다

## 원인 (확인함)

`Skeleton` text 변형은 안에 **ZWSP(U+200B)** 를 넣어 줄 높이를 만든다.

```ts
const LINE_BOX_CHAR = '​'; // Zero Width Space
```

`line-height: normal` 은 **실제로 사용된 폰트의 메트릭**으로 줄 상자를 정한다. ZWSP 가 Pretendard 에
없어 폴백 폰트로 떨어지면 그 폰트의 메트릭이 적용돼 줄 상자가 커진다.

**`line-height` 가 숫자인 토큰은 영향이 없다.** `MIG-030` 의 넓은 화면은 `title1`(1.25)·
`body1-normal`(1.5)만 써서 모든 요소가 0px 오차로 맞았고, `normal` 을 쓰는 좁은 화면만 4px 밀렸다.

## 영향 범위

`--text-*--line-height: normal` 인 토큰 4종을 쓰는 모든 텍스트 스켈레톤.

| 토큰       | line-height |
| ---------- | ----------- |
| `label1`   | `normal`    |
| `label2`   | `normal`    |
| `caption1` | `normal`    |
| `caption2` | `normal`    |

확인된 사용처 — `entities/learning/ui/unit-card.tsx` 의 `UnitCardSkeleton`(`text-label1`·
`text-caption1`), `pages/unit-detail` 의 좁은 화면 자리표시.

## 범위

- `shared/ui/skeleton` 의 text 변형이 같은 클래스의 실제 텍스트와 **같은 높이**를 갖게 한다
- `cn.test.ts` 처럼 회귀를 고정하는 테스트를 붙인다

## Out of Scope

- 타이포 토큰의 `line-height: normal` 을 숫자로 바꾸는 것 — 디자인 시스템 변경이라 별도 판단이다
- 개별 화면에서 높이를 손으로 맞추는 우회

---

## 확인 필요

1. **고치는 방법.** ZWSP 대신 폴백이 일어나지 않는 방식으로 줄 상자를 만들지, 아니면 text 변형에
   계산된 높이를 직접 주는지. 후자는 토큰마다 높이를 다시 적게 되어 토큰과 갈라질 위험이 있다.
2. **4px 이 실제로 문제가 되는 화면이 있는가.** `MIG-030` 에서는 로딩이 끝날 때 목록이 4px 튀는
   정도다. 다른 화면에서 더 크게 드러나는지 확인이 필요하다.

---

## 근거

- `work/done/MIG-030-유닛-상세-이전/checklist.md` §1
- 측정: 스켈레톤 span 19px vs 실제 `<p>` 15px (둘 다 Pretendard 13px `normal`)

## Changelog

| 날짜       | 요약      | 사유                               | 연관 항목 |
| ---------- | --------- | ---------------------------------- | --------- |
| 2026-09-17 | 작업 생성 | MIG-030 검증 중 위치 측정으로 발견 | MIG-030   |
