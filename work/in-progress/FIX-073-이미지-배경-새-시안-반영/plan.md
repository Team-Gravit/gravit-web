---
id: 'FIX-073'
planned: '2026-10-30'
mode: 'design-fix'
---

# FIX-073 구현 계획 (확인 필요 5개 판정 완료 — 승인 전)

> `ai-plan` 산출물. **사용자 승인 전에는 구현으로 넘어가지 않는다.**
> 실행 이슈 3개(`issues.md` Issue 1 ~ 3, GitHub #357 ~ #359)와 spec에 추가된 리그 배경(GitHub 미등록)을 다룬다.

## 0. 판정

`FIX-` — 새 시안으로 화면 모양이 바뀐다(그라데이션 + 투명 장식). REF-054(모양 불변)에서 `refactor-checklist.md` §2에 따라 분리한 작업이다.

### 0-1. 착수 전 확인

| 질문          | 답       | 근거                                                                                                                                |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 목표와 비목표 | 예       | 목표: 세 배경(+ 리그)을 시안 구조로 바꾸고 공용 캔버스로 묶는다. 비목표: spec `Out of Scope`(형식만 바꾸는 작업 · starfield · 문구) |
| 시안 근거     | 예       | Figma 노드 · 그라데이션 계산 · 장식 내보내기(spec 「시안 · 에셋」). 리그는 노드만 있고 계산 · 내보내기 전(§4-3)                     |
| 보존할 동작   | 예       | 계약 C4 ~ C8. 테스트 `hero-greeting` · `chapter-card` · `unit-card` · `space-background` · 로그인 · 온보딩                          |
| 검증 방법     | 예(조건) | RTL + Figma 원본 픽셀 비교 + LCP. **로그인 화면 밖(`/main` · `/learning`) LCP는 측정 때 로그인이 한 번 필요하다**                   |
| 독립 완료     | 예       | Issue 1이 공용 캔버스를 만들고, 2 · 3 · 리그는 그 위에서 서로 독립                                                                  |
| 위험 격리     | 예       | 생성물 · 라우트 · 인증을 건드리지 않는다. `SpaceBackground` 기본 변형 사용처 4곳은 Issue 1에서 함께 확인                            |

## 1. 영향 분석

| 구분 | 파일                                                                                                                                                                                                  | 이슈 |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 수정 | `app/styles/tokens.css` · `app/styles/utilities.css`(`.bg-space-gradient`) · `docs/design-system/README.md` · `src/stories/` Foundations(색)                                                          | 1    |
| 신규 | `shared/ui/gradient-canvas/{gradient-canvas.tsx, .test.tsx, .stories.tsx, index.ts}` (이름은 §4-1과 함께 확정)                                                                                        | 1    |
| 수정 | `shared/ui/layout/space-background.tsx` 기본 변형 · `assets/`                                                                                                                                         | 1    |
| 수정 | `widgets/hero-greeting/ui/hero-greeting.tsx` · `assets/` · `pages/my/ui/profile-card.tsx` · `pages/main/ui/main-page-narrow.tsx` · `pages/my/ui/my-page-layout.tsx` · `shared/config/space-colors.ts` | 2    |
| 수정 | `entities/learning/ui/chapter-card.tsx` · `unit-card.tsx` · `assets/`                                                                                                                                 | 3    |
| 수정 | `pages/league/ui/league-page.tsx` · `assets/` · `pages/lesson-result/ui/result-background.tsx` · `assets/` (장식은 Issue 1 공용 에셋 재사용)                                                          | 리그 |

`SpaceBackground` 기본 변형 사용처(2026-10-30 `rg`): 로그인 넓은 · 온보딩 넓은 · 온보딩 완료 넓은 · 모달 — 4곳. starfield 3곳은 REF-054 #356에서 이미 `<picture>`로 바꿨고 이 작업에서 건드리지 않는다.

## 2. 공용 캔버스 계약 (ADR-1 B — Issue 1에서 고정)

세 곳의 차이를 props로 표현한다. 초안:

```tsx
<GradientCanvas
  gradient="linear-gradient(303.01deg, var(--color-space-start) 3.59%, var(--color-space-end) 95.08%)"
  decoration={{ avif, webp, sizes }} // 투명 장식 srcset
  canvas={{ width: 475, height: 304 }} // 장식 원본 비율. 그라데이션과 장식이 같은 상자에서 함께 커진다
  anchor="bottom-right" // 'bottom-right' | 'right' | 'top'
  fit="natural-then-cover" // 'cover' | 'natural-then-cover' (히어로 모바일: 좁으면 실제 크기로 붙이고 넓으면 cover)
  hasBackdrop // 어두운 덮개. 리그 데스크톱처럼 같은 장식에 덮개만 더하는 화면용(§4-3)
  className="…" // 바깥 상자 레이아웃만
/>
```

- 바깥 상자에도 같은 그라데이션을 깔아 캔버스가 덮지 못하는 곳(긴 상태 표시줄 등)을 채운다(spec 5-2)
- 장식은 `alt=""` · `decoding="async"` · `pointer-events-none`. LCP 후보(히어로 · 로그인)는 `fetchPriority="high"`를 받을 수 있게 한다(REF-054 전략 「LCP 후보 → high」)
- 그라데이션은 이미지가 아니라 즉시 그려진다 → 장식이 늦어도 빈 화면이 없다

## 3. 구현 체크리스트

레이어 순서 `shared → entities → widgets → pages`.

### Issue 1 (#357) — 토큰 · 공용 캔버스 · 공용 우주 배경

- [ ] `[app]` `tokens.css`에 `--color-space-start` · `--color-space-end` · 기존 `.bg-space-gradient` · 리그 `BACKGROUND_GRADIENT`를 토큰으로 교체(색 같음 → 모양 동일) · `docs/design-system/README.md`에 「Figma 변수 없음 · 디자이너 확인 필요」 · Foundations 색 문서
- [ ] `[shared]` 공용 캔버스 신설 + 테스트(장식 `alt=""` · 그라데이션 style · anchor별 배치) + 스토리(대표 상태)
- [ ] `[shared]` `SpaceBackground` 기본 변형을 캔버스로 교체. 장식은 2560px webp 하나만 `shared/ui/layout/assets`에 두고 빌드에서 1920 · avif를 만든다(§4-2). 장식은 `cover`로 채운다 — spec의 「폭 맞춤 · 세로 가운데」는 세로로 긴 화면(900×1200)에서 장식이 띠로 잘려 2026-10-31 사용자 판정으로 바꿨다
- [ ] 사용처 4곳 렌더 확인 · 로그인 · 온보딩 테스트 통과
- [ ] AC-2 로그인 1440×900 Figma 비교 · AC-3 로그인 데스크톱 LCP 3회

### Issue 2 (#358) — 메인 히어로 · 마이 프로필 배너

- [ ] `[widgets]` `hero-greeting`을 캔버스로. 모바일 475×304 `bottom-right` + `natural-then-cover`, 데스크톱 1920×274 `right` + `cover`. 장식 2배 에셋(`local-docs/.../hero-gradient/`)
- [ ] 장식에 `fetchPriority="high"`(LCP 후보)
- [ ] `[pages]` 마이 `profile-card`를 같은 데스크톱 배너 파일 · 캔버스(가운데 기준)로. `profile-banner.webp` 삭제
- [ ] `[pages]` 메인 · 마이 모바일 당겨서 새로고침 바탕을 배너 맨 윗줄 가로 그라데이션으로(`shared/config` 상수 교체)
- [ ] AC-1 기본 인사말 테스트 · AC-2 360 · 412 · 475px Figma 비교 · AC-3 600px 빈 픽셀 0 · AC-4 `/main` LCP(로그인 필요)

### Issue 3 (#359) — 학습 카드

- [ ] `[entities]` `ChapterCard` · `UnitCard` 배경을 캔버스로(355:377, `cover`). 장식 710×754 webp 54 KB
- [ ] 장식 이미지 로딩: REF-054 #354의 `planetLoading`처럼 첫 화면 카드(챕터 8 · 추천 2)만 즉시, 나머지 lazy로 맞출지 착수 때 정한다
- [ ] AC-1 카드 링크 · 덮개 · 행성 · AC-2 두 카드 비율 Figma 비교 · AC-3 `/learning` LCP(로그인 필요)

### Issue 4 (GitHub 미등록) — 리그 · 레슨 결과 배경

로그인 · 온보딩 · 리그 · 레슨 결과는 **같은 장식 그림**을 화면 비율에 맞춰 잘라 쓴다. 데스크톱 리그는 여기에 어두운 덮개만 더한다(2026-10-31 사용자 확인).

- [ ] GitHub 이슈 등록(승인 필요, #349 하위) · issues.md에 Issue 4 추가
- [ ] 데스크톱 `15382:17808` · 모바일 `14600:22711` 그라데이션 · 덮개 색과 투명도를 Figma 값으로 확인. 장식은 따로 내보내지 않는다
- [ ] `[pages]` 리그 배경을 캔버스로(Issue 1 장식 재사용, 데스크톱 `hasBackdrop`)
- [ ] `[pages]` 레슨 결과 모바일 배경을 같은 캔버스 · 장식으로. 지금 `background-decoration-mobile.webp`(불투명 3배) 삭제
- [ ] 리그 · 레슨 결과 테스트 · Figma 비교

### 마무리

- [ ] `pnpm verify` · `ai-validate` · `checklist.md`
- [ ] REF-054와 합쳐 전후 측정(포트폴리오용, 로그인 필요) — `523cbc27` 대비

## 4. 판정 (2026-10-31 사용자 확인)

1. **토큰** — `--color-space-start` · `--color-space-end`로 확정. 기존 `.bg-space-gradient` · 리그 `BACKGROUND_GRADIENT`도 토큰을 쓴다(색 같음 → 모양 동일)
2. **장식 원본** — 2560px webp 하나만 저장소에 둔다. 1920 · avif는 빌드가 만든다. 4821px PNG는 Figma에서 다시 내보낼 수 있어 두지 않는다
3. **리그 배경** — 이 작업의 Issue 4로 넣고 GitHub 이슈를 새로 만든다. 레슨 결과 모바일도 같은 에셋으로 바꾼다. 장식은 Issue 1 것을 재사용하고 데스크톱 리그만 덮개를 더한다
4. **픽셀 비교 기준** — 이슈 AC의 「최대 4/255」 대신 「8/255 넘게 다른 픽셀 0.1% 이하」(`image-convention.md` §6)
5. **LCP 측정 로그인** — 측정 때 측정용 창을 띄워 알리면 사용자가 한 번 로그인한다

## 5. 리스크

| 리스크                                                 | 영향                       | 대응                                                                                   |
| ------------------------------------------------------ | -------------------------- | -------------------------------------------------------------------------------------- |
| 캔버스 props가 세 곳 차이를 다 담지 못해 늘어난다      | 공용 컴포넌트가 복잡해진다 | Issue 1에서 세 곳 값을 표로 먼저 맞춰 보고 props를 고정. 안 맞는 곳은 그 화면에서 처리 |
| 장식 `<img>`가 콘텐츠 위로 올라온다                    | 클릭 · 글자 가림           | `isolate` + `-z` · `pointer-events-none`(#356과 같은 방식) · 테스트                    |
| 폭에 따라 그라데이션 색이 아주 약간 달라진다(spec 5-2) | 시안과 미세 차이           | spec에 이미 허용으로 기록. 비교는 캔버스 영역만                                        |
| 모달에서 높이가 달라진다                               | 모달 레이아웃 변화         | Issue 1 사용처 4곳 캡처 확인                                                           |
| 로그인 데스크톱 LCP가 장식 이미지로 바뀐다             | LCP 악화 가능              | `fetchPriority="high"` · AC-3 측정                                                     |
