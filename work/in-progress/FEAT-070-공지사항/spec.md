---
id: 'FEAT-070'
title: '공지사항 목록 페이지'
type: 'feature'
screen: 'settings/notice'
priority: 'medium'
created: '2026-10-26'
revised: '2026-10-26'
---

# FEAT-070 — 공지사항 페이지 (목록 + 상세)

## 배경 · 목표

설정 하위 공지사항 **목록 + 상세** 화면을 신규 구현한다. legacy는 참고하지 않고 Figma 시안을
기준으로 만든다. 데이터는 orval `notice-query-api`를 쓰고, 기존 `inquiry` 패턴을 따른다.

## 범위

### 1) 목록 `/settings/notice` (완료)

- `entities/notice` — 조회 훅(`useGetNoticeSummaries` 래핑) + 목록 아이템 + 스켈레톤
- `pages/notice` — 헤더/타이틀 + 목록 + 페이지네이션. `settings/notice` 라우트 교체(`?page` URL search 소유)
- 데스크톱·모바일 **모두 페이지네이션**(`shared/ui/pagination` 재사용)
- 로딩 **300ms 이상**이면 스켈레톤, **레이아웃 시프트 0** / 빈 상태 문구

### 2) 상세 `/settings/notice/$noticeId` (이번 확장)

- `entities/notice`에 `useNoticeDetail(id)`(= `useGetNoticeSummary` 래핑) 추가
- `pages/notice-detail` — 데스크톱 breadcrumb 3단 + 카드(제목·날짜·divider·본문) + 「목록으로」(데스크톱)
- **본문은 Markdown** — 공유 `<Markdown>` 사용("요약"·"공지 내용 헤딩"은 `content` 안의 헤딩)
- 목록 아이템 → 상세 라우트 Link 연결

### 3) 공통

- **데스크톱 Footer**(`widgets/footer`)를 목록·상세 하단에 추가 (현재 누락)

## Out of Scope

- **이전/이후 공지 네비게이션** — 상세 API에 prev/next 데이터가 없어 이번엔 생략(백엔드 지원 시 추가)
- 무한 스크롤 — 데스크톱·모바일 모두 페이지네이션으로 확정(아래 ADR)
- 공지 작성/관리(admin) — `sendNotice` 등 쓰기 API는 대상 아님
- 핀 고정 정렬 로직 — 정렬·핀 순서는 서버 응답(`contents`) 순서를 그대로 신뢰
- 모바일 상세의 「목록으로」 버튼 — 시안상 데스크톱만(모바일은 back-header로 복귀)

## 용어 정의 (Ubiquitous Language)

| 용어        | 정의                                                                                   |
| ----------- | -------------------------------------------------------------------------------------- |
| 공지 요약   | `NoticeSummaryResponse` = `{ id, title, summary, pinned, publishedAt }`                |
| 핀 공지     | `pinned === true` 항목. 아이템 앞에 핀 아이콘 표시                                     |
| 공지 페이지 | `NoticeSummaryPageResponse` = `{ page, totalPages, hasNext, totalElements, contents }` |
| 현재 페이지 | URL search param `page`(1-based). 서버 `page`와 동일 체계                              |

---

## 기술 결정 (ADR)

### 목록 페이징 방식 — 데스크톱·모바일 모두 페이지네이션

**Context** — 서버는 페이지 기반 응답(`/api/v1/notice/summaries/{page}` → `totalPages`·`hasNext`)을
준다. 데스크톱은 페이지네이션이 확정. 모바일은 Figma 프레임(27164)도 페이지네이션을 그리고 있고,
동일 성격의 기존 화면(`pages/inquiry`, MIG-043)도 **"무한스크롤 대신 페이지네이션, 페이지는 URL
search 소유"**로 이미 구현돼 있다.

**Decision** — 데스크톱·모바일 **모두 페이지네이션**. `shared/ui/pagination`(반응형: 좁은 화면은
아이콘 edge + sibling 축소)을 그대로 쓰고, 페이지 상태는 라우트 search(`?page=N`)가 소유한다.
inquiry 페이지와 같은 구조를 따른다.

**Alternatives**

| 안                  | 내용                          | 거부 이유                                                                        |
| ------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| 모바일 무한스크롤   | `useInfiniteQuery` + sentinel | Figma 모바일 프레임·기존 inquiry 컨벤션과 어긋남. 사용자가 페이지네이션으로 확정 |
| 페이지 상태 Zustand | 전역 스토어로 page 관리       | URL로 표현 가능한 상태(뒤로가기·공유·새로고침 복원) → search가 정답              |

**Consequences**

- 장점: 기존 `Pagination`·inquiry 패턴 1:1 재사용, 새 의존성·관찰자 없음, URL로 상태 복원.
- 단점: 모바일에서 "더 보기" 스크롤 연속성은 없음(페이지 이동식). 시안이 그러하므로 수용.
- 페이지 이동 시 스크롤 복귀는 라우트 search 변경에 따르며 settings 셸의 스크롤 소유 영역 기준으로 동작한다.

---

## 시안 대조 결과 (design-diff, Figma)

파일 `hu4c6qCEMB62qHXk2v8Gsl`

- 데스크톱: 목록 전체 `15350-26482` / 헤더 `26485` / 리스트 `26494` / 아이템 `26504` / 핀 아이템 `26501`
- 모바일: 페이지 `15350-27164` / 리스트 `27165` / 아이템 `27168` / 핀 아이템 `27166`

| #   | 항목            | 시안                                                                  | 구현 방침                                                       |
| --- | --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | 아이템          | 핀아이콘(핀 공지만) + 제목 1줄 + 날짜(회색) + 우측 chevron            | `NoticeListItem` 1종 + `pinned` 분기. 데스크톱·모바일 동일 구조 |
| 2   | 리스트 컨테이너 | 흰 라운드 카드, 아이템 사이 divider                                   | 카드 + 항목 구분선                                              |
| 3   | 데스크톱 헤더   | breadcrumb "설정 > 공지사항" + 타이틀 "공지사항"                      | **확인 필요**: breadcrumb 컴포넌트 유무                         |
| 4   | 모바일 헤더     | 상단 back-header (settings 셸은 데스크톱 헤더만 주므로 페이지가 담당) | `PageTitleBar title="공지사항"`                                 |
| 5   | 페이지네이션    | `< 이전 [1] 2 … 99 다음 >`(데스크톱) / `< [1] 2 … 99 >`(모바일)       | `shared/ui/pagination` 재사용                                   |
| 6   | 핀 아이콘       | 보라색 핀 (`pin-fill.svg` 이미 추가돼 있음)                           | 아이콘 생성 후 `Icon name="pin-fill"`                           |

### 확인 필요

- **빈 상태**(공지 0건) · **에러 상태**: Figma에 프레임 없음 → 아래 명세의 기본안 제안, 승인 필요
- **아이템 클릭 목적지**: 상세는 다음 작업이나, 이번에 아이템을 `/settings/notice/$id` 링크로 미리 연결할지(라우트는 다음 작업) 또는 비활성으로 둘지
- 데스크톱 breadcrumb "설정 > 공지사항" 정확 토큰/컴포넌트 (구현 시 헤더 노드 26485 대조)
- 아이템/리스트 정확 수치(높이·padding·divider·타이포)는 구현 시 각 노드에서 추출 — 스켈레톤 무시프트 대조에 사용

---

## 확정 명세 · 검증 기준

- [ ] **AC-1** (범위: 통합) 목록 표시
      Given `contents: [{id:1,title:'점검 안내',pinned:true,publishedAt:'2026-01-02'}, {id:2,title:'업데이트',pinned:false,...}]`
      When 페이지를 렌더하면
      Then 2개 아이템이 보이고, 첫 아이템에 핀 아이콘이 있고 둘째엔 없다

- [ ] **AC-2** (범위: 통합) 페이지 이동
      Given `totalPages: 3`, 현재 `?page=1`
      When 페이지네이션에서 `2`를 누르면
      Then URL search가 `?page=2`가 되고 2페이지 데이터를 조회한다

- [ ] **AC-3** (범위: 통합) 로딩 스켈레톤(지연·무시프트)
      Given 목록 조회가 300ms 이상 지연
      When 로딩 중이면
      Then 스켈레톤 아이템이 보이고, 데이터 도착 시 컨테이너 높이 변화(레이아웃 시프트)가 없다

- [ ] **AC-4** (범위: 통합) 한 페이지면 페이지네이션 숨김
      Given `totalPages: 1`
      When 렌더하면
      Then 페이지네이션이 렌더되지 않는다 (`Pagination` 기존 동작)

---

## Changelog

| 날짜       | 요약                                                                                           | 사유                                           | 연관 항목 |
| ---------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------- |
| 2026-10-26 | 요구사항·ADR(페이지네이션 both) 확정                                                           | 신규 기능 착수                                 | FEAT-070  |
| 2026-10-26 | 상세 페이지 + 데스크톱 Footer로 범위 확장 (목록→상세 링크, 본문 Markdown, 이전/이후 네비 생략) | 상세 작업 착수. 브랜치/이슈/폴더 notice로 확장 | #336      |
