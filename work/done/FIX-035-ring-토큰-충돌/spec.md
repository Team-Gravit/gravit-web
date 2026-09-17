---
id: 'FIX-035'
title: '숫자 색상 토큰과 ring 두께 유틸리티 충돌'
type: 'fix'
priority: 'high'
created: '2026-09-17'
---

# FIX-035 — 숫자 색상 토큰과 ring 두께 유틸리티 충돌

## 재현

`focus-visible:ring-3 focus-visible:ring-purple-200`를 사용하는 요소에 키보드로 포커스해도
3px focus ring이 표시되지 않는다.

## 원인

`tokens.css`의 미사용 호환 토큰 `--color-3: #ffb608` 때문에 Tailwind가 `ring-3`을 두께가
아니라 색상 유틸리티로 생성한다.

```css
.focus-visible\:ring-3:focus-visible {
  --tw-ring-color: var(--color-3);
}
```

`--color-3`은 `apps/web`에서 사용되지 않는다. legacy에서는 문제 화면의 북마크 색상에만 쓰므로,
해당 화면을 이전할 때는 용도가 드러나는 정식 토큰을 별도로 판단한다.

## 범위

- `apps/web/src/app/styles/tokens.css`에서 `--color-3` 제거
- `docs/design-system/README.md` 정리 대상 토큰 대장 51개 → 50개 갱신
- 기존 `ring-3` 사용처가 3px 두께와 지정 색상을 함께 생성하는지 검증

## 검증 기준

- 빌드 CSS의 `ring-3`이 `--tw-ring-shadow: 0 0 0 3px`을 생성한다
- `ring-purple-200`이 ring 색상을 유지한다
- 키보드 포커스 시 Button·입력·카드의 focus ring이 표시된다
- `rg` 기준 `apps/web`에 `--color-3` 선언이나 색상 용도 사용처가 없다

## Out of Scope

- `apps/legacy-web` 수정
- legacy 문제 화면의 북마크 색상 토큰 결정
- focus ring의 두께·색상 디자인 변경
