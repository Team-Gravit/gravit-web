# #299 마크다운 지연 로딩 — 근거 모음

커밋: `e4964c21` refactor(코드 블록 분리) → `42399732` perf(마크다운 지연 로딩) · 브랜치 `perf/#299/entry-chunk`
해석과 경위는 `../../records/2026-10-18-after-299.md`에 있다. 이 문서는 **주장 ↔ 근거 파일** 색인이다.

## 0. 결론 (최종 커밋 기준, 2026-10-20 재측정)

| 화면 | LCP before → final | FCP before → final | 판단 |
| --- | --- | --- | --- |
| `/main` | 4.50s → **3.95s (−0.55)** | 같음 (FCP = LCP) | ✅ 개선 — 같은 코드끼리 차이(0.00s)보다 훨씬 크다 |
| 개념 노트 (unit 11) | 7.42s → **7.04s (−0.38)** | 3.71s → **3.30s (−0.41)** | ✅ 개선 — 같은 코드끼리 차이 0.09s |
| `/learning` | 5.49s → 5.57s (+0.08) | 4.16s → **3.82s (−0.34)** | ⚠️ **LCP는 차이 없음**, FCP만 개선 — 같은 코드끼리 LCP 차이가 0.19s라 구분 불가 |

- 녹화 응답 재생 · 5회 번갈아 · 중앙값. 원본 `replay/2026-10-20_final-commit_before-final-final-repeat.json`
- `final-repeat` = 같은 `final` 빌드를 다른 포트에 한 번 더 띄운 것 → **측정 흔들림의 크기**를 보여 준다
  (`/main` 0.00s · `/learning` LCP 0.19s / FCP 0.25s · 개념 노트 0.09s)
- 절대값은 날마다 다르다(전날 같은 조건에서 `/main` before 5.64s). **같은 실행 안의 before ↔ final만 비교한다**
- `/learning`의 LCP는 카드 배경 이미지인데, 이 이미지는 `chapters` API 응답 → 카드 생성 뒤에야 요청된다. 첫 청크가 줄어 화면은 빨리 그려지지만(FCP) 이미지까지의 사슬은 그대로라 LCP가 움직이지 않는다 → REF-062(미리 요청) · REF-054(이미지)의 대상
- 커밋 메시지의 `/main` 5.64s → 4.96s는 2026-10-19 녹화 재생 값이다(`after` = 회귀 수정 전 빌드, `/main`은 마크다운을 쓰지 않아 최종 코드와 같은 조건). 원본은 덮어써져 없고, 같은 방향의 최종 커밋 재측정(4.50 → 3.95s)이 이를 뒷받침한다
- 전날 측정의 `/learning` −0.38s는 이번에 재현되지 않았다. 그날 흔들림 기준을 재지 않았으므로 **이번 값을 기준으로 삼는다**

## 1. 주장과 근거

| # | 주장 | 근거 파일 | 측정 방식 | 상태 |
| --- | --- | --- | --- | --- |
| 1 | 첫 청크 861,141 B → 629,881 B (841 → 615 KiB), gzip 270 → 195 KiB. JS 합계는 같고(1,209 KiB) 마크다운이 별도 청크(226 KiB)로 이동 | `build-sizes.md` | `vite build` 산출물 직접 측정 | ✅ |
| 2 | 마크다운 · refractor(압축 전 약 739KB)가 첫 청크에서 빠짐 | `../2026-10-18_bundle_visualizer_after.html`(#299 refactor만) · `../2026-10-18_bundle_visualizer_lazy-markdown.html`(지연 로딩) | vite-bundle-visualizer | ✅ |
| 3 | `/main` · `/learning` · 개념 노트 LCP / FCP (§0) | `replay/2026-10-20_final-commit_before-final-final-repeat.json` | 녹화 응답 재생 · 최종 커밋 · 5회 | ✅ |
| 4 | 개념 노트 회귀(`React.lazy` 첫 렌더 suspend)와 수정 | `replay/concept-note_before-after-after2.json` (`after` = 수정 전, `after2` = 수정 후 — 최종 커밋과 첫 청크 파일명 동일 `index-BZYPDfT9.js`) | 녹화 응답 재생 · 5회 | ✅ |
| 4-1 | 개념 노트 렌더 결과가 before와 같다 (코드 강조 · 표 포함) | `images/concept-note-unit{11,98,166}-{before,after}.png` — 마크다운 본문 요소 전체 캡처(최대 696 × 16,550px), **세 쌍 모두 PNG 바이트 동일**. DOM 개수도 같음: unit 166 제목 9 · 코드 블록 7 · 강조 토큰 390 · 표 4 / unit 98 제목 10 · 코드 블록 4 · 강조 토큰 235 · 표 5 / unit 11 제목 4 · 표 2 | 녹화 응답 재생 · 412 × 823 DPR 2 · 제한 없음 · `tools/snapshot.mjs` | ✅ (퀴즈 본문은 사용자가 직접 확인) |
| 5 | `/main` LCP 5.96s → 5.36s (직접 측정) | 수치(기록 §6) · `../2026-10-19_main_M_after_trace.json.gz` | DevTools 직접 · 시크릿 창 · 3회 | 참고 — before trace 불일치(아래) |
| 6 | `/learning` Lighthouse LCP 14.92s → 14.49s · FCP 2.72s → 2.42s | `lighthouse/_learning_mobile/` | Lighthouse 12.6.1 · simulated · 3회 | 참고 — 느린 회선 흉내라 글꼴 2MB가 지배 |
| 7 | 스크롤 복원 강제 레이아웃 제거는 효과 없음 | `lighthouse/_learning_mobile_after-vs-exp-noscroll/` | Lighthouse · 3회 | REF-062 참고 |
| 8 | loader 미리 요청: Lighthouse로는 효과가 안 보임 | `lighthouse/_learning_mobile_after-vs-exp-loader/` | Lighthouse · 3회 | REF-062 참고 |

## 2. 남은 한계

1. `/main` before trace(`../2026-10-19_main_M_before_trace.json.gz`)의 LCP는 10.9s로 보고값 6.14s와 다르다 — 시크릿 창 이전 측정으로 추정, 비교에 쓰지 않는다
2. 전날 `/main` · `/learning` 녹화 재생 원본은 덮어써져 없다 — 최종 커밋 재측정(§0)이 대신한다
3. 녹화 재생은 API 응답을 약 180ms로 고정한다 → 실제 서버가 느린 경우는 반영하지 않는다. **코드 변경의 효과만** 본다
4. `/main` CLS는 이번 실행에서 0.018과 0.257로 갈렸다 — 연속학습일 응답과 첫 그리기의 순서에 따라 달라진다(별도 `FIX-` 후보). #299와 무관

## 3. 측정 조건

| 방식 | 조건 |
| --- | --- |
| 녹화 응답 재생 | puppeteer-core 24.10.0 · Chrome 설치본 · CDP CPU 4x + Fast 4G(지연 165ms, 1,012,500 B/s) · 412 × 823 DPR 1.75 모바일 · 캐시 끔 · API 9종 + MBC 글꼴을 녹화본으로 응답(지연 = 165ms + 크기/대역폭) · 녹화에 없는 요청 0건 · 빌드별 포트 동시 서빙 · 번갈아 5회 |
| DevTools 직접 | Chrome 시크릿 창(확장 끔) · 412 × 823 · CPU 4x · Fast 4G · Disable cache · `vite preview` 5173 · 실제 dev API |
| Lighthouse | 12.6.1 Node API · 모바일 기본값(simulated throttling) · 측정 전용 프로필 · 매 회 캐시 삭제 · 번갈아 3회 |

## 4. 도구 (`tools/`)

| 파일 | 용도 |
| --- | --- |
| `replay.mjs` | 녹화 응답 재생 측정 (`node replay.mjs <runs> <route...>`). 포트 5173 · 5174 · 5175 빌드를 번갈아 잰다. 이름은 `BUILD2` · `BUILD3` 환경변수. 결과는 `replay-runs/`에 실행마다 따로 저장 |
| `record.mjs` | 측정 프로필로 실제 API 응답 녹화 → `recordings.json` (기존 녹화에 덧붙임) |
| `measure.mjs` | Lighthouse 번갈아 측정 (`node measure.mjs <route> <runs> mobile <build1,build2>`) |
| `login.mjs` | 측정 프로필 로그인 창 |
| `lookup.mjs` · `source.mjs` | 소스맵으로 압축 위치 → 원래 파일 |
| `chain.mjs` | Lighthouse 보고서에서 요청 체인 |

`recordings.json`은 **로그인 토큰과 계정 응답이 들어 있어 여기 두지 않는다.** `record.mjs`로 다시 만든다.
도구는 scratchpad 경로 기준이라 옮겨 쓰려면 경로(`profile/` 등)를 고쳐야 한다.
