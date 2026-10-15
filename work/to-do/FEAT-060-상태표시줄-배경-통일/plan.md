# FEAT-060 구현 계획 — 상태 표시줄 영역 배경 통일

> `ai-plan` 산출물. spec의 ADR 1안(웹이 상태 표시줄 뒤까지 그린다)을 기준으로 한다.
> `feature-planner`를 거치지 않았다. ADR이 3안 비교 대신 2안 거부로 가볍게 작성돼 있다.

## 0. 작업 종류

`FEAT-` — 상태 표시줄 영역을 화면 배경으로 칠하는 동작은 지금 없다. 웹과 네이티브를 함께 바꾼다.

## 1. 핵심 원리 — 순서가 안전장치다

`env(safe-area-inset-top)`은 웹 화면이 실제로 상태 표시줄과 겹칠 때만 0보다 커진다.

| 환경                                     | 지금 값 | 이유                                      |
| ---------------------------------------- | ------- | ----------------------------------------- |
| 앱 (네이티브가 `paddingTop: insets.top`) | 0       | WebView가 상태 표시줄 아래에서 시작한다   |
| Safari 세로 화면                         | 0       | Safari가 상태 표시줄 영역을 직접 관리한다 |
| 앱, 네이티브 여백 제거 후                | 47~62px | WebView가 상태 표시줄과 겹친다            |

그래서 **웹에 안전 영역 여백을 먼저 넣어도 지금 화면은 1px도 바뀌지 않는다.** 웹을 모두 넣고
검증한 뒤 마지막에 네이티브 여백을 빼면 그 순간 한꺼번에 켜진다. 네이티브만 먼저 바꾸면
여백이 빠진 화면의 글자가 시계 밑으로 들어간다.

## 2. 화면별 맨 위 요소 (조사 결과)

### A. 공용 상단 막대 — 컴포넌트 하나만 고치면 된다

| 컴포넌트                                       | 쓰는 화면                                               | 배경 |
| ---------------------------------------------- | ------------------------------------------------------- | ---- |
| `widgets/page-title-bar` (sticky)              | 학습, 챕터, 유닛 상세, 개념노트, 친구, 알림, 설정, 문의 | 흰색 |
| `widgets/quiz-screen/ui/quiz-top-bar` (sticky) | 레슨 퀴즈, 북마크·오답 풀이                             | 흰색 |
| `shared/ui/layout/page-header`                 | 로그인, 온보딩                                          | 흰색 |
| `shared/ui/layout/document-layout` header      | 이용약관, 개인정보처리방침                              | 흰색 |

sticky 막대는 스크롤해도 맨 위에 붙어 있으므로 상태 표시줄 영역을 계속 덮는다. 스크롤 문제 없음.

### B. 이미지·그라데이션이 맨 위에 오는 화면 — 화면마다 고친다

| 화면        | 맨 위 요소                                     | 배경                     | 스크롤 시   |
| ----------- | ---------------------------------------------- | ------------------------ | ----------- |
| 메인        | `widgets/hero-greeting`                        | 이미지                   | 함께 올라감 |
| 마이        | `pages/my/ui/profile-card`                     | 이미지 + 어두운 덮개     | 함께 올라감 |
| 리그        | `pages/league` main (배경은 `fixed`)           | 보라 그라데이션 + 이미지 | 배경 고정   |
| 학습 완료   | `pages/lesson-result` main                     | `bg-space-gradient`      | —           |
| 온보딩 완료 | `pages/onboarding-success` (`SpaceBackground`) | 우주 배경                | —           |
| 에러        | `pages/error`                                  | `bg-bg-0`                | —           |

**B의 메인·마이는 문제가 하나 남는다.** 맨 위 요소가 sticky가 아니라 스크롤하면 위로 사라진다.
그러면 아래 목록이 시계·배터리 밑으로 지나간다. → §4 확인 필요 1

## 3. 구현 체크리스트

### Issue 1 — 웹 기반 + 공용 상단 막대 (화면 변화 없음)

- [x] `[shared]` `app/styles/tokens.css`에 `--safe-area-top: env(safe-area-inset-top, 0px)` 추가
- [x] `[shared]` `index.html` viewport에 `viewport-fit=cover` 추가
- [x] `[shared]` `page-header`, `document-layout` 상단에 `pt-(--safe-area-top)`. 높이 클래스가 있으면
      여백만큼 늘린다 (border-box라 `h-12`에 여백을 주면 내용이 줄어든다)
- [x] `[widgets]` `page-title-bar`, `quiz-top-bar` 같은 방식
- [x] `[app]` `native-app-zoom`이 viewport를 덮어쓰지 않고 `maximum-scale`만 덧붙이게 변경.
      덮어쓰면 앱에서만 `viewport-fit=cover`가 사라진다
- [ ] 검증: 지금 앱·Safari에서 화면이 그대로인지 (값이 0이라 그대로여야 한다)

### Issue 2 — 이미지·그라데이션 화면

- [x] `[widgets]` `hero-greeting`: `box-content` + 상단 여백으로 이미지를 상태 표시줄 뒤까지 늘림. 위에 겹치는 요약은 여백만큼 내림
- [x] `[pages]` `profile-card`(`box-content` + 상단 여백), `league-page` main · `lesson-result-page` main(기존 상단 여백에 더함)
- [x] `onboarding-success` · `error`는 고치지 않는다. 내용이 세로 가운데 정렬이고 배경이 이미 맨 위부터 칠해져 시계와 겹치지 않는다
- [x] 스크롤했을 때 덮는 처리: 확인 필요 1 판정 (가)로 하지 않음

### Issue 3 — 네이티브 전환 + 시계 글자색

- [ ] `[native]` `apps/native/app/index.tsx`: iOS에서 `paddingTop: insets.top` 제거.
      WebView에 `contentInsetAdjustmentBehavior="never"` 명시 (iOS가 안전 영역을 한 번 더 넣지 않게)
- [ ] `[native]` `expo-status-bar`로 시계 글자색 전환. 리그·학습 완료처럼 어두운 화면에서 검은 글자는 안 보인다
- [ ] `[app]` 라우트 `staticData`에 시계 글자색(`statusBarStyle: 'light' | 'dark'`)을 선언하고,
      `__root`가 바뀔 때마다 `window.ReactNativeWebView.postMessage`로 네이티브에 알린다.
      웹→네이티브 메시지는 지금 없다. 이번에 처음 만든다
- [ ] `[native]` `onMessage`에서 그 메시지를 받아 `StatusBar` 스타일 변경

### Issue 4 — Safari

- [ ] 실기기 iOS 버전으로 Safari 상단 영역이 무엇을 따라 칠해지는지 먼저 확인
- [ ] 확인 결과에 따라 `theme-color` 메타 또는 `html` 배경을 라우트에 맞춘다

## 4. 확인 필요 (사용자 판정)

1. **메인·마이에서 스크롤하면 목록이 시계 밑으로 지나간다.** 어떻게 할까?
   - (가) 그대로 둔다 — 많은 iOS 앱이 이렇게 동작한다. 구현 없음
   - (나) 스크롤하면 상태 표시줄 뒤에 배경색(`bg-bg-2`) 띠가 나타난다 — 스크롤 위치 감지 필요
   - **판정 (2026-10-15): (가).** 실기기에서 보고 거슬리면 (나)를 새로 검토한다
2. **Issue 3의 웹→네이티브 메시지**는 첫 연결이다. 메시지 형식을 이번에 정해도 되는가
   (예: `{ type: 'statusBarStyle', style: 'light' }`)
3. **Android**는 이번 범위 밖이다(spec Out of Scope). 네이티브 변경도 iOS에만 적용한다

## 5. 영향 분석

| 구분 | 파일                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 수정 | `apps/web/index.html`, `apps/web/src/app/styles/tokens.css`                                                                                                       |
| 수정 | `shared/ui/layout/page-header.tsx`, `shared/ui/layout/document-layout.tsx`                                                                                        |
| 수정 | `widgets/page-title-bar/ui/page-title-bar.tsx`, `widgets/quiz-screen/ui/quiz-top-bar.tsx`, `widgets/hero-greeting/ui/hero-greeting.tsx`                           |
| 수정 | `pages/my/ui/profile-card.tsx`, `pages/league/ui/league-page.tsx`, `pages/lesson-result/ui/lesson-result-page.tsx`, `pages/onboarding-success/…`, `pages/error/…` |
| 수정 | `app/routes/__root.tsx` + 어두운 화면 라우트의 `staticData`, `app/router/router.ts`(타입)                                                                         |
| 수정 | `apps/native/app/index.tsx`                                                                                                                                       |
| 신규 | 웹→네이티브 메시지 전송 함수 (`shared/lib/native-bridge` 후보)                                                                                                    |

파일이 10개를 넘고 웹·네이티브에 걸친다. 그래서 위처럼 4개 이슈로 나눈다.
Issue 1·2는 웹만이라 지금 브랜치 흐름대로 PR을 낼 수 있고, Issue 3이 실제로 켜는 스위치다.

## 6. 리스크

| 리스크                                         | 영향                                   | 대응                                                                             |
| ---------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------- |
| 여백을 빠뜨린 화면                             | 그 화면의 글자가 시계 밑으로 들어간다  | §2 표를 체크리스트로 실기기에서 한 화면씩 확인                                   |
| `viewport-fit=cover`가 하단 안전 영역도 켠다   | 바텀탭이 홈 인디케이터와 겹칠 수 있다  | 웹은 `safe-area-inset-bottom`을 아무 데서도 안 쓴다. 지금과 같을 것. 실기기 확인 |
| iOS가 WebView에 안전 영역 여백을 자동으로 넣음 | 여백이 두 번 들어가 위가 비어 보인다   | `contentInsetAdjustmentBehavior="never"` 명시                                    |
| 화면 전환 직후 시계 글자색이 늦게 바뀜         | 잠깐 검은 글자가 보라 배경 위에 보인다 | 라우트 변경 즉시 메시지 전송. 실기기에서 체감 확인                               |
| 네이티브는 앱 재빌드가 필요                    | 웹만 배포해서는 켜지지 않는다          | Issue 3은 앱 출시 일정과 맞춘다. 웹은 먼저 배포해도 안전하다(§1)                 |

## 7. 검증

| 방법            | 내용                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| 실기기 (앱)     | §2의 화면을 모두 열어 ① 맨 위 색이 상태 표시줄까지 이어지는지 ② 글자가 시계에 안 가리는지 ③ 시계 글자색이 보이는지 |
| 실기기 (Safari) | Issue 1·2 후 화면이 지금과 같은지, Issue 4 후 상단 색                                                              |
| 자동 테스트     | 라우트별 시계 글자색 결정 함수와 메시지 형식만. 여백·색은 시각 영역이라 테스트하지 않는다                          |
| 검사            | `pnpm lint` → `check-types` → `test` → `build`                                                                     |
