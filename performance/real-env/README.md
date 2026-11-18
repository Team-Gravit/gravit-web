# 실사용자 환경 측정 (real-env, 2026-11-18~)

기존 런북(`../automated-runbook.md`)의 조건 「CPU 4배 · Fast 4G · 모바일 412×915」는 **측정 기계 속도에 곱하는 배수**라
기계가 바뀌면 뜻이 달라진다. Windows PC에서는 `/main` LCP 4.0초, 맥미니(M4)에서는 0.94초로 4배 넘게 갈렸다
(`../evidence/2026-11-11_ref082/results-mac/REPORT.md` §6). 그래서 **실제 사용자 기기에 맞춘 프로필**로 다시 잰다.

기존 가이드는 고치지 않는다. 바꾼 것과 근거는 여기에만 적는다. 경계값은 그대로 `../README.md` §0이다.

## 1. 사용자

| 부류 | 엔진 | 기기 (가정) |
| --- | --- | --- |
| iOS 앱 | WKWebView (Safari 엔진) | iPhone 14급 (A15) |
| 모바일 웹 | 휴대폰 브라우저 | 중급 안드로이드 (갤럭시 A5x급) |
| 데스크톱 웹 | 데스크톱 브라우저 | 일반 노트북 |

실사용자 측정 도구(Speed Insights · GA · web-vitals)가 앱에 없어 **분포는 추정**이다. 실제 분포가 생기면 이 표부터 고친다.

## 2. 프로필

| 항목 | `ios` | `mweb` | `desktop` |
| --- | --- | --- | --- |
| 뷰포트 | 390×844 DPR 3, 터치 | 412×915 DPR 2.625, 터치 | 1440×900 DPR 1 |
| UA | iPhone Safari + `GravitNative/1.0.0` | 기본 | 기본 |
| 세션 | localStorage 토큰 (앱 방식, reissue 없음) | `hasSession` + reissue (웹 방식) | 같음 |
| CPU 감속 (M4 기준) | **1.5배** | **4배** | **2배** |
| 네트워크 (로딩) | LTE 평균 근사: 지연 40ms · 20Mbps / 5Mbps | 같음 | 지연 20ms · 50Mbps / 10Mbps |
| 네트워크 (INP) | 제한 없음 | 제한 없음 | 제한 없음 |
| 화면 | 25개 | 25개 | 22개 (`friends` · `my-edit` · `notifications`는 넓은 화면에서 모달로 바뀌어 제외) |

그 밖(캐시 끔 · load 후 12초 · 동작마다 2.5초 · 7회 가운데 값 · CLS는 `DELAY=600` 3회)은 런북 §2와 같다.

### 근거

- **ios 1.5배** — 같은 계산 · DOM 테스트를 iPhone 14 Safari와 맥 Safari에서 각 3회 돌렸다 (`calibration/`).
  JS 부분 가운데 값 iPhone 85ms vs 맥 64ms → **1.33배**. 공개 단일 코어 점수 비(A15 vs M4)는 약 1.7배. 그 사이 1.5배를 쓴다.
  DOM 부분은 iPhone 127ms vs 맥 Safari 152ms로 오히려 iPhone이 빨랐다. 창 크기 · 화면 차이로 보고 배수 근거에서 뺐다
- **mweb 4배** — 기기가 없어 공개 단일 코어 점수 비(갤럭시 A5x급 vs M4, 약 3.5~4배)로 추정. 한국 사용자는 갤럭시 S급도 많아 **보수적인 쪽**이다
- **desktop 2배** — 일반 노트북 단일 코어가 M4의 절반 안팎이라는 공개 점수 기준 추정
- **LTE 40ms · 20Mbps** — 한국 이동통신 평균보다 낮게 잡은 값. 기존 Fast 4G(60ms · 9Mbps)보다 덜 보수적이다
- **엔진 한계** — 측정은 Chrome(puppeteer)으로 한다. Safari 엔진 차이는 iPhone 실기기 확인으로 따로 본다 (§4)
  보정 테스트에서 같은 맥의 Chrome 84ms vs Safari 216ms(대부분 DOM)로 엔진 차이가 컸다. **iOS 수치는 실기기 확인 전까지 참고값**이다

## 3. 실행

```bash
# 저장소 루트에서 빌드 · preview(4195)는 런북 §1-1과 같다. 스텁은 이 폴더 사본을 쓴다.
node performance/real-env/scripts/api-stub.cjs
cd performance/real-env/scripts
P=~/perf-tools/node_modules/ bash run-real.sh          # 프로필 3개 × (로딩 → INP → CLS) × 묶음 A·B·C
node summarize.mjs ../results/diagnose-ios-load-A.json
node flutter.mjs ../results/diagnose-*.json            # 런북 §5 흔들림 검사
```

- `scripts/`는 `../evidence/2026-11-11_ref082/` 사본에 `PROFILE`만 더했다. `PROFILE`이 없으면 원본과 같다
- `run-real.sh` 단계 이름: `<프로필>-<load|inp|cls>-<묶음>`. 끝난 단계는 `done-*`로 건너뛴다

## 4. 실기기 확인 (iOS)

케이블 없이 같은 Wi-Fi로 한다(`device/`). 빌드 결과에 측정 스크립트를 끼워 넣는 서버를 띄우고, iPhone Safari로 `http://<맥 IP>:4310/__start`를 연다. 메인 · 학습 · 레슨을 5번씩 자동으로 돈다.

```bash
# VITE_API_BASE_URL=http://<맥 IP>:4310 로 빌드한 dist를 쓴다. 스텁(4199)도 떠 있어야 한다.
node device/device-server.cjs /tmp/gravit-perf/dist-lan
node device/device-run-chrome.mjs ~/perf-tools/node_modules/ mac-chrome-x1.5 1.5   # 같은 순서를 맥 Chrome으로
node device/summarize-device.mjs
```

**2026-11-19 결과:** iPhone 14는 맥 Chrome CPU 6배보다도 느렸다(클릭→다음 그리기 29ms vs 18ms). **`ios` 1.5배는 낙관적이다.** 보정해도 판정은 바뀌지 않았다(`results/REPORT.md` §2). 다음에 `ios` 배수를 다시 정한다면 이 결과로 정한다.

## 5. 폴더

| 폴더 | 내용 |
| --- | --- |
| `calibration/` | 보정 테스트 페이지 · 서버 · 결과(`bench-results.jsonl`) |
| `scripts/` | 측정 스크립트 |
| `results/` | 원본 JSON · 로그 · `REPORT.md` |
