# 배포본 CDN 캐시 확인 (2026-11-17)

배포본 `gravit.inuappcenter.kr` (main `b1de1b7e`, v2.1.6)을 처음 열기(cold) / 다시 열기(warm)로 비교했다.
HTML · JS · 이미지는 실제 Cloudflare를 거치고, API만 CDP Fetch로 `2026-11-11_ref082/api-stub.cjs` 응답을 준다.

- 기계: 이 PC (Windows 11, 전원 연결, 여유 메모리 12GB), puppeteer 25.3.0
- 조건: 모바일 412×915 DPR 2.625 · CPU 4배 · 네트워크 제한 없음(실제 회선) · warm은 같은 userDataDir로 브라우저 재시작
- **런북 §2와 다른 조건**이다 (캐시 켬 · 실제 회선 · 배포본). 런북 진단표와 숫자를 비교하지 않는다
- `/learning` 1회만 쟀다. 7회 반복은 하지 않았다 → 시간 값은 참고용, 캐시 동작(아래)은 결정적이라 1회로 판단

## 결론

**캐시 시간 안에 다시 열어도 이미지는 매번 서버에 재검증한다.** 원인은 Cloudflare가 붙여 주는 `Age`다.

| 파일 | Cache-Control | Age (Cloudflare 캐시에 머문 초) | warm 결과 |
| --- | --- | --- | --- |
| `index-DQ5BPaR2.js` | `max-age=14400, must-revalidate` | 881 | 디스크 캐시 (`disk=true`) |
| 행성 · 카드 장식 이미지 11개 | 같음 | **55810** (약 15.5시간) | **네트워크** (`disk=false`, transferSize 300 → 헤더만 오감 = 재검증) |

- 브라우저의 fresh 판정은 `Age + 받은 뒤 지난 시간 < max-age`다. Age 55810 > 14400이라 **도착한 순간부터 stale**이다
- `must-revalidate`라 stale 사본은 재검증 없이 못 쓴다 → 4시간과 상관없이 **항상** 왕복이 생긴다
- Cloudflare 엣지에 4시간 넘게 머문 파일은 모든 사용자에게 같은 일이 생긴다. JS는 최근에 엣지에 다시 들어가 Age가 작았다
- 엣지 위치: `cdn-cgi/trace` → `loc=KR`, `colo=SIN`. 왕복 한 번이 싱가포르까지 간다 (curl TCP 연결 약 100ms)

## #430 수정으로 풀리는가

`max-age=31536000`이면 Age 55810(15.5시간)은 1년보다 훨씬 작아 fresh로 남는다. 배포 후 같은 probe로 warm 이미지가
`disk=true`가 되는지 확인한다.

```bash
node api-stub.cjs   # 2026-11-11_ref082, 포트 4199
MSYS_NO_PATHCONV=1 node revalidate-probe.mjs <puppeteer node_modules/> /learning
```

## 참고 (1회 값, 판정에 쓰지 않음) — `/learning` warm 시간축

| 시점 (ms) | 일 |
| --- | --- |
| 26 → 207 | HTML 재검증 (`max-age=0`, 싱가포르 왕복) |
| 325 → 350 | 진입 JS · CSS 디스크 캐시 |
| 1515 | `auth/reissue` 시작 — 그 전 약 1.2초는 진입 JS 실행 (CPU 4배) |
| 1755 → 1772 | `users` · `chapters` (스텁이라 즉시) |
| 3449 → 3904 | 이미지 11개 재검증. 카드 장식 455ms, 행성 약 90ms씩 |
| 5728 | LCP (카드 장식 이미지) |

`chapters` 응답(1772)부터 이미지 요청(3449)까지 약 1.7초 간격은 이번에 원인을 나누지 않았다. 7회 측정 후 판단한다.

## 파일

- `prod-cache.mjs` — cold/warm 시간축 · LCP · 리소스 타이밍 (`results-smoke/prod-cache.json`이 위 1회 기록)
- `revalidate-probe.mjs` — warm에서 파일별 `fromDiskCache` · Age
