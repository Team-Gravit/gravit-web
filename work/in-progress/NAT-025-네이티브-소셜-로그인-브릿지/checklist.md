---
id: 'NAT-025'
validated: '2026-09-12'
mode: 'feature'
---

# NAT-025 검증 결과 — 1차 (브릿지 + web 파트)

> `ai-validate` 산출물. **생략 금지.**
> 실패 시 수정 후 재검증 **최대 3회**. 초과하면 보고하고 중단한다.
>
> 범위는 `plan.md` §0-0의 **1차**다 — Issue 1 전체 + Issue 2·3·4 web 파트. native SDK 파트(2차)는
> 확인 필요 2(자격 증명) 도착 후 같은 문서에 `---` 아래 회차를 누적한다.

## 1. 자동 검증

| #   | 검사            | 명령                                                            | 결과                                                                          |
| --- | --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                                     | ✅ 3/3 (web eslint+steiger · native `expo lint` · bridge-protocol eslint)     |
| 2   | 타입            | `pnpm check-types`                                              | ✅ 3/3                                                                        |
| 3   | 테스트          | `pnpm test`                                                     | ✅ bridge-protocol 12 · web 169 (29 파일). 이번 작업 신규 39건                |
| 4   | 빌드            | `pnpm build`                                                    | ✅ web `vite build` 20s                                                       |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>`                | ✅ 변경·신규 파일 전부 (아래 목록). 전체 `format:check`는 `REF-003` 기존 실패 |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음              | ✅ `rg "shared/api/generated" apps/web/src/pages apps/web/src/widgets` → 0건  |
| 7   | 스케치 잔재     | `rg "use-bridge\|webview-provider\|isIOSDevice\|apis/use-apis"` | ✅ 0건                                                                        |

포맷 검사 대상: `apps/native/app/index.tsx` · `apps/native/bridge/**` · `apps/native/package.json` ·
`apps/web/package.json` · `apps/web/src/shared/api/{index.ts, bridge/**, mocks/native-bridge.ts}` ·
`apps/web/src/features/auth-login/{index.ts, api/**, model/login-outcome*.ts, ui/social-login-button*.tsx}` ·
`apps/web/src/pages/login/ui/*` · `apps/web/src/pages/oauth-callback/ui/oauth-callback-page.tsx` ·
`packages/bridge-protocol/**` · `work/in-progress/NAT-025-*/`

### 자동 검증 중 실패했던 것 (수정 후 재검증, 3회 이내)

| #   | 실패                                                                                                         | 조치                                                                                                                              | 재검증 |
| --- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | :----: |
| 1   | web steiger `fsd/no-public-api-sidestep` ×3 — features가 `@/shared/api/bridge`를 import                      | `shared/api`에 세그먼트 배럴이 있어 하위 경로가 우회로 잡힌다. `@/shared/api`로 바꿈 (배럴 re-export는 이미 있었다)               |  1회   |
| 2   | native `expo lint` `react-hooks/refs` · `preserve-manual-memoization` — `useMemo` 안에서 `webViewRef` 클로저 | react-compiler 린트. 브릿지와 WebView 인스턴스를 **모듈 스코프**로 옮기고 콜백 ref로 받음. WebView가 이 화면 하나라 싱글턴이 맞다 |  1회   |
| 3   | `social-login-button.test` — `onLoginSuccess`가 mutation 콜백의 4개 인자로 호출됨                            | `onSuccess: (response) => onLoginSuccess?.(response)`로 감싸 prop 계약(`(response) => void`)만 노출                               |  1회   |

## 2. 요구사항 ↔ 구현 대조

> AC 원문은 `issues.md`. 1차 범위의 AC만 대조한다. 2차(native SDK) AC는 `—`.

### Issue 1 — 브릿지 왕복 (`APP_INFO`)

| AC    | 요구사항                                                          | 구현 위치                                                                                                                    |      상태      |
| ----- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | :------------: |
| AC-1  | UA `GravitNative/` → `isNativeApp()` true/false                   | `shared/api/bridge/native-environment.test.ts` (2) · `packages/bridge-protocol/src/envelope.test.ts` `isNativeUserAgent` (2) |       ✅       |
| AC-2  | `APP_INFO` 요청 봉투 + 같은 `id` 응답으로 resolve                 | `shared/api/bridge/request-native.test.ts` "APP_INFO 를 요청하면 …"                                                          |       ✅       |
| AC-3  | 50ms 타임아웃 → `TIMEOUT`, 늦은 응답 무시                         | 〃 "timeoutMs 안에 응답이 없으면 …"                                                                                          |       ✅       |
| AC-4  | 앱 밖 → `UNAVAILABLE` 즉시, `postMessage` 0회                     | 〃 "앱 환경이 아니면 UNAVAILABLE …"                                                                                          |       ✅       |
| AC-5  | 실패 봉투 → `code`·`message` 보존                                 | 〃 "실패 봉투를 받으면 …"                                                                                                    |       ✅       |
| AC-6  | 응답 순서 뒤바뀜 → `id`로 짝지음                                  | 〃 "두 요청의 응답이 뒤바뀐 순서로 …"                                                                                        |       ✅       |
| AC-7  | 깨진 JSON·봉투 아님·모르는 id → 무시 + `console.warn` 3회         | 〃 "깨진 JSON · 봉투 아님 · 모르는 id …"                                                                                     |       ✅       |
| AC-8  | `parseBridgeMessage` event 봉투 / 에러 리포트 → `null`            | `packages/bridge-protocol/src/envelope.test.ts` (8)                                                                          |       ✅       |
| AC-9  | `subscribeNativeEvent` 1회 호출 · 해제 후 미호출 · 다른 type 무시 | `shared/api/bridge/native-events.test.ts` (2)                                                                                |       ✅       |
| AC-10 | 수동 iOS — `APP_INFO` 왕복 · `NOPE` → `UNSUPPORTED`               | `apps/native/bridge/create-bridge.ts` `handleRequest` · `handlers/app-info.ts`                                               | 🔲 수동 미실행 |
| AC-11 | 수동 iOS — 에러 리포트 로그 유지, 브릿지 응답 없음                | `apps/native/app/index.tsx` `onUnhandled` → `console.log('[WebView] browser event')`                                         | 🔲 수동 미실행 |

### Issue 2 — 카카오 (web 파트)

| AC      | 요구사항                                                                  | 구현 위치                                                                                                                                         |      상태      |
| ------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| AC-1    | `mutateAsync('kakao')` → `?provider=kakao` · `{ idToken }` · `setSession` | `features/auth-login/api/use-native-login.test.tsx` "kakao 는 …"                                                                                  |       ✅       |
| AC-2    | 클릭 → `/onboarding` · `isOnboarded: true`면 `/main`                      | `pages/login/ui/login-page.test.tsx` "교환 응답이 isOnboarded: false/true 면 …" (2)                                                               |       ✅       |
| AC-3    | `CANCELLED` → 버튼 풀림 · 위치 `/` · 백엔드 0건                           | `features/auth-login/ui/social-login-button.test.tsx` "CANCELLED 로 실패하면 …" · `login-page.test.tsx` "CANCELLED 로 실패하면 라우터 위치는 / …" |       ✅       |
| AC-4    | `UNSUPPORTED` → 웹 경로 폴백 (`href` 대입)                                | `social-login-button.test.tsx` "UNSUPPORTED 로 실패하면 웹 경로로 폴백 …"                                                                         |       ✅       |
| AC-5    | `TIMEOUT` → 버튼 풀림 · 위치 `/` · 백엔드 0건                             | `social-login-button.test.tsx` "TIMEOUT 등 그 외 실패는 …"                                                                                        |       ✅       |
| AC-6    | 423 `USER_423` → `/restore?providerId=pid_9`                              | `login-page.test.tsx` "교환이 423 USER_423 이면 …" · `model/login-outcome.test.ts` (4)                                                            |       ✅       |
| AC-7    | 브라우저 → `postMessage` 0회 · `login-url` 1건                            | `social-login-button.test.tsx` "브라우저 환경이면 …" + 기존 3건 무수정                                                                            |       ✅       |
| AC-8    | `oauth-callback-page.test.tsx` 무수정 통과 (동작 보존)                    | `pages/oauth-callback/ui/oauth-callback-page.test.tsx` 7/7, 파일 diff 없음                                                                        |       ✅       |
| AC-9·10 | 수동 iOS 실기기·시뮬레이터 카카오                                         | native SDK — 2차                                                                                                                                  |       —        |
| AC-11   | 수동 iOS — Google 버튼 → `UNSUPPORTED` → `accounts.google.com` 폴백       | `apps/native/bridge/handlers/auth-login.ts` (1차: `UNSUPPORTED`) · 웹 폴백은 AC-4 자동 테스트                                                     | 🔲 수동 미실행 |

### Issue 3 — Google (web 파트)

| AC     | 요구사항                                                  | 구현 위치                                            | 상태 |
| ------ | --------------------------------------------------------- | ---------------------------------------------------- | :--: |
| AC-1   | `google` → `?provider=google` · `{ idToken: 'g_id_tok' }` | `use-native-login.test.tsx` "google 은 idToken 을 …" |  ✅  |
| AC-2~4 | 수동 iOS                                                  | native SDK — 2차                                     |  —   |

### Issue 4 — 네이버 (web 파트)

| AC     | 요구사항                                                                  | 구현 위치                                                                                 | 상태 |
| ------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | :--: |
| AC-1   | `naver` → `/oauth/android/naver` `{ accessToken }` · `/oauth/android` 0건 | `use-native-login.test.tsx` "naver 는 accessToken 을 …"                                   |  ✅  |
| AC-2   | `naver`에 `idToken`(계약 위반) → `NATIVE_ERROR` · 백엔드 0건              | `use-native-login.test.tsx` "naver 에 idToken 이 오면 …" · `api/exchange-native-token.ts` |  ✅  |
| AC-3~5 | 수동 iOS                                                                  | native SDK — 2차                                                                          |  —   |

### 경계 조건표(`spec.md` §경계 조건과 실패 동작) 대조

| 상황                        | 웹이 받는 것                        | 고정한 테스트                                                           |
| --------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| 앱 환경이 아님              | 브릿지 미호출                       | button "브라우저 환경이면 …"                                            |
| 네이티브가 요청 종류를 모름 | `UNSUPPORTED` → 폴백                | button "UNSUPPORTED 로 실패하면 …" · native `create-bridge` 미지원 분기 |
| SDK 화면 닫음               | `CANCELLED` → 잠금 해제             | button · login-page "CANCELLED …"                                       |
| SDK 실패                    | `NATIVE_ERROR` → 잠금 해제          | button "TIMEOUT 등 그 외 실패 …"(같은 분기) · use-native-login AC-2     |
| 응답 없음                   | `TIMEOUT`                           | request-native AC-3 · button AC-5                                       |
| Android 엔드포인트 4xx/5xx  | axios 에러, `USER_423` → `/restore` | login-page AC-6 · login-outcome (4)                                     |
| 같은 버튼 연타              | pending 잠금                        | button 기존 "3회 클릭해도 1회" 무수정 통과 · 두 mutation pending OR     |
| 응답 JSON 깨짐·모르는 id    | 무시 + 로그 → 결국 `TIMEOUT`        | request-native AC-7                                                     |

## 3. 이전 검증

`NAT-` 신규 기능 — 해당 없음. 단 **동작 보존 대상 1건**: 브라우저(앱 밖) 로그인 흐름.

| 항목                                    | 결과                                                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `social-login-button.test.tsx` 기존 3건 | ✅ 무수정 통과                                                                                            |
| `login-page.test.tsx` 기존 4건          | ✅ 무수정 통과 (라우터 더미 라우트 3개 추가는 새 케이스용, 기존 단언은 그대로)                            |
| `oauth-callback-page.test.tsx` 기존 7건 | ✅ 파일 diff 없음, 통과                                                                                   |
| `readWithdrawnProviderId` 본문          | ✅ 콜백 페이지 → `features/auth-login/model/login-outcome.ts` 로 이동, 본문 동일. 새 단위 테스트 4건 추가 |

## 4. 시안 대조 재확인

**해당 없음.** UI 변경이 없다 — 버튼의 시각 상태·문구·시안 프레임 그대로. `SocialLoginButton`에 추가된 것은
`onLoginSuccess`·`onLoginError` prop(동작)뿐이다.

## 5. 기준 문서 갱신

| 대상                             | 갱신 내용                                                                                                                                                | 상태 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | :--: |
| `docs/implementation-status.md`  | `ACC-01` 비고에 NAT-025 1차(앱 환경 브릿지 분기·`UNSUPPORTED` 폴백·SDK 로그인 2차 대기) · 갱신 이력 1줄                                                  |  ✅  |
| `docs/migration-status.md`       | 해당 없음 — legacy에 브릿지가 없다. 인증 세션 행은 `MIG-005` 소관                                                                                        |  —   |
| `spec.md` 확정 명세·검증 기준    | 1차 검증 완료 AC 목록과 이 문서 링크 · Changelog                                                                                                         |  ✅  |
| `docs/fe-implement-spec/acc-01/` | 갱신 보류 — 화면 명세는 시안 기준이고 앱 환경 분기는 화면 외형을 바꾸지 않는다. 2차(SDK 로그인) 완료 시 「앱 환경 동작」 절로 한 번에 추가               | 보류 |
| `.claude/rules/`                 | 보류 — "메시지 추가 = 계약 한 줄 + 핸들러 하나" · "web은 `shared/api/bridge`만 계약 패키지를 import" 규칙은 2차 완료 후 `bridge-convention.md` 승격 판단 | 보류 |

## 6. 남은 것 (2차로 넘어감)

- 🔲 **수동 iOS 3건** — Issue 1 AC-10·11, Issue 2 AC-11. dev client 빌드가 필요하다 (`expo run:ios`). 2차 실기기 검증과 함께 돌려도 되지만, **metro가 워크스페이스 `.ts` 심링크를 해석하는지**(plan §5 첫 리스크)는 2차 착수 전에 한 번 확인해 두는 편이 안전하다
- 🔲 확인 필요 2 (번들 ID · Kakao 네이티브 앱 키 · Google iOS/웹 클라이언트 ID · Naver 자격 증명) — 팀·백엔드 요청 중
- 🔲 확인 필요 5 (Sign in with Apple 백엔드 엔드포인트) — 범위 밖이지만 iOS 출시 차단 항목

## 중간에 막혔던 지점 — 스킬에 반영할 것

1. **`shared/api`처럼 세그먼트에 배럴이 있으면 하위 폴더 경로가 steiger에 걸린다.** `shared/ui/button`은 `shared/ui`에 배럴이 없어 통과하고, `shared/api/bridge`는 `shared/api/index.ts`가 있어 `no-public-api-sidestep`이다. `import-convention.md` §3의 "배럴까지만"이 이 경우 **세그먼트 배럴**을 뜻한다는 것을 한 줄 적어 두면 같은 실패를 안 한다 → `import-convention.md` 후보
2. **react-compiler 린트가 native에도 켜져 있다** (`experiments.reactCompiler: true` + `eslint-config-expo`). 렌더 안에서 ref를 캡처하는 클로저를 `useMemo`에 넣으면 `react-hooks/refs`에 걸린다. 화면이 하나뿐인 셸에서는 모듈 스코프 싱글턴이 답이었다 → `expo:*` 작업 시 참고. 규칙 파일에 넣을 정도는 아니다
3. **TanStack Query `mutate(vars, { onSuccess })`의 콜백은 인자가 4개다.** prop으로 그대로 넘기면 계약 밖 인자가 샌다. 항상 감싼다 → `api-convention.md` §4 근처 한 줄 후보
4. **`git mv`는 미추적 폴더에 실패한다.** `work/to-do → in-progress` 이동이 첫 커밋 전이면 그냥 `mv`다. `work-management.md` §5의 "git mv를 쓴다"에 예외를 적을 것
5. **Bash 도구에서 여러 heredoc을 `&&`로 이은 긴 스크립트가 파싱에 실패했다** (원인 미확인). 파일은 Write 도구로 하나씩 쓰는 편이 확실했다 — 하네스 메모

---

# 복원 기록 (2026-11-04)

> 최신 `develop` 위로 1차·2차 코드를 복원한 결과다. 새 기능 검증이 아니다.
> 이 문서의 이슈 번호는 이전 번호다. 이전 → 현재 대응은 `issues.md` 맨 위에 있다.

| 검사                   | 결과                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| `pnpm format:check`    | ✅ 통과. 단, `app.json` 중복 키 수정 전 실행. 수정 후 해당 파일 단독 재확인 ✅ |
| `pnpm lint`            | ✅ 통과 (steiger 포함)                                                         |
| `pnpm check-types`     | ✅ 3/3. `app.json` 수정 후 재실행                                              |
| `pnpm test`            | ✅ web 120 파일 693건 · bridge-protocol 12건                                   |
| `pnpm build`           | 🔲 미실행                                                                      |
| Expo dev build · Metro | 🔲 미실행. `@repo/bridge-protocol` 해석과 카카오 2.4.6의 Expo 57 호환 미확인   |
| 수동 iOS·Android       | 🔲 미실행. 위 1차 잔여와 2차 수동 AC 모두 남아 있다                            |

**§5 정정** — `docs/implementation-status.md`의 NAT-025 기록은 복원에서 제외해 현재 트리에 없다.
§5의 ✅는 복원 전 기준이다. 구현 범위가 확정되면 그때 현재 상태로 다시 적는다.

**§6 갱신** — 남은 항목은 `spec.md`의 확인 필요 1·2·5~8로 옮겼다.

---

# Issue 1 Android 빌드 기록 (2026-11-04)

> 아직 앱을 띄우지 못했다. AC-10 · AC-11 미실행.

| 확인                                 | 결과                                                                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| AC-12 키 없는 설정                   | ✅ 경고 출력 · 카카오 plugin 0개. `EAS_BUILD_PROFILE=production`은 `KAKAO_NATIVE_APP_KEY` 문구로 실패                             |
| 로컬 빌드 1회차 (`expo run:android`) | ❌ `:app:buildCMakeDebug` ninja `Stat(...)`. 16분. `react-native-safe-area-context` 오브젝트 경로 393자로 Windows 260자 제한 초과 |
| 로컬 빌드 2회차 (`subst X:`)         | ❌ `this and base files have different roots`. `X:`와 `C:` 경로가 섞여 codegen 실패. 연결 해제 · 생성물 삭제 완료                 |
| 환경                                 | `LongPathsEnabled=1`. SDK CMake 3.22.1의 ninja는 1.10.2. 설정이 켜져 있어도 이 ninja에서 실패했다                                 |

경로 안의 패키지 부분만 200자가 넘어, 저장소를 짧은 폴더로 옮기는 것만으로는 부족하다.

## EAS 개발 빌드

| 플랫폼  | 결과                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------- |
| Android | ✅ 빌드 성공 · 에뮬레이터 설치 성공. 앱 번들 로드와 AC-10 · 11은 메모리 부족으로 작업이 중단돼 미확인 |
| iOS 1차 | ❌ `pnpm install`에서 `sharp` 소스 빌드 실패                                                          |
| iOS 2차 | ✅ `eas.json`에 `SHARP_IGNORE_GLOBAL_LIBVIPS=1` 추가 후 빌드 성공. 실기기 설치 · AC 미확인            |

빌드 성공은 네이티브 컴파일과 서명까지의 확인이다. Metro 해석과 브릿지 동작의 근거가 아니다.

아이폰 개발 빌드에서 Metro 연결과 로그인 화면 표시는 사용자가 확인했다 (2026-11-05). 브릿지 응답 내용(AC-10)은 아직 직접 보지 못했다.

# Issue 2~5 코드 기록 (2026-11-05)

> 코드와 자동 검증만 끝났다. 새 네이티브 패키지가 들어 있어 **새 빌드 전에는 앱에서 동작하지 않는다.** 수동 AC는 전부 미실행.

| 항목                      | 결과                                                                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issue 2 AC-1              | ✅ `bridge-origin.test.ts`. 계획의 `URL` 대신 직접 파싱. 계약 패키지에 `URL` 타입이 없다                                                                         |
| Issue 2 AC-3              | ✅ `production` 프로필의 ATS · cleartext 해제 확인, 개발 prebuild의 cleartext 켜짐 확인                                                                          |
| Issue 3 AC-4              | ✅ `social-login-button.test.tsx`. `UNSUPPORTED` 토스트, 웹 폴백 제거                                                                                            |
| 라이브러리                | 카카오 3.2.0 · Google 17.0.0 · 네이버 5.0.1 설치. 소스 확인: 카카오 `initializeKakaoSDK` 비동기, 취소 코드 유지 · 네이버 `isCancel` · Google `type: 'cancelled'` |
| Android prebuild (임시값) | ✅ 카카오 `AuthCodeHandlerActivity` · scheme 등록. 처음에는 옵션이 빠져 있었다                                                                                   |
| iOS prebuild              | 🔲 Windows에서 생성되지 않아 미확인. Expo 57 템플릿에 네이버 플러그인이 찾는 문구가 있는 것만 확인. 다음 EAS iOS 빌드에서 확인                                   |
| `pnpm verify`             | ✅ 웹 698건 · bridge-protocol 24건 · 빌드. 그 뒤 `NAVER_APP_NAME` 제거만 추가로 수정                                                                             |

## iOS 실기기 확인 (2026-11-05, 사용자 확인, 개발 빌드)

| 로그인 | 결과                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------- |
| 네이버 | ✅ 온보딩까지 이동                                                                                      |
| Google | ✅ 성공. 처음에는 `invalid_audience`. iOS 클라이언트를 서버 웹 클라이언트와 같은 프로젝트에 만들어 해결 |
| 카카오 | ✅ 성공. 처음에는 인증 세션 오류. 콘솔에 iOS 번들 ID를 등록한 뒤 재빌드 없이 해결                       |

확인하지 못한 것: 취소 동작, 카카오톡 · 네이버 앱 전환 여부, iOS · Android 같은 사용자 여부, Android 전체, 운영 프로필 빌드.

해결한 코드 결함: `crypto.randomUUID`가 `http://{LAN IP}`에 없어 브릿지 요청 전에 실패했다. `request-native.test.ts`로 고정했다.

`.env`의 카카오 키는 전달 메모에 REST API 키로 적혀 있지만 현재 값으로 로그인이 성공했다. 메모가 틀렸을 수 있다. 콘솔에서 키 종류를 확인한다.

EAS 개발 빌드 서명값: SHA-1 `A1:FA:92:2B:89:4F:5A:9B:32:63:CC:3A:AF:FA:68:C8:60:EE:03:9B` · 카카오 키 해시 `ofqSK4lPWpsyY8w6r/poyGDuA5s=`

## 중간에 막혔던 지점

- Windows 로컬 Android 빌드는 첫 C++ 단계에서 경로 길이로 막힌다. 빌드를 시작하기 전에 ninja 버전과 경로 길이를 먼저 본다
- `subst` 임시 드라이브는 이 프로젝트에서 쓸 수 없다
- Bash 도구의 heredoc은 한글 · 따옴표가 많은 긴 입력에서 실패했다. 파일 쓰기 도구를 쓴다

---

# AC 대조 (2026-11-05)

> 현재 `issues.md` 번호 기준이다. ☑ 확인됨 · ◐ 일부만 · ☐ 미확인 · ⊘ 해당 없음.
> 자동 테스트는 `apps/web`과 `packages/bridge-protocol`의 vitest다. 앱(`apps/native`)에는 테스트 러너가 없어 수동으로 확인한다.

## 자동 검증 요약

| 검사                              | 결과                                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 포맷 · 린트 · 타입 · FSD(steiger) | 통과                                                                                                                                     |
| `pnpm test`                       | web 699개 · bridge-protocol 24개 통과. `problem-card.test.tsx`가 `beforeAll` 10초 제한으로 간헐 실패(이번 작업과 무관, 단독 실행은 통과) |
| `pnpm build`                      | 통과                                                                                                                                     |
| 커밋 단위 확인                    | 섞인 파일은 중간 버전을 만들어 **HEAD + 그 커밋**만 있는 상태로 타입 · 린트 · 테스트 · 앱 설정을 확인했다                                |

## Issue 1 — 브릿지 왕복

| AC     | 상태 | 근거                                                                                          |
| ------ | :--: | --------------------------------------------------------------------------------------------- |
| AC-1   |  ☑  | `native-environment.test.ts` · `envelope.test.ts`(`isNativeUserAgent`)                        |
| AC-2~7 |  ☑  | `request-native.test.ts`. `crypto.randomUUID`가 없는 HTTP 환경 케이스 포함                    |
| AC-8   |  ☑  | `envelope.test.ts`                                                                            |
| AC-9   |  ☑  | `native-events.test.ts`. `window`와 `document` 대상 이벤트, 버블링 중복 수신 케이스 포함      |
| AC-10  |  ☐   | `APP_INFO` · `NOPE` 요청을 직접 보내 보지 않았다. `AUTH_LOGIN` 왕복은 iOS 실기기에서 동작했다 |
| AC-11  |  ◐   | iOS: Metro 로그에 `[WebView] browser event`(`DOMContentLoaded`)가 찍힌다. Android 미실행      |
| AC-12  |  ☑  | `expo config`: 키가 없으면 경고 후 플러그인 제외, `production`은 키 이름과 함께 실패          |

## Issue 2 — 요청 주소 확인 · 운영 HTTP 차단

| AC   | 상태 | 근거                                                                                                                                                |
| ---- | :--: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 |  ☑  | `bridge-origin.test.ts` (비슷한 호스트 · `http`/`https` 차이 · `호스트@evil` · 잘못된 주소 거절)                                                    |
| AC-2 |  ☐   | 외부 페이지에서 `AUTH_LOGIN`을 보내 응답이 없는지 직접 확인하지 않았다                                                                              |
| AC-3 |  ☑  | `expo config` 프로필별: 로컬·`development`는 HTTP 허용, `preview`·`production`은 iOS 설정 없음 · Android `false`. Android 프로젝트 생성 결과도 같다 |
| AC-4 |  ☐   | 운영 프로필로 실제 빌드해 HTTPS로 동작하는지 확인하지 않았다                                                                                        |

## Issue 3 — 카카오

| AC    | 상태 | 근거                                                                                                       |
| ----- | :--: | ---------------------------------------------------------------------------------------------------------- |
| AC-1  |  ☑  | `use-native-login.test.tsx`                                                                                |
| AC-2  |  ☑  | `login-page.test.tsx` (`/onboarding` · `/main`)                                                            |
| AC-3  |  ☑  | `social-login-button.test.tsx` · `login-page.test.tsx` (`CANCELLED`)                                       |
| AC-4  |  ☑  | `social-login-button.test.tsx` (`UNSUPPORTED` 토스트 1회, 웹 인가 URL 조회 0건)                            |
| AC-5  |  ☑  | `social-login-button.test.tsx` · `login-page.test.tsx` (`TIMEOUT`)                                         |
| AC-6  |  ☑  | `login-page.test.tsx` (`USER_423` → `/restore`)                                                            |
| AC-7  |  ☑  | `social-login-button.test.tsx` 기존 케이스                                                                 |
| AC-8  |  ☑  | `oauth-callback-page.test.tsx` 기존 케이스                                                                 |
| AC-9  |  ◐   | iOS 실기기에서 카카오 로그인 성공. 카카오톡으로 전환됐는지, 복귀, 뒤로 가기 후 버튼 풀림은 확인하지 않았다 |
| AC-10 |  ☐   | 카카오톡 미설치 상태의 계정 로그인 시트를 확인하지 않았다                                                  |
| AC-11 |  ⊘   | Google이 Issue 4에서 구현돼 이 AC의 전제(Google이 `UNSUPPORTED`)가 사라졌다                                |
| AC-12 |  ☐   | 같은 계정으로 iOS와 Android의 `userId`가 같은지 확인하지 않았다                                            |

## Issue 4 — Google

| AC   | 상태 | 근거                                                                                                                                |
| ---- | :--: | ----------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 |  ☑  | `use-native-login.test.tsx`                                                                                                         |
| AC-2 |  ◐   | iOS 실기기에서 로그인 성공. 시트 닫기와 Android 미확인                                                                              |
| AC-3 |  ◐   | iOS 토큰을 서버가 받아 줘서 `aud`는 통과한 것으로 본다. 직접 디코딩은 하지 않았고 Android 미확인                                    |
| AC-4 |  ◐   | 실제 설정 오류(`invalid_audience`)에서 `NATIVE_ERROR`와 실패 토스트를 확인했다. AC가 정한 "잘못된 클라이언트 ID" 재현은 하지 않았다 |
| AC-5 |  ☐   | 같은 계정 iOS·Android `userId` 비교 미실행                                                                                          |

## Issue 5 — 네이버

| AC   | 상태 | 근거                                                                         |
| ---- | :--: | ---------------------------------------------------------------------------- |
| AC-1 |  ☑  | `use-native-login.test.tsx`                                                  |
| AC-2 |  ☑  | `use-native-login.test.tsx` (`idToken`이 오면 `NATIVE_ERROR`, 서버 호출 0건) |
| AC-3 |  ◐   | iOS 실기기에서 로그인 성공. 네이버 앱 전환 여부와 취소는 확인하지 않았다     |
| AC-4 |  ☐   | 네이버 앱 미설치 상태 미확인                                                 |
| AC-5 |  ☐   | 시크릿을 틀리게 한 오류 재현 미실행                                          |
| AC-6 |  ☐   | 같은 계정 iOS·Android `userId` 비교 미실행                                   |

Issue 6~8은 서버 답변과 Android 방식 결정을 기다려 착수하지 않았다.

## 중간에 막혔던 지점 — 규칙이나 스킬에 반영할 것

1. **개발 중 앱이 여는 `http://{LAN IP}`는 보안 컨텍스트가 아니다.** `crypto.randomUUID` 같은 보안 컨텍스트 전용 API가 없어서 요청이 나가기 전에 실패했고, 화면에는 일반 실패 토스트만 보였다. 웹 코드에서 이런 API를 쓸 때는 개발 서버 주소에서도 동작하는지 먼저 본다.
2. **iOS WebView는 Windows에서 디버깅할 수 없다.** 실패 사유를 볼 곳이 Metro 로그뿐이라, 앱 쪽 브릿지가 개발 빌드에서만 실패 코드와 메시지를 `console.warn`으로 남기게 했다. 토큰은 남기지 않는다.
3. **Windows 로컬 Android 빌드는 C++ 경로 길이(260자)로 막힌다.** `subst`도 `different roots` 오류로 안 된다. EAS 빌드로 대체했다.
4. **EAS 빌드 서버에서 `sharp`가 소스 빌드로 넘어가 `pnpm install`이 실패했다.** `SHARP_IGNORE_GLOBAL_LIBVIPS=1`로 해결했다.
5. **콘솔 설정은 코드로 보이지 않는다.** Google 클라이언트가 서버 웹 클라이언트와 다른 프로젝트에 있으면 `invalid_audience`, 카카오에 iOS 번들 ID가 없으면 인증 세션 오류가 났다. 로그인이 안 될 때는 코드보다 콘솔 등록을 먼저 확인한다.
6. **Metro를 저장소 루트에서 켜면** Expo가 시작 파일을 못 찾고 루트에 `.expo/`와 `tsconfig.json`을 만든다. `apps/native`에서 켠다.
7. **파일 감시(`Failed to start watch mode`)가 실패하면** `CI=1`로 감시를 끄고 켠다. 이때는 코드를 고쳐도 자동 반영되지 않는다.
8. `pnpm verify`에서 `problem-card.test.tsx`가 `beforeAll` 10초 제한으로 간헐 실패한다. 별도 작업으로 다뤄야 한다.

---

# Apple 로그인 검증 (2026-11-06)

## 자동 검증

| 검사                                                 | 결과                                                                                         |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 타입 · 린트 · steiger · prettier                     | 변경 파일 기준 통과                                                                          |
| `vitest` (`auth-login` · `login` · `oauth-callback`) | 62건 통과                                                                                    |
| `pnpm verify` (구현 직후)                            | 테스트 단계에서 `problem-card.test.tsx` 간헐 시간 초과 1건 (단독 통과, 무관). 빌드 별도 통과 |
| rebase 후 `pnpm verify`                              | 아직 실행하지 않았다. PR 전에 실행한다                                                       |

## AC 대조

| AC             | 상태 | 근거                                                                                           |
| -------------- | :--: | ---------------------------------------------------------------------------------------------- |
| Issue 6 AC-1   |  ☑  | `login-page.test.tsx`                                                                          |
| Issue 6 AC-2~4 |  ☑  | `social-login-button.test.tsx` · `request-apple-web-login.test.ts`. SDK를 가짜로 대체한 결과다 |
| Issue 6 AC-5   |  ☐   | dev 배포 후 확인. SDK 오류 이름(`popup_closed_by_user` 등)도 실제로 확인되지 않았다            |
| Issue 7 AC-1~2 |  ☑  | `use-native-login.test.tsx`                                                                    |
| Issue 7 AC-3   |  ◐   | iOS 개발 빌드 실기기에서 로그인 성공 (사용자 확인). 이동한 라우트는 기록하지 않았다            |
| Issue 7 AC-4   |  ☐   | 시트 닫기 결과 기록 없음                                                                       |
| Issue 7 AC-5   |  ☐   | 탈퇴 시 Apple 토큰 철회를 서버에 확인하지 않았다. 앱 심사 요구사항일 수 있다                   |

## 수동 확인 기록

- 시트 성공 뒤 실패 토스트: 웹 터미널에 `[api-proxy] POST /api/v1/oauth/ios/apple → 400`이 4회, Metro에 브릿지 실패 로그 없음. 앱 · 웹은 코드를 전달했고 서버가 거절한 것으로 좁혔다
- 그 뒤 앱 수정 없이 성공했다. 서버의 `client_id` 설정을 의심했지만 실제 변경 내용은 확인하지 못했다
- 시안 대조: 좁은 화면 로고 크기를 `12898:23111`에 맞췄다. Apple은 시안이 없다

## 중간에 막혔던 지점

1. **Apple 코드는 발급받은 `client_id`로만 교환된다.** 앱은 번들 ID, 웹은 Services ID다. 서버 설정이 어긋나면 시트는 성공하고 서버 교환만 실패해 앱에서는 일반 실패 토스트만 보인다. 프록시 로그의 상태 코드로 먼저 구분한다
2. **`curl`로 서버를 확인할 때 LAN `Origin` 헤더를 넣으면 403이 난다.** 개발 프록시는 `Origin`을 지우므로 실제 앱과 다르다
3. **Windows에서는 `expo prebuild -p ios`가 건너뛰어진다.** 생성될 iOS 프로젝트는 EAS 빌드에서야 확인된다
