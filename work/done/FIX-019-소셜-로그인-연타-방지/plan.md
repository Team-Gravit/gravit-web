---
id: 'FIX-019'
planned: '2026-09-10'
mode: 'fix'
---

# FIX-019 구현 계획

> `spec.md`에 배경·재현·원인·범위·AC가 이미 있다. 여기서는 반복하지 않고
> 영향 분석 · 구현 순서 · 리스크만 적는다.

## 1. 작업 종류

`FIX-` — 결함 수정이다. MIG-018이 legacy 동작(기준선 L10)을 그대로 옮겼고, 그 동작 자체가
결함이라 별도 작업으로 분리해 둔 것이다. 구조 변경은 없다.

## 2. 브랜치

`feat/#203/login-screen`에서 분기했다. `develop`이 아닌 이유 —
`features/auth-login/ui/social-login-button.tsx`가 `#203`에만 있고 develop에는 없다.

```
develop → feat/#196/auth-session → feat/#201/oauth-login → feat/#203/login-screen
                                                              └→ fix/FIX-019/...
```

GitHub Issue가 아직 없어 브랜치 이름에 작업 ID를 썼다. 이슈를 만들면
`fix/#{번호}/social-login-double-submit`으로 바꾼다.

## 3. 영향 분석

`rg -l "SocialLoginButton|useOauthLogin" apps/web/src` 결과 중 이번 변경과 관련된 것:

| 구분 | 파일                                                           | 비고                          |
| ---- | -------------------------------------------------------------- | ----------------------------- |
| 수정 | `features/auth-login/ui/social-login-button.tsx`               | `isPending` 반영              |
| 수정 | `features/auth-login/ui/social-login-button.test.tsx`          | AC-1 테스트 추가              |
| 영향 | `pages/login/ui/login-page-narrow.tsx` · `login-page-wide.tsx` | props 변화 없음 — 수정 불필요 |

**공개 API가 바뀌지 않는다.** `SocialLoginButtonProps`에 prop을 추가하지 않고 내부에서만
`isPending`을 쓴다. 호출부 2곳은 손대지 않는다.

## 4. 로딩 표현 판정 — `Button`의 기존 관용구를 따른다

`spec.md`가 착수 시 판정하라고 남긴 항목이다. **비활성만이 아니라 스피너까지 넣는다.**

- 시안에 로딩 상태 프레임이 없다. 그래서 **새 디자인을 만들지 않는다**
- 대신 `shared/ui/button`이 이미 확립한 표현을 그대로 쓴다 —
  레이블을 `invisible`로 자리만 남기고 그 위에 `Spinner`를 절대 배치, `aria-busy`로 알린다.
  이건 새 디자인이 아니라 **이 프로젝트에 있는 로딩 관용구의 재사용**이다
- 비활성만 걸면 브랜드색 버튼에 `disabled:` 스타일이 없어 **눌렀는지 안 눌렀는지 구분이 안 된다.**
  연타는 막히지만 "반응이 없다"는 인상이 남아 다른 버튼을 누르게 된다

`SocialLoginButton`은 `shared/ui/button`을 쓰지 않고 자체 cva를 갖는다(브랜드색 때문). 따라서
`Button`을 가져다 쓰는 게 아니라 **같은 표현을 이 컴포넌트 안에 만든다.**

## 5. 구현 체크리스트

레이어는 `features` 하나뿐이라 순서 제약이 없다.

- [ ] `[features]` `useOauthLogin()`에서 `isPending`을 꺼낸다
- [ ] `[features]` `disabled`에 `isPending`을 반영한다. 호출부가 넘긴 `disabled`도 함께 존중한다
- [ ] `[features]` `aria-busy` · `data-loading` 속성을 단다 (`component-convention.md` §6·§7)
- [ ] `[features]` `isPending`이면 레이블을 `invisible`로 두고 `Spinner`를 겹친다
- [ ] `[features]` cva에 `disabled:cursor-default`를 더한다. 색은 바꾸지 않는다
- [ ] `[test]` AC-1 — 3회 클릭해도 요청이 1건인지 검증한다

## 6. 리스크

| 리스크                                       | 영향                                  | 대응                                                                                              |
| -------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 성공 후에도 `isPending`이 안 풀린다          | 버튼이 계속 비활성                    | **의도된 동작이다.** 성공 시 `window.location.href`로 문서가 전환되므로 그 상태가 그대로 사라진다 |
| 실패 시 버튼이 다시 활성화되는데 안내가 없다 | 사용자가 이유를 모른 채 다시 누른다   | `FEAT-017`(로그인 실패 알림)의 범위다. 여기서 손대지 않는다                                       |
| provider가 서로 다른 버튼은 각각 눌린다      | 카카오 누른 뒤 구글을 누르면 요청 2건 | AC-1의 범위 밖. 마지막 이동이 이기므로 해롭지 않다. §8에 기록만 한다                              |
| 기존 테스트가 `disabled` 때문에 깨진다       | `userEvent.click`이 무시된다          | 첫 클릭 시점에는 아직 pending이 아니라 통과한다. 검증에서 확인                                    |

## 7. 동일성 · 검증 방법

동작을 **의도적으로 바꾸는** 작업이라 이전 작업 같은 동일성 확인은 하지 않는다.
대신 바꾸지 않기로 한 것을 고정한다.

| 방법        | 대상                                                         |
| ----------- | ------------------------------------------------------------ |
| 자동 테스트 | AC-1 — 3회 클릭 → 요청 1건                                   |
| 자동 테스트 | 기존 2건(레이블 렌더 · 1회 클릭 시 이동)이 그대로 통과하는지 |
| 수동 스모크 | 실제 클릭 → 스피너가 보이고 인가 페이지로 넘어가는지         |

## 8. 범위 밖으로 남기는 것

- **provider 간 상호 잠금** — 카카오를 누른 뒤 구글을 누르면 요청이 각각 나간다.
  막으려면 상태를 `pages/login`으로 올려야 해서 이번 범위를 넘는다. 마지막 이동이 이기므로
  사용자에게 해롭지 않다. 필요해지면 별도 항목으로 뽑는다
