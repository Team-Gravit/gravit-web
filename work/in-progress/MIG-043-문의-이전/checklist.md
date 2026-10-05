---
id: 'MIG-043'
validated: '2026-09-27'
mode: 'migrate'
---

# MIG-043 검증 결과 (문의 내역 확인 + 작성)

## 1. 자동 검증

| #   | 검사            | 명령                                  | 결과 |
| --- | --------------- | ------------------------------------- | ---- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`        | ✅   |
| 2   | 타입            | `pnpm --filter @repo/web check-types` | ✅   |
| 3   | 테스트          | `pnpm --filter @repo/web test` (363 passed) | ✅ |
| 4   | 빌드            | `pnpm --filter @repo/web build`       | ✅   |
| 5   | 포맷            | `prettier --check <변경 파일>`        | ✅   |
| 6   | generated 경계  | pages/features가 생성 경로 직접 참조 없음(entities·features/api 경유) | ✅ |

## 2. 요구사항 ↔ 구현 대조

| #    | AC | 구현 위치 | 상태 |
| ---- | -- | --------- | ---- |
| AC-1 | 목록 렌더 + 헤더 개수 | `inquiry-history-page.tsx`, `my-inquiries-list.test.tsx` | ✅ |
| AC-2 | 아코디언 펼침·상세 조회 | `inquiry-list-item.tsx`, `my-inquiries-list.test.tsx` | ✅ |
| AC-3 | 상태 칩 완료/대기 | `inquiry-status-chip.tsx`, `inquiry-status-chip.test.tsx` | ✅ |
| AC-4 | 빈 상태 안내+버튼 | `my-inquiries-list.tsx`, `my-inquiries-list.test.tsx` | ✅ |
| AC-5 | 페이지 이동 | `inquiry-history-page.tsx` + `pagination.test.tsx` | ✅ |
| AC-6 | 폼 유효성(셋 다 채우면 유효) | `use-inquiry-form.ts`, `use-inquiry-form.test.ts` | ✅ |
| AC-7 | 작성 제출 → 목록 이동 | `inquiry-form.tsx`(`useSubmitInquiry` onSuccess navigate) | ✅ |
| AC-8 | 입력·선택 후 floating label | `floating-text-field.tsx`·`floating-textarea.tsx`·`floating-select.tsx`(hasValue 라벨) | ✅ |

## 3. 이전 검증

| 항목 | 결과 |
| ---- | ---- |
| `plan.md` 이전 매핑 전량 반영 | ✅ 내역(모델·조회·칩·목록·탭)+작성(폼·유효성·제출·필드) |
| 동작 동일성 — 기준선 유지 | ✅ 아코디언·칩·빈상태·폼 필드·제출 흐름 보존 |
| 의도적으로 바꾼 것만 | ✅ 아래 표 |
| 남은 legacy 참조 없나 | ✅ `rg "use-infinite\|infiniteSelector\|widgets/inquiry\|shared/ui/dropdown"` → 없음 |

### 의도적으로 바꾼 것

| 항목 | 이유 |
| ---- | ---- |
| 무한스크롤 → 페이지네이션 | 시안 변경(D1). `shared/ui/pagination` |
| 페이지 상태 URL search | 뒤로가기·공유 (state-convention) |
| 아코디언 트리거 `<button>` | legacy div onClick → 접근성 |
| 목록을 pages/inquiry/ui에 co-locate | widgets 20 초과(excessive-slicing) |
| 유형/상태 칩 공통 Chip(cta) | 공통 컴포넌트 + 시안 #9b00cf 정합(사용자 판정) |
| 입력 필드 floating 공통화 | `textFieldVariants` size single source + floating 컴포넌트(사용자 방안 B) |
| 유효성 zod → 수동 | web zod 미생성. min1×3 동등, orval 인프라 변경 회피 |

## 4. 시안 대조 재확인

| # | 시안 항목 | 반영 |
| - | -------- | ---- |
| D1 | 페이지네이션 | ✅ |
| D2 | 탭 활성색 | ✅ `bg-cta`=#9b00cf로 시안과 동일(오해 정정) |
| D5 | 필드 수치 h-54/72·px-16/24·rounded-8/12 | ✅ `textFieldVariants` field/area |
| D6 | 칩·필드 색 | ✅ cta(#9b00cf) |
| — | placeholder 14/17 SB, floating label caption1, 옵션 h-54/74·hover bg-bg-3 | ✅ |
| — | 버튼 상단 간격 12/32, 헤더 pl-4 | ✅ md:mt-5, pl-1 |

## 5. 기준 문서 갱신

| 대상 | 갱신 | 상태 |
| ---- | ---- | ---- |
| `docs/migration-status.md` | `/settings/inquiry`·`/new` 대체+검증 ✅ (MIG-043) | 진행(작성 반영 필요) |
| `docs/implementation-status.md` | 문의 화면 추가 | 진행(작성 반영 필요) |

## 중간에 막혔던 지점

- **탭 활성화 안 됨 — searchParams** — index route에 `validateSearch({page})`가 있어 현재
  location에 `search={page:1}`이 붙는데, 탭 `Link`는 search가 없어 `activeOptions` 기본값
  `includeSearch:true`가 불일치로 판정했다. → **search 붙는 index 라우트로 링크하는 탭은
  `activeOptions.includeSearch:false`**가 필요. 실제 routeTree 통합 테스트로 원인 확정.
- **floating 필드 외형 중복** — 처음 `shared/ui/field`에 별도 variant를 두어 `text-field`와
  외형 정의가 이원화됐다. → 외형 variant는 `textFieldVariants` **한 곳**에 두고 floating
  컴포넌트가 참조하도록 통합(사용자 방안 B). 같은 성격(Input)이라 한 폴더에 모음.
- **legacy를 그대로 안 가져와 어긋남** — 내역 1차 구현에서 시안 보고 새로 짰다가 폰트·radius·색이
  legacy와 전부 어긋났다. → **legacy className·구조를 그대로 가져온 뒤** 최소 변환(Icon·토큰·FSD·
  페이지네이션)만 하고, 그다음 공통 컴포넌트·시안 대조. `[[feedback_mig_bring_legacy_first]]`
- **widgets excessive-slicing** — 재사용 없는 화면 전용은 pages/ui로.
- **아코디언 상세 MSW 경고** — 클릭 시 실제 요청. 상세 내용 검증엔 MSW 핸들러 필요.
