---
id: 'MIG-043'
planned: '2026-09-26'
revised: '2026-09-27'
mode: 'migrate'
---

# MIG-043 — 문의 페이지 이전 (내역 확인 + 작성) · 구현 계획

## 1. 작업 종류

`MIG-` — legacy `/settings/inquiry`(내역) + `/settings/inquiry/new`(작성)를 apps/web으로 이전.
동작 변경은 무한스크롤→페이지네이션(시안 반영)뿐, 나머지는 보존. 재사용 공통 컴포넌트
(페이지네이션, floating 입력 필드)를 함께 만든다.

## 2. 착수 게이트 (refactor-checklist §1)

| 질문 | 답 · 근거 |
| ---- | --------- |
| 목표/비목표 | ✅ 문의 내역+작성 이전(동작 보존 + 페이지네이션). 공지 화면은 비목표 |
| 기준선 | ✅ spec.md 기준선 14항목(내역 9 + 작성 5) |
| 검증 방법 | ✅ AC 테스트 + 라우트 진입 + MSW + 시안 재대조 |
| 범위 독립 완료 | ✅ 내역/작성 단위로 완결 |
| 위험 격리 | ✅ 라우트 재구성·search 계약·floating 공통화·탭 활성화를 리스크로 식별 |

## 3. 이전 매핑표

### 문의 내역

| 현재 위치 (legacy) | 목표 위치 (web) | 변경 종류 |
| --- | --- | --- |
| `widgets/inquiry/model/inquiry-config.ts` | `entities/inquiry/model/inquiry-type.ts`·`inquiry-status.ts` | 이전 |
| `use-infinite-my-inquiries.ts` | `entities/inquiry/api/use-my-inquiries.ts` | 재작성(무한→페이지) |
| `useGetMyInquiryDetail` | `entities/inquiry/api/use-inquiry-detail.ts` | 래핑 |
| `my-inquiries-list-item.tsx` 칩 2종 | `entities/inquiry/ui/inquiry-*-chip.tsx` | 이전(공통 Chip 사용) |
| `my-inquiries-list-item.tsx`(아코디언) | `pages/inquiry/ui/inquiry-list-item.tsx` | 이전(화면 전용 → pages/ui co-locate) |
| `my-inquiries-list.tsx` | `pages/inquiry/ui/my-inquiries-list.tsx`(+ 스켈레톤) | 이전(무한→페이지) |
| `settings/inquiry/index.tsx`(헤더+목록) | `pages/inquiry/ui/inquiry-history-page.tsx` | 이전 |
| `settings/inquiry/route.tsx`(탭) | `app/routes/.../settings/inquiry/route.tsx` | 이전(web Tabs 재사용) |
| `formatISODate` | `shared/lib/date.ts` | 이전 |

### 문의 작성

| 현재 위치 (legacy) | 목표 위치 (web) | 변경 종류 |
| --- | --- | --- |
| `shared/ui/dropdown` | `shared/ui/select`의 `FloatingSelect` | 신규(Radix 재사용 + floating) |
| `shared/ui/input`(CommonInput) | `shared/ui/text-field`의 `FloatingTextField` | 신규(size single source) |
| `shared/ui/input/textarea` | `shared/ui/text-field`의 `FloatingTextArea` | 신규 |
| `use-inquiry-form.ts`(zod) | `features/inquiry-submit/model/use-inquiry-form.ts` | 재작성(수동 유효성) |
| `useSubmitInquiry` 사용 | `features/inquiry-submit/api/use-submit-inquiry.ts` | 래핑(무효화+onSuccess) |
| `inquiry-form.tsx` | `features/inquiry-submit/ui/inquiry-form.tsx` | 이전 |
| `settings/inquiry/new.tsx`(헤더+폼) | `pages/inquiry-new/ui/inquiry-new-page.tsx` | 이전 |

> `widgets/my-inquiries`로 계획했다가 steiger `excessive-slicing`(widgets 20 초과)로 `pages/inquiry/ui`에 co-locate했다(MIG-042와 동일 패턴).

## 4. 구현 계획 (완료)

- [x] `[shared]` `date.ts` `formatISODate` + 테스트
- [x] `[shared]` `pagination` 신설(범위계산 순수함수 + 컴포넌트 + 스토리 + 테스트)
- [x] `[shared]` `text-field` size variant + `FloatingTextField`·`FloatingTextArea` + 스토리
- [x] `[shared]` `select`의 `FloatingSelect` + 스토리
- [x] `[entities]` `inquiry` model/api/ui + 배럴 (INQUIRY_TYPE_OPTIONS 포함)
- [x] `[pages]` `inquiry/ui` 목록·항목·스켈레톤·헤더(search param 페이지)
- [x] `[features]` `inquiry-submit` model(유효성)·api(제출)·ui(폼)
- [x] `[pages]` `inquiry-new` 헤더 + 폼
- [x] `[app]` `settings/inquiry.tsx` 삭제 → `settings/inquiry/{route,index,notice,new}.tsx`, 트리 재생성
- [x] `[app]` 탭 활성화 `includeSearch:false`(search 붙는 index 라우트 대응)
- [x] `[test]` AC-1~8

## 5. 리스크 · 동일성 확인

| 리스크 | 대응 |
| ------ | ---- |
| 스텁 파일→폴더 재구성 | inquiry.tsx 삭제 후 폴더, 트리 재생성 |
| 페이지 search 계약 | `validateSearch`로 `page` 기본 1 |
| 탭 활성화(search) | index route에 validateSearch 있어 `activeOptions.includeSearch:false` 필요 |
| floating 필드 공통화 | 외형 variant single source(`textFieldVariants`), focus는 floating이 `focus-within` |
| 상세 조회 지연 | `enabled: isOpen`으로 펼칠 때만, 스피너 |

### 동일성 확인

| 방법 | 내용 |
| --- | --- |
| 라우트 진입 | `/settings/inquiry`(내역), `/settings/inquiry/new`(작성) |
| MSW | inquiry mock으로 목록/상세/빈상태 |
| 자동 테스트 | AC-1~8 |
| 시안 재대조 | 구현 후 get_design_context 재호출 1:1 대조(내역·작성) |
