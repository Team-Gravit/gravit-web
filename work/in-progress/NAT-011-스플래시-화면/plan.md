---
id: 'NAT-011'
planned: '2026-11-05'
mode: 'feature'
---

# NAT-011 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.** 예외: `icon.png` 교체는 사용자 요청으로 먼저 했다.
> 범위와 결정은 `spec.md`가 정본이다.

## 0. 판정

`NAT-` — `apps/native`만 바꾼다. 웹 · 생성물 · 라우트 트리 · 의존성 변경 없음.
번호는 PR #195의 `NAT-011`을 이어 쓴다. 같은 작업이고 그 PR은 이 작업이 머지되면 닫는다.

## 1. 선행 조건

- [ ] 디자이너 확인 (막히지는 않는다. 답이 다르면 §3-1의 이미지와 설정만 바꾼다): iOS 위아래 잘림, Android 단색 `#8100B3`
- [ ] PR #195 처리는 사용자가 정한다. 이 작업 머지 후 닫는 것을 제안한다

## 2. 영향 분석

| 구분 | 파일                                                                       |
| ---- | -------------------------------------------------------------------------- |
| 신규 | `assets/splash-ios.png` · `assets/splash-logo-square.png` (PR #195에서)    |
| 수정 | `assets/icon.png`(완료) · `app.json` · `app/_layout.tsx` · `app/index.tsx` |
| 삭제 | `assets/splash.png`                                                        |
| 문서 | `docs/implementation-status.md` `O.0` 행                                   |

PR #195에서 **가져오지 않는 것**: `app.json`(번들 ID · 권한이 되돌아간다), `metro.config.js`, `.codex`, `AGENTS.md`, `adaptive-icon.png` 삭제.

## 3. 구현 계획

### 3-1. 이미지

- [x] `splash-logo-square.png` — PR #195에서 복사 (920×920, 투명 배경 흰 로고, Android용)
- [x] `splash-ios.png` 생성 — 1290×2796, 불투명
  - 배경: PR #195의 `splash-gradient.png` (네 모서리 색이 시안 그라디언트와 맞는 것을 확인했다)
  - 로고: Figma `13750:50867`을 투명 배경으로 내보낸다. 폭은 시안 비율 그대로 약 631px(176/360 × 1290). 배율 3.585로 내보낸 실제 크기는 633×549
  - 위치: 이미지 정중앙. 시안의 중심이 약간 위인 것은 Android 목업을 뺀 영역 기준이라 따르지 않는다
  - 내보낸 로고에 배경이 구워지지 않았는지 확인한다 (PR #195에서 겪은 문제)
  - 합성은 저장소에 스크립트를 남기지 않는다. 재현 값은 이 문서로 충분하다

### 3-2. 설정

- [x] `app.json` — 플러그인 설정만 바꾼다

  ```json
  [
    "expo-splash-screen",
    {
      "backgroundColor": "#8100B3",
      "ios": {
        "image": "./assets/splash-ios.png",
        "resizeMode": "cover",
        "enableFullScreenImage_legacy": true
      },
      "android": { "image": "./assets/splash-logo-square.png", "imageWidth": 150 }
    }
  ]
  ```

- [x] `assets/splash.png` 삭제, 참조 0건 확인
- [x] `expo config --type introspect`로 설정 반영 확인

### 3-3. 코드

- [x] `app/_layout.tsx` — 모듈 상단에 `preventAutoHideAsync()`. `isLoaded` · `useEffect` · TODO 제거. `setOptions`와 카카오 초기화는 유지
- [x] `app/index.tsx` — `SPLASH_MAX_WAIT_MS = 10_000` · `hideSplash()`. `onLoadEnd` · `onError`에서 호출, 화면 effect에 상한 타이머. 기존 로그는 유지
- [x] `pnpm --filter @repo/native check-types lint` · `prettier --check`

### 3-4. 검증과 문서

- [ ] 개발 빌드 (Apple 로그인과 같은 빌드): AC-1, AC-5. 스플래시는 대략만 본다
- [ ] preview 빌드: AC-2 · AC-3 · AC-4 · AC-6. 같은 빌드에서 NAT-025의 HTTPS 동작(Issue 2 AC-4)도 본다
- [ ] `pnpm verify` · `checklist.md`
- [x] `docs/implementation-status.md` `O.0` 행 갱신. 화면 이름의 "AOS" 표현을 실제 상태에 맞췄다. 검증 후 상태를 다시 갱신한다

## 4. 커밋 · PR

Apple 로그인(NAT-025)이 먼저다. 빌드는 작업 트리 기준이라 함께 넣어 한 번만 돌리고, 커밋은 나눈다.

1. NAT-025 Apple 커밋들
2. `chore(native)`: 앱 아이콘 교체
3. `feat(native)`: 스플래시 이미지 · 설정 · 숨김 시점
4. `docs(repo)`: NAT-011 문서

PR은 Apple 다음에 별도로 올린다. 브랜치는 `feat/#194/splash-app-icon`, 이슈는 `#194`를 쓴다.

## 5. 리스크

| 리스크                                        | 영향                     | 대응                                                          |
| --------------------------------------------- | ------------------------ | ------------------------------------------------------------- |
| `enableFullScreenImage_legacy` 제거           | 그라디언트가 작은 사각형 | SDK 업그레이드 때 확인. 단색 + 로고로 전환 (ADR-2)            |
| `preventAutoHideAsync` 후 숨김 호출이 안 옴   | 스플래시에 갇힘          | 10초 상한. AC-5로 확인                                        |
| 흰 화면이 preview에서도 남음                  | 목표 미달                | 원인 기록 후 별도 작업. 숨김을 늦추는 값을 임의로 넣지 않는다 |
| iOS가 이전 launch screen을 캐시 (알려진 현상) | 새 스플래시가 안 보임    | 앱 삭제 후 재설치, 필요하면 재부팅하고 확인                   |
| 개발 빌드에서 스플래시가 다르게 보임          | 잘못된 판정              | Expo 문서대로 preview에서 판정                                |

## 6. 검증

| 대상        | 방법                                      |
| ----------- | ----------------------------------------- |
| 설정        | `expo config` 결과 확인                   |
| 코드        | 타입 · 린트. native에 테스트 러너가 없다  |
| 화면 · 시점 | 수동 (`spec.md` AC). 녹화 · 캡처로 남긴다 |
| 전체        | `pnpm verify`                             |

## 7. 구현 중 확인한 것 (2026-11-05)

- Windows에서는 `expo prebuild -p ios`가 건너뛰어져 생성된 iOS 프로젝트를 미리 볼 수 없다. 스토리보드 결과는 EAS 빌드에서 처음 확인된다
- 설정 반영, 번들 ID, Apple 권한은 `expo config --type introspect`로 확인했다
- 잘림은 이미지 처리 도구의 `cover` 시뮬레이션(Pro Max · SE · iPad 비율)으로만 확인했다. 실제 판정은 preview 빌드에서 한다
- 숨김 호출은 `hideAsync` 대신 `hide`를 쓴다. 문서에서 `hideAsync`는 하위 호환용이다
