# 웹 성능 측정 가이드

2026-10-11 대화에서 정리한 내용. 처음 측정할 때 이 문서를 위에서부터 따라 하면 된다.
측정 기록은 `measurement-template.md`를 `records/`에 복사해서 쓴다.

> **브랜치를 확인하고 빌드한다.** AI면접 화면은 `feat/#270/interview` 계열 브랜치에만 있고 `develop`에는 없다.
> 기록의 「브랜치 / 커밋」 칸을 꼭 채운다. 개선 전후는 같은 브랜치에서 잰다.

> 이 폴더는 `perf/web-performance` 브랜치에서 여러 기계(맥 · Windows)가 함께 쓴다. 측정 원본을 그대로 남기려고
> `.prettierignore`에서 뺐다. 고칠 작업은 `work/to-do/`의 항목으로 뽑는다.

---

## 0. 한눈에 보기

| 무엇을 | 도구 | 언제 |
| --- | --- | --- |
| 첫 로딩 (LCP · CLS) | Performance 패널 **Record and reload** (↻ 버튼) | 라우트마다 |
| 클릭·입력 반응 (INP) | Performance 패널 **Record** (● 버튼) | 액션마다 |
| 점수 · 고칠 목록 · TBT | Lighthouse | ★ 화면만, 한 번씩 |
| 진짜 사용자 환경 | 안드로이드 실기기 WebView + `chrome://inspect` | ★ 화면만, 나중에 |

### 좋은 값 기준 (Core Web Vitals)

| 지표 | 뜻 | 좋음 | 개선 필요 | 나쁨 |
| --- | --- | --- | --- | --- |
| FCP | 첫 글자·그림이 그려지기까지 | ≤ 1.8s | 1.8 ~ 3.0s | > 3.0s |
| **LCP** | 화면에서 가장 큰 요소가 그려지기까지 | ≤ 2.5s | 2.5 ~ 4.0s | > 4.0s |
| **CLS** | 로딩 중 레이아웃이 밀린 정도 | ≤ 0.1 | 0.1 ~ 0.25 | > 0.25 |
| **INP** | 클릭·입력 후 화면이 바뀌기까지 (가장 느린 상호작용) | ≤ 200ms | 200 ~ 500ms | > 500ms |
| TBT | 첫 화면 뒤 메인 스레드가 막힌 총 시간. INP의 실험실 대체 지표 | < 200ms | 200 ~ 600ms | > 600ms |

**이 표가 경계값의 유일한 기준이다.** 자동 측정 런북(`automated-runbook.md`)도 여기를 읽는다.

- **나쁨** → 고친다. **개선 필요** → 다른 화면과 원인이 같으면 묶어서 고친다. **좋음** → 고치지 않는다.
- 우리 값은 CPU 4배 · Fast 4G **실험실 값**이다. 실제 사용자 값(필드 p75)과 다르다. 같은 조건끼리만 비교한다.
- 원인별 해결법은 `causes-and-fixes.md`, AI에게 측정을 맡길 때는 `automated-runbook.md`.

---

## 1. 측정용 서버 띄우기

**dev 서버로 재지 않는다.** `pnpm dev`는 압축 전 코드 + 개발용 검사가 섞여 실제보다 훨씬 느리다.

```bash
# dev 서버를 먼저 끈다 (같은 포트를 쓴다)
pnpm --filter @repo/web build
pnpm --filter @repo/web preview -- --port 5173
```

- 주소는 평소처럼 `http://localhost:5173`
- **포트는 꼭 5173.** preview 기본값(4173)이면
  - 로그인 토큰이 `localStorage`에 있어서 포트가 바뀌면 로그아웃 상태가 된다
  - `VITE_API_PROXY=false`라 브라우저가 백엔드에 직접 요청하는데, 4173은 백엔드 CORS 허용 목록에 없을 가능성이 크다 (추측, 미확인)
- **코드를 고치면 다시 `build`해야 반영된다.** preview는 자동 새로고침이 없다.
- `.env.local`의 `VITE_ENABLE_API_MOCKING`
  - `false` → 실제 dev 서버 응답 기준 (현재 설정)
  - `true` → API 속도가 일정해서 이미지·렌더링만 비교할 때 편하다
  - **개선 전후는 반드시 같은 값으로 잰다**

## 2. 브라우저 준비

- **시크릿 창**에서 연다 (확장 프로그램이 숫자를 흐린다). 시크릿 창에서 한 번 로그인해 둔다.
- ⚠️ **시크릿 창이어도 「시크릿 모드에서 허용」된 확장은 실행된다.** `chrome://extensions`에서 확인해 끈다.
  특히 **React Developer Tools는 React가 그릴 때마다 끼어들어 CPU 측정을 부풀린다.**
  실제 사례 (2026-10-12): `/main` LCP 6.24s → 끄고 4.96s. 1.3초가 확장 몫이었다.
  Coverage 패널에 `chrome-extension://...` 파일이 보이면 확장이 켜져 있다는 뜻이다.
- DevTools → **Performance** 패널 → 오른쪽 위 ⚙️
  - CPU: **4x slowdown** (목록에 "Mid-tier mobile" 보정 프리셋이 있으면 그걸 써도 된다. 한 번 정하면 계속 같은 걸 쓴다)
  - Network: 로딩 측정은 **Fast 4G**, INP 측정은 **No throttling**
- 첫 방문을 잴 때는 Network 패널의 **Disable cache**를 켠다. 재방문을 잴 때는 끈다.
- **뷰포트를 정한다.** DevTools의 Device toolbar(📱 아이콘, `Ctrl+Shift+M`)로 모바일 기기를 고른다.
  이 앱은 768px(`md`)에서 화면 구성이 바뀌고 받는 이미지도 달라진다 (리그 배경: 모바일 66KB / 데스크톱 1.9MB).
  앱(WebView) 사용자가 기준이라 **모바일을 먼저** 재고, 레이아웃이 갈리는 화면(메인 · 개념 노트 · 리그)만 데스크톱을 추가한다.

> **왜 CPU 4x?** Lighthouse 모바일 기준과 같아서 팀원과 숫자를 맞추기 쉽다. 우리 앱은 저사양
> 안드로이드 WebView에서도 돌기 때문에 개발 PC 속도로는 판단하지 않는다.
>
> **왜 INP는 Network를 안 거나?** INP는 클릭부터 다음 화면이 그려질 때까지의 **메인 스레드
> 작업**만 잰다. API 응답을 기다리는 시간은 포함되지 않는다. 네트워크를 같이 걸면 원인 구분만 어려워진다.

## 3. 로딩 측정 (LCP · CLS)

1. **재고 싶은 라우트 주소를 주소창에 직접 입력**해서 들어간다
2. Performance 패널 **↻ (Record and reload)**
3. 끝날 때까지 **아무것도 누르지 않는다**
4. LCP · LCP 요소 · CLS를 적는다. 전송량·요청 수는 Network 패널 아래 상태줄 (`N requests · N kB transferred`)
5. 3번 반복해서 **가운데 값**을 적는다

### 왜 이렇게 해야 하나 (헷갈렸던 것)

- **LCP는 첫 클릭·스크롤에서 측정이 끝난다.** 로딩 중에는 "지금까지 가장 큰 요소"로 계속 바뀐다
  (스켈레톤 → 실제 목록). 사용자가 건드리는 순간 그 값으로 확정된다.
- **새로고침하면 LCP·INP가 둘 다 처음부터.** 그래서 한 번에 같이 보려고 하면 값이 왔다 갔다 한다.
  로딩과 반응은 **따로** 잰다.
- **SPA에서 앱 안 이동은 LCP를 다시 재지 않는다.** `/interview/new/job` → `/stack`처럼 라우터로 이동하면
  브라우저는 페이지가 바뀐 줄 모른다. 그래서 **주소창 직접 진입**으로 잰다.
- 동적 라우트(`$lessonId` 등)는 **잰 ID를 비고에 남긴다.** 개선 후 같은 데이터로 다시 재야 비교가 된다.

## 4. 반응 측정 (INP)

1. **시크릿 창**에서 Network를 **No throttling**으로 바꾼다 (CPU 4x는 유지)
2. **새로고침**하고 페이지가 다 뜰 때까지 기다린다
3. Performance 패널 **● (Record)**
4. **재고 싶은 동작만, 한 번** 한다 (예: 보기 선택)
5. 기록을 멈추고 **Interactions** 줄에서 그 막대를 클릭
6. 세 구간 중 가장 긴 것을 적는다
7. 다음 동작을 잴 때는 **2번부터 다시** (새로고침)

### ⚠️ 규칙: 새로고침 후 첫 클릭 값을 적는다

**같은 코드라도 첫 실행은 느리다.** 브라우저는 JS 함수를 처음 실행할 때 그 자리에서 컴파일하고,
React Query 같은 라이브러리도 첫 호출 때 준비 작업을 한다. 두 번째부터는 이미 준비돼 있어 빠르다.

> 실제 사례 (2026-10-11, `/` 로그인, CPU 4x): 같은 코드인 구글·카카오 버튼을 연달아 눌렀더니
> **먼저 누른 구글이 200ms, 나중에 누른 카카오가 44ms**였다. Call tree의 모든 단계가 고르게 약 5배였다
> (마이크로 태스크 140ms vs 27ms, onClick 57ms vs 12ms). 특정 함수만 느린 게 아니라 전부 같은 비율로
> 느리면 코드가 아니라 **조건 차이**(첫 실행, CPU 설정, 확장 프로그램)를 의심한다.

- 로그인 버튼처럼 **사용자가 한 번만 누르는 동작은 첫 클릭이 진짜 사용자 경험**이다
- 그래서 동작마다 새로고침하고 **첫 클릭 값**을 적는다. 같은 화면의 여러 버튼을 연달아 눌러 비교하지 않는다
- 퀴즈 "다음 문제"처럼 반복하는 동작은 첫 번째 값과 함께 **몇 번째인지**를 원인 메모에 적어도 된다

### ⚠️ 시크릿 창이 아니면 숫자가 오염된다

비밀번호 관리자·번역·문법 확장 프로그램은 페이지의 클릭을 같이 듣는다. 일반 창에서 잰 값은 버린다.
Call tree에서 출처가 `chrome-extension://...`이면 확장 프로그램 탓이다.

### 녹화 읽는 법

- **Interactions 줄의 막대 모양 = 세 구간.** 왼쪽 수염 Input delay · 몸통 Processing · 오른쪽 수염 Presentation.
  막대를 클릭하면 Summary 탭에 숫자가 나온다
- 숫자만 필요하면 녹화하지 않은 Performance 패널 첫 화면(Live metrics)의 **Interactions 목록**이 제일 빠르다
- **Call tree** = "이 안에서 무엇을 불렀나" (위에서 아래로). **Bottom-up** = "시간을 직접 쓴 함수와 누가 불렀나".
  원인을 따라 내려갈 때는 Call tree에서 ▶를 펼치며 **전체 시간이 큰 쪽**을 따라간다
- 각 줄은 `자기 시간(Self) | 전체 시간(Total) | 이름`. 자기 시간은 작은데 전체 시간이 크면 **안쪽을 펼친다**
- **`이벤트: pointerup` 아래에 click 처리도 들어 있다.** Chrome은 손을 떼는 처리 안에서 click을 이어서 발생시킨다
  (`이벤트: DOMActivate`). 우리 코드에 pointerup 처리기가 없어도 `onClick` 시간이 여기 잡힌다
- `마이크로 태스크 실행` = Promise 후속 처리. React Query 요청 시작·상태 갱신이 주로 여기 잡힌다

| 구간 | 뜻 | 길면 의심할 것 |
| --- | --- | --- |
| **Input delay** | 다른 작업에 막혀 처리를 시작 못 한 시간 | 그 순간 돌던 다른 작업 (로딩 직후 렌더, 타이머, 큰 JSON 파싱) |
| **Processing duration** | 내 이벤트 핸들러 + React 리렌더 시간 | 너무 넓게 리렌더됨, selector 없는 store 구독, 무거운 계산 |
| **Presentation delay** | 화면을 다시 그리는 시간 | DOM이 너무 큼, 긴 목록, 무거운 CSS (그림자·blur) |

### 우리 서비스에서 의심해 볼 곳

- 퀴즈: 객관식 보기 선택(바로 채점), 주관식 입력(글자마다), 다음 문제
- 리그 티어 선택 (순위 목록이 다시 그려진다)
- 텍스트 입력 (문의 작성, 온보딩 닉네임)
- selector 없이 Zustand store 전체를 구독하는 컴포넌트

> **INP는 클릭 · 탭 · 키 입력만 잰다. 스크롤은 들어가지 않는다.** 스크롤 버벅임은 Performance 패널의
> Frames 줄(끊긴 프레임)로 따로 본다. 개념 노트(`react-markdown` + `refractor`)처럼 클릭할 게 없는 화면은
> 로딩 측정과 스크롤 프레임으로 본다.

### 원인을 파고들 때

빌드 결과물은 함수 이름이 압축돼서 "어느 컴포넌트가 느린지" 읽기 어렵다.
**숫자는 build+preview로 재고, 원인 찾기는 dev 서버에서** 같은 동작을 Performance 패널로 녹화해 본다.
React 19.2부터는 dev 빌드에서 Performance 패널에 React 전용 트랙(Components 등)이 보인다.
dev 서버의 **숫자 자체는 믿지 않는다.**

함수 이름이 `MS`, `Xe`처럼 압축돼 보일 때는 **측정용으로만** 소스맵을 켜고 빌드하면 원래 이름이 보인다.
설정 파일을 바꾸지 않으므로 커밋할 것이 없다. 숫자 기록은 평소 빌드로 한다.

```bash
pnpm --filter @repo/web exec vite build --sourcemap
```

## 4-1. 원인 좁히기 — 오늘 쓴 순서

`/main` LCP를 이 순서로 내려가 원인을 찾았다 (2026-10-12). 다른 화면도 같은 순서로 본다.

1. **LCP 요소 확인** — 무엇이 마지막으로 그려졌나. 후보 전체는 콘솔에서 본다

   ```js
   new PerformanceObserver((list) => {
     list.getEntries().forEach((entry) => {
       console.log(`LCP 후보 ${Math.round(entry.startTime)}ms`, entry.element, entry.url || '(텍스트)', `크기 ${entry.size}`);
     });
   }).observe({ type: 'largest-contentful-paint', buffered: true });
   ```

   LCP는 최종값 하나지만 로딩 중 "가장 큰 요소"가 바뀔 때마다 후보가 생긴다. **마지막 줄이 최종 LCP.**
2. **이미지라면 Network 탭에서 그 요청의 시작 시각과 다운로드 시간** — 다운로드는 짧은데 시작이 늦으면
   **늦게 발견된 것**(Load delay)이다. 이미지를 줄여도 소용없다
3. **CPU 제한을 끄고 다시 재기** — 크게 줄면 **JS 실행이 원인** (`/main`: 4x 4.96s → 제한 없음 0.94s)
4. **Coverage** — 그 화면에서 안 쓰는 코드 비율. DevTools 안을 클릭 → `Ctrl+Shift+P` → `적용 범위` 또는 `coverage` →
   **적용 범위 표시** (또는 ⋮ → 도구 더보기 → 적용 범위). 패널의 ↻로 새로고침하며 기록
5. **번들 지도** — 첫 덩어리에 무엇이 들었고 누가 끌고 왔나

   ```powershell
   cd apps\web
   pnpm dlx vite-bundle-visualizer   # npx 대신 pnpm dlx (저장소 규칙: pnpm 고정)
   ```

   설치 없이 임시로 받아 실행하고 브라우저에 지도를 띄운다 (`stats.html`). 크기는 **압축 전** 기준이라 비율로 본다.
   끝나면 측정용 빌드를 다시 만든다.
   ⚠️ 지도는 **임시 폴더**(`%TEMP%/tmp-…/stats.html`)에 만들어져 언제든 지워질 수 있다. 실행할 때마다 **그 시점 코드로 새로** 만들어진다.
   개선 전후 비교용으로 남길 것은 `evidence/{날짜}_bundle_visualizer_{before|after}.html`로 복사해 둔다.

### pnpm 명령 헷갈린 것

| 하고 싶은 것 | 명령 (루트에서) |
| --- | --- |
| package.json **스크립트** 실행 | `pnpm --filter @repo/web build` |
| 설치된 **도구를 직접** 실행 | `pnpm --filter @repo/web exec vite build` (`exec` 빠지면 "no vite script") |
| 임시 도구 실행 | 그 앱 폴더로 들어가서 `pnpm dlx <도구>` (`--filter`와 같이 안 쓴다) |

## 5. Lighthouse

### 모든 페이지에 하나?

**아니다. ★ 화면만, 한 번씩.** Lighthouse의 쓸모는 "점수"보다 **Diagnostics · Opportunities 목록**
(무엇을 고치면 얼마나 줄어드는지)이다. 같은 앱 셸을 공유하는 페이지들은 비슷한 항목이 반복해서 나온다.
LCP·CLS 숫자 비교는 3장의 Performance 패널 측정으로 한다.

나중에 반복 측정이 필요해지면 자동화할 수 있다 (Lighthouse CLI를 로그인된 Chrome에 붙이거나,
Puppeteer 기반 user flow). **지금은 수동으로 충분하다.**

### 실행

1. 시크릿 창, 측정할 라우트로 이동
2. DevTools → **Lighthouse** 탭
3. Mode **Navigation** / Device **Mobile** / Categories **Performance**만
4. ⚙️ 에서 **Clear storage 체크 해제** ← 중요
5. **Analyze page load**

> ⚠️ **Clear storage를 끄는 이유**: 켜 두면 Lighthouse가 `localStorage`를 지워 **로그인 토큰이 사라지고**,
> 로그인 화면을 재게 된다. 끄면 캐시도 남아서 **재방문에 가까운 숫자**가 나온다. 그래서 첫 방문
> 숫자는 3장(Disable cache)으로 잰다. 로그인 전 화면(`/`)은 켜도 된다.

### 읽는 법

- 맨 위 점수는 그날 PC 상태에 따라 몇 점씩 흔들린다. **점수보다 LCP · CLS · TBT 숫자**를 본다
- 아래 **Diagnostics · Opportunities**에서 고칠 거리를 뽑아 기록 문서의 "다음 할 일"로 옮긴다
- 예상되는 항목: "Properly size images" (스택 아이콘), "Reduce unused JavaScript", 폰트 관련

### Timespan 모드 (선택)

Mode를 **Timespan**으로 두면 녹화 동안의 상호작용을 재서 INP와 진단을 보여준다.
INP를 Performance 패널 대신 리포트 형태로 남기고 싶을 때 쓴다.

## 6. 증거 자료 — 캡처를 떠야 하나?

**스크린샷보다 "다시 열어볼 수 있는 파일"을 남긴다.** 숫자만 찍힌 캡처는 나중에 원인을 다시 볼 수 없다.

| 무엇을 | 어떻게 | 왜 |
| --- | --- | --- |
| **Lighthouse 리포트** | 리포트 우상단 ⋮ → **Save as HTML** | 점수 + 진단 전체가 남는다. 나중에 브라우저로 다시 연다 |
| **Performance 기록** | 기록 후 패널 상단 ⬇ (**Save trace**) | 나중에 Performance 패널에 다시 불러와 원인을 볼 수 있다 |
| 스크린샷 | 필요할 때만 | **포트폴리오·발표용**: 개선 전후 나란히, Network 상태줄 전송량, 필름스트립 |

- **이름 규칙**: `{날짜}_{라우트}_{도구}_{before|after}` → `2026-10-11_league_lighthouse_before.html`
- **보관 위치**: `performance/evidence/`. trace는 수십 MB가 될 수 있으니 `.gz`로 줄여 둔다.
- 기록 문서의 "증거" 칸에 파일 이름만 적는다.

## 7. 실기기 (안드로이드 WebView)

스로틀링은 흉내다. ★ 화면의 개선 전후는 실기기에서 한 번 확인하면 설득력이 크게 올라간다.

1. 폰을 USB로 연결하고 개발자 옵션 → USB 디버깅을 켠다
2. PC Chrome에서 `chrome://inspect` → 앱의 WebView 항목에서 **inspect**
3. 앱 쪽 `react-native-webview`에 `webviewDebuggingEnabled`가 켜져 있어야 보인다 (`apps/native` 확인 필요)

## 8. 처음 고칠 후보 (2026-10-11 `feat/#294` 빌드의 `dist/assets` 기준)

재기 전부터 보이는 큰 파일. 측정으로 실제 영향(LCP를 늦추는지)을 확인한 뒤 고친다.

| 파일 | 크기 | 영향 범위 | 개선 방향 |
| --- | --- | --- | --- |
| `PretendardVariable.woff2` | 2.0MB | **모든 화면** | 필요한 글자만 나눠 받는 dynamic subset |
| `league-bg-desktop.png` | 1.9MB | 리그 (**데스크톱만**. 모바일은 66KB짜리를 따로 받는다) | 리사이즈 + webp |
| `index-*.js` (메인 JS) | 864KB | 모든 화면 첫 로딩 | 무엇이 들어 있는지 번들 분석 → 라우트 분할 |
| 스택 아이콘 PNG 12개 | 합계 약 7.7MB (각 1200×1200) | 면접 설정 스택 단계 (`feat/#270/interview` 브랜치에만 있다) | **표시 크기 60px → 120×120으로 리사이즈** + webp, 또는 SVG로 받기 |

### 이미지 개선 메모

- **포맷보다 크기가 먼저다.** 1200px를 webp로 바꾸는 것보다 120px로 줄이는 효과가 훨씬 크다.
- 아이콘처럼 작은 이미지는 **한 번 변환해서 교체** (Squoosh 웹 도구 또는 `sharp-cli`). 의존성을 늘리지 않는다.
- webp는 우리가 지원하는 iOS·Android WebView에서 모두 동작한다. `<picture>` 대체 이미지가 필요 없다.
- avif는 큰 사진·일러스트에서만 이득이다. 작은 아이콘은 차이가 미미하고 디코딩 비용이 더 크다.
- 큰 이미지가 계속 들어오는 구조가 되면 그때 `vite-imagetools`(빌드 시 리사이즈·변환) 도입을 논의한다.
- `<img>`에는 `width`/`height`를 준다 → 로드될 때 레이아웃이 밀리지 않는다 (CLS)
- 첫 화면의 가장 큰 이미지(LCP 후보)는 `loading="lazy"`를 빼고 `fetchPriority="high"`
- 화면 아래쪽 이미지는 `loading="lazy" decoding="async"`

### `preload()` 메모 (React 19, `react-dom`)

```tsx
import { preload } from 'react-dom';

// 다음 화면에서 쓸 이미지를 지금 화면에 있을 때 미리 받아 둔다.
preload(loadingImage, { as: 'image', fetchPriority: 'low' });
```

- **효과 있음**: 지금 화면에 없는 이미지 (다음 화면, 데이터가 와야 그려지는 이미지, CSS 배경 이미지)
- **효과 거의 없음**: 같은 컴포넌트가 바로 `<img>`로 그리는 이미지 → `fetchPriority="high"`만 준다
- 스택 목록 prefetch(직군을 누르는 순간 미리 요청)와 같은 원리다. "다음에 볼 것을 미리 받는다"

## 9. 같이 공부할 주제 (나중에)

- **상태바 색** — 모바일 웹은 `<meta name="theme-color">` (React 19는 컴포넌트 안 `<meta>`를 `<head>`로 올린다).
  앱(Expo WebView)은 네이티브가 그리므로 웹 → `postMessage` → 네이티브 `expo-status-bar` 연결이 필요하다
- **키보드가 올라올 때 레이아웃** — iOS input 16px 미만 확대, viewport meta `interactive-widget=resizes-content`,
  `dvh`, `VisualViewport` API. 하단 고정 버튼과 직접 관련된다
- **TanStack Query** — `staleTime`은 데이터가 바뀌는 주기로 정한다

  | 데이터 | 예 | staleTime |
  | --- | --- | --- |
  | 서버가 정한 목록 | 스택, CS 분야 | `Infinity` |
  | 사용자 정보 | 프로필 | 몇 분 |
  | 계속 바뀌는 것 | 리그 순위 | 짧게 또는 주기적으로 다시 받기 |

  쿼리키는 orval이 만들어 주므로 "어떻게 묶어서 무효화할까"가 공부 포인트 (`.claude/rules/api-convention.md` §4)
- **INP 실사용자 측정** — `web-vitals` 라이브러리의 `onINP` (attribution 빌드)로 어떤 요소가 느렸는지 로그 수집
