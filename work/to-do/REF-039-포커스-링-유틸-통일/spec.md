---
id: 'REF-039'
title: '포커스 링을 공용 유틸로 통일한다'
type: 'refactor'
screen: '-'
priority: 'low'
created: '2026-09-20'
revised: '2026-09-20'
---

# REF-039 — 포커스 링을 공용 유틸로 통일한다

## 배경 · 목표

포커스 표시가 **문자열 반복으로 유지되고 있다.**

```
outline-none focus-visible:ring-3 focus-visible:ring-purple-200
```

이 조합이 **14개 파일**에 그대로 적혀 있다. `shared/ui` 뿐 아니라 `entities/learning` 의 카드
4종, `entities/user`, `features/auth-login`, `pages` 까지 레이어를 넘어 퍼져 있다. 카드들이
`Button` 을 거치지 않고 `<Link>` 위에 직접 포커스 링을 그리기 때문이다.

**규칙 문서에 포커스 절이 없다.** `className-convention.md` 에 색·타이포·radius 기준은 있지만
포커스 표시 기준은 없다. 그래서 새 컴포넌트를 쓸 때 기존 문자열을 찾아보지 않으면 임의로
갈라진다 — 실제로 FEAT-038 에서 `ring-2 ring-cta` 로 어긋난 것이 3곳 나왔고 리뷰에서 되돌렸다.

**목표** — 포커스 표시를 한 곳에서 정의하고, 쓰는 쪽은 이름 하나를 참조한다.
**비목표** — 포커스 링의 **모양을 바꾸는 것**. 지금 값을 그대로 옮긴다.

## 범위

| 대상                       | 내용                                                |
| -------------------------- | --------------------------------------------------- |
| `app/styles/tokens.css`    | 포커스 링 색을 의미 토큰으로 (`--color-focus-ring`) |
| `app/styles/utilities.css` | `.focus-ring` · `.focus-ring-within` 추가           |
| `shared/lib/cn.ts`         | tailwind-merge 에 새 유틸 등록                      |
| 사용처 14개 파일           | 문자열을 유틸 이름으로 교체                         |

### 왜 `@theme` 이 아니라 유틸인가

`@theme` 은 **값**을 담는 곳이고 규칙 묶음을 둘 수 없다. `outline-none` + `focus-visible:ring-*`
두 선언을 한 이름으로 묶으려면 유틸이어야 한다. 값(색)은 `@theme`, 묶음은 유틸로 나눈다.

컴포넌트만으로는 부족하다 — `entities/learning` 의 카드들이 `Button` 을 거치지 않고 직접 링을
그리므로, 레이어를 넘어 참조할 수 있는 공용 유틸이 필요하다.

`app/styles/utilities.css` 에 `@layer utilities` 로 커스텀 클래스를 모으는 관례가 이미 있다
(`glass-morphism-border` · `scrollbar-gutter-stable` · `bg-main-gradient`). 새 자리를 만들지 않는다.

### `has-focus-visible` 변형이 따로 필요하다

포커스가 자식에 있고 링은 부모가 그려야 하는 경우가 있다. `shared/ui/accordion` 이 그렇다 —
루트의 `overflow-hidden` 이 버튼의 링(box-shadow)을 잘라먹어서 링을 루트로 올렸다.
**값은 같고 변형만 다르다.**

## ⚠️ `cn()` 등록이 필수다

`cn()` 은 커스텀 확장이 들어간 tailwind-merge다. 등록하지 않으면 `.focus-ring` 과 `ring-*` 의
**충돌을 걸러내지 못해** 둘 다 남는다.

```ts
cn('focus-ring', 'focus-visible:ring-0'); // 등록 전: 둘 다 살아남는다
```

같은 문제를 이 저장소가 이미 겪고 해결해 뒀다 — `cn.ts` 가 타이포 토큰과 radius 토큰을 등록하는
이유가 그것이다. 기존 `glass-morphism-border` 같은 유틸은 충돌할 상대가 없어 등록하지 않았지만
**`focus-ring` 은 `ring-*` 과 충돌한다.**

## Out of Scope

- **포커스 링의 시각 변경** — 굵기·색·offset 을 바꾸지 않는다. 바꿀 근거가 생기면 시안 대조
  작업으로 분리한다
- `ring-offset-2` 를 쓰는 한 곳 — 배경 대비가 부족한 맥락 예외다. 유틸로 흡수할지는 그 화면을
  보고 판단한다
- 포커스 외의 상태(hover·active·disabled) 통일

## 확정된 규칙

| #   | 규칙                                                                           |
| --- | ------------------------------------------------------------------------------ |
| R1  | 포커스 표시는 **상태와 독립**이다. 검증 실패·성공에 따라 링 색을 바꾸지 않는다 |
| R2  | 값은 `@theme`, 규칙 묶음은 유틸, 사용은 컴포넌트. 세 자리를 섞지 않는다        |
| R3  | 유틸을 추가하면 `cn()` 에 등록한다. 충돌 대상이 있는 경우에 한한다             |

> **R1 의 근거** — 포커스는 「지금 여기 있다」는 시스템 신호다. FEAT-038 에서 `TextField` 의
> 링 색을 tone 별로 바꿨다가 되돌렸다. 에러는 테두리·글자색·`aria-invalid` 가 이미 전달한다.

## 완료 후 액션

- [ ] `className-convention.md` 에 포커스 절 추가 — **이 작업의 절반은 규칙을 적는 것이다.**
      문서에 없어서 갈라진 것이므로 유틸만 만들고 끝내면 같은 일이 반복된다
- [ ] `docs/design-system/` 에 포커스 토큰 반영

## 확인 필요

1. **포커스 링 색을 의미 토큰으로 승격해도 되는가.** 지금은 팔레트 색(`purple-200`)을 직접
   쓴다. `--color-focus-ring` 을 새로 만드는 것이 `design-source-policy.md` §6(미확정 토큰을
   하드코딩하지 않는다)에 걸리는지 확인한다. Figma 에 포커스 상태 정의가 있는지가 기준이다.

## Changelog

| 날짜       | 요약      | 사유                                                                                          | 연관 항목 |
| ---------- | --------- | --------------------------------------------------------------------------------------------- | --------- |
| 2026-09-20 | 작업 생성 | FEAT-038 구현 중 포커스 문자열이 3곳 어긋난 것을 발견. 규칙 문서에 포커스 절이 없는 것이 원인 | FEAT-038  |
