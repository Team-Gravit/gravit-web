---
id: 'MIG-046'
planned: '2026-09-26'
mode: 'migrate'
---

# MIG-046 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: migrate` — legacy-web 에 있는 개념노트 화면(`learning/$chapterId/$unitId/concept-note`)을 옮긴다.
시안 대조에서 「고침」 판정을 받은 외형·상태 변경을 함께 반영한다 (`spec.md` 판정 요약).

### 0-1. 착수 전 필수 게이트

| #   | 질문                | 답                                                                                             | 근거                          |
| --- | ------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------- |
| 1   | 목표와 비목표       | 개념노트를 읽을 수 있게 한다. 학습 문제 md 적용 · 북마크/오답노트는 하지 않는다                | `spec.md` 범위 · Out of Scope |
| 2   | 반복 비용·확장 차단 | 유닛 상세의 「개념노트」 카드가 빈 화면으로 간다. 마크다운 렌더러가 없어 학습 문제도 막혀 있다 | 빈 라우트 (MIG-030)           |
| 3   | 기준선              | 동작 16항목 · 계약 K1~K4 · 콘텐츠 문법 전수(E)                                                 | `spec.md` 현행 동작 기준선    |
| 4   | 검증 방법           | 자동 AC-1~11 · AC-14 · 수동 AC-12·13·15                                                        | `spec.md` 검증 기준           |
| 5   | 독립 완료 가능      | 아래 체크리스트 단계마다 테스트로 닫힌다. 학습 문제 적용은 분리                                | §4                            |
| 6   | 위험 격리           | 인증 무관(기존 게이트 안). 생성물 수정 없음. 라우트 트리는 재생성만. 원시 HTML 은 허용 목록    | §5                            |

### 0-2. 자동 보류 신호

| 신호                       | 해당   | 근거                                                                  |
| -------------------------- | ------ | --------------------------------------------------------------------- |
| 동작 변경과 구조 변경 혼재 | 아니오 | 동작 변경은 모두 시안 대조 판정(고침)을 거친 것이다                   |
| 한 단위로 완료·검증 불가   | 아니오 | §4 단계별 검증                                                        |
| 생성물 직접 수정 필요      | 아니오 | orval 함수를 감싸기만 한다 (§5 R1)                                    |
| 원인 모를 기존 검증 실패   | 아니오 | develop `a21504b` 에서 lint·type·test·build 통과 (FIX-045 는 관찰 중) |
| 범위 밖 문제 발견          | 아니오 | —                                                                     |

## 1. 기술 결정

### 1-1. 마크다운 렌더러 — **react-markdown + remark-gfm + 허용 목록 HTML** (권장)

노트가 쓰는 원시 HTML 은 `<br>` 과 `<img src width alt>` 두 가지뿐이다 (`spec.md` E). 일반 HTML 파서를
싣지 않고 이 둘만 허용 목록으로 변환한다. 나머지 HTML 은 렌더링하지 않는다 — react-markdown 의 기본
동작이라 **정화 대상이 애초에 DOM 에 들어오지 않는다.**

번들은 esbuild 로 react 를 외부로 두고 측정했다 (min+gzip, 2026-09-26).

| 안                                                      | 크기  | 원시 HTML                | 스타일링                                    | 판단                                                                        |
| ------------------------------------------------------- | ----- | ------------------------ | ------------------------------------------- | --------------------------------------------------------------------------- |
| **A. react-markdown + remark-gfm + 허용 목록 플러그인** | 48KB  | `<br>` · `<img>` 만 변환 | 요소별 `components` 에 토큰 클래스          | **권장**                                                                    |
| B. A + rehype-raw + rehype-sanitize (legacy 구성)       | 103KB | 전부 파싱 후 정화        | 같음                                        | rehype-raw(parse5)가 크기의 절반. 쓰는 태그 2개를 위해 과함                 |
| C. marked + DOMPurify                                   | 25KB  | 전부 통과 후 정화        | `dangerouslySetInnerHTML` + 하위 선택자 CSS | 가장 작다. React 트리가 아니라 학습 문제에서 요소를 컴포넌트로 바꿀 수 없다 |
| D. markdown-it + DOMPurify                              | 51KB  | 같음                     | C 와 같음                                   | C 대비 이점 없음                                                            |

**A 를 고르는 이유** — ① 정화에 기대지 않고 **허용한 것만 만든다** ② 표·코드·인용을 우리 토큰 클래스로
직접 그린다 (typography 플러그인 불필요) ③ 학습 문제에서 요소를 컴포넌트로 바꿔 끼울 여지가 있다.
**단점** — C 보다 23KB 크다. 라우트 청크 분할(`autoCodeSplitting`)로 개념노트·학습 화면에서만 받는다.
허용 목록 밖 HTML 이 노트에 새로 생기면 **조용히 빠진다** — 테스트로 현재 목록을 고정하고, 추가는 명시적으로 한다.

`<img>` 허용 규칙: `src` 는 `https:` 만 · `width` 는 `%` 또는 숫자 · `alt` 는 문자열. 그 외 속성은 버린다.

### 1-2. 모바일 페이지 — 앱 셸 하단 탭 숨김 (최종 결정)

모든 화면 폭에서 같은 페이지를 사용한다. 모바일에서는 `PageTitleBar`의 닫기 링크를 제공하고,
라우트 `staticData`로 앱 셸 하단 탭과 예약 여백을 숨긴다.

### 1-3. 라우트 구성 — 페이지 직접 연결

개념노트 라우트는 `ConceptNotePage`에 `unitId`만 전달한다. 앱 셸은 자식 라우트의
`hideBottomTabBar` 정적 메타를 읽어 모바일 하단 탭과 콘텐츠 여백을 함께 숨긴다.

### 1-4. 응답 형식 — `Blob` → 문자열

orval 생성 함수 `getNoteByUnitId` 는 `responseType: 'blob'` 으로 `Blob` 을 준다. 생성물을 고치지 않고
`entities` 훅의 `queryFn` 에서 **생성 함수 + 생성 queryKey** 로 부른 뒤 `blob.text()` 로 바꾼다.
jsdom·MSW 에서 `Blob` 응답이 동작하는지 **구현 첫 단계에서 확인**한다 (§5 R1).

## 2. 영향 분석

| 구분   | 파일                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------- |
| 신규   | `shared/ui/markdown/` — `markdown.tsx` · `allowed-html.ts` · 테스트 · 스토리 · `index.ts`             |
| 신규   | `entities/concept-note/` — `api/use-concept-note.ts` · `model/concept-note.ts`(+테스트) · `index.ts`  |
| 신규   | `pages/concept-note/` — `ui/concept-note-page.tsx` · `ui/concept-note-content.tsx` · `index.ts`       |
| 수정   | `app/routes/_authenticated/_app-shell/learning.units.$unitId.concept-note.tsx` — 빈 컴포넌트 → 어댑터 |
| 수정   | `apps/web/package.json` — `react-markdown` 추가, `remark-gfm` 을 `devDependencies` → `dependencies`   |
| 재생성 | `app/routeTree.gen.ts` (라우트 파일 내용만 바뀌므로 변화가 없을 수 있다)                              |
| 문서   | `docs/migration-status.md` · `docs/implementation-status.md` (완료 시)                                |

신규 파일이 10개를 넘지만 **한 화면 + 공용 모듈 2개**의 수직 단위라 `refactor-planner` 로 쪼개지 않는다.
공용 모듈을 먼저 만들고 화면이 조립만 한다.

### 2-1. 이전 매핑

| 현재 위치 (legacy)                                   | 목표 위치                                                            | 변경 종류                 | import 영향 |
| ---------------------------------------------------- | -------------------------------------------------------------------- | ------------------------- | ----------- |
| `pages/…/$chapterId/$unitId/concept-note.tsx` (화면) | `pages/concept-note/ui/*`                                            | 재작성                    | 없음        |
| `pages/…/concept-note.tsx` (라우트)                  | `app/routes/…/learning.units.$unitId.concept-note.tsx`               | 경로 변경 (`LRN-04` 확정) | 없음        |
| `shared/ui/studynote/studynote.tsx`                  | `shared/ui/markdown` + `pages/concept-note/ui/concept-note-body.tsx` | 분리                      | 없음        |
| `shared/ui/banner/Banner2.tsx`                       | (삭제 — 시안 W1)                                                     | 대체 안 함                | 없음        |
| `entities/cs-notes/api/useNote.ts`                   | `entities/concept-note/api/use-concept-note.ts`                      | 대체 경로 사용            | 없음        |
| `useFetchChapterWithUnits` (배너용)                  | `entities/learning` `useUnitLessons` (기존)                          | 재사용                    | 없음        |
| `utilities.css` `.prose` 재정의                      | `shared/ui/markdown` 요소별 토큰 클래스                              | 재작성                    | 없음        |

## 3. 의존 관계 검증

```
app/routes (어댑터)
  ├─ pages/concept-note ─┬─ entities/concept-note ─ shared/api/generated
  │                      ├─ entities/learning (useUnitLessons · 머리 정보)
  │                      └─ shared/ui/{markdown, card, skeleton, layout}
  └─ widgets/page-title-bar (모바일 닫기)
```

상향 · cross-slice 없음. `pages/concept-note` 가 유닛 상세 머리를 그리려면 `pages/unit-detail` 의 머리와
같은 것이 필요하다 — **이미 `shared/ui/page-heading` · `widgets/page-title-bar` 로 공용화돼 있으면 재사용**,
아니면 구현 중 중복을 확인하고 승격 여부를 보고한다 (추측으로 옮기지 않는다).

## 4. 구현 계획 체크리스트

- [ ] `[repo]` 의존성 — `react-markdown` 추가, `remark-gfm` 을 런타임 의존성으로 이동. `pnpm install`
- [ ] `[entities]` **먼저 확인** — MSW 로 `text/markdown` 을 준 `getNoteByUnitId` 가 jsdom 에서 `Blob` → 문자열로 읽히는지 (실패 시 §5 R1 대안)
- [ ] `[shared]` `markdown` — 허용 목록 HTML 변환 · 요소별 토큰 스타일. AC-4 · AC-5 테스트
- [ ] `[entities]` `concept-note` — `useConceptNote(unitId)` · `toConceptNote(markdown)` → `{ title?, body }`. AC-2 · AC-3 테스트
- [ ] `[pages]` `concept-note` — 반응형 페이지 · 모바일 닫기 상단바 · 로딩/실패/빈 본문. AC-6~11 테스트
- [ ] `[app]` 라우트 연결 — 페이지에 `unitId` 전달 · 모바일 하단 탭 숨김. AC-1 · AC-7~9 테스트
- [ ] `[app]` **라우트 트리 재생성** (`pnpm --filter @repo/web build` 또는 dev) 후 타입 검사
- [ ] `[shared]` Storybook — `Markdown` 노트 원본 문법 예시
- [ ] 수동 AC-12 · AC-13 · AC-15 — 사용자 확인 필요

## 5. 리스크

| #   | 리스크                                     | 영향                                 | 대응                                                                                                                            |
| --- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| R1  | jsdom·MSW 에서 `Blob` 응답이 읽히지 않는다 | 테스트 불가                          | 첫 단계에서 확인. 안 되면 `request: { responseType: 'text' }` 로 생성 함수를 호출하고 반환 타입을 좁히는 어댑터 1곳에 사유 주석 |
| R2  | WebView 하드웨어 뒤로가기                  | 웹 닫기 링크와 다르게 동작할 수 있다 | AC-13 실기기 확인                                                                                                               |
| R5  | 허용 목록 밖 HTML 이 노트에 추가된다       | 해당 요소가 조용히 빠진다            | 테스트로 현재 목록 고정. 노트 원본 규칙(`CLAUDE.md` §7) 변경 시 함께 갱신                                                       |
| R6  | 긴 표·코드의 가로 넘침                     | 카드 폭을 밀어낸다                   | 표·`pre` 를 가로 스크롤 컨테이너로 감싼다                                                                                       |

**동일성 확인**

| 방법        | 대상                                                                |
| ----------- | ------------------------------------------------------------------- |
| 자동 테스트 | AC-1~11 · AC-14 (진입 · 반응형 페이지 · 문법 · 정화 · 상태)         |
| 수동 스모크 | AC-12 — `data-structure` unit01 · `algorithm` unit04 를 두 화면에서 |
| 실기기      | AC-13 — Android WebView 에서 닫기 · 하드웨어 뒤로가기               |

## 6. 완료 후 액션

- `docs/migration-status.md` 학습 개념노트 행 갱신
- `docs/implementation-status.md` `LRN-04` 행 갱신
- `spec.md` 빈 노트 문구 확정 반영
- 학습 문제 본문 마크다운 적용을 새 작업으로 등록 (`FEAT-` 또는 `FIX-`, 번호는 그때 확정)
