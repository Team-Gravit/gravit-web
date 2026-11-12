---
id: 'FEAT-017'
planned: '2026-11-04'
mode: 'feature'
---

# FEAT-017 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.**

## 0. 판정

`FEAT-` — 로그인 실패 안내라는 사용자 동작을 새로 만든다. 작아서 실행 이슈는 하나다. AC는 `spec.md`가 정본이다.

### 선행 조건

`NAT-025`의 복원 코드가 같은 파일을 수정 중이고, 앱 경로 AC가 브릿지 코드를 쓴다. 그래서 `develop`에서 따로 시작하지 않는다.

- `feat/native-social-login` 브랜치의 현재 작업 위에서 구현한다
- PR은 `NAT-025` Issue 1 다음에 올린다
- 커밋할 때 `NAT-025` 파일과 섞지 않는다

## 1. 영향 분석

| 구분 | 파일                                                                               |
| ---- | ---------------------------------------------------------------------------------- |
| 신규 | 없음                                                                               |
| 수정 | `features/auth-login/model/login-outcome.ts` · `features/auth-login/index.ts`      |
| 수정 | `features/auth-login/ui/social-login-button.tsx` · `social-login-button.test.tsx`  |
| 수정 | `pages/login/ui/login-page.tsx` · `login-page.test.tsx`                            |
| 수정 | `pages/oauth-callback/ui/oauth-callback-page.tsx` · `oauth-callback-page.test.tsx` |
| 수정 | `docs/fe-implement-spec/o-1/o-1.md` (O.1-F07)                                      |

orval 재생성 · 라우트 트리 재생성 · 새 의존성 없음. `<Toaster />`는 `main.tsx`에 이미 있다.

의존 방향: `pages` → `features/auth-login`(문구 상수) · `shared/ui/toast`. 모두 하향이다.

## 2. 구현 계획

- [x] `[features]` `login-outcome.ts`에 `LOGIN_FAILED_MESSAGE` 추가, 배럴 export
- [x] `[features]` `social-login-button.tsx` — 브라우저 경로의 `startOauthLogin`에 `onError`를 달아 `onLoginError`로 넘긴다. prop 주석을 "앱 환경"에서 "로그인 실패 전체"로 고친다. `CANCELLED` · `UNSUPPORTED`는 지금처럼 넘기지 않는다
- [x] `[features]` 버튼 테스트 — 브라우저 인가 주소 실패 시 `onLoginError` 1회 · 버튼 풀림
- [x] `[pages]` `login-page.tsx` `handleLoginError` — `USER_423`이면 이동하고 끝, 그 외 `toast(LOGIN_FAILED_MESSAGE)`
- [x] `[pages]` `oauth-callback-page.tsx` `onError` — `USER_423`이 아니면 토스트 후 `/`로 이동. `code` 없음은 그대로
- [x] `[pages]` `login-page.test.tsx` — AC-1 · AC-5~9
- [x] `[pages]` `oauth-callback-page.test.tsx` — AC-2~4
- [x] `[docs]` O.1-F07 갱신 · `spec.md` Changelog · `checklist.md`

## 3. 리스크

| 리스크                                             | 영향                 | 대응                                                                        |
| -------------------------------------------------- | -------------------- | --------------------------------------------------------------------------- |
| 콜백에서 토스트 뒤 `/`로 이동하며 토스트가 사라짐  | 안내를 못 봄         | 스토어가 전역이고 `Toaster`가 라우터 밖이라 유지될 것으로 본다. AC-2로 확인 |
| 한 번의 실패에 토스트가 두 번                      | 중복 안내            | AC마다 1회를 단언한다                                                       |
| `NAT-025` Issue 3의 `UNSUPPORTED` 변경과 같은 파일 | 충돌 · 잘못된 토스트 | 공통 문구는 `onLoginError`에서만 띄운다. `UNSUPPORTED`는 거기로 오지 않는다 |
| 토스트 위치가 로그인 화면 요소와 겹침              | 가독성               | 기본 `bottom`을 쓰고 좁은 화면 · 넓은 화면을 브라우저에서 눈으로 확인한다   |

## 4. 검증

| 대상          | 방법                                                                              |
| ------------- | --------------------------------------------------------------------------------- |
| AC-1~9        | 자동. 토스트 호출 횟수를 확인하고, 콜백은 `<Toaster />`로 이동 뒤 표시도 확인한다 |
| 브라우저 표시 | MSW 또는 차단 응답으로 좁은 화면 · 넓은 화면 확인                                 |
| 앱 표시       | 실기기 빌드 때 `NAT-025` Issue 3 수동 검증에서 함께 확인                          |
| 전체          | `pnpm verify`                                                                     |

## 5. 완료 후

- [x] `docs/implementation-status.md` 갱신
- [ ] O.3-F10이 가리키는 `FEAT-017`을 새 항목으로 옮길지 사용자에게 확인
- [ ] 폴더를 `work/done/`으로 이동
