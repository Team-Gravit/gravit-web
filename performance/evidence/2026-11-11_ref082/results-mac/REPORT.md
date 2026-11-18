# REF-082 맥미니 측정 보고 (2026-11-18)

이 파일 하나만 읽어도 되게 썼다. 원본 JSON · 로그는 같은 폴더에 있다.
경계값은 `README.md` §0, 절차는 `automated-runbook.md`를 따랐다.

## 0. 한 줄 요약

**25개 화면(+데스크톱 5개) 전부 FCP · LCP · TBT · INP가 「좋음」이다. 나쁨 · 개선 필요는 없다.**
다만 이 결과는 **M4 CPU를 4배 감속한 값**이라 Windows PC 결과보다 4배 넘게 빠르다. §6을 먼저 읽는다.

## 1. 측정 조건 · 기계

| 항목 | 값 |
| --- | --- |
| 기계 | Ha의 Mac mini · Apple M4 · 메모리 16GB · 전원 연결(AC) |
| OS | macOS 26.5.1 |
| Chrome | 150.0.7871.24 (puppeteer 25.3.0 번들, headless) |
| Node · pnpm | v22.23.5 (nvm) · 8.15.6 |
| 빌드 커밋 | `17c88074` Merge pull request #446 from Team-Gravit/fix/#444/ios-resume-status-bar (`develop`) |
| 빌드 | MSW 없음, API는 스텁(4199), `vite preview` 4195. 런북 §1-1 그대로 |
| 측정 조건 | 런북 §2 그대로 (캐시 끔 · 로딩 Fast 4G 근사 · CPU 4배 · 모바일 412×915 · 7회 가운데 값) |
| 본 측정 | 16:50:26 시작 → 18:01:57 끝 (A · B · C 로딩 7회 → INP 7회, 하나씩) |
| 재측정 | 18:03:05 → 18:24:12 (흔들림 화면만, §4) |
| 기계 상태 | 측정 중 사람 사용 없음. 시작 전 Spotlight 색인(mds 합계 430%)이 돌고 있어 끝날 때까지 기다린 뒤 시작. 남은 메모리 약 7.7GB. 절전은 `caffeinate -dimsu -w`로 막음 |
| CLS | **다시 재지 않았다.** Windows 결과(`results/cls-*`)를 쓴다. 아래 표에 CLS 칸이 없는 이유 |

확인한 것

- CPU 감속이 실제로 걸리는지: 같은 계산이 감속 1배 18ms → 4배 72ms (`tools/throttle-check.mjs`)
- 도착 화면 · API: 모바일 뷰포트로 22개 주소를 열어 전부 목표 주소에 도착, 스텁 API 404 · 5xx 0건
  (`tools/landing-check.mjs`). 상태가 필요한 화면(레슨 결과 · 온보딩 · 온보딩 완료)은 INP 측정에서 동작 대상을 모두 찾아 도착으로 봤다
- 오류: 7회 중 `ERROR` · `대상 없음` 0건, 모든 화면 n=7

## 2. 진단표

단위 ms. 칸은 가운데 값(7회). 판정: 🟢 좋음 / 🟡 개선 필요 / 🔴 나쁨.
INP는 모바일만 잰다. LCP 요소 이름은 빌드 해시를 뺐다.

### 묶음 A · 앱 셸

| 화면 | FCP | LCP (요소) | TBT | INP (동작) |
| --- | --- | --- | --- | --- |
| main 모바일 | 🟢 736 | 🟢 944 (img `hero-narrow-decoration.webp`) | 🟢 0 | 🟢 56 (전체 학습화면 보기) ¹ |
| main 데스크톱 | 🟢 728 | 🟢 868 (img `space-banner.webp`) | 🟢 0 | — |
| learning 모바일 | 🟢 760 | 🟢 980 (img `chapter-card-decoration.webp`) | 🟢 0 | 🟢 56 (자료구조 학습하기) ¹ |
| learning 데스크톱 | 🟢 756 | 🟢 928 (img `space-banner.webp`) | 🟢 0 | — |
| chapter 모바일 | 🟢 724 | 🟢 804 (p 「자료구조의 핵심」) | 🟢 0 | 🟢 48 (Unit01) ² |
| unit 모바일 | 🟢 732 | 🟢 1540 (img `starfield.avif`) | 🟢 0 | 🟢 48 (Lesson01) |
| concept-note 모바일 | 🟢 728 | 🟢 868 (code.language-ts) | 🟢 0 | 🟢 24 (복사) |
| concept-note 데스크톱 | 🟢 728 | 🟢 876 (code.language-ts) | 🟢 0 | — |
| league 모바일 | 🟢 724 ¹ | 🟢 908 ¹ (img `bronze-3.svg`) | 🟢 0 | 🟢 56 (골드 1) ¹ |
| league 데스크톱 | 🟢 724 ¹ | 🟢 912 ¹ (img `bronze-3.svg`) | 🟢 0 | — |
| friends 모바일 | 🟢 660 | 🟢 812 (span 「@…」) | 🟢 0 | 🟢 56 (8 팔로잉 · 12 팔로우) |
| my-summary 모바일 | 🟢 1252 | 🟢 1428 (img `space-banner.webp`) | 🟢 0 | 🟢 64 (학습 기록 연도 선택) |
| my-summary 데스크톱 | 🟢 1256 | 🟢 1368 (img `space-banner.webp`) | 🟢 0 | — |
| my-learning 모바일 | 🟢 1256 | 🟢 1432 (img `space-banner.webp`) | 🟢 0 | 🟢 56 (리그 탭) |
| my-league 모바일 | 🟢 1256 | 🟢 1432 (img `space-banner.webp`) | 🟢 0 | 🟢 48 (소셜 탭) ² |
| my-social 모바일 | 🟢 1260 | 🟢 1424 (img `space-banner.webp`) | 🟢 0 | 🟢 136 (축하하기) |
| friend-search 모바일 | 🟢 1256 | 🟢 1420 (img `space-banner.webp`) | 🟢 0 | 🟢 48 (요약 탭) |

### 묶음 B · 풀이

| 화면 | FCP | LCP (요소) | TBT | INP (동작) |
| --- | --- | --- | --- | --- |
| lesson 모바일 | 🟢 776 | 🟢 1644 (img `loading-mascot.webp`) | 🟢 0 | 🟢 40 (1번 선지 가리기) ¹ |
| lesson-result 모바일 | 🟢 712 | 🟢 1420 (img `moon-mobile.webp`) | 🟢 0 | ⚪ 무효 (가운데 값 56 · 48 · 48) |
| bookmarked 모바일 | 🟢 732 | 🟢 1628 (img `loading-mascot.webp`) | 🟢 0 | 🟢 40 (보기 1) |
| incorrect 모바일 | 🟢 728 | 🟢 1632 (img `loading-mascot.webp`) | 🟢 0 | ⚪ 무효 (가운데 값 40 · 40 · 40) |

### 묶음 C · 그 밖

| 화면 | FCP | LCP (요소) | TBT | INP (동작) |
| --- | --- | --- | --- | --- |
| my-edit 모바일 | 🟢 724 | 🟢 724 (label 「닉네임 설정」) | 🟢 0 | 🟢 56 (다음 프로필 색) ¹ |
| notifications 모바일 | 🟢 648 | 🟢 648 (p 텍스트) | 🟢 0 | 🟢 48 (학습하러 가기) |
| onboarding 모바일 | 🟢 592 | 🟢 592 (요소 기록 없음) | 🟢 0 | 🟢 56 (다음 프로필 색) |
| onboarding-success 모바일 | 🟢 580 | 🟢 696 (img `mascot-celebrate.webp`) | 🟢 0 | 🟢 48 (홈으로) |
| settings 모바일 | 🟢 728 | 🟢 728 (span 텍스트) | 🟢 0 | 🟢 48 (공지사항) ¹ |
| inquiry 모바일 | 🟢 728 | 🟢 816 (h4 「문…」) | 🟢 0 | 🟢 56 (문의 2) |
| inquiry-new 모바일 | 🟢 748 | 🟢 748 (h3 텍스트) | 🟢 0 | 🟢 64 (문의 유형 선택) |
| notice 모바일 | 🟢 716 | 🟢 804 (span 텍스트) | 🟢 0 | 🟢 48 (공지 1) |
| notice-detail 모바일 | 🟢 720 | 🟢 812 (h1 텍스트) | 🟢 0 | 🟢 48 (뒤로 가기) |

¹ 1차 재측정 값(`rerun1/`) · ² 2차 재측정 값(`rerun2/`). 나머지는 본 측정(`diagnose-*.json`).

읽을 때 참고

- `lesson` · `bookmarked` · `incorrect`의 LCP는 **로딩 화면 마스코트**다. 문제 화면이 아니라 로딩 화면이 가장 큰 요소로 잡혔다
- `my-*` · `friend-search`는 FCP가 다른 화면보다 약 0.5초 늦다(1.25초 vs 0.7초). 다섯 화면이 같은 값이라 마이페이지 공통 셸 쪽으로 보인다. 다만 좋음 구간이라 런북 §6에 따라 수정 후보로 올리지 않는다
- TBT는 모든 화면에서 가운데 값 0이다 (concept-note 모바일만 7회 중 1회 2ms)

## 3. 원인 분류 · 수정 후보

**해당 없음.** 나쁨, 그리고 여러 화면이 같은 원인인 개선 필요가 하나도 없어서 지시서 3단계(`waits.mjs` · `profile.mjs`) 대상이 없다.
런북 §6 「좋음 → 고치지 않는다. 측정 없이 "더 빠르게"를 제안하지 않는다」에 따라 수정 후보 목록을 비워 둔다.

## 4. 무효 · 재측정 · 멈춤

| 화면 · 지표 | 처리 | 이유 |
| --- | --- | --- |
| league 모바일 · 데스크톱 LCP | 1차 재측정으로 유효 | 본 측정 1회차만 1.4초(나머지 0.9초) → 범위 > 30%. 재측정 904~948 |
| main · learning · league · lesson · my-edit · settings INP | 1차 재측정으로 유효 | 범위 > 30% |
| chapter · my-league INP | 2차 재측정으로 유효 | 1차에서도 범위 > 30% |
| **lesson-result INP** | **무효** | 세 번 모두 범위 > 30% (48~96 / 48~80 / 48~88) |
| **incorrect INP** | **무효** | 세 번 모두 범위 > 30% (32~64 / 40~64 / 40~64) |
| concept-note 모바일 TBT | 재측정 안 함 | 가운데 값 0, 최대 2ms. 30% 기준이 의미 없는 크기 |

- INP 흔들림의 대부분은 **값이 40~60ms로 작고 Event Timing이 8ms 단위**라 생긴다. 한 단계(+16ms)만 튀어도 30%를 넘는다.
  무효 두 화면도 세 차례 최댓값이 96ms 이하라 어느 값을 써도 판정은 좋음(≤ 200ms)이다
- **멈춤 0회**, 단계 재실행(멈춤 복구) 0회. 흔들림 재측정만 위 표대로 2차까지 했다
- 처음 한 화면(`/main`, 1회)으로 `run-mac.sh`를 시험할 때 bash가 `$attempt회차`의 한글을 변수 이름으로 읽어 멈췄다.
  `${attempt}`로 고친 뒤 시험이 통과했고 본 측정에는 영향이 없다 (시험 결과는 버렸다)

## 5. 이 기계에서 바꾼 것 (macOS 대응)

- `run-mac.sh` — `run-rest.sh`를 복사해 단계 목록만 `load-A inp-A load-B inp-B load-C inp-C`로 바꿨다.
  PowerShell 줄은 런북 §1-2대로 `caffeinate -dimsu -w $$`, `pkill -f 'diagnose.mjs|cls-nav.mjs'` + `pkill -f 'puppeteer.*[Cc]hrome'`로 바꿨다.
  복구 · 건너뛰기 · 절전 방지 동작은 그대로다. `P` · `R` · `STEPS` · `SCREENS`를 환경변수로 받는다
- 시험 실행에서 확인: caffeinate가 스크립트 PID를 따라 켜졌다가 끝날 때 함께 꺼짐, `pkill` 패턴이 측정 node 1개와 puppeteer chrome만 잡음
- 주의: `profile.mjs`는 **현재 폴더**에 `profile_<경로>.txt`를 쓴다. 측정 폴더에서 돌리면 Windows 결과(`profile_main.txt` 등)를 덮어쓴다. 이번에는 돌리지 않았다

## 6. ⚠️ 해석 주의 — 확인 필요

- 같은 조건(CPU 4배)인데 Windows 결과는 `/main` 모바일 LCP 4044ms · TBT 230ms였고, 이번 맥은 944ms · 0ms다.
  **CPU 감속은 기계 자체 속도에 곱하는 배수**라, M4를 4배 늦춰도 Windows PC를 4배 늦춘 것보다 훨씬 빠르다.
  (빌드 커밋도 다르다. 런북 §5대로 두 기계 숫자를 비교하지 않는다. 규모만 적는다)
- 그래서 「전부 좋음」은 **이 맥미니 + 4배 조건에서 좋음**이라는 뜻이다. 저사양 안드로이드 WebView 사용자의 체감을 대표한다고 보기 어렵다
- 맥 결과로 원인을 찾으려면 측정 조건(런북 §2)을 바꿔야 한다. 예: 감속 배수를 올림, 실기기(`chrome://inspect`)로 잼.
  조건 변경은 런북 §0-6에 따라 **사용자 결정이 필요해서 하지 않았다**

## 7. 파일

| 파일 | 내용 |
| --- | --- |
| `diagnose-{load,inp}-{A,B,C}.json` · `log-*.txt` | 본 측정 원본 |
| `rerun1/` · `rerun2/` | 흔들림 재측정 원본 |
| `progress.txt` | 단계별 시작 · 완료 시각 |
| `tools/flutter.mjs` | 런북 §5 흔들림 검사 (범위 > 30%, 2배 튐) |
| `tools/landing-check.mjs` | 도착 주소 · API 404/5xx 확인 (감속 없음, 측정값 아님) |
| `tools/throttle-check.mjs` | CPU 감속 적용 확인 |
| `../run-mac.sh` | 이번에 쓴 실행 스크립트 |
