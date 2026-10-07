---
id: 'FEAT-051'
validated: '2026-09-26'
mode: 'feature'
---

# FEAT-051 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                             | 결과                                                                                         |
| --- | --------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                      | ✅                                                                                           |
| 2   | 타입            | `pnpm check-types`                               | ✅                                                                                           |
| 3   | 테스트          | `pnpm test`                                      | ✅ 81 files · 443 tests                                                                      |
| 4   | 빌드            | `pnpm build`                                     | ✅ 개념노트 청크 gzip 52.8KB → 79.4KB. 글꼴 woff2 조각 93개는 별도 파일로 필요할 때만 받는다 |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>` | ✅                                                                                           |
| 6   | generated 경계  | 해당 없음 (API 변경 없음)                        | ✅                                                                                           |

## 2. 요구사항 ↔ 구현 대조

| #   | AC                      | 구현 위치 · 근거 테스트                                                                           | 상태 |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------- | ---- |
| 1   | AC-1 언어명 · 복사 · 폭 | `markdown.tsx` `MarkdownCodeBlock` · `markdown.test.tsx` 「코드 블록의 언어를 표시하고…」 (Codex) | ✅   |
| 2   | AC-2 Prism 토큰 분할    | `highlight-code.ts` `rehypeHighlightCode` · 「등록된 언어의 코드 블록을…」                        | ✅   |
| 3   | AC-3 vue → 마크업       | `refractor.alias({ markup: ['vue'] })` · 「vue 는 마크업으로 강조한다」                           | ✅   |
| 4   | AC-4 강조하지 않는 경우 | 「언어가 없거나 등록되지 않은 블록은…」 · 「인라인 code 는 강조하지 않는다」                      | ✅   |
| 5   | AC-5 두 화면 시각 확인  | 수동 — 모바일 시트 · 웹 카드                                                                      | ⬜   |

## 3. 기준 문서 갱신

| 대상                                 | 갱신 내용                  | 상태 |
| ------------------------------------ | -------------------------- | ---- |
| `apps/web/src/app/styles/tokens.css` | `ALIAS - Code (잠정)` 11개 | ✅   |
| `apps/web/src/stories/colors.mdx`    | `Code (잠정)` 팔레트       | ✅   |
| `docs/design-system/README.md`       | §3-7 코드 색 — 잠정        | ✅   |
| `docs/implementation-status.md`      | 해당 없음 (화면 추가 없음) | ✅   |
| `docs/migration-status.md`           | 해당 없음                  | ✅   |

## 메모

- 전체 검증 중 lint 가 한 번 실패했다. 동시에 돌던 Vite 가 만든 `vite.config.ts.timestamp-*.mjs` 를 eslint 가 읽는 사이 지워졌다. 코드 문제가 아니며 재실행에서 통과했다.
- 코드 글꼴은 별도 웹폰트 없이 Tailwind 기본 `font-mono` 스택을 사용한다 (2026-10-08 사용자 결정).

- 등록 언어를 추가하면 `highlight-code.ts` 의 목록과 번들 크기를 함께 본다.
- 코드 블록 머리의 언어 표시 이름(`LANGUAGE_LABELS`)에 vue · http · yaml 등이 없어 대문자(`VUE`)로 나온다. 필요하면 표에 추가한다.
