---
id: 'NAT-011'
title: '앱 스플래시 화면(O.0) 구현 계획'
created: '2026-09-08'
approved: '2026-09-08 (구현 중 ADR-6으로 구성 변경)'
---

# NAT-011 구현 계획

`spec.md`(ADR-1~6) · `issues.md`(재정의된 AC)를 전제로 한다. **AC 정본은 `issues.md`다.**

> ⚠️ **2026-09-08 — 계획과 구현이 갈라졌다.** 구현 단계에서 JS 오버레이를 폐기하고 정적
> 스플래시 하나로 끝내는 방식(ADR-6)으로 바꿨다. 아래 §2·§3·§4·§5를 실제 결과로 다시 적었다.
> 폐기된 계획의 근거는 `spec.md`의 ADR-1·3·4·5(폐기 표시)에 그대로 남아 있다.

## 0. 작업 종류 판정

**`NAT-`** — `apps/native`의 신규 기능. 기존 ID를 그대로 쓴다.

선행 조건 확인:

| 항목                    | 상태                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| `feature-planner` 3단계 | ✅ 완료 — `spec.md` 1·2단계 + `issues.md` 이슈 분해                  |
| `issue-reviewer`        | ✅ 완료 — 검토 결과가 ADR-5로 반영됨 (Changelog 2026-09-05)          |
| `refactor-planner` 필요 | ❌ 불필요 — 이미 이슈 2개로 분해됐고 `apps/native`는 슬라이스가 없다 |
| 사용자 판정             | ✅ 구현 중 ADR-6으로 구성 변경 확정 (2026-09-08)                     |

## 1. 착수 판단

`NAT-`는 `refactor-checklist.md` 필수 게이트 대상이 아니지만, 핵심 항목만 확인한다.

| 질문                | 답                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| 목표·비목표         | 앱 실행부터 웹 첫 화면까지 흰 화면을 없앤다. 오류 화면·인증 게이트·앱 아이콘은 만들지 않는다                |
| 검증 방법           | AC 전부 `수동`(Android 실기). 자동 러너는 `INFRA-013`이 연다                                                |
| 범위 독립 완료 가능 | #194(외형) → #193(유지·해제). 각각 앱을 켜서 눈으로 확인 가능                                               |
| 위험 격리           | `app.json` 변경 시 CNG 재생성 필요. `android/`는 `.gitignore` 대상이라 되돌리기는 `prebuild --clean` 재실행 |

**자동 보류 신호 해당 없음.** 동작 변경만 있고 구조 변경이 섞이지 않았다.

## 2. 영향 분석

`splash` 참조 실측 (`apps/native`, node_modules·android 제외):

```
app/_layout.tsx:2    import * as SplashScreen from 'expo-splash-screen'
app.json:36,38       expo-splash-screen 플러그인 + "./assets/splash.png"
package.json:26      expo-splash-screen 의존성
```

`assets/splash.png`를 참조하는 곳은 **`app.json` 한 곳뿐**이라 삭제 영향이 좁다 (AC-9).

| 구분     | 파일                                        | 이슈 |
| -------- | ------------------------------------------- | ---- |
| **신규** | `apps/native/assets/splash-gradient.png`    | #194 |
| **신규** | `apps/native/assets/splash-logo-square.png` | #194 |
| **수정** | `apps/native/app.json`                      | #194 |
| **수정** | `apps/native/app/_layout.tsx`               | #193 |
| **수정** | `apps/native/app/index.tsx`                 | #193 |
| **수정** | `docs/implementation-status.md`             | #194 |
| **삭제** | `apps/native/assets/splash.png`             | #194 |

> **폐기된 계획분** — `hooks/use-splash-gate.ts` · `components/splash-overlay.tsx` ·
> `assets/splash-logo{,@2x,@3x}.png` · `expo-linear-gradient`는 ADR-6으로 만들지 않는다.
> 구현 도중 만들었던 것은 2026-09-08에 제거했다.

### 도구 경계 확인 (실측)

- `.claude/hooks/fsd-layer-check.mjs`는 `apps/legacy-web/`와 `apps/web/src/`만 본다.
  **`apps/native`는 훅 검사 대상이 아니다** — ADR-3의 "FSD 적용 안 함"과 일치한다
- `turbo.json`에 `lint`·`check-types` 태스크가 있고 native에 두 스크립트가 모두 있다.
  → 새 파일은 `pnpm lint`·`pnpm check-types`가 검사한다
- `test` 태스크는 native에 스크립트가 없어 건너뛴다 (`spec.md` 「자동 테스트를 쓰지 않는 이유」)

## 3. 구현 계획 체크리스트

> **2026-09-08 재작성.** 오버레이 폐기(ADR-6)로 `assets → hooks → components → app/` 순서가
> 의미를 잃었다. 실제로 수행한 순서로 다시 적는다.

### 정적 스플래시 외형 (#194)

- [x] `[assets]` `splash-gradient.png` 추가 (iOS 전체화면용, 1290×2796)
- [x] `[assets]` `splash-logo-square.png` 추가 (Android 아이콘 슬롯용, 920×920)
- [x] `[assets]` `splash.png` 삭제
- [x] `[config]` `app.json` — `expo-splash-screen` 플러그인을 iOS/Android로 분기.
      iOS `enableFullScreenImage_legacy` + `resizeMode: 'cover'`, Android `imageWidth: 150`
- [ ] `[config]` `app.json` 최상위 `backgroundColor` — `#FFF` 유지로 판정. **첫 콜드 스타트의**
      **흰 프레임은 미해결**로 남긴다 (§5 ⑤)
- [x] `[build]` `expo prebuild -p android --clean` → `expo run:android`

### 스플래시 유지·해제 (#193)

- [x] `[app]` `_layout.tsx` — `preventAutoHideAsync()`, `setOptions({ duration, fade })`,
      placeholder `isLoaded` 상태와 TODO 주석 제거
- [x] `[app]` `index.tsx` — `onLoadEnd` · `onError`에서 `hideAsync()` 호출
- [x] `[app]` `index.tsx` — 무응답 상한 `SPLASH_MAX_WAIT_MS = 10000` 타이머
- [x] `[정리]` `index.tsx`의 미사용 `styles.header` 제거

### 구성 변경 뒤 잔재 정리 (2026-09-08)

- [x] `[삭제]` `hooks/use-splash-gate.ts` · `components/splash-overlay.tsx` ·
      `constants/colors.ts` · `assets/splash-logo{,@2x,@3x}.png` · `assets/adaptive-icon.png`
- [x] `[deps]` `expo-linear-gradient` 제거 → `pnpm install`로 lockfile 원복 확인
- [x] `[git]` 루트 `.expo/`를 인덱스에서 제외하고 `.gitignore`에 추가
- [x] `[검증]` `pnpm --filter @repo/native lint` · `check-types` · 변경 파일 `prettier --check`
- [ ] `[검증]` Android 실기 — AC 대조는 `ai-validate`의 `checklist.md`에서 한다

## 4. 리스크

| 리스크                                   | 영향                                      | 대응                                                                          |
| ---------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| iOS 경로 전체가 미검증                   | 출시 타깃에 검증되지 않은 코드가 남는다   | `checklist.md`·`implementation-status.md`에 「iOS 미검증」 명시. `INFRA-012`  |
| **iOS 스플래시에 로고가 없다**           | 출시 타깃의 브랜드 노출이 시안과 다르다   | 미해결로 기록. 이미지에 로고를 굽는 안을 후속 작업에서 판정                   |
| `prebuild --clean`이 `android/`를 재생성 | 로컬 네이티브 수정이 있으면 날아간다      | `android/`는 `.gitignore` 대상 CNG 산출물임을 실측 확인함. 수정본이 없어 안전 |
| 무응답 서버에서 스플래시 감금            | 앱이 영영 시작되지 않는다                 | `app/index.tsx`의 10초 상한 타이머로 막는다 (AC-5)                            |
| `enableFullScreenImage_legacy` 제거 예고 | SDK 업그레이드 시 iOS 그라디언트가 깨진다 | `spec.md` ADR-2 Consequences에 업그레이드 확인 항목으로 남김                  |

**토큰·인증 흐름 / orval 재생성 / 라우트 트리 재생성** — 이번 작업과 무관하다.
`apps/web`을 건드리지 않고 (확정 전제 1), native에는 TanStack Router가 없다.

## 5. 확인 필요 — 판정 결과

**① `docs/implementation-status.md`의 안내 문단** — 갱신했다. `O.0`이 「네이티브 구현」의 첫
사례임을 문단에 반영하고, 네이티브 화면의 검증이 Android로만 이뤄진다는 사실을 함께 적었다.

**② `O.0` 행의 「Web 구현」 열** — `—`(대상 아님)로 확정. 스플래시는 native 전용 화면이다.

**③ GitHub Issue 등록** — 완료. #193 · #194.

**④ Android 실기기** — 준비됨. 빌드·실행을 확인했다 (2026-09-08).

**⑤ 앱 윈도우 배경(2026-09-08 추가)** — `app.json` 최상위 `backgroundColor`를 `#8100B3`으로
바꾸는 안을 **적용하지 않기로** 판정했다. 첫 콜드 스타트의 흰 프레임은 미해결로 기록한다.

## 6. 브랜치

`feat/#193/splash` — `develop`에서 분기했다 (`git-workflow.md` §1).
#193·#194 두 이슈를 한 브랜치에서 진행한다. 구성 변경(ADR-6)으로 두 이슈가 같은 정적 스플래시를
다루게 되어 분리할 이유가 없어졌다.

## 7. 남은 절차

1. `ai-validate` — `checklist.md` 작성 (AC 대조 + 자동 검사 결과)
2. 미해결 2건(iOS 로고 부재 · 첫 콜드 스타트 흰 프레임)을 `work/to-do/`의 후속 `NAT-` 항목으로 분리
3. `docs/implementation-status.md`의 `O.0` 행을 검증 결과에 맞춰 최종 갱신
4. `git mv work/in-progress/NAT-011-스플래시-화면 work/done/`
