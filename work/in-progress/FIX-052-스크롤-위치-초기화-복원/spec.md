---
id: 'FIX-052'
title: '화면 이동 시 스크롤 위치 초기화·복원'
type: 'fix'
screen: '-'
priority: 'medium'
created: '2026-10-08'
revised: '2026-10-08'
---

# FIX-052 — 화면 이동 시 스크롤 위치 초기화·복원

GitHub Issue #278

## 배경 · 목표

앱 셸 안에서 화면을 이동하면 **이전 화면의 스크롤 위치가 새 화면에 그대로 남는다.**
브라우저(MPA)와 Navigation API 의 기본 동작처럼 「새 이동은 맨 위, 뒤로·앞으로는 떠날 때 위치」가 되게 한다.

## 재현과 원인

**재현** — 좁은 화면에서 메인 아래쪽까지 스크롤 → 하단 탭 「학습」 → 학습 화면이 맨 위가 아니라 중간부터 보인다.

**원인** (설치본 `@tanstack/router-core` 1.171 `dist/esm/scroll-restoration.js` 로 확인)

1. 라우터는 `scrollRestoration` 옵션이 없어도 이동 뒤(`onRendered`) **`window` 를 맨 위로** 올린다 (`resetScroll` 기본 동작)
2. 그런데 이 앱은 `window` 가 아니라 **셸의 `div` 가 스크롤**한다 — `_app-shell/route.tsx` `h-dvh overflow-hidden` 안의 `h-full overflow-y-auto`. `settings/route.tsx` 도 같은 구조다
3. 셸은 화면 사이를 이동해도 다시 마운트되지 않아 그 `div` 의 `scrollTop` 이 유지된다
4. 그래서 화면마다 임시로 막아 왔다 — `pages/friends/ui/friends-page.tsx` 의 `closest('.overflow-y-auto')?.scrollTo({ top: 0 })`

## 범위

| 파일                                             | 변경                                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `app/router/router.ts`                           | `scrollRestoration: true` · `scrollToTopSelectors`                                        |
| `app/routes/_authenticated/_app-shell/route.tsx` | 스크롤 상자에 `data-scroll-restoration-id="app-shell"`                                    |
| `app/routes/_authenticated/settings/route.tsx`   | 스크롤 상자에 `data-scroll-restoration-id="settings"`                                     |
| `pages/friends/ui/friends-page.tsx`              | 탭 전환 때 맨 위로 올리던 임시 `useEffect` 제거 — 탭이 `?tab=` 이동이라 라우터가 대신한다 |

## Out of Scope

- **무한 스크롤 · 비동기 목록의 정밀 복원** — 리그 랭킹(`widgets/league-arena/ui/ranking-list.tsx`)은 목록 안쪽 상자가 스크롤하고 데이터를 이어 받는다. 뒤로가기 복원이 어긋나는 것이 확인되면 별도 작업으로 다룬다 (올리브영 글의 영역)
- **모달 안 스크롤** — `widgets/social/follow/ui/follow-modal.tsx` 의 탭 전환 스크롤 초기화는 라우트 이동이 아니라 모달 상태라 그대로 둔다
- **풀이 화면 `quiz-screen`** — `_focus` 라우트마다 다시 마운트돼 문제가 없다

## 용어 정의 (Ubiquitous Language)

| 용어          | 정의                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| 새 이동       | 링크 · `navigate()` 로 기록을 쌓거나 바꾸는 이동 (push · replace)           |
| 기록 이동     | 브라우저 뒤로 · 앞으로 (traverse)                                           |
| 스크롤 초기화 | 새 이동 뒤 스크롤 상자를 맨 위로                                            |
| 스크롤 복원   | 기록 이동 뒤 그 화면을 떠날 때의 위치로                                     |
| 스크롤 상자   | 실제로 `overflow-y-auto` 로 스크롤하는 요소. 이 앱에서는 `window` 가 아니다 |

---

## 설계 근거

| 결정                                                | 근거                                                                                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 라우터 기본 기능을 쓴다                             | TanStack Router 가 「새 이동은 위 · 기록 이동은 복원」을 이미 구현한다. 위치는 `sessionStorage`(`tsr-scroll-restoration-v1_3`)에 저장돼 새로고침 뒤에도 남는다 |
| `data-scroll-restoration-id` 로 상자를 이름 짓는다  | 이름이 없으면 라우터는 `div:nth-child(2) > …` 같은 DOM 경로로 기억해 레이아웃이 바뀌면 깨진다                                                                  |
| `scrollToTopSelectors` 에 상자를 등록한다           | 라우터가 기본으로 올리는 것은 `window` 뿐이다. 등록해야 새 이동 때 셸 상자도 맨 위로 간다                                                                      |
| 직접 `beforeunload` · `popstate` 로 구현하지 않는다 | `beforeunload` 는 SPA 이동에서 발생하지 않고, 시간 지연(`setTimeout`)에 기대는 복원은 데이터가 늦으면 실패한다                                                 |

참고 — 기록 이동의 복원 위치는 브라우저 기본값과 같다
([MDN History.scrollRestoration](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration),
[MDN NavigateEvent.intercept `scroll`](https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent/intercept),
[TanStack Router Scroll Restoration](https://tanstack.com/router/latest/docs/framework/react/guide/scroll-restoration),
[올리브영 테크블로그](https://oliveyoung.tech/2025-07-30/scroll-restoration/)).

### 확인 필요

1. **마이페이지 탭(`/my/summary` · `/learning` · `/league` · `/social`)** — 탭이 라우트 이동이라 바꾸면 맨 위(프로필 카드 위)로 간다. 탭 아래까지 내려 둔 상태에서 탭을 바꿀 때 위치를 유지할지(`resetScroll={false}`), 맨 위로 갈지
2. **설정 문의 내역 페이지 이동(`?page=`)** — 페이지를 넘기면 맨 위로 가는 것이 맞는지 (현재 판단: 맞다)

---

## 확정 명세 · 검증 기준

jsdom 은 실제로 스크롤하지 않아 **자동 테스트 대신 수동 확인**으로 검증한다. 라우터 옵션은 라이브러리 동작이라 다시 테스트하지 않는다.

- [ ] **AC-1** (수동) Given 메인을 아래까지 스크롤 · When 하단 탭 「학습」 · Then 학습 화면이 맨 위에서 시작한다
- [ ] **AC-2** (수동) Given 학습 화면을 스크롤해 둠 · When 유닛 상세로 갔다가 뒤로가기 · Then 학습 화면이 떠날 때 위치에 있다
- [ ] **AC-3** (수동) Given AC-2 상태에서 유닛 상세로 감 · When 새로고침 후 뒤로가기 · Then 학습 화면이 떠날 때 위치에 있다
- [ ] **AC-4** (수동) Given 친구 화면 팔로워 목록을 스크롤 · When 「팔로잉」 탭 · Then 맨 위에서 시작한다 (임시 `scrollTo` 제거 후에도)
- [ ] **AC-5** (수동) Given 설정 화면을 스크롤 · When 다른 설정 하위 화면으로 이동 · Then 맨 위에서 시작한다
- [ ] **AC-6** (수동) 넓은 화면에서도 AC-1 · AC-2 가 같다
- [ ] **AC-7** `pnpm lint` · `check-types` · `test` · `build` 통과

---

## Changelog

| 날짜       | 요약      | 사유                                      | 연관 항목 |
| ---------- | --------- | ----------------------------------------- | --------- |
| 2026-10-08 | 작업 생성 | 셸 스크롤 상자 때문에 이동 후 위치가 남음 | #278      |
