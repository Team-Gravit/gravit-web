---
id: FIX-001
title: Button asChild 가 Slot 에 Fragment 를 넘겨 모든 prop 이 유실된다
type: fix
screen: '-'
priority: high
created: 2026-08-30
revised: 2026-09-02
---

# FIX-001 — Button asChild 가 Slot 에 Fragment 를 넘겨 모든 prop 이 유실된다

## 배경 · 목표

`<Button asChild>` 로 링크를 버튼 모양으로 쓰면 **버튼 스타일이 하나도 적용되지 않는다.**
`className`(cva 기반 버튼 스타일 전체), `data-slot`, `data-variant`, `aria-disabled`, `aria-busy` 가
모두 자식 엘리먼트에 도달하지 못하고 사라진다.

Phase 0 테스트 하네스 스모크 중 발견됐다. React 자체도 경고를 출력하고 있었으나
테스트가 없어 지금까지 드러나지 않았다.

## 재현

```tsx
render(
  <Button asChild disabled className="probe-class">
    <a href="/home">홈</a>
  </Button>,
);
```

렌더 결과 (`link.outerHTML`):

```html
<a href="/home">홈</a>
```

→ `className`, `data-slot`, `aria-disabled` 전부 없음. **버튼 모양이 전혀 나오지 않는다.**

React 경고:

```
Invalid prop `data-slot` supplied to `React.Fragment`.
React.Fragment can only have `key` and `children` props.
```

## 원인

`apps/web/src/shared/ui/button/button.tsx`

```tsx
const content = (
  <>
    {startIcon}
    {children}
    {endIcon}
  </>
);

return <Comp data-slot="button" {...blockingProps} className={cn(...)}>{content}</Comp>;
```

`asChild` 이면 `Comp = Slot`(`@radix-ui/react-slot`)이다.
Slot 은 **단일 자식 엘리먼트**에 prop 을 병합하는데, 여기서 자식은 `<a>` 가 아니라
`startIcon`/`children`/`endIcon` 을 감싼 **Fragment** 다.
Fragment 는 `key`/`children` 외의 prop 을 받을 수 없으므로 모든 prop 이 버려진다.

## 범위

- `apps/web/src/shared/ui/button/button.tsx`
- `apps/web/src/shared/ui/button/button.test.tsx` (`it.fails` 를 정상 단언으로 되돌리기)
- 같은 패턴을 쓰는 다른 컴포넌트 점검: `shared/ui/icon-button/` 가 `asChild` 를 지원하는지 확인

## Out of Scope

- Button 의 다른 variant / size 개편
- `asChild` 를 쓰는 호출부 신규 작성 (현재 코드베이스에 실사용처가 있는지부터 확인)

## 해결 방향 (후보)

| #   | 방향                                                                                         | 비고                                                                      |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | `Slottable` 사용 — `<Slottable>{children}</Slottable>` 로 감싸 Slot 이 병합 대상을 찾게 한다 | Radix/shadcn 의 표준 해법. `startIcon`/`endIcon` 을 형제로 유지할 수 있다 |
| 2   | `asChild` 일 때는 Fragment 없이 `children` 만 넘긴다                                         | 단순하지만 `startIcon`/`endIcon` 을 asChild 와 함께 못 쓴다               |

> ⚠️ **`asChild` + `isLoading` 조합은 별도 결정이 필요하다.**
> 로딩 분기는 `<span>{content}</span>` + `Spinner` 를 렌더하는데,
> Slot 은 **직속 자식**에서만 `Slottable` 을 찾으므로 1번 해법으로도 이 조합은 해결되지 않는다.
> 두 조합을 지원할지, 타입 수준에서 금지할지(`asChild` 와 `isLoading` 배타) 정해야 한다.

## 확인 필요 — 해소됨

- ~~제품 코드 실사용처가 없다~~ → **생겼다.** `MIG-024`(온보딩 이전)의 완료 화면이
  「홈으로」를 링크로 두어야 해서 이 결함이 그 작업을 막았다. 2026-09-10 판정으로
  **`MIG-024`의 선행 작업**이 되었다
- ~~`asChild` + `isLoading` 을 지원할 것인가~~ → **타입으로 배타 처리한다 (2026-09-10 확정).**
  로딩 표시는 레이블을 `invisible` 한 `<span>` 으로 감싸 폭을 유지하는데, 그러면 `Slottable`
  이 Slot 의 직속 자식에서 사라져 1번 해법으로도 병합이 안 된다. 게다가 `asChild` 의 대상은
  보통 `<a>` 라 「진행 중」이라는 상태 자체가 성립하지 않는다

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합)
      Given `<Button asChild disabled><a href="/home">홈</a></Button>`
      When 렌더하면
      Then `<a>` 에 `data-slot="button"` 과 `aria-disabled="true"` 가 있고, cva 버튼 클래스가 적용된다
- [ ] **AC-2** (범위: 통합)
      Given `<Button asChild startIcon={<Icon/>}><a href="/home">홈</a></Button>`
      When 렌더하면
      Then `<a>` 안에 아이콘과 레이블이 함께 있고 `<a>` 는 하나만 렌더된다
- [ ] **AC-3** (범위: 타입)
      Given `<Button asChild isLoading>` 처럼 두 prop 을 함께 준 코드
      When 타입 검사를 실행하면
      Then 컴파일 에러가 난다 (`ButtonProps` 가 두 prop 을 배타 유니온으로 선언한다)

## Changelog

| 날짜       | 요약                           | 사유                                                    | 연관 항목 |
| ---------- | ------------------------------ | ------------------------------------------------------- | --------- |
| 2026-08-30 | 최초 작성                      | Phase 0 테스트 하네스 스모크 중 발견                    | -         |
| 2026-09-02 | 실사용 범위와 미확정 AC 구분   | 제품 코드 사용 여부를 현재 저장소에서 재확인            | #186      |
| 2026-09-10 | AC-3 확정 · 선행 작업으로 승격 | MIG-024 완료 화면이 이 결함에 막혀 착수 순서가 정해졌다 | MIG-024   |
