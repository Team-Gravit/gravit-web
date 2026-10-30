---
id: 'FIX-073'
planned: '2026-10-30'
mode: 'design-fix'
---

# FIX-073 구현 계획 (초안 — 승인 전)

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
| 수정 | `app/styles/tokens.css` · `docs/design-system/README.md` · `src/stories/` Foundations(색)                                                                                                             | 1    |
| 신규 | `shared/ui/gradient-canvas/{gradient-canvas.tsx, .test.tsx, .stories.tsx, index.ts}` (이름은 §4-1과 함께 확정)                                                                                        | 1    |
| 수정 | `shared/ui/layout/space-background.tsx` 기본 변형 · `assets/`                                                                                                                                         | 1    |
| 수정 | `widgets/hero-greeting/ui/hero-greeting.tsx` · `assets/` · `pages/my/ui/profile-card.tsx` · `pages/main/ui/main-page-narrow.tsx` · `pages/my/ui/my-page-layout.tsx` · `shared/config/space-colors.ts` | 2    |
| 수정 | `entities/learning/ui/chapter-card.tsx` · `unit-card.tsx` · `assets/`                                                                                                                                 | 3    |
| 수정 | `pages/league/ui/league-page.tsx` · `assets/` · (에셋 공유 시) `pages/lesson-result/ui/result-background.tsx`                                                                                         | 리그 |

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
  className="…" // 바깥 상자 레이아웃만
/>
```

- 바깥 상자에도 같은 그라데이션을 깔아 캔버스가 덮지 못하는 곳(긴 상태 표시줄 등)을 채운다(spec 5-2)
- 장식은 `alt=""` · `decoding="async"` · `pointer-events-none`. LCP 후보(히어로 · 로그인)는 `fetchPriority="high"`를 받을 수 있게 한다(REF-054 전략 「LCP 후보 → high」)
- 그라데이션은 이미지가 아니라 즉시 그려진다 → 장식이 늦어도 빈 화면이 없다

## 3. 구현 체크리스트

레이어 순서 `shared → entities → widgets → pages`.

### Issue 1 (#357) — 토큰 · 공용 캔버스 · 공용 우주 배경

- [ ] `[app]` `tokens.css`에 색 토큰 2개(§4-1 확정 후) · `docs/design-system/README.md`에 「Figma 변수 없음 · 디자이너 확인 필요」 · Foundations 색 문서
- [ ] `[shared]` 공용 캔버스 신설 + 테스트(장식 `alt=""` · 그라데이션 style · anchor별 배치) + 스토리(대표 상태)
- [ ] `[shared]` `SpaceBackground` 기본 변형을 캔버스로 교체. 장식 webp 1920 · 2560(+avif). 원본 위치는 §4-2
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

### 리그 배경 (GitHub 미등록)

- [ ] GitHub 이슈 등록(승인 필요) · issues.md에 Issue 4 추가
- [ ] 데스크톱 `15382:17808` · 모바일 `14600:22711` 그라데이션 CSS 계산 · 장식 2배 내보내기(Figma 복제본에서 그라데이션만 숨김)
- [ ] `[pages]` 리그 배경을 캔버스로. 모바일은 레슨 결과 모바일과 같은 시안 — 에셋 공유 위치(§4-3)
- [ ] 리그 테스트 · Figma 비교

### 마무리

- [ ] `pnpm verify` · `ai-validate` · `checklist.md`
- [ ] REF-054와 합쳐 전후 측정(포트폴리오용, 로그인 필요) — `523cbc27` 대비

## 4. 승인 전 확인 필요

1. **토큰 이름과 범위** — `--color-space-start` · `--color-space-end`(임시 이름)로 갈지. 기존 두 곳(`app/styles/utilities.css` `.bg-space-gradient` · `pages/league/ui/league-page.tsx` `BACKGROUND_GRADIENT`)도 이 토큰을 쓰게 할지(색만 바꾸면 모양 동일)
2. **공용 우주 배경 장식 원본 보관** — 받은 투명 PNG(4821×3060)를 저장소에 원본으로 둘지, 2560px webp만 둘지(빌드 변환 원본이 클수록 빌드가 느려진다)
3. **리그 배경 범위** — 이 작업에 넣고 GitHub 이슈를 새로 만들지, 별도 작업으로 뺄지. 넣는다면 레슨 결과 모바일 배경도 같은 에셋으로 바꿀지
4. **픽셀 비교 기준** — 이슈 AC의 「최대 4/255」는 REF-054 #355 · #356에서 경로 · 압축 차이로 맞출 수 없었다. 같은 기준(「8/255 넘는 픽셀 0.1% 이하」)으로 바꿀지
5. **LCP 측정 시 로그인** — `/main` · `/learning`은 측정 때 측정용 창에서 로그인이 한 번 필요하다

## 5. 리스크

| 리스크                                                 | 영향                       | 대응                                                                                   |
| ------------------------------------------------------ | -------------------------- | -------------------------------------------------------------------------------------- |
| 캔버스 props가 세 곳 차이를 다 담지 못해 늘어난다      | 공용 컴포넌트가 복잡해진다 | Issue 1에서 세 곳 값을 표로 먼저 맞춰 보고 props를 고정. 안 맞는 곳은 그 화면에서 처리 |
| 장식 `<img>`가 콘텐츠 위로 올라온다                    | 클릭 · 글자 가림           | `isolate` + `-z` · `pointer-events-none`(#356과 같은 방식) · 테스트                    |
| 폭에 따라 그라데이션 색이 아주 약간 달라진다(spec 5-2) | 시안과 미세 차이           | spec에 이미 허용으로 기록. 비교는 캔버스 영역만                                        |
| 모달에서 높이가 달라진다                               | 모달 레이아웃 변화         | Issue 1 사용처 4곳 캡처 확인                                                           |
| 로그인 데스크톱 LCP가 장식 이미지로 바뀐다             | LCP 악화 가능              | `fetchPriority="high"` · AC-3 측정                                                     |
