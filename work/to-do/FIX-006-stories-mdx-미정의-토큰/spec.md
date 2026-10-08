---
id: FIX-006
title: Foundations MDX가 미정의 토큰을 참조해 문서 스타일이 깨진다
type: fix
screen: '-'
priority: low
created: 2026-09-01
revised: 2026-09-01
---

# FIX-006 — Foundations MDX가 미정의 토큰을 참조해 문서 스타일이 깨진다

## 배경 · 목표

Storybook Foundations 문서(`apps/web/src/stories/`)가 `tokens.css`에 **정의되지 않은**
CSS 변수를 참조하고 있다. 에러가 나지 않고 구분선·보조 텍스트 색만 조용히 빠지므로
눈으로 보기 전에는 알 수 없다.

디자인 토큰을 보여주는 문서 자체가 잘못된 토큰을 쓰고 있는 상태라 고친다.

## 재현

```bash
pnpm --filter @repo/web storybook
# Foundations/Typography — 행 구분선이 그려지지 않고, 스펙 보조 텍스트가 기본색으로 나온다
# Iconography — 색상 예시의 첫 번째 스와치가 비어 보인다
```

## 원인

`tokens.css`에 있는 neutral 계열은 `--color-neutral-20` / `-60` / `-100` **셋뿐**이다
(그마저도 레거시 호환 토큰이라 제거 대상이다). MDX는 존재하지 않는 이름을 쓰고 있다.

| 파일                          | 줄  | 참조한 변수                        | 상태      |
| ----------------------------- | --- | ---------------------------------- | --------- |
| `src/stories/typography.mdx`  | 21  | `var(--color-neutral-50)`          | ❌ 미정의 |
| `src/stories/typography.mdx`  | 26  | `var(--color-neutral-500)`         | ❌ 미정의 |
| `src/stories/Iconography.mdx` | 101 | `var(--color-primary)`             | ❌ 미정의 |
| `src/stories/Iconography.mdx` | 101 | `var(--color-neutral-600)`, `-300` | ❌ 미정의 |

정식 토큰으로 바꾸면 된다 — 구분선은 `--color-divider-1`, 보조 텍스트는 `--color-text-3`,
브랜드색은 `--color-main`.

## 범위

- `apps/web/src/stories/typography.mdx`
- `apps/web/src/stories/Iconography.mdx`

## Out of Scope

- **`tokens.css` 수정** — 없는 토큰을 새로 만들지 않는다. 이미 있는 정식 토큰으로 바꾼다
- **호환 토큰(`--color-neutral-20/60/100`) 제거** — 별개 작업이다
  (`docs/design-system/README.md` §4의 51개 대장)
- MDX의 다른 스타일·문구 손보기

## 용어 정의 (Ubiquitous Language)

| 용어      | 정의                                                            |
| --------- | --------------------------------------------------------------- |
| 정식 토큰 | `docs/design-system/README.md`에 현재 사용 대상으로 기록된 토큰 |
| 호환 토큰 | 같은 문서의 호환 토큰 대장에 기록된 이전용 토큰                 |

---

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 단위)
      Given Storybook `Foundations/Typography` 문서
      When 페이지를 연다
      Then 각 타입 행 사이에 `--color-divider-1` 색 구분선이 그려진다
- [ ] **AC-2** (범위: 단위)
      Given `src/stories/` 의 MDX 4종
      When `rg -o "var\(--color-[a-z0-9-]*\)" apps/web/src/stories -g "*.mdx"`로 참조를 수집한다
      Then 출력된 모든 변수 이름이 `tokens.css` 에 선언돼 있다

## Changelog

| 날짜       | 요약      | 사유                                                     | 연관 커밋 |
| ---------- | --------- | -------------------------------------------------------- | --------- |
| 2026-09-01 | 항목 생성 | 하네스 design-system 문서 작성 중 발견. 범위 밖이라 분리 | —         |
