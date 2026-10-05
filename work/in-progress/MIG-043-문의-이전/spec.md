---
id: 'MIG-043'
title: '문의 페이지 이전 (내역 확인 + 작성) + 페이지네이션 공통 컴포넌트'
type: 'migrate'
screen: 'INQUIRY'
priority: 'medium'
created: '2026-09-23'
revised: '2026-09-27'
---

# MIG-043 — 문의 페이지 이전 (내역 확인 + 작성)

## 배경 · 목표

legacy-web의 문의 화면 전체(문의 내역 확인 `/settings/inquiry` + 문의 작성 `/settings/inquiry/new`)를
`apps/web`으로 FSD 구조에 맞춰 이전한다. 내역은 무한스크롤이 새 시안에서 페이지네이션으로 바뀌었고,
작성은 floating label을 가진 입력 필드로 구성된다. 이 과정에서 재사용 가능한 공통 컴포넌트
(페이지네이션, floating 입력 필드)를 함께 만든다.

## 범위

- `shared/ui/pagination` 신설 — 표시 범위 계산 순수 함수 + 반응형 컴포넌트
- `shared/ui/text-field` 확장 — `textFieldVariants`(size single source) + `FloatingTextField`·`FloatingTextArea`
- `shared/ui/select` 확장 — `FloatingSelect`(Radix 재사용 + floating label)
- `entities/inquiry` 신설 — 목록/상세 조회 훅, 유형·상태 모델, 표시용 칩
- **문의 내역**: 탭 + 헤더 + 목록 + 페이지네이션 + 로딩 스켈레톤, 아코디언 상세, 빈 상태
- **문의 작성**: `features/inquiry-submit`(폼 상태·유효성·제출) + `pages/inquiry-new`(헤더 + 폼)
- 라우트: `/settings/inquiry`(탭 레이아웃 + 내역 index + 작성 new)

## Out of Scope

- 무한스크롤 훅 재사용 (페이지네이션으로 대체)
- 공지사항(`/settings/notice`) 화면 본체 — 스텁 라우트만
- orval zod 스키마 생성 — 유효성은 수동(legacy zod min1×3과 동등)

## 용어 정의

| 용어 | 정의 |
| ---- | ---- |
| 문의 유형 | BUG_REPORT(버그 신고)·CONTENT_ERROR(콘텐츠 오류)·FEATURE_SUGGESTION(기능 제안)·OTHER(기타) |
| 문의 상태 | PENDING(답변 대기)·RESOLVED(답변 완료) |
| 아코디언 상세 | 목록 항목을 클릭하면 인라인으로 펼쳐지는 문의 내용·답변 영역 |
| floating label | 입력·선택 후 필드 안 상단에 필드명이 뜨는 라벨 |

---

## 현행 동작 기준선

> legacy `pages/_authenticated/settings/inquiry/*` + `widgets/inquiry/*` 기준.

### 문의 내역 확인

| #   | 동작 | 확인한 위치 (legacy) |
| --- | ---- | -------------------- |
| 1 | `/settings/inquiry` 레이아웃: 탭(문의하기→/new, 문의내역확인→/) + Outlet | `settings/inquiry/route.tsx` |
| 2 | 목록: `useGetMyInquiriesInfinite`(page 1부터, hasNext) 무한스크롤 | `use-infinite-my-inquiries.ts` |
| 3 | 헤더: "문의 내역 {totalElements}" + "최신순" | `settings/inquiry/index.tsx` |
| 4 | 항목: 유형칩(main-2 테두리) + 제목 + 날짜 + 상태칩 + chevron. 클릭 시 아코디언 펼침 | `my-inquiries-list-item.tsx` |
| 5 | 상태칩: PENDING "답변 대기"(text-4/divider-2), RESOLVED "답변 완료"(bg-main-2/white) | 〃 |
| 6 | 펼침 시 `useGetMyInquiryDetail(id, {enabled:isOpen})` 상세 조회 | 〃 |
| 7 | 상세: 문의 내용 박스 + (답변 있으면 답변 박스 / 없으면 "답변 대기 중입니다") | 〃 |
| 8 | 빈 상태: "등록된 문의 내역이 없어요" + 안내 + 문의하기 버튼(→/new) | `my-inquiries-list.tsx` |
| 9 | 날짜 `formatISODate`로 표기 | `shared/lib/formatDate` |

### 문의 작성

| #   | 동작 | 확인한 위치 (legacy) |
| --- | ---- | -------------------- |
| 10 | `/settings/inquiry/new`: 헤더 "문의유형을 선택해주세요" + 폼 | `settings/inquiry/new.tsx` |
| 11 | 폼: Dropdown(유형) + Input(제목) + Textarea(내용) + Button(등록하기) | `inquiry-form.tsx` |
| 12 | 유효성: zod `SubmitInquiryBody`(title·type·content 각 min(1)) | `use-inquiry-form.ts` |
| 13 | 제출: `useSubmitInquiry` → 성공 시 `/settings/inquiry` 이동 + 목록 무효화 | `inquiry-form.tsx` |
| 14 | 필드: 입력 후 상단에 필드명(floating label) 표시 | `CommonInput`/`CommonTextarea`/`FieldLabel` |

## 시안 대조 결과

> Figma: 내역 68354/44770, 작성 68321/55017, dropdown 68335/55054, 필드 68347.

| #   | 항목 | 현행(legacy) | 시안 | 판정 |
| --- | ---- | ---- | ---- | ---- |
| D1 | 목록 로딩 | 무한스크롤 | **페이지네이션** | 고침 — `shared/ui/pagination` |
| D2 | 탭 스타일 | web `Tabs` bg-cta | 활성 bg-main-2(#9b00cf) | 유지 — `bg-cta`가 #9b00cf로 동일(사용자 판정) |
| D3 | 항목/상세/빈상태 구조 | (legacy 동일) | 유형칩·제목·날짜·상태칩·아코디언 | 유지 |
| D4 | 작성 필드 floating label | (legacy 동일) | 입력 후 상단 라벨 | 유지 — legacy·시안 일치 |
| D5 | 필드 수치 | h-54 md:h-74 | h-54/**72**, px-16/24, rounded-8/12 | 고침 — 데스크톱 72(전체화면 기준, 사용자 판정) |
| D6 | 유형/상태 칩 색 | main-2(#8100b3) | #9b00cf | 고침 — 공통 Chip(cta) 사용(사용자 판정) |

### 확인 필요

- 없음 (탭 색·필드 높이·칩 색·floating 방식 모두 사용자 판정 완료)

---

## 확정 명세 · 검증 기준

- [x] **AC-1** (통합) 문의 N건, `/settings/inquiry` 진입 → "문의 내역 {N}" 헤더 + 항목 렌더
- [x] **AC-2** (통합) 항목 클릭 → 아코디언 펼침 + 상세 조회
- [x] **AC-3** (단위) status RESOLVED → "답변 완료" / PENDING → "답변 대기"
- [x] **AC-4** (통합) 0건 → "등록된 문의 내역이 없어요" + 문의하기 버튼
- [x] **AC-5** (통합) totalPages>1, 페이지 클릭 → 해당 페이지 목록
- [x] **AC-6** (단위) 유형·제목·내용이 모두 채워지면 유효, 하나라도 비면 무효 (`use-inquiry-form.test.ts`)
- [x] **AC-7** (통합) 작성 폼: 값 입력 후 등록하기 활성, 제출 시 목록으로 이동
- [x] **AC-8** (단위) 선택·입력 후 필드 상단에 floating label 노출

---

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-09-23 | 작업 생성, 페이지네이션 컴포넌트 완료 | 문의 이전 착수 | #254 |
| 2026-09-26 | 내역 baseline·시안 대조 기록, web Tabs 재사용 | 내역 계획 수립 | #254 |
| 2026-09-27 | 내역 구현·검증 완료(AC-1~5). 무한→페이지네이션 | 문의 내역 이전 | #254 |
| 2026-09-27 | 작성 이전 포함으로 범위 확장. floating 입력 필드 공통화(text-field size single source), features/inquiry-submit·pages/inquiry-new 추가(AC-6~8) | 문의 페이지 전체 이전 | #254 |
