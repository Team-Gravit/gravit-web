# 글꼴 로딩 방식 비교 — 근거 모음 (REF-064)

측정일 2026-10-21 · 브랜치 `perf/#299/entry-chunk`(커밋 `fb972219`) 위에서 글꼴 관련 파일만 바꿔 빌드했다.
이 문서는 **주장 ↔ 근거 파일** 색인이다. 해석은 `work/to-do/REF-064-글꼴-단일-subset/spec.md`.

## 0. 비교한 방식

| 이름 | 내용 |
| --- | --- |
| `before-self-host` | HEAD 그대로. `PretendardVariable.woff2` 전체(2,057,688 B) 자체 호스팅 |
| `after-cdn-subset` | jsdelivr `pretendardvariable-dynamic-subset.min.css`를 `<head>`에서 stylesheet로 로드 (`cdn-attempt.diff`) |
| `cdn-preload` | 위와 같은 CSS를 `rel="preload" as="style"` + `onload`로 비차단 로드 |
| `self-subset` | 변수 글꼴을 Pretendard 배포 글자 목록으로 잘라 만든 단일 파일(653,456 B) 자체 호스팅 (`font/`) |

## 1. 결과 (중앙값, ms)

| 실행 | 화면 | before | cdn | 3번째 | 3번째-repeat |
| --- | --- | --- | --- | --- | --- |
| 1 (`1_before-cdn.json`) | `/main` LCP | 3916 | 4124 | — | — |
| | `/learning` LCP | 4576 | 5108 | — | — |
| | 개념 노트 LCP | 7044 | 8056 | — | — |
| 2 (`2_before-cdn-preload-x2.json`) | `/main` LCP | 4432 | 4788 | preload 4868 | 4388 |
| | `/learning` LCP | 5908 | 5744 | preload 6092 | 6220 |
| | 개념 노트 LCP | 8288 | 9548 | preload 9828 | 9824 |
| 3 (`3_before-cdn-subset-x2.json`) | `/main` LCP | 4080 | 4264 | subset 4132 | 4224 |
| | `/learning` LCP | 5108 | 5428 | subset 4988 | 5024 |
| | 개념 노트 LCP | 7644 | 9104 | subset 7748 | 7892 |
| 3 | 글꼴 마지막 응답 (`/main` · `/learning` · 개념 노트) | 6000 · 6170 · 5640 | 5803 · 4820 · 8371 | subset 4424 · 4083 · 4005 | 4536 · 4158 · 4122 |
| 3 | 받은 글꼴 바이트 | 2,058,012 | 255K · 177K · 388K | 653K | 653K |

- 절대값은 실행마다 다르다. **같은 실행 안에서만 비교한다**
- `-repeat` = 같은 빌드를 다른 포트에 한 번 더 띄운 것 → 흔들림 크기
- 세 실행 모두 글꼴 로드 오류 0 · 녹화에 없는 요청 0. 렌더 글꼴(CDP `getPlatformFontsForNode`)은 모든 빌드에서 Pretendard

## 2. 측정 조건

#299와 같다(`../2026-10-20_299-markdown-lazy/README.md` §3). 차이:

- API · MBC 글꼴은 녹화본으로 응답하고, **Pretendard 요청만 실제 네트워크로 보낸다**(CDP Fast 4G 제한 적용). CDN 방식은 실제 jsdelivr 응답 속도가 섞인다
- 포트 5174~5177 (5173은 dev 서버가 사용 중이라 쓰지 않음)
- `recordings.json`은 #299 녹화본(2026-10-19~20) 재사용. 토큰이 들어 있어 여기 두지 않는다

## 3. subset 파일 만드는 법

```bash
# pretendard@1.3.9 npm tarball 의 dist/web/variable/woff2/PretendardVariable.woff2 (repo 파일과 바이트 동일) · subset_glyphs.txt
python -m fontTools.subset PretendardVariable.woff2 \
  --text-file=subset_glyphs.txt \
  --unicodes="U+0000-00FF,U+2000-206F,U+2190-21FF,U+2460-24FF,U+25A0-25FF,U+2B00-2BFF,U+3000-303F,U+3131-318E,U+FF00-FFEF" \
  --layout-features='*' --flavor=woff2 --output-file=PretendardVariable.subset.woff2
```

fonttools 4.51.0 · brotli. 결과: 글리프 매핑 3,995개(원본 14,336) · 한글 음절 2,780자(원본 11,172) · wght 45–930 유지.
녹화된 API 응답·`apps/web/src` 문자열 중 subset에 없는 문자는 이모지(원본에도 없음)와 주석 속 `⭢`뿐이었다.

## 4. 파일

| 파일 | 내용 |
| --- | --- |
| `replay/*.json` | 실행별 원본 (회차별 LCP·FCP·CLS·글꼴 요청·렌더 글꼴) |
| `tools/font-replay.mjs` | 측정 스크립트. #299 `replay.mjs` 기반, 글꼴 요청 집계 추가. 경로는 scratchpad 기준 |
| `font/` | 만든 subset 파일 · 글자 목록 |
| `cdn-attempt.diff` | 시도했던 CDN 방식 변경 (커밋하지 않음) |

## 5. 4회차 — 자체 호스팅 dynamic subset (`replay/4_before-subset-selfdynamic-x2.json`)

`pretendard@1.3.9`의 `woff2-dynamic-subset/` 92개를 `fonts/dynamic/`에 두고 공식 CSS의 `@font-face` 93개를 `base.css`에 넣어 빌드(측정 후 제거).

| 화면 | before | self-subset | self-dynamic | dynamic-repeat |
| --- | --- | --- | --- | --- |
| `/main` LCP | 4052 | 4320 | 4644 | 4424 |
| `/learning` LCP | 5224 | 5100 | 5456 | 5488 |
| 개념 노트 LCP | 7716 | 7972 | 7964 | 8160 |
| 글꼴 마지막 응답 (main · learning · 개념 노트) | 6000 · 6263 · 5697 | 4599 · 4115 · 4009 | 6331 · 4985 · 7387 | 6161 · 4988 · 7541 |
| 받은 양 · 요청 | 2010K · 1 | 638K · 1 | 233K·9 · 158K·6 · 361K·14 | 같음 |

- 자체 호스팅해도 개념 노트 dynamic 조각이 늦게 끝난다(7.39s) → 늦은 요청은 dynamic subset 구조 탓
- LCP 손해는 CDN(+1.46s, 3회차)보다 작다(+0.25s)
