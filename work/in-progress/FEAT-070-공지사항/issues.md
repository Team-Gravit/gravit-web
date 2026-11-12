---
id: 'FEAT-070'
---

# FEAT-070 이슈 분해

단일 수직 슬라이스. 이 이슈 하나로 `/settings/notice` 목록 화면이 끝에서 끝까지 동작한다.
("UI 컴포넌트 생성 후 조립" 순서는 `구현 범위`의 빌드 순서를 따른다.)

---

## Issue 1: [feature] 공지사항 목록 페이지

GitHub Issue: 미등록

### 설명

설정 > 공지사항 목록 화면. 핀 공지 + 일반 공지를 서버 순서대로 페이지네이션으로 보여준다.
데스크톱·모바일 모두 페이지네이션(페이지는 URL search 소유). 상세 이동은 다음 작업이라
이번 아이템은 정적 렌더(클릭 연결 없음).

### 구현 범위 (빌드 순서)

1. `[shared]` `shared/ui/icon/assets/pin-fill.svg` → `pnpm generate:icons`로 `Icon name="pin-fill"` 등록
2. `[entities]` `entities/notice/` 신설
   - `api/` — `useNotices(page)` = `useGetNoticeSummaries` 래핑, queryKey 재노출
   - `lib/` — `publishedAt(ISO) → "YYYY.MM.DD"` 포맷
   - `ui/notice-list-item.tsx` — 핀아이콘(pinned)·제목·날짜·chevron
   - `ui/notice-list-item-skeleton.tsx` — 실제 아이템과 동일 수치(무시프트)
   - `index.ts`
3. `[pages]` `pages/notice/ui/notice-page.tsx` — 모바일 `PageTitleBar`/데스크톱 breadcrumb+타이틀 + 카드 리스트 + `Pagination`
4. `[app]` `app/routes/_authenticated/settings/notice.tsx` — placeholder 교체, `validateSearch`로 `?page`, 어댑터가 page+onPageChange 주입

### 완료 조건 (Acceptance Criteria)

☐ **AC-1** (범위: 통합) 목록·핀 분기
Given `contents: [{ id: 1, title: '점검 안내', pinned: true, publishedAt: '2026-01-02T00:00:00Z' }, { id: 2, title: '업데이트', pinned: false, publishedAt: '2026-01-01T00:00:00Z' }]`
When 페이지를 렌더하면
Then 아이템 2개가 보이고, `id:1`에는 핀 아이콘(`pin-fill`)이 있고 `id:2`에는 없다. 날짜는 `2026.01.02` / `2026.01.01`로 표시된다

☐ **AC-2** (범위: 통합) 페이지 이동은 URL search가 소유
Given `totalPages: 3`, 현재 `?page=1`
When 페이지네이션 `2`를 누르면
Then URL search가 `page=2`가 되고 `useNotices(2)`로 2페이지를 조회한다

☐ **AC-3** (범위: 통합) 로딩 스켈레톤 — 지연 노출·무시프트
Given 목록 조회가 300ms 이상 지연
When 로딩 중이면
Then 스켈레톤 아이템이 보이고, 데이터 도착 후 리스트 컨테이너의 높이가 바뀌지 않는다(스켈레톤 1행 높이 == 실제 아이템 1행 높이)

☐ **AC-4** (범위: 통합) 한 페이지면 페이지네이션 숨김
Given `totalPages: 1`
When 렌더하면
Then 페이지네이션 `nav`가 렌더되지 않는다

☐ **AC-5** (범위: 통합) 빈 상태
Given `contents: []`, `totalElements: 0`
When 렌더하면
Then 리스트 영역에 안내 문구가 중앙에 보인다 (문구: **"등록된 공지사항이 없어요"** — 확정 전 기본안)

☐ **AC-6** (범위: 단위) 날짜 포맷
Given `'2026-01-02T09:30:00Z'`
When 포맷 함수를 호출하면
Then `'2026.01.02'`를 반환한다

### 의존성

없음 (단일 슬라이스).

> 에러 상태는 기존 공통 처리에 위임한다(별도 UI 없음).

---

## Issue 2: [feature] 공지 상세 페이지 + Footer

GitHub Issue: [#336](https://github.com/Team-Gravit/gravit-web/issues/336) (목록과 동일 이슈로 확장)

### 설명

공지 상세 화면(`/settings/notice/$noticeId`). 제목·날짜·본문(Markdown)을 보여주고, 목록 아이템에서
이 화면으로 이동한다. 데스크톱은 breadcrumb 3단 + 「목록으로」 + Footer. 이전/이후 공지 네비게이션은
API 미지원으로 생략. 더불어 목록·상세 **데스크톱 Footer** 누락분을 추가한다.

### 구현 범위

- `entities/notice` — `useNoticeDetail(id)`(= `useGetNoticeSummary`), `NoticeDetailResponse` 타입
- `entities/notice/ui/notice-list-item` — `link` prop 추가(상위가 상세 경로 주입)
- `pages/notice-detail` — breadcrumb 3단 + 카드(제목·날짜·divider·`<Markdown>`) + 「목록으로」(데스크톱) + 스켈레톤
- `pages/notice`·`pages/notice-detail` — 데스크톱 `<Footer>` 추가
- 라우트: `settings/notice/` 폴더화(`index.tsx` 목록 + `$noticeId.tsx` 상세)

### 완료 조건 (Acceptance Criteria)

☐ **AC-7** (범위: 통합) 목록 → 상세 링크
Given 목록에 `{ id: 1, title: '점검 안내' }`
When 렌더하면
Then 그 행은 `href="/settings/notice/1"` 링크다

☐ **AC-8** (범위: 통합) 상세 본문 Markdown
Given `{ title: '점검 안내', content: '## 요약\n내용', publishedAt: '2026-01-02T...' }`
When 상세를 렌더하면
Then 제목 `점검 안내`, 날짜 `2026.01.02`, 본문의 `## 요약`이 heading으로 렌더된다

☐ **AC-9** (범위: 통합) 데스크톱 Footer
Given 데스크톱 뷰포트
When 목록·상세를 렌더하면
Then 하단에 Footer(저작권 문구)가 보인다 (모바일에서는 숨김)

### 의존성

Issue 1(목록) 완료 후. 상세 라우트는 목록 아이템 링크의 목적지다.

> 본문 heading/문단 타이포는 `<Markdown>` 컴포넌트가 소유(Figma placeholder의 17/20px과 정확히
> 일치하지 않을 수 있음 — admin 마크다운이라 동적). 이전/이후 공지는 API 지원 시 별도 추가.

---

## 시퀀스 검토

- [x] 단일 슬라이스로 끝에서 끝까지 동작 (목록 조회 → 표시 → 페이지 이동)
- [x] 수평 분해 아님 — API/상태/UI가 한 이슈 안에서 완결
- [x] Out of Scope(상세·무한스크롤·admin·빈상태 외 상태)가 이슈에 섞이지 않음
- [x] 의존성 없음 (상세는 후속 작업)
