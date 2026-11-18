# 자동 측정 런북 (AI 실행용)

이 문서는 AI가 성능 측정을 **스스로 끝까지** 돌리기 위한 절차다. 사람이 읽는 설명은 `README.md`(측정 방법 ·
경계값)와 `causes-and-fixes.md`(원인과 해결법)에 있다. 경계값은 **`README.md` §0만** 기준으로 삼는다.

## 0. 규칙

1. 모든 답변 · 로그 해석 · 기록 문서는 **한국어**로 쓴다. 명령 · 파일 이름 · 지표 이름(LCP 등)은 원문 그대로 둔다.
2. 앱 코드(`apps/`)를 고치지 않는다. 측정 도구와 기록만 만든다.
3. 측정 중에는 커밋 · push 하지 않는다. 결과는 끝난 뒤 `perf/web-performance` 브랜치에 한꺼번에 올린다.
4. **긴 작업은 스스로 복구한다.** 출력이 10분 동안 늘지 않으면 멈춘 것으로 보고 프로세스를 끄고 그 단계만 다시 돌린다
   (단계당 최대 3회). 멈췄던 사실과 잃은 시간은 숨기지 않고 보고한다.
5. 측정 중에는 다른 무거운 작업(빌드 · 테스트 · 두 번째 측정)을 동시에 돌리지 않는다. 측정끼리 CPU를 나눠 쓰면 값이 틀어진다.
6. 사용자에게 묻지 않고 넘어가도 되는 것: 멈춘 단계 재실행, 측정용 포트 점유 프로세스 종료, 측정 스크립트 수정.
   반드시 묻는 것: 측정 조건(§2) 변경, 앱 코드 수정, 결과 해석이 경계값 경계에 걸려 판정이 갈릴 때.

## 1. 준비물

| 무엇 | 어디 |
| --- | --- |
| 측정 스크립트 | `performance/evidence/2026-11-11_ref082/` (`diagnose.mjs` · `cls-nav.mjs` · `summarize.mjs` · `waits.mjs` · `profile.mjs` · `state-probe.mjs`) |
| API 스텁 | 같은 폴더 `api-stub.cjs` + `fixtures.cjs` (포트 4199) |
| 측정 대상 빌드 | MSW 없는 빌드를 `vite preview`로 띄운다 (포트 4195) |
| puppeteer | 저장소 밖 별도 폴더에 설치하고, 스크립트 첫 인자로 그 `node_modules/` 경로를 넘긴다 |

이 폴더는 `perf/web-performance` 브랜치에 있다. 다른 기계에서는 그 브랜치를 받아 쓴다.

### 1-1. 빌드 (MSW 없음, API는 스텁)

```bash
VITE_ENABLE_API_MOCKING=false VITE_API_BASE_URL=http://localhost:4199 VITE_API_PROXY=false \
VITE_USE_HTTPS=false VITE_ENABLE_DEV_LOGIN=false \
pnpm --filter @repo/web exec vite build --outDir <임시 폴더>/dist-diag-nomsw
pnpm --filter @repo/web exec vite preview --outDir <임시 폴더>/dist-diag-nomsw --port 4195 --strictPort
node performance/evidence/2026-11-11_ref082/api-stub.cjs   # 4199
```

- **MSW 빌드로 재지 않는다.** MSW는 JS 249KB와 서비스 워커 시작이 더해지고 응답이 워커를 거쳐, CPU 4배에서 요청이 몰리면
  작은 응답도 2초씩 걸린다. `/main` 모바일 CLS가 MSW에서 0.238, MSW 없이 0.009였다.
- 빌드한 커밋(`git log -1 --oneline`)을 기록에 남긴다. 전후 비교는 같은 커밋 기준에서 바꾼 것만 다르게 한다.

### 1-2. Windows에서 쓴 부분 — 다른 OS에서는 바꾼다

| Windows | macOS |
| --- | --- |
| `cygpath -w` 로 puppeteer 경로 변환 | 필요 없음. 그냥 절대 경로 |
| PowerShell `SetThreadExecutionState`로 절전 막기 | `caffeinate -dimsu -w <측정 스크립트 PID>` |
| PowerShell로 `diagnose.mjs`/`cls-nav.mjs`·puppeteer chrome만 종료 | `pkill -f 'diagnose.mjs|cls-nav.mjs'` + `pkill -f 'puppeteer.*[Cc]hrome'` |
| Git Bash에서 `/main` 같은 인자가 경로로 바뀜 → `MSYS_NO_PATHCONV=1` | 필요 없음 |

`run-rest.sh`가 복구 · 건너뛰기 · 절전 방지를 이미 하므로, 새 측정 목록을 만들 때는 이 파일을 복사해 단계만 바꾼다.

## 2. 측정 조건 (바꾸지 않는다)

| 항목 | 로딩 (`MODE=load`) | 반응 (`MODE=inp`) |
| --- | --- | --- |
| 캐시 | 끔 | 끔 |
| 네트워크 | Fast 4G 근사 (지연 60ms, 내려받기 9Mbps) | 제한 없음 |
| CPU | 4배 감속 | 4배 감속 |
| 뷰포트 | 모바일 412×915 DPR 2.625. 일부 화면만 데스크톱 1440×900 | 모바일 |
| 대기 | load 후 12초 | 다 뜬 뒤 동작마다 2.5초 |
| 반복 | **7회, 가운데 값** | **7회, 가운데 값** |
| 로그인 | `localStorage.hasSession=1` + 스텁 reissue | 같음 |

CLS 전용 측정만 예외로 3회를 쓰고, 스켈레톤을 드러내려고 `DELAY=600`(스텁 응답 0.6초 지연)을 건다.

## 3. 기계 상태 확인 (측정 전 · 단계마다)

- 전원 연결. 노트북이면 덮개를 연 채로 둔다
- 다른 무거운 앱이 없다 (화상회의 · 영상 · 빌드). 사람이 같은 기계를 쓰고 있으면 **속도 지표(FCP · LCP · TBT · INP)는 무효**로 표시한다. CLS는 유지한다
- 남은 메모리 4GB 이상
- 기록에 남길 것: 기계 이름 · CPU · OS · Chrome 버전(`puppeteer` 번들) · 빌드 커밋 · 시작/끝 시각

## 4. 실행

```bash
cd performance/evidence/2026-11-11_ref082
P=<puppeteer node_modules 절대 경로>/
GROUP=A MODE=load RUNS=7 node diagnose.mjs "$P" results     # 묶음 A 로딩
GROUP=A MODE=inp  RUNS=7 node diagnose.mjs "$P" results     # 묶음 A 반응
# B, C도 같다. 화면 몇 개만: SCREENS=main,league
node summarize.mjs results/diagnose-load-A.json              # 가운데 값 · 범위 · LCP 요소 · CLS 원인
node waits.mjs results/diagnose-load-A.json                  # LCP가 무엇을 기다렸나
MSYS_NO_PATHCONV=1 node profile.mjs "$P" /main               # 첫 화면 전 긴 작업 쪼개기
DELAY=0 node cls-nav.mjs "$P"                                # 앱 안 이동 CLS
```

묶음은 `diagnose.mjs`의 `SCREENS` 목록이 기준이다 (A 12 · B 4 · C 9 화면, 일부는 데스크톱도).
URL만으로 열 수 없는 화면(레슨 결과 · 온보딩 · 온보딩 완료)은 `state-probe.mjs`가 연다.

## 5. 결과가 유효한가

하나라도 어기면 그 화면만 다시 잰다. 두 번 다시 재도 안 되면 원인을 적고 무효로 표시한다.

| 검사 | 무효 기준 |
| --- | --- |
| 오류 | 7회 중 `ERROR` · `대상 없음`이 1회라도 있다 → 원인을 고치고 다시 |
| 도착 화면 | 측정 화면이 목표 주소가 아니다 (로그인 · `/main`으로 튕김) |
| API | 측정 화면의 API가 404 · 5xx다 (스텁에 없는 경로) → 스텁에 추가하고 다시 |
| 흔들림 | (최대 − 최소) > 가운데 값의 30%, 또는 혼자 2배 넘게 튄 값이 있다 |
| 표본 수 | 집계된 실행이 5회 미만이다 |
| 기계 상태 | §3 위반 (사람이 쓰는 중, 절전, 전원 분리) |

**CLS는 두 가지로 적는다.** 점수에 들어가는 값(입력 후 500ms 지난 이동)과, 눈에 보이는 전체 값(입력 직후 포함).
스켈레톤 → 실제 내용 교체는 크기가 달라 다른 요소를 밀어낼 때만 CLS가 생긴다. 스텁이 빨라 스켈레톤이 안 보였을 수 있으니
`DELAY=600`으로 한 번 더 잰다.

### 전후 비교가 의미 있는가

- 같은 기계 · 같은 조건 · 가능하면 같은 날. 다른 기계 숫자끼리 비교하지 않는다
- 가운데 값 차이가 **10% 이상이고**, 전후 7회 범위(최소~최대)가 거의 겹치지 않을 때만 "개선됨"이라고 쓴다
- 그보다 작으면 "차이 없음(흔들림 범위 안)"이라고 쓴다

## 6. 판정 — 고칠지 말지

경계값은 `README.md` §0의 표를 읽어 쓴다. 판정 규칙:

| 결과 | 판정 |
| --- | --- |
| 나쁨 구간 | 고친다. 수정 작업 후보로 올린다 |
| 개선 필요 구간 | 다른 화면과 원인이 같으면 공통 작업으로 묶는다. 이 화면만의 원인이면 우선순위를 낮게 둔다 |
| 좋음 | 고치지 않는다. 측정 없이 "더 빠르게"를 제안하지 않는다 |

우선순위: 사용자가 자주 들어오는 화면(메인 · 학습 · 레슨) > 나쁨의 폭 > 영향 화면 수.

## 7. 원인 분류

화면마다 아래 셋 중 어디인지 근거와 함께 적는다. 해결 방향은 `causes-and-fixes.md`에 있다.

| 분류 | 판단 근거 |
| --- | --- |
| **공통 (앱 셸)** | 여러 화면에서 같은 시점 · 같은 크기의 긴 작업이 보인다. 진입 JS 실행(`evaluateModule`), 초기화, 세션 복원(reissue), 글꼴 |
| **라우트 · 컴포넌트** | 그 화면에서만 첫 렌더 긴 작업이 길다, 그 화면에서만 Layout이 크다, 그 화면의 데이터가 많다 |
| **번들 (트리 셰이킹 · 분할)** | 그 화면에서 안 쓰는 코드가 첫 덩어리에 있다. Coverage 미사용 비율, 번들 지도(`pnpm dlx vite-bundle-visualizer`)로 누가 끌고 왔는지 |

- `profile.mjs`의 자기 시간(self time)으로 JS · Layout · Style 중 무엇이 큰지 먼저 본다
- CPU 감속을 끄고 다시 재서 크게 줄면 JS 실행이 원인이다
- 이미지가 LCP면 `waits.mjs`로 요청 시작이 늦은지(발견이 늦음) 다운로드가 긴지(파일이 큼) 나눈다

## 8. 산출물

1. `results/`에 JSON · 로그 원본
2. 진단표 (화면 × FCP · LCP(요소) · CLS(원인 요소) · TBT · INP(동작)), 각 칸에 좋음 / 개선 필요 / 나쁨
3. 원인 분류표 (§7)와 수정 작업 후보. **작업은 만들지 않고 제안만** 한다
4. 측정 조건 · 기계 상태 · 무효 처리한 화면과 이유
5. 마지막에 사용자에게 한국어로 짧게 보고: 무엇을 쟀고, 무엇이 나쁨이고, 무엇이 무효였고, 멈춤이 있었는지
