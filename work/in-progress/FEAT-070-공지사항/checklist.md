---
id: 'FEAT-070'
validated: '2026-10-26'
mode: 'feature'
---

# FEAT-070 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                        | 결과 |
| --- | --------------- | ------------------------------------------- | ---- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`              | ✅   |
| 2   | 타입            | `pnpm --filter @repo/web check-types`       | ✅   |
| 3   | 테스트(신규)    | `vitest run notice-list` (4 tests)          | ✅   |
| 4   | 빌드            | `pnpm --filter @repo/web build`             | ✅   |
| 5   | 포맷(변경 파일) | `prettier --check`                          | ✅   |
| 6   | generated 경계  | 생성 API는 `entities/notice/api`에서만 참조 | ✅   |

## 2. 요구사항 ↔ 구현 대조

| AC   | 내용                   | 구현 위치                                                     | 상태 |
| ---- | ---------------------- | ------------------------------------------------------------- | ---- |
| AC-1 | 목록·핀 분기·날짜 포맷 | `NoticeListItem` + `formatISODate` (+test)                    | ✅   |
| AC-2 | URL search 페이지 이동 | `settings/notice.tsx` validateSearch + 어댑터                 | ✅   |
| AC-3 | 지연 스켈레톤·무시프트 | `NoticeList`(useDelayedFlag) + 고정 행높이 75/106 (+test)     | ✅   |
| AC-4 | 1페이지면 숨김         | `Pagination`(totalPages<=1 → null)                            | ✅   |
| AC-5 | 빈 상태 문구           | `NoticeList` 빈 분기 (+test)                                  | ✅   |
| AC-6 | 날짜 포맷              | 공유 `formatISODate`(기존 테스트가 고정)                      | ✅   |
| AC-7 | 목록→상세 링크         | `NoticeListItem` link prop (+test: href `/settings/notice/1`) | ✅   |
| AC-8 | 상세 본문 Markdown     | `NoticeDetailPage` 제목·날짜·`<Markdown>`                     | ✅   |
| AC-9 | 데스크톱 Footer        | `pages/notice`·`pages/notice-detail` `<Footer>` (md:block)    | ✅   |

> 자동검사 재실행: 상세 확장 후 build·check-types·lint·test(5)·prettier 모두 ✅.

## 3. 시안 대조 (Figma 수치 근거)

### 상세 페이지

| 항목       | 시안값                                 | 구현                                                   |
| ---------- | -------------------------------------- | ------------------------------------------------------ |
| 제목       | Title1(32·Bold) / 모바일 ~Heading1(22) | `text-heading1 md:text-title1 text-text-1`             |
| 날짜       | Body2(15)·text-4 / 모바일 Caption1(12) | `text-caption1 md:text-body2-normal text-text-4`       |
| 카드       | 흰 카드, divider-2 구분선              | `rounded-8 md:rounded-12 bg-white`, `border-divider-2` |
| breadcrumb | 3단(설정>공지사항>제목)                | 공통 `Breadcrumb`                                      |
| 본문       | 요약/헤딩/문단(=content 안 Markdown)   | 공유 `<Markdown>`(heading 타이포는 컴포넌트 소유)      |
| 목록으로   | 데스크톱 우측 버튼                     | `Button variant="stroke-secondary"`(데스크톱)          |

### 확인 필요 (상세)

- **본문 타이포**: 시안의 요약(17)·헤딩(20)·본문(15)은 `<Markdown>` 컴포넌트 스타일로 렌더돼
  픽셀 정확히는 다를 수 있음(admin 마크다운이라 동적). Markdown `size` 기본(`md`) 사용.
- **모바일 상세 카드**: 흰 카드(rounded-8)로 구현. 시안이 full-bleed(카드 없음)라면 조정 필요.
- **「목록으로」**: `?page=1`로 이동(이전 목록 페이지 위치는 미보존). 모바일은 back-header로 복귀(history back).

## 3-1. 목록 시안 대조 (Figma 수치 근거)

| 항목            | 시안값 (get_metadata/variable_defs)                                         | 구현                                                                 |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 아이템 높이     | 106(데스크톱) / 75(모바일)                                                  | `h-[106px]` / `h-[75px]`                                             |
| 아이템 패딩     | px32 py28(데스크톱) / p16(모바일)                                           | `md:px-8 md:py-7`(고정높이+중앙) / `px-4`                            |
| 제목            | Heading1(22)·text-1 / Headline2(17)                                         | `text-heading1` / `md:` · `text-headline2`                           |
| 날짜            | Caption1(12)·text-4                                                         | `text-caption1 text-text-4`                                          |
| 핀 아이콘       | #9b00cf(icon/brand=cta), 24/20                                              | `text-cta`, `size-6`/`size-5`                                        |
| chevron         | #a8a8a8(text-4), 24                                                         | `text-text-4 size-6`                                                 |
| 구분선          | #c6c6c6(divider-2)                                                          | `border-divider-2`                                                   |
| 카드 radius     | (inquiry 동일 패턴) 8/12                                                    | `rounded-8 md:rounded-12`                                            |
| 데스크톱 타이틀 | Title1(32·Bold)·text-2                                                      | `text-title1 text-text-2`                                            |
| breadcrumb      | "설정"Body1(16)·text-3 + chevron-right(16) + "공지사항"Headline2(17)·text-2 | 공통 `shared/ui/breadcrumb` 사용(토큰 동일 + aria-current·상위 Link) |

### 디자인 판정 기록

- **데스크톱 헤더 가로 정렬**: 사용자 판정 → **시안대로**. 헤더(breadcrumb/타이틀)는 좌측 여백
  `md:px-[90px]`, 카드·페이지네이션은 그 안에서 `mx-auto max-w-[1200px]`(1920 기준 x360). 반영 완료.
- 스켈레톤 행 수(8)는 시안 기준. 서버 페이지 크기와 다르면 카드 높이만 달라짐(행 수치는 일치, 시프트 없음).

## 4. 기준 문서 갱신

| 대상                            | 갱신                        | 상태         |
| ------------------------------- | --------------------------- | ------------ |
| `docs/implementation-status.md` | `settings/notice` 목록 반영 | ⬜ (머지 시) |
| 상세 페이지                     | 다음 작업                   | —            |
