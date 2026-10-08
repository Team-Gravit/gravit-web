---
id: 'MIG-028'
title: '학습 상세 공통 셸'
type: 'migrate'
screen: 'L.2 · L.3'
priority: 'high'
created: '2026-09-16'
revised: '2026-09-16'
---

# MIG-028 — 학습 상세 공통 셸

## 배경 · 목표

`/learning/chapters/$chapterId`(`MIG-029`)와 `/learning/units/$unitId`(`MIG-030`)를 서로 다른
워크스페이스에서 동시에 구현한다. 두 화면의 API는 완전히 갈라지지만(`getAllUnitInChapter` /
`getAllLessonInUnit`) **상단 셸은 같다** — 경로 · 제목 · 설명, 그리고 좁은 화면의 상단 바다.

이 셸을 계약 문서로만 전달하면 양쪽이 각자 구현해 하나가 버려지거나 미묘하게 갈라진다.
먼저 `develop`에 올려 **코드 자체를 계약으로** 고정하고, 두 작업이 그 위에서 분기한다.

## 범위

| 산출물         | 위치                      | 내용                                             |
| -------------- | ------------------------- | ------------------------------------------------ |
| `Breadcrumb`   | `shared/ui/breadcrumb/`   | 경로 표시. legacy `bread-crumb` 이전             |
| `PageHeading`  | `shared/ui/page-heading/` | 경로 + 제목 + 설명. legacy `summary-header` 이전 |
| `PageTitleBar` | `widgets/page-title-bar/` | 기존 컴포넌트에 `backTo` · `rightSlot` 추가      |

## Out of Scope

- **두 화면의 본체** — 유닛 목록 · 레슨 목록은 `MIG-029`·`MIG-030`
- **알림 벨의 동작** — 시안 우측에 있지만 `MAIN-01-F17`에서 이미 별도 `FEAT-`로 분리했다.
  이번에는 `rightSlot` 자리만 연다
- **좁은 화면 `h1` 중복** — `PageTitleBar`와 `PageHeading`을 한 화면에 쓰면 `h1`이 둘이 된다.
  실제로 조립하는 `MIG-029`에서 판단한다 (§확인 필요 1)

## 용어 정의

| 용어         | 뜻                                                    |
| ------------ | ----------------------------------------------------- |
| 경로(그래픽) | 「홈 > 자료구조 > Unit01」. 코드에서는 `Breadcrumb`   |
| 현재 위치    | 경로의 마지막 항목. 이동할 곳이 없어 링크가 아니다    |
| 상단 바      | 좁은 화면 최상단 48px 바. 시안의 `Top Navigation Bar` |

## 현행 동작 기준선 (legacy)

`apps/legacy-web`의 두 파일을 읽었다. **구조는 따라가지 않고 관찰 가능한 동작만 기준으로 삼는다.**

| #   | 관찰                                                               | 출처                                      |
| --- | ------------------------------------------------------------------ | ----------------------------------------- |
| B1  | 경로 항목에 `to`가 있으면 링크, 없으면 텍스트                      | `shared/ui/bread-crumb/bread-crumb.tsx`   |
| B2  | 구분자는 chevron-right 16px, 항목 간격 4px                         | 〃                                        |
| B3  | 링크는 `body1-normal`·`text-3`, 마지막 항목은 `headline2`·`text-2` | 〃                                        |
| B4  | 경로는 **넓은 화면에서만** 그린다                                  | `entities/learning/ui/summary-header.tsx` |
| B5  | 제목·설명은 `md`에서 크기가 바뀐다 (`headline2`→`title1`)          | 〃                                        |

legacy는 `summary-header`를 `entities/learning`에 뒀지만 도메인 데이터를 받지 않고 문자열만 받는다.
`legacy-web-policy.md`에 따라 배치를 다시 판단해 `shared/ui`로 올렸다.

## 시안 대조 결과

Figma `LRN-02`(WEB `13752:83853` · MOB `13750:50969`) 기준.
**legacy가 이미 시안과 일치해 고칠 것은 상단 바 여백 하나뿐이었다.**

| 축           | Figma                                                | 판정                    |
| ------------ | ---------------------------------------------------- | ----------------------- |
| 경로 링크    | `Body1_Normal` 16/400 · `text/3` #6d6d6d             | 유지 — B3과 일치        |
| 현재 위치    | `Headline 2` 17/600 · `text/2` #383838               | 유지 — B3과 일치        |
| 구분자       | 16×16 · `icon/default` #6d6d6d                       | 유지 — B2와 일치        |
| 경로 간격    | 4px · 제목까지 16px                                  | 유지                    |
| 제목 (WEB)   | `Title1` 32/700 · `text/2`                           | 유지 — B5와 일치        |
| 제목 (MOB)   | `Headline 2` 17/600 · `text/1` #242424               | 유지 — B5와 일치        |
| 설명         | WEB `Body1_Normal` / MOB `Label 2` 13/400 · `text/3` | 유지                    |
| 상단 바      | 48px · `bg/0` · `divider/divider-1` · `Label1`       | 유지 — 기존 구현과 일치 |
| 상단 바 여백 | `padding/padding-l` 20                               | **고침 — `px-5` 추가**  |
| MOB 경로     | **없다.** 상단 바만 있다                             | 유지 — B4와 일치        |

`--color-icon`(#6f6f6f)은 Figma `icon/default`(#6d6d6d)와 1 차이가 나므로 쓰지 않고
`text-text-3`(#6d6d6d)를 썼다. 토큰 불일치 자체는 `FIX-007`의 범위다.

## 확정 명세 · 검증 기준

- [x] **AC-1** (범위: 단위)
      Given `link`가 있는 항목 2개와 없는 항목 1개
      When `Breadcrumb`을 그리면
      Then 앞 2개만 `link` role을 갖고 각각의 `href`가 넘긴 경로다
- [x] **AC-2** (범위: 단위)
      Given `link`가 없는 항목
      When 그리면
      Then 그 항목이 `aria-current="page"`를 갖고, 링크 항목은 갖지 않는다
- [x] **AC-3** (범위: 단위)
      When `Breadcrumb`을 그리면
      Then 「현재 위치」라는 이름의 `navigation`이 있다
- [x] **AC-4** (범위: 단위)
      Given `backTo`에 `{ to: '/learning' }`
      When `PageTitleBar`를 그리면
      Then 「뒤로 가기」라는 이름의 링크가 있고 `href`가 `/learning`이다
- [x] **AC-5** (범위: 단위)
      Given `backTo`를 넘기지 않음
      When 그리면
      Then 링크가 하나도 없고 제목만 `heading`으로 있다
- [x] **AC-6** (범위: 단위)
      Given `backTo`와 `rightSlot`을 함께 넘김
      When 그리면
      Then 뒤로 가기 링크 · `rightSlot`의 요소 · 제목이 모두 있다

### 자동 테스트로 덮지 않은 것

- 제목이 바의 **정중앙**에 오는지 — 위치 계산은 CSS라 단언하지 않는다 (`test-policy.md` §5)
- `md` 경계에서 제목 크기가 바뀌는지 — 시각 검증 영역

## 확인 필요

1. **좁은 화면 `h1` 중복** — 시안 MOB은 상단 바와 본문에 같은 제목을 두 번 보여준다.
   현재 `PageTitleBar`와 `PageHeading` 모두 `h1`이라 좁은 화면에서 `h1`이 둘이 된다.
   `PageTitleBar`를 `p`로 낮추면 학습 홈(좁은 화면)에 `h1`이 사라지므로 함께 판단해야 한다.
   `MIG-029`가 실제로 조립할 때 결정한다
2. **`rightSlot`에 들어갈 알림 벨** — 시안에 있으나 동작 정의가 없다. `FEAT-`로 다룰 때
   `PageTitleBar`를 바꾸지 않고 슬롯에 넣을 수 있는지 확인한다

## Changelog

| 날짜       | 내용                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- |
| 2026-09-16 | 공통 셸 구현과 AC 1~6 검증 완료. 화면 본체와 확인 필요 항목은 MIG-029·MIG-030으로 이관 |
