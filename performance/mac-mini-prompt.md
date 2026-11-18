# 맥미니 성능 측정 지시서 (REF-082)

> 이 파일을 읽은 AI에게: 아래를 처음부터 순서대로 그대로 한다. **답변과 기록은 모두 한국어로 쓴다.**
> 명령어 · 파일 이름 · 지표 이름(LCP · CLS 등)만 영어로 둔다.

## 목적

앱이 출시돼 곧 홍보를 시작한다. 처음 들어온 사람이 느끼는 속도를 고치기 전에, **어느 화면이 왜 느린지 근거를 만든다.**
이 기계에서는 **재기만 한다.** 고치는 건 다른 PC에서 이 결과를 보고 한다.

## 기준 문서 (먼저 끝까지 읽는다)

| 문서 | 무엇 |
| --- | --- |
| `performance/automated-runbook.md` | 측정 절차 · 조건 · 유효성 · 판정 · 원인 분류 · 산출물. **이대로 한다** |
| `performance/README.md` §0 | 좋음 / 개선 필요 / 나쁨 경계값 |
| `performance/causes-and-fixes.md` | 원인별 해설. 원인 분류 근거를 쓸 때 본다 |

## 0단계 — 준비 확인 (모자라면 설치 전에 나에게 묻는다)

1. 저장소 루트로 이동하고 `git status`가 깨끗한지 본다. 바뀐 파일이 있으면 **건드리지 말고 멈춰서 묻는다**
2. `git fetch origin && git switch develop && git pull --ff-only` 후 `git log -1 --oneline`을 기록한다. 이 커밋을 잰다
3. Node: `node -v`가 **22.13 이상**이어야 한다 (`package.json` engines)
   - 없거나 낮으면 **설치 방법을 나에게 먼저 묻는다** (Homebrew 유무를 확인해서 같이 알려 준다)
4. pnpm: **8.15.6 고정**. `corepack enable && corepack prepare pnpm@8.15.6 --activate` 후 `pnpm -v` 확인. `npm` · `yarn`으로 설치하지 않는다
5. `pnpm install` (저장소 루트)
6. puppeteer는 **저장소 밖**에 설치한다. Windows에서 쓴 버전과 같게 맞춘다
   ```bash
   mkdir -p ~/perf-tools && cd ~/perf-tools && npm init -y >/dev/null && npm i puppeteer@25.3.0
   ```
   이후 스크립트 첫 인자 `P`는 `~/perf-tools/node_modules/`의 **절대 경로**다
7. `performance/evidence/2026-11-11_ref082/`에 `diagnose.mjs` · `api-stub.cjs` · `run-rest.sh` 등이 있는지 본다. 없으면 멈추고 묻는다

## 1단계 — 측정 환경 띄우기

런북 §1-1 그대로. 다만 런북 §1-2의 표대로 macOS에 맞게 바꾼다.

- 빌드 폴더는 `/tmp/gravit-perf/dist-diag-nomsw`
- 스텁 4199 · preview 4195. 띄운 뒤 `curl -s -o /dev/null -w '%{http_code}' http://localhost:4195/`가 200인지 확인

## 2단계 — 측정

- 결과는 **`results-mac/`** 에 둔다. Windows에서 잰 `results/`와 섞지 않는다
- 묶음 **A · B · C 전체**를 **로딩 7회 → 반응(INP) 7회** 순서로, **하나씩** 잰다. 동시에 돌리지 않는다
- `run-rest.sh`를 `run-mac.sh`로 복사해 단계 목록만 바꿔서 돌린다
  - 멈춤 복구 · 건너뛰기 · 절전 방지 동작은 그대로 둔다
  - Windows 전용 줄(PowerShell)은 런북 §1-2의 macOS 명령으로 바꾼다 (`caffeinate -dimsu -w <PID>`, `pkill`)
  - **이 macOS 명령은 아직 실제로 돌려 본 적이 없다.** 처음 한 화면으로 짧게 돌려 동작을 확인한 뒤 전체를 돌린다
- **CLS는 다시 재지 않는다.** Windows에서 이미 쟀다 (`results/cls-*`)
- 측정 중에는 내가 이 기계를 쓰지 않는다. 시작 · 끝 시각을 기록한다

## 3단계 — 원인 보기

진단표에서 **나쁨**이거나, **개선 필요인데 여러 화면이 같은 원인**으로 보이는 화면만 더 본다.

- `summarize.mjs` · `waits.mjs`로 LCP가 무엇을 기다렸는지
- `profile.mjs`로 첫 화면 전 긴 작업 (JS · Layout · Style 중 무엇이 큰지)
- 런북 §7의 세 갈래(공통 · 라우트·컴포넌트 · 번들) 중 어디인지 근거와 함께

## 4단계 — 산출물

런북 §8 전부. 그리고 **`results-mac/REPORT.md` 한 파일**에 아래를 모은다. 이 파일만 Windows로 옮겨도 읽을 수 있게 쓴다.

1. 측정 조건 · 기계 정보(이름 · CPU · OS · Chrome 버전) · 빌드 커밋 · 시작/끝 시각
2. 진단표 (화면 × FCP · LCP(요소) · TBT · INP(동작)), 칸마다 좋음 / 개선 필요 / 나쁨
3. 원인 분류표와 **수정 후보 목록** — 화면 · 원인 · 근거 · 예상 효과. 우선순위는 런북 §6 기준
4. 무효 처리한 화면과 이유, 멈춤이 있었는지 · 몇 번 재실행했는지

마지막에 나에게 다섯 줄 안으로 보고한다: 무엇을 쟀고 · 무엇이 나쁨이고 · 무엇이 무효였고 · 멈춤이 있었는지 · REPORT.md 위치.

## 지켜야 할 것

- **앱 코드를 고치지 않는다. 커밋 · push 하지 않는다**
- 측정 조건(런북 §2)을 바꿔야 할 것 같으면 **멈추고 묻는다**
- 멈추면 기다리지 말고 재실행하고, 멈췄던 사실은 보고에 적는다
- 설치 · 삭제처럼 기계에 남는 작업은 위 0단계에 적힌 것만 한다. 그 밖에는 묻는다
