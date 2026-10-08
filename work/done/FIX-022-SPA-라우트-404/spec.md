---
id: 'FIX-022'
title: 'SPA 딥링크가 404를 내는 문제 (vercel.json 누락)'
type: 'fix'
screen: '-'
priority: 'high'
created: '2026-09-10'
revised: '2026-09-10'
---

# FIX-022 — SPA 딥링크가 404를 내는 문제 (vercel.json 누락)

## 배경 · 목표

배포된 `apps/web`에서 **루트(`/`)가 아닌 경로로 직접 들어오면 Vercel이 404를 낸다.**
소셜 로그인이 끝나지 않는다.

## 재현

1. `dev.gravit.inuappcenter.kr`에서 「네이버로 시작하기」를 누른다
2. 네이버 인가를 마치면 서버가 콜백으로 리다이렉트한다
3. `https://dev.gravit.inuappcenter.kr/login/oauth2/code/naver?code=...&state=null`

```
404: NOT_FOUND
Code: NOT_FOUND
ID: icn1:icn1::gr7kj-1789029508126-1dc593fc877d
```

**같은 증상이 나는 다른 경로** — `/terms` · `/privacy`에서 새로고침, 주소창 직접 입력,
북마크 진입. 화면 안에서 클릭으로 이동하는 것은 정상이다(클라이언트 라우팅).

## 원인

`apps/web`은 SPA다. 빌드 산출물은 `index.html`과 에셋뿐이고 `/login/oauth2/code/naver`라는
파일이 존재하지 않는다. **브라우저가 그 경로를 서버에 직접 요청하면** Vercel은 매칭되는
정적 파일이 없어 404를 반환한다. TanStack Router는 `index.html`이 로드된 **뒤에야** 동작한다.

OAuth 콜백은 인가 서버가 보내는 **전체 페이지 이동**이라 이 경우에 정확히 걸린다.

### 이전 때 빠뜨린 설정이다

```jsonc
// apps/legacy-web/vercel.json — 존재한다
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

`apps/web`에는 **이 파일이 없다.** legacy → apps/web 이전이 소스 코드만 옮기고
**배포 설정을 옮기지 않았다.** MIG 작업들이 화면과 로직만 다뤘고 어느 작업도
`vercel.json`을 범위에 넣지 않았다.

Vercel의 Vite 프리셋은 SPA fallback을 자동으로 넣어 주지만, 이 프로젝트는 빌드 로그에
`Detected Turbo. Adjusting default settings...`가 찍힌다. 프리셋이 Vite로 잡히지 않아
자동 fallback이 적용되지 않는다.

## 범위

- `apps/web/vercel.json` 신규 — legacy와 **동일한 내용**

## Out of Scope

- **`destination` 값 변경** — legacy의 `"/"` 를 그대로 쓴다. `"/index.html"` 도 동작하지만
  legacy 설정이 같은 Vercel 계정에서 실제로 검증된 값이다. 검증할 수 없는 차이를 만들지 않는다
- **`state=null`** — 콜백 URL의 `state` 가 문자열 `"null"` 이다. 인가 URL을 서버가 만들므로
  서버 쪽 문제이고, 우리 콜백은 `state` 를 읽지 않아 이번 404와 무관하다. 별도 항목 후보
- **`apps/legacy-web/vercel.json` 정리** — legacy 폐기 시점에 함께 다룬다

## 확인 필요

- **로컬에서 검증할 수 없다.** `vite dev` 서버는 자체 SPA fallback이 있어 원래 404가 안 난다.
  PR 프리뷰 URL에서 `/terms` 직접 진입으로 확인해야 한다
- **Vercel Root Directory가 `apps/web`이라고 가정했다.** 빌드 로그의 install 출력이 `../..`
  기준이라 그렇게 판단했다. 아니라면 파일 위치를 옮겨야 한다

## 확정 명세 · 검증 기준

- [ ] **AC-1** (프리뷰에서 확인)
      Given 배포된 앱
      When `/terms` 를 주소창에 직접 입력해 진입한다
      Then 404 없이 이용약관 화면이 렌더된다

- [ ] **AC-2** (프리뷰에서 확인)
      Given 배포된 앱
      When 소셜 로그인을 끝까지 진행한다
      Then 콜백 경로에서 404가 나지 않고 로그인이 완료된다

- [ ] **AC-3**
      Given `apps/web/vercel.json`
      When 내용을 확인한다
      Then `apps/legacy-web/vercel.json` 과 동일하다

## Changelog

| 날짜       | 요약      | 사유                                                    | 연관 항목       |
| ---------- | --------- | ------------------------------------------------------- | --------------- |
| 2026-09-10 | 작업 등록 | 실제 로그인 시도에서 콜백 404 발생. 이전 때 누락된 설정 | MIG-005·MIG-018 |
