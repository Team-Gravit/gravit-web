---
id: 'MIG-025'
phase: 2
planned: '2026-09-12'
mode: 'migrate'
---

# MIG-025 Phase 2 구현 계획 — 요약 탭

> 요약 탭(SummaryCard + StudyHeatmap)을 한 브랜치·PR(#227)로 이전한다.
> 규모가 커(파일 ~20, npm 2종) 이전 매핑·의존성·ADR을 먼저 확정하고 GATE를 받는다.

## 0. 착수 게이트

| #   | 질문                     | 답  | 근거                                                                       |
| --- | ------------------------ | --- | -------------------------------------------------------------------------- |
| 1   | 목표·비목표 명확         | 예  | 목표: 요약 탭(통계 카드+히트맵) 이전. 비목표: 학습/리그/소셜 탭            |
| 2   | 반복 비용/확장 차단      | 예  | card·scroll·select·heatmap은 다른 탭에서도 재사용될 공용 자산              |
| 3   | 기준선 존재              | 예  | spec S1~S6 + Figma 요약 시안 대조 예정                                     |
| 4   | 검증 방법               | 예  | lint/types/test/build + transform 순수함수 단위 테스트                     |
| 5   | 독립 완료 가능           | 예  | 요약 화면 하나로 수직 슬라이스 완결                                        |
| 6   | 위험·복구               | ⚠️  | **API `years` 불일치**(아래 리스크). npm 2종 추가. 라우트 트리 재생성      |

## 1. 기술 결정 (ADR)

### ADR-1: 연도 선택 Dropdown을 `@radix-ui/react-select`로 신규 구현한다 (legacy floating-ui dropdown 미이전)

**Context** — 요약 탭 히트맵에 연도 선택 UI가 필요하다. legacy는 `@floating-ui/react` + 커스텀
`useDropdown` 훅(키보드·포커스·포탈) 5파일로 구현했고, 리스트는 `role="combobox"`에 `biome-ignore`로
a11y 규칙을 우회한다. 연도 선택은 실제로는 옵션 2~3개의 **단일 선택(select)** 패턴이다.

**Decision** — legacy dropdown을 이전하지 않고, `@radix-ui/react-select`(headless)로 새로 구현한다.
스타일은 우리 토큰·`cn()`으로 **Figma 요약 시안 기준**에 맞춘다(legacy 복제가 아니라 시안이 SoT).

**Alternatives**

| 안                         | 내용                                  | 거부 이유                                                                 |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| legacy dropdown 그대로 이전 | floating-ui + 5파일 + FieldLabel     | `@floating-ui/react`(이질적 신규 의존)·`combobox` role 오용·a11y 우회 잔존 |
| 직접 구현(useState)        | 의존성 0                              | 포커스·키보드·바깥클릭·포탈을 직접 유지보수. `component-convention.md` 경고 대상 |
| 완성형 UI 라이브러리        | antd/MUI Select                       | 컴포넌트 하나에 디자인시스템 통째 도입 금지(`component-convention.md`)     |

**Consequences**

- (+) 이미 쓰는 Radix 생태계(dialog·slot)와 일관. `@floating-ui/react` 회피
- (+) select 시맨틱 정확, 접근성 검증됨(포커스·키보드·포탈 Radix 소유)
- (+) dropdown 5파일 + FieldLabel + dropdown용 ScrollArea 이전 불필요
- (−) `@radix-ui/react-select` 의존성 1종 추가. shadcn 코드를 가져와 우리 토큰·cva로 교체하는 초기 비용
- (−) legacy와 **DOM 구조는 달라짐**(외형은 시안으로 동일하게 맞추지만 마크업은 Radix 구조)

> 히트맵 가로 스크롤용 `ScrollArea`(`@radix-ui/react-scroll-area`)는 이 결정과 별개로 이전한다.
> Radix Select는 자체 Viewport 스크롤을 가지므로 dropdown 리스트에는 우리 ScrollArea가 필요 없다.

## 2. 영향 분석

| 구분 | 파일 |
| ---- | ---- |
| npm  | `@radix-ui/react-select`, `@radix-ui/react-scroll-area` (2종 신규) |
| 신규 | `shared/ui/card/*` · `shared/ui/scroll/*` · `shared/ui/select/*`(radix) · `shared/ui/calendar-heatmap/*`(9) · `entities/learning/{lib,index}` · `pages/my/ui/{summary-card,study-heatmap}.tsx` |
| 수정 | `entities/user/api`(useMyPageSummary·useMyPageLearningHistory 어댑터) · `entities/user/index.ts` · `pages/my/index.ts` · `app/routes/.../my/summary.tsx`(스텁→실제) · `routeTree.gen.ts`(재생성) · `package.json` |

### 2-1. 이전 매핑

| 현재 위치 (legacy)                                   | 목표 위치 (apps/web)                          | 변경 종류        |
| ---------------------------------------------------- | --------------------------------------------- | ---------------- |
| `shared/ui/card/card.tsx`                            | `shared/ui/card/card.tsx`                     | 이전+토큰정정(rounded) |
| `shared/ui/scroll/scroll-area.tsx`                   | `shared/ui/scroll/scroll-area.tsx`            | 이전(radix)      |
| `shared/ui/dropdown/*`                               | `shared/ui/select/*`                          | **재구현(Radix Select)** |
| `shared/ui/calendar-heatmap/*` (9)                   | `shared/ui/calendar-heatmap/*`                | 이전+토큰정정    |
| `entities/learning/lib/transform-learning-history`   | `entities/learning/lib/transform-learning-history` | 이전         |
| `widgets/my-page/summary/summary-card.tsx`           | `pages/my/ui/summary-card.tsx`                | 이전+분해        |
| `widgets/my-page/summary/study-heatmap.tsx`          | `pages/my/ui/study-heatmap.tsx`               | 이전             |
| `useGetMyPageSummary` / `useGetMyPageLearningHistory` | `entities/user/api` 어댑터                   | 감쌈             |

## 3. 의존 관계 검증

- pages/my → entities/learning·entities/user·shared/ui/* (하향) ✓
- calendar-heatmap·scroll·select·card = shared/ui, 도메인 무관 ✓
- entities/learning/lib = 순수 변환, shared/ui/calendar-heatmap 타입 참조 → entities→shared 하향 ✓
- FSD 위반: 없음

## 4. 구현 순서 (레이어)

- [ ] `[deps]` `@radix-ui/react-select`, `@radix-ui/react-scroll-area` 설치
- [ ] `[shared]` `shared/ui/card` (기본 Card만, rounded 토큰 정정)
- [ ] `[shared]` `shared/ui/scroll` (radix scroll-area, 시안 스크롤바)
- [ ] `[shared]` `shared/ui/select` (Radix Select, Figma 요약 시안 스타일)
- [ ] `[shared]` `shared/ui/calendar-heatmap` (9파일, 토큰 정정) + 색상 상수
- [ ] `[entities]` `entities/learning/lib/transform-learning-history` + 배럴
- [ ] `[entities]` `entities/user/api` 어댑터 2종(summary·learning-history)
- [ ] `[pages]` `summary-card` (S2·S3, Card 사용)
- [ ] `[pages]` `study-heatmap` (S4~S6, Select·ScrollArea·CalendarHeatmap 조합)
- [ ] `[pages]` 요약 탭 조립 + `my/summary.tsx` 실제 연결
- [ ] 라우트 트리 재생성 → 검증

## 5. 리스크

| 리스크                                   | 영향              | 대응                                                              |
| ---------------------------------------- | ----------------- | ---------------------------------------------------------------- |
| ~~API `years` 불일치~~ (해소)            | —                 | `years`는 `learning/history` 응답에 있음(summary=통계, history=히트맵+years) |
| summary 응답 형태(flat 5필드)            | SummaryCard 매핑  | 현재 스펙 `LearningSummaryResponse` 기준으로 구현                 |
| npm 2종 추가                             | 번들 증가         | 둘 다 headless 경량. tree-shake                                  |
| calendar-heatmap 9파일 이전 누락         | 히트맵 깨짐       | 이전 매핑 전량 체크 + transform 단위 테스트                     |
| Suspense 재검토(보류됨)                  | —                 | Phase 2에서도 수동 분기 유지, 별도 INFRA로                       |

## 6. 완료 후 액션

- [ ] docs/implementation-status·migration-status 갱신(요약 탭)
- [ ] Suspense 재검토 결론 기록(issues.md)
