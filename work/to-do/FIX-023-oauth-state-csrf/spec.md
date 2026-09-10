---
id: 'FIX-023'
title: 'OAuth state 검증이 없다 (CSRF)'
type: 'fix'
screen: 'O.1'
priority: 'medium'
created: '2026-09-10'
revised: '2026-09-10'
---

# FIX-023 — OAuth state 검증이 없다 (CSRF)

> **대부분 백엔드 작업이다.** 프론트는 값을 전달만 한다. 착수 전에 백엔드와 합의가 필요하다.

## 배경

`FIX-022`(콜백 404)를 확인하다 발견했다. 인가 서버가 돌려보내는 콜백 URL에
`state`가 문자열 `"null"`로 들어온다.

```
https://dev.gravit.inuappcenter.kr/login/oauth2/code/naver?code=a0jinYSZotL2GALJdg&state=null
```

`state`는 **로그인을 시작한 브라우저와 돌아온 브라우저가 같은지** 확인하는 일회용 난수다.
지금은 만들지도, 검증하지도 않는다.

## 무엇을 막는 값인가

**Login CSRF.** 공격자가 자기 계정으로 인가 코드를 받아 두고, 그 코드가 든 콜백 URL을
피해자에게 클릭시킨다. 피해자 브라우저가 그 코드를 교환하면 **피해자가 공격자 계정으로
로그인된다.**

피해자 계정이 털리는 게 아니라 **피해자의 이후 활동이 공격자 계정에 쌓인다.** 공격자는
나중에 자기 계정에서 그걸 전부 본다.

`state`가 있으면 이 단계에서 막힌다 — 공격자가 만든 값은 피해자 브라우저에 대해 발급된
값이 아니므로 검증에서 걸린다.

## 현재 흐름과 책임 소재

```
[FE]  GET /api/v1/oauth/login-url/{provider}?dest=
        ↓
[BE]  인가 URL 을 통째로 만들어 반환           ← state 생성 위치
        ↓
[FE]  window.location.href = loginUrl          ← 이동만 한다
        ↓
      provider 로그인
        ↓
      /login/oauth2/code/{provider}?code=&state=null
        ↓
[FE]  code 만 읽어 서버로 전달
        ↓
[BE]  POST /api/v1/oauth/login/{provider}      ← state 검증 위치
```

**인가 URL을 서버가 만든다.** 만든 쪽이 검증도 해야 하므로 `state`는 서버 소유다.
프론트가 임의로 값을 만들어도 서버가 만든 URL에는 들어가지 않는다.

## 범위

| 주체       | 할 일                                                                                |
| ---------- | ------------------------------------------------------------------------------------ |
| **백엔드** | ① 인가 URL 생성 시 암호학적 난수 `state` 생성 · 저장(짧은 만료 · 1회용) · URL에 포함 |
|            | ② 코드 교환 시 전달받은 `state`와 저장값 비교. 불일치·만료·재사용은 거절             |
|            | ③ OpenAPI 명세에 `state` 추가                                                        |
| **프론트** | ④ `app/routes/login.oauth2.code.$provider.tsx` — `validateSearch`에 `state` 추가     |
|            | ⑤ `features/auth-login/api/use-oauth-callback.ts` — 교환 요청에 `state` 포함         |
|            | ⑥ `pnpm --filter @repo/web generate:api` 로 타입 재생성                              |

**③이 끝나기 전에는 ④~⑥을 할 수 없다.** 요청 타입을 orval이 명세에서 생성한다
(`api-convention.md`).

## Out of Scope

- **인증 흐름 전체를 서버 리다이렉트 방식으로 바꾸는 것** — 더 큰 구조 변경이다
- **`dest` 파라미터 재설계** — 별개 관심사다

## 확인 필요

1. **백엔드가 `state`를 어디에 저장할지** — 서버 세션 · 캐시 · 서명 쿠키 중 무엇인지에 따라
   프론트가 할 일이 달라질 수 있다(쿠키면 프론트가 전달할 필요가 없을 수도 있다)
2. **만료 시간과 1회용 여부**
3. **네이티브 WebView에서도 같은 방식이 동작하는지** — `MIG-005` Issue 5(네이티브 세션 계약)와
   겹칠 수 있다

## 확정 명세 · 검증 기준

명세는 백엔드와 합의한 뒤 확정한다. 방향만 적는다.

- [ ] 인가 URL의 `state`가 요청마다 다른 난수다 (`null`이 아니다)
- [ ] 저장된 값과 다른 `state`로 코드 교환을 시도하면 거절된다
- [ ] 같은 `state`를 두 번 쓰면 두 번째는 거절된다

## 심각도 판단

기존 사용자 계정이 탈취되지는 않고, 피해자가 링크를 클릭해야 성립한다. 학습 서비스라
금전 피해도 없다. **다만 OAuth 구현의 표준 요구사항이고 provider 문서도 명시한다.**
출시 전에 처리한다.

## Changelog

| 날짜       | 요약      | 사유                                             | 연관 항목 |
| ---------- | --------- | ------------------------------------------------ | --------- |
| 2026-09-10 | 작업 등록 | `FIX-022` 확인 중 콜백 URL에서 `state=null` 발견 | `FIX-022` |
